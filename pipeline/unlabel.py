import cv2,numpy as np
im=cv2.imread('rixDrink.jpeg'); s=1.376
boxes=[(1080,120,1200,330),(1650,40,1850,180),(330,560,520,690),(1070,680,1190,860),(800,230,920,360)]
hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV)
out=im.copy()
for (x0,y0,x1,y1) in boxes:
    x0,y0,x1,y1=[int(v*s) for v in (x0,y0,x1,y1)]
    sub=im[y0:y1,x0:x1]; h=hsv[y0:y1,x0:x1]
    green=((h[...,0]>40)&(h[...,0]<85)&(h[...,1]>90)&(h[...,2]>45)).astype(np.uint8)
    # größte grüne Komponente = Flasche
    n,lab,st,_=cv2.connectedComponentsWithStats(green)
    if n<2: continue
    g=np.isin(lab,[i for i in range(1,n) if st[i,cv2.CC_STAT_AREA]>250]).astype(np.uint8)
    closed=cv2.morphologyEx(g,cv2.MORPH_CLOSE,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(61,61)))
    # Löcher füllen
    cnts,_=cv2.findContours(closed,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
    filled=np.zeros_like(closed); cv2.drawContours(filled,cnts,-1,1,-1)
    filled=cv2.erode(filled,np.ones((5,5),np.uint8))
    mask=((filled==1)&(g==0)).astype(np.uint8)
    # nur 'Label-Pixel': hell/rot/sehr dunkel oder entsättigt
    sat=h[...,1]; val=h[...,2]
    lab_px=((sat<110)|(val<70)|((h[...,0]<12)|(h[...,0]>165))).astype(np.uint8)
    mask=mask&lab_px
    near=cv2.dilate(g,np.ones((31,31),np.uint8))
    hh=h[...,0]
    extra=(((val>150)&(sat<120))|(((hh<6)|(hh>172))&(sat>110)))&(near==1)&(g==0)
    mask=mask|extra.astype(np.uint8)
    mask=cv2.dilate(mask,np.ones((3,3),np.uint8),iterations=2)
    # kein Handschuh (lila) / Haut
    purple=((h[...,0]>115)&(h[...,0]<160)&(sat>90)).astype(np.uint8)
    mask=mask&(1-purple)
    res=cv2.inpaint(sub,mask*255,6,cv2.INPAINT_TELEA)
    out[y0:y1,x0:x1]=res
    print((x0,y0),mask.sum())
cv2.imwrite('rixDrink_nolabel.png',out)
for i,(x0,y0,x1,y1) in enumerate(boxes):
    x0,y0,x1,y1=[int(v*s) for v in (x0,y0,x1,y1)]
    c=out[y0:y1,x0:x1]; cv2.imwrite(f'zz_{i}.png',cv2.resize(c,None,fx=2,fy=2,interpolation=cv2.INTER_NEAREST))
