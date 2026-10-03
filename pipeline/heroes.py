import sys;sys.path.insert(0,'.')
from hs import *
import pickle,json,os
R=pickle.load(open('R.pkl','rb'))
SP={'rixpunch':[6],'rixshinkick':[7],'rixkneestrike':[6],'rixelbow':[6],'rixidle':[14,12,12],'hgmpunch':[6],'hgmkick':[8],'hgmknee':[6],'hgmelbow':[6],'hgmidle':[9,9],'hgmbeer':[6],'hgmko':[8,7],'hgmthrow':[6]}
def splitN2(im,y0,y1,N):
    a=np.array(im);sub=a[y0:y1];mk=sub[:,:,3]>60
    col=mk.sum(axis=0)>0
    runs=[];s=None
    for i,v in enumerate(col):
        if v and s is None:s=i
        if not v and s is not None:runs.append([s,i]);s=None
    if s is not None:runs.append([s,len(col)])
    mass=[mk[:,r[0]:r[1]].sum() for r in runs]
    if not runs:return splitN(im,y0,y1,N)
    big=[i for i,mv in enumerate(mass) if mv>=0.25*max(mass)]
    if len(big)!=N:return splitN(im,y0,y1,N)
    groups=[[runs[i][0],runs[i][1]] for i in big]
    for i,r in enumerate(runs):
        if i in big:continue
        dl=[(r[0]-groups[g][1]) for g in range(N)]; dr=[(groups[g][0]-r[1]) for g in range(N)]
        left=[g for g in range(N) if dl[g]>=-2]; right=[g for g in range(N) if dr[g]>=-2]
        gl=min(left,key=lambda g:dl[g]) if left else None; gr=min(right,key=lambda g:dr[g]) if right else None
        if gl is not None and gr is not None: best=gl if max(dl[gl],1)<=2.5*max(dr[gr],1) else gr
        else: best=gl if gl is not None else gr
        if best is None: best=min(range(N),key=lambda g:min(abs(r[0]-groups[g][1]),abs(groups[g][0]-r[1])))
        groups[best]=[min(groups[best][0],r[0]),max(groups[best][1],r[1])]
    fr=[]
    for x0,x1 in groups:
        s2=sub[:,x0:x1].copy();m2=s2[:,:,3]>60
        ys=np.where(m2.any(axis=1))[0];fr.append(Image.fromarray(s2[ys.min():ys.max()+1].copy()))
    return fr
H={}
for n,Ns in SP.items():
    im=key_dark(m2[n+'.jpeg']);b=bands(im,40,gap=4)
    H[n]=[splitN2(im,y0,y1,N) for (y0,y1),N in zip(b,Ns)]
im=key_white(m2['hgmloco.jpeg'])
H['hgmloco']=[splitN2(im,y0,y1,N) for (y0,y1),N in zip([(35,215),(255,415),(460,652)],[8,10,5])]
pickle.dump(H,open('H2.pkl','wb'))
def rf(k,row,idx=None):
    fr=[f['img'] for f in R[k][0][row]];return fr if idx is None else [fr[i] for i in idx]
def hf(k,row,idx=None):
    fr=H[k][row];return fr if idx is None else [fr[i] for i in idx]
HD=124.; RD=128.
SETS={
 'rix':dict(nf=1,sets={
   'walk':(rf('rixwalk',0),RD/332,None),'run':(rf('rixrun',0),RD/332,None),
   'hurt':(rf('rixhurt',0),RD/332,None),
   'idle':(hf('rixidle',0,range(0,7)),'GI',None),'jump':(hf('rixidle',0,[7,8]),'GI',None),'guard':(hf('rixidle',0,[10,11,12,13]),'GI',None),
   'punch':(hf('rixpunch',0),'G',2),'shin':(hf('rixshinkick',0),'G',3),'knee':(hf('rixkneestrike',0),'G',4),'elbow':(hf('rixelbow',0),'G',3),
   'ko':(hf('rixidle',2,range(0,8)),'GI',None),'getup':(hf('rixidle',2,range(8,12)),'GI',None)},
   G=(118,101)),
 'hgm':dict(nf=1,sets={
   'walk':(hf('hgmloco',0),HD/164,None),'run':(hf('hgmloco',1),HD/164,None),
   'hurt':(hf('hgmloco',2),'G2',None),
   'idle':(hf('hgmidle',0,[0,1,3,4]),'GI',None),'jump':(hf('hgmidle',0,[6,7]),'GI',None),'fall':(hf('hgmidle',1,[5]),'GI',None),'guard':(hf('hgmidle',1,[6,7,8]),'GI',None),
   'punch':(hf('hgmpunch',0),'G',2),'shin':(hf('hgmkick',0),'G',3),'knee':(hf('hgmknee',0),'G',3),'elbow':(hf('hgmelbow',0),'G',2),
   'drink':(hf('hgmbeer',0),'G',None),
   'ko':(hf('hgmko',0)+hf('hgmko',1,[0,1,2]),'GI',None),'getup':(hf('hgmko',1,[3,4,5,6]),'GI',None)},
   G=(114,144))}
FACT={}
def build(name):
    d=SETS[name];Gd,Gh=d['G'];out={}
    scl={}
    for an,(frs,s,pk) in d['sets'].items():
        if s=='G':s=Gd/frs[0].size[1]
        elif s=='G2':s=Gd/189.
        elif s=='GI':s=Gd/Gh
        scl[an]=s
    def area(frs,s): return float(np.median([ (np.array(f)[:,:,3]>60).sum()*s*s for f in frs]))
    Aref=area(d['sets']['idle'][0],scl['idle'])
    for an,(frs,s,pk) in d['sets'].items():
        s=scl[an]
        if an not in ('idle',):
            f=(Aref/area(frs,s))**.5; f=max(.75,min(1.3,f)); FACT[(name,an)]=round(f,3); s=s*f
        K=1.0;L=[]
        for im in frs:
            a=np.array(im);m=a[:,:,3]>60;h=a.shape[0]
            band=m[int(h*.40):int(h*.70)];xs=np.where(band.any(axis=0))[0]
            ax=(np.median(np.where(band)[1]) if band.any() else a.shape[1]/2)
            w=max(1,round(im.size[0]*s*K));hh=max(1,round(im.size[1]*s*K))
            L.append((im.resize((w,hh),Image.LANCZOS),w,hh,ax*s*K))
        out[an]=(L,pk)
    return out
atl={};pieces=[]
x=y=rowh=0;W=2048
for name in SETS:
    atl[name]={'k':1.0,'nf':SETS[name]['nf'],'img':'heroes','a':{},'p':{}}
    for an,(L,pk) in build(name).items():
        ent=[]
        for im,w,h,ax in L:
            if x+w>W:x=0;y+=rowh+2;rowh=0
            pieces.append((im,x,y));ent.append([x,y,w,h,round(ax,1)]);x+=w+2;rowh=max(rowh,h)
        atl[name]['a'][an]=ent
        if pk is not None:atl[name]['p'][an]=pk
A=Image.new('RGBA',(W,y+rowh+2))
for im,px,py in pieces:A.paste(im,(px,py))
A.save('heroes.png',optimize=True);json.dump(atl,open('heroes.json','w'),separators=(',',':'))
print({f'{k[0]}.{k[1]}':v for k,v in FACT.items()});print(A.size,os.path.getsize('heroes.png')//1024,'KB',{k:{a:len(v) for a,v in d['a'].items()} for k,d in atl.items()})
