(function(){
  const style=document.createElement('style');
  style.textContent='#unplaced.hidden{display:none!important}#unplaced.unplacedEmpty{flex:0 0 auto!important;min-height:120px!important;height:auto!important;margin:0!important;padding:0 14px!important;overflow:hidden!important;visibility:visible!important;cursor:copy!important}#unplaced.unplacedEmpty::before{content:"НЕРАЗМЕЩЕННЫЕ ДЕТАЛИ"!important;inset:0!important;display:flex!important;align-items:flex-start!important;justify-content:flex-start!important;padding-top:10px!important;box-sizing:border-box!important;color:#93a0a6!important;font-size:12px!important;font-weight:600!important;letter-spacing:.04em!important;opacity:.75!important;pointer-events:none!important}#unplaced.unplacedEmpty::after{display:none!important}#unplaced.unplacedEmpty #unplacedBoard{display:none!important}';
  document.head.append(style);
  const apply=()=>{
    const area=document.querySelector('#unplaced');
    if(!area)return;
    const previousHeight=Math.ceil(area.getBoundingClientRect().height||0);
    const empty=Boolean(area.querySelector('#unplacedBoard.emptyUnplaced'));
    const wasEmpty=area.classList.contains('unplacedEmpty');
    area.classList.toggle('unplacedEmpty',empty);
    if(empty){
      const height=Math.max(120,previousHeight);
      area.style.setProperty('height',`${Math.ceil(height)}px`,'important');
      area.style.setProperty('min-height',`${Math.ceil(height)}px`,'important');
    }else if(wasEmpty){
      area.style.removeProperty('height');
      area.style.removeProperty('min-height');
    }
  };
  const area=document.querySelector('#unplaced');
  if(!area){new MutationObserver(apply).observe(document.body,{childList:true,subtree:true});return}
  new MutationObserver(apply).observe(area,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  apply();
  window.addEventListener('resize',apply);
})();
