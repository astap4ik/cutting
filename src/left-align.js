(() => {
  const apply = () => {
    const root = document.querySelector('#sidebarRoot');
    const result = document.querySelector('main > .result');
    if (!root || !result) return;
    root.style.setProperty('left', '0px', 'important');
    result.style.setProperty('left', 'var(--sidebar-width, 420px)', 'important');
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, { once: true });
  else apply();
})();
