let bestResult=null,bestKey='',searchRunning=false;
const controls=document.createElement('div');
controls.className='internalSearchState';
controls.hidden=true;
controls.innerHTML='<input id="milling" type="checkbox"><select id="kind" hidden><option value="guillotine">Прямолинейный раскрой</option><option value="sheet">Фрезерная обработка</option></select><input id="seed" type="number" value="1"><button id="improveBtn" type="button"></button><button id="stopBtn" type="button" disabled></button>';
document.querySelector('.settings').append(controls);
function updateTechnology(){ $('#kind').value=$('#milling').checked?'sheet':'guillotine'; }
function markCurrentResultStale(){
 if(!layouts.length&&!bestResult?.layouts?.length)return;
 document.querySelector('#layouts')?.classList.add('staleData');
 if(typeof window!=='undefined')window.offerRecalcPrompt?.();
}
$('#milling').onchange=()=>{activeDragCancel?.();updateTechnology();markCurrentResultStale();status.textContent='Технология изменена. Карта раскроя неактуальна — выполните расчёт повторно.'};updateTechnology();
const status=document.createElement('p');status.id='searchStatus';status.setAttribute('role','status');document.querySelector('.resultWorkspace')?.before(status);
let materialHintTimer;
const clearMissingMaterialHint=()=>{clearTimeout(materialHintTimer);materialHintTimer=null;document.querySelectorAll('.materialRequired').forEach(x=>x.classList.remove('materialRequired'));document.querySelector('.materialRequiredBalloon')?.remove()};
const showMissingMaterialHint=select=>{clearMissingMaterialHint();if(!select)return;select.classList.add('materialRequired');const balloon=document.createElement('div');balloon.className='materialRequiredBalloon';balloon.textContent='Выберите материал для таблицы';document.body.append(balloon);const r=select.getBoundingClientRect();balloon.style.left=`${Math.max(8,Math.min(window.innerWidth-balloon.offsetWidth-8,r.left))}px`;balloon.style.top=`${r.bottom+6}px`;materialHintTimer=setTimeout(clearMissingMaterialHint,5000)};
const materialHintStyle=document.createElement('style');materialHintStyle.textContent='.detailsTableMaterial.materialRequired{border:2px solid #d94b3f!important;background:#fff3f1!important;box-shadow:0 0 0 2px #d94b3f33!important}.materialRequiredBalloon{position:fixed;z-index:20000;padding:7px 10px;border:1px solid #d94b3f;border-radius:4px;background:#fff3f1;color:#a52e25;font-size:12px;line-height:1.25;box-shadow:0 4px 14px #0003;pointer-events:none}';document.head.append(materialHintStyle);document.addEventListener?.('change',e=>{if(e.target.closest?.('[data-table-material]'))clearMissingMaterialHint()});
let stopSearch=false;
$('#stopBtn').onclick=()=>{stopSearch=true};
$('#improveBtn').onclick=()=>calculate(true);
let layoutCache=[];
function savedLayouts(){return layoutCache}
async function refreshSavedLayouts(selected=''){layoutCache=await CuttingDB.migrate();let sel=$('#savedLayout');sel.innerHTML=layoutCache.map(x=>`<option value="${x.id}">${x.name} · seed ${x.seed}</option>`).join('');if(selected)sel.value=selected}
function currentOptions(){return {kerf:Number($('#kerf').value),margin:Number($('#margin').value),minWaste:Number($('#minWaste').value),kind:$('#milling').checked?'sheet':'guillotine',milling:$('#milling').checked,mode:$('#mode').value}}
function generateSeed(){const value=new Uint32Array(1);if(globalThis.crypto?.getRandomValues){globalThis.crypto.getRandomValues(value);return value[0]}return (Date.now()^Math.floor(Math.random()*4294967296))>>>0}
function resetCurrentResult(){verifiedResult=null;verifiedData=null;bestResult=null;bestKey='';layouts=[];unplacedBoardBounds=null;localStorage.removeItem('cutBest');if(typeof clearPlacementPreview==='function')clearPlacementPreview();document.querySelectorAll('.pieceNotice').forEach(x=>x.remove());$('#unplaced')?.classList.remove('unplacedCalculated');$('#layouts').innerHTML='<div class="empty">Формируется новая раскладка…</div>';$('#unplacedBoard').innerHTML='';$('#unplacedList').innerHTML=''}
function addLayoutControls(){controls.insertAdjacentHTML('beforeend','<hr><label>Название раскладки<input id="layoutName" value="Раскладка"></label><button id="saveLayoutBtn" class="secondary">Сохранить текущую раскладку</button><label>Сохранённые раскладки<select id="savedLayout"></select></label><button id="loadLayoutBtn" class="secondary">Загрузить выбранную</button><button id="deleteLayoutBtn" class="secondary">Удалить выбранную</button>');$('#saveLayoutBtn').onclick=async()=>{if(!bestResult){status.textContent='Сначала выполните расчёт';return}sync();let id=Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7),name=$('#layoutName').value.trim()||'Раскладка',item={id,name,created:new Date().toISOString(),seed:bestResult.seed,data:{sheets:structuredClone(sheets),parts:structuredClone(parts)},options:currentOptions(),result:structuredClone(bestResult)};await CuttingDB.put(item);await refreshSavedLayouts(id);status.textContent=`Раскладка «${name}» сохранена в локальной базе вместе с деталями, настройками и seed ${bestResult.seed}.`};$('#loadLayoutBtn').onclick=async()=>{let item=savedLayouts().find(x=>x.id===$('#savedLayout').value);if(!item)return;load(item.data);$('#kerf').value=item.options.kerf;$('#margin').value=item.options.margin;$('#minWaste').value=item.options.minWaste;$('#milling').checked=item.options.milling===true;updateTechnology();$('#mode').value=item.options.mode;$('#seed').value=item.seed;bestResult=structuredClone(item.result);bestResult.manual=false;bestKey=JSON.stringify({sheets,parts,o:currentOptions()});try{CuttingOptimizer.validate(bestResult,CuttingOptimizer.prepare(sheets,parts,currentOptions()),currentOptions())}catch(e){resetCurrentResult();status.textContent='Данные загружены. Требуется новый расчёт: '+e.message;return}layouts=bestResult.all.filter(s=>s.placed.length);bestResult.layouts=layouts;render(bestResult.all,bestResult.unplaced);status.textContent='Загружена раскладка «'+item.name+'», seed '+item.seed+'.';};$('#deleteLayoutBtn').onclick=async()=>{let id=$('#savedLayout').value;if(!id)return;await CuttingDB.remove(id);await refreshSavedLayouts();status.textContent='Сохранённая раскладка удалена из локальной базы.'}}
addLayoutControls();
async function calculate(improve=false){
 if(searchRunning)return;
 sync();
 const missingSheet=sheets.some(x=>!String(x.material||'').trim()),missingPart=parts.some(x=>!String(x.material||'').trim());
 const detailTables=globalThis.getDetailsTablesSnapshot?.()||[];
 const missingTable=detailTables.find(x=>!String(x.material||'').trim());
 const missingField=[...document.querySelectorAll('[data-table-material]')].find(x=>!String(x.value||'').trim());
 if(missingSheet||missingPart||missingTable||missingField){const field=missingField|| (missingTable?document.querySelector(`[data-table-material="${CSS.escape(missingTable.id)}"]`):null);showMissingMaterialHint(field);status.textContent=missingSheet?'Выберите материал для каждого листа перед расчётом.':missingPart?'Выберите материал для каждой детали перед расчётом.':'Выберите материал для таблицы деталей.';return}
 const o=currentOptions();
 const key=JSON.stringify({sheets,parts,o});
 let seed=Number($('#seed').value);
 if(improve===false){resetCurrentResult();seed=generateSeed();$('#seed').value=seed}else{if(!Number.isInteger(seed)||seed<0||seed>4294967295){status.textContent='Введите целый seed от 0 до 4294967295';return}seed=(seed+104729)>>>0;$('#seed').value=seed}
 if(!Number.isInteger(seed)||seed<0||seed>4294967295){status.textContent='Введите целый seed от 0 до 4294967295';return}
 let data;
 try{data=CuttingOptimizer.prepare(sheets,parts,o)}catch(e){status.textContent=e.message;return}
 let previous=null;if(bestKey===key&&bestResult&&!bestResult.manual){try{CuttingOptimizer.validate(bestResult,data,o);previous=bestResult}catch{previous=null}}
 const searchVariants=({fast:100,standard:1000,best:3000})[o.mode]||1000;
 let best=previous,count=searchVariants,completed=0;
 searchRunning=true;stopSearch=false;
 $('#calcBtn').disabled=$('#improveBtn').disabled=true;$('#stopBtn').disabled=false;
 // Snapshot inputs and prevent changes while the snapshot is being calculated.
 const inputs=[...document.querySelectorAll('main input,main select,.toolbar button,#demoBtn')];
 inputs.forEach(el=>el.disabled=true);
 try{
  for(let t=0;t<count&&!stopSearch;t++){
   const r=CuttingOptimizer.attempt(data,o,t,seed,best);
   if(!best||CuttingOptimizer.less(r.score,best.score))best=r;
   completed++;
   status.textContent=`Проверено вариантов: ${completed}/${count}`;
   if(t%3===0)await new Promise(resolve=>setTimeout(resolve,0));
  }
  if(best){
   CuttingOptimizer.validate(best,data,o);
   bestResult=best;bestKey=key;layouts=best.layouts;render(best.all,best.unplaced);
   status.textContent='';
   localStorage.cutBest=JSON.stringify({key,result:best});if(typeof window!=='undefined'&&typeof window.projectCalculationFinished==='function')window.projectCalculationFinished(best.unplaced.length===0);
  }
 }catch(e){status.textContent='Расчёт не завершён: '+e.message}
 finally{searchRunning=false;inputs.forEach(el=>el.disabled=false);$('#calcBtn').disabled=$('#improveBtn').disabled=false;$('#stopBtn').disabled=true}
}

