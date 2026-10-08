const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const E=require('../src/optimizer.js');
const source=fs.readFileSync('src/app.js','utf8');
// Run the actual active pointer handlers with a minimal DOM and real validation.
const handler=source.slice(source.lastIndexOf('function sameUnplacedSize('),source.indexOf('function render('));
function element(){return {dataset:{},style:{},events:{},classList:{add(){}},
 addEventListener(name,fn){this.events[name]=fn},remove(){},cloneNode(){return element()},
 getBoundingClientRect(){return {left:0,top:0,width:300,height:300}}}}
for(const milling of [false,true])for(const portrait of [false,true])for(const grouped of [false,true]){
 const o={kerf:4,margin:0,minWaste:10,milling,kind:milling?'sheet':'guillotine',mode:'standard'};
 const data=E.prepare([{material:'A',length:portrait?100:200,width:portrait?200:100,qty:1}],
  [{material:'A',name:'Part',length:30,width:20,qty:2,rotate:grouped,rotateGroup:grouped?'A':''}],o);
 const result=E.attempt(data,o,0,1);
 const original={...result.all[0].placed[0]},listeners={},sheetEl=element(),board=element();
 sheetEl.dataset.sheetIndex='0';
 board.dataset.transposed=portrait?'1':'0';board.dataset.containerWidth='1000';
 const ctx=vm.createContext({bestResult:result,layouts:result.layouts,activeDragCancel:null,
  status:{textContent:''},pieceLabels(){},clearPlacementPreview(){},rotateGroupPieces(){},
  sheetIsTransposed:s=>s.width>s.length,allSheetByIndex:i=>result.all[Number(i)],
  removePiece:(arr,p)=>{const i=arr.findIndex(q=>q.id===p.id);if(i>=0)arr.splice(i,1)},
  sheetPointAt:()=>({x:original.x,y:original.y}),snapPlacement:()=>({x:original.x,y:original.y}),setGhostOnSheet(){},
  $:()=>board,window:{addEventListener(){},removeEventListener(){}},
  document:{createElement:element,querySelectorAll:()=>[],querySelector:()=>sheetEl,body:{append(){}},
   addEventListener:(name,fn)=>listeners[name]=fn,removeEventListener:name=>delete listeners[name],
   elementFromPoint:()=>({closest:selector=>selector==='#unplaced'?board:null})},
  render(){E.validate(result,data,o)},
 });
 vm.runInContext(handler,ctx);
 const event={button:0,clientX:25,clientY:25,preventDefault(){}};
 let piece=ctx.pieceElement(result.all[0].placed[0],100,200,'sheet',portrait);
 piece.events.pointerdown(event);listeners.pointerup(event);
 assert.equal(result.unplaced.length,1,'part can be removed from the sheet');
 const removed=result.unplaced[0];
 assert.deepEqual([removed.length,removed.width,removed.rotation],[original.length,original.width,original.rotation],'transfer preserves physical orientation');
 ctx.document.elementFromPoint=()=>({closest:selector=>selector==='.sheet'?sheetEl:null});
 piece=ctx.pieceElement(removed,300,300,'unplaced');
 piece.events.pointerdown(event);listeners.pointermove(event);listeners.pointerup(event);
 assert.equal(result.unplaced.length,0,'part returns to the sheet');
 const returned=result.all[0].placed.find(p=>p.id===original.id);
 assert.deepEqual([returned.length,returned.width,returned.rotation],[original.length,original.width,original.rotation]);
}
// Click placement must not silently choose the transposed variant either.
const previewSource=source.slice(source.indexOf('function commitPlacementCandidate('),source.indexOf('function pointInElement('));
const original={id:'p0-0',name:'Part',material:'A',length:30,width:20,rotation:0,rotate:true};
const targetSheet={material:'A',length:100,width:100,placed:[]};
const previewContext=vm.createContext({
 bestResult:{all:[targetSheet],layouts:[],unplaced:[original]},layouts:[],status:{textContent:''},render(){},
 clearPlacementPreview(){},freeRectangleAt(){},
 sheetClickPoint:()=>({x:50,y:50}),snapPlacement:(_sheet,p)=>({x:p.length,y:p.width}),
 previewRectangle(){return {}},placementCandidate:null,placementSelection:null,
});
vm.runInContext(previewSource,previewContext);
previewContext.showPlacementPreview({}, targetSheet, {});
assert.deepEqual([previewContext.placementCandidate.p.length,previewContext.placementCandidate.p.width,previewContext.placementCandidate.p.rotation],[30,20,0],'click placement preserves orientation');
previewContext.commitPlacementCandidate(targetSheet);
assert.deepEqual([targetSheet.placed[0].length,targetSheet.placed[0].width,targetSheet.placed[0].rotation],[30,20,0],'committing click placement preserves orientation');
const visualContext=vm.createContext({document:{createElement:element},pieceLabels(){},clearPlacementPreview(){},rotateGroupPieces(){}});
vm.runInContext(handler,visualContext);
const transposedUnplaced=visualContext.pieceElement({id:'p0-0',name:'Part',length:230,width:2800},5000,3000,'unplaced',true);
assert.ok(parseFloat(transposedUnplaced.style.width)>parseFloat(transposedUnplaced.style.height),'unplaced view uses the sheet orientation');
console.log('PASS: placement and transfer preserve physical orientation for portrait/landscape, saw/milling, locked rotation and rotation groups');
