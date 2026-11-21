// V1.3 land mammals: name-specific silhouettes and markings in the original flat cartoon style.
const E=(x,y,rx,ry,c,extra='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}" ${extra}/>`;
const P=(d,c,extra='')=>`<path d="${d}" fill="${c}" ${extra}/>`;
const L=(d,c,w=3)=>P(d,'none',`stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`);
const eye=(x,y,r=2.6)=>E(x,y,r,r*1.1,'#26332f')+E(x+.7,y-.8,.75,.85,'#fff9e8');
const nose=(x,y,w=4)=>E(x,y,w,w*.65,'#3b3934');
const shade=(hex,a=-.18)=>'#'+[1,3,5].map(i=>{let n=parseInt(hex.slice(i,i+2),16);return Math.round(a<0?n*(1+a):n+(255-n)*a).toString(16).padStart(2,'0');}).join('');
const J=(type,x,y,shape,phase=0,swing=8)=>`<g data-anim="${type}" data-pivot="${x} ${y}" data-phase="${phase}" data-swing="${swing}" transform="translate(${x} ${y})">${shape}</g>`;
const ear=(x,y,c,rx=7,ry=13,pointed=false)=>J('ear',x,y,pointed?P(`M-${rx} 4Q-${rx+3} -${ry*.6} -2 -${ry}Q${rx} -${ry*.6} ${rx} 5Z`,c)+P(`M-${rx*.45} 0L-1 -${ry*.72}L${rx*.5} 1Z`,'#d9b7a2'):E(0,-ry*.45,rx,ry,c)+E(0,-ry*.45,rx*.5,ry*.6,'#c4a48f'),0,2);
function leg(x,y,len,c,w=9,phase=0,hoof=false,type='leg',pattern=''){
 let markings='';if(pattern==='okapi'){markings=P(`M-${w*.5} ${len*.45}H${w*.6}V${len-5}H-${w*.5}Z`,'#e7ddc4');for(let i=0;i<5;i++)markings+=L(`M-${w*.5} ${len*.48+i*4}l${w*1.1}-2`,c,2);}if(pattern==='zebra')for(let i=0;i<4;i++)markings+=L(`M-${w*.5} ${10+i*8}h${w*1.1}`,'#42483f',3);
 const foot=hoof?P(`M-${w*.48} ${len-6}H${w*.55}L${w*.8} ${len+2}H-${w*.65}Z`,'#45473d')+L(`M0 ${len-5}V${len+1}`,'#7e8071',.8):E(2,len,w*.9,3.7,c)+L(`M3 ${len-1}v2M7 ${len-1}v2`,shade(c),.7);
 return J(type,x,y,P(`M-${w*.55} 0Q-${w*.7} ${len*.35} -${w*.4} ${len*.62}L-${w*.45} ${len}H${w*.5}L${w*.65} ${len*.6}Q${w*.85} ${len*.2} ${w*.7} 0Z`,c)+markings+foot,phase,hoof?7:9);
}
const PI=Math.PI,tail=(x,y,d,c,w=8)=>J('tail',x,y,L(d,c,w),0,5);
const whiskers=(x,y)=>L(`M${x} ${y}l17-5M${x} ${y+3}l18 1M${x-1} ${y+5}l15 6`,'#d9cfb8',.8);
function marks(cx,cy,rx,ry,c,mode='spots',count=25){if(mode==='cloud'){return [[-29,-9],[-6,-12],[20,-8],[-23,12],[3,11],[28,10]].map(([dx,dy],i)=>{const x=cx+dx,y=cy+dy;return P(`M${x-7} ${y-5}Q${x-9} ${y-11} ${x+2} ${y-9}L${x+10} ${y-3}Q${x+11} ${y+3} ${x+6} ${y+7}L${x-4} ${y+8}Q${x-9} ${y+4} ${x-7} ${y-5}Z`,'#9b825d',`stroke="${c}" stroke-width="2"`);}).join('');}let s='';for(let i=0;i<count;i++){const x=cx-rx+8+(i%8)*(rx*2-16)/7,y=cy-ry+7+Math.floor(i/8)*11+(i%2)*3;if(((x-cx)/rx)**2+((y-cy)/ry)**2>.78)continue;s+=mode==='ring'?E(x,y,3.4,2.8,'none',`stroke="${c}" stroke-width="1.7"`):mode==='cloud'?P(`M${x-6} ${y-4}Q${x+1} ${y-9} ${x+8} ${y-3}L${x+6} ${y+8}Q${x-4} ${y+10} ${x-7} ${y+2}Z`,'#967751',`stroke="${c}" stroke-width="2"`):E(x,y,2.2,2.6,c);}return s;}
const p=(form,coat,cues,extra={})=>({form,coat,cues,...extra});
export const MAMMAL_PROFILES={
 'Brown Rat':p('small','#8a7461',['Long bare tail','Rounded small ears','Blunt elongated muzzle'],{tail:'bare',head:'rat'}),
 'Black Rat':p('small','#4c4c4b',['Slender dark body','Large ears','Long thin bare tail'],{tail:'bare',head:'rat',slim:true,bigEars:true}),
 'House Mouse':p('small','#a79078',['Large round ears','Small pointed muzzle','Thin naked tail'],{tail:'bare',bigEars:true}),
 'Domestic Rabbit':p('rabbit','#eee5d1',['Long upright ears','Compact rounded body','Large hind feet and short white tail'],{patch:true}),
 'European Rabbit':p('rabbit','#a58e6d',['Brown-gray compact body','Pale underside','Long ears and short cotton tail']),
 'Brown Hare':p('rabbit','#ad9164',['Very long black-tipped ears','Long hindlegs','Leaner body than rabbit'],{hare:true}),
 'Domestic Cat':p('cat','#c58d54',['Short feline muzzle','Triangular ears','Long curved tail and tabby stripes'],{pattern:'tabby'}),
 'Domestic Dog':p('canid','#c99963',['Broad dog muzzle','Floppy ears','Representative mixed-breed markings'],{floppy:true,patch:true}),
 'Sheep':p('ungulate','#e3decb',['Woolly rounded fleece','Short narrow face','Cloven hooves'],{wool:true}),
 'Goat':p('ungulate','#b89b73',['Backward-curved horns','Chin beard','Upright short tail'],{horn:'goat',beard:true}),
 'Cattle':p('ungulate','#d9cfb5',['Large barrel body','Broad muzzle','Tail with dark tuft'],{heavy:true,patch:true,horn:'cow'}),
 'Pig':p('pig','#dca8a1',['Round snout with nostrils','Stocky pink body','Curled tail']),
 'Virginia Opossum':p('small','#a3a09b',['White pointed face','Bare rounded ears','Long pink prehensile tail'],{tail:'bare',head:'opossum'}),
 'Red Fox':p('canid','#c66c36',['Pointed ears and slim muzzle','Black lower legs','Full white-tipped tail'],{fox:true}),
 'Eastern Gray Squirrel':p('small','#989b92',['Gray back and pale belly','Large bushy tail held upright','Small rounded ears'],{tail:'squirrel'}),
 'Red Squirrel':p('small','#ac6e3e',['Rusty red fur','Bushy curved tail','Tufted ears'],{tail:'squirrel',tufts:true}),
 'Raccoon':p('small','#96988b',['Black eye mask','Black-banded bushy tail','Stocky gray body'],{tail:'rings',mask:true}),
 'Striped Skunk':p('small','#373c36',['Black coat with two white back stripes','Large raised tail','Small head and short legs'],{tail:'skunk',skunk:true}),
 'European Hedgehog':p('hedgehog','#9c805e',['Dense spiny back','Small pointed snout','Short legs']),
 'Mole':p('small','#726b64',['Velvety round body','Tiny eyes and no visible external ears','Broad pink digging hands'],{mole:true}),
 'Common Vole':p('small','#988268',['Rounded blunt face','Small ears','Very short tail'],{tail:'short',vole:true}),
 'Field Mouse':p('small','#bb9260',['Large eyes and rounded ears','White belly','Long slender tail'],{tail:'bare',bigEars:true}),
 'Norway Lemming':p('small','#bfa368',['Stout body and tiny tail','Black-and-golden mottled coat','Small concealed ears'],{tail:'short',lemming:true}),
 'Horse':p('equid','#a77c54',['Long face and upright ears','Flowing dark mane and tail','Single hooves']),
 'White-tailed Deer':p('deer','#b38b65',['White throat and tail underside','Slender legs','Branched antlers'],{antlers:'branch',tailWhite:true}),
 'Mule Deer':p('deer','#a4977e',['Very large mule-like ears','Black-tipped white tail','Forked antlers'],{antlers:'fork',bigEars:true,tailWhite:true}),
 'Red Deer':p('deer','#9d714f',['Reddish-brown body and neck mane','Multi-tined antlers','Short tail over pale rump'],{antlers:'branch',mane:true,rump:true}),
 'Roe Deer':p('deer','#ac805a',['Small slender body','Short three-tined antlers','White rump with no visible tail'],{antlers:'short',rump:true,noTail:true}),
 'Fallow Deer':p('deer','#b18b61',['White spots on chestnut coat','Flattened palmate antlers','White rump edged dark and black-striped tail'],{antlers:'palm',spotted:true,rump:true,fallow:true}),
 'Donkey':p('equid','#a09d8b',['Very long ears','Short upright mane','Dark cross and tufted tail'],{donkey:true}),
 'Dromedary Camel':p('camel','#c4a170',['One tall hump','Long curved neck','Broad padded feet'],{hump:true}),
 'Alpaca':p('camel','#e1d0ac',['Compact woolly body','Short spear-shaped ears','Shorter face than llama'],{alpaca:true}),
 'Llama':p('camel','#bca386',['Long neck','Curved banana-shaped ears','Woolly body'],{llama:true}),
 'Wild Boar':p('pig','#766046',['Coarse dark bristles','Long wedge-shaped snout','Small upward tusks'],{boar:true}),
 'Coyote':p('canid','#b69c75',['Large pointed ears','Narrow muzzle','Black-tipped bushy tail'],{coyote:true}),
 'Gray Wolf':p('canid','#8d9690',['Broad wolf muzzle','Thick gray ruff','Bushy tail'],{wolf:true}),
 'European Badger':p('small','#8d9289',['Broad low body','Black stripes through white face','Short stout legs'],{badger:true}),
 'American Beaver':p('small','#8a6547',['Broad flat scaly tail','Stocky body','Small ears and orange incisors'],{tail:'beaver',beaver:true}),
 'Muskrat':p('small','#8b7051',['Rounded brown body','Long narrow scaly tail','Small ears'],{tail:'bare',muskrat:true}),
 'Prairie Dog':p('small','#bba076',['Stocky tan body','Short dark-tipped tail','Rounded face and small ears'],{tail:'short',prairie:true}),
 'Meerkat':p('meerkat','#bba379',['Slender upright posture','Dark eye patches','Long thin dark-tipped tail']),
 'Nine-banded Armadillo':p('armadillo','#9f9987',['Segmented armored shell','Long tapered snout','Large ears and digging claws']),
 'Wildebeest':p('ungulate','#7e8072',['High shoulders and dark mane','Curving outward horns','Bearded broad face'],{horn:'wildebeest',mane:true,heavy:true,beard:true}),
 'Impala':p('deer','#bc8d59',['Slender tan body and white belly','Lyre-shaped ridged horns','Black markings on rump and heels'],{horn:'lyre',impala:true}),
 'Springbok':p('deer','#c4a175',['White face and belly','Dark flank band','Curved ringed horns'],{horn:'lyre',band:true,springbok:true}),
 "Thomson's Gazelle":p('deer','#c4a06d',['Bold black flank stripe','White rump and belly','Small curved ridged horns'],{horn:'lyre',band:true}),
 'Plains Zebra':p('equid','#ece5d4',['Black-and-white body stripes','Short upright striped mane','Single hooves'],{zebra:true}),
 'Elk':p('deer','#a68b62',['Tan body and dark neck mane','Large swept branched antlers','Pale rump'],{antlers:'branch',mane:true,rump:true}),
 'Moose':p('deer','#76634a',['Very long bulbous nose','Broad palmate antlers','Shoulder hump and throat bell'],{antlers:'palm',moose:true}),
 'Caribou':p('deer','#a49b85',['Pale thick neck','Branched antlers with brow tines','Broad cloven hooves'],{antlers:'caribou',caribou:true}),
 'Warthog':p('pig','#9b8a72',['Large curved tusks','Wide warty head','Sparse mane and thin tail'],{warthog:true}),
 'Spotted Hyena':p('canid','#a99a76',['Sloping back with higher forequarters','Rounded ears','Spotted coat and strong muzzle'],{hyena:true}),
 'Red Kangaroo':p('kangaroo','#b68a64',['Large paired hindfeet','Small forearms','Long thick balancing tail']),
 'Wallaby':p('kangaroo','#a89578',['Compact body','Large paired hindfeet','Muscular tapered tail'],{wallaby:true}),
 'American Black Bear':p('bear','#41453e',['Rounded ears','Short muzzle','Broad paws without a pronounced shoulder hump']),
 'Brown Bear':p('bear','#866749',['Pronounced shoulder hump','Broad head','Long foreclaws'],{brown:true}),
 'Wombat':p('wombat','#9d9280',['Barrel-shaped low body','Broad square nose','Short sturdy legs and barely visible tail']),
 'Koala':p('koala','#a1aaa2',['Large fluffy round ears','Large oval black nose','Tailless rounded body']),
 'Giraffe':p('giraffe','#c7a36d',['Extremely long neck and legs','Brown polygon patches','Paired ossicones']),
 'Hippopotamus':p('hippo','#a89590',['Huge barrel body','Broad boxy muzzle','Small high ears and eyes']),
 'Bornean Orangutan':p('primate','#b26b3f',['Very long arms','Shaggy reddish hair','Broad cheek pads on representative adult male'],{orangutan:true}),
 'Cape Buffalo':p('ungulate','#686c5b',['Heavy dark body','Joined horn boss','Wide outward-curving horns'],{horn:'buffalo',heavy:true}),
 'African Elephant':p('elephant','#a3a493',['Large fan-shaped ears','Long trunk and curved tusks','Heavy pillar-like legs'],{african:true}),
 'Asian Elephant':p('elephant','#aaa18e',['Smaller rounded ears','Twin domes on crown','Long trunk and pillar-like legs']),
 'Mountain Gorilla':p('primate','#535a53',['Massive shoulders and long arms','Prominent brow','Representative adult silverback gray saddle'],{gorilla:true}),
 'Chimpanzee':p('primate','#5c594e',['Long arms and short legs','Protruding muzzle','Rounded ears and no tail']),
 'Mandrill':p('primate','#8c8467',['Long muzzle with red center and blue ridges','Golden beard','Short tail'],{mandrill:true}),
 'Gelada':p('primate','#9e7b56',['Long cape of hair','Red bare chest patch','Long tail with tuft'],{gelada:true}),
 'Giant Anteater':p('anteater','#8a8170',['Very long narrow snout','Huge bushy tail','Diagonal black shoulder stripe edged pale']),
 'Sloth Bear':p('bear','#373c34',['Shaggy black fur','Long pale muzzle','Pale V-shaped chest mark'],{sloth:true}),
 'Sun Bear':p('bear','#55483a',['Short sleek dark coat','Golden chest crescent','Small round ears'],{sun:true}),
 'African Wild Dog':p('canid','#c3a269',['Huge rounded ears','Irregular black tan and white patches','White tail tip'],{wilddog:true}),
 'Bonobo':p('primate','#5e5a51',['Slender body and long legs','Dark face with pink lips','Center-parted crown hair'],{bonobo:true}),
 'Lion':p('cat','#c5a069',['Large rounded head','Representative adult male mane','Tuft at end of tail'],{lion:true}),
 'Polar Bear':p('bear','#ece7d5',['Long neck and small ears','Creamy white coat','Broad heavy paws'],{polar:true}),
 'Okapi':p('okapi','#845840',['Velvety dark brown body','White hindquarter and leg stripes','Long ears and short giraffe-like neck']),
 'Cheetah':p('cat','#c9aa68',['Slim long-legged body','Solid dark spots','Black tear lines below eyes'],{pattern:'spots',cheetah:true}),
 'Clouded Leopard':p('cat','#b29c77',['Large dark-edged cloud patches','Long tail','Stocky short-legged feline build'],{pattern:'cloud',cloud:true}),
 'Red Panda':p('small','#b96f41',['Rust-red body and white face','Dark legs','Long red-and-buff ringed tail'],{tail:'redrings',redpanda:true}),
 'Ring-tailed Lemur':p('lemur','#a2a69a',['Long black-and-white ringed tail','White face with dark eye patches','Gray body and long hindlimbs']),
 'Binturong':p('small','#50574c',['Shaggy dark body','Long prehensile furry tail','Pale whiskers and ear tufts'],{tail:'binturong',binturong:true}),
 'Giant Panda':p('bear','#eee8d8',['Black eye patches','Black ears legs and shoulder band','White rounded head and body'],{panda:true}),
 'Snow Leopard':p('cat','#c2ccca',['Gray rosetted coat','Very thick long tail','Small rounded ears and broad paws'],{pattern:'ring',snow:true}),
 'Tiger':p('cat','#ce904b',['Orange coat with dark stripes','White cheeks and belly','Long banded tail'],{pattern:'stripes'}),
 'Mountain Tapir':p('tapir','#706a5f',['Woolly dark teardrop body','Short flexible proboscis','White-edged lips and rounded ears']),
 'Saola':p('deer','#92795b',['Two long nearly straight parallel horns','Bold white face patches','White markings near hooves'],{horn:'saola',saola:true}),
 "Przewalski's Horse":p('equid','#bf9d66',['Stocky dun body','Short upright dark mane','Dark lower legs and pale muzzle'],{przewalski:true}),
 'Sumatran Rhinoceros':p('rhino','#a18a78',['Two horns with smaller rear horn','Sparse reddish hair','Rounded folded body'],{sumatran:true}),
 'Amur Leopard':p('cat','#c4a16b',['Golden fur with dark rosettes','Long spotted tail','Rounded ears'],{pattern:'ring'}),
 'Northern White Rhinoceros':p('rhino','#bab9a9',['Two horns','Very broad square grazing muzzle','Heavy pale gray folded skin'])
};
export const MAMMAL_NAMES=Object.freeze(Object.keys(MAMMAL_PROFILES));
function rabbit(o){const c=o.coat,h=o.hare;let a=E(77,116,11,11,'#f3ebd8');
 a+=leg(114,116,29,shade(c),10,0,false,'hop-leg')+leg(166,115,30,shade(c),7,PI,false,'hop-leg');
 a+=E(h?123:120,107,h?47:43,h?29:34,c)+E(142,119,30,21,'#e7dcc2');if(o.patch)a+=E(99,101,24,25,'#b69578');
 a+=J('hop-leg',108,117,E(0,0,20,22,c)+P('M-8 14Q-12 28 6 30L30 30Q39 25 28 23L10 20Z',c)+L('M26 25v4M20 25v4',shade(c),.8),0,12)+leg(160,114,31,c,7,PI,false,'hop-leg');
 a+=ear(164,72,c,9,h?55:45,true)+ear(181,72,c,8,h?55:43,true);if(h)a+=P('M155 27L160 17L166 31Z','#4a4435')+P('M176 23L180 16L186 30Z','#4a4435');
 return a+E(175,86,26,24,c)+E(192,98,15,11,'#eee2c9')+nose(204,94,3)+eye(184,82,3.1)+L('M196 101q4 4 8 0',shade(c),1)+whiskers(197,101);
}
function small(o){const c=o.coat,low=o.badger||o.beaver||o.binturong;let a='';
 if(o.tail==='bare')a+=tail(78,115,'M0 0C-18 14-42 23-57 8Q-64 0-65 9',o.head==='rat'?'#b39487':'#c2a08a',o.muskrat?4.5:3.5);
 if(o.tail==='short')a+=tail(78,116,'M0 0Q-15 3-19 10',shade(c),7);
 if(o.tail==='squirrel')a+=J('tail',79,108,P('M6 4Q-31 0-47-24Q-62-60-29-73Q-8-81 0-60Q7-42-20-33Q-34-27-15-15Z',c)+L('M-31-56Q-4-64-13-45',shade(c,.22),4),0,4);
 if(o.tail==='beaver')a+=J('tail',78,118,P('M1-6Q-28-15-52 2Q-67 15-49 23Q-24 25 4 7Z','#625647')+L('M-45 7l25 11M-36 0l26 11M-51 13l31-13M-39 20l28-14','#89775d',1),0,3);
 if(['rings','redrings','binturong'].includes(o.tail)){let tc=o.redpanda?'#bd804b':o.binturong?c:'#a5a48d';a+=J('tail',78,107,L('M0 0Q-25 6-43-6T-59-39',tc,o.binturong?17:21)+(!o.binturong?L('M-17 3l-3-13M-31-3l3-16M-46-16l12-11M-55-31l15-4',o.redpanda?'#e0b578':'#50584e',8):''),0,4);}
 if(o.tail==='skunk')a+=J('tail',80,107,P('M2 1Q-30-14-29-49Q-28-80-56-75Q-76-69-64-43Q-60-9-7 15Z',c)+P('M-21-4Q-47-23-47-59Q-44-73-56-75Q-36-83-29-60Q-22-29-12-7Z','#eee8d6'),0,4);
 for(let i=0;i<2;i++)a+=leg(i?150:95,119,27,o.redpanda?'#40392e':shade(c),low?10:6,i?0:PI);
 a+=E(115,low?109:106,o.slim?42:low?51:45,low?29:31,c)+E(129,120,31,15,shade(c,.28));
 if(o.lemming)a+=P('M79 88Q104 69 128 83L141 102L114 111L83 103Z','#393e34');
 if(o.skunk)a+=P('M75 91Q111 70 150 89L160 103Q117 82 79 101Z','#eee8d6')+L('M82 96Q110 83 144 93',c,4);
 if(o.badger)a+=P('M81 92Q120 74 154 97L157 107Q118 93 80 103Z','#b9beb2');
 if(o.binturong)for(let i=0;i<12;i++)a+=P(`M${78+i*6} 124l-5 10l11-7Z`,c);
 const hc=o.head==='opossum'||o.redpanda?'#eee6d3':c;
 if(!o.mole)a+=ear(154,88,hc,o.bigEars?12:8,o.bigEars?13:8,o.redpanda)+ear(174,88,hc,o.bigEars?11:7,o.bigEars?12:8,o.redpanda);
 if(o.tufts||o.binturong)a+=P('M149 82l4-16l6 17M171 80l7-15l3 19Z',c);
 a+=E(166,101,25,23,hc)+P(o.head==='rat'||o.head==='opossum'?'M176 91Q197 98 207 109L193 119L172 115Z':'M178 97Q193 99 198 110L188 119L172 114Z',hc);
 if(o.mask)a+=P('M149 96Q166 89 188 99L183 110Q166 103 149 108Z','#3a423a');
 if(o.badger)a+=P('M150 86Q170 84 194 106L186 113L164 98L153 110Z','#eee7d6')+P('M156 89L178 99L190 108L183 112L165 101Z','#393f37');
 if(o.redpanda)a+=P('M154 96l9 5l-4 16l-8-7Z',c)+P('M178 94l6 7l-5 15l-7-7Z',c);
 if(o.mole)a+=E(185,109,18,9,'#c7a598')+J('leg',158,119,E(12,13,15,9,'#c7a598')+L('M13 16l5 9M19 14l6 8M24 11l7 6','#e7ddc6',2),0,7);
 a+=eye(179,o.mole?101:99,o.mole?1.2:2.7)+nose(o.head==='rat'||o.head==='opossum'?207:198,109,3.2);
 if(o.beaver)a+=P('M194 113h4v8h-4Z','#dd9d49')+P('M199 113h3v8h-3Z','#e3ae60');
 if(o.binturong||o.head==='rat'||o.bigEars)a+=whiskers(193,113);
 if(o.head==='opossum')a+=E(155,80,7,8,'#5a514b');
 for(let i=0;i<2;i++)a+=leg(i?151:96,119,27,o.redpanda?'#4d4438':c,low?11:7,i?PI:0);
 return a;
}
function hedgehog(o){let a=leg(105,125,22,shade(o.coat),6,PI)+leg(156,125,22,shade(o.coat),6,0)+E(120,111,50,32,o.coat);for(let i=0;i<24;i++){const t=Math.PI+i/23*Math.PI,x=120+49*Math.cos(t),y=111+31*Math.sin(t);a+=P(`M${x-4} ${y+8}L${x+Math.cos(t)*8} ${y+Math.sin(t)*9}L${x+5} ${y+8}Z`,i%2?'#5d5140':'#b3a17e');}return a+P('M151 101Q171 94 193 119L182 127L150 123Z','#b79b77')+E(160,103,6,7,'#b79b77')+eye(174,112)+nose(193,119,3)+leg(107,128,19,o.coat,6,0)+leg(155,128,19,o.coat,6,PI);}
function canid(o){const c=o.coat,hy=o.hyena;let a=o.fox?J('tail',70,98,P('M4-4Q-18-26-42-16Q-64-7-58 8Q-39 24-12 11L6 6Z',c)+P('M-42-16Q-64-7-58 8Q-48 15-39 12Q-48 0-42-16Z','#f0e7cc'),0,5):J('tail',70,98,L('M0 0Q-25 1-32 26Q-30 36-42 36',c,hy?9:18)+(o.wilddog?E(-40,36,9,5,'#eee5ce'):''),0,5);
 
 a+=leg(89,107,40,shade(c),11,PI)+leg(159,hy?103:107,hy?44:40,shade(c),10,0)+P(hy?'M63 96Q81 78 123 86Q154 64 176 86L184 109Q144 119 106 118L73 116Z':'M66 90Q95 73 132 83Q160 75 178 91L182 115Q148 129 108 121L74 118Z',c)+P('M84 111Q123 124 171 105L177 116Q127 135 86 122Z',shade(c,.42));
 if(hy)a+=marks(122,100,51,24,'#635b47');
 if(o.wilddog||o.patch)a+=P('M82 85Q96 77 109 85L105 108L84 112Z','#554c3f')+P('M131 86L151 79L168 91L153 105L133 101Z','#e9dec4');
 if(o.wolf||o.coyote)a+=P('M100 82L112 80L125 88L137 82L152 88L158 98Q134 91 104 94Z',shade(c,-.2));
 a+=leg(86,112,35,o.fox?'#443b33':c,11,0)+leg(158,111,36,o.fox?'#443b33':c,10,PI)+P('M158 90L159 68Q166 53 184 59Q198 64 204 81L227 89Q235 99 219 106L187 114Q165 111 158 90Z',c);
 if(o.floppy)a+=P('M164 61Q145 53 148 82Q154 99 166 91L171 68Z',shade(c));else if(hy||o.wilddog)a+=ear(168,65,shade(c),o.wilddog?12:9,o.wilddog?15:10)+ear(189,63,shade(c),o.wilddog?11:8,o.wilddog?14:10);else a+=ear(168,66,c,10,o.fox||o.coyote?27:23,true)+ear(188,66,c,9,o.fox||o.coyote?26:21,true);
 return a+P('M178 91Q203 96 226 91L231 97L217 107L188 111Z',shade(c,.5))+eye(199,80)+nose(229,94,5)+L('M212 102q8 3 14-2',shade(c),1);
}
function cat(o){const c=o.coat,slim=o.cheetah,snow=o.snow;let a=J('tail',69,97,L(snow?'M0 0Q-30-3-37 28Q-45 48-55 25':'M0 0Q-24-15-35 9Q-45 31-55 19',c,snow?15:o.lion?5:9)+(o.lion?E(-55,19,7,9,'#775b3c'):L('M-15-2l-3 7M-29 2l-5-5M-36 15l-8-2M-46 24l-5-5',shade(c,-.48),3)),0,6);
 a+=leg(88,slim?99:111,slim?48:36,shade(c),slim?8:11,PI)+leg(159,slim?101:111,slim?46:36,shade(c),slim?8:11,0)+E(121,slim?90:101,57,slim?24:29,c)+E(128,slim?103:114,44,11,shade(c,.48));
 if(['spots','ring','cloud'].includes(o.pattern))a+=marks(120,slim?89:97,54,25,shade(c,-.57),o.pattern,32);
 if(['tabby','stripes'].includes(o.pattern))for(let i=0;i<9;i++)a+=P(`M${77+i*11} ${79+(i<2?6:0)}q8 4 6 21l-5 12l-3-20Z`,shade(c,-.58));
 a+=leg(86,slim?103:114,slim?44:33,c,slim?8:11,0)+leg(158,slim?102:113,slim?45:34,c,slim?8:11,PI);
 if(o.lion)a+=P('M155 58Q183 38 207 60L214 93L200 124L178 117L160 122L151 100Z','#917047');
 a+=ear(173,66,c,snow?8:7,snow?9:11,!snow&&!o.lion)+ear(195,65,c,snow?8:7,snow?9:11,!snow&&!o.lion)+E(184,83,26,25,c)+E(202,95,18,12,shade(c,.5))+eye(197,80)+nose(216,94,4)+L('M215 98q-5 5-11 1',shade(c),1)+whiskers(205,98);
 if(o.cheetah)a+=L('M195 84L201 96','#4e4738',2.5);if(o.pattern==='ring'||o.pattern==='spots')for(const [x,y]of [[170,76],[180,67],[188,69],[171,88]])a+=E(x,y,1.7,1.8,shade(c,-.53));if(o.pattern==='stripes')a+=P('M173 63l5 17l-7-5M185 61l4 13l-7-4M166 84l15 2l-7 4Z','#554735');return a;
}
function antlers(kind,x=176,y=46){if(kind==='short')return L(`M${x} ${y}l-6-21l-8-5M${x-6} ${y-21}l5-7M${x+16} ${y}l6-22l-3-8M${x+22} ${y-22}l8-5`,'#7c6c51',3);
 if(kind==='palm')return P(`M${x} ${y}l-14-14l-14-4l-5-17l9 9l3-16l6 14l8-13l-1 20l12 13Z`,'#9e8b65')+P(`M${x+15} ${y}l16-14l13-4l5-17l-9 9l-3-16l-6 14l-8-13l1 20l-12 13Z`,'#9e8b65');
 if(kind==='fork')return L('M176 46l-8-14l-11-17M168 32l4-17M157 15l-8-5M157 15l2-8M191 46l8-14l11-17M199 32l-4-17M210 15l8-5M210 15l-2-8','#8c7958',3.2);
 return L(`M${x} ${y}Q${x-8} ${y-20} ${x-27} ${y-30}M${x-11} ${y-17}l-3-15M${x-18} ${y-24}l-14 3M${x+14} ${y}Q${x+25} ${y-20} ${x+38} ${y-30}M${x+24} ${y-17}l-1-16M${x+30} ${y-24}l14 2`,'#8c7958',3.4)+(kind==='caribou'?L(`M${x+13} ${y-2}l14 8l8-3`,'#8c7958',3):'');}
function horns(kind){if(kind==='saola')return L('M168 51Q164 32 160 6M188 51Q190 31 194 6','#575747',3.5);if(kind==='lyre')return L('M170 52Q150 33 164 13Q161 30 174 42M187 52Q207 33 194 13Q197 30 185 42','#535a46',4)+L('M159 24l7 2M160 30l7 2M191 24l7-2M190 30l7-2','#b9ad85',1);
 if(kind==='buffalo')return P('M164 55Q146 54 141 41Q142 66 161 66L178 58L197 65Q216 60 216 40Q208 58 191 53L178 49Z','#84795e');if(kind==='wildebeest')return L('M168 58Q142 70 143 44M184 57Q206 67 211 41','#6b6c59',6);if(kind==='goat')return L('M170 55Q156 35 162 26M184 55Q176 32 185 26','#817456',5);return L('M171 56Q154 49 154 39M187 57Q203 49 203 39','#c3b58e',5);}
function ungulate(o){const c=o.coat,heavy=o.heavy,moose=o.moose;let a='';
 if(o.antlers){
  if(o.tailWhite)a+=J('tail',69,95,L('M0 0l-15-5','#f1ead6',12)+(o.bigEars?L('M-12-4l-5-2','#4a4435',6):''),0,4);
  else if(o.fallow)a+=J('tail',69,95,P('M0-5Q-12-3-13 9L-10 25L-4 23L1 9L5 0Z','#eee6cd')+L('M-3-2Q-10 10-7 22','#514839',3),0,4);
  else if(!o.noTail)a+=J('tail',69,95,P('M0-4Q-12-7-13 3L-9 13Q-1 11 4 0Z',c),0,4);
 }else a+=J('tail',69,95,L(o.beard&&!heavy?'M0 0l-12-12':'M0 0Q-17 15-12 32',c,5)+(!o.beard||heavy?E(-12,32,4,6,shade(c)):''),0,5);
 a+=leg(86,101,46,shade(c),heavy?12:7,PI,true)+leg(153,102,45,shade(c),heavy?12:7,0,true)+E(119,89,heavy?61:54,heavy?32:26,c)+P('M146 97Q163 71 163 52L183 48L191 86L170 114Z',c);
 if(o.wool)for(let i=0;i<17;i++)a+=E(73+(i%7)*14,73+Math.floor(i/7)*16,14,14,'#e6dfcd');if(o.rump)a+=E(72,93,12,20,o.noTail||o.fallow?'#eee7d2':'#e3d9ba')+(o.fallow?L('M69 74Q84 76 85 94Q85 106 79 111','#514839',3):'');if(o.spotted)a+=marks(115,83,49,19,'#efe5ca','spots',24);
 if(o.patch)a+=P('M79 74Q98 59 107 79L99 103L79 106Z','#6d6250')+P('M128 77Q153 64 161 84L151 107L133 99Z','#6d6250');
 if(o.band)a+=P('M78 99Q120 108 153 94L156 104Q122 118 80 109Z','#443e30');if(o.mane)a+=P('M155 100L147 82L158 70L164 52L177 55L175 100Z',shade(c));if(o.caribou)a+=P('M153 102Q163 67 163 54L178 55L182 98L167 117Z','#ddd6bc');
 a+=leg(84,105,42,c,heavy?13:8,0,true)+leg(154,105,42,c,heavy?13:8,PI,true);if(o.impala)a+=L('M83 129v14M155 129v14','#403d30',3);if(o.saola)a+=P('M80 137h8v6h-8M150 137h9v6h-9','#eee5cb');
 if(o.antlers)a+=antlers(o.antlers);if(o.horn)a+=horns(o.horn);a+=ear(164,55,c,o.bigEars?13:10,o.bigEars?24:15,true)+ear(185,57,c,o.bigEars?12:10,o.bigEars?23:14,true)+P(moose?'M164 55Q189 49 200 64L219 90Q222 111 201 109L180 94L164 85Z':'M164 55Q186 50 195 66L213 80Q221 91 208 98L184 88L168 80Z',c);
 if(o.springbok||o.saola)a+=P('M175 57L190 67L197 84L190 87L178 74Z','#eee8d1');if(o.saola)a+=E(167,70,5,8,'#eee8d1');a+=eye(190,68)+nose(moose?215:214,moose?99:86,heavy?7:5);if(o.beard||moose)a+=P(moose?'M179 92l-1 20l8-5l5-14Z':'M187 91l-5 20l12-6l2-13Z',shade(c));if(o.wool)a+=E(182,67,14,8,'#e6dfcd');return a;}
function equid(o){const c=o.coat;let a=tail(69,91,'M0 0Q-13 18-12 44',shade(c,-.4),o.donkey?4:13);if(o.donkey)a+=E(57,133,5,7,'#554e3d');a+=leg(88,101,46,shade(c),9,PI,true)+leg(154,99,48,shade(c),9,0,true)+E(120,88,57,28,c)+P('M145 95L158 49L174 44L190 82L174 108Z',c)+P(o.donkey||o.zebra||o.przewalski?'M155 75L150 68L155 61L151 54L159 44L169 39L174 45L165 64L162 83Z':'M157 46Q141 59 146 93L157 105Q152 76 170 50Z','#514c3e');
 if(o.zebra){for(let i=0;i<11;i++)a+=P(`M${72+i*9} 65q7 6 5 22l-6 27l-5-3l6-27Z`,'#42483f');a+=L('M160 60l17 6M156 74l25 8M153 89l23 7','#42483f',4);}
 a+=leg(86,105,42,o.przewalski?'#554a39':c,9,0,true,'leg',o.zebra?'zebra':'')+leg(155,104,43,o.przewalski?'#554a39':c,9,PI,true,'leg',o.zebra?'zebra':'');
 a+=ear(169,48,c,7,o.donkey?31:18,true)+ear(185,49,c,6,o.donkey?30:17,true)+P('M163 48Q177 38 191 52L217 84Q224 99 211 104L192 95L171 78Z',c)+E(211,94,13,9,o.przewalski||o.donkey?'#ddd3b8':shade(c,.2))+eye(189,60)+nose(219,93,3)+L('M210 101h8',shade(c),1);if(o.zebra)a+=L('M176 48l16 12M181 62l21 9M186 75l22 8','#42483f',4);if(o.donkey)a+=L('M91 70l1 32M74 83h38','#605b4b',3);return a;}
function camel(o){const c=o.coat;let a=tail(72,94,'M0 0Q-13 15-8 29',shade(c),5)+leg(91,102,45,shade(c),10,PI)+leg(151,102,45,shade(c),9,0)+E(120,89,53,28,c);if(o.hump)a+=P('M81 83Q93 67 100 43Q113 25 127 52L146 83Z',c);else for(let i=0;i<15;i++)a+=E(78+(i%6)*15,76+Math.floor(i/6)*15,13,13,c);
 a+=P('M147 106Q159 77 151 53Q149 28 171 24L186 37Q172 51 178 72Q188 99 164 116Z',c)+leg(90,108,39,c,11,0)+leg(151,108,39,c,9,PI)+ear(165,30,c,6,o.alpaca?19:o.llama?23:11,true)+ear(181,31,c,6,o.alpaca?18:o.llama?22:11,true)+E(179,37,22,18,c)+E(197,46,o.hump?18:o.llama?14:10,9,shade(c,.15))+eye(190,33)+nose(o.hump?214:o.llama?209:203,46,3);if(o.hump)a+=L('M183 46Q193 56 206 51',shade(c),1.2);return a;}
function bear(o){const c=o.coat,polar=o.polar;let a=E(69,109,7,6,c)+leg(89,113,34,o.panda?'#333c34':shade(c),18,PI)+leg(162,112,35,o.panda?'#333c34':shade(c),17,0)+P(o.brown?'M65 94Q79 72 111 80Q133 53 155 77Q173 88 180 110Q141 134 91 123L68 116Z':'M66 95Q83 73 122 78Q161 72 181 98L185 118Q145 133 93 125L69 117Z',c);if(o.panda)a+=P('M145 77Q166 78 181 96L183 116L163 121L144 104Z','#3c433b');if(o.sloth)for(let i=0;i<13;i++)a+=P(`M${75+i*7} 121l-2 10l9-8Z`,c);
 a+=leg(88,118,29,o.panda?'#3c433b':c,19,0)+leg(162,116,31,o.panda?'#3c433b':c,19,PI)+ear(177,72,o.panda?'#3c433b':c,polar?6:9,polar?7:9)+ear(202,72,o.panda?'#3c433b':c,polar?6:9,polar?7:9)+E(190,91,polar?30:29,27,c)+E(polar?217:212,105,polar?21:17,11,o.sloth?'#d8cbae':shade(c,.25));if(o.panda)a+=E(203,88,9,11,'#3c433b');a+=eye(204,88)+nose(polar?235:226,104,6)+L('M219 112q6 3 11-1',shade(c),1);if(o.sun)a+=P('M167 111Q180 128 193 111L190 124Q177 137 166 119Z','#d3a66d');if(o.sloth)a+=P('M162 111L175 121L188 110L184 127L174 133L163 124Z','#e4d6b9');return a;}
function pig(o){const c=o.coat;let a=o.boar||o.warthog?tail(71,105,'M0 0Q-17 1-20-16',shade(c),4):tail(70,107,'M0 0q-15-13-19-2q-1 11 9 7q7-4 0-8',c,4);a+=leg(89,117,30,shade(c),11,PI,true)+leg(155,117,30,shade(c),11,0,true)+E(119,104,57,35,c);if(o.boar||o.warthog)a+=P('M76 82l5-9l6 7l5-10l7 7l4-10l7 8l6-10l4 10l9-4l6 12Z',shade(c));a+=ear(166,83,c,11,19,true)+ear(189,82,c,10,18,true)+E(179,105,31,29,c)+E(o.boar?218:214,115,o.warthog?23:18,o.warthog?17:13,shade(c,.2))+E(o.boar?224:222,113,3,4,shade(c))+E(o.boar?213:211,114,3,4,shade(c))+eye(189,98);if(o.boar||o.warthog)a+=P(o.warthog?'M202 125Q216 120 211 98Q228 121 205 137Z':'M201 126Q208 118 207 112Q216 122 203 132Z','#eee4c7');if(o.warthog)a+=E(192,108,8,6,shade(c,.13))+E(181,115,6,5,shade(c,.13));return a+leg(87,121,26,c,12,0,true)+leg(156,121,26,c,12,PI,true);}
function elephant(o){const c=o.coat;let a=tail(65,92,'M0 0Q-19 16-15 43',shade(c),4)+E(50,136,4,7,shade(c))+leg(89,109,38,shade(c),21,PI)+leg(155,108,39,shade(c),20,0)+E(117,86,64,43,c)+E(179,78,35,36,c);if(!o.african)a+=E(165,51,17,13,c)+E(188,51,17,13,c);
 a+=J('ear',165,73,o.african?P('M7-28Q-42-33-40-2Q-37 34-2 35L17 13Z',shade(c,.12))+L('M-17-17Q-37 4-13 25',shade(c),1.4):P('M8-18Q-27-23-25 3Q-23 26 1 25L16 8Z',shade(c,.12)),0,3)+J('trunk',200,79,P('M-7-12Q21-10 23 14L22 44Q25 56 35 48Q42 44 45 50Q39 70 22 63Q8 60 9 42L8 17L-6 8Z',c)+L('M16 32h7M16 40h7M18 49l7-2',shade(c),1),0,2);
 a+=o.african?P('M195 98Q219 123 231 109Q215 139 193 107Z','#f1e6c8'):P('M198 100Q212 117 219 110Q211 126 197 108Z','#eee3c8');a+=eye(190,74)+leg(88,115,32,c,22,0)+leg(155,113,34,c,21,PI);for(const x of [84,91,151,158])a+=E(x,146,3,2,'#dad1b8');return a;}
function rhino(o){const c=o.coat;let a=tail(66,104,'M0 0Q-12 12-11 27',shade(c),4)+leg(87,116,31,shade(c),18,PI,true)+leg(154,116,31,shade(c),17,0,true)+E(118,98,64,40,c)+P('M159 89Q175 67 199 84L231 112L230 133L199 138L173 123Z',c)+ear(174,84,c,8,17,true)+ear(193,88,c,7,16,true)+P('M218 111Q231 83 232 71Q242 102 235 119Z','#d9cfb1')+P('M205 101Q214 86 213 79Q223 94 218 109Z','#c9bea0')+eye(201,99)+nose(233,127,4)+L('M207 135h25',shade(c),1.2)+L('M89 81Q80 105 88 126M154 80Q144 109 155 127',shade(c),2);if(o.sumatran)for(let i=0;i<16;i++)a+=L(`M${66+i*7} ${78+Math.sin(i*.5)*7}l-1-5`,'#8e6c4c',1);return a+leg(86,122,25,c,19,0,true)+leg(153,120,27,c,18,PI,true);}
function hippo(o){const c=o.coat;return tail(68,106,'M0 0q-11 2-14 14',c,5)+leg(91,120,27,shade(c),17,PI)+leg(154,120,27,shade(c),17,0)+E(116,104,64,36,c)+E(187,110,39,30,c)+E(212,123,34,20,shade(c,.12))+E(177,84,8,8,c)+E(202,86,7,8,c)+eye(197,99)+E(236,118,3,4,shade(c))+L('M190 137q24 6 48-1',shade(c),1.5)+leg(89,125,22,c,19,0)+leg(153,125,22,c,19,PI);}
function tapir(o){const c=o.coat;return E(70,111,5,5,c)+leg(91,115,32,shade(c),11,PI,true)+leg(153,118,29,shade(c),11,0,true)+P('M62 104Q61 64 99 69Q139 65 168 96L178 119Q138 136 90 127Q66 123 62 104Z',c)+ear(172,81,c,8,14)+ear(190,83,c,7,13)+E(183,104,28,25,c)+P('M197 96Q228 100 231 123Q231 134 221 133L212 119L196 115Z',c)+L('M210 123l12 7','#ddd1b6',2)+eye(195,100)+nose(229,126,3.5)+leg(90,121,26,c,12,0,true)+leg(153,123,24,c,12,PI,true)+L('M166 71q6-6 12 1M184 73q6-5 10 1','#d2c8b1',2);}
function giraffe(o){const c=o.coat;let a=tail(73,85,'M0 0Q-15 12-10 39',shade(c),4)+E(63,126,4,7,'#594e3b')+leg(92,90,57,shade(c),7,PI,true)+leg(147,87,60,shade(c),7,0,true)+E(118,79,48,25,c)+P('M143 87L158 28L174 23L181 84L161 105Z',c);a+=[[86,77],[105,69],[126,70],[143,82],[104,90],[125,91]].map(([x,y])=>P(`M${x-6} ${y-6}l10-2l6 8l-7 8l-10-3Z`,'#8b6741')).join('')+P('M158 47l12-3l2 14l-14 5Z','#8b6741')+P('M154 69l18-5l2 16l-20 7Z','#8b6741')+leg(91,95,52,c,8,0,true)+leg(148,92,55,c,8,PI,true)+ear(165,26,c,9,12,true)+ear(181,27,c,9,12,true)+L('M167 25l-2-17M180 25l4-17','#92764f',4)+E(165,8,4,4,'#61543d')+E(184,8,4,4,'#61543d')+E(181,36,22,17,c)+E(203,44,18,9,'#d6bd88')+eye(192,31)+nose(218,43,3);return a;}
function okapi(o){const c=o.coat;let a=tail(69,85,'M0 0Q-13 20-10 43',shade(c),4)+E(59,129,4,7,'#413a2d')+leg(89,96,51,shade(c),8,PI,true)+leg(151,94,53,shade(c),8,0,true)+E(115,84,49,27,c)+P('M142 95L151 42L166 31L180 45L175 97L160 110Z',c)+P('M66 82Q84 77 103 89L103 111L70 105Z','#e3dcc5');for(let i=0;i<6;i++)a+=L(`M71 ${83+i*4}Q87 ${80+i*4} 102 ${89+i*4}`,c,2.5);a+=leg(88,102,45,c,8,0,true,'leg','okapi')+leg(152,102,45,c,8,PI,true,'leg','okapi');return a+ear(156,34,c,11,25,true)+ear(177,34,c,11,24,true)+E(173,47,23,20,'#a68b67')+E(191,60,19,10,'#d2c39e')+eye(183,43)+nose(207,59,3)+L('M159 29l-1-8M171 28l2-8','#d4c5a4',3);}
function kangaroo(o){const c=o.coat;return J('tail',102,117,P('M6-9Q-17 6-69 23Q-78 27-77 31Q-24 32 23 7Z',c),0,3)+J('hop-leg',132,116,E(0,0,21,27,shade(c))+P('M-5 19L18 29L47 29Q55 34 44 35L13 35L-12 24Z',shade(c)),0,10)+P('M105 123Q99 92 134 69L156 49L170 52L165 87L157 128Z',c)+E(145,108,20,27,shade(c,.2))+J('hop-leg',119,117,E(0,0,23,27,c)+P('M-7 18L17 29L52 29Q60 34 49 36L9 36L-14 25Z',c),0,12)+J('leg',160,81,L('M0 0l-6 20l13 8',shade(c),7),PI,7)+ear(160,44,c,8,o.wallaby?25:30,true)+ear(179,44,c,7,o.wallaby?24:28,true)+E(171,56,22,19,c)+E(189,67,18,9,shade(c,.15))+eye(184,53)+nose(204,67,4);}
function wombat(o){const c=o.coat;return E(67,117,5,4,c)+leg(90,124,23,shade(c),14,PI)+leg(157,124,23,shade(c),14,0)+E(117,110,61,35,c)+ear(174,91,c,8,10)+ear(195,92,c,7,9)+E(182,112,32,29,c)+E(203,119,20,15,shade(c,.12))+P('M205 110q13-3 16 6l-3 8l-14-1Z','#534c40')+eye(194,105)+leg(88,128,19,c,15,0)+leg(157,128,19,c,15,PI);}
function koala(o){const c=o.coat;return leg(105,122,25,shade(c),13,PI)+leg(152,122,25,shade(c),12,0)+E(125,108,43,34,c)+E(151,119,25,20,'#dce0cd')+E(165,64,18,20,c)+E(198,64,18,20,c)+E(165,64,12,15,'#dbe0d0')+E(198,64,12,15,'#dbe0d0')+E(183,90,33,31,c)+E(189,94,10,16,'#41483e')+eye(169,83)+eye(203,83)+leg(103,128,19,c,14,0)+leg(153,126,21,c,13,PI);}
function meerkat(o){const c=o.coat;return tail(113,126,'M0 0Q-36 16-54 14',shade(c),7)+leg(122,123,24,shade(c),9,PI)+E(139,100,25,39,c)+E(147,108,15,31,'#d9c7a3')+leg(143,124,23,c,9,0)+J('leg',151,86,L('M0 0l8 19l-9 9',c,7),PI,6)+ear(154,55,c,6,8)+ear(179,57,c,6,8)+E(168,69,22,21,c)+E(182,79,13,8,c)+E(178,67,7,7,'#5c5745')+eye(179,67)+nose(194,79,3);}
function armadillo(o){const c=o.coat;let a=tail(74,115,'M0 0Q-31 3-53 23',shade(c),7)+leg(96,123,24,shade(c),8,PI)+leg(154,123,24,shade(c),8,0)+P('M66 114Q67 72 110 72Q153 70 168 113L159 128H75Z',c)+P('M78 113Q80 82 105 79L105 126H79Z',shade(c,.15));for(let i=0;i<9;i++)a+=L(`M${104+i*5} ${77+i*.6}Q${100+i*5} 102 ${104+i*5} 127`,shade(c),1.5);return a+P('M155 104Q176 90 193 111L217 125L211 132L178 126L157 123Z',c)+ear(169,101,c,6,25,true)+ear(181,103,c,5,22,true)+eye(190,113,2)+nose(216,126,3)+leg(94,127,20,c,8,0)+leg(153,127,20,c,8,PI)+L('M95 147l8 4M100 145l9 3M153 147l8 4M158 145l8 3','#ece0c3',2);}
function anteater(o){const c=o.coat;return J('tail',86,105,P('M5-9Q-30-14-58 23L-65 37Q-25 47 13 15Z',c)+L('M-45 28l27-16M-37 33l31-15',shade(c,.2),2),0,3)+leg(109,117,30,shade(c),12,PI)+leg(165,114,33,shade(c),11,0)+E(128,99,49,30,c)+P('M154 91Q171 76 193 91L247 117Q253 124 243 126L194 111L168 112Z',c)+P('M132 77L171 90L165 113L137 124L124 117L150 97L125 89Z','#e3dcc6')+P('M134 81L167 93L161 110L139 120L131 115L154 98Z','#3e4238')+E(179,87,6,9,c)+eye(191,96,2.2)+nose(246,121,2.5)+leg(107,124,23,c,12,0)+leg(166,120,27,c,11,PI)+L('M169 146l9 4M174 144l9 3','#e8ddbf',2);}
function primate(o){const c=o.coat,orang=o.orangutan,g=o.gorilla,bon=o.bonobo,monkey=o.mandrill||o.gelada;let a='';if(o.gelada)a+=tail(92,108,'M0 0Q-28 17-44 8',c,7)+E(49,116,5,6,shade(c));if(o.mandrill)a+=tail(94,109,'M0 0q-9-4-12 2',c,5);
 a+=J('leg',116,110,P('M-9 0Q-17 20-12 35H4Q8 30-2 28L7 10Z',shade(c)),PI,8)+J('leg',159,82,P('M-9 0Q-18 29-13 61H3L4 52L8 4Z',shade(c)),0,7)+P(orang?'M93 110Q80 70 117 58Q146 52 166 77L166 114Q140 133 101 128Z':g?'M85 108Q85 63 128 61Q161 60 174 96L166 123Q124 138 93 123Z':'M103 113Q101 70 134 65Q155 68 169 96L163 124L118 130Z',c);if(g)a+=P('M94 84Q116 69 145 78L151 100L118 106L95 103Z','#8c9187');if(o.gelada)a+=P('M152 82L164 86L166 109L154 117L145 105Z','#b5695a');
 a+=J('leg',112,113,P('M-9 0Q-18 17-11 32H10Q15 27 2 24L10 5Z',c),0,8)+J('leg',162,87,P(orang?'M-11 0Q-24 21-19 55L-4 59L8 56L3 47L0 6Z':'M-10 0Q-17 24-11 57H7Q12 52 1 48L9 4Z',c),PI,8);if(orang)for(let i=0;i<11;i++)a+=P(`M${90+i*7} 118l-4 11l9-5Z`,c);
 a+=E(169,66,monkey?24:28,monkey?25:28,c)+E(158,65,6,8,shade(c,.25));if(orang)a+=E(153,70,12,19,shade(c))+E(189,70,12,18,shade(c));a+=E(177,72,monkey?18:21,monkey?22:21,bon?'#514c43':shade(c,.3));if(monkey)a+=P('M175 63L199 77L203 94L185 102L173 85Z',shade(c,.2));
 if(o.mandrill)a+=L('M181 69l13 18','#bd695b',6)+L('M176 73l8 15M184 69l13 13','#7c9ba9',4)+P('M175 94L187 108L202 98L196 102L182 99Z','#cab174');else a+=E(185,83,15,10,bon?'#777065':shade(c,.22))+L('M174 88q11 6 21 0',bon?'#ca978c':shade(c),1.6);
 a+=eye(179,63)+eye(190,65,2.3);if(bon)a+=P('M153 45Q164 29 173 43Q181 28 191 44L173 40Z','#333b33');return a;}
function lemur(o){const c=o.coat;return J('tail',83,107,L('M0 0Q-34-21-38-62Q-40-84-54-81','#e8e5d3',13)+L('M-14-12l-6 9M-26-29l-9 7M-34-47l-11 2M-38-66l-12-2M-44-80l-5-8','#3d443b',7),0,5)+leg(102,115,32,shade(c),8,PI)+leg(155,115,32,shade(c),7,0)+E(122,103,43,29,c)+E(153,111,25,20,'#dddccc')+ear(166,75,'#e8e4d2',8,13,true)+ear(186,75,'#e8e4d2',8,13,true)+E(178,92,25,24,'#e8e4d2')+E(169,89,8,10,'#494c41')+E(187,88,8,10,'#494c41')+eye(170,87)+eye(188,87)+E(187,104,13,9,'#f0e8d6')+nose(197,103,4)+leg(100,121,26,c,9,0)+leg(155,120,27,c,8,PI);}
const renderers={rabbit,small,hedgehog,canid,cat,ungulate,deer:ungulate,equid,camel,bear,pig,elephant,rhino,hippo,tapir,giraffe,okapi,kangaroo,wombat,koala,meerkat,armadillo,anteater,primate,lemur};
export function drawMammal(s){const o=MAMMAL_PROFILES[s.name];if(!o||s.water)return null;return renderers[o.form](o);}
export function mammalMotion(s){const o=MAMMAL_PROFILES[s.name];if(!o||s.water)return null;return ['rabbit','kangaroo'].includes(o.form)?'hop':'walk';}
