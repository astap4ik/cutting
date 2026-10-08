(function(){
  const init=()=>{
    const buttonStyle=document.createElement('style');
    buttonStyle.textContent='#settingsBtn{display:none!important}.textureSetting,.systemInfoSetting,.cutOrderSetting{display:grid!important;grid-template-columns:minmax(0,250px) 40px!important;justify-content:end!important;align-items:center!important;column-gap:28px!important;margin:0 14px!important;text-align:right!important;font-size:13px!important;line-height:1.25!important;color:#263943!important;white-space:normal!important;overflow-wrap:break-word!important}.textureSetting input,.systemInfoSetting input,.cutOrderSetting input{appearance:none!important;width:40px!important;height:20px!important;margin:0!important;border:0!important;border-radius:999px!important;background:#c9ccce!important;box-shadow:none!important;cursor:pointer!important;position:relative!important;background-image:radial-gradient(circle at 10px 10px,#fff 0 8px,transparent 8.5px)!important}.textureSetting input:checked,.systemInfoSetting input:checked,.cutOrderSetting input:checked{background-color:#2c9c69!important;background-position:20px 0!important}body:not(.showSystemInfo) #searchStatus,body:not(.showSystemInfo) .pieceNotice,body:not(.showSystemInfo) #staleDataToast{display:none!important}body:not(.showCutOrder) #layouts details{display:none!important}';
    document.head.append(buttonStyle);
    const settings=document.querySelector('#settingsPanel');
    if(!settings)return;
    const existing=document.querySelector('#showMaterialTextures')?.closest('label');
    if(existing){existing.classList.add('textureSetting');settings.querySelector('.settingsHead')?.after(existing)}else{
      const label=document.createElement('label');
      label.className='textureSetting';
      label.innerHTML='Показывать текстуры материалов в раскрое<input id="showMaterialTextures" type="checkbox">';
      const input=label.querySelector('input');
      input.checked=localStorage.getItem('cuttingShowMaterialTextures')==='true';
      settings.querySelector('.settingsHead')?.after(label);
      input.addEventListener('change',e=>{
        localStorage.setItem('cuttingShowMaterialTextures',String(e.target.checked));
        window.applySheetTextures?.();
      });
    }
    if(!document.querySelector('#showSystemInfo')){
      const label=document.createElement('label');
      label.className='systemInfoSetting textureSetting';
      label.innerHTML='Показывать служебную информацию<input id="showSystemInfo" type="checkbox">';
      const input=label.querySelector('input');
      input.checked=localStorage.getItem('cuttingShowSystemInfo')==='true';
      const textureLabel=document.querySelector('#showMaterialTextures')?.closest('label');
      (textureLabel||settings.querySelector('.settingsHead'))?.after(label);
      const apply=()=>document.body.classList.toggle('showSystemInfo',input.checked);
      input.addEventListener('change',()=>{
        localStorage.setItem('cuttingShowSystemInfo',String(input.checked));
        apply();
      });
      apply();
    }
    if(!document.querySelector('#showCutOrder')){
      const label=document.createElement('label');
      label.className='cutOrderSetting textureSetting';
      label.innerHTML='Показывать порядок резов<input id="showCutOrder" type="checkbox">';
      const input=label.querySelector('input');
      input.checked=localStorage.getItem('cuttingShowCutOrder')==='true';
      const infoLabel=document.querySelector('#showSystemInfo')?.closest('label');
      const textureLabel=document.querySelector('#showMaterialTextures')?.closest('label');
      (infoLabel||textureLabel||settings.querySelector('.settingsHead'))?.after(label);
      const apply=()=>document.body.classList.toggle('showCutOrder',input.checked);
      input.addEventListener('change',()=>{
        localStorage.setItem('cuttingShowCutOrder',String(input.checked));
        apply();
      });
      apply();
    }
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0),{once:true});else setTimeout(init,0);
})();
(function(){const init=()=>{const label=document.querySelector('#showRemaindersOnMap')?.closest('label');if(!label)return;label.classList.add('textureSetting');label.classList.remove('sectionBodyHidden');label.hidden=false;label.removeAttribute('hidden');label.style.setProperty('display','grid','important');document.querySelector('#settingsPanel .settingsHead')?.after(label)};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0),{once:true});else setTimeout(init,0)})();
