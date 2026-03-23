function StatsPage({T,state,update,todayStr,todayDayStartMs}){
  const isPremium=IS_PREMIUM;
  useTick(1000, state.timerRunning);

  const [period,setPeriod]=useState("daily");
  const [statsView,setStatsView]=useState("breakdown");
  const [selectedBar,setSelectedBar]=useState(null);
  const [showReportModal,setShowReportModal]=useState(false);
  const [showReportPreview,setShowReportPreview]=useState(false);
  const barScrollRef=useRef(null);
  const log=state.dailyWearLog||{};
  const today=new Date();
  const todayDs=dsFromDate(today);
  const target=(state.targetWearHours||22)*3600;
  const showBreakdown=state.showReasonBreakdown!==false;
  const ws=state.settings?.calendarWeekStart??0;

  const getEffectiveLog = () => {
    const effective = {...log};
    if(state.startDate){
      const startMs=new Date(state.startDate+"T00:00:00").getTime();
      const todayMs=new Date(todayStr+"T00:00:00").getTime();
      for(let ms=startMs;ms<todayMs;ms+=86400000){
        const ds=dsFromDate(new Date(ms));
        if(effective[ds]===undefined) effective[ds]=86400;
      }
      // 開始日より前は0
      Object.keys(effective).forEach(ds=>{if(ds<state.startDate) effective[ds]=0;});
    }
    const todayDayEndMs=todayDayStartMs+86400000;
    const todaySavedMs=(state.timerSessions||[]).filter(s=>sessInDay(s,todayDayStartMs,todayStr)).reduce((a,s)=>a+s.ms,0);
    const runningMs=state.timerRunning?state.timerElapsed+(Date.now()-(state.timerStart||Date.now())):state.timerElapsed;
    const totalRemovedSec=Math.floor((todaySavedMs+runningMs)/1000);
    const sid=Math.max(0,Math.floor((Date.now()-todayDayStartMs)/1000));
    effective[todayStr] = Math.max(0, sid - totalRemovedSec);
    return effective;
  };
  const effectiveLog = getEffectiveLog();

  const buildBars=()=>{
    const startD = state.startDate ? new Date(state.startDate+"T00:00:00") : new Date(today.getFullYear(),today.getMonth(),1);
    if(period==="daily"){
      const bars=[];
      for(let d=new Date(startD);d<=today;d.setDate(d.getDate()+1)){
        const ds=dsFromDate(new Date(d));
        const beforeStart=state.startDate&&ds<state.startDate;
        bars.push({key:ds,label:`${d.getMonth()+1}/${d.getDate()}`,secs:beforeStart?0:(effectiveLog[ds]||0),isPast:ds<=todayDs,isToday:ds===todayDs});
      }
      return bars;
    } else if(period==="weekly"){
      const startDow=(startD.getDay()-ws+7)%7;
      const firstWeekStart=new Date(startD);firstWeekStart.setDate(startD.getDate()-startDow);
      const todayDow=(today.getDay()-ws+7)%7;
      const thisWeekStart=new Date(today);thisWeekStart.setDate(today.getDate()-todayDow);
      const thisWeekDs=dsFromDate(thisWeekStart);
      const bars=[];
      for(let wStart=new Date(firstWeekStart);wStart<=thisWeekStart;wStart.setDate(wStart.getDate()+7)){
        const start=new Date(wStart);
        const end=new Date(start);end.setDate(start.getDate()+6);
        let total=0;
        for(let d=new Date(start);d<=end;d.setDate(d.getDate()+1)){total+=effectiveLog[dsFromDate(new Date(d))]||0;}
        const avgSecs=Math.floor(total/7);
        const startDs=dsFromDate(start);
        const endDs=dsFromDate(end);
        const year=start.getFullYear();
        const rangeLabel=`${start.getMonth()+1}/${start.getDate()}〜${end.getMonth()+1}/${end.getDate()}`;
        bars.push({key:startDs,endKey:endDs,label:rangeLabel,yearLabel:`${year}`,secs:avgSecs,isPast:true,isToday:startDs===thisWeekDs});
      }
      return bars;
    } else {
      const bars=[];
      const sy=startD.getFullYear(),sm=startD.getMonth();
      const ty=today.getFullYear(),tm=today.getMonth();
      for(let y=sy,m=sm;;){
        const daysInMonth=new Date(y,m+1,0).getDate();
        let total=0;let cnt=0;
        for(let day=1;day<=daysInMonth;day++){
          const ds=dsFromDate(new Date(y,m,day));
          if(effectiveLog[ds]){total+=effectiveLog[ds];cnt++;}
        }
        const avgSecs=cnt>0?Math.floor(total/cnt):0;
        bars.push({key:`${y}-${m}`,endKey:`${y}-${m}`,label:`${y}年${m+1}月`,secs:avgSecs,isPast:true,isToday:(y===ty&&m===tm),year:y,month:m});
        if(y===ty&&m===tm) break;
        m++;if(m>11){m=0;y++;}
      }
      return bars;
    }
  };

  const bars=buildBars();
  const maxSecs=Math.max(...bars.map(b=>b.secs),target,1);

  // 期間切替・初回で右端（最新）へスクロール
  useEffect(()=>{
    if(barScrollRef.current){
      barScrollRef.current.scrollLeft=barScrollRef.current.scrollWidth;
    }
  },[period,bars.length]);

  // 未選択時は今日のバーをデフォルトとして内訳表示

  const getAvg=n=>{
    const vals=Array.from({length:n},(_,i)=>{const d=new Date(today);d.setDate(d.getDate()-i);return effectiveLog[dsFromDate(d)]||0;}).filter(v=>v>0);
    return vals.length?Math.floor(vals.reduce((a,v)=>a+v,0)/vals.length):0;
  };
  const avg7=getAvg(7),avg30=getAvg(30);

  const sevenDaysAgo=new Date(today);sevenDaysAgo.setDate(sevenDaysAgo.getDate()-7);

  // 選択されたバーに対応するセッション集計
  const getBreakdownForBar=(bar)=>{
    if(!bar) return {};
    const sessions=state.timerSessions||[];
    let filtered=[];
    if(period==="daily"){
      const dayMs=new Date(bar.key+"T00:00:00").getTime();
      filtered=sessions.filter(s=>sessInDay(s,dayMs,bar.key));
    } else if(period==="weekly"){
      filtered=sessions.filter(s=>{
        const ds=s.start?dsFromDate(new Date(s.start)):s.day;
        return ds&&ds>=bar.key&&ds<=bar.endKey;
      });
    } else {
      const parts=bar.key.split("-");
      const y=parseInt(parts[0]),m=parseInt(parts[1]);
      filtered=sessions.filter(s=>{
        if(s.start){const d=new Date(s.start);return d.getFullYear()===y&&d.getMonth()===m;}
        if(s.day){const d=new Date(s.day+"T00:00:00");return d.getFullYear()===y&&d.getMonth()===m;}
        return false;
      });
    }
    if(state.timerRunning&&state._pendingReason&&period==="daily"&&bar.key===todayStr){
      const rMs=state.timerElapsed+(Date.now()-(state.timerStart||Date.now()));
      filtered=[...filtered,{ms:rMs,reason:state._pendingReason||"その他"}];
    }
    const totals={};
    filtered.forEach(s=>{const r=(!s.noReason&&s.reason)?s.reason:"ー";totals[r]=(totals[r]||0)+Math.floor(s.ms/1000);});
    return totals;
  };

  const reasonTotal=bar=>Object.values(getBreakdownForBar(bar)).reduce((a,v)=>a+v,0)||1;

  // ピース別装着時間: 交換スケジュールの期間ごとに集計
  const list=buildPieceList(state);
  const pieceWearList = list.map((p, idx) => {
    const startDate = getExchangeDate(state, p.n);
    const endDate = getExchangeEndDate(state, p.n);
    const startStr = startDate ? dsFromDate(startDate) : null;
    const endStr = endDate ? dsFromDate(endDate) : null;
    // 集計範囲: startStr以上、次ピース開始日未満
    const nextP = list[idx+1];
    const nextStartStr = nextP ? dsFromDate(getExchangeDate(state, nextP.n)) : null;
    let total = 0;
    Object.entries(effectiveLog).forEach(([ds, secs]) => {
      if(!startStr) return;
      if(ds >= startStr && (!nextStartStr || ds < nextStartStr)) total += secs;
    });
    const rangeLabel = startStr && endStr
      ? `${fmtDateJP(startStr)}〜${fmtDateJP(endStr)}`
      : startStr ? `${fmtDateJP(startStr)}〜` : "—";
    return { n: p.n, label: p.label, rangeLabel, total };
  });

  const selectedDay = selectedBar?.key||null;
  const dayDetail=selectedDay?(state.timerSessions||[]).filter(s=>{
    const dayMs=new Date(selectedDay+"T00:00:00").getTime();
    return sessInDay(s,dayMs,selectedDay);
  }):[];
  const dayReasons={};dayDetail.forEach(s=>{const r=s.reason||"その他";dayReasons[r]=(dayReasons[r]||0)+Math.floor(s.ms/1000);});

  const [tooltip,setTooltip]=useState(null);

  return(
    <div style={{padding:12}}>
      <div style={{display:"flex",gap:2,background:T.card,borderRadius:12,padding:4,marginBottom:10}}>
        {[["daily","毎日"],["weekly","毎週"],["monthly","毎月"]].map(([v,l])=>(
          <button key={v} className={`stats-tab${period===v?" on":""}`} onClick={()=>setPeriod(v)}>{l}</button>
        ))}
      </div>

      <div className="card" style={{marginBottom:10,overflow:"hidden",position:"relative"}}>
        <button onClick={()=>isPremium?setShowReportModal(true):setShowReportPreview(true)} style={{position:"absolute",top:8,right:8,zIndex:10,background:"none",border:"none",cursor:"pointer",padding:4,opacity:isPremium?1:0.6}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        </button>
        <div ref={barScrollRef} style={{overflowX:"auto",WebkitOverflowScrolling:"touch",paddingBottom:2}}>
          <div style={{display:"flex",alignItems:"flex-end",gap:period==="monthly"?10:period==="weekly"?6:4,padding:"8px 8px 0",minWidth:"max-content"}}>
            {bars.map((b,i)=>{
              const h=maxSecs>0?(b.secs/maxSecs)*160:0;
              const achieved=b.secs>=target&&b.secs>0;
              const isSelected=selectedBar?.key===b.key;
              const barW=period==="daily"?26:period==="weekly"?58:52;
              const labelColor = isSelected?T.primary:b.isToday?T.primary:T.text+"44";
              const labelWeight = (isSelected||b.isToday)?700:400;
              return(
                <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",width:barW,cursor:"pointer",flexShrink:0}}
                  onClick={()=>setSelectedBar(isSelected?null:b)}>
                  <div style={{height:160,display:"flex",alignItems:"flex-end",width:"100%",justifyContent:"center"}}>
                    <div style={{width:"72%",height:`${Math.max(2,h)}px`,background:b.secs===0?T.soft:achieved?T.primary:(state.themeName==="night"?"#DC2626":["atrium","navyrose","deepteal","elegan","ashviolet","blushhemp"].includes(state.themeName)?(state.themeName==="atrium"?"#5A452C":T.soft):"#E88080"),borderRadius:"3px 3px 0 0",opacity:(selectedBar&&!isSelected)?0.35:b.isToday?1:0.8,transition:"opacity .2s"}}/>
                  </div>
                  {/* ラベル: 棒グラフの下 */}
                  <div style={{marginTop:3,textAlign:"center",lineHeight:1.4,maxWidth:barW}}>
                    {period==="monthly" ? (
                      // 毎月: 年と月を同サイズ
                      <>
                        <div style={{fontSize:11,color:isSelected?T.accent:T.text+"55",fontWeight:isSelected?700:400}}>{b.year}年</div>
                        <div style={{fontSize:11,color:labelColor,fontWeight:labelWeight}}>{b.month+1}月</div>
                      </>
                    ) : period==="weekly" ? (
                      // 毎週: 年 → 日付範囲（同サイズ）
                      <>
                        <div style={{fontSize:12,color:isSelected?T.accent:T.text+"55",fontWeight:isSelected?700:400}}>{b.yearLabel}</div>
                        <div style={{fontSize:12,color:labelColor,fontWeight:labelWeight,whiteSpace:"nowrap"}}>{b.label}</div>
                      </>
                    ) : (
                      <div style={{fontSize:11,color:labelColor,fontWeight:labelWeight}}>{b.label}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
        {[["7日平均",avg7],["30日平均",avg30]].map(([lbl,v])=>(
          <div key={lbl} style={{background:T.card,borderRadius:13,padding:"11px 14px",textAlign:"center"}}>
            <div style={{fontSize:12,color:T.text+"77",marginBottom:4}}>{lbl}</div>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:18,fontWeight:700,color:v>=target?T.primary:(state.themeName==="night"?"#DC2626":["atrium","navyrose","deepteal","elegan","ashviolet","blushhemp"].includes(state.themeName)?(state.themeName==="atrium"?"#5A452C":T.soft):"#E88080")}}>{fmtHM(v)}</div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:6,marginBottom:10}}>
        <button className={`btn bsm ${statsView==="breakdown"?"bp":"bs"}`} onClick={()=>setStatsView("breakdown")} style={{flex:1}}>取り外し内訳</button>
        <button className={`btn bsm ${statsView==="pieces"?"bp":"bs"}`} onClick={()=>setStatsView("pieces")} style={{flex:1}}>装着時間</button>
      </div>

      {statsView==="breakdown"
        ? (() => {
            const activeBar = selectedBar || bars.find(b=>b.isToday) || bars[bars.length-1];
            const isDefault = !selectedBar;
            const bd = getBreakdownForBar(activeBar);
            const rt = Object.values(bd).reduce((a,v)=>a+v,0)||1;
            const labelStr = activeBar
              ? (period==="daily" ? activeBar.key : period==="weekly" ? activeBar.label : `${activeBar.year}年${activeBar.month+1}月`)
              : null;
            const titleStr = isDefault && period==="daily"
              ? "取り外し内訳 (今日)"
              : labelStr ? `取り外し内訳 (${labelStr})` : "取り外し内訳";
            return Object.keys(bd).length>0 ? (
              <div className="card">
                <div className="ct">{titleStr}</div>
                {Object.entries(bd).sort((a,b)=>b[1]-a[1]).map(([r,s])=>(
                  <div key={r} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <span style={{fontSize:13,minWidth:52,color:T.text}}>{r}</span>
                    <div style={{flex:1,height:8,background:T.soft,borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:`${(s/rt)*100}%`,background:T.primary,borderRadius:99}}/></div>
                    <span style={{fontSize:13,fontWeight:700,color:T.primary,minWidth:58,textAlign:"right"}}>{fmt(s)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card" style={{textAlign:"center",color:T.text+"55",padding:"18px 0",fontSize:14}}>この期間の取り外し記録がありません</div>
            );
          })()
        : <div className="card">
            <div className="ct">ピース別 合計装着時間</div>
            <div style={{maxHeight:260,overflowY:"auto"}}>
              {pieceWearList.map(({n,label,rangeLabel,total})=>{
                const isAct=n===state.currentPiece;
                return(
                  <div key={n} className="wr" style={{opacity:(total===0&&!isAct)?0.45:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:0}}>
                      <div style={{width:22,height:22,borderRadius:"50%",background:isAct?T.primary:T.soft,color:isAct?"#fff":T.text,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>#{label}</div>
                      <span style={{fontSize:12,color:T.text+"99",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:160}}>{rangeLabel}</span>
                    </div>
                    <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,color:isAct?T.primary:T.text+"88",fontSize:14,flexShrink:0}}>{fmt(total)}</span>
                  </div>
                );
              })}
            </div>
          </div>
      }

      {selectedDay&&period==="daily"&&(
        <div className="mo" onClick={()=>setSelectedBar(null)}>
          <div className="md" onClick={e=>e.stopPropagation()}>
            <div className="mdtitle">{selectedDay}</div>
            <div style={{marginBottom:10,textAlign:"center"}}>
              <div style={{fontSize:13,color:T.text+"66",marginBottom:2}}>装着時間</div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:24,fontWeight:700,color:(effectiveLog[selectedDay]||0)>=target?T.primary:(["atrium","navyrose","deepteal","elegan","ashviolet","blushhemp"].includes(state.themeName)?(state.themeName==="atrium"?"#5A452C":T.soft):"#E88080")}}>{effectiveLog[selectedDay]?fmt(effectiveLog[selectedDay]):"記録なし"}</div>
            </div>
            {Object.keys(dayReasons).length>0&&<>
              <div className="ct">取り外し内訳</div>
              {Object.entries(dayReasons).sort((a,b)=>b[1]-a[1]).map(([r,s])=>{
                const tot=Object.values(dayReasons).reduce((a,v)=>a+v,0)||1;
                return(<div key={r} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <span style={{fontSize:13,minWidth:52,color:T.text}}>{r}</span>
                  <div style={{flex:1,height:8,background:T.soft,borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:`${(s/tot)*100}%`,background:T.primary,borderRadius:99}}/></div>
                  <span style={{fontSize:13,fontWeight:700,color:T.primary,minWidth:58,textAlign:"right"}}>{fmt(s)}</span>
                </div>);
              })}
            </>}
            <button className="btn bs" style={{width:"100%",marginTop:8}} onClick={()=>setSelectedBar(null)}>閉じる</button>
          </div>
        </div>
      )}
      {showReportModal&&<ReportModal T={T} state={state} onClose={()=>setShowReportModal(false)}/>}
      {showReportPreview&&(
        <div className="mo" onClick={()=>setShowReportPreview(false)}>
          <div className="md" onClick={e=>e.stopPropagation()} style={{textAlign:"center"}}>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:15,fontWeight:700,color:T.primary,marginBottom:4}}>レポートプレビュー</div>
            <div style={{fontSize:12,color:T.text+"88",marginBottom:4}}>サンプルデータによるイメージです</div>
            <div style={{fontSize:12,color:T.accent,fontWeight:600,marginBottom:12}}>🔒 PDF出力はプレミアム機能でご利用いただけます</div>
            <div style={{borderRadius:10,overflow:"hidden",marginBottom:14,border:`1px solid ${T.soft}`,maxHeight:"60dvh",overflowY:"auto"}}>
              <img src={PDF_PREVIEW_IMG} alt="PDFプレビュー" style={{width:"100%",display:"block"}}/>
            </div>
            <button className="btn bs" style={{width:"100%"}} onClick={()=>setShowReportPreview(false)}>閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
}

