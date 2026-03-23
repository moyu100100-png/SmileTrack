function TimerPage({T,state,update,handleRemoveButton,todayStr,todayDayStartMs}){
  // タイマーページは常に毎秒更新（メインのタイマー表示）
  useTick(1000);

  const todayDayEndMs=todayDayStartMs+86400000;
  const todaySavedMs=(state.timerSessions||[]).filter(s=>sessInDay(s,todayDayStartMs,todayStr)).reduce((a,s)=>a+s.ms,0);
  const runningMs=state.timerRunning?state.timerElapsed+(Date.now()-(state.timerStart||Date.now())):state.timerElapsed;
  const totalRemovedSec=Math.floor((todaySavedMs+runningMs)/1000);
  const timerRunning=state.timerRunning;

  const [pendingReason,setPendingReason]=useState(null);
  // インライン編集 state（カレンダーと同じ構造）
  const [timerEditId,setTimerEditId]=useState(null);
  const blurTimerRef=useRef(null);
  const [timerEditVal,setTimerEditVal]=useState("00:00");
  const [timerEditComment,setTimerEditComment]=useState("");
  const [timerEditRangeFrom,setTimerEditRangeFrom]=useState("");
  const [timerEditRangeTo,setTimerEditRangeTo]=useState("");
  const [timerEditField,setTimerEditField]=useState(null); // 'reason' or null
  const [timerConfirmDeleteId,setTimerConfirmDeleteId]=useState(null);
  const currentSec=Math.floor(runningMs/1000);
  const CYCLE=3600;
  const alarmSecs=(state.alarmMinutes||30)*60;
  const isAlarmNow=state.alarmEnabled&&timerRunning&&currentSec>=alarmSecs&&currentSec%60===0;
  useEffect(()=>{
    if(isAlarmNow) playAlarmSound(state.alarmSound||"standard");
  },[isAlarmNow]);
  const cycleProgress=(currentSec%CYCLE)/CYCLE;
  const isAlarm=state.alarmEnabled&&timerRunning&&currentSec>=alarmSecs;
  const showBreakdown=state.showReasonBreakdown!==false;
  const todaySess=(state.timerSessions||[]).filter(s=>
    (s.start>=todayDayStartMs&&s.start<todayDayEndMs)||(!s.start&&s.day===todayStr)
  );
  const fmtTime=ts=>{const d=new Date(ts);return`${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;};
  const sz=190,stk=14,rad=(sz-stk)/2,cir=2*Math.PI*rad;
  const targetSecs=(state.targetWearHours||22)*3600;
  const expectedWear=Math.max(0,86400-totalRemovedSec);

  const onStartPress=()=>{
    if(!timerRunning){if(showBreakdown)setPendingReason("");else handleRemoveButton(runningMs);}
    else handleRemoveButton(runningMs);
  };
  const confirmReason=reason=>{setPendingReason(null);update({timerRunning:true,timerStart:Date.now(),timerElapsed:0,_pendingReason:reason});};
  const secToHHMM=sec=>`${String(Math.floor(sec/3600)).padStart(2,"0")}:${String(Math.floor((sec%3600)/60)).padStart(2,"0")}`;
  const secToHHMMSS=sec=>`${String(Math.floor(sec/3600)).padStart(2,"0")}:${String(Math.floor((sec%3600)/60)).padStart(2,"0")}:${String(sec%60).padStart(2,"0")}`;
  const parseHHMM2=str=>{const[h,m]=(str+":0").split(":");return Math.max(0,Math.min(86400,(parseInt(h)||0)*3600+(parseInt(m)||0)*60));};

  // コメントのみ保存（時刻・時間は一切変更しない）
  const saveTimerComment=(sid)=>{
    const orig=(state.timerSessions||[]).find(x=>x.id===sid);
    if(!orig)return;
    const newSessions=(state.timerSessions||[]).map(x=>x.id===sid?{...x,comment:timerEditComment}:x);
    update({timerSessions:newSessions});
    setTimerEditId(null);setTimerEditField(null);
  };
  // 時刻・時間を含む完全保存（時間入力欄・時刻入力欄から明示的に確定したとき）
  const saveTimerSess=(sid)=>{
    const orig=(state.timerSessions||[]).find(x=>x.id===sid);
    if(!orig)return;
    let newMs,newStart,newEnd;
    if(timerEditRangeFrom&&timerEditRangeTo){
      const dayMs=new Date(todayStr+"T00:00:00").getTime();
      const [fh,fm]=timerEditRangeFrom.split(":").map(Number);
      const [th,tm]=timerEditRangeTo.split(":").map(Number);
      newStart=dayMs+fh*3600000+fm*60000;
      newEnd=dayMs+th*3600000+tm*60000;
      newMs=Math.max(60000,newEnd-newStart);
    } else {
      newMs=parseHHMM2(timerEditVal)*1000;
      newStart=orig.start;
      newEnd=orig.end||(orig.start?orig.start+newMs:undefined);
    }
    const newSessions=(state.timerSessions||[]).map(x=>x.id===sid?{...x,ms:newMs,start:newStart,end:newEnd,comment:timerEditComment}:x);
    const newRemovedMs=newSessions.filter(s=>sessInDay(s,todayDayStartMs,todayStr)).reduce((a,s)=>a+s.ms,0);
    const dailyLog={...(state.dailyWearLog||{})};
    dailyLog[todayStr]=Math.max(0,86400-Math.floor(newRemovedMs/1000));
    update({timerSessions:newSessions,dailyWearLog:dailyLog});
    setTimerEditId(null);setTimerEditField(null);
  };
  const deleteSess=id=>{
    const newSess=(state.timerSessions||[]).filter(s=>s.id!==id);
    const newRemovedMs=newSess.filter(s=>sessInDay(s,todayDayStartMs,todayStr)).reduce((a,s)=>a+s.ms,0);
    const dailyLog={...(state.dailyWearLog||{})};dailyLog[todayStr]=Math.max(0,86400-Math.floor(newRemovedMs/1000));
    update({timerSessions:newSess,dailyWearLog:dailyLog});setTimerEditId(null);setTimerConfirmDeleteId(null);
  };
  const pickTimerReason=(sid,r)=>{
    const newSessions=(state.timerSessions||[]).map(x=>x.id===sid?{...x,reason:r,noReason:!r}:x);
    update({timerSessions:newSessions});
    setTimerEditField(null);
  };

  return(
    <div style={{padding:12}}>
      <div className="card" style={{marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"center",margin:"4px 0 10px"}}>
          <div style={{position:"relative",width:sz,height:sz}}>
            <svg width={sz} height={sz} style={{transform:"rotate(-90deg)"}}>
              <circle cx={sz/2} cy={sz/2} r={rad} fill="none" stroke={T.soft} strokeWidth={stk}/>
              <circle cx={sz/2} cy={sz/2} r={rad} fill="none" stroke={isAlarm?(["atrium","navyrose","deepteal","elegan","ashviolet","blushhemp"].includes(state.themeName)?(state.themeName==="atrium"?"#5A452C":T.soft):"#E74C3C"):T.primary} strokeWidth={stk}
                strokeDasharray={cir} strokeDashoffset={cir*(1-cycleProgress)} strokeLinecap="round" style={{transition:"stroke-dashoffset .5s"}}/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1}}>
              {timerRunning&&showBreakdown&&state._pendingReason&&(
                <div style={{fontSize:17,color:T.accent,fontWeight:700,marginBottom:2}}>{state._pendingReason}</div>
              )}
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:34,fontWeight:700,color:isAlarm?(["atrium","navyrose","deepteal","elegan","ashviolet","blushhemp"].includes(state.themeName)?(state.themeName==="atrium"?"#5A452C":T.soft):"#E74C3C"):T.primary,lineHeight:1}}>{fmt(currentSec)}</div>
              <div style={{fontSize:13,color:T.text+"66",marginTop:4}}>合計</div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:32,fontWeight:600,color:T.text+"77",lineHeight:1}}>{fmt(totalRemovedSec)}</div>
              
            </div>
          </div>
        </div>
        <div style={{textAlign:"center",marginBottom:10}}>
          <div style={{fontSize:15,color:T.text+"88"}}>本日の装着予定時間</div>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:700,color:T.primary}}>{fmt(expectedWear)}</div>
          <div style={{fontSize:14,color:T.text+"88"}}>目標: {state.targetWearHours||22}時間以上</div>
        </div>
        <button onClick={onStartPress} style={{width:"100%",padding:"16px",border:"none",borderRadius:16,fontSize:17,fontWeight:700,cursor:"pointer",fontFamily:"'M PLUS Rounded 1c',sans-serif",background:timerRunning?T.accent:T.primary,color:"#fff",marginBottom:10}}>
          {timerRunning?"装着":"▶ 取り外し開始"}
        </button>

        {/* アラーム行 - コンパクト */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:T.soft,borderRadius:12,padding:"9px 14px"}}>
          <span style={{fontSize:15,fontWeight:700,color:T.accent}}>アラーム</span>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <button className="btn bs bsm" style={{padding:"3px 10px",fontSize:16}} onClick={()=>update({alarmMinutes:Math.max(5,(state.alarmMinutes||30)-5)})}>－</button>
            <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:17,color:T.accent,minWidth:28,textAlign:"center"}}>{state.alarmMinutes||30}</span>
            <span style={{fontSize:13,color:T.text+"77"}}>分</span>
            <button className="btn bs bsm" style={{padding:"3px 10px",fontSize:16}} onClick={()=>update({alarmMinutes:Math.min(180,(state.alarmMinutes||30)+5)})}>＋</button>
            <button className="tg" style={{background:state.alarmEnabled?T.accent:T.soft+"aa"}} onClick={async()=>{if(!state.alarmEnabled){const ok=await ensureNotifPermission();if(!ok)return;}update({alarmEnabled:!state.alarmEnabled});}}>
              <div className="tg-k" style={{left:state.alarmEnabled?22:2}}/>
            </button>
          </div>
        </div>
      </div>

      {/* Reason picker */}
      {pendingReason!==null&&(
        <div className="mo">
          <div className="md">
            <div className="mdtitle">何のために外しますか？</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
              {getReasonList(state).map(r=>(<button key={r} className="reason-chip" onClick={()=>confirmReason(r)}>{r}</button>))}
              <button className="reason-chip" style={{background:T.soft,color:T.text+"77"}} onClick={()=>confirmReason("")}>ー</button>
            </div>
            <button className="btn bs" style={{width:"100%"}} onClick={()=>setPendingReason(null)}>キャンセル</button>
          </div>
        </div>
      )}

      {/* Sessions */}
      <div className="card" style={{marginBottom:10}}>
        <div style={{marginBottom:8}}>
          <div className="ct" style={{margin:0}}>本日の取り外し内訳</div>
        </div>

        {/* セッション一覧 */}
        {todaySess.length===0&&!timerRunning
          ? <div style={{textAlign:"center",color:T.text+"44",fontSize:14,padding:8}}>まだ記録がありません</div>
          : <>
            {todaySess.map((s,i)=>{
              const isEdit=timerEditId===s.id;
              const isReasonPick=timerEditId===s.id&&timerEditField==='reason';
              const displayReason=(!s.noReason&&s.reason)?s.reason:null;
              const durStr=secToHHMMSS(Math.floor(s.ms/1000));
              const durStrHHMM=secToHHMM(Math.floor(s.ms/1000));
              const hasRange=s.start&&s.end&&s.end>s.start;
              const rangeStr=hasRange?`${fmtTime(s.start)}〜${fmtTime(s.end)}`:'';
              const ib={border:'none',outline:'none',background:'transparent',borderRadius:0};
              const onBlur=()=>{blurTimerRef.current=setTimeout(()=>{saveTimerSess(s.id);},200);};
              const onFocus=()=>{if(blurTimerRef.current){clearTimeout(blurTimerRef.current);blurTimerRef.current=null;}};
              const reasonLabel={fontSize:13,fontWeight:700,flexShrink:0,maxWidth:80,cursor:'pointer',
                borderRadius:4,padding:'1px 6px',textAlign:'center',lineHeight:'18px',display:'inline-block',
                whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',
                color:displayReason?T.primary:T.text+'33',
                border:'1px dashed '+(displayReason?T.primary+'66':T.text+'22')};
              return(
                <div key={s.id||i} style={{borderBottom:'1px solid '+T.text+'07'}}>
                  {/* 理由ピッカー */}
                  {isReasonPick&&(
                    <div style={{padding:'6px 10px',background:T.soft,display:'flex',flexWrap:'wrap',gap:4}}
                      onMouseDown={e=>e.preventDefault()}>
                      <button style={{border:'none',borderRadius:12,padding:'4px 8px',fontSize:13,fontWeight:600,cursor:'pointer',textAlign:'center',whiteSpace:'nowrap',flexShrink:0,fontFamily:"'M PLUS Rounded 1c',sans-serif",
                        background:!displayReason?T.primary:T.card+'cc',color:!displayReason?'#fff':T.text+'55'}}
                        onClick={()=>pickTimerReason(s.id,'')}>ー</button>
                      {getReasonList(state).map(r=>(
                        <button key={r} style={{border:'none',borderRadius:12,padding:'4px 8px',fontSize:13,fontWeight:600,cursor:'pointer',textAlign:'center',whiteSpace:'nowrap',flexShrink:0,fontFamily:"'M PLUS Rounded 1c',sans-serif",
                          background:displayReason===r?T.primary:T.card+'cc',color:displayReason===r?'#fff':T.text+'77'}}
                          onClick={()=>pickTimerReason(s.id,r)}>{r}</button>
                      ))}
                    </div>
                  )}
                  {/* 削除確認 */}
                  {timerConfirmDeleteId===s.id&&(
                    <div style={{display:'flex',alignItems:'center',gap:8,padding:'4px 10px',background:'#FFF0F0'}}>
                      <span style={{flex:1,fontSize:13,color:'#E74C3C'}}>削除しますか？</span>
                      <button style={{border:'none',background:'none',fontSize:13,color:T.text+'66',cursor:'pointer'}} onClick={()=>setTimerConfirmDeleteId(null)}>キャンセル</button>
                      <button style={{border:'none',background:'#E74C3C',color:'#fff',borderRadius:8,padding:'2px 10px',fontSize:13,fontWeight:700,cursor:'pointer'}} onClick={()=>deleteSess(s.id)}>削除</button>
                    </div>
                  )}
                  {!isEdit?(
                    /* 通常表示行 */
                    <div style={{display:'flex',alignItems:'center',minHeight:28,padding:'0 8px',gap:4,cursor:'pointer'}}
                      onClick={()=>{
                        setTimerEditId(s.id);setTimerEditVal(durStrHHMM);setTimerEditComment(s.comment||'');
                        setTimerEditRangeFrom(hasRange?fmtTime(s.start):'');
                        setTimerEditRangeTo(hasRange?fmtTime(s.end):'');
                        setTimerConfirmDeleteId(null);
                        // timerEditFieldはリセットしない（理由タップ時に上書きされないように）
                      }}>
                      {showBreakdown&&<span style={reasonLabel}
                        onClick={e=>{e.stopPropagation();setTimerEditId(s.id);setTimerEditVal(durStrHHMM);setTimerEditComment(s.comment||'');setTimerEditRangeFrom(hasRange?fmtTime(s.start):'');setTimerEditRangeTo(hasRange?fmtTime(s.end):'');setTimerEditField('reason');}}>
                        {displayReason||'ー'}
                      </span>}
                      <span style={{flex:1,fontSize:11,color:T.text+'55',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',padding:'0 3px'}}>{s.comment||''}</span>
                      {rangeStr&&<span style={{fontSize:11,color:T.text+'44',flexShrink:0,whiteSpace:'nowrap'}}>{rangeStr}</span>}
                      <span style={{fontWeight:700,color:T.accent,fontSize:13,whiteSpace:"nowrap",textAlign:"right",minWidth:36,marginLeft:4,flexShrink:0}}>{durStr}</span>
                      <button style={{background:'none',border:'none',padding:'0 0 0 4px',cursor:'pointer',flexShrink:0}}
                        onClick={e=>{e.stopPropagation();setTimerConfirmDeleteId(s.id);setTimerEditId(null);}}>
                        {Icons.trash(T.text+'33',10)}
                      </button>
                    </div>
                  ):(
                    /* 編集行 */
                    <div style={{display:'flex',alignItems:'center',minHeight:28,padding:'0 8px',gap:4,background:T.card+'cc'}}>
                      {showBreakdown&&<span style={{...reasonLabel,color:displayReason?T.primary:T.text+'33'}}
                        onMouseDown={e=>{e.preventDefault();e.stopPropagation();setTimerEditField(isReasonPick?null:'reason');}}>
                        {displayReason||'ー'}
                      </span>}
                      <input type='text' value={timerEditComment}
                        onChange={e=>setTimerEditComment(e.target.value)}
                        onBlur={()=>saveTimerComment(s.id)}
                        placeholder='コメント'
                        onClick={e=>e.stopPropagation()}
                        onKeyDown={e=>{if(e.key==='Enter'){e.target.blur();}}}
                        style={{...ib,flex:1,fontSize:12,borderBottom:'1px solid '+T.text+'22',padding:'1px 3px',color:T.text,minWidth:0}}/>
                      {hasRange&&<span style={{display:'flex',alignItems:'center',gap:1,flexShrink:0,marginLeft:4}}>
                        <input type='time' value={timerEditRangeFrom}
                          onChange={e=>{
                            const val=e.target.value;
                            setTimerEditRangeFrom(val);
                            if(timerEditRangeTo){
                              const [fh,fm]=val.split(':').map(Number);
                              const [th,tm]=timerEditRangeTo.split(':').map(Number);
                              const sec=Math.max(0,(th*60+tm)-(fh*60+fm))*60;
                              if(sec>0)setTimerEditVal(secToHHMM(sec));
                            }
                          }}
                          onBlur={onBlur} onFocus={onFocus}
                          onClick={e=>e.stopPropagation()}
                          style={{...ib,width:44,fontSize:11,fontFamily:"'Outfit',sans-serif",fontWeight:600,
                            color:T.text+'77',borderBottom:'1px solid '+T.text+'22',padding:'1px 0',textAlign:'center'}}/>
                        <span style={{fontSize:11,color:T.text+'33',margin:'0 1px'}}>〜</span>
                        <input type='time' value={timerEditRangeTo}
                          onChange={e=>{
                            const val=e.target.value;
                            setTimerEditRangeTo(val);
                            if(timerEditRangeFrom){
                              const [fh,fm]=timerEditRangeFrom.split(':').map(Number);
                              const [th,tm]=val.split(':').map(Number);
                              const sec=Math.max(0,(th*60+tm)-(fh*60+fm))*60;
                              if(sec>0)setTimerEditVal(secToHHMM(sec));
                            }
                          }}
                          onBlur={onBlur} onFocus={onFocus}
                          onClick={e=>e.stopPropagation()}
                          style={{...ib,width:44,fontSize:11,fontFamily:"'Outfit',sans-serif",fontWeight:600,
                            color:T.text+'77',borderBottom:'1px solid '+T.text+'22',padding:'1px 0',textAlign:'center'}}/>
                      </span>}
                      <input type='text' inputMode='numeric' maxLength={5} value={timerEditVal}
                        onChange={e=>{let v=e.target.value.replace(/[^0-9:]/g,'');if(v.length===2&&!v.includes(':')&&timerEditVal.length===1)v+=':';setTimerEditVal(v);}}
                        onFocus={e=>{onFocus();e.target.select();}}
                        onBlur={onBlur}
                        onKeyDown={e=>{if(e.key==='Enter')saveTimerSess(s.id);}}
                        onClick={e=>e.stopPropagation()}
                        style={{...ib,minWidth:52,width:52,textAlign:'right',fontFamily:"'Outfit',sans-serif",fontSize:13,
                          fontWeight:700,borderBottom:'2px solid '+T.accent,color:T.accent,
                          padding:'1px 2px',flexShrink:0,marginLeft:4}}/>
                      <button style={{background:'none',border:'none',padding:'0 0 0 4px',cursor:'pointer',flexShrink:0}}
                        onClick={e=>{e.stopPropagation();setTimerConfirmDeleteId(s.id);setTimerEditId(null);}}>
                        {Icons.trash(T.text+'33',10)}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            {timerRunning&&(
              <div className="sess" style={{display:"flex",alignItems:"center",gap:0,borderLeft:`3px solid ${T.accent}`,cursor:"default",padding:"5px 8px"}}>
                <div style={{display:"flex",flexDirection:"column",minWidth:0,width:"28%"}}>
                  {showBreakdown&&state._pendingReason&&<span style={{color:T.accent,fontSize:12,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{state._pendingReason}</span>}
                </div>
                <span style={{color:T.text+"88",fontSize:12,whiteSpace:"nowrap",textAlign:"center",flex:"0 0 auto",width:"44%"}}>
                  {fmtTime(state.timerStart)}〜計測中
                </span>
                <span style={{fontWeight:700,color:T.accent,fontSize:13,whiteSpace:"nowrap",textAlign:"right",width:"28%"}}>{fmt(currentSec)}</span>
              </div>
            )}
          </>
        }
      </div>

    </div>
  );
}

// ── STATS PAGE ───────────────────────────────────────────────────────────────
