const assert=require('node:assert/strict');
const E=require('./optimizer.js');
const options={kerf:4,margin:0,minWaste:50,kind:'sheet',mode:'standard'};
const stock=(length=100,width=100,material='A',qty=1)=>({length,width,material,qty});
const part=(length,width,qty=1,material='A',rotate=false)=>({...stock(length,width,material,qty),rotate});
for(const kind of ['sheet','guillotine','roll'])for(const mode of ['fast','standard']){
 const o={...options,kind,mode};
 let d=E.prepare([stock()],[part(100,100)],o),r=E.attempt(d,o,0,1);
 assert.equal(r.unplaced.length,0,'exact edge fit');
 d=E.prepare([stock()],[part(48,100,2)],o);r=E.attempt(d,o,0,1);assert.equal(r.unplaced.length,0,'kerf fits exactly');
 d=E.prepare([stock()],[part(49,100,2)],o);r=E.attempt(d,o,0,1);assert.equal(r.unplaced.length,1);
 d=E.prepare([stock()],[part(20,20,1,'B')],o);assert.equal(E.attempt(d,o,0,1).unplaced.length,1);
 d=E.prepare([stock(40,80)],[part(80,40,1,'A',true)],o);assert.equal(E.attempt(d,o,0,1).unplaced.length,0);
 d=E.prepare([stock(40,80)],[part(80,40)],o);assert.equal(E.attempt(d,o,0,1).unplaced.length,1);
 d=E.prepare([stock(250,300,'A',3),stock(200,300,'B',2)],Array.from({length:50},(_,i)=>part(10+(i*13)%100,10+(i*19)%100,1,i%3?'A':'B',true)),o);
 let best;for(let t=0;t<40;t++){r=E.attempt(d,o,t,42,best);E.validate(r,d,o);if(!best||E.less(r.score,best.score))best=r}
 assert.deepEqual(E.attempt(d,o,20,99,best),E.attempt(d,o,20,99,best),'seed repeatability');
 const broken=structuredClone(best);broken.all.find(s=>s.placed.length).placed[0].x=-1;assert.throws(()=>E.validate(broken,d,o));
}
assert.throws(()=>E.prepare([stock()],[part(-1,10)],options));
const o={...options,margin:5};const d=E.prepare([stock()],[part(90,90)],o);assert.equal(E.attempt(d,o,0,1).unplaced.length,0);
const grouped=E.prepare([stock(120,100)],[{...part(60,20,1,'A',true),rotateGroup:'frame'},{...part(20,60,1,'A',true),rotateGroup:'frame'}],options);
for(let t=0;t<4;t++){const r=E.attempt(grouped,options,t,7);E.validate(r,grouped,options);const orientations=r.all.flatMap(s=>s.placed).concat(r.unplaced).map(p=>{const src=grouped.items.find(x=>x.id===p.id);return p.length===src.length&&p.width===src.width?0:1});assert.equal(new Set(orientations).size,1,'rotation group keeps one orientation')}
console.log('PASS: geometry, margins, kerf, materials, rotation, rotation groups, all mechanisms, deterministic search, invalid inputs');
