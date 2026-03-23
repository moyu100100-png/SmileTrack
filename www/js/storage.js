// ── STORAGE LAYER ─────────────────────────────────────────────────────────────
const LS_KEY = "smiletrack_v1";
const IDB_NAME = "SmileTrackDB";
const IDB_STORE = "photos";
const IDB_VERSION = 1;

function openIDB(){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(IDB_NAME,IDB_VERSION);
    req.onupgradeneeded=e=>{
      const db=e.target.result;
      if(!db.objectStoreNames.contains(IDB_STORE)){
        db.createObjectStore(IDB_STORE,{keyPath:"id"});
      }
    };
    req.onsuccess=e=>resolve(e.target.result);
    req.onerror=()=>reject(req.error);
  });
}

async function idbSavePhotos(photos){
  try{
    const db=await openIDB();
    const existing=await new Promise((res,rej)=>{
      const tx=db.transaction(IDB_STORE,"readonly");
      const req=tx.objectStore(IDB_STORE).getAllKeys();
      req.onsuccess=()=>res(req.result||[]);
      req.onerror=()=>rej(req.error);
    });
    const newIds=new Set(photos.map(p=>p.id));
    const existingIds=new Set(existing);
    const tx=db.transaction(IDB_STORE,"readwrite");
    const store=tx.objectStore(IDB_STORE);
    existing.forEach(id=>{ if(!newIds.has(id)) store.delete(id); });
    photos.forEach(p=>{ if(p.data&&!existingIds.has(p.id)) store.put(p); });
    return new Promise((res,rej)=>{tx.oncomplete=res;tx.onerror=()=>rej(tx.error);});
  }catch(e){console.warn("IDB save failed",e);}
}

async function idbLoadPhotos(){
  try{
    const db=await openIDB();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(IDB_STORE,"readonly");
      const req=tx.objectStore(IDB_STORE).getAll();
      req.onsuccess=()=>resolve(req.result||[]);
      req.onerror=()=>reject(req.error);
    });
  }catch(e){console.warn("IDB load failed",e);return[];}
}

function lsSave(state){
  try{
    const toSave={
      ...state,
      photos:(state.photos||[]).map(p=>({...p,data:undefined}))
    };
    localStorage.setItem(LS_KEY,JSON.stringify(toSave));
  }catch(e){console.warn("localStorage save failed",e);}
}

function lsLoad(){
  try{
    const raw=localStorage.getItem(LS_KEY);
    return raw?JSON.parse(raw):null;
  }catch(e){console.warn("localStorage load failed",e);return null;}
}