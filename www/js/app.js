// ── ONBOARDING ───────────────────────────────────────────────────────────────
function ObDatePicker({value,onChange,T}){
  const today=new Date();
  const dateVal=value||`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
  const [y,m,d]=dateVal.split("-");
  return(
    <div style={{textAlign:"center",position:"relative",display:"inline-block"}}>
      <div style={{userSelect:"none",pointerEvents:"none",borderBottom:`2px solid ${T.soft}`,paddingBottom:8,fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:40,fontWeight:800,color:T.primary,letterSpacing:-1,lineHeight:1.2}}>
        {y}－{m}－{d}
      </div>
      <input type="date" value={value} onChange={e=>onChange(e.target.value)}
        className="ob-input"
        style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0,cursor:"pointer",WebkitAppearance:"none",appearance:"none",fontSize:16}}/>
    </div>
  );
}

function OnboardingScreen({T,onComplete}){
  const [step,setStep]=useState(0);
  const [startDate,setStartDate]=useState(()=>{
    const n=new Date();
    return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`;
  });
  const [totalPieces,setTotalPieces]=useState(20);
  const [targetHours,setTargetHours]=useState(22);
  const [intervalDays,setIntervalDays]=useState(7);

  const STEP_COUNT=5; // 0-3: 入力, 4: 完了
  const isComplete=step===4;

  const canNext=()=>{
    if(step===0) return !!startDate;
    if(step===1) return totalPieces>=1;
    if(step===2) return intervalDays>=1;
    if(step===3) return targetHours>=1;
    return true;
  };

  const handleNext=()=>{
    if(!canNext()) return;
    if(step===3){
      setStep(4);
    } else if(step===4){
      onComplete({startDate,totalPieces,intervalDays,targetWearHours:targetHours});
    } else {
      setStep(s=>s+1);
    }
  };

  // 終了予定日計算
  const endDate=React.useMemo(()=>{
    if(!startDate||!totalPieces||!intervalDays) return null;
    const end=new Date(new Date(startDate+"T00:00:00").getTime()+totalPieces*intervalDays*86400000);
    const y=end.getFullYear();
    const m=String(end.getMonth()+1).padStart(2,"0");
    const d=String(end.getDate()).padStart(2,"0");
    return `${y} / ${m} / ${d}`;
  },[startDate,totalPieces,intervalDays]);

  // アイコン（Lucideスタイル）
  const CalIcon=()=><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 14h1v4"/><path d="M16 2v4"/><path d="M3 10h18"/><path d="M8 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/></svg>;
  const ListIcon=()=><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5h10"/><path d="M11 12h10"/><path d="M11 19h10"/><path d="M4 4h1v5"/><path d="M4 9h2"/><path d="M6.5 20H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02"/></svg>;
  const RepeatIcon=()=><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 9 3-3 3 3"/><path d="M13 18H7a2 2 0 0 1-2-2V6"/><path d="m22 15-3 3-3-3"/><path d="M11 6h6a2 2 0 0 1 2 2v10"/></svg>;
  const TimerIcon=()=><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/></svg>;

  const steps=[
    {icon:<CalIcon/>,   title:"矯正開始日"},
    {icon:<ListIcon/>,  title:"マウスピース合計枚数"},
    {icon:<RepeatIcon/>,title:"交換スケジュール"},
    {icon:<TimerIcon/>, title:"装着目標時間"},
  ];

  const cardContent=()=>{
    if(step===0) return(
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <ObDatePicker value={startDate} onChange={setStartDate} T={T}/>
      </div>
    );
    if(step===1) return(
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
        <input type="number" className="ob-num" value={totalPieces} min={1} max={999} inputMode="numeric"
          onChange={e=>setTotalPieces(Math.max(1,parseInt(e.target.value)||1))}
          style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:68,fontWeight:800,
            color:T.primary,width:160,textAlign:"center",outline:"none",
            letterSpacing:-3,lineHeight:1,borderBottomColor:T.soft}}/>
        <span style={{fontSize:15,fontWeight:700,color:T.text+"66",paddingBottom:10}}>枚</span>
      </div>
    );
    if(step===2) return(
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 4px"}}>
        <div style={{display:"flex",alignItems:"baseline",justifyContent:"center",gap:5,marginBottom:20}}>
          <span style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:68,fontWeight:800,color:T.primary,letterSpacing:-3,lineHeight:1}}>{intervalDays}</span>
          <span style={{fontSize:15,fontWeight:700,color:T.text+"66",paddingBottom:10}}>日ごと</span>
        </div>
        <input type="range" min={3} max={15} value={intervalDays}
          onChange={e=>setIntervalDays(parseInt(e.target.value))}
          style={{width:"100%",height:8,borderRadius:99,outline:"none",cursor:"pointer",
            WebkitAppearance:"none",appearance:"none",
            background:`linear-gradient(to right,${T.primary} ${((intervalDays-3)/12)*100}%,${T.soft} ${((intervalDays-3)/12)*100}%)`}}/>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:10}}>
          <span style={{fontSize:11,fontWeight:700,color:T.text+"55"}}>3日</span>
          <span style={{fontSize:11,fontWeight:700,color:T.text+"55"}}>15日</span>
        </div>
      </div>
    );
    if(step===3) return(
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 4px"}}>
        <div style={{display:"flex",alignItems:"baseline",justifyContent:"center",gap:5,marginBottom:20}}>
          <span style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:68,fontWeight:800,color:T.primary,letterSpacing:-3,lineHeight:1}}>{targetHours}</span>
          <span style={{fontSize:15,fontWeight:700,color:T.text+"66",paddingBottom:10}}>時間</span>
        </div>
        <input type="range" min={16} max={24} value={targetHours}
          onChange={e=>setTargetHours(parseInt(e.target.value))}
          style={{width:"100%",height:8,borderRadius:99,outline:"none",cursor:"pointer",
            WebkitAppearance:"none",appearance:"none",
            background:`linear-gradient(to right,${T.primary} ${((targetHours-16)/8)*100}%,${T.soft} ${((targetHours-16)/8)*100}%)`}}/>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:10}}>
          <span style={{fontSize:11,fontWeight:700,color:T.text+"55"}}>16時間</span>
          <span style={{fontSize:11,fontWeight:700,color:T.text+"55"}}>24時間</span>
        </div>
      </div>
    );
  };

  // 共通ヘッダー
  const Header=({allDone=false})=>(
    <div style={{paddingTop:18,flexShrink:0}}>
      <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:30,fontWeight:900,letterSpacing:-0.5}}>
        <span style={{color:T.text+"99"}}>Smile</span><span style={{color:T.primary}}>Track</span>
      </div>
      <div style={{fontSize:12,fontWeight:600,color:T.text+"66",letterSpacing:2,marginTop:2}}>マウスピース矯正管理</div>
      <div style={{display:"flex",gap:5,marginTop:18}}>
        {[0,1,2,3].map(i=>(
          <div key={i} style={{flex:1,height:5,borderRadius:99,overflow:"hidden",background:T.soft}}>
            <div style={{height:"100%",width:(allDone||i<step||i===step)?"100%":"0%",borderRadius:99,
              background:T.primary,opacity:allDone?0.5:i<step?0.5:1,
              transition:"width 0.5s cubic-bezier(0.34,1.2,0.64,1)"}}/>
          </div>
        ))}
      </div>
      {!allDone&&<div style={{fontSize:12,fontWeight:700,color:T.text+"66",letterSpacing:0.5,marginTop:8}}>Step {step+1} / 4</div>}
    </div>
  );

  // 完了画面
  if(step===4) return(
    <div style={{position:"fixed",inset:0,background:T.bg,display:"flex",flexDirection:"column",padding:"52px 26px 36px",zIndex:9999}}>
      <Header allDone={true}/>

      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <div style={{width:"100%",background:T.card,borderRadius:26,border:`1px solid ${T.primary}14`,
          boxShadow:`0 4px 24px ${T.primary}12`,padding:"28px 24px 28px",textAlign:"center"}}>
          {/* 握手アイコン */}
          <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>
            </svg>
          </div>
          <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:26,fontWeight:900,color:T.text+"99",marginBottom:20}}>設定完了</div>
          <div style={{width:"100%",height:1,background:T.soft,marginBottom:20}}/>
          <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:12,fontWeight:700,letterSpacing:1.6,textTransform:"uppercase",color:T.text+"44",marginBottom:8}}>
            治療終了予定日
          </div>
          <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:36,fontWeight:900,
            color:T.primary,letterSpacing:-1,lineHeight:1.1,marginBottom:16}}>
            {endDate||"—"}
          </div>
          <div style={{fontSize:13,fontWeight:600,color:T.text+"77",lineHeight:1.75}}>
            素敵な笑顔に向けて、一緒に頑張りましょう。
          </div>
        </div>
      </div>

      <div style={{flexShrink:0,paddingTop:16}}>
        <button onClick={()=>onComplete({startDate,totalPieces,intervalDays,targetWearHours:targetHours})}
          style={{width:"100%",height:56,border:"none",borderRadius:16,
            background:T.primary,color:"#fff",fontFamily:"'M PLUS Rounded 1c',sans-serif",
            fontSize:16,fontWeight:800,cursor:"pointer",letterSpacing:0.3,
            boxShadow:`0 6px 20px ${T.primary}44`,marginBottom:4}}>
          はじめる →
        </button>
        <button onClick={()=>setStep(3)}
          style={{background:"none",border:"none",fontFamily:"'M PLUS Rounded 1c',sans-serif",
            fontSize:13,fontWeight:700,color:T.text+"44",cursor:"pointer",
            padding:12,textAlign:"center",width:"100%"}}>
          ← 戻る
        </button>
      </div>
    </div>
  );

  // 入力画面（step 0-3）
  return(
    <div style={{position:"fixed",inset:0,background:T.bg,display:"flex",flexDirection:"column",padding:"52px 26px 36px",zIndex:9999}}>
      <Header/>

      {/* カード */}
      <div style={{background:T.card,borderRadius:26,border:`1px solid ${T.primary}14`,
        padding:"26px 24px 28px",marginTop:20,flexShrink:0,
        height:320,display:"flex",flexDirection:"column",
        boxShadow:`0 4px 24px ${T.primary}12`}}>
        {/* アイコン＋タイトル */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,marginBottom:16,flexShrink:0}}>
          <div style={{transform:"scale(1.4)",transformOrigin:"center"}}>
            {steps[step].icon}
          </div>
          <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:26,fontWeight:900,color:T.text+"99",letterSpacing:-0.3,textAlign:"center"}}>
            {steps[step].title}
          </div>
        </div>
        {cardContent()}
      </div>

      <div style={{flex:1,minHeight:0}}/>

      {/* ボタン */}
      <div style={{flexShrink:0,paddingTop:16}}>
        <button onClick={handleNext}
          style={{width:"100%",height:56,border:"none",borderRadius:16,
            background:canNext()?T.primary:T.soft,
            color:canNext()?"#fff":T.text+"44",
            fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:16,fontWeight:800,
            cursor:canNext()?"pointer":"default",letterSpacing:0.3,
            boxShadow:canNext()?`0 6px 20px ${T.primary}44`:"none",transition:"all 0.2s",marginBottom:4}}>
          {step===3?"はじめる →":"次へ →"}
        </button>
        {step>0?(
          <button onClick={()=>setStep(s=>s-1)}
            style={{background:"none",border:"none",fontFamily:"'M PLUS Rounded 1c',sans-serif",
              fontSize:13,fontWeight:700,color:T.text+"44",cursor:"pointer",
              padding:12,textAlign:"center",width:"100%"}}>
            ← 戻る
          </button>
        ):<div style={{height:37}}/>}
      </div>
    </div>
  );
}

