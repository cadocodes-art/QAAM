// Presentation only: the microphone, animal simulation and camera keep running.
export function initControlsVisibility(){
 const delay=2000,selector='.header-actions, .autoscroll, footer, #enableMotion, .text-move';
 const welcome=document.getElementById('welcome'),dialogs=[...document.querySelectorAll('dialog')];
 const held=new Set(),wakeTouches=new Set();
 let timer=0,lastActivity=performance.now(),asleep=false,keyboard=false,suppressClickUntil=0;
 const targets=()=>[...document.querySelectorAll(selector)];
 function protectInteraction(){
  if(!welcome.hidden||dialogs.some(d=>d.open)||held.size)return true;
  return keyboard&&!!document.activeElement?.closest('button,input,textarea,select,[contenteditable="true"]');
 }
 function show(showing){
  if(asleep===!showing)return;
  asleep=!showing;document.body.classList.toggle('controls-asleep',asleep);
  for(const target of targets()){
   target.inert=asleep;
   if(asleep)target.setAttribute('aria-hidden','true');else target.removeAttribute('aria-hidden');
  }
 }
 function check(){
  clearTimeout(timer);
  if(document.hidden)return;
  if(protectInteraction()){show(true);return;}
  const remaining=delay-(performance.now()-lastActivity);
  if(remaining>0)timer=setTimeout(check,remaining);else show(false);
 }
 function wake(){lastActivity=performance.now();show(true);clearTimeout(timer);timer=setTimeout(check,delay);}
 document.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'||e.buttons||e.pointerType==='touch'){keyboard=false;wake();}},{passive:true,capture:true});
 document.addEventListener('pointerdown',e=>{
  const firstTap=asleep&&e.pointerType!=='mouse';keyboard=false;held.add(e.pointerId);suppressClickUntil=0;wake();
  // On tablets and phones the first tap reveals controls without pressing one.
  if(firstTap){wakeTouches.add(e.pointerId);e.preventDefault();e.stopImmediatePropagation();}
 },{capture:true});
 function release(e){
  held.delete(e.pointerId);
  if(wakeTouches.delete(e.pointerId))suppressClickUntil=performance.now()+500;
  wake();
 }
 document.addEventListener('pointerup',release,true);document.addEventListener('pointercancel',release,true);
 document.addEventListener('click',e=>{if(performance.now()<suppressClickUntil){e.preventDefault();e.stopImmediatePropagation();}else wake();},true);
 document.addEventListener('wheel',()=>{keyboard=false;wake();},{passive:true,capture:true});
 document.addEventListener('keydown',()=>{keyboard=true;wake();},true);
 document.addEventListener('focusin',wake,true);
 document.addEventListener('focusout',()=>{if(!asleep)queueMicrotask(wake);},true);
 window.addEventListener('blur',()=>{held.clear();wakeTouches.clear();check();});
 document.addEventListener('visibilitychange',()=>{held.clear();wakeTouches.clear();if(document.hidden)clearTimeout(timer);else wake();});
 const observer=new MutationObserver(wake);
 observer.observe(welcome,{attributes:true,attributeFilter:['hidden']});
 for(const dialog of dialogs)observer.observe(dialog,{attributes:true,attributeFilter:['open']});
 wake();
}
