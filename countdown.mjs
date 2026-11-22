import {TIMER_KEY,durationFromFields,restoreTimer,stepTimer,formatTimer} from './timer-model.mjs';
export function initCountdown({announce,onInteract=()=>{}}){
 const $=id=>document.getElementById(id),dialog=$('countdownDialog');let failed=false,raw=null;
 try{raw=JSON.parse(localStorage.getItem(TIMER_KEY)||'null');}catch{failed=true;}
 const state=restoreTimer(raw);let last=performance.now(),saveAt=last;
 const fields=[$('countdownHours'),$('countdownMinutes'),$('countdownSeconds')];
 const duration=()=>durationFromFields(...fields.map(f=>f.value));
 const say=(id,text)=>{if($(id).textContent!==text)$(id).textContent=text;};
 function save(){try{localStorage.setItem(TIMER_KEY,JSON.stringify(state));failed=false;}catch{failed=true;}say('countdownSave',failed?'This timer could not be saved. It will last for this visit.':'Saved in this browser. Leaving the page pauses the timer.');}
 function setFields(){fields[0].value=Math.floor(state.duration/3600);fields[1].value=Math.floor(state.duration/60)%60;fields[2].value=state.duration%60;}
 function render(){
  const value=formatTimer(state.remaining),status=state.finished?'Time’s up!':state.running?'Counting down':state.remaining<state.duration?'Paused':'Ready when you are';
  say('countdownValue',value);say('countdownHudValue',value);say('countdownState',status);say('countdownHudState',status);
  const invalid=duration()===null;$('countdownError').hidden=!invalid;
  $('countdownStart').disabled=state.running||invalid;
  $('countdownStart').hidden=state.running;$('countdownPause').hidden=!state.running;
  say('countdownStart',duration()===state.duration&&state.remaining>0&&state.remaining<state.duration?'Resume timer':'Start timer');
  for(const f of fields)f.disabled=state.running;
  const visible=state.show&&(state.running||state.remaining<state.duration||state.finished);
  $('showCountdown').checked=state.show;$('countdownHud').hidden=!visible;
  document.body.classList.toggle('has-countdown',visible);
  $('countdownHud').classList.toggle('timer-finished',state.finished);
 }
 function tick(){const now=performance.now(),dt=(now-last)/1000;last=now;if(document.hidden||!state.running)return;
  const done=stepTimer(state,dt);render();if(done){save();announce('Time’s up! Your classroom timer has finished.');}else if(now-saveAt>=1000){saveAt=now;save();}
 }
 function pause(){tick();if(state.running){state.running=false;save();render();}last=performance.now();}
 function open(){onInteract();if(!dialog.open)dialog.showModal();render();}
 $('countdownButton').onclick=open;
 $('countdownForm').onsubmit=e=>{e.preventDefault();const next=duration();if(next===null||state.running)return;
  if(next!==state.duration||state.remaining<=0){state.duration=next;state.remaining=next;}
  state.finished=false;state.running=true;last=performance.now();saveAt=last;save();render();announce('Timer started.');
 };
 $('countdownPause').onclick=pause;
 $('countdownReset').onclick=()=>{state.running=false;state.remaining=state.duration;state.finished=false;setFields();last=performance.now();save();render();};
 $('showCountdown').onchange=()=>{state.show=$('showCountdown').checked;save();render();};
 for(const f of fields)f.addEventListener('input',render);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){const now=performance.now();if(state.running)stepTimer(state,(now-last)/1000);state.running=false;last=now;save();render();}else last=performance.now();});
 window.addEventListener('pagehide',()=>{pause();save();});
 setFields();render();say('countdownSave',failed?'Saved timer could not be restored.':'Saved in this browser. Leaving the page pauses the timer.');setInterval(tick,100);
 return {isEditing:()=>dialog.open,open};
}
