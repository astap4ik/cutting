(function(){
  const state=window.materialDbState;
  if(!state?.db?.sheets)return;
  const size=/(?:^|\s)(\d{2,4})\s*[xх×*]\s*(\d{2,4})(?:\s*[xх×*]\s*\d+(?:[.,]\d+)?)?\s*мм?(?:\s|$)/i;
  let changed=false;
  state.db.sheets.forEach(item=>{
    const match=String(item.name||'').match(size);
    if(!match)return;
    if(!Number(item.length)){item.length=Number(match[1]);changed=true}
    if(!Number(item.width)){item.width=Number(match[2]);changed=true}
  });
  if(!changed)return;
  localStorage.setItem('cuttingMaterialDb',JSON.stringify(state.db));
  state.sa?.refreshCells?.({force:true});
  state.sa?.redrawRows?.();
  const form=document.querySelector('.materialsDb .materialCard:not(.edgeMaterialCard)');
  const name=form?.querySelector('h3')?.textContent?.trim();
  const item=state.db.sheets.find(x=>String(x.name||'Материал')===name);
  if(item)form.querySelectorAll('input[data-field]').forEach(input=>{
    if(input.dataset.field==='length'||input.dataset.field==='width')input.value=item[input.dataset.field]??'';
  });
})();
