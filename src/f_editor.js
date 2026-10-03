/* =========================================================
   LEVEL-EDITOR (Phase 4 · Stufe 1) – F2 im Titelbild
   Bearbeitet das STAGES-Datenobjekt: Plattformen, Flaschen (Items),
   Wellenmarker + Gegnerlisten. Live-Test mit Klick, Export/Import als JSON.
   ========================================================= */
const STAGES_DEFAULT=JSON.parse(JSON.stringify(STAGES));
const PLAT_TYPES=['crate','moped','stall','balcony','rock','bench','branch','hay','beercrate','bucket','hole_open','hole_closed','bait','table','table_tipped','box','crates','chair','record','vase','pricetag'];
const PLAT_DEF={crate:[78,45],moped:[90,63],stall:[170,125],balcony:[140,190],rock:[100,45],bench:[110,56],branch:[170,128]}; // [Breite, Höhe]
const LS_KEY='thaiVacationLevelsV1';
let customLevels=false;
try{const s=localStorage.getItem(LS_KEY);if(s){const a=JSON.parse(s);if(Array.isArray(a)&&a.length===STAGES.length&&a.every(o=>o&&o.waves&&o.plats&&o.items)){a.forEach((o,i)=>{STAGES[i]=o;});customLevels=true;}}}catch(e){}
function edPersist(){try{localStorage.setItem(LS_KEY,JSON.stringify(STAGES));customLevels=true;}catch(e){}}

const ed={sIdx:0,cam:0,tool:'sel',snap:10,sel:null,drag:null,testing:false,platType:'stall',msg:'',msgT:0,panel:null,propCache:{},world:null};
const EN_TYPES=Object.keys(ET).filter(k=>k!=='boss');
function edHue(s){let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))%360;return h;}
function edProp(t,w,h){const k=t+w+'x'+h;return ed.propCache[k]||(ed.propCache[k]=propCanvas(t,w,h));}
function edSnap(v){return ed.snap>1?Math.round(v/ed.snap)*ed.snap:Math.round(v);}
function edToast(s){ed.msg=s;ed.msgT=2.2;}

function openEditor(){
  scene='editor';ed.testing=false;stopMusic();edLoadStage(ed.sIdx);edPanel(true);edRefresh();
}
function closeEditor(){edPanel(false);scene='title';ed.testing=false;}
function edLoadStage(i){
  ed.sIdx=i;ST=STAGES[i];GROUND=ST.ground;ed.world=buildWorld(ST);ed.cam=0;ed.sel=null;ed.drag=null;
}
function edTest(){
  edPersist();
  const w=ed.sel&&ed.sel.k==='wave'?ST.waves[ed.sel.i]:null;
  carry=[null,null];ed.testing=true;edPanel(false);
  startStage(ed.sIdx);
  if(w){players.forEach((p,i)=>{p.x=Math.min(WORLD-100,w.cx+W/2+20+i*40);});cam.x=Math.min(w.cx,WORLD-W);}
  tip='EDITOR-TEST · Esc = zurück zum Editor';tipT=5;
}
function edBack(){ed.testing=false;scene='editor';stopMusic();edLoadStage(ed.sIdx);edPanel(true);edRefresh();}

/* ---------- Auswertung der Wellen ---------- */
function edWaveInfo(w,diff){
  let hp=0,press=0;
  for(const t of w.list){const T=ET[t];if(!T)continue;hp+=Math.round(T.hp*(1+.14*diff));press+=T.dmg*(1+.09*diff)/Math.max(.5,T.cool);}
  return {n:w.list.length,hp,press:Math.round(press)};
}

