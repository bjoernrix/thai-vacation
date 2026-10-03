/* ---------------- Assets ---------------- */
const IMG={};
function loadAssets(){
  return Promise.all(Object.keys(ASSET_SRC).map(n=>new Promise(res=>{
    const im=new Image();im.onload=()=>{IMG[n]=im;res();};im.onerror=()=>res();im.src=ASSET_SRC[n];
  })));
}
const WHITE=new Map();
function whiteOf(src,key,sx,sy,sw,sh){
  let c=WHITE.get(key);if(c)return c;
  c=document.createElement('canvas');c.width=sw;c.height=sh;const g=c.getContext('2d');
  g.drawImage(src,sx,sy,sw,sh,0,0,sw,sh);g.globalCompositeOperation='source-in';g.fillStyle='#fff';g.fillRect(0,0,sw,sh);
  WHITE.set(key,c);return c;
}

/* ---------------- Pixel-Sprite-Helfer (für Gegner & Props) ---------------- */
function outline(c){
  const g=c.getContext('2d'),w=c.width,h=c.height,id=g.getImageData(0,0,w,h),d=id.data,out=new Uint8ClampedArray(d);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const i=(y*w+x)*4;if(d[i+3]>0)continue;
    if((x>0&&d[i-1]>0)||(x<w-1&&d[i+7]>0)||(y>0&&d[i-w*4+3]>0)||(y<h-1&&d[i+w*4+3]>0)){out[i]=27;out[i+1]=16;out[i+2]=32;out[i+3]=255;}
  }
  id.data.set(out);g.putImageData(id,0,0);
}
function shade(c){
  const g=c.getContext('2d'),w=c.width,h=c.height,id=g.getImageData(0,0,w,h),d=id.data,o=new Uint8ClampedArray(d);
  const A=(x,y)=>(x<0||y<0||x>=w||y>=h)?0:d[(y*w+x)*4+3];
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const i=(y*w+x)*4;if(d[i+3]===0)continue;
    let k=1;
    if(!A(x-1,y)||!A(x,y-1))k*=1.22;            // Licht von links oben
    if(!A(x+1,y)||!A(x,y+1))k*=.72;             // Schattenkante rechts unten
    k*=1-0.16*(y/h);                              // dunkler zum Boden hin
    o[i]=Math.min(255,d[i]*k);o[i+1]=Math.min(255,d[i+1]*k);o[i+2]=Math.min(255,d[i+2]*k);
  }
  id.data.set(o);g.putImageData(id,0,0);
}
function mkSprite(w,h,draw,noShade){
  const c=document.createElement('canvas');c.width=w+2;c.height=h+2;
  const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.translate(1,1);draw(g);
  g.setTransform(1,0,0,1,0,0);if(!noShade)shade(c);outline(c);return c;
}
const R=(g,x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h);};
function E(g,cx,cy,rx,ry,col){
  g.fillStyle=col;
  for(let y=-ry;y<=ry;y++){const xw=Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/(ry*ry+.01))));g.fillRect(cx-xw,cy+y,xw*2+1,1);}
}
const SPR={};
function buildSprites(){
  // Sonnenbrand-Tourist
  SPR.tourist=mkSprite(44,66,g=>{
    const sk='#e8604e';
    R(g,10,62,9,3,'#6b4a2a');R(g,25,62,9,3,'#6b4a2a');
    R(g,11,55,7,7,'#f3f0e6');R(g,26,55,7,7,'#f3f0e6');
    R(g,11,44,7,11,sk);R(g,26,44,7,11,sk);
    R(g,9,38,26,9,'#d8c08a');R(g,21,38,2,9,'#b9a06a');
    E(g,22,30,14,11,'#1fa39a');
    [[14,27,'#ff6fa8'],[22,23,'#ffd84a'],[29,30,'#ff6fa8'],[18,35,'#ffd84a'],[26,36,'#fff'],[12,33,'#ffd84a']].forEach(d=>R(g,d[0],d[1],3,3,d[2]));
    R(g,4,24,6,16,sk);R(g,34,24,6,16,sk);
    R(g,19,22,6,5,'#222');R(g,21,19,2,3,'#222');
    E(g,22,12,9,9,sk);R(g,28,11,3,5,'#fff');R(g,22,9,13,4,'#111');R(g,24,18,9,2,'#4a2a1a');
    E(g,22,5,15,3,'#f3e6b8');R(g,15,0,14,5,'#f3e6b8');R(g,15,4,14,1,'#d9534f');
  });
  // Betrunkener Tourist
  SPR.drunk=mkSprite(48,66,g=>{
    const sk='#f0a98a';
    R(g,10,62,10,3,'#222');R(g,25,62,10,3,'#222');
    R(g,11,44,7,18,sk);R(g,26,44,7,18,sk);
    R(g,9,36,26,10,'#2a3a6e');
    E(g,22,28,13,11,'#e9e9f0');R(g,16,30,4,4,'#c9a83a');R(g,26,34,5,3,'#c9a83a');
    R(g,5,22,6,16,sk);R(g,33,22,6,16,sk);
    R(g,38,26,7,10,'#e8c84a');R(g,38,24,7,3,'#fff');R(g,45,28,2,5,'#e8c84a');
    E(g,22,11,9,9,sk);R(g,26,12,4,4,'#e0605a');R(g,22,9,10,3,'#111');R(g,19,17,10,3,'#6a3a2a');
    R(g,14,1,16,5,'#6a4a2a');
  });
  // Moped-Rowdy
  SPR.rowdy=mkSprite(40,66,g=>{
    const sk='#c9966c';
    R(g,10,61,10,4,'#f3f0e6');R(g,22,61,10,4,'#f3f0e6');
    R(g,12,42,7,19,'#2d3b6e');R(g,23,42,7,19,'#2d3b6e');
    R(g,11,24,18,19,'#d9534f');R(g,11,24,5,19,'#1b1b22');R(g,24,24,5,19,'#1b1b22');
    R(g,5,25,6,16,sk);R(g,29,25,6,16,sk);
    E(g,20,14,8,8,sk);R(g,12,7,16,4,'#e8c84a');R(g,9,8,4,5,'#e8c84a');R(g,13,2,14,5,'#111');
    R(g,20,12,9,3,'#111');R(g,28,18,6,1,'#fff');
  });
  // Straßenköter
  SPR.dog=mkSprite(46,30,g=>{
    const tan='#c79a5a';
    R(g,11,21,4,8,tan);R(g,18,21,4,8,tan);R(g,27,21,4,8,tan);R(g,34,21,4,8,tan);
    E(g,22,16,14,7,tan);E(g,38,11,6,5,tan);R(g,41,12,5,4,'#a67a3a');R(g,45,12,2,2,'#111');
    R(g,33,3,4,7,'#7a5230');R(g,39,8,2,2,'#111');R(g,5,6,3,9,tan);R(g,8,5,3,3,tan);R(g,34,15,4,2,'#d9534f');
  });
  // Fetter Türsteher
  SPR.bouncer=mkSprite(56,76,g=>{
    const sk='#b9855e';
    R(g,14,70,13,5,'#111');R(g,30,70,13,5,'#111');
    R(g,16,50,10,21,'#101014');R(g,31,50,10,21,'#101014');
    R(g,11,22,34,30,'#16161a');R(g,21,34,14,3,'#e9e9e9');R(g,24,38,8,2,'#e9e9e9');
    R(g,3,26,10,20,sk);R(g,43,26,10,20,sk);R(g,13,38,30,8,sk);
    E(g,28,13,11,11,sk);R(g,20,10,18,4,'#0a0a0a');R(g,18,13,1,14,'#eee');R(g,25,21,7,3,'#2a1a10');
  });
  // Affe
  SPR.monkey=mkSprite(36,38,g=>{
    const fur='#8a5a2a';
    R(g,1,12,3,16,fur);R(g,4,10,4,3,fur);
    R(g,10,30,5,7,fur);R(g,19,30,5,7,fur);
    E(g,16,23,9,9,fur);E(g,18,24,5,6,'#d9a874');
    R(g,3,20,4,14,fur);R(g,25,20,4,14,fur);
    E(g,17,10,8,8,fur);E(g,20,12,5,5,'#e8b98a');R(g,21,9,2,2,'#111');R(g,17,9,2,2,'#111');
    E(g,9,9,3,3,'#d9a874');E(g,25,9,3,3,'#d9a874');
  });
  // Kokosnuss
  SPR.coconut=mkSprite(12,12,g=>{E(g,6,6,5,5,'#6b4a2a');R(g,4,3,2,2,'#a67a3a');R(g,7,7,1,1,'#111');R(g,5,7,1,1,'#111');});
}
/* ---------------- Props (Plattformen) ---------------- */
const S3=3;
const PROPIMG={};
function propImg(t){ // Bild-Requisite aus dem Atlas (Set 'props'), sonst null
  if(PROPIMG[t]!==undefined)return PROPIMG[t];
  const d=ANIM.props,L=d&&d.a[t],img=d&&IMG[d.img];
  if(!L||!img){PROPIMG[t]=null;return null;}
  const f=L[0],c=document.createElement('canvas');c.width=f[2];c.height=f[3];c.getContext('2d').drawImage(img,f[0],f[1],f[2],f[3],0,0,f[2],f[3]);
  PROPIMG[t]=c;return c;
}
function drawPropImg(img,t,x,y,w,h){ // Heuballen werden vertikal gestapelt statt gestreckt
  if(t==='hay'||t==='hay2'){const n=Math.max(1,Math.round(h/70)),bh=h/n;for(let i=0;i<n;i++)ctx.drawImage(img,x,y+i*bh,w,bh);}
  else ctx.drawImage(img,x,y,w,h);
}
function propCanvas(t,w,h){
  const lw=Math.round(w/S3),lh=Math.round(h/S3);
  const c=mkSprite(lw,lh,g=>{
    if(t==='crate'){
      R(g,0,0,lw,lh,'#b07a3a');
      for(let y=0;y<lh;y+=Math.ceil(lh/2)){R(g,0,y,lw,1,'#6b4a2a');}
      for(let x=3;x<lw;x+=7){R(g,x,0,1,lh,'#8a5a2a');}
      R(g,2,0,3,2,'#2f8f3a');R(g,lw-6,0,3,2,'#2f8f3a');
    }else if(t==='moped'){
      R(g,3,3,14,8,'#2f58c7');R(g,5,1,12,3,'#222');R(g,6,11,12,3,'#2f58c7');R(g,12,10,8,2,'#1d3a8a');
      R(g,19,2,3,11,'#2f58c7');R(g,18,0,7,2,'#444');R(g,24,0,2,2,'#bbb');R(g,22,5,3,3,'#ffe27a');R(g,21,12,6,2,'#2f58c7');
      R(g,1,12,4,2,'#777');E(g,6,17,4,4,'#1a1a22');E(g,24,17,4,4,'#1a1a22');E(g,6,17,2,2,'#9aa');E(g,24,17,2,2,'#9aa');
    }else if(t==='stall'){
      for(let x=0;x<lw;x+=3){R(g,x,0,3,5,(x/3)%2?'#f3f0e6':'#d9534f');R(g,x,5,3,(x/3)%2?1:2,(x/3)%2?'#f3f0e6':'#d9534f');}
      R(g,2,7,2,9,'#7a5230');R(g,lw-4,7,2,9,'#7a5230');
      R(g,Math.round(lw*.5),7,1,3,'#222');E(g,Math.round(lw*.5),12,2,3,'#ff9a3c');
    }else if(t==='balcony'){
      R(g,0,0,lw,3,'#8a5a30');R(g,0,3,lw,1,'#4a2a10');
      for(let i=0;i<8;i++){R(g,3+i,4+i,2,1,'#5a3a1a');R(g,lw-5-i,4+i,2,1,'#5a3a1a');}
      for(let x=6;x<lw-6;x+=8)R(g,x,4,2,3,'#5a3a1a');
      R(g,Math.round(lw*.5),4,1,4,'#222');E(g,Math.round(lw*.5),11,2,3,'#ff9a3c');
    }else if(t==='rock'){
      for(let y=0;y<lh;y++){const inset=Math.max(0,Math.round((lh-y)*.0)+ (y<3?3-y:0)*2);R(g,inset,y,lw-inset*2,1,y%5<2?'#8a8f92':'#767b7e');}
      R(g,2,0,lw-4,2,'#4f8a3a');R(g,4,2,3,2,'#4f8a3a');
    }else if(t==='bench'){
      R(g,0,0,lw,3,'#8a5a30');R(g,0,3,lw,1,'#4a2a10');
      R(g,3,4,3,lh-4,'#5a3a1a');R(g,lw-6,4,3,lh-4,'#5a3a1a');
    }else if(t==='branch'){
      R(g,0,1,lw,4,'#6b4a2a');R(g,0,0,lw,1,'#8a5a30');
      for(let x=2;x<lw-4;x+=9){E(g,x+3,6,4,3,'#3f8f3a');E(g,x+6,3,3,2,'#58b04a');}
    }
  });
  return c;
}
/* ---------------- Welt-Hintergründe ---------------- */
function lanternSpots(tile){
  const c=document.createElement('canvas');c.width=tile.width;c.height=tile.height;const g=c.getContext('2d');g.drawImage(tile,0,0);
  const d=g.getImageData(0,0,c.width,c.height).data,cell=18,spots=[];
  for(let cy=0;cy<c.height;cy+=cell)for(let cx=0;cx<c.width;cx+=cell){
    let n=0,sx=0,sy=0;
    for(let y=cy;y<Math.min(c.height,cy+cell);y+=2)for(let x=cx;x<Math.min(c.width,cx+cell);x+=2){
      const i=(y*c.width+x)*4,r=d[i],gg=d[i+1],b=d[i+2];
      if(r>215&&gg>110&&gg<215&&b<120){n++;sx+=x;sy+=y;}
    }
    if(n>=8)spots.push([sx/n,sy/n,Math.min(1,n/40)]);
  }
  return spots;
}
function glowAt(g,x,y,r,col,a){
  const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,col.replace('A',a));gr.addColorStop(1,col.replace('A',0));
  g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2);
}
function gradeWorld(g,W_,spots,mode){
  if(mode==='night'||mode==='dusk'){
    g.save();g.globalCompositeOperation='multiply';
    const gr=g.createLinearGradient(0,0,0,H);
    if(mode==='night'){gr.addColorStop(0,'rgb(55,62,125)');gr.addColorStop(1,'rgb(95,100,150)');}
    else{gr.addColorStop(0,'rgb(255,140,110)');gr.addColorStop(.6,'rgb(255,185,150)');gr.addColorStop(1,'rgb(230,170,150)');}
    g.fillStyle=gr;g.fillRect(0,0,W_,H);g.restore();
    g.save();g.globalCompositeOperation='lighter';
    for(const s of spots)glowAt(g,s[0],s[1],mode==='night'?56:40,'rgba(255,170,60,A)',(mode==='night'?.5:.3)*s[2]);
    g.restore();
  }
  const vg=g.createLinearGradient(0,H-110,0,H);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.28)');
  g.fillStyle=vg;g.fillRect(0,H-110,W_,110);
}
const SEAM=110;
function buildWorld(st){
  const tl=st.tiles,t0=IMG[tl[0][0]],t1=IMG[tl[1][0]],tw0=t0.width,tw1=t1.width;
  const seam=(tl[1][1]||tl[0][1])?0:SEAM; // gespiegelte Tiles passen nahtlos, verschiedene Bilder werden überblendet
  WORLD=tw0+tw1-seam;
  const c=document.createElement('canvas');c.width=WORLD;c.height=H;const g=c.getContext('2d');
  const spots=[];
  const place=(img,mir,x0,w,fade)=>{
    const lt=document.createElement('canvas');lt.width=w;lt.height=H;const lg=lt.getContext('2d');
    if(mir){lg.translate(w,0);lg.scale(-1,1);}
    lg.drawImage(img,0,0);
    if(mir)lg.setTransform(1,0,0,1,0,0);
    if(fade>0){lg.globalCompositeOperation='destination-in';const gr=lg.createLinearGradient(0,0,w,0);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(fade/w,'rgba(0,0,0,1)');gr.addColorStop(1,'rgba(0,0,0,1)');
      lg.fillStyle=gr;lg.fillRect(0,0,w,H);}
    g.drawImage(lt,x0,0);
    for(const sp of lanternSpots(img))spots.push([x0+(mir?w-sp[0]:sp[0]),sp[1],sp[2]]);
  };
  place(t0,!!tl[0][1],0,tw0,0);
  place(t1,!!tl[1][1],tw0-seam,tw1,seam);
  gradeWorld(g,WORLD,st.grade?spots:[],st.grade);
  return c;
}
function buildArena(){
  const tile=IMG.bgB,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
  g.drawImage(tile,-330,0);
  const spots=lanternSpots(tile).map(s=>[s[0]-330,s[1],s[2]]).filter(s=>s[0]>0&&s[0]<W);
  gradeWorld(g,W,spots,'night');
  g.save();g.globalCompositeOperation='lighter';
  glowAt(g,140,120,200,'rgba(255,60,140,A)',.28);glowAt(g,820,140,220,'rgba(60,200,255,A)',.25);
  g.restore();
  return c;
}
