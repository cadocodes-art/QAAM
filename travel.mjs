// Entrance paths are fixed in world coordinates, even while the camera scrolls.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function planArrival({min,max,y,width,worldWidth,worldHeight,viewLeft,viewWidth,air,fieldFlight,water},random=Math.random){
 const panel=worldWidth/3,half=width/2/panel,gap=(14+width*.12)/panel;
 const left=viewLeft/panel,right=(viewLeft+viewWidth)/panel;
 const lo=Math.max(min,left+half+gap/2),hi=Math.min(max,right-half-gap/2);
 const visible=hi>=lo,worldLeft=!water,worldRight=water||(air&&!fieldFlight);
 const targetInset=Math.min(Math.max(0,hi-lo)*.35,60/panel);
 if(air&&random()<.4){
  const targetX=visible?lo+random()*(hi-lo):min+random()*(max-min);
  const x=clamp(targetX+(random()-.5)*width/panel,min,max);
  return {x,y:-(14+width*.12)/worldHeight,targetX,targetY:y,
   side:'top',dir:Math.sign(targetX-x)||(random()<.5?-1:1),speed:0};
 }
 const choices=[];
 if(visible){
  const fromLeft=left-half-gap,fromRight=right+half+gap;
  if(fromLeft>=min||worldLeft)choices.push({x:fromLeft,targetX:lo+targetInset,side:'left',dir:1});
  if(fromRight<=max||worldRight)choices.push({x:fromRight,targetX:hi-targetInset,side:'right',dir:-1});
 }
 // If the habitat is off camera, enter its outer world edge. Never materialize
 // on screen or travel over the wrong habitat to reach the camera.
 const side=choices.length?choices[Math.floor(random()*choices.length)]:water?
  {x:3+half+gap,targetX:max-Math.min(.1,(max-min)*.2),side:'right',dir:-1}:
  {x:-half-gap,targetX:min+Math.min(.1,(max-min)*.2),side:'left',dir:1};
 return {...side,y,targetY:y,speed:0};
}

export function advanceArrival(entry,x,y,dt,panel,height,maxSpeed){
 dt=clamp(dt,0,.1);
 const dx=(entry.targetX-x)*panel,dy=(entry.targetY-y)*height,distance=Math.hypot(dx,dy);
 const speed=entry.speed+(maxSpeed-entry.speed)*(1-Math.exp(-dt*4));
 const travel=Math.min(distance,speed*dt),done=distance<.01||travel>=distance;
 if(distance<.01)return {x:entry.targetX,y:entry.targetY,vx:0,vy:0,speed,done:true};
 return {x:done?entry.targetX:x+dx/distance*travel/panel,
  y:done?entry.targetY:y+dy/distance*travel/height,
  vx:dx/distance*speed,vy:dy/distance*speed,speed,done};
}

// Explicitly enabled camera travel: ease up to speed and slow near each end.
export function advanceAutoscroll(state,position,dt,max,speed){
 position=clamp(position,0,Math.max(0,max));dt=clamp(dt,0,.1);
 if(max<=0||speed<=0){state.velocity=0;return position;}
 if(state.pause>0){state.pause=Math.max(0,state.pause-dt);state.velocity=0;return position;}
 const remaining=state.direction>0?max-position:position;
 if(remaining<.35){state.direction*=-1;state.velocity=0;state.pause=.4;return state.direction<0?max:0;}
 const desired=state.direction*Math.min(speed,Math.max(10,remaining*2));
 state.velocity+=(desired-state.velocity)*(1-Math.exp(-dt*4));
 const next=position+state.velocity*dt;
 if(next<=0||next>=max){state.direction=next<=0?1:-1;state.velocity=0;state.pause=.4;}
 return clamp(next,0,max);
}