// ── APP SHELL ────────────────────────────────────────────────────────────────
// ── カスタムフック: 必要なコンポーネントだけが毎秒tickする ──────────────────
function useTick(ms=1000, active=true){
  const [,setTick]=useState(0);
  useEffect(()=>{
    if(!active) return;
    const id=setInterval(()=>setTick(t=>t+1),ms);
    return()=>clearInterval(id);
  },[ms,active]);
}

function App(){
  // 起動時: localStorageから復元（なければdefaultState）
  const [state,setState]=useState(()=>{
    const saved=lsLoad();
    if(!saved) return defaultState();
    const def=defaultState();
    return {
      ...def,
      ...saved,
      photos:saved.photos||[],
      cameraSettings:{...def.cameraSettings,...(saved.cameraSettings||{})},
      settings:{...def.settings,...(saved.settings||{})},
      isPremium: IS_PREMIUM,
    };
  });
  const [tab,setTab]=useState("home");
  const [drawerOpen,setDrawerOpen]=useState(false);
  const [drawerSection,setDrawerSection]=useState(null);
  const [showResetConfirm,setShowResetConfirm]=useState(false);
  const [showAffiliatePopup,setShowAffiliatePopup]=useState(false);

  // アフィリエイトポップアップ: 矯正開始30日後から30日ごとに1回
  useEffect(()=>{
    if(!state.startDate) return;
    const startMs=new Date(state.startDate+"T00:00:00").getTime();
    const now=Date.now();
    const elapsedDays=Math.floor((now-startMs)/86400000);
    if(elapsedDays<30) return;
    const hour=new Date().getHours();
    if(hour<15) return; // 15時以降のみ表示
    const today=todayStr;
    const lastShown=state.affiliatePopupShown||null;
    if(lastShown===today) return;
    if(lastShown){
      const lastMs=new Date(lastShown+"T00:00:00").getTime();
      if((now-lastMs)<30*86400000) return;
    }
    const t=setTimeout(()=>{
      setShowAffiliatePopup(true);
      update({affiliatePopupShown:today});
    },3000);
    return()=>clearTimeout(t);
  },[state.startDate,state.affiliatePopupShown]);

  // 起動時: IndexedDBから写真dataを復元してstateに注入
  useEffect(()=>{
    idbLoadPhotos().then(idbPhotos=>{
      if(!idbPhotos.length) return;
      setState(s=>{
        // stateのphotos（メタ情報）とIndexedDBのdata（画像）をidで紐付け
        const dataMap={};
        idbPhotos.forEach(p=>{dataMap[p.id]=p.data;});
        const merged=(s.photos||[]).map(p=>({...p,data:dataMap[p.id]||p.data}));
        return {...s,photos:merged};
      });
    });
  },[]);

  useEffect(()=>{scheduleExchangeNotif(state);schedulePhotoNotif(state);},[]);

  const update=useCallback(patch=>setState(s=>({...s,...patch})),[]);
  const T=THEMES[state.themeName]||THEMES.blush||Object.values(THEMES)[0];

  // オンボーディング完了処理
  const handleOnboardingComplete=useCallback(async(settings)=>{
    update({...settings,onboardingDone:true});
    // オンボーディング完了時に通知許可を一度だけ求める
    if(Notif.isCapacitor()){
      await Notif.requestPermission();
    }
  },[update]);

  // 止め忘れダイアログ
  const [showForgetAlert,setShowForgetAlert]=useState(false);
  useEffect(()=>{
    const check=()=>{
      if(!state.timerRunning||!state.forgetTimerAlert) return;
      const elapsed=Date.now()-(state.timerStart||Date.now());
      const limitMs=(state.forgetTimerHours||4)*3600*1000;
      if(elapsed>limitMs) setShowForgetAlert(true);
    };
    check(); // 起動時即チェック
    const id=setInterval(check,60000); // 1分ごとにチェック
    return()=>clearInterval(id);
  },[state.timerRunning,state.timerStart,state.forgetTimerAlert,state.forgetTimerHours]);

  // state変化ごとに自動保存（300msデバウンス）
  useEffect(()=>{
    const id=setTimeout(()=>{
      lsSave(state);
      if(state.photos?.length){
        idbSavePhotos(state.photos.filter(p=>p.data));
      }
    },300);
    return()=>clearTimeout(id);
  },[state]);
  const dayStartHour = 0;

  // todayStr（0:00始まり固定）
  const getTodayStr = useCallback(()=>{
    const now=new Date();
    const pad=n=>String(n).padStart(2,"0");
    return `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
  },[]);

  const [todayStr,setTodayStr]=useState(getTodayStr);
  // 1分ごとにtodayStrだけ更新（日付切替検知）
  useEffect(()=>{
    const id=setInterval(()=>setTodayStr(getTodayStr()),60000);
    return()=>clearInterval(id);
  },[getTodayStr]);

  // 今日のdayStart境界（ミリ秒）
  const getDayStartMs=useCallback((ds)=>{
    return new Date(ds+"T00:00:00").getTime();
  },[]);

  const todayDayStartMs=getDayStartMs(todayStr);
  const todayDayEndMs=todayDayStartMs+86400000;

  const getTodaySessions=useCallback((sessions)=>
    (sessions||[]).filter(s=>sessInDay(s,todayDayStartMs,todayStr)),
  [todayDayStartMs,todayDayEndMs]);

  // currentPieceを自動計算で常に同期
  const autoInfo=getCurrentPieceInfo(state,todayStr);
  const autoCurrentPiece=autoInfo.pieceN;
  useEffect(()=>{
    if(state.currentPiece!==autoCurrentPiece) setState(s=>({...s,currentPiece:autoCurrentPiece}));
  },[autoCurrentPiece]);

  // dayStart境界を越えたらタイマーを自動終了
  useEffect(()=>{
    if(!state.timerRunning) return;
    const startMs=state.timerStart||Date.now();
    if(startMs<todayDayStartMs){
      const ms=Math.max(0,todayDayStartMs-startMs);
      const prevDs=dsFromDate(new Date(todayDayStartMs-1));
      const msCapped=Math.min(ms,86400000);
      const newSess={id:startMs,start:startMs,end:todayDayStartMs,ms:msCapped,reason:state._pendingReason||"",noReason:!state._pendingReason,comment:""};
      const allSess=[...(state.timerSessions||[]),newSess];
      const prevDayStart=getDayStartMs(prevDs);
      const prevMs=allSess.filter(s=>s.start>=prevDayStart&&s.start<todayDayStartMs).reduce((a,s)=>a+s.ms,0);
      const dailyLog={...(state.dailyWearLog||{})};
      dailyLog[prevDs]=Math.max(0,86400-Math.floor(prevMs/1000));
      setState(s=>({...s,timerRunning:false,timerStart:null,timerElapsed:0,timerSessions:allSess,dailyWearLog:dailyLog,_pendingReason:null}));
    }
  },[todayStr]);

  // handleRemoveButton — runningMsをここで計算しない（コンポーネント側で持つ）
  const handleRemoveButton=useCallback((runningMs)=>{
    if(!state.timerRunning){
      const startMs=Date.now();
      update({timerRunning:true,timerStart:startMs,timerElapsed:0});
      // アラーム通知予約（Capacitor）
      if(Notif.isCapacitor()&&state.alarmEnabled){
        const mins=state.alarmMinutes||30;
        Notif.cancel([1001]);
        Notif.schedule(1001,"⏰ アラーム",`取り外しから${mins}分が経過しました`,startMs+mins*60000);
      }
      // 放置防止アラート通知予約（設定した時間から1時間おき・最大12本）
      if(Notif.isCapacitor()&&state.forgetTimerAlert){
        const hrs=state.forgetTimerHours||4;
        const ids=Array.from({length:12},(_,i)=>1002+i);
        Notif.cancel(ids);
        for(let i=0;i<12;i++){
          const h=hrs+i;
          Notif.schedule(1002+i,"⚠️ タイマー放置防止",`取り外し中のタイマーが${h}時間を超えています`,startMs+h*3600000);
        }
      }
    } else {
      const endTime=Date.now(),startTime=state.timerStart||endTime;
      const cappedMs=Math.min(runningMs,86400000);
      const newSess={id:Date.now(),start:startTime,end:endTime,ms:cappedMs,reason:state._pendingReason||"",noReason:!state._pendingReason,comment:""};
      const allSess=[...(state.timerSessions||[]),newSess];
      const newRemovedMs=allSess.filter(s=>sessInDay(s,todayDayStartMs,todayStr)).reduce((a,s)=>a+s.ms,0);
      const dailyLog={...(state.dailyWearLog||{})};
      dailyLog[todayStr]=Math.max(0,86400-Math.floor(newRemovedMs/1000));
      update({timerRunning:false,timerStart:null,timerElapsed:0,timerSessions:allSess,dailyWearLog:dailyLog,_pendingReason:null});
      // 通知キャンセル
      if(Notif.isCapacitor()) Notif.cancel([1001,...Array.from({length:12},(_,i)=>1002+i)]);
    }
  },[state,todayStr,todayDayStartMs,todayDayEndMs,update]);

  const tabs=[
    {id:"home",   icon:c=>Icons.home(c),    label:"ホーム"},
    {id:"calendar",icon:c=>Icons.calendar(c),label:"カレンダー"},
    {id:"photo",  icon:c=>Icons.camera(c),  label:"写真"},
    {id:"timer",  icon:c=>Icons.timer(c),   label:"タイマー"},
    {id:"stats",  icon:c=>Icons.chart(c),   label:"統計"},
  ];

  // オンボーディング未完了なら表示（全フックの後）
  if(!state.onboardingDone){
    return(
      <>
        <style>{makeCSS(T)}</style>
        <OnboardingScreen T={T} onComplete={handleOnboardingComplete}/>
      </>
    );
  }

  return(
    <>
      <style>{makeCSS(T)}</style>
      <div className="app">
        <div className="hdr">
          <button className="ham" onClick={()=>setDrawerOpen(true)}>{Icons.menu(T.primary,18)}</button>
          <div style={{textAlign:"center"}}><div className="htitle" style={{fontSize:18}}>SmileTrack</div></div>
          <div style={{width:32}}/>
        </div>
        <div className="content">
          {tab==="home"    &&<HomePage T={T} state={state} todayStr={todayStr} todayDayStartMs={todayDayStartMs} onGoTimer={()=>setTab("timer")}/>}
          {tab==="calendar"&&<CalendarPage T={T} state={state} update={update} todayStr={todayStr} todayDayStartMs={todayDayStartMs}/>}
          {tab==="photo"   &&<PhotoPage T={T} state={state} update={update} todayStr={todayStr}/>}
          {tab==="timer"   &&<TimerPage T={T} state={state} update={update} handleRemoveButton={handleRemoveButton} todayStr={todayStr} todayDayStartMs={todayDayStartMs}/>}
          {tab==="stats"   &&<StatsPage T={T} state={state} update={update} todayStr={todayStr} todayDayStartMs={todayDayStartMs}/>}
        </div>
        <div className="nav">
          {tabs.map(t=>{const active=tab===t.id;return(<button key={t.id} className={`nb${active?" on":""}`} onClick={()=>setTab(t.id)}>{t.icon(active?T.primary:T.text+"44")}<span className="nb-lbl">{t.label}</span></button>);})}
        </div>
      </div>
      <Drawer T={T} open={drawerOpen} onClose={()=>setDrawerOpen(false)} onSection={setDrawerSection} onReset={()=>setShowResetConfirm(true)}/>
      {drawerSection==="color"        &&<ColorModal T={T} themeName={state.themeName} onPick={k=>update({themeName:k})} onClose={()=>setDrawerSection(null)}/>}
      {drawerSection==="settings"     &&<SettingsModal T={T} state={state} onSave={(sf,th,sd,tp)=>update({settings:sf,targetWearHours:th,startDate:sd,totalPieces:tp})} onClose={()=>setDrawerSection(null)}/>}
      {drawerSection==="schedule"     &&<ScheduleModal T={T} state={state} update={update} onClose={()=>setDrawerSection(null)}/>}
      {drawerSection==="backup"       &&<BackupModal T={T} state={state} onImport={s=>setState(s)} onClose={()=>setDrawerSection(null)}/>}
      {drawerSection==="notify"       &&<NotifyModal T={T} state={state} onSave={f=>{update(f);setTimeout(()=>scheduleExchangeNotif({...state,...f}),500);schedulePhotoNotif({...state,...f});}} onClose={()=>setDrawerSection(null)}/>}
      {drawerSection==="timerSettings"&&<TimerSettingsModal T={T} state={state} onSave={f=>update(f)} onClose={()=>setDrawerSection(null)}/>}
      {drawerSection==="cameraSettings"&&<CameraSettingsModal T={T} state={state} onSave={f=>update(f)} onClose={()=>setDrawerSection(null)}/>}
      {drawerSection==="premium"&&<PremiumModal T={T} state={state} onClose={()=>setDrawerSection(null)}/>}
      {drawerSection==="about"&&<AboutModal T={T} onClose={()=>setDrawerSection(null)}/>}
      {drawerSection==="coffee"&&<PremiumModal T={T} state={state} onClose={()=>setDrawerSection(null)} showCoffee={true}/>}
      {showAffiliatePopup&&<AffiliatePopup T={T} onClose={()=>setShowAffiliatePopup(false)}/>}
      {showResetConfirm&&<ResetConfirmModal T={T} onConfirm={()=>{
        localStorage.removeItem(LS_KEY);
        idbSavePhotos([]);
        setState(defaultState());
        setTab("home");
        setDrawerOpen(false);
        setShowResetConfirm(false);
      }} onCancel={()=>setShowResetConfirm(false)}/>}

      {/* 止め忘れアラートダイアログ */}
      {showForgetAlert&&(
        <div className="mo">
          <div className="md" style={{textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:8}}>⏰</div>
            <div className="mdtitle" style={{marginBottom:8}}>タイマー止め忘れでは？</div>
            <div style={{fontSize:15,color:T.text+"88",marginBottom:20,lineHeight:1.7}}>
              取り外し中のタイマーが<br/>
              <span style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontWeight:700,color:T.primary,fontSize:16}}>
                {Math.floor((Date.now()-(state.timerStart||Date.now()))/3600000)}時間以上
              </span><br/>
              動いています。
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <button className="btn bp" style={{width:"100%",padding:"12px"}}
                onClick={()=>setShowForgetAlert(false)}>
                このまま続ける
              </button>
              <button style={{width:"100%",padding:"12px",border:"none",borderRadius:12,
                background:T.soft,color:T.text,fontWeight:600,cursor:"pointer",
                fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:16}}
                onClick={()=>{setShowForgetAlert(false);setTab("timer");}}>
                タイマーページへ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
