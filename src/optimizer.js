/* Coordinates: length is X; width is Y. Roll feed runs along Y. */
(function(root){
const EPS=1e-7;
// Free placement requires explicit opt-in; legacy `sheet` options remain saw-safe.
const isSaw=o=>o.milling!==true;
function sawPlan(s,o){
 const k=o.kerf,m=o.margin,cuts=[];
 function walk(ps,x,y,right,bottom){
  if(!ps.length)return;
  if(ps.length===1){
   const p=ps[0];
   if(p.x>x+EPS){cuts.push({axis:'X',position:p.x-k,from:y,to:bottom});x=p.x}
   if(p.y>y+EPS){cuts.push({axis:'Y',position:p.y-k,from:x,to:right});y=p.y}
   if(p.x+p.length<right-EPS){cuts.push({axis:'X',position:p.x+p.length,from:y,to:bottom});right=p.x+p.length}
   if(p.y+p.width<bottom-EPS)cuts.push({axis:'Y',position:p.y+p.width,from:x,to:right});
   return;
  }
  for(const axis of ['X','Y']){
   const start=p=>axis==='X'?p.x:p.y,end=p=>start(p)+(axis==='X'?p.length:p.width);
   const sorted=[...ps].sort((a,b)=>start(a)-start(b));let edge=end(sorted[0]);
   for(let i=1;i<sorted.length;i++){
    if(edge+k<=start(sorted[i])+EPS){
     cuts.push({axis,position:edge,from:axis==='X'?y:x,to:axis==='X'?bottom:right});
     if(axis==='X'){walk(sorted.slice(0,i),x,y,edge,bottom);walk(sorted.slice(i),edge+k,y,right,bottom)}
     else{walk(sorted.slice(0,i),x,y,right,edge);walk(sorted.slice(i),x,edge+k,right,bottom)}
     return;
    }
    edge=Math.max(edge,end(sorted[i]));
   }
  }
  throw Error('Раскладка не допускает последовательных прямых сквозных резов');
 }
 walk(s.placed,m,m,s.length-m,s.width-m);return cuts;
}
const less=(a,b)=>{for(let i=0;i<a.length;i++){if(Math.abs(a[i]-b[i])>EPS)return a[i]<b[i]}return false};
function random(seed){let n=seed>>>0;return ()=>{n+=0x6D2B79F5;let t=n;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296}}
function prepare(sheets,parts,o){
 for(const k of ['kerf','margin','minWaste'])if(!Number.isFinite(o[k])||o[k]<0)throw Error('Настройки должны быть неотрицательными числами');
 const expand=(rows,isPart)=>rows.flatMap((p,row)=>{
  const length=Number(p.length),width=Number(p.width),qty=Number(p.qty);
  if(!p.material?.trim()||![length,width].every(v=>Number.isFinite(v)&&v>0)||!Number.isInteger(qty)||qty<0||qty>10000)throw Error('Проверьте материал, размеры и целое количество в строке '+(row+1));
  return Array.from({length:qty},(_,i)=>({...p,length,width,id:(isPart?'p':'s')+row+'-'+i,partNo:isPart?row+1:undefined,partIndex:isPart?i+1:undefined,partQty:isPart?qty:undefined,material:p.material.trim(),rotateGroup:String(p.rotateGroup||'').trim(),rotation:0}));
 });
 const stock=expand(sheets,false),items=expand(parts,true);
 if(stock.length>2000||items.length>2000)throw Error('За один расчёт поддерживается до 2000 листов и деталей');
 return {stock,items};
}
function split(f,u){
 if(u.x>=f.x+f.w-EPS||u.x+u.w<=f.x+EPS||u.y>=f.y+f.h-EPS||u.y+u.h<=f.y+EPS)return [f];
 let r=[];
 if(u.x>f.x)r.push({...f,w:u.x-f.x});
 if(u.x+u.w<f.x+f.w)r.push({...f,x:u.x+u.w,w:f.x+f.w-u.x-u.w});
 if(u.y>f.y)r.push({...f,h:u.y-f.y});
 if(u.y+u.h<f.y+f.h)r.push({...f,y:u.y+u.h,h:f.y+f.h-u.y-u.h});
 return r;
}
function prune(fs){return fs.filter((a,i)=>a.w>EPS&&a.h>EPS&&!fs.some((b,j)=>i!==j&&a.x>=b.x-EPS&&a.y>=b.y-EPS&&a.x+a.w<=b.x+b.w+EPS&&a.y+a.h<=b.y+b.h+EPS&&(j<i||a.w*a.h<b.w*b.h-EPS)))}
function pack(data,order,o,fit=0,groupRotations={}){
 o={...o,kind:isSaw(o)?'guillotine':o.kind==='roll'?'roll':'sheet'};
 const k=o.kerf,m=o.margin;
 const all=data.stock.map(s=>({...s,placed:[],cuts:[],free:s.length>2*m&&s.width>2*m?[{x:m,y:m,w:s.length-2*m+k,h:s.width-2*m+k}]:[]}));
 const unplaced=[];
 const variantsFor=p=>{const g=p.rotateGroup;if(g)return groupRotations[g]===true&&p.rotate&&p.length!==p.width?[{...p,length:p.width,width:p.length,rotation:90}]:[p];return p.rotate&&p.length!==p.width?[p,{...p,length:p.width,width:p.length,rotation:90}]:[p]};
 for(const p of order){let best;
  const variants=variantsFor(p);
  for(const s of all){if(s.material!==p.material)continue;
   for(const v of variants)for(let fi=0;fi<s.free.length;fi++){
    const f=s.free[fi],w=v.length+k,h=v.width+k,dw=f.w-w,dh=f.h-h;
    if(dw<-EPS||dh<-EPS)continue;
    const local=fit===0?[Math.min(dw,dh),Math.max(dw,dh)]:fit===1?[f.w*f.h-w*h,Math.min(dw,dh)]:[f.y+h,f.x];
    const occupied=s.placed.reduce((n,a)=>Math.max(n,a.y+a.width),m);
    const cost=o.kind==='roll'?s.length*(Math.max(occupied,f.y+v.width)-occupied):s.placed.length?0:s.length*s.width;
    // Consume stock sequentially: an admissible position on an earlier
    // sheet must win over a better-looking position on a later sheet.
    const rank=[all.indexOf(s),cost,...local];
    if(!best||less(rank,best.rank))best={s,v,f,fi,w,h,rank};
   }
  }
  if(!best){unplaced.push({...variants[0]});continue}
  const {s,v,f,fi,w,h}=best,u={x:f.x,y:f.y,w,h};
  s.placed.push({...v,x:f.x,y:f.y});
  if(isSaw(o)){
   // Disjoint guillotine leaves; recorded cuts are in execution order.
   const horizontal=fit%2===0;
   let rest=horizontal?[{x:f.x+w,y:f.y,w:f.w-w,h},{x:f.x,y:f.y+h,w:f.w,h:f.h-h}]:[{x:f.x+w,y:f.y,w:f.w-w,h:f.h},{x:f.x,y:f.y+h,w,h:f.h-h}];
   const verticalCut={axis:'X',position:f.x+v.length,from:f.y,to:Math.min(f.y+(horizontal?h:f.h)-k,s.width-m)};
   const horizontalCut={axis:'Y',position:f.y+v.width,from:f.x,to:Math.min(f.x+(horizontal?f.w:w)-k,s.length-m)};
   const cuts=horizontal?[horizontalCut,verticalCut]:[verticalCut,horizontalCut];
   s.cuts.push(...cuts.filter(c=>c.position<(c.axis==='X'?f.x+f.w-k:f.y+f.h-k)-EPS));
   s.free.splice(fi,1,...rest.filter(r=>r.w>EPS&&r.h>EPS));
  }else s.free=prune(s.free.flatMap(r=>split(r,u)));
 }
 const layouts=all.filter(s=>s.placed.length);
 let area=0,used=0,reusable=0,cutLength=0;
 for(const s of layouts){
  s.usedLength=Math.max(...s.placed.map(p=>p.y+p.width))+m;
  area+=s.length*(o.kind==='roll'?s.usedLength:s.width);
  used+=s.placed.reduce((n,p)=>n+p.length*p.width,0);
  // Largest usable rectangle per sheet only: MaxRects free areas overlap.
  s.largestOffcut=Math.max(0,...s.free.map(f=>{let w=Math.max(0,f.w-k),h=Math.max(0,f.h-k);return w>=o.minWaste&&h>=o.minWaste?w*h:0}));
  reusable+=s.largestOffcut;
  cutLength+=s.cuts.reduce((n,c)=>n+c.to-c.from,0);
 }
 const sheetFill=all.map(s=>-s.placed.reduce((n,p)=>n+p.length*p.width,0));
 return {all,layouts,unplaced,area,used,reusable,cutLength,score:[unplaced.length,...sheetFill,area,layouts.length,-reusable,cutLength],order:order.map(p=>p.id)};
}
function validate(r,data,o){
 const seen=new Set(),sources=new Map(data.items.map(p=>[p.id,p])),groupOrientation=new Map();
 const checkGroup=(src,p)=>{const g=src.rotateGroup;if(!g)return;let orientation=p.rotation===90?1:p.rotation===0?0:p.length===src.length&&p.width===src.width?0:src.rotate&&p.length===src.width&&p.width===src.length?1:null;if(orientation===null)throw Error('Ошибка ориентации детали');if(groupOrientation.has(g)&&groupOrientation.get(g)!==orientation)throw Error('Детали группы поворота должны иметь одну ориентацию');groupOrientation.set(g,orientation)};
 for(const s of r.all)for(let i=0;i<s.placed.length;i++){
  const p=s.placed[i],src=sources.get(p.id);
  if(!src||seen.has(p.id)||src.material!==s.material||!((p.length===src.length&&p.width===src.width)||(src.rotate&&p.length===src.width&&p.width===src.length)))throw Error('Ошибка соответствия детали');
  checkGroup(src,p);
  seen.add(p.id);
  if(![p.x,p.y,p.length,p.width].every(Number.isFinite)||p.x<o.margin-EPS||p.y<o.margin-EPS||p.x+p.length>s.length-o.margin+EPS||p.y+p.width>s.width-o.margin+EPS)throw Error('Выход за границы листа');
  for(const b of s.placed.slice(i+1))if(!(p.x+p.length+o.kerf<=b.x+EPS||b.x+b.length+o.kerf<=p.x+EPS||p.y+p.width+o.kerf<=b.y+EPS||b.y+b.width+o.kerf<=p.y+EPS))throw Error('Пересечение деталей или нарушение пропила');
 }
 for(const p of r.unplaced){const src=sources.get(p.id);if(!src||seen.has(p.id)||!((p.length===src.length&&p.width===src.width)||(src.rotate&&p.length===src.width&&p.width===src.length)))throw Error('Ошибка количества');checkGroup(src,p);seen.add(p.id)}
 if(seen.size!==data.items.length)throw Error('Потеря деталей');
 if(isSaw(o))for(const s of r.all)sawPlan(s,o);
 return true;
}
function attempt(data,o,index,seed,incumbent){
 const rng=random(seed+index),metrics=[p=>p.length*p.width,p=>p.length,p=>p.width,p=>Math.max(p.length,p.width)];
 const groups=[...new Set(data.items.map(p=>p.rotateGroup).filter(Boolean))].sort(),groupRotations={};
 groups.forEach((g,i)=>{const members=data.items.filter(p=>p.rotateGroup===g);groupRotations[g]=members.every(p=>p.rotate)&&((i<30?index>>i:Math.floor(rng()*2))&1)===1});
 let order=[...data.items].sort((a,b)=>metrics[index%4](b)-metrics[index%4](a));
 if(index>=12){
  if(incumbent&&index%2===0){const map=new Map(data.items.map(p=>[p.id,p]));order=incumbent.order.map(id=>map.get(id));}
  const swaps=index%3===0?order.length:Math.max(1,Math.ceil(order.length*.15));
  for(let j=0;j<swaps;j++){let a=Math.floor(rng()*order.length),b=Math.floor(rng()*order.length);if(order.length)[order[a],order[b]]=[order[b],order[a]];}
 }
 const r=pack(data,order,o,index%3,groupRotations);validate(r,data,o);r.seed=seed;r.attempt=index;return r;
}
const api={prepare,pack,validate,attempt,less,isSaw,sawPlan};
if(typeof module!=='undefined')module.exports=api;else root.CuttingOptimizer=api;
})(globalThis);
