/* ---------------- Zustand ---------------- */
let scene='title',stageIdx=0,ST=STAGES[0],players=[],enemies=[],items=[],projs=[],texts=[],parts=[],plats=[],worldCanvas=null;
let cam={x:0},lockX=null,waveIdx=0,waveActive=false,shake=0,hitstop=0,gt=0,stageTime=0,kills=0,debug=false,friendly=false,paused=false;
let loaded=false,bossRef=null,tip='',tipT=0,overT=0,clearMsg='',bannerT=0,bannerTxt='',carry=[null,null],selStage=0,newBest=false,bossMode=false;
const THROW_D={hs:.07,sh:5,guardBreak:false};

/* ---------------- Erzeugung ---------------- */
function mkPlayer(i,x,ci){
  if(ci==null)ci=i;const c=CH[ci];
  return {i,ci,ch:c,x,y:GROUND,vx:0,vy:0,w:c.w,h:c.h,face:1,state:'idle',hp:c.hp,maxhp:c.hp,t:0,stun:0,iframes:0,
    drunk:0,guard:false,atk:null,buf:null,jbuf:0,comboStep:0,lastPunchT:-9,onGround:true,dropT:0,combo:0,comboT:0,flash:0,hist:[],hitSet:null};
}
function mkEnemy(type,x){
  const T=ET[type],diff=(!bossMode&&scene==='stage')?ST.diff:0,duo=numPlayers===2?1.3:1; // Duo: +30 % HP
  return {type,T,x,y:GROUND,vx:0,vy:0,w:T.w,h:T.h,face:-1,hp:Math.round(T.hp*(1+.14*diff)*duo),maxhp:Math.round(T.hp*(1+.14*diff)*duo),dm:1+.09*diff,
    state:'chase',st:0,cd:rand(.3,.9),t:rand(0,5),stun:0,flash:0,dead:0,onGround:true,dropT:0,guardOn:false,poise:0,poiseT:0,
    isBoss:type==='boss',hitDone:false,move:'',counterQueued:false,phase:0,charge:false};
}
function resetCommon(){
  enemies=[];items=[];projs=[];texts=[];parts=[];cam={x:0};lockX=null;waveIdx=0;waveActive=false;shake=0;hitstop=0;
  stageTime=0;kills=0;bossRef=null;overT=0;paused=false;newBest=false;
  players=numPlayers===1?[mkPlayer(0,130,soloChar)]:[mkPlayer(0,130),mkPlayer(1,200)];
  players.forEach((p,i)=>{if(carry[i]!=null)p.hp=Math.max(Math.round(p.maxhp*.6),Math.min(p.maxhp,carry[i]));});
}
function startStage(idx){
  stageIdx=idx;ST=STAGES[idx];bossMode=false;GROUND=ST.ground;
  worldCanvas=buildWorld(ST);
  resetCommon();scene='stage';
  plats=ST.plats.map(a=>({t:a[0],x:a[1],w:a[2],h:a[3],y:GROUND-a[3],img:propImg(a[0]),c:propImg(a[0])?null:propCanvas(a[0],a[2],a[3])}));
  items=ST.items.map(a=>({x:a[0],y:GROUND-a[1],taken:false}));
  bannerTxt='STAGE '+ST.id+' · '+ST.name;bannerT=2.8;
  tip=numPlayers===1?'F/, Faust · G/. Schienbein · H// Knie · T/; Ellbogen · Guard: S/↓ · (WASD oder Pfeile)'
    :'P1: F G H T · P2: , . / ; · Tag-Team-Wurf: Guard + Faust neben dem Partner';tipT=8;
  music.phase=0;music.intens=.5;playMusic(ST.music);
}
let scrFlash=0,scrCol='#fff';
function dust(x,y,n,s){for(let i=0;i<n;i++)parts.push({x:x+rand(-8,8),y:y-2,vx:rand(-s,s),vy:rand(-70,-10),life:rand(.25,.45),t:0,col:'rgba(214,196,160,.85)',size:rand(3,6)});}
let relay=0; // 0 aus, 1 Rix kämpft (HGM wartet), 2 HGM kämpft
function startBoss(rel){
  relay=rel?1:0;
  bossMode=true;GROUND=472;WORLD=W;worldCanvas=buildArena();
  resetCommon();scene='boss';plats=[];
  if(relay){players=[mkPlayer(0,170,0)];}
  players[0].x=170;if(players[1])players[1].x=240;
  const b=mkEnemy('boss',730);b.state='intro';b.face=-1;enemies.push(b);bossRef=b;
  items=[{x:480,y:GROUND,taken:false}];if(!relay)items.push({x:650,y:GROUND,taken:false});
  bannerTxt='BOSS · SAENCHAI';bannerT=2.6;
  tip='Guard hält Fäuste/Schienbeine ab – Ellbogen bricht ihn · Nicht immer dieselbe Taste spammen!';tipT=9;
  music.phase=0;music.intens=1;playMusic('boss');
}

