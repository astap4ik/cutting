(function(){
  function rows(){return [...document.querySelectorAll('#parts tbody tr')]}
  function offerRecalc(){window.offerRecalcPrompt?.()}
  function add(copy,sourceTr){
    let btn=document.querySelector('#addPart');if(!btn)return;
    btn.click();
    setTimeout(()=>{let tr=rows().at(-1);if(!tr)return;if(copy){Object.entries(copy).forEach(([k,v])=>{let i=tr.querySelector(`[data-k="${k}"]`);if(i)i.value=v})}else{let material=sourceTr?.querySelector('[data-k="material"]')?.value||rows().at(-2)?.querySelector('[data-k="material"]')?.value||'';let m=tr.querySelector('[data-k="material"]'),length=tr.querySelector('[data-k="length"]'),width=tr.querySelector('[data-k="width"]'),qty=tr.querySelector('[data-k="qty"]');if(m)m.value=material;if(length)length.value='';if(width)width.value='';if(qty)qty.value=''}if(typeof sync==='function')sync();offerRecalc()},0);
  }
  function menu(x,y,tr){
    document.querySelector('.rowMenu')?.remove();let m=document.createElement('div');m.className='rowMenu';m.style.left=x+'px';m.style.top=y+'px';m.innerHTML='<button data-action="below">＋ Добавить строку ниже</button><button data-action="duplicate">⧉ Дублировать строку</button><button data-action="delete">× Удалить строку</button><button data-action="expand">↗ Развернуть детали</button>';document.body.append(m);
    m.onclick=e=>{let a=e.target.closest('button');if(!a)return;if(a.dataset.action==='below')add(null,tr);else if(a.dataset.action==='delete')tr.querySelector('.del')?.click();else if(a.dataset.action==='expand')document.querySelector('[aria-label="Развернуть детали в отдельной форме"]')?.click();else{let copy=Object.fromEntries([...tr.querySelectorAll('[data-k]')].map(i=>[i.dataset.k,i.value]));add(copy,tr)}m.remove()};setTimeout(()=>document.addEventListener('click',()=>m.remove(),{once:true}),0)
  }
  function init(){let host=document.querySelector('#partsGrid');if(!host)return;host.addEventListener('contextmenu',e=>{let cell=e.target.closest('.ag-cell'),r=e.target.closest('.ag-row');if(!cell||!r)return;e.preventDefault();let idx=+r.getAttribute('row-index'),tr=rows()[idx];if(tr)menu(e.clientX,e.clientY,tr)});host.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!=='Tab')return;let r=e.target.closest('.ag-row'),cell=e.target.closest('.ag-cell');if(!r||!cell)return;let last=+r.getAttribute('row-index')===host.querySelectorAll('.ag-row').length-1;if(last&&cell.getAttribute('col-id')!=='edgeBanding'&&((e.key==='Enter')||(e.key==='Tab'&&cell===r.querySelector('.ag-cell:last-child')))){e.preventDefault();add();setTimeout(()=>document.querySelector('#partsGrid .ag-row:last-child .ag-cell')?.click(),0)}})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else setTimeout(init,0);
})();
