const $=s=>document.querySelector(s);
const KEY='rvpark-v1';
const ITEMS=[
 {id:'tree',e:'🌲',name:'Pine Tree',p:20},{id:'flowers',e:'🌷',name:'Flowers',p:15},{id:'bench',e:'🪑',name:'Bench',p:25},
 {id:'lights',e:'💡',name:'String Lights',p:30},{id:'fire',e:'🔥',name:'Fire Pit',p:35},{id:'tent',e:'⛺',name:'Campsite',p:40},
 {id:'rv',e:'🚐',name:'RV',p:60},{id:'pond',e:'🦆',name:'Fishing Pond',p:120,unlock:'lake'},{id:'playground',e:'🛝',name:'Playground',p:150,unlock:'garden'},
 {id:'store',e:'🏪',name:'Camp Store',p:180,unlock:'mountain'},{id:'pool',e:'🏊',name:'Pool',p:200},{id:'dog',e:'🐕',name:'Dog Park',p:45}];
const IT=Object.fromEntries(ITEMS.map(i=>[i.id,i]));
let S=JSON.parse(localStorage.getItem(KEY)||'null')||{coins:30,park:'',placed:[],prog:{},done:{},streak:0,last:'',sound:true};
const save=()=>localStorage.setItem(KEY,JSON.stringify(S));
const unlocked=p=>p==='starter'||S.placed.some(o=>IT[o.id].unlock===p);
function hud(){$('#coinN').textContent=S.coins;$('#streakN').textContent=S.streak;$('#snd').textContent=S.sound?'🔊':'🔈';$('#parkTitle').textContent=(S.park||'My')+' RV Park'}
// ---- sound
let AC;function tone(f,d=.12,type='sine',vol=.08){if(!S.sound)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(vol,AC.currentTime);g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d);o.connect(g).connect(AC.destination);o.start();o.stop(AC.currentTime+d)}catch(e){}}
const chime=()=>[523,659,784,1047].forEach((f,i)=>setTimeout(()=>tone(f,.35,'triangle',.07),i*120));
$('#snd').onclick=()=>{S.sound=!S.sound;save();hud();tone(660)};
// ---- views
function show(v){document.querySelectorAll('.view').forEach(e=>e.classList.toggle('on',e.id===v));$('#tabGallery').classList.toggle('on',v!=='park');$('#tabPark').classList.toggle('on',v==='park');if(v==='gallery')gallery();if(v==='park')parkInit()}
$('#tabGallery').onclick=()=>show('gallery');$('#tabPark').onclick=()=>show('park');
function modal(html,btn='OK',cb){$('#mcard').innerHTML=html+`<br><button id="mok">${btn}</button>`;$('#modal').classList.remove('hide');$('#mok').onclick=()=>{if(cb&&cb()===false)return;$('#modal').classList.add('hide')}}
function thumb(s,c,full){const n=s.n;c.width=c.height=n;const x=c.getContext('2d'),f=S.prog[s.id];const im=x.createImageData(n,n);
 for(let i=0;i<n*n;i++){const filled=full||(f&&f[i]==='1');const v=parseInt(s.cpal[s.cells[i]].slice(1),16);let c=[v>>16,(v>>8)&255,v&255];if(!filled){const g=(c[0]+c[1]+c[2])/3;c=c.map(k=>Math.round(235+(g*.3+k*.1)*.08))}im.data.set([...c,255],i*4)}x.putImageData(im,0,0)}
function gallery(){hud();const g=$('#grid');g.innerHTML='';for(const s of SCENES){const d=document.createElement('div');d.className='tile';const lk=!unlocked(s.pack);const c=document.createElement('canvas');thumb(s,c,S.done[s.id]);d.appendChild(c);
 d.insertAdjacentHTML('beforeend',`<b>${s.name}</b><small>${PACKS[s.pack].name} · ${s.n}×${s.n} · 🪙 ${s.reward}</small>`);
 if(S.done[s.id])d.insertAdjacentHTML('beforeend','<span class="done-badge">✓ x'+S.done[s.id]+'</span>');
 if(lk){d.classList.add('locked');d.insertAdjacentHTML('beforeend',`<div class="lock">🔒 Build a ${ITEMS.find(i=>i.unlock===s.pack).name} in your park to unlock</div>`)}
 else d.onclick=()=>openPage(s);g.appendChild(d)}}
// ---- coloring
const cv=$('#cv'),cx=cv.getContext('2d');let P=null,sel=0,filled,view={s:1,x:0,y:0},brush=false,flash=0;
function openPage(s){P=s;filled=(S.prog[s.id]||'0'.repeat(s.n*s.n)).split('');if(!filled.includes('0'))filled=filled.map(()=>'0');show('color');resize();
 const r=cv.getBoundingClientRect();const fit=Math.min(r.width,r.height)*.92/s.n;view={s:fit,x:(r.width-fit*s.n)/2,y:(r.height-fit*s.n)/2};sel=firstOpen();palette();draw()}
