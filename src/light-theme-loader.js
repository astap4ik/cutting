(function(){
  const head=document.head;
  if(!head)return;
  let link=document.getElementById('finalLightTheme');
  if(!link){link=document.createElement('link');link.id='finalLightTheme';link.rel='stylesheet';link.href='src/theme.css?v=144';head.append(link)}
  let style=document.getElementById('finalLightThemeInline');
  if(!style){
    style=document.createElement('style');
    style.id='finalLightThemeInline';
    style.textContent=`
      html body,html body main{background:#f4f7fb!important;color:#142b4d!important;background-image:none!important}
      html,html body,html body *{scrollbar-color:#b9d8ef #f7fafc!important;scrollbar-width:thin!important}
      html::-webkit-scrollbar,html body *::-webkit-scrollbar{width:10px;height:10px}
      html::-webkit-scrollbar-track,html body *::-webkit-scrollbar-track{background:#f7fafc!important}
      html::-webkit-scrollbar-thumb,html body *::-webkit-scrollbar-thumb{background:#b9d8ef!important;border:2px solid #f7fafc!important;border-radius:6px!important}
      html::-webkit-scrollbar-thumb:hover,html body *::-webkit-scrollbar-thumb:hover{background:#8fc2e5!important}
      html::-webkit-scrollbar-corner,html body *::-webkit-scrollbar-corner{background:#f7fafc!important}
      html body,html body main,html body main>.result,html body main #sidebarRoot,html body main>.result .resultWorkspace{scrollbar-color:#b9d8ef #f7fafc!important;scrollbar-width:thin!important}
      html body::-webkit-scrollbar,html body main::-webkit-scrollbar,html body main>.result::-webkit-scrollbar,html body main #sidebarRoot::-webkit-scrollbar,html body main>.result .resultWorkspace::-webkit-scrollbar{width:10px;height:10px}
      html body::-webkit-scrollbar-track,html body main::-webkit-scrollbar-track,html body main>.result::-webkit-scrollbar-track,html body main #sidebarRoot::-webkit-scrollbar-track,html body main>.result .resultWorkspace::-webkit-scrollbar-track{background:#f7fafc!important}
      html body::-webkit-scrollbar-thumb,html body main::-webkit-scrollbar-thumb,html body main>.result::-webkit-scrollbar-thumb,html body main #sidebarRoot::-webkit-scrollbar-thumb,html body main>.result .resultWorkspace::-webkit-scrollbar-thumb{background:#b9d8ef!important;border:2px solid #f7fafc!important;border-radius:6px!important}
      html body::-webkit-scrollbar-thumb:hover,html body main::-webkit-scrollbar-thumb:hover,html body main>.result::-webkit-scrollbar-thumb:hover,html body main #sidebarRoot::-webkit-scrollbar-thumb:hover,html body main>.result .resultWorkspace::-webkit-scrollbar-thumb:hover{background:#8fc2e5!important}
      html body::-webkit-scrollbar-corner,html body main::-webkit-scrollbar-corner,html body main>.result::-webkit-scrollbar-corner,html body main #sidebarRoot::-webkit-scrollbar-corner,html body main>.result .resultWorkspace::-webkit-scrollbar-corner{background:#f7fafc!important}
      html body header,html body main>#projectTopbar{background:#fff!important;color:#142b4d!important;border-color:#e6edf5!important;box-shadow:0 2px 10px rgba(30,67,108,.06)!important}
      html body #projectTopbar .projectTopbarMeta strong,html body #projectTopbar .projectTopbarActions button{color:#142b4d!important}
      html body #projectTopbar .projectTopbarMeta span{color:#71829a!important}
      html body #projectTopbar .projectTopbarActions button{background:#fff!important;border-color:#dce6f0!important}
      html body #projectTopbar .projectTopbarActions .primary{background:#ff8a26!important;border-color:#ff8a26!important;color:#fff!important}
      html body main .appRail,html body main #sidebarRoot{background:#fff!important;border-color:#e6edf5!important}
      html body main>.result{background:#f4f7fb!important;color:#142b4d!important}
      html body main #sidebarRoot>#projectsPanel,html body main #sidebarRoot>#partsPanel,html body main #sidebarRoot>#settingsPanel,html body main #sidebarRoot>.projectPanelHeader,html body main #sidebarRoot .projectMaterialCard,html body main #sidebarRoot .detailsMaterialCard,html body main>.result .resultWorkspace .layout,html body main>.result .resultWorkspace .draftLayout,html body main>.result .resultWorkspace #unplaced{border-color:transparent!important}
      html body main>.result .resultWorkspace .layout,html body main>.result .resultWorkspace .draftLayout{box-shadow:0 5px 18px rgba(32,70,112,.07)!important}
      html body main>.result .resultWorkspace #layouts>.layout,html body main>.result .resultWorkspace #layouts>.draftLayout{box-shadow:0 5px 18px rgba(32,70,112,.07)!important}
      html body main>.result .resultWorkspace .sheet{position:relative!important;border-color:#c49a67!important;box-shadow:0 2px 4px rgba(77,54,31,.14),0 10px 24px rgba(77,54,31,.20),inset 0 1px 0 rgba(255,255,255,.62)!important}
      html body main>.result .resultWorkspace .sheet::after{content:"";position:absolute;inset:0;pointer-events:none;border-top:1px solid rgba(255,255,255,.55);border-left:1px solid rgba(255,255,255,.32);opacity:.9}
      html body main #sidebarRoot>#materialsPanel .materialsHead,html body main #sidebarRoot>#partsPanel>h2,html body main #sidebarRoot>#settingsPanel .settingsHead,html body main #sidebarRoot>.projectPanelHeader,html body main #sidebarRoot>#partsPanel .toolbar,html body main>.result .resultToolbar{border-bottom-color:transparent!important}
      html body main #sidebarRoot .projectMaterialCard,html body main #sidebarRoot .detailsMaterialCard,html body main>.result .resultWorkspace #layouts>.empty{border:0!important;box-shadow:none!important}
      html body main>.result .resultWorkspace,html body main>.result .resultWorkspace #layouts,html body main>.result .resultWorkspace #unplaced{border:0!important;outline:0!important;box-shadow:none!important}
      html body .resultWorkspace{border:0!important;border-width:0!important;outline:0!important;box-shadow:none!important}
      html body main #sidebarRoot{box-sizing:border-box!important;padding:16px 18px 20px!important;gap:12px!important;background:#f4f7fb!important;border:0!important;overflow-y:auto!important}
      html body main #sidebarRoot>#materialsPanel,html body main #sidebarRoot>#partsPanel{width:100%!important;margin:0!important;background:#fff!important;border:0!important;border-radius:12px!important;box-shadow:0 5px 18px rgba(32,70,112,.07)!important;overflow:hidden!important}
      html body main #sidebarRoot>#materialsPanel{height:auto!important;min-height:0!important;padding:0!important;background:#fff!important;border:0!important;border-radius:12px!important;overflow:hidden!important}
      html body main #sidebarRoot>#materialsPanel .materialsHead,html body main #sidebarRoot>#materialsPanel .materialsContent{box-sizing:border-box!important;margin:0!important;border-radius:0!important;background:#fff!important}
      html body main #sidebarRoot>#materialsPanel .materialsHead{border:0!important;border-bottom:1px solid #edf1f6!important}
      html body main #sidebarRoot>#materialsPanel .materialsContent{border:0!important;box-shadow:none!important}
      html body main #sidebarRoot>#projectsPanel{height:auto!important;min-height:0!important;padding:0!important;background:#fff!important;border:0!important;border-radius:12px!important;overflow:hidden!important;box-shadow:0 5px 18px rgba(32,70,112,.07)!important}
      html body main #sidebarRoot>#projectsPanel>.projectPanelHeader,html body main #sidebarRoot>#projectsPanel>.projectsContent{box-sizing:border-box!important;margin:0!important;border-radius:0!important;background:#fff!important}
      html body main #sidebarRoot>#projectsPanel>.projectPanelHeader{border:0!important;border-bottom:1px solid #edf1f6!important}
      html body main #sidebarRoot>#projectsPanel>.projectsContent{border:0!important;box-shadow:none!important}
      html body main #sidebarRoot{row-gap:0!important}
      html body main #sidebarRoot>.projectPanelHeader{box-sizing:border-box!important;width:100%!important;margin:0!important;border:0!important;border-radius:12px 12px 0 0!important;background:#fff!important;box-shadow:0 5px 18px rgba(32,70,112,.07)!important}
      html body main #sidebarRoot>#projectsPanel{width:100%!important;margin:0 0 12px!important;border:0!important;border-radius:0!important;background:#fff!important;box-shadow:0 5px 18px rgba(32,70,112,.07)!important}
      html body main #sidebarRoot>#projectsPanel .projectsContent{margin:0!important;background:#fff!important}
      html body main>.result .resultToolbar #mapScaleControl output{color:#536b88!important;opacity:1!important;font-weight:700!important;text-shadow:none!important}
      html body main>.result .resultToolbar #mapScaleControl>span{color:#71829a!important;opacity:1!important}
      html body main #sidebarRoot>#projectsPanel,html body main #sidebarRoot>#partsPanel,html body main #sidebarRoot>#settingsPanel,html body main #sidebarRoot>.projectPanelHeader{background:#fff!important;color:#142b4d!important;border-color:#dfe7f0!important;box-shadow:0 4px 16px rgba(32,70,112,.06)!important}
      html body main #sidebarRoot>#projectsPanel .projectsHead,html body main #sidebarRoot>#partsPanel>h2,html body main #sidebarRoot>#settingsPanel .settingsHead,html body main #sidebarRoot>.projectPanelHeader{background:#fff!important;color:#142b4d!important;border-bottom-color:#edf1f6!important}
      html body main #sidebarRoot>#projectsPanel .projectsHead h2,html body main #sidebarRoot>#partsPanel>h2,html body main #sidebarRoot>.projectPanelHeader strong{color:#142b4d!important}
      html body main #sidebarRoot input,html body main #sidebarRoot select,html body main #sidebarRoot button.secondary{background:#fff!important;color:#203a5e!important;border-color:#d7e1ec!important}
      html body main #sidebarRoot .projectMaterialCard,html body main #sidebarRoot .detailsMaterialCard{background:#fff!important;color:#203a5e!important;border-color:#e2eaf3!important}
      html body main #sidebarRoot .projectGroupFields input,html body main #sidebarRoot .projectGroupFields select{background:#fff!important;background-image:none!important;color:#203a5e!important;border:1px solid #d7e1ec!important;box-shadow:none!important}
      html body main #sidebarRoot #projectAddMaterialBottom{background:#1687f5!important;background-image:none!important;color:#fff!important;border:1px solid #1687f5!important;box-shadow:0 4px 12px rgba(22,135,245,.18)!important}
      html body main #sidebarRoot #projectAddMaterialBottom:hover{background:#0f73d2!important;color:#fff!important}
      html body main #sidebarRoot #partsGrid,html body main #sidebarRoot #partsGrid .ag-root-wrapper,html body main #sidebarRoot #partsGrid .ag-root{background:#fff!important;color:#203a5e!important;border-color:#e3eaf2!important}
      html body main #sidebarRoot #partsGrid .ag-header,html body main #sidebarRoot #partsGrid .ag-header-cell{background:#f8fafc!important;color:#71829a!important;border-color:#edf1f6!important}
      html body main #sidebarRoot #partsGrid .ag-row,html body main #sidebarRoot #partsGrid .ag-cell{background:#fff!important;color:#203a5e!important;border-color:#edf1f6!important}
      html body main #sidebarRoot #partsGrid .ag-row-odd{background:#fcfdff!important}
      html body .partsModal,html body .partsModalDialog,html body .partsModalBody{background:#fff!important;color:#142b4d!important}
      html body .partsModalDialog{border:1px solid #cfe0ef!important;border-radius:10px!important;box-shadow:0 18px 50px rgba(32,70,112,.18)!important}
      html body .partsModalHead{background:#fff!important;border-bottom:1px solid #e3ebf4!important}
      html body .partsModalHead h2{color:#142b4d!important}
      html body .partsModalClose{color:#71829a!important}
      html body .partsModalClose:hover{background:#f2f7ff!important;color:#1479e5!important}
      html body .partsModalBody #partsGrid{--ag-row-height:29px!important;--ag-header-height:42px!important;--ag-background-color:#fff!important;--ag-foreground-color:#203a5e!important;--ag-header-background-color:#f8fafc!important;--ag-header-foreground-color:#536b88!important;--ag-row-border-color:#e7eef5!important;--ag-border-color:#e3eaf2!important;--ag-odd-row-background-color:#fcfdff!important;--ag-row-hover-color:#e6f2ff!important;--ag-selected-row-background-color:#f0f7ff!important;background:#fff!important;color:#203a5e!important;border-color:#e3eaf2!important}
      html body .partsModalBody #partsGrid .ag-root-wrapper,html body .partsModalBody #partsGrid .ag-root,html body .partsModalBody #partsGrid .ag-body,html body .partsModalBody #partsGrid .ag-body-viewport,html body .partsModalBody #partsGrid .ag-center-cols-viewport,html body .partsModalBody #partsGrid .ag-center-cols-container{background:#fff!important;background-color:#fff!important;color:#203a5e!important;border-color:#e3eaf2!important}
      html body .partsModalBody #partsGrid .ag-header,html body .partsModalBody #partsGrid .ag-header-row,html body .partsModalBody #partsGrid .ag-header-cell{background:#f8fafc!important;color:#536b88!important;border-color:#e7eef5!important}
      html body .partsModalBody #partsGrid .ag-header-cell-text{color:#536b88!important;font-weight:700!important}
      html body .partsModalBody #partsGrid .ag-row,html body .partsModalBody #partsGrid .ag-full-width-row,html body .partsModalBody #partsGrid .ag-pinned-left-cols-container .ag-row,html body .partsModalBody #partsGrid .ag-center-cols-container .ag-row,html body .partsModalBody #partsGrid .ag-pinned-right-cols-container .ag-row,html body .partsModalBody #partsGrid .ag-cell,html body .partsModalBody #partsGrid .ag-cell-value{background:#fff!important;background-color:#fff!important;background-image:none!important;color:#203a5e!important;border-color:#e7eef5!important;opacity:1!important}
      html body .partsModalBody #partsGrid .ag-row-odd,html body .partsModalBody #partsGrid .ag-row-odd .ag-cell{background:#fcfdff!important;background-color:#fcfdff!important}
      html body .partsModalBody #partsGrid .ag-row{min-height:29px!important;height:29px!important;border-bottom:1px solid #e7eef5!important}
      html body .partsModalBody #partsGrid .ag-row .ag-cell{height:29px!important;min-height:29px!important;line-height:27px!important}
      html body .partsModalBody #partsGrid .ag-row::before,html body .partsModalBody #partsGrid .ag-row::after{background:#fff!important;background-color:#fff!important;background-image:none!important;border-color:#e7eef5!important;box-shadow:none!important}
      html body .partsModalBody #partsGrid .ag-body-horizontal-scroll,html body .partsModalBody #partsGrid .ag-body-horizontal-scroll-viewport{display:none!important;height:0!important;min-height:0!important;background:#fff!important;background-color:#fff!important}
      html body .partsModalBody #partsGrid .ag-body-horizontal-scroll-container,html body .partsModalBody #partsGrid .ag-floating-bottom,html body .partsModalBody #partsGrid .ag-floating-bottom-viewport,html body .partsModalBody #partsGrid .ag-sticky-bottom{display:none!important;height:0!important;min-height:0!important;background:#fff!important;background-color:#fff!important}
      html body .partsModalBody #partsGrid .ag-center-cols-clipper,html body .partsModalBody #partsGrid .ag-body-container,html body .partsModalBody #partsGrid .ag-viewport,html body .partsModalBody #partsGrid .ag-pinned-left-cols-container,html body .partsModalBody #partsGrid .ag-pinned-right-cols-container{background:#fff!important;background-color:#fff!important;background-image:none!important}
      html body .partsModalBody #partsGrid,html body .partsModalBody #partsGrid .ag-body-viewport{scrollbar-color:#b9d8ef #f7fafc;scrollbar-width:thin}
      html body .partsModalBody #partsGrid .ag-body-viewport::-webkit-scrollbar{width:10px;height:10px}
      html body .partsModalBody #partsGrid .ag-body-viewport::-webkit-scrollbar-track{background:#f7fafc}
      html body .partsModalBody #partsGrid .ag-body-viewport::-webkit-scrollbar-thumb{background:#b9d8ef;border:2px solid #f7fafc;border-radius:6px}
      html body .partsModalBody #partsGrid .ag-body-viewport::-webkit-scrollbar-thumb:hover{background:#8fc2e5}
      html body .partsModalBody #partsGrid .ag-body-vertical-scroll,html body .partsModalBody #partsGrid .ag-body-vertical-scroll-viewport,html body .partsModalBody #partsGrid .ag-body-vertical-scroll-container{background:#f7fafc!important;background-color:#f7fafc!important;scrollbar-color:#b9d8ef #f7fafc;scrollbar-width:thin}
      html body .partsModalBody #partsGrid .ag-body-vertical-scroll-viewport::-webkit-scrollbar{width:10px}
      html body .partsModalBody #partsGrid .ag-body-vertical-scroll-viewport::-webkit-scrollbar-track{background:#f7fafc}
      html body .partsModalBody #partsGrid .ag-body-vertical-scroll-viewport::-webkit-scrollbar-thumb{background:#b9d8ef;border:2px solid #f7fafc;border-radius:6px}
      html body .partsModalBody #partsGrid .ag-body-vertical-scroll-viewport::-webkit-scrollbar-thumb:hover{background:#8fc2e5}
      html body .partsModalBody #partsGrid .ag-overlay,html body .partsModalBody #partsGrid .ag-overlay-panel,html body .partsModalBody #partsGrid .ag-overlay-wrapper,html body .partsModalBody #partsGrid .ag-overlay-no-rows-wrapper,html body .partsModalBody #partsGrid .ag-overlay-no-rows-center{background:#fff!important;background-color:#fff!important;background-image:none!important;color:#536b88!important;border:0!important;box-shadow:none!important}
      html body .partsModalBody #partsGrid .ag-overlay-no-rows-center{color:#536b88!important;font-size:13px!important}
      html body main #sidebarRoot #partsGrid .ag-body-vertical-scroll,html body main #sidebarRoot #partsGrid .ag-body-vertical-scroll-viewport,html body main #sidebarRoot #partsGrid .ag-body-vertical-scroll-container{background:#f7fafc!important;background-color:#f7fafc!important;scrollbar-color:#b9d8ef #f7fafc;scrollbar-width:thin}
      html body main #sidebarRoot #partsGrid .ag-body-vertical-scroll-viewport::-webkit-scrollbar{width:10px}
      html body main #sidebarRoot #partsGrid .ag-body-vertical-scroll-viewport::-webkit-scrollbar-track{background:#f7fafc}
      html body main #sidebarRoot #partsGrid .ag-body-vertical-scroll-viewport::-webkit-scrollbar-thumb{background:#b9d8ef;border:2px solid #f7fafc;border-radius:6px}
      html body main #sidebarRoot #partsGrid .ag-body-vertical-scroll-viewport::-webkit-scrollbar-thumb:hover{background:#8fc2e5}
      html body .partsModalBody #partsGrid .ag-row-hover,html body .partsModalBody #partsGrid .ag-row-hover .ag-cell{background:#e6f2ff!important;color:#203a5e!important}
      html body .partsModalBody #partsGrid .ag-row-selected,html body .partsModalBody #partsGrid .ag-row-selected .ag-cell,html body .partsModalBody #partsGrid .ag-row-focus,html body .partsModalBody #partsGrid .ag-row-focus .ag-cell{background:#f0f7ff!important;color:#173d62!important}
      html body main #sidebarRoot #partsGrid .ag-row-selected,html body main #sidebarRoot #partsGrid .ag-row-selected .ag-cell{background:#dff0ff!important;color:#183e68!important}
      html body main>.result .resultToolbar,html body main>.result .resultWorkspace{background:#f4f7fb!important;border-color:#e6edf5!important}
      html body main>.result .resultWorkspace .layout,html body main>.result .resultWorkspace .draftLayout{background:transparent!important;color:#142b4d!important;border:0!important;border-radius:0!important;box-shadow:none!important;padding:0!important}
      html body main>.result .resultWorkspace #unplaced{background:transparent!important;color:#142b4d!important;border-color:transparent!important;box-shadow:none!important}
      html body main>.result .resultWorkspace .sheet{background-color:#e9d3ad!important;outline:1px solid #c49a67!important}
      html body main>.result .resultWorkspace .piece,html body main>.result .resultWorkspace .draftPiece{background:#9fd4f3!important;color:#173d62!important;border:1px solid rgba(41,113,165,.32)!important;box-shadow:none!important}
      html body main>.result .resultWorkspace #layouts > .empty{background:#fff!important;background-image:none!important;color:#71829a!important;border:1px solid #e2eaf3!important;box-shadow:0 5px 18px rgba(32,70,112,.05)!important}
      html body main #sidebarRoot #partsPanel .detailsTablesControls,html body main #sidebarRoot #partsPanel .detailsTableBar,html body main #sidebarRoot #partsPanel .detailsMaterialHeader{background:#fff!important;color:#203a5e!important}
      html body main #sidebarRoot #partsPanel .detailsTableTab{background:#f4f8fc!important;color:#315273!important;border-color:#d7e3ef!important}
      html body main #sidebarRoot #partsPanel .detailsTableTab.active{background:#e1f1ff!important;color:#1479e5!important;border-color:#9dccf4!important}
      html body main #sidebarRoot .projectCuttingOptions input,html body main #sidebarRoot .projectCuttingOptions select,html body main #sidebarRoot .projectEdgesField select,html body main #sidebarRoot .projectQtyField input{background:#fff!important;color:#203a5e!important;border-color:#d7e1ec!important}
      html body .resultWorkspace .sheet > .piece.detailPartSelected,html body .resultWorkspace .sheet > .piece.layoutPieceSelected{background:#7fcaf2!important;border:0!important;outline:0!important;box-shadow:none!important}
      html body main #sidebarRoot h2,html body main #sidebarRoot h3,html body main #sidebarRoot strong,html body main #sidebarRoot .detailsPanelTitle{color:#142b4d!important}
      html body main #sidebarRoot label,html body main #sidebarRoot legend,html body main #sidebarRoot .projectSectionLabel,html body main #sidebarRoot .projectHint,html body main #sidebarRoot small{color:#71829a!important}
      html body main #sidebarRoot input::placeholder,html body main #sidebarRoot select:invalid{color:#9aaac0!important}
      html body main #sidebarRoot .projectMaterialInfo strong,html body main #sidebarRoot .detailsMaterialInfo strong{color:#142b4d!important}
      html body main #sidebarRoot .projectMaterialInfo small,html body main #sidebarRoot .detailsMaterialInfo small{color:#71829a!important}
      html body main #sidebarRoot .projectStepNumber,html body main #sidebarRoot .detailsStepNumber{background:#dff0ff!important;color:#1687f5!important}
      html body main #sidebarRoot .sidebarCollapseToggle,html body main #sidebarRoot .detailMenuButton,html body main #sidebarRoot .partsExpandButton{color:#607b9c!important}
      html body main #sidebarRoot .projectAddMaterialBottom,html body main #sidebarRoot #projectAddMaterialBottom{background:#e8f4ff!important;background-image:none!important;color:#1687f5!important;border-color:#c8e4fb!important;box-shadow:none!important}
      html body main #sidebarRoot .projectAddMaterialBottom:hover,html body main #sidebarRoot #projectAddMaterialBottom:hover{background:#d8edff!important;color:#0f73d2!important}
      html body main>.result .resultToolbar,html body main>.result .resultToolbar *{color:#71829a!important}
      html body main>.result .resultToolbar::before{background:transparent!important;background-color:transparent!important;background-image:none!important;border:0!important;box-shadow:none!important}
      html body main>.result .resultWorkspace #layouts>.empty::before{display:none!important;content:none!important;background:none!important;border:0!important;box-shadow:none!important}
      html body main>.result .resultToolbar #calcBtn,html body main>#projectTopbar .projectTopbarActions .primary{color:#fff!important;background:#ff8a26!important;border-color:#ff8a26!important}
      html body main>.result .layout h3,html body main>.result .layoutToggle,html body main>.result .layoutDetailsBody,html body main>.result .layoutRemaindersHead{color:#142b4d!important}
      html body main>.result .layoutUsage{background:#e8f4ff!important;color:#1687f5!important;border-color:#c8e4fb!important}
      html body main>.result .layoutDetailsBody .layoutDetailRow.layoutDetailSelected{background:#dff0ff!important;color:#173d62!important;box-shadow:none!important}
      html body main>.result .freeRemainderCard,html body main>.result .freeRemainderMap{background:#fff1d9!important;color:#6b4b23!important;border-color:#f0c27d!important}
      html body main>.result .resultWorkspace .layout,html body main>.result .resultWorkspace .draftLayout{background:transparent!important;background-image:none!important;color:#142b4d!important;border:0!important;border-radius:0!important;box-shadow:none!important;padding:0!important}
      html body main>.result .resultWorkspace .layoutToggle{background:#fff!important;color:#142b4d!important;border-bottom-color:#edf1f6!important}
      html body main>.result .resultWorkspace .layoutToggle span,html body main>.result .resultWorkspace .layoutToggle strong,html body main>.result .resultWorkspace .layout h3,html body main>.result .resultWorkspace .layoutDetailsToggle,html body main>.result .resultWorkspace .layoutDetailsHeader,html body main>.result .resultWorkspace .layoutRemaindersHead{color:#142b4d!important}
      html body main>.result .resultWorkspace .layoutToggle b{color:#1687f5!important}
      html body main>.result .resultWorkspace .layoutStats{display:grid!important;border:1px solid #dfe7f0!important}
      html body main>.result .resultWorkspace .layoutStats>div{background:#fff!important;border-color:#edf1f6!important}
      html body main>.result .resultWorkspace .layoutStats span{color:#71829a!important}
      html body main>.result .resultWorkspace .layoutStats b{color:#142b4d!important}
      html body main>.result .resultWorkspace .layoutStats em{color:#ff7a00!important}
      html body main>.result .resultWorkspace .layoutDetailsList,html body main>.result .resultWorkspace .layoutDetailsList *{background:#fff!important;border-color:#e7eef5!important;color:#142b4d!important}
      html body main>.result .resultWorkspace .layoutDetailRow>span:first-child{color:#1687f5!important}
      html body main>.result .resultWorkspace .layoutDetailRow>span:last-child{color:#71829a!important}
      html body main>.result .resultWorkspace .sheetMeasure{background:#fff!important}
      html body main>.result .resultWorkspace .sheetMeasureTop,html body main>.result .resultWorkspace .sheetMeasureLeft,html body main>.result .resultWorkspace .sheetMeasureTop span,html body main>.result .resultWorkspace .sheetMeasureLeft span{color:#536b88!important;background:transparent!important}
      html body main>.result .resultWorkspace .sheetMeasureTop i::after{content:""!important;position:absolute!important;top:5px!important;width:var(--measure-arrow-size,7px)!important;height:calc(var(--measure-arrow-size,7px) * .65)!important;border:0!important;background:#9eb6ca!important;transform:translateY(-50%)!important}
      html body main>.result .resultWorkspace .sheetMeasureTop i:first-of-type::after{left:0!important;right:auto!important;clip-path:polygon(0 50%,100% 0,100% 100%)!important}
      html body main>.result .resultWorkspace .sheetMeasureTop i:last-of-type::after{left:auto!important;right:0!important;clip-path:polygon(100% 50%,0 0,0 100%)!important}
      html body main>.result .resultWorkspace .sheetMeasureLeft i{position:relative!important}
      html body main>.result .resultWorkspace .sheetMeasureLeft i::after{content:""!important;position:absolute!important;left:50%!important;width:calc(var(--measure-arrow-size,7px) * .65)!important;height:var(--measure-arrow-size,7px)!important;border:0!important;background:#9eb6ca!important;transform:translateX(-50%)!important}
      html body main>.result .resultWorkspace .sheetMeasureLeft i:first-of-type::after{top:0!important;bottom:auto!important;clip-path:polygon(50% 0,100% 100%,0 100%)!important}
      html body main>.result .resultWorkspace .sheetMeasureLeft i:last-of-type::after{top:auto!important;bottom:0!important;clip-path:polygon(0 0,100% 0,50% 100%)!important}
      html body main #sidebarRoot #partsGrid,html body main #sidebarRoot #partsGrid .ag-root-wrapper,html body main #sidebarRoot #partsGrid .ag-root,html body main #sidebarRoot #partsGrid .ag-body-viewport,html body main #sidebarRoot #partsGrid .ag-center-cols-viewport{background:#fff!important;background-color:#fff!important;color:#203a5e!important}
      html body main #sidebarRoot #partsGrid .ag-header,html body main #sidebarRoot #partsGrid .ag-header-row,html body main #sidebarRoot #partsGrid .ag-header-cell{background:#f8fafc!important;background-color:#f8fafc!important;color:#71829a!important;border-color:#e3eaf2!important}
      html body main #sidebarRoot #partsGrid .ag-header-cell-text{color:#536b88!important;font-weight:700!important}
      html body main #sidebarRoot #partsGrid .ag-row,html body main #sidebarRoot #partsGrid .ag-row-odd,html body main #sidebarRoot #partsGrid .ag-center-cols-container .ag-row,html body main #sidebarRoot #partsGrid .ag-cell,html body main #sidebarRoot #partsGrid .ag-cell-value{background:#fff!important;background-color:#fff!important;color:#203a5e!important;border-color:#e7eef5!important;opacity:1!important}
      html body main #sidebarRoot #partsGrid .ag-row-odd .ag-cell{background:#fcfdff!important;background-color:#fcfdff!important}
      html body main>.result .resultWorkspace .layout,html body main>.result .resultWorkspace .draftLayout{background:transparent!important;background-color:transparent!important;background-image:none!important;border:0!important;border-radius:0!important;outline:0!important;box-shadow:none!important;padding:0!important;color:#142b4d!important}
      html body main>.result .resultWorkspace .layoutStats>div,html body main>.result .resultWorkspace .layoutDetailsList,html body main>.result .resultWorkspace .layoutDetailsList *,html body main>.result .resultWorkspace .layoutRemainders *{background:#fff!important;background-color:#fff!important}
      html body main>.result .resultWorkspace #unplaced .unplacedPiece,html body main>.result .resultWorkspace #unplaced .draftUnplacedPiece,html body main>.result .resultWorkspace .draftPiece{background:linear-gradient(145deg,#fff 0%,#f8fbff 58%,#eef6fc 100%)!important;background-color:#fff!important;border:1px solid #b9d8ef!important;box-shadow:none!important;color:#173d62!important}
      html body main>.result .resultWorkspace #unplaced .unplacedPiece *,html body main>.result .resultWorkspace #unplaced .draftUnplacedPiece *,html body main>.result .resultWorkspace .draftPiece *{color:#173d62!important}
      html body .resultWorkspace #unplacedBoard .piece.unplacedPiece,html body .resultWorkspace #unplacedBoard .draftUnplacedPiece,html body .dragGhost.piece,html body .dragGhost.unplacedPiece{background:linear-gradient(145deg,#fff 0%,#f8fbff 58%,#eef6fc 100%)!important;background-color:#fff!important;border:1px solid #b9d8ef!important;box-shadow:0 8px 18px rgba(35,70,105,.18)!important;color:#173d62!important}
      html body .dragGhost.piece *,html body .dragGhost.unplacedPiece *,html body .resultWorkspace #unplacedBoard .piece.unplacedPiece *{color:#173d62!important}
      html body main>.result .resultWorkspace #layouts>.layout,html body main>.result .resultWorkspace #layouts>.draftLayout{background:transparent!important;background-color:transparent!important;background-image:none!important;border:0!important;border-radius:0!important;box-shadow:none!important;padding:0!important}
      html body main>.result .resultWorkspace #layouts>.layout>.layoutToggle,html body main>.result .resultWorkspace #layouts>.layout>.sheetMeasure,html body main>.result .resultWorkspace #layouts>.layout>.layoutStats,html body main>.result .resultWorkspace #layouts>.layout>.layoutDetailsList,html body main>.result .resultWorkspace #layouts>.draftLayout>.layoutToggle,html body main>.result .resultWorkspace #layouts>.draftLayout>.sheetMeasure,html body main>.result .resultWorkspace #layouts>.draftLayout>.layoutStats,html body main>.result .resultWorkspace #layouts>.draftLayout>.layoutDetailsList{background:#fff!important;background-color:#fff!important;background-image:none!important}
      html body main #sidebarRoot #partsGrid .ag-row-selected,html body main #sidebarRoot #partsGrid .ag-row-selected .ag-cell,html body main #sidebarRoot #partsGrid .ag-row-focus,html body main #sidebarRoot #partsGrid .ag-row-focus .ag-cell{background:#e8f4ff!important;background-color:#e8f4ff!important;color:#173d62!important;border-color:#cfe5f7!important}
      html body main #sidebarRoot #partsGrid .ag-row-selected .ag-cell-value,html body main #sidebarRoot #partsGrid .ag-row-focus .ag-cell-value{color:#173d62!important;opacity:1!important}
      html body main #sidebarRoot #partsGrid .ag-cell,html body main #sidebarRoot #partsGrid .ag-cell-value{color:#536b88!important;font-weight:500!important;opacity:1!important}
      html body main #sidebarRoot #partsGrid .partNumber,html body main #sidebarRoot #partsGrid .ag-row-selected .partNumber{color:#1687f5!important;font-weight:700!important}
      html body .dragGhost,html body .dragGhost.piece,html body .dragGhost.unplacedPiece{background:linear-gradient(145deg,#fff 0%,#f8fbff 58%,#eef6fc 100%)!important;background-color:#fff!important;border:1px solid #b9d8ef!important;box-shadow:0 0 22px 13px rgba(255,255,255,.9)!important;color:#173d62!important}
      html body .dragGhost *{color:#173d62!important}
      html body .resultWorkspace .piece.unplacedPiece,html body .resultWorkspace .piece.dragging,html body .piece.dragGhost{box-shadow:0 0 22px 13px rgba(255,255,255,.9)!important}
      html body .resultWorkspace .piece,html body .resultWorkspace .piece.dragging,html body .resultWorkspace .dragGhost,html body .dragGhost.piece{box-shadow:inset 0 0 0 1px #0e6792!important}
      html body .resultWorkspace #unplacedBoard .piece,html body .resultWorkspace #unplacedBoard .piece.unplacedPiece,html body .resultWorkspace #unplacedBoard .draftUnplacedPiece{background:linear-gradient(145deg,#6bc1eb 0%,#5aadd9 58%,#4a9dcc 100%)!important;background-color:#5aadd9!important;border:1px solid #1c78a4!important;box-shadow:inset 0 0 0 1px #0e6792!important;color:#06283d!important;filter:none!important}
      html body .resultWorkspace #unplacedBoard .piece *,html body .resultWorkspace #unplacedBoard .draftUnplacedPiece *{color:#06283d!important}
      html body #unplacedBoard .piece,html body #unplacedBoard .piece.unplacedPiece,html body #unplacedBoard .draftUnplacedPiece,html body #unplaced .piece,html body #unplaced .unplacedPiece{background:linear-gradient(145deg,#6bc1eb 0%,#5aadd9 58%,#4a9dcc 100%)!important;background-color:#5aadd9!important;border:1px solid rgba(41,113,165,.32)!important;box-shadow:none!important;color:#06283d!important;filter:none!important;opacity:1!important}
      html body #unplacedBoard .piece *,html body #unplacedBoard .draftUnplacedPiece *,html body #unplaced .piece *{color:#06283d!important}
      html body #unplaced .unplacedEmptyState{position:absolute!important;inset:0!important;z-index:3!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:5px!important;width:100%!important;height:100%!important;min-height:150px!important;text-align:center!important;color:#91a5bb!important}
      html body #unplaced .unplacedEmptyIcon{display:block!important;width:48px!important;height:48px!important;margin:0 0 2px!important;fill:none!important;stroke:#d8e4f0!important;stroke-width:1.5!important}
      html body #unplaced .unplacedEmptyTitle{display:block!important;color:#8ba1b8!important;font-size:13px!important;font-weight:600!important;line-height:1.25!important}
      html body #unplaced .unplacedEmptyHint{display:block!important;color:#a5b5c7!important;font-size:11px!important;line-height:1.3!important}
      html body #unplaced:has(.unplacedEmptyState)::before{display:none!important;content:none!important}
      html body #unplaced:has(.unplacedEmptyState)::after{display:none!important;content:none!important}
      html body .resultWorkspace #unplaced.unplacedCalculated.unplacedEmpty::after{display:block!important;content:""!important;border-top:1px dashed #b8c7ce!important}
      html body #unplaced:not(.hidden):not(:has(.piece)):not(:has(.unplacedEmptyState))::before{content:"Неразмещенные детали\A Все детали размещены на листах"!important;position:absolute!important;inset:0!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:62px 20px 0!important;box-sizing:border-box!important;white-space:pre!important;text-align:center!important;color:#8ba1b8!important;font-size:13px!important;font-weight:600!important;line-height:28px!important;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' fill='none' stroke='%23d8e4f0' stroke-width='1.5'%3E%3Cpath d='M4 9 16 2l12 7-12 7L4 9Z'/%3E%3Cpath d='M4 14 16 21l12-7'/%3E%3Cpath d='M4 19 16 26l12-7'/%3E%3C/svg%3E")!important;background-repeat:no-repeat!important;background-position:center 24px!important;background-size:48px 48px!important;z-index:3!important}
      html body #unplaced:not(.hidden):not(:has(.piece)):not(:has(.unplacedEmptyState))::after{display:none!important}
      html body .edgeCanvas{background:#9fd4f3!important;background-color:#9fd4f3!important;background-image:none!important;border:1px solid #1687f5!important;box-shadow:0 0 14px 8px rgba(255,255,255,.9)!important;color:#1f2a37!important}
      html body .edgeCanvas::before{display:none!important;content:none!important;background:none!important;filter:none!important}
      html body .edgeMini{background:transparent!important;background-image:none!important;border:0!important;box-shadow:none!important;filter:none!important}
      html body .edgeMini::before{display:none!important;content:none!important;background:none!important;filter:none!important}
      html body #partsGrid .edgeCell{display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;height:28px!important;padding:3px 8px!important;background:transparent!important;background-image:none!important;border:0!important;box-shadow:none!important}
      html body #partsGrid .edgeCellMini,html body #partsGrid .edgeCellMini.empty,html body #partsGrid .edgeCellMini.isEmpty{display:block!important;width:42px!important;height:20px!important;min-width:42px!important;min-height:20px!important;max-width:42px!important;max-height:20px!important;flex:0 0 42px!important;box-sizing:border-box!important;margin:0 auto!important}
      html body #partsGrid .edgeCellMini{background:#9fd4f3!important;background-color:#9fd4f3!important;background-image:none!important;border:1px solid #1687f5!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.32)!important}
      html body #partsGrid .edgeCellMini.empty,html body #partsGrid .edgeCellMini.isEmpty{background:#dfe6ed!important;background-image:none!important;border-color:#c7d3df!important;color:#71829a!important}
      html body main #sidebarRoot #partsGrid .ag-cell[col-id="edgeBanding"],html body main #sidebarRoot #partsGrid .ag-cell[col-id="edgeBanding"] .ag-cell-wrapper,html body main #sidebarRoot #partsGrid .ag-row .ag-cell:nth-child(5),html body main #sidebarRoot #partsGrid .ag-row .ag-cell[aria-colindex="5"]{background:transparent!important;background-color:transparent!important;background-image:none!important;box-shadow:none!important}
      html body main #sidebarRoot #partsGrid .ag-cell:has(.edgeCell),html body main #sidebarRoot #partsGrid .ag-cell:has(.edgeCell) .ag-cell-wrapper,html body main #sidebarRoot #partsGrid .ag-cell:has(.edgeCell) .ag-cell-value{background:transparent!important;background-color:transparent!important;background-image:none!important;box-shadow:none!important}
      html body main #sidebarRoot #partsPanel>h2,html body main #sidebarRoot #partsPanel>h2 .detailsPanelTitle{color:#142b4d!important;opacity:1!important;font-weight:700!important}
      html body main #sidebarRoot #partsGrid .ag-header-cell-text{color:#536b88!important;opacity:1!important;font-weight:700!important}
      html body main #sidebarRoot #partsGrid .ag-cell,html body main #sidebarRoot #partsGrid .ag-cell-value{color:#203a5e!important;opacity:1!important;font-weight:500!important}
      html body main #sidebarRoot #partsGrid .ag-row,html body main #sidebarRoot #partsGrid .ag-row .ag-cell{color:#203a5e!important;opacity:1!important}
      html body main #sidebarRoot #partsGrid .ag-row-selected,html body main #sidebarRoot #partsGrid .ag-row-selected .ag-cell,html body main #sidebarRoot #partsGrid .ag-row-focus,html body main #sidebarRoot #partsGrid .ag-row-focus .ag-cell,html body main #sidebarRoot #partsGrid [aria-selected="true"],html body main #sidebarRoot #partsGrid [aria-selected="true"] .ag-cell{background:#f0f7ff!important;background-color:#f0f7ff!important;color:#173d62!important}
      html body main #sidebarRoot #partsGrid .ag-cell-focus,html body main #sidebarRoot #partsGrid .ag-row-selected .ag-cell-focus,html body main #sidebarRoot #partsGrid .ag-row-focus .ag-cell-focus,html body main #sidebarRoot #partsGrid [aria-selected="true"] .ag-cell-focus{background:#f0f7ff!important;background-color:#f0f7ff!important;color:#173d62!important;border-color:#dbeaf7!important;box-shadow:none!important;outline:0!important}
      html body main #sidebarRoot #partsGrid .ag-row-hover,html body main #sidebarRoot #partsGrid .ag-row-hover .ag-cell{background:#e6f2ff!important;background-color:#e6f2ff!important;color:#203a5e!important;box-shadow:none!important}
      html body main #sidebarRoot #partsGrid .ag-header-cell-text{color:#536b88!important;opacity:1!important;font-weight:700!important}
      html body main #sidebarRoot #partsGrid .ag-row .ag-cell:first-child,html body main #sidebarRoot #partsGrid .ag-row .partNumber{color:#203a5e!important;opacity:1!important;font-weight:600!important}
      html body main #sidebarRoot #partsGrid .partNumber,html body main #sidebarRoot #partsGrid .partNumber *,html body main #sidebarRoot #partsGrid .ag-cell[col-id="0"],html body main #sidebarRoot #partsGrid .ag-cell[col-id="0"] *{color:#203a5e!important;opacity:1!important;font-weight:600!important}
      html body main #sidebarRoot>#partsPanel>h2{display:flex!important;align-items:center!important;gap:10px!important;height:44px!important;min-height:44px!important;margin:0!important;padding:0 16px!important;background:#fff!important;border:0!important;border-bottom:1px solid #edf1f6!important;color:#142b4d!important}
      html body main #sidebarRoot>#partsPanel>h2 .detailsStepNumber{display:grid!important;place-items:center!important;width:24px!important;height:24px!important;flex:0 0 24px!important;border-radius:4px!important;background:#dff0ff!important;color:#1687f5!important;font-size:12px!important;font-weight:700!important}
      html body main #sidebarRoot>#partsPanel>h2 .detailsPanelTitle{color:#142b4d!important;font-size:14px!important;font-weight:700!important}
      html body main #sidebarRoot>#partsPanel>h2 .sidebarCollapseToggle:hover{background:transparent!important;color:#607b9c!important}
      html body main #sidebarRoot>#partsPanel .toolbar{background:#fff!important;border-bottom:1px solid #edf1f6!important;color:#203a5e!important}
      html body main #sidebarRoot>.projectPanelHeader{border-radius:0!important}
      html body main #sidebarRoot>#partsPanel{background:#fff!important;border:0!important;border-radius:0!important;overflow:hidden!important;box-shadow:0 5px 18px rgba(32,70,112,.07)!important}
      html body main #sidebarRoot>#partsPanel>h2{height:50px!important;min-height:50px!important;padding:0 16px!important;border-bottom:0!important;background:#fff!important;box-shadow:0 4px 10px rgba(32,70,112,.10)!important;position:relative!important;z-index:1!important}
      html body main #sidebarRoot>#partsPanel>h2,html body main #sidebarRoot>#partsPanel>h2 .detailsStepNumber,html body main #sidebarRoot>#partsPanel>h2 .detailsPanelTitle{cursor:pointer!important;user-select:none!important}
      html body main #sidebarRoot>#partsPanel.sectionCollapsed{height:50px!important;min-height:50px!important;flex:0 0 50px!important;overflow:hidden!important}
      html body main #sidebarRoot>#partsPanel.sectionCollapsed> :not(h2){display:none!important}
      html body main #sidebarRoot>#partsPanel>h2 .detailsStepNumber{width:24px!important;height:24px!important;flex-basis:24px!important;border-radius:4px!important;background:#dff0ff!important;color:#1687f5!important}
      html body .dragGhost,html body .dragGhost.piece,html body .dragGhost.unplacedPiece,html body .resultWorkspace .piece.dragging,html body .resultWorkspace .dragGhost{background:linear-gradient(145deg,#6bc1eb 0%,#5aadd9 58%,#4a9dcc 100%)!important;background-color:#5aadd9!important;background-image:linear-gradient(145deg,#6bc1eb 0%,#5aadd9 58%,#4a9dcc 100%)!important;border:1px solid #1c78a4!important;color:#06283d!important;filter:none!important}
      html body .dragGhost *,html body .resultWorkspace .piece.dragging *{color:#06283d!important}
      html body main #sidebarRoot .projectMaterialMenu{background:#fff!important;background-image:none!important;color:#203a5e!important;border:0!important;box-shadow:0 8px 20px rgba(32,70,112,.14)!important}
      html body main #sidebarRoot .projectMaterialOptions{background:#fff!important;background-image:none!important;color:#203a5e!important;border:0!important;box-shadow:none!important}
      html body main #sidebarRoot .projectMaterialSearch{background:#fff!important;background-image:none!important;color:#203a5e!important;border:1px solid #9fc8e8!important;box-shadow:none!important}
      html body main #sidebarRoot .projectMaterialSearch::placeholder{color:#9aaac0!important}
      html body main #sidebarRoot .projectMaterialOption{background:#fff!important;background-image:none!important;color:#203a5e!important;border:0!important}
      html body main #sidebarRoot .projectMaterialOption:hover{background:#e8f4ff!important;color:#173d62!important}
      html body main #sidebarRoot .projectMaterialOptions{scrollbar-color:#b9d8ef #f7fafc;scrollbar-width:thin}
      html body main #sidebarRoot .projectMaterialOptions::-webkit-scrollbar{width:8px}
      html body main #sidebarRoot .projectMaterialOptions::-webkit-scrollbar-track{background:#f7fafc}
      html body main #sidebarRoot .projectMaterialOptions::-webkit-scrollbar-thumb{background:#b9d8ef;border:2px solid #f7fafc;border-radius:4px}
      /* Placed parts use a dense cool-blue face; transparency over the wood texture made them look muddy. */
      html body .resultWorkspace #layouts .sheet > .piece,html body .resultWorkspace #layouts .sheet > .piece.unplacedPiece,html body .resultWorkspace #layouts .sheet > .draftPlacedPiece{background:#9fd4f3!important;background-color:#9fd4f3!important;background-image:none!important;border:1px solid #1687f5!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.32)!important;color:#1f2a37!important;filter:none!important}
      html body .resultWorkspace #layouts .sheet > .piece *,html body .resultWorkspace #layouts .sheet > .draftPlacedPiece *,html body .lightThemePieceContent{color:#1f2a37!important}
      html body .resultWorkspace #layouts .sheet > .piece.detailPartSelected,html body .resultWorkspace #layouts .sheet > .piece.layoutPieceSelected{background:#7fcaf2!important;background-color:#7fcaf2!important;border-color:#22c7e8!important;box-shadow:0 0 0 1px #22c7e8,0 0 12px rgba(34,199,232,.28)!important}
      html body .dragGhost,html body .dragGhost.piece,html body .dragGhost.unplacedPiece{background:#9fd4f3!important;background-color:#9fd4f3!important;background-image:none!important;border:1px solid #1687f5!important;box-shadow:0 8px 20px rgba(31,42,55,.16),0 0 0 2px rgba(22,135,245,.16)!important;color:#1f2a37!important}
      html body .resultWorkspace .piece.dragging,html body .resultWorkspace #layouts .sheet > .piece.dragging{background:#22c7e8!important;background-color:#22c7e8!important;background-image:none!important;border:1px solid #1687f5!important;box-shadow:0 0 0 2px rgba(34,199,232,.22),0 8px 20px rgba(31,42,55,.16)!important;color:#1f2a37!important}
      /* Карта раскроя должна быть рабочей поверхностью без внешней карточки. */
      html body main>.result .resultWorkspace .layout,html body main>.result .resultWorkspace .draftLayout{background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;padding:0!important}
      html body main>.result .resultWorkspace .layoutToggle,html body main>.result .resultWorkspace .sheetMeasure,html body main>.result .resultWorkspace .layoutStatsCompact{background:transparent!important;background-color:transparent!important;border:0!important;box-shadow:none!important}
      html body main>.result .resultWorkspace #layouts>.layout>.layoutToggle,html body main>.result .resultWorkspace #layouts>.layout>.sheetMeasure,html body main>.result .resultWorkspace #layouts>.layout>.layoutStatsCompact,html body main>.result .resultWorkspace #layouts>.draftLayout>.layoutToggle,html body main>.result .resultWorkspace #layouts>.draftLayout>.sheetMeasure,html body main>.result .resultWorkspace #layouts>.draftLayout>.layoutStatsCompact{background:transparent!important;background-color:transparent!important;border:0!important;box-shadow:none!important}
      html body main>.result .resultWorkspace .layoutStatsCompact{border-top:0!important;background:transparent!important;padding:6px 0!important}
      html body main>.result .resultWorkspace #layouts>.layout>.layoutStatsCompact,html body main>.result .resultWorkspace #layouts>.draftLayout>.layoutStatsCompact{display:none!important}
      html body main>.result .resultWorkspace #layouts>.layout>.layoutToggle,html body main>.result .resultWorkspace #layouts>.draftLayout>.layoutToggle{justify-content:flex-start!important;gap:6px!important;margin-bottom:4px!important;padding:2px 0 8px!important}
      html body main>.result .resultWorkspace #layouts>.layout>.sheetMeasure,html body main>.result .resultWorkspace #layouts>.draftLayout>.sheetMeasure{padding-top:14px!important}
      html body main>.result .resultWorkspace #layouts>.layout>.layoutToggle>b,html body main>.result .resultWorkspace #layouts>.draftLayout>.layoutToggle>b{order:-1!important;flex:0 0 18px!important;width:18px!important;height:18px!important;border:0!important;border-radius:0!important;background:transparent!important;color:#1687f5!important}
      html body main>.result .resultWorkspace #layouts>.layout>.layoutToggle>.sidebarCollapseToggle,html body main>.result .resultWorkspace #layouts>.draftLayout>.layoutToggle>.sidebarCollapseToggle{order:-1!important;flex:0 0 18px!important;width:18px!important;height:18px!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;color:#1687f5!important}
      html body main>.result .resultWorkspace #layouts>.layout.layoutCollapsed,html body main>.result .resultWorkspace #layouts>.draftLayout.layoutCollapsed{width:max-content!important;max-width:100%!important;min-width:0!important;height:auto!important;min-height:0!important;padding:0!important}
      html body main>.result .resultWorkspace #layouts>.layout.layoutCollapsed>.sheet,html body main>.result .resultWorkspace #layouts>.layout.layoutCollapsed>.sheetMeasure,html body main>.result .resultWorkspace #layouts>.layout.layoutCollapsed>.layoutStats,html body main>.result .resultWorkspace #layouts>.layout.layoutCollapsed>.layoutDetailsList,html body main>.result .resultWorkspace #layouts>.layout.layoutCollapsed>.layoutRemainders,html body main>.result .resultWorkspace #layouts>.draftLayout.layoutCollapsed>.sheet,html body main>.result .resultWorkspace #layouts>.draftLayout.layoutCollapsed>.sheetMeasure,html body main>.result .resultWorkspace #layouts>.draftLayout.layoutCollapsed>.layoutStats,html body main>.result .resultWorkspace #layouts>.draftLayout.layoutCollapsed>.layoutDetailsList,html body main>.result .resultWorkspace #layouts>.draftLayout.layoutCollapsed>.layoutRemainders{display:none!important}
      html body main>.result .resultWorkspace #layouts>.layout>.sheetMeasure,html body main>.result .resultWorkspace #layouts>.draftLayout>.sheetMeasure{display:block!important;max-height:3000px;overflow:visible!important;opacity:1;transition:max-height 280ms ease,opacity 180ms ease}
      html body main>.result .resultWorkspace #layouts>.layout.layoutCollapsed>.sheetMeasure,html body main>.result .resultWorkspace #layouts>.draftLayout.layoutCollapsed>.sheetMeasure{display:block!important;max-height:0!important;opacity:0!important;overflow:hidden!important;pointer-events:none!important;transition:max-height 280ms ease,opacity 180ms ease}
      html body main>.result .resultWorkspace #layouts>.layout.layoutCollapsed>.sheetMeasure>*,html body main>.result .resultWorkspace #layouts>.draftLayout.layoutCollapsed>.sheetMeasure>*{visibility:hidden!important}
      html body main>.result .resultWorkspace #layouts{overflow:visible!important;padding-bottom:16px!important}
      html body main>.result .resultWorkspace #layouts>.layout,html body main>.result .resultWorkspace #layouts>.draftLayout{overflow:visible!important}
      html body main>.result .resultWorkspace #layouts>.layout .sheetMeasureTop,html body main>.result .resultWorkspace #layouts>.draftLayout .sheetMeasureTop{top:-1px!important}
      html body main>.result .resultWorkspace #layouts>.layout .sheetMeasureLeft,html body main>.result .resultWorkspace #layouts>.draftLayout .sheetMeasureLeft{left:17px!important}
      html body main>.result .resultWorkspace .freeRemainderMap,html body main>.result .resultWorkspace .freeRemainderCard,html body main>.result .resultWorkspace .freeRemainderRow{pointer-events:auto!important;cursor:pointer!important}
      html body main>.result .resultWorkspace .freeRemainderMap.freeRemainderSelected{display:block!important;z-index:8!important;background:#ffd99b!important;border:2px solid #1687f5!important;box-shadow:0 0 0 2px #fff,0 0 0 4px #1687f5!important;color:#6b4b23!important}
      html body main>.result .resultWorkspace .freeRemainderCard.freeRemainderSelected{background:#ffd99b!important;border:2px solid #1687f5!important;box-shadow:0 0 0 2px #fff,0 0 0 4px #1687f5!important;color:#6b4b23!important}
      html body main>.result .resultWorkspace .freeRemainderRow.freeRemainderSelected{background:#fff0d6!important;box-shadow:inset 3px 0 #1687f5!important}
    `;
    head.append(style);
  }
  const keepLast=()=>{
    if(style.parentNode===head&&head.lastElementChild!==style)head.append(style);
  };
  const paintEmptyUnplaced=()=>{
    document.querySelectorAll('#unplaced').forEach(area=>{
      const board=area.querySelector('#unplacedBoard');
      if(!board)return;
      const hasPieces=Boolean(board.querySelector('.piece,.draftUnplacedPiece'));
      const state=area.querySelector('.unplacedEmptyState');
      if(hasPieces){state?.remove();return}
      if(state)return;
      area.insertAdjacentHTML('beforeend','<div class="unplacedEmptyState" role="status"><svg class="unplacedEmptyIcon" viewBox="0 0 32 32" aria-hidden="true"><path d="M4 9 16 2l12 7-12 7L4 9Z"/><path d="M4 14 16 21l12-7"/><path d="M4 19 16 26l12-7"/></svg><strong class="unplacedEmptyTitle">Неразмещенные детали</strong><span class="unplacedEmptyHint">Все детали размещены на листах</span></div>');
    });
  };
  const paintUnplaced=()=>{
    document.querySelectorAll('#unplacedBoard .piece,#unplacedBoard .draftUnplacedPiece,#unplaced .piece,#unplaced .unplacedPiece').forEach(piece=>{
      piece.classList.add('lightThemePiece');
      piece.querySelectorAll('*').forEach(child=>child.classList.add('lightThemePieceContent'));
    });
  };
  const fitModalGrid=()=>{
    const modal=document.querySelector('.partsModal.open');
    const grid=document.querySelector('.partsModalBody #partsGrid');
    if(!modal||!grid)return;
    const header=Math.ceil(grid.querySelector('.ag-header')?.getBoundingClientRect().height||42);
    const row=Math.ceil(grid.querySelector('.ag-row')?.getBoundingClientRect().height||29);
    const rows=grid.querySelectorAll('.ag-center-cols-container .ag-row').length||grid.querySelectorAll('.ag-row').length;
    if(!rows)return;
    const max=Math.max(320,innerHeight-104);
    const height=Math.min(max,Math.max(220,header+rows*row+1));
    grid.style.setProperty('height',`${height}px`,'important');
  };
  const paintGrid=()=>{
    document.querySelectorAll('#partsGrid .ag-row,#partsGrid .ag-row .ag-cell,#partsGrid .ag-row .ag-cell-value').forEach(element=>{
      element.style.removeProperty('background');
      element.style.removeProperty('background-color');
      element.style.removeProperty('box-shadow');
    });
    document.querySelectorAll('#partsGrid .ag-body,#partsGrid .ag-body-viewport,#partsGrid .ag-center-cols-viewport,#partsGrid .ag-center-cols-container,#partsGrid .ag-pinned-left-cols-viewport,#partsGrid .ag-pinned-left-cols-container,#partsGrid .ag-pinned-right-cols-viewport,#partsGrid .ag-pinned-right-cols-container').forEach(element=>{
      element.style.setProperty('background','#fff','important');
      element.style.setProperty('background-color','#fff','important');
      element.style.setProperty('background-image','none','important');
    });
    document.querySelectorAll('#partsGrid .ag-row,#partsGrid .ag-row .ag-cell,#partsGrid .ag-row .ag-cell-value').forEach(element=>{
      element.style.setProperty('background','#fff','important');
      element.style.setProperty('background-color','#fff','important');
      element.style.setProperty('background-image','none','important');
      element.style.setProperty('box-shadow','none','important');
    });
    document.querySelectorAll('#partsGrid .ag-header-cell-text').forEach(cell=>{
      cell.style.setProperty('color','#536b88','important');
      cell.style.setProperty('opacity','1','important');
      cell.style.setProperty('font-weight','700','important');
    });
    document.querySelectorAll('#partsGrid .ag-row .ag-cell:first-child,#partsGrid .ag-row .partNumber,#partsGrid .partNumber * ,#partsGrid .ag-cell[col-id="0"],#partsGrid .ag-cell[col-id="0"] *').forEach(cell=>{
      cell.style.setProperty('color','#203a5e','important');
      cell.style.setProperty('opacity','1','important');
      cell.style.setProperty('font-weight','600','important');
    });
    document.querySelectorAll('#partsGrid .ag-row-selected,#partsGrid .ag-row-focus,#partsGrid [aria-selected="true"]').forEach(row=>{
      row.style.setProperty('background','#f0f7ff','important');
      row.style.setProperty('background-color','#f0f7ff','important');
      row.style.setProperty('color','#173d62','important');
      row.querySelectorAll('.ag-cell,.ag-cell-value').forEach(cell=>{
        cell.style.setProperty('background','#f0f7ff','important');
        cell.style.setProperty('background-color','#f0f7ff','important');
        cell.style.setProperty('color','#173d62','important');
        cell.style.setProperty('opacity','1','important');
      });
    });
    document.querySelectorAll('#partsGrid .ag-row-hover').forEach(row=>{
      row.style.setProperty('background','#e6f2ff','important');
      row.style.setProperty('background-color','#e6f2ff','important');
      row.style.setProperty('box-shadow','none','important');
      row.querySelectorAll('.ag-cell,.ag-cell-value').forEach(cell=>{
        cell.style.setProperty('background','#e6f2ff','important');
        cell.style.setProperty('background-color','#e6f2ff','important');
        cell.style.setProperty('color','#203a5e','important');
      });
    });
    document.querySelectorAll('#partsGrid .ag-cell-focus').forEach(cell=>{
      cell.style.setProperty('background','#f0f7ff','important');
      cell.style.setProperty('background-color','#f0f7ff','important');
      cell.style.setProperty('color','#173d62','important');
      cell.style.setProperty('border-color','#cfe5f7','important');
      cell.style.setProperty('box-shadow','none','important');
      cell.style.setProperty('outline','0','important');
    });
  };
  new MutationObserver(keepLast).observe(head,{childList:true});
  const oncePerFrame=callback=>{let queued=false;return()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;callback()})}};
  const watchBody=()=>{
    if(!document.body){document.addEventListener('DOMContentLoaded',watchBody,{once:true});return}
    if(typeof partsGridApi!=='undefined')partsGridApi?.setGridOption?.('rowSelection',{mode:'singleRow',enableClickSelection:'enableDeselection'});
    const unplaced=document.querySelector('#unplaced'),grid=document.querySelector('#partsGrid'),modal=document.querySelector('.partsModal');
    if(unplaced)new MutationObserver(oncePerFrame(()=>{paintEmptyUnplaced();paintUnplaced()})).observe(unplaced,{childList:true,subtree:true});
    if(grid)new MutationObserver(oncePerFrame(()=>{paintGrid();fitModalGrid()})).observe(grid,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    if(modal)new MutationObserver(oncePerFrame(fitModalGrid)).observe(modal,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    paintEmptyUnplaced();paintUnplaced();paintGrid();fitModalGrid();
  };
  keepLast();
  watchBody();
})();
