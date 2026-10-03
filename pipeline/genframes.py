import sys,pickle
sys.path.insert(0,'/home/claude/gen')
from grid import slice_grid
D='/home/claude/gen/'
SEL={ # key: (file, indices or None=all)
 'oma_walk':('omaWalk',[0,1,2,3]),'oma_hurt':('omaHurt',[0,2,3,4]),'oma_ko':('omaKO',[0,1,3,4,5,8]),
 'masseuse_walk':('massageWalk',[0,1,2,3]),'masseuse_hurt':('massageHurt',[1,2,5,6]),'masseuse_ko':('massageKO',[0,1,2,3,4,6,7]),
 'pirat_walk':('pirateWalk',None),'pirat_hurt':('pirateHurt',[4,2,7,9]),'pirat_ko':('pirateKO',[0,1,2,3,4,6,7]),
 'tourist_walk':('touristWalk',None),'tourist_hurt':('touristHurt',None),'tourist_ko':('touristKO',None),
 'monkey_walk':('monkeyWalk',[0,1,2,3,5,6]),'monkey_hurt':('monkeyHurt',None),'monkey_ko':('monkeyKO',None),
 'rix_idle':('rixIdle',None),'rix_drink':('rixDrink',None),'rix_teamthrow':('rixTeamThrow',None),'rix_thrown':('rixThrown',[0,1,2,5]),
 'hgm_jump':('hgmJump',None),'hgm_fall':('hgmFall',None),'hgm_hurt':('hgmHurt',None),'hgm_teamthrow':('hgmTeamThrow',None),'hgm_thrown':('hgmThrown',[0,1,3]),
}
G={}
for k,(f,idx) in SEL.items():
    att=0 if f=='monkeyKO' else 60
    fl=[x for row in slice_grid(D+f+'.jpeg',attach=att) for x in row]
    G[k]=fl if idx is None else [fl[i] for i in idx]
pickle.dump(G,open('G.pkl','wb'))
print({k:len(v) for k,v in G.items()})
