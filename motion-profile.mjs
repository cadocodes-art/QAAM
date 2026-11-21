import {birdMotion} from './bird-art.mjs';
import {invertebrateMotion} from './invertebrate-art.mjs';
import {mammalMotion} from './mammal-art.mjs';
const smallBugs=new Set(['ant','insect','bee','beetle','spider','butterfly','worm','snail','shrimp']);
const smallMammals=new Set(['rodent','rabbit','hedgehog']);
export function visualProfile(s){
 let motion=birdMotion(s)||invertebrateMotion(s)||mammalMotion(s);
 if(motion&&typeof motion==='object')motion=motion.motion;
 if(!motion){
  motion=s.water?'swim':s.kind==='frog'?'hop':s.kind==='snake'?'slither':'crawl';
  if(s.kind==='jelly')motion='pulse';
  if(s.kind==='shell')motion='settled';
  if(s.kind==='ray')motion='glide';
  if(s.kind==='octopus'||s.kind==='crab')motion='crawl';
  if(s.name==='Common Toad')motion='walk';
  if(s.name==='Platypus'||s.name==='Sea Otter')motion='paddle';
 }
 const air=motion==='fly',water=s.water;
 let size=smallBugs.has(s.kind)?78:smallMammals.has(s.kind)?119:s.kind==='bird'||s.kind==='fish'||s.kind==='frog'?128:172;
 if(['elephant','giraffe','whale'].includes(s.kind))size=224;
 if(['House Mouse','Field Mouse','Common Vole','Norway Lemming','Mole'].includes(s.name))size=91;
 if(['butterfly','bee'].includes(s.kind))size=89;
 if(s.kind==='longbird')size=174;
 if(['Grasshopper','Locust','Field Cricket','Garden Snail','Cockroach'].includes(s.name))size=89;
 let speed=air?42:water?24:motion==='hop'?31:smallBugs.has(s.kind)?8:motion==='crawl'?13:23;
 if(['Garden Snail','Garden Slug','Earthworm','Millipede','Blue Mussel'].includes(s.name))speed=2;
 if(motion==='settled')speed=0;
 if(motion==='pulse')speed=6;
 if(s.kind==='whale'||s.kind==='ray')speed=18;
 const flapHz=s.kind==='butterfly'?1.8:s.kind==='bee'||s.kind==='insect'?7:2.8;
 return {motion,kind:s.kind,air,water,size,speed,flapHz,cadence:motion==='hop'?1.2:water?.65:smallBugs.has(s.kind)?2:1.1,
  jump:s.kind==='kangaroo'?15:s.kind==='frog'?12:9,fieldFlight:air&&smallBugs.has(s.kind)};
}