function firstOpen(){for(let k=0;k<P.cpal.length;k++)if(remaining(k))return k;return 0}
function remaining(k){let r=0;for(let i=0;i<filled.length;i++)if(filled[i]==='0'&&P.cells[i]===k)r++;return r}
function palette(){const p=$('#palette');p.innerHTML='';P.cpal.forEach((h,k)=>{const b=document.createElement('div');b.className='sw'+(k===sel?' sel':'')+(remaining(k)?'':' fin');b.style.background=h;
 const v=parseInt(h.slice(1),16),lum=((v>>16)*.3+((v>>8)&255)*.59+(v&255)*.11);b.style.color=lum>150?'#5b4636':'#fff';b.textContent=remaining(k)?k+1:'';b.onclick=()=>{sel=k;tone(440+k*40,.08);palette();draw()};p.appendChild(b)});
 const d=filled.filter(c=>c==='1').length;$('#pct').textContent=Math.floor(d/filled.length*100)+'%'}
function resize(){const r=cv.getBoundingClientRect(),dp=devicePixelRatio||1;cv.width=r.width*dp;cv.height=r.height*dp;cx.setTransform(dp,0,0,dp,0,0)}
function draw(){if(!P)return;const n=P.n,z=view.s;const r=cv.getBoundingClientRect();cx.clearRect(0,0,r.width,r.height);cx.save();cx.translate(view.x,view.y);
 cx.fillStyle='#fff';cx.fillRect(0,0,n*z,n*z);cx.font=`700 ${Math.max(8,z*.45)}px -apple-system,sans-serif`;cx.textAlign='center';cx.textBaseline='middle';
 for(let i=0;i<n*n;i++){const x=i%n,y=(i/n)|0,k=P.cells[i];if(filled[i]==='1'){cx.fillStyle=P.cpal[k];cx.fillRect(x*z,y*z,z+.5,z+.5)}
  else{cx.fillStyle=k===sel?(flash?'#f4a98b':'#d9cbbd'):'#f5efe8';cx.fillRect(x*z+.5,y*z+.5,z-1,z-1);if(z>=14){cx.fillStyle=k===sel?'#5b4636':'#b0a090';cx.fillText(k+1,x*z+z/2,y*z+z/2+1)}}}
 cx.restore()}
function cellAt(px,py){const x=Math.floor((px-view.x)/view.s),y=Math.floor((py-view.y)/view.s);if(x<0||y<0||x>=P.n||y>=P.n)return -1;return y*P.n+x}
function paint(i){if(i<0||filled[i]==='1')return;if(P.cells[i]!==sel){tone(180,.06,'sine',.03);return}filled[i]='1';tone(600+Math.random()*200,.05,'sine',.04);
 S.prog[P.id]=filled.join('');save();if(!remaining(sel)){palette();const nx=firstOpen();if(remaining(nx)){sel=nx;palette();tone(880,.2,'triangle')}else complete()}}
let ptrs=new Map(),gest=null;
cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.offsetX,y:e.offsetY});
 if(ptrs.size===1)gest={t:'tap',sx:e.offsetX,sy:e.offsetY,vx:view.x,vy:view.y};else if(ptrs.size===2){const [a,b]=[...ptrs.values()];gest={t:'pinch',d:Math.hypot(a.x-b.x,a.y-b.y),s:view.s,mx:(a.x+b.x)/2,my:(a.y+b.y)/2,vx:view.x,vy:view.y}}
 if(brush&&ptrs.size===1){paint(cellAt(e.offsetX,e.offsetY));draw()}});
cv.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId)||!gest)return;ptrs.set(e.pointerId,{x:e.offsetX,y:e.offsetY});
 if(gest.t==='pinch'&&ptrs.size===2){const [a,b]=[...ptrs.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);const ns=Math.min(80,Math.max(3,gest.s*d/gest.d));const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
  view.x=mx-(gest.mx-gest.vx)*ns/gest.s;view.y=my-(gest.my-gest.vy)*ns/gest.s;view.s=ns;draw()}
 else if(ptrs.size===1){if(brush){paint(cellAt(e.offsetX,e.offsetY));palette();draw();return}const dx=e.offsetX-gest.sx,dy=e.offsetY-gest.sy;if(gest.t==='pan'||Math.hypot(dx,dy)>8){gest.t='pan';view.x=gest.vx+dx;view.y=gest.vy+dy;draw()}}});
