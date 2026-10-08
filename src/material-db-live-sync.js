(function(){
  const save=()=>localStorage.setItem('cuttingMaterialDb',JSON.stringify(window.materialDbState?.db||{sheets:[],edges:[]}));
  document.addEventListener('input',event=>{
    const input=event.target.closest?.('.materialsDb .materialCard input[data-field]');
    if(!input)return;
    const form=input.closest('.materialCard');
    const isEdge=form.classList.contains('edgeMaterialCard');
    const list=isEdge?window.materialDbState?.db?.edges:window.materialDbState?.db?.sheets;
    const title=form.querySelector('h3')?.textContent?.trim();
    const item=list?.find(x=>String(x.name||'Материал')===title||String(x.name||'Кромка')===title);
    if(!item)return;
    item[input.dataset.field]=input.value;
    if(input.dataset.field==='name')form.querySelector('h3').textContent=input.value|| (isEdge?'Кромка':'Материал');
    save();
    const api=isEdge?window.materialDbState?.ea:window.materialDbState?.sa;
    api?.refreshCells?.({force:true});
    api?.redrawRows?.();
  });
})();
