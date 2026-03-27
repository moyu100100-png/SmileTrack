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
  const [apptForm,setApptForm] = useState({date:todayStr,time:"",title:"",note:"",allDay:false});
  const [editLogDay,setEditLogDay] = useState(null);
  const [editLogVal,setEditLogVal] = useState("22:00");
  // セッション追加フォーム
  const [addBreakdownDay,setAddBreakdownDay] = useState(null);
  const [addBreakdownReason,setAddBreakdownReason] = useState("");
  const [addBreakdownDur,setAddBreakdownDur] = useState("00:30");
  const [addBreakdownComment,setAddBreakdownComment] = useState("");
  const [addBreakdownTimeFrom,setAddBreakdownTimeFrom] = useState("");
  const [addBreakdownTimeTo,setAddBreakdownTimeTo] = useState("");
  const [addUseTime,setAddUseTime] = useState(true);
  // 編集モーダル
  const [editSessId,setEditSessId] = useState(null);
  const [editSessReason,setEditSessReason] = useState("");
  const [editSessComment,setEditSessComment] = useState("");
  const [editSessFrom,setEditSessFrom] = useState("");
  const [editSessTo,setEditSessTo] = useState("");
  const [editSessDur,setEditSessDur] = useState("00:30");
  const [editSessHasRange,setEditSessHasRange] = useState(false);
  const [showWearEditConfirm,setShowWearEditConfirm] = useState(false);
  const [editEventId,setEditEventId] = useState(null);
  // 削除確認
  const [confirmDeleteId,setConfirmDeleteId] = useState(null);

  // 時刻が変わったら時間を自動計算
  const toHHMM=sec=>`${String(Math.floor(sec/3600)).padStart(2,"0")}:${String(Math.floor((sec%3600)/60)).padStart(2,"0")}`;

  React.useEffect(()=>{
    if(editSessFrom&&editSessTo){
      const [fh,fm]=editSessFrom.split(':').map(Number);
      const [th,tm]=editSessTo.split(':').map(Number);
      const sec=Math.max(0,(th*60+tm)-(fh*60+fm))*60;
      if(sec>0)setEditSessDur(toHHMM(sec));
    }
  },[editSessFrom,editSessTo]);

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
    if(ev.id) update({appointments:(state.appointments||[]).filter(x=>x.id!==ev.id)});
  };

  const addEvent = () => {
    if(!apptForm.date||!apptForm.title?.trim()) return;
    const ev={id:Date.now(),date:apptForm.date,time:apptForm.allDay?"":apptForm.time,timeTo:apptForm.allDay?"":apptForm.timeTo,title:apptForm.title,allDay:apptForm.allDay||false};
    update({appointments:[...(state.appointments||[]),ev].sort((a,b)=>a.date.localeCompare(b.date))});
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
            const greyFailThemes=["blush","wisteria","powder","glacier","amber"];
            const accentFailThemes=["atrium","navyrose","deepteal","elegan","ashviolet","blushhemp"];
            const isNight=state.themeName==="night";
            const failBgColor=isNight?"rgba(220,38,38,0.28)":accentFailThemes.includes(state.themeName)?T.soft+"66":greyFailThemes.includes(state.themeName)?"rgba(160,160,160,0.22)":"rgba(220,38,38,0.12)";
            let numBg="transparent",numColor=isPast?(T.text+"66"):isSun2?"#DC2626":isSat2?"#2563EB":T.text,numFw=400;
            if(isSel){ numBg=T.primary; numColor="#fff"; numFw=700; }
            else if(isToday){ numBg=T.soft; numColor=T.primary; numFw=700; }
            else if(achieved){
              if(state.themeName==="wisteria") numBg=`${T.primary}55`;
              else numBg=`${T.primary}22`;
            }
            else if(failed){ numBg=failBgColor; }
            return(
              <div key={ds} onClick={()=>setSel(ds)}
                style={{display:"flex",flexDirection:"column",alignItems:"center",cursor:"pointer",borderRadius:5,padding:"2px 1px",minHeight:44}}>
                {/* 日付: 交換日は四角で囲む */}
                <div style={{
                  width:30,height:30,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:15,fontWeight:numFw,
                  background:numBg,color:numColor,
                  border: isEx ? (isSel ? "2px solid rgba(255,255,255,0.7)" : `2px solid ${T.accent}`) : "2px solid transparent",
                  borderRadius: isEx&&!isSel ? "4px" : "4px",
                  flexShrink:0
                }}>
                  {d.getDate()}
                </div>
                <div style={{display:"flex",gap:1,marginTop:1,flexWrap:"wrap",justifyContent:"center",maxWidth:34}}>
                  {hasCam&&<span style={{display:"flex"}}>{Icons.camera(isSel?"rgba(255,255,255,0.9)":T.accent,7)}</span>}
                  {appts.slice(0,1).map((a,j)=>(
                    <div key={j} style={{fontSize:9,background:isSel?"rgba(255,255,255,0.25)":T.primary+"22",color:isSel?"#fff":T.primary,borderRadius:2,padding:"0 2px",lineHeight:"12px",maxWidth:42,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.title}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{display:"flex",gap:10,flexWrap:"wrap",paddingTop:6,borderTop:`1px solid ${T.soft}`,marginTop:4}}>
          <span style={{fontSize:11,display:"flex",alignItems:"center",gap:3,color:T.text+"77"}}><span style={{width:10,height:10,borderRadius:2,background:`${T.primary}22`,border:`1.5px solid ${T.primary}`,display:"inline-block"}}/>達成</span>
          {(()=>{
            const gf=["blush","wisteria","powder","glacier","amber"];
            const af=["atrium","navyrose","deepteal","elegan","ashviolet","blushhemp"];
            const isN=state.themeName==="night";
            const failBg=isN?"rgba(220,38,38,0.35)":af.includes(state.themeName)?T.soft+"99":gf.includes(state.themeName)?"rgba(160,160,160,0.25)":"rgba(220,38,38,0.12)";
            const failBd=isN?"1.5px solid rgba(220,38,38,0.7)":af.includes(state.themeName)?`1.5px solid ${T.soft}`:gf.includes(state.themeName)?"1.5px solid #aaa":"1.5px solid #DC2626";
            return <span style={{fontSize:11,display:"flex",alignItems:"center",gap:3,color:T.text+"77"}}><span style={{width:10,height:10,borderRadius:2,background:failBg,border:failBd,display:"inline-block"}}/>未達</span>;
          })()}
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
          const greyFailT=["blush","wisteria","powder","glacier","amber"];
          const accentFailT=["atrium","navyrose","deepteal","elegan","ashviolet","blushhemp"];
          const failColor=state.themeName==="night"?"rgba(220,38,38,0.8)":accentFailT.includes(state.themeName)?T.soft:greyFailT.includes(state.themeName)?"#A0A0A0":"#E88080";
              const wearColor=hasLog?(wearSec>=targetSecs?T.primary:failColor):T.text+"44";
          const ROW=38;

          // ── ヘルパー ──
          const saveWear=()=>{
            const log={...(state.dailyWearLog||{})};
            log[sel]=parseHHMM(editLogVal);
            // 内訳をリセット
            const newSess=(state.timerSessions||[]).filter(x=>
              !(x.start>=dayMs&&x.start<dayMs+86400000)&&!(!x.start&&x.day===sel)
            );
            update({dailyWearLog:log,timerSessions:newSess});
            setEditLogDay(sel);
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
                  onClick={()=>{setEditLogDay(isExpanded?null:sel);setAddBreakdownDay(null);}}>
                  装着時間
                </span>
                {isWearEdit
                  ?null
                  :<span style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:16,fontWeight:700,color:wearColor,cursor:'text',flexShrink:0}}
                      onClick={e=>{
                        e.stopPropagation();
                        setEditLogVal(toHHMM(wearSec));
                        setShowWearEditConfirm(true);
                      }}>
                      {hasLog?toHHMM(wearSec):'--:--'}
                    </span>
                }
                <span style={{fontSize:14,color:T.primary+'66',marginLeft:4,cursor:'pointer',flexShrink:0}}
                  onClick={()=>{setEditLogDay(isExpanded?null:sel);setAddBreakdownDay(null);}}>
                  {isExpanded?'▲':'▼'}
                </span>
              </div>

              {isExpanded&&(
                <div style={{background:T.accent+'0d',borderRadius:'0 0 10px 10px',paddingBottom:4}}>

                  {selSessions.map(s=>{
                    const hasRange=s.start&&s.end&&s.end>s.start
                      &&!(fmtTs(s.start)==='00:00'&&fmtTs(s.end)==='00:00');
                    const rangeStr=hasRange?fmtTs(s.start)+'〜'+fmtTs(s.end):'';
                    const durStr=toHHMM(Math.floor(s.ms/1000));
                    const displayReason=(s.reason&&!s.noReason)?s.reason:null;

                    return(
                      <div key={s.id} style={{borderBottom:'1px solid '+T.text+'07'}}
                        onClick={()=>{
                          setEditSessId(s.id);
                          setEditSessReason(s.reason||'');
                          setEditSessComment(s.comment||'');
                          setEditSessHasRange(!!(s.start&&s.end));
                          setEditSessFrom(hasRange?fmtTs(s.start):'');
                          setEditSessTo(hasRange?fmtTs(s.end):'');
                          setEditSessDur(durStr);
                        }}>
                        {/* 通常表示行 */}
                        <div style={{display:'flex',alignItems:'center',minHeight:ROW,padding:'0 10px',gap:4,cursor:'pointer'}}>
                          <span style={{fontSize:13,fontWeight:700,color:displayReason?T.primary:T.text+'44',flexShrink:0,minWidth:44}}>
                            {displayReason||'ー'}
                          </span>
                          <span style={{flex:1,fontSize:12,color:T.text+'55',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',padding:'0 3px'}}>
                            {s.comment||''}
                          </span>
                          {rangeStr&&<span style={{fontSize:14,fontFamily:"'M PLUS Rounded 1c',sans-serif",fontWeight:600,color:T.text+'66',flexShrink:0,marginLeft:4,whiteSpace:'nowrap'}}>{rangeStr}</span>}
                          <span style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:14,fontWeight:700,color:T.accent,flexShrink:0,minWidth:40,textAlign:'right',marginLeft:4}}>{durStr}</span>
                        </div>
                      </div>
                    );
                  })}

                  {/* ＋追加ボタン：右端 */}
                  <div style={{display:'flex',alignItems:'center',height:ROW,padding:'0 10px',justifyContent:'flex-end'}}>
                    <button style={{background:'none',border:'none',color:T.primary,fontSize:20,
                      cursor:'pointer',fontWeight:700,padding:0,lineHeight:1}}
                      onClick={e=>{e.stopPropagation();const firstR=getReasonList(state)[0]||'';setAddBreakdownDay(sel);setAddBreakdownReason(firstR);setAddBreakdownDur('00:30');setAddBreakdownComment('');setAddBreakdownTimeFrom('');setAddBreakdownTimeTo('');}}>
                      ＋
                    </button>
                  </div>
                </div>
              )}

              {confirmDeleteId&&selSessions.some(s=>s.id===confirmDeleteId)&&(
                <div className='mo' onClick={()=>setConfirmDeleteId(null)} style={{alignItems:'center'}}>
                  <div className='md' style={{padding:'22px 20px 18px',borderRadius:20,maxWidth:340}} onClick={e=>e.stopPropagation()}>
                    <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </div>
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
                <div key={i} onClick={()=>ev.id&&setEditEventId(ev.id)}
                  style={{display:"flex",alignItems:"center",padding:"7px 10px",background:T.bg,borderRadius:9,borderLeft:`3px solid ${ev.color}`,position:"relative",minHeight:32,cursor:ev.id?"pointer":"default"}}>
                  <span style={{flex:1,fontSize:14,color:T.text,fontWeight:600}}>{ev.title||ev.label}</span>
                  {ev.time&&<span style={{position:"absolute",left:"50%",transform:"translateX(-50%)",fontSize:13,color:T.text+"66",fontFamily:"'M PLUS Rounded 1c',sans-serif",fontWeight:600,whiteSpace:"nowrap",pointerEvents:"none"}}>{ev.time}</span>}
                </div>
              ))}
            </div>
        }
      </div>

      {/* 装着時間編集ポップアップ */}
      {showWearEditConfirm&&(()=>{
        const dayMs2=new Date(sel+"T00:00:00").getTime();
        const isToday2=sel===todayStr;
        const selSess2=(state.timerSessions||[]).filter(s=>
          s.start>=dayMs2&&s.start<dayMs2+86400000||(!s.start&&s.day===sel)
        );
        const hasBreakdown=selSess2.length>0;
        const parseHH=str=>{const p=(str||"").split(":");return Math.min(86400,Math.max(0,(parseInt(p[0])||0)*3600+(parseInt(p[1])||0)*60));};
        return(
          <div className="mo" onClick={()=>setShowWearEditConfirm(false)} style={{alignItems:"center"}}>
            <div className="md" onClick={e=>e.stopPropagation()} style={{borderRadius:20,maxWidth:340}}>
              <div className="mdtitle" style={{marginBottom:12}}>装着時間を変更</div>
              {isToday2?(
                <>
                  <div style={{fontSize:13,color:T.text+"77",marginBottom:16,lineHeight:1.6}}>
                    当日の装着時間はリアルタイムで自動計算されるため変更できません。
                  </div>
                  <button className="btn bs" style={{width:"100%"}} onClick={()=>setShowWearEditConfirm(false)}>閉じる</button>
                </>
              ):(
                <>
                  <label>時間</label>
                  <input type='text' inputMode='numeric' maxLength={5} autoComplete='off'
                    value={editLogVal}
                    onChange={e=>{let v=e.target.value.replace(/[^0-9:]/g,'');if(v.length===2&&!v.includes(':')&&editLogVal.length===1)v+=':';setEditLogVal(v);}}
                    style={{textAlign:'center',fontSize:18,fontWeight:700,marginBottom:16}}
                    autoFocus/>
                  {hasBreakdown&&(
                    <div style={{fontSize:12,color:T.text+"66",marginBottom:14,lineHeight:1.6}}>
                      内訳がある場合、変更すると内訳がリセットされます
                    </div>
                  )}
                  {hasBreakdown?(
                    <div style={{display:"flex",gap:8}}>
                      <button className="btn bs" style={{flex:1,color:T.text+"66",fontSize:13}} onClick={()=>{
                        const log={...(state.dailyWearLog||{})};
                        log[sel]=parseHH(editLogVal);
                        const newSess=(state.timerSessions||[]).filter(x=>
                          !(x.start>=dayMs2&&x.start<dayMs2+86400000)&&!(!x.start&&x.day===sel)
                        );
                        update({dailyWearLog:log,timerSessions:newSess});
                        setShowWearEditConfirm(false);
                      }}>内訳をリセット</button>
                      <button className="btn bp" style={{flex:1,fontSize:13}} onClick={()=>{
                        setShowWearEditConfirm(false);
                        setEditLogDay(sel);
                      }}>内訳を編集</button>
                    </div>
                  ):(
                    <div style={{display:"flex",gap:8}}>
                      <button className="btn bs" style={{flex:1}} onClick={()=>setShowWearEditConfirm(false)}>戻る</button>
                      <button className="btn bp" style={{flex:1}} onClick={()=>{
                        const log={...(state.dailyWearLog||{})};
                        log[sel]=parseHH(editLogVal);
                        update({dailyWearLog:log});
                        setShowWearEditConfirm(false);
                      }}>保存</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })()}

      {/* セッション編集モーダル */}
      {editSessId&&(()=>{
        const allSess=state.timerSessions||[];
        const s=allSess.find(x=>x.id===editSessId);
        if(!s) return null;
        const isFromTimer=!!(s.start&&s.end);
        const saveEdit=()=>{
          const dayMs2=new Date(sel+'T00:00:00').getTime();
          let patch={reason:editSessReason,noReason:!editSessReason,comment:editSessComment};
          if(editSessFrom&&editSessTo){
            const [fh,fm]=editSessFrom.split(':').map(Number);
            const [th,tm]=editSessTo.split(':').map(Number);
            const start=dayMs2+fh*3600000+fm*60000;
            const end=dayMs2+th*3600000+tm*60000;
            const ms=Math.max(60000,end-start);
            patch={...patch,start,end,ms};
          } else {
            // 時刻なし→時間から計算（タイマー由来でも編集可能）
            const toHHMMparse=str=>{const p=(str||"").split(":");return Math.min(86400,Math.max(0,(parseInt(p[0])||0)*3600+(parseInt(p[1])||0)*60));};
            patch={...patch,ms:toHHMMparse(editSessDur)*1000};
          }
          const newSess=(state.timerSessions||[]).map(x=>x.id===editSessId?{...x,...patch}:x);
          const newRem=newSess.filter(x=>(x.start>=new Date(sel+'T00:00:00').getTime()&&x.start<new Date(sel+'T00:00:00').getTime()+86400000)||(!x.start&&x.day===sel)).reduce((a,x)=>a+x.ms,0);
          const dl={...(state.dailyWearLog||{})};
          dl[sel]=Math.max(0,86400-Math.floor(newRem/1000));
          update({timerSessions:newSess,dailyWearLog:dl});
          setEditSessId(null);
        };
        return(
          <div className="mo" onClick={()=>setEditSessId(null)} style={{alignItems:"center"}}>
            <div className="md" onClick={e=>e.stopPropagation()} style={{borderRadius:20,maxWidth:400}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <div className="mdtitle" style={{margin:0}}>取り外しを編集</div>
                <button style={{background:'none',border:'none',color:'#E74C3C',fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:"'M PLUS Rounded 1c',sans-serif",padding:'4px 8px'}}
                  onClick={()=>{setConfirmDeleteId(editSessId);setEditSessId(null);}}>削除</button>
              </div>
              <label>理由</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:14}}>
                {[...getReasonList(state),"ー"].map(r=>(
                  <button key={r} onClick={()=>setEditSessReason(r==="ー"?"":r)}
                    style={{padding:'10px 16px',borderRadius:20,border:`1.5px solid ${(editSessReason===r||(r==="ー"&&!editSessReason))?T.primary:T.soft}`,
                      background:(editSessReason===r||(r==="ー"&&!editSessReason))?T.primary:'transparent',
                      color:(editSessReason===r||(r==="ー"&&!editSessReason))?'#fff':T.text,
                      fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:"'M PLUS Rounded 1c',sans-serif"}}>
                    {r}
                  </button>
                ))}
              </div>
              <label>時刻</label>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                <input type='time' value={editSessFrom}
                  onChange={e=>{setEditSessFrom(e.target.value);}}
                  onBlur={e=>{
                    const f=e.target.value;
                    if(f&&editSessTo){
                      const [fh,fm]=f.split(':').map(Number);
                      const [th,tm]=editSessTo.split(':').map(Number);
                      const sec=Math.max(0,(th*60+tm)-(fh*60+fm))*60;
                      if(sec>0)setEditSessDur(toHHMM(sec));
                    }}}
                  style={{flex:1,height:44,fontSize:16,borderRadius:10,border:`1.5px solid ${T.soft}`,background:T.bg,color:T.text,padding:'0 12px',WebkitAppearance:'none',appearance:'none'}}/>
                <span style={{color:T.text+'55'}}>〜</span>
                <input type='time' value={editSessTo}
                  onChange={e=>{setEditSessTo(e.target.value);}}
                  onBlur={e=>{
                    const t=e.target.value;
                    if(editSessFrom&&t){
                      const [fh,fm]=editSessFrom.split(':').map(Number);
                      const [th,tm]=t.split(':').map(Number);
                      const sec=Math.max(0,(th*60+tm)-(fh*60+fm))*60;
                      if(sec>0)setEditSessDur(toHHMM(sec));
                    }}}
                  style={{flex:1,height:44,fontSize:16,borderRadius:10,border:`1.5px solid ${T.soft}`,background:T.bg,color:T.text,padding:'0 12px',WebkitAppearance:'none',appearance:'none'}}/>
              </div>
              <label>時間</label>
              <input type='text' inputMode='numeric' maxLength={5} autoComplete='off' value={editSessDur}
                onChange={e=>{let v=e.target.value.replace(/[^0-9:]/g,'');if(v.length===2&&!v.includes(':')&&editSessDur.length===1)v+=':';setEditSessDur(v);}}
                style={{marginBottom:14,textAlign:'center',fontSize:16}}/>
              <label>コメント</label>
              <input type='text' value={editSessComment} onChange={e=>setEditSessComment(e.target.value)}
                placeholder='コメントを入力…' style={{marginBottom:16}}/>
              <div style={{display:'flex',gap:8}}>
                <button className='btn bs' style={{flex:1}} onClick={()=>setEditSessId(null)}>キャンセル</button>
                <button className='btn bp' style={{flex:1}} onClick={saveEdit}>保存</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 取り外し内訳追加モーダル */}
      {addBreakdownDay&&(
        <div className="mo" onClick={()=>setAddBreakdownDay(null)} style={{alignItems:"center"}}>
          <div className="md" onClick={e=>e.stopPropagation()} style={{borderRadius:20,maxWidth:400}}>
            <div className="mdtitle">取り外しを追加</div>
            {/* 理由選択 */}
            <label>理由</label>
            <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:14}}>
              {[...getReasonList(state),"ー"].map(r=>(
                <button key={r}
                  onClick={()=>setAddBreakdownReason(r)}
                  style={{padding:'10px 16px',borderRadius:20,border:`1.5px solid ${addBreakdownReason===r?T.primary:T.soft}`,
                    background:addBreakdownReason===r?T.primary:'transparent',
                    color:addBreakdownReason===r?'#fff':T.text,
                    fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:"'M PLUS Rounded 1c',sans-serif"}}>
                  {r}
                </button>
              ))}
            </div>
            {/* 時刻/時間 */}
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
              <label style={{margin:0}}>時刻</label>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:13,color:T.text+'66'}}>ON</span>
                <button onClick={()=>{setAddUseTime(v=>!v);setAddBreakdownTimeFrom('');setAddBreakdownTimeTo('');}}
                  style={{width:44,height:24,borderRadius:12,border:'none',cursor:'pointer',
                    background:addUseTime?T.primary:T.soft,position:'relative',flexShrink:0,transition:'background .2s'}}>
                  <div style={{width:20,height:20,borderRadius:'50%',background:'#fff',position:'absolute',
                    top:2,left:addUseTime?22:2,transition:'left .2s',boxShadow:'0 1px 3px #0003'}}/>
                </button>
              </div>
            </div>
            {addUseTime&&(
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                <input type='time' value={addBreakdownTimeFrom||''} onChange={e=>{
                  const f=e.target.value; setAddBreakdownTimeFrom(f);
                  if(f&&addBreakdownTimeTo){
                    const [fh,fm]=f.split(':').map(Number);
                    const [th,tm]=addBreakdownTimeTo.split(':').map(Number);
                    const sec=Math.max(0,(th*60+tm)-(fh*60+fm))*60;
                    if(sec>0)setAddBreakdownDur(toHHMM(sec));
                  }}}
                  style={{flex:1,height:44,fontSize:16,borderRadius:10,border:`1.5px solid ${T.soft}`,background:T.bg,color:T.text,padding:'0 12px',WebkitAppearance:'none',appearance:'none'}}/>
                <span style={{color:T.text+'55'}}>〜</span>
                <input type='time' value={addBreakdownTimeTo||''} onChange={e=>{
                  const t=e.target.value; setAddBreakdownTimeTo(t);
                  if(addBreakdownTimeFrom&&t){
                    const [fh,fm]=addBreakdownTimeFrom.split(':').map(Number);
                    const [th,tm]=t.split(':').map(Number);
                    const sec=Math.max(0,(th*60+tm)-(fh*60+fm))*60;
                    if(sec>0)setAddBreakdownDur(toHHMM(sec));
                  }}}
                  style={{flex:1,height:44,fontSize:16,borderRadius:10,border:`1.5px solid ${T.soft}`,background:T.bg,color:T.text,padding:'0 12px',WebkitAppearance:'none',appearance:'none'}}/>
              </div>
            )}
            <div style={{marginBottom:14}}>
              <label>時間</label>
              <input type='text' inputMode='numeric' maxLength={5} autoComplete='off' value={addBreakdownDur}
                onChange={e=>{if(addUseTime)return;let v=e.target.value.replace(/[^0-9:]/g,'');if(v.length===2&&!v.includes(':')&&addBreakdownDur.length===1)v+=':';setAddBreakdownDur(v);}}
                readOnly={addUseTime}
                style={{textAlign:'center',opacity:addUseTime?0.6:1,background:addUseTime?T.soft:T.bg}}/>
            </div>
            {/* コメント */}
            <label>コメント</label>
            <input type='text' value={addBreakdownComment} onChange={e=>setAddBreakdownComment(e.target.value)}
              placeholder='コメントを入力…' style={{marginBottom:16}}/>
            <div style={{display:'flex',gap:8}}>
              <button className='btn bs' style={{flex:1}} onClick={()=>setAddBreakdownDay(null)}>キャンセル</button>
              <button className='btn bp' style={{flex:1}} onClick={()=>{
                const sel=addBreakdownDay;
                const parseHH=str=>{const p=(str||"").split(":");return Math.min(86400,Math.max(0,(parseInt(p[0])||0)*3600+(parseInt(p[1])||0)*60));};
                const dayMs2=new Date(sel+'T00:00:00').getTime();
                let startTs=undefined,endTs=undefined,ms=parseHH(addBreakdownDur)*1000;
                if(addUseTime&&addBreakdownTimeFrom&&addBreakdownTimeTo){
                  const [fh,fm]=addBreakdownTimeFrom.split(':').map(Number);
                  const [th,tm]=addBreakdownTimeTo.split(':').map(Number);
                  startTs=dayMs2+fh*3600000+fm*60000;
                  endTs=dayMs2+th*3600000+tm*60000;
                  ms=Math.max(60000,endTs-startTs);
                }
                if(ms<=0){setAddBreakdownDay(null);return;}
                const newSess={id:Date.now(),day:sel,ms,reason:addBreakdownReason,comment:addBreakdownComment,
                  ...(startTs?{start:startTs,end:endTs}:{})};
                const allSess=[...(state.timerSessions||[]),newSess];
                const newRem=allSess.filter(x=>(x.start>=dayMs2&&x.start<dayMs2+86400000)||(!x.start&&x.day===sel)).reduce((a,x)=>a+x.ms,0);
                const dl={...(state.dailyWearLog||{})};
                dl[sel]=Math.max(0,86400-Math.floor(newRem/1000));
                update({timerSessions:allSess,dailyWearLog:dl});
                setAddBreakdownDay(null);
              }}>追加</button>
            </div>
          </div>
        </div>
      )}

      {/* Add event modal */}
      {showAddModal&&(
        <div className="mo" onClick={()=>setShowAddModal(false)} style={{alignItems:"center"}}>
          <div className="md" onClick={e=>e.stopPropagation()} style={{borderRadius:20,maxWidth:400}}>
            <div className="mdtitle">予定を追加</div>
            <label>タイトル</label>
            <input value={apptForm.title} onChange={e=>setApptForm(f=>({...f,title:e.target.value}))} placeholder="タイトル" style={{marginBottom:8}}/>
            <label>日付</label>
            <input type="date" value={apptForm.date} onChange={e=>setApptForm(f=>({...f,date:e.target.value}))}
              style={{marginBottom:8,width:"100%",boxSizing:"border-box",height:44,fontSize:16,
                borderRadius:10,border:`1.5px solid ${T.soft}`,background:T.bg,color:T.text,
                padding:"0 12px",WebkitAppearance:"none",appearance:"none"}}/>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
              <label style={{margin:0}}>時間</label>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:13,color:T.text+"66"}}>終日</span>
                <button onClick={()=>setApptForm(f=>({...f,allDay:!f.allDay}))}
                  style={{width:44,height:24,borderRadius:12,border:"none",cursor:"pointer",
                    background:apptForm.allDay?T.primary:T.soft,position:"relative",flexShrink:0,transition:"background .2s"}}>
                  <div style={{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",
                    top:2,left:apptForm.allDay?22:2,transition:"left .2s",boxShadow:"0 1px 3px #0003"}}/>
                </button>
              </div>
            </div>
            {!apptForm.allDay&&(
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
                <input type="time" value={apptForm.time||''} onChange={e=>setApptForm(f=>({...f,time:e.target.value}))}
                  style={{flex:1,height:44,fontSize:16,borderRadius:10,border:`1.5px solid ${T.soft}`,background:T.bg,color:T.text,padding:'0 12px',WebkitAppearance:'none',appearance:'none'}}/>
                <span style={{color:T.text+'55'}}>〜</span>
                <input type="time" value={apptForm.timeTo||''} onChange={e=>setApptForm(f=>({...f,timeTo:e.target.value}))}
                  style={{flex:1,height:44,fontSize:16,borderRadius:10,border:`1.5px solid ${T.soft}`,background:T.bg,color:T.text,padding:'0 12px',WebkitAppearance:'none',appearance:'none'}}/>
              </div>
            )}
            <div style={{display:"flex",gap:8}}>
              <button className="btn bs" style={{flex:1}} onClick={()=>setShowAddModal(false)}>キャンセル</button>
              <button className="btn bp" style={{flex:1}} onClick={addEvent}>追加</button>
            </div>
          </div>
        </div>
      )}

      {/* 予定編集モーダル */}
      {editEventId&&(()=>{
        const ev=(state.appointments||[]).find(a=>a.id===editEventId);
        if(!ev) return null;
        const saveEvField=(patch)=>{
          const newAppts=(state.appointments||[]).map(a=>a.id===editEventId?{...a,...patch}:a);
          update({appointments:newAppts});
        };
        return(
          <div className="mo" onClick={()=>setEditEventId(null)} style={{alignItems:"center"}}>
            <div className="md" onClick={e=>e.stopPropagation()} style={{borderRadius:20,maxWidth:400}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div className="mdtitle" style={{margin:0}}>予定を編集</div>
                <button style={{background:"none",border:"none",color:"#E74C3C",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"'M PLUS Rounded 1c',sans-serif",padding:"4px 8px"}}
                  onClick={()=>{deleteEvent(ev);setEditEventId(null);}}>削除</button>
              </div>
              <label>タイトル</label>
              <input value={ev.title||""} onChange={e=>saveEvField({title:e.target.value})} style={{marginBottom:8}}/>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                <label style={{margin:0}}>時間</label>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:13,color:T.text+"66"}}>終日</span>
                  <button onClick={()=>saveEvField({allDay:!ev.allDay})}
                    style={{width:44,height:24,borderRadius:12,border:"none",cursor:"pointer",
                      background:ev.allDay?T.primary:T.soft,position:"relative",flexShrink:0,transition:"background .2s"}}>
                    <div style={{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",
                      top:2,left:ev.allDay?22:2,transition:"left .2s",boxShadow:"0 1px 3px #0003"}}/>
                  </button>
                </div>
              </div>
              {!ev.allDay&&(
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
                  <input type="time" value={ev.time||''} onChange={e=>saveEvField({time:e.target.value})}
                    style={{flex:1,height:44,fontSize:16,borderRadius:10,border:`1.5px solid ${T.soft}`,background:T.bg,color:T.text,padding:'0 12px',WebkitAppearance:'none',appearance:'none'}}/>
                  <span style={{color:T.text+'55'}}>〜</span>
                  <input type="time" value={ev.timeTo||''} onChange={e=>saveEvField({timeTo:e.target.value})}
                    style={{flex:1,height:44,fontSize:16,borderRadius:10,border:`1.5px solid ${T.soft}`,background:T.bg,color:T.text,padding:'0 12px',WebkitAppearance:'none',appearance:'none'}}/>
                </div>
              )}
              <div style={{display:"flex",gap:8,marginTop:8}}>
                <button className="btn bs" style={{flex:1}} onClick={()=>setEditEventId(null)}>閉じる</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ── PHOTO PAGE ───────────────────────────────────────────────────────────────
