(function(){
  function preserveEmptySheets(){
    if(typeof bestResult==='undefined'||!bestResult?.manual||!Array.isArray(bestResult.all))return;
    const allLayouts=bestResult.all.slice();
    if(layouts.length===allLayouts.length&&layouts.every((sheet,index)=>sheet===allLayouts[index]))return;
    layouts=allLayouts;
    bestResult.layouts=allLayouts;
    if(typeof render==='function')render(bestResult.all,bestResult.unplaced);
  }
  document.addEventListener('pointerup',()=>setTimeout(preserveEmptySheets,0));
  document.addEventListener('drop',()=>setTimeout(preserveEmptySheets,0));
})();
