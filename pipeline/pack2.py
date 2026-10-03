import pickle,json,numpy as np,os
from PIL import Image,ImageOps
R=pickle.load(open('N.pkl','rb'))
old=json.load(open('anim_old.json')); OA=Image.open('anim_old.png').convert('RGBA')
K=1.5
def row(k,r=0,idx=None):
    L=R[k][r]; return L if idx is None else [L[i] for i in idx]
def flip(L): return [ImageOps.mirror(f) for f in L]
# targets: set -> (display height, nf)
TH={'oma':108,'masseuse':104,'pirat':118,'tourist':124,'monkey':84,'bouncer':150,'rowdy':118,'dog':62,'drunk':112}
NF={'oma':1,'masseuse':1,'pirat':1,'tourist':-1,'monkey':-1,'bouncer':1,'rowdy':1,'dog':1,'drunk':1}
FL={'tourist':True,'monkey':True}   # neue Sheets blicken nach rechts -> spiegeln
# new anims: set -> anim -> (list of frames, ref mode)
walkB=[f for i,f in enumerate(row('b_walk',0)) if i!=1]+[f for i,f in enumerate(row('b_walk',1)) if i!=3]
koB=row('b_ko',0)[2:]+row('b_ko',1)
NEW={
 'oma':{'idle':(row('o_a'),'med'),'wind':(row('o_b',0,[0]),'med'),'atk':(row('o_b',0,[2,3]),'med')},
 'masseuse':{'idle':(row('ma_idle'),'med'),'wind':(row('ma_atk',0,[0]),'med'),'atk':(row('ma_atk',0,[1,2]),'med')},
 'pirat':{'idle':(row('p_idle'),'med'),'wind':(row('p_wind'),'med'),'atk':(row('p_atk',0,[1,2,3]),'med')},
 'tourist':{'idle':(row('t_idle'),'med'),'wind':(row('t_atk',0,[0,1]),'med'),'atk':(row('t_atk',0,[2]),'med')},
 'monkey':{'idle':(row('mk_idle'),'med'),'wind':(row('mk_wind'),'med'),'atk':(row('mk_throw'),'med')},
 'bouncer':{'walk':(walkB,'med'),'idle':(row('b_idle',0),'med'),'wind':(row('b_wind'),'med'),'atk':(row('b_atk'),'med'),'hurt':(row('b_hurt'),'med'),'ko':(koB,'f0'),'guard':(row('b_def'),'med')},
 'rowdy':{'walk':(row('m_run',0),'med'),'idle':(row('m_idle'),'med'),'wind':(row('m_wind'),'med'),'atk':(row('m_atk'),'med'),'hurt':(row('m_hurt'),'med'),'ko':(row('m_ko'),'f0')},
 'dog':{'walk':(row('d_run',0),'med'),'idle':(row('d_wind'),'med'),'wind':(row('d_wind'),'med'),'atk':(row('d_atk'),'med'),'hurt':(row('d_hurt2'),'med'),'ko':(row('d_ko'),'f0')},
 'drunk':{'walk':(row('u_walk',0),'med'),'idle':(row('u_idle'),'med'),'wind':(row('u_wind'),'med'),'atk':(row('u_atk'),'med'),'hurt':(row('u_hurt'),'med'),'ko':(row('u_ko'),'f0')},
}
def oldframes(s,an):
    return [OA.crop((f[0],f[1],f[0]+f[2],f[1]+f[3])) for f in old[s]['a'][an]]
def axof(im):
    a=np.array(im)[:,:,3]>40;h=a.shape[0];y0,y1=int(h*.4),int(h*.7)
    ys,xs=np.where(a[y0:y1]);return float(np.median(xs)) if len(xs) else im.width/2
atlas={};FACT={}
def area(frs,sc): return float(np.median([(np.array(f)[:,:,3]>60).sum()*sc*sc for f in frs]))
sets=['oma','masseuse','pirat','tourist','monkey','bouncer','rowdy','dog','drunk']
for s in sets:
    atlas[s]={'k':K,'nf':NF[s],'a':{}}
    tgt=TH[s]*K
    items=[]   # (anim, frames, initial scale)
    if s in old:
        for an in old[s]['a']: items.append((an,oldframes(s,an),1.0))
    for an,(L,mode) in NEW[s].items():
        L=flip(L) if FL.get(s) else L
        hs=[f.height for f in L]; items.append((an,L,tgt/(np.median(hs) if mode=='med' else hs[0])))
    areas={an:area(L,sc) for an,L,sc in items}
    Aref=float(np.median(list(areas.values())))      # robuste Referenz: Median über alle Animationen
    for an,L,sc in items:
        f=(Aref/areas[an])**.5; f=max(.85,min(1.18,f)); FACT[(s,an)]=round(f,3); sc2=sc*f
        out=[]
        for fr in L:
            w=max(1,round(fr.width*sc2));h=max(1,round(fr.height*sc2)); g=fr.resize((w,h),Image.LANCZOS); out.append((g,axof(g)))
        atlas[s]['a'][an]=out
# rowdy/dog use walk as run
# pack
x=y=rowh=0;W=2048;pcs=[];meta={}
for s,d in atlas.items():
    meta[s]={'k':K,'nf':d['nf'],'a':{}}
    for an,L in d['a'].items():
        meta[s]['a'][an]=[]
        for im,ax in L:
            w,h=im.size
            if x+w>W: x=0;y+=rowh+2;rowh=0
            pcs.append((im,x,y)); meta[s]['a'][an].append([x,y,w,h,round(ax,1)]); x+=w+2; rowh=max(rowh,h)
Hh=y+rowh+2
A=Image.new('RGBA',(W,Hh))
for im,px,py in pcs: A.paste(im,(px,py))
A.save('../assets/anim.png',optimize=True); json.dump(meta,open('../assets/anim.json','w'),separators=(',',':'))
print({f'{k[0]}.{k[1]}':v for k,v in FACT.items()});print(A.size,os.path.getsize('../assets/anim.png')//1024,'KB',{s:{n:len(v) for n,v in d['a'].items()} for s,d in meta.items()})
