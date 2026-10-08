(function(){
  const selectFirst=()=>{
    const state=window.materialDbState, api=state?.sa;
    const row=document.querySelector('#dbSheetsGrid .ag-row');
    if(!state)return;
    api?.ensureIndexVisible?.(0);
    const firstNode=api?.getDisplayedRowAtIndex?.(0);
    const data=firstNode?.data || state.db?.sheets?.[0];
    const form=document.querySelector('.materialsDb .materialCard:not(.edgeMaterialCard), .materialsDb .materialCard');
    if(!data||!form)return;
    api?.setFocusedCell?.(0,api.getAllDisplayedColumns?.()[0]?.getColId?.());
    firstNode?.setSelected?.(true);
    document.querySelectorAll('#dbSheetsGrid .ag-row').forEach(x=>{
      x.classList.toggle('ag-row-selected',x===row);
      x.setAttribute('aria-selected',x===row?'true':'false');
    });
    row?.querySelector('.ag-cell')?.dispatchEvent(new MouseEvent('click',{bubbles:true}));
    row?.click();
    form.hidden=false;
    form.querySelector('h3').textContent=data.name||'Материал';
    const image=form.querySelector('img');
    image.src=data.imageUrl||'';
    image.style.display=data.imageUrl?'block':'none';
    const fields=[['name','Наименование'],['shortName','Краткое наименование'],['supplier','Поставщик'],['article','Артикул'],['length','Длина, мм'],['width','Ширина, мм'],['thickness','Толщина, мм'],['materialUrl','Ссылка на материал'],['imageUrl','Изображение']];
    form.querySelector('.materialFields').innerHTML=fields.map(([key,label])=>`<label><span>${label}</span><input data-field="${key}" value="${String(data[key]??'').replace(/"/g,'&quot;')}"></label>`).join('');
  };
  document.addEventListener('click',event=>{
    if(!event.target.closest?.('#materialDbToggle,[data-db-category]'))return;
    setTimeout(selectFirst,80);
    setTimeout(selectFirst,300);
    setTimeout(selectFirst,700);
  });
  [80,300,700,1200].forEach(delay=>setTimeout(selectFirst,delay));
})();
