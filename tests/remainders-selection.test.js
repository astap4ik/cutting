const assert=require('node:assert/strict');
const vm=require('node:vm');
const source=require('node:fs').readFileSync(require('node:path').join(__dirname,'../src/app.js'),'utf8');
const functionSource=source.match(/function selectRemainder\([\s\S]*?\nfunction remainderElement/)[0].replace(/\nfunction remainderElement[\s\S]*/, '');
const elements=new Map();
const makeElement=()=>{const classes=new Set();return {classList:{contains:name=>classes.has(name),toggle:(name,on)=>on?classes.add(name):classes.delete(name)}}};
const context={document:{querySelector:selector=>elements.get(selector)||null},updateRemainderMapVisibility(){}};
context.selectRemainder=vm.runInNewContext(`(${functionSource})`,context);
const key=(sheet,index)=>({map:`#layouts .sheet[data-sheet-index="${sheet}"] .freeRemainderMap[data-remainder-index="${index}"]`,row:`#layouts .layout[data-sheet-index="${sheet}"] .freeRemainderCard[data-remainder-index="${index}"],#layouts .layout[data-sheet-index="${sheet}"] .freeRemainderRow[data-remainder-index="${index}"]`});
const first=key(0,0),second=key(0,1);elements.set(first.map,makeElement());elements.set(first.row,makeElement());elements.set(second.map,makeElement());elements.set(second.row,makeElement());
context.selectRemainder(0,0);context.selectRemainder(0,1);
assert.equal(elements.get(first.map).classList.contains('freeRemainderSelected'),true,'first remainder remains selected');
assert.equal(elements.get(second.map).classList.contains('freeRemainderSelected'),true,'second remainder is selected');
context.selectRemainder(0,0);
assert.equal(elements.get(first.map).classList.contains('freeRemainderSelected'),false,'clicking selected remainder toggles only it');
assert.equal(elements.get(second.map).classList.contains('freeRemainderSelected'),true,'other remainder remains selected');
console.log('PASS: multiple free remainders remain selected');

const previewSource=source.match(/function showPlacementPreview\([\s\S]*?\nfunction pointInElement/)[0].replace(/\nfunction pointInElement[\s\S]*/, '');
let previewCount=0,clearCount=0,rectIndex=0,pointIndex=0;
const previewContext=vm.createContext({
 bestResult:{unplaced:[]},remainderSelections:[],placementSelection:null,placementCandidate:null,sheetIsTransposed:()=>false,sheetClickPoint:()=>({x:pointIndex++===1?30:10,y:10}),
 freeRectangleAt:()=>rectIndex++===0?{x:0,y:0,width:20,height:20}:{x:20,y:0,width:20,height:20},previewRectangle:()=>{previewCount++;return {remove(){}}},
 clearPlacementPreview:()=>{clearCount++}
});
previewContext.showPlacementPreview=vm.runInContext(`(${previewSource})`,previewContext);
const previewSheet={};
previewContext.showPlacementPreview({}, previewSheet, {});
previewContext.showPlacementPreview({}, previewSheet, {});
assert.equal(previewCount,2,'each free-area click adds a preview');
assert.equal(clearCount,0,'free-area clicks do not clear previous previews');
rectIndex=0;
pointIndex=0;
previewContext.showPlacementPreview({}, previewSheet, {});
assert.equal(previewCount,2,'repeated click on the same free area does not duplicate it');
assert.equal(previewContext.remainderSelections.length,1,'second click on the same free area removes it');
console.log('PASS: multiple free-area previews remain visible');
