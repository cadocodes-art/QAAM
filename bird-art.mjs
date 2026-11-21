// Species silhouettes and plumage use representative adults; domestic forms use
// explicitly chosen familiar breeds. All joints are local to their body anchor.
const E=(x,y,rx,ry,c,extra='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}" ${extra}/>`;
const P=(d,c,extra='')=>`<path d="${d}" fill="${c}" ${extra}/>`;
const L=(d,c,w=2)=>P(d,'none',`stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`);
const eye=(x,y,ring=null)=> (ring?E(x,y,3.8,3.8,ring):'')+E(x,y,2.3,2.6,'#252d2b')+E(x+.6,y-.8,.7,.8,'#fff7e5');
const joint=(kind,x,y,content,swing=10,phase=0)=>`<g data-anim="${kind}" data-pivot="${x} ${y}" data-phase="${phase}" data-swing="${swing}" transform="translate(${x} ${y})">${content}</g>`;
const toes=(y,c,web=false,count=4)=>web?P(`M0 ${y-4}L13 ${y+1}Q4 ${y+6}-9 ${y+2}Z`,c):L(count===2?`M0 ${y}L13 ${y+3}M0 ${y}L7 ${y-1}`:count===3?`M0 ${y}L12 ${y+2}M0 ${y}L7 ${y+5}M0 ${y}L13 ${y-2}`:`M0 ${y}L12 ${y+2}M0 ${y}L7 ${y+5}M0 ${y}L13 ${y-2}M0 ${y}L-7 ${y+3}`,c,2.4);
const foot=(x,y,length,c,phase=0,web=false,swing=11,count=4)=>joint('leg',x,y,L(`M0 0L3 ${length*.48}L0 ${length}`,c,3)+toes(length,c,web,count),swing,phase);
const marks=(coords,color,rx=2.4,ry=1.5)=>coords.map(([x,y])=>E(x,y,rx,ry,color)).join('');
const species={
 'House Sparrow':{family:'song',back:'#99734d',belly:'#d4c7ad',head:'#9f7552',wing:'#77583e',bill:'#594c3f',patch:'sparrow'},
 'European Starling':{family:'song',back:'#3e534d',belly:'#465551',head:'#354f49',wing:'#3c424b',bill:'#c99b48',patch:'starling',tail:'short'},
 'Red-billed Quelea':{family:'song',back:'#9c835d',belly:'#d2bc94',head:'#c29c77',wing:'#77674e',bill:'#c74b47',patch:'quelea'},
 'American Crow':{family:'song',back:'#30383a',belly:'#30383a',head:'#30383a',wing:'#242c30',bill:'#293132',patch:'crow'},
 'Common Raven':{family:'song',back:'#303a3f',belly:'#303a3f',head:'#303a3f',wing:'#242d34',bill:'#252d32',patch:'raven',tail:'wedge'},
 'Barn Swallow':{family:'song',back:'#375b70',belly:'#c49270',head:'#36566f',wing:'#314957',bill:'#353734',patch:'swallow',tail:'fork'},
 'American Robin':{family:'song',back:'#6f787a',belly:'#c37b51',head:'#4d5558',wing:'#596266',bill:'#d3aa54',patch:'robin'},
 'Eurasian Blackbird':{family:'song',back:'#36393a',belly:'#36393a',head:'#36393a',wing:'#2a3033',bill:'#d9a33e',patch:'blackbird'},
 'Blue Tit':{family:'song',back:'#8e9f68',belly:'#ddd27b',head:'#6d9fbc',wing:'#628ca9',bill:'#444d4c',patch:'blueTit'},
 'Great Tit':{family:'song',back:'#869361',belly:'#d6c66c',head:'#303a3b',wing:'#717e76',bill:'#3b4240',patch:'greatTit'},
 'Chaffinch':{family:'song',back:'#95705d',belly:'#c3927b',head:'#7f929c',wing:'#444f50',bill:'#737777',patch:'chaffinch'},
 'House Finch':{family:'song',back:'#9a806a',belly:'#d9c2a6',head:'#b86f65',wing:'#7e6e5e',bill:'#806d5c',patch:'finch'},
 'Rock Pigeon':{family:'dove',back:'#96a3ad',belly:'#bcc1c3',head:'#87969f',wing:'#aeb8bf',bill:'#62696c',patch:'pigeon'},
 'Mourning Dove':{family:'dove',back:'#b5a18c',belly:'#d9bda4',head:'#c1ab96',wing:'#ab9988',bill:'#5e5d59',patch:'dove'},
 'Laughing Gull':{family:'gull',back:'#8799a2',belly:'#f0eee3',head:'#343e45',wing:'#8799a2',bill:'#a6524c',patch:'laughing'},
 'Herring Gull':{family:'gull',back:'#a7b1b7',belly:'#f3f0e4',head:'#f3f0e4',wing:'#a7b1b7',bill:'#d7b45c',patch:'herring'},
 'Common Kestrel':{family:'falcon',back:'#b28763',belly:'#e0c7a0',head:'#939c9e',wing:'#ab7859',bill:'#555856',patch:'common'},
 'American Kestrel':{family:'falcon',back:'#bd8762',belly:'#e2c9a7',head:'#8c9da6',wing:'#7897a9',bill:'#535a5a',patch:'american'},
 'Domestic Chicken':{family:'fowl',patch:'chicken'},'Wild Turkey':{family:'fowl',patch:'turkey'},
 'Common Pheasant':{family:'fowl',patch:'pheasant'},'Peafowl':{family:'fowl',patch:'peacock'},
 'Domestic Duck':{family:'waterfowl',patch:'pekin'},'Domestic Goose':{family:'waterfowl',patch:'embden'},
 'Mallard':{family:'waterfowl',patch:'mallard'},'Canada Goose':{family:'waterfowl',patch:'canada'},
 'Sandhill Crane':{family:'wader',patch:'sandhill'},'Cattle Egret':{family:'wader',patch:'egret'},
 'Great Blue Heron':{family:'wader',patch:'heron'},'Greater Flamingo':{family:'wader',patch:'flamingo'},
 'Red-crowned Crane':{family:'wader',patch:'redcrown'},'Emu':{family:'ratite',patch:'emu'},'Ostrich':{family:'ratite',patch:'ostrich'},
 'Adelie Penguin':{family:'penguin',patch:'adelie'},'King Penguin':{family:'penguin',patch:'king'},'Atlantic Puffin':{family:'penguin',patch:'puffin'}
};
export const BIRD_NAMES=Object.freeze(Object.keys(species));
export function birdMotion(s){const p=species[s.name];if(!p)return null;return {motion:['song','gull','falcon'].includes(p.family)?'fly':['waterfowl','penguin'].includes(p.family)?'waddle':'walk'};}
function song(p){
 const raven=p.patch==='raven',swallow=p.patch==='swallow',corvid=raven||p.patch==='crow';
 let tail=p.tail==='fork'?P('M0 0L-57-1L-25 10L-53 35L7 12Z',p.back):p.tail==='wedge'?P('M0-4L-45 12L-61 27L-24 29L9 12Z',p.wing):P(`M0-2L-${p.tail==='short'?23:42} 11L-${p.tail==='short'?26:47} 23L8 14Z`,p.wing);
 let a=joint('tail',91,101,tail,3);
 a+=joint('wing',133,89,P('M0 1Q-3-36 34-61L31-36L42-43L33-21L39-23Q23 6 0 1Z',p.wing),26,Math.PI);
 a+=E(128,98,corvid?48:40,swallow?20:27,p.back)+E(141,107,corvid?35:31,swallow?13:19,p.belly);
 a+=P('M145 89Q148 73 158 69L177 70L179 97L153 113Z',p.head)+E(172,75,corvid?24:21,corvid?21:20,p.head);
 if(p.patch==='sparrow')a+=E(177,83,13,9,'#e5ddcc')+P('M160 61Q173 51 186 65L178 68L161 66Z','#9b9d95')+P('M175 88L176 105L162 102L159 90Z','#443e35');
 if(p.patch==='quelea')a+=P('M178 62Q193 67 190 85L181 94L169 89L171 71Z','#3c3932');
 if(p.patch==='swallow')a+=P('M176 82L191 81Q189 99 169 101L159 94Z','#ba795c')+P('M176 59L187 63L187 70L177 68Z','#b87b5c');
 if(p.patch==='robin')a+=P('M158 89Q169 86 183 91L177 103L165 105Z','#e4dfcf')+L('M167 91l-2 7M173 91l-2 8M179 92l-2 6','#5e625d',1.5);
 if(p.patch==='blueTit')a+=E(176,79,17,13,'#eee9d8')+P('M159 65Q173 53 189 67L185 72L161 69Z','#5487ac')+L('M159 76L187 80','#354b59',4)+L('M165 89Q177 99 186 89','#445966',3);
 if(p.patch==='greatTit')a+=E(180,79,12,9,'#eee9dc')+P('M170 91L155 121L147 121L159 94Z','#38403b');
 if(p.patch==='chaffinch')a+=E(179,84,15,13,'#c59178');
 if(p.patch==='finch')a+=E(171,87,17,16,'#b96f64')+P('M159 93Q171 105 165 115L146 118L145 102Z','#bb7666')+L('M139 109l-2 9M148 114l-1 7M129 110l-2 7','#9d866d',1.4);
 if(raven)a+=P('M161 90L155 112L165 107L169 115L174 104L181 102Z','#303a3f');
 const billX=corvid?194:190,billLength=raven?29:corvid?21:p.patch==='finch'||p.patch==='quelea'?15:p.patch==='blueTit'||p.patch==='greatTit'?10:17;
 a+=P(`M${billX-4} 72Q${billX+10} 69 ${billX+billLength} 79L${billX-3} 84Z`,p.bill);
 a+=eye(181,75,p.patch==='blackbird'?'#d6a940':null);
 let wing=P(`M0 0Q-25-44 -${swallow?84:70}-41L-57-18L-67-13L-48-4L-55 3Q-25 17 0 0Z`,p.wing);
 wing+=L('M-4 3Q-24 3-45-8M-14-8L-49-25',corvid?'#4c575c':'#c6b797',1.4);
 if(['sparrow','chaffinch','blueTit','greatTit'].includes(p.patch))wing+=L('M-10-6L-37-16M-18 2L-42-8','#e5e1cc',4);
 if(p.patch==='starling')wing+=marks([[-8,-4],[-19,-9],[-31,-16],[-41,-22],[-25,0]],'#d9ccae',1.6,1.1);
 if(p.patch==='quelea'||p.patch==='sparrow'||p.patch==='finch')wing+=L('M-11-16L-28-25M-15-9L-34-20M-23-3L-44-13','#594e3e',2);
 a+=joint('wing',142,91,wing,29);
 // Tucked flight feet have independent anchors and only a tiny adjustment.
 a+=joint('leg',142,117,L('M0 0l-9 5l9 2',corvid?'#343b3b':'#8d7861',2.2),2,Math.PI)+joint('leg',155,117,L('M0 0l-8 4l9 2',corvid?'#343b3b':'#8d7861',2.2),2);
 if(p.patch==='starling')a+=marks([[147,104],[155,107],[166,94],[162,64],[152,113]],'#e3d6bd',1.2,1.3);
 return a;
}
function dove(p){
 const pigeon=p.patch==='pigeon';
 let a=joint('tail',87,108,P(pigeon?'M0-4L-32 10L-34 21L5 18Z':'M0-5L-52 33L-37 32L7 13Z',pigeon?'#697882':'#84796d'),3);
 a+=foot(121,122,23,'#b9897c',Math.PI)+foot(143,122,23,'#c39586',0);
 a+=E(128,101,45,29,p.back)+E(150,112,29,18,p.belly)+P('M146 100L151 65Q169 58 179 75L175 113Z',p.head)+E(169,66,19,17,p.head);
 if(pigeon)a+=P('M153 80Q170 87 177 82L176 99Q162 106 151 97Z','#568879')+P('M153 95Q167 100 175 96L174 105L155 108Z','#867a91');
 let wing=P('M0 0Q-36-13-52 11Q-42 34-3 24L13 6Z',p.wing);
 wing+=pigeon?L('M-35 4L-22 27M-21 0L-8 25','#4c5860',5):marks([[-34,12],[-25,17],[-15,10],[-40,6]],'#615e54',3,2);
 a+=joint('wing',142,90,wing,2)+P('M184 65L200 70L183 74Z',p.bill)+eye(174,64,pigeon?'#c29968':null);
 if(pigeon)a+=E(185,67,5,3,'#eee6d5');else a+=E(168,82,2,3,'#5f615c');
 return a;
}
function gull(p){
 let a=joint('tail',86,101,P('M0-3L-39 6L-35 20L5 14Z','#e9ece4'),3);
 a+=joint('wing',138,91,P('M0 0Q10-35 51-55L45-30L39-10L17 4Z',p.wing)+P('M34-43L51-55L45-30L39-10L33-12Z','#414d53'),22,Math.PI);
 a+=E(127,100,50,22,p.belly)+P('M149 93Q165 64 182 67L192 90L165 109Z',p.belly)+E(183,73,21,18,p.head);
 a+=P('M200 70L232 76Q226 83 200 80Z',p.bill);
 if(p.patch==='herring')a+=E(221,80,3,2,'#ba6b58');
 a+=eye(189,72,p.patch==='laughing'?'#e9e5d8':'#c9b97c');
 const wing=P('M0 0Q-29-43-95-45L-77-27L-83-22L-61-9L-67-4Q-32 16 0 0Z',p.wing)+P('M-68-39L-95-45L-77-27L-83-22L-61-9L-63-24Z','#3a4650')+marks([[-77,-32],[-70,-23]],'#e7e8df',2.4,1.8);
 a+=joint('wing',144,91,wing,24)+joint('leg',145,118,L('M0 0l-8 6l14 1',p.patch==='herring'?'#caa89f':'#935c57',2.6),2,Math.PI)+joint('leg',161,116,L('M0 0l-7 6l12 2',p.patch==='herring'?'#caa89f':'#935c57',2.6),2);
 return a;
}
function falcon(p){
 const american=p.patch==='american';
 let a=joint('tail',88,104,P('M0-4L-46 15L-41 31L9 12Z',american?'#b9835c':'#8d999d')+L('M-35 11L-31 28','#3d4341',6),5);
 a+=joint('wing',140,88,P('M0 0Q9-33 43-54L35-24L20 0Z',p.wing)+L('M27-29L38-33M18-16L33-21','#5d635d',2),24,Math.PI);
 a+=E(127,100,42,24,p.back)+E(144,109,29,19,p.belly)+E(172,75,24,21,p.head);
 a+=P('M163 80Q182 74 189 91L178 105L158 98Z','#e8d6b9')+P('M186 72L197 74L198 81L191 87L191 79L185 79Z','#4c514a')+E(186,74,5,4,'#c7a956');
 a+=L('M178 79L175 95','#3d4544',4)+(american?L('M162 78L158 92','#3d4544',4):'')+eye(180,73);
 let wing=P('M0 0Q-26-43-80-44L-58-20L-67-16L-46-3L-48 4Q-21 17 0 0Z',p.wing)+L('M-17-11L-28-22M-31-19L-42-29M-42-5L-51-13','#474e4c',2.5);
 a+=joint('wing',141,91,wing,28)+marks([[136,108],[145,113],[155,108],[146,121],[130,115]],'#776d59',1.4,2)+joint('leg',143,122,L('M0 0l-5 7l10-2','#c5a450',2.7),2,Math.PI)+joint('leg',155,119,L('M0 0l-5 8l10-2','#c5a450',2.7),2);
 return a;
}
function waterfowl(p){
 const goose=['embden','canada'].includes(p.patch),canada=p.patch==='canada',mallard=p.patch==='mallard';
 const body=canada?'#9d9582':mallard?'#a7aaa0':'#eee9d9',head=canada?'#303b3c':mallard?'#47745e':'#f3eddd',wing=canada?'#887f6a':mallard?'#929b94':'#d7d5c7';
 let a=foot(117,122,22,canada?'#535650':'#d09a59',Math.PI,true,10)+foot(148,123,21,canada?'#444d47':'#dca766',0,true,10);
 a+=joint('tail',82,109,P('M0-6L-24-12L-12 8L7 13Z',body),3)+E(124,104,51,28,body);
 const neck=goose?'M155 100Q175 91 163 59Q154 38 174 30L186 41Q176 53 184 75Q188 103 164 119Z':'M152 104Q160 92 158 77Q157 64 174 61L185 71Q184 90 175 110Z';
 a+=P(neck,head)+E(goose?177:177,goose?34:65,goose?17:20,goose?13:17,head);
 if(canada)a+=P('M177 33Q190 39 186 47L177 53L169 48L169 42Z','#e8e4d2');
 if(mallard)a+=L('M159 87Q170 94 181 88','#e6e6d8',4)+P('M155 95Q173 93 176 108L159 124L147 117Z','#8c6656');
 let w=P('M0 0Q-32-12-47 9Q-37 29-1 25L16 10Z',wing)+L('M-32 8L-12 18M-23 2L1 12',canada?'#c1b7a0':'#e1dfd0',1.8);
 if(mallard)w+=P('M-29 13L-8 20L3 14L-20 8Z','#626eab')+L('M-28 12L-8 19M-21 7L2 13','#e6e4d7',2.4);
 a+=joint('wing',137,93,w,2);
 const hy=goose?35:66;
 const bill=goose?`M188 ${hy-4}L204 ${hy-1}Q216 ${hy+3} 214 ${hy+7}L208 ${hy+11}L188 ${hy+8}Z`:`M188 ${hy-4}L207 ${hy-2}Q219 ${hy-1} 220 ${hy+5}Q219 ${hy+12} 208 ${hy+12}L188 ${hy+9}Z`;
 a+=P(bill,canada?'#3f4947':mallard?'#ceba68':'#dfa75f')+L(`M190 ${hy+5}L212 ${hy+6}`,canada?'#727770':'#b8874c',1)+E(199,hy+1,1.8,1.1,canada?'#889189':'#9e814b')+eye(182,hy-3,p.patch==='embden'?'#8cabb5':null);
 return a;
}
function fowl(p){
 const type=p.patch;let a='';
 if(type==='peacock'){
  a+=joint('tail',111,112,P('M0-14Q-52-43-102-19Q-77 18-9 26L12 9Z','#5c8f75')+P('M-7-9Q-58-28-93-13M-4 0Q-47-8-79 0M-1 10Q-33 10-61 12','none','stroke="#85ac79" stroke-width="3"')+[-75,-55,-35].map((x,i)=>E(x,-10+i*7,8,6,'#a6aa5c')+E(x,-10+i*7,4.7,4,'#467f85')+E(x,-10+i*7,2.4,2.8,'#2f4d6d')).join(''),3);
  a+=foot(124,117,27,'#86867b',Math.PI)+foot(147,117,27,'#96968b');
  a+=E(135,101,35,25,'#829270')+P('M150 103Q158 82 158 54Q156 35 173 36L184 47Q174 57 179 79Q181 102 159 119Z','#3d7190')+E(174,39,14,12,'#3c7091');
  a+=joint('wing',146,91,P('M0 0Q-31-10-40 14Q-20 35 7 22Z','#9c8d73')+L('M-24 8L-5 21M-15 4L4 17','#c5ba96',3),2);
  a+=P('M185 38L202 43L185 47Z','#9a987d')+eye(179,37)+P('M175 42L185 39L180 46L173 47Z','#ece8d4')+L('M171 29L163 16M174 29L174 13M178 30L184 17','#3b5c68',1.5)+E(163,15,3,4,'#48868c')+E(174,12,3,4,'#48868c')+E(184,16,3,4,'#48868c');
  return a;
 }
 if(type==='turkey'){
  a+=joint('tail',101,107,P('M0 17Q-53 5-54-36Q-38-64-10-48Q18-41 15-9Z','#8d7356')+L('M-39-35L3 13M-27-44L6 10M-11-43L10 7','#b9a786',8)+L('M-50-30Q-32-58-9-42','#d6c3a0',5),3);
  a+=foot(118,121,23,'#aa8372',Math.PI)+foot(145,121,23,'#bb9280');
  a+=E(131,103,47,31,'#6d6252')+joint('wing',143,88,P('M0 0Q-44-8-45 18Q-20 35 10 22Z','#8c7b61')+L('M-34 8L-23 28M-20 5L-8 28M-6 6L5 23','#b6aa8e',4),3);
  a+=P('M157 106Q168 84 162 66L171 49L183 54Q177 70 181 84L174 109Z','#ad6c61')+E(175,52,13,14,'#8aa1a2')+P('M183 50L202 57L185 61Z','#c8b68b')+L('M183 57Q189 76 182 80','#b7685d',5)+eye(180,50)+L('M157 99L155 118','#393c32',5);
  return a;
 }
 const pheasant=type==='pheasant',body=pheasant?'#b28a57':'#d7bb82';
 a+=joint('tail',91,107,P(pheasant?'M0-8L-79-35L-69-20L5 19Z':'M0-7Q-29-34-38-27L-29-6L-40-10L-23 12L5 20Z',pheasant?'#a38358':'#86664a')+(pheasant?L('M-57-22L-59-13M-41-17L-43-5M-25-10L-27 3','#5b5545',2.5):''),4);
 a+=foot(119,119,25,'#c6a35e',Math.PI)+foot(145,119,25,'#d3b36d');
 a+=E(130,102,43,31,body)+P('M149 99Q151 79 158 65L178 64L184 93L166 117Z',pheasant?'#668473':'#e0c78f')+E(175,62,17,18,pheasant?'#477967':'#e4ce9b');
 let w=P('M0 0Q-37-10-44 16Q-23 34 11 20Z',pheasant?'#ac8b64':'#c1a26a')+L('M-29 9L-12 23M-17 4L0 20','#e0c599',2.5);
 if(pheasant)w+=marks([[-29,5],[-16,11],[-31,18],[-2,12]],'#5f604d',2,1.4);
 a+=joint('wing',145,91,w,3)+P('M189 61L206 67L187 72Z','#c6ab6a')+eye(180,61);
 if(pheasant)a+=P('M171 53Q188 47 189 60L187 70L178 72L176 65Z','#b45a4c')+eye(182,60)+L('M157 78Q171 86 184 77','#eee9d8',4);
 else a+=P('M163 46L164 37L170 41L175 32L180 42L187 38L190 49Z','#bb6450')+E(188,80,5,9,'#c57358');
 return a;
}
function wader(p){
 const type=p.patch,flamingo=type==='flamingo',heron=type==='heron',egret=type==='egret',red=type==='redcrown';
 const body=flamingo?'#e7b4b2':heron?'#93a6b0':egret||red?'#edeadd':'#a6a8a0',leg=flamingo?'#cb9292':egret?'#796c4f':'#777e76';
 let a=foot(120,97,47,leg,Math.PI,false,7)+foot(143,98,46,leg,0,false,7);
 a+=joint('tail',89,86,P('M0-1L-29 12L-8 18L10 13Z',heron?'#758b98':body),2)+E(124,85,40,23,body);
 const neck=flamingo?'M149 86Q180 71 165 49Q145 21 172 17Q192 16 193 35':'M151 87Q172 73 159 57Q146 40 166 27L184 24';
 a+=L(neck,body,flamingo?11:egret?12:13);
 if(red)a+=L('M151 85Q170 72 159 57Q147 42 166 29L183 26','#3a4749',8);
 if(heron)a+=L('M158 79Q167 66 155 54Q151 43 167 33','#d3d0bc',6);
 const hx=flamingo?194:185,hy=flamingo?36:24;
 a+=E(hx,hy,flamingo?12:15,flamingo?11:12,body);
 if(flamingo)a+=P('M202 38L219 43L216 55Q211 60 207 52L204 46Z','#e8c1b5')+P('M216 47L216 55Q211 60 207 52L209 47Z','#414949');
 else a+=P(`M${hx+12} ${hy-2}L${hx+(heron?50:egret?36:40)} ${hy+4}L${hx+11} ${hy+6}Z`,red?'#7c8b75':'#c8ad69');
 if(heron)a+=L('M172 18L184 15L190 17','#3e515d',4)+P('M177 17L160 24L157 27L170 25Z','#40505b');
 if(red||type==='sandhill')a+=P(`M174 16Q184 9 195 17L191 22L178 21Z`,'#bd6255');
 if(red)a+=P('M174 23L184 21L186 27L171 37L166 32Z','#f3efdf');
 let w=P('M0 0Q-31-13-45 5Q-38 23-3 27L12 13Z',flamingo?'#d89a9d':heron?'#7f96a3':egret?'#e0ddce':red?'#e5e3d8':'#94988e');
 if(flamingo||red)w+=P('M-36 11L-23 24L-3 27L8 18L-14 16Z',flamingo?'#546267':'#344346');
 if(type==='sandhill')w+=P('M-30 11L-20 29L-7 25L0 30L6 20Z','#7e847a');
 if(egret)a+=L('M170 23L181 18','#c7a777',4)+L('M159 58L162 72','#cfb88a',5);
 a+=joint('wing',137,72,w,2)+eye(hx+4,hy-2,flamingo?'#d9be69':null);
 return a;
}
function ratite(p){
 const emu=p.patch==='emu',body=emu?'#8c8067':'#3e4547';
 let a=foot(119,99,44,emu?'#8e826c':'#b5a08a',Math.PI,false,14,emu?3:2)+foot(146,99,44,emu?'#9b8c72':'#c7b29b',0,false,14,emu?3:2);
 a+=E(126,83,50,32,body)+P('M152 81Q171 66 165 40Q160 21 177 15L187 24Q178 35 183 55Q190 78 165 96Z',emu?'#7b8274':'#c4b2a1')+E(182,20,15,12,emu?'#65796e':'#c7b6a6');
 if(emu){
  for(let i=0;i<14;i++){const x=87+i*5;a+=L(`M${x} ${69+(i%3)*5}l-6 24`,i%2?'#b19d78':'#635e50',2.6);}
  a+=L('M168 40L179 40','#789289',8)+joint('wing',148,75,P('M0 0L-12 16L3 22L9 11Z','#8b7c62'),2);
 }else a+=joint('wing',144,68,P('M0 0Q-31-11-42 16L-31 23L-25 19L-20 26L-12 23L-5 28Q8 17 11 9Z','#e6e0d0'),3)+joint('tail',83,78,P('M0 0Q-16-12-25-1L-20 9L-28 12L-9 20Z','#e5dfce'),4);
 a+=P('M194 18L211 24L194 28Z',emu?'#4b514c':'#ad947b')+eye(187,19);
 if(!emu)a+=L('M184 15l-2-3M189 15l1-3','#514e43',1.2);
 return a;
}
function penguin(p){
 const king=p.patch==='king',puffin=p.patch==='puffin',y=king?84:93;
 let a=foot(123,132,12,puffin?'#cb8952':'#aa8a74',Math.PI,true,7)+foot(149,132,12,puffin?'#dc9b5b':'#b59a81',0,true,7);
 a+=joint('tail',105,120,P('M0 0L-16 20L11 17Z','#3c494c'),4)+E(135,y,king?29:33,king?59:48,'#3c4b51')+E(145,y+11,king?20:24,king?46:35,'#e9e6d6');
 a+=E(146,king?34:55,king?20:puffin?27:23,king?23:puffin?25:23,'#36464b');
 if(puffin){
  a+=P('M144 38Q172 32 173 61Q166 79 147 72L139 57Z','#e5e2d5')+P('M166 50L202 58L176 75L164 68Z','#d18c4e')+P('M184 55L202 58L187 68L182 67Z','#bd6549')+P('M166 50L176 53L174 71L164 68Z','#9daba6')+L('M181 55L179 68','#eee0ac',1.8)+eye(160,51,'#bc715a')+L('M157 56L158 64','#3a4546',1.5);
 }else{
  a+=P(`M161 ${king?33:53}L${king?193:182} ${king?38:58}L163 ${king?43:64}Z`,'#343e41');
  if(king)a+=P('M162 40L189 38L170 44Z','#cc8962')+P('M144 48Q149 40 157 45L157 57L145 68L141 60Z','#dfae69')+P('M145 69Q161 63 163 79L151 88L141 83Z','#e7c789');
  a+=eye(157,king?34:52,king?null:'#e9e8d9');
 }
 a+=joint('wing',116,king?66:79,P(king?'M0 0Q-17 23-11 62L-5 66L7 21Z':'M0 0Q-18 20-12 47L-5 49L8 17Z','#3b4a50'),puffin?9:6,Math.PI);
 a+=joint('wing',157,king?69:81,P(king?'M0 0Q17 17 19 53L12 56L-3 15Z':'M0 0Q17 16 19 40L11 43L-3 14Z','#536269'),puffin?9:6);
 return a;
}
const renderers={song,dove,gull,falcon,waterfowl,fowl,wader,ratite,penguin};
export function drawBird(s){const p=species[s.name];return p?renderers[p.family](p):null;}
