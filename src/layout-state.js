(() => {
  const layouts = document.querySelector('#layouts');
  if (!layouts) return;
  const expandedDetails = new Set();
  const restore = () => layouts.querySelectorAll('.layout').forEach(layout => {
    const index = Number(layout.dataset.layoutIndex);
    const list = layout.querySelector('.layoutDetailsList');
    const toggle = list?.querySelector('.layoutDetailsToggle');
    if (!list || !toggle) return;
    const expanded = expandedDetails.has(index);
    list.classList.toggle('collapsed', !expanded);
    toggle.setAttribute('aria-expanded', String(expanded));
    const icon = toggle.querySelector('b');
    if (icon) icon.textContent = expanded ? '−' : '＋';
  });
  layouts.addEventListener('click', event => {
    const toggle = event.target.closest('.layoutDetailsToggle');
    if (!toggle) return;
    const layout = toggle.closest('.layout');
    const list = toggle.closest('.layoutDetailsList');
    const index = Number(layout?.dataset.layoutIndex);
    if (!list || !Number.isInteger(index)) return;
    // Сохраняем новое состояние сразу: MutationObserver перерисовывает
    // карточку в этом же цикле событий и не должен вернуть «свернуто».
    if (list.classList.contains('collapsed')) expandedDetails.delete(index);
    else expandedDetails.add(index);
  });
  new MutationObserver(() => requestAnimationFrame(restore)).observe(layouts, {childList:true, subtree:true});
})();
