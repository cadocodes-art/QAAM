import {insectLegPose} from './insect-motion.mjs';

// Small, readable natural-history cues in the game's original flat cartoon style.
// Generic names depict a representative adult, rather than every species/sex.
const E=(x,y,rx,ry,c,extra='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}" ${extra}/>`;
const P=(d,c,extra='')=>`<path d="${d}" fill="${c}" ${extra}/>`;
const L=(d,c='#514b40',w=2,extra='')=>P(d,'none',`stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}`);
const eye=(x,y,r=3)=>E(x,y,r,r*1.08,'#28322e')+E(x+r*.25,y-r*.3,r*.26,r*.26,'#fff8e5');
const joint=(type,x,y,content,phase=0,swing=8,speed=1)=>`<g data-anim="${type}" data-pivot="${x} ${y}" data-phase="${phase}" data-swing="${swing}" data-speed="${speed}" transform="translate(${x} ${y})">${content}</g>`;
const antenna=(x,y,d,c,phase=0)=>joint('antenna',x,y,L(d,c,2.5),phase,5,.35);
const legPath=p=>`M0 0 L${p.kneeX.toFixed(3)} ${p.kneeY.toFixed(3)} L${p.footX.toFixed(3)} ${p.footY.toFixed(3)}`;
function ikLeg(x,y,restX,restY,color,phase=0,width=3,opacity=1){
 const distance=Math.hypot(restX,restY),spec={restX,restY,upper:distance*.61+3,lower:distance*.64+3,bend:restX<0?-1:1,offset:phase};
 return `<g data-insect-leg="" data-rest-x="${restX}" data-rest-y="${restY}" data-upper="${spec.upper}" data-lower="${spec.lower}" data-bend="${spec.bend}" data-offset="${phase}" transform="translate(${x} ${y})" opacity="${opacity}">${L(legPath(insectLegPose(spec,0,false)),color,width)}</g>`;
}
function sixLegs(color,x=129,y=111,short=false){
 let out='';for(let side=0;side<2;side++)for(let i=0;i<3;i++)out+=ikLeg(x+(i-1)*10,y+(side?1:-5),(i-1)*(short?13:24)+(side?3:-3),short?22:35+(side?0:5),color,((i+side)%2)*Math.PI,short?2.5:3,side?1:.67);return out;
}
function tuckedLegs(color,x=143,y=96,long=false){
 let out='';for(let side=0;side<2;side++)for(let i=0;i<3;i++){
  const spread=(i-1)*(long?27:12),len=long?33:11;
  out+=joint('leg',x+(i-1)*5,y+side*3,L(`M0 0 L${spread*.5} ${len*.5} l${spread*.5+6} ${len*.5}`,color,long?2:1.8),((i+side)%2)*Math.PI,long?3:2,.5);
 }return out;
}
function transparentWing(x,y,d,phase=0){
 return joint('wing',x,y,P(d,'#eaf4ef','fill-opacity=".78" stroke="#b9d3cd" stroke-width="1.2"')+L('M0 0L-29-24M-8-7L-13-24','#bad2c9',.9),phase,22,2.6);
}

const antProfiles={
 'Ant':['#67462f','#573b2c',1,23],
 'Pavement Ant':['#65503b','#493d31',2,21],
 'Carpenter Ant':['#393a31','#2e302c',1,27],
 'Fire Ant':['#a55332','#633d2a',2,23],
 'Wood Ant':['#9c5839','#40382e',1,25]
};
function ant(name){
 const [thorax,abdomen,nodes,headRadius]=antProfiles[name];let out=sixLegs(thorax,130,111);
 out+=E(78,108,31,23,abdomen)+E(70,99,18,6,'#fff1ca','opacity=".12"');
 out+=L('M99 110L120 108',thorax,7);
 for(let i=0;i<nodes;i++)out+=E(105+i*10,106,5,7,thorax);
 out+=P('M117 104Q119 88 137 94Q149 98 146 114L122 118Z',thorax);
 out+=E(163,102,headRadius,20,name==='Wood Ant'?'#40382e':thorax)+eye(175,96,3.3);
 out+=antenna(158,87,'M0 0L-4-19L12-29',thorax)+antenna(173,85,'M0 0L14-17L30-16',thorax,Math.PI);
 out+=L('M184 110l9 5-8 6M183 106l10 1-6 6',abdomen,2.8);
 if(name==='Pavement Ant')out+=L('M152 90l4 18M158 86l4 25M164 84l4 24','#b29d76',.8,'opacity=".4"');
 return out;
}
function termite(){
 let out=sixLegs('#c2a87b',134,112,true);
 out+=E(98,111,37,18,'#e2d5aa')+E(136,110,19,16,'#d6c293')+E(165,104,21,19,'#bf9e67');
 for(let i=0;i<6;i++)out+=L(`M${73+i*9} 99q-3 12 1 24`,'#c4b687',1);
 for(const [x,y,dx,dy]of [[163,87,18,-27],[177,93,33,-12]]){
  let beads=L(`M0 0L${dx} ${dy}`,'#a88758',1.5);
  for(let i=1;i<=7;i++)beads+=E(dx*i/7,dy*i/7,1.7,1.7,'#a88758');
  out+=joint('antenna',x,y,beads,x===163?0:Math.PI,4,.35);
 }
 out+=E(175,101,1.5,1.5,'#856c45')+L('M183 109l7 3-5 6','#98703e',2);
 return out;
}
function butterfly(name){
 const white=name==='Cabbage White Butterfly';
 const upper='M0 0C-8-21-5-49 16-61C39-75 57-57 46-30L7 7Z';
 const lower='M2 0C-25-18-59-8-57 19C-57 43-27 53-5 31L10 11Z';
 function wing(near){
  let w=P(upper,white?'#f7f3d9':'#343333','stroke="'+(white?'#a5ac91':'#252c2a')+'" stroke-width="1.3"')+P(lower,white?'#eee9c9':'#373633');
  if(white){
   w+=P('M16-61C38-74 53-60 49-45L34-43L25-51L13-52Z','#4f5550');
   w+=E(16,-24,5.2,6.5,'#444c43')+E(-2,15,3.6,4.3,'#59624f');
   w+=L('M-3 6L-35 26M-4 11L-15 39M9-8L26-43','#c9ceb3',1.1);
  }else{
   w+=P('M-3-28L42-39L39-24L1-14Z','#d76543');
   w+=P('M-55 20Q-51 43-27 43L-9 31L-15 24Q-34 38-49 16Z','#d76543');
   for(const [x,y,r] of [[27,-57,4],[38,-52,3],[37,-42,2.4],[16,-45,2.7]])w+=E(x,y,r,r*.8,'#f5ead3');
   for(const [x,y] of [[-44,29],[-33,35],[-22,33]])w+=E(x,y,2.3,2.4,'#383e36');
  }
  return near?w:`<g transform="translate(7 -7) scale(.86)">${w}</g>`;
 }
 let out=joint('flutter-wing',142,87,wing(false),Math.PI,9,.75);
 out+=tuckedLegs('#5a5142',141,96);
 out+=joint('flutter-wing',142,87,wing(true),0,10,.75);
 out+=E(123,99,24,5,white?'#72775a':'#343a31','transform="rotate(-22 123 99)"')+E(146,90,11,7,white?'#797956':'#343a31')+E(161,83,8,8,white?'#767953':'#353b31')+eye(165,81,2);
 out+=joint('antenna',159,77,L('M0 0Q4-17 15-20','#4d5747',2)+E(15,-20,2,2,'#4d5747'),0,4,.35);
 out+=joint('antenna',165,77,L('M0 0Q16-10 22-7','#4d5747',2)+E(22,-7,2,2,'#4d5747'),Math.PI,4,.35);
 return out;
}
function moth(){
 const wing=P('M0 0Q7-40 33-57L46-11L15 17Z','#a3947d')+P('M1 0Q-43-23-59 12L-14 36L13 15Z','#b9aa8d')+L('M13-32l17 8 10-3M-39 9l17 4 8 12','#6e6d5a',4)+E(23,-12,7,4,'#d7c8a9')+E(23,-12,3,2,'#676955');
 let out=joint('flutter-wing',140,87,`<g transform="translate(7 -8) scale(.9)">${wing}</g>`,Math.PI,6,1)+tuckedLegs('#69624e',139,101)+joint('flutter-wing',140,87,wing,0,7,1);
 out+=E(124,101,25,8,'#86765d','transform="rotate(-18 124 101)"')+E(146,91,12,10,'#9d8b6d')+E(160,86,9,9,'#8d7a5e')+eye(165,84,2.3);
 for(const [x,y,side] of [[157,79,-1],[163,79,1]]){
  let d='M0 0l'+(side*11)+'-23';for(let i=1;i<5;i++)d+=`M${side*i*2.2} ${-i*4.6}l${side*7} -1M${side*i*2.2} ${-i*4.6}l${-side*3} -5`;
  out+=antenna(x,y,d,'#6e654e',side);
 }return out;
}
function bee(name){
 const bumble=name==='Bumblebee',c=bumble?'#ddbe65':'#c6a352',dark='#454137';
 // Bees have a smaller hindwing linked to a larger forewing on each side.
 let out=transparentWing(132,83,'M0 0Q-57-14-43-40Q-19-53 7-8Z',Math.PI)
  +transparentWing(130,89,'M0 0Q-41-2-35-20Q-20-30 5-6Z',Math.PI)
  +transparentWing(143,84,'M0 0Q-13-57 16-50Q39-38 5 1Z')
  +transparentWing(139,90,'M0 0Q-5-35 16-31Q31-17 5 2Z');
 out+=tuckedLegs(dark,135,105);
 out+=E(108,99,bumble?32:35,bumble?25:19,c)+E(144,92,bumble?22:18,bumble?22:18,bumble?'#e1c36b':'#b89960');
 for(const x of bumble?[92,115]:[84,99,114])out+=P(`M${x} ${bumble?79:84}Q${x-7} 99 ${x} ${bumble?121:115}L${x+8} ${bumble?120:116}Q${x+1} 99 ${x+8} ${bumble?77:82}Z`,dark);
 out+=E(169,94,16,16,dark)+eye(176,91,3.2)+antenna(165,80,'M0 0l-2-15 9-8',dark)+antenna(175,81,'M0 0l12-11 9 0',dark,Math.PI);
 if(bumble)for(let i=0;i<12;i++){const a=i*Math.PI/6;out+=L(`M${144+Math.cos(a)*19} ${92+Math.sin(a)*19}l${Math.cos(a)*4} ${Math.sin(a)*4}`,'#d4b867',1.5);}
 return out;
}
function fly(name){
 const fruit=name==='Fruit Fly',c=fruit?'#bf955d':'#7f8883';
 let out=transparentWing(133,89,'M0 0Q-43-10-49-38Q-33-63 6-6Z',Math.PI)+transparentWing(145,86,'M0 0Q-2-51 27-42Q42-22 2 7Z');
 out+=tuckedLegs('#5d5b4c',138,103);
 out+=E(110,104,27,17,fruit?'#a47f49':'#6c7772')+E(143,94,23,20,c)+E(172,95,17,17,fruit?'#c5a272':'#868b7e');
 for(let i=0;i<4;i++)out+=L(`M${94+i*10} 93q-3 11 2 22`,fruit?'#6e5940':'#a5afa3',1.4);
 if(!fruit)for(let i=0;i<4;i++)out+=L(`M${130+i*7} 80l2 25`,'#3f4c48',2);
 out+=E(178,93,8,11,fruit?'#b44838':'#9e5948')+E(180,90,2.1,2.4,'#e7a289');
 out+=L('M166 80l-4-6M174 79l3-7','#565847',2)+L('M181 108l4 5-2 3','#685e48',2.5);
 return out;
}
function mosquito(){
 let out=transparentWing(136,90,'M0 0Q-65-30-58-40Q-34-51 5-2Z',Math.PI)+transparentWing(143,87,'M0 0Q-40-54-23-57Q4-54 9 3Z');
 out+=tuckedLegs('#6c6753',138,97,true)+E(107,108,35,7,'#9b8b66','transform="rotate(-18 107 108)"')+E(142,94,14,13,'#7e7864')+E(164,89,10,10,'#787461');
 for(let i=0;i<6;i++)out+=L(`M${82+i*8} ${110-i*2.4}l3 8`,'#d0c399',1.2);
 out+=L('M173 91l38-5','#605c4c',2)+antenna(162,80,'M0 0l8-21 9-7','#6f6856')+antenna(168,83,'M0 0l20-14 11 0','#6f6856',Math.PI)+eye(169,86,2.5);return out;
}
function aphid(){
 let out=sixLegs('#789149',139,114,true);
 out+=P('M84 109Q86 79 116 90L151 104Q166 120 136 128Q96 134 84 109Z','#a8bc66')+E(158,108,17,14,'#92a853');
 out+=L('M96 95l-6-15M107 91l-2-16','#748c42',5)+antenna(157,96,'M0 0l4-23 17-8','#839647')+antenna(169,101,'M0 0l22-12 17-3','#839647',Math.PI)+eye(166,105,2.6);return out;
}
function springtail(){
 let out=sixLegs('#76745f',143,121,true);
 out+=E(105,121,42,16,'#8d8d77')+E(151,115,20,17,'#999b80')+eye(159,111,3);
 for(let i=0;i<6;i++)out+=L(`M${74+i*12} 109q-4 11 0 24`,'#6e725e',1.2);
 out+=L('M116 134l-17 6 12 3M101 140l-10 4','#a7a38a',2.5)+antenna(150,99,'M0 0l10-17 14-4','#747c63')+antenna(164,104,'M0 0l19-10 13 1','#747c63',Math.PI);return out;
}
function cockroach(){
 let out=sixLegs('#775435',140,112);
 out+=E(113,107,45,24,'#9a6d45')+P('M74 99Q109 76 151 99L146 119Q104 136 72 111Z','#a0784b')+L('M77 101L149 105','#6c4f35',2)+L('M86 107l52 5M89 113l43 4','#bc9866',1.5)+E(154,104,21,21,'#81613e')+E(175,108,13,11,'#6f5339')+eye(181,105,2.4);
 out+=antenna(173,99,'M0 0Q18-42 62-46','#67543d')+antenna(180,104,'M0 0Q28-26 63-21','#67543d',Math.PI)+L('M72 114l-17 9M70 105l-18 0','#786044',2);return out;
}
function orthopteran(name){
 const cricket=name==='Field Cricket',locust=name==='Locust',c=cricket?'#4c4b3d':locust?'#b5a070':'#8fa85c',shade=cricket?'#363b32':locust?'#8d7e52':'#687e45';
 let out='';
 for(let side=0;side<2;side++){
  out+=joint('hop-leg',135,113,L('M0 0L-29-34L-45 21L-18 32',shade,side?5:4)+P('M-3-2L-27-33Q-40-34-30-18L-11 7Z',c),side*Math.PI,7);
  out+=ikLeg(149,114,8,33,shade,side*Math.PI,2.8,side?1:.7)+ikLeg(165,113,24,34,shade,(1-side)*Math.PI,2.8,side?1:.7);
 }
 out+=E(114,105,45,16,c)+P('M77 102L153 92L148 115L83 115Z',shade)+L('M86 104l54-5M90 109l48-5',c,1.4)+P('M143 94L166 93L173 115L147 120Z',c)+E(180,106,16,20,c)+eye(186,99,4);
 const al=cricket?52:26;
 out+=antenna(180,88,`M0 0Q3-${al} ${al}-${al+4}`,shade)+antenna(188,91,`M0 0Q26-${al*.65} ${al+13}-${al*.6}`,shade,Math.PI)+L('M188 119l9-3',shade,2);
 if(locust)out+=P('M149 94L155 93L166 115L161 117Z','#e1ca8e');return out;
}
function beetle(name){
 const lady=name==='Ladybird',weevil=name==='Weevil',c=lady?'#cb6550':weevil?'#887a5c':'#495950';
 let out=sixLegs(lady?'#46473b':c,153,115,true);
 out+=E(111,108,lady?36:38,lady?29:24,c)+L('M81 105Q111 113 142 106',lady?'#793c31':'#2d4139',1.6);
 if(lady){for(const[x,y,r]of [[91,93,5],[115,87,5],[132,100,5],[91,117,5],[117,120,5],[103,104,5]])out+=E(x,y,r,r,'#343d35');}
 else for(let i=0;i<5;i++)out+=L(`M${82+i*12} 90q-8 16-1 32`,weevil?'#b1a184':'#789080',1.2);
 out+=E(153,108,18,18,lady?'#3e463b':c)+E(176,110,12,12,lady?'#374036':c);
 if(lady)out+=E(150,98,5,4,'#f2dfb5')+E(161,111,4,5,'#f2dfb5');
 if(weevil)out+=L('M183 112Q203 112 205 126','#807256',7)+antenna(198,116,'M0 0l-5-15 10-8','#71674f')+antenna(204,120,'M0 0l15-7 11 1','#71674f',Math.PI);
 else out+=antenna(172,98,'M0 0l6-14 12-5','#454f3f')+antenna(182,102,'M0 0l17-10 10 1','#454f3f',Math.PI);
 out+=eye(181,106,2.5);if(!lady&&!weevil)out+=L('M187 113l9 3-5 5','#32473d',2.5);return out;
}
function spider(name){
 const harvest=name==='Harvestman',jump=name==='Jumping Spider',tick=name==='Tick',mite=name==='Dust Mite';
 const c=mite?'#cbbf9f':tick?'#9b7554':jump?'#797f6c':harvest?'#8d7956':'#8b775c';let out='';
 const center=harvest?137:tick||mite?146:147;
 for(let side=0;side<2;side++)for(let i=0;i<4;i++){
  const xs=harvest?[-71,-42,38,69]:jump?[-28,-15,17,33]:tick||mite?[-19,-8,13,23]:[-44,-23,25,44];
  out+=ikLeg(center+(i-1.5)*4,harvest?94:111,xs[i]+(side?3:-3),harvest?53:jump?34:tick||mite?25:34,c,((i+side)%2)*Math.PI,harvest?2:jump?4:2.8,side?1:.65);
 }
 if(harvest)out+=E(136,89,23,17,c)+E(144,79,5,4,'#766346')+E(147,78,1.5,1.8,'#343c31');
 else if(tick||mite){out+=E(125,111,35,mite?23:26,c)+E(154,112,16,18,mite?'#c1b594':'#655b48')+P('M164 105L176 107L179 115L166 120Z',mite?'#b4a786':'#8a6c4e');if(mite){for(let i=0;i<9;i++)out+=L(`M${100+i*6} 97l-3-6M${100+i*6} 124l2 6`,'#ad9e7e',.8);}else out+=P('M132 90Q155 90 161 105L146 114L130 103Z','#6a5d48');}
 else{out+=E(110,103,jump?27:33,jump?22:29,c)+E(151,108,jump?28:20,jump?23:18,c);
  if(jump){out+=P('M132 92Q151 83 173 96L169 103L136 102Z','#d8cbb0');out+=eye(157,101,6)+eye(173,101,4.6)+eye(145,98,2.6)+E(168,120,8,6,'#d1c2a2')+E(153,123,7,5,'#d1c2a2');}
  else{out+=P('M98 79L117 81L108 91L122 98L105 105L118 119L100 117L91 103Z','#c1aa7c')+eye(163,106,2.7)+eye(157,103,2.2)+E(165,119,5,6,'#776046');}
 }return out;
}
function myriapod(name){
 const milli=name==='Millipede',count=milli?14:15,c=milli?'#716c58':'#b59860',edge=milli?'#4c4e41':'#877343';let legs='',body='';
 for(let i=0;i<count;i++){
  const x=62+i*(milli?9:8),y=125+Math.sin(i*.35)*3;
  for(let side=0;side<2;side++)for(let pair=0;pair<(milli?2:1);pair++){
   const dir=side?1:-1,dx=milli?5:13,dy=milli?15:20;
   legs+=joint('leg',x+pair*3,y+7,L(`M0 0l${dx*dir} ${dy*.55}l${dx*.5*dir} ${dy*.45}`,edge,milli?1.5:2.4),i*.7+side*Math.PI+pair*.35,milli?8:10,.8);
  }
  body+=E(x,y,milli?8:8.5,milli?12:8.5,c)+L(`M${x+4} ${y-(milli?10:7)}q-3 ${milli?12:8} 0 ${milli?20:14}`,edge,1);
 }
 const hx=62+(count-1)*(milli?9:8)+9,hy=125+Math.sin((count-1)*.35)*3;
 body+=E(hx,hy,milli?10:13,milli?11:10,milli?'#80765a':'#a37d43')+eye(hx+6,hy-3,2);
 body+=antenna(hx+5,hy-6,'M0 0l10-12 11-3',edge)+antenna(hx+9,hy+1,'M0 0l17-3 7 4',edge,Math.PI);
 return legs+body;
}
function woodlouse(){
 let out='';for(let side=0;side<2;side++)for(let i=0;i<7;i++)out+=joint('leg',91+i*12,128,L(`M0 0l${side?7:-7} 10l8 7`,'#77796b',2),i*.8+side*Math.PI,7);
 out+=E(127,115,49,23,'#8a8e7f');for(let i=0;i<7;i++)out+=P(`M${84+i*12} 103q5-13 12-5l1 32-12 1Z`,i%2?'#989b8b':'#858b7b')+L(`M${96+i*12} 100q-4 13 0 29`,'#626e60',1.2);
 out+=E(177,117,13,13,'#7c8474')+eye(182,113,2)+antenna(181,108,'M0 0l13-11 13 0','#707c67')+antenna(187,118,'M0 0l17 0 8 7','#707c67',Math.PI);return out;
}
function silverfish(){
 let out=sixLegs('#a0aaa1',150,123,true);
 out+=P('M65 129Q84 111 128 105L158 105L175 120L158 133L115 135Z','#b9c3b8');
 for(let i=0;i<7;i++)out+=L(`M${87+i*11} ${123-i*2.5}l2 ${11+i*.4}`,'#8e9d92',1.2);
 out+=E(174,118,15,14,'#c6cec0')+eye(181,113,2.5)+antenna(175,105,'M0 0l15-20 17-7','#92a197')+antenna(185,116,'M0 0l25-7 12 3','#92a197',Math.PI);
 out+=L('M70 126L27 109M69 129L22 131M70 132L33 150','#97a99d',2);return out;
}
function flea(){
 const c='#a98455',dark='#7a6546';let out='';
 for(let side=0;side<2;side++){
  out+=joint('hop-leg',134,115,L('M0 0L-24 17L-38 32L-8 34',dark,4)+P('M3 0Q-18-7-25 14L-17 20L5 9Z',c),side*Math.PI,9);
  out+=ikLeg(146,116,5,31,dark,side*Math.PI,2.5)+ikLeg(163,112,26,35,dark,(1-side)*Math.PI,2.5);
 }
 out+=P('M83 113Q72 80 113 78Q149 78 162 98L180 102L187 116L166 127Q114 141 83 113Z',c);
 for(let i=0;i<7;i++)out+=L(`M${91+i*10} ${88+i*.7}q-4 16 6 32`,dark,1.2);
 out+=eye(175,109,2.3)+L('M177 117l9 5M165 98l-3-6','#67543b',2);return out;
}
function gastropod(name){
 const snail=name==='Garden Snail',c=snail?'#ae9b72':'#9b9171';let out='';
 out+=P('M49 143Q73 130 115 130L165 119Q177 113 187 124L206 140Q209 147 191 149H63Q45 149 49 143Z',c)+L('M59 146Q137 142 196 146','#d3c7a0',2.5);
 if(snail){out+=E(116,112,35,31,'#bda378')+E(115,111,29,26,'#cbb68b')+P('M117 135Q86 127 91 103Q96 82 118 88Q142 91 137 114Q133 130 116 125Q103 121 107 108Q110 101 118 104Q124 110 117 115','none','stroke="#876b4d" stroke-width="4" stroke-linecap="round"');}
 else out+=P('M90 133Q113 109 145 117Q169 119 180 136L113 140Z','#b2a381')+E(156,130,2.4,2.4,'#776c52')+L('M86 137l-26 5','#80775f',1);
 out+=joint('antenna',182,125,L('M0 0L-1-29',c,4)+eye(-1,-29,2.4),0,3,.25)+joint('antenna',191,132,L('M0 0L14-28',c,4)+eye(14,-28,2.4),Math.PI,3,.25)+L('M191 137l19-8M189 141l18 0',c,2.2);
 return out;
}
function earthworm(){
 // Overlapping rings remain joined while the phase advances along the body.
 // Segment marks stay inside the silhouette, never resembling little legs.
 let out='';
 for(let i=0;i<27;i++){
  const x=48+i*6.3,y=137+Math.sin(i*.34)*4,collar=i>=19&&i<=22;
  const rx=i===0||i===26?7.3:8.5,ry=collar?9:7.5;
  const segment=E(0,0,rx,ry,collar?'#d1a08a':'#b88c76')+(i&&i!==26&&!collar?L('M-2-6Q-4 0-2 6','#a07965',.8):'');
  out+=joint('slither',x,y,segment,i*.42,1.7,.55);
 }
 return out;
}

const drawers={
 ...Object.fromEntries(Object.keys(antProfiles).map(name=>[name,()=>ant(name)])),
 'Fruit Fly':()=>fly('Fruit Fly'),'Housefly':()=>fly('Housefly'),'Mosquito':mosquito,
 'Honey Bee':()=>bee('Honey Bee'),'Bumblebee':()=>bee('Bumblebee'),'Termite':termite,
 'Aphid':aphid,'Springtail':springtail,'Earthworm':earthworm,
 'Garden Snail':()=>gastropod('Garden Snail'),'Garden Slug':()=>gastropod('Garden Slug'),
 'Cockroach':cockroach,'Field Cricket':()=>orthopteran('Field Cricket'),'Grasshopper':()=>orthopteran('Grasshopper'),'Locust':()=>orthopteran('Locust'),
 'Ladybird':()=>beetle('Ladybird'),'Ground Beetle':()=>beetle('Ground Beetle'),'Weevil':()=>beetle('Weevil'),
 'Moth':moth,'Cabbage White Butterfly':()=>butterfly('Cabbage White Butterfly'),'Red Admiral Butterfly':()=>butterfly('Red Admiral Butterfly'),
 'Harvestman':()=>spider('Harvestman'),'Garden Spider':()=>spider('Garden Spider'),'Jumping Spider':()=>spider('Jumping Spider'),
 'Millipede':()=>myriapod('Millipede'),'Centipede':()=>myriapod('Centipede'),'Woodlouse':woodlouse,
 'Silverfish':silverfish,'Flea':flea,'Tick':()=>spider('Tick'),'Dust Mite':()=>spider('Dust Mite')
};
export const INVERTEBRATE_NAMES=Object.freeze(Object.keys(drawers));
export function drawInvertebrate(s){return drawers[s.name]?.()??null;}
const flying=new Set(['Fruit Fly','Housefly','Mosquito','Honey Bee','Bumblebee','Moth','Cabbage White Butterfly','Red Admiral Butterfly']);
const hopping=new Set(['Springtail','Field Cricket','Grasshopper','Locust','Jumping Spider','Flea']);
export function invertebrateMotion(s){
 if(!drawers[s.name])return null;
 if(flying.has(s.name))return 'fly';
 if(hopping.has(s.name))return 'hop';
 if(s.name==='Garden Snail'||s.name==='Garden Slug')return 'glide';
 if(s.name==='Earthworm')return 'slither';
 return 'crawl';
}
