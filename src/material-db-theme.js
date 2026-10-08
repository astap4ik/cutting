(function(){
  const style=document.createElement('style');
  style.textContent=`
    html body .materialsDb{
      position:fixed!important;z-index:3100!important;top:76px!important;left:50%!important;
      transform:translateX(-50%)!important;width:min(1180px,calc(100vw - 32px))!important;
      max-height:calc(100vh - 96px)!important;overflow:auto!important;padding:22px 24px!important;
      box-sizing:border-box!important;background:#fff!important;border:1px solid #dfe8f2!important;
      border-radius:14px!important;box-shadow:0 18px 48px rgba(34,72,116,.18)!important;color:#203a5e!important;
    }
    html body .materialsDb h3{display:flex!important;align-items:center!important;justify-content:space-between!important;
      margin:0 0 18px!important;padding:0 0 14px!important;border-bottom:1px solid #e5ecf4!important;
      color:#162d50!important;font-size:18px!important;font-weight:700!important}
    html body .materialsDb h3 button{width:30px!important;height:30px!important;margin:0!important;padding:0!important;
      border:1px solid #d7e1ec!important;border-radius:7px!important;background:#fff!important;color:#203a5e!important}
    html body .materialsDb .dbCategories{display:grid!important;grid-template-columns:repeat(4,minmax(120px,1fr))!important;
      gap:10px!important;margin:0 0 22px!important}
    html body .materialsDb .dbCategory{min-height:82px!important;padding:12px!important;border:1px solid #d7e1ec!important;
      border-radius:10px!important;background:#f8fbff!important;color:#58708e!important;font-size:12px!important;
      font-weight:600!important;transition:background .15s,border-color .15s,color .15s}
    html body .materialsDb .dbCategory .material-symbols-rounded{font-size:26px!important;color:#7890aa!important}
    html body .materialsDb .dbCategory.active,html body .materialsDb .dbCategory:hover{border-color:#9bcaf7!important;
      background:#edf7ff!important;color:#0879df!important}
    html body .materialsDb .dbCategory.active .material-symbols-rounded{color:#0879df!important}
    html body .materialsDb .dbSection{margin-top:18px!important;background:transparent!important;border:0!important;color:#203a5e!important}
    html body .materialsDb .dbSection h4{display:flex!important;align-items:center!important;justify-content:space-between!important;
      margin:0 0 10px!important;color:#203a5e!important;font-size:14px!important;font-weight:700!important}
    html body .materialsDb .dbSection h4 button{min-height:32px!important;padding:0 12px!important;border:0!important;border-radius:7px!important;
      background:#197ff0!important;color:#fff!important;font-size:11px!important;font-weight:600!important}
    html body .materialsDb .materialCard{display:grid!important;grid-template-columns:minmax(220px,34%) 1fr!important;gap:24px!important;
      margin:0 0 16px!important;padding:18px!important;border:1px solid #dfe8f2!important;border-radius:12px!important;
      background:#fff!important;color:#203a5e!important;box-shadow:0 5px 16px rgba(39,76,119,.06)!important}
    html body .materialsDb .materialCardImage{min-height:180px!important;border-radius:8px!important;background:#f4f7fb!important}
    html body .materialsDb .materialCardBody h3{display:block!important;margin:0 0 14px!important;padding:0!important;border:0!important;font-size:18px!important}
    html body .materialsDb .materialFields{gap:10px 18px!important}
    html body .materialsDb .materialFields label{gap:5px!important;color:#7186a2!important;font-size:11px!important}
    html body .materialsDb .materialFields input,html body .materialsDb input{height:36px!important;box-sizing:border-box!important;
      padding:0 10px!important;border:1px solid #d7e1ec!important;border-radius:6px!important;background:#fff!important;
      color:#203a5e!important;font-size:11px!important}
    html body .materialsDb .materialDbGrid{height:420px!important;min-height:260px!important;border:1px solid #dfe8f2!important;
      border-radius:8px!important;overflow:hidden!important;background:#fff!important;
      --ag-header-height:36px!important;--ag-row-height:38px!important;--ag-font-size:11px!important;
      --ag-header-background-color:#f8fbff!important;--ag-header-foreground-color:#58708e!important;
      --ag-background-color:#fff!important;--ag-foreground-color:#203a5e!important;--ag-border-color:#dfe8f2!important;
      --ag-row-border-color:#edf1f6!important;--ag-row-hover-color:#f2f7ff!important;--ag-selected-row-background-color:#edf7ff!important}
    html body .materialsDb .materialDbGrid .ag-header-cell-text{font-size:10px!important;font-weight:700!important}
    html body .materialsDb .materialDbGrid .ag-cell{border-right:1px solid #edf1f6!important}
    html body .materialsDb .materialDbGrid .ag-body-horizontal-scroll{display:none!important;height:0!important;min-height:0!important}
    html body .materialsDb .materialDbGrid .ag-center-cols-viewport,html body .materialsDb .materialDbGrid .ag-body-viewport{overflow-x:hidden!important}
    html body .materialsDb .materialDbGrid .ag-cell-inline-editing input{height:30px!important;border:1px solid #9bcaf7!important;
      border-radius:5px!important;background:#fff!important;color:#203a5e!important}
    html body .materialsDb a{color:#0879df!important}
    @media(max-width:760px){html body .materialsDb{width:calc(100vw - 20px)!important;padding:16px!important}.materialsDb .dbCategories{grid-template-columns:repeat(2,minmax(0,1fr))!important}.materialsDb .materialCard{grid-template-columns:1fr!important}}
  `;
  document.head.append(style);
})();
