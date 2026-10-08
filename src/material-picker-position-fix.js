(function(){
  const menu=document.getElementById('projectMaterialMenu');
  const materials=document.getElementById('projectMaterials');
  if(!menu||!materials)return;

  // The sidebar is translated when it opens. A fixed element inside that
  // transformed subtree gets an extra offset, so keep the popup at document
  // level and position it against the clicked material card.
  document.body.appendChild(menu);
  menu.style.setProperty('z-index','5000','important');

  let anchor=null;

  const position=()=>{
    if(!anchor||menu.hidden)return;
    const rect=anchor.getBoundingClientRect();
    const gap=4;
    const bottom=Math.min(window.innerHeight-8,rect.bottom+gap);
    const maxHeight=Math.max(100,window.innerHeight-bottom-8);
    menu.style.setProperty('position','fixed','important');
    menu.style.setProperty('left',`${Math.max(8,rect.left)}px`,'important');
    menu.style.setProperty('top',`${bottom}px`,'important');
    menu.style.setProperty('right','auto','important');
    menu.style.setProperty('width',`${rect.width}px`,'important');
    menu.style.setProperty('max-width',`${Math.max(120,window.innerWidth-16)}px`,'important');
    menu.style.setProperty('max-height',`${maxHeight}px`,'important');
  };

  document.addEventListener('click',e=>{
    const picker=e.target.closest('.projectMaterialPicker[data-group-index]');
    if(!picker)return;
    anchor=picker;
    requestAnimationFrame(()=>{position();setTimeout(position,240)});
  });

  // The legacy document handler closes the menu for clicks outside the picker.
  // Keep clicks inside the menu from reaching that handler.
  menu.addEventListener('click',e=>e.stopPropagation());
  window.addEventListener('resize',position);
  document.getElementById('sidebarRoot')?.addEventListener('scroll',position,true);
  document.getElementById('sidebarRoot')?.addEventListener('transitionend',position);
})();
