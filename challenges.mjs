import {CHALLENGE_KEY,LEGACY_CHALLENGE_KEY,restoreChallenge,startChallenge,resetChallenge,advanceChallenge,endChallenge,challengeStatus,formatTime} from './challenge-model.mjs';
import {durationFromFields,formatTimer} from './timer-model.mjs';
import {initDecorations} from './meadow-decor.mjs';
export function initChallenges({announce,onInteract,onListen,onTimer,getMode,getPresent}){
 const $=id=>document.getElementById(id),dialog=$('challengeDialog'),decor=initDecorations($('world'));
 let raw=null,storageOK=true;
 try{const saved=localStorage.getItem(CHALLENGE_KEY);raw=JSON.parse(saved??localStorage.getItem(LEGACY_CHALLENGE_KEY)??'null');}catch{storageOK=false;}
 const state=restoreChallenge(raw);let saveClock=0,celebrateTimer=0,lastContext={};
 const fields=[$('animalGoalHours'),$('animalGoalMinutes'),$('animalGoalSeconds')];
 const say=(id,text)=>{if($(id).textContent!==text)$(id).textContent=text;};
 const duration=()=>durationFromFields(...fields.map(f=>f.value));
 const validTarget=()=>{const n=Number($('animalGoalTarget').value);return Number.isInteger(n)&&n>=1&&n<=210;};
 const locked=()=>state.started&&!state.finished;
 function save(){
  try{localStorage.setItem(CHALLENGE_KEY,JSON.stringify(state));storageOK=true;}catch{storageOK=false;}
  say('challengeSave',storageOK?'Your goal and best count save on this device. Reopening pauses the goal.':'Saving is unavailable. This goal will last for this visit.');
 }
 function syncFields(){
  $('challengeKind').value=state.type;$('challengeMinutes').value=state.goal/60;$('animalGoalTarget').value=state.target;
  fields[0].value=Math.floor(state.duration/3600);fields[1].value=Math.floor(state.duration/60)%60;fields[2].value=state.duration%60;
  $('showChallenge').checked=state.show;
 }
 function render(context=lastContext){
  const animal=state.type==='animals',busy=locked(),value=animal?state.peak:state.earned,max=animal?state.target:state.goal;
  const time=animal?formatTimer(state.duration-state.elapsed)+' left':formatTime(state.earned)+' / '+formatTime(state.goal);
  const label=challengeStatus(state,context);
  say('challengeHudTitle',animal?'Animal goal':'Quiet goal');say('challengeTime',time);say('challengeDialogTime',time);
  say('challengeState',label);say('challengeDialogState',label);
  say('challengeAnimalBest',state.peak+' / '+state.target);say('challengeAnimalCurrent',String(state.current));
  say('challengeAnimalCurrentLabel',state.finished?'Count at finish':'New visitors here');
  say('challengeHudDetail','Best '+state.peak+' / '+state.target+' · '+(state.finished?'Final ':'Here ')+state.current);
  $('challengeHudDetail').hidden=!animal;$('challengeAnimalStats').hidden=!animal;
  for(const id of ['challengeProgress','challengeDialogProgress']){$(id).max=max;$(id).value=Math.min(value,max);$(id).setAttribute('aria-valuetext',animal?'Best '+state.peak+' new animals; target '+state.target:time+' quiet time');}
  $('challengeHud').hidden=!state.show||!state.started;
  say('challengeToggle',state.active?'Pause goal':state.finished?'Start another goal':state.started?'Resume goal':'Start goal');
  $('challengeReset').hidden=!state.started;
  say('challengeReset',state.finished?'Set a new goal':'Reset this goal');
  $('challengeSetup').hidden=state.started;$('challengeSummary').hidden=!state.started;
  say('challengeSummary',animal?'Animal goal · '+state.target+' new visitors in '+formatTimer(state.duration):'Quiet goal · '+formatTime(state.goal)+' of quiet time');
  $('challengeEnd').hidden=!state.started||state.finished;
  $('quietGoalFields').hidden=animal;$('animalGoalFields').hidden=!animal;
  say('challengeDescription',animal?'Keep your highest number of new visitors present together during the time limit.':'Build up quiet time for your class. Noise pauses progress without taking any away.');
  $('challengeKind').disabled=busy;$('challengeMinutes').disabled=busy||animal;$('animalGoalTarget').disabled=busy||!animal;for(const f of fields)f.disabled=busy||!animal;
  say('challengeMinutesValue',$('challengeMinutes').value+' min');
  $('challengeEditHelp').hidden=!busy;
  const invalid=!busy&&animal&&(!validTarget()||duration()===null);
  $('challengeInputError').hidden=!invalid;$('challengeToggle').disabled=invalid;
  say('challengeWins',state.completed+' '+(state.completed===1?'goal':'goals')+' completed');
 }
 function updateOptions(){
  if(locked())return;
  // Keep the finished result visible until the user changes the next goal.
  if(state.finished)resetChallenge(state);
  state.type=$('challengeKind').value==='quiet'?'quiet':'animals';state.goal=Number($('challengeMinutes').value)*60;
  if(validTarget())state.target=Number($('animalGoalTarget').value);if(duration()!==null)state.duration=duration();
  save();render();
 }
 $('challengeButton').onclick=()=>{onInteract();render();dialog.showModal();};
 $('showChallenge').onchange=()=>{state.show=$('showChallenge').checked;save();render();};
 for(const el of [$('challengeKind'),$('challengeMinutes'),$('animalGoalTarget'),...fields])el.addEventListener('input',updateOptions);
 $('challengeForm').onsubmit=async event=>{
  event.preventDefault();
  if(state.active){state.active=false;save();render();return;}
  if(!locked()){
   if($('challengeKind').value==='animals'&&(!validTarget()||duration()===null))return;
   startChallenge(state,{type:$('challengeKind').value,minutes:$('challengeMinutes').value,target:$('animalGoalTarget').value,duration:duration()},getPresent());
  }else state.active=true;
  save();render();clearTimeout(celebrateTimer);$('challengeCelebration').hidden=true;
  announce(state.type==='animals'?'Animal goal started. Your best count will be kept for the full time limit.':'Quiet goal started. Quiet moments will add up.');
  dialog.close();onInteract();if(getMode()!=='live')await onListen();
 };
 function resetCurrent(){resetChallenge(state);clearTimeout(celebrateTimer);$('challengeCelebration').hidden=true;save();render();}
 $('challengeReset').onclick=()=>{resetCurrent();announce('Current goal reset. Your meadow visitors are kept.');};
 $('challengeEnd').onclick=()=>showResult(endChallenge(state));
 $('challengeTimer').onclick=()=>{dialog.close();onTimer();};
 function showResult(result){
  if(!result)return;
  save();render();
  const intro=result.endedEarly?(result.success?'Goal ended · target reached!':'Goal ended · target not reached.'):(result.success?'Goal complete!':'Time’s up · target not reached.');
  const message=intro+(result.type==='animals'?' Best: '+result.peak+' / '+result.target+'.':'');
  announce(message);$('challengeCelebration').textContent=message;$('challengeCelebration').hidden=false;
  clearTimeout(celebrateTimer);celebrateTimer=setTimeout(()=>{$('challengeCelebration').hidden=true;},7000);
 }
 function tick(dt,context){
  lastContext=context;const result=advanceChallenge(state,dt,{...context,present:getPresent()});render(context);
  saveClock+=dt;if(saveClock>=2){saveClock=0;if(state.active)save();}
  showResult(result);
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden)save();});window.addEventListener('pagehide',save);
 syncFields();save();decor.render(state.legacyDecorations);render();
 return {tick,getFlowers:decor.getFlowers,persist:save,resetCurrent};
}
