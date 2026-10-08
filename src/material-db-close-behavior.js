(function(){
  document.addEventListener('click',event=>{
    const button=event.target.closest?.('.appRail .railLink[aria-label="База материалов"]');
    if(!button)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const library=document.querySelector('.materialsDb');
    const isOpen=!!library&&!library.classList.contains('hidden');
    document.body.classList.remove('workspaceDrawerOpen','workspaceDrawerWide','projectOnlyMode');
    document.querySelectorAll('#sidebarRoot>*').forEach(item=>{
      item.classList.remove('drawerPanelHidden');
      item.style.removeProperty('display');
    });
    document.querySelectorAll('#sidebarRoot .drawerPanelHidden').forEach(item=>item.classList.remove('drawerPanelHidden'));
    document.querySelectorAll('.appRail .railLink').forEach(item=>item.classList.remove('active'));
    if(isOpen){
      library.classList.add('hidden');
      return;
    }
    library.classList.remove('hidden');
    library.removeAttribute('hidden');
    button.classList.add('active');
  },true);
  document.addEventListener('click',event=>{
    const button=event.target.closest?.('.appRail .railLink');
    if(!button||button.getAttribute('aria-label')==='База материалов')return;
    document.querySelector('.materialsDb')?.classList.add('hidden');
  },true);
  document.addEventListener('click',event=>{
    const library=document.querySelector('.materialsDb');
    if(!library||library.classList.contains('hidden')||library.contains(event.target))return;
    if(event.target.closest?.('.appRail .railLink[aria-label="База материалов"]'))return;
    library.classList.add('hidden');
    document.querySelector('.appRail .railLink[aria-label="База материалов"]')?.classList.remove('active');
  },true);
})();
