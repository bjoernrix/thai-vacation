'use strict';
/* =========================================================
   THAI VACATION – Alpha (Phase 3)
   Level 1: Hua Hin – 4 Stages + Boss (Saenchai)
   ========================================================= */
const W=960,H=540,GRAV=1900;
let GROUND=452,WORLD=3240;
const cv=document.getElementById('c'),ctx=cv.getContext('2d');
const rand=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),sgn=v=>v<0?-1:1;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
const prect=p=>({x:p.x-p.w/2,y:p.y-p.h,w:p.w,h:p.h});

/* ---------------- Input ---------------- */
const keys={},press={};
const KEYMAP=[
  {l:'KeyA',r:'KeyD',j:'KeyW',g:'KeyS',a:['KeyF','KeyG','KeyH','KeyT']},
  {l:'ArrowLeft',r:'ArrowRight',j:'ArrowUp',g:'ArrowDown',a:['Comma','Period','Slash','Semicolon']}
];
const BLOCK=['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Slash','Quote','Tab'];
addEventListener('keydown',e=>{
  if(BLOCK.includes(e.code))e.preventDefault();
  if(!keys[e.code])press[e.code]=true;
  keys[e.code]=true;initAudio();
});
addEventListener('keyup',e=>{keys[e.code]=false;});
addEventListener('pointerdown',initAudio);
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;});
const prevHeld=[{},{}];
let soloChar=0; // 0=Rix, 1=HGM im Solo-Modus
let numPlayers=1; // 1 = Solo (Rix), 2 = Koop
function readInput(i){
  const m=KEYMAP[i];
  const h={l:!!keys[m.l],r:!!keys[m.r],j:!!keys[m.j],g:!!keys[m.g],a0:!!keys[m.a[0]],a1:!!keys[m.a[1]],a2:!!keys[m.a[2]],a3:!!keys[m.a[3]]};
  if(i===0&&numPlayers===1){
    const n=KEYMAP[1];
    h.l=h.l||!!keys[n.l];h.r=h.r||!!keys[n.r];h.j=h.j||!!keys[n.j];h.g=h.g||!!keys[n.g];
    h.a0=h.a0||!!keys[n.a[0]];h.a1=h.a1||!!keys[n.a[1]];h.a2=h.a2||!!keys[n.a[2]];h.a3=h.a3||!!keys[n.a[3]];
  }
  let gp=null;
  try{gp=navigator.getGamepads?navigator.getGamepads()[i]:null;}catch(e){}
  if(gp){
    const b=n=>!!(gp.buttons[n]&&gp.buttons[n].pressed),ax=gp.axes[0]||0,ay=gp.axes[1]||0;
    h.l=h.l||ax<-.4||b(14);h.r=h.r||ax>.4||b(15);h.j=h.j||b(0);h.g=h.g||b(4)||b(6)||ay>.7;
    h.a0=h.a0||b(2);h.a1=h.a1||b(3);h.a2=h.a2||b(1);h.a3=h.a3||b(5)||b(7);
  }
  const ph=prevHeld[i],e={};
  const codes={l:[m.l],r:[m.r],j:[m.j],g:[m.g],a0:[m.a[0]],a1:[m.a[1]],a2:[m.a[2]],a3:[m.a[3]]};
  if(i===0&&numPlayers===1){const n=KEYMAP[1];codes.l.push(n.l);codes.r.push(n.r);codes.j.push(n.j);codes.g.push(n.g);for(let k=0;k<4;k++)codes['a'+k].push(n.a[k]);}
  for(const k in h)e[k]=(h[k]&&!ph[k])||codes[k].some(c=>press[c]); // auch sehr kurze Tastendrücke zwischen zwei Frames zählen
  prevHeld[i]=h;
  return {h,e};
}

/* ---------------- Speicherstand (localStorage, optional) ---------------- */
let SAVE={unlocked:0,best:{}};
try{const s=localStorage.getItem('thaiVacationAlpha');if(s)SAVE=Object.assign(SAVE,JSON.parse(s));}catch(e){}
function saveGame(){try{localStorage.setItem('thaiVacationAlpha',JSON.stringify(SAVE));}catch(e){}}

