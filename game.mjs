import {initTextBoxes} from './text-boxes.mjs';
import {TIERS,SPECIES} from './data.mjs';
import {advance,makeState,clamp,volumeLevel} from './core.mjs';
import {PANORAMA,SCENE_HEIGHT,SCENE_RATIO,habitatBounds,waterClip} from './panorama.mjs';
import {art} from './art.mjs';
import {animateCritter} from './animal-motion.mjs';
import {visualProfile} from './motion-profile.mjs';
import {planArrival,advanceArrival,advanceAutoscroll} from './travel.mjs';
const $=id=>document.getElementById(id),world=$('world'),viewport=$('viewport');
const defaults={showSound:true,showCount:true,showTimer:true,reduceMotion:matchMedia('(prefers-reduced-motion: reduce)').matches,sensitivity:50,scrollSpeed:1,autoScroll:false,autoScrollSpeed:1};
let settings={...defaults};try{const saved=JSON.parse(localStorage.getItem('quiet-mouse-v11-settings')||'{}');for(const k of Object.keys(defaults))if(typeof saved[k]===typeof defaults[k])settings[k]=saved[k];}catch{}
settings.sensitivity=clamp(settings.sensitivity,0,100);settings.scrollSpeed=clamp(settings.scrollSpeed,.5,2);settings.autoScrollSpeed=Number.isFinite(settings.autoScrollSpeed)?clamp(settings.autoScrollSpeed,.25,3):1;
let state=makeState(),actors=new Map(),mode='off',stream=null,ctx=null,analyser=null,samples=null,starting=false,generation=0,baseline=22,level=0,last=0,calibration=null,raf=0;
const autoCamera={direction:1,velocity:0,pause:0,position:null};let manualPause=0,manualHold=false;
const threshold=()=>clamp(baseline+18-(settings.sensitivity-50)*.4,10,80);
const announce=text=>{$('message').textContent=text;};
const textBoxes=initTextBoxes({announce,onInteract:()=>pauseAutoscroll()});
function applySettings(){for(const k of Object.keys(defaults)){const input=$(k);if(input.type==='checkbox')input.checked=settings[k];else{input.value=settings[k];$(k+'Value').textContent=k==='autoScrollSpeed'?settings[k]+'×':settings[k];}}$('soundPanel').hidden=!settings.showSound;$('countPanel').hidden=!settings.showCount;$('timerPanel').hidden=!settings.showTimer;document.body.classList.toggle('reduced',settings.reduceMotion);$('enableMotion').hidden=!settings.reduceMotion;$('motionHelp').textContent=settings.reduceMotion?'Animal parts are paused. Turn Reduce motion off to animate legs, tails, and wings.':'Legs, tails, and wings animate in the meadow and on discovered collection cards.';try{localStorage.setItem('quiet-mouse-v11-settings',JSON.stringify(settings));}catch{}}
for(const k of Object.keys(defaults))$(k).addEventListener('input',()=>{settings[k]=$(k).type==='checkbox'?$(k).checked:Number($(k).value);if(k==='autoScroll'){autoCamera.velocity=0;autoCamera.position=null;autoCamera.pause=0;manualPause=0;}applySettings();});applySettings();
const cards=new Map(),collectionItems=new WeakMap();
const collectionObserver=new IntersectionObserver(entries=>{for(const e of entries){const c=collectionItems.get(e.target);if(c)c.visible=e.isIntersecting;}},{root:$('collectionDialog'),rootMargin:'50px'});
$('enableMotion').onclick=()=>{settings.reduceMotion=false;applySettings();};
for(const tier of TIERS){const section=document.createElement('section');const title=document.createElement('h3');title.className='tier-title';if(tier.id===8){const img=new Image();img.src='./face.png';img.alt='Rarest tier';title.append(img);}else title.textContent=tier.name;const n=document.createElement('span');n.className='tier-count';n.id='tier-count-'+tier.id;title.append(n);section.append(title);const grid=document.createElement('div');grid.className='cards';for(const s of SPECIES.filter(a=>a.tier===tier.id)){const card=document.createElement('div');card.className='card locked';card.setAttribute('aria-label','Undiscovered animal');card.innerHTML=art(s);const name=document.createElement('span');name.className='animal-name';card.append(name);grid.append(card);const item={card,name,s,profile:visualProfile(s),phase:cards.size*.6,timeOffset:cards.size*.71,visible:false};cards.set(s.id,item);collectionItems.set(card,item);collectionObserver.observe(card);}section.append(grid);$('roster').append(section);}
function updateRoster(){for(const s of SPECIES){const {card,name}=cards.get(s.id),found=state.present.has(s.id);card.classList.toggle('locked',!found);name.textContent=found?s.name:'';card.setAttribute('aria-label',found?s.name:'Undiscovered animal');}for(const t of TIERS)$('tier-count-'+t.id).textContent=SPECIES.filter(s=>s.tier===t.id&&state.present.has(s.id)).length+' / '+t.count;$('count').textContent=state.present.size;}
updateRoster();
function showDialog(id){$(id).showModal();}
$('collectionButton').onclick=()=>showDialog('collectionDialog');$('settingsButton').onclick=()=>showDialog('settingsDialog');for(const d of document.querySelectorAll('dialog')){d.querySelector('.close').onclick=()=>d.close();d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});}
function pauseAutoscroll(direction){manualPause=3;autoCamera.velocity=0;autoCamera.position=null;if(direction)autoCamera.direction=direction;}
function navigate(direction){pauseAutoscroll(direction);viewport.scrollBy({left:direction*viewport.clientWidth*.7,behavior:settings.reduceMotion?'instant':'smooth'});}
$('left').onclick=()=>navigate(-1);$('right').onclick=()=>navigate(1);
viewport.onkeydown=e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();navigate(e.key==='ArrowRight'?1:-1);}else if(['Home','End','PageUp','PageDown'].includes(e.key))pauseAutoscroll();};
let drag=null;
viewport.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;pauseAutoscroll();manualHold=true;if(e.pointerType==='mouse'){drag={x:e.clientX,scroll:viewport.scrollLeft};viewport.setPointerCapture(e.pointerId);}});
viewport.addEventListener('pointermove',e=>{if(drag)viewport.scrollLeft=drag.scroll+(drag.x-e.clientX)*settings.scrollSpeed;});
const releaseDrag=()=>{drag=null;manualHold=false;pauseAutoscroll();};
viewport.addEventListener('pointerup',releaseDrag);viewport.addEventListener('pointercancel',releaseDrag);viewport.addEventListener('lostpointercapture',releaseDrag);
viewport.addEventListener('wheel',e=>{if(e.ctrlKey)return;e.preventDefault();pauseAutoscroll();viewport.scrollLeft+=(Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)*(e.deltaMode===1?20:e.deltaMode===2?viewport.clientWidth:1)*settings.scrollSpeed;},{passive:false});
function updateLocation(){
 const center=(viewport.scrollLeft+viewport.clientWidth/2)/world.clientWidth;
 $('location').textContent=center<.43?'THE MEADOW':center<.61?'THE SHORE':'OPEN WATER';
 $('left').disabled=viewport.scrollLeft<=1;
 $('right').disabled=viewport.scrollLeft>=world.clientWidth-viewport.clientWidth-1;
}
viewport.addEventListener('scroll',updateLocation,{passive:true});
world.style.setProperty('--panorama-top',`${-PANORAMA.top/SCENE_HEIGHT*100}%`);
world.style.setProperty('--panorama-height',`${PANORAMA.height/SCENE_HEIGHT*100}%`);
world.style.setProperty('--water-clip',waterClip());
let firstLayout=true;
function layoutWorld(){
 const fraction=firstLayout?0:viewport.scrollLeft/Math.max(1,world.clientWidth-viewport.clientWidth);
 world.style.width=Math.max(viewport.clientWidth,viewport.clientHeight*SCENE_RATIO)+'px';
 viewport.scrollLeft=fraction*Math.max(0,world.clientWidth-viewport.clientWidth);
 firstLayout=false;autoCamera.position=null;autoCamera.velocity=0;updateLocation();
}
new ResizeObserver(layoutWorld).observe(viewport);layoutWorld();
$('panoramaImage').addEventListener('error',()=>announce('The background is missing. Upload panorama.png beside index.html, then reload.'));

