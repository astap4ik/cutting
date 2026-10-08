const CuttingDB=(()=>{
 const name='cutting-mvp',version=1,store='layouts';
 function open(){return new Promise((resolve,reject)=>{const r=indexedDB.open(name,version);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(store))r.result.createObjectStore(store,{keyPath:'id'})};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
 async function all(){const db=await open();return new Promise((resolve,reject)=>{const r=db.transaction(store).objectStore(store).getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
 async function put(value){const db=await open();return new Promise((resolve,reject)=>{const r=db.transaction(store,'readwrite').objectStore(store).put(value);r.onsuccess=()=>resolve(value);r.onerror=()=>reject(r.error)})}
 async function remove(id){const db=await open();return new Promise((resolve,reject)=>{const r=db.transaction(store,'readwrite').objectStore(store).delete(id);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}
 async function migrate(){if(localStorage.cutLayouts){const old=JSON.parse(localStorage.cutLayouts);for(const x of old)await put(x);localStorage.removeItem('cutLayouts')}
  return all();
 }
 return {all,put,remove,migrate};
})();
