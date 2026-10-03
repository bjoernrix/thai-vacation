import numpy as np
from PIL import Image
from scipy import ndimage as ndi
def key(path,thr=20):
    im=Image.open(path).convert('RGB'); a=np.array(im).astype(int); H,W=a.shape[:2]
    e=max(4,W//300)
    bgc=np.concatenate([a[:,:e],a[:,-e:]],axis=1)          # rows x 2e x 3
    row=np.median(bgc,axis=1)                                 # H x 3
    row=ndi.uniform_filter1d(row,size=15,axis=0)
    d=np.abs(a-row[:,None,:]).sum(axis=2)
    bgl=d<=thr
    lab,n=ndi.label(bgl)
    border=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    outside=np.isin(lab,list(border))
    fg=~outside
    fg=ndi.binary_fill_holes(fg)
    fg=ndi.binary_opening(fg,iterations=1)
    fg2=ndi.binary_erosion(fg,iterations=1)
    rgba=np.dstack([a.astype(np.uint8),(fg2*255).astype(np.uint8)])
    return rgba
def frames(path,rows=1,thr=20,minfrac=.04,merge_gap=0,expect=None):
    rgba=key(path,thr); H,W=rgba.shape[:2]; m=rgba[:,:,3]>0
    lab,n=ndi.label(m); objs=ndi.find_objects(lab)
    comps=[]
    for i,s in enumerate(objs):
        area=int((lab[s]==i+1).sum()); comps.append(dict(i=i+1,s=s,area=area,x0=s[1].start,x1=s[1].stop,y0=s[0].start,y1=s[0].stop))
    amax=max(c['area'] for c in comps)
    big=[c for c in comps if c['area']>=amax*minfrac]
    small=[c for c in comps if c['area']<amax*minfrac and c['area']>30]
    # rows by cy
    if rows>1:
        cys=np.array([(c['y0']+c['y1'])/2 for c in big]); thr_y=(cys.min()+cys.max())/2
        rowsets=[[c for c,y in zip(big,cys) if y<thr_y],[c for c,y in zip(big,cys) if y>=thr_y]]
    else: rowsets=[big]
    out=[]
    for ri,rs in enumerate(rowsets):
        rs.sort(key=lambda c:c['x0']); groups=[]
        for c in rs:
            if groups and c['x0']<=groups[-1]['x1']+merge_gap:
                g=groups[-1]; g['cs'].append(c); g['x1']=max(g['x1'],c['x1'])
            else: groups.append(dict(cs=[c],x1=c['x1'],xc=None))
        for g in groups:
            g['x0']=min(c['x0'] for c in g['cs']);g['x1']=max(c['x1'] for c in g['cs']);g['area']=sum(c['area'] for c in g['cs']);g['cut']=None
        ex=expect[ri] if expect else None
        while ex and len(groups)>ex:   # merge smallest into nearest neighbour
            k=min(range(len(groups)),key=lambda i:groups[i]['area'])
            nb=k-1 if k>0 and (k==len(groups)-1 or groups[k]['x0']-groups[k-1]['x1']<=groups[k+1]['x0']-groups[k]['x1']) else k+1
            A,B=groups[k],groups[nb]
            B['cs']+=A['cs'];B['x0']=min(A['x0'],B['x0']);B['x1']=max(A['x1'],B['x1']);B['area']+=A['area'];B['cut']=None
            groups.pop(k)
        while ex and len(groups)<ex:   # split widest at lowest column-mass valley
            k=max(range(len(groups)),key=lambda i:groups[i]['x1']-groups[i]['x0']);g=groups[k]
            ids=[c['i'] for c in g['cs']];sub=np.isin(lab[:,g['x0']:g['x1']],ids)
            col=ndi.uniform_filter1d(sub.sum(axis=0).astype(float),size=max(5,(g['x1']-g['x0'])//40))
            w=len(col);lo,hi=int(w*.28),int(w*.72);v=lo+int(np.argmin(col[lo:hi]));xc=g['x0']+v
            g1=dict(cs=g['cs'],x0=g['x0'],x1=xc,area=g['area']//2,cut=(g['x0'],xc));g2=dict(cs=g['cs'],x0=xc,x1=g['x1'],area=g['area']//2,cut=(xc,g['x1']))
            groups[k:k+1]=[g1,g2]
        row=[]
        for g in groups:
            ids=[c['i'] for c in g['cs']];x0,x1=g['x0'],g['x1'];y0=min(c['y0'] for c in g['cs']);y1=max(c['y1'] for c in g['cs'])
            if g['cut']: x0,x1=g['cut']
            for c in small:
                if c['x1']>x0-40 and c['x0']<x1+40 and c['y1']>y0-40 and c['y0']<y1+40 and not g['cut']:
                    ids.append(c['i']);x0=min(x0,c['x0']);x1=max(x1,c['x1']);y0=min(y0,c['y0']);y1=max(y1,c['y1'])
            mk=np.isin(lab[y0:y1,x0:x1],ids)
            if g['cut']: # restrict y to pixels present
                ys=np.where(mk.any(axis=1))[0]
                if len(ys): y0,y1=y0+ys.min(),y0+ys.max()+1;mk=np.isin(lab[y0:y1,x0:x1],ids)
            f=rgba[y0:y1,x0:x1].copy(); f[~mk]=0
            row.append(Image.fromarray(f))
        out.append(row)
    return out
def preview(rows,name,bg=(100,110,130),th=170):
    cols=max(len(r) for r in rows); S=Image.new('RGB',(cols*th,len(rows)*th),bg)
    for ri,r in enumerate(rows):
        for ci,f in enumerate(r):
            t=f.copy(); t.thumbnail((th-6,th-6)); S.paste(t,(ci*th+3,ri*th+3),t)
    S.save(name)

def cutx(path,cuts,thr=20):
    rgba=key(path,thr); out=[]
    for a,b in zip(cuts[:-1],cuts[1:]):
        f=rgba[:,a:b].copy(); m=f[:,:,3]>0
        lab,n=ndi.label(m)
        if n==0: continue
        areas=ndi.sum(m,lab,range(1,n+1)); tot=areas.sum(); keep=[]
        for i,ar in enumerate(areas):
            sl=ndi.find_objects((lab==i+1).astype(int))[0]; edge=sl[1].start==0 or sl[1].stop==f.shape[1]
            if ar>=60 and not (edge and ar<.10*tot): keep.append(i+1)
        mk=np.isin(lab,keep); f[~mk]=0
        ys,xs=np.where(mk); out.append(Image.fromarray(f[ys.min():ys.max()+1,xs.min():xs.max()+1]))
    return out
