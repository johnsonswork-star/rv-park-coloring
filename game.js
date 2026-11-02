const $=s=>document.querySelector(s);const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const KEY='cozycamp-v2';const N=8,NC=5;
let S=Object.assign({coins:0,park:'',owned:[],painted:[],acc:[0,0,0,0,0],sound:true,plays:0},JSON.parse(localStorage.getItem(KEY)||'{}'));
const save=()=>localStorage.setItem(KEY,JSON.stringify(S));
function hud(bump){$('#coinN').textContent=S.coins;$('#snd').innerHTML=S.sound?SPK_ON:SPK_OFF;if(bump){const p=$('#coinPill');p.classList.remove('bump');void p.offsetWidth;p.classList.add('bump')}}
// ---------- sound (soft Web Audio)
let AC;function ac(){if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();return AC}
function tone(f,d=.15,type='sine',vol=.06,slide=0,delay=0){if(!S.sound)return;try{const a=ac(),t=a.currentTime+delay,o=a.createOscillator(),g=a.createGain(),lp=a.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2400;o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(f*slide,t+d);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(lp).connect(g).connect(a.destination);o.start(t);o.stop(t+d+.05)}catch(e){}}
const SFX={pop:c=>{const f=520*Math.pow(1.122,Math.min(c,8));tone(f,.14,'sine',.07,.7);tone(f*2,.08,'triangle',.02,.8)},swap:()=>tone(380,.12,'triangle',.04,1.4),nope:()=>{tone(240,.1,'sine',.05,.8);tone(200,.12,'sine',.04,.8,.09)},
 paint:()=>{tone(784,.5,'sine',.035);tone(1175,.6,'sine',.02,1,.05)},coin:()=>{tone(1319,.12,'square',.02);tone(1760,.25,'square',.02,1,.08)},
 win:()=>[523,659,784,1047,1319].forEach((f,i)=>{tone(f,.6,'triangle',.05,1,i*.12);tone(f/2,.6,'sine',.03,1,i*.12)}),tap:()=>tone(660,.06,'sine',.04),special:()=>{tone(300,.4,'sawtooth',.02,3);tone(600,.4,'sine',.04,2)}};
$('#snd').onclick=()=>{S.sound=!S.sound;save();hud();SFX.tap()};
// ---------- views & modal
function show(v){document.querySelectorAll('.view').forEach(e=>e.classList.toggle('on',e.id===v));$('#tabPlay').classList.toggle('on',v==='play');$('#tabPark').classList.toggle('on',v==='park');if(v==='park')renderPark();else layout()}
$('#tabPlay').onclick=()=>{SFX.tap();show('play')};$('#tabPark').onclick=()=>{SFX.tap();show('park')};
function modal(html,btns){$('#mcard').innerHTML=html+'<div>'+btns.map((b,i)=>`<button class="btn ${b.alt?'alt':''}" data-i="${i}">${b.t}</button>`).join('')+'</div>';$('#modal').classList.remove('hide');
 $('#mcard').querySelectorAll('.btn').forEach(el=>el.onclick=()=>{const b=btns[+el.dataset.i];SFX.tap();if(b.f&&b.f()===false)return;$('#modal').classList.add('hide')})}
// ---------- scene
const R=SCENE.regions,TOTAL=R.length;
const famIdx=[0,1,2,3,4].map(f=>R.map((r,i)=>r[0]===f?i:-1).filter(i=>i>=0));
const thresh=famIdx.map(a=>Math.max(2,30/a.length));
function gray(hex){const v=parseInt(hex.slice(1),16),l=(v>>16)*.3+((v>>8)&255)*.59+(v&255)*.11;const g=Math.round(226+(l-180)*.22);return `rgb(${g+3},${g-2},${g+1})`}
const GRADS={'#f9c3d3':['#f5aec6','#f9c8d2'],'#fbc79a':['#fbc2a2','#ffe0b0'],'#aedcec':['#c9ebf3','#93cbe6'],'#c3cdee':['#c9cff0','#b3c0ea'],'#ffe39a':['#fff3b8','#ffd27a']};
function sceneSVG(full){let s=`<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg"><defs><filter id="wc" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="6"/></filter>`;
 Object.entries(GRADS).forEach(([k,[a,b]],j)=>s+=`<linearGradient id="gr${j}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`);
 R.forEach((r,i)=>s+=`<clipPath id="cp${i}"><circle id="cc${i}" cx="300" cy="200" r="${full||S.painted.includes(i)?900:0}"/></clipPath>`);
 s+=`<pattern id="paper" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".6" fill="#000" opacity=".04"/></pattern></defs><g stroke-linejoin="round" stroke-linecap="round">`;
 const gk=Object.keys(GRADS);
 R.forEach((r,i)=>{const gi=gk.indexOf(r[1]);const fill=gi>=0?`url(#gr${gi})`:r[1];const T=r[3]?` transform="${r[3]}"`:'';
  s+=`<g${T}><path id="rb${i}" d="${r[2]}" fill="${gray(r[1])}" stroke="#b49aa8" stroke-width="2.2" class="ln"/><g filter="url(#wc)" clip-path="url(#cp${i})"><path d="${r[2]}" fill="${fill}"/></g><path d="${r[2]}" fill="none" stroke="#a88a98" stroke-width="2.2" class="ln" opacity="${full?.35:.85}"/></g>`});
 return s+`</g>${SCENE.fixed}<rect width="600" height="400" fill="url(#paper)"/></svg>`}
