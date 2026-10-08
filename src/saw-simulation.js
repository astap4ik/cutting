(function (root) {
  const EPS = 1e-6;
  const same = (a, b) => Math.abs(a - b) < EPS;
  const transposed = sheet => sheet.width > sheet.length;
  const futureContourRect = part => ({ x: part.x, y: part.y, right: part.x + part.length, bottom: part.y + part.width });
  function displayRect(rect, sheet) {
    return transposed(sheet)
      ? { left: rect.y / sheet.width, top: (sheet.length - rect.right) / sheet.length, width: (rect.bottom - rect.y) / sheet.width, height: (rect.right - rect.x) / sheet.length }
      : { left: rect.x / sheet.length, top: rect.y / sheet.width, width: (rect.right - rect.x) / sheet.length, height: (rect.bottom - rect.y) / sheet.width };
  }

  function buildFrames(sheet, cuts, options) {
    const margin = options.margin, kerf = options.kerf, minWaste = options.minWaste;
    let blanks = [{ x: margin, y: margin, right: sheet.length - margin, bottom: sheet.width - margin }];
    let parts = [], remainders = [], waste = [];
    const frames = [];
    function classify() {
      const active = [];
      for (const b of blanks) {
        const part = sheet.placed.find(p => same(p.x, b.x) && same(p.y, b.y) && same(p.x + p.length, b.right) && same(p.y + p.width, b.bottom));
        if (part) parts.push({ ...b, part });
        else if (sheet.placed.some(p => p.x < b.right - EPS && p.x + p.length > b.x + EPS && p.y < b.bottom - EPS && p.y + p.width > b.y + EPS)) active.push(b);
        else if (b.right - b.x >= minWaste && b.bottom - b.y >= minWaste) remainders.push(b);
        else waste.push(b);
      }
      blanks = active;
    }
    function capture(cut, split = null) {
      frames.push({ cut, split, active: blanks.map(b => ({ ...b })), parts: parts.map(b => ({ ...b })), remainders: remainders.map(b => ({ ...b })), waste: waste.map(b => ({ ...b })) });
    }
    classify(); capture(null);
    for (const cut of cuts) {
      const index = blanks.findIndex(b => cut.axis === 'X'
        ? same(b.y, cut.from) && same(b.bottom, cut.to) && cut.position + kerf >= b.x - EPS && cut.position < b.right - EPS
        : same(b.x, cut.from) && same(b.right, cut.to) && cut.position + kerf >= b.y - EPS && cut.position < b.bottom - EPS);
      if (index < 0) throw Error('Рез не проходит через текущую заготовку');
      const b = blanks.splice(index, 1)[0];
      const children = cut.axis === 'X'
        ? [{ ...b, right: cut.position }, { ...b, x: cut.position + kerf }]
        : [{ ...b, bottom: cut.position }, { ...b, y: cut.position + kerf }];
      const separated = children.filter(v => v.right > v.x + EPS && v.bottom > v.y + EPS);
      blanks.push(...separated);
      classify(); capture(cut, { target: b, children: separated });
    }
    if (blanks.length || parts.length !== sheet.placed.length) throw Error('Последовательность резов не отделяет все детали');
    return frames;
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { buildFrames, displayRect, futureContourRect };
  if (!root.document) return;
  const doc = root.document;
  let dialog, timer = null, step = 0, frames = [], sheet, flying = [], flightTimers = [];
  const rectKey = r => [r.x, r.y, r.right, r.bottom].join(':');
  function clearFlying() { flightTimers.forEach(id => clearTimeout(id)); flightTimers = []; flying.forEach(node => { node._sawTarget.style.visibility = ''; node.remove(); }); flying = []; }
  function stop() { if (timer) clearInterval(timer); timer = null; clearFlying(); if (dialog) dialog.querySelector('[data-action="play"]').textContent = '▶ Воспроизвести'; }
  function rectNode(rect, type, label) {
    const node = doc.createElement('div');
    node.className = 'sawRect sawRect-' + type;
    const shown = displayRect(rect, sheet);
    node.style.left = shown.left * 100 + '%';
    node.style.top = shown.top * 100 + '%';
    node.style.width = shown.width * 100 + '%';
    node.style.height = shown.height * 100 + '%';
    if (label) { node.textContent = label; node.title = label; }
    node.dataset.rectKey = rectKey(rect);
    return node;
  }
  function futureContourNode(part) {
    const rect = futureContourRect(part);
    const node = rectNode(rect, 'futureContour');
    node.dataset.pieceId = part.id || '';
    node.title = `${part.name}: ${part.length} × ${part.width} мм`;
    node.setAttribute('aria-label', `Будущий контур детали ${part.name}`);
    return node;
  }
  function pieceFace(node, rect, type) {
    if (type === 'part') {
      node.classList.add('piece', 'placedPiece');
      pieceLabels(node, rect.part, 'sheet', transposed(sheet));
      node.title = `${rect.part.name}: ${rect.part.length} × ${rect.part.width} мм`;
    } else {
      const name = type === 'remainder' ? 'Свободный остаток' : 'Обрезок';
      node.title = `${name}: ${Math.round(rect.right - rect.x)} × ${Math.round(rect.bottom - rect.y)} мм`;
      const label = doc.createElement('span'); label.className = 'sawTileLabel'; label.textContent = name;
      const size = doc.createElement('span'); size.className = 'sawTileSize'; size.textContent = `${Math.round(rect.right - rect.x)} × ${Math.round(rect.bottom - rect.y)}`;
      node.append(label, size);
    }
  }
  function fillBin(selector, items, type) {
    const list = dialog.querySelector(selector);
    list.replaceChildren();
    if (!items.length) { list.textContent = 'Пока пусто'; return; }
    const table = dialog.querySelector('.sawTable');
    items.forEach(r => {
      const item = doc.createElement('div');
      item.className = 'sawTile sawTile-' + type;
      item.dataset.rectKey = rectKey(r);
      const shown = displayRect(r, sheet);
      const naturalW = shown.width * table.offsetWidth, naturalH = shown.height * table.offsetHeight;
      const scale = Math.min(210 / naturalW, 100 / naturalH);
      item.style.width = Math.max(4, naturalW * scale) + 'px';
      item.style.height = Math.max(4, naturalH * scale) + 'px';
      pieceFace(item, r, type);
      list.append(item);
    });
  }
  function flyToBin(rect, type, table) {
    const target = [...dialog.querySelectorAll(`.sawTile-${type}`)].find(node => node.dataset.rectKey === rectKey(rect));
    if (!target) return;
    const shown = displayRect(rect, sheet), board = table.getBoundingClientRect(), finish = target.getBoundingClientRect();
    const start = { left: board.left + shown.left * board.width, top: board.top + shown.top * board.height, width: Math.max(4, shown.width * board.width), height: Math.max(4, shown.height * board.height) };
    const ghost = doc.createElement('div');
    ghost.className = `sawFlying sawTile sawTile-${type}`;
    ghost.style.left = start.left + 'px'; ghost.style.top = start.top + 'px'; ghost.style.width = start.width + 'px'; ghost.style.height = start.height + 'px';
    pieceFace(ghost, rect, type);
    ghost._sawTarget = target;
    dialog.append(ghost); flying.push(ghost);
    target.style.visibility = 'hidden';
    const animation = ghost.animate([
      { transform: 'translate(0, 0) scale(1, 1)', opacity: 1 },
      { transform: `translate(${finish.left - start.left}px, ${finish.top - start.top}px) scale(${finish.width / start.width}, ${finish.height / start.height})`, opacity: 1 }
    ], { duration: 850, easing: 'cubic-bezier(.2,.7,.2,1)' });
    animation.onfinish = () => { ghost.remove(); flying = flying.filter(node => node !== ghost); target.style.visibility = ''; };
    animation.oncancel = () => { ghost.remove(); target.style.visibility = ''; };
  }
  function animateSeparation(frame, table) {
    if (!frame.split) return;
    const axis = transposed(sheet) ? (frame.cut.axis === 'X' ? 'Y' : 'X') : frame.cut.axis;
    const previous = frames[step - 1];
    frame.split.children.forEach((child, index) => {
      const node = [...table.querySelectorAll('.sawRect-active')].find(el => el.dataset.rectKey === rectKey(child));
      if (!node) return;
      const distance = index === 0 ? -18 : 18;
      node.animate([{ transform: 'translate(0, 0)' }, { transform: axis === 'X' ? `translateX(${distance}px)` : `translateY(${distance}px)` }], { duration: 650, easing: 'ease-out', fill: 'forwards' });
      sheet.placed.filter(part => {
        const rect = futureContourRect(part);
        return rect.x >= child.x - 1e-6 && rect.y >= child.y - 1e-6 && rect.right <= child.right + 1e-6 && rect.bottom <= child.bottom + 1e-6;
      }).forEach(part => {
        const contour = [...table.querySelectorAll('.sawRect-futureContour')].find(node => node.dataset.pieceId === (part.id || ''));
        if (!contour) return;
        contour.animate([
          { transform: 'translate(0, 0)', opacity: 1 },
          { transform: axis === 'X' ? `translateX(${distance}px)` : `translateY(${distance}px)`, opacity: 1 }
        ], { duration: 650, easing: 'ease-out', fill: 'forwards' });
      });
    });
    const arrivals = [];
    for (const [type, field] of [['part', 'parts'], ['remainder', 'remainders'], ['waste', 'waste']]) {
      const old = new Set(previous[field].map(rectKey));
      frame[field].filter(r => !old.has(rectKey(r))).forEach(r => arrivals.push({ type, rect: r }));
    }
    if (arrivals.length) {
      const frameStep = step;
      flightTimers.push(setTimeout(() => {
        if (frameStep !== step) return;
        arrivals.forEach(({ type, rect }) => {
          if (type === 'part' && rect.part?.id) {
            const contour = [...table.querySelectorAll('.sawRect-futureContour')].find(node => node.dataset.pieceId === rect.part.id);
            if (contour) contour.style.opacity = '0';
          }
          flyToBin(rect, type, table);
        });
      }, 680));
    }
  }
  function renderFrame(animate = false) {
    clearFlying();
    const frame = frames[step], table = dialog.querySelector('.sawTable');
    table.replaceChildren();
    frame.active.forEach(r => table.append(rectNode(r, 'active')));
    sheet.placed.forEach(part => table.append(futureContourNode(part)));
    if (frame.cut) {
      const c = frame.cut, blade = doc.createElement('div');
      const axis = transposed(sheet) ? (c.axis === 'X' ? 'Y' : 'X') : c.axis;
      blade.className = 'sawBlade sawBlade-' + axis;
      const disc = doc.createElement('span');
      disc.className = 'sawBladeDisc';
      const face = doc.createElement('span');
      face.className = 'sawBladeDiscFace';
      disc.append(face);
      blade.append(disc);
      if (c.axis === 'X') {
        if (transposed(sheet)) { blade.style.top = (sheet.length - c.position) / sheet.length * 100 + '%'; blade.style.left = c.from / sheet.width * 100 + '%'; blade.style.width = (c.to - c.from) / sheet.width * 100 + '%'; }
        else { blade.style.left = c.position / sheet.length * 100 + '%'; blade.style.top = c.from / sheet.width * 100 + '%'; blade.style.height = (c.to - c.from) / sheet.width * 100 + '%'; }
      } else if (transposed(sheet)) { blade.style.left = c.position / sheet.width * 100 + '%'; blade.style.top = (sheet.length - c.to) / sheet.length * 100 + '%'; blade.style.height = (c.to - c.from) / sheet.length * 100 + '%'; }
      else { blade.style.top = c.position / sheet.width * 100 + '%'; blade.style.left = c.from / sheet.length * 100 + '%'; blade.style.width = (c.to - c.from) / sheet.length * 100 + '%'; }
      table.append(blade);
    }
    dialog.querySelector('.sawProgress').textContent = `Рез ${step} из ${frames.length - 1}`;
    dialog.querySelector('.sawDescription').textContent = frame.cut
      ? `${frame.cut.axis === 'X' ? 'Вертикальный' : 'Горизонтальный'} рез на ${Math.round(frame.cut.position)} мм · от ${Math.round(frame.cut.from)} до ${Math.round(frame.cut.to)} мм`
      : 'Исходный лист на столе пилы';
    dialog.querySelector('[data-action="prev"]').disabled = step === 0;
    dialog.querySelector('[data-action="next"]').disabled = step === frames.length - 1;
    dialog.querySelector('[data-action="play"]').disabled = frames.length === 1;
    fillBin('.sawParts', frame.parts, 'part');
    fillBin('.sawRemainders', frame.remainders, 'remainder');
    fillBin('.sawWaste', frame.waste, 'waste');
    if (animate) animateSeparation(frame, table);
  }
  function ensureDialog() {
    if (dialog) return;
    dialog = doc.createElement('dialog'); dialog.className = 'sawDialog';
    dialog.innerHTML = '<div class="sawHeader"><div><h2>Имитация распила</h2><p class="sawSheetName"></p></div><button type="button" data-action="close" aria-label="Закрыть">×</button></div><div class="sawControls"><button type="button" data-action="prev">← Назад</button><button type="button" data-action="play">▶ Воспроизвести</button><button type="button" data-action="next">Следующий рез →</button><span class="sawProgress"></span></div><p class="sawDescription"></p><div class="sawTableWrap"><div class="sawTable"></div></div><div class="sawBins"><section><h3>Детали</h3><div class="sawParts"></div></section><section><h3>Свободные остатки</h3><div class="sawRemainders"></div></section><section><h3>Отходы</h3><div class="sawWaste"></div></section></div>';
    doc.body.append(dialog);
    dialog.addEventListener('close', stop);
    dialog.addEventListener('click', e => {
      const action = e.target.closest('[data-action]')?.dataset.action;
      if (action === 'close') dialog.close();
      if (action === 'prev') { stop(); step--; renderFrame(); }
      if (action === 'next') { stop(); step++; renderFrame(true); }
      if (action === 'play') {
        if (timer) { stop(); return; }
        if (step === frames.length - 1) { step = 0; renderFrame(); }
        dialog.querySelector('[data-action="play"]').textContent = 'Ⅱ Пауза';
        timer = setInterval(() => { step++; renderFrame(true); if (step === frames.length - 1) { clearInterval(timer); timer = null; dialog.querySelector('[data-action="play"]').textContent = '▶ Воспроизвести'; } }, 1400);
      }
    });
  }
  function open(index) {
    const current = typeof bestResult !== 'undefined' ? bestResult : null;
    sheet = current?.all?.[index];
    if (!sheet?.placed?.length) return;
    try {
      const options = currentOptions();
      if (!CuttingOptimizer.isSaw(options)) throw Error('Имитация доступна для прямолинейного раскроя');
      frames = buildFrames(sheet, CuttingOptimizer.sawPlan(sheet, options), options);
    } catch (error) { status.textContent = 'Имитация распила: ' + error.message; return; }
    ensureDialog(); stop(); step = 0;
    dialog.querySelector('.sawSheetName').textContent = `${sheet.material} · ${sheet.length} × ${sheet.width} мм`;
    const source = doc.querySelector(`#layouts .layout[data-sheet-index="${index}"] .sheet`);
    const bounds = source?.getBoundingClientRect();
    const width = bounds?.width || 800 * (Number(doc.querySelector('#mapScale')?.value) || 100) / 100;
    const height = bounds?.height || width * (transposed(sheet) ? sheet.length / sheet.width : sheet.width / sheet.length);
    const table = dialog.querySelector('.sawTable');
    table.style.width = width + 'px';
    table.style.height = height + 'px';
    dialog.showModal(); renderFrame();
  }
  function decorate() {
    const current = typeof bestResult !== 'undefined' ? bestResult : null;
    doc.querySelectorAll('#layouts .layout[data-sheet-index]').forEach(layout => {
      layout.querySelector('.sawOpen')?.remove();
      const index=Number(layout.dataset.sheetIndex),sheet=current?.all?.[index],header=layout.querySelector('.layoutToggle');
      if(!sheet?.placed?.length){header?.querySelector('.sawCardMenu')?.remove();return}
      if(!header||header.querySelector('.sawCardMenu'))return;
      const menu=doc.createElement('span');menu.className='sawCardMenu';menu.innerHTML='<button type="button" class="sawCardMenuButton" aria-label="Меню карты раскроя" title="Меню карты раскроя"><span aria-hidden="true"></span></button><span class="sawCardMenuPopup"><button type="button" class="sawCardMenuAction">▶ Имитация распила</button></span>';
      const trigger=menu.querySelector('.sawCardMenuButton'),action=menu.querySelector('.sawCardMenuAction');
      trigger.addEventListener('click',event=>{event.stopPropagation();doc.querySelectorAll('.sawCardMenu.open').forEach(other=>{if(other!==menu)other.classList.remove('open')});menu.classList.toggle('open')});
      action.addEventListener('click',event=>{event.stopPropagation();menu.classList.remove('open');open(index)});
      menu.addEventListener('click',event=>event.stopPropagation());header.append(menu);
    });
  }
  new MutationObserver(decorate).observe(doc.querySelector('#layouts'), { childList: true, subtree: true });
  doc.addEventListener('click',event=>{if(!event.target.closest('.sawCardMenu'))doc.querySelectorAll('.sawCardMenu.open').forEach(menu=>menu.classList.remove('open'))});
  decorate();
})(typeof globalThis !== 'undefined' ? globalThis : this);
