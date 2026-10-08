/* Keep the unplaced board and its draft pieces in the same coordinate system. */
(function(){
  const install=()=>{
    const board=document.querySelector('#unplacedBoard'),area=board?.closest('#unplaced');
    if(!board||!area)return;
    const sync=()=>{
      board.style.setProperty('flex','0 0 auto','important');
      board.querySelectorAll('.draftUnplacedPiece').forEach(piece=>{
        const vars={left:'--draft-piece-left',top:'--draft-piece-top',width:'--draft-piece-width',height:'--draft-piece-height'};
        Object.entries(vars).forEach(([prop,cssVar])=>{
          const value=piece.style.getPropertyValue(prop);
          if(value)piece.style.setProperty(cssVar,value);
        });
      });
      const height=Math.ceil(board.getBoundingClientRect().height||board.scrollHeight||0);
      area.style.setProperty('min-height',`${Math.max(180,height+28)}px`,'important');
    };
    new ResizeObserver(sync).observe(board);
    new MutationObserver(sync).observe(board,{childList:true,subtree:true});
    sync();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