$('#calcBtn').onclick=()=>calculate();

/* Recheck manual edits against the original parts and the selected technology.
   Keep an independent snapshot so an invalid move can be rolled back atomically. */
const renderLayout=render;
let verifiedResult=null,verifiedData=null;
render=function(all,un){
 if(!bestResult)return renderLayout(all,un);
 const o=currentOptions();
 try{
  const data=bestResult.manual&&verifiedData?verifiedData:CuttingOptimizer.prepare(sheets,parts,o);
  CuttingOptimizer.validate(bestResult,data,o);
  for(const sheet of bestResult.all)sheet.cuts=CuttingOptimizer.isSaw(o)?CuttingOptimizer.sawPlan(sheet,o):[];
  verifiedData=data;verifiedResult=structuredClone(bestResult);
 }catch(error){
  if(!verifiedResult){status.textContent=error.message;return}
  bestResult=structuredClone(verifiedResult);layouts=bestResult.all.filter(s=>s.placed.length);bestResult.layouts=layouts;
  all=bestResult.all;un=bestResult.unplaced;
  const message='Изменение отменено: '+error.message;
  status.textContent=message;setTimeout(()=>{status.textContent=message},0);
 }
 renderLayout(all,un);
 document.querySelectorAll('.layout').forEach((el,i)=>{
  const sheet=layouts[i];if(!sheet.cuts?.length)return;
  const details=document.createElement('details'),summary=document.createElement('summary'),list=document.createElement('ol');
  summary.textContent='Порядок резов (после обрезки края)';details.append(summary,list);
  for(const c of sheet.cuts){const li=document.createElement('li');li.textContent=c.axis+' = '+c.position.toFixed(1)+' мм, от '+c.from.toFixed(1)+' до '+c.to.toFixed(1)+' мм';list.append(li)}
  el.append(details);
 });
};

