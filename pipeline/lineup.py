import json,sys
from PIL import Image,ImageDraw
def lineup(atlas,imgf,sets,out,k_override=None,cols=None):
    J=json.load(open(atlas)); A=Image.open(imgf).convert('RGBA'); rows=[]
    for s in sets:
        d=J[s]; k=d.get('k',1.0); frames=[]
        for an,L in d['a'].items():
            idxs=[0,len(L)//2] if len(L)>1 else [0]
            for i in idxs: frames.append((an+str(i),L[i]))
        H=max(f[1][3] for f in frames)/k+30; cw=[]
        W=int(sum(max(f[1][2]/k,40)+10 for f in frames)+20)
        R=Image.new('RGB',(W,int(H)+14),(70,80,100)); dr=ImageDraw.Draw(R); x=10; base=int(H)+6
        dr.text((2,0),s,fill=(255,255,0))
        # reference lines at 60,100,120 px
        for yy in (60,100,120,150): dr.line([(0,base-yy),(W,base-yy)],fill=(110,120,150))
        for nm,f in frames:
            c=A.crop((f[0],f[1],f[0]+f[2],f[1]+f[3])); 
            c=c.resize((max(1,round(f[2]/k)),max(1,round(f[3]/k))),Image.LANCZOS)
            ax=(f[4] if len(f)>4 else f[2]/2)/k
            px=x+max(0,20-int(ax)) if False else x
            R.paste(c,(px,base-c.height),c); dr.text((px,base+0),nm,fill=(255,255,255)); x+=max(c.width,40)+10
        rows.append(R)
    Wm=max(r.width for r in rows); S=Image.new('RGB',(Wm,sum(r.height for r in rows)),(30,30,30)); y=0
    for r in rows: S.paste(r,(0,y)); y+=r.height
    S.save(out); print(out,S.size)
if __name__=='__main__':
    lineup('assets/anim.json','assets/anim.png',['oma','masseuse','pirat','tourist'],'lu_A.png')
    lineup('assets/anim.json','assets/anim.png',['monkey','bouncer','rowdy','dog','drunk'],'lu_B.png')
    lineup('assets/heroes.json','assets/heroes.png',['rix','hgm'],'lu_H.png')
