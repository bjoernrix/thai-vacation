import asyncio,json,sys
from playwright.async_api import async_playwright
BOT="""
(cfg)=>{
 const out=[];
 const K=[{l:'KeyA',r:'KeyD',j:'KeyW',g:'KeyS',a:['KeyF','KeyG','KeyH','KeyT']},{l:'ArrowLeft',r:'ArrowRight',j:'ArrowUp',g:'ArrowDown',a:['Comma','Period','Slash','Semicolon']}];
 numPlayers=cfg.n; soloChar=cfg.ch; carry=[null,null];
 if(cfg.boss)startBoss(false);else startStage(cfg.stage);
 let t=0,maxT=cfg.boss?300:200,seq=[0,0,1,0,3,2],si=[0,0];
 const dmgTaken=[0,0],hp0=players.map(p=>p.hp);let prevHp=players.map(p=>p.hp);
 while(t<maxT*60&&scene!=='clear'&&scene!=='over'){
   for(const k in keys)keys[k]=false;
   players.forEach((p,i)=>{
     if(p.state==='dead')return;const m=K[numPlayers===1?0:i];
     const alive=enemies.filter(e=>e.state!=='dead'&&!e.dying);
     let tgt=null,bd=1e9;for(const e of alive){const d=Math.abs(e.x-p.x)+Math.abs(e.y-p.y)*.5;if(d<bd){bd=d;tgt=e;}}
     let want=0;
     const bottle=items.find(it=>!it.taken&&Math.abs(it.x-p.x)<260&&Math.abs(it.y-p.y)<80);
     if(p.hp<p.maxhp*.5&&bottle&&!alive.some(e=>Math.abs(e.x-p.x)<150)&&p.drunk<6)want=Math.sign(bottle.x-p.x);
     else if(tgt){const dx=tgt.x-p.x;const dist=Math.abs(dx);want=dist>78?Math.sign(dx):0;
       if(dist<=92&&Math.abs(tgt.y-p.y)<50){ // angreifen
         if(p.state==='idle'||p.state==='walk'||p.state==='run'){
           if(t%7===i%7){const a=seq[si[i]++%seq.length];press[m.a[a]]=true;keys[m.a[a]]=true;}
         }
         p.face=Math.sign(dx)||p.face;
       }
       if(tgt.isBoss&&tgt.state==='wind'&&dist<170&&Math.random()<.015)keys[m.g]=true; // gelegentlich blocken
     } else if(!waveActive) want=1;
     if(want>0)keys[m.r]=true;else if(want<0)keys[m.l]=true;
     if(cfg.jump&&tgt&&Math.abs(tgt.x-p.x)>200&&p.onGround&&t%50===0)keys[m.j]=true;
   });
   step(1/60);t++;
   players.forEach((p,i)=>{if(p.hp<prevHp[i])dmgTaken[i]+=prevHp[i]-p.hp;prevHp[i]=p.hp;});
 }
 return {scene,t:Math.round(t/60),dmg:dmgTaken.map(Math.round),hpEnd:players.map(p=>Math.round(p.hp)),maxhp:players.map(p=>p.maxhp),kills:enemies.filter(e=>e.state==='dead').length,waveIdx,boss:bossRef?Math.round(bossRef.hp)+'/'+bossRef.maxhp:null};
}
"""
async def main():
    runs=int(sys.argv[1]) if len(sys.argv)>1 else 4
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':960,'height':540})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+__import__('os').path.abspath('dist/thai-vacation.html')+'')
        await pg.wait_for_function('__game.loaded',timeout=30000)
        res=[]
        for mode,(n,ch) in {'RixSolo':(1,0),'HGMSolo':(1,1),'Duo':(2,0)}.items():
            for stage in range(4):
                for r in range(runs):
                    o=await pg.evaluate(BOT,{'n':n,'ch':ch,'stage':stage,'boss':False})
                    o.update(mode=mode,stage=stage+1);res.append(o)
            for r in range(runs):
                o=await pg.evaluate(BOT,{'n':n,'ch':ch,'boss':True}); o.update(mode=mode,stage='Boss');res.append(o)
        json.dump(res,open('qa_res.json','w'))
        print(errs); await b.close()
asyncio.run(main())