function renderScene(){$('#sceneWrap').innerHTML=sceneSVG(false);prog()}
function prog(){$('#progBar i').style.width=(S.painted.length/TOTAL*100)+'%'}
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
function finish(){SFX.win();const first=!S.plays;const earned=first?150:120;S.plays++;S.coins+=earned;save();
 document.querySelectorAll('#sceneWrap .ln').forEach(e=>{e.style.transition='opacity 1.2s';e.style.opacity=.3});const sr=$('#sceneWrap').getBoundingClientRect();
 for(let i=0;i<26;i++)setTimeout(()=>spark(sr.left+Math.random()*sr.width,sr.top+Math.random()*sr.height,PCOL[i%5],20+Math.random()*24),i*60);
 setTimeout(()=>{modal(`<h3>Picture complete!</h3><div class="art">${sceneSVG(true)}</div><p>Lakeside Sunset is all painted.</p><div class="reward">${COIN}+${earned}</div>`,
  [{t:'Decorate my park',f:()=>{reset();show('park')}},{t:'Paint again',alt:1,f:()=>{reset();show('play')}}]);SFX.coin();hud(1)},1700)}
function reset(){busy=false;S.painted=[];S.acc=[0,0,0,0,0];save();renderScene();newBoard()}
// ---------- park
let walkers=[],wpath=null,lastBought=null;
function renderPark(){const card=$('#parkCard').getBoundingClientRect();const w=Math.min(card.width,card.height*800/560);const pw=$('#parkWrap');pw.style.width=w+'px';pw.style.height=w*560/800+'px';
 pw.innerHTML=parkSVG(S.park,S.owned);const svg=pw.querySelector('svg');wpath=document.createElementNS('http://www.w3.org/2000/svg','path');wpath.setAttribute('d',PATH);wpath.setAttribute('fill','none');svg.insertBefore(wpath,svg.firstChild);
 const n=Math.min(5,1+Math.ceil(S.owned.length/2));walkers=[];const g=pw.querySelector('#walkers');for(let i=0;i<n;i++){const el=document.createElementNS('http://www.w3.org/2000/svg','g');el.innerHTML=CAMPERS[i];g.appendChild(el);walkers.push({el,p:Math.random(),v:(.00035+Math.random()*.0003)*(i%2?1:-1),side:(i%2?1:-1)*(6+i*3)})}
 if(lastBought){const it=pw.querySelector('#it-'+lastBought);if(it){it.classList.add('newitem');const b=it.getBoundingClientRect();for(let i=0;i<10;i++)setTimeout(()=>spark(b.left+Math.random()*b.width,b.top+Math.random()*b.height,PCOL[i%5],30),i*70)}lastBought=null}
 shop();hud()}
function walk(){if(wpath&&$('#park').classList.contains('on')){const L=wpath.getTotalLength();for(const w of walkers){w.p+=w.v;if(w.p>1||w.p<0){w.v*=-1;w.p=Math.max(0,Math.min(1,w.p))}const pt=wpath.getPointAtLength(w.p*L);w.el.setAttribute('transform',`translate(${pt.x+w.side} ${pt.y}) scale(${w.v<0?-1:1} 1)`)}}requestAnimationFrame(walk)}walk();
function shop(){const s=$('#shop');s.innerHTML='';for(const it of PARK_ITEMS){const own=S.owned.includes(it.id);const d=document.createElement('div');d.className='item';
 d.innerHTML=`<div class="th">${thumbSVG(it)}</div><div class="nm">${it.name}</div>`+(own?`<div class="owned">In your park</div>`:`<button class="buy ${S.coins<it.price?'poor':''}">${COIN}${it.price}</button>`);
 if(!own)d.querySelector('.buy').onclick=()=>buy(it);s.appendChild(d)}}
function buy(it){if(S.coins<it.price){SFX.nope();modal(`<h3>Almost!</h3><p>You need <b>${it.price-S.coins}</b> more coins for the ${it.name}. Paint a picture to earn more.</p>`,[{t:'Go paint',f:()=>show('play')},{t:'OK',alt:1}]);return}
 S.coins-=it.price;S.owned.push(it.id);save();lastBought=it.id;SFX.coin();setTimeout(SFX.paint,120);hud(1);renderPark()}
// ---------- first launch name
function askName(){modal(`<h3>Welcome to Cozy Camp!</h3><p>You have a sweet little patch of land by the lake. What will you name your RV park?</p><input id="pn" maxlength="22" placeholder="Sunny Pines">`,[{t:'Open my park',f:()=>{const v=$('#pn').value.trim();if(!v)return false;S.park=v;save();SFX.win()}}]);setTimeout(()=>$('#pn')&&$('#pn').focus(),60)}
// ---------- boot
document.fonts&&document.fonts.load('600 20px Fredoka');
hud();layout();renderScene();newBoard();clearHint();if(!S.park)setTimeout(askName,400);
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
