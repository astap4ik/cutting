const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const E=require('../src/optimizer.js');
function element(){const classes=new Set();return {value:'',checked:false,disabled:false,textContent:'',innerHTML:'',style:{},classList:{add(...names){names.forEach(name=>classes.add(name))},remove(...names){names.forEach(name=>classes.delete(name))},contains(name){return classes.has(name)},toggle(){}},setAttribute(){},addEventListener(){},closest(){return element()},querySelectorAll(){return []},append(){},before(){},after(){},insertAdjacentHTML(){},remove(){},showModal(){}}}
const nodes=new Map();
const $=s=>{if(!nodes.has(s))nodes.set(s,element());return nodes.get(s)};
for(const [id,value] of Object.entries({kerf:4,margin:0,minWaste:50,mode:'fast',seed:1}))$('#'+id).value=value;
const pinwheel=[[0,0,66,30],[70,0,30,66],[34,70,66,30],[0,34,30,66],[34,34,32,32]];
const ctx=vm.createContext({console,$,CuttingOptimizer:E,structuredClone,Uint32Array,
 document:{createElement:element,querySelector:$,querySelectorAll:()=>[],head:{append(){}}},
 localStorage:{removeItem(k){delete this[k]}},setTimeout:fn=>{fn();return 1},
 sheets:[{material:'A',length:100,width:100,qty:2}],
 parts:pinwheel.map((p,i)=>({name:'P'+i,material:'A',length:p[2],width:p[3],qty:1,rotate:false})),
 layouts:[],render(){},sync(){},activeDragCancel:null,clearPlacementPreview(){},
 CuttingDB:{async put(){},async migrate(){return []}},
});
ctx.load=d=>{ctx.sheets=structuredClone(d.sheets);ctx.parts=structuredClone(d.parts)};
vm.runInContext(fs.readFileSync('src/search-ui.js','utf8'),ctx);
const run=code=>vm.runInContext(code,ctx);
(async()=>{
 assert.equal(run('currentOptions().milling'),false);
 assert.equal(run('currentOptions().kind'),'guillotine');
 await run('calculate()');
 assert.equal(run('bestResult.unplaced.length'),0);
 assert.equal(run('status.textContent'),'','completed calculations clear transient progress status');
 assert.ok(run('bestResult.layouts.some(s=>s.cuts.length)'));
 const before=run('JSON.stringify(bestResult.all)');
 ctx.pinwheel=pinwheel;
 run(`bestResult.all[0].placed=verifiedData.items.map((p,i)=>({...p,x:pinwheel[i][0],y:pinwheel[i][1]}));bestResult.all[1].placed=[];bestResult.manual=true;render(bestResult.all,bestResult.unplaced);`);
 assert.equal(run('JSON.stringify(bestResult.all)'),before,'invalid manual layout rolls back');
 assert.match(run('status.textContent'),/Изменение отменено/);
 $('#milling').checked=true;$('#milling').onchange();
 assert.ok(run('bestResult'),'technology switch keeps the current layout');
 assert.equal($('#layouts').classList.contains('staleData'),true,'technology switch marks the current layout stale');
 assert.equal(run('currentOptions().kind'),'sheet');
 await run('calculate()');
 assert.equal(run('bestResult.layouts.every(s=>s.cuts.length===0)'),true,'fast milling does not switch to saw');
 run(`layoutCache=[{id:'old',name:'Legacy',seed:1,data:{sheets:structuredClone(sheets),parts:structuredClone(parts)},options:{kerf:4,margin:0,minWaste:50,kind:'sheet',mode:'fast'},result:structuredClone(bestResult)}];layoutCache[0].result.all[0].placed=verifiedData.items.map((p,i)=>({...p,x:pinwheel[i][0],y:pinwheel[i][1]}));layoutCache[0].result.all[1].placed=[];layoutCache[0].result.unplaced=[];`);
 $('#savedLayout').value='old';await $('#loadLayoutBtn').onclick();
 assert.equal($('#milling').checked,false,'legacy sheet does not enable milling');
 assert.equal(run('bestResult'),null,'unsafe legacy layout requires recalculation');
 assert.match(run('status.textContent'),/Требуется новый расчёт/);
 run('layoutCache[0].options.milling=true');await $('#loadLayoutBtn').onclick();
 assert.equal($('#milling').checked,true,'explicit saved setting restores milling');
 assert.ok(run('bestResult'));
 $('#milling').checked=false;$('#milling').onchange();await run('calculate()');
 assert.ok(run('bestResult.layouts.some(s=>s.cuts.length)'));
 console.log('PASS: UI default, calculation, manual rollback, technology switch, legacy and explicit saved settings');
})().catch(e=>{console.error(e);process.exitCode=1});
