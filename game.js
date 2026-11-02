const $=s=>document.querySelector(s);const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const KEY='cozycamp-v2';const N=8,NC=5;
let S=Object.assign({coins:0,park:'',owned:[],painted:[],acc:[0,0,0,0,0],sound:true,plays:0},JSON.parse(localStorage.getItem(KEY)||'{}'));
const save=()=>localStorage.setItem(KEY,JSON.stringify(S));
function hud(bump){$('#snd').innerHTML=S.sound?SPK_ON:SPK_OFF;}
// ---------- sound (soft Web Audio)
let AC;function ac(){if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();return AC}
function tone(f,d=.15,type='sine',vol=.06,slide=0,delay=0){if(!S.sound)return;try{const a=ac(),t=a.currentTime+delay,o=a.createOscillator(),g=a.createGain(),lp=a.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2400;o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(f*slide,t+d);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(lp).connect(g).connect(a.destination);o.start(t);o.stop(t+d+.05)}catch(e){}}
const SFX={pop:c=>{const f=520*Math.pow(1.122,Math.min(c,8));tone(f,.14,'sine',.07,.7);tone(f*2,.08,'triangle',.02,.8)},swap:()=>tone(380,.12,'triangle',.04,1.4),nope:()=>{tone(240,.1,'sine',.05,.8);tone(200,.12,'sine',.04,.8,.09)},
 paint:()=>{tone(784,.5,'sine',.035);tone(1175,.6,'sine',.02,1,.05)},coin:()=>{tone(1319,.12,'square',.02);tone(1760,.25,'square',.02,1,.08)},
 win:()=>[523,659,784,1047,1319].forEach((f,i)=>{tone(f,.6,'triangle',.05,1,i*.12);tone(f/2,.6,'sine',.03,1,i*.12)}),tap:()=>tone(660,.06,'sine',.04),special:()=>{tone(300,.4,'sawtooth',.02,3);tone(600,.4,'sine',.04,2)}};
$('#snd').onclick=()=>{S.sound=!S.sound;save();hud();SFX.tap()};
// ---------- views & modal
function show(v){if(v==='map'){renderMap();return}document.querySelectorAll('.view').forEach(e=>e.classList.toggle('on',e.id===v));$('#tabPlay').classList.toggle('on',v!=='park');$('#tabPark').classList.toggle('on',v==='park');if(v==='park'){if(!svgEl||!$('#parkWrap svg'))renderPark();else{shop();bar()}}else layout()}
$('#tabPlay').onclick=()=>{SFX.tap();show('map')};$('#tabPark').onclick=()=>{SFX.tap();show('park')};
function modal(html,btns){$('#mcard').innerHTML=html+'<div>'+btns.map((b,i)=>`<button class="btn ${b.alt?'alt':''}" data-i="${i}">${b.t}</button>`).join('')+'</div>';$('#modal').classList.remove('hide');
 $('#mcard').querySelectorAll('.btn').forEach(el=>el.onclick=()=>{const b=btns[+el.dataset.i];SFX.tap();if(b.f&&b.f()===false)return;$('#modal').classList.add('hide')})}
// ---------- scene
// ---------- levels & drops
const RARITY={trees:5,garden:5,bench:4,tent:4,fire:3,lights:3,pond:1.6,rv:1.3};
if(!S.cur)S.cur={n:0,bg:0,item:LEVELS[0].item};if(!S.inv)S.inv={};if(!S.miss)S.miss={};if(!S.found)S.found=[];
function drawNext(){const n=S.cur.n+1;if(n<LEVELS.length){S.cur={n,bg:n,item:LEVELS[n].item};return}
 const ids=Object.keys(RARITY);const w=ids.map(id=>RARITY[id]*(1+.6*(S.miss[id]||0)));let r=Math.random()*w.reduce((a,b)=>a+b),k=0;while(r>w[k]){r-=w[k];k++}
 const item=ids[Math.min(k,ids.length-1)];ids.forEach(id=>S.miss[id]=id===item?0:(S.miss[id]||0)+1);let bg;do{bg=1+Math.floor(Math.random()*(LEVELS.length-1))}while(LEVELS[bg].item===item&&false);S.cur={n,bg,item}}
