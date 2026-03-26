// ── ONBOARDING ───────────────────────────────────────────────────────────────
function ObDatePicker({value,onChange,T}){
  const today=new Date();
  const display=value
    ? value.replace(/-/g,"－")
    : `${today.getFullYear()}－${String(today.getMonth()+1).padStart(2,"0")}－${String(today.getDate()).padStart(2,"0")}`;
  return(
    <div style={{textAlign:"center",position:"relative",display:"inline-block"}}>
      <div style={{
        fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:28,fontWeight:700,color:T.primary,
        borderBottom:`3px solid ${T.primary}`,paddingBottom:4,letterSpacing:1,
        userSelect:"none",pointerEvents:"none"}}>
        {display}
      </div>
      <input type="date" value={value} onChange={e=>onChange(e.target.value)}
        className="ob-input"
        style={{
          position:"absolute",inset:0,width:"100%",height:"100%",
          opacity:0,cursor:"pointer",
          WebkitAppearance:"none",appearance:"none",
          fontSize:16
        }}/>
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

  // アイコン
  const CalIcon=()=><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="3.5" width="20" height="18" rx="4" stroke={T.primary} strokeWidth="1.7"/><path d="M2 9h20" stroke={T.primary} strokeWidth="1.7" strokeLinecap="round"/><rect x="7" y="3.5" width="3" height="5.5" rx="1.5" fill={T.primary}/><rect x="14" y="3.5" width="3" height="5.5" rx="1.5" fill={T.primary}/><rect x="6" y="12.5" width="4" height="3.5" rx="1.2" fill={T.accent}/><rect x="11" y="12.5" width="4" height="3.5" rx="1.2" fill={T.accent}/><rect x="6" y="17" width="4" height="3" rx="1.2" fill={T.primary}/></svg>;
  const ToothIcon=()=><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 19c0-3.9 2.7-7 6-7s6 3.1 6 7" stroke={T.primary} strokeWidth="1.7" strokeLinecap="round"/><ellipse cx="12" cy="19.5" rx="6" ry="2.5" stroke={T.primary} strokeWidth="1.7"/><circle cx="9" cy="10" r="1.8" fill={T.accent}/><circle cx="15" cy="10" r="1.8" fill={T.accent}/><path d="M10 7c0-1 .9-1.8 2-1.8s2 .8 2 1.8" stroke={T.accent} strokeWidth="1.4" strokeLinecap="round"/></svg>;
  const ClockIcon=()=><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={T.primary} strokeWidth="1.7"/><path d="M12 7v5l3.5 2" stroke={T.primary} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M4.5 5l2 2M19.5 5l-2 2" stroke={T.accent} strokeWidth="1.4" strokeLinecap="round"/></svg>;
  const TimerIcon=()=><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={T.primary} strokeWidth="1.7"/><circle cx="12" cy="12" r="2.5" fill={T.accent}/><path d="M12 5.5v2M12 16.5v2M5.5 12h2M16.5 12h2" stroke={T.accent} strokeWidth="1.4" strokeLinecap="round"/><path d="M12 9v3l2.5 1.5" stroke={T.primary} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>;

  const steps=[
    {icon:<CalIcon/>,  title:"矯正開始日",       desc:"マウスピース矯正を始める日を設定してください。進捗の基準日になります。"},
    {icon:<ToothIcon/>,title:"マウスピース合計枚数",desc:"治療で使用するマウスピースの総枚数を入力してください。"},
    {icon:<ClockIcon/>,title:"交換スケジュール",   desc:"マウスピースを何日ごとに交換しますか？"},
    {icon:<TimerIcon/>,title:"装着目標時間",       desc:"1日に装着したい目標時間を教えてください。"},
  ];

  const cardContent=()=>{
    if(step===0) return(
      <div style={{marginTop:"auto",textAlign:"center"}}>
        <ObDatePicker value={startDate} onChange={setStartDate} T={T}/>
      </div>
    );
    if(step===1) return(
      <div style={{marginTop:"auto",display:"flex",alignItems:"center",justifyContent:"center",gap:14}}>
        <input type="number" value={totalPieces} min={1} max={999} inputMode="numeric"
          onChange={e=>setTotalPieces(Math.max(1,parseInt(e.target.value)||1))}
          style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:62,fontWeight:800,
            color:T.primary,background:"transparent",border:"none",
            borderBottom:`2px solid ${T.soft}`,width:140,textAlign:"center",outline:"none",
            letterSpacing:-2,padding:"0 0 4px"}}/>
        <span style={{fontSize:16,fontWeight:700,color:T.text+"66",paddingBottom:8}}>枚</span>
      </div>
    );
    if(step===2) return(
      <div style={{marginTop:"auto",padding:"0 4px"}}>
        <div style={{display:"flex",alignItems:"baseline",justifyContent:"center",gap:5,marginBottom:20}}>
          <span style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:68,fontWeight:800,color:T.primary,letterSpacing:-3,lineHeight:1}}>{intervalDays}</span>
          <span style={{fontSize:15,fontWeight:700,color:T.text+"66",paddingBottom:10}}>日ごと</span>
        </div>
        <input type="range" min={3} max={15} value={intervalDays}
          onChange={e=>setIntervalDays(parseInt(e.target.value))}
          style={{width:"100%",height:6,borderRadius:99,outline:"none",cursor:"pointer",
            WebkitAppearance:"none",appearance:"none",
            background:`linear-gradient(to right,${T.primary} ${((intervalDays-3)/12)*100}%,${T.soft} ${((intervalDays-3)/12)*100}%)`}}/>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:10}}>
          <span style={{fontSize:11,fontWeight:700,color:T.text+"55"}}>3日</span>
          <span style={{fontSize:11,fontWeight:700,color:T.text+"55"}}>15日</span>
        </div>
      </div>
    );
    if(step===3) return(
      <div style={{marginTop:"auto",padding:"0 4px"}}>
        <div style={{display:"flex",alignItems:"baseline",justifyContent:"center",gap:5,marginBottom:20}}>
          <span style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:68,fontWeight:800,color:T.primary,letterSpacing:-3,lineHeight:1}}>{targetHours}</span>
          <span style={{fontSize:15,fontWeight:700,color:T.text+"66",paddingBottom:10}}>時間</span>
        </div>
        <input type="range" min={16} max={24} value={targetHours}
          onChange={e=>setTargetHours(parseInt(e.target.value))}
          style={{width:"100%",height:6,borderRadius:99,outline:"none",cursor:"pointer",
            WebkitAppearance:"none",appearance:"none",
            background:`linear-gradient(to right,${T.primary} ${((targetHours-16)/8)*100}%,${T.soft} ${((targetHours-16)/8)*100}%)`}}/>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:10}}>
          <span style={{fontSize:11,fontWeight:700,color:T.text+"55"}}>16時間</span>
          <span style={{fontSize:11,fontWeight:700,color:T.text+"55"}}>24時間</span>
        </div>
      </div>
    );
  };

  // 完了画面
  if(step===4) return(
    <div style={{position:"fixed",inset:0,background:T.bg,display:"flex",flexDirection:"column",padding:"52px 26px 36px",zIndex:9999}}>
      {/* デコレーション */}
      <div style={{position:"absolute",top:-80,right:-80,width:260,height:260,borderRadius:"50%",
        background:`radial-gradient(circle,${T.primary}22 0%,transparent 70%)`,pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:-60,left:-60,width:200,height:200,borderRadius:"50%",
        background:`radial-gradient(circle,${T.primary}14 0%,transparent 70%)`,pointerEvents:"none"}}/>

      <div style={{paddingTop:18,flexShrink:0}}>
        <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:28,fontWeight:900,color:T.text,letterSpacing:-0.5}}>
          Smile<span style={{color:T.primary}}>Track</span>
        </div>
        <div style={{fontSize:10,fontWeight:600,color:T.text+"66",letterSpacing:2,textTransform:"uppercase",marginTop:2}}>マウスピース矯正管理</div>
        <div style={{display:"flex",gap:5,marginTop:18}}>
          {[0,1,2,3].map(i=>(
            <div key={i} style={{flex:1,height:3,borderRadius:99,overflow:"hidden",background:T.soft}}>
              <div style={{height:"100%",width:"100%",borderRadius:99,background:`linear-gradient(90deg,${T.accent},${T.primary})`,opacity:0.5}}/>
            </div>
          ))}
        </div>
      </div>

      {/* 完了メイン */}
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",gap:10}}>
        {/* チェックリング */}
        <div style={{width:72,height:72,borderRadius:"50%",
          background:T.soft,border:`1.5px solid ${T.primary}33`,
          display:"flex",alignItems:"center",justifyContent:"center",marginBottom:4,
          boxShadow:`0 4px 18px ${T.primary}22`}}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M7 16l6 6 12-12" stroke={T.primary} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:26,fontWeight:900,color:T.text}}>設定完了</div>

        {/* 終了予定日カード */}
        <div style={{width:"100%",background:T.card,borderRadius:22,border:`1px solid ${T.primary}1a`,
          boxShadow:`0 4px 20px ${T.primary}14`,padding:"22px 24px 24px",marginTop:8}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:1.6,textTransform:"uppercase",color:T.text+"55",marginBottom:6}}>
            治療終了予定日
          </div>
          <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:36,fontWeight:900,
            color:T.primary,letterSpacing:-1,lineHeight:1.1}}>
            {endDate||"—"}
          </div>
          <div style={{width:32,height:2,background:T.soft,borderRadius:99,margin:"14px auto"}}/>
          <div style={{fontSize:13,fontWeight:600,color:T.text+"66",lineHeight:1.75}}>
            素敵な笑顔に向けて、一緒に頑張りましょう。
          </div>
        </div>
      </div>

      <div style={{flexShrink:0,paddingTop:16}}>
        <button onClick={()=>onComplete({startDate,totalPieces,intervalDays,targetWearHours:targetHours})}
          style={{width:"100%",height:56,border:"none",borderRadius:16,
            background:`linear-gradient(135deg,${T.primary},${T.accent})`,
            color:"#fff",fontFamily:"'M PLUS Rounded 1c',sans-serif",
            fontSize:16,fontWeight:800,cursor:"pointer",letterSpacing:0.3,
            boxShadow:`0 6px 20px ${T.primary}44`}}>
          はじめる →
        </button>
      </div>
    </div>
  );

  // 入力画面（step 0-3）
  return(
    <div style={{position:"fixed",inset:0,background:T.bg,display:"flex",flexDirection:"column",padding:"52px 26px 36px",zIndex:9999}}>
      {/* デコレーション */}
      <div style={{position:"absolute",top:-80,right:-80,width:260,height:260,borderRadius:"50%",
        background:`radial-gradient(circle,${T.primary}1a 0%,transparent 70%)`,pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:-60,left:-60,width:200,height:200,borderRadius:"50%",
        background:`radial-gradient(circle,${T.primary}10 0%,transparent 70%)`,pointerEvents:"none"}}/>

      {/* ヘッダー */}
      <div style={{paddingTop:18,flexShrink:0}}>
        <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:28,fontWeight:900,color:T.text,letterSpacing:-0.5}}>
          Smile<span style={{color:T.primary}}>Track</span>
        </div>
        <div style={{fontSize:10,fontWeight:600,color:T.text+"66",letterSpacing:2,textTransform:"uppercase",marginTop:2}}>マウスピース矯正管理</div>
        {/* プログレスバー */}
        <div style={{display:"flex",gap:5,marginTop:18}}>
          {[0,1,2,3].map(i=>(
            <div key={i} style={{flex:1,height:3,borderRadius:99,overflow:"hidden",background:T.soft}}>
              <div style={{height:"100%",width:i<step?"100%":i===step?"100%":"0%",borderRadius:99,
                background:`linear-gradient(90deg,${T.accent},${T.primary})`,
                opacity:i<step?0.5:1,transition:"width 0.5s cubic-bezier(0.34,1.2,0.64,1)"}}/>
            </div>
          ))}
        </div>
        <div style={{fontSize:10,fontWeight:700,color:T.text+"55",letterSpacing:0.5,marginTop:8}}>Step {step+1} / 4</div>
      </div>

      {/* カード */}
      <div style={{background:T.card,borderRadius:26,border:`1px solid ${T.primary}14`,
        padding:"26px 24px 28px",marginTop:20,flexShrink:0,position:"relative",overflow:"hidden",
        height:320,display:"flex",flexDirection:"column",
        boxShadow:`0 4px 24px ${T.primary}12`}}>
        {/* カード右上グロー */}
        <div style={{position:"absolute",top:0,right:0,width:100,height:100,pointerEvents:"none",
          background:`radial-gradient(circle at top right,${T.primary}14,transparent 70%)`}}/>
        {/* アイコン＋タイトル */}
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8,flexShrink:0}}>
          <div style={{width:44,height:44,borderRadius:14,background:T.soft,
            border:`1px solid ${T.primary}33`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            {steps[step].icon}
          </div>
          <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:18,fontWeight:800,color:T.text,letterSpacing:-0.3}}>
            {steps[step].title}
          </div>
        </div>
        <div style={{fontSize:12,fontWeight:500,color:T.text+"77",lineHeight:1.65,marginBottom:18,flexShrink:0}}>
          {steps[step].desc}
        </div>
        {cardContent()}
      </div>

      {/* スペーサー */}
      <div style={{flex:1,minHeight:0}}/>

      {/* ボタン */}
      <div style={{flexShrink:0,height:96,display:"flex",flexDirection:"column",justifyContent:"flex-start"}}>
        <button onClick={handleNext}
          style={{width:"100%",height:56,border:"none",borderRadius:16,
            background:canNext()?`linear-gradient(135deg,${T.primary},${T.accent})`:T.soft,
            color:canNext()?"#fff":T.text+"44",
            fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:16,fontWeight:800,
            cursor:canNext()?"pointer":"default",letterSpacing:0.3,
            boxShadow:canNext()?`0 6px 20px ${T.primary}44`:"none",transition:"all 0.2s"}}>
          {step===3?"はじめる →":"次へ →"}
        </button>
        {step>0&&(
          <button onClick={()=>setStep(s=>s-1)}
            style={{background:"none",border:"none",fontFamily:"'M PLUS Rounded 1c',sans-serif",
              fontSize:13,fontWeight:700,color:T.text+"55",cursor:"pointer",
              padding:12,textAlign:"center",transition:"color 0.2s"}}>
            ← 戻る
          </button>
        )}
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
