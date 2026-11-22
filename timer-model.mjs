export const TIMER_KEY='quiet-mouse-countdown-v16';
export const MAX_TIMER_SECONDS=24*60*60;
export function durationFromFields(hours,minutes,seconds){
 const values=[hours,minutes,seconds].map(v=>v===''?0:Number(v));
 if(values.some(v=>!Number.isFinite(v)||!Number.isInteger(v)))return null;
 const [h,m,s]=values,total=h*3600+m*60+s;
 return h>=0&&h<=24&&m>=0&&m<60&&s>=0&&s<60&&total>=1&&total<=MAX_TIMER_SECONDS?total:null;
}
export function restoreTimer(raw){
 const duration=Number.isInteger(raw?.duration)&&raw.duration>=1&&raw.duration<=MAX_TIMER_SECONDS?raw.duration:300;
 const remaining=typeof raw?.remaining==='number'&&Number.isFinite(raw.remaining)?Math.max(0,Math.min(duration,raw.remaining)):duration;
 return {duration,remaining,running:false,finished:remaining===0,show:raw?.show!==false};
}
export function stepTimer(state,elapsed){
 if(!state.running||!Number.isFinite(elapsed)||elapsed<=0)return false;
 state.remaining=Math.max(0,state.remaining-elapsed);
 if(state.remaining===0){state.running=false;state.finished=true;return true;}
 return false;
}
export function formatTimer(seconds){
 const total=Math.max(0,Math.ceil(seconds)),h=Math.floor(total/3600),m=Math.floor(total/60)%60,s=total%60;
 return (h?h+':':'')+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
}
