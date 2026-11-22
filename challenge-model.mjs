import {SPECIES} from './data.mjs';
// Goals track a visit's progress; they never unlock decorations or change rarity.
export const CHALLENGE_KEY='quiet-mouse-goals-v17';
export const LEGACY_CHALLENGE_KEY='quiet-mouse-challenges-v15';
const finite=(n,fallback)=>typeof n==='number'&&Number.isFinite(n)?n:fallback;
const bounded=(n,min,max)=>Math.max(min,Math.min(max,n));
const speciesIds=new Set(SPECIES.map(s=>s.id));
const validIds=ids=>[...new Set(Array.isArray(ids)?ids:[])].filter(id=>speciesIds.has(id));
const decorationIds=['flowers','log','stones'];
export function restoreChallenge(raw){
 const hasSaved=raw&&typeof raw==='object'&&!Array.isArray(raw);raw=hasSaved?raw:{};
 const modern=raw.version===2,type=modern?(raw.type==='quiet'?'quiet':'animals'):hasSaved?'quiet':'animals';
 const goal=Math.round(bounded(finite(raw.goal,600),60,3600));
 const duration=Math.round(bounded(finite(raw.duration,300),1,86400));
 const earned=bounded(finite(raw.earned,0),0,goal),elapsed=bounded(finite(raw.elapsed,0),0,duration);
 const target=Math.round(bounded(finite(raw.target,10),1,SPECIES.length));
 const peak=Math.floor(bounded(finite(raw.peak,0),0,SPECIES.length));
 const endedEarly=modern&&raw.endedEarly===true;
 const finished=raw.finished===true&&(endedEarly||(type==='quiet'?earned>=goal:elapsed>=duration));
 const legacy=modern?raw.legacyDecorations||{}:raw;
 return {version:2,type,goal,duration,target,earned,elapsed,peak,current:Math.floor(bounded(finite(raw.current,0),0,SPECIES.length)),endedEarly,
  baseline:validIds(raw.baseline),active:false,
  started:raw.started===true||raw.active===true||earned>0||elapsed>0||finished,
  finished,success:finished&&(type==='quiet'?earned>=goal:peak>=target),
  completed:Math.floor(bounded(finite(raw.completed,0),0,1000000)),show:raw.show!==false,
  // Freeze old unlocks at migration. Future completions cannot add to this count.
  legacyDecorations:{completed:Math.floor(bounded(finite(legacy.completed,0),0,3)),hidden:decorationIds.filter(id=>Array.isArray(legacy.hidden)&&legacy.hidden.includes(id))}};
}
export function startChallenge(state,options={},present=[]){
 state.type=options.type==='quiet'?'quiet':'animals';
 state.goal=Math.round(bounded(finite(Number(options.minutes),10),1,60))*60;
 state.duration=Math.round(bounded(finite(Number(options.duration),300),1,86400));
 state.target=Math.round(bounded(finite(Number(options.target),10),1,SPECIES.length));
 state.earned=0;state.elapsed=0;state.peak=0;state.current=0;
 state.baseline=validIds(present);state.started=true;state.active=true;state.finished=false;state.success=false;state.endedEarly=false;
}
export function resetChallenge(state){
 state.active=false;state.started=false;state.finished=false;state.success=false;state.endedEarly=false;
 state.earned=0;state.elapsed=0;state.peak=0;state.current=0;state.baseline=[];
}
export function advanceChallenge(state,dt,{listening=false,calibrating=false,quiet=false,visible=true,present=[]}={}){
 if(!state.active||state.finished||!listening||calibrating||!visible)return null;
 const elapsed=Math.max(0,finite(dt,0));
 if(state.type==='quiet'){
  if(!quiet)return null;
  state.earned=Math.min(state.goal,state.earned+elapsed);
  if(state.earned+1e-7<state.goal)return null;
  state.earned=state.goal;state.success=true;
 }else{
  const baseline=new Set(state.baseline);
  state.current=validIds(present).filter(id=>!baseline.has(id)).length;
  state.peak=Math.max(state.peak,state.current);
  state.elapsed=Math.min(state.duration,state.elapsed+elapsed);
  if(state.elapsed+1e-7<state.duration)return null;
  state.elapsed=state.duration;state.success=state.peak>=state.target;
 }
 return finishChallenge(state,false);
}
function finishChallenge(state,early){
 state.active=false;state.finished=true;state.endedEarly=early;
 state.success=state.type==='quiet'?state.earned>=state.goal:state.peak>=state.target;
 if(state.success)state.completed++;
 return {success:state.success,type:state.type,peak:state.peak,target:state.target,completed:state.completed,endedEarly:early};
}
export function endChallenge(state){
 if(!state.started||state.finished)return null;
 return finishChallenge(state,true);
}
export function challengeStatus(state,{listening=false,calibrating=false,quiet=false}={}){
 if(state.finished)return state.endedEarly?(state.success?'Ended early · target reached!':'Goal ended · target not reached'):state.success?'Goal complete!':'Time’s up · target not reached';
 if(!state.active)return state.started?'Goal paused':'Ready when you are';
 if(!listening)return 'Waiting for the microphone · timer paused';
 if(calibrating)return 'Calibrating · progress paused';
 if(state.type==='animals')return state.peak>=state.target?'Target reached · timer still running':'Best count is kept if animals run away';
 return quiet?'Quiet time is adding up':'Waiting for quiet · progress kept';
}
export const formatTime=seconds=>`${Math.floor(Math.max(0,seconds)/60)}:${String(Math.floor(Math.max(0,seconds)%60)).padStart(2,'0')}`;
