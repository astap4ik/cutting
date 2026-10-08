(function(){
  const body=document.getElementById('projectMaterials');
  if(!body)return;
  const table=body.closest('table');
  if(!table)return;
  table.id='projectMaterialsTable';

  const groupLimitInput=document.getElementById('projectMaxUnplacedGroupSize');
  const settingsMode=document.querySelector('#settingsPanel #mode')?.closest('label');
  const groupLimitLabel=groupLimitInput?.closest('label');
  if(groupLimitLabel&&settingsMode){
    groupLimitLabel.classList.add('globalProjectSetting');
    settingsMode.before(groupLimitLabel);
  }

  const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch{return fallback}};
  const write=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
  const materialName=item=>typeof item==='string'?item:item?.name;
  const project=()=>{const list=read('cuttingProjects',[]),name=document.getElementById('projectName')?.value?.trim();if(!name)return null;return list.find(x=>x.name===name)||list[0]};
  let moving=false;
  let normalizing=false;

  const ensureHeader=()=>{
    if(table.querySelector('thead'))return;
    const head=document.createElement('thead');
    head.innerHTML='<tr><th>Материал</th><th>Размер</th></tr>';
    table.insertBefore(head,body);
  };

  const normalizeRows=()=>{
    if(normalizing)return;
    normalizing=true;
    body.querySelectorAll('.projectMaterialRow').forEach(row=>{
      const oldCell=row.querySelector('td[colspan="2"]');
      if(!oldCell)return;
      const card=oldCell.querySelector('.projectMaterialCard');
      const title=card?.querySelector('.projectMaterialInfo strong')?.textContent?.trim()||'';
      const size=title==='Выберите материал…'?'':card?.querySelector('.projectMaterialInfo small')?.textContent?.trim()||'';
      const materialCell=document.createElement('td');
      const sizeCell=document.createElement('td');
      materialCell.className='materialCell';
      sizeCell.className='materialSizeCell';
      materialCell.append(...Array.from(oldCell.childNodes));
      sizeCell.textContent=size;
      row.replaceChildren(materialCell,sizeCell);
    });
    normalizing=false;
  };

  let fields=document.getElementById('activeMaterialFields');
  if(!fields){
    fields=document.createElement('div');
    fields.id='activeMaterialFields';
    fields.innerHTML='<div class="activeMaterialFieldsTitle">Параметры выбранного материала</div><div class="activeMaterialFieldsBody"></div>';
    table.after(fields);
  }

  const renderFields=()=>{
    if(moving||normalizing)return;
    normalizeRows();
    const rows=[...body.querySelectorAll('.projectMaterialRow')];
    if(!rows.length){
      fields.classList.add('empty');
      fields.querySelector('.activeMaterialFieldsBody').textContent='Материалы не добавлены';
      return;
    }
    const row=rows.find(x=>x.classList.contains('active'))||rows[0];
    rows.forEach(x=>x.classList.toggle('active',x===row));
    const card=row.querySelector('.projectMaterialCard');
    const name=card?.querySelector('[data-remove-material]')?.dataset.removeMaterial||card?.querySelector('.projectMaterialInfo strong')?.textContent?.trim()||'Выберите материал…';
    const existing=row.querySelector('.projectGroupFields');
    if(existing){
      moving=true;
      fields.querySelector('.activeMaterialFieldsBody').replaceChildren(existing);
      moving=false;
    }
    fields.classList.remove('empty');
    fields.querySelector('.activeMaterialFieldsTitle').textContent=name==='Выберите материал…'?'Параметры материала':`Параметры: ${name}`;
  };

  const persistField=event=>{
    const input=event.target.closest('[data-material-field]');
    if(!input)return;
    const projects=read('cuttingProjects',[]),projectName=document.getElementById('projectName')?.value?.trim(),p=projects.find(x=>x.name===projectName)||projects[0];
    if(!p)return;
    const name=input.dataset.materialName;
    const item=(p.materials||[]).find(x=>materialName(x)===name);
    if(!item)return;
    item[input.dataset.materialField]=input.dataset.materialField==='qty'?Math.max(1,Number(input.value)||1):input.value;
    p.updated=new Date().toISOString();
    write('cuttingProjects',projects);
    const cutting=read('cutMvp',{sheets:[],parts:[]});
    cutting.sheets=(p.materials||[]).filter(x=>materialName(x)).map(x=>({material:materialName(x),length:Number(x.length)||2800,width:Number(x.width)||2070,qty:Number(x.qty)||1}));
    write('cutMvp',cutting);
    window.dispatchEvent(new CustomEvent('projectMaterialsChanged',{detail:{source:'material-field'}}));
  };

  const addMaterial=event=>{
    event.preventDefault();
    event.stopImmediatePropagation();
    const rows=[...body.querySelectorAll('.projectMaterialRow')];
    const source=rows[rows.length-1];
    if(!source)return;
    const copy=source.cloneNode(true);
    const card=copy.querySelector('.projectMaterialCard');
    const info=copy.querySelector('.projectMaterialInfo');
    const thumb=copy.querySelector('.projectMaterialThumb');
    const oldFields=fields.querySelector('.projectGroupFields');
    copy.classList.remove('active');
    copy.querySelectorAll('[data-group-index]').forEach(x=>x.dataset.groupIndex=String(rows.length));
    if(card)card.dataset.groupIndex=String(rows.length);
    if(info){
      const title=info.querySelector('strong');
      const small=info.querySelector('small');
      if(title)title.textContent='Выберите материал…';
      if(small)small.textContent='Материал не выбран';
    }
    if(thumb){thumb.classList.add('isEmpty');thumb.style.backgroundImage='';}
    copy.querySelector('.projectRemove')?.remove();
    const cell=copy.querySelector('td');
    if(cell&&oldFields)cell.append(oldFields.cloneNode(true));
    body.append(copy);
    rows.forEach(row=>row.classList.remove('active'));
    copy.classList.add('active');
    renderFields();
  };

  ensureHeader();
  normalizeRows();
  body.addEventListener('click',event=>{
    const row=event.target.closest('.projectMaterialRow');
    if(!row)return;
    body.querySelectorAll('.projectMaterialRow').forEach(x=>x.classList.toggle('active',x===row));
    renderFields();
  });
  fields.addEventListener('input',persistField);
  fields.addEventListener('change',persistField);
  const installedButtons=new WeakSet();
  const installAddButton=()=>{
    const button=document.getElementById('projectAddMaterialBottom');
    if(!button||installedButtons.has(button))return;
    installedButtons.add(button);
    button.addEventListener('click',addMaterial,true);
  };
  installAddButton();
  const observer=new MutationObserver(()=>{installAddButton();if(!moving&&!normalizing){ensureHeader();normalizeRows();renderFields();syncGrid()}});
  observer.observe(body,{childList:true,subtree:true});

  const style=document.createElement('style');
  style.textContent='#projectMaterialsTable{width:100%!important;border:1px solid #d7e1ec!important;border-collapse:collapse!important;table-layout:fixed!important;background:#fff!important}#projectMaterialsTable thead th:first-child{width:82%!important}#projectMaterialsTable thead th:last-child{width:18%!important}.projectMaterialsCatalog thead th{padding:7px 8px!important;text-align:left!important;color:#7890a5!important;font-size:10px!important;font-weight:700!important;border-bottom:1px solid #d7e1ec!important}.projectMaterialsCatalog .projectMaterialRow{cursor:pointer}.projectMaterialsCatalog .projectMaterialRow.active td{background:#eef7ff!important}.projectMaterialsCatalog .projectMaterialRow td{padding:7px 6px!important;vertical-align:top!important;border-bottom:1px solid #e1e8ef!important}.projectMaterialsCatalog .projectGroupFields{display:none!important}.projectMaterialsCatalog .materialSizeCell{color:#657895!important;font-size:10px!important;white-space:nowrap!important}#activeMaterialFields{margin-top:10px;padding:10px 0 0;border-top:1px solid #d7e1ec}#activeMaterialFields.empty{color:#809098;font-size:11px}#activeMaterialFields .activeMaterialFieldsTitle{margin-bottom:7px;color:#657895;font-size:11px;font-weight:700}#activeMaterialFields .projectGroupFields{display:flex!important;margin:0!important;padding:0!important;border:0!important;gap:8px!important}#activeMaterialFields .projectGroupFields label{flex:1!important}';
  document.head.append(style);
  const layoutStyle=document.createElement('style');
  layoutStyle.textContent='html body main #sidebarRoot #projectsPanel,html body main #sidebarRoot #projectsPanel .projectsContent,html body main #sidebarRoot #projectsPanel .projectsContent>*{min-width:0!important}html body main #sidebarRoot #projectsPanel .projectsContent{padding-left:10px!important;padding-right:10px!important}#projectMaterialsTable thead th:first-child{width:68%!important}#projectMaterialsTable thead th:last-child{width:32%!important;white-space:normal!important}#projectMaterialsTable .projectMaterialCard,#projectMaterialsTable .projectMaterialInfo{min-width:0!important;max-width:100%!important}#projectMaterialsTable .projectMaterialInfo{overflow:hidden!important}#projectMaterialsTable .projectMaterialInfo strong,#projectMaterialsTable .projectMaterialInfo small{display:block!important;min-width:0!important;max-width:100%!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}#projectMaterialsTable .materialSizeCell{white-space:normal!important;overflow:hidden!important;overflow-wrap:anywhere!important;word-break:break-word!important;line-height:1.2!important}#activeMaterialFields .projectGroupFields{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:8px!important;width:100%!important}#activeMaterialFields .projectGroupFields label{display:block!important;min-width:0!important;width:auto!important}#activeMaterialFields .projectGroupFields input,#activeMaterialFields .projectGroupFields select{display:block!important;width:100%!important;min-width:0!important;max-width:100%!important;box-sizing:border-box!important;text-overflow:ellipsis!important}html body main #sidebarRoot .projectIdentity{min-width:0!important}html body main #sidebarRoot .projectIdentity .projectNameLabel{min-width:0!important}html body main #sidebarRoot .projectIdentity .projectNameLabel input{min-width:0!important;max-width:100%!important}html body main #sidebarRoot .projectStatus{flex:0 0 auto!important;white-space:nowrap!important}.projectActions{flex-wrap:wrap!important}';
  document.head.append(layoutStyle);
  const gridHost=document.createElement('div');
  gridHost.id='projectMaterialsGrid';
  gridHost.className='projectMaterialsList';
  gridHost.setAttribute('aria-label','Материалы проекта');
  table.hidden=true;
  table.style.setProperty('display','none','important');
  table.setAttribute('aria-hidden','true');
  fields.before(gridHost);
  let gridApi=null;
  const gridRows=()=>[...body.querySelectorAll('.projectMaterialRow')].map((row,index)=>{
    const card=row.querySelector('.projectMaterialCard');
    const displayName=card?.querySelector('.projectMaterialInfo strong')?.textContent?.trim()||'Выберите материал…';
    const name=card?.querySelector('[data-remove-material]')?.dataset.removeMaterial||displayName;
    const projectItem=project()?.materials?.find(item=>materialName(item)===name)||{};
    const record=(window.materialDbState?.db?.sheets||[]).find(item=>item.name===name||item.shortName===name)||{};
    const value=field=>row.querySelector(`[data-material-field="${field}"]`)?.value||projectItem[field]||'';
    return {index,name,displayName,supplier:record.supplier||projectItem.supplier||'',article:record.article||projectItem.article||'',length:record.length||projectItem.length||'',width:record.width||projectItem.width||'',thickness:record.thickness||projectItem.thickness||'',qty:value('qty')||1,edge:value('edge'),kerf:document.getElementById('projectKerf')?.value||4,margin:document.getElementById('projectMargin')?.value||0,textureDirection:document.getElementById('projectTextureDirection')?.value||'length',materialUrl:record.materialUrl||projectItem.materialUrl||'',imageUrl:record.imageUrl||projectItem.imageUrl||'',active:row.classList.contains('active'),sourceRow:row};
  });
  const copyCard=(params)=>{
    const source=params.data.sourceRow?.querySelector('.projectMaterialCard');
    const card=document.createElement('div');
    card.className='projectMaterialGridCard projectMaterialPicker';
    card.dataset.groupIndex=String(params.data.index);
    card.setAttribute('role','button');
    card.tabIndex=0;
    if(source)card.innerHTML=source.innerHTML;
    const remove=card.querySelector('[data-remove-material]');
    remove?.addEventListener('click',event=>{
      event.preventDefault();
      event.stopPropagation();
      source?.querySelector('[data-remove-material]')?.click();
    });
    const activate=event=>{
      event?.stopPropagation();
      body.querySelectorAll('.projectMaterialRow').forEach(x=>x.classList.toggle('active',x===params.data.sourceRow));
      params.api.getDisplayedRowAtIndex(params.node.rowIndex)?.setSelected(true);
      renderFields();
      openPicker(card);
    };
    card.addEventListener('click',activate);
    card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();activate()}});
    return card;
  };
  const openPicker=card=>{
    const menu=document.getElementById('projectMaterialMenu');
    if(!menu||!card)return;
    if(menu.parentElement!==document.body)document.body.appendChild(menu);
    const positionMenu=()=>{
      if(menu.hidden)return;
      const rect=card.getBoundingClientRect(),gap=4,padding=8;
      const width=Math.min(Math.max(220,rect.width),Math.max(220,window.innerWidth-padding*2));
      const left=Math.min(Math.max(padding,rect.left),Math.max(padding,window.innerWidth-width-padding));
      const top=rect.bottom+gap;
      menu.style.setProperty('position','fixed','important');
      menu.style.setProperty('left',`${left}px`,'important');
      menu.style.setProperty('top',`${Math.max(padding,top)}px`,'important');
      menu.style.setProperty('right','auto','important');
      menu.style.setProperty('width',`${width}px`,'important');
      menu.style.setProperty('max-width',`calc(100vw - ${padding*2}px)`,'important');
      menu.style.setProperty('max-height',`${Math.max(100,window.innerHeight-top-padding)}px`,'important');
    };
    menu._targetPicker=card;
    const title=card.querySelector('.projectMaterialInfo strong');
    const fullName=card.querySelector('[data-remove-material]')?.dataset.removeMaterial||'';
    menu.dataset.targetMaterial=fullName||(title&&title.textContent!=='Выберите материал…'?title.textContent.trim():'');
    menu.hidden=false;
    menu.querySelector('.projectMaterialSearch')?.focus();
    requestAnimationFrame(positionMenu);
    setTimeout(positionMenu,0);
    setTimeout(positionMenu,240);
  };
  document.addEventListener('click',event=>{
    const menu=document.getElementById('projectMaterialMenu');
    if(!menu||menu.hidden)return;
    if(event.target.closest('#projectMaterialMenu')||event.target.closest('.projectMaterialGridCard'))return;
    if(!event.target.closest('.projectMaterialPicker'))menu.hidden=true;
  });
  const topbarMenuButton=document.getElementById('topbarMenuBtn');
  const projectHeader=document.querySelector('#sidebarRoot>.projectPanelHeader');
  const projectFile=document.getElementById('projectFile');
  const projectPanel=document.getElementById('projectsPanel');
  projectHeader?.querySelectorAll('.projectPanelToggle,.sidebarCollapseToggle').forEach(button=>button.remove());
  if(projectHeader)projectHeader.onclick=event=>event.stopPropagation();
  projectPanel?.classList.remove('projectsCollapsed','projectPanelCollapsed','sectionCollapsed');
  if(projectPanel){projectPanel.dataset.panelCollapsed='false';projectPanel.style.removeProperty('height')}
  projectPanel?.querySelector('.projectsContent')?.style.removeProperty('display');
  const projectContent=projectPanel?.querySelector('.projectsContent');
  if(projectContent&&!projectContent.querySelector('.projectBlockTitle')){
    const title=(text,kind)=>{const node=document.createElement('div');node.className=`projectBlockTitle ${kind}`;node.textContent=text;return node};
    const mainAnchor=projectContent.querySelector('.projectIdentity,.projectNameLabel');
    const materialsAnchor=projectContent.querySelector('.projectLists');
    mainAnchor?.before(title('Основные параметры','projectMainBlockTitle'));
    materialsAnchor?.before(title('Материалы','projectMaterialsBlockTitle'));
  }
  const projectNameLabel=projectContent?.querySelector('.projectNameLabel');
  const projectNameText=projectNameLabel&&[...projectNameLabel.childNodes].find(node=>node.nodeType===Node.TEXT_NODE);
  if(projectNameText)projectNameText.textContent='Название';
  const projectList=projectContent?.querySelector('#projectList');
  const projectStatus=document.getElementById('projectStatus');
  const finishProject=document.getElementById('finishProjectBtn');
  const archiveProject=document.getElementById('archiveProjectBtn');
  if(projectContent&&projectList&&projectStatus&&finishProject&&archiveProject&&!projectContent.querySelector('.projectStateBlock')){
    const stateBlock=document.createElement('section');
    stateBlock.className='projectStateBlock';
    stateBlock.innerHTML='<div class="projectBlockTitle projectStateBlockTitle">СОСТОЯНИЕ ПРОЕКТА</div><div class="projectStateBody"></div>';
    const stateBody=stateBlock.querySelector('.projectStateBody');
    stateBody.append(projectStatus,finishProject.parentElement);
    finishProject.textContent='Завершить проект';
    archiveProject.textContent='Архивировать';
    projectList.before(stateBlock);
  }
  if(projectList&&!projectContent.querySelector('.projectArchiveTitle')){
    const archiveTitle=document.createElement('div');
    archiveTitle.className='projectArchiveTitle projectBlockTitle';
    archiveTitle.innerHTML='<span class="projectSectionIcon"><span class="material-symbols-rounded" aria-hidden="true">inventory_2</span></span><span class="projectSectionHeading"><strong>Архив проектов</strong><small>Сохранённые проекты</small></span>';
    projectList.before(archiveTitle);
  }
  if(projectContent&&!projectContent.querySelector('.projectSectionCard')){
    const wrapRange=(start,end,className)=>{
      if(!start)return null;
      const wrapper=document.createElement('section');wrapper.className=`projectSectionCard ${className}`;
      start.parentNode.insertBefore(wrapper,start);
      let node=start;
      while(node&&node!==end){const next=node.nextSibling;wrapper.append(node);node=next}
      return wrapper;
    };
    const mainTitle=projectContent.querySelector('.projectMainBlockTitle');
    const materialsTitle=projectContent.querySelector('.projectMaterialsBlockTitle');
    const stateBlock=projectContent.querySelector('.projectStateBlock');
    const mainSection=wrapRange(mainTitle,materialsTitle,'projectMainSection');
    const materialsSection=wrapRange(materialsTitle,stateBlock,'projectMaterialsSection');
    const decorate=(title,icon,label,subtitle)=>{if(!title)return;title.innerHTML=`<span class="projectSectionIcon"><span class="material-symbols-rounded" aria-hidden="true">${icon}</span></span><span class="projectSectionHeading"><strong>${label}</strong><small>${subtitle}</small></span>`};
    decorate(mainTitle,'description','Основные параметры','Основная информация о проекте');
    decorate(materialsTitle,'view_in_ar','Материалы','Материалы, используемые в проекте');
    const addButton=materialsSection?.querySelector('#projectAddMaterialBottom');
    if(addButton&&materialsTitle){materialsTitle.append(addButton);addButton.textContent='＋  Добавить материал'}
    const stateTitle=stateBlock?.querySelector('.projectStateBlockTitle');
    decorate(stateTitle,'check_circle','Состояние проекта','Управление статусом и хранением проекта');
    if(mainSection)mainSection.dataset.section='main';
  }
  if(projectFile&&(topbarMenuButton||projectHeader)){
    document.getElementById('topbarImportBtn')?.remove();
    const menuButton=projectHeader?document.createElement('button'):topbarMenuButton;
    if(projectHeader){
      menuButton.id='projectMenuBtn';
      menuButton.type='button';
      menuButton.className='panelCommandButton projectMenuButton';
      menuButton.setAttribute('aria-label','Дополнительные действия');
      menuButton.textContent='☰';
      projectHeader.append(menuButton);
      if(topbarMenuButton)topbarMenuButton.style.display='none';
    }
    const menu=document.createElement('div');
    menu.className='projectTopbarMenu';
    menu.hidden=true;
    menu.innerHTML='<button type="button" data-project-action="import">⇧&nbsp; Импорт JSON</button>';
    menuButton.parentElement?.append(menu);
    menuButton.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();menu.hidden=!menu.hidden});
    menu.querySelector('[data-project-action="import"]')?.addEventListener('click',event=>{event.stopPropagation();menu.hidden=true;projectFile.click()});
    document.addEventListener('click',event=>{if(!event.target.closest('.projectTopbarMenu')&&!event.target.closest('#projectMenuBtn')&&!event.target.closest('#topbarMenuBtn'))menu.hidden=true});
    const menuStyle=document.createElement('style');
    menuStyle.textContent='.projectTopbarActions,.projectPanelHeader{position:relative!important}.projectMenuButton{display:grid!important;place-items:center!important;width:28px!important;height:28px!important;flex:0 0 28px!important;margin:0 4px 0 auto!important;padding:0!important;border:0!important;border-radius:4px!important;background:transparent!important;color:#607b9c!important;font-size:17px!important;line-height:1!important;letter-spacing:0!important;cursor:pointer!important}.projectMenuButton:hover{background:#edf5ff!important;color:#203a5e!important}.projectTopbarMenu{position:absolute!important;top:34px!important;right:4px!important;z-index:200!important;min-width:170px!important;padding:4px!important;border:1px solid #d7e1ec!important;border-radius:6px!important;background:#fff!important;box-shadow:0 8px 22px rgba(32,70,112,.18)!important}.projectTopbarMenu[hidden]{display:none!important}.projectTopbarMenu button{display:block!important;width:100%!important;height:32px!important;padding:0 10px!important;border:0!important;border-radius:4px!important;background:#fff!important;color:#203a5e!important;text-align:left!important;font-size:11px!important;cursor:pointer!important}.projectTopbarMenu button:hover{background:#edf5ff!important}';
    document.head.append(menuStyle);
  }
  const blockStyle=document.createElement('style');
  blockStyle.textContent='html body main #sidebarRoot #projectsPanel .projectsContent{background:#f4f7fb!important;padding:16px!important}html body main #sidebarRoot #projectsPanel .projectSectionCard{display:block!important;margin:0 0 16px!important;padding:18px 20px!important;border:1px solid #e4ebf4!important;border-radius:14px!important;background:#fff!important;box-shadow:0 5px 16px rgba(39,76,119,.07)!important;box-sizing:border-box!important}html body main #sidebarRoot #projectsPanel .projectBlockTitle{display:flex!important;align-items:center!important;gap:12px!important;min-height:58px!important;margin:0 0 16px!important;padding:0 0 16px!important;border-bottom:1px solid #e5ecf4!important;color:#1b3153!important;font-size:12px!important;font-weight:700!important;letter-spacing:0!important}html body main #sidebarRoot #projectsPanel .projectSectionIcon{display:grid!important;place-items:center!important;width:42px!important;height:42px!important;flex:0 0 42px!important;border-radius:50%!important;background:#e8f3ff!important;color:#0879df!important}html body main #sidebarRoot #projectsPanel .projectSectionIcon .material-symbols-rounded{font-size:23px!important;line-height:1!important}html body main #sidebarRoot #projectsPanel .projectSectionHeading{display:flex!important;flex-direction:column!important;gap:3px!important;min-width:0!important}html body main #sidebarRoot #projectsPanel .projectSectionHeading strong{font-size:18px!important;line-height:1.1!important;color:#162d50!important}html body main #sidebarRoot #projectsPanel .projectSectionHeading small{font-size:11px!important;font-weight:400!important;color:#7186a2!important}html body main #sidebarRoot #projectsPanel .projectMaterialsSection .projectSectionIcon{background:#fff3df!important;color:#ed9712!important}html body main #sidebarRoot #projectsPanel .projectStateBlock{margin:0 0 16px!important;padding:18px 20px!important;border:1px solid #e4ebf4!important;border-radius:14px!important;background:#fff!important;box-shadow:0 5px 16px rgba(39,76,119,.07)!important}html body main #sidebarRoot #projectsPanel .projectStateBlockTitle{margin:0 0 16px!important;text-transform:none!important}html body main #sidebarRoot #projectsPanel .projectStateBlockTitle .projectSectionIcon{background:#e3f8f1!important;color:#18a77c!important}html body main #sidebarRoot #projectsPanel .projectStateBody{display:flex!important;align-items:center!important;gap:12px!important;min-height:42px!important}html body main #sidebarRoot #projectsPanel .projectStateBody .projectStatus{margin-right:auto!important;padding:6px 12px!important;font-size:11px!important}html body main #sidebarRoot #projectsPanel .projectStateBody .projectActions{margin:0!important;display:flex!important;gap:8px!important;flex-wrap:wrap!important}html body main #sidebarRoot #projectsPanel .projectStateBody .projectActions button{min-height:36px!important;padding:0 14px!important;border:1px solid #d7e1ec!important;border-radius:7px!important;background:#fff!important;color:#203a5e!important;font-weight:600!important}html body main #sidebarRoot #projectsPanel .projectStateBody .projectActions button:first-child{border-color:#197ff0!important;background:#197ff0!important;color:#fff!important}html body main #sidebarRoot #projectsPanel .projectMaterialsBlockTitle #projectAddMaterialBottom{margin-left:auto!important;margin-bottom:0!important;min-height:36px!important;padding:0 14px!important;border:0!important;border-radius:7px!important;background:#197ff0!important;color:#fff!important;font-size:11px!important;font-weight:600!important;white-space:nowrap!important}';
  document.head.append(blockStyle);
  const projectOuterStyle=document.createElement('style');
  projectOuterStyle.textContent='html body main #sidebarRoot,html body main #sidebarRoot #projectsPanel,html body main #sidebarRoot>.projectPanelHeader{border:0!important;outline:0!important;box-shadow:none!important;background:transparent!important;border-radius:0!important}html body main #sidebarRoot #projectsPanel>.projectsContent{border:0!important;outline:0!important;box-shadow:none!important}body.projectOnlyMode main #sidebarRoot{background:transparent!important;border-right:0!important}';
  document.head.append(projectOuterStyle);
  const drawerShellStyle=document.createElement('style');
  drawerShellStyle.textContent='body.projectOnlyMode main #sidebarRoot{background:transparent!important;border:0!important;box-shadow:none!important}body.projectOnlyMode main #sidebarRoot>.projectPanelHeader{display:flex!important;background:#fff!important;border:0!important;box-shadow:none!important}body.projectOnlyMode main #sidebarRoot>#projectsPanel{background:#fff!important;border:0!important;box-shadow:none!important;border-radius:0!important}body.projectOnlyMode main #sidebarRoot>#projectsPanel>.projectsContent{background:#fff!important;border:0!important;box-shadow:none!important}';
  document.head.append(drawerShellStyle);
  const spacingStyle=document.createElement('style');
  spacingStyle.textContent='html body main #sidebarRoot #projectsPanel>.projectsContent{padding:12px 14px 16px!important}html body main #sidebarRoot #projectsPanel .projectSectionCard,html body main #sidebarRoot #projectsPanel .projectStateBlock{margin-bottom:14px!important;padding:16px 18px!important;border-radius:12px!important}html body main #sidebarRoot #projectsPanel .projectBlockTitle{min-height:52px!important;margin-bottom:14px!important;padding-bottom:12px!important;gap:10px!important}html body main #sidebarRoot #projectsPanel .projectSectionIcon{width:38px!important;height:38px!important;flex-basis:38px!important}html body main #sidebarRoot #projectsPanel .projectSectionIcon .material-symbols-rounded{font-size:21px!important}html body main #sidebarRoot #projectsPanel .projectSectionHeading strong{font-size:16px!important}html body main #sidebarRoot #projectsPanel .projectSectionHeading small{font-size:10px!important}html body main #sidebarRoot #projectsPanel .projectIdentity,html body main #sidebarRoot #projectsPanel .projectNoteLabel{margin-top:0!important}html body main #sidebarRoot #projectsPanel .projectNoteLabel{margin-bottom:0!important}html body main #sidebarRoot #projectsPanel .projectStateBody{min-height:38px!important}html body main #sidebarRoot #projectsPanel #projectList{margin-top:0!important}';
  document.head.append(spacingStyle);
  const materialParamRenderer=(field,type='number')=>params=>{
    const control=document.createElement(type==='select'?'select':'input');
    control.className='projectMaterialGridControl';
    if(type==='number'){
      control.type='number';
      control.min=field==='qty'?'1':'0';
      control.step=field==='qty'?'1':field==='kerf'?'0.5':'1';
    }
    if(type==='select'){
      const source=field==='edge'?(params.data.sourceRow?.querySelector('[data-material-field="edge"]')||document.querySelector('#activeMaterialFields [data-material-field="edge"]')):document.getElementById('projectTextureDirection');
      [...(source?.options||[])].forEach(option=>control.add(new Option(option.textContent,option.value,option.selected,option.selected)));
    }
    const defaultValue=field==='qty'?1:field==='kerf'?4:field==='margin'?10:'';
    control.value=String(params.value===undefined||params.value===null||params.value===''?defaultValue:params.value);
    control.addEventListener('click',event=>event.stopPropagation());
    if(field==='qty'||field==='kerf'||field==='margin'){
      control.addEventListener('wheel',event=>{
        event.preventDefault();
        event.stopPropagation();
        const step=field==='qty'?1:field==='kerf'?0.5:1;
        const minimum=field==='qty'?1:0;
        const direction=event.deltaY<0?1:-1;
        const current=Number(control.value);
        const next=Math.max(minimum,(Number.isFinite(current)?current:defaultValue)+direction*step);
        control.value=String(Number(next.toFixed(2)));
        control.dispatchEvent(new Event('change',{bubbles:true}));
      },{passive:false});
    }
    const syncSourceField=()=>{
      const sourceField=params.data.sourceRow?.querySelector(`[data-material-field="${field}"]`)||document.querySelector(`#activeMaterialFields [data-material-field="${field}"]`);
      if(sourceField){sourceField.value=control.value;sourceField.dispatchEvent(new Event(field==='edge'?'change':'input',{bubbles:true}))}
      else if(field==='kerf'||field==='margin'){
        const global=document.getElementById(field==='kerf'?'projectKerf':'projectMargin');
        if(global){global.value=control.value;global.dispatchEvent(new Event('input',{bubbles:true}))}
      }else if(field==='textureDirection'){
        const global=document.getElementById('projectTextureDirection');
        if(global){global.value=control.value;global.dispatchEvent(new Event('change',{bubbles:true}))}
      }
    };
    control.addEventListener('input',syncSourceField);
    control.addEventListener('change',syncSourceField);
    return control;
  };
  const expandedMaterialRows=new Set();
  const rowHeightFor=()=>132;
  const materialRowRenderer=params=>{
    const data=params.data;
    const row=document.createElement('div');
    row.className='projectMaterialGridRow';
    const summary=document.createElement('div');
    summary.className='projectMaterialGridSummary';
    const card=document.createElement('div');
    card.className='projectMaterialGridCard projectMaterialPicker';
    card.dataset.groupIndex=String(data.index);
    card.setAttribute('role','button');
    card.tabIndex=0;
    const source=data.sourceRow?.querySelector('.projectMaterialCard');
    const image=source?.querySelector('.projectMaterialThumb');
    const thumb=document.createElement('span');
    thumb.className=`projectMaterialThumb${image?.classList.contains('isEmpty')?' isEmpty':''}`;
    thumb.style.backgroundImage=image?.style.backgroundImage||'';
    const info=document.createElement('span');
    info.className='projectMaterialInfo';
    const name=document.createElement('strong');
    name.textContent=data.displayName;
    name.title=data.name;
    const dimensions=[data.length,data.width,data.thickness].filter(Boolean).join('×');
    const details=document.createElement('small');
    details.textContent=dimensions||'Размер не указан';
    info.append(name,details);
    const arrow=document.createElement('button');
    arrow.type='button';
    arrow.className='projectMaterialGridArrow';
    arrow.innerHTML='<span class="material-symbols-rounded" aria-hidden="true">delete</span>';
    arrow.style.border='0';
    arrow.style.background='transparent';
    arrow.style.padding='0';
    arrow.style.cursor='pointer';
    arrow.title='Удалить материал из проекта';
    arrow.setAttribute('aria-label','Удалить материал из проекта');
    arrow.addEventListener('click',event=>{
      event.preventDefault();
      event.stopPropagation();
      const remove=source?.querySelector('[data-remove-material]');
      if(!remove)return;
      remove.click();
      source.closest('.projectMaterialRow')?.querySelector('.projectRemoveConfirm button:not(.secondary)')?.click();
    });
    card.append(thumb,info);
    summary.append(card,arrow);
    const editor=document.createElement('div');
    editor.className='projectMaterialGridEditor';
    editor.hidden=false;
    [['qty','Листов','number'],['kerf','Пропил','number'],['margin','Отступ','number'],['textureDirection','Текстура','select'],['edge','Кромка','select']].forEach(([field,label,type])=>{
      const group=document.createElement('label');
      group.className='projectMaterialGridField';
      const caption=document.createElement('span');caption.textContent=label;
      const control=materialParamRenderer(field,type)({...params,value:data[field]});
      if(field==='qty'){
        const segmented=document.createElement('span');segmented.className='projectQtySegmented';
        segmented.title='Количество листов можно изменить прокруткой колеса мыши';
        segmented.setAttribute('aria-label','Количество листов. Изменяется прокруткой колеса мыши');
        const minus=document.createElement('button');minus.type='button';minus.textContent='−';
        const plus=document.createElement('button');plus.type='button';plus.textContent='+';
        [minus,plus].forEach(button=>button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();control.value=String(Math.max(1,(Number(control.value)||1)+(button===plus?1:-1)));control.dispatchEvent(new Event('input',{bubbles:true}))}));
        segmented.append(minus,control,plus);group.append(caption,segmented);
      }else if(field==='kerf'||field==='margin'){
        const measure=document.createElement('span');measure.className='projectMeasureControl';
        const unit=document.createElement('span');unit.textContent='мм';measure.append(control,unit);group.append(caption,measure);
      }else group.append(caption,control);
      editor.append(group);
    });
    const toggle=event=>{
      event.stopPropagation();
      expandedMaterialRows.has(data.index)?expandedMaterialRows.delete(data.index):expandedMaterialRows.add(data.index);
      body.querySelectorAll('.projectMaterialRow').forEach(x=>x.classList.toggle('active',x===data.sourceRow));
      renderFields();
      params.api.resetRowHeights();
      setTimeout(()=>setGridHeight(),0);
      editor.hidden=!expandedMaterialRows.has(data.index);
      arrow.textContent=expandedMaterialRows.has(data.index)?'⌄':'›';
    };
    summary.addEventListener('click',event=>{
      if(event.target.closest('.projectMaterialInfo strong'))openPicker(card);
    });
    card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openPicker(card)}});
    editor.addEventListener('click',event=>event.stopPropagation());
    row.append(summary,editor);
    return row;
  };
  const setGridHeight=()=>{
    const rows=gridRows();
    gridHost.style.height=`${Math.max(64,rows.reduce((height,row)=>height+rowHeightFor({data:row}),0)+1)}px`;
  };
  const syncGrid=()=>{
    const rows=gridRows();
    gridHost.replaceChildren(...rows.map(data=>materialRowRenderer({data,api:null,node:null})));
    gridHost.style.height='auto';
  };
  const hideSelectionColumn=()=>{
    const checkbox=[...document.querySelectorAll('#projectMaterialsGrid .ag-cell')].find(cell=>cell.querySelector('input[type="checkbox"],[role="checkbox"],[class*="checkbox"],.ag-selection-checkbox'));
    const cell=checkbox?.closest('.ag-cell');
    const colId=cell?.getAttribute('col-id');
    if(colId){
      gridApi?.setColumnsVisible?.([colId],false);
      document.querySelectorAll(`#projectMaterialsGrid [col-id="${String(colId).replace(/"/g,'\\"')}"]`).forEach(node=>{node.style.display='none'});
    }else if(cell){
      const row=cell.closest('.ag-row');
      const index=row?[...row.children].indexOf(cell):-1;
      if(index>=0){
        document.querySelectorAll('#projectMaterialsGrid .ag-row').forEach(item=>item.children[index]?.style.setProperty('display','none','important'));
        document.querySelectorAll('#projectMaterialsGrid .ag-header-row').forEach(item=>item.children[index]?.style.setProperty('display','none','important'));
      }
    }
  };
  setTimeout(hideSelectionColumn,100);
  setTimeout(hideSelectionColumn,500);
  window.addEventListener('projectMaterialsChanged',event=>{if(event.detail?.source==='material-field')return;syncGrid()});
  window.addEventListener('projectMaterialsChanged',()=>setTimeout(hideSelectionColumn,0));
  const gridStyle=document.createElement('style');
  gridStyle.textContent='html body main #sidebarRoot #projectMaterialsGrid{width:100%!important;min-width:0!important;min-height:94px!important;border:1px solid #e3eaf2!important;border-radius:4px!important;overflow:hidden!important;background:#fff!important}html body main #sidebarRoot #projectMaterialsGrid.ag-theme-quartz{--ag-header-height:28px!important;--ag-row-height:64px!important;--ag-font-size:11px!important;--ag-header-background-color:#f8fafc!important;--ag-header-foreground-color:#71829a!important;--ag-background-color:#fff!important;--ag-foreground-color:#203a5e!important;--ag-border-color:#e3eaf2!important;--ag-row-border-color:#edf1f6!important;--ag-row-hover-color:#f2f7ff!important;--ag-selected-row-background-color:#dff0ff!important}#projectMaterialsGrid .ag-header-cell-text{font-size:10px!important;font-weight:700!important}#projectMaterialsGrid .ag-cell{min-width:0!important;display:flex!important;align-items:center!important;overflow:hidden!important;white-space:normal!important;line-height:1.2!important}#projectMaterialsGrid .ag-cell-value{min-width:0!important;max-width:100%!important;width:100%!important;overflow:hidden!important}#projectMaterialsGrid .ag-row-selected .ag-cell{background:#dff0ff!important}#projectMaterialsGrid .projectMaterialGridCard{display:grid!important;grid-template-columns:34px minmax(0,1fr)!important;gap:7px!important;align-items:center!important;width:100%!important;min-width:0!important;height:54px!important;box-sizing:border-box!important;padding:5px 0!important;overflow:hidden!important;cursor:pointer!important}#projectMaterialsGrid .projectMaterialGridCard .projectMaterialThumb{width:34px!important;height:34px!important;min-width:34px!important}#projectMaterialsGrid .projectMaterialGridCard .projectMaterialInfo{min-width:0!important;overflow:hidden!important}#projectMaterialsGrid .projectMaterialGridCard .projectMaterialInfo strong,#projectMaterialsGrid .projectMaterialGridCard .projectMaterialInfo small{display:block!important;min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}#projectMaterialsGrid .projectMaterialGridCard .projectMaterialChevron,#projectMaterialsGrid .projectMaterialGridCard .projectRemove{display:none!important}#projectMaterialsGrid .ag-body-horizontal-scroll{display:none!important;height:0!important;min-height:0!important}#projectMaterialsGrid .ag-center-cols-viewport{overflow-x:hidden!important}';
  document.head.append(gridStyle);
  const siteStyle=document.createElement('style');
  siteStyle.textContent='html{--sidebar-width:720px!important}html body main #sidebarRoot #projectMaterialsTable{display:none!important}html body main #sidebarRoot #projectsPanel .projectNameLabel input,html body main #sidebarRoot #projectsPanel textarea,html body main #sidebarRoot #projectsPanel input,html body main #sidebarRoot #projectsPanel select{box-sizing:border-box!important;background:#fff!important;background-image:none!important;color:#203a5e!important;border:1px solid #d7e1ec!important;border-radius:4px!important;box-shadow:none!important}html body main #sidebarRoot #projectsPanel .projectNameLabel input{height:36px!important;padding:0 9px!important;font-size:12px!important}html body main #sidebarRoot #projectsPanel .projectNameLabel input::placeholder,html body main #sidebarRoot #projectsPanel textarea::placeholder{color:#9aabc0!important}html body main #sidebarRoot #projectsPanel textarea{min-height:58px!important;padding:8px 9px!important;font-size:11px!important}html body main #sidebarRoot #projectsPanel .projectGroupFields input,html body main #sidebarRoot #projectsPanel .projectGroupFields select,html body main #sidebarRoot #projectsPanel .projectCuttingOptions input,html body main #sidebarRoot #projectsPanel .projectCuttingOptions select{height:36px!important;padding:0 9px!important;font-size:11px!important}html body main #sidebarRoot #projectsPanel label{color:#71829a!important;font-size:11px!important}html body main #sidebarRoot #projectsPanel .projectItem{border:1px solid #e3eaf2!important;background:#fff!important;color:#203a5e!important;border-radius:0!important}html body main #sidebarRoot #projectsPanel .projectItem.active{border-color:#b9d9ee!important;background:#f2f8fc!important}html body main #sidebarRoot #projectsPanel .projectSelect{color:#203a5e!important;background:transparent!important}html body main #sidebarRoot #projectsPanel .projectStatus{background:#eef2f5!important;color:#657895!important;border:0!important}html body main #sidebarRoot #projectMaterialsGrid{overflow:hidden!important}html body main #sidebarRoot #projectMaterialsGrid .ag-header{background:#f8fafc!important;border-bottom:1px solid #e3eaf2!important}html body main #sidebarRoot #projectMaterialsGrid .ag-header-cell,html body main #sidebarRoot #projectMaterialsGrid .ag-header-group-cell{color:#71829a!important;background:#f8fafc!important;border-right:1px solid #edf1f6!important}html body main #sidebarRoot #projectMaterialsGrid .ag-row{background:#fff!important;border-bottom:1px solid #edf1f6!important}html body main #sidebarRoot #projectMaterialsGrid .ag-row-odd{background:#fcfdff!important}html body main #sidebarRoot #projectMaterialsGrid .ag-row-hover .ag-cell{background:#f2f7ff!important}html body main #sidebarRoot #projectMaterialsGrid .ag-cell{color:#203a5e!important;border-right:1px solid #f0f3f6!important}html body main #sidebarRoot #projectMaterialsGrid .ag-body-horizontal-scroll{display:block!important;height:18px!important;min-height:18px!important;background:#f8fafc!important;border-top:1px solid #edf1f6!important}html body main #sidebarRoot #projectMaterialsGrid .ag-body-horizontal-scroll-viewport{height:18px!important;scrollbar-color:#8fa8bc #f8fafc!important;overflow-x:scroll!important}html body main #sidebarRoot #projectMaterialsGrid .ag-body-horizontal-scroll-container{height:18px!important}html body main #sidebarRoot #activeMaterialFields{background:#fff!important;color:#203a5e!important}html body main #sidebarRoot #activeMaterialFields .activeMaterialFieldsTitle{color:#657895!important}';
  document.head.append(siteStyle);
  const gridControlStyle=document.createElement('style');
  gridControlStyle.textContent='html body main #sidebarRoot #projectsPanel .projectCuttingOptions,html body main #sidebarRoot #activeMaterialFields{display:none!important}html body main #sidebarRoot #projectMaterialsGrid .ag-pinned-left-header,html body main #sidebarRoot #projectMaterialsGrid .ag-pinned-left-cols-container,html body main #sidebarRoot #projectMaterialsGrid .ag-cell:has(.ag-selection-checkbox),html body main #sidebarRoot #projectMaterialsGrid .ag-cell:has(.ag-checkbox-input-wrapper),html body main #sidebarRoot #projectMaterialsGrid .ag-cell:has([role="checkbox"]){display:none!important;width:0!important;min-width:0!important;padding:0!important}html body main #sidebarRoot #projectMaterialsGrid .ag-header-row>.ag-header-cell:first-child{display:none!important;width:0!important;min-width:0!important}html body main #sidebarRoot #projectMaterialsGrid .projectMaterialGridControl{width:100%!important;min-width:0!important;height:30px!important;box-sizing:border-box!important;padding:0 6px!important;border:1px solid #d7e1ec!important;border-radius:4px!important;background:#fff!important;color:#203a5e!important;font-size:11px!important}html body main #sidebarRoot #projectMaterialsGrid .projectMaterialGridControl:focus{outline:2px solid #b9d9ee!important;outline-offset:-1px!important}html body main #sidebarRoot #projectMaterialsGrid .ag-cell:has(.projectMaterialGridControl){padding-left:4px!important;padding-right:4px!important}html body main #sidebarRoot #projectMaterialsGrid .ag-body-horizontal-scroll,html body main #sidebarRoot #projectMaterialsGrid .ag-body-horizontal-scroll-viewport,html body main #sidebarRoot #projectMaterialsGrid .ag-body-horizontal-scroll-container{display:none!important;width:0!important;height:0!important;min-height:0!important;overflow:hidden!important}html body main #sidebarRoot #projectMaterialsGrid .ag-center-cols-viewport{overflow-x:hidden!important}';
  document.head.append(gridControlStyle);
  const compactGridStyle=document.createElement('style');
  compactGridStyle.textContent='html body main #sidebarRoot #projectMaterialsGrid .ag-header{display:none!important}html body main #sidebarRoot #projectMaterialsGrid .ag-cell{display:block!important;padding:0!important;border-right:0!important;overflow:visible!important}html body main #sidebarRoot #projectMaterialsGrid .ag-cell-wrapper,html body main #sidebarRoot #projectMaterialsGrid .ag-cell-value{display:block!important;width:100%!important;height:100%!important;overflow:visible!important}html body main #sidebarRoot #projectMaterialsGrid .ag-row{background:transparent!important;border:0!important;margin:0!important;padding:0 0 10px!important;box-sizing:border-box!important}html body main #sidebarRoot #projectMaterialsGrid .ag-row-hover .ag-cell{background:transparent!important}.projectMaterialGridRow{width:100%!important;height:122px!important;min-width:0!important;border:1px solid #dfe8f2!important;border-radius:8px!important;background:#fff!important;overflow:hidden!important;box-sizing:border-box!important}.projectMaterialGridSummary{display:flex!important;align-items:center!important;gap:6px!important;min-height:64px!important;padding:6px 10px!important;box-sizing:border-box!important;background:#fff!important}.projectMaterialGridSummary .projectMaterialGridCard{flex:1 1 auto!important;height:54px!important;padding:5px 0!important}.projectMaterialGridSummary .projectMaterialGridCard .projectMaterialThumb{width:48px!important;height:48px!important;min-width:48px!important}.projectMaterialGridArrow{flex:0 0 18px!important;width:18px!important;color:#173d68!important;font-size:24px!important;line-height:1!important;text-align:center!important}.projectMaterialGridEditor{display:grid!important;grid-template-columns:1fr .9fr .9fr 1.25fr 1.35fr!important;gap:8px!important;padding:7px 10px 9px!important;border-top:1px solid #e7edf3!important;background:#fff!important;box-sizing:border-box!important}.projectMaterialGridEditor[hidden]{display:none!important}.projectMaterialGridField{display:block!important;min-width:0!important;color:#17304f!important;font-size:10px!important}.projectMaterialGridField>span{display:block!important;margin:0 0 3px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}.projectMaterialGridField .projectMaterialGridControl{width:100%!important;height:29px!important;min-width:0!important;padding:0 6px!important;font-size:10px!important}.projectMaterialGridField>.projectQtySegmented,.projectMaterialGridField>.projectMeasureControl{display:flex!important;margin:0!important}.projectQtySegmented .projectMaterialGridControl{width:auto!important;flex:1 1 auto!important;min-width:0!important}.projectMaterialGridSummary .projectMaterialInfo strong{font-size:11px!important}.projectMaterialGridSummary .projectMaterialInfo small{font-size:10px!important;color:#71829a!important}.projectQtySegmented,.projectMeasureControl{display:flex!important;width:100%!important;height:29px!important;box-sizing:border-box!important}.projectQtySegmented{border:1px solid #d7e1ec!important;border-radius:6px!important;overflow:hidden!important;background:#fff!important}.projectQtySegmented button{width:28px!important;flex:0 0 28px!important;padding:0!important;border:0!important;background:#f8fbff!important;color:#1c3556!important;font-size:17px!important;line-height:1!important;cursor:pointer!important}.projectQtySegmented button:hover{background:#e7f2ff!important;color:#0879df!important}.projectQtySegmented .projectMaterialGridControl{border:0!important;border-left:1px solid #e2eaf3!important;border-right:1px solid #e2eaf3!important;border-radius:0!important;text-align:center!important}.projectMeasureControl{border:1px solid #d7e1ec!important;border-radius:6px!important;overflow:hidden!important;background:#fff!important}.projectMeasureControl .projectMaterialGridControl{border:0!important;border-radius:0!important;flex:1 1 auto!important}.projectMeasureControl>span{display:grid!important;place-items:center!important;min-width:27px!important;padding:0 4px!important;border-left:1px solid #e2eaf3!important;color:#7890a5!important;font-size:10px!important;background:#f8fbff!important}.projectMaterialGridField:nth-child(4) .projectMaterialGridControl{border-color:#9bcaf7!important;background:#edf7ff!important;color:#0879df!important}.projectMaterialGridField:nth-child(5) .projectMaterialGridControl{background:#fff!important}';
  document.head.append(compactGridStyle);
  const frameTrimStyle=document.createElement('style');
  frameTrimStyle.textContent='html body main #sidebarRoot #projectMaterialsGrid{border:0!important;border-radius:0!important;background:transparent!important;overflow:visible!important;padding:0!important}html body main #sidebarRoot #projectMaterialsGrid .projectMaterialGridRow{height:132px!important;border:1px solid #edf2f7!important;border-radius:8px!important;margin:0 0 10px!important;background:#fbfdff!important;overflow:hidden!important}html body main #sidebarRoot #projectMaterialsGrid .projectMaterialGridRow:last-child{margin-bottom:0!important}html body main #sidebarRoot #projectMaterialsGrid .projectMaterialGridEditor{padding-bottom:15px!important;border-top:1px solid #f0f4f8!important;background:transparent!important}html body main #sidebarRoot #projectMaterialsGrid .projectMaterialGridSummary{padding-left:14px!important;padding-right:14px!important;background:transparent!important}';
  document.head.append(frameTrimStyle);
  const outlineTrimStyle=document.createElement('style');
  outlineTrimStyle.textContent='html body main #sidebarRoot #projectsPanel .projectSectionCard,html body main #sidebarRoot #projectsPanel .projectStateBlock,html body main #sidebarRoot #projectsPanel .projectMaterialsSection{border:0!important;border-radius:0!important;box-shadow:none!important;background:transparent!important;padding-left:0!important;padding-right:0!important}html body main #sidebarRoot #projectsPanel .projectSectionCard,html body main #sidebarRoot #projectsPanel .projectStateBlock{padding-top:8px!important;padding-bottom:8px!important}html body main #sidebarRoot #projectsPanel #projectMaterialsGrid .projectMaterialGridRow{height:132px!important;border:1px solid #edf2f7!important;border-radius:8px!important;border-bottom:1px solid #edf2f7!important;margin-bottom:10px!important;background:#fbfdff!important}html body main #sidebarRoot #projectsPanel #projectMaterialsGrid .projectMaterialGridRow:last-child{margin-bottom:0!important}html body main #sidebarRoot #projectsPanel #projectMaterialsGrid .projectMaterialGridEditor{padding-bottom:15px!important}html body main #sidebarRoot #projectsPanel #projectMaterialsGrid .projectMaterialGridSummary{padding-left:14px!important;padding-right:14px!important}html body main #sidebarRoot #projectsPanel input[type=number]::-webkit-inner-spin-button,html body main #sidebarRoot #projectsPanel input[type=number]::-webkit-outer-spin-button{appearance:none!important;-webkit-appearance:none!important;margin:0!important}html body main #sidebarRoot #projectsPanel input[type=number]{-moz-appearance:textfield!important}';
  document.head.append(outlineTrimStyle);
  const archiveStyle=document.createElement('style');
  archiveStyle.textContent='html body main #sidebarRoot #projectsPanel .projectBlockTitle,html body main #sidebarRoot #projectsPanel .projectArchiveTitle{border-top:0!important;border-bottom:0!important}html body main #sidebarRoot #projectsPanel .projectArchiveTitle{display:flex!important;align-items:center!important;gap:10px!important;margin:14px 0 8px!important;padding:12px 0!important;color:#1b3153!important}html body main #sidebarRoot #projectsPanel .projectArchiveTitle .projectSectionIcon{width:38px!important;height:38px!important;flex:0 0 38px!important;background:#eef4ff!important;color:#477fc5!important}html body main #sidebarRoot #projectsPanel .projectArchiveTitle .projectSectionIcon .material-symbols-rounded{font-size:20px!important}html body main #sidebarRoot #projectsPanel .projectArchiveTitle .projectSectionHeading strong{font-size:16px!important;line-height:1.1!important}html body main #sidebarRoot #projectsPanel .projectArchiveTitle .projectSectionHeading small{font-size:10px!important;font-weight:400!important;color:#7186a2!important}html body main #sidebarRoot #projectsPanel #projectList{margin-top:0!important;border-top:0!important}';
  document.head.append(archiveStyle);
  const syncWorkspaceSheets=()=>{
    const current=read('cutMvp',{sheets:[],parts:[]});
    const visible=gridRows().filter(item=>item.name&&item.name!=='Выберите материал…');
    const source=visible.length?visible:(project()?.materials||[]).filter(item=>materialName(item)).map(item=>({name:materialName(item),length:item.length,width:item.width,qty:item.qty}));
    const next=source.map(item=>({material:item.name,length:Number(item.length)||2800,width:Number(item.width)||2070,qty:Math.max(1,Number(item.qty)||1)}));
    const same=JSON.stringify(current.sheets||[])===JSON.stringify(next);
    if(same)return;
    current.sheets=next;
    write('cutMvp',current);
    if(typeof load==='function')load({sheets:next,parts:Array.isArray(current.parts)?current.parts:[]});
  };
  renderFields();
  syncGrid();
  setTimeout(syncWorkspaceSheets,0);
})();
