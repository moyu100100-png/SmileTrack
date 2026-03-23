const Icons = {
  home:(c,s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  calendar:(c,s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  camera:(c,s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  timer:(c,s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  chart:(c,s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  menu:(c,s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  settings:(c,s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  schedule:(c,s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  palette:(c,s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="13.5" cy="6.5" r=".5" fill={c}/><circle cx="17.5" cy="10.5" r=".5" fill={c}/><circle cx="8.5" cy="7.5" r=".5" fill={c}/><circle cx="6.5" cy="12.5" r=".5" fill={c}/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>,
  bell:(c,s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  save:(c,s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  reset:(c,s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  timerIcon:(c,s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  trash:(c,s=14)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  plus:(c,s=14)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  lockClosed:(c,s=14)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  lockOpen:(c,s=14)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>,
  layers:(c,s=14)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  check:(c,s=14)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  flip:(c,s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3"/><path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"/><line x1="12" y1="20" x2="12" y2="4"/></svg>,
  camSettings:(c,s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/><line x1="12" y1="10" x2="12" y2="16"/><line x1="9" y1="13" x2="15" y2="13"/></svg>,
  sun:(c,s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  droplet:(c,s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>,
};

function makeCSS(T) {
  return `@import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@300;400;500;700&family=Outfit:wght@300;400;600;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} input:not(.ob-input),select,textarea{font-size:16px !important;} body{overflow:hidden;background:${T.bg};} .app{width:100%;height:100dvh;display:flex;flex-direction:column;background:${T.bg};color:${T.text};font-family:'M PLUS Rounded 1c',sans-serif;font-size:14px;overflow-x:hidden;} .hdr{padding:10px 14px 8px;background:${T.card};border-bottom:1px solid ${T.soft};display:flex;align-items:center;justify-content:space-between;flex-shrink:0;} .htitle{font-family:'M PLUS Rounded 1c',sans-serif;font-size:15px;font-weight:700;color:${T.primary};} .hsub{font-size:8px;color:${T.accent}88;} .ham{width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;background:${T.soft};border:none;border-radius:8px;} .content{flex:1;overflow-y:auto;overflow-x:hidden;} .nav{display:flex;background:${T.card};border-top:none;padding:0;flex-shrink:0;padding-bottom:env(safe-area-inset-bottom,0px);} .nb{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:10px 1px 6px;border:none;background:transparent;cursor:pointer;border-radius:7px;color:${T.text}44;transition:all .15s;} .nb.on{color:${T.primary};background:${T.soft};} .nb-lbl{font-size:10px;font-family:'M PLUS Rounded 1c',sans-serif;} .card{background:${T.card};border-radius:14px;padding:13px;box-shadow:0 2px 8px ${T.primary}0d;} .ct{font-size:10px;font-weight:700;color:${T.accent};margin-bottom:10px;letter-spacing:.5px;} .btn{padding:9px 16px;border:none;border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;font-family:'M PLUS Rounded 1c',sans-serif;transition:all .15s;display:inline-flex;align-items:center;justify-content:center;gap:4px;} .bp{background:${T.primary};color:#fff;} .bs{background:${T.soft};color:${T.primary};} .bsm{padding:5px 11px;font-size:11px;border-radius:8px;} .blg{padding:13px 20px;font-size:15px;border-radius:13px;} input,select,textarea{width:100%;padding:8px 12px;border:1.5px solid ${T.soft};border-radius:10px;background:${T.bg};color:${T.text};font-size:13px;font-family:'M PLUS Rounded 1c',sans-serif;outline:none;box-sizing:border-box;} input:focus,select:focus,textarea:focus{border-color:${T.primary};} label{font-size:11px;font-weight:600;color:${T.accent};margin-bottom:3px;display:block;} .mo{position:fixed;inset:0;background:#00000077;z-index:200;display:flex;align-items:flex-end;justify-content:center;} .md{background:${T.card};border-radius:20px 20px 0 0;padding:20px;width:100%;max-width:100%;max-height:90dvh;overflow-y:auto;color:${T.text};box-sizing:border-box;} .md label{color:${T.accent};} .md input,.md select,.md textarea{background:${T.bg};color:${T.text};border-color:${T.soft};} .mdtitle{font-family:'M PLUS Rounded 1c',sans-serif;font-size:16px;font-weight:700;color:${T.primary};margin-bottom:14px;} .overlay{position:fixed;inset:0;background:#00000055;z-index:299;} .drawer{position:fixed;top:0;left:0;bottom:0;width:80%;max-width:300px;background:${T.card};z-index:300;transform:translateX(-100%);transition:transform .26s cubic-bezier(.4,0,.2,1);overflow-y:auto;box-shadow:4px 0 20px #00000033;color:${T.text};} .drawer.open{transform:translateX(0);} .di{display:flex;align-items:center;gap:12px;padding:11px 14px;cursor:pointer;border-radius:9px;margin:2px 7px;transition:background .12s;} .di:hover{background:${T.soft};} .di-lbl{font-size:18px;font-weight:500;color:${T.text};} .sep{height:1px;background:${T.soft};margin:7px 14px;} .trow{display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid ${T.soft}22;} .trow span{color:${T.text};} .tg{width:44px;height:24px;border-radius:12px;position:relative;cursor:pointer;transition:background .2s;border:none;flex-shrink:0;} .tg-k{width:20px;height:20px;border-radius:50%;background:#fff;position:absolute;top:2px;transition:left .2s;box-shadow:0 1px 4px #0003;} .wr{display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid ${T.soft}33;} .pgrid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;} .pi{border-radius:11px;overflow:hidden;position:relative;background:${T.soft};aspect-ratio:1/1;} .pi img{width:100%;height:100%;object-fit:cover;} .bar-wrap{display:flex;align-items:flex-end;gap:2px;height:200px;} .bar-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;min-width:0;} .bar-f{width:100%;border-radius:3px 3px 0 0;min-height:2px;transition:height .4s;} .bar-l{font-size:7px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%;text-align:center;} .pin-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:12px 0;} .pin-btn{padding:14px;border:none;border-radius:11px;background:${T.soft};color:${T.text};font-size:18px;font-weight:600;cursor:pointer;font-family:'M PLUS Rounded 1c',sans-serif;} .pin-dots{display:flex;gap:10px;justify-content:center;margin:9px 0;} .pin-dot{width:11px;height:11px;border-radius:50%;border:2px solid ${T.primary};} .pin-dot.on{background:${T.primary};} .sess{padding:7px 11px;background:${T.soft};border-radius:9px;margin-bottom:4px;font-size:11px;display:flex;justify-content:space-between;align-items:center;gap:6px;color:${T.text};cursor:pointer;} .reason-chip{padding:6px 10px;border:none;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;font-family:'M PLUS Rounded 1c',sans-serif;background:${T.soft};color:${T.primary};white-space:nowrap;flex-shrink:0;} .stats-tab{flex:1;padding:7px 4px;border:none;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;font-family:'M PLUS Rounded 1c',sans-serif;background:transparent;color:${T.text}66;transition:all .15s;} .stats-tab.on{background:${T.primary};color:#fff;} .cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:1px;} .cal-cell{min-height:44px;display:flex;flex-direction:column;align-items:center;cursor:pointer;border-radius:5px;padding:2px 1px;position:relative;} input[type='time']::-webkit-calendar-picker-indicator{display:none;width:0;padding:0;margin:0;} input[type='time']{-webkit-appearance:none;} input[type='date'].ob-input::-webkit-date-and-time-value{text-align:center;} input[type='date'].ob-input::-webkit-inner-spin-button{display:none;} input[type='date'].ob-input::-webkit-calendar-picker-indicator{opacity:0;position:absolute;width:100%;height:100%;left:0;top:0;cursor:pointer;} input.ob-input{border:none!important;border-bottom:3px solid!important;border-radius:0!important;background:transparent!important;padding:8px 0!important;width:100%!important;box-shadow:none!important;}`;
}

function Toggle({T,on,label,onToggle}){
  return(
    <div className="trow">
      <span style={{fontSize:15,color:T.text}}>{label}</span>
      <button className="tg" style={{background:on?T.primary:T.soft}} onClick={onToggle}>
        <div className="tg-k" style={{left:on?22:2}}/>
      </button>
    </div>
  );
}

function PinPad({T,title,onDone}){
  const [val,setVal]=useState("");
  const press=k=>{
    if(k==="del"){setVal(v=>v.slice(0,-1));return;}
    if(val.length>=4)return;
    const n=val+k;setVal(n);
    if(n.length===4)setTimeout(()=>onDone(n),80);
  };
  return(
    <div>
      <div style={{textAlign:"center",fontWeight:600,fontSize:16,marginBottom:4,color:T.text}}>{title}</div>
      <div className="pin-dots">{[0,1,2,3].map(i=><div key={i} className={`pin-dot${val.length>i?" on":""}`}/>)}</div>
      <div className="pin-grid">
        {["1","2","3","4","5","6","7","8","9","","0","del"].map((k,i)=>
          k===""?<div key={i}/>:<button key={i} className="pin-btn" style={k==="del"?{fontSize:25}:{}} onClick={()=>press(k)}>{k==="del"?"⌫":k}</button>
        )}
      </div>
    </div>
  );
}

// ── DRAWER ───────────────────────────────────────────────────────────────────
function Drawer({T,open,onClose,onSection,onReset}){
  const items=[
    {icon:Icons.settings,  label:"設定",             key:"settings"},
    {icon:Icons.bell,      label:"通知設定",           key:"notify"},
    {icon:Icons.camSettings,label:"カメラ設定",        key:"cameraSettings"},
    {icon:Icons.timerIcon, label:"タイマー設定",       key:"timerSettings"},
    {icon:Icons.schedule,  label:"交換スケジュール",   key:"schedule"},
    {icon:Icons.palette,   label:"カラーテーマ",       key:"color"},
  ];
  const starIcon=(c,s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
  const coffeeIcon=(c,s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>;
  const giftIcon=(c,s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>;
  const backupIcon=(c,s=18)=>Icons.save(c,s);
  const infoIcon=(c,s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>;

  return(
    <>
      {open&&<div className="overlay" onClick={onClose}/>}
      <div className={`drawer${open?" open":""}`}>
        <div style={{padding:"18px 14px 10px",borderBottom:`1px solid ${T.soft}`}}>
          <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:17,fontWeight:700,color:T.primary}}>SmileTrack</div>
          <div style={{fontSize:11,color:T.text+"88",marginTop:1}}>マウスピース矯正管理</div>
        </div>
        <div style={{padding:"8px 0"}}>
          {/* 設定系 */}
          {items.map(it=>(
            <div key={it.key} className="di" onClick={()=>{onSection(it.key);onClose();}}>
              <span style={{width:26,display:"flex",alignItems:"center",justifyContent:"center"}}>{it.icon(T.primary)}</span>
              <span className="di-lbl">{it.label}</span>
            </div>
          ))}

          <div className="sep"/>

          {/* 課金系 */}
          <div className="di" onClick={()=>{onSection("premium");onClose();}}>
            <span style={{width:26,display:"flex",alignItems:"center",justifyContent:"center"}}>{starIcon(T.primary)}</span>
            <span className="di-lbl">プレミアムプラン</span>
          </div>
          <div className="di" onClick={()=>{onSection("coffee");onClose();}}>
            <span style={{width:26,display:"flex",alignItems:"center",justifyContent:"center"}}>{coffeeIcon(T.primary)}</span>
            <span className="di-lbl">開発者にコーヒーを差し入れ</span>
          </div>

          <div className="sep"/>

          {/* おすすめ */}
          <div className="di" onClick={()=>{window.open(AFFILIATE_ITEMS[0].url,"_blank");onClose();}}>
            <span style={{width:26,display:"flex",alignItems:"center",justifyContent:"center"}}>{giftIcon(T.primary)}</span>
            <span className="di-lbl">おすすめグッズを見る</span>
          </div>

          <div className="sep"/>

          {/* その他 */}
          <div className="di" onClick={()=>{onSection("backup");onClose();}}>
            <span style={{width:26,display:"flex",alignItems:"center",justifyContent:"center"}}>{backupIcon(T.primary)}</span>
            <span className="di-lbl">バックアップ</span>
          </div>
          <div className="di" onClick={()=>{onSection("about");onClose();}}>
            <span style={{width:26,display:"flex",alignItems:"center",justifyContent:"center"}}>{infoIcon(T.primary)}</span>
            <span className="di-lbl">アプリについて</span>
          </div>

          <div className="sep"/>

          <div className="di" onClick={()=>{onReset();onClose();}}>
            <span style={{width:26,display:"flex",alignItems:"center",justifyContent:"center"}}>{Icons.reset("#E74C3C")}</span>
            <span className="di-lbl" style={{color:"#E74C3C"}}>記録をすべてリセット</span>
          </div>
        </div>
      </div>
    </>
  );
}

// ── AFFILIATE POPUP ──────────────────────────────────────────────────────────
const AFFILIATE_ITEMS = [
  {
    id:"cleaner1",
    title:"マウスピース洗浄剤 リテーナーブライト",
    desc:"米国歯科医師会推奨。泡立ちタイプで隅まで洗浄。",
    url:"https://www.rakuten.co.jp/search/?keyword=%E3%83%9E%E3%82%A6%E3%82%B9%E3%83%94%E3%83%BC%E3%82%B9+%E6%B4%97%E6%B5%84%E5%89%A4",
    emoji:"🧼",
  },
  {
    id:"case1",
    title:"マウスピースケース 抗菌タイプ",
    desc:"外出先でも清潔に保管。通気口付きで乾燥しやすい。",
    url:"https://www.rakuten.co.jp/search/?keyword=%E3%83%9E%E3%82%A6%E3%82%B9%E3%83%94%E3%83%BC%E3%82%B9+%E3%82%B1%E3%83%BC%E3%82%B9",
    emoji:"📦",
  },
  {
    id:"pick1",
    title:"矯正用デンタルピック",
    desc:"マウスピース着脱がラクになる専用ツール。",
    url:"https://www.rakuten.co.jp/search/?keyword=%E3%83%9E%E3%82%A6%E3%82%B9%E3%83%94%E3%83%BC%E3%82%B9+%E3%83%84%E3%83%BC%E3%83%AB",
    emoji:"🪥",
  },
];

function AffiliatePopup({T,onClose}){
  const item=AFFILIATE_ITEMS[0];
  return(
    <div className="mo" onClick={onClose}>
      <div className="md" onClick={e=>e.stopPropagation()}>
        <div style={{textAlign:"center",marginBottom:12}}>
          <div style={{fontSize:32,marginBottom:6}}>{item.emoji}</div>
          <div style={{fontFamily:"'M PLUS Rounded 1c',sans-serif",fontSize:15,fontWeight:700,color:T.primary,marginBottom:4}}>矯正ケアグッズのご紹介</div>
          <div style={{fontSize:12,color:T.text+"88",marginBottom:12}}>矯正開始から30日！毎日のケアに役立つグッズをご紹介します。</div>
        </div>
        <div style={{background:T.soft,borderRadius:12,padding:"12px 14px",marginBottom:14}}>
          <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:4}}>{item.title}</div>
          <div style={{fontSize:12,color:T.text+"88",marginBottom:10}}>{item.desc}</div>
          <button className="btn bp" style={{width:"100%"}} onClick={()=>{window.open(item.url,"_blank");onClose();}}>
            楽天で見る →
          </button>
        </div>
        <button className="btn bs" style={{width:"100%"}} onClick={onClose}>閉じる</button>
      </div>
    </div>
  );
}

// ── HOME PREVIEW SVG ─────────────────────────────────────────────────────────
function makeHomeSVG(t) {
  const p=t.primary,s=t.soft,bg=t.bg,card=t.card,tx=t.text;
  const isDark=bg==="#0F1117";
  const navBg=isDark?"#1C1F2E":card;
  return [
    "<svg width='200' height='360' viewBox='0 0 200 360' xmlns='http://www.w3.org/2000/svg'>",
    "<rect width='200' height='360' rx='16' fill='"+bg+"'/>",
    // header
    "<rect width='200' height='40' rx='0' fill='"+navBg+"'/>",
    "<rect width='200' height='40' rx='14' fill='"+navBg+"'/>",
    "<rect y='26' width='200' height='14' fill='"+navBg+"'/>",
    "<text x='100' y='25' text-anchor='middle' font-size='11' font-weight='700' fill='"+p+"' font-family='sans-serif'>SmileTrack</text>",
    // donut bg
    "<circle cx='100' cy='112' r='52' fill='none' stroke='"+s+"' stroke-width='11'/>",
    // donut progress (~70%)
    "<circle cx='100' cy='112' r='52' fill='none' stroke='"+p+"' stroke-width='11' stroke-dasharray='228 327' stroke-dashoffset='0' transform='rotate(-90 100 112)'/>",
    // donut removed
    "<circle cx='100' cy='112' r='52' fill='none' stroke='"+t.removedColor+"' stroke-width='11' stroke-dasharray='70 327' stroke-dashoffset='-228' transform='rotate(-90 100 112)'/>",
    // donut text
    "<text x='100' y='103' text-anchor='middle' font-size='7' fill='"+tx+"77' font-family='sans-serif'>本日の装着時間</text>",
    "<text x='100' y='118' text-anchor='middle' font-size='14' font-weight='700' fill='"+p+"' font-family='sans-serif'>18:42:30</text>",
    "<line x1='82' y1='123' x2='118' y2='123' stroke='"+s+"' stroke-width='1'/>",
    "<text x='100' y='131' text-anchor='middle' font-size='6.5' fill='"+tx+"66' font-family='sans-serif'>取り外し  01:17:30</text>",
    // card row1
    "<rect x='8' y='178' width='88' height='44' rx='10' fill='"+card+"'/>",
    "<rect x='104' y='178' width='88' height='44' rx='10' fill='"+card+"'/>",
    "<text x='52' y='192' text-anchor='middle' font-size='7' fill='"+tx+"66' font-family='sans-serif'>今日</text>",
    "<text x='52' y='212' text-anchor='middle' font-size='17' font-weight='700' fill='"+p+"' font-family='sans-serif'>3</text>",
    "<text x='148' y='192' text-anchor='middle' font-size='7' fill='"+tx+"66' font-family='sans-serif'>交換まで</text>",
    "<text x='148' y='212' text-anchor='middle' font-size='17' font-weight='700' fill='"+p+"' font-family='sans-serif'>4</text>",
    // card row2
    "<rect x='8' y='228' width='88' height='44' rx='10' fill='"+card+"'/>",
    "<rect x='104' y='228' width='88' height='44' rx='10' fill='"+card+"'/>",
    "<text x='52' y='242' text-anchor='middle' font-size='7' fill='"+tx+"66' font-family='sans-serif'>マウスピース</text>",
    "<text x='52' y='262' text-anchor='middle' font-size='17' font-weight='700' fill='"+p+"' font-family='sans-serif'>5</text>",
    "<text x='148' y='242' text-anchor='middle' font-size='7' fill='"+tx+"66' font-family='sans-serif'>残り</text>",
    "<text x='148' y='262' text-anchor='middle' font-size='17' font-weight='700' fill='"+p+"' font-family='sans-serif'>15</text>",
    // progress
    "<rect x='8' y='280' width='184' height='32' rx='10' fill='"+card+"'/>",
    "<text x='18' y='293' font-size='7' fill='"+tx+"66' font-family='sans-serif'>スタートから 45 日目</text>",
    "<text x='182' y='293' text-anchor='end' font-size='7' fill='"+tx+"66' font-family='sans-serif'>あと 95 日</text>",
    "<rect x='16' y='298' width='168' height='7' rx='3.5' fill='"+s+"'/>",
    "<rect x='16' y='298' width='80' height='7' rx='3.5' fill='"+p+"'/>",
    // navbar
    "<rect y='322' width='200' height='38' fill='"+navBg+"'/>",
    "<rect y='320' width='200' height='2' fill='"+s+"'/>",
    "<rect x='4' y='326' width='36' height='28' rx='7' fill='"+s+"'/>",
    "<circle cx='22' cy='340' r='6' fill='"+p+"'/>",
    "<circle cx='62' cy='340' r='4' fill='"+tx+"22'/>",
    "<circle cx='100' cy='340' r='4' fill='"+tx+"22'/>",
    "<circle cx='138' cy='340' r='4' fill='"+tx+"22'/>",
    "<circle cx='178' cy='340' r='4' fill='"+tx+"22'/>",
    "</svg>"
  ].join("");
}

