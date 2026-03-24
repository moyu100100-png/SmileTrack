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
  const [timerEditSessId,setTimerEditSessId]=useState(null);
  const [timerEditSessReason,setTimerEditSessReason]=useState("");
  const [timerEditSessComment,setTimerEditSessComment]=useState("");
  const [timerEditSessFrom,setTimerEditSessFrom]=useState("");
  const [timerEditSessTo,setTimerEditSessTo]=useState("");
  const [timerEditSessDur,setTimerEditSessDur]=useState("00:00");
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
  const WIN_W=typeof window!=="undefined"?window.innerWidth:390;
  const sz=Math.min(Math.round(WIN_W*0.72),280),stk=Math.round(sz*.084),rad=(sz-stk)/2,cir=2*Math.PI*rad;
  const centerFontSize=Math.round(sz*.13);
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

  const deleteSess=id=>{
    const newSess=(state.timerSessions||[]).filter(s=>s.id!==id);
    const newRemovedMs=newSess.filter(s=>sessInDay(s,todayDayStartMs,todayStr)).reduce((a,s)=>a+s.ms,0);
    const dailyLog={...(state.dailyWearLog||{})};dailyLog[todayStr]=Math.max(0,86400-Math.floor(newRemovedMs/1000));
    update({timerSessions:newSess,dailyWearLog:dailyLog});setTimerConfirmDeleteId(null);setTimerEditSessId(null);
  };
  const saveTimerEdit=()=>{
    const orig=(state.timerSessions||[]).find(x=>x.id===timerEditSessId);
    if(!orig)return;
    const isFromTimer=!!(orig.start&&orig.end);
    let patch={reason:timerEditSessReason,noReason:!timerEditSessReason,comment:timerEditSessComment};
    if(timerEditSessFrom&&timerEditSessTo){
      const dayMs2=new Date(todayStr+"T00:00:00").getTime();
      const [fh,fm]=timerEditSessFrom.split(":").map(Number);
      const [th,tm]=timerEditSessTo.split(":").map(Number);
      const start=dayMs2+fh*3600000+fm*60000;
      const end=dayMs2+th*3600000+tm*60000;
      patch={...patch,start,end,ms:Math.max(60000,end-start)};
    } else if(!isFromTimer){
      patch={...patch,ms:parseHHMM2(timerEditSessDur)*1000};
    }
    const newSessions=(state.timerSessions||[]).map(x=>x.id===timerEditSessId?{...x,...patch}:x);
    const newRemovedMs=newSessions.filter(s=>sessInDay(s,todayDayStartMs,todayStr)).reduce((a,s)=>a+s.ms,0);
    const dailyLog={...(state.dailyWearLog||{})};
    dailyLog[todayStr]=Math.max(0,86400-Math.floor(newRemovedMs/1000));
    update({timerSessions:newSessions,dailyWearLog:dailyLog});
    setTimerEditSessId(null);
  };

  return(
    <div style={{padding:12}}>
      <div className="card" style={{marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"center",margin:"4px 0 10px"}}>
          <div style={{position:"relative",width:sz,height:sz,cursor:"pointer"}} onClick={onStartPress}>
            <svg width={sz} height={sz} style={{transform:"rotate(-90deg)"}}>
              <circle cx={sz/2} cy={sz/2} r={rad} fill="none" stroke={T.soft} strokeWidth={stk}/>
              <circle cx={sz/2} cy={sz/2} r={rad} fill="none" stroke={isAlarm?(["atrium","navyrose","deepteal","elegan","ashviolet","blushhemp"].includes(state.themeName)?(state.themeName==="atrium"?"#5A452C":T.soft):"#E74C3C"):T.primary} strokeWidth={stk}
                strokeDasharray={cir} strokeDashoffset={cir*(1-cycleProgress)} strokeLinecap="round" style={{transition:"stroke-dashoffset .5s"}}/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2}}>
              {timerRunning&&showBreakdown&&state._pendingReason&&(
                <div style={{fontSize:17,color:T.accent,fontWeight:700,marginBottom:2}}>{state._pendingReason}</div>
              )}
              <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:centerFontSize,fontWeight:700,color:isAlarm?(["atrium","navyrose","deepteal","elegan","ashviolet","blushhemp"].includes(state.themeName)?(state.themeName==="atrium"?"#5A452C":T.soft):"#E74C3C"):T.primary,lineHeight:1}}>{fmt(currentSec)}</div>
              <div style={{fontSize:Math.round(centerFontSize*.38),color:T.text+"66",marginTop:4}}>取り外し合計時間</div>
              <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:Math.round(centerFontSize*.82),fontWeight:600,color:T.text+"77",lineHeight:1}}>{fmt(totalRemovedSec)}</div>
            </div>
          </div>
        </div>
        <div style={{textAlign:"center",marginBottom:10}}>
          <div style={{fontSize:15,color:T.text+"88"}}>本日の装着予定時間</div>
          <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:22,fontWeight:700,color:T.primary}}>{fmt(expectedWear)}</div>

        </div>
        <button onClick={onStartPress} style={{width:"100%",padding:"16px",border:"none",borderRadius:16,fontSize:17,fontWeight:700,cursor:"pointer",fontFamily:"'M PLUS Rounded 1c',sans-serif",background:timerRunning?T.accent:T.primary,color:"#fff",marginBottom:10}}>
          {timerRunning?"装着":"▶ 取り外し開始"}
        </button>

        {/* アラーム行 - コンパクト */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:T.soft,borderRadius:12,padding:"9px 14px"}}>
          <span style={{fontSize:15,fontWeight:700,color:T.accent}}>アラーム</span>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <button className="btn bs bsm" style={{padding:"3px 10px",fontSize:16}} onClick={()=>update({alarmMinutes:Math.max(5,(state.alarmMinutes||30)-5)})}>－</button>
            <span style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontWeight:700,fontSize:17,color:T.accent,minWidth:28,textAlign:"center"}}>{state.alarmMinutes||30}</span>
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
        <div className="mo" style={{alignItems:"flex-end"}}>
          <div style={{background:T.card,borderRadius:"20px 20px 0 0",padding:"24px 20px 36px",width:"100%",boxSizing:"border-box"}}>
            <div className="mdtitle" style={{marginBottom:16,fontSize:18}}>何のために外しますか？</div>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
              {getReasonList(state).map(r=>(
                <button key={r} onClick={()=>confirmReason(r)}
                  style={{width:"100%",padding:"18px",border:`1.5px solid ${T.soft}`,borderRadius:14,
                    background:T.bg,color:T.text,fontSize:17,fontWeight:600,cursor:"pointer",
                    fontFamily:"'M PLUS Rounded 1c',sans-serif",textAlign:"center"}}>
                  {r}
                </button>
              ))}
              <button onClick={()=>confirmReason("")}
                style={{width:"100%",padding:"16px",border:`1.5px solid ${T.soft}`,borderRadius:14,
                  background:T.bg,color:T.text+"55",fontSize:15,fontWeight:600,cursor:"pointer",
                  fontFamily:"'M PLUS Rounded 1c',sans-serif",textAlign:"center"}}>
                ー（記録しない）
              </button>
            </div>
            <button className="btn bs" style={{width:"100%",padding:"16px",fontSize:16}} onClick={()=>setPendingReason(null)}>キャンセル</button>
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
              const displayReason=(!s.noReason&&s.reason)?s.reason:null;
              const durStr=secToHHMMSS(Math.floor(s.ms/1000));
              const hasRange=s.start&&s.end&&s.end>s.start;
              const rangeStr=hasRange?`${fmtTime(s.start)}〜${fmtTime(s.end)}`:'';
              return(
                <div key={s.id||i} style={{borderBottom:'1px solid '+T.text+'07'}}
                  onClick={()=>{
                    setTimerEditSessId(s.id);
                    setTimerEditSessReason(s.reason||'');
                    setTimerEditSessComment(s.comment||'');
                    setTimerEditSessFrom(hasRange?fmtTime(s.start):'');
                    setTimerEditSessTo(hasRange?fmtTime(s.end):'');
                    setTimerEditSessDur(secToHHMM(Math.floor(s.ms/1000)));
                  }}>
                  <div style={{display:'flex',alignItems:'center',minHeight:38,padding:'0 8px',gap:4,cursor:'pointer'}}>
                    {showBreakdown&&<span style={{fontSize:13,fontWeight:700,flexShrink:0,minWidth:44,color:displayReason?T.primary:T.text+'44'}}>
                      {displayReason||'ー'}
                    </span>}
                    <span style={{flex:1,fontSize:11,color:T.text+'55',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',padding:'0 3px'}}>{s.comment||''}</span>
                    {rangeStr&&<span style={{fontSize:11,color:T.text+'44',flexShrink:0,whiteSpace:'nowrap'}}>{rangeStr}</span>}
                    <span style={{fontWeight:700,color:T.accent,fontSize:13,whiteSpace:"nowrap",textAlign:"right",minWidth:36,marginLeft:4,flexShrink:0}}>{durStr}</span>
                  </div>
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

      {/* 編集モーダル */}
      {timerEditSessId&&(()=>{
        const s=(state.timerSessions||[]).find(x=>x.id===timerEditSessId);
        if(!s) return null;
        const isFromTimer=!!(s.start&&s.end);
        return(
          <div className="mo" onClick={()=>setTimerEditSessId(null)} style={{alignItems:"center"}}>
            <div className="md" onClick={e=>e.stopPropagation()} style={{borderRadius:20,maxWidth:400}}>
              <div className="mdtitle">取り外しを編集</div>
              <label>理由</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:14}}>
                {[...getReasonList(state),"ー"].map(r=>(
                  <button key={r} onClick={()=>setTimerEditSessReason(r==="ー"?"":r)}
                    style={{padding:'10px 16px',borderRadius:20,
                      border:`1.5px solid ${(timerEditSessReason===r||(r==="ー"&&!timerEditSessReason))?T.primary:T.soft}`,
                      background:(timerEditSessReason===r||(r==="ー"&&!timerEditSessReason))?T.primary:'transparent',
                      color:(timerEditSessReason===r||(r==="ー"&&!timerEditSessReason))?'#fff':T.text,
                      fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:"'M PLUS Rounded 1c',sans-serif"}}>
                    {r}
                  </button>
                ))}
              </div>
              <label>時刻</label>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
                <input type='time' value={timerEditSessFrom} onChange={e=>{
                  setTimerEditSessFrom(e.target.value);
                  if(timerEditSessTo){
                    const [fh,fm]=e.target.value.split(':').map(Number);
                    const [th,tm]=timerEditSessTo.split(':').map(Number);
                    const sec=Math.max(0,(th*60+tm)-(fh*60+fm))*60;
                    if(sec>0)setTimerEditSessDur(secToHHMM(sec));
                  }}}
                  style={{flex:1,height:44,fontSize:16,borderRadius:10,border:`1.5px solid ${T.soft}`,background:T.bg,color:T.text,padding:'0 12px',WebkitAppearance:'none',appearance:'none'}}/>
                <span style={{color:T.text+'55'}}>〜</span>
                <input type='time' value={timerEditSessTo} onChange={e=>{
                  setTimerEditSessTo(e.target.value);
                  if(timerEditSessFrom){
                    const [fh,fm]=timerEditSessFrom.split(':').map(Number);
                    const [th,tm]=e.target.value.split(':').map(Number);
                    const sec=Math.max(0,(th*60+tm)-(fh*60+fm))*60;
                    if(sec>0)setTimerEditSessDur(secToHHMM(sec));
                  }}}
                  style={{flex:1,height:44,fontSize:16,borderRadius:10,border:`1.5px solid ${T.soft}`,background:T.bg,color:T.text,padding:'0 12px',WebkitAppearance:'none',appearance:'none'}}/>
              </div>
              {!isFromTimer&&(
                <>
                  <label>時間</label>
                  <input type='text' inputMode='numeric' maxLength={5} autoComplete='off' value={timerEditSessDur}
                    onChange={e=>{let v=e.target.value.replace(/[^0-9:]/g,'');if(v.length===2&&!v.includes(':')&&timerEditSessDur.length===1)v+=':';setTimerEditSessDur(v);}}
                    style={{marginBottom:14,textAlign:'center'}}/>
                </>
              )}
              <label>コメント</label>
              <input type='text' value={timerEditSessComment} onChange={e=>setTimerEditSessComment(e.target.value)}
                placeholder='コメントを入力…' style={{marginBottom:16}}/>
              <div style={{display:'flex',gap:8}}>
                <button className='btn bs' style={{flex:1}} onClick={()=>setTimerEditSessId(null)}>キャンセル</button>
                <button style={{flex:1,padding:'10px',border:'none',borderRadius:12,background:'#E74C3C',color:'#fff',fontWeight:600,cursor:'pointer',fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:15}}
                  onClick={()=>{setTimerConfirmDeleteId(timerEditSessId);setTimerEditSessId(null);}}>削除</button>
                <button className='btn bp' style={{flex:1}} onClick={saveTimerEdit}>保存</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 削除確認 */}
      {timerConfirmDeleteId&&(
        <div className="mo" onClick={()=>setTimerConfirmDeleteId(null)} style={{zIndex:300,alignItems:"center"}}>
          <div className="md" onClick={e=>e.stopPropagation()} style={{textAlign:"center",borderRadius:20,maxWidth:340}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </div>
            <div className="mdtitle" style={{marginBottom:8}}>この記録を削除しますか？</div>
            <div style={{display:"flex",gap:8,marginTop:16}}>
              <button className="btn bs" style={{flex:1}} onClick={()=>setTimerConfirmDeleteId(null)}>キャンセル</button>
              <button style={{flex:1,padding:"10px",border:"none",borderRadius:12,background:"#E74C3C",color:"#fff",fontWeight:600,cursor:"pointer",fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:16}}
                onClick={()=>deleteSess(timerConfirmDeleteId)}>削除</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ── STATS PAGE ───────────────────────────────────────────────────────────────
