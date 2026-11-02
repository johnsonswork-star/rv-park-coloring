// Procedural cozy scenes. Each returns palette index for cell (u,v) in [0,1).
const H=(x,y)=>{let n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n)};
const SCENES=[
{id:'campfire',name:'Cozy Campfire',pack:'starter',n:28,pal:['#2f3e6b','#4a5d94','#fff3b0','#e0603d','#f7a541','#ffd56b','#7a4b2e','#3d6b4a'],
 f(u,v,x,y){ if(v>.78) return 7; const dx=u-.5;
  if(v>.66&&v<.78&&Math.abs(dx)<.28&&Math.abs((v-.72)-dx*.15)<.035) return 6;
  if(v>.66&&v<.78&&Math.abs(dx)<.28&&Math.abs((v-.72)+dx*.15)<.035) return 6;
  const fh=.7-v; if(fh>0&&fh<.42&&Math.abs(dx)<(.42-fh)*.45){const r=Math.abs(dx)/((.42-fh)*.45); return r<.35&&fh<.25?5:r<.7?4:3}
  if(H(x,y)>.94&&v<.55) return 2; return v<.4?0:1}},
{id:'pines',name:'Pine Forest',pack:'starter',n:30,pal:['#bfe3f0','#e9f6fa','#2f6b4f','#4f9a6b','#7a5236','#a8d58e','#8fbf75'],
 f(u,v,x,y){ const trees=[[.18,.25,.6],[.5,.12,.72],[.8,.3,.58],[.35,.35,.5],[.65,.4,.45]];
  for(const [cx,top,w] of trees){const bot=top+.55; if(v>=top&&v<bot){const t=(v-top)/.55; if(Math.abs(u-cx)<t*w*.32) return ((v*14|0)%2)?2:3} if(v>=bot&&v<bot+.08&&Math.abs(u-cx)<.025) return 4}
  if(v>.82) return v>.9?6:5; const c=(u-.2)**2+(v-.15)**2; if(c<.006) return 1; return 0}},
{id:'tent',name:'Tent Under Stars',pack:'starter',n:28,pal:['#28325e','#44508a','#fff1a8','#e98a6b','#c9605a','#4c7a52','#f2d3a0'],
 f(u,v,x,y){ if(v>.75) return 5; const dx=Math.abs(u-.5); const t=(v-.35)/.4;
  if(t>0&&dx<t*.32){ if(dx<t*.07&&v>.55) return 6; return u<.5?3:4}
  if((u-.82)**2+(v-.15)**2<.006) return 2; if(H(x,y)>.93) return 2; return v<.45?0:1}},
{id:'rvdusk',name:'RV at Dusk',pack:'starter',n:34,pal:['#f6b28a','#f7d4a2','#9b7fb8','#fdfaf2','#7cc0c9','#3a3a48','#5e8f5d','#e98a6b','#ffe08a'],
 f(u,v,x,y){ if(v>.78) return 6; if(v>.64&&v<.74&&((u-.3)**2+(v-.72)**2<.004||(u-.68)**2+(v-.72)**2<.004)) return 5;
  if(u>.15&&u<.85&&v>.38&&v<.7){ if(v>.6&&v<.64) return 7; if(v>.44&&v<.54&&((u>.22&&u<.38)||(u>.48&&u<.6))) return 4; if(u>.7&&u<.8&&v>.45&&v<.7) return 8; return 3}
  if(u>.85&&u<.92&&v>.5&&v<.7) return 3; return v<.2?2:v<.32?0:1}},
{id:'lights',name:'String Lights',pack:'starter',n:30,pal:['#3b3f6e','#565c94','#ffd56b','#f49a8b','#9fd6c0','#2a2a3a','#6b8f5e'],
 f(u,v,x,y){ if(v>.85) return 6; for(const [a,b] of [[.2,.06],[.45,.1]]){const yy=a+b*Math.sin(u*Math.PI); if(Math.abs(v-yy)<.012) return 5;
   const k=Math.round(u*8)/8; const by=a+b*Math.sin(k*Math.PI)+.035; if((u-k)**2+(v-by)**2<.0012) return 2+((k*8)|0)%3}
  if(u<.05||u>.95) return 5; return v<.5?0:1}},
{id:'lakesun',name:'Lake Sunset',pack:'lake',n:36,pal:['#f6a28a','#f9c79a','#fde2a8','#ffd56b','#5a7fb0','#7fa6cf','#4d6e5a','#bcd6ea'],
 f(u,v,x,y){ const s=(u-.5)**2/.8+(v-.5)**2; if(v<.5&&s<.018) return 3; if(v<.5&&v>.4&&(u<.25||u>.78)&&v>.5-Math.abs(Math.sin(u*9))*.08) return 6;
  if(v<.5) return v<.2?0:v<.36?1:2; if(Math.abs(u-.5)<.06*(1-(v-.5)) && ((v*30|0)%2)) return 3; if(((v*24+H(x,0)*3)|0)%4==0) return 7; return v<.72?5:4}},
{id:'canoe',name:'Canoe Morning',pack:'lake',n:34,pal:['#cfe8f3','#f5f1e6','#5c95b8','#86b8d6','#d8704f','#8a5a3a','#5f8f62'],
 f(u,v,x,y){ if(v<.45&&v>.3+Math.sin(u*7)*.05) return 6; if(v<.45) return (u-.75)**2+(v-.15)**2<.005?1:0;
  const cy=.62,dx=u-.5; if(Math.abs(dx)<.32&&v>cy&&v<cy+.08-dx*dx*.6) return 4; if(Math.abs(u-.6+(v-.5)*.6)<.012&&v>.48&&v<.7) return 5;
  return ((v*20+Math.sin(u*12))|0)%3==0?3:2}},
{id:'mountain',name:'Mountain Moon',pack:'mountain',n:36,pal:['#2c3360','#4b5893','#fff4c2','#8a93c2','#f3f5fb','#4f7a5c','#356049'],
 f(u,v,x,y){ const m1=.45+Math.abs(u-.35)*1.1, m2=.55+Math.abs(u-.75)*1.0; if(v>.82) return 6; if(v>.72) return 5;
  if(v>m1||v>m2){const snow=(v<m1+.06&&v>m1&&u>.28&&u<.42)||(v<m2+.05&&v>m2&&u>.7&&u<.8); return snow?4:3}
  if((u-.75)**2+(v-.18)**2<.008) return 2; if(H(x,y)>.95) return 2; return v<.35?0:1}},
{id:'deer',name:'Meadow Fox',pack:'garden',n:32,pal:['#cdeaf5','#9fd08a','#78b56a','#e8894a','#fff6e8','#3e3a3a','#f7c6d9','#ffe17a'],
 f(u,v,x,y){ const bx=u-.5,by=v-.62; if(bx*bx/.04+by*by/.01<1) return 3; if((u-.68)**2+(v-.5)**2<.006) return 3;
  if(Math.abs(u-.66)<.02&&v>.42&&v<.46) return 5; if(u<.34&&u>.18&&Math.abs(v-.6+(u-.18)*.5)<.03) return 4; if(v>.66&&v<.76&&(Math.abs(u-.4)<.015||Math.abs(u-.58)<.015)) return 5;
  if(v>.6){ if(H(x,y)>.9) return H(y,x)>.5?6:7; return v>.82?2:1} return 0}},
{id:'cabin',name:'Garden Cabin',pack:'garden',n:34,pal:['#d6eef7','#b5764e','#8a4f34','#c9605a','#ffe08a','#7cbf7a','#f7a6c1','#fff4f8'],
 f(u,v,x,y){ if(v>.4&&v<.48+0&&Math.abs(u-.5)<(v-.2)*.9&&v<.45) return 3; const dx=Math.abs(u-.5);
  if(v>.22&&v<.42&&dx<(v-.22)*1.6) return 3; if(v>=.42&&v<.75&&dx<.3){ if(v>.5&&v<.62&&dx>.12&&dx<.24) return 4; if(dx<.06&&v>.55) return 2; return ((v*30|0)%2)?1:2}
  if(v>.75){ if(H(x,y)>.75) return H(y,x)>.5?6:7; return 5} return 0}}
];
const PACKS={starter:{name:'Starter Camp'},lake:{name:'Lake Pack',unlock:'pond'},mountain:{name:'Mountain Pack',unlock:'store'},garden:{name:'Garden Pack',unlock:'playground'}};
function buildScene(s){const n=s.n,cells=new Uint8Array(n*n);for(let y=0;y<n;y++)for(let x=0;x<n;x++)cells[y*n+x]=s.f((x+.5)/n,(y+.5)/n,x,y);s.cells=cells;
 const used=[...new Set(cells)].sort((a,b)=>a-b);const map={};used.forEach((c,i)=>map[c]=i);s.cpal=used.map(c=>s.pal[c]);for(let i=0;i<cells.length;i++)cells[i]=map[cells[i]];
 s.reward=Math.round(n*n/12/5)*5;return s}
SCENES.forEach(buildScene);
