(function(){
  const style=document.createElement('style');
  style.textContent=`
    html body header{height:62px!important;background:#fff!important;border-bottom:1px solid #e6edf5!important;box-shadow:0 1px 8px rgba(32,70,112,.05)!important}
    html body main>#projectTopbar{top:0!important;height:58px!important;padding:0 20px!important;background:#fff!important;border-bottom:1px solid #e6edf5!important;box-shadow:0 2px 8px rgba(32,70,112,.05)!important;color:#142b4d!important}
    html body main>#projectTopbar .projectTopbarMeta{gap:3px!important;min-width:0!important}
    html body main>#projectTopbar .projectTopbarMeta strong{font-size:15px!important;line-height:1.1!important;font-weight:700!important;color:#142b4d!important}
    html body main>#projectTopbar .projectTopbarMeta span{font-size:10px!important;line-height:1.1!important;color:#71829a!important}
    html body main>#projectTopbar .projectTopbarActions{gap:6px!important}
    html body main>#projectTopbar .projectTopbarActions button{height:34px!important;border:1px solid #dce6f0!important;border-radius:5px!important;background:#fff!important;color:#244064!important;font-size:11px!important}
    html body main>#projectTopbar .projectTopbarActions .primary{height:34px!important;min-width:174px!important;background:#ff8a26!important;border-color:#ff8a26!important;color:#fff!important;box-shadow:0 4px 10px rgba(255,138,38,.18)!important}
    html body main>#projectTopbar .projectTopbarActions #topbarMenuBtn{width:38px!important;padding:0!important;font-size:15px!important}
    html body main>#sidebarRoot{top:66px!important}
    html body main>.result{top:66px!important;padding-top:12px!important}
    html body main>.result .resultToolbar{height:42px!important;min-height:42px!important;padding:0 18px!important;margin:0 0 10px!important;background:transparent!important;border-bottom:1px solid #e2eaf3!important}
  `;
  document.head.append(style);
})();
