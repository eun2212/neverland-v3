/* Short, full-screen danger cue. Background rendering stays unfiltered. */
(function(){
'use strict';
const veil=document.createElement('div');
veil.id='danger-flash';veil.setAttribute('aria-hidden','true');document.body.append(veil);
let timer=null,lastFlash=-Infinity;
function clear(){clearTimeout(timer);timer=null;veil.classList.remove('is-flashing');}
function flash(){
 if(document.body.classList.contains('reduce-motion')||matchMedia('(prefers-reduced-motion: reduce)').matches)return false;
 const now=Date.now();if(now-lastFlash<1800)return false;
 lastFlash=now;clear();veil.classList.add('is-flashing');timer=setTimeout(clear,1600);return true;
}
veil.addEventListener('animationend',clear);
const baseSay=say;
say=function(who,text,...args){
 const result=baseSay(who,text,...args);
 // Exact narrative beats, rather than flashing whenever danger is merely discussed.
 const incident=typeof keeperRideIncidents!=='undefined'&&keeperRideIncidents.some(line=>line[0]===text);
 if(incident||text==='사슬이 비명을 낸다. 배가 기울고, 발밑의 빛이 꺼진다.'||text==='다시 밀려오는 곤돌라. 체셔가 스스로 조작부로 뛰어들어 열린 문을 받치고 내 발을 끌어낸다.')flash();
 return result;
};
const baseHazard=world3d.scriptedWheelHazard;
world3d.scriptedWheelHazard=function(on,...args){const result=baseHazard.call(this,on,...args);if(on)flash();else clear();return result;};
const baseFracture=beginFracture3d;
beginFracture3d=function(...args){const result=baseFracture.apply(this,args);flash();return result;};
const baseNew=newGame;
newGame=function(...args){clear();lastFlash=-Infinity;return baseNew.apply(this,args);};
const baseEnd=end;
end=function(...args){clear();return baseEnd.apply(this,args);};
window.NEVERLAND_DANGER={flash,clear};
})();
