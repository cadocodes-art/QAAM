import {TIERS,SPECIES} from './data.mjs';
import {advance,makeState,clamp,volumeLevel} from './core.mjs';
import {PANORAMA,SCENE_HEIGHT,SCENE_RATIO,habitatBounds,waterClip} from './panorama.mjs';
import {art} from './art.mjs';
import {animateAnimal} from './original-animals.mjs';
const $=id=>document.getElementById(id),world=$('world'),viewport=$('viewport');
const defaults={showSound:true,showCount:true,showTimer:true,reduceMotion:matchMedia('(prefers-reduced-motion: reduce)').matches,sensitivity:50,scrollSpeed:1};
let settings={...defaults};try{const saved=JSON.parse(localStorage.getItem('quiet-mouse-v11-settings')||'{}');for(const k of Object.keys(defaults))if(typeof saved[k]===typeof defaults[k])settings[k]=saved[k];}catch{}
settings.sensitivity=clamp(settings.sensitivity,0,100);settings.scrollSpeed=clamp(settings.scrollSpeed,.5,2);
let state=makeState(),actors=new Map(),mode='off',stream=null,ctx=null,analyser=null,samples=null,starting=false,generation=0,baseline=22,level=0,last=0,calibration=null,raf=0,lastRender=0;
const threshold=()=>clamp(baseline+18-(settings.sensitivity-50)*.4,10,80);
const announce=text=>{$('message').textContent=text;};
function applySettings(){for(const k of Object.keys(defaults)){const input=$(k);if(input.type==='checkbox')input.checked=settings[k];else{input.value=settings[k];$(k+'Value').textContent=settings[k];}}$('soundPanel').hidden=!settings.showSound;$('countPanel').hidden=!settings.showCount;$('timerPanel').hidden=!settings.showTimer;document.body.classList.toggle('reduced',settings.reduceMotion);try{localStorage.setItem('quiet-mouse-v11-settings',JSON.stringify(settings));}catch{}}
for(const k of Object.keys(defaults))$(k).addEventListener('input',()=>{settings[k]=$(k).type==='checkbox'?$(k).checked:Number($(k).value);applySettings();});applySettings();
const cards=new Map();
for(const tier of TIERS){const section=document.createElement('section');const title=document.createElement('h3');title.className='tier-title';if(tier.id===8){const img=new Image();img.src='./face.png';img.alt='Rarest tier';title.append(img);}else title.textContent=tier.name;const n=document.createElement('span');n.className='tier-count';n.id='tier-count-'+tier.id;title.append(n);section.append(title);const grid=document.createElement('div');grid.className='cards';for(const s of SPECIES.filter(a=>a.tier===tier.id)){const card=document.createElement('div');card.className='card locked';card.setAttribute('aria-label','Undiscovered animal');card.innerHTML=art(s);const name=document.createElement('span');name.className='animal-name';card.append(name);grid.append(card);cards.set(s.id,{card,name});}section.append(grid);$('roster').append(section);}
function updateRoster(){for(const s of SPECIES){const {card,name}=cards.get(s.id),found=state.present.has(s.id);card.classList.toggle('locked',!found);name.textContent=found?s.name:'';card.setAttribute('aria-label',found?s.name:'Undiscovered animal');}for(const t of TIERS)$('tier-count-'+t.id).textContent=SPECIES.filter(s=>s.tier===t.id&&state.present.has(s.id)).length+' / '+t.count;$('count').textContent=state.present.size;}
updateRoster();
function showDialog(id){$(id).showModal();}
$('collectionButton').onclick=()=>showDialog('collectionDialog');$('settingsButton').onclick=()=>showDialog('settingsDialog');for(const d of document.querySelectorAll('dialog')){d.querySelector('.close').onclick=()=>d.close();d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});}
function navigate(direction){viewport.scrollBy({left:direction*viewport.clientWidth*.7,behavior:settings.reduceMotion?'instant':'smooth'});}
$('left').onclick=()=>navigate(-1);$('right').onclick=()=>navigate(1);
viewport.onkeydown=e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();navigate(e.key==='ArrowRight'?1:-1);}};
let drag=null;viewport.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button===0){drag={x:e.clientX,scroll:viewport.scrollLeft};viewport.setPointerCapture(e.pointerId);}});viewport.addEventListener('pointermove',e=>{if(drag)viewport.scrollLeft=drag.scroll+(drag.x-e.clientX)*settings.scrollSpeed;});viewport.addEventListener('pointerup',()=>drag=null);viewport.addEventListener('pointercancel',()=>drag=null);
viewport.addEventListener('wheel',e=>{if(e.ctrlKey)return;e.preventDefault();viewport.scrollLeft+=(Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)*(e.deltaMode===1?20:e.deltaMode===2?viewport.clientWidth:1)*settings.scrollSpeed;},{passive:false});
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
 firstLayout=false;updateLocation();
}
new ResizeObserver(layoutWorld).observe(viewport);layoutWorld();
$('panoramaImage').addEventListener('error',()=>announce('The background is missing. Upload panorama.png beside index.html, then reload.'));

