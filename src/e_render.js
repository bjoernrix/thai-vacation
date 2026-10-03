/* ---------------- Rendering ---------------- */
function txt(s,x,y,size,col,align,stroke){
  ctx.font='bold '+size+'px "Courier New",monospace';ctx.textAlign=align||'center';ctx.textBaseline='middle';
  if(stroke!==false){ctx.lineWidth=Math.max(3,size/5);ctx.strokeStyle='#000';ctx.lineJoin='round';ctx.strokeText(s,x,y);}
  ctx.fillStyle=col||'#fff';ctx.fillText(s,x,y);
}
function shadow(x,y,w){ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(x,y+2,w,6,0,0,7);ctx.fill();}
function drawBottle(it){
  const x=it.x-cam.x,y=it.y+Math.sin(gt*3+it.x)*2;
  if(x<-20||x>W+20)return;
  ctx.fillStyle='#1b1020';ctx.fillRect(x-9,y-30,18,30);ctx.fillRect(x-5,y-40,10,12);
  ctx.fillStyle='#2f8f3a';ctx.fillRect(x-8,y-28,16,27);ctx.fillRect(x-4,y-38,8,12);
  ctx.fillStyle='#e9d9a8';ctx.fillRect(x-8,y-18,16,8);ctx.fillStyle='rgba(255,255,255,.5)';ctx.fillRect(x-6,y-26,2,18);
  ctx.fillStyle='rgba(255,255,255,'+(.4+.4*Math.sin(gt*5+it.x))+')';ctx.fillRect(x+9,y-34,3,3);
}
function atkExt(a){
  if(a.t<a.st)return .2+.3*(a.t/a.st);
  if(a.t<a.st+a.ac)return 1;
  return Math.max(.25,1-(a.t-a.st-a.ac)/a.rc*.75);
}
function AF(set,an,i){const d=ANIM[set],img=d&&IMG[d.img||'anim'];if(!d||!img)return null;const L=d.a[an];if(!L||!L.length)return null;const j=((i%L.length)+L.length)%L.length,f=L[j];
  return {im:img,sx:f[0],sy:f[1],sw:f[2],sh:f[3],w:f[2]/d.k,h:f[3]/d.k,ax:(f[4]!==undefined?f[4]:f[2]/2)/d.k,nf:d.nf,n:L.length,key:set+an+j};}
function drawFr(fr,x,y,flash){let src=fr.im,sx=fr.sx,sy=fr.sy;
  if(flash){src=whiteOf(fr.im,'F'+fr.key,fr.sx,fr.sy,fr.sw,fr.sh);sx=0;sy=0;}
  ctx.drawImage(src,sx,sy,fr.sw,fr.sh,x-fr.ax,y-fr.h,fr.w,fr.h);}