/* ---------- Eingabe ---------- */
function edMouse(e){const r=cv.getBoundingClientRect();return {x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height};}
function edHit(wx,wy){
  for(let i=ST.items.length-1;i>=0;i--){const a=ST.items[i],y=GROUND-a[1];if(wx>a[0]-14&&wx<a[0]+14&&wy>y-44&&wy<y+4)return {k:'item',i};}
  for(let i=ST.plats.length-1;i>=0;i--){const a=ST.plats[i],y=GROUND-a[3];if(wx>a[1]&&wx<a[1]+a[2]&&wy>y-8&&wy<y+Math.min(a[3],40))return {k:'plat',i};}
  for(let i=ST.waves.length-1;i>=0;i--){const c=ST.waves[i].cx;if(Math.abs(wx-c)<14&&wy<70)return {k:'wave',i};}
  return null;
}
cv.addEventListener('pointerdown',e=>{
  if(scene!=='editor')return;
  const m=edMouse(e),wx=m.x+ed.cam,wy=m.y;
  if(ed.tool!=='sel'){
    if(ed.tool==='plat'){const d=PLAT_DEF[ed.platType];ST.plats.push([ed.platType,edSnap(wx-d[0]/2),d[0],clamp(Math.round(GROUND-wy),20,320)]);ed.sel={k:'plat',i:ST.plats.length-1};}
    else if(ed.tool==='item'){ST.items.push([edSnap(wx),clamp(Math.round(GROUND-wy),0,320)]);ed.sel={k:'item',i:ST.items.length-1};}
    else if(ed.tool==='wave'){ST.waves.push({cx:clamp(edSnap(wx),0,WORLD-W),list:['tourist']});ST.waves.sort((a,b)=>a.cx-b.cx);ed.sel={k:'wave',i:ST.waves.findIndex(w=>w.cx===clamp(edSnap(wx),0,WORLD-W))};}
    ed.tool='sel';edPersist();edRefresh();return;
  }
  const h=edHit(wx,wy);ed.sel=h;
  if(h){const a=h.k==='plat'?ST.plats[h.i]:h.k==='item'?ST.items[h.i]:ST.waves[h.i];
    const ox=h.k==='plat'?a[1]:h.k==='item'?a[0]:a.cx;ed.drag={k:h.k,i:h.i,dx:wx-ox,dy:h.k==='plat'?wy-(GROUND-a[3]):0};cv.setPointerCapture(e.pointerId);}
  edRefresh();
});
cv.addEventListener('pointermove',e=>{
  if(scene!=='editor'||!ed.drag)return;
  const m=edMouse(e),wx=m.x+ed.cam,wy=m.y,d=ed.drag;
  if(d.k==='plat'){const a=ST.plats[d.i];a[1]=clamp(edSnap(wx-d.dx),0,WORLD-a[2]);a[3]=clamp(Math.round(GROUND-(wy-d.dy)),20,340);}
  else if(d.k==='item'){const a=ST.items[d.i];a[0]=clamp(edSnap(wx-d.dx),10,WORLD-10);a[1]=clamp(Math.round(GROUND-wy),0,340);}
  else{ST.waves[d.i].cx=clamp(edSnap(wx-d.dx),0,WORLD-W);}
  edSyncInputs();
});
cv.addEventListener('pointerup',()=>{if(ed.drag){ed.drag=null;if(ed.sel&&ed.sel.k==='wave')ST.waves.sort((a,b)=>a.cx-b.cx);edPersist();edRefresh();}});
cv.addEventListener('wheel',e=>{if(scene!=='editor')return;e.preventDefault();ed.cam=clamp(ed.cam+(e.deltaX||e.deltaY),0,WORLD-W);edSyncInputs();},{passive:false});
function edDelete(){
  if(!ed.sel)return;const s=ed.sel;
  if(s.k==='plat')ST.plats.splice(s.i,1);else if(s.k==='item')ST.items.splice(s.i,1);else if(ST.waves.length>1)ST.waves.splice(s.i,1);else{edToast('Mindestens eine Welle nötig');return;}
  ed.sel=null;edPersist();edRefresh();
}
function edDup(){
  if(!ed.sel)return;const s=ed.sel;
  if(s.k==='plat'){const a=ST.plats[s.i].slice();a[1]=Math.min(WORLD-a[2],a[1]+a[2]+20);ST.plats.push(a);ed.sel={k:'plat',i:ST.plats.length-1};}
  else if(s.k==='item'){const a=ST.items[s.i].slice();a[0]+=80;ST.items.push(a);ed.sel={k:'item',i:ST.items.length-1};}
  else{const w=ST.waves[s.i];ST.waves.push({cx:Math.min(WORLD-W,w.cx+200),list:w.list.slice()});ST.waves.sort((a,b)=>a.cx-b.cx);}
  edPersist();edRefresh();
}
function edStep(dt){
  const sp=(keys.ShiftLeft||keys.ShiftRight)?900:420;
  const free=document.activeElement===document.body;
  if(free&&(keys.KeyA||keys.ArrowLeft))ed.cam=Math.max(0,ed.cam-sp*dt);
  if(free&&(keys.KeyD||keys.ArrowRight))ed.cam=Math.min(WORLD-W,ed.cam+sp*dt);
  if(press.Delete||press.Backspace){if(document.activeElement===document.body)edDelete();}
  if(press.KeyP&&document.activeElement===document.body)edTest();
  if(press.Escape)closeEditor();
  if(ed.msgT>0)ed.msgT-=dt;
  clearPress();
}