const FEAT={rv:[300,372,210],pond:[300,374,250],fire:[300,372,150],lights:[300,262,420],bench:[300,380,180],tent:[300,372,170],trees:[300,374,190],garden:[300,384,230]};
let R,TOTAL,famIdx,thresh,LV;
function setLevel(){LV=LEVELS[S.cur.bg];R=LV.regions;TOTAL=R.length;famIdx=[0,1,2,3,4].map(f=>R.map((r,i)=>r[0]===f?i:-1).filter(i=>i>=0));thresh=famIdx.map(a=>a.length?Math.max(2,30/a.length):1e9)}
const levelName=()=>S.cur.n<LEVELS.length?LV.name:`Mystery #${S.cur.n+1}`;
function featSVG(){if(S.cur.bg===0&&S.cur.item==='rv')return '';const it=IP[S.cur.item],[x,y,w,h]=it.box,[cx,by,tw]=FEAT[S.cur.item],k=tw/w;return `<g transform="translate(${cx} ${by}) scale(${k}) translate(${-(x+w/2)} ${-(y+h)})">${it.svg()}</g>`}
function spotXYR(){if(S.cur.bg===0&&S.cur.item==='rv')return LV.spot;const it=IP[S.cur.item],[,,w,h]=it.box,[cx,by,tw]=FEAT[S.cur.item],k=tw/w;return [cx,by-h*k/2,Math.max(tw,h*k)*.62]}
setLevel();
function gray(hex){const v=parseInt(hex.slice(1),16),l=(v>>16)*.3+((v>>8)&255)*.59+(v&255)*.11;const g=Math.round(226+(l-180)*.22);return `rgb(${g+3},${g-2},${g+1})`}
const GRADS={'#f9c3d3':['#f5aec6','#f9c8d2'],'#fbc79a':['#fbc2a2','#ffe0b0'],'#aedcec':['#c9ebf3','#93cbe6'],'#c3cdee':['#c9cff0','#b3c0ea'],'#ffe39a':['#fff3b8','#ffd27a']};
function sceneSVG(full){let s=`<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg"><defs><filter id="wc" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="6"/></filter>`;
 Object.entries(GRADS).forEach(([k,[a,b]],j)=>s+=`<linearGradient id="gr${j}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`);
 R.forEach((r,i)=>s+=`<clipPath id="cp${i}"><circle id="cc${i}" cx="300" cy="200" r="${full||S.painted.includes(i)?900:0}"/></clipPath>`);
 s+=`<pattern id="paper" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".6" fill="#000" opacity=".04"/></pattern><radialGradient id="fog" cx=".5" cy=".5" r=".7"><stop offset="0" stop-color="#fffaf3"/><stop offset="1" stop-color="#fbe9e4"/></radialGradient></defs><filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="22"/></filter><g id="cover"><rect width="600" height="400" fill="url(#fog)"/>${[[110,90,70],[470,70,90],[300,230,120],[90,320,80],[520,320,90],[300,60,60]].map(([x,y,r],k)=>`<ellipse class="mist" style="animation-delay:${k*.7}s" cx="${x}" cy="${y}" rx="${r*1.5}" ry="${r}" fill="${['#fde3ea','#e8f2fb','#fff2d6','#e6f5e3','#f3e6fb','#fde3ea'][k]}" opacity=".8" filter="url(#soft)"/>`).join('')}</g><g stroke-linejoin="round" stroke-linecap="round">`;
 const gk=Object.keys(GRADS);
 R.forEach((r,i)=>{const gi=gk.indexOf(r[1]);const fill=gi>=0?`url(#gr${gi})`:r[1];const T=r[3]?` transform="${r[3]}"`:'';
  s+=`<g${T}><path id="rb${i}" d="${r[2]}" fill="none" stroke="none"/><g clip-path="url(#cp${i})"><path d="${r[2]}" fill="${fill}" filter="url(#wc)"/><path d="${r[2]}" fill="none" stroke="#a88a98" stroke-width="2.2" class="ln" opacity="${full?.35:.8}"/></g></g>`});
 const done=full||S.painted.length>=TOTAL;const [sx,sy,sr]=spotXYR();return s+`</g><g id="fixedArt" style="opacity:${done?1:0};transition:opacity 1s">${LV.fixed||''}</g><g id="feat" style="opacity:${full?1:0};transition:opacity .8s">${featSVG()}</g><mask id="spm"><rect width="600" height="400" fill="#fff"/><circle id="spc" cx="${sx}" cy="${sy}" r="${sr}" fill="#000"/></mask><rect id="spot" width="600" height="400" fill="#4a3550" mask="url(#spm)" style="opacity:0;transition:opacity 1s"/><rect width="600" height="400" fill="url(#paper)"/>${full?'':`<g id="mystery" style="transition:opacity .8s;opacity:${Math.max(0,1-S.painted.length/TOTAL*7)}"><circle cx="300" cy="186" r="62" fill="#fff" opacity=".85" stroke="#f6c3d2" stroke-width="5" stroke-dasharray="4 10" stroke-linecap="round"/><text x="300" y="214" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="84" fill="#f59ab5">?</text><text x="300" y="290" text-anchor="middle" font-family="Fredoka" font-weight="600" font-size="26" fill="#c98aa3">Match pieces to reveal the picture</text></g>`}<style>.mist{animation:mist 7s ease-in-out infinite alternate}@keyframes mist{to{transform:translate(18px,-8px);opacity:.4}}</style></svg>`}
