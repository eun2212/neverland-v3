/* Cheshire extension for canonical Neverland v3. No replacement scoring or rides. */
(function(){
'use strict';

const layer=document.createElement('div');layer.id='cheshire-portrait';layer.hidden=true;layer.setAttribute('role','img');layer.innerHTML='<div></div>';$('stage').append(layer);
const filter=document.createElementNS('http://www.w3.org/2000/svg','svg');filter.setAttribute('width','0');filter.setAttribute('height','0');filter.innerHTML='<defs><filter id="crayon-world"><feComponentTransfer result="tones"><feFuncR type="discrete" tableValues=".15 .35 .55 .75 .9"/><feFuncG type="discrete" tableValues=".18 .38 .58 .78 .92"/><feFuncB type="discrete" tableValues=".2 .4 .6 .8 .94"/></feComponentTransfer><feTurbulence type="fractalNoise" baseFrequency=".055 .7" numOctaves="2" seed="8" result="grain"/><feDisplacementMap in="tones" in2="grain" scale="4"/></filter></defs>';document.body.append(filter);
let cast=[],expression='calm',active=false,pending=null;
function memory(){return s.cheshire||(s.cheshire={met:false,separated:false,incident:false,choice:'',evidence:[]});}
function clear(){document.body.classList.remove('cheshire-danger');expression='calm';cast=[];pending=null;active=false;layer.hidden=true;document.body.classList.remove('dialogue-crayon','cheshire-scene');for(const id of ['keeper','cheshire-portrait']){const e=$(id);e.classList.remove('cast-left','cast-right','cast-center','cast-listener');} }
function portrait(who){const id=who==='체셔'?'cheshire-portrait':who==='키퍼'?'keeper':null;
 if(id&&!cast.includes(id)){if(cast.length===1){$(cast[0]).classList.remove('cast-center');$(cast[0]).classList.add('cast-right');}cast.push(id);$(id).classList.add(cast.length===1?'cast-center':'cast-left');}
 layer.hidden=!cast.includes('cheshire-portrait');document.body.classList.toggle('cheshire-scene',cast.includes('cheshire-portrait'));
 $('keeper').style.visibility=cast.includes('keeper')?'':'hidden';
 for(const c of cast)$(c).classList.toggle('cast-listener',!!id&&c!==id);
 layer.dataset.expression=expression;layer.setAttribute('aria-label','체셔 · '+({calm:'도움을 건네는 표정',guarded:'경계와 불신',threat:'절박한 위협',regret:'두려움과 후회'}[expression]));
}
const baseSay=say;say=function(who,text,options){baseSay(who,text,options);if(pending)expression=pending;portrait(who);document.body.classList.toggle('dialogue-crayon',s.phase!=='profile'&&s.phase!=='ending');};
const baseNext=next;next=function(){pending=queue[0]?.[3]||null;const event=queue[0]?.[4];if(event==='danger'){world3d.scriptedWheelHazard(true);document.body.classList.add('cheshire-danger');}if(event==='stop'){world3d.scriptedWheelHazard(false);releaseForcedRide3d();document.body.classList.remove('cheshire-danger');}return baseNext();};
const baseStory=story;story=function(lines,done){clear();active=true;return baseStory(lines,()=>{clear();$('keeper').style.visibility='';done?.();});};
const baseExplore=explore3d;explore3d=function(...args){clear();$('keeper').style.visibility='';return baseExplore(...args);};
const baseNew=newGame;newGame=function(...args){clear();$('keeper').style.visibility='';const r=baseNew(...args);s.cheshire={met:false,separated:false,incident:false,choice:'',evidence:[]};return r;};
const baseEnd=end;end=function(...args){clear();$('keeper').style.visibility='';return baseEnd(...args);};
function meet(done){const m=memory();if(m.met){done?.();return;}m.met=true;
 story([['', '地面에 쪼그려 앉아 숨을 고르자, 긴 남청색 머리의 남자가 일정한 거리를 두고 멈춘다.'.replace('地面','바닥')],['체셔','손이 떨리네요. 물은 밀봉된 거예요. 받을지는 당신이 정해요.',null,'calm'],[s.name,'그는 병을 내 손에 쥐여 주지 않고 벤치에 놓는다. 뚜껑의 봉인이 끊어지지 않았는지 먼저 보여 준다.'],['체셔','체셔예요. 나도 갇혔어요. 퇴근하고 집에 가는 길이었는데, 눈을 뜨니 여기에 있었어요.'],['체셔','방금 배가 멎는 걸 봤어요. 꿈이었다는 말은 못 믿겠어요. 다음에는 안전 고리를 같이 확인해요.'],[s.name,'그는 헐거워진 손잡이를 찾아 조여 준다. 실제로 덜 흔들린다. 잠깐 함께 걷기로 한다.']],done);}
const baseMap=map;map=function(){if(s.phase!=='profile'&&keeperStoryState.dream&&!firstLever3d&&!memory().met){meet(()=>baseMap());return;}return baseMap();};
const baseRequire=requireRide3d;requireRide3d=function(){const m=memory();if(m.met&&!m.separated){m.separated=true;story([['체셔','두 번 이야기했을 뿐인데 문을 잠근다고요? 내가 밖에서 정지 장치를 볼게요.',null,'guarded'],['키퍼','동행인은 반대편 대기선에 있어 주세요. 이 손님은 혼자 타야 해요.'],[s.name,'출입 고리가 닫히며 체셔가 반대쪽 통로로 밀려난다.'],['키퍼','그분을 기다리다가 당신까지 늦을 필요는 없죠.']],()=>baseRequire());return;}return baseRequire();};
function incident(done){const m=memory();if(m.incident){done?.();return;}m.met=true;m.separated=true;m.incident=true;const returnRide=s.ride,returnPlayer=world3d.state.player;world3d.jumpToPark(controls3d[1][0],controls3d[1][1]+5);s.ride=1;world3d.enterRide(1);world3d.forceBoard(1);forcedRide3d=1;sync3d();
 story([['','관람차 승강장. 체셔가 문을 잠그고 조작부에 열쇠를 꽂는다.'],['체셔','당신이 나를 버렸다고 했어요. 한 명만 나갈 수 있다면서요. 여기 멈춰 있어요. 한 걸음이라도 가면 다시 돌릴 거예요.',null,'threat'],[s.name,'체셔가 재운행 스위치를 눌러 곤돌라가 움직인다. 발밑의 문턱이 벌어진다. 그가 직접 만든 위험이다.',null,null,'danger'],['키퍼','제 손님에게서 손 떼세요.'],['','키퍼가 관리자 열쇠로 비상정지를 푼다. 곤돌라가 멎고 그가 나를 승강장 안쪽으로 끌어당긴다.',null,null,'stop'],['키퍼','이제 제 곁에 계세요. 제가 지켜 드릴 테니까.'],['체셔','멈추기만 하면 된다고 했잖아. 당신이 준 열쇠로 붙잡아 두면, 나를 내보내 준다고…….',null,'regret'],['키퍼','그 말을 믿은 건 당신이죠.'],[s.name,'다시 밀려오는 곤돌라. 체셔가 스스로 조작부로 뛰어들어 열린 문을 받치고 내 발을 끌어낸다.'],['체셔','내가 위협했어요. 미안하다는 말로 없어지지 않아요. 지금은 뒤로 물러나요. 손 놓지 않을게요.'],['','키퍼가 체셔의 손목을 잡는다. 푸른 소매 아래 관절이 굳고, 내 손을 밀어내 살린 손가락부터 인형으로 변한다.'],['키퍼','당신은 이제 제자리를 지켜요.'],[s.name,'남청색 천과 별 장식이 남은 인형이 조작부 앞에 멎는다. 체셔는 나를 해쳤고, 마지막에는 자신이 만든 위험에서 나를 구하려 했다.']],()=>say(s.name,'그가 한 일과 키퍼가 만든 상황을 함께 기억한다.',[
 ['위협을 용서하지 않되 진실을 조사한다',()=>finish('boundary')],['체셔의 마지막 말을 기록한다',()=>finish('record')]
 ]));
 function finish(choice){m.choice=choice;world3d.scriptedWheelHazard(false);releaseForcedRide3d();world3d.jumpToPark(returnPlayer.x,returnPlayer.z);s.ride=returnRide;clear();done?.();}
}
const baseArrive=arriveAtRide;arriveAtRide=function(id){if(id===1&&memory().separated&&!memory().incident&&forcedRide3d===null){baseArrive(id);incident(()=>explore3d('관람차 조작부의 금빛 기록을 조사하세요.'));return;}return baseArrive(id);};
const baseInvestigate=investigate3d;investigate3d=function(){const m=memory();if(m.incident&&!m.evidence.includes(s.ride)){m.evidence.push(s.ride);const proof=['키퍼가 체셔에게 준 접근 열쇠의 대여 기록. 반납란에는 사고 전에 이미 「회수 예정」이라고 적혀 있다.','비상정지 권한은 키퍼만 해제할 수 있었다. 구조 때 쓴 열쇠와 체셔에게 준 열쇠의 번호가 다르다.','사전 감시 기록: 체셔의 접근과 플레이어의 위치가 분 단위로 적혀 있다. 키퍼는 위협을 보기 전부터 그곳에 있었다.','거짓 거래 메모: 「한 명만 탈출」은 계약 조항에 없다. 두 사람에게 서로 버렸다고 전달하라는 지시가 있다.','체셔의 인형화 시각은 구조 직후다. 보조 회로를 다시 켠 권한은 키퍼에게만 있었다.'][s.ride];story([['',proof]],()=>baseInvestigate());return;}return baseInvestigate();};
const baseFinal=finale;finale=function(){if(atExit3d&&memory().met){if(!memory().incident){incident(()=>{atExit3d=true;try{finale();}finally{atExit3d=false;}});return;}story([ [s.name,'체셔가 나를 위협한 책임은 체셔에게 있어요. 하지만 열쇠를 주고 정지 권한을 잠근 건 당신이죠.'],['키퍼','네. 그가 당신을 붙잡는 동안 지켜봤어요. 제가 구하면 제 곁에 남을 줄 알았죠.'],['키퍼','한 명도 내보낼 생각은 없었어요. 체셔에게 한 약속도, 당신에게 한 말도.'],[s.name,memory().evidence.length?'기록은 그가 위험을 미리 준비했다는 사실을 남겼다.':'체셔의 마지막 말과 서로 다른 두 열쇠를 기억한다.']],()=>baseFinal());return;}return baseFinal();};
// A persistent consequence in the existing articulated-doll renderer.
const castRender=window.NEVERLAND_CAST.render;let doll=null;
window.NEVERLAND_CAST.render=function(T,scene,state,t){castRender(T,scene,state,t);if(!doll){doll=new T.Group();const navy=new T.MeshStandardMaterial({color:0x273c65,roughness:1}),porcelain=new T.MeshStandardMaterial({color:0xc6c4c3});function part(x,y,z,a,b,c,mat){const o=new T.Mesh(new T.BoxGeometry(a,b,c),mat);o.position.set(x,y,z);doll.add(o);}part(0,1,0,.4,.65,.24,navy);part(0,1.6,0,.25,.35,.23,porcelain);for(const sign of [-1,1]){part(sign*.12,.4,0,.13,.65,.15,navy);part(sign*.3,1.1,-.1,.12,.6,.14,porcelain);}part(0,1.6,.15,.3,.5,.1,navy);part(.13,1.2,-.14,.1,.1,.03,porcelain);scene.add(doll);}const inside=state.interior?.ride===1;const q=inside?[-5.8,0]:[controls3d[1][0]+2,controls3d[1][1]];doll.position.set(q[0],inside?0:window.NEVERLAND_LAYOUT.terrain(...q),q[1]);doll.visible=memory().incident&&!!memory().choice&&(!state.interior||inside)&&s.phase!=='ending';};
// Production jumps use the existing testing badge and album suppression.
function jump(which){window.NEVERLAND_TOOLS.jump('park',1);clear();s.cheshire={met:false,separated:false,incident:false,choice:'',evidence:[]};if(which==='meet')meet(()=>explore3d());else incident(()=>explore3d());}
const menu=$('game-jump');menu.addEventListener('click',()=>{const host=$('tools-content');if(!host)return;for(const [label,key]of [['체셔 · 첫 만남','meet'],['체셔 · 관람차 위협과 구출','incident']])host.append(btn(label,()=>{window.NEVERLAND_TOOLS.hide();jump(key);}));});
window.NEVERLAND_CHESHIRE={jump,meet,incident,clear,get state(){return{...memory(),cast:[...cast],expression};}};
if(new URLSearchParams(location.search).get('cheshire')==='meet')jump('meet');
})();