// Режим оптимизации (#mode) и технология раскроя — разные настройки.
const calculationMode=document.querySelector('#kind'),legacyMilling=document.querySelector('#milling');
document.querySelectorAll('.topNav a').forEach(link=>{if(link.textContent.trim()==='Оптимизация')link.remove()});
const optimizationMode=document.querySelector('#mode');
if(optimizationMode){
 optimizationMode.value='best';
}
if(calculationMode&&legacyMilling){
 const modeChecks=document.createElement('div');
 modeChecks.className='calculationModeChecks';
 const modeTitle=document.createElement('h4');
 modeTitle.className='calculationModeTitle';
 modeTitle.textContent='Режим раскроя';
 modeChecks.innerHTML='<label>Гильотинный раскрой (Guillotine Cut)<input type="checkbox" data-calculation-mode="guillotine" checked></label><label>Свободная укладка (Nesting)<input type="checkbox" data-calculation-mode="nesting"></label>';
 optimizationMode?.closest('label')?.after(modeTitle,modeChecks);
 const syncModeChecks=()=>modeChecks.querySelectorAll('input').forEach(input=>{input.checked=input.dataset.calculationMode===calculationMode.value});
 modeChecks.addEventListener('change',event=>{
  const input=event.target.closest('input[data-calculation-mode]');
  if(!input)return;
  calculationMode.value=input.dataset.calculationMode;
  calculationMode.dispatchEvent(new Event('change',{bubbles:false}));
  syncModeChecks();
 });
 syncModeChecks();
 const modeChecksStyle=document.createElement('style');
 modeChecksStyle.textContent='.calculationModeChecks{display:flex;flex-direction:column;gap:10px;margin:4px 0 10px}.calculationModeChecks label{display:flex;align-items:center;gap:8px;cursor:pointer}.calculationModeChecks input{margin:0;width:16px;height:16px;accent-color:#2c9c69}';
 document.head.append(modeChecksStyle);
 const settingsModeStyle=document.createElement('style');
 settingsModeStyle.textContent='#sidebarRoot>#settingsPanel>label:not([hidden]){display:grid;grid-template-columns:minmax(0,250px) 60px;justify-content:end;align-items:center;column-gap:28px;text-align:right;margin:0 14px;font-size:13px;line-height:1.25;color:#263943;white-space:normal;overflow-wrap:break-word}#sidebarRoot>#settingsPanel>label:not([hidden]) input,#sidebarRoot>#settingsPanel>label:not([hidden]) select{width:60px;margin:0;text-align:left}.calculationModeChecks{gap:14px;margin:6px 14px 12px}.calculationModeChecks label{display:grid;grid-template-columns:minmax(0,250px) 40px;justify-content:end;align-items:center;column-gap:28px;text-align:right;font-size:13px;line-height:1.25;color:#263943;white-space:normal;overflow-wrap:break-word}.calculationModeChecks input{appearance:none;width:40px;height:20px;margin:0;border:0;border-radius:999px;background:#c9ccce;box-shadow:none;cursor:pointer;position:relative;background-image:radial-gradient(circle at 10px 10px,#fff 0 8px,transparent 8.5px)}.calculationModeChecks input:checked{background-color:#2c9c69;background-position:20px 0}';
 document.head.append(settingsModeStyle);
}