function size(s){if(['ant','insect','bee','beetle','spider','butterfly','worm','snail','shrimp'].includes(s.kind))return 65;if(['bird','rodent','rabbit','frog','fish'].includes(s.kind))return 110;if(['whale','elephant','giraffe'].includes(s.kind))return 230;return 165;}
function spawn(s,preview=false){
 const old=actors.get(s.id);if(old){old.el.remove();actors.delete(s.id);}
 const h=world.clientHeight,w=size(s)*clamp(h/850,.65,1.25),spriteH=w*165/264;
 const minY=s.water?Math.max(.72,.59+spriteH/h):.72;
 const y=minY+Math.random()*(.96-minY);
 const {min,max}=habitatBounds(y,w,spriteH,world.clientWidth,h,s.water);
 const x=min+Math.random()*(max-min);
 const el=document.createElement('div');el.className='animal'+(s.water?' water':'');el.dataset.species=s.kind;
 el.innerHTML=art(s);el.setAttribute('aria-label',s.name);el.setAttribute('role','img');$('animals').append(el);
 actors.set(s.id,{s,el,x,y,dir:Math.random()<.5?-1:1,target:Math.random()*6+2,phase:Math.random()*6,flee:0,preview});
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
$('preview').onclick=()=>{stop();mode='preview';$('welcome').hidden=true;for(const name of ['Ant','Red Fox','Snow Leopard','Komodo Dragon','Okapi','Harp Seal','Bottlenose Dolphin','Vaquita'])spawn(SPECIES.find(s=>s.name===name),true);announce('Preview · swipe or drag to explore. Start listening to discover animals.');$('pause').textContent='Start listening';};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&(mode!=='off'||starting))stop('Paused while you were away. Start listening for a fresh visit.');});window.addEventListener('pagehide',()=>stop());
function frame(now){const dt=Math.min((now-last)/1000||0,.1);last=now;
 if(mode==='live'&&analyser){analyser.getFloatTimeDomainData(samples);level=volumeLevel(samples);const limit=threshold();$('meterFill').style.width=level+'%';$('meterFill').style.background=level>limit?'#c28565':'#6f9c72';$('thresholdMarker').style.left=limit+'%';$('soundWord').textContent=calibration?'CALIBRATING':level>limit?'TOO LOUD':'QUIET';
 if(calibration){calibration.values.push(level);calibration.time+=dt;if(calibration.time>=3){calibration.values.sort((a,b)=>a-b);baseline=clamp(calibration.values[Math.floor(calibration.values.length*.5)],0,55);calibration=null;$('calibrationStatus').textContent='Calibrated. Sensitivity adjusts the quiet threshold.';announce('The meadow is listening. Stay quiet and see who comes.');}}
 else{const result=advance(state,dt,level,limit);for(const s of result.fled){const a=actors.get(s.id);if(a){a.flee=1.2;a.el.classList.add('fleeing');}}for(const s of result.arrived)spawn(s);if(result.fled.length||result.arrived.length){updateRoster();announce(result.fled.length?'A sound startled your visitors. Let the quiet settle again.':result.arrived.map(s=>s.name).join(', ')+' arrived.');}}
 $('timer').textContent=Math.floor(state.quiet[0])+'s';}
 if(now-lastRender>32){const elapsed=(now-lastRender)/1000;lastRender=now;const panel=world.clientWidth/3,h=world.clientHeight;
 for(const[id,a]of actors){a.target-=elapsed;if(a.target<=0){a.dir=Math.random()<.28?0:Math.random()<.5?-1:1;a.target=2+Math.random()*5;}const moving=a.flee>0||a.dir!==0;
 const scale=clamp(h/850,.65,1.25),w=size(a.s)*scale,spriteH=w*165/264;
 if(a.s.water)a.y=clamp(a.y,Math.max(.72,.59+spriteH/h),.96);
 const {min,max}=habitatBounds(a.y,w,spriteH,world.clientWidth,h,a.s.water);
 if(a.flee){a.flee-=elapsed;a.x=clamp(a.x+(a.dir||1)*elapsed*.13,min,max);a.el.style.opacity=Math.max(0,a.flee/1.2);if(a.flee<=0){a.el.remove();actors.delete(id);continue;}}
 else{a.x+=a.dir*elapsed*.012;if(a.x<min){a.x=min;a.dir=1;}if(a.x>max){a.x=max;a.dir=-1;}}
 a.el.style.width=w+'px';a.el.style.height=w*165/264+'px';a.el.style.left=a.x*panel-w/2+'px';a.el.style.top=a.y*h-w*165/264+'px';a.el.style.zIndex=Math.floor(a.y*100);if(a.dir)a.el.style.transform=`scaleX(${a.dir>0?1:-1})`;a.el.classList.toggle('idle',!moving);a.phase+=elapsed*(a.flee?16:5);
 if(a.el.querySelector('[data-body]'))animateAnimal(a.el,a.phase,moving,a.dir,now/1000,settings.reduceMotion);
 }}raf=requestAnimationFrame(frame);}
raf=requestAnimationFrame(frame);
