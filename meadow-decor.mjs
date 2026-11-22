// Small vector decorations complement the supplied panorama; no remote assets.
export const FLOWERS=[{x:.22,y:.86},{x:.48,y:.92},{x:.79,y:.83},{x:1.12,y:.91}];
const extra=[{x:.35,y:.81},{x:.65,y:.87},{x:.96,y:.93},{x:1.26,y:.84}];
const svg=body=>`<svg viewBox="0 0 140 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;
export function flowerArt(){return svg([[-23,7,'#e8c16e'],[0,-4,'#d9a4a1'],[23,10,'#b0b1d7']].map(([x,y,c])=>`<g transform="translate(${70+x} ${37+y})"><path d="M0 0Q-4 20 0 ${49-y}M-1 25q-16-12-16-4q1 10 16 12M0 33q16-17 17-8q-3 10-17 13" fill="#588850" stroke="#4b7844" stroke-width="2"/>${[0,72,144,216,288].map(r=>`<ellipse cx="0" cy="-9" rx="6" ry="11" fill="${c}" transform="rotate(${r})"/>`).join('')}<circle r="5" fill="#ab7c3f"/></g>`).join(''));}
export const DECOR_ART={flowers:flowerArt(),log:svg('<ellipse cx="69" cy="79" rx="61" ry="7" fill="#304c3133"/><path d="M18 31L113 27Q131 48 118 74L25 78Q3 62 18 31Z" fill="#99734d"/><ellipse cx="25" cy="54" rx="19" ry="24" fill="#c6a471"/><ellipse cx="25" cy="54" rx="11" ry="16" fill="none" stroke="#95734c" stroke-width="3"/><path d="M49 37l57-3M52 53l61-3M49 68l58-4" stroke="#6e5339" stroke-width="3" stroke-linecap="round"/><path d="M40 30Q60 17 81 26Q105 12 117 29L110 37Q89 28 69 37Q51 29 39 37Z" fill="#739052"/>'),stones:svg('<ellipse cx="72" cy="78" rx="62" ry="7" fill="#304c3122"/><path d="M13 73Q7 51 31 46Q51 45 56 68Q44 83 13 73" fill="#a3aaa0"/><path d="M59 73Q47 40 73 31Q98 31 103 66Q95 83 59 73" fill="#b9b7a4"/><path d="M102 76Q90 52 112 49Q135 47 132 72Q123 82 102 76" fill="#899f97"/><path d="M70 60q-8-11-4-15q11 0 13 15M73 65q13-17 17-9q-1 10-17 9" fill="#6f8a61"/><circle cx="29" cy="62" r="5" fill="#dbbd7b"/>')};
export function initDecorations(world){
 const layer=document.createElement('div');layer.id='decorations';layer.setAttribute('aria-hidden','true');world.append(layer);
 let flowers=FLOWERS;
 function render(state){
  const unlocked=id=>state.completed>['flowers','log','stones'].indexOf(id)&&!state.hidden.includes(id);
  flowers=unlocked('flowers')?[...FLOWERS,...extra]:FLOWERS;
  layer.innerHTML='';
  const add=(kind,x,y)=>{const el=document.createElement('div');el.className=`meadow-decor decor-${kind}`;el.style.left=x/3*100+'%';el.style.top=y*100+'%';el.style.zIndex=Math.floor(y*100);el.innerHTML=DECOR_ART[kind];layer.append(el);};
  flowers.forEach(f=>add('flowers',f.x,f.y));
  if(unlocked('log'))add('log',.91,.88);
  if(unlocked('stones'))add('stones',.57,.85);
 }
 return {render,getFlowers:()=>flowers};
}
