let bestResult=null,bestKey='',searchRunning=false;
const controls=document.createElement('div');
controls.className='searchControls';
controls.innerHTML='<div class="kindPicker"><button type="button" id="kindHelp" class="helpButton" aria-label="Расшифровка типа раскроя" title="Расшифровка типа раскроя">?</button><label>Тип раскроя<select id="kind"><option value="sheet">Листы — MaxRects</option><option value="guillotine">Листы — прямые сквозные резы</option><option value="roll">Рулон — минимум занятой длины</option></select></label></div><small>Для рулона: «Длина» листа — поперечный размер, «Ширина» — доступная длина вдоль рулона.</small><label>Номер поиска (seed)<input id="seed" type="number" min="0" max="4294967295" value="1" step="1"></label><button id="improveBtn">Найти лучше</button><button id="stopBtn" class="secondary" disabled>Остановить поиск</button><dialog id="kindHelpDialog"><h3>Тип раскроя</h3><p id="kindHelpText" class="kindHelpText"></p><form method="dialog"><button type="submit" class="secondary">Закрыть</button></form></dialog>';
document.querySelector('.settings').append(controls);
const kindDescriptions={sheet:'MaxRects — размещает детали в свободных прямоугольных областях листа и обычно даёт наиболее плотную раскладку.',guillotine:'Прямые сквозные резы — строит раскладку последовательным делением областей. Подходит, если оборудование выполняет только прямые резы через весь лист.',roll:'Рулон — минимизирует занятую длину материала. «Длина» листа задаёт поперечный размер, «Ширина» — доступную длину вдоль рулона.'};const updateKindHelp=()=>{$('#kindHelpText').textContent=kindDescriptions[$('#kind').value]||''};$('#kindHelp').onclick=()=>{$('#kindHelpDialog').showModal()};$('#kind').onchange=updateKindHelp;updateKindHelp();
const status=document.createElement('p');status.id='searchStatus';status.setAttribute('role','status');document.querySelector('.resultHead').after(status);
let stopSearch=false;
$('#stopBtn').onclick=()=>{stopSearch=true};
$('#improveBtn').onclick=()=>calculate(true);
let layoutCache=[];
function savedLayouts(){return layoutCache}
async function refreshSavedLayouts(selected=''){layoutCache=await CuttingDB.migrate();let sel=$('#savedLayout');sel.innerHTML=layoutCache.map(x=>`<option value="${x.id}">${x.name} · seed ${x.seed}</option>`).join('');if(selected)sel.value=selected}
function currentOptions(){return {kerf:Number($('#kerf').value),margin:Number($('#margin').value),minWaste:Number($('#minWaste').value),kind:$('#kind').value,mode:$('#mode').value}}
function generateSeed(){const value=new Uint32Array(1);if(globalThis.crypto?.getRandomValues){globalThis.crypto.getRandomValues(value);return value[0]}return (Date.now()^Math.floor(Math.random()*4294967296))>>>0}
function resetCurrentResult(){bestResult=null;bestKey='';layouts=[];localStorage.removeItem('cutBest');if(typeof clearPlacementPreview==='function')clearPlacementPreview();document.querySelectorAll('.pieceNotice').forEach(x=>x.remove());$('#stats').textContent='Формируется новая раскладка…';$('#layouts').innerHTML='<div class="empty">Формируется новая раскладка…</div>';$('#unplacedBoard').innerHTML='';$('#unplacedList').innerHTML=''}
function addLayoutControls(){controls.insertAdjacentHTML('beforeend','<hr><label>Название раскладки<input id="layoutName" value="Раскладка"></label><button id="saveLayoutBtn" class="secondary">Сохранить текущую раскладку</button><label>Сохранённые раскладки<select id="savedLayout"></select></label><button id="loadLayoutBtn" class="secondary">Загрузить выбранную</button><button id="deleteLayoutBtn" class="secondary">Удалить выбранную</button>');$('#saveLayoutBtn').onclick=async()=>{if(!bestResult){status.textContent='Сначала выполните расчёт';return}sync();let id=Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7),name=$('#layoutName').value.trim()||'Раскладка',item={id,name,created:new Date().toISOString(),seed:bestResult.seed,data:{sheets:structuredClone(sheets),parts:structuredClone(parts)},options:currentOptions(),result:structuredClone(bestResult)};await CuttingDB.put(item);await refreshSavedLayouts(id);status.textContent=`Раскладка «${name}» сохранена в локальной базе вместе с деталями, настройками и seed ${bestResult.seed}.`};$('#loadLayoutBtn').onclick=async()=>{let item=savedLayouts().find(x=>x.id===$('#savedLayout').value);if(!item)return;load(item.data);$('#kerf').value=item.options.kerf;$('#margin').value=item.options.margin;$('#minWaste').value=item.options.minWaste;$('#kind').value=item.options.kind;$('#mode').value=item.options.mode;$('#seed').value=item.seed;bestResult=item.result;bestKey=JSON.stringify({sheets,parts,itemOptions:item.options});layouts=bestResult.layouts;render(bestResult.all,bestResult.unplaced);status.textContent=`Загружена раскладка «${item.name}», seed ${item.seed}.`};$('#deleteLayoutBtn').onclick=async()=>{let id=$('#savedLayout').value;if(!id)return;await CuttingDB.remove(id);await refreshSavedLayouts();status.textContent='Сохранённая раскладка удалена из локальной базы.'}}
addLayoutControls();
async function calculate(improve=false){
 if(searchRunning)return;
 sync();
 const o={kerf:Number($('#kerf').value),margin:Number($('#margin').value),minWaste:Number($('#minWaste').value),kind:$('#kind').value,mode:$('#mode').value};
 const key=JSON.stringify({sheets,parts,o});
 let seed=Number($('#seed').value);
 if(improve===false){resetCurrentResult();seed=generateSeed();$('#seed').value=seed}else{if(!Number.isInteger(seed)||seed<0||seed>4294967295){status.textContent='Введите целый seed от 0 до 4294967295';return}seed=(seed+104729)>>>0;$('#seed').value=seed}
 if(!Number.isInteger(seed)||seed<0||seed>4294967295){status.textContent='Введите целый seed от 0 до 4294967295';return}
 let data;
 try{data=CuttingOptimizer.prepare(sheets,parts,o)}catch(e){status.textContent=e.message;return}
 let previous=null;if(bestKey===key&&bestResult){try{CuttingOptimizer.validate(bestResult,data,o);previous=bestResult}catch{previous=null}}
 const searchVariants=1000;
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
   $('#stats').textContent=`Листов: ${layouts.length} · Размещено: ${data.items.length-best.unplaced.length} · Не размещено: ${best.unplaced.length} · Расход: ${(best.area/1e6).toFixed(3)} м² · Использование: ${best.area?(100*best.used/best.area).toFixed(1):0}%`;
   status.textContent=`${stopSearch?'Поиск остановлен. ':''}Проверено ${completed} вариантов. ${previous?(CuttingOptimizer.less(best.score,previous.score)?'Найден лучший результат.':'Сохранён предыдущий лучший результат.'):'Лучший результат выбран.'} Seed: ${best.seed}, попытка: ${best.attempt+1}.`;
   if(previous)status.textContent+=` Неразмещено: ${previous.unplaced.length} → ${best.unplaced.length}; расход: ${(previous.area/1e6).toFixed(3)} → ${(best.area/1e6).toFixed(3)} м².`;
   document.querySelectorAll('.layout').forEach((el,i)=>{
    const s=layouts[i],note=document.createElement('p');
    note.textContent=o.kind==='roll'?`Занято вдоль рулона: ${s.usedLength.toFixed(1)} мм; остаток до конца: ${(s.width-s.usedLength).toFixed(1)} мм`:`Крупнейший прямоугольный остаток: ${(s.largestOffcut/1e6).toFixed(3)} м²`;
    el.append(note);
    if(s.cuts.length){const details=document.createElement('details'),summary=document.createElement('summary'),list=document.createElement('ol');summary.textContent='Порядок резов';details.append(summary,list);s.cuts.forEach(c=>{const li=document.createElement('li');li.textContent=`${c.axis} = ${c.position.toFixed(1)} мм, от ${c.from.toFixed(1)} до ${c.to.toFixed(1)} мм`;list.append(li)});el.append(details)}
   });
   localStorage.cutBest=JSON.stringify({key,result:best});
  }
 }catch(e){status.textContent='Расчёт не завершён: '+e.message}
 finally{searchRunning=false;inputs.forEach(el=>el.disabled=false);$('#calcBtn').disabled=$('#improveBtn').disabled=false;$('#stopBtn').disabled=true}
}
try{const saved=JSON.parse(localStorage.cutBest);if(saved){bestKey=saved.key;bestResult=saved.result}}catch{}
$('#calcBtn').onclick=()=>calculate();
