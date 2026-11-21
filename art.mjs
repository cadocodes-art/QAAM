import {animalSVG} from './original-animals.mjs';
const e=(x,y,rx,ry,c)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}"/>`;
const p=(d,c,extra='')=>`<path d="${d}" fill="${c}" ${extra}/>`;
const line=(d,c,w=4)=>p(d,'none',`stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`);
const eye=(x,y)=>e(x,y,2.3,2.8,'#263432')+e(x+.6,y-.8,.7,.7,'white');
const wrap=s=>`<svg viewBox="0 0 264 165" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g class="body">${s}</g></svg>`;
export function art(s){
 let {kind:k,color:c}=s;
 if(['ant','fox','leopard','dragon','okapi','amur'].includes(k)){let out=animalSVG(k==='amur'?'leopard':k,true);if(k==='amur')out=out.replaceAll('#becbc8','#c9aa6c').replaceAll('#c5d0cb','#d0b176').replaceAll('#c0ccca','#c9aa6c').replaceAll('#c8d2cb','#c9aa6c');return out;}
 let a='',legs='';const leg=(x,y,len,i)=>`<g class="leg l${i}" style="transform-origin:${x}px ${y}px">${line(`M${x} ${y} l-4 ${len*.6} l8 ${len*.4}`,c,9)}${e(x+5,y+len,7,3,'#4c4940')}</g>`;
 const wings=['bird','duck','longbird','penguin'].includes(k);
 if(wings){const tall=k==='longbird',peng=k==='penguin';a+=leg(119,110,tall?39:24,0)+leg(143,110,tall?39:24,1);a+=e(130,95,peng?26:39,peng?42:23,c);a+=e(129,101,peng?15:25,peng?31:13,k==='penguin'?'#eee8d8':'#cfc1a2');a+=p('M112 76 Q163 83 147 110 Q124 109 112 76',c);a+=line(`M155 85 Q${tall?143:156} 48 ${tall?177:173} ${tall?36:65}`,c,tall?10:18);a+=e(177,tall?36:65,15,14,c)+p(`M189 ${tall?33:63} l${tall?26:14} 7 l-${tall?26:14} 4Z`,'#d9a15a')+eye(181,tall?33:62);if(k==='penguin')a+=e(183,66,5,8,'#e6aa46');return wrap(a);}
 if(['fish','shark','dolphin','whale','seal','ray','platypus'].includes(k)){
 a+=`<g class="tail">${p('M80 86L34 57L42 85L30 111L83 100Z',c)}</g>`;
 if(k==='ray')a+=p('M75 91Q105 52 125 40L209 92L128 136Z',c)+line('M76 90L28 107',c,4);
 else {a+=e(137,91,k==='whale'?77:64,k==='seal'?31:24,c);a+=p('M109 77L133 49L149 76Z',c)+p('M135 99L160 127L167 99Z',c);if(k==='dolphin')a+=e(206,92,20,6,c);if(k==='platypus')a+=e(203,94,23,10,'#635b4e');if(k==='seal')a+=e(193,81,21,20,c)+line('M208 88l18-5M208 92l18 3','#e5ddc8',1);a+=eye(188,84);a+=line('M187 102Q202 107 209 97','#657777',1.5);if(k==='shark')a+=line('M173 85l-4 13M179 85l-4 13','#5c6e74',2);}
 return wrap(a);}
 if(['octopus','jelly','shrimp','crab','shell'].includes(k)){
 if(k==='shell')return wrap(p('M83 124Q58 48 125 49Q190 43 184 124Z',c)+line('M130 122L89 70M130 122L119 52M130 122L156 54M130 122L179 83','#c4c5b4',3));
 for(let i=0;i<(k==='octopus'?8:6);i++)a+=`<g class="leg l${i%4}">${line(`M${99+i*9} 90Q${60+i*19} 127 ${81+i*14} 132`,c,k==='jelly'?3:7)}</g>`;
 a+=e(132,76,k==='crab'?38:28,k==='octopus'?35:23,c)+eye(122,78)+eye(145,78);if(k==='crab')a+=line('M99 82L75 59M164 82L187 59',c,8)+e(72,54,12,17,c)+e(189,54,12,17,c);return wrap(a);}
 if(['insect','bee','beetle','spider','butterfly','worm','snail'].includes(k)){
 if(k==='worm'){for(let i=0;i<12;i++)a+=e(62+i*11,104+Math.sin(i*.6)*6,9,8,c);return wrap(a+eye(184,98));}
 if(k==='snail')return wrap(e(135,117,57,8,c)+e(125,93,28,26,'#bda37a')+p('M125 110Q97 102 111 82Q132 67 142 87Q148 103 128 102Q118 100 125 91','none','stroke="#806644" stroke-width="3"')+line('M174 112l3-27M187 113l8-25',c,4)+eye(178,84)+eye(195,87));
 for(let i=0;i<(k==='spider'?8:6);i++){let x=108+(i%4)*13;a+=`<g class="leg l${i%4}">${line(`M${x} 96l${i%2?15:-15} 16l${i%2?15:-15} 10`,c,3)}</g>`;}
 if(k==='butterfly')a+=e(106,70,29,33,c)+e(153,70,29,33,c)+e(108,111,22,20,c)+e(152,111,22,20,c);
 if(k==='bee'||k==='insect')a+=e(115,73,24,12,'#e6e8d5')+e(143,73,24,12,'#d9e5de');
 a+=e(127,94,30,18,k==='bee'?'#d8b953':c)+e(164,87,14,13,c)+eye(170,84)+line('M159 75l-3-18M168 75l12-15',c,2);if(k==='bee')a+=line('M115 80v28M130 77v34M145 82v22','#4a4234',7);return wrap(a);}
 if(k==='snake')return wrap(p('M42 119Q61 72 103 105T167 98Q190 67 218 88','none','stroke="'+c+'" stroke-width="17" stroke-linecap="round"')+eye(215,83));
 if(k==='frog')return wrap(e(125,110,37,24,c)+e(161,91,25,21,c)+e(148,76,8,10,c)+e(173,77,8,10,c)+eye(149,74)+eye(174,75)+leg(105,113,20,0)+leg(162,112,22,1));
 if(k==='turtle')return wrap(leg(87,113,22,0)+leg(157,113,22,1)+e(123,100,47,31,c)+line('M82 104L111 78L147 81L166 106M111 78l-2 39M147 81l-3 39','#68694a',3)+e(183,110,23,14,c)+eye(192,106));
 if(k==='crocodile'||k==='lizard')return wrap(p('M89 105L21 129L94 121Z',c)+leg(93,113,20,0)+leg(165,113,20,1)+e(131,107,61,18,c)+e(203,110,34,10,c)+eye(205,101)+line('M198 116h35','#414e3d',1));
 const small=['rodent','rabbit','hedgehog'].includes(k),ape=k==='ape',long=['deer','horse','goat','cow','zebra','giraffe','camel'].includes(k),height=small?26:long?46:37;
 for(let i=0;i<4;i++)legs+=leg(i<2?91:158,104,height,i);
 a+=`<g class="tail">${line(small?'M77 99Q24 76 32 127':'M77 90Q47 104 53 129',c,small?10:6)}</g>`+legs;
 if(k==='kangaroo')a+=p('M112 102L39 146L111 125Z',c);
 a+=e(124,92,small?44:58,small?25:31,c);
 if(k==='camel')a+=e(113,68,23,21,c);
 if(k==='sheep'){for(let i=0;i<12;i++)a+=e(84+(i%6)*15,79+Math.floor(i/6)*23,16,16,'#e4dfcd');}
 if(k==='hedgehog'){for(let i=0;i<20;i++)a+=line(`M${85+i*3} 82l-5-13`,'#655842',3);}
 if(k==='giraffe')a+=line('M163 89L174 31',c,19);
 const hy=k==='giraffe'?30:small?85:69;
 if(k==='lion')a+=e(183,hy,34,34,'#976436');
 a+=e(183,hy,small?22:27,small?19:24,c)+e(201,hy+11,23,12,c);
 if(['elephant','hippo','rhino'].includes(k)){a+=e(171,hy,18,24,c);if(k==='elephant')a+=line(`M219 ${hy+3}Q239 126 219 126`,c,13)+p('M207 93L231 110L219 91Z','#eee3c6');if(k==='rhino')a+=p('M214 74L226 44L232 82Z','#e0d3b4');}
 else if(ape)a+=e(186,hy+7,19,19,'#b39a7a')+e(161,hy-5,9,10,c);
 else {a+=e(170,hy-22,small?9:7,k==='rabbit'?25:11,c)+e(191,hy-23,small?8:7,k==='rabbit'?27:11,c);}
 if(['deer','goat','cow','giraffe'].includes(k))a+=line(`M172 ${hy-18}l-8-20l-9-5M190 ${hy-18}l9-20l9-5`,'#70614b',4);
 if(['cat','amur','tiger','zebra','giraffe'].includes(k)){for(let i=0;i<9;i++)a+=k==='cat'||k==='giraffe'?e(83+i*10,86+(i%2)*13,4,5,'#66563e'):line(`M${83+i*10} 73l-3 31`,'#3f4039',4);}
 if(k==='panda')a+=e(172,hy-22,9,11,'#343c3a')+e(193,hy-22,9,11,'#343c3a')+e(193,hy,8,10,'#343c3a')+e(150,96,17,28,'#343c3a');
 if(k==='anteater')a+=p('M196 77L241 106L204 97Z',c);
 a+=eye(194,hy-3)+e(219,hy+9,4,3,'#49483e');return wrap(a);
}
