(function(){
  const normalize=value=>String(value||'').toLocaleLowerCase('ru').replace(/[\s_-]+/g,'');
  const matches=(item,category)=>{
    const wanted=normalize(category),subgroup=normalize(item.subgroup),group=normalize(item.group);
    if(wanted==='дсп')return !subgroup||subgroup==='дсп'||subgroup==='лдсп'||(subgroup!=='хдф'&&subgroup!=='фасадныйматериал'&&group==='плитныематериалы');
    if(wanted==='хдф')return subgroup==='хдф'||group==='хдф';
    if(wanted==='фасадныйматериал')return subgroup==='фасадныйматериал'||group==='фасадныйматериал';
    return subgroup===wanted||group===wanted;
  };
  document.addEventListener('click',event=>{
    const button=event.target.closest?.('[data-db-category]');
    if(!button||button.dataset.dbCategory==='Кромка')return;
    const apply=()=>{
      const state=window.materialDbState,grid=state?.sa,items=state?.db?.sheets||[];
      if(!grid)return;
      const category=button.dataset.dbCategory;
      const filtered=items.filter(item=>matches(item,category));
      const rows=category==='ДСП'&&filtered.length===0?items:filtered;
      grid.setGridOption('rowData',rows);
      if(rows.length){
        grid.ensureIndexVisible?.(0);
        grid.setFocusedCell?.(0,grid.getAllDisplayedColumns?.()[0]?.getColId?.());
        setTimeout(()=>document.querySelector('#dbSheetsGrid .ag-row')?.click(),0);
      }
    };
    setTimeout(apply,0);
    setTimeout(apply,80);
    setTimeout(apply,300);
  },true);
})();
