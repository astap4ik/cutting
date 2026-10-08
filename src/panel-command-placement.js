(function(){
  const style=document.createElement('style');
  style.textContent='body:not(.projectOnlyMode) #sidebarRoot>.projectPanelHeader #topbarImportBtn{display:none!important}#projectsPanel .projectPanelHeader .panelCommandButton{margin-left:auto!important;margin-right:6px!important}#partsPanel>h2{display:flex!important;align-items:center!important;gap:8px!important}#partsPanel>h2 .detailsPanelTitle{margin-right:auto!important}#partsPanel>h2 .panelCommandGroup{display:flex;align-items:center;gap:6px;margin-left:auto}#partsPanel>h2 .panelCommandButton{position:static!important;margin:0!important;white-space:nowrap}#partsPanel>h2 .drawerWidthToggle{margin:0!important}#partsPanel>h2 .detailMenuButton{position:absolute!important}';
  document.head.append(style);
  const move=(id,target,groupClass,beforeSelector)=>{
    const button=document.getElementById(id),host=document.querySelector(target);
    if(!button||!host)return;
    button.classList.add('panelCommandButton');
    if(groupClass){
      let group=host.querySelector(`.${groupClass}`);
      if(!group){group=document.createElement('span');group.className=groupClass;host.append(group)}
      const before=beforeSelector&&group.querySelector(beforeSelector);
      before?group.insertBefore(button,before):group.append(button);
      return;
    }
    const before=beforeSelector&&host.querySelector(beforeSelector);
    before?host.insertBefore(button,before):host.append(button);
  };
  const importButton=document.getElementById('topbarImportBtn');
  if(importButton){importButton.textContent='⇧  Импорт JSON';move('topbarImportBtn','.projectPanelHeader','', '.projectPanelToggle')}
  const addPartButton=document.getElementById('topbarAddPartBtn');
  if(addPartButton){addPartButton.textContent='＋  Добавить детали';move('topbarAddPartBtn','#partsPanel>h2','panelCommandGroup','.drawerWidthToggle');addPartButton.style.display='none'}
  const addFromMenu=document.querySelector('.detailMenu [data-detail-action="add"]');
  if(addFromMenu){
    addFromMenu.textContent='Добавить деталь';
    document.addEventListener('click',event=>{
      if(!event.target.closest('.detailMenu [data-detail-action="add"]'))return;
      setTimeout(()=>{
        const row=[...document.querySelectorAll('#parts tbody tr')].at(-1);
        if(!row)return;
        row.querySelectorAll('[data-k]').forEach(field=>{
          if(field.tagName==='SELECT'&&!field.querySelector('option[value=""]')){
            field.insertAdjacentHTML('afterbegin','<option value=""></option>');
          }
          field.value='';
          if(field.tagName==='SELECT')field.selectedIndex=0;
        });
        if(typeof sync==='function')sync();
        setTimeout(()=>row.querySelectorAll('select[data-k]').forEach(field=>{field.selectedIndex=0;field.value=''}),50);
      },0);
    });
  }
})();
