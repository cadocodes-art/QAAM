import {habitatBounds} from './panorama.mjs';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const between=(r,a,b)=>a+r()*(b-a);
export function behaviorFor(s,p){
 if(p.water)return p.motion==='settled'?'settled':'cruise';
 if(s.kind==='butterfly'||s.kind==='bee')return 'nectar';
 if(p.air&&s.kind==='bird')return 'land';
 if(p.air)return 'fly';
 if(s.kind==='rabbit')return 'nibble';
 return 'rest';
}
export function createBehavior(s,p,random=Math.random){return {kind:behaviorFor(s,p),type:'roam',timer:between(random,6,20),age:0,blend:0,flight:1,homeY:null,goal:null};}
function enter(b,type,duration){b.type=type;b.timer=duration;b.age=0;}
// Uses the same world coordinates and shoreline envelope as normal wandering.
export function stepBehavior(a,dt,g,random=Math.random){
 const b=a.behavior||(a.behavior=createBehavior(a.s,a.profile,random)),p=a.profile;
 const result={handled:false,speedScale:1,activity:null,flight:1,pose:'roam',blend:0};
 if(a.entry)return result;
 if(a.flee){b.type='roam';b.timer=between(random,6,20);b.blend=0;return result;}
 b.age+=dt;b.timer-=dt;
 if(b.flower&&['nectar','approach-flower'].includes(b.type)&&!g.flowers.some(f=>f.x===b.flower.x&&f.y===b.flower.y)){
  b.flower=g.flowers.reduce((best,f)=>!best||Math.abs(f.x-a.x)<Math.abs(best.x-a.x)?f:best,null);
  if(b.flower){b.flowerDir=Math.sign(b.flower.x-a.x)||a.faceTarget;b.goal={x:b.flower.x,y:b.flower.y};enter(b,'approach-flower',0);}
 }

 const landBounds=y=>habitatBounds(y,g.w,g.spriteH,g.ww,g.h,false);
 if(b.type==='roam'&&b.timer<=0){
  if(b.kind==='land'||b.kind==='nectar'){
   b.homeY=a.baseY;
   if(b.kind==='nectar'&&g.flowers.length){
    const candidates=g.flowers.slice().sort((l,r)=>Math.abs(l.x-a.x)-Math.abs(r.x-a.x));
    const flower=candidates[Math.floor(random()*Math.min(2,candidates.length))];
    b.flower=flower;b.flowerDir=Math.sign(flower.x-a.x)||a.faceTarget;b.goal={x:flower.x,y:flower.y};enter(b,'approach-flower',0);
   }else{const y=between(random,.83,.93),bounds=landBounds(y);b.goal={x:clamp(a.x+between(random,-.12,.12),bounds.min,bounds.max),y};enter(b,'landing',0);}
  }else if(['nibble','graze','rest'].includes(b.kind)){enter(b,b.kind,between(random,4,9));}
  else if(b.kind==='cruise'){enter(b,'cruise',between(random,5,10));}
  else b.timer=between(random,10,20);
 }
 if(['landing','approach-flower','takeoff'].includes(b.type)){
  const target=b.goal;
  if(b.type==='approach-flower'){
   // Match the butterfly's mouth/bee's head to the center blossom.
   const facing=b.flowerDir;
   target.x=b.flower.x-facing*g.w*.12/g.panel;
   const flowerHeight=52*g.scale*90/140;
   target.y=clamp(b.flower.y+(g.spriteH*.5-flowerHeight*.6)/g.h,.65,.96);
  }
  if(b.type!=='takeoff'){const bounds=landBounds(target.y);target.x=clamp(target.x,bounds.min,bounds.max);}
  const dx=(target.x-a.x)*g.panel,dy=(target.y-a.baseY)*g.h,distance=Math.hypot(dx,dy);
  const speed=Math.max(10,p.speed*g.scale*1.25),step=Math.min(distance,speed*dt);
  if(distance>.01){a.x+=dx/distance*step/g.panel;a.baseY+=dy/distance*step/g.h;a.velocity=dx/distance*speed;if(Math.abs(dx)>2)a.dir=Math.sign(dx);}
  result.handled=true;result.activity=.65;
  if(b.type!=='takeoff')b.flight=clamp(distance/45,0,1);else b.flight=Math.min(1,b.flight+dt*2);
  if(distance<=Math.max(.5,step)){
   a.x=target.x;a.baseY=target.y;a.velocity=0;
   if(b.type==='takeoff'){enter(b,'roam',between(random,10,22));a.dir=random()<.5?-1:1;b.flight=1;}
   else{enter(b,b.type==='landing'?'perch':'nectar',between(random,4,8));a.dir=0;b.flight=0;}
  }
 }else if(['perch','nectar'].includes(b.type)){
  result.handled=true;result.activity=0;a.velocity=0;b.flight=0;
  if(b.timer<=0){const y=b.homeY??.45;b.goal={x:clamp(a.x+between(random,-.12,.12),.08,2.92),y};enter(b,'takeoff',0);}
 }else if(['nibble','graze','rest'].includes(b.type)){
  result.speedScale=0;
  if(b.timer<=0){enter(b,'roam',between(random,9,23));a.dir=random()<.5?-1:1;a.target=between(random,3,6);}
 }else if(b.type==='cruise'){
  // Aquatic animals glide more slowly, with their fins and tails still working.
  result.speedScale=.65+.1*Math.sin(b.age*.7);
  if(b.timer<=0)enter(b,'roam',between(random,8,18));
 }
 const posing=['nibble','graze','rest','perch','nectar'].includes(b.type);
 b.blend+=((posing?1:0)-b.blend)*(1-Math.exp(-dt*3));
 result.flight=p.air?b.flight:0;result.pose=b.type;result.blend=b.blend;
 // Retain the feeding pose during its smooth release back into walking.
 if(b.type==='roam'&&b.blend>.01)result.pose=b.kind;
 return result;
}
