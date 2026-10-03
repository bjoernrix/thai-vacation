"""Schneidet Gemini-Sheets (dunkelvioletter oder heller Hintergrund) in Einzelframes.
Verfahren: Hintergrundfarbe aus Rand, Maske, Komponenten; kleine Komponenten (Sterne, Schweif) dem
nächsten großen Körper zuordnen; Komponenten in Zeilen gruppieren und von links nach rechts ordnen."""
import sys,os,json
import numpy as np
from PIL import Image
from scipy import ndimage
R='assets/raw_l1/'; OUT='assets/frames_l1/'
os.makedirs(OUT,exist_ok=True)
EXPECT={'ratWalk':6,'ratIdle':4,'ratAttack':5,'ratHurt':3,'ratKO':6,
 'mouseWalk':6,'mouseIdle':4,'mouseKO':4,
 'martenWalk':6,'martenIdle':4,'martenAttack':5,'martenHurt':3,'martenKO':6,'martenJump':4,
 'roosterWalk':5,'roosterIdle':4,'roosterAttack':5,'roosterGuard':2,'roosterHurt':3,'roosterKO':6,
 'farmerWalk':6,'farmerIdle':4,'farmerAttack':5,'farmerHurt':3,'farmerKO':6,
 'ratqueenWalk':4,'ratqueenIdle':0,'ratqueenAttack':5,'ratqueenSplit':6,'ratqueenHurt':3,'ratqueenKO':6,
 'dachshundWalk':6,'dachshundAttack':5,'dachshundIdle':4,'dachshundHurt':3,
 'wardenWalk':5,'wardenIdle':5,'wardenWhistle':5,'wardenAttack':5,'wardenHurt':3,'wardenKO':5,
 'kidWalk':6,'kidIdle':5,'kidAttack':5,
 'coupleWalk':3,'coupleIdle':4,'coupleAttack':5,'coupleHurt':5,'coupleKO':5,
 'dealerWalk':6,'dealerIdle':4,'dealerAttack':5,'dealerHurt':3,'dealerKO':6,
 'fmomaWalk':6,'fmomaIdle':4,'fmomaGuard':2,'fmomaAttack':5,'fmomaHurt':3,'fmomaKO':6,
 'hunterWalk':6,'hunterIdle':5,'hunterAttack':5,'hunterHurt':5,'hunterKO':6}
