import sys;sys.path.insert(0,'.')
import numpy as np
from PIL import Image
import pickle,json,os
R=pickle.load(open('R.pkl','rb'))
H=pickle.load(open('H2.pkl','rb'))
G=pickle.load(open('G.pkl','rb'))
def rf(k,row,idx=None):
    fr=[f['img'] for f in R[k][0][row]];return fr if idx is None else [fr[i] for i in idx]
def hf(k,row,idx=None):
    fr=H[k][row];return fr if idx is None else [fr[i] for i in idx]
HD=124.; RD=128.
SETS={
 'rix':dict(nf=1,sets={
   'walk':(rf('rixwalk',0),RD/332,None),'run':(rf('rixrun',0),RD/332,None),
   'hurt':(rf('rixhurt',0),RD/332,None),
   'idle':(G['rix_idle'],'AI',None),'drink':(G['rix_drink'],'A1',None),'teamthrow':(G['rix_teamthrow'],'A1',None),'thrown':(G['rix_thrown'],'A.72',None),'jump':(hf('rixidle',0,[7,8]),'GI',None),'guard':(hf('rixidle',0,[10,11,12,13]),'GI',None),
   'punch':(hf('rixpunch',0),'G',2),'shin':(hf('rixshinkick',0),'G',3),'knee':(hf('rixkneestrike',0),'G',4),'elbow':(hf('rixelbow',0),'G',3),
   'ko':(hf('rixidle',2,range(0,8)),'GI',None),'getup':(hf('rixidle',2,range(8,12)),'GI',None)},
   G=(118,101)),
 'hgm':dict(nf=1,sets={
   'walk':(hf('hgmloco',0),HD/164,None),'run':(hf('hgmloco',1),HD/164,None),
   'hurt':(G['hgm_hurt'],'A1',None),
   'idle':(hf('hgmidle',0,[0,1,3,4]),'GI',None),'jump':(G['hgm_jump'],'A1',None),'fall':(G['hgm_fall'],'A1',None),'teamthrow':(G['hgm_teamthrow'],'A1',None),'thrown':(G['hgm_thrown'],'A.72',None),'guard':(hf('hgmidle',1,[6,7,8]),'GI',None),
   'punch':(hf('hgmpunch',0),'G',2),'shin':(hf('hgmkick',0),'G',3),'knee':(hf('hgmknee',0),'G',3),'elbow':(hf('hgmelbow',0),'G',2),
   'drink':(hf('hgmbeer',0),'G',None),
   'ko':(hf('hgmko',0)+hf('hgmko',1,[0,1,2]),'GI',None),'getup':(hf('hgmko',1,[3,4,5,6]),'GI',None)},
   G=(114,144))}
FACT={}
OLDIDLE={'rix':lambda:hf('rixidle',0,range(0,7)),'hgm':lambda:hf('hgmidle',0,[0,1,3,4])}
def build(name):
    d=SETS[name];Gd,Gh=d['G'];out={}
    def area(frs,s): return float(np.median([ (np.array(f)[:,:,3]>60).sum()*s*s for f in frs]))
    Aref=area(OLDIDLE[name](),Gd/Gh)
    scl={};isA=set()
    for an,(frs,s,pk) in d['sets'].items():
        if s=='G':s=Gd/frs[0].size[1]
        elif s=='G2':s=Gd/189.
        elif s=='GI':s=Gd/Gh
        elif isinstance(s,str) and s.startswith('A'):
            r=1.0 if s in('AI','A1') else float(s[1:]); s=(Aref*r/area(frs,1.0))**.5; isA.add(an)
        scl[an]=s
    for an,(frs,s,pk) in d['sets'].items():
        s=scl[an]
        if an not in ('idle',) and an not in isA:
            f=(Aref/area(frs,s))**.5; f=max(.75,min(1.3,f)); FACT[(name,an)]=round(f,3); s=s*f
        K=1.0;L=[]
        for im in frs:
            a=np.array(im);m=a[:,:,3]>60;h=a.shape[0]
            band=m[int(h*.40):int(h*.70)]
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
