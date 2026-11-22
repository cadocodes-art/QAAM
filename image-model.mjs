export const MAX_IMAGES=5;
export const MAX_IMAGE_BYTES=20*1024*1024;
export const IMAGE_TYPES=new Set(['image/png','image/jpeg','image/webp','image/gif']);
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const number=(v,f,min,max)=>typeof v==='number'&&Number.isFinite(v)?clamp(v,min,max):f;
export function normalizeImages(rows){
 const seen=new Set(),out=[];
 for(const row of Array.isArray(rows)?rows:[]){
  if(out.length===MAX_IMAGES)break;
  if(!row||typeof row.id!=='string'||!/^[\w-]{1,80}$/.test(row.id)||seen.has(row.id)||!(row.blob instanceof Blob)||!IMAGE_TYPES.has(row.blob.type)||row.blob.size>MAX_IMAGE_BYTES)continue;
  seen.add(row.id);out.push({id:row.id,name:typeof row.name==='string'?row.name.slice(0,100):'Image',blob:row.blob,width:number(row.width,1,1,2048),height:number(row.height,1,1,2048),scale:number(row.scale,30,10,100),x:number(row.x,.5,0,1),y:number(row.y,.5,0,1)});
 }
 return out;
}
export function imageLayout(item,viewWidth,viewHeight){
 const availableWidth=Math.max(1,viewWidth-24),availableHeight=Math.max(1,viewHeight-48);
 const fit=Math.min(availableWidth/item.width,availableHeight/item.height)*item.scale/100;
 const width=item.width*fit,height=item.height*fit,rangeX=Math.max(0,viewWidth-width-24),rangeY=Math.max(0,viewHeight-height-48);
 return {width,height,left:12+item.x*rangeX,top:32+item.y*rangeY,rangeX,rangeY};
}
export function moveImage(item,dx,dy,rangeX,rangeY){return{x:rangeX?clamp(item.x+dx/rangeX,0,1):0,y:rangeY?clamp(item.y+dy/rangeY,0,1):0};}
