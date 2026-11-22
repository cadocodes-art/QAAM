import {makeState,clamp,CHECK_SECONDS,STARTLE_RESET_SECONDS} from './core.mjs';
import {SPECIES,TIERS} from './data.mjs';
import {createBehavior} from './animal-behavior.mjs';
import {visualProfile} from './motion-profile.mjs';
export const VISIT_KEY='quiet-mouse-visit-v151';
const speciesById=new Map(SPECIES.map(s=>[s.id,s]));
const number=(value,fallback,min,max)=>Number.isFinite(value)&&typeof value==='number'?clamp(value,min,max):fallback;
const point=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)?{x:clamp(p.x,-1,4),y:clamp(p.y,-1,1)}:null;
function actorSnapshot(raw,s){
 const p=visualProfile(s),base=createBehavior(s,p,()=>.5),b=raw?.behavior||{};
 const types=new Set(['roam','landing','approach-flower','takeoff','perch','nectar','nibble','rest','cruise']);
 const behavior={...base,type:types.has(b.type)?b.type:'roam',timer:number(b.timer,10,-1,60),age:number(b.age,0,0,1e9),blend:number(b.blend,0,0,1),flight:number(b.flight,1,0,1),homeY:number(b.homeY,p.fieldFlight?.65:.45,.2,.96),goal:point(b.goal),flower:point(b.flower),flowerDir:number(b.flowerDir,1,-1,1)||1};
 if(['landing','approach-flower','takeoff'].includes(behavior.type)&&!behavior.goal||['nectar','approach-flower'].includes(behavior.type)&&!behavior.flower)behavior.type='roam';
 const e=raw?.entry;
 const entry=e&&['left','right','top'].includes(e.side)&&Number.isFinite(e.targetX)&&Number.isFinite(e.targetY)?{side:e.side,targetX:clamp(e.targetX,0,3),targetY:clamp(e.targetY,.2,.96),dir:number(e.dir,1,-1,1)||1,speed:number(e.speed,0,0,1000)}:null;
 return {id:s.id,x:number(raw?.x,s.water?2.3:.5,-1,4),y:number(raw?.y,p.air?.45:.85,-1,1),baseY:number(raw?.baseY,p.air?.45:.85,-1,1),dir:number(raw?.dir,1,-1,1),velocity:number(raw?.velocity,0,-1000,1000),facing:number(raw?.facing,1,-1,1),faceTarget:number(raw?.faceTarget,1,-1,1)||1,target:number(raw?.target,4,0,60),phase:number(raw?.phase,0,-1e12,1e12),timeOffset:number(raw?.timeOffset,0,0,100),hover:number(raw?.hover,1,0,1),entry,behavior};
}
export function restoreVisit(raw){
 if(!raw||raw.version!==1||raw.started!==true)return null;
 const state=makeState(),saved=raw.state||{};
 state.present=new Set((Array.isArray(saved.present)?saved.present:[]).filter(id=>speciesById.has(id)));
 state.quiet=TIERS.map((_,i)=>number(saved.quiet?.[i],0,0,1e9));
 state.clock=number(saved.clock,0,0,CHECK_SECONDS-.000001);
 state.startleReady=saved.startleReady!==false;
 state.calmAfterStartle=number(saved.calmAfterStartle,0,0,STARTLE_RESET_SECONDS);
 const source=new Map((Array.isArray(raw.actors)?raw.actors:[]).filter(a=>a&&speciesById.has(a.id)).map(a=>[a.id,a]));
 return {state,actors:[...state.present].map(id=>actorSnapshot(source.get(id),speciesById.get(id))),baseline:number(raw.baseline,22,0,55),calibrated:raw.calibrated===true,camera:number(raw.camera,0,0,1),motionTime:number(raw.motionTime,0,0,1e9)};
}
export function captureVisit({state,actors,baseline,calibrated,camera,motionTime}){
 return {version:1,started:true,state:{...state,present:[...state.present],quiet:[...state.quiet]},
  actors:[...actors.values()].filter(a=>!a.preview&&!a.flee&&state.present.has(a.s.id)).map(a=>actorSnapshot(a,a.s)),baseline,calibrated,camera,motionTime};
}