MIRROR={'roosterWalk'}  # blickt nach links
GRID={'ratqueenSplit','wardenAttack'}
def cut(name):
    im=Image.open(R+name+'.jpg').convert('RGB');a=np.asarray(im).astype(int)
    h,w,_=a.shape
    border=np.concatenate([a[:6].reshape(-1,3),a[-6:].reshape(-1,3),a[:,:6].reshape(-1,3),a[:,-6:].reshape(-1,3)])
    bg=np.median(border,axis=0)
    diff=np.abs(a-bg).sum(axis=2)
    mask=diff>70
    mask=ndimage.binary_closing(mask,iterations=3)
    mask=ndimage.binary_fill_holes(mask)
    lab,n=ndimage.label(mask)
    objs=ndimage.find_objects(lab)
    comps=[]
    for i,sl in enumerate(objs):
        if sl is None: continue
        area=int((lab[sl]==i+1).sum())
        if area<150: continue
        comps.append(dict(id=i+1,y0=sl[0].start,y1=sl[0].stop,x0=sl[1].start,x1=sl[1].stop,area=area))
    big=[c for c in comps if c['area']>=0.15*max(c['area'] for c in comps)]
    # Komponenten, die sich horizontal stark überlappen (Schweif vor Körper), zu einem Frame vereinen
    merged=False
    while merged:
        merged=False
        for i in range(len(big)):
            for j in range(i+1,len(big)):
                a1,b1=big[i],big[j]
                ov=min(a1['x1'],b1['x1'])-max(a1['x0'],b1['x0'])
                yov=min(a1['y1'],b1['y1'])-max(a1['y0'],b1['y0'])
                if ov>0.3*min(a1['x1']-a1['x0'],b1['x1']-b1['x0']) and yov>0:
                    lab[lab==b1['id']]=a1['id']
                    a1.update(x0=min(a1['x0'],b1['x0']),x1=max(a1['x1'],b1['x1']),y0=min(a1['y0'],b1['y0']),y1=max(a1['y1'],b1['y1']),area=a1['area']+b1['area'])
                    big.pop(j);merged=True;break
            if merged:break
    exp0=EXPECT.get(name,0)
    def rowof(c): return 0 if c['y0']<h*0.45 else (1 if c['y0']>h*0.5 else 0)
    while exp0 and len(big)>exp0:
        best=None
        for i in range(len(big)):
            for j in range(i+1,len(big)):
                a1,b1=big[i],big[j]
                if rowof(a1)!=rowof(b1) and (a1['y1']<b1['y0'] or b1['y1']<a1['y0']): continue
                gap=max(a1['x0'],b1['x0'])-min(a1['x1'],b1['x1'])
                if best is None or gap<best[0]: best=(gap,i,j)
        if best is None: break
        _,i,j=best;a1,b1=big[i],big[j]
        lab[lab==b1['id']]=a1['id']
        a1.update(x0=min(a1['x0'],b1['x0']),x1=max(a1['x1'],b1['x1']),y0=min(a1['y0'],b1['y0']),y1=max(a1['y1'],b1['y1']),area=a1['area']+b1['area'])
        big.pop(j)
    if name in GRID:  # feste Spalten nach erwarteter Anzahl
        n_=EXPECT[name];cols=np.where(mask.any(axis=0))[0];x0,x1=cols.min(),cols.max()+1;cw=(x1-x0)/n_
        big=[]
        for k in range(n_):
            sub=mask.copy();sub[:,:int(x0+k*cw)]=False;sub[:,int(x0+(k+1)*cw):]=False
            ids=np.unique(lab[sub]);ids=ids[(ids>0)&(ids<100000)]
            if len(ids)==0: continue
            nid=100000+k;lab[np.isin(lab,ids)]=nid
            ys,xs=np.where(lab==nid);big.append(dict(id=nid,y0=ys.min(),y1=ys.max()+1,x0=xs.min(),x1=xs.max()+1,area=len(ys)))
        comps=big
    # Zeilen: zwei Reihen erkennen, wenn Körper deutlich getrennte y-Bänder haben
    rows=[]
    for c in sorted(big,key=lambda c:c['y0']):
        for r in rows:
            if c['y0']<r['y1']-20 and c['y1']>r['y0']+20: r['items'].append(c);r['y0']=min(r['y0'],c['y0']);r['y1']=max(r['y1'],c['y1']);break
        else: rows.append(dict(y0=c['y0'],y1=c['y1'],items=[c]))
    rows.sort(key=lambda r:r['y0'])
    order=[c for r in rows for c in sorted(r['items'],key=lambda c:c['x0'])]
    # kleine Teile zuordnen
    small=[c for c in comps if c not in big]
    groups={c['id']:[c] for c in order}
    for s in small:
        cx=(s['x0']+s['x1'])/2;cy=(s['y0']+s['y1'])/2
        best=min(order,key=lambda b:max(0,b['x0']-cx,cx-b['x1'])+0.5*max(0,b['y0']-cy,cy-b['y1']))
        groups[best['id']].append(s)
    frames=[]
    for b in order:
        g=groups[b['id']];ids=[c['id'] for c in g]
        m=np.isin(lab,ids)
        ys,xs=np.where(m);y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
        rgba=np.zeros((y1-y0,x1-x0,4),np.uint8);rgba[...,:3]=a[y0:y1,x0:x1];rgba[...,3]=m[y0:y1,x0:x1]*255
        fr=Image.fromarray(rgba)
        if name in MIRROR: fr=fr.transpose(Image.FLIP_LEFT_RIGHT)
        frames.append(fr)
    exp=EXPECT.get(name,0)
    nrows=len(rows) if name not in GRID else 1
    META[name]=dict(w=w,h=h,rows=nrows,n=len(frames))
    for k,fr in enumerate(frames): fr.save(f'{OUT}{name}_{k}.png')
    print(f'{name:16s} {w}x{h} bg={bg.astype(int).tolist()} frames={len(frames)} expected={exp} {"OK" if len(frames)==exp else "CHECK"}')
    return frames
META={}
names=[n for n in EXPECT if os.path.exists(R+n+'.jpg')] if len(sys.argv)<2 else sys.argv[1:]
for n in names: cut(n)
old={}
try: old=json.load(open(OUT+'meta.json'))
except Exception: pass
old.update(META);json.dump(old,open(OUT+'meta.json','w'))
