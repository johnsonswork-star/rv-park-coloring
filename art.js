// ---------- Cute piece art (kawaii faces), viewBox 0 0 100 100
const face=(y,x=50,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="-14" cy="5" rx="6" ry="3.6" fill="#ff7fa3" opacity=".45"/><ellipse cx="14" cy="5" rx="6" ry="3.6" fill="#ff7fa3" opacity=".45"/><circle cx="-8" cy="-2" r="4" fill="#5b3a4a"/><circle cx="8" cy="-2" r="4" fill="#5b3a4a"/><circle cx="-6.6" cy="-3.6" r="1.4" fill="#fff"/><circle cx="9.4" cy="-3.6" r="1.4" fill="#fff"/><path d="M-4 4q4 4 8 0" stroke="#5b3a4a" stroke-width="2.6" fill="none" stroke-linecap="round"/></g>`;
const PCOL=['#ff9fbf','#ffd166','#8ec9f0','#9edb8f','#ffb27a'];
const PNAME=['pink','yellow','blue','green','orange'];
const PIECES=[
// pink flower
`<g stroke="#ec7aa0" stroke-width="3.5" fill="#ffb3cc">${[0,72,144,216,288].map(a=>`<circle cx="${50+22*Math.sin(a*Math.PI/180)}" cy="${52-22*Math.cos(a*Math.PI/180)}" r="17"/>`).join('')}</g><circle cx="50" cy="52" r="20" fill="#fff0b3" stroke="#f0c75e" stroke-width="3"/><ellipse cx="40" cy="30" rx="6" ry="4" fill="#fff" opacity=".7"/>${face(53,50,.8)}`,
// yellow lantern
`<path d="M38 14h24" stroke="#b9805c" stroke-width="5" stroke-linecap="round"/><path d="M50 8v8" stroke="#b9805c" stroke-width="4" stroke-linecap="round"/><rect x="33" y="17" width="34" height="9" rx="4" fill="#d9a074" stroke="#b9805c" stroke-width="3"/><rect x="22" y="25" width="56" height="58" rx="24" fill="#ffd66b" stroke="#ebb33f" stroke-width="3.5"/><rect x="30" y="31" width="40" height="44" rx="18" fill="#fff1b0"/><rect x="34" y="82" width="32" height="8" rx="4" fill="#d9a074" stroke="#b9805c" stroke-width="3"/><ellipse cx="36" cy="38" rx="5" ry="7" fill="#fff" opacity=".8"/>${face(56)}`,
// blue mug
`<path d="M40 20q-6-7 0-12M54 20q-6-7 0-12" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".9"/><path d="M72 42h6a12 12 0 0 1 0 24h-6" stroke="#6aa8d8" stroke-width="7" fill="none"/><path d="M72 42h6a12 12 0 0 1 0 24h-6" stroke="#9fd2f5" stroke-width="3" fill="none"/><rect x="16" y="26" width="60" height="62" rx="18" fill="#9fd2f5" stroke="#6aa8d8" stroke-width="3.5"/><path d="M18 40h56" stroke="#fff" stroke-width="5" opacity=".6"/><ellipse cx="28" cy="52" rx="4" ry="9" fill="#fff" opacity=".6"/>${face(62,46)}`,
// green leaf
`<path d="M50 8C86 22 90 66 50 92C10 66 14 22 50 8Z" fill="#a8e29a" stroke="#6fbf6a" stroke-width="3.5"/><path d="M50 18v66" stroke="#7fcf77" stroke-width="3" stroke-linecap="round"/><path d="M50 40l-14-8M50 40l14-8" stroke="#7fcf77" stroke-width="3" stroke-linecap="round"/><ellipse cx="36" cy="30" rx="5" ry="8" fill="#fff" opacity=".6" transform="rotate(25 36 30)"/>${face(60)}`,
// orange acorn
`<path d="M50 8v10" stroke="#a06a48" stroke-width="5" stroke-linecap="round"/><path d="M24 54C22 76 38 92 50 92s28-16 26-38Z" fill="#ffbe8a" stroke="#ec9258" stroke-width="3.5"/><path d="M14 46c0-18 16-28 36-28s36 10 36 28c0 6-6 9-12 8H26c-6 1-12-2-12-8z" fill="#c98a5e" stroke="#a06a48" stroke-width="3.5"/><path d="M26 34l10 12M42 28l8 14M58 28l-6 14M74 34l-10 12" stroke="#b07a52" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="34" cy="64" rx="4" ry="7" fill="#fff" opacity=".6"/>${face(70)}`,
// rainbow cookie (special)
`<circle cx="50" cy="50" r="40" fill="#fff6e6" stroke="#f0c9a0" stroke-width="3.5"/>${['#ff9fbf','#ffd166','#9edb8f','#8ec9f0'].map((c,i)=>`<path d="M${22+i*7} 62a${28-i*7} ${28-i*7} 0 0 1 ${56-i*14} 0" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"/>`).join('')}<circle cx="30" cy="30" r="3" fill="#ff9fbf"/><circle cx="72" cy="34" r="3" fill="#8ec9f0"/><circle cx="66" cy="76" r="3" fill="#ffd166"/><circle cx="34" cy="76" r="3" fill="#9edb8f"/>`];
const STRIPE_H=`<g opacity=".85"><rect x="6" y="38" width="88" height="7" rx="3.5" fill="#fff"/><rect x="6" y="55" width="88" height="7" rx="3.5" fill="#fff"/></g><path d="M4 50l8-7v14zM96 50l-8-7v14z" fill="#fff"/>`;
const STRIPE_V=`<g transform="rotate(90 50 50)">${STRIPE_H}</g>`;
const COIN=`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#ffd166" stroke="#e9a93a" stroke-width="2"/><circle cx="12" cy="12" r="6" fill="none" stroke="#e9a93a" stroke-width="1.5"/><path d="M9 8.5q2-2 4 0" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>`;
const SPK_ON=`<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#f784a5"/><path d="M16 8.5q3 3.5 0 7M18.5 6q5 6 0 12" stroke="#f784a5" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`;
const SPK_OFF=`<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#d6b8c4"/><path d="M16 9l5 6M21 9l-5 6" stroke="#d6b8c4" stroke-width="2" stroke-linecap="round"/></svg>`;
const STAR=c=>`<svg viewBox="0 0 24 24"><path d="M12 1l2.6 7.4L22 9l-6 4.8L18 22l-6-4.4L6 22l2-8.2L2 9l7.4-.6z" fill="${c}" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/></svg>`;

// ---------- Level 1 scene: lakeside campsite at sunset. viewBox 0 0 600 400
// regions: [colorFamily 0-4, fill, path]. Families: 0 pink 1 yellow 2 blue 3 green 4 orange
const circ=(x,y,r)=>`M${x-r} ${y}a${r} ${r} 0 1 0 ${2*r} 0a${r} ${r} 0 1 0 ${-2*r} 0Z`;
const bulbs=(odd)=>{let d='';for(let i=1;i<12;i++){if(i%2!==odd)continue;const t=i/12,x=(1-t)**2*98+2*(1-t)*t*240+t*t*388,y=(1-t)**2*236+2*(1-t)*t*300+t*t*284+9;d+=`M${x-6} ${y}q0-8 6-8 6 0 6 8q0 7-6 7-6 0-6-7Z`}return d};
const flower=(x,y)=>[0,72,144,216,288].map(a=>circ(x+7*Math.sin(a*Math.PI/180),y-7*Math.cos(a*Math.PI/180),5.5)).join('');
const SCENE={w:600,h:400,regions:[
[0,'#f9c3d3','M0 0H600V140Q450 120 300 134T0 128Z'],
[4,'#fbc79a','M0 118Q150 102 300 116T600 120V262H0Z'],
[1,'#ffe39a',circ(300,196,50)],
[0,'#fde2ea','M70 82q8-24 34-18q14-22 40-6q26-4 30 18q16 4 8 16H68q-14-4 2-10Z'],
[0,'#fde2ea','M408 54q8-20 30-14q13-19 35-4q22-3 25 15q13 4 6 13H404q-12-3 4-10Z'],
[2,'#c3cdee','M0 236C40 200 70 168 100 160C130 168 150 196 170 208C200 172 230 146 256 146C290 150 330 200 360 222C400 186 430 166 456 168C500 176 550 214 600 232V270H0Z'],
[2,'#a9bce6','M0 258C60 214 110 220 160 246C210 220 260 216 320 252C380 214 440 210 500 240C540 226 570 230 600 246V276H0Z'],
[2,'#aedcec','M0 266H600V372H0Z'],
[1,'#fff0b8','M262 272Q300 266 338 272L328 281Q300 285 272 281ZM280 292Q300 288 320 292L313 299Q300 302 287 299ZM290 310Q300 307 310 310L306 316Q300 318 294 316Z'],
[0,'#f8cfdc','M50 288Q110 280 170 288Q110 295 50 288ZM430 300Q490 293 550 300Q490 307 430 300Z'],
[0,'#f6a9bd','M334 306q38 9 76 0q-4 11-38 12q-34-1-38-12Z'],
[3,'#b4dea6','M0 322C70 304 170 306 262 334V400H0Z'],
[3,'#a6d69a','M340 338C420 306 520 300 600 314V400H340Z'],
[3,'#c4e8b2','M0 362C120 344 220 348 300 352C400 346 500 348 600 364V400H0Z'],
[3,'#7fc49a','M62 180L98 246H82L110 300H14L42 246H26Z'],
[3,'#6db68b','M128 214L156 266H143L166 306H90L113 266H100Z'],
[3,'#7fc49a','M548 186L580 246H566L592 300H504L530 246H516Z'],
[3,'#93d0a2','M440 374q8-26 34-18q20-16 36 4q16-1 12 14Z'],
[4,'#d6996c','M56 300h12v16h-12ZM122 306h12v12h-12ZM542 300h12v16h-12Z'],
[4,'#f6a676','M212 250L268 334H156Z','translate(-20 14)'],
[4,'#eb8a62','M212 250L230 334H200Z','translate(-20 14)'],
[1,'#fff3d2','M384 282q0-18 18-18h96q24 0 28 22l6 30q2 13-11 13H396q-12 0-12-12Z','translate(0 22)'],
[0,'#f7a9be','M386 310H527L529 320H386Z','translate(0 22)'],
[2,'#bfe6f5','M400 276h26v18h-26ZM440 276h26v18h-26Z','translate(0 22)'],
[4,'#f4b183','M486 288h20v38h-20Z','translate(0 22)'],
[4,'#f9be8a','M480 262h50l10 14q-6 6-12 0q-6 6-12 0q-6 6-12 0q-6 6-12 0q-6 6-12 0Z','translate(0 22)'],
[4,'#d6996c','M272 368l52-12l4 8l-52 12ZM272 358l52 12l-4 8l-52-12Z','translate(0 8)'],
[4,'#f7955e','M300 304q24 24 15 46q-15 10-30 0q-9-22 15-46Z','translate(0 8)'],
[1,'#ffd86b','M300 324q11 13 7 24q-7 5-14 0q-4-11 7-24Z','translate(0 8)'],
[1,'#ffe27a',bulbs(1)],
[0,'#ffb3c8',bulbs(0)],
[0,'#ffa9c2',flower(70,372)+flower(108,384)+flower(170,378)],
[0,'#ffbfd2',flower(420,384)+flower(560,374)+flower(520,388)],
[1,'#ffe9a8',flower(236,388)+flower(372,382)]
],
// always-drawn ink details (wheels, string)
fixed:`<path d="M98 245Q240 300 388 293" stroke="#9c7f8c" stroke-width="2" fill="none"/><circle cx="414" cy="352" r="12" fill="#7a6170"/><circle cx="414" cy="352" r="5" fill="#d9c8d0"/><circle cx="500" cy="352" r="12" fill="#7a6170"/><circle cx="500" cy="352" r="5" fill="#d9c8d0"/>`};

// ---------- Procedural backdrop scenes, each featuring a park item. Families: 0 pink 1 yellow 2 blue 3 green 4 orange
const pineP=(x,b,h)=>{const w=h*.42;return `M${x} ${b-h}L${x+w*.75} ${b-h*.45}H${x+w*.4}L${x+w} ${b}H${x-w}L${x-w*.4} ${b-h*.45}H${x-w*.75}Z`};
const roundTree=(x,b,r)=>`M${x-r} ${b-r}a${r} ${r*.95} 0 1 1 ${2*r} 0q0 ${r*.7}-${r} ${r*.7}t-${r}-${r*.7}Z`;
const cloudP=(x,y,s)=>`M${x} ${y}q${8*s}-${24*s} ${34*s}-${18*s}q${14*s}-${22*s} ${40*s}-${6*s}q${26*s}-${4*s} ${30*s} ${18*s}q${16*s} ${4*s} ${8*s} ${16*s}H${x-2*s}q-${14*s}-${4*s} ${2*s}-${10*s}Z`;
const starsP=(seed,n)=>{let d='';for(let i=0;i<n;i++){const x=20+((i*137+seed*53)%560),y=14+((i*71+seed*29)%120);d+=`M${x} ${y-6}l2 4 4 2-4 2-2 4-2-4-4-2 4-2Z`}return d};
function backdrop(o){const R=[];const add=(f,c,d,t)=>R.push(t?[f,c,d,t]:[f,c,d]);
 add(o.sky[0][0],o.sky[0][1],'M0 0H600V150Q450 128 300 142T0 136Z');
 add(o.sky[1][0],o.sky[1][1],'M0 122Q150 106 300 120T600 124V262H0Z');
 if(o.night){add(1,'#fff1a8',starsP(1,7));add(1,'#ffe39a',starsP(2,6));add(1,'#fff6cf',circ(470,70,30))}
 else{add(1,o.sunC||'#ffe39a',circ(o.sunX||300,o.sunY||190,o.sunR||46));add(0,'#fde2ea',cloudP(70,82,1));add(0,'#fde8ef',cloudP(420,58,.85));if(o.cloud3)add(0,'#fbd3df',cloudP(250,40,.6))}
 add(2,o.mtn1||'#c3cdee','M0 236C40 200 70 168 100 160C130 168 150 196 170 208C200 172 230 146 256 146C290 150 330 200 360 222C400 186 430 166 456 168C500 176 550 214 600 232V280H0Z');
 add(2,o.mtn2||'#a9bce6','M0 258C60 214 110 220 160 246C210 220 260 216 320 252C380 214 440 210 500 240C540 226 570 230 600 246V290H0Z');
 if(o.lake){add(2,'#aedcec','M0 270H600V372H0Z');add(1,'#fff0b8','M262 278Q300 272 338 278L328 286Q300 290 272 286Z');add(0,'#f8cfdc','M50 292Q110 284 170 292Q110 299 50 292ZM430 304Q490 297 550 304Q490 311 430 304Z')}
 add(3,o.hill1||'#b4dea6','M0 318C70 300 170 304 262 330V400H0Z');add(3,o.hill2||'#a6d69a','M340 334C420 304 520 298 600 310V400H340Z');
 add(3,o.grass||'#c4e8b2','M0 362C120 344 220 348 300 352C400 346 500 348 600 364V400H0Z');
 if(o.path)add(4,'#f3d6aa','M262 400C270 380 290 366 300 352C310 366 330 380 338 400Z');
 (o.pines||[[62,300,120],[128,306,92],[548,300,114]]).forEach(([x,b,h],k)=>{add(3,['#7fc49a','#6db68b','#8fd0a6'][k%3],pineP(x,b,h));add(4,'#d6996c',`M${x-6} ${b}h12v14h-12Z`)});
 (o.autumn||[]).forEach(([x,b,r],k)=>{add(4,['#ffb27a','#f9a066'][k%2],roundTree(x,b-14,r));add(4,'#c98a5e',`M${x-5} ${b-16}h10v18h-10Z`)});
 add(3,'#93d0a2','M440 374q8-26 34-18q20-16 36 4q16-1 12 14Z');add(3,'#9cd69a','M40 386q6-20 26-14q16-12 28 4q12-1 9 10Z');
 add(0,'#ffa9c2',flower(70,378)+flower(108,388)+flower(170,384));add(0,'#ffbfd2',flower(420,388)+flower(560,378)+flower(520,392));add(1,'#ffe9a8',flower(236,390)+flower(372,386));
 if(o.extra)o.extra.forEach(r=>add(...r));
 return R}
const LEVELS=[
 {id:'lake',name:'Lakeside Sunset',item:'rv',regions:SCENE.regions,fixed:SCENE.fixed,spot:[455,305,95]},
 {id:'pond',name:'Duck Pond Meadow',item:'pond',feat:[300,372,250],spot:[300,322,120],regions:backdrop({sky:[[2,'#bfe3f5'],[2,'#d6eef8']],sunX:480,sunY:90,sunR:36,cloud3:1,mtn1:'#c9d6f2',hill1:'#b9e3a8',autumn:[[440,300,30]],pines:[[70,300,120],[150,306,90],[540,300,110]]})},
 {id:'fire',name:'Starry Campfire',item:'fire',feat:[300,372,150],spot:[300,330,90],regions:backdrop({night:1,sky:[[2,'#7f8fd0'],[0,'#c9a7d8']],mtn1:'#8c9ad6',mtn2:'#7b8ccc',hill1:'#86b98f',hill2:'#7aae86',grass:'#9ccc9a',path:1,autumn:[[470,312,34]]})},
 {id:'lights',name:'Twinkle Evening',item:'lights',feat:[300,262,420],spot:[300,200,170],regions:backdrop({sky:[[0,'#f3b8d8'],[4,'#fcc9a4']],sunX:300,sunY:215,sunR:40,lake:1,autumn:[[230,330,26],[380,334,28]]})},
 {id:'bench',name:'Picnic Morning',item:'bench',feat:[300,380,180],spot:[300,335,95],regions:backdrop({sky:[[1,'#fff0c2'],[0,'#fbd3df']],sunC:'#ffd27a',sunX:130,sunY:150,sunR:44,path:1,autumn:[[480,320,32],[420,330,24]]})},
 {id:'tent',name:'Pine Forest Camp',item:'tent',feat:[300,372,170],spot:[300,318,100],regions:backdrop({sky:[[4,'#fcd2b0'],[1,'#ffe8b0']],sunX:300,sunY:200,sunR:42,pines:[[50,300,130],[120,310,100],[480,304,120],[555,300,138],[410,316,86]],autumn:[[200,330,24]]})}
];
const STARTER_ITEMS=['trees','garden'];

// ---------- v4: distinct compositions per scene
const wave=(y,a,f,ph,bot=400,x0=0,x1=600)=>{let d=`M${x0} ${bot}L${x0} ${y}`;for(let i=0;i<=30;i++){const x=x0+(x1-x0)*i/30;d+=`L${x.toFixed(1)} ${(y+a*Math.sin(i/30*Math.PI*2*f+ph)).toFixed(1)}`}return d+`L${x1} ${bot}Z`};
const band=(y1,y2,a,f,ph)=>{let d='M0 '+y1;for(let i=0;i<=30;i++)d+=`L${600*i/30} ${(y1+a*Math.sin(i/30*6.283*f+ph)).toFixed(1)}`;for(let i=30;i>=0;i--)d+=`L${600*i/30} ${(y2+a*Math.sin(i/30*6.283*f+ph)).toFixed(1)}`;return d+'Z'};
const rectP=(x,y,w,h)=>`M${x} ${y}h${w}v${h}h${-w}Z`;
const bigFlower=(x,y,r)=>[0,45,90,135,180,225,270,315].map(a=>circ(x+r*Math.sin(a*Math.PI/180),y-r*Math.cos(a*Math.PI/180),r*.55)).join('');
const crescent=(x,y,r)=>`M${x} ${y-r}a${r} ${r} 0 1 0 ${r*.8} ${r*1.6}a${r*.8} ${r*.8} 0 1 1 ${-r*.8} ${-r*1.6}Z`;
const mush=(x,y,s)=>[`M${x-12*s} ${y}q0-${16*s} ${12*s}-${16*s}t${12*s} ${16*s}Z`,`M${x-4*s} ${y}h${8*s}v${10*s}h${-8*s}Z`];
const treeline=(base,h,n,seed)=>{let d=`M0 ${base+60}L0 ${base}`;for(let i=0;i<n;i++){const x=i*600/n,hh=h*(.7+.3*Math.sin(i*2.3+seed));d+=`L${x+300/n} ${base-hh}L${x+600/n} ${base}`}return d+`L600 ${base+60}Z`};
function scenePond(){const R=[];const a=(f,c,d)=>R.push([f,c,d]);
 a(2,'#bfe3f5',rectP(0,0,600,260));a(1,'#ffe39a',circ(500,78,38));a(1,'#fff2c2',[0,1,2,3,4,5,6,7].map(k=>{const t=k*Math.PI/4;return `M${500+50*Math.cos(t)} ${78+50*Math.sin(t)}l${10*Math.cos(t+.3)} ${10*Math.sin(t+.3)}l${8*Math.cos(t-1.2)} ${8*Math.sin(t-1.2)}Z`}).join(''));
 a(0,'#fde2ea',cloudP(60,90,1));a(0,'#fde8ef',cloudP(270,56,.7));a(0,'#fbd3df',band(200,230,6,1.5,0));
 a(2,'#b8d4ee',wave(214,14,1.3,1));a(3,'#b4dea6',wave(246,20,1.1,2));a(3,'#a6d69a',wave(286,16,1.6,.5));a(3,'#c4e8b2',wave(338,8,1,3));
 a(3,'#86c99a',roundTree(515,300,62));a(4,'#c98a5e',rectP(506,290,18,48));a(3,'#9edb8f',roundTree(92,292,40));a(4,'#c98a5e',rectP(86,286,12,34));
 a(4,'#e8b98a',[0,30,60,90,120,150].map(x=>rectP(x+8,318,8,36)).join('')+rectP(0,326,170,6)+rectP(0,340,170,6));
 a(1,'#ffd166',bigFlower(470,360,9)+bigFlower(540,350,8)+bigFlower(575,372,7));a(4,'#d98a4e',circ(470,360,6)+circ(540,350,5)+circ(575,372,4.5));
 a(0,'#ffa9c2',flower(40,380)+flower(80,388)+flower(130,382));a(0,'#ffbfd2',flower(200,392)+flower(400,390));
 a(2,'#9fd2f5','M150 200c-10-12-20-3-12 5c-7 7 4 12 12-5c10-12 20-3 12 5c7 7-4 12-12-5zM380 160c-8-10-16-2-10 4c-6 6 3 10 10-4c8-10 16-2 10 4c6 6-3 10-10-4z');
 return R}
function sceneFire(){const R=[];const a=(f,c,d)=>R.push([f,c,d]);
 a(2,'#7f8fd0',rectP(0,0,600,300));a(0,'#c9a7d8',band(150,300,10,1,0));a(0,'#e8c6e6','M0 130Q300 40 600 20L600 64Q300 96 0 176Z');
 a(1,'#fff6cf',crescent(470,80,34));a(1,'#fff1a8',starsP(1,8));a(1,'#ffe39a',starsP(3,7));
 a(2,'#6f7fc0',wave(230,22,1.4,1));a(3,'#5f9a7a',treeline(270,70,14,1));a(3,'#6fae86',treeline(300,50,10,4));a(3,'#8fc296',wave(318,8,1,2));
 a(4,'#ffc89a','M120 368a180 40 0 1 0 360 0a180 40 0 1 0-360 0Z');a(4,'#c98a5e',rectP(110,350,70,18)+rectP(420,350,70,18));
 a(4,'#f6a676','M70 330L110 260L150 330Z');a(1,'#fff1a8',[[200,300],[380,280],[520,320],[60,240],[260,250],[440,240]].map(([x,y])=>circ(x,y,4)).join(''));
 a(0,'#f6a9bd',mush(190,382,1)[0]+mush(560,386,.8)[0]);a(4,'#fff0e0',mush(190,382,1)[1]+mush(560,386,.8)[1]);
 return R}
function sceneLights(){const R=[];const a=(f,c,d)=>R.push([f,c,d]);
 a(0,'#f3b8d8',rectP(0,0,600,200));a(4,'#fcc9a4',band(150,250,8,1,1));a(1,'#ffe39a',circ(300,236,44));a(1,'#fff6cf',crescent(90,60,20));
 a(2,'#b9b0e0',wave(222,16,1.2,2));a(2,'#a9cfe8',rectP(0,250,600,90));a(1,'#fff0b8','M262 262Q300 256 338 262L328 270Q300 274 272 270ZM280 282Q300 278 320 282L313 289Q300 292 287 289Z');
 a(0,'#f8cfdc','M40 300Q110 292 180 300Q110 307 40 300ZM420 312Q490 305 560 312Q490 319 420 312Z');a(3,'#9cc9a0',wave(250,6,3,0,262,0,140)+wave(252,6,3,1,262,460,600));
 a(4,'#e8b98a',rectP(0,318,600,10)+[20,70,120,170,420,470,520,570].map(x=>rectP(x,328,8,26)).join(''));
 a(4,'#f4c99a',[0,1,2].map(k=>rectP(0,354+k*16,600,8)).join(''));a(4,'#e9b080',[0,1,2].map(k=>rectP(0,362+k*16,600,8)).join(''));
 a(0,'#f6a9bd','M40 352h40l-6 34h-28zM520 352h40l-6 34h-28z');a(3,'#8fd0a6','M60 352q-20-30-4-46q8 20 4 46q10-34 26-38q-6 24-26 38zM540 352q-20-30-4-46q8 20 4 46q10-34 26-38q-6 24-26 38z');
 a(1,'#ffd66b',rectP(196,368,22,26)+rectP(382,368,22,26));
 return R}
function sceneBench(){const R=[];const a=(f,c,d)=>R.push([f,c,d]);
 a(1,'#fff0c2',rectP(0,0,600,250));a(1,'#ffd27a',circ(110,96,40));a(1,'#ffe8a8',[0,1,2,3,4,5,6,7,8,9].map(k=>{const t=k*.628;return `M${110+52*Math.cos(t)} ${96+52*Math.sin(t)}L${110+74*Math.cos(t+.12)} ${96+74*Math.sin(t+.12)}L${110+74*Math.cos(t-.12)} ${96+74*Math.sin(t-.12)}Z`}).join(''));
 a(0,'#fde2ea',cloudP(260,70,.8));a(0,'#ff9fbf',circ(470,110,48));a(4,'#ffb27a','M470 62a22 48 0 1 0 0.1 0Z');a(2,'#8ec9f0','M470 62a8 48 0 1 0 0.1 0Z');a(4,'#c98a5e',rectP(458,168,24,18)+'M452 150l10 18M488 150l-10 18');
 a(2,'#b8d4ee',wave(232,14,1.6,2));a(3,'#b4dea6',wave(258,14,1.2,0));a(0,'#ffbfd2',band(282,292,8,1.2,1));a(3,'#a6d69a',wave(296,10,1.2,1));a(1,'#ffe48a',band(318,328,7,1.2,2));
 a(3,'#c4e8b2',wave(334,6,1,0));a(0,'#ffa9c2',band(354,362,5,1.2,1));a(4,'#f3d6aa','M250 400C270 370 300 330 296 252L304 252C306 330 340 370 350 400Z');
 a(3,'#86c99a',roundTree(40,300,34)+roundTree(570,290,30));a(4,'#c98a5e',rectP(34,296,12,24)+rectP(564,286,12,24));
 return R}
function sceneTent(){const R=[];const a=(f,c,d)=>R.push([f,c,d]);
 a(4,'#fcd2b0',rectP(0,0,600,240));a(1,'#ffe8b0',band(150,250,8,1,2));a(1,'#fff3c8','M330 0L400 0L250 400L200 400ZM430 0L460 0L340 400L310 400Z');
 a(2,'#b9c9e8',treeline(200,70,12,2));a(2,'#9fb3e0',treeline(240,60,10,5));a(3,'#8fd0a6',treeline(280,80,8,1));
 a(3,'#b4dea6',wave(312,8,1.2,1));a(4,'#e9c9a0','M150 372a150 30 0 1 0 300 0a150 30 0 1 0-300 0Z');
 a(4,'#c98a5e',rectP(0,0,46,400)+rectP(560,0,40,400));a(3,'#6db68b','M0 0h160q-20 40-80 50q-40 10-80 0zM600 0h-150q20 44 80 54q40 6 70-4z');
 const m1=mush(110,380,1.2),m2=mush(500,384,1),m3=mush(530,372,.7);a(0,'#f6a9bd',m1[0]+m2[0]+m3[0]);a(1,'#fff6e0',m1[1]+m2[1]+m3[1]);
 a(3,'#9edb8f','M60 396q-6-30 10-40q-2 20-10 40zM70 396q4-26 22-30q-8 18-22 30zM560 398q-6-30 10-40q-2 20-10 40z');a(0,'#ffbfd2',flower(200,392)+flower(420,394));
 return R}
LEVELS[1].regions=scenePond();LEVELS[2].regions=sceneFire();LEVELS[3].regions=sceneLights();LEVELS[4].regions=sceneBench();LEVELS[5].regions=sceneTent();
