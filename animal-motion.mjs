// Continuous, bounded poses shared by the game and the animal review gallery.
import {animateInsectLegs} from './insect-motion.mjs';
const TAU=Math.PI*2;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rigs=new WeakMap();
export function jointPose(j,{phase=0,time=0,activity=1,profile={},reduced=false,behavior='roam',blend=0}={}){
 const x=Number(j.x)||0,y=Number(j.y)||0,kind=j.kind;
 const rest=`translate(${x} ${y})`;
 if(reduced)return rest;
 const offset=Number(j.phase)||0,speed=Number(j.speed)||1;
 const strength=clamp(activity,0,1),swing=Number(j.swing)||0;
 let angle=0,scaleX=1,scaleY=1,shiftY=0;
 if(kind==='wing'||kind==='flutter-wing'){
  // Ground birds occasionally stretch a wing; flying animals flap continuously.
  const flight=profile.air?(profile.flight??1):Math.pow(Math.max(0,Math.sin(time*1.1+offset)),6)*.65;
  const cycle=time*Math.min(7,(profile.flapHz||2.8)*speed)*TAU+offset;
  angle=(profile.air?Math.sin(cycle):-1)*Math.min(45,swing*1.3)*flight;
  // A squared cosine closes and opens smoothly without a cusp at each fold.
  if(kind==='flutter-wing')scaleX=1-flight*.82*(1-Math.cos(cycle)**2);
  if(profile.air&&profile.kind==='bird'){angle=angle*flight+(offset>1?-105:-38)*(1-flight);scaleX=scaleY=1-.3*(1-flight);}
  if(['butterfly','bee'].includes(profile.kind)&&['nectar','takeoff'].includes(behavior)){angle=angle*(1-blend)+Math.sin(time*2+offset)*5*blend;scaleX=scaleX*(1-blend)+(.22+.08*(1+Math.sin(time*1.8+offset)))*blend;}
 }else if(kind==='feed-head'){
  angle=behavior==='nibble'?(46+Math.sin(time*8)*2.5)*blend:0;
 }else if(kind==='leg'||kind==='hop-leg'){
  // Keep airborne feet tucked: only grounded legs perform walking/hopping cycles.
  angle=profile.air?Math.sin(time*1.6+offset)*swing*.15:
   Math.sin(phase*speed+offset)*Math.min(25,swing*(kind==='hop-leg'?1.7:2.2))*strength;
 }else if(kind==='tail'||kind==='fin'||kind==='flipper'){
  const swim=profile.water;
  const amount=Math.min(kind==='tail'?18:26,swing*(kind==='tail'?2.4:1.8));
  const cycle=swim?phase+time*.35:time*1.9;
  angle=Math.sin(cycle*speed+offset)*amount*(swim?.3+.7*strength:.6+.4*strength);
 }else if(kind==='slither'&&profile.kind==='worm'){
  const wave=Math.sin(phase*speed+offset)*strength;
  shiftY=wave*.65;scaleX=1+wave*.03;
 }else if(kind==='tentacle'||kind==='slither'){
  angle=Math.sin(phase*speed+offset)*swing*Math.max(profile.water?.3:0,strength);
 }else if(kind==='neck'||kind==='ear'||kind==='antenna'||kind==='trunk'){
  angle=Math.sin(time*1.25*speed+offset)*swing*(.22+.28*strength);
 }else if(kind==='tongue'){
  scaleX=clamp((Math.sin(time*1.3+offset)-.7)/.3,0,1);
 }else if(kind==='pulse'||kind==='bell'){
  scaleX=1+Math.sin(phase+offset)*.045;scaleY=1-Math.sin(phase+offset)*.04;
 }
 return `${rest} translate(0 ${shiftY.toFixed(3)}) rotate(${angle.toFixed(3)}) scale(${scaleX.toFixed(4)} ${scaleY.toFixed(4)})`;
}
export function bodyPose({phase=0,time=0,activity=1,profile={},reduced=false,behavior='roam',blend=0}={}){
 if(reduced)return 'translate(0 0)';
 const a=clamp(activity,0,1),motion=profile.motion;
 let rise=0,tilt=0;
 if(motion==='hop'){rise=-Math.max(0,Math.sin(phase))*(profile.jump||9)*a;tilt=-Math.sin(phase)*2*a;}
 else if(motion==='waddle'){rise=-Math.abs(Math.sin(phase))*.7*a;tilt=Math.sin(phase)*2.2*a;}
 else if(motion==='walk'){rise=-Math.abs(Math.sin(phase))*1.1*a;}
 else if(profile.water&&(motion==='swim'||motion==='paddle'||motion==='glide')){rise=Math.sin(time*1.2)*.8;tilt=Math.sin(time*.8)*.65;}
 if(motion==='pulse')return `translate(132 83) scale(${(1+Math.sin(phase)*.025).toFixed(4)} ${(1-Math.sin(phase)*.035).toFixed(4)}) translate(-132 -83)`;
 const rest=['rest','nibble','graze','perch','nectar'].includes(behavior)?blend:0;
 const breath=1+Math.sin(time*2)*.006*rest;
 return `translate(0 ${rise.toFixed(3)}) rotate(${tilt.toFixed(3)} 132 140) translate(132 146) scale(1 ${breath.toFixed(4)}) translate(-132 -146)`;
}
export function animateCritter(el,options){
 let rig=rigs.get(el);
 if(!rig){
  rig={body:el.querySelector('[data-body]'),flightFeet:[...el.querySelectorAll('[data-flight-foot]')],groundFeet:[...el.querySelectorAll('[data-ground-foot]')],joints:Array.from(el.querySelectorAll('[data-anim]'),g=>{
   const [x,y]=(g.dataset.pivot||'0 0').split(/\s+/).map(Number);
   return {g,spec:{kind:g.dataset.anim,x,y,phase:g.dataset.phase,swing:g.dataset.swing,speed:g.dataset.speed}};
  })};
  rigs.set(el,rig);
 }
 const flight=options.profile?.flight??1;
 for(const foot of rig.flightFeet)foot.setAttribute('opacity',String(flight));
 for(const foot of rig.groundFeet)foot.setAttribute('opacity',String(1-flight));
 if(rig.body)rig.body.setAttribute('transform',bodyPose(options));
 for(const {g,spec} of rig.joints){g.setAttribute('transform',jointPose(spec,options));if(spec.kind==='wing'&&Number(spec.phase)>1&&options.profile?.air&&options.profile.kind==='bird')g.setAttribute('opacity',String(flight));}
 animateInsectLegs(el,options.phase,options.activity>.02,options.reduced);
}
