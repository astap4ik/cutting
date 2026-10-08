const assert=require('node:assert/strict');
const E=require('../src/optimizer.js');
const options={kerf:4,margin:0,minWaste:50,kind:'sheet',mode:'standard'};
const stock=(length=100,width=100,material='A',qty=1)=>({length,width,material,qty});
const part=(length,width,qty=1,material='A',rotate=false)=>({...stock(length,width,material,qty),rotate});
for(const kind of ['sheet','guillotine','roll'])for(const mode of ['fast','standard','best']){
 const o={...options,kind,mode,milling:kind!=='guillotine'};
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

// A later sheet must not win merely because it has a better local rectangle.
const sequentialData=E.prepare([stock(100,100,'A',2)],[
 part(70,40),part(30,60),part(30,30)
],{...options,milling:true});
const sequential=E.attempt(sequentialData,{...options,milling:true},0,1);
assert.deepEqual(sequential.all.map(s=>s.placed.map(p=>p.id)),[
 ['p0-0','p2-0'],['p1-0']
], 'fills the first sheet before using the second');
console.log('PASS: sequential sheet filling');

// A pinwheel has adequate kerf everywhere but no first through-cut.
const pinwheel=[[0,0,66,30],[70,0,30,66],[34,70,66,30],[0,34,30,66],[34,34,32,32]];
const pinData=E.prepare([stock()],pinwheel.map(p=>part(p[2],p[3])),options);
const pinResult={all:[{...pinData.stock[0],placed:pinData.items.map((p,i)=>({...p,x:pinwheel[i][0],y:pinwheel[i][1]})),cuts:[]}],unplaced:[]};
assert.throws(()=>E.validate(pinResult,pinData,options),/сквозных резов/);
assert.equal(E.validate(pinResult,pinData,{...options,milling:true}),true);
const small=E.prepare([stock()],[part(40,30),part(20,20)],options);
for(const mode of ['fast','standard','best']){
 for(const milling of [undefined,false,true]){
  const opts={...options,mode,milling};
  const result=E.attempt(small,opts,0,1);
  assert.equal(result.layouts[0].cuts.length>0,milling!==true,'only explicit milling permits free placement');
 }
}
// Replay each cut against the current rectangular blanks, checking kerf and final parts.
function replay(sheet,o){
 let blanks=[{x:o.margin,y:o.margin,right:sheet.length-o.margin,bottom:sheet.width-o.margin}];
 for(const c of E.sawPlan(sheet,o)){
  // A trimming pass can overhang the blank when the offcut is thinner than kerf.
  const index=blanks.findIndex(b=>c.axis==='X'?b.y===c.from&&b.bottom===c.to&&c.position+o.kerf>=b.x&&c.position<b.right:b.x===c.from&&b.right===c.to&&c.position+o.kerf>=b.y&&c.position<b.bottom);
  assert.notEqual(index,-1,'cut spans an existing blank: '+JSON.stringify({c,blanks}));const b=blanks.splice(index,1)[0];
  const children=c.axis==='X'?[{...b,right:c.position},{...b,x:c.position+o.kerf}]:[{...b,bottom:c.position},{...b,y:c.position+o.kerf}];
  blanks.push(...children.filter(b=>b.right>b.x&&b.bottom>b.y));
 }
 for(const p of sheet.placed)assert.ok(blanks.some(b=>b.x===p.x&&b.y===p.y&&b.right===p.x+p.length&&b.bottom===p.y+p.width),'each part is separated');
}
const sawOptions={...options,margin:5};
const sawData=E.prepare([stock(250,300,'A',3)],Array.from({length:40},(_,i)=>part(10+i*13%90,10+i*19%90,1,'A',true)),sawOptions);
for(let i=0;i<30;i++)for(const sheet of E.attempt(sawData,sawOptions,i,42).layouts)replay(sheet,sawOptions);
console.log('PASS: saw default, explicit milling, pinwheel rejection, executable cut sequence');