const up=e=>{if(gest&&gest.t==='tap'&&ptrs.size===1&&!brush){paint(cellAt(e.offsetX,e.offsetY));palette();draw()}ptrs.delete(e.pointerId);if(ptrs.size===0)gest=null;else gest={t:'none'}};
cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',e=>{ptrs.delete(e.pointerId);gest=null});
cv.addEventListener('wheel',e=>{e.preventDefault();const ns=Math.min(80,Math.max(3,view.s*(e.deltaY<0?1.15:.87)));view.x=e.offsetX-(e.offsetX-view.x)*ns/view.s;view.y=e.offsetY-(e.offsetY-view.y)*ns/view.s;view.s=ns;draw()},{passive:false});
$('#back').onclick=()=>show('gallery');
$('#brush').onclick=()=>{brush=!brush;$('#brush').textContent=brush?'🖌️ Brush':'✋ Pan';$('#brush').classList.toggle('on',brush)};
$('#hint').onclick=()=>{let i=filled.findIndex((c,i)=>c==='0'&&P.cells[i]===sel);if(i<0)return;const r=cv.getBoundingClientRect();view.s=Math.max(view.s,28);
 view.x=r.width/2-(i%P.n+.5)*view.s;view.y=r.height/2-(((i/P.n)|0)+.5)*view.s;let t=0;const iv=setInterval(()=>{flash=!flash;draw();if(++t>5){clearInterval(iv);flash=0;draw()}},180)};
