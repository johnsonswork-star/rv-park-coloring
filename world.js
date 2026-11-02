// Large park world: 2600 x 1900 units, five zones.
const WW=2600,WH=1900,HUB=[1300,950];
const WZONES=[
 {id:'meadow',name:'Sunny Meadow',need:0,r:[900,0,1700,1900],c:[1300,1000]},
 {id:'lake',name:'Lakeside',need:2,r:[0,0,900,950],c:[450,470]},
 {id:'woods',name:'Pine Woods',need:4,r:[0,950,900,1900],c:[450,1420]},
 {id:'hill',name:'Hill Overlook',need:6,r:[1700,0,2600,950],c:[2150,470]},
 {id:'river',name:'Riverside',need:8,r:[1700,950,2600,1900],c:[2150,1420]}];
const LAKE={cx:430,cy:470,rx:280,ry:170};
const RIVER=[[2600,1060],[2360,1170],[2150,1110],[1960,1290],[2060,1520],[1890,1700],[1960,1900]];const RIVW=48;
const WPATHS=[
 {z:'meadow',d:'M1300 1900C1300 1700 1240 1200 1300 950'},
 {z:'meadow',d:'M1080 950C1080 850 1180 800 1300 800C1420 800 1520 850 1520 950C1520 1050 1420 1100 1300 1100C1180 1100 1080 1050 1080 950'},
 {z:'lake',d:'M1300 950C1100 900 1000 720 760 690'},
 {z:'woods',d:'M1300 950C1100 1060 950 1300 620 1400'},
 {z:'hill',d:'M1300 950C1500 850 1620 600 2060 500'},
 {z:'river',d:'M1300 950C1500 1100 1700 1380 2260 1500'}];