function boundsFor(a,y,w,spriteH){
 const h=world.clientHeight,ww=world.clientWidth;
 if(a.profile.air&&!a.profile.fieldFlight){const half=w/ww*1.5;return {min:half+.025,max:3-half-.025};}
 return habitatBounds(a.profile.fieldFlight?.82:y,w,spriteH,ww,h,a.s.water);
}
function spawn(s,preview=false){
 const old=actors.get(s.id);if(old){old.el.remove();actors.delete(s.id);}
 const profile=visualProfile(s),h=world.clientHeight,w=profile.size*clamp(h/850,.65,1.25),spriteH=w*165/264;
 const minY=profile.air?(profile.fieldFlight?.55:.28):s.water?Math.max(.72,.59+spriteH/h):.73;
 const maxY=profile.air?(profile.fieldFlight?.76:.57):.96;
 const y=minY+Math.random()*(maxY-minY),bounds=boundsFor({profile,s},y,w,spriteH);
 const entry=planArrival({...bounds,y,width:w,worldWidth:world.clientWidth,worldHeight:h,viewLeft:viewport.scrollLeft,viewWidth:viewport.clientWidth,air:profile.air,fieldFlight:profile.fieldFlight,water:s.water});
 const el=document.createElement('div');el.className='animal'+(s.water?' water':'')+(profile.air?' airborne':'');el.dataset.species=s.kind;el.dataset.motion=profile.motion;el.dataset.entry=entry.side;el.dataset.arrival='entering';
 el.innerHTML=art(s);el.setAttribute('aria-label',s.name);el.setAttribute('role','img');
 const a={s,profile,el,entry,x:entry.x,y:entry.y,baseY:entry.y,dir:entry.dir,velocity:0,facing:entry.dir,faceTarget:entry.dir,target:4,phase:Math.random()*6.28,flee:0,preview,timeOffset:Math.random()*10,hover:0};
 // Position outside the camera before inserting the element: no flash at origin.
 paintActor(a,w,spriteH,h,world.clientWidth/3);$('animals').append(el);actors.set(s.id,a);
}
function paintActor(a,w,spriteH,h,panel){
 const left=a.x*panel-w/2,top=a.y*h-spriteH;
 a.el.style.width=w+'px';a.el.style.height=spriteH+'px';a.el.style.left='0px';a.el.style.top='0px';
 a.el.style.transform='translate3d('+left.toFixed(2)+'px,'+top.toFixed(2)+'px,0) scaleX('+(settings.reduceMotion?a.faceTarget:a.facing).toFixed(4)+')';
 a.el.style.zIndex=a.profile.air?'230':String(Math.floor(a.y*100));
 a.el.style.opacity=String((a.profile.water?.9:1)*(a.flee?clamp(a.flee/1.2,0,1):1));
 return left;
}
function clearAnimals(){for(const a of actors.values())a.el.remove();actors.clear();state=makeState();updateRoster();}
function stop(reason='Listening paused. Your visitors will return when you start again.'){
 generation++;starting=false;$('start').disabled=false;$('pause').disabled=false;
 const oldStream=stream;stream=null;if(oldStream)for(const t of oldStream.getTracks()){t.onended=null;t.onmute=null;t.stop();}if(ctx){ctx.close().catch(()=>{});ctx=null;}analyser=null;calibration=null;mode='off';clearAnimals();$('pause').textContent='Start listening';$('soundWord').textContent='MIC OFF';$('timer').textContent='0s';$('meterFill').style.width='0%';announce(reason);
}
function errorText(error){if(!window.isSecureContext)return 'Open the published game using its HTTPS address. Microphone access needs a secure website.';if(!navigator.mediaDevices?.getUserMedia)return 'This browser view cannot access a microphone. Open the game URL directly in Safari, Chrome, or Edge.';if(['NotAllowedError','SecurityError'].includes(error.name))return 'Microphone access was blocked. Open the game URL directly (outside a preview), allow the microphone for that site, and check your device’s browser microphone permission. Then try again.';if(error.name==='NotFoundError')return 'No microphone was found. Connect or enable one, then try again.';if(error.name==='NotReadableError')return 'Your microphone could not start. Close other apps using it and try again.';return 'The microphone could not start. Please retry or use the preview.';}
function beginCalibration(){if(mode!=='live'){ $('calibrationStatus').textContent='Start listening before recalibrating.';return;}calibration={time:0,values:[]};state.quiet.fill(0);$('calibrationStatus').textContent='Listening to your quiet room for three seconds…';announce('Stay quiet for three seconds while the microphone settles.');}
async function start(){if(starting)return;stop('Connecting your microphone…');starting=true;const token=generation;$('start').disabled=true;$('pause').disabled=true;$('error').textContent='';try{
 if(!isSecureContext||!navigator.mediaDevices?.getUserMedia)throw new Error('unsupported');
 const AC=window.AudioContext||window.webkitAudioContext;if(!AC)throw new Error('unsupported');ctx=new AC();await ctx.resume();
 const incoming=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false},video:false});if(token!==generation){incoming.getTracks().forEach(t=>t.stop());return;}stream=incoming;analyser=ctx.createAnalyser();analyser.fftSize=2048;samples=new Float32Array(analyser.fftSize);ctx.createMediaStreamSource(stream).connect(analyser);
 for(const track of stream.getAudioTracks()){track.onended=()=>stop('The microphone disconnected. Tap Start listening to reconnect.');track.onmute=()=>stop('The microphone was interrupted. Tap Start listening to reconnect.');}
 ctx.onstatechange=()=>{if(mode==='live'&&ctx&&ctx.state!=='running')stop('Audio was interrupted. Tap Start listening to resume.');};
 mode='live';$('welcome').hidden=true;$('pause').textContent='Pause listening';beginCalibration();
 }catch(error){if(token!==generation)return;const msg=errorText(error);stop(msg);$('welcome').hidden=false;$('error').textContent=msg;}finally{if(token===generation){starting=false;$('start').disabled=false;$('pause').disabled=false;}}}