/* ---------------- Audio ---------------- */
let AC=null,MASTER=null,MUSIC=null,NOISE=null,MUSIC_ON=true;
function initAudio(){
  if(AC){if(AC.state==='suspended')AC.resume();return;}
  try{
    AC=new (window.AudioContext||window.webkitAudioContext)();
    MASTER=AC.createGain();MASTER.gain.value=.55;MASTER.connect(AC.destination);
    MUSIC=AC.createGain();MUSIC.gain.value=MUSIC_ON?.32:0;MUSIC.connect(AC.destination);
    const len=AC.sampleRate;NOISE=AC.createBuffer(1,len,AC.sampleRate);
    const d=NOISE.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
    if(music.want)playMusic(music.want);
  }catch(e){AC=null;}
}
function noiseAt(t,dur,freq,q,type,vol,sweepTo,dest){
  if(!AC)return;
  const s=AC.createBufferSource();s.buffer=NOISE;
  const f=AC.createBiquadFilter();f.type=type;f.frequency.setValueAtTime(freq,t);
  if(sweepTo)f.frequency.exponentialRampToValueAtTime(sweepTo,t+dur);
  f.Q.value=q;const g=AC.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);
  s.connect(f);f.connect(g);g.connect(dest||MASTER);s.start(t);s.stop(t+dur+.05);
}
function noiseBurst(dur,freq,q,type,vol,sweepTo){if(AC)noiseAt(AC.currentTime,dur,freq,q,type,vol,sweepTo);}
function toneAt(t,type,f0,f1,dur,vol,dest){
  if(!AC)return;
  const o=AC.createOscillator();o.type=type;o.frequency.setValueAtTime(f0,t);
  o.frequency.exponentialRampToValueAtTime(Math.max(1,f1),t+dur);
  const g=AC.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);
  o.connect(g);g.connect(dest||MASTER);o.start(t);o.stop(t+dur+.05);
}
function tone(type,f0,f1,dur,vol,delay){if(AC)toneAt(AC.currentTime+(delay||0),type,f0,f1,dur,vol);}
function rumble(f0,f1,dur,vol,lfoHz){
  if(!AC)return;const t=AC.currentTime;
  const o=AC.createOscillator();o.type='sawtooth';o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+dur);
  const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=650;
  const g=AC.createGain();g.gain.value=vol*.5;
  const l=AC.createOscillator();l.type='square';l.frequency.value=lfoHz;
  const lg=AC.createGain();lg.gain.value=vol*.5;l.connect(lg);lg.connect(g.gain);
  const env=AC.createGain();env.gain.setValueAtTime(1,t);env.gain.exponentialRampToValueAtTime(.001,t+dur);
  o.connect(lp);lp.connect(g);g.connect(env);env.connect(MASTER);
  o.start(t);l.start(t);o.stop(t+dur+.05);l.stop(t+dur+.05);
}
function ohwee(ci,big){
  if(!AC)return;const t=AC.currentTime;
  const base=ci===0?105:190,dur=big?.9:.55;
  const o=AC.createOscillator();o.type='sawtooth';
  o.frequency.setValueAtTime(base*1.15,t);
  o.frequency.linearRampToValueAtTime(base*1.3,t+dur*.25);
  o.frequency.linearRampToValueAtTime(base*.8,t+dur);
  const vib=AC.createOscillator();vib.frequency.value=ci===0?5:7;
  const vg=AC.createGain();vg.gain.value=base*(big?.1:.05);vib.connect(vg);vg.connect(o.frequency);
  const env=AC.createGain();env.gain.setValueAtTime(.001,t);env.gain.exponentialRampToValueAtTime(.9,t+.04);
  env.gain.setValueAtTime(.9,t+dur*.8);env.gain.exponentialRampToValueAtTime(.001,t+dur);
  const b1=AC.createBiquadFilter(),b2=AC.createBiquadFilter();
  b1.type=b2.type='bandpass';b1.Q.value=b2.Q.value=7;
  b1.frequency.setValueAtTime(450,t);b1.frequency.setValueAtTime(450,t+dur*.3);b1.frequency.linearRampToValueAtTime(620,t+dur*.45);
  b2.frequency.setValueAtTime(820,t);b2.frequency.setValueAtTime(820,t+dur*.3);b2.frequency.linearRampToValueAtTime(2000,t+dur*.45);
  const g1=AC.createGain(),g2=AC.createGain();g1.gain.value=1.4;g2.gain.value=1;
  o.connect(b1);o.connect(b2);b1.connect(g1);b2.connect(g2);g1.connect(env);g2.connect(env);env.connect(MASTER);
  o.start(t);vib.start(t);o.stop(t+dur+.05);vib.stop(t+dur+.05);
}
const SFX={
  whoosh(){noiseBurst(.12,1800,1,'bandpass',.12,500);},
  thump(p){p=p||1;noiseBurst(.1,900*p,.8,'lowpass',.5,120);tone('sine',150,45,.14,.6*p);},
  block(){tone('square',300,200,.06,.15);noiseBurst(.05,3000,2,'highpass',.15);},
  ding(){tone('sine',1320,1310,.9,.22);tone('sine',1980,1970,.6,.08);},
  glug(){for(let i=0;i<3;i++)tone('sine',300+i*80,180+i*40,.09,.3,i*.11);},
  burp(){rumble(110,55,.6,.6,26);},
  fart(){rumble(72,44,.55,.55,55);noiseBurst(.4,300,1,'lowpass',.15);},
  coconut(){tone('triangle',520,260,.12,.25);noiseBurst(.08,1200,1,'bandpass',.2);},
  throwme(){tone('sawtooth',300,900,.25,.18);},
  jump(){tone('sine',260,520,.12,.12);},
  land(){noiseBurst(.07,500,.8,'lowpass',.3,150);tone('sine',110,60,.08,.25);},
  step(){noiseBurst(.035,2400+Math.random()*600,1.2,'bandpass',.07);},
  hit(k){ // 0 Faust · 1 Schienbein · 2 Knie · 3 Ellbogen
    if(k===1){noiseBurst(.1,700,.9,'lowpass',.55,100);tone('sine',120,40,.18,.7);noiseBurst(.05,3500,1,'highpass',.2);}
    else if(k===2){tone('sine',170,55,.12,.6);noiseBurst(.06,1200,1,'lowpass',.4);}
    else if(k===3){tone('square',420,90,.07,.28);noiseBurst(.06,4200,1,'highpass',.35);tone('sine',140,45,.14,.55);}
    else{noiseBurst(.06,1500,1,'lowpass',.4,300);tone('sine',200,70,.08,.5);}
  },
  gong(){tone('sine',196,190,1.2,.25);tone('sine',293,288,1,.12);noiseBurst(.4,3000,1,'bandpass',.05);},
  clear(){[523,659,784,1047].forEach((f,i)=>tone('triangle',f,f,.35,.2,i*.12));},
  over(){[392,330,262,196].forEach((f,i)=>tone('sawtooth',f,f*.97,.4,.14,i*.2));},
  grunt(type){
    const b={dog:[420,260],monkey:[900,620],oma:[300,230],masseuse:[330,250],tourist:[170,120],drunk:[150,95],rowdy:[200,140],bouncer:[100,70],pirat:[130,90]}[type]||[200,140];
    tone(type==='dog'?'square':'sawtooth',b[0]*(.9+Math.random()*.2),b[1],.16,.14);
  },
  ohwee
};