/* ---------------- Effekte ---------------- */
function addText(x,y,s,col,size){texts.push({x,y,s,col:col||'#fff',size:size||16,t:0,life:1.1,vy:-38});}
function spark(x,y,col,n){for(let i=0;i<n;i++){const a=rand(0,6.283),s=rand(60,260);parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-60,life:rand(.25,.5),t:0,col,size:rand(2,4)});}}
function impact(x,y,d,big){SFX.hit(d.k);if(big)SFX.thump(1.3);spark(x,y,'#ffe27a',big?14:8);hitstop=Math.max(hitstop,d.hs);shake=Math.max(shake,d.sh);}

/* ---------------- Physik ---------------- */
function physics(e,dt){
  e.vy+=GRAV*dt;const vy0=e.vy,wasGround=e.onGround;e.x+=e.vx*dt;const prev=e.y;e.y+=e.vy*dt;e.onGround=false;
  if(e.y>=GROUND){e.y=GROUND;e.vy=0;e.onGround=true;}
  else if(e.vy>=0&&!(e.dropT>0)){
    for(const p of plats){
      if(e.x+e.w/2>p.x&&e.x-e.w/2<p.x+p.w&&prev<=p.y+2&&e.y>=p.y){e.y=p.y;e.vy=0;e.onGround=true;break;}
    }
  }
  if(e.onGround&&!wasGround&&vy0>420){dust(e.x,e.y,e.ch?6:4,90);if(e.ch)SFX.land();}
  if(e.dropT>0)e.dropT-=dt;
}
function nearestPlayer(x){
  let best=null,bd=1e9;
  for(const p of players){if(p.state==='dead')continue;const d=Math.abs(p.x-x);if(d<bd){bd=d;best=p;}}
  return best;
}