/* ---------- Darstellung ---------- */
function edRender(){
  ctx.setTransform(cv.width/W,0,0,cv.height/H,0,0);
  ctx.fillStyle='#0b0d12';ctx.fillRect(0,0,W,H);
  ctx.imageSmoothingEnabled=true;ctx.drawImage(ed.world,ed.cam,0,W,H,0,0,W,H);
  ctx.save();ctx.translate(-ed.cam,0);
  // Raster
  ctx.strokeStyle='rgba(255,255,255,.06)';ctx.lineWidth=1;
  for(let x=Math.floor(ed.cam/100)*100;x<ed.cam+W;x+=100){ctx.beginPath();ctx.moveTo(x+.5,0);ctx.lineTo(x+.5,H);ctx.stroke();}
  ctx.strokeStyle='rgba(255,230,120,.5)';ctx.beginPath();ctx.moveTo(ed.cam,GROUND+.5);ctx.lineTo(ed.cam+W,GROUND+.5);ctx.stroke();
  ctx.imageSmoothingEnabled=false;
  ST.plats.forEach((a,i)=>{
    const pi=propImg(a[0]);if(pi){ctx.imageSmoothingEnabled=true;drawPropImg(pi,a[0],a[1],GROUND-a[3],a[2],a[3]);ctx.imageSmoothingEnabled=false;}else{const c=edProp(a[0],a[2],a[3]);ctx.drawImage(c,a[1]-S3,GROUND-a[3]-S3,c.width*S3,c.height*S3);}
    if(ed.sel&&ed.sel.k==='plat'&&ed.sel.i===i){ctx.strokeStyle='#ffd84a';ctx.lineWidth=2;ctx.strokeRect(a[1],GROUND-a[3],a[2],a[3]);}
  });
  ST.items.forEach((a,i)=>{
    const y=GROUND-a[1];
    ctx.fillStyle='#1b1020';ctx.fillRect(a[0]-9,y-30,18,30);ctx.fillRect(a[0]-5,y-40,10,12);
    ctx.fillStyle='#2f8f3a';ctx.fillRect(a[0]-8,y-28,16,27);ctx.fillRect(a[0]-4,y-38,8,12);
    if(ed.sel&&ed.sel.k==='item'&&ed.sel.i===i){ctx.strokeStyle='#ffd84a';ctx.lineWidth=2;ctx.strokeRect(a[0]-12,y-42,24,46);}
  });
  ST.waves.forEach((w,i)=>{
    const on=ed.sel&&ed.sel.k==='wave'&&ed.sel.i===i;
    ctx.strokeStyle=on?'#ffd84a':'#ff6a6a';ctx.lineWidth=on?3:2;ctx.setLineDash([8,6]);
    ctx.beginPath();ctx.moveTo(w.cx,0);ctx.lineTo(w.cx,GROUND);ctx.moveTo(w.cx+W,0);ctx.lineTo(w.cx+W,GROUND);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle=on?'rgba(255,216,74,.07)':'rgba(255,106,106,.05)';ctx.fillRect(w.cx,0,W,GROUND);
    ctx.fillStyle=on?'#ffd84a':'#ff6a6a';ctx.beginPath();ctx.moveTo(w.cx,6);ctx.lineTo(w.cx+22,6);ctx.lineTo(w.cx+22,26);ctx.lineTo(w.cx,26);ctx.closePath();ctx.fill();
    txt('W'+(i+1),w.cx+11,16,12,'#000','center',false);
    const inf=edWaveInfo(w,ST.diff);
    txt(w.list.length+' Gegner · HP '+inf.hp,w.cx+30,16,11,'#fff','left');
    // Gegner-Chips
    const cnt={};w.list.forEach(t=>cnt[t]=(cnt[t]||0)+1);let y=40;
    for(const t in cnt){txt(cnt[t]+'× '+t,w.cx+8,y,11,'hsl('+edHue(t)+',90%,75%)','left');y+=14;}
  });
  ctx.restore();
  txt('EDITOR · Stage '+ST.id+' '+ST.name+' · x '+Math.round(ed.cam)+'/'+(WORLD-W),12,H-14,12,'#fff','left');
  if(ed.msgT>0)txt(ed.msg,W/2,60,16,'#ffd84a');
}

