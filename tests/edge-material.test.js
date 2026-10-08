const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const source=fs.readFileSync(path.join(__dirname,'../src/edge-column.js'),'utf8');
const marker='  if(!window.agGrid?.createGrid)return;';
assert.ok(source.includes(marker));
assert.ok(source.includes("new Option('По-умолчанию','')"));
assert.ok(source.includes('edgeMaterialValue'));
assert.ok(source.includes('customMaterial'));
assert.ok(!source.includes("new Option('Без кромки'"));
assert.ok(!source.includes("side.enabled=e.target.value"));
assert.ok(source.includes("dataset.side=selectedSide||''"));
assert.ok(source.includes("const sideKey=e.target.dataset.side"));
assert.ok(source.includes("select.dataset.side=selectedSide"));
assert.ok(source.includes("side.addEventListener('click'"));
assert.ok(source.includes("materialSelect.addEventListener('input',applyMaterial)"));
const tr={dataset:{gridId:'part-1'},_edgeBanding:null,querySelector:()=>input};
const input={value:''};
const context={
  document:{querySelector:()=>({}),querySelectorAll:()=>[tr],getElementById:()=>null},
  window:{materialDbState:{db:{edges:[{name:'Кромка Б'},{name:'Кромка А'},{name:'Кромка А'}]}},getProjectSnapshot:()=>({materials:[{name:'ЛДСП',edge:'Кромка А'}]})},
  sync:()=>{},
};
vm.runInNewContext(source.replace(marker,'  window.__edgeTest={defaultEdge,edgeNames,editSide,setSide,setCurrent:p=>current=p};'+marker),context);
const api=context.window.__edgeTest;
let refreshed=0;
const params={data:{_gridId:'part-1',material:'ЛДСП',edgeBanding:{top:{enabled:true},right:{enabled:true,material:'Кромка А'},bottom:{enabled:false}}},node:{},api:{refreshCells:()=>refreshed++}};
api.setCurrent(params);
assert.equal(api.defaultEdge(),'Кромка А');
assert.deepEqual([...api.edgeNames()],['Кромка А','Кромка Б']);
api.editSide('top',side=>{side.enabled=true;side.material='Кромка Б'});
assert.equal(params.data.edgeBanding.top.material,'Кромка Б');
assert.equal(params.data.edgeBanding.right.material,'Кромка А');
assert.equal(params.data.edgeBanding.bottom.enabled,false);
assert.equal(JSON.parse(input.value).top.material,'Кромка Б');
api.setSide(params.data.edgeBanding,'top',false);
assert.equal(params.data.edgeBanding.top.enabled,false);
assert.equal('material' in params.data.edgeBanding.top,false);
api.editSide('top',side=>{side.material='Новая кромка'});
assert.equal(params.data.edgeBanding.top.material,'Новая кромка');
api.setSide(params.data.edgeBanding,'top',true);
assert.equal(params.data.edgeBanding.top.enabled,true);
assert.equal(params.data.edgeBanding.top.material,'Новая кромка');
assert.equal(refreshed,2);
console.log('edge-material: OK');
