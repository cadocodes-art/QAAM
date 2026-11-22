import {SPECIES,TIERS} from './data.mjs';
import {art} from './art.mjs';
import {animateCritter} from './animal-motion.mjs';
import {visualProfile} from './motion-profile.mjs';
const $=id=>document.getElementById(id),cards=[];
let playing=!matchMedia('(prefers-reduced-motion: reduce)').matches;
const observer=new IntersectionObserver(entries=>{for(const e of entries){const card=cards.find(c=>c.tile===e.target);if(card)card.visible=e.isIntersecting;}},{rootMargin:'120px'});
for(const [index,s] of SPECIES.entries()){
 const tile=document.createElement('figure');tile.className='tile';
 const p=visualProfile(s),stage=document.createElement('div');stage.className='stage'+(p.air?' air':p.water?' water':'');stage.innerHTML=art(s);
 const caption=document.createElement('figcaption'),title=document.createElement('h2'),meta=document.createElement('span');title.textContent=s.name;meta.className='meta';meta.textContent=(TIERS[s.tier].name||'Face-image tier')+' - '+p.motion;
 caption.append(title,meta);tile.append(stage,caption);$('cards').append(tile);cards.push({s,p,tile,stage,phase:index*.6,timeOffset:index*.71,visible:false});observer.observe(tile);
}
function filter(){const q=$('search').value.trim().toLowerCase(),f=$('filter').value;let count=0;for(const c of cards){const matches=c.s.name.toLowerCase().includes(q)&&(f==='all'||f==='air'&&c.p.air||f==='water'&&c.p.water||f==='hop'&&c.p.motion==='hop'||f==='land'&&!c.p.air&&!c.p.water&&c.p.motion!=='hop');c.tile.hidden=!matches;if(matches)count++;}$('count').textContent=count+' of 210 animals';$('empty').hidden=count>0;}
$('search').oninput=filter;$('filter').onchange=filter;filter();
function updatePlay(){$('play').textContent=playing?'Pause animations':'Play animations';$('play').setAttribute('aria-pressed',String(playing));if(!playing)for(const c of cards)animateCritter(c.stage,{phase:c.phase,time:0,activity:0,profile:c.p,reduced:true});}
$('play').onclick=()=>{playing=!playing;updatePlay();};updatePlay();
let previous=0;
function tick(now){const dt=Math.min(.05,(now-previous)/1000||0);previous=now;if(playing&&!document.hidden)for(const c of cards){if(!c.visible||c.tile.hidden)continue;c.phase+=dt*Math.PI*2*c.p.cadence;animateCritter(c.stage,{phase:c.phase,time:now/1000+c.timeOffset,activity:c.p.motion==='settled'?0:1,profile:c.p,reduced:false});}requestAnimationFrame(tick);}
requestAnimationFrame(tick);
