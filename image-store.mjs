export function openImageStore(){
 return new Promise((resolve,reject)=>{
  if(!globalThis.indexedDB){reject(new Error('Storage unavailable'));return;}
  const request=indexedDB.open('quiet-mouse-images-v16',1);
  request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains('images'))db.createObjectStore('images',{keyPath:'id'});};
  request.onerror=()=>reject(request.error);
  request.onblocked=()=>reject(new Error('Storage is busy in another tab'));
  request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>db.close();resolve({
   read:()=>new Promise((yes,no)=>{const tx=db.transaction('images','readonly'),req=tx.objectStore('images').getAll();req.onsuccess=()=>yes(req.result);req.onerror=()=>no(req.error);}),
   write:rows=>new Promise((yes,no)=>{const tx=db.transaction('images','readwrite'),store=tx.objectStore('images');store.clear();for(const row of rows)store.put(row);tx.oncomplete=()=>yes();tx.onabort=()=>no(tx.error||new Error('Save interrupted'));tx.onerror=()=>no(tx.error);})
  });};
 });
}
