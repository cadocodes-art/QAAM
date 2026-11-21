import {drawMammal} from './mammal-art.mjs';
import {drawBird} from './bird-art.mjs';
import {drawInvertebrate} from './invertebrate-art.mjs';
import {drawAquatic} from './aquatic-art.mjs';
const cache=new Map();
export const renderers=[['mammal',drawMammal],['bird',drawBird],['invertebrate',drawInvertebrate],['aquatic-reptile',drawAquatic]];
export function art(s){
 if(cache.has(s.id))return cache.get(s.id);
 let drawing=null;
 for(const [family,draw] of renderers){const inner=draw(s);if(inner){drawing={family,inner};break;}}
 if(!drawing)throw new Error(`No V1.3 illustration for ${s.name}`);
 const svg=`<svg viewBox="0 0 264 165" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-family="${drawing.family}"><g data-body="">${drawing.inner}</g></svg>`;
 cache.set(s.id,svg);return svg;
}
