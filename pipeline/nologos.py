# Entfernt Fairtex-Schriftzug (Shorts) und Nike-Swoosh (Schuhe) aus Rix' Sprites.  Aufruf: python3 nologos.py
import json,cv2,numpy as np
A='/tmp/claude-0/-home-claude/399b62b6-a1c8-51a7-92a2-52935baff444/scratchpad/assets/'
def clean(rgba):
    """rgba: HxWx4 uint8 -> bereinigte Kopie, Anzahl Fixes"""
    out=rgba.copy(); h,w=rgba.shape[:2]
    bgr=np.ascontiguousarray(rgba[...,:3][...,::-1]); hsv=cv2.cvtColor(bgr,cv2.COLOR_BGR2HSV)
    opaque=rgba[...,3]>200; H_,S,V=hsv[...,0].astype(int),hsv[...,1].astype(int),hsv[...,2].astype(int)
    light=opaque&(V>185)&(S<75)
    darkpur=opaque&((V<85)|((H_>115)&(H_<165)&(S>60)&(V<200)))
    dark=opaque&(V<90)&(S<110)
    fixes=0
    def comps(mask,amax):
        n,lab,st,_=cv2.connectedComponentsWithStats(mask.astype(np.uint8),connectivity=8)
        for i in range(1,n):
            if 3<=st[i,cv2.CC_STAT_AREA]<=amax: yield i,lab,st[i]
    def ring(lab,i):
        m=(lab==i).astype(np.uint8); r=cv2.dilate(m,np.ones((7,7),np.uint8))-m
        return (r>0)&opaque
    # Fairtex: helle Fleckchen, die zu >=55 % von Shorts-Farben (dunkel/lila) umgeben sind, Höhe 40-78 % -> inpainting
    cand=opaque&(V>125)&(S<130)&~((H_>=4)&(H_<=26)&(S>70))
    n,lab,st,_=cv2.connectedComponentsWithStats(cand.astype(np.uint8),connectivity=8)
    keep=np.zeros(cand.shape,bool)
    for i in range(1,n):
        a_=st[i,cv2.CC_STAT_AREA]; y0=st[i,cv2.CC_STAT_TOP]; yc=y0+st[i,cv2.CC_STAT_HEIGHT]/2
        if not(3<=a_<=300) or yc<h*0.40 or yc>h*0.78: continue
        r=ring(lab,i)
        if r.sum()<8: continue
        if darkpur[r].mean()>=.55: keep|=(lab==i)
    if keep.any():
        m=cv2.dilate(keep.astype(np.uint8),np.ones((3,3),np.uint8))
        res=cv2.inpaint(np.ascontiguousarray(out[...,:3][...,::-1]),m*255,3,cv2.INPAINT_TELEA)
        out[...,:3]=np.where(m[...,None]>0,res[...,::-1],out[...,:3]); fixes+=int(keep.sum())
    # Handschuh-Schriftzug: sehr kleine helle Fleckchen komplett in lila Handschuhfläche
    pur=opaque&(H_>115)&(H_<165)&(S>60)&(V>70)&(V<215)
    cand2=opaque&(V>165)&(S<120)&~((H_>=4)&(H_<=26)&(S>70))
    n2,lab2,st2,_=cv2.connectedComponentsWithStats(cand2.astype(np.uint8),connectivity=8)
    keep2=np.zeros(cand2.shape,bool)
    for i in range(1,n2):
        if not(2<=st2[i,cv2.CC_STAT_AREA]<=90): continue
        r=ring(lab2,i)
        if r.sum()<8: continue
        if pur[r].mean()>=.55: keep2|=(lab2==i)
    if keep2.any():
        m=cv2.dilate(keep2.astype(np.uint8),np.ones((3,3),np.uint8))
        res=cv2.inpaint(np.ascontiguousarray(out[...,:3][...,::-1]),m*255,3,cv2.INPAINT_TELEA)
        out[...,:3]=np.where(m[...,None]>0,res[...,::-1],out[...,:3]); fixes+=int(keep2.sum())
    # Swoosh: kleine dunkle Flecken, umgeben von hellem Schuh, im unteren Bereich
    for i,lab,s in comps(dark,450):
        if s[cv2.CC_STAT_TOP]<h*0.62: continue
        r=ring(lab,i)
        if r.sum()<8: continue
        if light[r].mean()>=.5:
            m=(lab==i); col=np.median(rgba[r][:,:3],axis=0); out[m,:3]=col.astype(np.uint8); fixes+=1
    # Swoosh-Reste glätten (Dilatation der gefüllten Bereiche ist nicht nötig – Komponenten sind klein)
    return out,fixes
if __name__=='__main__':
    j=json.load(open(A+'heroes.json')); im=cv2.imread(A+'heroes.png',cv2.IMREAD_UNCHANGED)
    tot=0
    for an,fl in j['rix']['a'].items():
        for (x,y,w,h,ax) in fl:
            c,f=clean(im[y:y+h,x:x+w]); im[y:y+h,x:x+w]=c; tot+=f
    cv2.imwrite(A+'heroes.png',im); print('heroes fixes',tot)
    r=cv2.imread(A+'rix.png',cv2.IMREAD_UNCHANGED)
    if r.shape[2]==3: r=cv2.cvtColor(r,cv2.COLOR_BGR2BGRA)
    c,f=clean(r); cv2.imwrite(A+'rix.png',c); print('rix.png fixes',f)
