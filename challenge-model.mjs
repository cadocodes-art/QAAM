// Quiet goals are independent of animal rarity rolls and continuous tier timers.
export const CHALLENGE_KEY='quiet-mouse-challenges-v15';
export const REWARDS=[
 {id:'flowers',name:'Wildflower patches',description:'More flowers for the meadow and its butterflies.'},
 {id:'log',name:'Meadow log',description:'A mossy fallen log among the grass.'},
 {id:'stones',name:'Garden stones',description:'A little trail of painted meadow stones.'}
];
const finite=(n,fallback)=>typeof n==='number'&&Number.isFinite(n)?n:fallback;
const bounded=(n,min,max)=>Math.max(min,Math.min(max,n));
export function restoreChallenge(raw={}){
 if(!raw||typeof raw!=='object')raw={};
 const goal=Math.round(bounded(finite(raw.goal,600),60,3600));
 const earned=bounded(finite(raw.earned,0),0,goal);
 return {goal,earned,active:false,completed:Math.floor(bounded(finite(raw.completed,0),0,1000000)),
  finished:raw.finished===true&&earned>=goal,show:raw.show!==false,
  hidden:REWARDS.filter(r=>Array.isArray(raw.hidden)&&raw.hidden.includes(r.id)).map(r=>r.id)};
}
export function startChallenge(state,minutes){
 state.goal=Math.round(bounded(finite(Number(minutes),10),1,60))*60;
 state.earned=0;state.active=true;state.finished=false;
}
export function advanceChallenge(state,dt,{listening=false,calibrating=false,quiet=false,visible=true}={}){
 if(!state.active||state.finished||!listening||calibrating||!quiet||!visible)return null;
 state.earned=Math.min(state.goal,state.earned+bounded(finite(dt,0),0,.25));
 if(state.earned+1e-7<state.goal)return null;
 state.earned=state.goal;state.active=false;state.finished=true;
 const reward=REWARDS[state.completed]||null;state.completed++;
 return {reward,completed:state.completed};
}
export function challengeStatus(state,{listening=false,calibrating=false,quiet=false}={}){
 if(state.finished)return 'Goal complete!';
 if(!state.active)return state.earned>0?'Challenge paused':'Ready when you are';
 if(!listening)return 'Waiting for the microphone';
 if(calibrating)return 'Calibrating · progress paused';
 return quiet?'Quiet time is adding up':'Waiting for quiet · progress kept';
}
export const formatTime=seconds=>`${Math.floor(Math.max(0,seconds)/60)}:${String(Math.floor(Math.max(0,seconds)%60)).padStart(2,'0')}`;
