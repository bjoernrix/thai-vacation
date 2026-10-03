import sys,json
sys.path.insert(0,'.')
from nsl import *
import pickle
N='../new/'
SP={ # name:(file,rows,expect_per_row)
'b_def':('bouncerDefend',1,[4]),'b_walk2':('bouncerWalk2',2,[6,6]),'b_ko':('bouncerKnockout',2,[6,6]),'b_hurt':('bouncerHurt',1,[3]),'b_atk':('bouncerAttack',1,[4]),'b_wind':('bouncerWindUp',1,[3]),'b_idle':('bouncerIdle',2,[8,8]),'b_walk':('g06',2,[8,8]),
'm_hurt':('mopedHurt',1,[3]),'m_wind':('mopedWindUp',1,[3]),'m_ko':('g15',1,[10]),'m_atk':('mopedAttack',1,[4]),'m_idle':('mopedIdle',1,[4]),'m_run':('mopenRun',2,[8,8]),
'd_ko':('dogKo',1,[6]),'d_hurt2':('dogHurt2',1,[2]),'d_hurt':('dogHurt',1,[4]),'d_wind':('dogWindUp',1,[2]),'d_atk':('dogAttack',1,[4]),'d_run':('dogRun',2,[5,5]),
'u_ko':('drunkKo',1,[7]),'u_hurt':('drunkHurt',1,[3]),'u_atk':('drunkAttack',1,[4]),'u_wind':('drunkWindUp',1,[4]),'u_idle':('drunkIdle',1,[4]),'u_walk':('drunkWalk',2,[8,8]),
'ma_atk':('g00',1,[3]),'ma_idle':('g07',1,[4]),'o_a':('g01',1,[4]),'o_b':('g12',1,[4]),'mk_idle':('g02',1,[4]),'mk_x':('g08',1,[4]),'mk_wind':('g04',1,[3]),'mk_throw':('g10',1,[4]),
'p_idle':('g13',1,[4]),'p_wind':('g09',1,[3]),'p_atk':('g03',1,[4]),'p_atk2':('g05',1,[3]),'t_idle':('g14',1,[4]),'t_atk':('g11',1,[3]),
}
R={};THR={};MG={'b_atk':70,'m_atk':130,'b_wind':14,'b_hurt':14}
for k,(f,rows,ex) in SP.items():
    r=frames(N+f+'.jpeg',rows=rows,expect=ex,thr=THR.get(k,20),merge_gap=MG.get(k,0))
    R[k]=r; ok=[len(x) for x in r]==ex
    print(k,[len(x) for x in r],'OK' if ok else 'EXPECT %s'%ex)
    preview(r,'../pv_%s.png'%k)
R['m_ko']=[cutx(N+'g15.jpeg',[0,555,900,1245,1875,2115,2775,3360])]
preview(R['m_ko'],'../pv_m_ko.png')
R['m_atk']=[cutx(N+'mopedAttack.jpeg',[0,248,504,771,1024])]
preview(R['m_atk'],'../pv_m_atk.png')
pickle.dump(R,open('N.pkl','wb'))
