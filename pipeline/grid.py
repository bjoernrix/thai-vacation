import numpy as np
from PIL import Image
from scipy import ndimage as ndi
from nsl import key
def slice_grid(path,thr=28,minfrac=.12,attach=60):
    rgba=key(path,thr); m=rgba[:,:,3]>0
    lab,n=ndi.label(m); objs=ndi.find_objects(lab)
    comps=[]
    for i,s in enumerate(objs):
        a=int((lab[s]==i+1).sum()); comps.append(dict(i=i+1,a=a,x0=s[1].start,x1=s[1].stop,y0=s[0].start,y1=s[0].stop))
    amax=max(c['a'] for c in comps)
    big=[c for c in comps if c['a']>=amax*minfrac]
    small=[c for c in comps if c['a']<amax*minfrac and c['a']>40]
    for c in big: c['ids']=[c['i']]
    for s in small:  # attach to nearest big (by bbox distance)
        def d(c):
            dx=max(c['x0']-s['x1'],s['x0']-c['x1'],0); dy=max(c['y0']-s['y1'],s['y0']-c['y1'],0); return dx*dx+dy*dy
        b=min(big,key=d)
        if d(b)<attach**2:
            b['ids'].append(s['i']); b['x0']=min(b['x0'],s['x0']);b['x1']=max(b['x1'],s['x1']);b['y0']=min(b['y0'],s['y0']);b['y1']=max(b['y1'],s['y1'])
    # rows
    for c in big: c['cy']=(c['y0']+c['y1'])/2
    big.sort(key=lambda c:c['cy']); hmed=np.median([c['y1']-c['y0'] for c in big])
    rows=[[big[0]]]
    for c in big[1:]:
        if c['cy']-np.mean([r['cy'] for r in rows[-1]])>hmed*.6: rows.append([c])
        else: rows[-1].append(c)
    out=[]
    for r in rows:
        r.sort(key=lambda c:c['x0']); rowf=[]
        for c in r:
            mk=np.isin(lab[c['y0']:c['y1'],c['x0']:c['x1']],c['ids'])
            f=rgba[c['y0']:c['y1'],c['x0']:c['x1']].copy(); f[~mk]=0; rowf.append(Image.fromarray(f))
        out.append(rowf)
    return out
def preview(rows,name,th=200,bg=(100,110,130)):
    cols=max(len(r) for r in rows); S=Image.new('RGB',(cols*th,len(rows)*th),bg)
    for ri,r in enumerate(rows):
        for ci,f in enumerate(r):
            t=f.copy(); t.thumbnail((th-6,th-6)); S.paste(t,(ci*th+3,ri*th+3),t)
    S.save(name)
if __name__=='__main__':
    import sys; R=slice_grid(sys.argv[1]); print([len(r) for r in R]); preview(R,sys.argv[2])
