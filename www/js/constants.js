const IS_PREMIUM = true; // ここだけ変えればOK

const THEMES = {
  // ── S1〜S6 単色テーマ ────────────────────────────────────────────────────
  blush:      { primary:"#D4788A", accent:"#A84860", bg:"#FEF5F7", card:"#FFFFFF", soft:"#FAE0E6", text:"#3A1020", secondary:"#FAE0E6", removedColor:"#F4C8D0" },
  wisteria:   { primary:"#9B87B8", accent:"#72608E", bg:"#FAF8FD", card:"#FFFFFF", soft:"#EFE8F8", text:"#2C1F42", secondary:"#EFE8F8", removedColor:"#DDD0F0" },
  glacier:    { primary:"#5AAAA0", accent:"#347A72", bg:"#F2FBFA", card:"#FFFFFF", soft:"#D4F0EC", text:"#0A2826", secondary:"#D4F0EC", removedColor:"#B8E4E0" },
  powder:     { primary:"#7AAFC8", accent:"#4E88A8", bg:"#F4F9FC", card:"#FFFFFF", soft:"#DAEEF8", text:"#102030", secondary:"#DAEEF8", removedColor:"#C0D8EC" },
  amber:      { primary:"#C89040", accent:"#9A6A20", bg:"#FDF9F2", card:"#FFFFFF", soft:"#FAF0D8", text:"#3A2408", secondary:"#FAF0D8", removedColor:"#ECDCB8" },
  night:      { primary:"#6C9EFF", accent:"#4F7FFF", bg:"#0F1117", card:"#1C1F2E", soft:"#1E2235", text:"#E8EAF6", secondary:"#A78BFA", removedColor:"#2A3050" },
  // ── A1〜A6 アクセントカラーあり ─────────────────────────────────────────
  atrium:     { primary:"#98C8CC", accent:"#5A9EA4", bg:"#F8F7F5", card:"#FFFFFF", soft:"#5A452C", text:"#2C1E10", secondary:"#5A452C", removedColor:"#D8EFEF" },
  navyrose:   { primary:"#023059", accent:"#708BB2", bg:"#F4F6FA", card:"#FFFFFF", soft:"#8C613B", text:"#011828", secondary:"#8C613B", removedColor:"#C0CCDC" },
  deepteal:   { primary:"#2E6858", accent:"#1c3f35", bg:"#F2EDE4", card:"#FFFFFF", soft:"#C8A870", text:"#0E2418", secondary:"#C8A870", removedColor:"#B0D8CC" },
  elegan:     { primary:"#773335", accent:"#6e6466", bg:"#cdcdc3", card:"#FFFFFF", soft:"#bbada9", text:"#373838", secondary:"#bbada9", removedColor:"#C8B0B0" },
  ashviolet:  { primary:"#092948", accent:"#7A8A9A", bg:"#F3EBD9", card:"#FFFFFF", soft:"#C49090", text:"#0A1828", secondary:"#D8E8F4", removedColor:"#C8D8E8" },
  blushhemp:  { primary:"#C49090", accent:"#E8D8C8", bg:"#FAF6F2", card:"#FFFFFF", soft:"#7A5048", text:"#1A0C08", secondary:"#C49090", removedColor:"#D8C8B8" },
};

// 理由リストはstateから動的に取得する
const DEFAULT_REASONS = ["朝食","昼食","夕食","間食","洗浄","その他"];
// 選択中5項目を返す（ーは含まない）
function getReasonList(state){
  if(state&&state.activeReasons&&state.activeReasons.length>0) return state.activeReasons;
  return DEFAULT_REASONS.slice(0,5);
}

// セッションが指定日に属するか（startあり・なし両対応）
const sessInDay=(s,dayStartMs,ds)=>
  s.start ? (s.start>=dayStartMs && s.start<dayStartMs+86400000)
          : (s.day===ds);

const defaultState = () => {
  const now2=new Date();
  const pad=n=>String(n).padStart(2,"0");
  const todayDs=`${now2.getFullYear()}-${pad(now2.getMonth()+1)}-${pad(now2.getDate())}`;
  return ({
    themeName:"powder",
    startDate:todayDs,
    totalPieces:20,
    intervalDays:7,
    currentPiece:1,
    extraPieces:[],
    timerRunning:false, timerStart:null, timerElapsed:0,
    timerSessions:[],
    dailyWearLog:{},
    photos:[], dentistName:"", dentistPhone:"", dentistNote:"",
    appointments:[],
    diary:[], alarmMinutes:30, alarmEnabled:false, alarmSound:"standard",
    customIntervals:{},
    photoLock:null, photoLockEnabled:false, targetWearHours:22,
    notifyBefore:1440, notifyOnDay:true, notifyTime:"09:00", _pendingReason:null,
    photoReminderMode:"exchange", photoReminderDay:0, forgetTimerRepeat:true,
    showReasonBreakdown:true,
    forgetTimerAlert:true, forgetTimerHours:4,
    settings:{ reminderAligner:true, reminderExchange:true, reminderPhoto:true, calendarWeekStart:0 },
    customReasons:["朝食","昼食","夕食","間食","洗浄","その他","カフェ","歯磨き","運動"],
    activeReasons:["朝食","昼食","夕食","間食","洗浄"],
    cameraSettings:{
      mirrorSave:false,
      slot1:"teeth_front",
      slot2:"face_front",
    },
    isPremium: IS_PREMIUM,
    affiliatePopupShown: null, // 最後にポップアップを表示した日付(YYYY-MM-DD)
  });
};

// ── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = s => { if(s<0)s=0; return `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`; };
const fmtHM = s => { if(s<0)s=0; const h=Math.floor(s/3600),m=Math.floor((s%3600)/60); return h>0?`${h}時間${String(m).padStart(2,"0")}分`:`${m}分`; };
// DateオブジェクトをYYYY-MM-DDに変換（タイムゾーン問題回避）
const dsFromDate = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

// 端末のタイムゾーンで今日の日付を返す
const todayISO = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
};

const fmtDateJP = ds => { if(!ds) return "—"; const d=new Date(ds+"T00:00:00"); return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`; };

function buildPieceList(state) {
  const list = [];
  for(let i=1;i<=state.totalPieces;i++) list.push({n:i, label:`${i}`, intervalDays: state.customIntervals?.[i] || state.intervalDays});
  const extras = state.extraPieces || [];
  const mode = state.extraLabelMode || "relative";
  extras.forEach((ep,idx) => {
    const n = state.totalPieces + idx + 1;
    let label;
    if(mode==="absolute"){
      label = `${n}`;
    } else {
      // バッチ内のインデックスで+1から始める
      label = `+${(ep.batchIdx||0)+1}`;
    }
    list.push({n, label, intervalDays: ep.intervalDays || state.intervalDays, isExtra:true, epIdx:idx});
  });
  return list;
}

function getExchangeDate(state, pieceN) {
  if(!state.startDate) return null;
  const list = buildPieceList(state);
  let days = 0;
  for(let i=0; i<list.length; i++) {
    if(list[i].n === pieceN) break;
    days += list[i].intervalDays;
  }
  const d = new Date(state.startDate+"T00:00:00");
  d.setDate(d.getDate()+days);
  return d;
}

function getExchangeEndDate(state, pieceN) {
  const list = buildPieceList(state);
  const idx = list.findIndex(p => p.n === pieceN);
  if(idx < 0) return null;
  const start = getExchangeDate(state, pieceN);
  if(!start) return null;
  const end = new Date(start);
  end.setDate(end.getDate() + list[idx].intervalDays - 1);
  return end;
}

function isExDay(state, ds) {
  const list = buildPieceList(state);
  for(const p of list) {
    const ex = getExchangeDate(state, p.n);
    if(ex && dsFromDate(ex)===ds) return true;
  }
  return false;
}
function getExPieceLabel(state, ds) {
  const list = buildPieceList(state);
  for(const p of list) {
    const ex = getExchangeDate(state, p.n);
    if(ex && dsFromDate(ex)===ds) return p.label;
  }
  return null;
}

// startDateから今日が何枚目・何日目かを全自動計算
function getCurrentPieceInfo(state, todayStr) {
  if(!state.startDate) return {pieceN:1, dayNum:1, interval:state.intervalDays||7, pieceIdx:0};
  const list = buildPieceList(state);
  if(!list.length) return {pieceN:1, dayNum:1, interval:state.intervalDays||7, pieceIdx:0};
  const todayMs = new Date(todayStr+"T00:00:00").getTime();
  const startMs = new Date(state.startDate+"T00:00:00").getTime();
  const elapsedDays = Math.max(0, Math.floor((todayMs - startMs)/86400000)); // 0-indexed
  let cumDays = 0;
  for(let i=0;i<list.length;i++){
    const p = list[i];
    if(elapsedDays < cumDays + p.intervalDays){
      return {pieceN:p.n, label:p.label, dayNum:elapsedDays - cumDays + 1, interval:p.intervalDays, pieceIdx:i};
    }
    cumDays += p.intervalDays;
  }
  // 矯正期間終了後は最終ピースの最終日
  const last = list[list.length-1];
  return {pieceN:last.n, label:last.label, dayNum:last.intervalDays, interval:last.intervalDays, pieceIdx:list.length-1};
}

function getDaysToNextExchange(state, todayStr) {
  const {pieceIdx, dayNum, interval} = getCurrentPieceInfo(state, todayStr);
  return interval - dayNum; // 0=今日が最終日(交換日)
}

function getTotalEndDate(state) {
  const list = buildPieceList(state);
  if(!list.length || !state.startDate) return null;
  let totalDays = 0;
  list.forEach(p => totalDays += p.intervalDays);
  const end = new Date(state.startDate+"T00:00:00");
  // 開始日を1日目とすると最終日 = 開始日 + totalDays - 1
  end.setDate(end.getDate() + totalDays - 1);
  return end;
}


// ── ALARM SOUND ──────────────────────────────────────────────────────────────
// Capacitor導入後はplayAlarmSound内をネイティブ音源呼び出しに差し替えてください
const ALARM_SOUNDS = [
  {id:"standard", label:"標準",  desc:"電子音（ピピピッ）"},
  {id:"soft",     label:"ソフト", desc:"優しいピアノ音"},
  {id:"warning",  label:"警告",  desc:"強めのリバース音"},
  {id:"nature",   label:"自然",  desc:"小鳥のさえずり"},
  {id:"bell",     label:"ベル",  desc:"チリンチリン"},
];

function playAlarmSound(soundId){
  // ── ここをCapacitor導入後にネイティブ音源に差し替え ──
  try {
    const ctx = new (window.AudioContext||window.webkitAudioContext)();
    const play = (freq, type, start, dur, gain=0.3) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(gain, ctx.currentTime + start);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      o.start(ctx.currentTime + start);
      o.stop(ctx.currentTime + start + dur + 0.05);
    };
    switch(soundId){
      case "standard":
        play(880,"sine",0,0.12); play(1046,"sine",0.15,0.12); play(1318,"sine",0.3,0.18);
        break;
      case "soft":
        play(523,"sine",0,0.4,0.15); play(659,"sine",0.2,0.4,0.12); play(784,"sine",0.4,0.5,0.1);
        break;
      case "warning":
        play(440,"sawtooth",0,0.15,0.25); play(330,"sawtooth",0.2,0.15,0.25); play(220,"sawtooth",0.4,0.2,0.3);
        break;
      case "nature":
        [0,0.15,0.3,0.45,0.6].forEach((t,i)=>play(2000+i*200,"sine",t,0.1,0.12));
        break;
      case "bell":
        play(1567,"sine",0,0.6,0.2); play(2093,"sine",0.05,0.4,0.1); play(1567,"sine",0.35,0.5,0.15);
        break;
      default:
        play(880,"sine",0,0.2);
    }
  } catch(e){ console.warn("Audio error:", e); }
}



// 通知許可チェック（ONにした時だけ呼ぶ）
async function ensureNotifPermission(){
  if(!Notif.isCapacitor()) return true;
  const granted = await Notif.checkPermission();
  if(!granted){
    await Notif.openSettings();
    return false;
  }
  return true;
}

// ── NOTIFICATION SCHEDULER ───────────────────────────────────────────────────
function scheduleExchangeNotif(state){
  if(!Notif.isCapacitor()) return;
  if(!state.settings?.reminderExchange) return;
  if(!state.nextExchangeDate) return;
  Notif.cancel([2001]);
  const hour = state.exchangeNotifyHour??9;
  const before = state.notifyBefore??1440; // 分（0=当日、1440=前日、2880=2日前）
  const exchDate = new Date(state.nextExchangeDate+"T"+String(hour).padStart(2,"0")+":00:00");
  // 通知日時 = 交換日のhour時 - before分（beforeが0なら当日、1440なら前日）
  const notifMs = exchDate.getTime() - before*60000;
  if(notifMs > Date.now()){
    const msg = before===0 ? "今日は交換日です！" : before===1440 ? "明日は交換日です！" : `${before/1440}日後に交換日があります`;
    Notif.schedule(2001,"💎 マウスピース交換",msg,notifMs);
  }
}

function schedulePhotoNotif(state){
  if(!Notif.isCapacitor()) return;
  if(!state.settings?.reminderPhoto) return;
  Notif.cancel([3001]);
  const hour = state.photoNotifyHour??9;
  const now = new Date();
  // 翌週の指定曜日 or 交換日
  let target;
  if(state.photoReminderMode==="exchange"&&state.nextExchangeDate){
    target = new Date(state.nextExchangeDate+"T"+String(hour).padStart(2,"0")+":00:00");
  } else {
    const day = state.photoReminderDay??0;
    target = new Date();
    target.setHours(hour,0,0,0);
    const diff=(day-now.getDay()+7)%7||7;
    target.setDate(target.getDate()+diff);
  }
  if(target>now) Notif.schedule(3001,"📸 写真リマインダー","矯正の経過写真を撮りましょう！",target.getTime());
}

// ── ICONS ────────────────────────────────────────────────────────────────────
