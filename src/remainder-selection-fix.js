// Keep multiple free-remainder selections visible when an older app.js is cached.
window.selectRemainder=function(sheetIndex,remainderIndex){
 const map=document.querySelector(`#layouts .sheet[data-sheet-index="${sheetIndex}"] .freeRemainderMap[data-remainder-index="${remainderIndex}"]`);
 const row=document.querySelector(`#layouts .layout[data-sheet-index="${sheetIndex}"] .freeRemainderCard[data-remainder-index="${remainderIndex}"],#layouts .layout[data-sheet-index="${sheetIndex}"] .freeRemainderRow[data-remainder-index="${remainderIndex}"]`);
 const selected=map?.classList.contains('freeRemainderSelected')||row?.classList.contains('freeRemainderSelected');
 [map,row].forEach(element=>element?.classList.toggle('freeRemainderSelected',!selected));
 window.updateRemainderMapVisibility?.();
};
document.addEventListener('click',event=>{
 const remainder=event.target.closest?.('.freeRemainderMap,.freeRemainderCard,.freeRemainderRow');
 const layout=remainder?.closest('.layout');
 if(!remainder||!layout)return;
 window.selectRemainder(Number(layout.dataset.sheetIndex),Number(remainder.dataset.remainderIndex));
 event.preventDefault();
 event.stopPropagation();
},true);
window.remainderSelections=window.remainderSelections||[];
window.showPlacementPreview=function(sheetEl,s,e){
 if(typeof bestResult==='undefined'||!bestResult)return;
 if(!bestResult.unplaced.length){
  const transposed=typeof sheetIsTransposed==='function'&&sheetIsTransposed(s),point=sheetClickPoint(s,sheetEl,e),px=transposed?s.length-point.x:point.x,py=point.y,selectedForSheet=window.remainderSelections.filter(item=>item.sheet===s),hit=selectedForSheet.find(item=>px>=item.rect.x&&px<=item.rect.x+item.rect.width&&py>=item.rect.y&&py<=item.rect.y+item.rect.height);
  if(hit){hit.element.remove();window.remainderSelections=window.remainderSelections.filter(item=>item!==hit);return;}
  const originalPlaced=s.placed||[],selectedPlaced=selectedForSheet.map(item=>({x:item.rect.x,y:item.rect.y,length:item.rect.width,width:item.rect.height}));
  s.placed=originalPlaced.concat(selectedPlaced);
  let rest;
  try{rest=typeof freeRectangleAt==='function'?freeRectangleAt(sheetEl,s,e):null}finally{s.placed=originalPlaced}
  if(rest){
   const key=[rest.x,rest.y,rest.width,rest.height].join(':');
   const existing=window.remainderSelections.find(item=>item.sheet===s&&item.key===key);
   if(existing){existing.element.remove();window.remainderSelections=window.remainderSelections.filter(item=>item!==existing);return;}
   const element=previewRectangle(sheetEl,s,rest,'Свободный остаток');
   window.remainderSelections.push({sheet:s,element,key,rect:rest});
  }
  return;
 }
 if(typeof clearPlacementPreview==='function')clearPlacementPreview();
};
