(function(){
  const materials=document.getElementById('projectMaterials'),menu=document.getElementById('projectMaterialMenu');
  if(!materials||!menu)return;
  const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch{return fallback}};
  const db=()=>read('cuttingMaterialDb',{sheets:[]});
  document.addEventListener('click',event=>{
    const picker=event.target.closest('.projectMaterialPicker[data-group-index]');
    if(!picker)return;
    const title=picker.querySelector('.projectMaterialInfo strong'),fullName=picker.querySelector('[data-remove-material]')?.dataset.removeMaterial||'',projects=read('cuttingProjects',[]),projectName=document.getElementById('projectName')?.value?.trim(),project=projects.find(x=>x.name===projectName)||projects[0];
    menu._targetPicker=picker;
    menu.dataset.targetMaterial=fullName||(title&&title.textContent!=='Выберите материал…'?title.textContent.trim():'');
    menu.dataset.materialSnapshot=JSON.stringify(project?.materials||[]);
  },true);
  menu.addEventListener('click',event=>{
    const option=event.target.closest('[data-material-value]');
    if(!option)return;
    event.preventDefault();event.stopImmediatePropagation();
    const projects=read('cuttingProjects',[]),projectName=document.getElementById('projectName')?.value?.trim()||'Новый проект';
    let project=projects.find(x=>x.name===projectName)||projects[0];
    if(!project){project={id:`project-${Date.now().toString(36)}`,name:projectName,note:'',materials:[],edges:[],status:'draft',updatedAt:new Date().toISOString()};projects.unshift(project)}
    const before=readSnapshot(menu.dataset.materialSnapshot,project.materials||[]),target=menu.dataset.targetMaterial||'',name=option.dataset.materialValue;
    let item=target?before.find(x=>(typeof x==='string'?x:x?.name)===target):null;
    if(item){item=typeof item==='string'?{name:item}:item;item.name=name}else{item={name};before.push(item)}
    const record=(db().sheets||[]).find(x=>x.name===name)||{};item.length=Number(record.length)||Number(item.length)||2800;item.width=Number(record.width)||Number(item.width)||2070;item.qty=Number(item.qty)||1;
    project.materials=before;project.updated=new Date().toISOString();localStorage.setItem('cuttingProjects',JSON.stringify(projects));
    const picker=menu._targetPicker,groupIndex=picker?.dataset.groupIndex,targets=[...document.querySelectorAll(`.projectMaterialPicker[data-group-index="${groupIndex}"]`)];
    const size=[record.length&&record.width?`${record.length}×${record.width}${record.thickness?`×${record.thickness}`:''} мм`:'' ,record.supplier||record.brand].filter(Boolean).join(', ');
    targets.forEach(target=>{const card=target.querySelector('.projectMaterialInfo'),thumb=target.querySelector('.projectMaterialThumb');if(card){const strong=card.querySelector('strong');if(strong)strong.textContent=name;const small=card.querySelector('small');if(small)small.textContent=size;else if(size){const text=document.createElement('small');text.textContent=size;card.append(text)}}if(thumb){thumb.classList.toggle('isEmpty',!record.imageUrl);if(record.imageUrl)thumb.style.backgroundImage=`url('${String(record.imageUrl).replace(/'/g,'%27')}')`;else thumb.style.backgroundImage=''}});
    picker?.closest('.projectMaterialRow')?.classList.add('active');
    document.querySelectorAll('#activeMaterialFields [data-material-name]').forEach(x=>x.dataset.materialName=name);
    menu.hidden=true;
    window.dispatchEvent(new CustomEvent('projectMaterialsChanged'));
  },true);
  function readSnapshot(value,fallback){try{return JSON.parse(value||'')}catch{return JSON.parse(JSON.stringify(fallback))}}
})();