window.addEventListener('resize',()=>{resize();draw();if(PK)parkDraw()});
function today(){const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
function complete(){const t=today();let bonus=0;if(S.last!==t){const y=new Date(Date.now()-864e5);const yd=y.getFullYear()+'-'+(y.getMonth()+1)+'-'+y.getDate();S.streak=S.last===yd?S.streak+1:1;S.last=t;bonus=Math.min(50,10*S.streak)}
 const earned=P.reward+bonus;S.coins+=earned;S.done[P.id]=(S.done[P.id]||0)+1;delete S.prog[P.id];save();hud();chime();
 // reveal: sweep animation
 const r=cv.getBoundingClientRect();const fit=Math.min(r.width,r.height)*.92/P.n;view={s:fit,x:(r.width-fit*P.n)/2,y:(r.height-fit*P.n)/2};let k=0;const N=P.n;
 const anim=()=>{draw();cx.save();cx.translate(view.x,view.y);cx.fillStyle='rgba(255,255,255,.55)';const band=k*N*2;for(let i=0;i<N*N;i++){const x=i%N,y=(i/N)|0;if(Math.abs(x+y-band)<2)cx.fillRect(x*view.s,y*view.s,view.s,view.s)}cx.restore();k+=.025;if(k<1.1)requestAnimationFrame(anim);else{draw();
  const c=document.createElement('canvas');modal(`<h3>✨ Beautiful! ✨</h3><div id="rv"></div><p style="font-size:20px">You earned <b>🪙 ${P.reward}</b>${bonus?` + <b>🔥 ${bonus}</b> daily streak bonus`:''}</p>`,'Visit my park 🏕️',()=>{show('park')});
  thumb(P,c,true);$('#rv').appendChild(c)}};anim()}
// ---- park
const PW=12,PH=8;let PK=null,pkx,shopSel=null,moving=null,walkers=[],pts=0;
function parkInit(){hud();if(!S.park){askName();return}PK=$('#pk');pkx=PK.getContext('2d');shop();parkSize();if(!walkers.length)loop()}
function askName(){modal('<h3>🏕️ Welcome!</h3><p>You just bought a little patch of land. What will you name your RV park?</p><input id="pn" maxlength="24" placeholder="e.g. Sunny Pines">','Open my park',()=>{const v=$('#pn').value.trim();if(!v)return false;S.park=v;save();chime();parkInit()});setTimeout(()=>$('#pn')&&$('#pn').focus(),50)}
function parkSize(){const w=$('#parkWrap').getBoundingClientRect();const t=Math.floor(Math.min((w.width-20)/PW,(w.height-20)/(PH+1.2)));PK.dataset.t=t;const dp=devicePixelRatio||1;PK.width=t*PW*dp;PK.height=t*(PH+1.2)*dp;PK.style.width=t*PW+'px';PK.style.height=t*(PH+1.2)+'px';pkx.setTransform(dp,0,0,dp,0,0);parkDraw()}
function shop(){const s=$('#shop');s.innerHTML='';for(const it of ITEMS){const d=document.createElement('div');d.className='item'+(shopSel===it.id?' sel':'')+(S.coins<it.p?' poor':'');
 const own=S.placed.some(o=>o.id===it.id);d.innerHTML=`<div class="e">${it.e}</div><b>${it.name}</b>🪙 ${it.p}${it.unlock&&!own?`<div class="u">Unlocks ${PACKS[it.unlock].name}</div>`:''}`;
 d.onclick=()=>{moving=null;if(S.coins<it.p){msg(`You need 🪙 ${it.p-S.coins} more. Color a picture to earn coins!`);tone(200,.1);return}shopSel=shopSel===it.id?null:it.id;msg(shopSel?`Tap an empty spot to place your ${it.name}.`:'Pick something from the shop, then tap a spot in your park.');tone(520,.06);shop()};s.appendChild(d)}}
function msg(t){$('#shopMsg').textContent=t}
function parkDraw(){if(!PK)return;const t=+PK.dataset.t,top=t*1.2;pkx.clearRect(0,0,PK.width,PK.height);
 pkx.fillStyle='#f3d9b1';pkx.fillRect(0,0,t*PW,top);pkx.fillStyle='#8a5a3a';pkx.fillRect(t*PW/2-t*2.6,top*.12,t*5.2,top*.76);pkx.fillStyle='#fff6e8';pkx.font=`800 ${t*.42}px -apple-system,sans-serif`;pkx.textAlign='center';pkx.textBaseline='middle';pkx.fillText('🌲 '+S.park+' RV Park 🌲',t*PW/2,top/2);
 for(let y=0;y<PH;y++)for(let x=0;x<PW;x++){pkx.fillStyle=(y===3||y===4)&&false?'#e8d3a8':((x+y)%2?'#a8d58e':'#b5dd9b');if(y===4)pkx.fillStyle='#ead6ae';pkx.fillRect(x*t,top+y*t,t,t)}
 pkx.font=`${t*.78}px sans-serif`;for(const o of S.placed){if(moving===o){pkx.globalAlpha=.4}pkx.fillText(IT[o.id].e,o.x*t+t/2,top+o.y*t+t/2+2);pkx.globalAlpha=1}
 pkx.font=`${t*.5}px sans-serif`;for(const w of walkers)pkx.fillText(w.e,w.x*t,top+w.y*t);
 if(!S.placed.length){pkx.fillStyle='#5b4636aa';pkx.font=`700 ${t*.4}px -apple-system,sans-serif`;pkx.fillText('Your park is empty. Buy your first campsite below!',t*PW/2,top+t*2)}}
const FOLK=['🧑','👵','👴','👧','👦','🧔','👩','🐕'];
function loop(){const want=Math.min(10,1+S.placed.filter(o=>['tent','rv','pool','playground','pond','store'].includes(o.id)).length);while(walkers.length<want)walkers.push({e:FOLK[walkers.length%FOLK.length],x:Math.random()*PW,y:4.5,tx:Math.random()*PW,ty:4.5});
 for(const w of walkers){const dx=w.tx-w.x,dy=w.ty-w.y,d=Math.hypot(dx,dy);if(d<.05){w.tx=.5+Math.random()*(PW-1);w.ty=Math.random()<.6?4.5:.5+Math.random()*(PH-1)}else{w.x+=dx/d*.012;w.y+=dy/d*.012}}
 if($('#park').classList.contains('on'))parkDraw();requestAnimationFrame(loop)}
function parkTap(e){const t=+PK.dataset.t,r=PK.getBoundingClientRect();const x=Math.floor((e.clientX-r.left)/t),y=Math.floor((e.clientY-r.top-t*1.2)/t);if(x<0||y<0||x>=PW||y>=PH)return;
 const here=S.placed.find(o=>o.x===x&&o.y===y);
 if(moving){if(here&&here!==moving){msg('That spot is taken. Pick an empty one.');return}moving.x=x;moving.y=y;moving=null;save();tone(700,.1);msg('Moved! Tap any decoration to move it again.');return}
 if(shopSel){if(here){msg('That spot is taken. Pick an empty one.');tone(200,.1);return}const it=IT[shopSel];if(S.coins<it.p)return;const newPack=it.unlock&&!unlocked(it.unlock);S.coins-=it.p;S.placed.push({id:it.id,x,y});save();hud();tone(660,.1);setTimeout(()=>tone(990,.15),90);
  if(S.coins<it.p)shopSel=null;shop();msg(`${it.name} placed! ${shopSel?'Tap to place another.':''}`);if(newPack){chime();modal(`<h3>🎉 New coloring pack!</h3><p>Your ${it.name} unlocked the <b>${PACKS[it.unlock].name}</b>. Check the gallery.</p>`)}return}
 if(here){moving=here;msg(`Tap a new spot for your ${IT[here.id].name}.`);tone(500,.06)}}
document.addEventListener('pointerup',e=>{if(e.target.id==='pk')parkTap(e)});
// ---- boot
hud();show('gallery');if(!S.park)setTimeout(askName,300);
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