/* ---------- Panel (DOM) ---------- */
function edEl(tag,props,kids){const e=document.createElement(tag);Object.assign(e,props||{});(kids||[]).forEach(k=>e.append(k));return e;}
function edPanel(show){
  if(!ed.panel){
    ed.panel=document.getElementById('edp');
    const st=document.createElement('style');st.textContent=
      '#edp{font:12px "Courier New",monospace;color:#e6ebf3;background:#12151e;border-left:1px solid #2a3040;padding:10px;box-sizing:border-box}'+
      '#edp h3{margin:10px 0 4px;font-size:12px;color:#ffd84a;letter-spacing:1px}#edp button,#edp select,#edp input,#edp textarea{font:inherit;background:#1d2230;color:#e6ebf3;border:1px solid #39415a;border-radius:3px;padding:3px 6px;margin:1px}'+
      '#edp button{cursor:pointer}#edp button.on{background:#ffd84a;color:#000}#edp input[type=number]{width:62px}#edp .row{margin:3px 0}#edp .chip{display:inline-block;margin:1px;padding:1px 5px;border-radius:9px;background:#252b3d;cursor:pointer}'+
      '#edp .w{padding:3px 5px;margin:2px 0;background:#181c28;border-left:3px solid #ff6a6a}#edp small{color:#8892a6}#edp textarea{width:100%;height:60px;box-sizing:border-box}';
    document.head.append(st);
  }
  document.body.classList.toggle('ed',!!show);ed.panel.style.display=show?'block':'none';
}
function edSyncInputs(){
  const f=ed.panel&&ed.panel.querySelectorAll('[data-sync]');if(!f)return;
  f.forEach(i=>{if(document.activeElement!==i)i.value=i._get();});
  const sl=ed.panel.querySelector('#edcam');if(sl)sl.value=ed.cam;
}
function edNum(label,get,set,min,max){
  const i=edEl('input',{type:'number',min,max,step:1});i.dataset.sync=1;i._get=get;i.value=get();
  i.onchange=()=>{set(clamp(parseInt(i.value)||0,min,max));edPersist();edRefresh();};
  return edEl('span',{},[label+' ',i,' ']);
}
function edRefresh(){
  if(!ed.panel)return;const P=ed.panel;P.innerHTML='';
  const btn=(t,f,on)=>{const b=edEl('button',{textContent:t});if(on)b.className='on';b.onclick=f;return b;};
  P.append(edEl('b',{textContent:'LEVEL-EDITOR'}),edEl('small',{textContent:'  F2 · Stufe 1'}));
  // Stage
  P.append(edEl('h3',{textContent:'STAGE'}));
  const r1=edEl('div',{className:'row'});STAGES.forEach((s,i)=>r1.append(btn(s.id,()=>{edLoadStage(i);edRefresh();},i===ed.sIdx)));P.append(r1);
  const nm=edEl('input',{value:ST.name,style:'width:150px'});nm.onchange=()=>{ST.name=nm.value;edPersist();};
  const df=edEl('select',{},[0,1,2,3,4].map(v=>edEl('option',{value:v,textContent:'Diff '+v,selected:ST.diff===v})));df.onchange=()=>{ST.diff=+df.value;edPersist();edRefresh();};
  P.append(edEl('div',{className:'row'},[nm,df]));
  // Werkzeuge
  P.append(edEl('h3',{textContent:'WERKZEUG'}));
  const r2=edEl('div',{className:'row'});
  [['sel','Auswahl'],['plat','+Plattform'],['item','+Flasche'],['wave','+Welle']].forEach(([k,t])=>r2.append(btn(t,()=>{ed.tool=k;edRefresh();},ed.tool===k)));P.append(r2);
  const pt=edEl('select',{},PLAT_TYPES.map(t=>edEl('option',{value:t,textContent:t,selected:t===ed.platType})));pt.onchange=()=>{ed.platType=pt.value;ed.tool='plat';edRefresh();};
  const sn=edEl('select',{},[1,10,20,50].map(v=>edEl('option',{value:v,textContent:'Raster '+v,selected:v===ed.snap})));sn.onchange=()=>{ed.snap=+sn.value;};
  P.append(edEl('div',{className:'row'},[pt,sn]));
  P.append(edEl('small',{textContent:'Klick ins Bild = platzieren · ziehen = verschieben · Mausrad/A/D = scrollen · Entf = löschen'}));
  const sc=edEl('input',{type:'range',id:'edcam',min:0,max:WORLD-W,value:ed.cam,style:"width:calc(100% - 6px)"});sc.oninput=()=>{ed.cam=+sc.value;};P.append(edEl('div',{className:'row'},[sc]));
  // Auswahl
  P.append(edEl('h3',{textContent:'AUSWAHL'}));
  const s=ed.sel;
  if(!s)P.append(edEl('small',{textContent:'nichts gewählt'}));
  else{
    if(s.k==='plat'){const a=ST.plats[s.i];
      const t=edEl('select',{},PLAT_TYPES.map(x=>edEl('option',{value:x,textContent:x,selected:x===a[0]})));t.onchange=()=>{a[0]=t.value;edPersist();edRefresh();};
      P.append(edEl('div',{className:'row'},['Plattform ',t]),edEl('div',{className:'row'},[edNum('x',()=>a[1],v=>a[1]=v,0,WORLD),edNum('Breite',()=>a[2],v=>a[2]=v,30,500)]),edEl('div',{className:'row'},[edNum('Höhe',()=>a[3],v=>a[3]=v,20,340)]));}
    else if(s.k==='item'){const a=ST.items[s.i];P.append(edEl('div',{className:'row'},['Flasche (Bier)']),edEl('div',{className:'row'},[edNum('x',()=>a[0],v=>a[0]=v,10,WORLD),edNum('Höhe',()=>a[1],v=>a[1]=v,0,340)]));}
    else{const w=ST.waves[s.i];
      P.append(edEl('div',{className:'row'},['Welle '+(s.i+1)+' ',edNum('x',()=>w.cx,v=>{w.cx=Math.min(v,WORLD-W);ST.waves.sort((a,b)=>a.cx-b.cx);ed.sel={k:'wave',i:ST.waves.indexOf(w)};},0,WORLD-W)]));
      const chips=edEl('div',{className:'row'});
      w.list.forEach((t,i)=>{const c=edEl('span',{className:'chip',textContent:t+' ✕',style:'border:1px solid hsl('+edHue(t)+',70%,60%)'});c.onclick=()=>{if(w.list.length>1){w.list.splice(i,1);edPersist();edRefresh();}};chips.append(c);});
      P.append(chips);
      const add=edEl('select',{},[edEl('option',{value:'',textContent:'+ Gegner …'})].concat(EN_TYPES.map(t=>edEl('option',{value:t,textContent:t+' (HP '+ET[t].hp+')'}))));
      add.onchange=()=>{if(add.value){w.list.push(add.value);edPersist();edRefresh();}};P.append(edEl('div',{className:'row'},[add]));
    }
    P.append(edEl('div',{className:'row'},[btn('Duplizieren',edDup),btn('Löschen',edDelete)]));
  }
  // Wellen-Auswertung
  P.append(edEl('h3',{textContent:'WELLEN-AUSWERTUNG (Diff '+ST.diff+')'}));
  ST.waves.forEach((w,i)=>{const n=edWaveInfo(w,ST.diff);const d=edEl('div',{className:'w',textContent:'W'+(i+1)+' @'+w.cx+' · '+n.n+' Gegner · HP '+n.hp+' · Druck '+n.press+'/s'});d.style.cursor='pointer';d.onclick=()=>{ed.sel={k:'wave',i};ed.cam=clamp(w.cx-40,0,WORLD-W);edRefresh();};P.append(d);});
  P.append(edEl('small',{textContent:'Druck = Summe Schaden/Angriffspause. Solo: bei ≥4 Gegnern fehlt der letzte.'}));
  // Aktionen
  P.append(edEl('h3',{textContent:'TESTEN & DATEN'}));
  P.append(edEl('div',{className:'row'},[btn('▶ Testen (P)',edTest),btn('Alle Level zurücksetzen',()=>{if(confirm('Alle Level auf Standard zurücksetzen?')){STAGES.forEach((_,i)=>{STAGES[i]=JSON.parse(JSON.stringify(STAGES_DEFAULT[i]));});try{localStorage.removeItem(LS_KEY);}catch(e){}customLevels=false;edLoadStage(ed.sIdx);edRefresh();}})]));
  P.append(edEl('small',{textContent:'▶ startet die Stage; ist eine Welle gewählt, ab dieser Welle. Esc im Test = zurück.'}));
  const ta=edEl('textarea',{placeholder:'JSON hier einfügen für Import …'});
  P.append(edEl('div',{className:'row'},[btn('Export (Kopieren + Datei)',()=>{const j=JSON.stringify(STAGES,null,1);try{navigator.clipboard&&navigator.clipboard.writeText(j);}catch(e){}ta.value=j;
      const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([j],{type:'application/json'}));a.download='thai-vacation-levels.json';a.click();edToast('Export: JSON kopiert/heruntergeladen');}),
    btn('Import',()=>{try{const a=JSON.parse(ta.value);if(!Array.isArray(a)||a.length!==STAGES.length||!a.every(o=>o&&o.waves&&o.plats&&o.items))throw 0;a.forEach((o,i)=>{STAGES[i]=o;});edPersist();edLoadStage(ed.sIdx);edRefresh();edToast('Import ok');}catch(e){edToast('Import fehlgeschlagen: JSON passt nicht');}})]),ta);
  P.append(edEl('small',{textContent:'Änderungen werden automatisch im Browser gespeichert und gelten dann auch im normalen Spiel.'}));
}
