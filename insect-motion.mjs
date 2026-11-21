// Local leg coordinates keep every hip attached to the body.
const TAU=Math.PI*2;
export function insectLegPose({restX,restY,upper,lower,bend,offset},phase,moving,reduced=false){
 const cycle=phase+offset;
 const active=moving&&!reduced;
 const step=active?Math.cos(cycle)*8:0;
 // Squaring the swing half-cycle softens touchdown and liftoff without a snap.
 const lift=active?Math.max(0,Math.sin(cycle))**2*6:0;
 let footX=restX+step,footY=restY-lift;
 const targetDistance=Math.hypot(footX,footY);
 const restDistance=Math.hypot(restX,restY);
 const unitX=targetDistance>1e-9?footX/targetDistance:restDistance>1e-9?restX/restDistance:0;
 const unitY=targetDistance>1e-9?footY/targetDistance:restDistance>1e-9?restY/restDistance:1;
 // Keep the requested foot inside the two-bone reachable annulus. This also
 // handles a target at the hip without dividing by zero or stretching a knee.
 const epsilon=Math.min(upper,lower)*1e-6;
 const distance=Math.max(Math.abs(upper-lower)+epsilon,Math.min(upper+lower-epsilon,targetDistance));
 footX=unitX*distance;footY=unitY*distance;
 const along=(upper*upper-lower*lower+distance*distance)/(2*distance);
 const out=Math.sqrt(Math.max(0,upper*upper-along*along));
 return {footX,footY,kneeX:along*unitX+bend*out*unitY,
  kneeY:along*unitY-bend*out*unitX};
}
export function insectLegSpecs(pairs=3,ant=false){
 const specs=[];
 for(let side=0;side<2;side++)for(let pair=0;pair<pairs;pair++){
  const spread=(pair/(pairs-1)-.5)*2;
  specs.push({x:(ant?111:108)+pair*(ant?13:39/(pairs-1)),y:side?99:91,
   restX:spread*(ant?24:26)+(side?3:-3),restY:ant?37:32,
   upper:ant?25:23,lower:ant?27:25,bend:spread<0?-1:1,
   offset:((pair+side)%2)*Math.PI,side});
 }
 return specs;
}
const legPath=pose=>`M0 0 L${pose.kneeX.toFixed(3)} ${pose.kneeY.toFixed(3)} L${pose.footX.toFixed(3)} ${pose.footY.toFixed(3)}`;
export function insectLegs(color,pairs=3,ant=false){
 return insectLegSpecs(pairs,ant).map(s=>
  `<g data-insect-leg="" data-rest-x="${s.restX}" data-rest-y="${s.restY}" data-upper="${s.upper}" data-lower="${s.lower}" data-bend="${s.bend}" data-offset="${s.offset}" transform="translate(${s.x} ${s.y})" opacity="${s.side?1:.7}"><path d="${legPath(insectLegPose(s,0,false))}" fill="none" stroke="${color}" stroke-width="${ant?4:3}" stroke-linecap="round" stroke-linejoin="round"/></g>`
 ).join('');
}
const rigs=new WeakMap();
export function animateInsectLegs(el,phase,moving,reduced=false){
 let rig=rigs.get(el);
 if(!rig){
  rig=Array.from(el.querySelectorAll('[data-insect-leg]'),g=>({path:g.querySelector('path'),
   spec:{restX:+g.dataset.restX,restY:+g.dataset.restY,upper:+g.dataset.upper,
    lower:+g.dataset.lower,bend:+g.dataset.bend,offset:+g.dataset.offset}}));
  rigs.set(el,rig);
 }
 // Alternating tripods (or alternating four-legged groups for spiders).
 for(const {path,spec} of rig)path.setAttribute('d',legPath(insectLegPose(spec,phase%TAU,moving,reduced)));
}
