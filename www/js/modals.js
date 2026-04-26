// ── TOAST ────────────────────────────────────────────────────────────────────
function showToast(msg, duration=2000){
  const existing=document.getElementById("st-toast");
  if(existing) existing.remove();
  const el=document.createElement("div");
  el.id="st-toast";
  el.textContent=msg;
  Object.assign(el.style,{
    position:"fixed",bottom:"120px",left:"50%",transform:"translateX(-50%)",
    background:"rgba(0,0,0,0.75)",color:"#fff",padding:"10px 20px",
    borderRadius:"20px",fontSize:"14px",fontWeight:"600",zIndex:"99999",
    fontFamily:"'M PLUS Rounded 1c',sans-serif",
    pointerEvents:"none",whiteSpace:"nowrap",
    transition:"opacity 0.3s",
  });
  document.body.appendChild(el);
  setTimeout(()=>{ el.style.opacity="0"; setTimeout(()=>el.remove(),300); },duration);
}

function HomePreviewModal({T,themeName,themeObj,onClose}){
  const svg=makeHomeSVG(themeObj);
  return(
    <div className="mo" onClick={onClose}>
      <div className="md" onClick={e=>e.stopPropagation()} style={{textAlign:"center",borderRadius:24,width:"90%",maxWidth:400}}>
        <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:15,fontWeight:700,color:T.primary,marginBottom:4}}>
          {t("previewTitle")}
        </div>
        <div style={{fontSize:12,color:T.text+"88",marginBottom:14}}>{t("previewSubTitle")}</div>
        <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
          <div style={{borderRadius:16,overflow:"hidden",boxShadow:"0 4px 20px #0002",border:`1px solid ${T.soft}`}}
            dangerouslySetInnerHTML={{__html:svg}}/>
        </div>
        <div style={{fontSize:12,color:T.accent,marginBottom:14,fontWeight:600}}>
          {t("previewPremiumMsg")}
        </div>
        <button className="btn bs" style={{width:"100%"}} onClick={onClose}>{t("close")}</button>
      </div>
    </div>
  );
}

// ── ABOUT MODAL ──────────────────────────────────────────────────────────────
function AboutModal({T,onClose}){
  const share=()=>{
    if(navigator.share){
      navigator.share({title:"SmileTrack",text:"マウスピース矯正の管理アプリ「SmileTrack」を使ってみてください！",url:"https://smiletrack.app"});
    } else {
      navigator.clipboard?.writeText("https://smiletrack.app");
      showToast(t("copiedUrl"));
    }
  };
  const docIcon=<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
  const lockIcon=<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
  const mailIcon=<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
  const starIcon=<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
  const shareIcon=<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
  const Row=({icon,label,onClick})=>(
    <div onClick={onClick} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 8px",borderBottom:`1px solid ${T.soft}`,cursor:"pointer",width:"100%",boxSizing:"border-box"}}>
      <span style={{flexShrink:0,width:22,display:"flex",justifyContent:"center"}}>{icon}</span>
      <span style={{fontSize:15,color:T.text,flex:1}}>{label}</span>
      <span style={{fontSize:14,color:T.text+"44",flexShrink:0}}>›</span>
    </div>
  );
  return(
    <div className="mo" onClick={onClose}>
      <div className="md" onClick={e=>e.stopPropagation()}>
        <div className="mdtitle">{t("aboutTitle")}</div>
        <div style={{fontSize:11,color:T.text+"55",marginBottom:16,textAlign:"center"}}>SmileTrack ver 1.0.0</div>

        <Row icon={docIcon} label={t("termsLabel")} onClick={()=>window.open("https://pickled-runner-04f.notion.site/ebd//329470522fe180399354fbae6be51bfb","_blank")}/>
        <Row icon={lockIcon} label={t("privacyLabel")} onClick={()=>window.open("https://pickled-runner-04f.notion.site/ebd//329470522fe180d884bfc0afe2d3dd94","_blank")}/>
        <Row icon={mailIcon} label={t("contactLabel")} onClick={()=>window.open("mailto:contact.appname@gmail.com")}/>
        <Row icon={starIcon} label={t("review")} onClick={()=>window.open("https://apps.apple.com/app/smiletrack","_blank")}/>
        <Row icon={starIcon} label={t("googlePlayReview")} onClick={()=>window.open("https://play.google.com/store/apps/details?id=app.smiletrack","_blank")}/>
        <Row icon={shareIcon} label={t("shareLabel")} onClick={share}/>

        <button className="btn bs" style={{width:"100%",marginTop:16}} onClick={onClose}>{t("close")}</button>
      </div>
    </div>
  );
}

