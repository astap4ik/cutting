(function(){
  let selectedPartNumber=null;

  const partNumberFromId=id=>{
    const match=String(id||'').match(/^p(\d+)(?:-|$)/);
    return match?Number(match[1])+1:null;
  };

  const partNumberFromPiece=piece=>{
    const value=Number(piece?.dataset?.partNumber);
    return Number.isInteger(value)&&value>0?value:partNumberFromId(piece?.dataset?.pieceId);
  };

  const applySelection=()=>{
    document.querySelectorAll('.resultWorkspace .piece').forEach(piece=>{
      piece.classList.toggle('detailPartSelected',selectedPartNumber!==null&&partNumberFromPiece(piece)===selectedPartNumber);
    });
  };

  const selectPart=partNumber=>{
    const value=Number(partNumber);
    if(!Number.isInteger(value)||value<1)return;
    selectedPartNumber=value;
    applySelection();
  };

  const partRowNumber=row=>{
    const value=row?.getAttribute('row-index')??row?.dataset?.rowIndex;
    const index=Number(value);
    if(Number.isInteger(index)&&index>=0)return index+1;
    const rows=[...row?.parentElement?.querySelectorAll('.ag-row')||[]];
    const fallback=rows.indexOf(row);
    return fallback>=0?fallback+1:null;
  };

  const grid=document.querySelector('#partsGrid');
  const selectGridRow=event=>{
    const row=event.target.closest('.ag-row');
    if(row&&grid?.contains(row))selectPart(partRowNumber(row));
  };
  // AG Grid can stop bubbling for cell events, so listen during capture on the document.
  document.addEventListener('pointerdown',selectGridRow,true);
  document.addEventListener('click',selectGridRow,true);

  document.querySelector('#parts tbody')?.addEventListener('click',event=>{
    const row=event.target.closest('tr');
    if(row)selectPart([...row.parentElement.children].indexOf(row)+1);
  });

  const style=document.createElement('style');
  style.textContent=`
    html body .resultWorkspace #layouts .sheet > .piece.detailPartSelected,
    html body .resultWorkspace #unplaced #unplacedBoard .piece.detailPartSelected{
      z-index:8!important;
      box-sizing:border-box!important;
      border:2px solid #22c7e8!important;
      outline:0 solid transparent!important;
      box-shadow:0 0 0 2px rgba(34,199,232,.2),0 0 14px rgba(34,199,232,.28)!important;
      background:rgba(34,199,232,.26)!important;
      background-image:none!important;
      filter:none!important;
    }
  `;
  document.head.append(style);

  const observer=new MutationObserver(applySelection);
  observer.observe(document.querySelector('#layouts')||document.body,{childList:true,subtree:true});
  observer.observe(document.querySelector('#unplacedBoard')||document.body,{childList:true,subtree:true});
})();