function renderScene(){$('#sceneWrap').innerHTML=sceneSVG(false);prog()}
function prog(){$('#progBar i').style.width=(S.painted.length/TOTAL*100)+'%';const m=$('#mystery');if(m)m.style.opacity=Math.max(0,1-S.painted.length/TOTAL*7);$('#sceneTitle').textContent=S.painted.length>=TOTAL?levelName():'Mystery Picture'}
function regionCenter(i){const b=$('#rb'+i).getBoundingClientRect();return {x:b.left+b.width/2,y:b.top+b.height/2,b}}
function paintRegion(i){const p=$('#rb'+i);if(!p)return;const bb=p.getBBox();const c=$('#cc'+i);c.setAttribute('cx',bb.x+bb.width/2);c.setAttribute('cy',bb.y+bb.height/2);const Rm=Math.hypot(bb.width,bb.height)/2+12;const t0=performance.now();
 const step=t=>{const k=Math.max(0,Math.min(1,(t-t0)/950)),e=1-Math.pow(1-k,3);c.setAttribute('r',Rm*e);if(k<1)requestAnimationFrame(step);else c.setAttribute('r',900)};requestAnimationFrame(step);
 const rc=regionCenter(i);for(let j=0;j<5;j++)setTimeout(()=>spark(rc.b.left+Math.random()*rc.b.width,rc.b.top+Math.random()*rc.b.height,PCOL[R[i][0]]),j*90);SFX.paint()}
// ---------- fx
function spark(x,y,c,size=26){const e=document.createElement('div');e.className='spark';e.innerHTML=STAR(c);e.style.left=x-size/2+'px';e.style.top=y-size/2+'px';e.style.width=e.style.height=size+'px';$('#fx').appendChild(e);
 e.animate([{transform:'scale(0) rotate(0)',opacity:1},{transform:'scale(1.2) rotate(90deg)',opacity:1,offset:.4},{transform:'scale(0) rotate(180deg) translateY(-10px)',opacity:0}],{duration:800,easing:'ease-out'}).onfinish=()=>e.remove()}
