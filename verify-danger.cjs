const fs=require('fs'),path=require('path'),vm=require('vm');
let code=fs.readFileSync(path.join(__dirname,'verify-companion.cjs'),'utf8').replace("'game-tools.js','cheshire.js'","'game-tools.js','cheshire.js','danger-flash.js'");
const extra=`
run(\`let flashClock=10000;Date.now=()=>flashClock;const danger=window.NEVERLAND_DANGER;
newGame();test(!danger.flash()===false,'manual danger pulse starts');test($('danger-flash').classList.contains('is-flashing'),'full-screen layer active');
danger.clear();test(!$('danger-flash').classList.contains('is-flashing'),'clear removes pulse');test(danger.flash()===false,'rapid duplicate danger suppressed');
flashClock+=2000;document.body.classList.add('reduce-motion');test(danger.flash()===false,'game reduced motion suppresses flash');document.body.classList.remove('reduce-motion');
matchMedia=()=>({matches:true});test(danger.flash()===false,'system reduced motion suppresses flash');matchMedia=()=>({matches:false});
flashClock+=2000;world3d.scriptedWheelHazard(true);test($('danger-flash').classList.contains('is-flashing'),'Cheshire physical hazard triggers pulse');world3d.scriptedWheelHazard(false);test(!$('danger-flash').classList.contains('is-flashing'),'hazard stop clears pulse');
flashClock+=2000;say('',keeperRideIncidents[1][0],[]);test($('danger-flash').classList.contains('is-flashing'),'ride warning narrative triggers pulse');danger.clear();
flashClock+=2000;say('키퍼','위험은 이제 끝났어요.',[]);test(!$('danger-flash').classList.contains('is-flashing'),'casual danger discussion does not flash');
flashClock+=2000;beginFracture3d();test($('danger-flash').classList.contains('is-flashing'),'first fall triggers pulse');newGame();test(!$('danger-flash').classList.contains('is-flashing'),'restart clears pulse');
\`);console.log('PASS: danger flash regression checks; '+assertions+' total assertions.');
`;
code=code.replace("vm.runInThisContext('(function(require,__dirname){'+suite", "suite+="+JSON.stringify(extra)+";\nvm.runInThisContext('(function(require,__dirname){'+suite");
vm.runInThisContext('(function(require,__dirname){'+code.replaceAll('__filename',JSON.stringify(__filename))+'\n})',{filename:__filename})(require,__dirname);
