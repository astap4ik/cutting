/* Keeps the detail grid columns in sync with the drawer width mode. */
(function(){
  const compact=['length','width','qty','edgeBanding'];
  const sync=()=>{
    let api=null;
    try{api=partsGridApi}catch{}
    if(!api?.getAllGridColumns)return false;
    const columns=api.getAllGridColumns();
    if(!columns.length)return false;
    const expanded=document.body.classList.contains('partsModalOpen')||document.body.classList.contains('workspaceDrawerWide');
    columns.forEach(column=>{
      if(column.getColId?.()==='ag-Grid-SelectionColumn'){
        api.setColumnsVisible?.([column.getColId()],false);
        return;
      }
      const def=column.getColDef?.()||{};
      if(def.field==='material'){
        api.setColumnsVisible?.([column.getColId()],false);
        return;
      }
      const isEdgeColumn=String(def.headerName||'').trim().toLowerCase()==='кромки'||def.field==='edgeBanding';
      const keep=def.headerName==='№'||isEdgeColumn||compact.includes(def.field);
      api.setColumnsVisible?.([column.getColId()],expanded||keep);
    });
    return true;
  };
  new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
  let attempts=0;
  const syncWhenReady=()=>{if(sync()||attempts++>=30)return;setTimeout(syncWhenReady,100)};
  syncWhenReady();
})();