function burst(x,y,c){for(let i=0;i<7;i++){const e=document.createElement('div');e.className='pt';const s=6+Math.random()*8;Object.assign(e.style,{left:x-s/2+'px',top:y-s/2+'px',width:s+'px',height:s+'px',background:c});$('#fx').appendChild(e);
 const a=Math.random()*6.28,d=30+Math.random()*40;e.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d+10}px) scale(.2)`,opacity:0}],{duration:500+Math.random()*200,easing:'cubic-bezier(.2,.8,.4,1)'}).onfinish=()=>e.remove()}}
function droplet(x0,y0,x1,y1,c,done){const e=document.createElement('div');e.className='drop';e.style.background=c;e.style.left=x0-11+'px';e.style.top=y0-11+'px';$('#fx').appendChild(e);const mx=(x1-x0)/2,my=Math.min(y1,y0)-y0-80;
 e.animate([{transform:'translate(0,0) rotate(-45deg) scale(.6)'},{transform:`translate(${mx}px,${my}px) rotate(-45deg) scale(1.1)`},{transform:`translate(${x1-x0}px,${y1-y0}px) rotate(-45deg) scale(.4)`,opacity:.7}],{duration:620,easing:'ease-in-out'}).onfinish=()=>{e.remove();done()}}
function combo(n){const t=['','','Sweet!','Lovely!','So cozy!','Dreamy!'][Math.min(n,5)];if(!t)return;const e=$('#combo');e.textContent=t;e.classList.remove('go');void e.offsetWidth;e.classList.add('go')}
// ---------- board
let G=[],cs=60,busy=false,sel=null,idleT,uid=0;const board=$('#board');
function weightedColor(){const w=[0,1,2,3,4].map(f=>famIdx[f].some(i=>!S.painted.includes(i))?1:.55);let r=Math.random()*w.reduce((a,b)=>a+b),k=0;while(r>w[k]){r-=w[k];k++}return Math.min(k,4)}
function mkTile(k,sp=null){return {k,sp,id:uid++,el:null}}
function tileHTML(t){return `<svg viewBox="0 0 100 100">${PIECES[t.k]}${t.sp==='h'?STRIPE_H:t.sp==='v'?STRIPE_V:''}</svg>`}
function place(t,r,c,anim){if(!t.el){t.el=document.createElement('div');t.el.className='t';board.appendChild(t.el)}t.el.innerHTML=tileHTML(t);t.el.style.width=t.el.style.height=cs+'px';t.r=r;t.c=c;
 if(anim==='none'){t.el.style.transition='none';t.el.style.transform=`translate(${c*cs}px,${r*cs}px)`;void t.el.offsetWidth;t.el.style.transition=''}else t.el.style.transform=`translate(${c*cs}px,${r*cs}px)`}
function newBoard(){board.innerHTML='';G=[];for(let r=0;r<N;r++){G[r]=[];for(let c=0;c<N;c++){let k;do{k=weightedColor()}while((c>1&&G[r][c-1].k===k&&G[r][c-2].k===k)||(r>1&&G[r-1][c].k===k&&G[r-2][c].k===k));G[r][c]=mkTile(k)}}
 if(!hasMove())return newBoard();G.forEach((row,r)=>row.forEach((t,c)=>{place(t,r,c,'none');t.el.classList.add('born');t.el.style.animationDelay=(r+c)*25+'ms'}))}
function layout(){const W=innerWidth-36,H=innerHeight-76-26,land=innerWidth>innerHeight;let sw,B;
 if(land){B=Math.min(H-24,W*.5);sw=Math.min(W-B-24-14-24,(H-54)*1.5)}else{B=Math.min(W-24,Math.round(H*.49));sw=Math.min(W-24,(H-B-24-14-54)*1.5)}
 $('#sceneCard').style.width=sw+24+'px';cs=Math.floor(B/N);B=cs*N;board.style.width=board.style.height=B+'px';board.style.setProperty('--cs2',cs*2+'px');G.forEach((row,r)=>row.forEach((t,c)=>t&&place(t,r,c,'none')))}
addEventListener('resize',()=>{if($('#play').classList.contains('on'))layout();else renderPark()});
const inb=(r,c)=>r>=0&&c>=0&&r<N&&c<N;
function findRuns(){const runs=[];for(let r=0;r<N;r++){let c=0;while(c<N){let e=c+1;const k=G[r][c].k;if(k<5)while(e<N&&G[r][e].k===k)e++;if(e-c>=3)runs.push({cells:[...Array(e-c)].map((_,i)=>[r,c+i]),dir:'h',k});c=e}}
 for(let c=0;c<N;c++){let r=0;while(r<N){let e=r+1;const k=G[r][c].k;if(k<5)while(e<N&&G[e][c].k===k)e++;if(e-r>=3)runs.push({cells:[...Array(e-r)].map((_,i)=>[r+i,c]),dir:'v',k});r=e}}return runs}
function swapG(a,b){const t=G[a[0]][a[1]];G[a[0]][a[1]]=G[b[0]][b[1]];G[b[0]][b[1]]=t}
function hasMove(){for(let r=0;r<N;r++)for(let c=0;c<N;c++){if(G[r][c].k===5)return [[r,c],[r,c+1<N?c+1:c-1]];for(const [dr,dc] of [[0,1],[1,0]]){const b=[r+dr,c+dc];if(!inb(...b))continue;swapG([r,c],b);const ok=findRuns().length>0;swapG([r,c],b);if(ok)return [[r,c],b]}}return null}
board.addEventListener('pointerdown',e=>{if(busy)return;ac();clearHint();const b=board.getBoundingClientRect();const c=Math.floor((e.clientX-b.left)/cs),r=Math.floor((e.clientY-b.top)/cs);if(!inb(r,c))return;board.setPointerCapture(e.pointerId);drag={r,c,x:e.clientX,y:e.clientY,moved:false}});
let drag=null;
board.addEventListener('pointermove',e=>{if(!drag||drag.moved||busy)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)<cs*.3)return;drag.moved=true;const t=Math.abs(dx)>Math.abs(dy)?[drag.r,drag.c+Math.sign(dx)]:[drag.r+Math.sign(dy),drag.c];if(inb(...t)){setSel(null);trySwap([drag.r,drag.c],t)}});
board.addEventListener('pointerup',()=>{if(!drag)return;const d=drag;drag=null;if(d.moved||busy)return;if(sel&&Math.abs(sel[0]-d.r)+Math.abs(sel[1]-d.c)===1){const s=sel;setSel(null);trySwap(s,[d.r,d.c])}else if(sel&&sel[0]===d.r&&sel[1]===d.c)setSel(null);else{setSel([d.r,d.c]);SFX.tap()}});
function setSel(p){if(sel)G[sel[0]][sel[1]].el.classList.remove('sel');sel=p;if(p)G[p[0]][p[1]].el.classList.add('sel')}
function clearHint(){clearTimeout(idleT);board.querySelectorAll('.hint').forEach(e=>e.classList.remove('hint'));idleT=setTimeout(showHint,5000)}
function showHint(){if(busy||!$('#play').classList.contains('on'))return;const m=hasMove();if(m)m.forEach(([r,c])=>G[r][c].el.classList.add('hint'))}
async function trySwap(a,b){busy=true;clearHint();const A=G[a[0]][a[1]],B=G[b[0]][b[1]];swapG(a,b);place(A,b[0],b[1]);place(B,a[0],a[1]);SFX.swap();await sleep(210);
 if(A.k===5||B.k===5){let set=new Set();const other=A.k===5?B:A;if(A.k===5&&B.k===5){for(let r=0;r<N;r++)for(let c=0;c<N;c++)set.add(r*N+c)}else{set.add(A.k===5?b[0]*N+b[1]:a[0]*N+a[1]);for(let r=0;r<N;r++)for(let c=0;c<N;c++)if(G[r][c].k===other.k)set.add(r*N+c)}
  SFX.special();if(await resolve(set,1)==='done')return;busy=false;clearHint();return}
 if(!findRuns().length){swapG(a,b);place(A,a[0],a[1]);place(B,b[0],b[1]);SFX.nope();A.el.classList.add('nope');await sleep(300);A.el.classList.remove('nope');busy=false;return}
 if(await resolve(null,1,[a,b])==='done')return;busy=false;clearHint()}
async function resolve(preset,chain,swapped=[]){
 while(true){let set=preset||new Set(),born=[];preset=null;
  if(!set.size){const runs=findRuns();if(!runs.length)break;for(const run of runs){run.cells.forEach(([r,c])=>set.add(r*N+c));if(run.cells.length>=4){let at=run.cells.find(p=>swapped.some(s=>s[0]===p[0]&&s[1]===p[1]))||run.cells[run.cells.length>>1];born.push({at,k:run.cells.length>=5?5:run.k,sp:run.cells.length>=5?null:(run.dir==='h'?'v':'h')})}}}
  // expand stripes
  const q=[...set];while(q.length){const i=q.pop(),t=G[(i/N)|0][i%N];if(t.sp){const r=(i/N)|0,c=i%N;for(let j=0;j<N;j++){const x=t.sp==='h'?r*N+j:j*N+c;if(!set.has(x)){set.add(x);q.push(x)}}t.sp=null;SFX.special()}}
  for(const b of born)set.delete(b.at[0]*N+b.at[1]);
  combo(chain);SFX.pop(chain);const counts=[0,0,0,0,0],pos=[[],[],[],[],[]];const br=board.getBoundingClientRect();
  for(const i of set){const r=(i/N)|0,c=i%N,t=G[r][c];if(t.k<5){counts[t.k]++;pos[t.k].push([br.left+(c+.5)*cs,br.top+(r+.5)*cs])}t.el.classList.add('pop');burst(br.left+(c+.5)*cs,br.top+(r+.5)*cs,t.k<5?PCOL[t.k]:'#fff');G[r][c]=null;setTimeout(()=>t.el.remove(),300)}
  for(const b of born){const t=G[b.at[0]][b.at[1]];t.k=b.k;t.sp=b.sp;place(t,b.at[0],b.at[1]);t.el.classList.remove('born');void t.el.offsetWidth;t.el.classList.add('born');spark(br.left+(b.at[1]+.5)*cs,br.top+(b.at[0]+.5)*cs,'#fff',40)}
  feedPaint(counts,pos);await sleep(260);
  // gravity
  let maxd=0;for(let c=0;c<N;c++){let w=N-1;for(let r=N-1;r>=0;r--)if(G[r][c]){if(w!==r){G[w][c]=G[r][c];G[r][c]=null;maxd=Math.max(maxd,w-r)}w--}
   for(let r=w,n=1;r>=0;r--,n++){const t=mkTile(weightedColor());G[r][c]=t;place(t,-n,c,'none');maxd=Math.max(maxd,w+1)}}
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){const t=G[r][c];if(t.r!==r||t.c!==c){t.el.style.transitionDuration=(.18+.05*(r-t.r))+'s';place(t,r,c);t.el.classList.remove('land');setTimeout(()=>{t.el.classList.add('land');t.el.style.transitionDuration=''},180+50*(r-t.r))}}
  await sleep(220+50*Math.min(maxd,8));swapped=[];chain++}
 if(S.painted.length>=TOTAL){busy=true;await sleep(900);finish();return 'done'}
 if(!hasMove()){await sleep(300);shuffle()}}
function shuffle(){const all=G.flat().map(t=>t.k);let tries=0;do{all.sort(()=>Math.random()-.5);G.forEach((row,r)=>row.forEach((t,c)=>t.k=all[r*N+c]));tries++}while((findRuns().length||!hasMove())&&tries<200);if(tries>=200){newBoard();return}
 G.forEach((row,r)=>row.forEach((t,c)=>{t.el.innerHTML=tileHTML(t);t.el.classList.remove('born');void t.el.offsetWidth;t.el.classList.add('born')}));combo(0);const e=$('#combo');e.textContent='Shuffle!';e.classList.remove('go');void e.offsetWidth;e.classList.add('go')}
function feedPaint(counts,pos){const sr=$('#sceneWrap').getBoundingClientRect();
 counts.forEach((n,f)=>{if(!n)return;S.acc[f]+=n;const todo=[];while(S.acc[f]>=thresh[f]){const next=famIdx[f].find(i=>!S.painted.includes(i)&&!todo.includes(i));if(next===undefined){S.acc[f]=0;break}S.acc[f]-=thresh[f];todo.push(next)}
  todo.forEach((i,j)=>{S.painted.push(i);const [x,y]=pos[f][j%pos[f].length];const rc=regionCenter(i);setTimeout(()=>droplet(x,y,rc.x,rc.y,PCOL[f],()=>paintRegion(i)),j*120)});
  if(!todo.length){const [x,y]=pos[f][0];droplet(x,y,sr.left+sr.width*(.2+Math.random()*.6),sr.top+sr.height*.5,PCOL[f],()=>{})}});
 save();setTimeout(prog,700)}
function finish(){SFX.win();const it=IP[S.cur.item];const first=!S.found.includes(it.id);if(first)S.found.push(it.id);S.inv[it.id]=(S.inv[it.id]||0)+1;
 S.done=S.done||[];if(!S.done.includes(S.cur.bg))S.done.push(S.cur.bg);S.last={bg:S.cur.bg,item:it.id};const finished={...S.cur};drawNext();S.painted=[];S.acc=[0,0,0,0,0];save();
 $('#fixedArt').style.opacity=1;$('#sceneTitle').textContent=LEVELS[finished.bg].name;document.querySelectorAll('#sceneWrap .ln').forEach(e=>{e.style.transition='opacity 1.2s';e.style.opacity=.3});const sr=$('#sceneWrap').getBoundingClientRect();
 for(let i=0;i<26;i++)setTimeout(()=>spark(sr.left+Math.random()*sr.width,sr.top+Math.random()*sr.height,PCOL[i%5],20+Math.random()*24),i*60);
 setTimeout(()=>{$('#spot').style.opacity=.55;$('#feat').style.opacity=1;tone(660,.5,'triangle',.05);tone(990,.7,'sine',.04,1,.2)},1500);
 setTimeout(()=>{const svg=$('#sceneWrap svg'),m=svg.getScreenCTM(),[x,y,r]=(()=>{const t={...S.cur};S.cur=finished;const v=spotXYR();S.cur=t;return v})();for(let i=0;i<14;i++)setTimeout(()=>spark(m.e+(x+(Math.random()-.5)*r*1.6)*m.a,m.f+(y+(Math.random()-.5)*r*1.4)*m.d,'#fff3b0',30),i*60)},2100);
 setTimeout(()=>{SFX.coin();modal(`<h3>You discovered:<br>${it.name}!</h3><div class="th big">${thumbSVG(it)}</div><p>${first?'Unlocked for your park.':'Another one for your park!'} It's waiting in your bag, ready to place.</p>`,
  [{t:'Place it in my park',f:()=>{reset();show('park');startPlace(it.id);bar();drawGhost()}},{t:'Next mystery',alt:1,f:()=>{reset();show('play')}}])},3600)}
