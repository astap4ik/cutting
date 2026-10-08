(function(){
  const ruGrid={contains:'Содержит',notContains:'Не содержит',equals:'Равно',notEqual:'Не равно',startsWith:'Начинается с',endsWith:'Заканчивается на',blank:'Пусто',notBlank:'Не пусто',and:'И',or:'ИЛИ',filterOoo:'Фильтр...',applyFilter:'Применить',resetFilter:'Сбросить',clearFilter:'Очистить',cancelFilter:'Отмена',selectAll:'Выбрать все',searchOoo:'Поиск...',noMatches:'Нет совпадений',blanks:'Пустые',loadingOoo:'Загрузка...',noRowsToShow:'Нет строк',columns:'Колонки',filters:'Фильтры',sortAscending:'Сортировать по возрастанию',sortDescending:'Сортировать по убыванию',sortUnSort:'Сбросить сортировку',pinColumn:'Закрепить колонку',pinLeft:'Слева',pinRight:'Справа',noPin:'Не закреплять',autosizeThiscolumn:'Автоширина колонки',autosizeAllColumns:'Автоширина всех колонок',copy:'Копировать',copyWithHeaders:'Копировать с заголовками',paste:'Вставить',export:'Экспорт'};
  if(!document.querySelector('link[href*="Material+Symbols"]')){let font=document.createElement('link');font.rel='stylesheet';font.href='https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,400,0,0';document.head.append(font)}
  const sides=['top','right','bottom','left'];
  const labels={top:'В',right:'П',bottom:'Н',left:'Л'};
  let popup=null,closeTimer=null,current=null,selectedSide=null;
  function parseEdge(value){if(value&&typeof value==='object')return value;try{return JSON.parse(value||'{}')}catch{return {}}}
  function enabled(edge,key){return !!edge?.[key]?.enabled}
  function customMaterial(edge,key){return enabled(edge,key)&&!!String(edge?.[key]?.material||'').trim()}
  function selectedDimensionEdges(params,dimension){const edge=parseEdge(params.data?.edgeBanding),keys=dimension==='length'?['top','bottom']:['left','right'];return keys.filter(key=>enabled(edge,key)).length}
  function addDimensionUnderlineRules(defs){defs.forEach(c=>{if(c.field!=='length'&&c.field!=='width')return;c.cellClassRules={...(c.cellClassRules||{}),edgeSizeUnderlineSingle:p=>selectedDimensionEdges(p,c.field)===1,edgeSizeUnderlineDouble:p=>selectedDimensionEdges(p,c.field)===2}});return defs}
  function summary(value){let edge=parseEdge(value),on=sides.filter(k=>enabled(edge,k));return on.length===4?'ВСЕ':on.map(k=>labels[k]).join(' ')||'—'}
  function persist(params,edge){
    params.data.edgeBanding=edge;
    let tr=[...document.querySelectorAll('#parts tbody tr')].find(x=>x.dataset.gridId===params.data._gridId);
    if(tr){tr._edgeBanding=edge;let input=tr.querySelector('[data-k="edgeBanding"]');if(!input){input=document.createElement('input');input.type='hidden';input.dataset.k='edgeBanding';tr.append(input)}input.value=JSON.stringify(edge)}
    if(typeof sync==='function')sync(false);
    params.api.refreshCells({rowNodes:[params.node],columns:['edgeBanding','length','width'],force:true});
  }
  function setSide(edge,key,on){edge[key]={...(edge[key]||{}),enabled:on};if(!on)delete edge[key].material}
  function defaultEdge(){const material=String(current?.data?.material||'');const item=window.getProjectSnapshot?.()?.materials?.find(x=>x&&typeof x==='object'&&x.name===material);return String(item?.edge||'')}
  function edgeNames(){return [...new Set((window.materialDbState?.db?.edges||[]).map(x=>String(x.name||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ru'))}
  function draw(){
    if(!popup||!current)return;
    let edge=parseEdge(current.data.edgeBanding);
    sides.forEach(k=>{const button=popup.querySelector(`[data-side="${k}"]`),material=edge[k]?.material||defaultEdge();button.classList.toggle('on',enabled(edge,k));button.classList.toggle('custom',customMaterial(edge,k));button.title=`${{top:'Верхняя',right:'Правая',bottom:'Нижняя',left:'Левая'}[k]} кромка: ${enabled(edge,k)?material||'материал не задан':'не установлена'}`});
    const editor=popup.querySelector('.edgeMaterialEditor'),activeSide=selectedSide&&enabled(edge,selectedSide);editor.hidden=!activeSide;editor.dataset.side=selectedSide||'';
    if(activeSide){const selected=edge[selectedSide]||{},select=editor.querySelector('select'),names=edgeNames(),material=selected.material||'';editor.dataset.side=selectedSide;select.dataset.side=selectedSide;if(material&&!names.includes(material))names.push(material);select.replaceChildren(new Option('По-умолчанию',''),...names.map(name=>new Option(name,name)));select.value=material;const display=editor.querySelector('.edgeMaterialValue'),label=material||'По-умолчанию';display.textContent=label;select.title=label;editor.querySelector('.edgeMaterialSide').textContent={top:'Верхняя',right:'Правая',bottom:'Нижняя',left:'Левая'}[selectedSide];const bounds=popup.getBoundingClientRect();popup.classList.toggle('edgeEditorLeft',innerWidth-bounds.right<240&&bounds.left>innerWidth-bounds.right)}
    let all=sides.every(k=>enabled(edge,k));
  }
  function editSide(key,change){const edge={...parseEdge(current.data.edgeBanding)},side={...(edge[key]||{})};change(side);edge[key]=side;persist(current,edge);draw()}
  function toggle(keys){
    let edge={...parseEdge(current.data.edgeBanding)},turnOn=keys.some(k=>!enabled(edge,k));
    keys.forEach(k=>setSide(edge,k,turnOn));
    persist(current,edge);draw();
  }
  function ensurePopup(){
    if(popup)return popup;
    popup=document.createElement('div');popup.className='edgeMini hidden';
    popup.innerHTML='<div class="edgeCanvas"><button class="edgeSide top" data-side="top" title="Верхняя кромка"></button><button class="edgeSide right" data-side="right" title="Правая кромка"></button><button class="edgeSide bottom" data-side="bottom" title="Нижняя кромка"></button><button class="edgeSide left" data-side="left" title="Левая кромка"></button><button class="edgeCorner tl" data-corner="top,left" title="Верх + лево"></button><button class="edgeCorner tr" data-corner="top,right" title="Верх + право"></button><button class="edgeCorner br" data-corner="bottom,right" title="Низ + право"></button><button class="edgeCorner bl" data-corner="bottom,left" title="Низ + лево"></button><button class="edgeAll">ВСЕ</button><span class="edgePartNo"></span><span class="edgeLength"></span><span class="edgeWidth"></span></div><div class="edgeMaterialEditor" hidden><strong><span class="edgeMaterialSide"></span> кромка</strong><div class="edgeMaterialPicker"><span class="edgeMaterialValue"></span><select aria-label="Материал выбранной кромки"></select></div></div>';
    document.body.append(popup);
    popup.addEventListener('mouseenter',()=>clearTimeout(closeTimer));
    popup.addEventListener('mouseleave',scheduleClose);
    popup.querySelectorAll('[data-side]').forEach(side=>{side.addEventListener('mouseenter',()=>{selectedSide=side.dataset.side;draw()});side.addEventListener('click',e=>{e.stopPropagation();selectedSide=side.dataset.side;toggle([selectedSide])})});
    popup.querySelectorAll('[data-corner]').forEach(c=>{let keys=c.dataset.corner.split(',');c.addEventListener('mouseenter',()=>keys.forEach(k=>popup.querySelector(`[data-side="${k}"]`).classList.add('cornerHover')));c.addEventListener('mouseleave',()=>keys.forEach(k=>popup.querySelector(`[data-side="${k}"]`).classList.remove('cornerHover')));c.addEventListener('click',e=>{e.stopPropagation();toggle(keys)})});
    popup.querySelector('.edgeAll').addEventListener('click',e=>{e.stopPropagation();toggle(sides)});
    const materialSelect=popup.querySelector('.edgeMaterialEditor select'),applyMaterial=e=>{const sideKey=e.target.dataset.side;if(sideKey)editSide(sideKey,side=>{if(e.target.value)side.material=e.target.value;else delete side.material})};
    materialSelect.addEventListener('input',applyMaterial);materialSelect.addEventListener('change',applyMaterial);
    document.addEventListener('mousedown',e=>{if(!popup.contains(e.target))popup.classList.add('hidden')});
    return popup;
  }
  function scheduleClose(){clearTimeout(closeTimer);closeTimer=setTimeout(()=>{if(!popup?.contains(document.activeElement))popup?.classList.add('hidden')},180)}
  function detailNumber(params,anchor){
    let data=params?.data||{},explicit=Number(data.partNo);
    if(Number.isInteger(explicit)&&explicit>0)return explicit;
    let idMatch=String(data.id||'').match(/^p(\d+)-/);
    if(idMatch)return Number(idMatch[1])+1;
    let rowIndex=Number(params?.rowIndex??params?.node?.rowIndex);
    if(Number.isInteger(rowIndex)&&rowIndex>=0)return rowIndex+1;
    let anchorNumber=Number(anchor?.dataset?.partNumber);
    return Number.isInteger(anchorNumber)&&anchorNumber>0?anchorNumber:'';
  }
  function show(params,anchor){
    clearTimeout(closeTimer);current=params;selectedSide=null;let pop=ensurePopup(),length=Math.max(1,+params.data.length||1),width=Math.max(1,+params.data.width||1),ratio=Math.max(.45,Math.min(2.2,length/width));
    let canvas=pop.querySelector('.edgeCanvas'),number=detailNumber(params,anchor);canvas.style.width=(ratio>=1?210:Math.round(150*ratio))+'px';canvas.style.height=(ratio>=1?Math.round(150/ratio):180)+'px';canvas.dataset.partNumber=number;pop.querySelector('.edgePartNo').textContent=number;pop.querySelector('.edgeLength').textContent=length;pop.querySelector('.edgeWidth').textContent=width;
    pop.classList.remove('hidden');let r=anchor.getBoundingClientRect(),pw=pop.offsetWidth,ph=pop.offsetHeight;
    let left=r.right+2;
    if(left+pw>innerWidth-8)left=r.left-pw-2;
    pop.style.left=Math.max(8,Math.min(innerWidth-pw-8,left))+'px';
    pop.style.top=Math.max(8,Math.min(innerHeight-ph-8,r.top-30))+'px';
    draw();
  }
  function renderer(params){
    let b=document.createElement('button');b.type='button';b.className='edgeCell';b.removeAttribute('title');b.dataset.partNumber=detailNumber(params);let e=parseEdge(params.value),hasEdge=sides.some(k=>enabled(e,k)),mini=document.createElement('span');mini.className=`edgeCellMini${hasEdge?'':' isEmpty'}`;params.eGridCell?.style.setProperty('background','transparent','important');params.eGridCell?.style.setProperty('background-color','transparent','important');b.style.setProperty('background','transparent','important');b.style.setProperty('background-color','transparent','important');mini.style.setProperty('display','block','important');mini.style.setProperty('width','42px','important');mini.style.setProperty('height','20px','important');mini.style.setProperty('min-width','42px','important');mini.style.setProperty('max-width','42px','important');mini.style.setProperty('min-height','20px','important');mini.style.setProperty('max-height','20px','important');['top','right','bottom','left'].forEach(k=>{let side=document.createElement('i');side.className=`edgeCellSide ${k}${enabled(e,k)?' on':''}${customMaterial(e,k)?' custom':''}`;mini.append(side)});b.append(mini);
    b.addEventListener('mouseenter',()=>show(params,b));b.addEventListener('mouseleave',scheduleClose);return b;
  }
  function columnDef(){return {headerName:'Кромки',field:'edgeBanding',cellDataType:false,editable:false,width:78,minWidth:78,sortable:false,filter:false,cellRenderer:renderer}}
  function quantityRenderer(params){
    let value=document.createElement('span');value.className='quantityValue';value.textContent=Math.max(1,Math.trunc(Number(params.value)||1));value.title='Количество';return value;
  }
  const compactColumns={length:80,width:80,qty:94,edgeBanding:78,rotate:76,rotateGroup:110};
  const rotateGroupHint='Одинаковое значение объединяет детали в группу совместного поворота.';
  function compactDefs(defs){defs.forEach(c=>{let w=compactColumns[c.field];if(w){c.width=w;c.minWidth=w;delete c.flex}if(c.field==='rotateGroup')c.headerTooltip=rotateGroupHint});return defs}
  let headerHintPopup;
  let headerContextMenu;
  function closeHeaderContextMenu(){headerContextMenu?.remove();headerContextMenu=null}
  function openHeaderContextMenu(api,column,x,y){
    closeHeaderContextMenu();
    headerContextMenu=document.createElement('div');headerContextMenu.className='headerContextMenu';
    const filter=document.createElement('button');
    const enabled=document.body.classList.contains('filtersEnabled');
    filter.textContent=enabled?'Отключить фильтры':'Включить фильтры';
    filter.onclick=()=>{const enabled=document.body.classList.toggle('filtersEnabled');api.setGridOption?.('defaultColDef',{filter:enabled});api.refreshHeader?.();closeHeaderContextMenu()};
    headerContextMenu.append(filter);document.body.append(headerContextMenu);
    headerContextMenu.style.left=Math.min(x,innerWidth-headerContextMenu.offsetWidth-8)+'px';
    headerContextMenu.style.top=Math.min(y,innerHeight-headerContextMenu.offsetHeight-8)+'px';
  }
  function hideHeaderHint(){headerHintPopup?.remove();headerHintPopup=null}
  function showHeaderHint(header){
    hideHeaderHint();
    headerHintPopup=document.createElement('div');
    headerHintPopup.className='headerHintPopup';
    let title=document.createElement('strong');title.textContent='Группа поворота';
    let text=document.createElement('span');text.textContent='Одинаковое значение объединяет детали. При повороте одной детали поворачивается вся группа.';
    headerHintPopup.append(title,text);document.body.append(headerHintPopup);
    let r=header.getBoundingClientRect(),w=headerHintPopup.offsetWidth;
    headerHintPopup.style.left=Math.max(8,Math.min(innerWidth-w-8,r.left))+'px';
    headerHintPopup.style.top=(r.bottom+6)+'px';
  }
  function applyHeaderTooltip(){
    document.querySelectorAll('#partsGrid .ag-header-cell[col-id="rotateGroup"]').forEach(header=>{
      header.removeAttribute('title');header.setAttribute('aria-label',rotateGroupHint);
      let label=header.querySelector('.ag-header-cell-label');
      if(label)label.removeAttribute('title');
      if(!header.__groupHint){header.__groupHint=true;header.addEventListener('mouseenter',()=>showHeaderHint(header));header.addEventListener('mouseleave',hideHeaderHint)}
    });
  }
  function rotationRenderer(params){
    let wrap=document.createElement('span');
    wrap.className='rotationCell';
    wrap.addEventListener('dblclick',e=>{e.preventDefault();e.stopPropagation();toggleRotation(params)});
    if(params.value===true||params.value==='Да'){
      let img=document.createElement('img');
      img.src='assets/rotation-icon.png';
      img.alt='Да';
      img.title='Поворот разрешён';
      wrap.append(img);
    }
    return wrap;
  }
  function toggleRotation(params){
    if(params?.colDef?.field!=='rotate'||!params.data)return;
    params.node.setDataValue('rotate',!(params.data.rotate===true||params.data.rotate==='Да'));
  }
  function markStale(){document.getElementById('layouts')?.classList.add('staleData')}
  let staleToastTimer,staleToastShown=false;
  function showStaleToast(){let toast=document.getElementById('staleDataToast');if(!toast){toast=document.createElement('div');toast.id='staleDataToast';toast.textContent='Неактуальная карта раскроя. Данные или настройки изменены — выполните расчёт повторно.';document.body.append(toast)}clearTimeout(staleToastTimer);toast.classList.remove('show');let grid=document.getElementById('partsGrid'),r=grid?.getBoundingClientRect();if(r){toast.style.right='auto';toast.style.left=Math.max(8,r.left+r.width/2-toast.offsetWidth/2)+'px';toast.style.top=Math.max(8,r.top+r.height/2-toast.offsetHeight/2)+'px'}void toast.offsetWidth;toast.classList.add('show');staleToastTimer=setTimeout(()=>toast.classList.remove('show'),3000)}
  function offerRecalc(){try{if(typeof layouts==='undefined'||!layouts.length)return;markStale();if(!staleToastShown){staleToastShown=true;showStaleToast()}}catch{}}
  window.offerRecalcPrompt=offerRecalc;
  document.getElementById('calcBtn')?.addEventListener('click',()=>{staleToastShown=false;document.getElementById('layouts')?.classList.remove('staleData')});
  function numericNavigation(e){
    const field=e.colDef?.field;
    if(!['length','width','qty'].includes(field))return;
    const key=e.event?.key;
    if(!['Enter','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(key))return;
    const api=e.api,row=e.rowIndex??e.node?.rowIndex;
    if(row==null)return;
    const cols=(api.getAllDisplayedColumns?.()||[]).filter(c=>c.isVisible?.()!==false);
    const index=cols.findIndex(c=>c.getColId()===e.column?.getColId());
    if(index<0)return;
    let nextRow=row,nextIndex=index;
    if(key==='Enter'||key==='ArrowRight')nextIndex++;
    if(key==='ArrowLeft')nextIndex--;
    if(key==='ArrowDown')nextRow++;
    if(key==='ArrowUp')nextRow--;
    if(nextIndex<0||nextIndex>=cols.length||nextRow<0||nextRow>=api.getDisplayedRowCount())return;
    e.event.preventDefault();e.event.stopPropagation();api.stopEditing();
    api.setFocusedCell(nextRow,cols[nextIndex].getColId());
  }
  function installInto(api){
    if(!api?.getColumnDefs)return false;
    api.setGridOption('localeText',ruGrid);
    let defs=addDimensionUnderlineRules(compactDefs((api.getColumnDefs()||[]).filter(c=>(c.field||c.headerName)&&c.field!=='placed')));
    defs.forEach(c=>{if(c.field==='rotate'){c.cellRenderer=rotationRenderer;c.editable=false;c.cellEditor=undefined}if(c.field==='qty')c.cellRenderer=quantityRenderer});
    api.setGridOption('rowDragEntireRow',true);
    let numberCol=defs.find(c=>c.headerName==='№');if(numberCol){numberCol.width=62;numberCol.minWidth=62}
    api.setGridOption('columnDefs',defs);
    if(!api.__recalcPromptHook){api.__recalcPromptHook=true;api.addEventListener?.('cellValueChanged',e=>{if(String(e.oldValue??'')!==String(e.newValue??''))setTimeout(offerRecalc,0)})}
    if(defs.some(c=>c.field==='edgeBanding')){if(!api.__singleClickEditHook){api.__singleClickEditHook=true;api.addEventListener?.('cellClicked',e=>{if(e.colDef?.editable!==false&&e.colDef?.field!=='edgeBanding')api.startEditingCell({rowIndex:e.rowIndex,colKey:e.column.getColId()})})}return true;}
    let at=defs.findIndex(c=>c.field==='rotate');
    defs.splice(at<0?defs.length:at,0,columnDef());
    api.setGridOption('columnDefs',defs);
    return true;
  }
  if(!window.agGrid?.createGrid)return;
  const createGrid=window.agGrid.createGrid.bind(window.agGrid);
  window.agGrid.createGrid=function(host,options){
    options.localeText={...ruGrid,...(options.localeText||{})};
    options.tooltipShowDelay=300;
    options.suppressHeaderMenuButton=true;
    options.columnDefs?.forEach(c=>{if(c.field==='rotate'){c.cellRenderer=rotationRenderer;c.editable=false;delete c.cellEditor;delete c.cellEditorParams}if(c.field==='qty')c.cellRenderer=quantityRenderer});
    if(host?.id==='partsGrid')addDimensionUnderlineRules(options.columnDefs||[]);
    let oldDoubleClick=options.onCellDoubleClicked,oldKeyDown=options.onCellKeyDown;
    let oldValueChanged=options.onCellValueChanged;
    options.onCellValueChanged=e=>{oldValueChanged?.(e)};
    options.onCellDoubleClicked=e=>{oldDoubleClick?.(e);toggleRotation(e)};
    options.onCellKeyDown=e=>{oldKeyDown?.(e);if(e.event?.key==='Enter')toggleRotation(e);numericNavigation(e)};
    let oldEditingStarted=options.onCellEditingStarted;
    options.onCellEditingStarted=e=>{
      oldEditingStarted?.(e);
      if(!['length','width','qty'].includes(e.colDef?.field))return;
      const input=e.eGridCell?.querySelector('input');
      if(!input||input.__numericNavigation)return;
      input.__numericNavigation=true;
      input.addEventListener('keydown',ev=>{
        if(!['Enter','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(ev.key))return;
        numericNavigation({...e,event:ev});
      });
    };
    if(host?.id==='partsGrid'&&!options.columnDefs.some(c=>c.field==='edgeBanding')){
      options.columnDefs=compactDefs(options.columnDefs.filter(c=>c.field||c.headerName));

      let numberCol=options.columnDefs.find(c=>c.headerName==='№');if(numberCol){numberCol.width=62;numberCol.minWidth=62}
      options.rowDragEntireRow=true;options.columnDefs.forEach(c=>delete c.rowDrag);
      options.singleClickEdit=true;
      let at=options.columnDefs.findIndex(c=>c.field==='rotate');
      options.columnDefs.splice(at<0?options.columnDefs.length:at,0,columnDef());
    }
    if(host?.id==='partsGrid'){options.singleClickEdit=true;options.columnDefs=compactDefs(options.columnDefs.filter(c=>c.field||c.headerName));let numberCol=options.columnDefs.find(c=>c.headerName==='№');if(numberCol){numberCol.width=62;numberCol.minWidth=62}options.rowDragEntireRow=true;options.columnDefs.forEach(c=>delete c.rowDrag)}
    return createGrid(host,options);
  };
  let attempts=0;
  function installAfterStart(){
    attempts++;
    try{if(typeof partsGridApi!=='undefined'&&installInto(partsGridApi))return}catch{}
    if(attempts<40)setTimeout(installAfterStart,50);
  }
  setTimeout(installAfterStart,0);
  document.addEventListener('contextmenu',e=>{
    const header=e.target.closest?.('#partsGrid .ag-header-cell');
    if(!header)return;
    let api;
    try{api=typeof partsGridApi!=='undefined'?partsGridApi:null}catch{return}
    const colId=header.getAttribute('col-id'),column=api?.getColumn?.(colId);
    if(!column)return;
    e.preventDefault();e.stopPropagation();
    openHeaderContextMenu(api,column,e.clientX,e.clientY);
  },true);
  document.addEventListener('contextmenu',e=>{
    const header=e.target.closest?.('.materialDbGrid .ag-header-cell');
    if(!header)return;
    const api=header.closest('#dbEdges')?window.materialDbState?.ea:window.materialDbState?.sa;
    const column=api?.getColumn?.(header.getAttribute('col-id'));
    if(!api||!column)return;
    e.preventDefault();e.stopPropagation();openHeaderContextMenu(api,column,e.clientX,e.clientY);
  },true);
  document.addEventListener('mousedown',e=>{if(!e.target.closest?.('.headerContextMenu'))closeHeaderContextMenu()});
  new MutationObserver(applyHeaderTooltip).observe(document.getElementById('partsGrid'),{childList:true,subtree:true});
  setTimeout(applyHeaderTooltip,100);
  document.addEventListener('keydown',e=>{
    if(!e.target.closest?.('#partsGrid .ag-cell-inline-editing'))return;
    if(!['Enter','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;
    let api;
    try{api=typeof partsGridApi!=='undefined'?partsGridApi:null}catch{return}
    const focused=api?.getFocusedCell?.();
    const field=focused?.column?.getColId?.();
    if(!['length','width','qty'].includes(field))return;
    e.preventDefault();e.stopImmediatePropagation();
    const row=focused.rowIndex,cols=api.getAllDisplayedColumns?.()||[];
    const index=cols.findIndex(c=>c.getColId()===field);
    let nextRow=row,nextIndex=index;
    if(e.key==='Enter'||e.key==='ArrowRight')nextIndex++;
    if(e.key==='ArrowLeft')nextIndex--;
    if(e.key==='ArrowDown')nextRow++;
    if(e.key==='ArrowUp')nextRow--;
    api.stopEditing();
    if(nextIndex<0||nextIndex>=cols.length||nextRow<0||nextRow>=api.getDisplayedRowCount())return;
    const nextColumn=cols[nextIndex].getColId();
    api.ensureIndexVisible?.(nextRow);
    api.ensureColumnVisible?.(nextColumn);
    api.setFocusedCell(nextRow,nextColumn);
  },true);
  document.addEventListener('dblclick',e=>{if(!popup||popup.classList.contains('hidden'))return;if(e.target.closest('.edgeCanvas')&&!e.target.closest('[data-side],[data-corner]')){e.stopPropagation();toggle(sides)}});
  document.addEventListener('mouseover',e=>{const side=e.target.closest?.('.edgeSide'),host=side?.closest('.edgeMini');if(!side||!host)return;['top','right','bottom','left'].forEach(key=>host.classList.toggle(`edgeEditorSide-${key}`,key===side.dataset.side))});
  document.addEventListener('mouseleave',e=>{const host=e.target.closest?.('.edgeMini');if(!host||e.relatedTarget?.closest?.('.edgeMini'))return;['top','right','bottom','left'].forEach(key=>host.classList.remove(`edgeEditorSide-${key}`))},true);
  let cloudStyle=document.createElement('style');cloudStyle.textContent='.edgeCanvas{background:#9fd4f3!important;background-color:#9fd4f3!important;background-image:none!important;border:1px solid #1687f5!important;box-shadow:0 0 22px 13px rgba(255,255,255,.9)!important;color:#1f2a37!important}.edgeCanvas::before{background:transparent!important}';document.head.append(cloudStyle);
})();
