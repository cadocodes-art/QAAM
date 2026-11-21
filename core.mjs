import {TIERS,SPECIES} from './data.mjs';
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function volumeLevel(samples){let power=0;for(const n of samples)power+=n*n;return clamp((20*Math.log10(Math.max(1e-7,Math.sqrt(power/samples.length)))+65)/60*100,0,100);}
export function makeState(){return {quiet:TIERS.map(()=>0),clock:0,present:new Set()};}
export function advance(state,dt,level,threshold,random=Math.random){
 const fled=[],arrived=[];dt=clamp(dt,0,.25);
 for(const t of TIERS){const calm=level<=threshold*t.quiet;state.quiet[t.id]=calm?state.quiet[t.id]+dt:0;
 if(!calm)for(const s of SPECIES)if(s.tier===t.id&&state.present.delete(s.id))fled.push(s);}
 state.clock+=dt;
 if(state.clock>=5){state.clock%=5;for(const t of TIERS){if(state.quiet[t.id]<t.seconds||random()>=t.chance)continue;
 const candidates=SPECIES.filter(s=>s.tier===t.id&&!state.present.has(s.id));
 if(!candidates.length)continue;let roll=random()*candidates.reduce((sum,s)=>sum+s.weight,0);let chosen=candidates.at(-1);for(const s of candidates){roll-=s.weight;if(roll<0){chosen=s;break;}}
 state.present.add(chosen.id);arrived.push(chosen);}}
 return {arrived,fled};
}
export function shoreX(y){const pts=[[.5,1.80],[.55,1.66],[.62,1.51],[.68,1.55],[.73,1.60],[.79,1.57],[.85,1.63],[1,1.74]];for(let i=1;i<pts.length;i++)if(y<=pts[i][0]){const[a,x]=pts[i-1],[b,z]=pts[i];return x+(z-x)*(y-a)/(b-a);}return 1.74;}