function reset(){busy=false;setLevel();S.painted=[];S.acc=[0,0,0,0,0];save();renderScene();newBoard()}
// ---------- park (free placement)
const NS='http://www.w3.org/2000/svg';
if(!S.started){S.started=1;S.inv=S.inv||{};STARTER_ITEMS.forEach(id=>S.inv[id]=(S.inv[id]||0)+1)}
if(!S.items){S.items=(S.owned||[]).map(id=>{const [x,y,w,h]=IP[id].box;return {id,x:x+w/2,y:y+h,flip:0}})}
let walkers=[],wpath=null,svgEl=null,placing=null,selIdx=-1,lp=null,justPlaced=null;
const anchor=id=>{const [x,y,w,h]=IP[id].box;return [x+w/2,y+h,w,h]};
function itemG(o,ghost){const [ax,ay]=anchor(o.id);const g=document.createElementNS(NS,'g');g.setAttribute('transform',`translate(${o.x} ${o.y})${o.flip?' scale(-1 1)':''} translate(${-ax} ${-ay})`);g.innerHTML='<g>'+IP[o.id].svg()+'</g>';return g}
function foot(o){const [,,w,h]=anchor(o.id);const fw=w*.42,fh=Math.min(h*.22,26);return [o.x-fw,o.y-fh,o.x+fw,o.y+4]}
const ZONES=[{x0:0,x1:200,need:3},{x0:600,x1:800,need:6}];const zoneOpen=z=>S.items.length>=z.need||(S.zonesOpen||[]).includes(z.x0);
function valid(o,skip){const [x0,y0,x1,y1]=foot(o);if(x0<8||x1>792||y0<108||y1>545)return false;for(const z of ZONES)if(!zoneOpen(z)&&x1>z.x0&&x0<z.x1)return false;
 for(let i=0;i<S.items.length;i++){if(i===skip)continue;const [a0,b0,a1,b1]=foot(S.items[i]);if(x0<a1&&x1>a0&&y0<b1&&y1>b0)return false}return true}