// ── PREMIUM MODAL ────────────────────────────────────────────────────────────
function PremiumModal({T,state,onClose,showCoffee=false,onPurchased}){
  const [thankYou,setThankYou]=React.useState(false);
  const [loading,setLoading]=React.useState(false);
  const [errorMsg,setErrorMsg]=React.useState(null);
  const [selectedPlan,setSelectedPlan]=React.useState("yearly");
  const [prices,setPrices]=React.useState({});
  const [debugText,setDebugText]=React.useState("");


  // RevenueCatから実際の価格を取得（公式プラグイン版）
  React.useEffect(()=>{
    (async()=>{
      try{
        const isNative=Purchases._isNative();
        const plugin=Purchases._plugin();

        const offerings=await Purchases.getOfferings();

        console.log("[RC] PremiumModal packages:", offerings?.current?.availablePackages?.length ?? 0);
        const seen=new Set();
        const allPkgs=[];
        const addPkgs=(pkgs)=>{(pkgs||[]).forEach(pkg=>{const id=pkg.product?.identifier;if(id&&!seen.has(id)){seen.add(id);allPkgs.push(pkg);}});};
        addPkgs(offerings?.current?.availablePackages);
        Object.values(offerings?.all||{}).forEach(o=>addPkgs(o.availablePackages));
        const p={};
        allPkgs.forEach(pkg=>{
          const id=pkg.product?.identifier;
          const price=pkg.product?.priceString||pkg.product?.localizedPriceString;
          if(id&&price){
            Object.entries(RC_PRODUCTS).forEach(([key,val])=>{
              if(val===id) p[key]=price;
            });
          }
        });
        if(Object.keys(p).length>0) setPrices(p);
      }catch(e){
        console.warn("[RC] getOfferings error",e);
      }
    })();
  },[]);

  const handlePurchase=async(productKey)=>{
    setErrorMsg(null);
    setLoading(true);
    try{
      const productId=RC_PRODUCTS[productKey];
      const purchaseResult=await Purchases.purchaseProduct(productId);
      // 購入後にgetCustomerInfoを呼んで最新状態を確認
      const plugin=Purchases._plugin();
      const info=await plugin.getCustomerInfo();
      // デバッグ：getCustomerInfoの生データを表示
      setDebugText("getCustomerInfo raw:\n"+JSON.stringify(info).slice(0,600));
      // 両方のパスを試す
      const active1=info?.customerInfo?.entitlements?.active??{};
      const active2=info?.entitlements?.active??{};
      setDebugText(prev=>prev+"\n\nactive1(customerInfo.entitlements.active):\n"+JSON.stringify(active1));
      setDebugText(prev=>prev+"\n\nactive2(entitlements.active):\n"+JSON.stringify(active2));
      const active=Object.keys(active1).length>0?active1:active2;
      let isPremium=active["premium"]!=null;
      let noAds=active["no_ads"]!=null;
      setDebugText(prev=>prev+"\n\nisPremium:"+isPremium+" noAds:"+noAds);
      if(onPurchased) onPurchased({isPremium,noAds});
      if(productKey==="coffee"){ setThankYou(true); }
      else { onClose(); }
    }catch(e){
      if(e?.code==="PURCHASE_CANCELLED"||e?.message?.includes("cancel")||e?.message?.includes("Cancel")){
        // キャンセルはno-op
      } else {
        setErrorMsg(t("purchaseFailed"));
      }
    }finally{ setLoading(false); }
  };

  const handleRestore=async()=>{
    setErrorMsg(null);
    setLoading(true);
    try{
      const result=await Purchases.restorePurchases();
      const isPremium=result?.isPremium ?? await Purchases.isPremiumUser();
      const noAds=result?.noAds ?? await Purchases.hasNoAds();
      if(onPurchased) onPurchased({isPremium,noAds});
      if(isPremium){ onClose(); }
      else{ setErrorMsg(t("restoreNotFound")); }
    }catch(e){ setErrorMsg(t("restoreFailed")); }
    finally{ setLoading(false); }
  };
  if(showCoffee&&!thankYou) return(
    <div className="mo" onClick={onClose} style={{alignItems:"center",justifyContent:"center"}}>
      <div className="md" onClick={e=>e.stopPropagation()} style={{borderRadius:20,width:"90%",maxWidth:400,textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:12}}>☕</div>
        <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:18,fontWeight:700,color:T.primary,marginBottom:6}}>{t("coffeeTitle")}</div>
        <div style={{fontSize:13,color:T.text+"88",marginBottom:20,lineHeight:1.7}}>
          {t("coffeeDesc").split("\n").map((l,i)=><span key={i}>{l}<br/></span>)}
        </div>
        <button className="btn bp" style={{width:"100%",marginBottom:10,padding:"14px",fontSize:15}} onClick={()=>handlePurchase("coffee")} disabled={loading}>{loading?t("loading"):`${t("coffeeBuy")} ${prices.coffee||"---"}`}</button>
        <button className="btn bs" style={{width:"100%",padding:"14px",fontSize:15}} onClick={onClose}>{t("close")}</button>
      </div>
    </div>
  );
  const plans=[
    {id:"monthly", label:t("monthlyPlan"), price:prices.monthly||"---", sub:t("monthlySubLabel"), badge:null, desc:t("monthlyDesc")},
    {id:"yearly",  label:t("yearly"), price:prices.yearly||"---", sub:t("yearlySubLabel"), badge:t("recommended"), desc:t("yearlyDesc")},
    {id:"lifetime",label:t("lifetime"), price:prices.lifetime||"---", sub:t("lifetimeSubLabel"), badge:null, desc:t("lifetimeDesc")},
  ];
  const extras=[
    {id:"no_ads", label:t("noAds"), price:prices.no_ads||"---", desc:t("noAdsDesc")},
  ];

  if(thankYou) return(
    <div className="mo" onClick={onClose} style={{alignItems:"center",justifyContent:"center"}}>
      <div className="md" onClick={e=>e.stopPropagation()} style={{textAlign:"center",padding:"32px 20px"}}>
        <div style={{fontSize:48,marginBottom:12}}>☕</div>
        <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:20,fontWeight:700,color:T.primary,marginBottom:8}}>{t("coffeeThankTitle")}</div>
        <div style={{fontSize:14,color:T.text+"88",lineHeight:1.8,marginBottom:24}}>
          {t("coffeeThankMsg").split("\n").map((l,i)=><span key={i}>{l}<br/></span>)}
        </div>
        <button className="btn bp" style={{width:"100%"}} onClick={onClose}>{t("close")}</button>
      </div>
    </div>
  );

  return(
    <div className="mo" onClick={onClose}>
      <div className="md" onClick={e=>e.stopPropagation()}>
        <div style={{textAlign:"center",marginBottom:16}}>
          <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:18,fontWeight:700,color:T.primary,marginBottom:4}}>{t("premiumTitle")}</div>
          <div style={{fontSize:12,color:T.text+"88"}}>{t("premiumSub")}</div>
        </div>

        {/* 機能一覧 */}
        <div style={{background:T.soft,borderRadius:12,padding:"10px 14px",marginBottom:16}}>
          {t("premiumFeatureList").map((f,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0",fontSize:13,color:T.text}}>
              <span style={{color:T.primary,fontWeight:700,flexShrink:0}}>✓</span>{f}
            </div>
          ))}
        </div>

        {/* プラン */}
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
          {plans.map(p=>(
            <div key={p.id} style={{position:"relative",border:`2px solid ${selectedPlan===p.id?T.primary:T.soft}`,borderRadius:12,padding:"12px 14px",cursor:"pointer",background:selectedPlan===p.id?T.soft:"transparent"}}
              onClick={()=>{setSelectedPlan(p.id);!loading&&handlePurchase(p.id);}}>
              {p.badge&&<div style={{position:"absolute",top:-10,left:14,background:T.primary,color:"#fff",fontSize:10,fontWeight:700,padding:"2px 10px",borderRadius:20}}>{p.badge}</div>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:T.text}}>{p.label}</div>
                  <div style={{fontSize:11,color:T.text+"66",marginTop:2}}>{p.desc}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:18,fontWeight:700,color:selectedPlan===p.id?T.primary:T.text}}>{p.price}</div>
                  <div style={{fontSize:10,color:T.text+"55"}}>{p.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 広告削除 */}
        <div style={{borderTop:`1px solid ${T.soft}`,paddingTop:12,marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:T.text+"66",marginBottom:8}}>{t("singlePurchaseLabel")}</div>
          {extras.map(p=>(
            <div key={p.id} style={{border:`2px solid ${selectedPlan===p.id?T.primary:T.soft}`,borderRadius:12,padding:"10px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",background:selectedPlan===p.id?T.soft:"transparent"}}
              onClick={()=>{setSelectedPlan(p.id);!loading&&handlePurchase(p.id);}}>
              <div>
                <div style={{fontSize:14,fontWeight:600,color:T.text}}>{p.label}</div>
                <div style={{fontSize:11,color:T.text+"66",marginTop:2}}>{p.desc}</div>
              </div>
              <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:16,fontWeight:700,color:T.text,flexShrink:0}}>{p.price}</div>
            </div>
          ))}
        </div>

        <button className="btn bs" style={{width:"100%",marginTop:8}} onClick={onClose}>{t("close")}</button>


      </div>
    </div>
  );
}

