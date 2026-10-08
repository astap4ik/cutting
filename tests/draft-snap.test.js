const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const app=fs.readFileSync(require('node:path').join(__dirname,'../src/app.js'),'utf8');
const groupHelpersAt=app.indexOf('function unplacedGroupLimit(');
const implementation=app.slice(groupHelpersAt,app.indexOf('function pieceElement(',groupHelpersAt))+
  app.slice(app.indexOf('function draftSnapPosition('),app.indexOf('function enableDraftPieceDrag('));
const controls={kerf:{value:'0'},margin:{value:'0'}};
const context={draftPlacements:[], $:selector=>controls[selector.slice(1)]};
context.objectCanDrop=(sheet,p,x,y)=>{
  const kerf=Number(controls.kerf.value),margin=Number(controls.margin.value);
  return x>=margin&&y>=margin&&x+p.length<=sheet.length-margin&&y+p.width<=sheet.width-margin&&
    !sheet.placed.some(q=>x<q.x+q.length+kerf&&x+p.length+kerf>q.x&&y<q.y+q.width+kerf&&y+p.width+kerf>q.y);
};
context.snapPlacement=(sheet,p,x,y)=>context.objectCanDrop(sheet,p,x,y)?{x,y}:null;
vm.createContext(context);
vm.runInContext(implementation,context);

const sheet={length:2800,width:2100,material:'ЛДСП'};
const moving={previewId:'right',length:1070,width:333,material:'ЛДСП'};
const left={previewId:'left',sheetIndex:0,x:0,y:0,length:230,width:660};
context.draftPlacements.push(left);
const sheetEl={getBoundingClientRect:()=>({width:560})};
const position=(x,y)=>context.draftSnapPosition(sheet,0,moving,x,y,sheetEl);
assert.equal(position(270,0).x,230,'нулевой пропил: деталь прилегает к соседней');
controls.kerf.value='4';
assert.equal(position(270,0).x,234,'положительный пропил: зазор равен пропилу');
controls.kerf.value='0';
assert.equal(position(500,0).x,500,'вдали от кромки свободная позиция сохраняется');
assert.equal(position(270,0).y,0,'привязка сохраняет вертикальное выравнивание');
console.log('PASS: draft placement snaps to adjacent edge with zero and nonzero kerf');

// CSS rounds scaled dimensions; equal physical sizes must still form a staircase.
const scale=.2305921052631579;
const makePiece=(id,x,y,length,width,z,groupId='')=>{
  const values={left:`${x*scale}px`,top:`${y*scale}px`,width:`${(length*scale).toFixed(4)}px`,height:`${(width*scale).toFixed(4)}px`,zIndex:String(z)};
  return {dataset:{draftPreviewId:id,unplacedGroupId:groupId},style:{...values,setProperty(key,value){this[key]=value}},visibility:'visible'};
};
const board={style:{width:'1730px',height:'800px'},getBoundingClientRect:()=>({width:1730,height:800}),querySelectorAll(){return this.pieces}};
context.getComputedStyle=piece=>({visibility:piece.visibility});
context.draftUnplacedPositions=new Map();
context.draftUnplacedGroupIds=new Map();
const narrow={length:343,width:660},wide={length:1070,width:333};
board.pieces=[makePiece('first',0,0,343,660,1),makePiece('second',1000,0,343,660,1)];
let snappedWithoutTarget=context.draftUnplacedSnapPosition(board,narrow,1000,0,scale);
assert.notDeepEqual(snappedWithoutTarget,{x:1000+12/scale,y:12/scale},'без захода курсора на деталь склеивание не происходит');
let snapped=context.draftUnplacedSnapPosition(board,narrow,1000,0,scale,undefined,board.pieces[1]);
assert.ok(Math.abs((snapped.x-1000)*scale-12)<.01&&Math.abs(snapped.y*scale-12)<.01,'вторая группа одинаковых деталей примагничивается по обеим осям');

controls.projectMaxUnplacedGroupSize={value:'3'};
const identical=Array.from({length:8},(_,i)=>({previewId:`equal-${i}`,length:343,width:660,material:'ЛДСП'}));
const firstPass=context.unplacedGroupsForRender(identical);
assert.deepEqual(Array.from(firstPass,group=>group.length),[3,3,2]);
assert.equal(new Set(firstPass.map(group=>group[0].unplacedGroupId)).size,3,'разные стопки получают разные идентификаторы');
assert.deepEqual(Array.from(context.unplacedGroupsForRender(identical),group=>group.length),[3,3,2],'повторная отрисовка сохраняет границы групп');
const leftGroup=[makePiece('a',0,0,1070,333,1,'left'),makePiece('b',12/scale,12/scale,1070,333,2,'left')];
const rightGroup=[makePiece('c',1500,0,1070,333,1,'right'),makePiece('d',1500+12/scale,12/scale,1070,333,2,'right')];
const target=makePiece('moving',0,0,1070,333,3,'left');
board.pieces=[...leftGroup,...rightGroup,target];
const originalLeft=leftGroup.map(piece=>[piece.style.left,piece.style.top]);
const preview=context.draftUnplacedSnapPosition(board,wide,1500,0,scale,target,rightGroup[0]);
assert.equal(context.normalizeDraftUnplacedCluster(board,{...wide,previewId:'moving'},scale,target,rightGroup[1]),true);
assert.ok(Math.abs(preview.x-context.draftUnplacedPositions.get('moving').x)<.01&&Math.abs(preview.y-context.draftUnplacedPositions.get('moving').y)<.01,'предпросмотр совпадает с позицией после отпускания');
assert.equal(target.dataset.unplacedGroupId,'right','только переносимая деталь входит в выбранную группу');
assert.deepEqual(leftGroup.map(piece=>[piece.style.left,piece.style.top]),originalLeft,'исходная группа остаётся на месте');
assert.equal(context.draftUnplacedGroupIds.get('moving'),'right');
assert.ok(Math.abs(Number.parseFloat(target.style.left)-Number.parseFloat(rightGroup[0].style.left)-24)<.01);
assert.ok(Math.abs(Number.parseFloat(target.style.top)-Number.parseFloat(rightGroup[0].style.top)-24)<.01);
controls.projectMaxUnplacedGroupSize.value='2';
const overflow=makePiece('overflow',0,0,1070,333,3,'left');
board.pieces=[...leftGroup,...rightGroup,overflow];
assert.equal(context.draftTargetIsFull(board,rightGroup[0],overflow),true);
assert.equal(context.normalizeDraftUnplacedCluster(board,{...wide,previewId:'overflow'},scale,overflow,rightGroup[0]),false,'заполненная группа не объединяется с переносимой деталью');
assert.equal(overflow.dataset.unplacedGroupId,'left');
console.log('PASS: draft drop joins only the target group and respects the group limit');