function svgPt(e){const pt=svgEl.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;return pt.matrixTransform(svgEl.getScreenCTM().inverse())}
function drawZones(){let Z=svgEl.querySelector('#zones');if(!Z){Z=document.createElementNS(NS,'g');Z.id='zones';svgEl.querySelector('#ghost').after(Z)}Z.innerHTML=ZONES.filter(z=>!zoneOpen(z)).map(z=>`<g><rect x="${z.x0}" y="100" width="200" height="460" fill="#f6efe6" opacity=".82"/><path d="M${z.x0} 100h200v460h-200z" fill="url(#hatch)" opacity=".5"/><g transform="translate(${z.x0+100} 320)"><rect x="-80" y="-46" width="160" height="92" rx="24" fill="#fff" stroke="#e8c9d4" stroke-width="3"/><path d="M-10-26v-6a10 10 0 0 1 20 0v6" stroke="#c98aa3" stroke-width="4" fill="none"/><rect x="-15" y="-27" width="30" height="22" rx="6" fill="#f59ab5"/><text y="16" text-anchor="middle" font-family="Fredoka" font-weight="600" font-size="17" fill="#b07890">More land opens</text><text y="36" text-anchor="middle" font-family="Fredoka" font-weight="600" font-size="15" fill="#c9a0b0">at ${z.need} items placed</text></g></g>`).join('')}
function drawItems(){const L=svgEl.querySelector('#items');L.innerHTML='';drawZones();const order=S.items.map((o,i)=>[o,i]).sort((a,b)=>a[0].y-b[0].y);
 for(const [o,i] of order){if(placing&&placing.from===i)continue;const g=itemG(o);g.dataset.i=i;if(i===selIdx)g.setAttribute('filter','drop-shadow(0 0 6px #fff) drop-shadow(0 0 4px #f784a5)');if(justPlaced===i){g.firstChild.classList.add('newitem')}L.appendChild(g)}justPlaced=null;drawGhost()}
