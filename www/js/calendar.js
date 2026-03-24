function CalendarPage({T,state,update,todayStr,todayDayStartMs}){
  useTick(1000, state.timerRunning);
  const todayDayEndMs=todayDayStartMs+86400000;
  const todaySavedMs=(state.timerSessions||[]).filter(s=>sessInDay(s,todayDayStartMs,todayStr)).reduce((a,s)=>a+s.ms,0);
  const runningMs=state.timerRunning?state.timerElapsed+(Date.now()-(state.timerStart||Date.now())):state.timerElapsed;

  const today = new Date();
  const [vy,setVy] = useState(today.getFullYear());
  const [vm,setVm] = useState(today.getMonth());
  const [sel,setSel] = useState(todayStr);
  const [showAddModal,setShowAddModal] = useState(false);
  const [apptForm,setApptForm] = useState({date:todayStr,time:"",title:"",note:""});
  const [editLogDay,setEditLogDay] = useState(null);
  const [editLogVal,setEditLogVal] = useState("22:00");
  // セッション追加フォーム
  const [addBreakdownDay,setAddBreakdownDay] = useState(null);
  const [addBreakdownReason,setAddBreakdownReason] = useState("");
  const [addBreakdownDur,setAddBreakdownDur] = useState("00:30");
  const [addBreakdownComment,setAddBreakdownComment] = useState("");
  const [addBreakdownTimeFrom,setAddBreakdownTimeFrom] = useState("");
  const [addBreakdownTimeTo,setAddBreakdownTimeTo] = useState("");
  // インライン編集
  const [inlineEditSessId,setInlineEditSessId] = useState(null);
  const calBlurTimerRef=useRef(null);
  const [inlineEditVal,setInlineEditVal] = useState("00:00");
  const [inlineEditComment,setInlineEditComment] = useState("");
  const [inlineEditRangeFrom,setInlineEditRangeFrom] = useState("");
  const [inlineEditRangeTo,setInlineEditRangeTo] = useState("");
  const [inlineEditField,setInlineEditField] = useState(null);
  // 削除確認
  const [confirmDeleteId,setConfirmDeleteId] = useState(null);

  const ws = state.settings?.calendarWeekStart ?? 0;
  const DOW = ws===0 ? ["日","月","火","水","木","金","土"] : ["月","火","水","木","金","土","日"];

  const firstDow = ((new Date(vy,vm,1).getDay() - ws + 7) % 7);
  const lastDate = new Date(vy,vm+1,0).getDate();

  const cells = [];
  for(let i=0;i<firstDow;i++) cells.push(null);
  for(let d=1;d<=lastDate;d++) cells.push(new Date(vy,vm,d));

  const apptMap = {};
  (state.appointments||[]).forEach(a=>{ (apptMap[a.date]=apptMap[a.date]||[]).push(a); });
  const photoMap = {};
  (state.photos||[]).forEach(p=>{ photoMap[p.date]=true; });
  const targetSecs = (state.targetWearHours||22)*3600;
  // effectiveWearLog: 今日分はタイマーから自動計算して連動
  const wearLog = (() => {
    const log = {...(state.dailyWearLog||{})};
    const todayDayEndMs = todayDayStartMs+86400000;
    const todaySavedMs=(state.timerSessions||[]).filter(s=>sessInDay(s,todayDayStartMs,todayStr)).reduce((a,s)=>a+s.ms,0);
    const runningMs=state.timerRunning?state.timerElapsed+(Date.now()-(state.timerStart||Date.now())):state.timerElapsed;
    const totalRemovedSec=Math.floor((todaySavedMs+runningMs)/1000);
    const secondsIntoDay=Math.max(0,Math.floor((Date.now()-todayDayStartMs)/1000));
    log[todayStr] = Math.max(0, secondsIntoDay - totalRemovedSec);
    // 過去日で記録がない日は24時間装着とみなす（開始日以降のみ）
    if(state.startDate){
      const startMs=new Date(state.startDate+"T00:00:00").getTime();
      const todayMs=new Date(todayStr+"T00:00:00").getTime();
      for(let ms=startMs;ms<todayMs;ms+=86400000){
        const ds=dsFromDate(new Date(ms));
        if(log[ds]===undefined) log[ds]=86400;
      }
    }
    return log;
  })();

  // 全交換日のセットを作成
  const allExchangeDates = new Set();
  const list = buildPieceList(state);
  list.forEach(p => {
    const ex = getExchangeDate(state, p.n);
    if(ex) allExchangeDates.add(dsFromDate(ex));
  });

  const prevMonth = () => { if(vm===0){setVy(y=>y-1);setVm(11);}else setVm(m=>m-1); };
  const nextMonth = () => { if(vm===11){setVy(y=>y+1);setVm(0);}else setVm(m=>m+1); };

  const selDateObj = sel ? new Date(sel+"T00:00:00") : null;
  const selLabel = selDateObj ? selDateObj.toLocaleDateString("ja-JP",{year:"numeric",month:"long",day:"numeric",weekday:"short"}) : "";

  const selEvents = [];
  if(sel){
    const exLabel = getExPieceLabel(state,sel);
    if(exLabel) selEvents.push({type:"ex",label: sel===state.startDate ? `マウスピース開始 1日目` : `マウスピース交換 (${exLabel}枚目)`,color:T.accent,id:null});
    (apptMap[sel]||[]).forEach(a=>selEvents.push({type:"appt",label:`${a.title||"歯科受診"}${a.time?" "+a.time:""}`,title:a.title||"歯科受診",time:a.time||"",color:T.primary,id:a.id}));
  }

  const deleteEvent = ev => {
    if(ev.type==="appt") update({appointments:(state.appointments||[]).filter(x=>x.id!==ev.id)});
  };

  const addEvent = () => {
    if(!apptForm.date||!apptForm.title?.trim()) return;
    update({appointments:[...(state.appointments||[]),{id:Date.now(),date:apptForm.date,time:apptForm.time,title:apptForm.title,note:apptForm.note}].sort((a,b)=>a.date.localeCompare(b.date))});
    setShowAddModal(false);
  };

  return(
    <div style={{background:T.bg}}>
      {/* Month nav */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px 6px",background:T.card,borderBottom:`1px solid ${T.soft}`}}>
        <button className="btn bs bsm" style={{fontSize:16,padding:"4px 14px"}} onClick={prevMonth}>‹</button>
        <span style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontWeight:700,fontSize:17,color:T.primary}}>{vy}年 {vm+1}月</span>
        <button className="btn bs bsm" style={{fontSize:16,padding:"4px 14px"}} onClick={nextMonth}>›</button>
      </div>

      <div style={{background:T.card,padding:"0 6px 6px"}}>
        {/* DOW header */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",paddingTop:6,paddingBottom:4}}>
          {DOW.map((d,i)=>{
            const isSun = (ws===0&&i===0)||(ws===1&&i===6);
            const isSat = (ws===0&&i===6)||(ws===1&&i===5);
            return(
              <div key={d} style={{textAlign:"center",fontSize:12,fontWeight:600,color:isSun?"#DC2626":isSat?"#2563EB":T.text+"66"}}>{d}</div>
            );
          })}
        </div>

        {/* Calendar grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1}}>
          {cells.map((d,i)=>{
            if(!d) return <div key={"e"+i} style={{minHeight:44}}/>;
            const ds = dsFromDate(d);
            const isToday = ds===todayStr;
            const isPast = ds<todayStr;
            const isSel = ds===sel;
            const isEx = allExchangeDates.has(ds);
            const wearSecs = wearLog[ds];
            const achieved = wearSecs!==undefined && wearSecs>=targetSecs;
            const failed = wearSecs!==undefined && wearSecs<targetSecs && isPast;
            const appts = apptMap[ds]||[];
            const hasCam = photoMap[ds];
            const dow = d.getDay();
            const isSun2 = ws===0?dow===0:dow===1;
            const isSat2 = ws===0?dow===6:dow===0;
            let numBg="transparent",numColor=isPast?(T.text+"66"):isSun2?"#DC2626":isSat2?"#2563EB":T.text,numFw=400;
            if(isSel){ numBg=T.primary; numColor="#fff"; numFw=700; }
            else if(isToday){ numBg=T.soft; numColor=T.primary; numFw=700; }
            else if(achieved){ numBg=`${T.primary}22`; }
            else if(failed){ numBg="rgba(220,38,38,0.12)"; }
            return(
              <div key={ds} onClick={()=>setSel(ds)}
                style={{display:"flex",flexDirection:"column",alignItems:"center",cursor:"pointer",borderRadius:5,padding:"2px 1px",minHeight:44}}>
                {/* 日付: 交換日は四角で囲む */}
                <div style={{
                  width:30,height:30,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:15,fontWeight:numFw,
                  background:numBg,color:numColor,
                  border: isEx&&!isSel ? `2px solid ${T.accent}` : "2px solid transparent",
                  borderRadius: isEx&&!isSel ? "4px" : "4px",
                  flexShrink:0
                }}>
                  {d.getDate()}
                </div>
                <div style={{display:"flex",gap:1,marginTop:1,flexWrap:"wrap",justifyContent:"center",maxWidth:34}}>
                  {hasCam&&<span style={{display:"flex"}}>{Icons.camera(isSel?"rgba(255,255,255,0.9)":T.accent,7)}</span>}
                  {appts.slice(0,1).map((a,j)=>(
                    <div key={j} style={{fontSize:12,background:isSel?"rgba(255,255,255,0.25)":T.primary+"22",color:isSel?"#fff":T.primary,borderRadius:2,padding:"0 2px",lineHeight:"11px",maxWidth:32,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.title}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{display:"flex",gap:10,flexWrap:"wrap",paddingTop:6,borderTop:`1px solid ${T.soft}`,marginTop:4}}>
          <span style={{fontSize:11,display:"flex",alignItems:"center",gap:3,color:T.text+"77"}}><span style={{width:10,height:10,borderRadius:2,background:`${T.primary}22`,border:`1.5px solid ${T.primary}`,display:"inline-block"}}/>達成</span>
          <span style={{fontSize:11,display:"flex",alignItems:"center",gap:3,color:T.text+"77"}}><span style={{width:10,height:10,borderRadius:2,background:"rgba(220,38,38,0.12)",border:"1.5px solid #DC2626",display:"inline-block"}}/>未達</span>
          <span style={{fontSize:11,display:"flex",alignItems:"center",gap:3,color:T.text+"77"}}><span style={{width:10,height:10,borderRadius:"2px",border:`2px solid ${T.accent}`,display:"inline-block"}}/>交換日</span>
        </div>
      </div>

      {/* Detail panel */}
      <div style={{background:T.card,borderTop:`2px solid ${T.soft}`,padding:"12px 14px 14px",marginTop:4}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:15,fontWeight:700,color:T.text}}>{selLabel}</div>
          <button className="btn bp bsm" onClick={()=>{setApptForm({date:sel||todayStr,time:"",title:"",note:""});setShowAddModal(true);}}>＋ 予定追加</button>
        </div>

        {sel&&(()=>{
          const totalEndDate=getTotalEndDate(state);
          const totalEndDs=totalEndDate?dsFromDate(totalEndDate):null;
          // 治療終了後
          if(sel>todayStr) return null;
          return (()=>{
          const dayMs=sel===todayStr ? todayDayStartMs : new Date(sel+"T00:00:00").getTime();
          // startがないセッション（手動追加）もselの日付として含める
          const selSessions=(state.timerSessions||[]).filter(s=>
            s.start>=dayMs&&s.start<dayMs+86400000 || (!s.start&&s.day===sel)
          );
          const isToday=sel===todayStr;
          const hasLog=isToday?true:(wearLog[sel]!==undefined);
          // 今日はリアルタイム実績値、過去日はwearLog
          const wearSec=isToday
            ? Math.max(0,Math.floor((Date.now()-new Date(sel+"T00:00:00").getTime())/1000)-Math.floor((todaySavedMs+runningMs)/1000))
            : (wearLog[sel]||0);
          const isClosed   = editLogDay!==sel && editLogDay!==sel+"_wear";
          const isExpanded = editLogDay===sel || editLogDay===sel+"_wear";
          const isWearEdit = editLogDay===sel+"_wear";
          const isAdding   = addBreakdownDay===sel;
          const parseHHMM=str=>{const p=(str||"").split(":");return Math.min(86400,Math.max(0,(parseInt(p[0])||0)*3600+(parseInt(p[1])||0)*60));};
          const toHHMM=sec=>`${String(Math.floor(sec/3600)).padStart(2,"0")}:${String(Math.floor((sec%3600)/60)).padStart(2,"0")}`;
          const fmtTs=ts=>{const d=new Date(ts);return`${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;};
          const accentThemes=["atrium","navyrose","deepteal","elegan","ashviolet","blushhemp"];
              const failColor=accentThemes.includes(state.themeName)
                ?(state.themeName==="atrium"?"#5A452C":T.soft)
                :"#E88080";
              const wearColor=hasLog?(wearSec>=targetSecs?T.primary:failColor):T.text+"44";
          const ROW=38;

          // ── ヘルパー ──
          const saveWear=()=>{
            const log={...(state.dailyWearLog||{})};
            log[sel]=parseHHMM(editLogVal);
            update({dailyWearLog:log});
            setEditLogDay(sel);
          };
          const saveSessField=(sid,field)=>{
            const orig=(state.timerSessions||[]).find(x=>x.id===sid);
            if(!orig)return;
            let patch={comment:inlineEditComment,noReason:false};

            if(field==="time"){
              const ms=parseHHMM(inlineEditVal)*1000;
              patch={...patch,ms,end:orig.start?(orig.start+ms):undefined};
            }
            if(field==="range"){
              if(inlineEditRangeFrom&&inlineEditRangeTo){
                const [fh,fm]=inlineEditRangeFrom.split(":").map(Number);
                const [th,tm]=inlineEditRangeTo.split(":").map(Number);
                const newStart=dayMs+fh*3600000+fm*60000;
                const newEnd=dayMs+th*3600000+tm*60000;
                const ms=Math.max(60000,newEnd-newStart);
                patch={...patch,start:newStart,end:newEnd,ms};
                // 経過時間も同期
              } else if(!inlineEditRangeFrom&&!inlineEditRangeTo){
                // 両方空なら range削除
                patch={...patch,start:undefined,end:undefined};
              }
              // 片方だけ入力中は保存しない
              else return;
            }
            if(field==="all"){
              // 行外フォーカス時：範囲優先、なければ手入力時間
              if(inlineEditRangeFrom&&inlineEditRangeTo){
                const [fh,fm]=inlineEditRangeFrom.split(":").map(Number);
                const [th,tm]=inlineEditRangeTo.split(":").map(Number);
                const newStart=dayMs+fh*3600000+fm*60000;
                const newEnd=dayMs+th*3600000+tm*60000;
                const ms=Math.max(60000,newEnd-newStart);
                patch={...patch,start:newStart,end:newEnd,ms};
              } else {
                const ms=parseHHMM(inlineEditVal)*1000;
                patch={...patch,ms,end:orig.start?(orig.start+ms):undefined};
                if(!inlineEditRangeFrom&&!inlineEditRangeTo){
                  patch={...patch,start:undefined,end:undefined};
                }
              }
            }

            const newSess=(state.timerSessions||[]).map(x=>x.id===sid?{...x,...patch}:x);
            const newRem=newSess.filter(x=>
              (x.start>=dayMs&&x.start<dayMs+86400000)||(!x.start&&x.day===sel)
            ).reduce((a,x)=>a+x.ms,0);
            const dl={...(state.dailyWearLog||{})};
            dl[sel]=Math.max(0,86400-Math.floor(newRem/1000));
            update({timerSessions:newSess,dailyWearLog:dl});
          };
          const saveSess=(sid)=>{
            saveSessField(sid,"all");
            setInlineEditSessId(null);
            setInlineEditField(null);
          };
          const deleteSess=(sid)=>{
            const newSess=(state.timerSessions||[]).filter(x=>x.id!==sid);
            const newRem=newSess.filter(x=>
              (x.start>=dayMs&&x.start<dayMs+86400000)||(!x.start&&x.day===sel)
            ).reduce((a,x)=>a+x.ms,0);
            const dl={...(state.dailyWearLog||{})};
            dl[sel]=Math.max(0,86400-Math.floor(newRem/1000));
            update({timerSessions:newSess,dailyWearLog:dl});
            setConfirmDeleteId(null);
          };

          // 時間入力の共通スタイル
          const timeInputSt=(active)=>({
            width:58,textAlign:"center",fontFamily:"'M PLUS Rounded 1c',sans-serif",
            fontSize:17,fontWeight:700,letterSpacing:2,
            border:"none",borderBottom:`2px solid ${active?T.primary:T.accent}`,
            outline:"none",background:"transparent",
            color:active?T.primary:T.accent,padding:"2px 0",
          });
          const checkBtn=(onClick)=>(
            <button onClick={onClick}
              style={{background:T.primary,border:"none",borderRadius:"50%",width:22,height:22,
                display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,color:"#fff",fontSize:14,fontWeight:700}}>
              ✓
            </button>
          );

          return(
            <div style={{borderRadius:10,marginBottom:8,overflow:'hidden'}}>

              {/* ── 装着時間ヘッダー行 ── */}
              <div style={{
                background:T.primary+'18',
                borderRadius:isExpanded?'10px 10px 0 0':'10px',
                display:'flex',alignItems:'center',height:ROW+4,padding:'0 12px',
                gap:8,userSelect:'none'}}>
                <span style={{fontSize:13,color:T.primary,fontWeight:700,flex:1,cursor:'pointer'}}
                  onClick={()=>{setEditLogDay(isExpanded?null:sel);setInlineEditSessId(null);setAddBreakdownDay(null);}}>
                  装着時間
                </span>
                {isWearEdit
                  ?<input type='text' inputMode='numeric' maxLength={5} autoComplete='off' autoCorrect='off' autoCapitalize='off' spellCheck={false} value={editLogVal}
                      autoFocus
                      onFocus={e=>e.target.select()}
                      onChange={e=>{let v=e.target.value.replace(/[^0-9:]/g,'');if(v.length===2&&!v.includes(':')&&editLogVal.length===1)v+=':';setEditLogVal(v);}}
                      onBlur={saveWear}
                      onKeyDown={e=>{if(e.key==='Enter')saveWear();if(e.key==='Escape')setEditLogDay(isExpanded?sel:null);}}
                      style={{width:52,textAlign:'right',fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:16,fontWeight:700,
                        border:'none',borderBottom:'2px solid '+T.primary,outline:'none',background:'transparent',
                        color:T.primary,letterSpacing:1,padding:'1px 0',borderRadius:0,flexShrink:0}}/>
                  :<span style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:16,fontWeight:700,color:wearColor,cursor:'text',flexShrink:0}}
                      onClick={e=>{e.stopPropagation();setEditLogDay(sel+'_wear');setEditLogVal(toHHMM(wearSec));}}>
                      {hasLog?toHHMM(wearSec):'--:--'}
                    </span>
                }
                <span style={{fontSize:14,color:T.primary+'66',marginLeft:4,cursor:'pointer',flexShrink:0}}
                  onClick={()=>{setEditLogDay(isExpanded?null:sel);setInlineEditSessId(null);setAddBreakdownDay(null);}}>
                  {isExpanded?'▲':'▼'}
                </span>
              </div>

              {isExpanded&&(
                <div style={{background:T.accent+'0d',borderRadius:'0 0 10px 10px',paddingBottom:4}}>

                  {selSessions.map(s=>{
                    const isEdit=inlineEditSessId===s.id;
                    const hasRange=s.start&&s.end&&s.end>s.start
                      &&!(fmtTs(s.start)==='00:00'&&fmtTs(s.end)==='00:00');
                    const rangeStr=hasRange?fmtTs(s.start)+'〜'+fmtTs(s.end):'';
                    const durStr=toHHMM(Math.floor(s.ms/1000));
                    const ib={border:'none',outline:'none',background:'transparent',borderRadius:0};

                    // フォーカスが行外に出たときだけ保存（行内移動はスキップ）
                    const onRowBlur=()=>{
                      calBlurTimerRef.current=setTimeout(()=>{
                        saveSessField(s.id,'all');
                        setInlineEditSessId(null);setInlineEditField(null);
                      },120);
                    };
                    const onRowFocus=()=>{if(calBlurTimerRef.current){clearTimeout(calBlurTimerRef.current);calBlurTimerRef.current=null;}};
                    const isReasonPick=inlineEditSessId===s.id&&inlineEditField==='reason';
                    const displayReason=(s.reason&&!s.noReason)?s.reason:null;
                    // 理由チップを即保存するヘルパー
                    const pickReason=(r)=>{
                      const newSess=(state.timerSessions||[]).map(x=>x.id===s.id?{...x,reason:r,noReason:!r}:x);
                      update({timerSessions:newSess});
                      setInlineEditField(null);
                    };
                    // 理由ラベルの共通スタイル
                    const reasonLabel=(active)=>({
                      fontSize:13,fontWeight:700,flexShrink:0,minWidth:52,whiteSpace:'nowrap',cursor:'pointer',
                      borderRadius:4,padding:'1px 6px',textAlign:'center',lineHeight:'16px',
                      color:active?T.primary:T.text+'33',
                      border:'1px dashed '+(active?T.primary+'66':T.text+'22'),
                    });

                    return(
                      <div key={s.id} style={{borderBottom:'1px solid '+T.text+'07'}}>
                        {/* ── 理由ピッカー（行の上に展開） ── */}
                        {isReasonPick&&(
                          <div style={{padding:'6px 10px',background:T.soft,display:'flex',flexWrap:'wrap',gap:4}}
                            onMouseDown={e=>e.preventDefault()}>
                            <button style={{border:'none',borderRadius:12,padding:'4px 8px',fontSize:13,fontWeight:600,cursor:'pointer',textAlign:'center',whiteSpace:'nowrap',flexShrink:0,fontFamily:"'M PLUS Rounded 1c',sans-serif",
                              background:!displayReason?T.primary:T.card+'cc',color:!displayReason?'#fff':T.text+'55'}}
                              onClick={()=>pickReason('')}>ー</button>
                            {getReasonList(state).map(r=>(
                              <button key={r} style={{border:'none',borderRadius:12,padding:'4px 8px',fontSize:13,fontWeight:600,cursor:'pointer',textAlign:'center',whiteSpace:'nowrap',flexShrink:0,fontFamily:"'M PLUS Rounded 1c',sans-serif",
                                background:displayReason===r?T.primary:T.card+'cc',color:displayReason===r?'#fff':T.text+'77'}}
                                onClick={()=>pickReason(r)}>{r}</button>
                            ))}
                          </div>
                        )}
                        {!isEdit?(
                          /* ── 通常表示行 ── */
                          <div style={{display:'flex',alignItems:'center',minHeight:ROW,padding:'0 10px',gap:4,cursor:'pointer'}}
                            onClick={()=>{
                              setInlineEditSessId(s.id);
                              setInlineEditVal(durStr);
                              setInlineEditComment(s.comment||'');
                              setInlineEditRangeFrom(hasRange?fmtTs(s.start):'');
                              setInlineEditRangeTo(hasRange?fmtTs(s.end):'');
                              setInlineEditField(null);
                              setConfirmDeleteId(null);
                            }}>
                            <span style={reasonLabel(!!displayReason)}
                              onClick={e=>{e.stopPropagation();setInlineEditSessId(s.id);setInlineEditField(isReasonPick?null:'reason');}}>
                              {displayReason||'ー'}
                            </span>
                            <span style={{flex:1,fontSize:12,color:T.text+'55',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',padding:'0 3px'}}>
                              {s.comment||''}
                            </span>
                            {rangeStr&&<span style={{fontSize:11,color:T.text+'44',flexShrink:0,marginLeft:4,whiteSpace:'nowrap'}}>{rangeStr}</span>}
                            <span style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:14,fontWeight:700,color:T.accent,flexShrink:0,minWidth:40,textAlign:'right',marginLeft:4}}>{durStr}</span>
                            <button style={{background:'none',border:'none',padding:'0 0 0 5px',cursor:'pointer',flexShrink:0}}
                              onClick={e=>{e.stopPropagation();setConfirmDeleteId(s.id);setInlineEditSessId(null);}}>
                              {Icons.trash(T.text+'33',10)}
                            </button>
                          </div>
                        ):(
                          /* ── 編集行：行外フォーカス移動で保存 ── */
                          <div style={{display:'flex',alignItems:'center',minHeight:ROW,padding:'0 10px',gap:4,background:T.card+'cc'}}>
                            <span style={reasonLabel(!!displayReason)}
                              onMouseDown={e=>{e.preventDefault();e.stopPropagation();setInlineEditField(isReasonPick?null:'reason');}}>
                              {displayReason||'ー'}
                            </span>
                            <input type='text' value={inlineEditComment}
                              onChange={e=>setInlineEditComment(e.target.value)}
                              onBlur={onRowBlur} onFocus={onRowFocus}
                              onKeyDown={e=>{if(e.key==='Enter')saveSessField(s.id,'comment');}}
                              placeholder='コメント'
                              autoFocus
                              onClick={e=>e.stopPropagation()}
                              style={{...ib,flex:1,fontSize:12,borderBottom:'1px solid '+T.text+'22',padding:'1px 3px',color:T.text,minWidth:0}}/>
                            <span style={{display:'flex',alignItems:'center',gap:1,flexShrink:0,marginLeft:4}}>
                              <input type='time' value={inlineEditRangeFrom}
                                onChange={e=>{
                                  setInlineEditRangeFrom(e.target.value);
                                  // 終了時刻もあれば経過時間を自動計算
                                  if(inlineEditRangeTo){
                                    const [fh,fm]=e.target.value.split(':').map(Number);
                                    const [th,tm]=inlineEditRangeTo.split(':').map(Number);
                                    const sec=Math.max(0,(th*60+tm)-(fh*60+fm))*60;
                                    if(sec>0)setInlineEditVal(toHHMM(sec));
                                  }
                                }}
                                onBlur={onRowBlur} onFocus={onRowFocus}
                                onClick={e=>e.stopPropagation()}
                                style={{...ib,width:44,fontSize:11,fontFamily:"'M PLUS Rounded 1c',sans-serif",fontWeight:600,
                                  color:T.text+'77',borderBottom:'1px solid '+T.text+'22',padding:'1px 0',textAlign:'center'}}/>
                              <span style={{fontSize:11,color:T.text+'33',margin:'0 1px'}}>〜</span>
                              <input type='time' value={inlineEditRangeTo}
                                onChange={e=>{
                                  setInlineEditRangeTo(e.target.value);
                                  if(inlineEditRangeFrom){
                                    const [fh,fm]=inlineEditRangeFrom.split(':').map(Number);
                                    const [th,tm]=e.target.value.split(':').map(Number);
                                    const sec=Math.max(0,(th*60+tm)-(fh*60+fm))*60;
                                    if(sec>0)setInlineEditVal(toHHMM(sec));
                                  }
                                }}
                                onBlur={onRowBlur} onFocus={onRowFocus}
                                onClick={e=>e.stopPropagation()}
                                style={{...ib,width:44,fontSize:11,fontFamily:"'M PLUS Rounded 1c',sans-serif",fontWeight:600,
                                  color:T.text+'77',borderBottom:'1px solid '+T.text+'22',padding:'1px 0',textAlign:'center'}}/>
                            </span>
                            <input type='text' inputMode='numeric' maxLength={5} autoComplete='off' autoCorrect='off' autoCapitalize='off' spellCheck={false} value={inlineEditVal}
                              onChange={e=>{let v=e.target.value.replace(/[^0-9:]/g,'');if(v.length===2&&!v.includes(':')&&inlineEditVal.length===1)v+=':';setInlineEditVal(v);}}
                              onFocus={e=>{onRowFocus();e.target.select();}}
                              onBlur={onRowBlur}
                              onKeyDown={e=>{if(e.key==='Enter'){saveSessField(s.id,'time');setInlineEditSessId(null);setInlineEditField(null);}}}
                              onClick={e=>e.stopPropagation()}
                              style={{...ib,width:52,minWidth:52,textAlign:'right',fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:13,
                                fontWeight:700,borderBottom:'2px solid '+T.accent,color:T.accent,
                                padding:'1px 2px',flexShrink:0,marginLeft:4}}/>
                            <button style={{background:'none',border:'none',padding:'0 0 0 5px',cursor:'pointer',flexShrink:0}}
                              onClick={e=>{e.stopPropagation();setConfirmDeleteId(s.id);setInlineEditSessId(null);}}>
                              {Icons.trash(T.text+'33',10)}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* ＋追加ボタン：右端 */}
                  {!isAdding&&(
                    <div style={{display:'flex',alignItems:'center',height:ROW,padding:'0 10px',justifyContent:'flex-end'}}>
                      <button style={{background:'none',border:'none',color:T.primary,fontSize:20,
                        cursor:'pointer',fontWeight:700,padding:0,lineHeight:1}}
                        onClick={e=>{e.stopPropagation();const firstR=getReasonList(state)[0]||'';setAddBreakdownDay(sel);setAddBreakdownReason(firstR);setAddBreakdownDur('00:30');setAddBreakdownComment('');}}>
                        ＋
                      </button>
                    </div>
                  )}

                  {/* 追加フォーム */}
                  {isAdding&&(
                    <div style={{borderTop:'1px solid '+T.text+'0a',padding:'8px 10px 10px'}}>
                      <div style={{display:'flex',flexWrap:'wrap',gap:4,marginBottom:8}}>
                        {[...getReasonList(state),"ー"].map(r=>(
                          <button key={r} style={{border:'none',borderRadius:20,fontSize:13,fontWeight:600,cursor:'pointer',
                            padding:'4px 10px',whiteSpace:'nowrap',flexShrink:0,
                            fontFamily:"'M PLUS Rounded 1c',sans-serif",
                            background:addBreakdownReason===r?T.primary:T.soft,
                            color:addBreakdownReason===r?'#fff':T.primary}}
                            onClick={e=>{e.stopPropagation();setAddBreakdownReason(r);}}>
                            {r}
                          </button>
                        ))}
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:6}}>
                        <span style={{fontSize:13,color:T.primary,fontWeight:700,flexShrink:0}}>{addBreakdownReason}</span>
                        <input type='text' value={addBreakdownComment}
                          onChange={e=>setAddBreakdownComment(e.target.value)}
                          onClick={e=>e.stopPropagation()}
                          placeholder='コメント'
                          autoFocus
                          style={{flex:1,fontSize:12,border:'none',borderBottom:'1px solid '+T.text+'22',
                            outline:'none',background:'transparent',padding:'1px 3px',color:T.text,minWidth:0,borderRadius:0}}/>
                        {/* 時刻範囲（任意） */}
                        <span style={{display:'flex',alignItems:'center',gap:1,flexShrink:0}}>
                          <input type='time' value={addBreakdownTimeFrom||''}
                            onChange={e=>{
                              const f=e.target.value;
                              setAddBreakdownTimeFrom(f);
                              if(f&&addBreakdownTimeTo){
                                const [fh,fm]=f.split(':').map(Number);
                                const [th,tm]=addBreakdownTimeTo.split(':').map(Number);
                                const sec=Math.max(0,(th*60+tm)-(fh*60+fm))*60;
                                if(sec>0)setAddBreakdownDur(toHHMM(sec));
                              }
                            }}
                            onClick={e=>e.stopPropagation()}
                            style={{width:44,fontSize:11,fontFamily:"'M PLUS Rounded 1c',sans-serif",fontWeight:600,
                              border:'none',borderBottom:'1px solid '+T.text+'22',outline:'none',background:'transparent',
                              color:T.text+'77',padding:'1px 0',textAlign:'center',borderRadius:0}}/>
                          <span style={{fontSize:11,color:T.text+'33',margin:'0 1px'}}>〜</span>
                          <input type='time' value={addBreakdownTimeTo||''}
                            onChange={e=>{
                              const t=e.target.value;
                              setAddBreakdownTimeTo(t);
                              if(addBreakdownTimeFrom&&t){
                                const [fh,fm]=addBreakdownTimeFrom.split(':').map(Number);
                                const [th,tm]=t.split(':').map(Number);
                                const sec=Math.max(0,(th*60+tm)-(fh*60+fm))*60;
                                if(sec>0)setAddBreakdownDur(toHHMM(sec));
                              }
                            }}
                            onClick={e=>e.stopPropagation()}
                            style={{width:44,fontSize:11,fontFamily:"'M PLUS Rounded 1c',sans-serif",fontWeight:600,
                              border:'none',borderBottom:'1px solid '+T.text+'22',outline:'none',background:'transparent',
                              color:T.text+'77',padding:'1px 0',textAlign:'center',borderRadius:0}}/>
                        </span>
                        <input type='text' inputMode='numeric' maxLength={5} autoComplete='off' autoCorrect='off' autoCapitalize='off' spellCheck={false} value={addBreakdownDur}
                          onChange={e=>{let v=e.target.value.replace(/[^0-9:]/g,'');if(v.length===2&&!v.includes(':')&&addBreakdownDur.length===1)v+=':';setAddBreakdownDur(v);}}
                          onFocus={e=>e.target.select()}
                          onKeyDown={e=>{if(e.key==='Escape')setAddBreakdownDay(null);}}
                          onClick={e=>e.stopPropagation()}
                          style={{width:44,textAlign:'right',fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:14,fontWeight:700,
                            border:'none',borderBottom:'2px solid '+T.primary,outline:'none',background:'transparent',
                            color:T.primary,padding:'1px 0',letterSpacing:1,flexShrink:0,borderRadius:0}}/>
                        <button
                          onClick={e=>{
                            e.stopPropagation();
                            let startTs=undefined,endTs=undefined,ms=parseHHMM(addBreakdownDur)*1000;
                            if(addBreakdownTimeFrom&&addBreakdownTimeTo){
                              const [fh,fm]=addBreakdownTimeFrom.split(':').map(Number);
                              const [th,tm]=addBreakdownTimeTo.split(':').map(Number);
                              startTs=dayMs+fh*3600000+fm*60000;
                              endTs=dayMs+th*3600000+tm*60000;
                              ms=Math.max(60000,endTs-startTs); // 時刻範囲優先
                            }
                            if(ms<=0){setAddBreakdownDay(null);return;}
                            const newSess={id:Date.now(),day:sel,ms,reason:addBreakdownReason,comment:addBreakdownComment,
                              ...(startTs?{start:startTs,end:endTs}:{})};
                            const allSess=[...(state.timerSessions||[]),newSess];
                            const newRem=allSess.filter(x=>
                              (x.start>=dayMs&&x.start<dayMs+86400000)||(!x.start&&x.day===sel)
                            ).reduce((a,x)=>a+x.ms,0);
                            const dl={...(state.dailyWearLog||{})};
                            dl[sel]=Math.max(0,86400-Math.floor(newRem/1000));
                            update({timerSessions:allSess,dailyWearLog:dl});
                            setAddBreakdownDay(null);
                            setAddBreakdownTimeFrom('');
                            setAddBreakdownTimeTo('');
                          }}
                          style={{flexShrink:0,width:26,height:26,border:'none',borderRadius:'50%',
                            background:T.primary,color:'#fff',fontSize:16,fontWeight:700,cursor:'pointer',
                            display:'flex',alignItems:'center',justifyContent:'center',lineHeight:1}}>
                          ＋
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {confirmDeleteId&&selSessions.some(s=>s.id===confirmDeleteId)&&(
                <div className='mo' onClick={()=>setConfirmDeleteId(null)} style={{alignItems:'center'}}>
                  <div className='md' style={{padding:'22px 20px 18px',borderRadius:20,maxWidth:340}} onClick={e=>e.stopPropagation()}>
                    <div style={{textAlign:'center',fontSize:28,marginBottom:8}}>🗑</div>
                    <div style={{textAlign:'center',fontSize:17,fontWeight:700,color:T.text,marginBottom:6}}>削除しますか？</div>
                    <div style={{textAlign:'center',fontSize:14,color:T.text+'66',marginBottom:20}}>
                      「{selSessions.find(s=>s.id===confirmDeleteId)?.reason||'その他'}」の記録を削除します
                    </div>
                    <div style={{display:'flex',gap:10}}>
                      <button className='btn bs' style={{flex:1}} onClick={()=>setConfirmDeleteId(null)}>キャンセル</button>
                      <button style={{flex:1,padding:'10px',border:'none',borderRadius:12,background:'#E74C3C',
                        color:'#fff',cursor:'pointer',fontWeight:700,fontSize:16,fontFamily:'M PLUS Rounded 1c,sans-serif'}}
                        onClick={()=>deleteSess(confirmDeleteId)}>削除</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()})()}

        {selEvents.length===0
          ? <div style={{fontSize:14,color:T.text+"40",padding:"4px 0"}}>この日の予定はありません</div>
          : <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {selEvents.map((ev,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",padding:"7px 10px",background:T.bg,borderRadius:9,borderLeft:`3px solid ${ev.color}`,position:"relative",minHeight:32}}>
                  <span style={{flex:1,fontSize:14,color:T.text,fontWeight:600}}>{ev.title||ev.label}</span>
                  {ev.time&&<span style={{position:"absolute",left:"50%",transform:"translateX(-50%)",fontSize:13,color:T.text+"66",fontFamily:"'M PLUS Rounded 1c',sans-serif",fontWeight:600,whiteSpace:"nowrap",pointerEvents:"none"}}>{ev.time}</span>}
                  {ev.id&&<button onClick={()=>deleteEvent(ev)} style={{background:"none",border:"none",color:T.text+"33",cursor:"pointer",padding:"0 0 0 8px",flexShrink:0}}>{Icons.trash(T.text+"33",12)}</button>}
                </div>
              ))}
            </div>
        }
      </div>

      {/* Add event modal */}
      {showAddModal&&(
        <div className="mo" onClick={()=>setShowAddModal(false)}>
          <div className="md" onClick={e=>e.stopPropagation()}>
            <div className="mdtitle">予定を追加</div>
            <label>タイトル</label>
            <input value={apptForm.title} onChange={e=>setApptForm(f=>({...f,title:e.target.value}))} placeholder="タイトル" style={{marginBottom:8}}/>
            <label>日付</label>
            <input type="date" value={apptForm.date} onChange={e=>setApptForm(f=>({...f,date:e.target.value}))} style={{marginBottom:8,width:"100%",boxSizing:"border-box"}}/>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
              <label style={{margin:0}}>時間</label>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:12,color:T.text+"66"}}>終日</span>
                <button onClick={()=>setApptForm(f=>({...f,allDay:!f.allDay,time:f.allDay?"":""}))}
                  style={{width:40,height:22,borderRadius:11,border:"none",cursor:"pointer",
                    background:apptForm.allDay?T.primary:T.soft,position:"relative",flexShrink:0,transition:"background .2s"}}>
                  <div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",
                    top:2,left:apptForm.allDay?20:2,transition:"left .2s",boxShadow:"0 1px 3px #0003"}}/>
                </button>
              </div>
            </div>
            {!apptForm.allDay&&(
              <input type="time" value={apptForm.time} onChange={e=>setApptForm(f=>({...f,time:e.target.value}))} style={{marginBottom:14,width:"100%",boxSizing:"border-box"}}/>
            )}
            <div style={{display:"flex",gap:8}}>
              <button className="btn bs" style={{flex:1}} onClick={()=>setShowAddModal(false)}>キャンセル</button>
              <button className="btn bp" style={{flex:1}} onClick={addEvent}>追加</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── PHOTO PAGE ───────────────────────────────────────────────────────────────