/* ---------------- Musik (Synth-Sequencer, Platzhalter) ---------------- */
const music={track:null,want:null,step:0,next:0,timer:null,intens:1,phase:0};
const P=s=>s.split(' ').map(v=>v==='.'?-1:+v);
const TRACKS={
  day:  {bpm:118,root:130.8,sc:[0,2,4,7,9],k:'x...x...x...x.x.',s:'....x.......x...',h:'x.x.x.x.x.x.x.xx',lead:'ranat',
         bass:P('0 . . 0 . 2 . . 0 . . 0 . 4 3 .'),
         mel:P('7 . 9 . 10 . 9 7 . . 5 . 7 . . . 9 . 10 . 12 . 10 9 . . 7 . 5 . 4 .')},
  night:{bpm:98,root:110,sc:[0,3,5,7,10],k:'x..x..x...x..x..',s:'....x..x....x...',h:'..x...x...x...x.',lead:'ranat',
         bass:P('0 . 0 . . 0 . 2 . . 0 . . 3 . .'),
         mel:P('5 . . 7 . 8 . . 7 . 5 . . 3 . . 5 . . 7 . 10 . 8 . . 7 . . 5 . . .')},
  coast:{bpm:88,root:146.8,sc:[0,2,4,7,9],k:'x.......x.......',s:'........x.......',h:'..x...x...x...x.',lead:'ranat',
         bass:P('0 . . . . . 2 . 0 . . . . . 4 .'),
         mel:P('9 . . 7 . . 4 . 5 . . . 7 . . . 9 . . 10 . . 12 . 10 . . 9 . . . .')},
  bars: {bpm:126,root:82.4,sc:[0,3,5,7,10],k:'x...x...x...x...',s:'....x.......x...',h:'.x.x.x.x.x.x.x.x',lead:'pi',
         bass:P('0 0 . 0 . 0 3 . 0 0 . 0 . 5 3 .'),
         mel:P('10 . . 8 . 7 . . 8 . 10 . 12 . . . 10 . . 8 . 7 . 5 . 7 . 8 . . . .')},
  boss: {bpm:148,root:82.4,sc:[0,1,5,7,8],k:'x..xx..xx..xx.x.',s:'....x..x....x.xx',h:'xxxxxxxxxxxxxxxx',lead:'pi',
         bass:P('0 . 0 0 . 0 . 1 0 . 0 0 . 1 . 0'),
         mel:P('10 . 11 10 . 8 . 7 10 . 11 10 . 13 12 . 10 . 11 10 . 8 . 7 5 . 7 8 . 7 . .')}
};
function note(T,deg){const n=T.sc.length;return T.root*Math.pow(2,(T.sc[((deg%n)+n)%n]+12*Math.floor(deg/n))/12);}
function schedStep(T,s,t){
  const i=s%16,inten=music.intens,ph=music.phase||0,spb=60/T.bpm/4;
  const busy=inten>=.8; // Kampf = volle Band, Laufphase = ruhiger Groove
  if(T.k[i]==='x'&&(busy||i%8===0)){toneAt(t,'sine',140,42,.16,.9,MUSIC);}
  if(T.s[i]==='x'&&busy){noiseAt(t,.12,1800,.7,'bandpass',.5,null,MUSIC);toneAt(t,'triangle',220,140,.08,.3,MUSIC);}
  if((T.h[i]==='x'&&busy)||(!busy&&i%4===2)){noiseAt(t,.04,7000,1,'highpass',busy?.16:.09,null,MUSIC);}
  if(ph>=1&&busy&&i%2===1){noiseAt(t,.03,8000,1,'highpass',.1,null,MUSIC);}
  if(ph>=2&&busy&&i%4===3){noiseAt(t,.08,2200,.7,'bandpass',.22,null,MUSIC);}
  if(i===0){for(const dg of [0,2,4]){const f=note(T,dg)*.5;toneAt(t,'sine',f,f,spb*15,busy?.045:.08,MUSIC);}} // Pad-Akkord
  const b=T.bass[s%T.bass.length];
  if(b>=0){toneAt(t,'triangle',note(T,b),note(T,b)*.99,.18,.55,MUSIC);}
  let m=T.mel[s%T.mel.length];
  if(m>=0&&Math.floor(s/T.mel.length)%2===1&&s%4===0)m+=2; // Variation im 2. Durchlauf
  if(m>=0&&!busy&&s%2===1)m=-1; // ruhig: dünnere Melodie
  if(m>=0){
    const f=note(T,m);
    if(T.lead==='ranat'){toneAt(t,'triangle',f*2,f*2,.35,.32,MUSIC);toneAt(t,'sine',f*4,f*4,.12,.12,MUSIC);}
    else{ // Pi-Java-artiger Rohrblatt-Sound
      const o=AC.createOscillator();o.type='sawtooth';o.frequency.setValueAtTime(f*2,t);
      const bp=AC.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1500;bp.Q.value=2.2;
      const vib=AC.createOscillator();vib.frequency.value=6;const vg=AC.createGain();vg.gain.value=f*.02;vib.connect(vg);vg.connect(o.frequency);
      const g=AC.createGain();g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(.35,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+.3);
      o.connect(bp);bp.connect(g);g.connect(MUSIC);o.start(t);vib.start(t);o.stop(t+.32);vib.stop(t+.32);
    }
  }
  if(T===TRACKS.boss&&s%8===0)noiseAt(t,.5,6500,1,'highpass',.12,null,MUSIC);
}
function musicTick(){
  if(!music.track||!AC)return;
  const T=TRACKS[music.track],spb=60/T.bpm/4/(1+.04*(music.phase||0));
  if(music.next<AC.currentTime)music.next=AC.currentTime+.05;
  while(music.next<AC.currentTime+.2){schedStep(T,music.step,music.next);music.step++;music.next+=spb;}
}
function playMusic(name){
  music.want=name;
  if(!AC)return;
  music.track=name;music.step=0;music.next=AC.currentTime+.1;
  if(!music.timer)music.timer=setInterval(musicTick,50);
}
function stopMusic(){music.track=null;music.want=null;}
function toggleMusic(){MUSIC_ON=!MUSIC_ON;if(MUSIC)MUSIC.gain.value=MUSIC_ON?.32:0;}