/* ---------------- Spieler ---------------- */
function startAttack(p,k){
  const d=ATK[k],s=p.ch.atk;
  p.state='attack';p.guard=false;
  let step=0;
  if(k===0){step=(p.t-p.lastPunchT<.55)?(p.comboStep+1)%3:0;p.comboStep=step;p.lastPunchT=p.t;}
  p.atk={k,d,t:0,st:d.st/s,ac:d.ac/s,rc:d.rc/s,hit:new Set(),connected:false,step,swung:false};
  p.vx+=p.face*d.lunge*p.ch.lunge;p.buf=null;
  p.hist.push(k);if(p.hist.length>6)p.hist.shift();
}
function hitbox(p){
  const d=p.atk.d;
  return {x:p.face>0?p.x+p.w/2:p.x-p.w/2-d.reach,y:p.y+d.oy-d.hh/2,w:d.reach,h:d.hh};
}
function spamming(p){
  if(!p.hist||p.hist.length<5)return false;
  const last=p.hist.slice(-5),k=last[last.length-1];let c=0;for(const v of last)if(v===k)c++;return c>=4;
}
function resolveHits(p){
  const a=p.atk,d=a.d,hb=hitbox(p);
  const mul=p.ch.dmg*(p.drunk>0?1.4:1)*((!p.onGround&&d.airBonus)?d.airBonus:1);
  let dmg=d.dmg*mul,kb=d.kb,launch=false;
  if(a.k===0&&a.step===2){dmg*=1.6;kb*=2.4;launch=true;}
  for(const e of enemies){
    if(a.hit.has(e)||e.state==='dead'||e.state==='intro')continue;
    if(overlap(hb,{x:e.x-e.w/2,y:e.y-e.h,w:e.w,h:e.h})){
      a.hit.add(e);
      if(hurtEnemy(e,dmg,kb,p.face,d.stun,d,p,launch)){a.connected=true;p.combo++;p.comboT=1.3;}
    }
  }
  if(friendly){
    for(const q of players){
      if(q===p||q.state==='dead'||a.hit.has(q))continue;
      if(overlap(hb,prect(q))){a.hit.add(q);if(hurtPlayer(q,3,170,p.face,.3)){a.connected=true;addText(q.x,q.y-q.h-44,'OHRFEIGE!','#ff7ad9',20);}}
    }
  }
}
function hurtPlayer(p,dmg,kb,dir,stun){
  if(p.state==='dead'||p.iframes>0||p.state==='thrown')return false;
  let blocked=false;
  if(p.guard&&dir===-p.face){
    blocked=true;dmg*=.15;kb*=.3;SFX.block();
    spark(p.x+p.face*22,p.y-p.h*.6,'#9cf',8);addText(p.x,p.y-p.h-14,'GEBLOCKT','#9cf',16);
  }
  p.hp-=dmg;p.flash=.12;p.vx=dir*kb;
  if(!blocked){
    hitstop=Math.max(hitstop,.06);shake=Math.max(shake,6);
    p.atk=null;p.buf=null;
    if(dmg>=10||kb>260){p.state='down';p.vy=-260;p.onGround=false;p.stun=.7;}
    else{p.state='hurt';p.stun=stun;}
    const big=dmg>=10;
    SFX.ohwee(p.ci,big);addText(p.x,p.y-p.h-20,big?'OHWEEEE!':'Ohwee!','#ffd84a',big?26:18);
    spark(p.x,p.y-p.h*.6,'#ff6a4a',8);
  }
  p.iframes=blocked?.15:.3;p.combo=0;
  if(p.hp<=0){
    p.hp=0;p.state='dead';p.vy=-300;p.onGround=false;p.atk=null;
    addText(p.x,p.y-p.h-44,'K.O.!','#ff4a4a',30);SFX.ohwee(p.ci,true);
  }
  return true;
}
function drink(p,it){
  it.taken=true;SFX.play('bottle_pickup',.8);SFX.glug();
  if(p.drunk>9){p.hp=Math.max(1,p.hp-10);addText(p.x,p.y-p.h-26,'ZU VIEL BIER… BLEURGH!','#9be04a',20);setTimeout(()=>SFX.fart(),350);}
  else{p.hp=Math.min(p.maxhp,p.hp+25);addText(p.x,p.y-p.h-26,'*PROST!* +HP','#9be04a',20);setTimeout(()=>SFX.burp(),420);}
  p.drunk=Math.min(14,p.drunk+7);p.drinkT=.9;
}
function throwPartner(p,q){
  q.state='thrown';q.vx=p.face*640;q.vy=-330;q.onGround=false;q.face=p.face;q.hitSet=new Set();q.stun=.9;q.iframes=1.1;q.atk=null;q.buf=null;
  p.state='idle';p.buf=null;p.throwT=.55;
  addText(p.x,p.y-p.h-26,'TAG-TEAM-WURF!','#ff7ad9',22);SFX.throwme();SFX.ohwee(q.i,false);
}
function updatePlayer(p,dt){
  const inp=readInput(p.i);
  const frozen=(scene==='boss'&&bossRef&&bossRef.state==='intro')||scene==='over'||scene==='clear';
  p.t+=dt;p.flash=Math.max(0,p.flash-dt);p.iframes=Math.max(0,p.iframes-dt);p.drunk=Math.max(0,p.drunk-dt);p.drinkT=Math.max(0,(p.drinkT||0)-dt);p.throwT=Math.max(0,(p.throwT||0)-dt);
  p.comboT-=dt;if(p.comboT<=0)p.combo=0;
  if(p.state==='dead'){physics(p,dt);p.vx*=Math.pow(.05,dt);return;}
  if(!frozen){
    for(let k=0;k<4;k++)if(inp.e['a'+k])p.buf={k,t:.2};
    if(inp.e.j)p.jbuf=.12;
  }
  if(p.buf){p.buf.t-=dt;if(p.buf.t<=0)p.buf=null;}
  if(p.jbuf>0)p.jbuf-=dt;
  p.guard=false;
  let dir=0;
  if(p.state==='thrown'){
    p.stun-=dt;p.vx*=Math.pow(.6,dt);
    for(const e of enemies){
      if(p.hitSet.has(e)||e.state==='dead'||e.state==='intro')continue;
      if(overlap(prect(p),{x:e.x-e.w/2,y:e.y-e.h,w:e.w,h:e.h})){p.hitSet.add(e);hurtEnemy(e,16*p.ch.dmg,380,p.face,.5,THROW_D,p,true);}
    }
    if(p.stun<=0||(p.onGround&&p.stun<.85)){p.state='idle';p.iframes=.5;}
  }
  else if(p.state==='hurt'){p.stun-=dt;if(p.stun<=0)p.state='idle';p.vx*=Math.pow(.1,dt);}
  else if(p.state==='down'){p.stun-=dt;p.vx*=Math.pow(.15,dt);if(p.onGround&&p.stun<=0){p.state='idle';p.iframes=.5;SFX.play('getup',.7);}}
  else if(!frozen){
    let attacking=p.state==='attack';
    if(attacking){
      const a=p.atk;a.t+=dt;
      if(!a.swung&&a.t>=a.st){a.swung=true;SFX.whoosh();SFX.vo(p.ci?'hgm_attack':'rix_attack',.5);}
      if(a.t>=a.st&&a.t<a.st+a.ac)resolveHits(p);
      if(a.t>=a.st+a.ac+a.rc){p.state='idle';p.atk=null;attacking=false;}
      p.vx*=Math.pow(.02,dt);
    }
    // Tag-Team-Wurf: Guard + Faust neben dem Partner
    if(!attacking&&p.onGround&&inp.h.g&&inp.e.a0&&players.length>1){
      const q=players[1-p.i];
      if(q&&(q.state==='idle'||q.state==='run')&&Math.abs(q.x-p.x)<100&&Math.abs(q.y-p.y)<30){throwPartner(p,q);p.buf=null;}
    }
    const cancel=attacking&&p.atk&&p.atk.connected&&p.atk.t>=p.atk.st;
    if(p.buf&&(!attacking||cancel))startAttack(p,p.buf.k);
    if(p.state!=='attack'){
      {const g0=p.guard;p.guard=inp.h.g&&p.onGround;if(p.guard&&!g0)SFX.play('guard_up',.6);}
      if(!p.guard)dir=(inp.h.r?1:0)-(inp.h.l?1:0);
      if(p.jbuf>0&&p.onGround){
        if(inp.h.g&&p.y<GROUND-1){p.dropT=.3;p.y+=2;p.onGround=false;p.jbuf=0;}
        else if(!inp.h.g){p.vy=-p.ch.jump;SFX.jump();dust(p.x,p.y,4,70);p.onGround=false;p.jbuf=0;}
      }
      let target=dir*p.ch.speed;
      if(p.drunk>0)target+=Math.sin(p.t*5)*80*Math.min(1,p.drunk/3);
      if(dir)p.face=dir;
      p.vx+=(target-p.vx)*Math.min(1,dt*(p.onGround?14:5));
      p.state=dir?'run':'idle';
    }
  }else{p.vx*=Math.pow(.02,dt);}
  physics(p,dt);
  if(p.state==='run'&&p.onGround&&Math.abs(p.vx)>60){p.stepT=(p.stepT||0)-dt;if(p.stepT<=0){p.stepT=.26;SFX.step();dust(p.x-p.face*10,p.y,2,40);}}
  if(scene==='stage')p.x=clamp(p.x,cam.x+p.w/2+4,cam.x+W-p.w/2-4);
  else p.x=clamp(p.x,30+p.w/2,W-30-p.w/2);
  if(p.state!=='dead'){
    for(const it of items){
      if(it.taken)continue;
      if(overlap(prect(p),{x:it.x-12,y:it.y-34,w:24,h:34}))drink(p,it);
    }
  }
}

