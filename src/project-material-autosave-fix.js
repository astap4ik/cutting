(function(){
  const readProjects=()=>{try{return JSON.parse(localStorage.getItem('cuttingProjects')||'[]')}catch{return[]}};
  const saveCurrentMaterials=()=>{
    const projects=readProjects(),name=document.getElementById('projectName')?.value?.trim();
    if(!name)return;
    const project=projects.find(item=>item.name===name);
    if(!project)return;
    const names=[...document.querySelectorAll('#projectMaterials .projectMaterialCard [data-remove-material]')].map(item=>item.dataset.removeMaterial).filter(Boolean);
    const old=Array.isArray(project.materials)?project.materials:[],db=window.materialDbState?.db?.sheets||[];
    const record=name=>db.find(item=>item.name===name||item.shortName===name)||{};
    project.materials=names.map(name=>{const item=old.find(value=>(typeof value==='string'?value:value?.name)===name)||{},material=record(name);return {...item,name,length:Number(item.length)||Number(material.length)||2800,width:Number(item.width)||Number(material.width)||2070}});
    project.updated=new Date().toISOString();
    localStorage.setItem('cuttingProjects',JSON.stringify(projects));
  };
  let timer=0;
  const schedule=event=>{
    if(!event.target.closest?.('#projectName,#projectNote,[data-material-field],#projectQty'))return;
    clearTimeout(timer);
    timer=setTimeout(saveCurrentMaterials,350);
  };
  document.addEventListener('input',schedule);
  document.addEventListener('change',schedule);
})();
