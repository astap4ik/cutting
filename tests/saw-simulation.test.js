const assert = require('node:assert/strict');
const Optimizer = require('../src/optimizer.js');
const { buildFrames, displayRect, futureContourRect } = require('../src/saw-simulation.js');

assert.deepEqual(displayRect({ x: 20, y: 10, right: 50, bottom: 30 }, { length: 100, width: 50 }), { left: .2, top: .2, width: .3, height: .4 });
assert.deepEqual(displayRect({ x: 20, y: 10, right: 50, bottom: 30 }, { length: 100, width: 200 }), { left: .05, top: .5, width: .1, height: .3 });
assert.deepEqual(futureContourRect({ x: 20, y: 10, length: 30, width: 20 }), { x: 20, y: 10, right: 50, bottom: 30 });

const options = { kerf: 4, margin: 5, minWaste: 30, kind: 'guillotine', mode: 'standard' };
const data = Optimizer.prepare(
  [{ material: 'A', length: 250, width: 300, qty: 3 }],
  Array.from({ length: 40 }, (_, i) => ({ material: 'A', name: 'Деталь ' + i, length: 10 + i * 13 % 90, width: 10 + i * 19 % 90, qty: 1, rotate: true })),
  options
);
for (let seed = 0; seed < 30; seed++) {
  for (const sheet of Optimizer.attempt(data, options, seed, 42).layouts) {
    const cuts = Optimizer.sawPlan(sheet, options);
    const frames = buildFrames(sheet, cuts, options);
    assert.equal(frames.length, cuts.length + 1);
    assert.equal(frames[0].active.length, 1);
    assert.equal(frames[0].waste.length, 0, 'поля листа не отображаются как полосы отходов');
    assert.equal(frames.at(-1).active.length, 0);
    assert.equal(frames.at(-1).parts.length, sheet.placed.length);
    assert.deepEqual(frames.at(-1).parts.map(r => r.part.id).sort(), sheet.placed.map(p => p.id).sort());
    for (const frame of frames.slice(1)) {
      assert.ok(frame.split.children.length >= 1 && frame.split.children.length <= 2);
      assert.ok(frame.split.children.every(child => child.x >= frame.split.target.x && child.y >= frame.split.target.y && child.right <= frame.split.target.right && child.bottom <= frame.split.target.bottom));
    }
    const separatedKeys = new Set(frames.slice(1).flatMap(frame => frame.split.children.map(r => [r.x, r.y, r.right, r.bottom].join(':'))));
    assert.ok(frames.at(-1).waste.every(r => separatedKeys.has([r.x, r.y, r.right, r.bottom].join(':'))), 'в отходах только отделённые обрезки, без полос пропила');
    for (const frame of frames) {
      for (const remainder of frame.remainders) {
        assert.ok(remainder.right - remainder.x >= options.minWaste);
        assert.ok(remainder.bottom - remainder.y >= options.minWaste);
      }
    }
  }
}
console.log('PASS: saw simulation separates all parts and sorts reusable offcuts');
