import {clamp} from './core.mjs';
export const MIN_NOISE_LIMIT=-100;
export const MAX_NOISE_LIMIT=200;
const valid=value=>typeof value==='number'&&Number.isFinite(value);
export function readNoiseLimit(saved={}){
 if(!saved||typeof saved!=='object')return 50;
 // New settings take precedence; old sensitivity is inverted without changing
 // its effective threshold. The midpoint remains 50 in both scales.
 const value=valid(saved.noiseLimit)?saved.noiseLimit:valid(saved.sensitivity)?100-saved.sensitivity:50;
 return clamp(value,MIN_NOISE_LIMIT,MAX_NOISE_LIMIT);
}
export function noiseThreshold(baseline,noiseLimit){
 const base=valid(baseline)?clamp(baseline,0,55):22;
 const value=valid(noiseLimit)?clamp(noiseLimit,MIN_NOISE_LIMIT,MAX_NOISE_LIMIT):50;
 const sensitivity=100-value;
 const original=s=>clamp(base+18-(s-50)*.4,10,80);
 // Extend the old response at both ends. Higher Noise Limit always allows at
 // least as much sound. Endpoints remain inside the 0–100 sound meter.
 if(sensitivity<0){const start=original(0);return start+(99-start)*(-sensitivity/100);}
 if(sensitivity>100){const start=original(100);return start+(1-start)*((sensitivity-100)/100);}
 return original(sensitivity);
}
