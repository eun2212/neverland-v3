/* Cheshire extension for canonical Neverland v3. No replacement scoring or rides. */
(function(){
'use strict';

const layer=document.createElement('div');layer.id='cheshire-portrait';layer.hidden=true;layer.setAttribute('role','img');layer.innerHTML='<div></div>';$('stage').append(layer);
let cast=[],expression='calm',active=false,pending=null;
function memory(){return s.cheshire||(s.cheshire=fresh());}
function clear(){document.body.classList.remove('cheshire-danger');expression='calm';cast=[];pending=null;active=false;layer.hidden=true;document.body.classList.remove('dialogue-clear','cheshire-scene');for(const id of ['keeper','cheshire-portrait']){const e=$(id);e.classList.remove('cast-left','cast-right','cast-center','cast-listener');} }
function portrait(who){const id=who==='체셔'?'cheshire-portrait':who==='키퍼'?'keeper':null;
 if(id&&!cast.includes(id)){if(cast.length===1){$(cast[0]).classList.remove('cast-center');$(cast[0]).classList.add('cast-right');}cast.push(id);$(id).classList.add(cast.length===1?'cast-center':'cast-left');}
 layer.hidden=!cast.includes('cheshire-portrait');document.body.classList.toggle('cheshire-scene',cast.includes('cheshire-portrait'));
 $('keeper').style.visibility=cast.includes('keeper')?'':'hidden';
 for(const c of cast)$(c).classList.toggle('cast-listener',!!id&&c!==id);
 layer.dataset.expression=expression;layer.setAttribute('aria-label','체셔 · '+({calm:'도움을 건네는 표정',guarded:'경계와 불신',threat:'절박한 위협',regret:'두려움과 후회'}[expression]));
}
const baseSay=say;say=function(who,text,options){baseSay(who,text,options);if(pending)expression=pending;portrait(who);};
const baseNext=next;next=function(){pending=queue[0]?.[3]||null;const event=queue[0]?.[4];if(event==='danger'){world3d.scriptedWheelHazard(true);document.body.classList.add('cheshire-danger');}if(event==='stop'){world3d.scriptedWheelHazard(false);releaseForcedRide3d();document.body.classList.remove('cheshire-danger');}return baseNext();};
const baseStory=story;story=function(lines,done){clear();active=true;return baseStory(lines,()=>{clear();$('keeper').style.visibility='';done?.();});};
const baseExplore=explore3d;explore3d=function(...args){clear();$('keeper').style.visibility='';return baseExplore(...args);};
const baseNew=newGame;newGame=function(...args){clear();$('keeper').style.visibility='';const r=baseNew(...args);s.cheshire=fresh();return r;};
const baseEnd=end;end=function(...args){clear();$('keeper').style.visibility='';return baseEnd(...args);};
function meet(done){const m=memory();if(m.met){done?.();return;}m.met=true;setMode('following');
 story([['', '地面에 쪼그려 앉아 숨을 고르자, 캡틴 훅 출구 옆 직원 통로에서 긴 남청색 머리의 남자가 일정한 거리를 두고 멈춘다.'.replace('地面','바닥')],['체셔','손이 떨리네요. 물은 밀봉된 거예요. 받을지는 당신이 정해요.',null,'calm'],[s.name,'그는 병을 내 손에 쥐여 주지 않고 벤치에 놓는다. 뚜껑의 봉인이 끊어지지 않았는지 먼저 보여 준다.'],['체셔','체셔예요. 나도 갇혔어요. 퇴근하고 집에 가는 길이었는데, 눈을 뜨니 여기에 있었어요.'],['체셔','방금 배가 멎는 걸 봤어요. 꿈이었다는 말은 못 믿겠어요. 다음에는 안전 고리를 같이 확인해요.'],[s.name,'그는 헐거워진 손잡이를 찾아 조여 준다. 실제로 덜 흔들린다. 잠깐 함께 걷기로 한다.']],done);}
const baseMap=map;map=function(){if(s.phase!=='profile'&&keeperStoryState.dream&&!firstLever3d&&!memory().met){setMode('awaiting');baseExplore('캡틴 훅 출구 옆 직원 통로의 남청색 남자에게 다가가세요. 체셔와 첫 만남 · 동행 버튼으로도 확인할 수 있습니다.');refreshCompanion();return;}return baseMap();};
const baseRequire=requireRide3d;requireRide3d=function(){const m=memory();if(m.met&&!m.separated){m.separated=true;setMode('separated');story([['체셔','두 번 이야기했을 뿐인데 문을 잠근다고요? 내가 밖에서 정지 장치를 볼게요.',null,'guarded'],['키퍼','동행인은 반대편 대기선에 있어 주세요. 이 손님은 혼자 타야 해요.'],[s.name,'출입 고리가 닫히며 체셔가 반대쪽 통로로 밀려난다.'],['체셔','문이 닫혀도 기다릴게요. 내려오면 별의 관람차 승강장 입구에서 다시 만나요.',null,'guarded'],['키퍼','그분은 먼저 탈출할 방법을 찾겠죠. 당신은 혼자 타세요.'],[s.name,'강제 분리. 이번 탑승을 마친 뒤 별의 관람차 입구에서 체셔를 찾는다.']],()=>baseRequire());return;}return baseRequire();};
function incident(done){const m=memory();if(m.incident){done?.();return;}m.met=true;m.separated=true;m.incident=true;setMode('threat');const returnRide=s.ride,returnPlayer=world3d.state.player;world3d.jumpToPark(returnPlayer.x,returnPlayer.z);world3d.jumpToPark(controls3d[1][0],controls3d[1][1]+5);s.ride=1;world3d.enterRide(1);world3d.forceBoard(1);forcedRide3d=1;sync3d();
 story([['','관람차 승강장. 체셔가 문을 잠그고 조작부에 열쇠를 꽂는다.'],['체셔','당신이 나를 버렸다고 했어요. 한 명만 나갈 수 있다면서요. 여기 멈춰 있어요. 한 걸음이라도 가면 다시 돌릴 거예요.',null,'threat'],[s.name,'체셔가 재운행 스위치를 눌러 곤돌라가 움직인다. 발밑의 문턱이 벌어진다. 그가 직접 만든 위험이다.',null,null,'danger'],['키퍼','제 손님에게서 손 떼세요.'],['','키퍼가 관리자 열쇠로 비상정지를 푼다. 곤돌라가 멎고 그가 나를 승강장 안쪽으로 끌어당긴다.',null,null,'stop'],['키퍼','이제 제 곁에 계세요. 제가 지켜 드릴 테니까.'],['체셔','멈추기만 하면 된다고 했잖아. 당신이 준 열쇠로 붙잡아 두면, 나를 내보내 준다고…….',null,'regret'],['키퍼','그 말을 믿은 건 당신이죠.'],[s.name,'다시 밀려오는 곤돌라. 체셔가 스스로 조작부로 뛰어들어 열린 문을 받치고 내 발을 끌어낸다.'],['체셔','내가 위협했어요. 미안하다는 말로 없어지지 않아요. 지금은 뒤로 물러나요. 손 놓지 않을게요.'],['','키퍼가 체셔의 손목을 잡는다. 푸른 소매 아래 관절이 굳고, 내 손을 밀어내 살린 손가락부터 인형으로 변한다.'],['키퍼','당신은 이제 제자리를 지켜요.'],[s.name,'남청색 천과 별 장식이 남은 인형이 조작부 앞에 멎는다. 체셔는 나를 해쳤고, 마지막에는 자신이 만든 위험에서 나를 구하려 했다.']],()=>say(s.name,'그가 한 일과 키퍼가 만든 상황을 함께 기억한다.',[
 ['위협을 용서하지 않되 진실을 조사한다',()=>finish('boundary')],['체셔의 마지막 말을 기록한다',()=>finish('record')]
 ]));
 function finish(choice){m.choice=choice;setMode('doll');world3d.scriptedWheelHazard(false);releaseForcedRide3d();world3d.jumpToPark(returnPlayer.x,returnPlayer.z);s.ride=returnRide;clear();done?.();}
}
function reunion(done){const m=memory();if(m.reunion){done?.();return;}m.reunion=true;m.separated=false;m.reunionRides=s.survivedRides||0;setMode('reunited');story([['','별의 관람차 승강장 입구. 체셔가 출구 가까이 서 있다. 같은 남자지만 먼저 다가오지 않는다.'],['체셔','이번에도 먼저 떠날 거예요? 키퍼는 당신이 나를 버렸다고 했어요.',null,'guarded'],[s.name,'문 앞에서 기다렸어요. 내가 혼자 타도록 잠근 건 키퍼예요.'],['체셔','나는 거짓 탈출 거래를 거절했어요. 그러자 손목이 굳기 시작했어요. 결국 열쇠를 받았어요. 한 명만 나갈 수 있다고 해서…….'],['체셔','아직 전부 믿기는 어려워요. 그래도 다음 운행은 같이 확인해요.'],['','체셔가 다시 곁으로 온다. 관람차에 함께 탑승하고 내려 그의 이야기를 듣는다.']],()=>{refreshCompanion();done?.();});}
const baseArrive=arriveAtRide;arriveAtRide=function(id){baseArrive(id);if(id===1&&memory().mode==='separated'&&forcedRide3d===null)reunion(()=>explore3d('체셔와 재회했습니다. 관람차에 함께 타고 하차하세요.'));};
const baseReturn=returnToPark;returnToPark=function(){const before=world3d.state.interior;const m=memory();baseReturn();if(before&&!world3d.state.interior&&before.ride===1&&m.mode==='reunited'&&(s.survivedRides||0)>m.reunionRides)incident(()=>explore3d('체셔는 인형이 되었습니다. 관람차 조작부의 금빛 기록을 조사하세요.'));};
$('ride-return').onclick=()=>returnToPark();
const baseInvestigate=investigate3d;investigate3d=function(){const m=memory();if(m.incident&&!m.evidence.includes(s.ride)){m.evidence.push(s.ride);const proof=['키퍼가 체셔에게 준 접근 열쇠의 대여 기록. 반납란에는 사고 전에 이미 「회수 예정」이라고 적혀 있다.','비상정지 권한은 키퍼만 해제할 수 있었다. 구조 때 쓴 열쇠와 체셔에게 준 열쇠의 번호가 다르다.','사전 감시 기록: 체셔의 접근과 플레이어의 위치가 분 단위로 적혀 있다. 키퍼는 위협을 보기 전부터 그곳에 있었다.','거짓 거래 메모: 「한 명만 탈출」은 계약 조항에 없다. 두 사람에게 서로 버렸다고 전달하라는 지시가 있다.','체셔의 인형화 시각은 구조 직후다. 보조 회로를 다시 켠 권한은 키퍼에게만 있었다.'][s.ride];story([['',proof]],()=>baseInvestigate());return;}return baseInvestigate();};
const baseFinal=finale;finale=function(){if(atExit3d&&memory().met){if(!memory().incident){const m=memory();if(!m.separated&&!m.reunion){world3d.notify('키퍼가 출구 앞에서 동행인을 가로막습니다. 이번 강제 탑승 뒤 관람차 입구에서 체셔를 다시 찾으세요.');requireRide3d();}else explore3d(m.reunion?'체셔와 관람차에 함께 탑승하고 하차한 뒤 출구로 돌아오세요.':'별의 관람차 입구에서 체셔를 다시 찾으세요. 강제 분리 뒤의 이야기를 확인해야 합니다.');return;}story([ [s.name,'체셔가 나를 위협한 책임은 체셔에게 있어요. 하지만 열쇠를 주고 정지 권한을 잠근 건 당신이죠.'],['키퍼','네. 그가 당신을 붙잡는 동안 지켜봤어요. 제가 구하면 제 곁에 남을 줄 알았죠.'],['키퍼','한 명도 내보낼 생각은 없었어요. 체셔에게 한 약속도, 당신에게 한 말도.'],[s.name,memory().evidence.length?'기록은 그가 위험을 미리 준비했다는 사실을 남겼다.':'체셔의 마지막 말과 서로 다른 두 열쇠를 기억한다.']],()=>baseFinal());return;}return baseFinal();};
// A persistent consequence in the existing articulated-doll renderer.
const castRender=window.NEVERLAND_CAST.render;let doll=null;
window.NEVERLAND_CAST.render=function(T,scene,state,t){castRender(T,scene,state,t);if(!doll){doll=new T.Group();const navy=new T.MeshStandardMaterial({color:0x273c65,roughness:1}),porcelain=new T.MeshStandardMaterial({color:0xc6c4c3});function part(x,y,z,a,b,c,mat){const o=new T.Mesh(new T.BoxGeometry(a,b,c),mat);o.position.set(x,y,z);doll.add(o);}part(0,1,0,.4,.65,.24,navy);part(0,1.6,0,.25,.35,.23,porcelain);for(const sign of [-1,1]){part(sign*.12,.4,0,.13,.65,.15,navy);part(sign*.3,1.1,-.1,.12,.6,.14,porcelain);}part(0,1.6,.15,.3,.5,.1,navy);part(.13,1.2,-.14,.1,.1,.03,porcelain);scene.add(doll);}const inside=state.interior?.ride===1;const q=inside?[-5.8,0]:[controls3d[1][0]+2,controls3d[1][1]];doll.position.set(q[0],inside?0:window.NEVERLAND_LAYOUT.terrain(...q),q[1]);doll.visible=memory().incident&&!!memory().choice&&(!state.interior||inside)&&s.phase!=='ending';};
// All companion state belongs to this run. Render state never awards progress.
function fresh(){return{met:false,separated:false,incident:false,choice:'',evidence:[],mode:'unmet',reunion:false,rideLines:{},talks:0};}
const meetPoint=[controls3d[0][0],controls3d[0][1]+5];
const labels={unmet:'아직 만나지 않음',awaiting:'첫 만남 · 캡틴 훅 출구 옆 직원 통로',following:'동행 중',waiting:'잠시 대기',separated:'강제 분리 · 별의 관람차 입구에서 재회',reunited:'재회 · 경계하는 동행',threat:'관람차 위협',doll:'인형화 · 관람차 조작부'};
let follower=null,space=null,trail=[],lastTick=0,sprite=null,view=null,rideSpeech='',speechUntil=0;
function follows(){return ['following','reunited'].includes(memory().mode)&&!memory().incident;}
function setMode(mode){const m=memory();m.mode=mode;m.separated=['separated','threat','doll'].includes(mode);follower=null;trail=[];space=null;rideSpeech='';speechUntil=0;refreshCompanion();}
const companion=document.createElement('aside');companion.id='cheshire-companion';companion.hidden=true;
const status=document.createElement('p');status.id='cheshire-status';status.setAttribute('role','status');
const speech=document.createElement('p');speech.id='cheshire-bubble';speech.setAttribute('aria-live','polite');
const talkButton=btn('체셔와 대화',()=>talkCompanion());talkButton.id='cheshire-talk';
const waitButton=btn('여기서 잠시 기다려 줘요',()=>{const m=memory();if(m.mode==='waiting'){setMode(m.waitReturn||'following');world3d.notify('체셔가 다시 곁으로 옵니다.');}else if(follows()&&!world3d.state.interior){m.waitAt={...(follower||world3d.state.player)};m.waitReturn=m.mode;setMode('waiting');world3d.notify('체셔가 이 자리에 기다립니다. 동행 버튼으로 다시 부를 수 있습니다.');}refreshCompanion();});
companion.append(status,speech,talkButton,waitButton);$('stage').append(companion);
function canAct(){return s.phase==='main'&&$('stage').classList.contains('walking')&&!world3d.state.config.paused&&!window.NEVERLAND_TOOLS.open;}
function refreshCompanion(){if(!s)return;const m=memory(),d=world3d.state.interior;
 companion.hidden=m.mode==='unmet'||s.phase==='profile'||s.phase==='ending'||s.phase==='epilogue'||world3d.state.config.epilogue||world3d.state.passage||!$('stage').classList.contains('walking');
 const statusText='체셔 · '+(labels[m.mode]||labels.unmet);if(status.textContent!==statusText)status.textContent=statusText;
 talkButton.textContent=m.mode==='awaiting'?'첫 만남 위치 확인 / 체셔에게 말 걸기':m.mode==='separated'?'재회 장소 확인':m.mode==='doll'?'체셔의 흔적 확인':'체셔와 대화';
 talkButton.disabled=!canAct()||m.mode==='threat';waitButton.hidden=!follows()&&m.mode!=='waiting';waitButton.disabled=!canAct()||!!d;waitButton.textContent=m.mode==='waiting'?'체셔, 다시 같이 가요':'여기서 잠시 기다려 줘요';
 speech.hidden=!rideSpeech;if(speech.textContent!==rideSpeech)speech.textContent=rideSpeech;
}
const rideWords=[
 ['안전 고리부터 볼게요. 이번에는 같이 올라가요.','배가 기울어도 고리를 놓지 마요. 나도 옆에 있어요.','둘 다 내렸네요. 손 떨림은 좀 어때요?'],
 ['곤돌라 문이 닫히는지 함께 확인해요.','반대쪽 표시등은 내가 볼게요. 당신 쪽도 알려줘요.','내려왔어요. 잠깐, 조작부 쪽에서 할 말이 있어요.'],
 ['목마의 고정쇠가 헐거워요. 이쪽을 확인해요.','음악이 끊겨도 서두르지 마요. 나는 옆 목마에 있어요.','먼저 가려던 게 아니에요. 안전바를 확인하고 있었어요.'],
 ['내가 지나온 길을 기억할게요. 빛과 실제 문을 함께 봐요.','거울 속 모습보다 내 목소리를 따라와요. 같은 회랑에 있어요.','흰 출구까지 왔네요. 나도 뒤에 있어요.'],
 ['속도침을 같이 봐요. 무리해서 돌리지는 말아요.','나도 같은 찻잔에 있어요. 어지러우면 손잡이를 잡아요.','바닥이 멎었어요. 천천히 같이 내려요.']
];
function rideLine(id,step){if(!follows())return;const m=memory();m.rideLines||(m.rideLines={});m.rideLines[id+':'+step]=(m.rideLines[id+':'+step]||0)+1;rideSpeech='체셔: '+rideWords[id][step];speechUntil=Date.now()+12000;refreshCompanion();}
function talkCompanion(){if(!canAct())return;const m=memory();
 if(m.mode==='awaiting'){const p=world3d.state.player;if(Math.hypot(p.x-meetPoint[0],p.z-meetPoint[1])<=7)meet(()=>explore3d('체셔가 실제로 뒤따릅니다. 함께 기구 내부에 들어가 탑승하거나 동행 대화 버튼을 누르세요.'));else world3d.notify('첫 만남: 캡틴 훅 출구 옆 직원 통로. 지도에서 중앙 캡틴 훅을 찾아가세요.');return;}
 if(m.mode==='separated'){const p=world3d.state.player,q=controls3d[1];if(forcedRide3d===null&&!world3d.state.interior&&Math.hypot(p.x-q[0],p.z-q[1])<9)reunion(()=>explore3d('체셔와 재회했습니다. 관람차에 함께 타고 하차하세요.'));else world3d.notify('강제 탑승을 마치고 별의 관람차 입구로 가세요. 체셔가 그곳에서 기다리기로 했습니다.');return;}
 if(m.mode==='doll'){world3d.notify('체셔는 관람차 조작부 앞의 인형으로 남았습니다. 금빛 흔적에서 키퍼의 거래와 열쇠 기록을 조사하세요.');return;}
 if(m.mode==='waiting'){setMode(m.waitReturn||'following');}
 if(!follows())return;const d=world3d.state.interior;
 if(d?.running){rideLine(d.ride,1);return;}
 const words=d?rideWords[d.ride][d.seated?1:0]:m.mode==='reunited'?'키퍼는 당신이 떠났다고 했어요. 당신이 기다렸다는 말도 기억할게요. 내가 받은 열쇠는 아직……미안해요.':(['나가면 뜨거운 밥부터 먹고 싶어요. 당신은요? 대답하기 싫으면 안 해도 돼요.','괜찮다는 말보다 어디 다쳤는지 알려줘요. 내 손도 아직 떨려요.','혼자 결정하지 않을게요. 안전 고리와 출구를 같이 봐요.'][m.talks++%3]);
 story([['체셔',words,null,m.mode==='reunited'?'guarded':'calm']],()=>explore3d());
}
// Reuse the cast interaction bridge, preserving all original silent dolls.
const priorNearest=window.NEVERLAND_CAST.nearest,priorInteract=window.NEVERLAND_CAST.interact;
window.NEVERLAND_CAST.nearest=function(p,inside,config){const m=memory(),near=(q,r)=>q&&Math.hypot(p.x-q[0],p.z-q[1])<r;
 const d=inside&&window.NEVERLAND_INTERIORS[inside.ride],i=config.ride||0;
 const reserved=inside?[d.seat,d.control,d.exit,d.finish].some(q=>near(q,1.85)):near(controls3d[i],2.8)||near(window.NEVERLAND_LAYOUT.keepers[i],3.3)||near(window.NEVERLAND_LAYOUT.clues[i],2.6)||(config.exit&&near([controls3d[config.exitRide][0]+4,controls3d[config.exitRide][1]+2],2.8));
 if(!reserved&&!config.paused&&!inside?.running&&!inside?.seated&&follower&&['awaiting','following','reunited','waiting'].includes(m.mode)&&Math.hypot(p.x-follower.x,p.z-follower.z)<2.4)return{type:'cast',cast:'cheshire',label:'E · 체셔에게 말 걸기'};return priorNearest(p,inside,config);};
window.NEVERLAND_CAST.interact=function(action){if(action.cast==='cheshire'){talkCompanion();return;}return priorInteract(action);};
// Wrap actual ride operations; no replacement timers, puzzle results, or scoring.
for(const [method,step]of [['enterRide',0],['startRide',1],['leaveRide',2]]){const prior=world3d[method];world3d[method]=function(...args){const id=method==='enterRide'?args[0]:world3d.state.interior?.ride;const ok=prior.apply(this,args);if(ok&&id!==undefined)rideLine(id,step);return ok;};}
const companionExplore=explore3d;explore3d=function(...args){const r=companionExplore(...args);refreshCompanion();return r;};
const companionNew=newGame;newGame=function(...args){const r=companionNew(...args);setMode('unmet');companion.hidden=true;return r;};
const companionEnd=end;end=function(...args){const r=companionEnd(...args);companion.hidden=true;if(sprite)sprite.visible=false;return r;};
// Existing art is a four-cell transparent atlas. No new standing candidate is selected.
const beforeRender=window.NEVERLAND_CAST.render;
window.NEVERLAND_CAST.render=function(T,scene,state,t){beforeRender(T,scene,state,t);updateCompanion(state,t);
 if(!sprite){const texture=new T.TextureLoader().load('cheshire/expressions.webp');texture.repeat.set(.25,1);texture.offset.set(0,0);texture.colorSpace=T.SRGBColorSpace;const material=new T.SpriteMaterial({map:texture,transparent:true,depthWrite:false,alphaTest:.05});sprite=new T.Sprite(material);sprite.scale.set(1.16,2.3,1);scene.add(sprite);}
 sprite.visible=!!view?.visible&&$('stage').classList.contains('walking');if(!sprite.visible)return;
 sprite.material.map.offset.x=memory().mode==='reunited'?.25:0;sprite.scale.set(view.seated?.86:1.16,view.seated?1.7:2.3,1);sprite.position.set(view.x,view.y,view.z);
};
function updateCompanion(state,t){const m=memory(),p=state.player,d=state.interior,dt=Math.max(0,Math.min(.05,t-lastTick));lastTick=t;
 if(m.mode==='separated'&&forcedRide3d===null&&!d&&!state.config.paused&&Math.hypot(p.x-controls3d[1][0],p.z-controls3d[1][1])<9){reunion(()=>explore3d('체셔와 재회했습니다. 관람차에 함께 타고 하차하세요.'));}
 const visible=!state.passage&&s.phase!=='ending'&&!state.config.epilogue&&['awaiting','following','reunited','waiting'].includes(m.mode)&&!m.incident;
 if(!visible){view={visible:false};follower=null;refreshCompanion();return;}
 const key=d?d.ride:'park';if(space!==key){space=key;trail=[];follower=null;}
 if(m.mode==='awaiting'){follower={x:meetPoint[0],z:meetPoint[1]};}
 else if(m.mode==='waiting'){if(d){view={visible:false};refreshCompanion();return;}follower={...m.waitAt};}
 else if(!d?.seated){
  if(!follower)follower={x:p.x-Math.sin(p.yaw)*2.8+Math.cos(p.yaw)*.25,z:p.z-Math.cos(p.yaw)*2.8-Math.sin(p.yaw)*.25};
  if(!state.config.paused){const last=trail.at(-1);if(!last||Math.hypot(last.x-p.x,last.z-p.z)>.15)trail.push({x:p.x,z:p.z});if(trail.length>160)trail.shift();let length=0,target=null;for(let i=trail.length-1;i>0;i--){length+=Math.hypot(trail[i].x-trail[i-1].x,trail[i].z-trail[i-1].z);if(length>1.5){target=trail[i-1];break;}}if(target){const dx=target.x-follower.x,dz=target.z-follower.z,dist=Math.hypot(dx,dz),step=Math.min(dist,dt*6);if(dist>.02){follower.x+=dx/dist*step;follower.z+=dz/dist*step;}}}
 }else follower={x:p.x+.25,z:p.z-2.1};
 let x=follower.x,z=follower.z,y=(d?0:window.NEVERLAND_LAYOUT.terrain(x,z))+(d?.seated?.85:1.15);
 if(d?.seated){const phase=d.progress*Math.PI*2,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches||document.body.classList.contains('reduce-motion');
  if(d.ride===0){const a=d.running&&!reduced?Math.sin(phase*2)*Math.sin(d.progress*Math.PI)*.42:0;const yy=y-6;y=x*Math.sin(a)+yy*Math.cos(a)+6;x=x*Math.cos(a)-yy*Math.sin(a);}
  if(d.ride===1&&d.running){x+=Math.sin(phase)*10;y+=10-Math.cos(phase)*10;}
  if(d.ride===2||d.ride===4){const a=d.running?(d.ride===2?phase*2:reduced?0:phase*3):0;if(d.ride===2){x=4.5+.25;z=-2.1;y=2.35+(d.running?Math.sin(t*2)*.2:0);}const xx=x;x=xx*Math.cos(a)+z*Math.sin(a);z=z*Math.cos(a)-xx*Math.sin(a);}
 }
 view={visible:true,x,y,z,space:key,mode:m.mode,seated:!!d?.seated};
 if(rideSpeech&&Date.now()>speechUntil)rideSpeech='';refreshCompanion();
 if(m.mode==='awaiting'&&!state.config.paused&&Math.hypot(p.x-meetPoint[0],p.z-meetPoint[1])<5)talkCompanion();
}

// Every jump goes through the existing test badge / album suppression.
function jump(which,id=1){window.NEVERLAND_TOOLS.jump('park',id);clear();s.cheshire=fresh();
 if(which==='meet'){setMode('awaiting');world3d.jumpToPark(meetPoint[0],meetPoint[1]+3);explore3d('캡틴 훅 출구 옆 직원 통로에서 체셔를 만나세요.');}
 else if(which==='incident')incident(()=>explore3d());
 else if(which==='reunion'){s.cheshire.met=true;setMode('separated');reunion(()=>explore3d());}
 else if(which==='doll'){Object.assign(memory(),{met:true,incident:true,choice:'record'});setMode('doll');explore3d();}
 else{memory().met=true;setMode(which==='waiting'?'following':which);if(which==='separated'){s.ride=0;world3d.jumpToPark(meetPoint[0],meetPoint[1]);}if(which==='waiting'){memory().waitAt={...world3d.state.player};memory().waitReturn='following';setMode('waiting');}if(which==='ride'){setMode('following');world3d.enterRide(id);}explore3d();}
 refreshCompanion();
}
const menu=$('game-jump');menu.addEventListener('click',()=>{const host=$('tools-content');if(!host)return;for(const [label,key]of [['첫 만남 · 캡틴 훅 출구','meet'],['동행 · 공원','following'],['잠시 대기','waiting'],['강제 분리 · 재회 목표','separated'],['재회 · 관람차 입구','reunion'],['관람차 위협과 구출','incident'],['인형화 · 추종 없음','doll']])host.append(btn('체셔 · '+label,()=>{window.NEVERLAND_TOOLS.hide();jump(key);}));for(let id=0;id<5;id++)host.append(btn('체셔 동행 · '+rides[id].name,()=>{window.NEVERLAND_TOOLS.hide();jump('ride',id);}));});
window.NEVERLAND_CHESHIRE={jump,meet,reunion,incident,clear,talk:talkCompanion,update:updateCompanion,get state(){return{...memory(),cast:[...cast],expression,view:view?{...view}:null,follower:follower?{...follower}:null,rideSpeech};}};
const initialJump=new URLSearchParams(location.search).get('cheshire');if(initialJump)jump(initialJump,Number(new URLSearchParams(location.search).get('ride')||1));
})();