function drawGhost(){const G2=svgEl.querySelector('#ghost');G2.innerHTML='';if(!placing||placing.x==null)return;const ok=valid(placing,placing.from);placing.ok=ok;const [x0,y0,x1,y1]=foot(placing);
 G2.innerHTML=`<ellipse cx="${placing.x}" cy="${(y0+y1)/2}" rx="${(x1-x0)/2+8}" ry="${(y1-y0)/2+8}" fill="${ok?'#7fdc8a':'#ff8a9a'}" opacity=".55" stroke="${ok?'#3fae55':'#e0506a'}" stroke-width="3" stroke-dasharray="8 6"/>`;const g=itemG(placing);g.setAttribute('opacity','.75');G2.appendChild(g)}
function renderPark(){const card=$('#parkCard').getBoundingClientRect();const w=Math.min(card.width,card.height*800/560);const pw=$('#parkWrap');pw.style.width=w+'px';pw.style.height=w*560/800+'px';
 pw.innerHTML=parkSVG(S.park,[]);svgEl=pw.querySelector('svg');wpath=document.createElementNS(NS,'path');wpath.setAttribute('d',PATH);wpath.setAttribute('fill','none');svgEl.insertBefore(wpath,svgEl.firstChild);
 const n=Math.min(5,1+Math.ceil(S.items.length/2));walkers=[];const g=svgEl.querySelector('#walkers');for(let i=0;i<n;i++){const el=document.createElementNS(NS,'g');el.innerHTML=CAMPERS[i];g.appendChild(el);walkers.push({el,p:Math.random(),v:(.00035+Math.random()*.0003)*(i%2?1:-1),side:(i%2?1:-1)*(6+i*3)})}
 svgEl.addEventListener('pointerdown',pDown);svgEl.addEventListener('pointermove',pMove);svgEl.addEventListener('pointerup',pUp);svgEl.style.touchAction='none';
 drawItems();shop();bar();hud()}
function hitItem(p){let best=-1,by=-1;S.items.forEach((o,i)=>{const [,,w,h]=anchor(o.id);if(p.x>o.x-w/2&&p.x<o.x+w/2&&p.y>o.y-h&&p.y<o.y+6&&o.y>by){best=i;by=o.y}});return best}
function pDown(e){const p=svgPt(e);svgEl.setPointerCapture(e.pointerId);if(placing){placing.x=p.x;placing.y=p.y;drawGhost();return}
 const i=hitItem(p);if(i<0){if(selIdx>=0){selIdx=-1;drawItems();bar()}return}
 lp={i,t:setTimeout(()=>{startMove(i,true);placing.x=p.x;placing.y=p.y;drawItems();if(navigator.vibrate)navigator.vibrate(15)},420),x:p.x,y:p.y}}
function pMove(e){const p=svgPt(e);if(lp&&Math.hypot(p.x-lp.x,p.y-lp.y)>12){clearTimeout(lp.t);lp=null}if(placing){placing.x=p.x;placing.y=p.y;drawGhost()}}
function pUp(e){if(lp){clearTimeout(lp.t);const i=lp.i;lp=null;if(!placing){selIdx=selIdx===i?-1:i;SFX.tap();drawItems();bar();return}}
 if(!placing||placing.x==null)return;if(placing.drag&&!placing.ok){cancelPlace();return}if(!placing.ok){SFX.nope();msg('That spot is blocked. Try a green spot.');return}
 const o={id:placing.id,x:Math.round(placing.x),y:Math.round(placing.y),flip:placing.flip||0};
 if(placing.from!=null){S.items[placing.from]=o;justPlaced=placing.from}else{S.items.push(o);S.inv[o.id]--;justPlaced=S.items.length-1;const [,,w,h]=anchor(o.id);sparkAt(o.x,o.y-h/2)}
 placing=null;selIdx=-1;save();SFX.coin();setTimeout(SFX.paint,100);renderPark()}
