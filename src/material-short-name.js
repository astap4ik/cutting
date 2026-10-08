(function(){
  const state=window.materialDbState;
  if(!state?.db)return;
  const derive=name=>{
    let value=String(name||'').replace(/\s+/g,' ').trim();
    value=value.replace(/\s+\d{2,4}\s*[xх×]\s*\d{2,4}\s*[xх×]\s*\d+(?:[.,]\d+)?\s*мм?.*$/i,'');
    value=value.replace(/\s+[A-Za-zА-Яа-я][A-Za-zА-Яа-я.\-]*\d{2,}\s*$/,'');
    return value.trim()||String(name||'').trim();
  };
  const save=()=>localStorage.setItem('cuttingMaterialDb',JSON.stringify(state.db));
  state.db.sheets.forEach(item=>{if(!item.shortName)item.shortName=derive(item.name)});
  save();
  const refresh=()=>state.sa?.refreshCells?.({force:true});
  const findItem=form=>state.db.sheets.find(item=>String(item.name||'Материал')===form.querySelector('h3')?.textContent?.trim());
  const addFormField=()=>{
    const form=document.querySelector('.materialsDb .materialCard:not(.edgeMaterialCard)');
    const fields=form?.querySelector('.materialFields');
    if(!form||!fields||fields.querySelector('[data-field="shortName"]'))return;
    const label=document.createElement('label');
    label.innerHTML='<span>Краткое наименование</span><input data-field="shortName" type="text">';
    fields.insertBefore(label,fields.children[1]||null);
    const item=findItem(form);
    if(item)label.querySelector('input').value=item.shortName||derive(item.name);
  };
  new MutationObserver(addFormField).observe(document.body,{childList:true,subtree:true});
  addFormField();
  document.addEventListener('input',event=>{
    const input=event.target.closest?.('.materialsDb .materialCard:not(.edgeMaterialCard) input[data-field="shortName"]');
    if(!input)return;
    const form=input.closest('.materialCard'),item=findItem(form);
    if(!item)return;
    item.shortName=input.value;save();refresh();
  });
  if(state.sa?.setGridOption){
    state.sa.setGridOption('columnDefs',[
      {headerName:'Наименование',field:'name',minWidth:135,flex:2.2},
      {headerName:'Краткое наименование',field:'shortName',minWidth:125,flex:1.6},
      {headerName:'Поставщик',field:'supplier',minWidth:75,flex:.9},
      {headerName:'Артикул',field:'article',minWidth:70,flex:.8},
      {headerName:'Длина, мм',field:'length',minWidth:70,flex:.75},
      {headerName:'Ширина, мм',field:'width',minWidth:70,flex:.75},
      {headerName:'Толщина, мм',field:'thickness',minWidth:70,flex:.75},
      {headerName:'Ссылка на материал',field:'materialUrl',minWidth:95,flex:1,cellRenderer:p=>p.value?'<a href="'+p.value+'" target="_blank" rel="noopener">Открыть</a>':'—'},
      {headerName:'Изображение',field:'imageUrl',minWidth:75,flex:.8,cellRenderer:p=>p.value?'<a href="'+p.value+'" target="_blank" rel="noopener" class="materialImageLink" data-image="'+p.value+'">Изображение</a>':'—',editable:false}
    ]);
    state.sa.applyColumnState?.({
      state:['name','shortName','supplier','article','length','width','thickness','materialUrl','imageUrl'].map(colId=>({colId})),
      applyOrder:true
    });
    state.sa.setGridOption?.('suppressHorizontalScroll',true);
    setTimeout(()=>{
      state.sa.sizeColumnsToFit?.();
      document.querySelectorAll('#dbSheetsGrid .ag-center-cols-viewport,#dbSheetsGrid .ag-body-viewport').forEach(node=>{node.scrollLeft=0});
    },0);
  }
})();