/* ---------------- Gegner ---------------- */
function hurtEnemy(e,dmg,kb,dir,stun,d,p,launch){
  if(e.state==='dead')return false;
  let guarded=false;
  if(e.isBoss)guarded=e.guardOn&&e.state==='stance';
  else if(e.T.guard&&(e.state==='chase'||e.state==='wind')&&e.face===-dir&&Math.random()<e.T.guard)guarded=true;
  const cx=e.x,cy=e.y-e.h*.65;
  if(guarded){
    if(d.guardBreak){
      e.state='hurt';e.stun=1.4;e.guardOn=false;e.st=0;dmg*=1.2;
      addText(e.x,e.y-e.h-30,'GUARD BREAK!','#ffb347',24);impact(cx,cy,d,true);
    }else{
      dmg*=.12;SFX.block();spark(cx,cy,'#9cf',6);addText(e.x,e.y-e.h-14,'GEBLOCKT','#9cf',16);
      hitstop=Math.max(hitstop,.03);e.vx=dir*60;e.hp-=dmg;e.flash=.06;
      if(e.isBoss&&spamming(p))e.counterQueued=true;
      if(e.hp<=0)killEnemy(e,dir);
      return true;
    }
  }else{
    if(e.isBoss&&e.state==='stagger')dmg*=1.4;
    impact(cx,cy,d,launch);if(Math.random()<.45)SFX.grunt(e.type);
    if(Math.random()<.14&&e.T.hurt.length)addText(e.x,e.y-e.h-28,pick(e.T.hurt),'#fff',14);
  }
  e.hp-=dmg;e.flash=.1;
  addText(e.x+rand(-10,10),e.y-e.h-6,String(Math.round(dmg)),'#ffe27a',13);
  if(e.isBoss){
    e.poise+=dmg;e.poiseT=3;e.vx=dir*kb*.25;
    if(e.poise>=75&&e.state!=='stagger'&&e.state!=='intro'&&e.hp>0){
      e.state='stagger';e.st=0;e.poise=0;e.guardOn=false;SFX.play('boss_stagger',.9);addText(e.x,e.y-e.h-40,'ANGESCHLAGEN!','#ff9a3c',22);
    }else if(e.state==='stance'&&!guarded)e.counterQueued=e.counterQueued||spamming(p);
  }else if(e.state!=='hurt'||!guarded){
    e.vx=dir*kb;
    if(launch||kb>300||e.type==='dog'||e.type==='monkey'){e.state='down';e.vy=-240;e.onGround=false;e.stun=.9;}
    else{e.state='hurt';e.stun=stun+.1;}
  }
  if(e.T.split&&e.hp>0&&dmg>=8&&Math.random()<.4&&enemies.filter(x=>x.type==='rat'&&x.state!=='dead').length<4){const r=mkEnemy('rat',e.x+dir*40);r.vy=-260;r.vx=dir*200;r.onGround=false;enemies.push(r);addText(e.x,e.y-e.h-30,'ZERSTREUT EUCH!','#ffd84a',16);}
  if(e.hp<=0)killEnemy(e,dir);
  return true;
}
function killEnemy(e,dir){
  e.hp=0;e.state='dead';e.dead=1.3;e.vy=-320;e.vx=dir*260;e.onGround=false;e.t=0;kills++;
  if(!e.isBoss){
    SFX.grunt(e.type);SFX.play('enemy_ko',.8);
    if(!enemies.some(x=>x!==e&&x.state!=='dead')){hitstop=Math.max(hitstop,.2);shake=Math.max(shake,8);}
    if(Math.random()<.3){SFX.fart();addText(e.x,e.y-e.h-30,'PFFRRRRT','#9be04a',22);}
    else if(e.type==='drunk'&&Math.random()<.5){SFX.burp();addText(e.x,e.y-e.h-30,'BLEURGH…','#9be04a',22);}
    else addText(e.x,e.y-e.h-30,pick(['K.O.!','PENG!','WUMMS!','AUS DIE MAUS!']),'#ffd84a',22);
    if(Math.random()<.14)items.push({x:e.x,y:GROUND,taken:false});
  }else{addText(e.x,e.y-e.h-50,'RESPEKT.','#ffd84a',32);scrFlash=.6;scrCol='#fff';hitstop=Math.max(hitstop,.4);shake=14;SFX.play('boss_ko',1);setTimeout(()=>SFX.play('announcer_ko',1),900);}
}
function enemyStrike(e,rect,dmg,kb,stun){
  for(const p of players){
    if(p.state==='dead')continue;
    if(overlap(rect,prect(p)))if(hurtPlayer(p,dmg,kb,e.face,stun))e.hitDone=true;
  }
}
function throwCoconut(e,tgt){
  const sx=e.x+e.face*16,sy=e.y-e.h*.7,tt=.9,g=1300;
  projs.push({x:sx,y:sy,vx:(tgt.x-sx)/tt,vy:((tgt.y-tgt.h*.6)-sy-.5*g*tt*tt)/tt,t:0,rot:0,dmg:(e.T.pdmg||7)*e.dm,dead:false});
  SFX.coconut();
}
function updateEnemy(e,dt){
  e.t+=dt;e.flash=Math.max(0,e.flash-dt);physics(e,dt);
  if(scene==='stage')e.x=clamp(e.x,20,WORLD-20);else e.x=clamp(e.x,30+e.w/2,W-30-e.w/2);
  if(e.state==='dead'){e.dead-=dt;e.vx*=Math.pow(.1,dt);return;}
  if(e.isBoss){updateBoss(e,dt);return;}
  const T=e.T;
  if(e.state==='hurt'){e.stun-=dt;e.vx*=Math.pow(.02,dt);if(e.stun<=0){e.state='chase';e.cd=.35;}return;}
  if(e.state==='down'){e.stun-=dt;e.vx*=Math.pow(.05,dt);if(e.onGround&&e.stun<=0){e.state='chase';e.cd=.4;}return;}
  if(e.cd>0)e.cd-=dt;
  const tgt=nearestPlayer(e.x);
  if(!tgt){e.vx=0;return;}
  const dx=tgt.x-e.x,dist=Math.abs(dx),dy=Math.abs(tgt.y-e.y);
  switch(e.state){
    case 'chase':
      e.face=sgn(dx);
      if(T.ranged){
        const want=dist<190?-1:dist>420?1:0;
        e.vx=want*e.face*T.spd;
        if(lockX!==null){if(e.x>lockX+W-30)e.vx=-T.spd;else if(e.x<lockX+30)e.vx=T.spd;else{if(e.vx<0&&e.x<=lockX+50)e.vx=0;if(e.vx>0&&e.x>=lockX+W-50)e.vx=0;}} // Affen fliehen nicht aus dem Bild
        if(e.cd<=0&&dist<560&&dist>110){e.state='wind';e.st=0;e.vx=0;}
        break;
      }
      if(T.flee){e.face=-sgn(dx);e.vx=e.face*T.spd*(dist<260?1:.3)*(Math.sin(e.t*2.5)>-.3?1:0);if(lockX!==null)e.x=clamp(e.x,lockX+20,lockX+W-20);break;}
      e.vx=dist>T.range*.8?e.face*T.spd:0;
      if(T.sway)e.vx+=Math.sin(e.t*3)*45;
      if(T.summon&&e.cd<=0&&dist>170&&(e.summons||0)<3&&enemies.filter(x=>x.type===T.summon&&x.state!=='dead').length<2){e.state='whistle';e.st=0;e.vx=0;break;}
      if(T.charge&&dist>140&&dist<340&&dy<60&&e.cd<=0){e.state='wind';e.st=0;e.vx=0;e.charge=true;SFX.vo('rowdy_start',1,.8);}
      else if(dist<T.range&&dy<60&&e.cd<=0){e.state='wind';e.st=0;e.vx=0;e.charge=false;}
      break;
    case 'wind':
      e.st+=dt;e.vx=0;e.face=sgn(dx);
      if(e.st>=T.wind){
        if(T.ranged){SFX.play('monkey_throw',.8);throwCoconut(e,tgt);e.state='rec';e.st=0;break;}
        e.state='atk';e.st=0;e.hitDone=false;if(e.charge)e.vx=e.face*400;
        if(T.pounce){e.vy=-360;e.vx=e.face*300;e.onGround=false;}
        SFX.vo(e.charge?'rowdy_charge':({oma:'oma_attack',masseuse:'massage_attack',pirat:'pirate_attack',tourist:'tourist_flipflop',drunk:'drunk_stumble',dog:'dog_bark'}[e.type]||'x'),.8,.75);
      }
      break;
    case 'atk':{
      e.st+=dt;
      if(e.charge){
        if(!e.hitDone)enemyStrike(e,{x:e.x-e.w/2-8,y:e.y-e.h,w:e.w+16,h:e.h},T.dmg*e.dm,T.kb,.3);
        if(e.st>=.4||e.hitDone){e.state='rec';e.st=0;e.vx=0;}
      }else{
        if(!e.hitDone&&e.st>.04){
          enemyStrike(e,{x:e.face>0?e.x+e.w/2:e.x-e.w/2-T.range,y:e.y-e.h,w:T.range,h:e.h},T.dmg*e.dm,T.kb,.3);
          e.hitDone=true;
        }
        if(e.st>=(T.pounce?.45:.16)){e.state='rec';e.st=0;}
      }
      break;}
    case 'whistle':
      e.st+=dt;e.vx=0;
      if(e.st>=1.1){const n=mkEnemy(T.summon,clamp(e.x-e.face*70,40,WORLD-40));n.vy=-200;n.onGround=false;enemies.push(n);e.summons=(e.summons||0)+1;addText(e.x,e.y-e.h-30,'PFIIIIFF!','#ffd84a',18);e.state='rec';e.st=0;e.cd=T.cool;}
      break;
    case 'rec':
      e.st+=dt;e.vx*=Math.pow(.05,dt);
      if(e.st>=T.cool*.5){e.state='chase';e.cd=T.cool*.6;}
      break;
  }
}

