import json,glob,re,os,math
import numpy as np
from PIL import Image
F='assets/frames_l1/';meta=json.load(open(F+'meta.json'))
K=1.5
# Ziel-Höhe im Spiel (px) der Walk-Pose, und Zuordnung Sheet -> Animationsname
CHARS={'rat':40,'mouse':28,'marten':50,'rooster':72,'farmer':118,'ratqueen':104,'dachshund':48,'hunter':118,'fmoma':100,'dealer':118,'couple':118,'kid':70,'warden':135}
MAP={'Walk':'walk','Idle':'idle','Hurt':'hurt','KO':'ko','Guard':'guard','Jump':'jump','Split':'split','Whistle':'whistle'}
def frames(name):
    fs=sorted(glob.glob(f'{F}{name}_*.png'),key=lambda f:int(f.rsplit('_',1)[1][:-4]))
    return [Image.open(f).convert('RGBA') for f in fs]
def size_measure(ims):
    return float(np.median([math.sqrt((np.asarray(im)[...,3]>0).sum()) for im in ims]))
atlas={};sprites=[]  # (char, anim, idx, image, ax)
for ch,Hg in CHARS.items():
    sheets={n:frames(n) for n in meta if n.startswith(ch) and not n.startswith(ch+'queen') or (ch=='ratqueen' and n.startswith('ratqueen'))}
    if ch=='rat': sheets={n:v for n,v in sheets.items() if not n.startswith('ratqueen')}
    if not sheets: continue
    walk=sheets.get(ch+'Walk');wm=size_measure(walk)
    wh=max(im.height for im in walk)
    s_walk=K*Hg/wh
    a={}
    for n,ims in sheets.items():
        s=s_walk*wm/size_measure(ims)
        an=MAP.get(n[len(ch):])
        if n.endswith('Attack'):
            # erste 2 Frames = wind, Rest = atk
            parts=[('wind',ims[:2]),('atk',ims[2:])]
        else: parts=[(an,ims)]
        for an_,lst in parts:
            out=[]
            for im in lst:
                w,h=max(1,round(im.width*s)),max(1,round(im.height*s))
                im2=im.resize((w,h),Image.LANCZOS)
                al=np.asarray(im2)[...,3]>0
                cols=np.where(al.any(axis=0))[0]
                # Anker: Median der Pixel-x im Bereich 40-70% der Höhe
                band=al[int(h*.4):int(h*.7)];xs=np.where(band.any(axis=0))[0]
                ax=float(np.median(np.where(band)[1])) if band.any() else w/2
                out.append((im2,ax))
            a[an_]=out
    atlas[ch]=a
# Requisiten (Originalgröße, 1 Frame je Name) als Set 'props', k=1
import glob as _g
pa={}
for f in sorted(_g.glob(F+'prop_*.png')):
    n=os.path.basename(f)[5:-4];im=Image.open(f).convert('RGBA')
    s_=min(1.0,300/max(im.width,im.height));im=im.resize((max(1,round(im.width*s_)),max(1,round(im.height*s_))),Image.LANCZOS)
    pa[n]=[(im,im.width/2)]
atlas['props']=pa
# Packen in Zeilen
W=2048;x=y=0;rowh=0;sheet=[];entries={}
for ch,a in atlas.items():
    entries[ch]={'k':(1 if ch=='props' else K),'nf':1,'img':'anim2','a':{}}
    for an,lst in a.items():
        L=[]
        for im,ax in lst:
            if x+im.width>W: x=0;y+=rowh+2;rowh=0
            sheet.append((im,x,y));L.append([x,y,im.width,im.height,round(ax,1)])
            x+=im.width+2;rowh=max(rowh,im.height)
        entries[ch]['a'][an]=L
H=y+rowh+2
img=Image.new('RGBA',(W,H),(0,0,0,0))
for im,px,py in sheet: img.paste(im,(px,py),im)
img=img.quantize(255,method=Image.Quantize.FASTOCTREE,dither=0);img.save('assets/anim2.png');json.dump(entries,open('assets/anim2.json','w'))
print(img.size,{c:{a:len(l) for a,l in e['a'].items()} for c,e in entries.items()})
