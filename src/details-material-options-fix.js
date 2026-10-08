(function(){
  const names=()=>{
    const projectRecords=window.getProjectMaterials?.()||[];
    const project=window.getProjectSnapshot?.()?.materials||[];
    return [...new Set([
      ...projectRecords.map(item=>item?.name),
      ...project.map(item=>typeof item==='string'?item:item?.name),
    ].filter(Boolean))];
  };
  const sync=()=>{
    const select=document.querySelector('#detailsMaterialField select[data-table-material]');
    if(!select)return;
    const value=select.value;
    const allowed=new Set(names());
    [...select.options].forEach(option=>{
      if(option.value&&!allowed.has(option.value))option.remove();
    });
    allowed.forEach(name=>{
      if([...select.options].some(option=>option.value===name))return;
      select.append(new Option(name,name));
    });
    select.value=allowed.has(value)?value:'';
  };
  const field=document.querySelector('#detailsMaterialField');
  new MutationObserver(sync).observe(field||document.body,{childList:true,subtree:true});
  window.addEventListener('projectMaterialsChanged',sync);
  [0,100,400,1000].forEach(delay=>setTimeout(sync,delay));
})();
