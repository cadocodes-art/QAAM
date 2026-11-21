// Approved PNG is used unchanged. CSS clips off its empty top/bottom margins.
export const PANORAMA = {width:2172,height:724,top:186,bottom:538};
export const SCENE_HEIGHT=PANORAMA.bottom-PANORAMA.top;
export const SCENE_RATIO=PANORAMA.width/SCENE_HEIGHT;
// Measured water edge in the original PNG. World x coordinates use 0..3.
const shorePixels=[[386,1450],[390,1289],[395,1221],[400,1179],[410,1116],
 [420,1077],[430,1053],[438,1050],[445,1065],[450,1085],[460,1116],
 [468,1125],[476,1121],[484,1104],[492,1106],[500,1119],[510,1149],
 [520,1175],[530,1210],[538,1246]];
export const SHORE=shorePixels.map(([y,x])=>[(y-PANORAMA.top)/SCENE_HEIGHT,x/PANORAMA.width*3]);
export function shoreX(y){
 if(y<=SHORE[0][0])return SHORE[0][1];
 for(let i=1;i<SHORE.length;i++)if(y<=SHORE[i][0]){
  const[a,x]=SHORE[i-1],[b,z]=SHORE[i];return x+(z-x)*(y-a)/(b-a);
 }
 return SHORE.at(-1)[1];
}
export function habitatBounds(y,width,height,worldWidth,worldHeight,water){
 const half=width/worldWidth*1.5,top=y-height/worldHeight;
 // Include every shoreline bend within the animal's height, not just its feet.
 const edges=[shoreX(top),shoreX(y),...SHORE.filter(([v])=>v>top&&v<y).map(([,x])=>x)];
 const min=water?Math.max(...edges)+half+.025:half+.025;
 const max=water?3-half-.025:Math.min(...edges)-half-.025;
 return {min,max};
}
export function waterClip(){
 const bank=SHORE.map(([y,x])=>`${x/3*100}% ${y*100}%`);
 return `polygon(${bank[0]},100% ${SHORE[0][0]*100}%,100% 100%,${bank.slice(1).reverse().join(',')})`;
}
