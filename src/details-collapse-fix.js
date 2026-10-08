(function(){
  const style=document.createElement('style');
  style.textContent='#partsPanel.sectionCollapsed .detailsTablesControls{display:none!important}.sidebarCollapseToggle{display:grid!important;place-items:center!important;width:28px!important;height:28px!important;flex:0 0 28px!important;margin-left:auto!important;padding:0!important;border:0!important;border-radius:4px!important;background:transparent!important;color:#dceff7!important;cursor:pointer!important}.sidebarCollapseToggle:hover{background:#123f56!important;color:#61d5ff!important}.resultWorkspace .layoutToggle:hover .sidebarCollapseToggle{background:transparent!important;color:#607b9c!important}#partsPanel>h2 .sidebarCollapseToggle:hover{background:transparent!important;color:#607b9c!important}.sidebarCollapseToggle .material-symbols-rounded{font-size:24px!important;line-height:1!important}.materialsHead .sidebarCollapseToggle{margin-left:8px!important}.projectPanelHeader .sidebarCollapseToggle{margin-left:auto!important}#partsPanel>h2 .sidebarCollapseToggle{position:absolute!important;top:8px!important;right:42px!important;margin:0!important}';
  document.head.append(style);
  const icon=(collapsed)=>{const el=document.createElement('span');el.className='material-symbols-rounded';el.setAttribute('aria-hidden','true');el.textContent=collapsed?'arrow_drop_down':'arrow_drop_up';return el};
  const wire=(head,panel,label)=>{
    if(!head||!panel||head.querySelector('.sidebarCollapseToggle'))return;
    const button=head.querySelector('.projectPanelToggle')||document.createElement('button');button.type='button';button.classList.add('sidebarCollapseToggle');button.title=label;button.setAttribute('aria-label',label);if(!button.parentElement)head.append(button);
    const sync=()=>{const collapsed=panel.classList.contains('sectionCollapsed')||panel.dataset.panelCollapsed==='true'||panel.classList.contains('projectPanelCollapsed')||panel.classList.contains('projectsCollapsed');button.replaceChildren(icon(collapsed));button.setAttribute('aria-expanded',String(!collapsed))};
    button.addEventListener('click',event=>{event.stopPropagation();if(!button.classList.contains('projectPanelToggle'))head.dispatchEvent(new MouseEvent('click',{bubbles:true}));requestAnimationFrame(sync)});
    new MutationObserver(sync).observe(panel,{attributes:true,attributeFilter:['class','data-panel-collapsed']});
    sync();
  };
  wire(document.querySelector('#sidebarRoot>.projectPanelHeader'),document.querySelector('#projectsPanel'),'Свернуть или развернуть материалы и параметры');
  wire(document.querySelector('#materialsPanel .materialsHead'),document.querySelector('#materialsPanel'),'Свернуть или развернуть материалы');
  wire(document.querySelector('#partsPanel>h2'),document.querySelector('#partsPanel'),'Свернуть или развернуть список деталей');
  wire(document.querySelector('#settingsPanel .settingsHead'),document.querySelector('#settingsPanel'),'Свернуть или развернуть настройки');
  const menu=document.querySelector('.detailMenu');
  document.querySelectorAll('#topbarPdfBtn,#topbarDxfBtn').forEach(button=>button.remove());
  if(menu&&!menu.querySelector('[data-detail-action="exportJson"]')){
    const item=document.createElement('button');
    item.type='button';
    item.dataset.detailAction='exportJson';
    item.textContent='Экспорт JSON';
    menu.append(item);
    item.addEventListener('click',()=>{
      let state={sheets:[],parts:[]};
      try{state=JSON.parse(localStorage.getItem('cutMvp')||'{}')}catch{}
      const project=window.getProjectSnapshot?.(),detailsTables=window.getDetailsTablesSnapshot?.()||[],allParts=detailsTables.length?detailsTables.flatMap(table=>(Array.isArray(table.parts)?table.parts:[]).map(part=>({...part,material:table.material||part.material||''}))):state.parts;const payload={format:'cutting-json',version:2,exportedAt:new Date().toISOString(),project,materials:project?.materials||[],edges:project?.edges||[],sheets:Array.isArray(state.sheets)?state.sheets:[],parts:Array.isArray(allParts)?allParts:[],detailsTables};
      const link=document.createElement('a');
      link.href=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'}));
      link.download='cutting-data.json';
      link.click();
      setTimeout(()=>URL.revokeObjectURL(link.href),0);
    });
  }
  const syncDetailIcons=()=>document.querySelectorAll('.layoutDetailsToggle b').forEach(icon=>{
    const value=icon.textContent.trim();
    if(value!=='＋'&&value!=='−'&&value!=='+'&&value!=='-')return;
    icon.classList.add('material-symbols-rounded');
    icon.textContent=value==='＋'||value==='+'?'expand_more':'expand_less';
  });
  const syncLayoutIcons=()=>document.querySelectorAll('.layoutToggle').forEach(toggle=>{
    const layout=toggle.closest('.layout');
    if(!layout)return;
    let button=toggle.querySelector(':scope > button.projectPanelToggle.sidebarCollapseToggle');
    if(!button){
      const oldIcon=toggle.querySelector(':scope > b');
      button=document.createElement('button');
      button.type='button';
      button.className='projectPanelToggle sidebarCollapseToggle';
      button.title='Свернуть или развернуть лист';
      button.setAttribute('aria-label','Свернуть или развернуть лист');
      const symbol=document.createElement('span');
      symbol.className='material-symbols-rounded';
      symbol.setAttribute('aria-hidden','true');
      button.append(symbol);
      if(oldIcon)oldIcon.replaceWith(button);else toggle.append(button);
      toggle.removeAttribute('role');
      toggle.removeAttribute('tabindex');
    }
    const collapsed=layout.classList.contains('layoutCollapsed'),symbol=button.querySelector('.material-symbols-rounded');
    const value=collapsed?'arrow_drop_down':'arrow_drop_up';
    if(symbol&&symbol.textContent.trim()!==value)symbol.textContent=value;
    const expanded=String(!collapsed);
    if(button.getAttribute('aria-expanded')!==expanded)button.setAttribute('aria-expanded',expanded);
  });
  const detailIconStyle=document.createElement('style');
  detailIconStyle.textContent='.layoutDetailsToggle b.material-symbols-rounded{font-size:20px!important;font-weight:400!important;line-height:1!important;color:#61d5ff!important}';
  document.head.append(detailIconStyle);
  syncDetailIcons();
  syncLayoutIcons();
  new MutationObserver(()=>{syncDetailIcons();syncLayoutIcons()}).observe(document.querySelector('#layouts')||document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class','aria-expanded']});
})();
