import {CHALLENGE_KEY,REWARDS,restoreChallenge,startChallenge,advanceChallenge,challengeStatus,formatTime} from './challenge-model.mjs';
import {DECOR_ART,initDecorations} from './meadow-decor.mjs';
export function initChallenges({announce,onInteract,onListen,getMode}){
 const $=id=>document.getElementById(id),decor=initDecorations($('world'));
 let raw={},storageOK=true;try{raw=JSON.parse(localStorage.getItem(CHALLENGE_KEY)||'{}');}catch{storageOK=false;}
 const state=restoreChallenge(raw);let lastStatus='',lastSecond=-1,saveClock=0,celebrateTimer=0;
 function save(){try{localStorage.setItem(CHALLENGE_KEY,JSON.stringify(state));storageOK=true;}catch{storageOK=false;}
  const savedMessage=storageOK?'Goals and earned decorations save in this browser. Reloading pauses the challenge.':'Saving is unavailable. This challenge and its rewards will last for this visit.';
  if($('challengeSave').textContent!==savedMessage)$('challengeSave').textContent=savedMessage;
 }
 function renderRewards(){
  $('challengeWins').textContent=state.completed+' '+(state.completed===1?'goal':'goals')+' completed';
  const list=$('rewardList');list.replaceChildren();
  REWARDS.forEach((r,i)=>{
   const unlocked=state.completed>i,card=document.createElement('div');card.className='reward-card'+(unlocked?'':' reward-locked');
   const picture=document.createElement('div');picture.className='reward-picture';picture.innerHTML=DECOR_ART[r.id];
   const info=document.createElement('div'),title=document.createElement('strong'),desc=document.createElement('p');title.textContent=r.name;desc.textContent=unlocked?r.description:`Complete ${i+1} ${i?'goals':'goal'} to unlock.`;info.append(title,desc);card.append(picture,info);
   if(unlocked){const toggle=document.createElement('button');toggle.type='button';toggle.className='reward-toggle';const shown=!state.hidden.includes(r.id);toggle.textContent=shown?'Shown':'Show';toggle.setAttribute('aria-label',(shown?'Hide ':'Show ')+r.name);toggle.setAttribute('aria-pressed',String(shown));toggle.onclick=()=>{state.hidden=shown?[...state.hidden,r.id]:state.hidden.filter(id=>id!==r.id);save();renderRewards();decor.render(state);};card.append(toggle);}
   list.append(card);
  });
 }
 function render(context={}){
  const label=challengeStatus(state,context),seconds=Math.floor(state.earned);
  if(label!==lastStatus||seconds!==lastSecond){
   const time=formatTime(state.earned)+' / '+formatTime(state.goal);
   $('challengeTime').textContent=time;$('challengeDialogTime').textContent=time;
   if(label!==lastStatus){$('challengeState').textContent=label;$('challengeDialogState').textContent=label;}
   for(const id of ['challengeProgress','challengeDialogProgress']){$(id).max=state.goal;$(id).value=state.earned;$(id).setAttribute('aria-valuetext',time+' quiet time');}
   lastStatus=label;lastSecond=seconds;
  }
  $('challengeHud').hidden=!state.show||(!state.active&&state.earned===0&&!state.finished);
  $('challengeToggle').textContent=state.active?'Pause challenge':state.finished?'Start another goal':state.earned>0?'Resume challenge':'Start challenge';
  $('challengeMinutes').disabled=state.active||state.earned>0&&!state.finished;
  $('challengeReset').hidden=state.earned===0&&!state.active&&!state.finished;
 }
 $('challengeMinutes').value=Math.round(state.goal/60);$('showChallenge').checked=state.show;
 $('challengeButton').onclick=()=>{onInteract();$('challengeDialog').showModal();};
 $('showChallenge').onchange=()=>{state.show=$('showChallenge').checked;save();render();};
 $('challengeMinutes').oninput=()=>{$('challengeMinutesValue').textContent=$('challengeMinutes').value+' min';if(!state.active&&state.earned===0&&!state.finished){state.goal=Number($('challengeMinutes').value)*60;lastSecond=-1;render();}};$('challengeMinutes').oninput();
 $('challengeToggle').onclick=async()=>{
  if(state.active){state.active=false;save();render();return;}
  if(state.finished||state.earned===0)startChallenge(state,Number($('challengeMinutes').value));else state.active=true;
  save();render();clearTimeout(celebrateTimer);$('challengeCelebration').hidden=true;announce('Class goal started. Quiet moments will add up toward '+Math.round(state.goal/60)+' minutes.');$('challengeDialog').close();onInteract();
  if(getMode()!=='live')await onListen();
 };
 $('challengeReset').onclick=()=>{state.active=false;state.earned=0;state.finished=false;state.goal=Number($('challengeMinutes').value)*60;save();render();announce('Quiet goal reset. Earned decorations are kept.');};
 function tick(dt,context){
  const result=advanceChallenge(state,dt,context);render(context);
  saveClock+=dt;if(saveClock>=5){saveClock=0;if(state.active)save();}
  if(result){save();renderRewards();decor.render(state);const message=result.reward?`Quiet goal complete! You earned ${result.reward.name.toLowerCase()}.`:'Quiet goal complete! Another peaceful moment for your meadow.';
   announce(message);$('challengeCelebration').textContent=message;$('challengeCelebration').hidden=false;
   clearTimeout(celebrateTimer);celebrateTimer=setTimeout(()=>{$('challengeCelebration').hidden=true;},7000);
  }
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden)save();});window.addEventListener('pagehide',save);
 save();renderRewards();decor.render(state);render();
 return {tick,getFlowers:decor.getFlowers};
}
