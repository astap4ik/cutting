/* Keep the empty area of the details modal grid on the light surface. */
(function(){
  const style=document.createElement('style');
  style.textContent=`html body .partsModalBody #partsGrid,
html body .partsModalBody #partsGrid .ag-root-wrapper,
html body .partsModalBody #partsGrid .ag-root,
html body .partsModalBody #partsGrid .ag-body,
html body .partsModalBody #partsGrid .ag-body-viewport,
html body .partsModalBody #partsGrid .ag-center-cols-viewport,
html body .partsModalBody #partsGrid .ag-center-cols-clipper,
html body .partsModalBody #partsGrid .ag-body-container,
html body .partsModalBody #partsGrid .ag-viewport,
html body .partsModalBody #partsGrid .ag-center-cols-container,
html body .partsModalBody #partsGrid .ag-pinned-left-cols-container,
html body .partsModalBody #partsGrid .ag-pinned-right-cols-container{background:#fff!important;background-color:#fff!important;background-image:none!important;color:#203a5e!important}`;
  document.head.append(style);
})();
