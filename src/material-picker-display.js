(function(){
  const db=()=>window.materialDbState?.db||{sheets:[]};
  const records=()=>db().sheets||[];
  const labelFor=value=>{
    const name=String(value??'');
    const record=records().find(item=>String(item.name||'')===name);
    return String(record?.shortName||record?.name||name);
  };
  const refresh=()=>{
    document.querySelectorAll('select option[value]').forEach(option=>{
      const value=option.value;
      if(!value||!records().some(item=>String(item.name||'')===value))return;
      const label=labelFor(value);
      if(option.textContent!==label)option.textContent=label;
    });
    document.querySelectorAll('[data-material-value]').forEach(option=>{
      const label=labelFor(option.dataset.materialValue);
      if(option.textContent!==label)option.textContent=label;
    });
    document.querySelectorAll('.projectMaterialInfo strong,.detailsMaterialInfo strong').forEach(node=>{
      const card=node.closest('.projectMaterialCard,.detailsMaterialCard');
      const value=card?.closest('[data-group-index]')?.querySelector('[data-remove-material]')?.dataset.removeMaterial||card?.closest('.detailsMaterialPicker')?.querySelector('select')?.value||node.textContent.trim();
      if(value&&value!=='Выберите материал…'){const label=labelFor(value);if(node.textContent!==label)node.textContent=label}
    });
  };
  refresh();
  new MutationObserver(refresh).observe(document.body,{childList:true,subtree:true});
  window.addEventListener('projectMaterialsChanged',refresh);
})();