$('start').onclick=start;$('pause').onclick=()=>mode==='live'?stop():start();$('calibrate').onclick=beginCalibration;
$('preview').onclick=()=>{stop();mode='preview';$('welcome').hidden=true;for(const name of ['Red Admiral Butterfly','Cabbage White Butterfly','Domestic Rabbit','House Sparrow','Red Fox','Snow Leopard','Komodo Dragon','Okapi','King Penguin','Harp Seal','Bottlenose Dolphin','Green Sea Turtle'])spawn(SPECIES.find(s=>s.name===name),true);announce('Preview · swipe or drag to explore. Start listening to discover animals.');$('pause').textContent='Start listening';};
document.addEventListener('visibilitychange',()=>{if(document.hidden){manualHold=false;drag=null;autoCamera.velocity=0;autoCamera.position=null;if(mode!=='off'||starting)stop('Paused while you were away. Start listening for a fresh visit.');}});window.addEventListener('pagehide',()=>stop());
function frame(now){const dt=Math.min((now-last)/1000||0,.1);last=now;
 if(mode==='live'&&analyser){analyser.getFloatTimeDomainData(samples);level=volumeLevel(samples);const limit=threshold();$('meterFill').style.width=level+'%';$('meterFill').style.background=level>limit?'#c28565':'#6f9c72';$('thresholdMarker').style.left=limit+'%';$('soundWord').textContent=calibration?'CALIBRATING':level>limit?'TOO LOUD':'QUIET';
 if(calibration){calibration.values.push(level);calibration.time+=dt;if(calibration.time>=3){calibration.values.sort((a,b)=>a-b);baseline=clamp(calibration.values[Math.floor(calibration.values.length*.5)],0,55);calibration=null;$('calibrationStatus').textContent='Calibrated. Sensitivity adjusts the quiet threshold.';announce('The meadow is listening. Stay quiet and see who comes.');}}
 else{const result=advance(state,dt,level,limit);for(const s of result.fled){const a=actors.get(s.id);if(a){a.flee=1.2;a.el.classList.add('fleeing');}}for(const s of result.arrived)spawn(s);if(result.fled.length||result.arrived.length){updateRoster();announce(result.fled.length?`A sound startled ${result.fled.length} ${result.fled.length===1?'visitor':'visitors'}. Let the quiet settle again.`:result.arrived.map(s=>s.name).join(', ')+' arrived.');}}
 $('timer').textContent=Math.floor(state.quiet[0])+'s';}
 const elapsed=Math.min(.05,dt),h=world.clientHeight,ww=world.clientWidth,panel=ww/3,scale=clamp(h/850,.65,1.25);
 manualPause=Math.max(0,manualPause-elapsed);
 if(settings.autoScroll&&!document.hidden&&!manualHold&&manualPause===0&&!$('collectionDialog').open&&!$('settingsDialog').open&&!textBoxes.isEditing()){
  autoCamera.position=advanceAutoscroll(autoCamera,autoCamera.position??viewport.scrollLeft,elapsed,Math.max(0,ww-viewport.clientWidth),60*settings.autoScrollSpeed);
  viewport.scrollLeft=autoCamera.position;updateLocation();
 }else{autoCamera.velocity=0;autoCamera.position=null;}
 for(const [id,a] of actors){
  const p=a.profile,w=p.size*scale,spriteH=w*165/264;
  if(a.flee){
   if(a.entry){a.entry=null;a.el.dataset.arrival='fleeing';a.dir=-(a.dir||a.faceTarget);}
   a.flee-=elapsed;if(a.flee<=0){a.el.remove();actors.delete(id);continue;}
  }
  let actualSpeed;
  if(a.entry){
   const e=a.entry;
   if(p.water)e.targetY=clamp(e.targetY,Math.max(.72,.59+spriteH/h),.96);
   const b=boundsFor(a,e.targetY,w,spriteH);e.targetX=clamp(e.targetX,b.min,b.max);
   // Re-constrain interior shoreline edges after a resize, while preserving
   // legitimate entrances from beyond the outer world edges.
   if(p.water)a.x=Math.max(a.x,b.min);
   else if(!p.air||p.fieldFlight)a.x=Math.min(a.x,b.max);
   const speed=e.side==='top'?Math.max(p.speed*scale,h*.2):Math.max(p.speed*1.35,14)*scale;
   const moved=advanceArrival(e,a.x,a.baseY,elapsed,panel,h,speed);
   e.speed=moved.speed;a.x=moved.x;a.baseY=moved.y;a.velocity=moved.vx;actualSpeed=Math.hypot(moved.vx,moved.vy);
   if(moved.done){a.entry=null;a.el.dataset.arrival='arrived';a.target=3+Math.random()*3;if(p.motion==='settled'){a.dir=0;a.velocity=0;}}
  }else{
   a.target-=elapsed;
   if(a.target<=0&&!a.flee){a.dir=p.motion==='settled'?0:Math.random()<(p.air?.15:.30)?0:Math.random()<.5?-1:1;a.target=2.5+Math.random()*5.5;}
   const desired=(a.flee?(a.dir||a.faceTarget):a.dir)*p.speed*scale*(a.flee?4:1);
   a.velocity+=(desired-a.velocity)*(1-Math.exp(-elapsed*(a.flee?8:4)));
   const hop=p.motion==='hop'&&!settings.reduceMotion?.35+Math.max(0,Math.sin(a.phase))*1.3:1;
   a.x+=a.velocity*hop*elapsed/panel;actualSpeed=Math.abs(a.velocity);
  }
  const activity=clamp(actualSpeed/Math.max(1,p.speed*scale),0,1);
  if(Math.abs(a.velocity)>.8)a.faceTarget=Math.sign(a.velocity);
  a.facing+=(a.faceTarget-a.facing)*(1-Math.exp(-elapsed*13));
  a.phase+=elapsed*Math.PI*2*p.cadence*(p.air||p.motion==='pulse'?1:activity)*(a.flee?1.8:1);
  if(p.water)a.baseY=clamp(a.baseY,Math.max(.72,.59+spriteH/h),.96);
  a.hover+=((a.entry?0:1)-a.hover)*(1-Math.exp(-elapsed*3));
  a.y=a.baseY+(p.air&&!settings.reduceMotion?(Math.sin(now/1000*1.2+a.phase*.16)*.008+Math.sin(now/1000*.6+a.phase)*.004)*a.hover:0);
  if(!a.entry&&!a.flee){const {min,max}=boundsFor(a,a.y,w,spriteH);if(a.x<min){a.x=min;a.dir=1;a.velocity=Math.max(0,a.velocity);}if(a.x>max){a.x=max;a.dir=-1;a.velocity=Math.min(0,a.velocity);}}
  const left=paintActor(a,w,spriteH,h,panel);a.el.classList.toggle('idle',activity<.02&&!p.air);
  if(left+w>=viewport.scrollLeft-100&&left<=viewport.scrollLeft+viewport.clientWidth+100){animateCritter(a.el,{phase:a.phase,time:now/1000+a.timeOffset,activity,profile:p,reduced:settings.reduceMotion});}
 }
 if($('collectionDialog').open){for(const c of cards.values()){
  if(!c.visible||!state.present.has(c.s.id))continue;
  c.phase+=elapsed*Math.PI*2*c.profile.cadence;
  animateCritter(c.card,{phase:c.phase,time:now/1000+c.timeOffset,activity:c.profile.motion==='settled'?0:1,profile:c.profile,reduced:settings.reduceMotion});
 }}
 raf=requestAnimationFrame(frame);}
raf=requestAnimationFrame(frame);