/* ---------------- Boss: Saenchai ---------------- */
const MOVES={
  teep:   {wind:.40,label:'TEEP!',  dmg:16,kb:430,stun:.4,reach:150,y0:-92,hh:52},
  low:    {wind:.36,label:'LOW KICK!',dmg:11,kb:260,stun:.4,reach:125,y0:-34,hh:34},
  knee:   {wind:.46,label:'FLIEGENDES KNIE!',dmg:20,kb:380,stun:.5,reach:64,y0:-96,hh:92},
  counter:{wind:.16,label:'KONTER!',dmg:18,kb:360,stun:.5,reach:116,y0:-96,hh:56}
};
function bossMove(e,name){
  e.move=name;e.state='wind';e.st=0;e.vx=0;e.guardOn=false;e.counterQueued=false;SFX.play(name==='counter'?'boss_counter':'boss_telegraph',.7);
  addText(e.x,e.y-e.h-34,MOVES[name].label,name==='counter'?'#ff4a4a':'#ffb347',18);
}
function updateBoss(e,dt){
  const ph=e.hp>e.maxhp*.66?0:e.hp>e.maxhp*.33?1:2;
  if(ph!==e.phase&&e.state!=='intro'){
    e.phase=ph;addText(e.x,e.y-e.h-60,ph===1?'ER WIRD ERNST':'LETZTE RUNDE','#ff9a3c',24);shake=8;SFX.play('boss_phase',1);scrFlash=.3;scrCol='#ff5a2a';
  }
  music.phase=e.phase;music.intens=1;
  const spd=1+e.phase*.22;
  if(e.poiseT>0){e.poiseT-=dt;if(e.poiseT<=0)e.poise=0;}
  const tgt=nearestPlayer(e.x);
  if(e.state==='intro'){
    e.st+=dt;e.face=-1;
    if(!e.ding1&&e.st>.2){e.ding1=true;SFX.play('boss_bell',.9);}
    if(!e.ding2&&e.st>1.6){e.ding2=true;SFX.play('boss_bell',.9);}
    if(e.st>=3.2){e.state='stance';e.st=0;e.stanceT=.9;e.guardOn=true;addText(e.x,e.y-e.h-30,'FIGHT!','#ffd84a',34);SFX.play('announcer_fight',1);}
    return;
  }
  if(!tgt){e.vx=0;return;}
  const dx=tgt.x-e.x,dist=Math.abs(dx);
  switch(e.state){
    case 'stance':
      e.guardOn=true;e.face=sgn(dx);e.st+=dt;
      e.vx=dist>210?e.face*e.T.spd*spd:dist<120?-e.face*e.T.spd*.8*spd:0;
      if(e.counterQueued&&dist<170){bossMove(e,'counter');}
      else if(e.st>=e.stanceT){
        let m;
        if(dist>250)m='knee';else{const r=Math.random();m=r<.42?'teep':r<.8?'low':'knee';}
        bossMove(e,m);
      }
      break;
    case 'wind':
      e.st+=dt;e.vx=0;
      if(e.st>=(e.move==='counter'?MOVES.counter.wind:Math.max(.27,MOVES[e.move].wind/spd))){
        e.state='atk';e.st=0;e.hitDone=false;SFX.play({teep:'boss_teep',low:'boss_lowkick',knee:'boss_knee',counter:'boss_counter'}[e.move],.85);
        if(e.move==='knee'){e.vy=-560;e.vx=e.face*430;e.onGround=false;}
        if(e.move==='teep'||e.move==='counter')e.vx=e.face*140;
      }
      break;
    case 'atk':{
      e.st+=dt;const m=MOVES[e.move];
      if(!e.hitDone){
        let r;
        if(e.move==='knee'){r={x:e.x-e.w/2-10-(e.face<0?m.reach*.4:0),y:e.y-e.h,w:e.w+20+m.reach*.4,h:e.h};}
        else r={x:e.face>0?e.x+e.w/2:e.x-e.w/2-m.reach,y:e.y+m.y0-m.hh/2,w:m.reach,h:m.hh};
        enemyStrike(e,r,m.dmg,m.kb,m.stun);
      }
      const end=e.move==='knee'?(e.onGround&&e.st>.15):e.st>=.2;
      if(end||e.st>1){e.state='rec';e.st=0;e.vx=0;}
      break;}
    case 'rec':
      e.st+=dt;e.vx*=Math.pow(.02,dt);e.guardOn=false;
      if(e.st>=.6/spd){e.state='stance';e.st=0;e.stanceT=rand(.6,1.2)/spd;e.guardOn=true;}
      break;
    case 'stagger':
      e.st+=dt;e.vx*=Math.pow(.02,dt);e.guardOn=false;
      if(e.st>=1.6){e.state='stance';e.st=0;e.stanceT=.7;e.guardOn=true;e.poise=0;}
      break;
    case 'hurt':
      e.stun-=dt;e.vx*=Math.pow(.02,dt);
      if(e.stun<=0){e.state='stance';e.st=0;e.stanceT=.6;e.guardOn=true;}
      break;
  }
}

