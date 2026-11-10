sandbox.rideFrames=rideFrames;
run(`
// Natural post-accident entry, no map button dependency and no new reward.
ready();s.cheshire={met:false,separated:false,incident:false,choice:'',evidence:[],mode:'unmet'};keeperStoryState.dream='doubt';map();
test(c.state.mode==='awaiting'&&!c.state.met,'dream leads to explicit encounter objective');
test($('walk-objective').textContent.includes('캡틴 훅'),'first meeting location is explicit');
world3d.jumpToPark(controls3d[0][0],controls3d[0][1]+6);c.update(world3d.state,1);drain();
test(c.state.met&&c.state.mode==='following','natural path proximity meets real Cheshire');
c.update(world3d.state,2);const initial=c.state.follower;
for(let i=1;i<=80;i++){worldQA.player.x+=.05;c.update(world3d.state,2+i*.05);}
test(c.state.view.visible&&c.state.follower.x>initial.x+1,'physical follower moves along player trail');
const snapshot=c.state.follower;world3d.configure({paused:true});worldQA.player.x+=4;c.update(world3d.state,8);
test(c.state.follower.x===snapshot.x,'dialogue pause freezes follower movement');world3d.configure({paused:false});
// Waiting never enters a ride; recall restores the prior mode.
c.jump('waiting');c.update(world3d.state,10);const waiting=c.state.follower;worldQA.player.x+=4;c.update(world3d.state,11);
test(c.state.follower.x===waiting.x&&c.state.mode==='waiting','waiting remains at chosen park position');
world3d.enterRide(1);c.update(world3d.state,12);test(!c.state.view.visible,'waiting companion stays outside');world3d.leaveRide();c.talk();drain();test(c.state.mode==='following','recall resumes actual following');
// Exit cannot replace the original separation and reunion with a sudden threat.
c.jump('following');atExit3d=true;finale();atExit3d=false;drain();test(c.state.mode==='separated'&&!c.state.incident&&forcedRide3d!==null,'early exit preserves split before threat');releaseForcedRide3d();
c.jump('separated');c.update(world3d.state,15);test(c.state.mode==='separated'&&!c.state.view.visible,'QA separated checkpoint remains inspectable');
// Real interiors, physical run completion, same scoring engine. Five rides.
for(let id=0;id<5;id++){
 c.jump('ride',id);c.update(world3d.state,20+id);test(c.state.view.visible&&c.state.view.space===id,'companion rendered in ride '+id);
 test(c.state.rideLines[id+':0']===1,'entry line '+id);
 const def=window.NEVERLAND_INTERIORS[id];
 if(id!==3){worldQA.player.x=def.seat[0];worldQA.player.z=def.seat[1];c.update(world3d.state,21+id);test(worldQA.nearest().type==='interior-seat','Cheshire never captures seat E '+id);test(world3d.sit(),'real seat '+id);test(world3d.startRide(.2),'actual ride launch '+id);c.update(world3d.state,22+id);test(c.state.view.visible&&c.state.rideLines[id+':1']===1,'riding sprite and speech '+id);const elapsedBefore=world3d.state.interior.progress;c.talk();test(world3d.state.config.paused===false&&world3d.state.interior.running,'ride dialogue never pauses physics '+id);test(!world3d.leaveRide(),'companion cannot bypass running lock '+id);rideFrames(40);drain();}
 else{worldQA.player.x=def.control[0];worldQA.player.z=def.control[1];c.update(world3d.state,24);test(['mirror-locked','mirror-finish'].includes(worldQA.nearest().type),'mirror exit priority');c.talk();drain();test(c.state.rideLines['3:0']===1,'maze dialogue repeat retains entry record');world3d.unlockInterior();}
 world3d.leaveRide();c.update(world3d.state,30+id);test(c.state.rideLines[id+':2']===1&&c.state.view.space==='park','disembark line and follower returns '+id);test(s.wins===0,'companion grants no puzzle reward '+id);
}
c.jump('following');requireRide3d();drain();c.update(world3d.state,40);
test(c.state.mode==='separated'&&!c.state.view.visible,'forced split hides living follower');test(forcedRide3d!==null,'original forced boarding retained');
releaseForcedRide3d();world3d.jumpToPark(controls3d[1][0],controls3d[1][1]+5);explore3d();c.update(world3d.state,41);drain();
test(c.state.mode==='reunited'&&c.state.reunion,'same-zone forced completion reaches reunion');
test(!c.state.incident,'reunion is separate from threat');
world3d.enterRide(1);explore3d();s.survivedRides=(s.survivedRides||0)+1;returnToPark();test(c.state.mode==='threat','reunion ride disembark leads to threat');drain();$('choices').children[0].onclick();c.update(world3d.state,42);
test(c.state.mode==='doll'&&!c.state.view.visible&&!c.state.follower,'doll never follows');
newGame();c.update(world3d.state,43);test(c.state.mode==='unmet'&&!c.state.view.visible&&c.state.rideSpeech==='','restart clears all companion state');
for(const id of [1,2,3,4,5]){c.jump('following');end(id);c.update(world3d.state,44+id);test(!c.state.view.visible&&$('cheshire-companion').hidden,'no companion leak into ending '+id);}
`);
console.log('PASS: '+assertions+' assertions including companion encounter, follow, pause, wait, all five real interiors, E priority, forced split, reunion, threat, doll, five endings and restart.');