function rng(seed){return ()=>{seed=(seed*16807)%2147483647;return seed/2147483647}}
function segDist(px,py,a,b){const dx=b[0]-a[0],dy=b[1]-a[1];const t=Math.max(0,Math.min(1,((px-a[0])*dx+(py-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(px-a[0]-t*dx,py-a[1]-t*dy)}
function onWater(x,y){if(((x-LAKE.cx)/LAKE.rx)**2+((y-LAKE.cy)/LAKE.ry)**2<1)return true;for(let i=0;i<RIVER.length-1;i++)if(segDist(x,y,RIVER[i],RIVER[i+1])<RIVW+6)return true;return false}
const zoneAt=(x,y)=>WZONES.find(z=>x>=z.r[0]&&x<z.r[2]&&y>=z.r[1]&&y<z.r[3])||WZONES[0];
const riverD=()=>{let d=`M${RIVER[0][0]} ${RIVER[0][1]}`;for(let i=1;i<RIVER.length;i++){const p=RIVER[i-1],q=RIVER[i];d+=` Q${p[0]} ${p[1]} ${(p[0]+q[0])/2} ${(p[1]+q[1])/2}`}return d+` L${RIVER.at(-1)[0]} ${RIVER.at(-1)[1]}`};
function worldSVG(name){const r=rng(7);let s=`<svg id="wsvg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs>
<radialGradient id="wg" cx=".5" cy=".5" r=".75"><stop offset="0" stop-color="#d4f0bf"/><stop offset="1" stop-color="#b6e0a2"/></radialGradient>
<radialGradient id="hillg" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#e3f6cf"/><stop offset="1" stop-color="#c2e6ac"/></radialGradient>
<linearGradient id="lakeg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe6f5"/><stop offset="1" stop-color="#93cde6"/></linearGradient>
<filter id="mistf" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="40"/></filter><filter id="cblur"><feGaussianBlur stdDeviation="6"/></filter></defs>
<g id="cam"><rect width="${WW}" height="${WH}" fill="url(#wg)"/>`;
 s+=`<g filter="url(#mistf)" opacity=".45"><ellipse cx="450" cy="470" rx="440" ry="380" fill="#d9f2cc"/><ellipse cx="450" cy="1420" rx="430" ry="420" fill="#9fd08e"/><ellipse cx="2150" cy="1420" rx="430" ry="420" fill="#cdeccd"/></g>`;
 // hill rings
 for(let k=0;k<4;k++)s+=`<ellipse cx="2160" cy="430" rx="${420-k*90}" ry="${300-k*65}" fill="${['#c5e8ae','#cfeeb8','#d9f2c4','#e4f7d2'][k]}" stroke="#b5dc9c" stroke-width="3"/>`;
 // soft light blobs
 for(let i=0;i<40;i++)s+=`<ellipse cx="${r()*WW}" cy="${r()*WH}" rx="${80+r()*120}" ry="${50+r()*70}" fill="#fff" opacity=".12"/>`;
 // lake
 s+=`<ellipse cx="${LAKE.cx}" cy="${LAKE.cy+10}" rx="${LAKE.rx+22}" ry="${LAKE.ry+20}" fill="#e6d7b0"/><ellipse cx="${LAKE.cx}" cy="${LAKE.cy}" rx="${LAKE.rx}" ry="${LAKE.ry}" fill="url(#lakeg)" stroke="${INK}" stroke-width="4"/>`;
 for(let i=0;i<9;i++){const a=r()*6.28,d=.4+r()*.45;s+=`<ellipse cx="${LAKE.cx+Math.cos(a)*LAKE.rx*d}" cy="${LAKE.cy+Math.sin(a)*LAKE.ry*d}" rx="18" ry="9" fill="#9edb8f" stroke="${INK}" stroke-width="2"/>`}
 for(let i=0;i<6;i++)s+=`<path class="wave" d="M${LAKE.cx-160+r()*260} ${LAKE.cy-80+r()*160}q20-10 40 0" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>`;
 s+=`<path d="M690 520h120v24h-120z" fill="#d9a074" stroke="${INK}" stroke-width="3"/><path d="M700 544v26M800 544v26" stroke="${INK}" stroke-width="5"/>`;
 for(let i=0;i<8;i++){const x=180+i*28,y=330+(i%3)*10;s+=`<path d="M${x} ${y}q-4-30 2-46" stroke="#7fc49a" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="${x+2}" cy="${y-46}" rx="4" ry="10" fill="#c48e68"/>`}
 // river + stones
 s+=`<path d="${riverD()}" stroke="#e6d7b0" stroke-width="${RIVW*2+30}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${riverD()}" stroke="#a9dcef" stroke-width="${RIVW*2}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path class="flow" d="${riverD()}" stroke="#fff" stroke-width="5" stroke-dasharray="20 60" fill="none" opacity=".7"/>`;
 for(let i=0;i<14;i++){const j=Math.floor(r()*(RIVER.length-1)),p=RIVER[j];s+=`<ellipse cx="${p[0]+(r()-.5)*240}" cy="${p[1]+(r()-.5)*160}" rx="${12+r()*10}" ry="${8+r()*6}" fill="#e3dcd8" stroke="${INK}" stroke-width="2"/>`}
 // paths
 for(const p of WPATHS)s+=`<path d="${p.d}" stroke="#e2c89c" stroke-width="64" fill="none" stroke-linecap="round"/>`;
 for(const p of WPATHS)s+=`<path class="wp" data-z="${p.z}" d="${p.d}" stroke="#f3e2c0" stroke-width="50" fill="none" stroke-linecap="round"/>`;
 for(const p of WPATHS)s+=`<path d="${p.d}" stroke="#fff" stroke-width="3" stroke-dasharray="2 26" fill="none" stroke-linecap="round" opacity=".7"/>`;
 s+=`<g id="bridge"></g>`;
 // grass tufts
 for(let i=0;i<170;i++){const x=r()*WW,y=r()*WH;if(onWater(x,y))continue;s+=`<path class="tuft" style="animation-delay:${(r()*3).toFixed(2)}s" d="M${x} ${y}q-3-14-8-18M${x} ${y}q0-16 2-22M${x} ${y}q4-12 9-16" stroke="${r()<.5?'#8cc87c':'#9fd38d'}" stroke-width="3" fill="none" stroke-linecap="round"/>`}
 // wildflowers
 const FC=['#ff9fbf','#ffd166','#ffffff','#c9a7f0','#ffb27a'];for(let i=0;i<70;i++){const x=900+r()*800,y=r()*WH;s+=`<circle cx="${x}" cy="${y}" r="4" fill="${FC[i%5]}" stroke="${INK}" stroke-width="1.2"/>`}
 for(let i=0;i<60;i++){const x=1720+r()*860,y=980+r()*900;if(onWater(x,y))continue;s+=`<circle cx="${x}" cy="${y}" r="5" fill="${FC[(i+2)%5]}" stroke="${INK}" stroke-width="1.2"/>`}
 // backdrop scenery (non-blocking): pine woods, lake trees, willows, hill rocks + overlook deck
 const sc=[];for(let i=0;i<46;i++){const x=40+r()*820,y=1000+r()*860;if(Math.abs(y-1400+(x-620)*.2)<60&&x>560)continue;sc.push([y,pine(x,y,.8+r()*.6,['#7fc49a','#6db68b','#86c99a'][i%3])])}
 for(let i=0;i<10;i++){const x=40+r()*820,y=60+r()*840;if(onWater(x,y+30)||Math.hypot(x-760,y-690)<120)continue;sc.push([y,pine(x,y,.7+r()*.4)])}
 for(let i=0;i<9;i++){const x=1740+r()*820,y=1000+r()*860;if(onWater(x,y))continue;sc.push([y,`<g transform="translate(${x} ${y})"><ellipse cy="4" rx="40" ry="10" fill="#00000014"/><rect x="-6" y="-40" width="12" height="44" rx="4" fill="#c48e68" stroke="${INK}" stroke-width="2.5"/><path d="M-50-30q-10-50 50-60q60 10 50 60q-20 14-50 6q-30 8-50-6z" fill="#a8dc9c" stroke="${INK}" stroke-width="2.5"/><path d="M-30-40v30M0-50v36M30-40v30" stroke="#8ccc85" stroke-width="3"/></g>`])}
 for(let i=0;i<8;i++){const x=1760+r()*800,y=80+r()*820;sc.push([y,`<ellipse cx="${x}" cy="${y}" rx="${16+r()*16}" ry="${10+r()*8}" fill="#e6e0dc" stroke="${INK}" stroke-width="2.5"/>`])}
 sc.push([300,`<g transform="translate(2160 300)"><rect x="-80" y="-10" width="160" height="40" rx="8" fill="#f4c99a" stroke="${INK}" stroke-width="3"/><path d="M-80 0h160M-70-10v-30M70-10v-30M-70-40h140" stroke="${INK}" stroke-width="4" fill="none"/><text y="-50" text-anchor="middle" font-family="Fredoka" font-weight="600" font-size="22" fill="#b07890">Overlook</text></g>`]);
 for(let i=0;i<10;i++){const x=940+r()*720,y=60+r()*1800;if(Math.abs(x-1300)<90||Math.hypot(x-1300,y-950)<260)continue;sc.push([y,bush(x,y,1.1)])}
 sc.sort((a,b)=>a[0]-b[0]);s+=`<g id="scenery">${sc.map(x=>x[1]).join('')}</g>`;
 s+=`<g id="items"></g><g id="walkers"></g><g id="ghost"></g><g id="butterflies"></g>`;
 // name sign at hub
 const nm=(name||'My Park').slice(0,22).replace(/[<&>]/g,''),w=Math.max(260,nm.length*19+80);
 s+=`<g transform="translate(1300 690)"><path d="M${-w/2+26} 40v50M${w/2-26} 40v50" stroke="#b9805c" stroke-width="10" stroke-linecap="round"/><rect x="${-w/2}" y="-16" width="${w}" height="64" rx="22" fill="#ffd9b8" stroke="${INK}" stroke-width="3.5"/><rect x="${-w/2+9}" y="-8" width="${w-18}" height="48" rx="16" fill="#fff4e6"/><text x="0" y="26" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="30" fill="#e0789a">${nm}</text><circle cx="${-w/2+10}" cy="-12" r="11" fill="#ff9fbf" stroke="${INK}" stroke-width="2"/><circle cx="${w/2-10}" cy="-12" r="11" fill="#9edb8f" stroke="${INK}" stroke-width="2"/></g>`;
 for(const z of WZONES.slice(1))s+=`<g class="zlabel" transform="translate(${z.c[0]} ${z.c[1]-200})"><rect x="-90" y="-24" width="180" height="40" rx="20" fill="#fff" opacity=".85"/><text y="4" text-anchor="middle" font-family="Fredoka" font-weight="600" font-size="22" fill="#b07890">${z.name}</text></g>`;
 s+=`<g id="mist"></g><g id="clouds"></g><g id="birds"></g></g>`;
 return s+`<style>.tuft{animation:sway 3s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 100%}@keyframes sway{from{transform:rotate(-6deg)}to{transform:rotate(6deg)}}.flow{animation:flow 3s linear infinite}@keyframes flow{to{stroke-dashoffset:-80}}.wave{animation:tw 3s ease-in-out infinite}.bulb{animation:tw 2.4s infinite}@keyframes tw{50%{opacity:.5}}.flame{animation:fl .8s infinite alternate;transform-box:fill-box;transform-origin:50% 100%}@keyframes fl{to{transform:scale(1.06,.94)}}.wing{animation:flap .25s infinite alternate;transform-box:fill-box;transform-origin:50% 50%}@keyframes flap{to{transform:scaleX(.2)}}.newitem{animation:born .6s cubic-bezier(.3,1.6,.5,1);transform-box:fill-box;transform-origin:50% 90%}@keyframes born{0%{transform:scale(0)}70%{transform:scale(1.2)}100%{transform:scale(1)}}</style></svg>`}
const BUTTERFLY=c=>`<g><path class="wing" d="M0 0c-12-14-22-4-14 6c-8 8 4 14 14-6c12-14 22-4 14 6c8 8-4 14-14-6z" fill="${c}" stroke="${INK}" stroke-width="1.5"/><path d="M0-6v12" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/></g>`;
const BIRD=`<path d="M-16 0q8-10 16 0q8-10 16 0" stroke="#7a6170" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
const CLOUD=`<g><ellipse cx="10" cy="150" rx="150" ry="36" fill="#5a7a5a" opacity=".06"/><g filter="url(#cblur)" opacity=".5"><ellipse cx="0" cy="0" rx="110" ry="46" fill="#fff"/><ellipse cx="-50" cy="-24" rx="60" ry="44" fill="#fff"/><ellipse cx="40" cy="-34" rx="70" ry="50" fill="#fff"/></g></g>`;