// ── COLOR MODAL ───────────────────────────────────────────────────────────────
function ColorModal({T,themeName,onPick,onClose}){
  const isPremium=IS_PREMIUM;
  const FREE_THEMES=["blush","powder","night"];
  const PAID_THEMES=["wisteria","glacier","amber","atrium","navyrose","deepteal","elegan","ashviolet","blushhemp"];
  const orderedKeys=[...FREE_THEMES,...PAID_THEMES];
  const [showGate,setShowGate]=React.useState(false);
  const [previewTheme,setPreviewTheme]=React.useState(null);

  const renderSwatch=(key)=>{
    const t=THEMES[key];
    if(!t) return null;
    const isFree=FREE_THEMES.includes(key);
    const locked=!isFree&&!isPremium;
    return(
      <div key={key} style={{cursor:"pointer",textAlign:"center",width:52,position:"relative"}}
        onClick={()=>{
          if(locked){setPreviewTheme(key);return;}
          onPick(key);onClose();
        }}>
        <div style={{position:"relative",width:44,height:44,borderRadius:"50%",overflow:"hidden",margin:"0 auto",
          border:themeName===key?`3px solid ${T.text}`:"3px solid transparent",flexShrink:0,
          opacity:locked?0.45:1}}>
          <div style={{position:"absolute",inset:0,background:["navyrose","deepteal","blushhemp","atrium"].includes(key)?t.soft:t.accent}}/>
          <div style={{position:"absolute",top:0,right:0,width:"50%",height:"100%",background:t.primary}}/>
          <div style={{position:"absolute",top:0,left:"50%",width:1,height:"100%",background:"rgba(255,255,255,0.3)",transform:"translateX(-50%)"}}/>
        </div>
        {locked&&<div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",fontSize:14,lineHeight:"44px",pointerEvents:"none"}}>🔒</div>}
      </div>
    );
  };

  return(
    <div className="mo" onClick={onClose}>
      <div className="md" onClick={e=>e.stopPropagation()}>
        <div className="mdtitle">{t("colorThemeTitle")}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center",padding:"8px 0 16px"}}>
          {orderedKeys.map(renderSwatch)}
        </div>
        {previewTheme&&THEMES[previewTheme]&&(
          <HomePreviewModal T={T} themeName={previewTheme} themeObj={THEMES[previewTheme]} onClose={()=>setPreviewTheme(null)}/>
        )}
        <button className="btn bs" style={{width:"100%"}} onClick={onClose}>{t("close")}</button>
      </div>
    </div>
  );
}

function SettingsModal({T,state,onSave,onClose}){
  const [sf,setSf]=useState({...state.settings});
  const [th,setTh]=useState(state.targetWearHours||22);
  const [sd,setSd]=useState(state.startDate||"");
  const [tp,setTp]=useState(state.totalPieces||20);

  return(
    <div className="mo" onClick={onClose}>
      <div className="md" onClick={e=>e.stopPropagation()}>
        <div className="mdtitle">{t("settingsTitle")}</div>
        <div style={{fontSize:13,fontWeight:700,color:T.accent,marginBottom:6}}>{t("startDate")}</div>
        <input type="date" value={sd} onChange={e=>setSd(e.target.value)}
          style={{marginBottom:12,width:"100%",boxSizing:"border-box",display:"flex",alignItems:"center",
          height:44,lineHeight:"44px",fontSize:16,borderRadius:10,border:"none",
          background:T.soft,color:["atrium","navyrose","deepteal","ashviolet","blushhemp"].includes(state.themeName)?T.accent:T.text,padding:"0 12px",WebkitAppearance:"none",appearance:"none",textAlign:"center"}}/>
        <div style={{fontSize:13,fontWeight:700,color:T.accent,marginBottom:4}}>{t("totalPieces")}</div>
        <input type="number" min={1} max={100} value={tp} onChange={e=>setTp(parseInt(e.target.value)||1)} style={{textAlign:"center",marginBottom:12}}/>
        <div style={{fontSize:13,fontWeight:700,color:T.accent,marginBottom:6}}>{t("targetHours")}</div>
        <select value={th} onChange={e=>setTh(parseInt(e.target.value))} style={{marginBottom:12}}>{[18,19,20,21,22,23].map(h=><option key={h} value={h}>{h}{t("obHoursUnit")}</option>)}</select>
        <div style={{fontSize:13,fontWeight:700,color:T.accent,marginTop:4,marginBottom:6}}>{t("weekStart")}</div>
        <select value={sf.calendarWeekStart??0} onChange={e=>setSf(s=>({...s,calendarWeekStart:parseInt(e.target.value)}))} style={{marginBottom:14}}>
          <option value={0}>{t("sunday")}</option><option value={1}>{t("monday")}</option>
        </select>
        <div style={{display:"flex",gap:8}}>
          <button className="btn bs" style={{flex:1}} onClick={onClose}>{t("cancel")}</button>
          <button className="btn bp" style={{flex:1}} onClick={()=>{onSave(sf,th,sd,tp);onClose();}}>{t("save")}</button>
        </div>
      </div>
    </div>
  );
}

function TimerSettingsModal({T,state,onSave,onClose}){
  const isPremium=IS_PREMIUM;
  const MAX_ALL=10; // ーを含む上限
  const MAX_ACTIVE=5; // 選択できる最大数
  const FIXED_DASH="ー"; // 常に最後に固定

  const [showBreakdown,setShowBreakdown]=useState(state.showReasonBreakdown!==false);
  const [alarmSound,setAlarmSound]=useState(state.alarmSound||"standard");
  // customReasons: ーを除いたユーザー項目プール（最大9個）
  const [pool,setPool]=useState(()=>(state.customReasons||DEFAULT_REASONS).filter(r=>r!==FIXED_DASH));
  // activeReasons: 選択中5項目（ーを除く、最大5個）
  const [active,setActive]=useState(()=>(state.activeReasons||DEFAULT_REASONS.slice(0,5)).filter(r=>r!==FIXED_DASH));
  const [newWord,setNewWord]=useState("");
  const [err,setErr]=useState("");

  const toggleActive=(r)=>{
    setActive(prev=>{
      if(prev.includes(r)) return prev.filter(x=>x!==r);
      if(prev.length>=MAX_ACTIVE){setErr(t("maxSelectError").replace("{n}",MAX_ACTIVE));setTimeout(()=>setErr(""),2000);return prev;}
      return [...prev,r];
    });
  };

  const addWord=()=>{
    const w=newWord.replace(/\s/g,"").slice(0,6);
    if(!w){setErr(t("addItemHint"));return;}
    if(pool.includes(w)){setErr(LANG==="ja"?"同じ項目がすでにあります":"Item already exists");return;}
    if(pool.length>=MAX_ALL-1){setErr(t("maxSelectError").replace("{n}",MAX_ALL-1));return;}
    setPool(p=>[...p,w]);
    setNewWord("");setErr("");
  };

  const deleteWord=(r)=>{
    setPool(p=>p.filter(x=>x!==r));
    setActive(a=>a.filter(x=>x!==r));
  };

  const save=()=>{
    onSave({
      showReasonBreakdown:showBreakdown,
      customReasons:pool,
      activeReasons:active,
      alarmSound,
    });
    onClose();
  };

  return(
    <div className="mo" onClick={onClose}>
      <div className="md" onClick={e=>e.stopPropagation()}>
        <div className="mdtitle">{t("timerSettingsTitle")}</div>

        {/* ON/OFFトグル */}
        <div style={{fontSize:13,fontWeight:700,color:T.accent,fontFamily:"'M PLUS Rounded 1c',sans-serif",marginBottom:6}}>{t("showBreakdownLabel")}</div>
        <div style={{fontSize:12,color:T.text+"77",marginBottom:8}}>{t("showBreakdownDescLabel")}</div>
        <Toggle T={T} on={showBreakdown} label="" onToggle={()=>setShowBreakdown(v=>!v)}/>
        <div style={{marginBottom:16}}/>

        {/* 理由カスタマイズ */}
        <div style={{fontSize:13,fontWeight:700,color:T.accent,fontFamily:"'M PLUS Rounded 1c',sans-serif",marginBottom:8}}>{t("customReasonsLabel")}</div>

        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10,padding:"10px",background:state.themeName==="blushhemp"?"#F5EDE4":T.soft,borderRadius:12,minHeight:44}}>
          {pool.map(r=>{
            const isActive=active.includes(r);
            return(
              <div key={r} style={{display:"flex",alignItems:"center",gap:0,borderRadius:20,overflow:"hidden",
                border:`2px solid ${isActive?T.primary:T.text+"22"}`}}>
                <button onClick={()=>toggleActive(r)} style={{
                  padding:"4px 10px",border:"none",fontSize:13,fontWeight:600,cursor:"pointer",
                  background:"transparent",
                  color:isActive?T.primary:T.text,fontFamily:"'M PLUS Rounded 1c',sans-serif",
                  maxWidth:80,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"
                }}>{r}</button>
                {isPremium&&<button onClick={()=>deleteWord(r)} style={{
                  padding:"4px 7px 4px 3px",border:"none",fontSize:12,cursor:"pointer",
                  background:"transparent",
                  color:T.text+"44",lineHeight:1
                }}>✕</button>}
              </div>
            );
          })}
          {/* ー固定（常に末尾・削除不可） */}
          <div style={{display:"flex",alignItems:"center",borderRadius:20,overflow:"hidden",
            border:`2px dashed ${T.text+"33"}`}}>
            <button style={{padding:"4px 14px",border:"none",fontSize:13,fontWeight:600,
              background:"transparent",color:T.text+"55",fontFamily:"'M PLUS Rounded 1c',sans-serif",cursor:"default"}}>{t("reasonNone")}</button>
          </div>
        </div>

        {/* 新規追加 */}
        {isPremium?(
          <>
            <div style={{fontSize:11,color:T.text+"77",marginBottom:6}}>{t("addItemHint")}</div>
            <div style={{display:"flex",gap:8,marginBottom:4}}>
              <input value={newWord} onChange={e=>setNewWord(e.target.value.slice(0,6))}
                onKeyDown={e=>{if(e.key==="Enter")addWord();}}
                placeholder={t("addItemPlaceholder")}
                style={{flex:1,marginBottom:0}}/>
              <button className="btn bp" style={{flexShrink:0,padding:"8px 14px"}} onClick={addWord}>{t("addItemBtn")}</button>
            </div>
            {err&&<div style={{fontSize:12,color:"#E74C3C",marginBottom:8}}>{err}</div>}
          </>
        ):(
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",background:T.soft,borderRadius:10,marginBottom:4}}>
            <span style={{fontSize:16}}>🔒</span>
            <span style={{fontSize:12,color:T.text}}>{t("premiumOnlyHint")}</span>
          </div>
        )}

        {/* アラームサウンド選択 */}
        {(()=>{
          const [soundOpen,setSoundOpen]=React.useState(false);
          const [playingId,setPlayingId]=React.useState(null);
          const cur=ALARM_SOUNDS.find(s=>s.id===alarmSound)||ALARM_SOUNDS[0];

          const handlePlay=(e,sid)=>{
            e.stopPropagation();
            if(playingId===sid){
              stopAlarmSound();
              setPlayingId(null);
            } else {
              playAlarmSound(sid);
              setPlayingId(sid);
              // ループしないサウンドは自動停止を検知（約5秒後にリセット）
              setTimeout(()=>setPlayingId(p=>p===sid?null:p), 8000);
            }
          };

          return(
            <div style={{marginTop:16}}>
              <div style={{fontSize:13,fontWeight:700,color:T.accent,marginBottom:6,fontFamily:"'M PLUS Rounded 1c',sans-serif"}}>{t("alarmSoundLabel")}</div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",borderRadius:10,background:T.soft,cursor:"pointer",border:`1.5px solid ${T.primary}44`}}
                onClick={()=>setSoundOpen(v=>!v)}>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:T.primary}}>{cur.label}</div>
                  <div style={{fontSize:11,color:T.text+"66"}}>{cur.desc}</div>
                </div>
                <span style={{fontSize:12,color:T.primary}}>{soundOpen?"▲":"▼"}</span>
              </div>
              {soundOpen&&(
                <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:6}}>
                  {ALARM_SOUNDS.map(s=>{
                    const isPlaying=playingId===s.id;
                    return(
                      <div key={s.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",borderRadius:10,background:alarmSound===s.id?(state.themeName==="blushhemp"?"rgba(64,41,36,0.12)":T.soft):"transparent",border:`1.5px solid ${alarmSound===s.id?T.primary:T.soft}`,cursor:"pointer"}}
                        onClick={()=>{setAlarmSound(s.id);setSoundOpen(false);if(isPlaying){stopAlarmSound();setPlayingId(null);}}}>
                        <div style={{flex:1}}>
                          <div style={{fontSize:13,fontWeight:600,color:alarmSound===s.id?T.primary:T.text}}>{s.label}</div>
                          <div style={{fontSize:11,color:T.text+"66"}}>{s.desc}</div>
                        </div>
                        <button
                          onClick={e=>handlePlay(e,s.id)}
                          style={{background:isPlaying?T.accent:T.primary,border:"none",borderRadius:20,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,marginLeft:8,transition:"background .2s"}}>
                          {isPlaying
                            ? <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><rect x="5" y="3" width="4" height="18"/><rect x="15" y="3" width="4" height="18"/></svg>
                            : <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><polygon points="5,3 19,12 5,21"/></svg>
                          }
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        <div style={{display:"flex",gap:8,marginTop:16}}>
          <button className="btn bs" style={{flex:1}} onClick={onClose}>{t("cancel")}</button>
          <button className="btn bp" style={{flex:1}} onClick={save}>{t("save")}</button>
        </div>
      </div>
    </div>
  );
}

// ── SCHEDULE MODAL ────────────────────────────────────────────────────────────
function ScheduleModal({T,state,update,onClose}){
  const [editPiece,setEditPiece]=useState(null);
  const [editDays,setEditDays]=useState(7);
  const [globalDays,setGlobalDays]=useState(state.intervalDays||7);
  const [tempExtraCount,setTempExtraCount]=useState(1);
  const [tempExtraInterval,setTempExtraInterval]=useState(state.intervalDays||7);
  const [extraConfirmed,setExtraConfirmed]=useState(false);
  const [showAddExtra,setShowAddExtra]=useState(false);

  const list = buildPieceList(state);
  const today = todayISO();

  const confirmExtras = () => {
    if(tempExtraCount===0) return;
    const existing = state.extraPieces || [];
    const newExtras = [...existing];
    for(let i=0;i<tempExtraCount;i++){
      newExtras.push({ intervalDays:tempExtraInterval, batchIdx:i });
    }
    update({extraPieces:newExtras});
    setExtraConfirmed(true);
    setShowAddExtra(false);
    setTempExtraCount(1);
  };

  return(
    <div className="mo" onClick={onClose}>
      <div className="md" onClick={e=>e.stopPropagation()}>
        <div className="mdtitle">{t("scheduleTitle")}</div>

        {/* Piece list - 日付範囲をタップで個別設定 */}
        <div style={{maxHeight:"38dvh",overflowY:"auto",marginBottom:10}}>
          {list.map((p)=>{
            const exStart=getExchangeDate(state,p.n);
            const exEnd=getExchangeEndDate(state,p.n);
            const dsEx=exStart?dsFromDate(exStart):null;
            const isAct=p.n===state.currentPiece;
            const cpIdx2=list.findIndex(p2=>p2.n===state.currentPiece);
            const pIdx=list.findIndex(p2=>p2.n===p.n);
            const canEdit=true; // 過去も含めて全て編集可能
            const isPast=pIdx<cpIdx2;
            const hasCustom=!p.isExtra&&state.customIntervals?.[p.n];
            const rangeStr=exStart&&exEnd?`${fmtDateJP(dsFromDate(exStart))} – ${fmtDateJP(dsFromDate(exEnd))}`:"—";
            return(
              <div key={p.n} className="wr" style={{background:isAct?T.soft+"88":"transparent",borderRadius:8,padding:"5px 7px",opacity:isPast&&!isAct?0.5:1,cursor:canEdit?"pointer":"default"}}
                onClick={()=>{if(!canEdit)return;setEditPiece(p.n);setEditDays(p.intervalDays);}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
                  <div style={{width:26,height:26,borderRadius:"50%",background:isAct?T.primary:hasCustom?T.accent+"33":T.soft,color:isAct?"#fff":(state.themeName==="blushhemp"?T.primary:T.text),border:`1.5px solid ${hasCustom?T.accent:T.soft}`,fontSize:12,fontWeight:700,fontFamily:"'M PLUS Rounded 1c',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {p.label}
                  </div>
                  <div>
                    <div style={{fontSize:12,fontFamily:"'M PLUS Rounded 1c',sans-serif",color:canEdit?T.text:T.text+"66"}}>{rangeStr}{p.isExtra?<span style={{fontSize:11,color:T.accent,marginLeft:4}}>{t("extraLabel")}</span>:null}</div>
                    <div style={{fontSize:11,color:hasCustom?T.accent:T.text+"55"}}>{p.intervalDays}{t("daySpanUnit")}{hasCustom?` (${t("customIntervalLabel")})`:""}</div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:4}}>
                  {isAct&&<div style={{fontSize:12,color:T.primary,fontWeight:700,flexShrink:0}}>{t("currentlyWearing")}</div>}
                  {canEdit&&<div style={{fontSize:11,color:T.accent+"88"}}>▶</div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* 追加マウスピース */}
        <div style={{background:T.soft,borderRadius:12,padding:"8px 12px",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:showAddExtra?6:0}}>
            <div style={{fontSize:13,fontWeight:700,color:T.accent,fontFamily:"'M PLUS Rounded 1c',sans-serif"}}>
              {t("addExtraTitle")}
              {(state.extraPieces?.length>0)&&<span style={{marginLeft:6,color:T.primary,fontWeight:700}}>{t("extraRegistered").replace("{n}",state.extraPieces.length)}</span>}
            </div>
            <button className="btn bp bsm" style={{fontSize:12,padding:"4px 10px"}} onClick={()=>setShowAddExtra(v=>!v)}>
              {showAddExtra?t("closePanel"):t("add")}
            </button>
          </div>
          {/* 番号方式トグル */}
          {(state.extraPieces?.length>0||showAddExtra)&&(
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,marginTop:4}}>
              <span style={{fontSize:12,color:state.themeName==="night"?T.text+"88":"#555555"}}>{t("numberMode")}</span>
              <div style={{display:"flex",gap:6}}>
                {[{key:"relative",label:t("relativeMode")},{key:"absolute",label:t("absoluteMode")}].map(opt=>(
                  <button key={opt.key}
                    onClick={e=>{e.stopPropagation();update({extraLabelMode:opt.key});}}
                    style={{padding:"4px 12px",borderRadius:8,border:`1.5px solid ${(state.extraLabelMode||"relative")===opt.key?T.primary:T.soft}`,
                      background:(state.extraLabelMode||"relative")===opt.key?T.primary:"transparent",
                      color:(state.extraLabelMode||"relative")===opt.key?"#fff":T.text,
                      fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'M PLUS Rounded 1c',sans-serif"}}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {showAddExtra&&(<>
            {/* 枚数入力 */}
            <div style={{display:"flex",alignItems:"center",gap:8,marginTop:6,marginBottom:10}}>
              <span style={{fontSize:13,color:state.themeName==="night"?T.text+"77":"#555555",flexShrink:0}}>{t("countLabel")}</span>
              <input type="number" min={1} inputMode="numeric" value={tempExtraCount}
                onChange={e=>setTempExtraCount(Math.max(1,parseInt(e.target.value)||1))}
                style={{flex:1,textAlign:"center"}}/>
              <span style={{fontSize:13,color:state.themeName==="night"?T.text+"77":"#555555",flexShrink:0}}>{t("intervalLabel")}</span>
              <select value={tempExtraInterval} onChange={e=>setTempExtraInterval(parseInt(e.target.value))}
                style={{flex:1,textAlign:"center",textAlignLast:"center"}}>
                {Array.from({length:14},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}{t("dayUnit")}</option>)}
              </select>
            </div>
            {/* プレビュー */}
            {tempExtraCount>0&&(()=>{
              const baseN=state.totalPieces+(state.extraPieces?.length||0);
              const mode=state.extraLabelMode||"relative";
              let preview;
              if(mode==="absolute"){
                preview=Array.from({length:Math.min(tempExtraCount,5)},(_,i)=>baseN+i+1).join(", ")+(tempExtraCount>5?"...":"");
              } else {
                preview=Array.from({length:Math.min(tempExtraCount,5)},(_,i)=>`+${i+1}`).join(", ")+(tempExtraCount>5?"...":"");
              }
              return <div style={{fontSize:12,color:T.accent,marginBottom:8}}>{t("afterAddPreview")}{preview}</div>;
            })()}
            <button className="btn bp" style={{width:"100%",padding:"8px"}} onClick={confirmExtras}>
              {t("confirmAddBtn").replace("{n}",tempExtraCount)}
            </button>
          </>)}
        </div>

        {/* 全体の交換間隔 */}
        <div style={{background:T.soft,borderRadius:12,padding:"8px 12px",marginBottom:12}}>
          <div style={{fontSize:13,fontWeight:700,color:T.accent,fontFamily:"'M PLUS Rounded 1c',sans-serif",marginBottom:6}}>{t("globalIntervalTitle")}</div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <select value={globalDays} onChange={e=>setGlobalDays(parseInt(e.target.value))} style={{flex:1}}>
              {Array.from({length:14},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}{t("dayEvery")}</option>)}
            </select>
            <button className="btn bp bsm" onClick={()=>update({intervalDays:globalDays})}>{t("applyBtn")}</button>
          </div>
        </div>

        <button className="btn bs" style={{width:"100%"}} onClick={onClose}>{t("close")}</button>
      </div>

      {/* 個別ピース編集 */}
      {editPiece!==null&&(()=>{
        const pieceInfo=list.find(p=>p.n===editPiece);
        const isExtra=pieceInfo?.isExtra;
        const deletePiece=()=>{
          if(!isExtra)return;
          const newExtras=(state.extraPieces||[]).filter((_,i)=>i!==pieceInfo.epIdx);
          update({extraPieces:newExtras});
          setEditPiece(null);
        };
        return(
          <div className="mo" style={{zIndex:400}} onClick={()=>setEditPiece(null)}>
            <div className="md" onClick={e=>e.stopPropagation()}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <div className="mdtitle" style={{margin:0}}>{t("pieceIntervalTitle").replace("{n}",editPiece)}</div>
                {isExtra&&(
                  <button onClick={deletePiece} style={{background:"none",border:"none",cursor:"pointer",padding:"4px 8px"}}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </button>
                )}
              </div>
              <div style={{fontSize:14,color:T.text+"77",marginBottom:10}}>
                {(() => {
                  const exStart=getExchangeDate(state,editPiece);
                  const exEnd=getExchangeEndDate(state,editPiece);
                  return exStart&&exEnd ? `${fmtDateJP(dsFromDate(exStart))} – ${fmtDateJP(dsFromDate(exEnd))}` : "—";
                })()}
              </div>
              <select value={editDays} onChange={e=>setEditDays(parseInt(e.target.value))} style={{marginBottom:14}}>
                {Array.from({length:21},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}{t("daySpanUnit")}</option>)}
              </select>
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                <button className="btn bs" style={{flex:1}} onClick={()=>setEditPiece(null)}>{t("cancel")}</button>
                <button className="btn bp" style={{flex:1}} onClick={()=>{const ci={...(state.customIntervals||{})};ci[editPiece]=editDays;update({customIntervals:ci});setEditPiece(null);}}>{t("save")}</button>
              </div>
              {state.customIntervals?.[editPiece]&&(
                <button style={{width:"100%",padding:"9px",border:"none",borderRadius:10,background:"#FFF0F0",color:"#E74C3C",cursor:"pointer",fontWeight:600,fontFamily:"'M PLUS Rounded 1c',sans-serif"}}
                  onClick={()=>{const ci={...(state.customIntervals||{})};delete ci[editPiece];update({customIntervals:ci});setEditPiece(null);}}>
                  {t("resetToDefault").replace("{n}",state.intervalDays)}
                </button>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function NotifyModal({T,state,onSave,onClose}){
  const [f,setF]=useState({
    notifyBefore:state.notifyBefore??1440,
    notifyTime:state.notifyTime||"09:00",
    forgetTimerAlert:state.forgetTimerAlert??true,
    forgetTimerHours:state.forgetTimerHours??4,
    photoReminderMode:state.photoReminderMode||"exchange",
    photoReminderDay:state.photoReminderDay??0,
    photoNotifyHour:state.photoNotifyHour??9,
    exchangeNotifyHour:state.exchangeNotifyHour??9,
  });
  const [sf,setSf]=useState({...state.settings});

  // 縦スクロールピッカー
    const timingOpts=[{v:0,l:t("sameDayOpt")},{v:1440,l:t("dayBeforeOpt")},{v:2880,l:t("twoDaysBeforeOpt")}];
  const hours=Array.from({length:24},(_,i)=>({v:i,l:`${i}${t("obHoursUnit")}`}));
  const DOW_OPTS=[
    {v:"exchange",l:t("onChangeDayOpt")},
    {v:"0",l:t("sunday")},{v:"1",l:t("monday")},{v:"2",l:t("tuesdayLabel")},
    {v:"3",l:t("wednesdayLabel")},{v:"4",l:t("thursdayLabel")},{v:"5",l:t("fridayLabel")},{v:"6",l:t("saturdayLabel")},
  ];

  const sec=(title)=>(
    <div style={{fontSize:13,fontWeight:700,color:T.accent,fontFamily:"'M PLUS Rounded 1c',sans-serif",
      marginBottom:8,marginTop:16,paddingTop:14,borderTop:`1px solid ${T.soft}`}}>{title}</div>
  );

  const expandBox=(children)=>(
    <div style={{borderRadius:10,padding:"12px",marginTop:8,border:`1.5px solid ${T.primary}33`}}>
      {children}
    </div>
  );

  return(
    <div className="mo" onClick={onClose}>
      <div className="md" onClick={e=>e.stopPropagation()}>
        <div className="mdtitle">{t("notifySettingsTitle")}</div>

        {/* 交換リマインダー */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <div style={{fontSize:13,fontWeight:700,color:T.accent,fontFamily:"'M PLUS Rounded 1c',sans-serif"}}>{t("exchangeReminderLabel")}</div>
          <Toggle T={T} on={!!sf.reminderExchange} onToggle={async()=>{if(!sf.reminderExchange){const ok=await ensureNotifPermission();if(!ok)return;}setSf(s=>({...s,reminderExchange:!s.reminderExchange}));}}/>
        </div>
        {sf.reminderExchange&&expandBox(
          <div>
            <div style={{fontSize:11,color:T.text+"77",marginBottom:10}}>{t("notifyTimingLabel")}</div>
            <div style={{display:"flex",gap:10}}>
              <select value={f.notifyBefore} onChange={e=>setF(x=>({...x,notifyBefore:parseInt(e.target.value)}))} style={{flex:1}}>
                {timingOpts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
              <select value={f.exchangeNotifyHour} onChange={e=>setF(x=>({...x,exchangeNotifyHour:parseInt(e.target.value)}))} style={{flex:1}}>
                {hours.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* 写真リマインダー */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,marginTop:16,paddingTop:14,borderTop:`1px solid ${T.soft}`}}>
          <div style={{fontSize:13,fontWeight:700,color:T.accent,fontFamily:"'M PLUS Rounded 1c',sans-serif"}}>{t("photoReminderLabel")}</div>
          <Toggle T={T} on={!!sf.reminderPhoto} onToggle={async()=>{if(!sf.reminderPhoto){const ok=await ensureNotifPermission();if(!ok)return;}setSf(s=>({...s,reminderPhoto:!s.reminderPhoto}));}}/>
        </div>
        {sf.reminderPhoto&&expandBox(
          <div>
            <div style={{fontSize:11,color:T.text+"77",marginBottom:10}}>{t("notifyTimingLabel")}</div>
            <div style={{display:"flex",gap:10}}>
              <select value={f.photoReminderMode==="exchange"?"exchange":String(f.photoReminderDay)}
                onChange={e=>{const v=e.target.value;if(v==="exchange")setF(x=>({...x,photoReminderMode:"exchange"}));else setF(x=>({...x,photoReminderMode:"weekly",photoReminderDay:parseInt(v)}));}}
                style={{flex:1}}>
                {DOW_OPTS.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
              <select value={f.photoNotifyHour} onChange={e=>setF(x=>({...x,photoNotifyHour:parseInt(e.target.value)}))} style={{flex:1}}>
                {hours.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* タイマー放置防止 */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,marginTop:16,paddingTop:14,borderTop:`1px solid ${T.soft}`}}>
          <div style={{fontSize:13,fontWeight:700,color:T.accent,fontFamily:"'M PLUS Rounded 1c',sans-serif"}}>{t("forgetTimerLabel")}</div>
          <Toggle T={T} on={f.forgetTimerAlert} onToggle={async()=>{if(!f.forgetTimerAlert){const ok=await ensureNotifPermission();if(!ok)return;}setF(x=>({...x,forgetTimerAlert:!x.forgetTimerAlert}));}}/>
        </div>
        {f.forgetTimerAlert&&expandBox(
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:13,color:T.text+"88",flexShrink:0}}>{t("removalIsLabel")}</span>
            <button className="btn bs bsm" style={{padding:"2px 10px",fontSize:16}} onClick={()=>setF(x=>({...x,forgetTimerHours:Math.max(1,x.forgetTimerHours-1)}))}>－</button>
            <span style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:18,fontWeight:700,color:T.primary,minWidth:24,textAlign:"center"}}>{f.forgetTimerHours}</span>
            <button className="btn bs bsm" style={{padding:"2px 10px",fontSize:16}} onClick={()=>setF(x=>({...x,forgetTimerHours:Math.min(24,x.forgetTimerHours+1)}))}>＋</button>
            <span style={{fontSize:13,color:T.text+"88",flexShrink:0}}>{t("hoursExceededLabel")}</span>
          </div>
        )}

        <div style={{display:"flex",gap:8,marginTop:16}}>
          <button className="btn bs" style={{flex:1}} onClick={onClose}>{t("cancel")}</button>
          <button className="btn bp" style={{flex:1}} onClick={()=>{onSave({...f,settings:{...state.settings,...sf}});onClose();}}>{t("save")}</button>
        </div>
      </div>
    </div>
  );
}


function BackupModal({T,state,onImport,onClose}){
  const fileRef=useRef(null);
  const [exporting,setExporting]=React.useState(false);
  const [loading,setLoading]=React.useState(false);
  const [errorMsg,setErrorMsg]=React.useState("");

  const handleRestore=async()=>{
    setLoading(true);setErrorMsg("");
    try{
      await Purchases.restorePurchases();
      const isPremium=await Purchases.isPremiumUser();
      const noAds=await Purchases.hasNoAds();
      onImport({...state,isPremium,noAds});
      onClose();
    }catch(e){setErrorMsg(t("restoreFailed"));}
    setLoading(false);
  };

  const doExport=async()=>{
    setExporting(true);
    try{
      // IndexedDBから写真dataを取得してstateに合成
      const idbPhotos=await idbLoadPhotos();
      const dataMap={};
      idbPhotos.forEach(p=>{dataMap[p.id]=p.data;});
      const fullPhotos=(state.photos||[]).map(p=>({...p,data:dataMap[p.id]||p.data||null}));
      const fullState={...state,photos:fullPhotos};
      const blob=new Blob([JSON.stringify(fullState,null,2)],{type:"application/json"});
      const url=URL.createObjectURL(blob);
      if(navigator.share){
        const file=new File([blob],"smiletrack_backup.json",{type:"application/json"});
        await navigator.share({files:[file],title:t("backupTitle")});
      } else {
        const a=document.createElement("a");
        a.href=url;
        a.download="smiletrack_backup.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      URL.revokeObjectURL(url);
    }catch(e){console.warn(t("exportFail"),e);showToast(t("exportFail"));}
    setExporting(false);
  };

  const doImport=(data)=>{
    // 写真dataをIndexedDBに保存
    if(data.photos&&data.photos.length){
      idbSavePhotos(data.photos.filter(p=>p.data));
    }
    onImport(data);
    onClose();
  };

  return(
    <div className="mo" onClick={onClose}>
      <div className="md" onClick={e=>e.stopPropagation()}>
        <div className="mdtitle">{t("backupTitle2")}</div>
        <div style={{fontSize:12,color:T.text+"77",marginBottom:12}}>{t("backupSubMsg")}</div>
        <button className="btn bp blg" style={{width:"100%",marginBottom:10,opacity:exporting?0.6:1}}
          onClick={doExport} disabled={exporting}>
          {exporting?t("exporting"):t("export")}
        </button>
        <button className="btn bs blg" style={{width:"100%"}} onClick={()=>fileRef.current?.click()}>{t("importBtn")}</button>
        <input ref={fileRef} type="file" accept=".json" style={{display:"none"}} onChange={e=>{
          const f=e.target.files?.[0];if(!f)return;
          const r=new FileReader();
          r.onload=ev=>{
            try{doImport(JSON.parse(ev.target.result));}
            catch{console.warn(t("invalidFileMsg"));showToast(t("invalidFileMsg"));}
          };
          r.readAsText(f);
        }}/>
        <div style={{borderTop:`1px solid ${T.soft}`,marginTop:16,paddingTop:16}}>
          <div style={{fontSize:13,fontWeight:700,color:T.accent,marginBottom:8}}>{t("restorePurchaseTitle")}</div>
          <div style={{fontSize:12,color:T.text+"77",marginBottom:10}}>{t("restorePurchaseMsg")}</div>
          <button className="btn bs blg" style={{width:"100%"}} onClick={handleRestore} disabled={loading}>{loading?t("loading"):t("restorePurchaseBtn")}</button>
        </div>
        {errorMsg&&<div style={{fontSize:12,color:"#D4445A",textAlign:"center",margin:"8px 0",lineHeight:1.6}}>{errorMsg}</div>}
        <button className="btn bs" style={{width:"100%",marginTop:12}} onClick={onClose}>{t("close")}</button>
      </div>
    </div>
  );
}

// ── CAMERA SETTINGS MODAL ────────────────────────────────────────────────────
const SHOT_MODES = [
  {id:"face_front", labelJP:"顔正面",   labelKey:"shotFaceFront",  svgD:"M50,15 C35,15 20,30 20,50 C20,70 35,85 50,85 C65,85 80,70 80,50 C80,30 65,15 50,15 Z", isLandscape:false},
  {id:"face_right", labelJP:"顔右向き", labelKey:"shotFaceRight",  svgD:"M55,15 C40,15 25,30 22,52 C20,70 35,85 55,85 C70,85 80,68 80,50 C80,32 70,15 55,15 Z", isLandscape:false},
  {id:"face_left",  labelJP:"顔左向き", labelKey:"shotFaceLeft",   svgD:"M45,15 C60,15 75,30 78,52 C80,70 65,85 45,85 C30,85 20,68 20,50 C20,32 30,15 45,15 Z", isLandscape:false},
  {id:"teeth_front",labelJP:"歯正面",   labelKey:"shotTeethFront", svgD:"M18,38 C20,28 80,28 82,38 L82,62 C80,72 20,72 18,62 Z", isLandscape:true},
  {id:"teeth_right",labelJP:"歯右向き", labelKey:"shotTeethRight", svgD:"M18,38 C20,28 75,30 82,42 L82,62 C75,70 20,72 18,62 Z", isLandscape:true},
  {id:"teeth_left", labelJP:"歯左向き", labelKey:"shotTeethLeft",  svgD:"M18,42 C25,30 80,28 82,38 L82,62 C80,72 25,70 18,58 Z", isLandscape:true},
];

function ShotModePictogram({mode, size=56, selected, T, onClick}){
  const m = SHOT_MODES.find(x=>x.id===mode)||SHOT_MODES[0];
  return(
    <div onClick={onClick} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer",
      padding:"8px 4px",borderRadius:10,background:selected?T.soft:"transparent",
      border:`2px solid ${selected?T.primary:T.soft}`,transition:"all .15s",flex:1}}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <path d={m.svgD} fill="none" stroke={selected?T.primary:T.text+"66"} strokeWidth="4" strokeLinejoin="round"/>
        {!m.isLandscape && <><circle cx={m.id.includes("left")?55:m.id.includes("right")?45:44} cy="40" r="3" fill={selected?T.primary:T.text+"66"}/>
        <circle cx={m.id.includes("left")?65:m.id.includes("right")?55:56} cy="40" r="3" fill={selected?T.primary:T.text+"66"}/></>}
        {m.isLandscape && <><line x1="35" y1="50" x2="35" y2="62" stroke={selected?T.primary:T.text+"66"} strokeWidth="2"/>
        <line x1="50" y1="50" x2="50" y2="63" stroke={selected?T.primary:T.text+"66"} strokeWidth="2"/>
        <line x1="65" y1="50" x2="65" y2="62" stroke={selected?T.primary:T.text+"66"} strokeWidth="2"/>
        <line x1="18" y1="50" x2="82" y2="50" stroke={selected?T.primary:T.text+"66"} strokeWidth="2.5"/></>}
      </svg>
      <span style={{fontSize:9,fontWeight:600,color:selected?T.primary:T.text+"66",textAlign:"center",lineHeight:1.2}}>{t(m.labelKey)||m.labelJP}</span>
    </div>
  );
}

function CameraSettingsModal({T,state,onSave,onClose}){
  const cs = state.cameraSettings||{};
  const [mirror,setMirror]=useState(cs.mirrorSave??false);
  const [slot1,setSlot1]=useState(cs.slot1||"face_front");
  const [slot2,setSlot2]=useState(cs.slot2||"teeth_front");
  const [selectingSlot,setSelectingSlot]=useState(null);

  return(
    <div className="mo" onClick={onClose}>
      <div className="md" onClick={e=>e.stopPropagation()}>
        <div className="mdtitle">{t("cameraSettingsTitle")}</div>

        {/* ミラー設定 */}
        <div style={{fontSize:13,fontWeight:700,color:T.accent,fontFamily:"'M PLUS Rounded 1c',sans-serif",marginBottom:6}}>{t("saveSettingsLabel")}</div>
        <Toggle T={T} on={mirror} label={t("mirrorSave")} onToggle={()=>setMirror(v=>!v)}/>

        {/* 撮影スロット */}
        <div style={{fontSize:13,fontWeight:700,color:T.accent,fontFamily:"'M PLUS Rounded 1c',sans-serif",marginBottom:10}}>{t("slotAssignLabel")}</div>

        {/* スロット選択UI */}
        {[1,2].map(slotN=>{
          const slotVal = slotN===1?slot1:slot2;
          const setSlot = slotN===1?setSlot1:setSlot2;
          const isOpen = selectingSlot===slotN;
          const modeInfo = SHOT_MODES.find(x=>x.id===slotVal)||SHOT_MODES[0];
          return(
            <div key={slotN} style={{marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                background:T.soft,borderRadius:10,padding:"8px 12px",cursor:"pointer"}}
                onClick={()=>setSelectingSlot(isOpen?null:slotN)}>
                <span style={{fontSize:13,fontWeight:700,color:T.accent,fontFamily:"'M PLUS Rounded 1c',sans-serif"}}>{slotN}：{t(modeInfo.labelKey)||modeInfo.labelJP}</span>
                <span style={{fontSize:13,fontWeight:600,color:T.accent,fontFamily:"'M PLUS Rounded 1c',sans-serif"}}>{isOpen?t("closePanel"):t("changePanel")}</span>
              </div>
              {isOpen&&(
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginTop:8,padding:"8px",background:T.bg,borderRadius:10}}>
                  {SHOT_MODES.map(m=>(
                    <ShotModePictogram key={m.id} mode={m.id} T={T} selected={slotVal===m.id}
                      onClick={()=>{setSlot(m.id);setSelectingSlot(null);}}/>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <div style={{display:"flex",gap:8,marginTop:14}}>
          <button className="btn bs" style={{flex:1}} onClick={onClose}>{t("cancel")}</button>
          <button className="btn bp" style={{flex:1}} onClick={()=>{onSave({cameraSettings:{...cs,mirrorSave:mirror,slot1,slot2}});onClose();}}>{t("save")}</button>
        </div>
      </div>
    </div>
  );
}

function ResetConfirmModal({T,onConfirm,onCancel}){
  return(
    <div className="mo" onClick={onCancel} style={{alignItems:"center",justifyContent:"center"}}>
      <div className="md" onClick={e=>e.stopPropagation()} style={{textAlign:"center",borderRadius:20}}>
        <div style={{fontSize:36,marginBottom:8}}>⚠️</div>
        <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:17,fontWeight:700,color:"#E74C3C",marginBottom:8}}>{t("resetConfirmTitle")}</div>
        <div style={{fontSize:15,color:T.text+"88",marginBottom:20,lineHeight:1.7}}>{t("resetConfirmMsg").split("\n").map((l,i)=><span key={i}>{l}{i===0?<br/>:null}</span>)}</div>
        <div style={{display:"flex",gap:10}}>
          <button className="btn bs blg" style={{flex:1}} onClick={onCancel}>{t("backBtn")}</button>
          <button style={{flex:1,padding:"13px 20px",border:"none",borderRadius:13,fontSize:17,fontWeight:600,cursor:"pointer",background:"#E74C3C",color:"#fff",fontFamily:"'M PLUS Rounded 1c',sans-serif"}} onClick={onConfirm}>{t("deleteBtn")}</button>
        </div>
      </div>
    </div>
  );
}

// ── HOME PAGE ────────────────────────────────────────────────────────────────
