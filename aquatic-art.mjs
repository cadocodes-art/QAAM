// V1.3.1: reviewed aquatic silhouettes with locally anchored appendages.
const P=(d,c,extra='')=>`<path d="${d}" fill="${c}" ${extra}/>`;
const E=(x,y,rx,ry,c,extra='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}" ${extra}/>`;
const L=(d,c,w=2)=>P(d,'none',`stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`);
const eye=(x,y,r=2.7)=>E(x,y,r,r*1.12,'#263a37')+E(x+.6,y-.8,.85,.85,'#fff9e8');
const J=(type,x,y,shape,phase=0,swing=10)=>`<g data-anim="${type}" data-pivot="${x} ${y}" data-phase="${phase}" data-swing="${swing}" transform="translate(${x} ${y})">${shape}</g>`;
const spots=(points,c,r=2)=>points.map(([x,y])=>E(x,y,r,r*.8,c)).join('');
const toe=(x,y,c)=>L(`M${x} ${y}l-5 4m5-4l1 5m-1-5l6 3`,c,1.6);

const fishProfiles={
 'Atlantic Herring':{back:'#718d9b',body:'#c8d5d5',belly:'#edf0e7',height:21,tail:'#98b4be'},
 'Common Carp':{back:'#9c8755',body:'#c8ac71',belly:'#e0cfa0',height:31,tail:'#aa955f'},
 'Goldfish':{back:'#df8a37',body:'#edaa4b',belly:'#f8d480',height:27,tail:'#df9747'},
 'Atlantic Mackerel':{back:'#527e89',body:'#a7c2c5',belly:'#e3e9dd',height:22,tail:'#628b99'},
 'European Sardine':{back:'#6f9caa',body:'#c3d4d5',belly:'#e7eee9',height:20,tail:'#87a6b7'},
 'Anchovy':{back:'#7a9a9a',body:'#c7d5ce',belly:'#edf0dc',height:15,tail:'#9cbbb6'},
 'Rainbow Trout':{back:'#879578',body:'#b6be9d',belly:'#e1dfc5',height:25,tail:'#839c8d'},
 'Channel Catfish':{back:'#667d82',body:'#a0b2b1',belly:'#dbe0ce',height:25,tail:'#819795'}
};
function fish(s){
 const q=fishProfiles[s.name],h=q.height,n=s.name;
 let out=J('tail',71,94,P(n==='Goldfish'?'M3-8Q-20-37-41-28L-26 0L-43 27Q-16 37 5 7Z':'M5-7L-34-25L-23 0L-34 26L5 8Z',q.tail)+L('M-1 0L-26-15M-1 0L-28 15',q.body,1.5),0,9);
 const dorsal=n==='Common Carp'?'M93 73L103 44Q142 41 171 68Z':n==='Atlantic Mackerel'?'M104 73L117 49L136 72Z':n==='Goldfish'?'M101 72Q115 38 150 64L160 74Z':'M109 72L132 49L150 74Z';
 out+=P(dorsal,q.tail)+L('M121 68L129 55M133 68L137 58',q.back,1);
 out+=P(`M65 88Q91 ${90-h-7} 148 ${90-h}Q188 ${90-h} 213 87L226 94Q207 ${94+h} 161 ${94+h}Q110 ${99+h} 65 102Z`,q.body);
 out+=P(`M72 89Q101 ${90-h-4} 149 ${90-h}Q185 ${90-h} 212 86Q153 78 84 96Z`,q.back);
 out+=P(`M78 101Q143 109 216 98Q194 ${95+h} 149 ${94+h}Q108 ${97+h} 78 101Z`,q.belly);
 if(n==='Common Carp'){
  for(let y=83;y<=107;y+=9)for(let x=89;x<=167;x+=12)out+=L(`M${x} ${y}q8 5 0 10`,'#aa8d57',1.3);
  out+=L('M218 99q4 11 12 12M214 101q-4 11 0 15','#8b784e',2);
 }
 if(n==='Atlantic Mackerel'){
  for(let i=0;i<11;i++)out+=L(`M${91+i*8} ${76-Math.sin(i/10*Math.PI)*6}q-8 5-2 11q7 4 0 8`,'#3b6068',2);
  for(let i=0;i<4;i++)out+=P(`M${69+i*8} 88l4-7l5 6Z`,q.back);
 }
 if(n==='European Sardine')out+=spots([[162,86],[151,85],[139,85],[127,86],[115,87]],'#5b7f8b',2.3);
 if(n==='Anchovy')out+=L('M79 96Q145 89 206 92','#f8f7df',4)+L('M225 94L191 98','#647e7c',1.4);
 if(n==='Rainbow Trout'){
  out+=P('M76 95Q145 83 207 89L211 99Q143 100 77 101Z','#cd97a4');
  out+=spots([[87,85],[99,80],[111,76],[125,76],[143,76],[161,78],[177,83],[107,107],[124,110],[149,112],[175,109],[89,99],[142,94],[184,95],[158,101]],'#51655c',1.6);
  out+=P('M87 80Q87 66 98 72L103 80Z',q.back);
 }
 out+=L('M183 79Q177 94 187 109',q.back,2)+eye(n==='Anchovy'?205:203,87,n==='Atlantic Herring'?4:3.1);
 if(n!=='Anchovy')out+=L('M215 98L225 94',q.back,1.4);
 out+=J('fin',166,101,P('M0 0Q-9 9-26 12L-13-5Z',q.tail),.8,8);
 out+=J('fin',127,111,P('M0 0L-14 18L12 4Z',q.tail),2.3,7);
 if(n==='Channel Catfish'){
  out+=spots([[112,84],[126,91],[143,83],[155,101],[112,107]],'#596e70',2);
  out+=L('M218 98Q237 96 244 83M217 101Q238 110 242 121M208 102Q218 121 214 127M213 96Q228 80 231 75','#546f70',2.1);
 }
 return out;
}
function seadragon(){
 const leaf=(i,x,y,dx,dy)=>J('fin',x,y,L(`M0 0L${dx*.4} ${dy*.4}`,'#84975e',2)+P(`M${dx*.25} ${dy*.25}Q${dx-13} ${dy*.5} ${dx} ${dy}Q${dx+11} ${dy*.55} ${dx*.25} ${dy*.25}Z`,i%2?'#b6ba70':'#90a467'),i*.8,6);
 // Tail leaves inherit the tail transform before their own gentle leaf sway.
 let out=J('tail',117,102,L('M0 0Q-27 29-45 15Q-11 43-4 15','#a7aa67',10)+leaf(6,-25,14,-14,25)+leaf(7,-41,15,-18,-2),0,5);
 out+=P('M105 100Q104 71 132 65L145 38Q159 29 172 46L167 61L209 65L213 73L165 73Q158 75 157 96Q133 117 105 100Z','#b4b879');
 out+=L('M115 96Q118 75 143 70L155 46','#d5cf8b',3);
 const leaves=[[108,92,-20,-9],[118,74,-26,-22],[139,63,-12,-29],[152,44,4,-28],[158,91,21,21],[132,105,2,30]];
 for(let i=0;i<leaves.length;i++)out+=leaf(i,...leaves[i]);
 out+=eye(164,52,2.8)+L('M205 69h8','#7c8756',1.3);
 for(let i=0;i<5;i++)out+=L(`M${113+i*8} ${89-i*4}l6 7`,'#858d5b',1.2);
 return out;
}
function shark(s){
 const whale=s.name==='Whale Shark',c=whale?'#6f9298':'#8fa9b1',light=whale?'#c7d5cd':'#d9e3de';
 let out=J('tail',73,92,P('M4-7Q-15-18-36-47L-28-12L-19 1L-34 24Q-17 27 5 8Z',c),0,8);
 out+=P(whale?'M61 88Q100 58 168 64Q204 65 226 75Q239 88 230 104Q207 121 150 117Q105 115 61 103Z':'M63 87Q125 57 181 76L236 91Q205 105 161 112Q107 116 63 101Z',c);
 out+=P('M72 100Q135 104 231 95Q211 119 155 117Q104 114 72 100Z',light);
 out+=P('M114 73L135 33Q149 49 151 72Z',c)+P('M78 84L88 68L99 81Z',c);
 out+=J('fin',166,101,P(whale?'M0 0L30 36Q8 43-20 7Z':'M0 0L30 34Q8 34-20 6Z',c),.3,7);
 out+=J('fin',102,106,P('M0 0L-16 18L16 6Z',c),2,6);
 for(let i=0;i<5;i++)out+=L(`M${183-i*6} 87q-3 8 0 15`,whale?'#496e77':'#5f818d',1.7);
 if(whale){
  for(let y=74;y<=107;y+=10)for(let x=92;x<=208;x+=13)out+=E(x,y+(Math.floor(x/13)%2)*2,2,1.6,'#dce2c8');
  out+=L('M221 91l11 0','#3b6066',2.5)+eye(224,82,2.8);
 }else out+=P('M131 41L135 33L143 49Z','#4d666f')+P('M-1 0','none')+L('M219 98q-6 5-15 3','#5c7880',1.6)+eye(215,86,2.5);
 return out;
}
const dolphinProfiles={
 'Bottlenose Dolphin':{body:'#8daeb8',belly:'#d8e1db',beak:23,head:197,fin:'curved'},
 'Common Dolphin':{body:'#6b8997',belly:'#e2e0c3',beak:30,head:194,fin:'curved'},
 'Harbor Porpoise':{body:'#728d99',belly:'#d8e0da',beak:0,head:210,fin:'triangle'},
 'Vaquita':{body:'#8ba4ac',belly:'#d9e1d9',beak:0,head:211,fin:'triangle'},
 'Ganges River Dolphin':{body:'#ad9f8b',belly:'#d7c9af',beak:43,head:183,fin:'ridge'},
 'Beluga Whale':{body:'#e3e8df',belly:'#f3f1df',beak:8,head:207,fin:'none'},
 'Minke Whale':{body:'#738e98',belly:'#dfe6db',beak:0,head:224,fin:'back'},
 'Humpback Whale':{body:'#5d7b86',belly:'#c5d6cc',beak:0,head:223,fin:'low'},
 'Orca':{body:'#344e5b',belly:'#f0edda',beak:0,head:222,fin:'tall'}
};
function cetacean(s){
 const q=dolphinProfiles[s.name],n=s.name,large=['Minke Whale','Humpback Whale','Orca'].includes(n),c=q.body;
 // A banked view of the horizontal flukes, not a vertical fish tail.
 let out=J('tail',73,99,P('M4-5Q-16-18-42-13L-29-2L-47 9Q-20 19 3 5L12 2Z',c)+L('M-5 0L-33 6',q.belly,1),0,7);
 out+=P(large?'M63 93Q113 61 181 64Q217 65 240 85L238 98Q212 121 153 118Q103 116 63 105Z':`M65 93Q109 63 164 73Q${q.head-6} 61 ${q.head+13} 81Q${q.head+21} 93 ${q.head+8} 105Q155 125 109 112L65 104Z`,c);
 out+=P(large?'M76 104Q157 116 236 94Q213 121 153 118Q106 116 76 104Z':'M76 104Q145 108 207 98Q178 119 129 116Z',q.belly);
 if(q.fin==='curved')out+=P('M119 76Q125 50 146 46Q136 64 153 77Z',c);
 if(q.fin==='triangle')out+=P('M117 77L136 45L154 76Z',c);
 if(q.fin==='ridge')out+=P('M112 78Q128 68 146 78Z',c);
 if(q.fin==='back')out+=P('M96 79Q100 55 118 55L116 75Z',c);
 if(q.fin==='low')out+=P('M100 76Q109 57 126 72L140 76Z',c);
 if(q.fin==='tall')out+=P('M112 73L143 25Q157 45 150 72Z',c);
 if(q.beak){out+=P(`M${q.head+8} 87Q${q.head+q.beak+16} 85 ${q.head+q.beak+16} 94Q${q.head+q.beak+8} 101 ${q.head+5} 99Z`,c);}
 if(n==='Beluga Whale')out+=E(209,78,18,17,c)+L('M129 75Q150 70 168 76','#cbd6ce',2);
 if(n==='Common Dolphin')out+=P('M192 86Q169 85 147 99L99 87Q113 112 147 111L179 101Z','#d9c687');
 if(n==='Orca')out+=E(198,81,15,7,'#f5f0db')+P('M116 78Q99 64 90 84L105 88Z','#a6b6b4')+P('M162 106Q180 94 186 105L181 117L151 118Z','#f3f0de');
 const flipper= n==='Humpback Whale'?'M0 0Q12 7 44 44Q34 53 21 42L-12 2Z':n==='Ganges River Dolphin'?'M0 0Q31 10 31 30Q12 38-14 2Z':'M0 0Q15 11 27 27Q14 32-13 4Z';
 out+=J('flipper',167,104,P(flipper,n==='Humpback Whale'?'#dfe6d8':c)+(n==='Minke Whale'?P('M5 5L16 13L10 20L0 10Z','#f4f0db'):''),1.1,8);
 if(n==='Humpback Whale'){
  out+=spots([[212,77],[226,79],[237,86],[217,97],[229,96]],'#8da6aa',2.4);
  out+=L('M185 108Q210 112 232 99M182 112Q210 115 230 104','#94b0b3',1.4);
 }
 const ex=large?222:q.head+6;
 if(n==='Vaquita')out+=E(ex,87,7,8,'#435b63')+E(ex+1,87,3.8,4.5,q.belly)+L('M218 102Q207 107 198 102','#475d64',2.6);
 out+=eye(ex,87,n==='Ganges River Dolphin'?1.8:2.7);
 if(n!=='Vaquita')out+=L(large?'M238 94Q220 101 204 98':`M${q.head+10+q.beak} 97Q${q.head+11} 104 ${q.head-4} 99`,n==='Beluga Whale'?'#8ea39f':'#516c71',1.5);
 out+=L(large?'M204 69l5 0':`M${q.head-8} 72l5 0`,n==='Beluga Whale'?'#a8b7ac':'#55717a',1.6);
 return out;
}
function seal(s){
 const n=s.name,ear=['Northern Fur Seal','California Sea Lion'].includes(n),gray=n==='Gray Seal';
 const palette={ 'Harp Seal':['#ced6cf','#e4e6d9'],'Harbor Seal':['#aabbb9','#dae0d3'],'Gray Seal':['#859b9e','#bcc9c5'],'Northern Fur Seal':['#645d53','#aca38c'],'California Sea Lion':['#aa8d69','#cbb18b'],'Hawaiian Monk Seal':['#9dada9','#ded9bf'],'Walrus':['#b2957e','#c8b09b']};
 const[c,light]=palette[n];let out='';
 // Hind feet are overlapping webbed paddles, not the two lobes of a fish tail.
 out+=J('flipper',79,102,P('M5-5Q-13-8-24-1Q-34 6-41 16Q-43 22-37 23Q-40 29-34 29Q-32 35-27 31Q-20 34-16 28Q-3 17 8 4Z',c)+L('M-29 23Q-22 14-10 8M-35 21Q-27 11-16 6M-23 28Q-17 19-4 12',light,1.3),Math.PI,7);
 out+=J('tail',77,107,P('M0-5Q-18-10-23-2Q-15 5 2 5Z',c),0,5);
 out+=J('flipper',82,111,P('M3-7Q-10-3-20 7Q-30 16-34 28Q-35 34-29 34Q-28 41-23 38Q-19 44-14 37Q-8 39-5 32Q1 23 12 7Z',c)+L('M-27 29Q-19 16-8 11M-21 34Q-13 22-2 15M-14 33Q-7 26 2 22',light,1.4),0,7);
 out+=P(`M69 102Q92 76 135 81Q166 83 179 ${ear?66:82}Q202 ${ear?47:62} 224 80L234 96Q232 112 209 113Q178 128 126 122Q86 120 69 102Z`,c);
 out+=P('M85 110Q139 124 196 106Q215 99 229 104Q212 126 151 125Q110 123 85 110Z',light);
 if(gray)out+=P('M193 74Q214 67 231 83L237 99L219 102L204 91Z',c);
 if(n==='Harp Seal')out+=P('M101 88Q133 73 158 88L169 113Q153 122 135 109Q111 119 91 105Z','#58635f');
 if(n==='Harbor Seal'||gray)out+=spots([[104,93],[117,88],[129,99],[146,91],[158,105],[103,110],[183,92],[194,80],[201,104],[174,113],[142,112]],gray?'#607a7e':'#718d8d',2.5);
 out+=J('flipper',173,106,P(ear?'M0-3Q20 12 30 39Q10 42-12 7Z':'M0-3Q19 9 22 24Q4 29-13 7Z',c),.7,13);
 if(ear)out+=P('M185 79Q176 64 181 57Q189 55 193 76Z',c)+P('M185 73Q181 62 184 61L189 74Z','#5e5143');
 const noseX=gray?232:228;
 out+=E(noseX,94,5,3.3,'#4d5852')+eye(gray?216:214,85,3);
 out+=L(`M${noseX-3} 101Q${noseX-12} 107 ${noseX-20} 102`,'#65736b',1.2);
 out+=L(`M${noseX-2} 99l19-6M${noseX-2} 102l20 2M${noseX-5} 105l15 8`,light,1.3);
 if(n==='Walrus'){
  out+=E(219,98,17,10,'#c7b09a');
  out+=P('M211 102L210 139Q213 147 217 135L220 104Z','#f5e9c6')+P('M227 101L228 136Q232 143 234 131L234 100Z','#fff0cc');
  for(let i=0;i<5;i++)out+=L(`M${207+i*5} 97l${(i-2)*2} 13`,'#ece0c4',1.2);
 }
 return out;
}
function otter(){
 let out=J('tail',83,106,P('M6-5Q-28-5-55 12Q-26 17 9 5Z','#806747'),0,7);
 out+=J('flipper',94,108,P('M0 0Q-12 21-30 20L-21 4Z','#6a5741'),0,12);
 out+=E(137,98,55,27,'#8e7454')+P('M96 88Q133 72 175 91L178 102Q133 112 100 105Z','#b59d78');
 out+=E(194,83,25,24,'#b49d79')+E(181,63,7,7,'#8a7257')+E(206,63,6,6,'#8a7257');
 out+=E(209,93,14,9,'#d3c4a3')+E(216,90,4,3,'#463e33')+eye(204,79,3);
 out+=J('flipper',172,97,P('M0 0Q4-21-10-26Q-22-26-14-11L-6 4Z','#856c4e'),0,7);
 out+=J('flipper',153,99,P('M0 0Q3-16-7-24Q-18-22-14-9L-8 5Z','#9f8765'),Math.PI,7);
 out+=L('M210 96l22-3M211 99l21 5M207 103l16 9','#eee3c6',1.3);
 return out;
}
function platypus(){
 let out=J('tail',86,103,P('M4-9Q-24-23-52-6Q-69 14-41 21Q-14 23 5 8Z','#6d5b46')+L('M-44 0Q-22-8-2 0M-40 9Q-22 2-1 7','#927b58',1.8),0,7);
 const foot=(x,y,phase,c)=>J('flipper',x,y,P('M0 0L-12 11L-19 21L-5 17L4 24L10 15L18 14L5-2Z',c),phase,14);
 out+=foot(106,91,Math.PI,'#665841')+foot(171,89,0,'#776447');
 out+=E(132,99,51,27,'#94774f')+E(179,91,27,19,'#9e8057');
 out+=P('M185 86Q217 76 235 89Q246 101 231 108Q206 115 187 103Z','#7f8171');
 out+=E(229,95,1.9,1.4,'#3b4d44')+eye(183,85,2.8);
 out+=foot(106,109,0,'#786347')+foot(171,106,Math.PI,'#8b7150');
 return out;
}
function manta(){
 let out=J('tail',99,94,L('M0 0Q-37 13-69 17','#567581',5),0,7);
 out+=J('fin',140,87,P('M-22 0Q-22-27 9-62Q27-41 40-6L13 13Z','#607f8a'),Math.PI,10);
 out+=P('M95 85Q119 62 163 75L207 86Q223 91 204 103L153 116Q123 116 95 99Z','#7795a0');
 out+=J('fin',143,98,P('M-22-5Q-6 15 8 51Q33 43 45 3L15-13Z','#698894'),0,10);
 out+=P('M179 84Q190 69 207 67Q198 84 207 89L198 94Z','#7795a0')+P('M184 104Q197 117 215 116Q204 105 206 98L197 96Z','#9fb9bb');
 out+=L('M204 89L207 99','#405e67',2.5)+eye(190,85,2.6);
 return out;
}
function turtle(s){
 const sea=s.name==='Green Sea Turtle',c=sea?'#a2ac71':'#7d9a5e';
 let out='';
 const flipper=(x,y,phase,near)=>J(sea?'flipper':'leg',x,y,sea?P(near?'M0 0Q18 14 43 17Q24 38 5 28L-8 4Z':'M0 0Q-13-22-25-24Q-24-3-5 7Z',c):P('M0 0L-3 22L9 25L15 20L9 0Z',c)+L('M3 23v4M8 23v4M13 21v4','#dddebd',1.2),phase,sea?15:12);
 out+=flipper(96,99,Math.PI,false)+flipper(165,99,0,false);
 out+=J('tail',88,115,P('M-2-5L-20 4L1 4Z',c),0,5)+E(192,103,26,17,c)+eye(205,99,3);
 if(!sea)out+=P('M187 98L198 93L200 99L188 104Z','#b75243')+L('M196 110L211 106M181 109L189 107','#d5d496',2);
 out+=E(130,99,53,36,sea?'#87935c':'#607a4b')+E(130,100,48,31,sea?'#a0a36a':'#8e9e5a');
 out+=P('M111 75L139 73L157 90L150 111L122 120L101 102Z',sea?'#8e915a':'#73864d');
 out+=L('M111 75L101 102L122 120L150 111L157 90L139 73L111 75M101 102L83 106M111 75L102 74M139 73L145 70M157 90L178 89M150 111L165 123M122 120L119 130',sea?'#697b4d':'#bfc68b',2);
 out+=flipper(101,115,0,true)+flipper(164,113,Math.PI,true);
 return out;
}
function frog(s){
 const toad=s.name==='Common Toad',bull=s.name==='American Bullfrog',c=toad?'#9e8c62':bull?'#77924d':'#a3a26a',shadow=toad?'#82724f':bull?'#5d783e':'#818653';
 let out=J('leg',102,111,P('M0 0Q-33-10-38 12L-16 25L4 20L-17 11L9 6Z',shadow)+toe(-17,25,shadow),Math.PI,12);
 out+=J('leg',173,111,P('M0 0L11 26L28 30L36 27L22 22L15-4Z',shadow)+toe(31,28,shadow),0,8);
 out+=E(130,111,toad?45:46,toad?29:25,c)+P('M143 93Q158 71 187 78L211 93Q221 106 208 119L170 123L145 114Z',c);
 out+=P('M157 109Q183 117 208 108L211 119Q190 134 162 120Z',toad?'#cebe91':'#d3d4a2');
 out+=J('leg',109,118,P('M0 0Q-24-15-36 4Q-46 13-30 20L7 27L30 25L37 20L9 17L-13 9L12 4Z',c)+L('M27 25l8 4m-5-6l11 1m-8-4l10-2',shadow,2)+(!toad&&!bull?L('M-15-7L-1-15M-19 1L-4-6',shadow,3):''),0,12);
 out+=J('leg',171,113,P('M0 0L3 26L17 32L25 29L12 23L12-4Z',c)+toe(21,29,shadow),Math.PI,9);
 out+=E(183,82,9,11,c)+E(201,89,8,10,c)+E(184,81,6,6,toad?'#ce9e50':'#b6bd66')+eye(185,81,3.7);
 out+=L('M208 107Q196 114 181 108',shadow,1.4);
 if(toad){out+=E(164,90,12,8,'#b2a076');out+=spots([[104,95],[119,91],[138,97],[99,109],[125,105],[145,114],[114,120],[159,102]],'#7f754f',2.5);}
 else if(bull)out+=E(166,91,10,11,'#8a9a5d')+E(166,91,6,7,'#657a42')+L('M153 88Q159 104 171 106','#516e3c',2);
 else out+=P('M165 85L180 84L174 100L157 98Z','#667043');
 return out;
}
function lizard(s){
 const n=s.name,anole=n==='Green Anole',wall=n==='Common Wall Lizard',komodo=n==='Komodo Dragon',monitor=n==='Asian Water Monitor';
 const c=anole?'#86aa60':wall?'#a49272':komodo?'#858b65':'#727c5c',dark=anole?'#557c43':wall?'#756b52':komodo?'#626e4b':'#4a5744',light=anole?'#bcca87':wall?'#c4b895':komodo?'#b0b48a':'#bbb98b';
 let out=J('tail',91,111,P(anole||wall?'M5-6Q-26-10-65 12Q-38 9 4 7Z':'M8-12Q-31-14-75 21Q-43 27-3 7L12 8Z',c),0,7);
 const limb=(x,y,phase,far=false)=>J('leg',x,y,P(komodo||monitor?'M0-5Q-16-4-23 11L-11 25L3 28L11 23L-7 14L12 7Z':'M0-3L-17 9L-12 25L4 27L9 24L-5 18L-7 10L9 4Z',far?dark:c)+L('M-4 25l-4 5M2 27l1 5M8 25l5 4',light,1.6),phase,komodo?9:13);
 out+=limb(103,103,Math.PI,true)+limb(174,104,0,true);
 out+=P(anole||wall?'M79 105Q109 86 151 99L176 84Q186 74 210 87L231 98L227 106L202 111L179 114Q135 128 83 117Z':'M77 107Q110 83 161 99L189 99Q201 85 223 97L244 110L239 120L205 121Q149 136 88 123Z',c);
 out+=P('M88 118Q139 129 194 109L227 106L231 112L205 120Q147 140 88 125Z',light);
 if(anole)out+=P('M180 108Q189 137 210 115L203 109Z','#d9907a');
 if(wall){out+=P('M88 106Q141 98 181 103L214 98L217 104L181 111Q139 108 90 113Z',dark);out+=spots([[103,98],[119,98],[135,100],[152,102],[173,98]],light,1.8);}
 if(monitor){for(let y=102;y<=118;y+=8)for(let x=97;x<=177;x+=12)out+=E(x,y+(x%3),2.5,1.9,'#c3bc78');}
 if(komodo){for(let y=101;y<=122;y+=7)for(let x=99;x<=193;x+=11)out+=E(x,y,1.3,1.3,dark);}
 out+=limb(105,119,0)+limb(176,116,Math.PI);
 out+=eye(anole||wall?208:227,anole||wall?92:104,2.7)+L(anole||wall?'M213 103L229 103':'M220 116L239 115',dark,1.3);
 if(komodo||monitor)out+=J('tongue',239,117,L('M0 0L12 2L18-2M12 2L18 6',komodo?'#d7b66e':'#a88175',1.6),0,0);
 return out;
}
function crocodilian(s){
 const alligator=s.name==='American Alligator',c=alligator?'#667b61':'#9a9b62',dark=alligator?'#435f4b':'#70794d',light=alligator?'#a5b48b':'#d0c896';
 const limb=(x,y,phase,far=false)=>J('leg',x,y,P('M0-3L-16 8L-9 23L10 27L16 22L3 16L1 1Z',far?dark:c)+L('M7 25l0 5M12 24l3 4M15 21l5 3',light,1.5),phase,9);
 let out=J('tail',88,112,P('M10-11Q-30-22-76 11Q-41 28 9 8Z',c)+L('M-62 10Q-25-3 1 0',dark,2),0,7);
 out+=limb(104,103,Math.PI,true)+limb(172,104,0,true);
 out+=P('M75 105Q111 89 167 101L193 96L215 103L247 108Q254 113 245 120L201 124Q145 135 82 122Z',c);
 out+=P(alligator?'M180 100Q199 86 220 101L244 106Q258 112 245 118L196 120Z':'M177 103Q192 85 210 102L249 111L245 118L195 121Z',c);
 out+=P('M84 121Q139 131 200 116L247 116L245 122L198 126Q143 140 84 126Z',light);
 for(let i=0;i<10;i++)out+=P(`M${90+i*9} ${103+(i%2)}l5-7l5 8Z`,dark);
 for(let i=0;i<14;i++)out+=E(95+(i%7)*14,113+Math.floor(i/7)*8,2,1.5,dark);
 out+=limb(105,119,0)+limb(176,118,Math.PI);
 out+=E(204,100,7,6,c)+eye(206,100,2.5)+E(242,109,1.7,1.3,dark)+L('M210 117L248 115',dark,1.5);
 if(!alligator)out+=P('M224 115l3 6l3-6Z','#f0e6bd');
 return out;
}
function snake(){
 let out=J('tail',109,117,P('M0-4Q-29-29-56-5Q-66 6-83 2Q-60 22-38 3Q-19-12 0 5Z','#70835b')+L('M-76 7Q-58 10-39-1Q-20-15 0 0','#c7bf77',2),0,5);
 out+=P('M96 111Q122 87 151 108Q171 126 190 104L208 94L224 101Q218 123 196 125Q174 144 149 123Q125 103 103 122Z','#73875d');
 out+=L('M102 116Q126 97 152 116Q177 135 200 112L213 103','#d6cd82',3.5);
 out+=P('M197 104Q212 86 230 96L243 105L238 116L219 118L202 115Z','#7d8f65')+eye(232,103,2.7)+L('M234 112h9','#4c6548',1.5);
 out+=J('tongue',242,111,L('M0 0L11 1L16-3M11 1L16 5','#b5796b',1.5),0,0);
 return out;
}
function octopus(){
 let out='';
 for(let i=0;i<8;i++){
  const x=107+i*7,side=i<4?-1:1,dx=(i<4?4-i:i-3)*13;
  const d=`M0 0Q${side*8} 16 ${side*dx} ${30-(i%3)*4}Q${side*(dx+18)} ${38-(i%2)*8} ${side*(dx+17)} ${20-(i%3)*4}`;
  let shape=L(d,i<4?'#a9654b':'#bc7957',11)+L(d,'#d59d79',4);
  for(let j=0;j<3;j++)shape+=E(side*(8+j*dx/4),13+j*5,2.1,2,'#eed1a5');
  out+=J('tentacle',x,102,shape,i*.7,7);
 }
 out+=P('M105 99Q85 76 101 50Q121 26 150 45Q177 63 154 102L146 115L116 115Z','#bd7e5b')+E(122,63,13,17,'#cf9570');
 out+=E(111,91,8,9,'#d8b78a')+eye(112,91,3.3)+E(148,94,7,9,'#d8b78a')+eye(149,94,3.1);
 return out;
}
function jelly(){
 let out='';
 for(let i=0;i<16;i++)out+=J('tentacle',87+i*6,89,L(`M0 0Q${i%2?6:-5} 10 0 ${15+(i%3)*4}`,'#d8d7dd',1.4),i*.4,5);
 for(let i=0;i<4;i++)out+=J('tentacle',113+i*13,85,P(`M-4 0Q${i%2?-11:9} 15-2 27Q12 36 0 56Q-10 32-6 26Q-15 12-4 0Z`,'#ccc5d7','opacity=".8"'),i*1.2,6);
 out+=`<g data-anim="bell" data-pivot="132 83" data-phase="0" data-swing="0" transform="translate(132 83)">`+P('M-49 6Q-55-37-24-50Q0-61 28-45Q57-26 48 6Q0 22-49 6Z','#d9dce3','opacity=".8"')+E(0,5,49,13,'#e7e7e4','opacity=".6"');
 for(const[x,y]of[[-12,-23],[11,-23],[-12,-7],[11,-7]])out+=P(`M${x-5} ${y+5}C${x-15} ${y-14} ${x+15} ${y-14} ${x+5} ${y+5}`,'none','stroke="#ad9cbd" stroke-width="3"');
 return out+'</g>';
}
function crab(){
 let out='';
 // Five pairs of appendages: one claw pair, three walking pairs and paddle pair.
 for(let side=0;side<2;side++)for(let i=0;i<4;i++){
  const sign=side?1:-1,x=side?165:103,y=87+i*7;
  let shape=L(`M0 0L${sign*(18+i*2)} ${7+i*2}L${sign*(29-i*3)} ${29-i*2}`,'#719ca8',5);
  if(i===3)shape+=E(sign*20,26,14,8,'#8eb6be',`transform="rotate(${sign*28} ${sign*20} 26)"`);
  out+=J('leg',x,y,shape,(i+side)%2*Math.PI,8);
 }
 for(let side=0;side<2;side++){
  const sign=side?1:-1;
  out+=J('flipper',side?165:103,82,L(`M0 0L${sign*28}-17L${sign*39}-37`,'#6398aa',7)+P(`M${sign*38}-28Q${sign*22}-34 ${sign*34}-54L${sign*40}-43L${sign*51}-54Q${sign*60}-34 ${sign*38}-28Z`,'#96b8be'),side*Math.PI,9);
 }
 out+=P('M84 94L100 84Q132 65 165 83L183 94L171 110Q135 123 97 109Z','#739b91');
 out+=P('M94 94Q133 74 173 95L162 105Q131 113 102 104Z','#9cb29d');
 out+=L('M118 82l-2-11M148 82l4-11','#6b928d',4)+eye(116,70,3)+eye(152,70,3);
 return out;
}
function krill(){
 let out='';
 out+=J('tail',88,100,P('M0 0L-24-13L-17 0L-31 9L-16 15L3 7Z','#d69b8a'),0,10);
 for(let i=0;i<6;i++){
  const x=91+i*13,y=97-Math.sin(i/5*Math.PI)*12;
  out+=E(x,y,11,13,i%2?'#d99d8f':'#e8b0a0')+L(`M${x+4} ${y-9}q6 10 0 19`,'#c88878',1.2);
 }
 out+=P('M157 75Q183 65 204 78L214 91L185 104L157 101Z','#deb2a1');
 for(let i=0;i<6;i++)out+=J('leg',166+i*5,98,L(`M0 0l-8 ${15+(i%2)*4}l12 11`,'#b98070',1.8),i*.8,13);
 for(let i=0;i<5;i++)out+=J('fin',104+i*11,108,L('M0 0l-5 12l9-2','#ce8d7a',2),i*.7,14);
 out+=E(209,78,5,6,'#3e4a42')+E(210,77,1.5,1.5,'#f1e7ce');
 out+=J('antenna',202,83,L('M0 0Q19-27 42-24M0 3Q22-14 49-4','#c48a78',1.5),0,4);
 out+=L('M205 87L231 86','#c68f7e',2);
 return out;
}
function copepod(){
 let out=J('tail',113,110,L('M0 0L-24 14L-32 23M-24 14L-37 14','#b59e89',3),0,8);
 out+=P('M104 109Q85 79 111 60Q137 49 160 76L151 111L129 124Z','#d5c4a8')+E(128,76,21,19,'#e2d5bb');
 for(let i=0;i<5;i++)out+=L(`M${109+i*2} ${91+i*5}q18 8 35-1`,'#baa98f',1.4);
 out+=eye(151,74,4);
 out+=J('antenna',149,70,L('M0 0L23-24L61-25M17-18L27-11M31-25L35-34M44-25L51-34','#ab9279',2),0,7);
 out+=J('antenna',146,77,L('M0 0L25 3L57 25M19 3L22 14M37 14L39 23','#baa18a',2),Math.PI,7);
 for(let i=0;i<5;i++)out+=J('leg',127+i*5,100,L('M0 0l14 15l12 2','#b89d7e',1.7),i*.8,12);
 return out;
}
function mussel(){
 return P('M83 121Q82 77 133 43Q159 30 178 51Q197 93 176 122Q136 136 83 121Z','#405d73')+
 P('M93 116Q100 80 139 51Q157 40 170 55Q183 89 170 113Q139 127 93 116Z','#5c7891')+
 L('M94 116Q116 92 153 48M101 122Q130 94 163 53M116 124Q145 98 173 66M130 126Q159 106 178 82','#90a8b3',1.5)+
 P('M83 121Q126 139 177 122L179 129Q125 145 82 128Z','#2c495c')+
 L('M89 127Q64 135 57 145M92 128Q74 140 72 151','#9d9477',2);
}

export function drawAquatic(s){
 if(s.name==='Nine-banded Armadillo')return null;
 if(fishProfiles[s.name])return fish(s);
 if(s.name==='Leafy Seadragon')return seadragon();
 if(s.kind==='shark')return shark(s);
 if(dolphinProfiles[s.name])return cetacean(s);
 if(s.name==='Sea Otter')return otter();
 if(s.name==='Platypus')return platypus();
 if(s.kind==='seal')return seal(s);
 if(s.kind==='ray')return manta();
 if(s.kind==='turtle')return turtle(s);
 if(s.kind==='frog')return frog(s);
 if(s.kind==='lizard'||s.kind==='dragon')return lizard(s);
 if(s.kind==='crocodile')return crocodilian(s);
 if(s.kind==='snake')return snake();
 if(s.kind==='octopus')return octopus();
 if(s.kind==='jelly')return jelly();
 if(s.kind==='crab')return crab();
 if(s.name==='Antarctic Krill')return krill();
 if(s.name==='Copepod')return copepod();
 if(s.kind==='shell')return mussel();
 return null;
}