function sparkAt(x,y){const m=svgEl.getScreenCTM();for(let i=0;i<10;i++)setTimeout(()=>spark(m.e+x*m.a+(Math.random()-.5)*80,m.f+y*m.d+(Math.random()-.5)*60,PCOL[i%5],30),i*70)}
function startMove(i,drag){const o=S.items[i];placing={id:o.id,flip:o.flip,from:i,x:o.x,y:o.y,drag};selIdx=-1;lp=null;bar();drawItems()}
function startPlace(id){placing={id,flip:0,from:null,x:null,y:null};selIdx=-1;show('park');msg(`Tap anywhere to place your ${IP[id].name}. Green means it fits.`)}
function cancelPlace(){placing=null;drawItems();bar()}
function msg(t){$('#parkMsg').textContent=t}
function bar(){let b=$('#parkBar');if(!b){b=document.createElement('div');b.id='parkBar';$('#park').insertBefore(b,$('#shop'))}
 if(placing){b.innerHTML=`<span id="parkMsg">${placing.from!=null?'Drag to a new spot, then let go.':`Tap or drag to place your ${IP[placing.id].name}. Green means it fits.`}</span><button class="mini" id="pbFlip">Flip</button><button class="mini alt" id="pbCancel">Cancel</button>`;
  $('#pbFlip').onclick=()=>{placing.flip=placing.flip?0:1;drawGhost()};$('#pbCancel').onclick=cancelPlace}
 else if(selIdx>=0){const o=S.items[selIdx];b.innerHTML=`<span id="parkMsg">${IP[o.id].name}</span><button class="mini" id="pbMove">Move</button><button class="mini" id="pbFlip">Flip</button><button class="mini alt" id="pbStore">Put in bag</button>`;
  $('#pbMove').onclick=()=>startMove(selIdx,false);$('#pbFlip').onclick=()=>{o.flip=o.flip?0:1;save();drawItems()};$('#pbStore').onclick=()=>{S.inv[o.id]=(S.inv[o.id]||0)+1;S.items.splice(selIdx,1);selIdx=-1;save();renderPark()}}
 else b.innerHTML=`<span id="parkMsg">Tap decor to move, flip or store it. Hold and drag to move it quickly.</span>`}
function walk(){if(wpath&&$('#park').classList.contains('on')){const L=wpath.getTotalLength();for(const w of walkers){w.p+=w.v;if(w.p>1||w.p<0){w.v*=-1;w.p=Math.max(0,Math.min(1,w.p))}const pt=wpath.getPointAtLength(w.p*L);w.el.setAttribute('transform',`translate(${pt.x+w.side} ${pt.y}) scale(${w.v<0?-1:1} 1)`)}}requestAnimationFrame(walk)}walk();
function shop(){const s=$('#shop');s.innerHTML='';for(const it of PARK_ITEMS){const n=S.inv[it.id]||0,placed=S.items.filter(o=>o.id===it.id).length,have=S.found.includes(it.id)||STARTER_ITEMS.includes(it.id)||placed;const d=document.createElement('div');d.className='item'+(have?'':' lockd');
 d.innerHTML=`<div class="th">${thumbSVG(it)}</div><div class="nm">${it.name}</div>`+(have?`<div class="cnt">In bag: <b>${n}</b> · Placed: <b>${placed}</b></div>${n?`<button class="buy place">Place</button>`:''}`:`<div class="cnt">Find it in a mystery picture</div>`);
 if(n)d.querySelector('.place').onclick=()=>{SFX.tap();startPlace(it.id);bar();drawGhost()};s.appendChild(d)}}
// ---------- level map
function renderMap(){const m=$('#mapGrid');m.innerHTML='';const pass=S.cur.n>=LEVELS.length;
 LEVELS.forEach((L,i)=>{const done=(S.done||[]).includes(i),cur=!pass&&S.cur.n===i;const d=document.createElement('div');d.className='lvl'+(done?' done':cur?' cur':' lock');
  d.innerHTML=`<div class="num">${i+1}</div><div class="lth">${done?thumbSVG(IP[L.item]):cur?'<span class="q">?</span>':'<svg viewBox="0 0 24 24"><path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="#d7b6c4" stroke-width="2.4" fill="none"/><rect x="5" y="11" width="14" height="10" rx="3" fill="#e9cfd9"/></svg>'}</div><b>${done?L.name:cur?'Mystery Picture':'Locked'}</b><small>${done?'Found: '+IP[L.item].name:cur?'Tap to play':'Finish the one before'}</small>`;
  if(cur)d.onclick=()=>{SFX.tap();show('play')};m.appendChild(d)});
 if(pass){const d=document.createElement('div');d.className='lvl cur wide';d.innerHTML=`<div class="lth"><span class="q">?</span></div><b>Mystery #${S.cur.n+1}</b><small>A surprise item every time. Rare finds: Duck Pond, RV Campsite.</small>`;d.onclick=()=>{SFX.tap();show('play')};m.appendChild(d)}
 document.querySelectorAll('.view').forEach(e=>e.classList.toggle('on',e.id==='map'));$('#tabPlay').classList.add('on');$('#tabPark').classList.remove('on')}
// ---------- first launch name
function askName(){modal(`<h3>Welcome to Cozy Camp!</h3><p>You have a sweet little patch of land by the lake. What will you name your RV park?</p><input id="pn" maxlength="22" placeholder="Sunny Pines">`,[{t:'Open my park',f:()=>{const v=$('#pn').value.trim();if(!v)return false;S.park=v;save();SFX.win()}}]);setTimeout(()=>$('#pn')&&$('#pn').focus(),60)}
$('#toMap').onclick=()=>{SFX.tap();show('map')};
// ---------- boot
document.fonts&&document.fonts.load('600 20px Fredoka');
hud();layout();renderScene();newBoard();clearHint();if(!S.park)setTimeout(askName,400);else show('map');
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js?v=3').catch(()=>{});