/* ---------------- Projektile ---------------- */
function updateProjs(dt){
  for(const q of projs){
    q.vy+=1300*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.t+=dt;q.rot+=dt*12;
    for(const p of players){
      if(p.state==='dead')continue;
      if(overlap({x:q.x-8,y:q.y-8,w:16,h:16},prect(p))){
        if(hurtPlayer(p,q.dmg,160,sgn(q.vx),.3)){q.dead=true;SFX.play('coconut_hit',.9);spark(q.x,q.y,'#a67a3a',8);break;}
      }
    }
    if(q.y>GROUND+8){q.dead=true;spark(q.x,GROUND,'#a67a3a',5);}
  }
  projs=projs.filter(q=>!q.dead&&q.t<4);
}

/* ---------------- Stage-Logik ---------------- */
function stageLogic(dt){
  const alive=players.filter(p=>p.state!=='dead');
  const want=alive.length?alive.reduce((s,p)=>s+p.x,0)/alive.length-W/2:cam.x;
  const nw=ST.waves[waveIdx];
  if(!waveActive&&nw&&want>=Math.min(nw.cx,WORLD-W)){
    waveActive=true;lockX=Math.min(nw.cx,WORLD-W);SFX.gong();
    const list=(numPlayers===1&&nw.list.length>=4)?nw.list.slice(0,-1):nw.list;
    list.forEach((t,i)=>{
      const left=i%2===1,x=left?lockX-40-i*34:lockX+W+40+i*34;
      const e=mkEnemy(t,Math.max(20,x));enemies.push(e);
      if(Math.random()<.5&&e.T.spawn.length)addText(clamp(e.x,lockX+170,lockX+W-170),150+i*22,pick(e.T.spawn),'#fff',14);
    });
  }
  music.intens=waveActive?1:.5;music.phase=0;
  const lim=lockX!==null?lockX:WORLD-W;
  const tgt=clamp(want,0,lim);
  if(tgt>cam.x)cam.x+=(tgt-cam.x)*Math.min(1,dt*6);
  if(cam.x>lim)cam.x=lim;
  if(waveActive&&enemies.every(e=>e.state==='dead')){
    waveActive=false;lockX=null;waveIdx++;
    for(const p of players)if(p.state==='dead'){
      p.state='idle';p.hp=Math.round(p.maxhp*.4);p.iframes=1.5;p.x=cam.x+90+p.i*60;p.y=GROUND-200;p.vy=0;
      addText(p.x,p.y-60,'WIEDER DA!','#9be04a',22);
    }
    SFX.ding();SFX.vo('crowd_cheer',.7,.6);addText(cam.x+W/2,170,waveIdx>=ST.waves.length?'STRASSE FREI – WEITER NACH RECHTS!':'GEGNER GESCHLAGEN!','#ffd84a',24);
  }
  if(!waveActive&&waveIdx>=ST.waves.length&&alive.some(p=>p.x>WORLD-90))finishStage();
}
function finishStage(){
  scene='clear';SFX.clear();SFX.vo('crowd_cheer',1,.7);clearMsg='STAGE '+ST.id+' GESCHAFFT';
  carry=players.map(p=>p.hp);
  SAVE.unlocked=Math.max(SAVE.unlocked,Math.min(STAGES.length-1,stageIdx+1));
  const b=SAVE.best[ST.id];newBest=(!b||stageTime<b);if(newBest)SAVE.best[ST.id]=Math.round(stageTime*10)/10;
  saveGame();
}