const ATKN=['punch','shin','knee','elbow'];
function heroFrame(p){
  const set=p.ch.anim,D=ANIM[set],st=p.state,t=gt;if(!D)return null;
  const has=n=>D.a[n]&&D.a[n].length;
  if(st==='down'||st==='dead'){
    if(p.koS===undefined)p.koS=t;const ko=D.a.ko,n=ko.length,e=t-p.koS;
    if(st==='down'&&p.stun<.38&&p.onGround&&has('getup')){const g=D.a.getup.length;return AF(set,'getup',Math.min(g-1,Math.floor((.38-p.stun)/.38*g)));}
    return AF(set,'ko',Math.min(n-1,Math.floor(e/.07)));}
  p.koS=undefined;
  if(st==='thrown'){if(has('thrown')){const n=D.a.thrown.length;return p.onGround?AF(set,'thrown',n-1):AF(set,'thrown',Math.floor(t*9)%Math.max(1,n-1));}return has('fall')?AF(set,'fall',0):AF(set,'jump',1);}
  if(st==='hurt')return AF(set,'hurt',1);
  if(st==='attack'&&p.atk&&has(ATKN[p.atk.d.k])){
    const a=p.atk,nm=ATKN[a.d.k],n=D.a[nm].length,pk=Math.min(n-1,D.p[nm]??1);
    if(a.t<a.st)return AF(set,nm,Math.min(pk-1,Math.floor(a.t/a.st*pk)));
    if(a.t<a.st+a.ac)return AF(set,nm,pk);
    const r=Math.min(.999,(a.t-a.st-a.ac)/a.rc),rest=n-pk-1;
    return AF(set,nm,rest>0?pk+1+Math.floor(r*rest):pk);}
  if(p.throwT>0&&has('teamthrow')){const n=D.a.teamthrow.length;return AF(set,'teamthrow',Math.min(n-1,Math.floor((1-p.throwT/.55)*n)));}
  if(p.drinkT>0&&has('drink')){const n=D.a.drink.length;return AF(set,'drink',Math.min(n-1,Math.floor((1-p.drinkT/.9)*n)));}
  if(!p.onGround){if(p.vy<0||!has('fall')){const n=D.a.jump.length;return n>=4?AF(set,'jump',p.vy<-150?1:2):AF(set,'jump',p.vy<-150?0:1);}return AF(set,'fall',Math.floor(t*10));}
  if(p.guard&&has('guard'))return AF(set,'guard',0);
  if(Math.abs(p.vx)>25){const sp=Math.abs(p.vx);return sp>205&&has('run')?AF(set,'run',Math.floor(t*15)):AF(set,'walk',Math.floor(t*(set==='rix'?11:13)));}
  return has('idle')?AF(set,'idle',Math.floor(t*6+p.i*2)):AF(set,'walk',0);
}
function D_has_thrown(a){const d=ANIM[a];return !!(d&&d.a.thrown&&d.a.thrown.length);}
function drawHero(p){
  const ch=p.ch,im=IMG[ch.img];if(!im)return;
  const sc=ch.sc,st=p.state,t=gt;
  let fr=ch.anim?heroFrame(p):null;
  let dw=im.width*sc,dh=im.height*sc;
  if(fr){const b=AF(ch.anim,'walk',0);dw=b.w;dh=b.h;}
  shadow(p.x,p.onGround?p.y:GROUND,dw*.42*(p.onGround?1:.7));
  ctx.save();ctx.translate(p.x,p.y);ctx.scale(p.face,1);ctx.imageSmoothingEnabled=true;
  let rot=0,dx=0,dy=0,sx=1,sy=1,lying=false;
  if(p.iframes>0&&st!=='dead'&&st!=='hurt'&&st!=='down'&&Math.floor(t*24)%2)ctx.globalAlpha=.55;
  if(st==='idle'){const b=Math.sin(t*4+p.i);sy=1+b*.018;sx=1-b*.01;}
  else if(st==='run'){dy=-Math.abs(Math.sin(t*15))*5;rot=.08;sx=1+Math.sin(t*15)*.02;}
  if(!p.onGround&&st!=='down'&&st!=='dead'&&st!=='thrown'){rot=p.vy<0?.05:-.03;sy=1.04;}
  let ghost=0;
  if(st==='attack'&&p.atk){
    const a=p.atk,d=a.d,act=a.t>=a.st&&a.t<a.st+a.ac,wind=a.t<a.st;
    const u=wind?a.t/a.st:(act?1:Math.max(0,1-(a.t-a.st-a.ac)/a.rc));
    const POSE=[{rot:.22,dx:16,dy:0,sx:1.04},{rot:-.2,dx:10,dy:0,sx:1.02},{rot:.3,dx:12,dy:-18,sx:1},{rot:.34,dx:24,dy:0,sx:1.06}][d.k];
    if(wind){rot=-POSE.rot*.4*u;dx=-8*u;}
    else{rot=POSE.rot*u;dx=POSE.dx*u;dy=POSE.dy*u;sx=1+(POSE.sx-1)*u;}
    if(act)ghost=1;
  }
  if(st==='hurt'){rot=-.25;dx=-10;}
  if(st==='thrown'){rot=t*18;dy=-dh*.4;}
  if(st==='down'||st==='dead'){if(p.onGround)lying=true;else rot=-.9;}
  if(p.guard){rot=-.06;}
  if(p.drunk>0)rot+=Math.sin(t*3+p.i)*.06;
  if(fr){rot=0;dx=0;dy=0;sx=1;sy=1;ghost=0;lying=false;if(st==='thrown'&&!D_has_thrown(ch.anim)){rot=t*18;dy=-dh*.4;}if(p.drunk>0)rot+=Math.sin(t*3+p.i)*.06;if(st==='dead')try{ctx.filter='grayscale(.9) brightness(.75)';}catch(e){}}
  if(lying){ctx.translate(-dh*.05,-dw*.5);ctx.rotate(-Math.PI/2*.98);ctx.translate(0,dh*.02);if(st==='dead')try{ctx.filter='grayscale(.9) brightness(.75)';}catch(e){}}
  else{ctx.translate(0,dy);ctx.rotate(rot);ctx.scale(sx,sy);}
  const flash=p.flash>0,src=flash?whiteOf(im,'hero'+p.ci,0,0,im.width,im.height):im;
  if(fr){
    if(ghost){ctx.globalAlpha=.28;drawFr(fr,dx-26,0,flash);ctx.globalAlpha=ctx.globalAlpha<1&&p.iframes>0?.55:1;}
    drawFr(fr,dx,0,flash);
  }else{
  if(ghost){ctx.globalAlpha=.28;ctx.drawImage(src,-dw/2+dx-26,-dh,dw,dh);ctx.globalAlpha=ctx.globalAlpha<1&&p.iframes>0?.55:1;}
  ctx.drawImage(src,-dw/2+dx,-dh,dw,dh);}
  ctx.filter='none';
  if(p.guard){ctx.strokeStyle='rgba(156,204,255,.75)';ctx.lineWidth=4;ctx.beginPath();ctx.arc(dw*.35,-dh*.6,38,-1.2,1.2);ctx.stroke();}
  ctx.restore();ctx.globalAlpha=1;
  if(st==='attack'&&p.atk){
    const a=p.atk,d=a.d,act=a.t>=a.st&&a.t<a.st+a.ac,fade=act?1:(a.t>=a.st+a.ac?Math.max(0,1-(a.t-a.st-a.ac)/a.rc*1.4):0);
    if(fade>0){
      ctx.save();ctx.translate(p.x,p.y);ctx.scale(p.face,1);ctx.lineCap='round';ctx.globalAlpha=(fr?.35:.85)*fade;
      const ext=atkExt(a),fw=dw*.25;
      if(d.k===0){ctx.strokeStyle='#fff';ctx.lineWidth=4;for(let j=-1;j<=1;j++){ctx.beginPath();ctx.moveTo(fw+8,-88+j*11);ctx.lineTo(fw+d.reach*ext*.95,-88+j*11);ctx.stroke();}}
      else if(d.k===1){ctx.strokeStyle='#fff';ctx.lineWidth=10;ctx.beginPath();ctx.arc(dw*.1,-56,86,-.95,.55);ctx.stroke();ctx.strokeStyle='#cfe8ff';ctx.lineWidth=4;ctx.beginPath();ctx.arc(dw*.1,-56,70,-.8,.45);ctx.stroke();}
      else if(d.k===2){ctx.strokeStyle='#fff';ctx.lineWidth=9;ctx.beginPath();ctx.arc(dw*.22,-34,60,-1.55,-.05);ctx.stroke();ctx.strokeStyle='#ffe27a';ctx.lineWidth=4;ctx.beginPath();ctx.arc(dw*.22,-34,48,-1.4,-.2);ctx.stroke();}
      else{ctx.strokeStyle='#ffe27a';ctx.lineWidth=12;ctx.beginPath();ctx.arc(dw*.2,-78,46,-1.3,.45);ctx.stroke();ctx.strokeStyle='#fff';ctx.lineWidth=4;ctx.beginPath();ctx.arc(dw*.2,-78,36,-1.1,.3);ctx.stroke();}
      ctx.restore();
    }
  }
  if(p.state!=='dead')txt(ch.name,p.x,p.y-dh-(p.drunk>0?36:16),13,p.i===0?'#c7a6ff':'#9fd0ff');
  if(p.drunk>0&&p.state!=='dead')txt('~@~',p.x,p.y-dh-12,14,'#9be04a');
}
function drawEnemy(e){
  if(e.isBoss){drawBoss(e);return;}
  const st=e.state,t=gt;let fr=null;
  if(e.T.anim&&IMG.anim){
    if(st==='down'||st==='dead'){if(e.koS===undefined||e.koSt!==st){if(e.koS===undefined)e.koS=t;e.koSt=st;}
      fr=AF(e.T.anim,'ko',Math.min(ANIM[e.T.anim].a.ko?ANIM[e.T.anim].a.ko.length-1:0,Math.floor((t-e.koS)/.075)));if(!fr||!ANIM[e.T.anim].a.ko)fr=AF(e.T.anim,'walk',0);}
    else{e.koS=undefined;
      const an=e.T.anim,D=ANIM[an],has=n=>D&&D.a[n]&&D.a[n].length,mv=Math.abs(e.vx)>10,prog=(v,n)=>Math.max(0,Math.min(n-1,Math.floor(v*n)));
      if(st==='hurt')fr=AF(an,'hurt',Math.floor(t*8))||AF(an,'walk',0);
      else if(e.guardOn&&has('guard'))fr=AF(an,'guard',Math.floor(t*6));
      else if(st==='whistle'&&has('whistle'))fr=AF(an,'whistle',prog(e.st/1.1,D.a.whistle.length));
      else if(st==='wind'&&has('wind'))fr=AF(an,'wind',prog(e.st/e.T.wind,D.a.wind.length));
      else if(st==='atk'&&has('atk'))fr=AF(an,'atk',prog(e.st/(e.charge?.4:.16),D.a.atk.length));
      else if(e.T.ranged&&st==='rec'&&e.st<.35&&has('atk'))fr=AF(an,'atk',prog(e.st/.35,D.a.atk.length));
      else if((st==='chase'||st==='rec')&&mv)fr=AF(an,'walk',Math.floor(t*(e.charge||e.type==='dog'||e.type==='rowdy'?14:10)+e.x*.01));
      else if(has('idle'))fr=AF(an,'idle',Math.floor(t*(e.type==='bouncer'?4:5)+e.x*.01));
      else fr=AF(an,'walk',0);}
  }
  const c=fr?null:SPR[e.T.spr];if(!c&&!fr)return;
  const S=2,dw=fr?fr.w:c.width*S,dh=fr?fr.h:c.height*S;
  if(st==='dead'&&e.dead<.5&&Math.floor(t*20)%2)return;
  shadow(e.x,e.y,dw*.4);
  ctx.save();ctx.translate(e.x,e.y);ctx.scale(e.face*(fr?fr.nf:1),1);ctx.imageSmoothingEnabled=!!fr;
  let rot=0,dx=0,dy=0,lying=false;
  if(!fr&&(st==='chase'||st==='rec')&&Math.abs(e.vx)>10)dy=-Math.abs(Math.sin(t*14+e.x))*4;
  if(!fr){if(st==='wind'){rot=-.14;dx=-4+Math.sin(t*50)*2;}
  if(st==='atk'){rot=.16;dx=12;}
  if(st==='hurt'){rot=-.22;dx=-8;}
  if(e.T.sway&&st==='chase')rot=Math.sin(e.t*3)*.1;}else if(st==='hurt')dx=-5;
  if((st==='down'||st==='dead')&&!fr){if(e.onGround)lying=true;else rot=-.9;}
  if(lying){ctx.translate(-dh*.05,-dw*.5*(e.type==='dog'?.5:1));ctx.rotate(-Math.PI/2*.98);}
  else{ctx.translate(dx,dy);ctx.rotate(rot);}
  if(fr){drawFr(fr,0,0,e.flash>0);}else{
  const src=(e.flash>0)?whiteOf(c,'spr'+e.T.spr,0,0,c.width,c.height):c;
  ctx.drawImage(src,-dw/2,-dh+S,dw,dh);}
  if(st==='atk'&&!e.charge&&e.type!=='dog'){ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=4;ctx.beginPath();ctx.arc(e.T.range*.8,-dh*.55,22,-1,1);ctx.stroke();}
  ctx.restore();
  if(st==='wind')txt('!',e.x,e.y-e.h-18,28,'#ff3a3a');
  if(st!=='dead'){
    const bw=Math.max(40,e.w);ctx.fillStyle='#000';ctx.fillRect(e.x-bw/2,e.y-e.h-12,bw,6);
    ctx.fillStyle='#d9534f';ctx.fillRect(e.x-bw/2+1,e.y-e.h-11,(bw-2)*e.hp/e.maxhp,4);
  }
}
function bossFrame(e){
  const t=gt;let n='idle',i=Math.floor(t*4)%3;
  switch(e.state){
    case 'intro':n='taunt';i=e.st<1.4?0:e.st<2.4?1:2;break;
    case 'stance':
      if(Math.abs(e.vx)>10){n='walk';i=Math.floor(t*8)%5;}
      else if(e.guardOn){n='block';i=0;}
      break;
    case 'wind':
      switch(e.move){case 'teep':n='kick';i=0;break;case 'low':n='sweep';i=0;break;case 'knee':n='knee';i=0;break;default:n='counter';i=1;}
      break;
    case 'atk':
      switch(e.move){case 'teep':n='kick';i=1;break;case 'low':n='sweep';i=1;break;case 'knee':n='knee';i=e.st<.2?1:2;break;default:n='counter';i=3;}
      break;
    case 'stagger':n='guardbreak';i=1;break;
    case 'hurt':n='hit';i=0;break;
    case 'dead':if(e.t<.2){n='ko';i=0;}else if(e.t<.5){n='ko';i=1;}else{n='down';i=e.t<1.1?0:1;}break;
  }
  return [n,i];
}
function drawBoss(e){
  const im=IMG.saenchai;if(!im)return;
  const [n,i]=bossFrame(e),f=ATLAS[n][i],s=1.16;
  shadow(e.x,e.y,44);
  ctx.save();ctx.translate(e.x,e.y);ctx.scale(e.face,1);ctx.imageSmoothingEnabled=true;
  if(e.flash>0)ctx.drawImage(whiteOf(im,'bs'+n+i,f.x,f.y,f.w,f.h),0,0,f.w,f.h,-f.ax*s,-f.ay*s,f.w*s,f.h*s);
  else ctx.drawImage(im,f.x,f.y,f.w,f.h,-f.ax*s,-f.ay*s,f.w*s,f.h*s);
  ctx.restore();
  if(e.state==='wind'){ctx.strokeStyle='rgba(255,179,71,.85)';ctx.lineWidth=3;ctx.strokeRect(e.x-e.w/2-6,e.y-e.h-6,e.w+12,e.h+12);}
  if(e.guardOn&&e.state==='stance'){ctx.strokeStyle='rgba(156,204,255,.6)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(e.x+e.face*34,e.y-e.h*.7,36,-1.2,1.2);ctx.stroke();}
  if(e.state==='stagger')txt('* * *',e.x,e.y-e.h-14,18,'#ffe27a');
}
function drawProjs(){
  ctx.imageSmoothingEnabled=false;
  for(const q of projs){ctx.save();ctx.translate(q.x,q.y);ctx.rotate(q.rot);ctx.drawImage(SPR.coconut,-14,-14,28,28);ctx.restore();}
}
function drawArenaRopes(){
  const ys=[GROUND-150,GROUND-105,GROUND-60];
  ctx.lineCap='round';
  for(const y of ys){ctx.strokeStyle='#1b1020';ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(26,y);ctx.lineTo(W-26,y);ctx.stroke();
    ctx.strokeStyle='#d9534f';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(26,y);ctx.lineTo(W-26,y);ctx.stroke();}
  for(const x of [26,W-26]){ctx.fillStyle='#1b1020';ctx.fillRect(x-9,GROUND-170,18,170);ctx.fillStyle='#e9d9a8';ctx.fillRect(x-6,GROUND-168,12,168);}
}
function drawDebug(){
  ctx.lineWidth=1;
  for(const p of players){
    ctx.strokeStyle='#0f0';const r=prect(p);ctx.strokeRect(r.x,r.y,r.w,r.h);
    if(p.atk&&p.state==='attack'&&p.atk.t>=p.atk.st&&p.atk.t<p.atk.st+p.atk.ac){ctx.strokeStyle='#f00';const h=hitbox(p);ctx.strokeRect(h.x,h.y,h.w,h.h);}
  }
  for(const e of enemies){ctx.strokeStyle='#ff0';ctx.strokeRect(e.x-e.w/2,e.y-e.h,e.w,e.h);txt(e.state,e.x,e.y+12,10,'#ff0',false);}
  ctx.strokeStyle='#0ff';for(const p of plats)ctx.strokeRect(p.x,p.y,p.w,4);
}
function bar(x,y,w,h,v,col,bg){ctx.fillStyle='#000';ctx.fillRect(x-2,y-2,w+4,h+4);ctx.fillStyle=bg||'#3a1a1a';ctx.fillRect(x,y,w,h);ctx.fillStyle=col;ctx.fillRect(x,y,w*clamp(v,0,1),h);ctx.fillStyle='rgba(255,255,255,.22)';ctx.fillRect(x,y,w*clamp(v,0,1),Math.max(2,h/3));}
function portrait(x,y,s,img,sx,sy,sw,sh,col){
  ctx.fillStyle='#000';ctx.fillRect(x-3,y-3,s+6,s+6);ctx.fillStyle=col;ctx.fillRect(x,y,s,s);
  ctx.imageSmoothingEnabled=true;ctx.drawImage(img,sx,sy,sw,sh,x,y,s,s);
}
function drawHUD(){
  players.forEach((p,i)=>{
    const im=IMG[p.ch.img];
    const x=i===0?16:W-16-300;
    portrait(i===0?x:x+300-58,14,58,im,0,0,im.width,im.width,i===0?'#3a2470':'#1c3a70');
    const bx=i===0?x+70:x,bw=230;
    bar(bx,24,bw,16,p.hp/p.maxhp,p.ch.col);
    txt(p.ch.name+(i===1?'  (HasGirlfriendMan)':''),bx+(i===0?0:bw),12,13,i===0?'#c7a6ff':'#9fd0ff',i===0?'left':'right');
    if(p.drunk>0){bar(bx,46,110,8,p.drunk/14,'#9be04a','#1e2a12');txt('BESOFFEN',bx+116,50,11,'#9be04a','left');}
    if(p.combo>1)txt('x'+p.combo+' COMBO',bx+(i===0?0:bw),70,16,'#ffd84a',i===0?'left':'right');
    if(p.state==='dead')txt('K.O. – wartet auf Wiederbelebung',bx+(i===0?0:bw),70,12,'#ff6a6a',i===0?'left':'right');
  });
  txt((scene==='boss'?'BOSS · HUA HIN':'STAGE '+ST.id+' · '+ST.name),W/2,14,13,'#fff');
  txt('Ton: '+(MUSIC_ON?'Musik an':'Musik aus')+' (N) · Friendly Fire: '+(friendly?'AN':'aus')+' (O) · Hitboxen (1) · Pause (P) · Menü (Esc)',W/2,H-9,11,'#e6ebf3');
  if(scene==='stage'&&!waveActive&&waveIdx<ST.waves.length&&waveIdx>0){if(Math.floor(gt*2)%2)txt('GO ➜',W-80,H/2,36,'#ffd84a');}
  if(scene==='boss'&&bossRef){
    const b=bossRef,f=ATLAS.idle[0];
    portrait(W/2-262,92,58,IMG.saenchai,f.x,f.y,f.w,f.w,'#4a2a1a');
    bar(W/2-196,118,400,14,b.hp/b.maxhp,'#d9534f');
    ctx.fillStyle='#fff';for(const q of [.33,.66])ctx.fillRect(W/2-196+400*q-1,116,2,18);
    txt('SAENCHAI',W/2-196,104,15,'#fff','left');
    if(b.state==='intro')txt('WAI KRU …',W/2,H/2-60,40,'#ffd84a');
  }
  if(bannerT>0){const a=Math.min(1,bannerT*1.5,(2.8-bannerT)*3);ctx.globalAlpha=clamp(a,0,1);
    ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(0,H/2-120,W,64);txt(bannerTxt,W/2,H/2-88,34,'#ffd84a');ctx.globalAlpha=1;}
  if(tipT>0)txt(tip,W/2,H-30,13,'#fff');
}
function drawTitle(){
  const bgi=IMG.bgA;
  if(bgi){ctx.imageSmoothingEnabled=true;ctx.drawImage(bgi,200,0,W,H,0,0,W,H);}
  ctx.fillStyle='rgba(8,10,24,.7)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='rgba(0,0,0,.45)';ctx.fillRect(220,178,520,200);
  if(IMG.rix){const r=IMG.rix,h=IMG.hgm;ctx.imageSmoothingEnabled=true;ctx.drawImage(r,80,300,r.width*1.7,r.height*1.7);ctx.drawImage(h,W-80-h.width*1.7,300,h.width*1.7,h.height*1.7);}
  txt('THAI VACATION',W/2,70,58,'#ffd84a');
  txt('Beta · Phase 4 · Level 1: Hua Hin',W/2,116,18,'#9fd0ff');
  txt('RIX  &  HasGirlfriendMan',W/2,150,22,'#fff');
  const rows=[['','Spieler 1 (RIX)','Spieler 2 (HGM)'],['Bewegen / Springen','A D / W','← → / ↑'],['Faust · Schienbein','F · G',', · .'],['Knie · Ellbogen','H · T','/ · ;'],
    ['Guard / durch Plattform fallen','S  (S+W)','↓  (↓+↑)'],['Tag-Team-Wurf (Koop)','Guard + Faust neben dem Partner','']];
  rows.forEach((r,i)=>{const y=196+i*24;txt(r[0],240,y,13,'#e6ebf3','left',false);txt(r[1],590,y,13,i?'#d8c2ff':'#fff','center',false);txt(r[2],760,y,13,i?'#b9deff':'#fff','center',false);});
  txt('Gamepad: Stick/D-Pad · A Sprung · X Faust · Y Schienbein · B Knie · RB Ellbogen · LB Guard',W/2,352,12,'#cfd6e0',null,false);
  txt('Modus:  '+(numPlayers===1?(soloChar===1?'1 SPIELER (nur HGM – beide Tastaturbelegungen)':'1 SPIELER (nur RIX – beide Tastaturbelegungen)'):'2 SPIELER KOOP (RIX + HGM)')+'   [1 Rix / 3 HGM / 2 Koop / M]',W/2,384,14,'#ffd84a');
  txt('Start: Stage '+STAGES[selStage].id+' · '+STAGES[selStage].name+'   [S = Stage wählen · freigeschaltet: '+(Math.min(SAVE.unlocked,STAGES.length-1)+1)+'/4]',W/2,408,13,'#9be04a');
  txt(loaded?'ENTER  –  Spiel starten':'Lade Grafiken …',W/2,446,24,'#fff');
  txt('B  –  Boss-Testarena (Saenchai)   ·   R  –  Ablöse: erst RIX, dann HGM',W/2,476,17,'#ffb347');
  txt('F2 = Level-Editor'+(customLevels?'  (eigene Level aktiv)':'')+'   ·   Musik & Sounds sind Synth-Platzhalter · N = Musik an/aus',W/2,510,12,customLevels?'#ffd84a':'#8892a6',null,false);
}
function fmtT(s){return Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');}
function drawOverlay(){
  if(scrFlash>0){ctx.globalAlpha=Math.min(.6,scrFlash*1.4);ctx.fillStyle=scrCol;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;}
  if((scene==='stage'||scene==='boss')&&players.some(p=>p.state!=='dead'&&p.hp/p.maxhp<.25)){
    const a=.32+.16*Math.sin(gt*6),g=ctx.createRadialGradient(W/2,H/2,H*.28,W/2,H/2,H*.8);
    g.addColorStop(0,'rgba(200,0,0,0)');g.addColorStop(1,'rgba(200,0,0,'+a+')');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  }
  if(scene==='over'){
    ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(0,0,W,H);
    txt('BEIDE K.O. – OHWEEEEEE!',W/2,H/2-20,40,'#ff6a6a');
    if(overT>.8)txt('ENTER: nochmal versuchen',W/2,H/2+36,20,'#fff');
  }
  if(scene==='clear'){
    ctx.fillStyle='rgba(0,0,0,.66)';ctx.fillRect(0,0,W,H);
    txt(clearMsg,W/2,H/2-84,38,'#ffd84a');
    txt('Zeit: '+fmtT(stageTime)+'   ·   Gegner K.O.: '+kills+(newBest&&!bossMode?'   ·   NEUE BESTZEIT!':''),W/2,H/2-26,19,'#fff');
    const nxt=bossMode?'ENTER: zurück ins Menü  ·  Esc: Menü':(stageIdx>=STAGES.length-1?'ENTER: weiter zum BOSS  ·  Esc: Menü':'ENTER: weiter zu Stage '+STAGES[stageIdx+1].id+' · '+STAGES[stageIdx+1].name+'  ·  Esc: Menü');
    txt(nxt,W/2,H/2+34,17,'#9fd0ff');
    if(bossMode)txt('Level 1 – Hua Hin geschafft. Weiter geht es in Phase 4!',W/2,H/2+74,15,'#ffb347');
  }
  if(paused){ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(0,0,W,H);txt('PAUSE',W/2,H/2,48,'#fff');}
}
function render(){
  ctx.setTransform(cv.width/W,0,0,cv.height/H,0,0);
  ctx.globalAlpha=1;
  if(scene==='editor'){edRender();return;}
  if(scene==='title'||!worldCanvas){ctx.fillStyle='#0b0d12';ctx.fillRect(0,0,W,H);drawTitle();return;}
  ctx.save();
  if(shake>0)ctx.translate(rand(-shake,shake),rand(-shake,shake));
  if(players.some(p=>p.drunk>0)){ctx.translate(W/2,H/2);ctx.rotate(Math.sin(gt*2)*.012*Math.min(1,Math.max(...players.map(p=>p.drunk))/3));ctx.translate(-W/2,-H/2);}
  ctx.imageSmoothingEnabled=true;
  ctx.drawImage(worldCanvas,cam.x,0,W,H,0,0,W,H);
  ctx.save();ctx.translate(-cam.x,0);
  drawPlatforms2();
  if(scene==='boss')drawArenaRopes();
  const list=[];
  for(const e of enemies)list.push(e);
  for(const p of players)list.push(p);
  list.sort((a,b)=>((a.state==='dead'||a.state==='down')?0:1)-((b.state==='dead'||b.state==='down')?0:1)||a.y-b.y);
  for(const o of list){if(o.ch)drawHero(o);else drawEnemy(o);}
  drawProjs();
  for(const q of parts){ctx.globalAlpha=1-q.t/q.life;ctx.fillStyle=q.col;ctx.fillRect(q.x,q.y,q.size,q.size);}
  ctx.globalAlpha=1;
  for(const t of texts){ctx.globalAlpha=Math.min(1,(t.life-t.t)*3);txt(t.s,t.x,t.y,t.size,t.col);}
  ctx.globalAlpha=1;
  if(debug)drawDebug();
  ctx.restore();
  for(const it of items)if(!it.taken)drawBottle(it);
  ctx.restore();
  drawHUD();drawOverlay();
}
function drawPlatforms2(){ // Plattformen im Weltkoordinaten-Raum
  ctx.imageSmoothingEnabled=false;
  for(const p of plats){if(p.x>cam.x+W+20||p.x+p.w<cam.x-20)continue;if(p.img){ctx.imageSmoothingEnabled=true;drawPropImg(p.img,p.t,p.x,p.y,p.w,p.h);ctx.imageSmoothingEnabled=false;}else ctx.drawImage(p.c,p.x-S3,p.y-S3,p.c.width*S3,p.c.height*S3);}
}

/* ---------------- Loop ---------------- */
let last=performance.now(),acc=0;
function loop(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;acc+=dt;
  try{while(acc>=1/60){step(1/60);acc-=1/60;}render();}catch(err){console.error(err&&err.stack||err);acc=0;}
  requestAnimationFrame(loop);
}
loadAssets().then(()=>{buildSprites();loaded=true;});
requestAnimationFrame(loop);
window.__game={get scene(){return scene;},get players(){return players;},get enemies(){return enemies;},get cam(){return cam;},step,startStage,startBoss,get waveIdx(){return waveIdx;},get loaded(){return loaded;}};
