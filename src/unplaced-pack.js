(function(){
  function packUnplaced(){
    if(typeof bestResult==='undefined'||!bestResult?.manual||!Array.isArray(bestResult.unplaced)||!bestResult.unplaced.length)return;
    const board=document.querySelector('#unplacedBoard'),reference=layouts[0]||bestResult.all?.[0];
    if(!board||!reference)return;
    const sheetElement=document.querySelector('.sheet'),scale=sheetElement?.getBoundingClientRect().width/(sheetIsTransposed(reference)?reference.width:reference.length)||.2;
    const maxWidth=Math.max(1000,(board.parentElement?.clientWidth||800)/scale),gap=Math.max(0,Number(document.querySelector('#kerf')?.value)||0);
    const step=Math.max(12,Math.min(24,Math.round(Math.min(maxWidth/20,20)))),groups=unplacedGroupsForRender(bestResult.unplaced);
    let x=0,y=0,rowHeight=0;
    splitUnplacedGroups(groups).forEach(group=>{
      const piece=group[0],groupWidth=piece.length+step*(group.length-1),groupHeight=piece.width+step*(group.length-1);
      if(x>0&&x+groupWidth>maxWidth){x=0;y+=rowHeight+gap;rowHeight=0}
      group.forEach((item,index)=>{item.x=x+index*step;item.y=y+index*step});
      x+=groupWidth+gap;rowHeight=Math.max(rowHeight,groupHeight);
    });
    render(bestResult.all,bestResult.unplaced);
  }
  let dragStartedOnSheet=false,unplacedBeforeDrag=0;
  document.addEventListener('pointerdown',event=>{
    dragStartedOnSheet=Boolean(event.target.closest?.('.sheet'));
    unplacedBeforeDrag=typeof bestResult!=='undefined'&&Array.isArray(bestResult?.unplaced)?bestResult.unplaced.length:0;
  },true);
  document.addEventListener('pointerup',()=>setTimeout(()=>{
    const movedToUnplaced=dragStartedOnSheet&&typeof bestResult!=='undefined'&&Array.isArray(bestResult?.unplaced)&&bestResult.unplaced.length>unplacedBeforeDrag;
    if(movedToUnplaced)packUnplaced();
    dragStartedOnSheet=false;
  },0));
})();
