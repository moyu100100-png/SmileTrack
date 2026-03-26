function HomePage({T,state,todayStr,todayDayStartMs,onGoTimer}){
  // タイマー動作中のみ毎秒更新、停止中は更新不要
  useTick(1000, state.timerRunning);

  // 自分でrunningMs・totalRemovedSecを計算
  const todayDayEndMs=todayDayStartMs+86400000;
  const todaySavedMs=(state.timerSessions||[]).filter(s=>sessInDay(s,todayDayStartMs,todayStr)).reduce((a,s)=>a+s.ms,0);
  const runningMs=state.timerRunning?state.timerElapsed+(Date.now()-(state.timerStart||Date.now())):state.timerElapsed;
  const totalRemovedSec=Math.floor((todaySavedMs+runningMs)/1000);
  const secondsIntoDay=Math.max(0,Math.floor((Date.now()-todayDayStartMs)/1000));
  const info = getCurrentPieceInfo(state, todayStr);
  const {pieceN, label:pieceLabel, dayNum, interval, pieceIdx} = info;
  const daysToEx = getDaysToNextExchange(state, todayStr);

  const list = buildPieceList(state);
  const totalPiecesAll = list.length;
  const remainPieces = Math.max(0, totalPiecesAll - pieceIdx - 1);

  const startDateMs = state.startDate ? new Date(state.startDate+"T00:00:00").getTime() : null;
  const todayMs = new Date(todayStr+"T00:00:00").getTime();
  const elapsedDays = startDateMs !== null ? Math.max(1, Math.floor((todayMs - startDateMs)/86400000)+1) : 1;

  const totalEndDate = getTotalEndDate(state);
  const endDateMs = totalEndDate ? new Date(dsFromDate(totalEndDate)+"T00:00:00").getTime() : null;
  // 残り日数: 最終日から今日を引く（最終日当日は0）
  const remainDays = endDateMs !== null ? Math.max(0, Math.round((endDateMs - todayMs)/86400000)) : 0;

  const totalDays = list.reduce((a,p)=>a+p.intervalDays,0);
  const progressPct = totalDays > 0 ? Math.min(1, (elapsedDays-1)/totalDays) : 0;

  // 装着時間計算（0:00始まり固定）
  const sid = secondsIntoDay ?? 0;
  const actualWearSec = Math.max(0, sid - totalRemovedSec);
  const wearPct = sid > 0 ? Math.min(1, actualWearSec/sid) : 1;

  const WIN_W = typeof window !== "undefined" ? window.innerWidth : 390;
  const SZ = Math.min(Math.round(WIN_W*0.72), 280);
  const STK = Math.round(SZ*.084);
  const R = (SZ-STK)/2, CIRC = 2*Math.PI*R;
  const centerFontSize = Math.round(SZ*.13);

  const isFirstPieceFirstDay = (pieceIdx===0 && dayNum===1);
  const isExchangeDay = (dayNum===1 && !isFirstPieceFirstDay);
  const isLastDay = totalEndDate && dsFromDate(totalEndDate)===todayStr;

  const lblStyle = {fontSize:14, color:T.text+"66", fontWeight:600, marginBottom:3};
  const subStyle = {fontSize:11, color:T.text+"66", fontWeight:400};

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",gap:6,padding:"6px 12px",background:T.bg,overflowY:"auto"}}>
      {/* Donut Card */}
      <div className="card" style={{display:"flex",justifyContent:"center",alignItems:"center",padding:"24px 13px",cursor:"pointer",flex:"1 1 auto"}} onClick={onGoTimer}>
          <div style={{position:"relative",width:SZ,height:SZ}}>
            <svg width={SZ} height={SZ} style={{transform:"rotate(-90deg)"}}>
              <circle cx={SZ/2} cy={SZ/2} r={R} fill="none" stroke={T.soft} strokeWidth={STK}/>
              <circle cx={SZ/2} cy={SZ/2} r={R} fill="none" stroke={T.primary} strokeWidth={STK}
                strokeDasharray={`${CIRC*wearPct} ${CIRC}`} strokeDashoffset={0} style={{transition:"all .6s"}}/>
              {totalRemovedSec>0&&<circle cx={SZ/2} cy={SZ/2} r={R} fill="none" stroke={T.removedColor} strokeWidth={STK}
                strokeDasharray={`${CIRC*(1-wearPct)} ${CIRC}`} strokeDashoffset={-CIRC*wearPct} style={{transition:"all .6s"}}/>}
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2}}>
              <div style={{fontSize:Math.round(centerFontSize*.5),color:T.text+"77",fontWeight:600}}>本日の装着時間</div>
              {(()=>{
                const accentNum=["atrium","navyrose","deepteal","elegan","ashviolet","blushhemp"].includes(state.themeName);
                const numC=accentNum?T.removedColor:T.primary;
                return <>
                  <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:centerFontSize,fontWeight:700,color:numC,lineHeight:1}}>{fmt(actualWearSec)}</div>
                  <div style={{fontSize:Math.round(centerFontSize*.5),color:T.text+"77"}}>取り外し</div>
                  <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:Math.round(centerFontSize*.82),fontWeight:600,color:T.text+"99",lineHeight:1}}>{fmt(totalRemovedSec)}</div>
                </>;
              })()}
            </div>
          </div>
        </div>
      {/* Stats grid 2×2 */}
      <div style={{display:"flex",flexDirection:"column",gap:6,flex:"0 0 auto"}}>
        {totalEndDate&&new Date(dsFromDate(totalEndDate)+"T00:00:00").getTime()<todayMs?(
          /* 治療完了 */
          <div style={{background:T.card,borderRadius:16,padding:"32px 16px",textAlign:"center"}}>
            <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:22,fontWeight:700,color:T.primary,marginBottom:8}}>お疲れ様でした</div>
            <div style={{fontSize:22,fontWeight:700,color:T.primary,lineHeight:1.7}}>毎日よく頑張りました✨</div>
          </div>
        ):(
          <>
          {(()=>{
            const accentNum=["atrium","navyrose","deepteal","elegan","ashviolet","blushhemp"].includes(state.themeName);
            const nC=accentNum?T.removedColor:T.primary;
            return <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {/* 今日 */}
              <div style={{background:T.card,borderRadius:12,padding:"10px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:80}}>
                <div style={lblStyle}>今日</div>
                <div style={{position:"relative",width:"100%",display:"flex",justifyContent:"center",alignItems:"baseline",height:40}}>
                  <span style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:36,fontWeight:700,color:nC,lineHeight:1,position:"absolute",left:"50%",transform:"translateX(-50%)",bottom:0}}>{dayNum}</span>
                  <span style={{...subStyle,position:"absolute",left:"calc(50% + 22px + 4px)",bottom:2,whiteSpace:"nowrap"}}>日目/{interval}日間</span>
                </div>
              </div>
              {/* 交換まで */}
              <div style={{background:T.card,borderRadius:12,padding:"10px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:80}}>
                {isFirstPieceFirstDay ? (
                  <><div style={lblStyle}>開始日</div><div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:24,fontWeight:700,color:nC}}>今日</div></>
                ) : isExchangeDay ? (
                  <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:26,fontWeight:700,color:nC}}>交換日</div>
                ) : isLastDay ? (
                  <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:24,fontWeight:700,color:nC}}>最終日✨</div>
                ) : (
                  <>
                    <div style={lblStyle}>交換まで</div>
                    <div style={{position:"relative",width:"100%",display:"flex",justifyContent:"center",alignItems:"baseline",height:40}}>
                      <span style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:36,fontWeight:700,color:nC,lineHeight:1,position:"absolute",left:"50%",transform:"translateX(-50%)",bottom:0}}>{daysToEx}</span>
                      <span style={{...subStyle,position:"absolute",left:"calc(50% + 22px + 4px)",bottom:2,whiteSpace:"nowrap"}}>日</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {/* マウスピース */}
              <div style={{background:T.card,borderRadius:12,padding:"10px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:80}}>
                <div style={lblStyle}>マウスピース</div>
                <div style={{position:"relative",width:"100%",display:"flex",justifyContent:"center",alignItems:"baseline",height:40}}>
                  <span style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:36,fontWeight:700,color:nC,lineHeight:1,position:"absolute",left:"50%",transform:"translateX(-50%)",bottom:0}}>{pieceLabel||pieceN}</span>
                  <span style={{...subStyle,position:"absolute",left:"calc(50% + 22px + 4px)",bottom:2,whiteSpace:"nowrap"}}>枚目/全{totalPiecesAll}枚</span>
                </div>
              </div>
              {/* 残り */}
              <div style={{background:T.card,borderRadius:12,padding:"10px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:80}}>
                <div style={lblStyle}>残り</div>
                <div style={{position:"relative",width:"100%",display:"flex",justifyContent:"center",alignItems:"baseline",height:40}}>
                  <span style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:36,fontWeight:700,color:nC,lineHeight:1,position:"absolute",left:"50%",transform:"translateX(-50%)",bottom:0}}>{remainPieces}</span>
                  <span style={{...subStyle,position:"absolute",left:"calc(50% + 22px + 4px)",bottom:2,whiteSpace:"nowrap"}}>枚</span>
                </div>
              </div>
            </div>
            </>;
          })()}
            {/* Progress bar */}
            <div style={{background:T.card,borderRadius:12,padding:"9px 12px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontSize:13,color:T.text+"66"}}>スタートから <strong style={{color:T.primary}}>{elapsedDays}</strong> 日目</span>
                <span style={{fontSize:13,color:T.text+"66"}}>あと <strong style={{color:T.primary}}>{remainDays}</strong> 日</span>
              </div>
              <div style={{position:"relative",height:12,background:state.themeName==="night"?"#B0B8D0":T.soft,borderRadius:99,overflow:"hidden"}}>
                <div style={{position:"absolute",left:0,top:0,bottom:0,width:`${progressPct*100}%`,background:T.primary,borderRadius:99,transition:"width 1.2s"}}/>
              </div>
              {totalEndDate&&(()=>{
                const ed=new Date(dsFromDate(totalEndDate)+"T00:00:00");
                const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                const finStr=`${ed.getDate()} ${months[ed.getMonth()]} ${ed.getFullYear()}`;
                return(
                  <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:8}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/>
                    </svg>
                    <span style={{fontSize:13,color:T.text+"88"}}>{finStr}</span>
                  </div>
                );
              })()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── CALENDAR PAGE ─────────────────────────────────────────────────────────────
