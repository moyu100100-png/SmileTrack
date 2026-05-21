// ── ONBOARDING ───────────────────────────────────────────────────────────────
function ObDatePicker({value,onChange,T}){
  const today=new Date();
  const dateVal=value||`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
  const [y,m,d]=dateVal.split("-");
  return(
    <div style={{textAlign:"center",position:"relative",display:"inline-block"}}>
      <div style={{userSelect:"none",pointerEvents:"none",borderBottom:`2px solid ${T.soft}`,paddingBottom:8,fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:35,fontWeight:800,color:T.primary,letterSpacing:-1,lineHeight:1.2}}>
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
    {icon:<CalIcon/>,   title:t("obStartDate")},
    {icon:<ListIcon/>,  title:t("obTotalPieces")},
    {icon:<RepeatIcon/>,title:t("obSchedule")},
    {icon:<TimerIcon/>, title:t("obTarget")},
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
          style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:55,fontWeight:800,
            color:T.primary,width:150,textAlign:"center",outline:"none",
            letterSpacing:-2,lineHeight:1,borderBottomColor:T.soft}}/>
        <span style={{fontSize:15,fontWeight:700,color:T.text+"66",paddingBottom:10}}>{t("obPiecesUnit")}</span>
      </div>
    );
    if(step===2) return(
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 4px"}}>
        <div style={{display:"flex",alignItems:"baseline",justifyContent:"center",gap:5,marginBottom:20}}>
          <span style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:55,fontWeight:800,color:T.primary,letterSpacing:-2,lineHeight:1}}>{intervalDays}</span>
          <span style={{fontSize:15,fontWeight:700,color:T.text+"66",paddingBottom:10}}>{t("obDaysEvery")}</span>
        </div>
        <input type="range" min={3} max={15} value={intervalDays}
          onChange={e=>setIntervalDays(parseInt(e.target.value))}
          style={{width:"100%",height:8,borderRadius:99,outline:"none",cursor:"pointer",
            WebkitAppearance:"none",appearance:"none",
            background:`linear-gradient(to right,${T.primary} ${((intervalDays-3)/12)*100}%,${T.soft} ${((intervalDays-3)/12)*100}%)`}}/>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:10}}>
          <span style={{fontSize:11,fontWeight:700,color:T.text+"55"}}>{t("daysRange3")}</span>
          <span style={{fontSize:11,fontWeight:700,color:T.text+"55"}}>{t("daysRange15")}</span>
        </div>
      </div>
    );
    if(step===3) return(
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 4px"}}>
        <div style={{display:"flex",alignItems:"baseline",justifyContent:"center",gap:5,marginBottom:20}}>
          <span style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:55,fontWeight:800,color:T.primary,letterSpacing:-2,lineHeight:1}}>{targetHours}</span>
          <span style={{fontSize:15,fontWeight:700,color:T.text+"66",paddingBottom:10}}>{t("obHoursUnit")}</span>
        </div>
        <input type="range" min={16} max={24} value={targetHours}
          onChange={e=>setTargetHours(parseInt(e.target.value))}
          style={{width:"100%",height:8,borderRadius:99,outline:"none",cursor:"pointer",
            WebkitAppearance:"none",appearance:"none",
            background:`linear-gradient(to right,${T.primary} ${((targetHours-16)/8)*100}%,${T.soft} ${((targetHours-16)/8)*100}%)`}}/>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:10}}>
          <span style={{fontSize:11,fontWeight:700,color:T.text+"55"}}>{t("hoursRange16")}</span>
          <span style={{fontSize:11,fontWeight:700,color:T.text+"55"}}>{t("hoursRange24")}</span>
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
      <div style={{fontSize:12,fontWeight:600,color:T.text+"66",letterSpacing:2,marginTop:2}}>{t("appSub")}</div>
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
    <div style={{position:"fixed",inset:0,background:T.bg,display:"flex",flexDirection:"column",padding:"77px 26px 36px",zIndex:9999}}>
      <Header allDone={true}/>
      {/* Step行（fontSize:12 + marginTop:8 ≒ 28px）分の空白 */}
      <div style={{height:28,flexShrink:0}}/>

      {/* カード（height:320固定） */}
      <div style={{width:"100%",background:T.card,borderRadius:26,border:`1px solid ${T.primary}14`,
        boxShadow:`0 4px 24px ${T.primary}12`,padding:"28px 24px 28px",textAlign:"center",
        height:320,flexShrink:0,display:"flex",flexDirection:"column",justifyContent:"center"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>
          </svg>
        </div>
        <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:26,fontWeight:900,color:T.text+"99",marginBottom:8}}>{t("obComplete")}</div>
        <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:13,fontWeight:600,color:T.text+"66",lineHeight:1.75,marginBottom:16}}>
          {t("obCompleteMsg")}
        </div>
        <div style={{width:"100%",height:1,background:T.soft,marginBottom:16}}/>
        <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:14,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",color:T.text+"77",marginBottom:8}}>
          {t("obEndDate")}
        </div>
        <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:36,fontWeight:900,
          color:T.primary,letterSpacing:-1,lineHeight:1.1}}>
          {endDate||"—"}
        </div>
      </div>

      {/* ボタン（カード真下） */}
      <div style={{flexShrink:0,marginTop:16}}>
        <button onClick={()=>onComplete({startDate,totalPieces,intervalDays,targetWearHours:targetHours})}
          style={{width:"100%",height:56,border:"none",borderRadius:16,
            background:T.primary,color:"#fff",fontFamily:"'M PLUS Rounded 1c',sans-serif",
            fontSize:16,fontWeight:800,cursor:"pointer",letterSpacing:0.3,
            boxShadow:`0 6px 20px ${T.primary}44`,marginBottom:4}}>
          {t("start")}
        </button>
        <button onClick={()=>setStep(3)}
          style={{background:"none",border:"none",fontFamily:"'M PLUS Rounded 1c',sans-serif",
            fontSize:13,fontWeight:700,color:T.text+"44",cursor:"pointer",
            padding:12,textAlign:"center",width:"100%"}}>
          {t("back")}
        </button>
      </div>
    </div>
  );

  // 入力画面（step 0-3）
  return(
    <div style={{position:"fixed",inset:0,background:T.bg,display:"flex",flexDirection:"column",padding:"77px 26px 36px",zIndex:9999}}>
      <Header/>

      {/* カード（height:320固定） */}
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

      {/* ボタン（カード真下） */}
      <div style={{flexShrink:0,marginTop:16}}>
        <button onClick={handleNext}
          style={{width:"100%",height:56,border:"none",borderRadius:16,
            background:canNext()?T.primary:T.soft,
            color:canNext()?"#fff":T.text+"44",
            fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:16,fontWeight:800,
            cursor:canNext()?"pointer":"default",letterSpacing:0.3,
            boxShadow:canNext()?`0 6px 20px ${T.primary}44`:"none",transition:"all 0.2s",marginBottom:4}}>
          {step===3?t("start"):t("next")}
        </button>
        {step>0?(
          <button onClick={()=>setStep(s=>s-1)}
            style={{background:"none",border:"none",fontFamily:"'M PLUS Rounded 1c',sans-serif",
              fontSize:13,fontWeight:700,color:T.text+"44",cursor:"pointer",
              padding:12,textAlign:"center",width:"100%"}}>
            {t("back")}
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
      // isPremium/noAdsはstateに保存しない（RevenueCatから毎回取得）
      isPremium: IS_PREMIUM,
      noAds: false,
    };
  });
  // isPremium/noAdsはstateと分離して管理（インポートの影響を受けない）
  const [isPremium,setIsPremium]=useState(IS_PREMIUM);
  const [noAds,setNoAds]=useState(false);

  const [tab,setTab]=useState("home");
  const [drawerOpen,setDrawerOpen]=useState(false);
  const [drawerSection,setDrawerSection]=useState(null);
  const [showResetConfirm,setShowResetConfirm]=useState(false);
  const [showAffiliatePopup,setShowAffiliatePopup]=useState(false);
  const [snoozedUntil,setSnoozedUntil]=useState(null);
  const alarmStopped=state.alarmStopped||false;
  const setAlarmStopped=(v)=>update({alarmStopped:v});

  // RC初期化 → 結果確定後にAdMob初期化（競合防止）
  useEffect(()=>{
    (async()=>{
      let premium=false;
      let noAdsVal=false;
      try{
        await Purchases.configure();
        const plugin=Purchases._plugin();
        if(plugin){
          try{
            const info=await plugin.getCustomerInfo();
            const customerData=info?.customerInfo??info;
            const active=customerData?.entitlements?.active??{};
            premium=active["premium"]!=null;
            noAdsVal=active["no_ads"]!=null;
            setIsPremium(IS_PREMIUM||premium);
            setNoAds(noAdsVal);
          }catch(e){
            console.warn("[RC] getCustomerInfo error",e);
          }
        }
      }catch(e){
        console.warn("[RC] init error",e);
      }
      // RC確定後にAdMob初期化（noAds/premiumが判明してから広告を出す）
      if(!state.onboardingDone) return;
      if(IS_PREMIUM||premium||noAdsVal){
        AdMobHelper.removeBanner();
      } else {
        await AdMobHelper.initialize();
        await AdMobHelper.prepareInterstitial();
        await AdMobHelper.showBanner();
      }
    })();
  },[]);

  // ドロワー・モーダル・理由選択ポップアップ表示中は広告を非表示
  const [reasonPopupOpen, setReasonPopupOpen] = useState(false);
  const isOverlayOpen = drawerOpen || !!drawerSection || reasonPopupOpen;
  useEffect(()=>{
    if(isPremium||noAds) return;
    if(isOverlayOpen){
      AdMobHelper.hideBanner();
    } else {
      if(!isPremium&&!noAds) AdMobHelper.showBanner();
    }
  },[isOverlayOpen,isPremium,noAds]);

  // アフィリエイトポップアップ: 7日後に1回、30日後から30日ごと
  useEffect(()=>{
    if(!state.startDate) return;
    const startMs=new Date(state.startDate+"T00:00:00").getTime();
    const now=Date.now();
    const elapsedDays=Math.floor((now-startMs)/86400000);
    const hour=new Date().getHours();
    if(hour<15) return;
    const today=todayStr;
    const lastShown=state.affiliatePopupShown||null;
    if(lastShown===today) return;
    const shown7=state.affiliatePopupShown7||false;
    if(elapsedDays>=7&&!shown7){
      const t=setTimeout(()=>{
        setShowAffiliatePopup("week1");
        update({affiliatePopupShown:today,affiliatePopupShown7:true});
      },3000);
      return()=>clearTimeout(t);
    }
    if(elapsedDays<30) return;
    if(lastShown){
      const lastMs=new Date(lastShown+"T00:00:00").getTime();
      if((now-lastMs)<30*86400000) return;
    }
    const t=setTimeout(()=>{
      setShowAffiliatePopup("monthly");
      update({affiliatePopupShown:today});
    },3000);
    return()=>clearTimeout(t);
  },[state.startDate,state.affiliatePopupShown,state.affiliatePopupShown7]);

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

  useEffect(()=>{
    // nextExchangeDateを計算してからスケジュール
    const list = buildPieceList(state);
    if(list.length && state.startDate){
      const info = getCurrentPieceInfo(state, todayStr);
      const daysLeft = info.interval - info.dayNum + 1;
      const exchMs = new Date(todayStr+"T00:00:00").getTime() + daysLeft*86400000;
      const exchDate = new Date(exchMs);
      const exchStr = `${exchDate.getFullYear()}-${String(exchDate.getMonth()+1).padStart(2,"0")}-${String(exchDate.getDate()).padStart(2,"0")}`;
      const stateWithExch = {...state, nextExchangeDate: exchStr};
      scheduleExchangeNotif(stateWithExch);
      schedulePhotoNotif(stateWithExch);
    }
  },[]);

  const update=useCallback(patch=>setState(s=>({...s,...patch})),[]);
  const T=THEMES[state.themeName]||THEMES.blush||Object.values(THEMES)[0];
  // 通知バナーのアラーム停止・スヌーズアクション受信
  useEffect(()=>{
    if(!Notif.isCapacitor()) return;
    const handler=(event)=>{
      const action=event.detail?.action;
      if(action==="stop"){
        stopAlarmSound();
        Notif.cancel([1001]);
        setAlarmStopped(true);
      } else if(action==="snooze"){
        stopAlarmSound();
        Notif.cancel([1001]);
        const snoozeMs=Date.now()+5*60000;
        setSnoozedUntil(snoozeMs);
        Notif.schedule(1001,t("alarm"),t("alarmFromTimer").replace("{min}",state.alarmMinutes||30),snoozeMs,(state.alarmSound||"tone1")+".caf",true);
      }
    };
    window.addEventListener("AlarmAction",handler);
    return()=>window.removeEventListener("AlarmAction",handler);
  },[state.alarmMinutes,state.alarmSound,setAlarmStopped,setSnoozedUntil]);

  // bodyの背景色をテーマに合わせて更新（セーフエリアの白帯を防ぐ）
  useEffect(()=>{
    document.body.style.background=T.bg;
    document.documentElement.style.background=T.bg;
  },[T.bg]);

  // オンボーディング完了処理
  const handleOnboardingComplete=useCallback(async(settings)=>{
    update({...settings,onboardingDone:true});
    // 通知許可
    if(Notif.isCapacitor()){
      await Notif.requestPermission();
    }
    // ATT許可（通知許可の次、AdMob初期化より前）
    if(ATTHelper.isCapacitor()){
      await ATTHelper.requestPermission();
    }
    // 広告初期化・表示
    if(!isPremium&&!noAds){
      await AdMobHelper.initialize();
      await AdMobHelper.prepareInterstitial();
      await AdMobHelper.showBanner();
    }
  },[update,isPremium,noAds]);

  // アラームモーダル（どのタブでも表示）
  const alarmSecs=(state.alarmMinutes||30)*60;
  const runningMsApp=state.timerRunning?state.timerElapsed+(Date.now()-(state.timerStart||Date.now())):0;
  const currentSecApp=Math.floor(runningMsApp/1000);
  const nowMsApp=Date.now();
  const isSnoozedApp=snoozedUntil&&nowMsApp<snoozedUntil;
  const isAlarmApp=state.alarmEnabled&&state.timerRunning&&!alarmStopped&&!isSnoozedApp&&currentSecApp>=alarmSecs;
  const isAlarmNowApp=isAlarmApp&&currentSecApp%60===0;
  const snoozeJustEndedApp=snoozedUntil&&nowMsApp>=snoozedUntil&&!alarmStopped&&currentSecApp>=alarmSecs&&currentSecApp%60===0;
  useTick(1000, state.timerRunning&&state.alarmEnabled);
  useEffect(()=>{
    if(isAlarmNowApp||snoozeJustEndedApp){
      playAlarmSound(state.alarmSound||"standard");
      if(snoozeJustEndedApp) setSnoozedUntil(null);
    }
  },[isAlarmNowApp,snoozeJustEndedApp]);

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

  // dayStart境界を越えたらタイマーを自動終了して翌日継続
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
      // 翌日も取り外し継続（0:00から新セッション開始）
      setState(s=>({...s,
        timerRunning:true,
        timerStart:todayDayStartMs,
        timerElapsed:0,
        timerSessions:allSess,
        dailyWearLog:dailyLog,
      }));
    }
  },[todayStr]);

  // handleRemoveButton — runningMsをここで計算しない（コンポーネント側で持つ）
  const handleRemoveButton=useCallback(async(runningMs)=>{
    if(!state.timerRunning){
      const startMs=Date.now();
      update({timerRunning:true,timerStart:startMs,timerElapsed:0,alarmStopped:false});
      // 通知許可を確認・リクエスト
      if(Notif.isCapacitor()){
        const granted=await Notif.checkPermission();
        if(!granted) await Notif.requestPermission();
      }
      // アラーム通知予約（Capacitor）
      if(Notif.isCapacitor()&&state.alarmEnabled){
        const mins=state.alarmMinutes||30;
        Notif.cancel([1001]);
        const alarmMs=startMs+mins*60000;
        const alarmSound=(state.alarmSound||"tone1")+".caf";
        Notif.schedule(1001,t("alarm"),t("alarmFromTimer").replace("{min}",mins),alarmMs,alarmSound,true);
      }
      // 放置防止アラート通知予約（設定した時間から1時間おき・最大12本）
      if(Notif.isCapacitor()&&state.forgetTimerAlert){
        const hrs=state.forgetTimerHours||4;
        const ids=Array.from({length:12},(_,i)=>1002+i);
        Notif.cancel(ids);
        for(let i=0;i<12;i++){
          const h=hrs+i;
          const ms=startMs+h*3600000;
          if(ms>Date.now()) Notif.schedule(1002+i,t("removeTimer"),t("removalExceeded").replace("{h}",h),ms);
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
      setAlarmStopped(false);setSnoozedUntil(null);
    }
  },[state,todayStr,todayDayStartMs,todayDayEndMs,update,setAlarmStopped,setSnoozedUntil]);

  const tabs=[
    {id:"home",   icon:c=>Icons.home(c),    label:t("tabHome")},
    {id:"calendar",icon:c=>Icons.calendar(c),label:t("tabCalendar")},
    {id:"photo",  icon:c=>Icons.camera(c),  label:t("tabPhoto")},
    {id:"timer",  icon:c=>Icons.timer(c),   label:t("tabTimer")},
    {id:"stats",  icon:c=>Icons.chart(c),   label:t("tabStats")},
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
          <button className="ham" onClick={()=>{setDrawerOpen(true);if(!isPremium&&!noAds)AdMobHelper.hideBanner();}}>{Icons.menu(T.primary,18)}</button>
          <div style={{textAlign:"center"}}><div className="htitle" style={{fontSize:18}}>SmileTrack</div></div>
          <div style={{width:32}}/>
        </div>
        <div className="content">
          {tab==="home"    &&<HomePage T={T} state={{...state,isPremium,noAds}} update={update} todayStr={todayStr} todayDayStartMs={todayDayStartMs} onGoTimer={()=>setTab("timer")}/>}
          {tab==="calendar"&&<CalendarPage T={T} state={{...state,isPremium,noAds}} update={update} todayStr={todayStr} todayDayStartMs={todayDayStartMs}/>}
          {tab==="photo"   &&<PhotoPage T={T} state={{...state,isPremium,noAds}} update={update} todayStr={todayStr}/>}
          {tab==="timer"   &&<TimerPage T={T} state={{...state,isPremium,noAds}} update={update} handleRemoveButton={handleRemoveButton} todayStr={todayStr} todayDayStartMs={todayDayStartMs} snoozedUntil={snoozedUntil} setSnoozedUntil={setSnoozedUntil} alarmStopped={alarmStopped} setAlarmStopped={setAlarmStopped} onReasonPopup={setReasonPopupOpen}/>}
          {tab==="stats"   &&<StatsPage T={T} state={{...state,isPremium,noAds}} update={update} todayStr={todayStr} todayDayStartMs={todayDayStartMs}/>}
        </div>

        <div className="nav" style={{paddingBottom:(!isPremium&&!noAds)?`calc(env(safe-area-inset-bottom, 0px) + 35px)`:`0px`}}>
          {tabs.map(t=>{const active=tab===t.id;return(<button key={t.id} className={`nb${active?" on":""}`} onClick={()=>{
  setTab(t.id);
  if(!isPremium&&!noAds&&["calendar","stats","photo"].includes(t.id)&&t.id!==tab){
    AdMobHelper.showInterstitialIfReady();
  }
}}>{t.icon(active?T.primary:T.text+"44")}<span className="nb-lbl">{t.label}</span></button>);})}
        </div>
      </div>
      <Drawer T={T} open={drawerOpen} onClose={()=>setDrawerOpen(false)} onSection={setDrawerSection} onReset={()=>setShowResetConfirm(true)}/>
      {drawerSection==="color"        &&<ColorModal T={T} themeName={state.themeName} onPick={k=>update({themeName:k})} onClose={()=>setDrawerSection(null)} isPremiumProp={isPremium}/>}
      {drawerSection==="settings"     &&<SettingsModal T={T} state={state} onSave={(sf,th,sd,tp)=>update({settings:sf,targetWearHours:th,startDate:sd,totalPieces:tp})} onClose={()=>setDrawerSection(null)}/>}
      {drawerSection==="schedule"     &&<ScheduleModal T={T} state={state} update={update} onClose={()=>setDrawerSection(null)}/>}
      {drawerSection==="backup"       &&<BackupModal T={T} state={state} onImport={s=>setState(prev=>({...s,isPremium:prev.isPremium,noAds:prev.noAds}))} onClose={()=>setDrawerSection(null)}/>}
      {drawerSection==="notify"       &&<NotifyModal T={T} state={state} onSave={f=>{
        update(f);
        const list=buildPieceList(state);
        if(list.length&&state.startDate){
          const info=getCurrentPieceInfo(state,todayStr);
          const daysLeft=info.interval-info.dayNum+1;
          const exchMs=new Date(todayStr+"T00:00:00").getTime()+daysLeft*86400000;
          const exchDate=new Date(exchMs);
          const exchStr=`${exchDate.getFullYear()}-${String(exchDate.getMonth()+1).padStart(2,"0")}-${String(exchDate.getDate()).padStart(2,"0")}`;
          const stateWithExch={...state,...f,nextExchangeDate:exchStr};
          setTimeout(()=>scheduleExchangeNotif(stateWithExch),500);
          schedulePhotoNotif(stateWithExch);
        }
      }} onClose={()=>setDrawerSection(null)}/>}
      {drawerSection==="timerSettings"&&<TimerSettingsModal T={T} state={state} onSave={f=>update(f)} onClose={()=>setDrawerSection(null)} isPremiumProp={isPremium}/>}
      {drawerSection==="cameraSettings"&&<CameraSettingsModal T={T} state={state} onSave={f=>update(f)} onClose={()=>setDrawerSection(null)}/>}
      {drawerSection==="premium"&&<PremiumModal T={T} state={{...state,isPremium,noAds}} onClose={()=>setDrawerSection(null)} onPurchased={({isPremium:p,noAds:n})=>{setIsPremium(p);setNoAds(n);if(p||n)AdMobHelper.removeBanner();}}/>}
      {drawerSection==="about"&&<AboutModal T={T} onClose={()=>setDrawerSection(null)}/>}
      {drawerSection==="coffee"&&<PremiumModal T={T} state={{...state,isPremium,noAds}} onClose={()=>setDrawerSection(null)} showCoffee={true} onPurchased={({isPremium:p,noAds:n})=>{setIsPremium(p);setNoAds(n);if(p||n)AdMobHelper.removeBanner();}}/>}
      {showAffiliatePopup&&<AffiliatePopup T={T} type={showAffiliatePopup} onClose={()=>setShowAffiliatePopup(false)}/>}
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
        <div className="mo" style={{alignItems:"center"}}>
          <div className="md" style={{textAlign:"center",borderRadius:20,maxWidth:"90%"}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/></svg>
            </div>
            <div className="mdtitle" style={{marginBottom:8}}>{t("forgetAlert")}</div>
            <div style={{fontSize:15,color:T.text+"88",marginBottom:20,lineHeight:1.7}}>
              {t("forgetMsg")}<br/>
              <span style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontWeight:700,color:T.primary,fontSize:16}}>
                {Math.floor((Date.now()-(state.timerStart||Date.now()))/3600000)}{t("hourOver")}
              </span><br/>
              {t("moving")}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <button className="btn bp" style={{width:"100%",padding:"12px"}}
                onClick={()=>setShowForgetAlert(false)}>
                {t("keepGoing")}
              </button>
              <button style={{width:"100%",padding:"12px",border:"none",borderRadius:12,
                background:T.soft,color:T.text,fontWeight:600,cursor:"pointer",
                fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:16}}
                onClick={()=>{setShowForgetAlert(false);setTab("timer");}}>
                {t("goTimer")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* アラームモーダル（どのタブでも表示） */}
      {isAlarmApp&&(
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:500,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.55)",backdropFilter:"blur(4px)"}}>
          <div style={{background:T.card,borderRadius:28,padding:"36px 28px 28px",width:"82%",maxWidth:340,textAlign:"center",boxShadow:"0 8px 40px rgba(0,0,0,0.25)"}}>
            <div style={{marginBottom:8}}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/></svg>
            </div>
            <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:20,fontWeight:700,color:T.primary,marginBottom:6}}>{t("alarm")}</div>
            <div style={{fontSize:14,color:T.text+"88",marginBottom:28}}>{t("alarmFromTimer").replace("{min}",state.alarmMinutes||30)}</div>
            <button onClick={()=>{stopAlarmSound();Notif.cancel([1001]);setAlarmStopped(true);}}
              style={{width:"100%",padding:"16px",border:"none",borderRadius:16,fontSize:17,fontWeight:700,cursor:"pointer",fontFamily:"'M PLUS Rounded 1c',sans-serif",background:T.primary,color:"#fff",marginBottom:12}}>
              {t("alarmStop")}
            </button>
            <button onClick={()=>{
                stopAlarmSound();
                const snoozeMs=Date.now()+5*60*1000;
                setSnoozedUntil(snoozeMs);
                Notif.cancel([1001]);
                Notif.schedule(1001,t("alarm"),t("alarmFromTimer").replace("{min}",state.alarmMinutes||30),snoozeMs,(state.alarmSound||"tone1")+".caf",true);
              }}
              style={{width:"100%",padding:"14px",border:`1.5px solid ${T.soft}`,borderRadius:16,fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"'M PLUS Rounded 1c',sans-serif",background:"transparent",color:T.text}}>
              {t("snooze")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