/* ---------------- Step ---------------- */
let hbT=0;
function lowHpBeat(dt){
  hbT-=dt;if(hbT>0||scene==='over'||scene==='clear')return;
  if(players.some(p=>p.state!=='dead'&&p.hp>0&&p.hp<p.maxhp*.25)){SFX.play('heartbeat',.7);hbT=1.1;}
}
function clearPress(){for(const k in press)delete press[k];}
function step(dt){
  gt+=dt;
  if(scene==='editor'){edStep(dt);return;}
  if(scene==='title'){
    if(AC&&music.want!=='title')playMusic('title');
    if(press.Digit1||press.Digit2||press.Digit3||press.KeyM||press.KeyS)SFX.play('menu_move',.7);
    if(press.Enter||press.KeyR||press.KeyB)SFX.play('menu_confirm',.8);
    if(press.Digit1){numPlayers=1;soloChar=0;}
    if(press.Digit3){numPlayers=1;soloChar=1;}
    if(press.Digit2)numPlayers=2;
    if(press.KeyM){if(numPlayers===2){numPlayers=1;soloChar=0;}else if(soloChar===0)soloChar=1;else{numPlayers=2;soloChar=0;}}
    if(press.KeyS)selStage=(selStage+1)%(Math.min(SAVE.unlocked,STAGES.length-1)+1);
    if(press.KeyN)toggleMusic();
    if(press.F2&&loaded){openEditor();clearPress();return;}
    if(press.Enter&&loaded){carry=[null,null];startStage(selStage);}
    else if(press.KeyR&&loaded){carry=[null,null];numPlayers=1;startBoss(true);}
    else if(press.KeyB&&loaded){carry=[null,null];startBoss();}
    clearPress();return;
  }
  if(press.Escape){SFX.play('menu_back',.8);if(ed.testing){edBack();clearPress();return;}scene='title';stopMusic();clearPress();return;}
  if(press.KeyP){paused=!paused;SFX.play('pause',.8);}
  if(press.Digit1)debug=!debug;
  if(press.KeyN)toggleMusic();
  if(press.KeyO){friendly=!friendly;addText(cam.x+W/2,170,friendly?'FRIENDLY FIRE: AN':'FRIENDLY FIRE: AUS','#ff7ad9',22);}
  if(scene==='over'){overT+=dt;if(press.Enter)(bossMode?()=>startBoss(relay>0):()=>startStage(stageIdx))();}
  else if(scene==='clear'){
    if(press.Enter){
      if(bossMode){scene='title';stopMusic();}
      else if(stageIdx>=STAGES.length-1)startBoss();
      else startStage(stageIdx+1);
    }
  }
  if(paused){clearPress();return;}
  if(hitstop>0){hitstop-=dt;}
  else{
    if(scene==='stage'||scene==='boss'||scene==='over'||scene==='clear'){
      stageTime+=(scene==='stage'||scene==='boss')?dt:0;
      for(const p of players)updatePlayer(p,dt);
      for(const e of enemies)updateEnemy(e,dt);
      updateProjs(dt);
      for(let i=0;i<enemies.length;i++)for(let j=i+1;j<enemies.length;j++){
        const a=enemies[i],b=enemies[j];
        if(a.state==='dead'||b.state==='dead'||a.isBoss||b.isBoss)continue;
        if(Math.abs(a.y-b.y)<20&&Math.abs(a.x-b.x)<(a.w+b.w)*.4){const s=a.x<b.x?-1:1;a.x+=s*45*dt;b.x-=s*45*dt;}
      }
      enemies=enemies.filter(e=>!(e.state==='dead'&&e.dead<=0&&!e.isBoss));
      lowHpBeat(dt);
      if(scene==='stage')stageLogic(dt);
      if(scene==='boss'&&bossRef&&bossRef.state==='dead'&&bossRef.dead<=0){
        scene='clear';SFX.vo('crowd_cheer',1,.8);clearMsg='SAENCHAI BESIEGT – RESPEKT!';carry=players.map(p=>p.hp);
        SAVE.best.boss=SAVE.best.boss?Math.min(SAVE.best.boss,Math.round(stageTime)):Math.round(stageTime);saveGame();
      }
      if(relay===1&&bossRef&&players.every(p=>p.state==='dead')&&scene==='boss'){
        relay=2;const h=mkPlayer(0,170,1);h.iframes=2;players=[h];
        addText(cam.x+W/2,170,'HGM ÜBERNIMMT!','#9fd0ff',28);SFX.ding&&SFX.ding();
      }
      if(players.every(p=>p.state==='dead')&&scene!=='over'&&scene!=='clear'){scene='over';overT=0;SFX.over();}
    }
  }
  for(const t of texts){t.t+=dt;t.y+=t.vy*dt;}texts=texts.filter(t=>t.t<t.life);
  for(const q of parts){q.t+=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=600*dt;}parts=parts.filter(q=>q.t<q.life);
  shake=Math.max(0,shake-40*dt);scrFlash=Math.max(0,scrFlash-dt);
  if(tipT>0)tipT-=dt;
  if(bannerT>0)bannerT-=dt;
  clearPress();
}
