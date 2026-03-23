// ── ONBOARDING ───────────────────────────────────────────────────────────────
// ── ONBOARDING DATE PICKER (ネイティブカレンダー) ──────────────────────────
function ObDatePicker({value,onChange,T}){
  const today=new Date();
  const display=value
    ? value.replace(/-/g,"－")
    : `${today.getFullYear()}－${String(today.getMonth()+1).padStart(2,"0")}－${String(today.getDate()).padStart(2,"0")}`;
  return(
    <div style={{textAlign:"center",position:"relative",display:"inline-block"}}>
      {/* 日付テキスト表示（タッチ不可・見た目専用） */}
      <div style={{
        fontFamily:"'Outfit',sans-serif",fontSize:28,fontWeight:700,color:T.primary,
        borderBottom:`3px solid ${T.primary}`,paddingBottom:4,letterSpacing:1,
        userSelect:"none",pointerEvents:"none"}}>
        {display}
      </div>
      {/* inputを完全に重ねてタッチを受け取る（iOS Safari対応） */}
      <input type="date" value={value} onChange={e=>onChange(e.target.value)}
        className="ob-input"
        style={{
          position:"absolute",inset:0,width:"100%",height:"100%",
          opacity:0,cursor:"pointer",
          WebkitAppearance:"none",appearance:"none",
          fontSize:16 /* iOS zoom防止 */
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

  const spinStyle={width:39,height:39,borderRadius:"50%",border:"2px solid",borderColor:"inherit",
    background:"transparent",fontSize:19,cursor:"pointer",color:"inherit",
    display:"flex",alignItems:"center",justifyContent:"center"};

  const numBig={fontSize:47,fontWeight:700,fontFamily:"'Outfit',sans-serif"};

  const STEP_COUNT=4;
  const isLast=step===STEP_COUNT-1;

  const canNext=()=>{
    if(step===0) return !!startDate;
    if(step===1) return totalPieces>=1;
    if(step===2) return intervalDays>=1;
    if(step===3) return targetHours>=1;
    return true;
  };

  const handleNext=()=>{
    if(!canNext()) return;
    if(isLast){
      onComplete({startDate,totalPieces,intervalDays,targetWearHours:targetHours});
    } else {
      setStep(s=>s+1);
    }
  };

  const renderContent=()=>{
    if(step===0) return(
      <ObDatePicker value={startDate} onChange={setStartDate} T={T}/>
    );
    if(step===1) return(
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16}}>
        <button style={spinStyle} onClick={()=>setTotalPieces(v=>Math.max(1,v-1))}>−</button>
        <div style={{textAlign:"center",minWidth:80}}>
          <span style={numBig}>{totalPieces}</span>
          <span style={{fontSize:16,marginLeft:6}}>枚</span>
        </div>
        <button style={spinStyle} onClick={()=>setTotalPieces(v=>v+1)}>＋</button>
      </div>
    );
    if(step===2) return(
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16}}>
        <button style={spinStyle} onClick={()=>setIntervalDays(v=>Math.max(1,v-1))}>−</button>
        <div style={{textAlign:"center",minWidth:80}}>
          <span style={numBig}>{intervalDays}</span>
          <span style={{fontSize:16,marginLeft:6}}>日ごと</span>
        </div>
        <button style={spinStyle} onClick={()=>setIntervalDays(v=>v+1)}>＋</button>
      </div>
    );
    if(step===3) return(
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16}}>
        <button style={spinStyle} onClick={()=>setTargetHours(v=>Math.max(1,v-1))}>−</button>
        <div style={{textAlign:"center",minWidth:80}}>
          <span style={numBig}>{targetHours}</span>
          <span style={{fontSize:16,marginLeft:6}}>時間</span>
        </div>
        <button style={spinStyle} onClick={()=>setTargetHours(v=>Math.min(24,v+1))}>＋</button>
      </div>
    );
  };

  const titles=["矯正開始日","マウスピース枚数","交換スケジュール","装着目標時間"];
  const subs=["マウスピース矯正を始めた日を教えてください","治療で使用するマウスピースの合計枚数を教えてください","マウスピースを何日ごとに交換しますか？","1日に装着したい目標時間を設定してください"];
  const valid=canNext();

  return(
    <div style={{position:"fixed",inset:0,background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,zIndex:9999}}>
      <div style={{marginBottom:40,textAlign:"center"}}>
        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:28,fontWeight:800,color:T.primary,letterSpacing:1}}>SmileTrack</div>
        <div style={{fontSize:14,color:T.text+"66",marginTop:2}}>マウスピース矯正管理</div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:40}}>
        {Array.from({length:STEP_COUNT},(_,i)=>(
          <div key={i} style={{width:i===step?24:8,height:8,borderRadius:4,
            background:i<=step?T.primary:T.soft,transition:"all 0.3s"}}/>
        ))}
      </div>
      <div style={{width:"100%",maxWidth:360,background:T.card,borderRadius:24,padding:"36px 28px",
        boxShadow:"0 8px 32px "+T.primary+"22",color:T.primary,textAlign:"center"}}>
        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:20,fontWeight:700,marginBottom:8,color:T.primary}}>{titles[step]}</div>
        <div style={{fontSize:14,color:T.text+"77",marginBottom:32,lineHeight:1.6}}>{subs[step]}</div>
        {renderContent()}
      </div>
      <button onClick={handleNext}
        style={{marginTop:32,width:"100%",maxWidth:360,padding:"16px",borderRadius:16,border:"none",
          background:valid?T.primary:T.soft,color:valid?"#fff":T.text+"44",
          fontSize:16,fontWeight:700,fontFamily:"'M PLUS Rounded 1c',sans-serif",
          cursor:valid?"pointer":"default",transition:"all 0.2s",letterSpacing:1}}>
        {isLast?"はじめる →":valid?"次へ →":"入力してください"}
      </button>
      {step>0&&(
        <button onClick={()=>setStep(s=>s-1)}
          style={{marginTop:12,background:"none",border:"none",color:T.text+"55",
            fontSize:15,cursor:"pointer",fontFamily:"'M PLUS Rounded 1c',sans-serif"}}>
          ← 戻る
        </button>
      )}
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
          <div style={{textAlign:"center"}}><div className="htitle">SmileTrack</div><div className="hsub">マウスピース矯正管理</div></div>
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
              <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,color:T.primary,fontSize:16}}>
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
