import {MAX_IMAGES,MAX_IMAGE_BYTES,IMAGE_TYPES,normalizeImages,imageLayout,moveImage} from './image-model.mjs';
import {openImageStore} from './image-store.mjs';
export function initImages({announce,onInteract=()=>{}}){
 const $=id=>document.getElementById(id),layer=$('imageLayer'),dialog=$('imageDialog'),nodes=new Map();
 let items=[],selected=null,store=null,busy=true,drag=null,serial=0,saveTimer=0,queue=Promise.resolve(),revision=0;
 const current=()=>items.find(i=>i.id===selected);
 const status=text=>{$('imageSaveStatus').textContent=text;};
 function save(){
  clearTimeout(saveTimer);const rows=items.map(i=>({...i})),rev=++revision;
  if(!store){status('Images will last for this visit. Your browser could not save them.');return;}
  status('Saving images…');
  queue=queue.catch(()=>{}).then(()=>store.write(rows)).then(()=>{if(rev===revision)status('Saved in this browser. Your images stay in place while the meadow scrolls.');}).catch(()=>{if(rev===revision)status('Your browser could not save these images. They will last for this visit.');});
 }
 function scheduleSave(){clearTimeout(saveTimer);saveTimer=setTimeout(save,180);}
 function place(item){const node=nodes.get(item.id)?.node;if(!node)return;const r=layer.getBoundingClientRect(),p=imageLayout(item,r.width,r.height);Object.assign(node.style,{left:p.left+'px',top:p.top+'px',width:p.width+'px',height:p.height+'px'});}
 function paintAll(){for(const item of items){place(item);nodes.get(item.id).node.classList.toggle('selected',dialog.open&&selected===item.id);}}
 const resize=new ResizeObserver(paintAll);resize.observe(layer);
 function fields(){const item=current();$('imageEditor').hidden=!item;$('imageEmpty').hidden=items.length>0;if(!item)return;
  $('imageScale').value=item.scale;$('imageX').value=Math.round(item.x*100);$('imageY').value=Math.round(item.y*100);
  $('imageScaleValue').textContent=Math.round(item.scale)+'%';$('imageXValue').textContent=Math.round(item.x*100)+'%';$('imageYValue').textContent=Math.round(item.y*100)+'%';
 }
 function list(){
  $('imageList').replaceChildren();for(const item of items){const button=document.createElement('button');button.type='button';button.className='image-choice';button.setAttribute('aria-pressed',String(item.id===selected));
   const thumb=document.createElement('img');thumb.src=nodes.get(item.id).url;thumb.alt='';const name=document.createElement('span');name.textContent=item.name;button.append(thumb,name);button.onclick=()=>select(item.id);$('imageList').append(button);
  }
  $('imageCount').textContent=items.length+' / '+MAX_IMAGES+' images';$('importImages').disabled=busy||items.length>=MAX_IMAGES;$('imageLimit').hidden=items.length<MAX_IMAGES;
 }
 function select(id){selected=id;list();fields();paintAll();}
 function open(id){onInteract();if(id)selected=id;if(!dialog.open)dialog.showModal();select(selected);}
 function finish(e){if(!drag||e?.pointerId!==undefined&&e.pointerId!==drag.pointerId)return;const d=drag;drag=null;d.node.classList.remove('dragging');if(d.handle.hasPointerCapture(d.pointerId))d.handle.releasePointerCapture(d.pointerId);onInteract();save();}
 function mount(item){
  const url=URL.createObjectURL(item.blob),node=document.createElement('div');node.className='image-overlay';node.dataset.imageId=item.id;
  const button=document.createElement('button');button.type='button';button.className='image-content';button.setAttribute('aria-label','Edit image: '+item.name);button.title='Edit image';
  const img=document.createElement('img');img.src=url;img.alt=item.name;img.draggable=false;button.append(img);button.onclick=()=>open(item.id);
  const handle=document.createElement('button');handle.type='button';handle.className='image-move';handle.textContent='✥';handle.title='Drag to move. Arrow keys also move this image.';handle.setAttribute('aria-label','Move image: '+item.name);
  node.append(handle,button);layer.append(node);nodes.set(item.id,{node,url});place(item);
  handle.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0||drag)return;e.preventDefault();e.stopPropagation();onInteract();const r=layer.getBoundingClientRect(),p=imageLayout(item,r.width,r.height);drag={item,node,handle,pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,origin:{x:item.x,y:item.y},rangeX:p.rangeX,rangeY:p.rangeY};node.classList.add('dragging');handle.setPointerCapture(e.pointerId);});
  handle.addEventListener('pointermove',e=>{if(!drag||drag.pointerId!==e.pointerId)return;e.preventDefault();onInteract();Object.assign(item,moveImage(drag.origin,e.clientX-drag.startX,e.clientY-drag.startY,drag.rangeX,drag.rangeY));place(item);});
  for(const type of ['pointerup','pointercancel','lostpointercapture'])handle.addEventListener(type,finish);
  handle.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();e.stopPropagation();onInteract();const r=layer.getBoundingClientRect(),p=imageLayout(item,r.width,r.height),step=e.shiftKey?20:5;Object.assign(item,moveImage(item,e.key==='ArrowLeft'?-step:e.key==='ArrowRight'?step:0,e.key==='ArrowUp'?-step:e.key==='ArrowDown'?step:0,p.rangeX,p.rangeY));place(item);save();});
 }
 async function decode(file){
  if(!IMAGE_TYPES.has(file.type))throw new Error(file.name+': use a PNG, JPG, WebP, or GIF image.');
  if(file.size>MAX_IMAGE_BYTES)throw new Error(file.name+': choose an image smaller than 20 MB.');
  const url=URL.createObjectURL(file),img=new Image();
  try{await new Promise((yes,no)=>{img.onload=yes;img.onerror=()=>no(new Error(file.name+': this image could not be opened.'));img.src=url;});
   const width=img.naturalWidth,height=img.naturalHeight;if(!width||!height)throw new Error(file.name+': this image is empty.');
   const ratio=Math.min(1,2048/Math.max(width,height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(width*ratio));canvas.height=Math.max(1,Math.round(height*ratio));
   const context=canvas.getContext('2d');if(!context)throw new Error('This browser could not import the image.');context.drawImage(img,0,0,canvas.width,canvas.height);
   const blob=await new Promise(yes=>canvas.toBlob(yes,'image/png'));if(!blob||blob.size>MAX_IMAGE_BYTES)throw new Error(file.name+': choose a smaller image.');
   return {blob,width:canvas.width,height:canvas.height};
  }finally{URL.revokeObjectURL(url);}
 }
 async function importFiles(files){
  if(busy)return;busy=true;list();$('imageImportStatus').textContent='Importing…';const errors=[];let added=0,skipped=0;
  try{for(const file of files){if(items.length>=MAX_IMAGES){skipped++;continue;}try{
    const decoded=await decode(file),item={id:'image-'+Date.now().toString(36)+'-'+(++serial),name:file.name.slice(0,100)||'Image',...decoded,scale:30,x:.35+(items.length%3)*.15,y:.45+Math.floor(items.length/3)*.15};items.push(item);mount(item);selected=item.id;added++;
   }catch(error){errors.push(error.message||'An image could not be imported.');}}
  }finally{busy=false;$('imageFiles').value='';select(selected);if(added)save();$('imageImportStatus').textContent=[added?`${added} ${added===1?'image':'images'} imported.`:'',skipped?`${skipped} skipped: the limit is 5 images.`:'',...errors].filter(Boolean).join(' ');}
 }
 $('imageButton').onclick=()=>open();$('importImages').onclick=()=>$('imageFiles').click();$('imageFiles').onchange=()=>importFiles([...$('imageFiles').files]);
 for(const [id,key] of [['imageScale','scale'],['imageX','x'],['imageY','y']]){$(id).addEventListener('input',()=>{const item=current();if(!item)return;item[key]=Number($(id).value)/(key==='scale'?1:100);place(item);fields();scheduleSave();});$(id).addEventListener('change',save);}
 $('removeImage').onclick=()=>{const item=current();if(!item)return;finish();const index=items.indexOf(item),entry=nodes.get(item.id);entry.node.remove();URL.revokeObjectURL(entry.url);nodes.delete(item.id);items.splice(index,1);select(items[Math.min(index,items.length-1)]?.id??null);save();$('importImages').focus();announce('Image removed.');};
 dialog.addEventListener('close',()=>{paintAll();onInteract();if(saveTimer)save();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){finish();if(saveTimer)save();}});window.addEventListener('pagehide',()=>{finish();if(saveTimer)save();});
 list();fields();status('Loading saved images…');
 openImageStore().then(async value=>{store=value;items=normalizeImages(await store.read());for(const item of items)mount(item);selected=items[0]?.id??null;status('Saved in this browser. Your images stay in place while the meadow scrolls.');}).catch(()=>{store=null;status('Images will last for this visit. Your browser could not restore or save them.');}).finally(()=>{busy=false;list();fields();});
 return {isEditing:()=>dialog.open||!!drag};
}
