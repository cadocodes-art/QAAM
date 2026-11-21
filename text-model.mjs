export const TEXT_KEY='quiet-mouse-text-v1';
export const MAX_BOXES=10;
export const MAX_TEXT=1000;
export const FONTS=[
 ['Arial','Arial, Helvetica, "QAAM Open Sans", sans-serif'],
 ['Helvetica','Helvetica, Arial, "QAAM Open Sans", sans-serif'],
 ['Times New Roman','"Times New Roman", Times, serif'],
 ['Georgia','Georgia, "Times New Roman", serif'],
 ['Verdana','Verdana, "QAAM Open Sans", sans-serif'],
 ['Tahoma','Tahoma, Verdana, "QAAM Open Sans", sans-serif'],
 ['Trebuchet MS','"Trebuchet MS", "QAAM Open Sans", sans-serif'],
 ['Calibri','Calibri, "QAAM Open Sans", sans-serif'],
 ['Cambria','Cambria, Georgia, serif'],
 ['Garamond','Garamond, "Palatino Linotype", Palatino, Georgia, serif'],
 ['Courier New','"Courier New", Courier, monospace'],
 ['Impact','Impact, Haettenschweiler, "Arial Narrow", "QAAM Roboto", sans-serif'],
 ['Comic Sans MS','"Comic Sans MS", "Comic Sans", Chalkboard, cursive'],
 ['Roboto','"QAAM Roboto", Roboto, Arial, sans-serif'],
 ['Open Sans','"QAAM Open Sans", "Open Sans", Arial, sans-serif']
];
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const number=(v,fallback,min,max)=>Number.isFinite(v)?clamp(v,min,max):fallback;
export function normalizeNotes(input){
 if(!Array.isArray(input))return [];
 const used=new Set(),notes=[];
 for(const row of input){
  if(!row||typeof row!=='object'||notes.length===MAX_BOXES)continue;
  const id=typeof row.id==='string'&&/^[a-zA-Z0-9_-]{1,80}$/.test(row.id)?row.id:'restored-'+notes.length;
  if(used.has(id))continue;used.add(id);
  notes.push({id,text:typeof row.text==='string'?row.text.slice(0,MAX_TEXT):'',font:FONTS.some(([name])=>name===row.font)?row.font:'Arial',size:number(row.size,32,16,96),color:typeof row.color==='string'&&/^#[0-9a-f]{6}$/i.test(row.color)?row.color:'#263e30',backing:row.backing!==false,x:number(row.x,.5,0,1),y:number(row.y,.42,0,1)});
 }
 return notes;
}
export function notePosition(note,viewWidth,viewHeight,boxWidth,boxHeight){
 const left=12,top=12,rangeX=Math.max(0,viewWidth-boxWidth-24),rangeY=Math.max(0,viewHeight-boxHeight-24);
 return {left:left+note.x*rangeX,top:top+note.y*rangeY,rangeX,rangeY};
}
export function dragPosition(note,dx,dy,rangeX,rangeY){
 return {x:rangeX?clamp(note.x+dx/rangeX,0,1):0,y:rangeY?clamp(note.y+dy/rangeY,0,1):0};
}
