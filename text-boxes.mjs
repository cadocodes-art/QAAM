import {TEXT_KEY,MAX_BOXES,MAX_TEXT,FONTS,normalizeNotes,notePosition,dragPosition} from './text-model.mjs';

export function initTextBoxes({announce,onInteract=()=>{}}){
 const $=id=>document.getElementById(id),layer=$('textLayer'),dialog=$('textDialog');
 const fields={text:$('textContent'),font:$('textFont'),size:$('textSize'),color:$('textColor'),backing:$('textBacking'),x:$('textX'),y:$('textY')};
 let notes=[],selected=null,drag=null,serial=0,failed=false;
 const nodes=new Map();
 try{notes=normalizeNotes(JSON.parse(localStorage.getItem(TEXT_KEY)||'[]'));}catch{failed=true;}
 selected=notes[0]?.id??null;
 const current=()=>notes.find(n=>n.id===selected);
 const fontStack=name=>FONTS.find(([font])=>font===name)[1];
 function save(){
  try{localStorage.setItem(TEXT_KEY,JSON.stringify(notes));failed=false;}catch{failed=true;}
  $('textSaveStatus').textContent=failed?'Your browser could not save these boxes. They will last for this visit.':'Saved on this browser. Boxes stay in place while the meadow scrolls.';
 }
 function place(note){
  const node=nodes.get(note.id);if(!node)return;
  const size=layer.getBoundingClientRect(),box=node.getBoundingClientRect();
  const point=notePosition(note,size.width,size.height,box.width,box.height);
  node.style.left=point.left+'px';node.style.top=point.top+'px';
 }
 function paint(note){
  const node=nodes.get(note.id),content=node.querySelector('.text-content');
  content.textContent=note.text||'Your text';
  content.style.fontFamily=fontStack(note.font);content.style.fontSize=note.size+'px';content.style.color=note.color;
  node.classList.toggle('with-backing',note.backing);
  node.classList.toggle('selected',note.id===selected&&dialog.open);
  content.setAttribute('aria-label','Edit text: '+(note.text||'Empty text box').slice(0,100));
  place(note);
 }
 function updateFields(){
  const note=current();$('textEditor').hidden=!note;$('textEmpty').hidden=!!note;
  if(!note)return;
  for(const [key,field] of Object.entries(fields)){
   if(key==='backing')field.checked=note.backing;
   else field.value=key==='x'||key==='y'?Math.round(note[key]*100):note[key];
  }
  updateOutputs(note);
 }
 function updateOutputs(note){
  $('textSizeValue').textContent=note.size+' px';$('textXValue').textContent=Math.round(note.x*100)+'%';$('textYValue').textContent=Math.round(note.y*100)+'%';
  $('textLength').textContent=note.text.length+' / '+MAX_TEXT;
  $('textFontHelp').textContent=['Roboto','Open Sans'].includes(note.font)?'Included with QAAM on every device.':'If this font is missing on a device, a similar font is used.';
 }
 function refreshList(){
  $('textList').replaceChildren();
  notes.forEach((note,i)=>{
   const item=document.createElement('button');item.type='button';item.className='text-choice';
   item.textContent=(i+1)+'. '+(note.text.trim().split('\n')[0]||'Empty text box');
   item.setAttribute('aria-pressed',String(note.id===selected));item.onclick=()=>select(note.id);
   $('textList').append(item);
  });
  $('textBoxCount').textContent=notes.length+' / '+MAX_BOXES+' boxes';
  $('addText').disabled=notes.length>=MAX_BOXES;
  $('textLimit').hidden=notes.length<MAX_BOXES;
 }
 function select(id){selected=id;refreshList();updateFields();for(const note of notes)paint(note);}
 function open(id){
  onInteract();if(id)selected=id;if(!dialog.open)dialog.showModal();select(selected);
 }
 function finishDrag(event){
  if(!drag||event&&event.pointerId!==undefined&&event.pointerId!==drag.pointerId)return;
  const moving=drag;drag=null;moving.node.classList.remove('dragging');
  if(moving.handle.hasPointerCapture?.(moving.pointerId))moving.handle.releasePointerCapture(moving.pointerId);
  onInteract();save();
 }
 const resize=new ResizeObserver(()=>{for(const note of notes)place(note);});resize.observe(layer);
 function mount(note){
  const node=document.createElement('div');node.className='text-box';node.dataset.textId=note.id;
  const handle=document.createElement('button');handle.type='button';handle.className='text-move';handle.textContent='✥';handle.title='Drag to move. Arrow keys also move this box.';
  handle.setAttribute('aria-label','Move text box. Drag, or use arrow keys.');
  const content=document.createElement('button');content.type='button';content.className='text-content';content.title='Edit text';
  let tap=null,lastTouchEdit=0;
  content.onclick=()=>{if(Date.now()-lastTouchEdit>500)open(note.id);};
  // Touch browsers can suppress the compatibility click after a captured drag.
  // Handle a stationary tap directly, while allowing long messages to scroll.
  content.addEventListener('pointerdown',e=>{tap=e.pointerType!=='mouse'?{id:e.pointerId,x:e.clientX,y:e.clientY,scroll:content.scrollTop}:null;});
  content.addEventListener('pointerup',e=>{
   if(tap&&tap.id===e.pointerId&&Math.hypot(e.clientX-tap.x,e.clientY-tap.y)<8&&Math.abs(content.scrollTop-tap.scroll)<2){e.preventDefault();lastTouchEdit=Date.now();open(note.id);}tap=null;
  });
  content.addEventListener('pointercancel',()=>{tap=null;});
  node.append(handle,content);nodes.set(note.id,node);layer.append(node);resize.observe(node);
  handle.addEventListener('pointerdown',e=>{
   if(e.button!==0&&e.pointerType==='mouse'||drag)return;
   e.preventDefault();e.stopPropagation();onInteract();
   const view=layer.getBoundingClientRect(),box=node.getBoundingClientRect(),point=notePosition(note,view.width,view.height,box.width,box.height);
   drag={node,handle,pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,note,origin:{x:note.x,y:note.y},rangeX:point.rangeX,rangeY:point.rangeY};
   node.classList.add('dragging');handle.setPointerCapture(e.pointerId);
  });
  handle.addEventListener('pointermove',e=>{
   if(!drag||e.pointerId!==drag.pointerId)return;
   e.preventDefault();onInteract();Object.assign(note,dragPosition(drag.origin,e.clientX-drag.startX,e.clientY-drag.startY,drag.rangeX,drag.rangeY));place(note);
  });
  for(const type of ['pointerup','pointercancel','lostpointercapture'])handle.addEventListener(type,finishDrag);
  handle.addEventListener('keydown',e=>{
   if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;
   e.preventDefault();e.stopPropagation();onInteract();
   const view=layer.getBoundingClientRect(),box=node.getBoundingClientRect(),point=notePosition(note,view.width,view.height,box.width,box.height),step=e.shiftKey?20:5;
   Object.assign(note,dragPosition(note,e.key==='ArrowLeft'?-step:e.key==='ArrowRight'?step:0,e.key==='ArrowUp'?-step:e.key==='ArrowDown'?step:0,point.rangeX,point.rangeY));place(note);save();
  });
  paint(note);
 }
 for(const [name,stack] of FONTS){const option=document.createElement('option');option.value=name;option.textContent=name;option.style.fontFamily=stack;fields.font.append(option);}
 for(const note of notes)mount(note);
 $('textButton').onclick=()=>open();
 $('addText').onclick=()=>{
  if(notes.length>=MAX_BOXES){announce('You can have up to 10 text boxes. Remove one to add another.');return;}
  const n=notes.length,id='text-'+Date.now().toString(36)+'-'+(++serial).toString(36);
  const note=normalizeNotes([{id,text:'Your text',font:'Arial',size:32,backing:true,x:.34+(n%3)*.12,y:.36+Math.floor(n/3)*.1}])[0];
  notes.push(note);mount(note);select(note.id);save();fields.text.focus();fields.text.select();
 };
 for(const [key,field] of Object.entries(fields))field.addEventListener('input',()=>{
  const note=current();if(!note)return;
  let value=key==='backing'?field.checked:key==='size'?Number(field.value):key==='x'||key==='y'?Number(field.value)/100:field.value;
  Object.assign(note,normalizeNotes([{...note,[key]:value}])[0]);
  if(key==='text'&&field.value.length>MAX_TEXT)field.value=note.text;
  paint(note);updateOutputs(note);if(key==='text')refreshList();save();
 });
 $('removeText').onclick=()=>{
  const note=current();if(!note)return;
  const index=notes.indexOf(note),node=nodes.get(note.id);resize.unobserve(node);node.remove();nodes.delete(note.id);notes.splice(index,1);
  select(notes[Math.min(index,notes.length-1)]?.id??null);save();$('addText').focus();announce('Text box removed.');
 };
 dialog.addEventListener('close',()=>{for(const note of notes)paint(note);onInteract();});
 window.addEventListener('pagehide',()=>{finishDrag();save();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){finishDrag();save();}});
 document.fonts?.ready.then(()=>{for(const note of notes)place(note);});
 refreshList();updateFields();
 $('textSaveStatus').textContent=failed?'Saved text could not be restored. New boxes will be saved when possible.':'Saved on this browser. Boxes stay in place while the meadow scrolls.';
 return {isEditing:()=>dialog.open||!!drag};
}
