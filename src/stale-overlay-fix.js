/* Keep the stale-layout notice visible above the sheet theme overlay. */
(function(){
  const style=document.createElement('style');
  style.textContent=`html body #layouts.staleData .sheet{container-type:inline-size!important}
html body #layouts.staleData .sheet::after{content:'Неактуальная карта раскроя'!important;position:absolute!important;inset:auto!important;left:50%!important;top:50%!important;z-index:30!important;display:block!important;width:max-content!important;max-width:90%!important;box-sizing:border-box!important;transform:translate(-50%,-50%) rotate(-28deg)!important;padding:clamp(4px,1.2cqw,10px) clamp(8px,2.8cqw,22px)!important;color:rgba(166,48,35,.78)!important;font-size:clamp(12px,4cqw,28px)!important;font-weight:700!important;line-height:1.1!important;white-space:nowrap!important;text-align:center!important;pointer-events:none!important;border:2px solid rgba(166,48,35,.45)!important;background:rgba(255,255,255,.2)!important;opacity:1!important}`;
  document.head.append(style);
})();
