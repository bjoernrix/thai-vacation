import base64,json,os
import sys
S=os.path.dirname(os.path.abspath(__file__))+'/../'
A=S+'assets/'
def b64(f,mime): return 'data:%s;base64,%s'%(mime,base64.b64encode(open(A+f,'rb').read()).decode())
src={'bgA':b64('bgA.jpg','image/jpeg'),'bgB':b64('bgB.jpg','image/jpeg'),'bgC':b64('bgC.jpg','image/jpeg'),
     'rix':b64('rix.png','image/png'),'hgm':b64('hgm.png','image/png'),'saenchai':b64('saenchai.png','image/png'),'bgD':b64('bgD.jpg','image/jpeg'),'anim':b64('anim.png','image/png'),'heroes':b64('heroes.png','image/png'),'bgE':b64('bgE.jpg','image/jpeg'),'bgF':b64('bgF.jpg','image/jpeg'),'anim2':b64('anim2.png','image/png'),'bgG':b64('bgG.jpg','image/jpeg'),'bgH':b64('bgH.jpg','image/jpeg')}
atlas=json.load(open(A+'saenchai.json'));ANIM=json.load(open(A+'anim.json'));ANIM.update(json.load(open(A+'heroes.json')));ANIM.update(json.load(open(A+'anim2.json')))
import glob
SAMPLES={os.path.basename(f)[:-6]:[base64.b64encode(open(f,'rb').read()).decode()] for f in sorted(glob.glob(A+'sfx/*_1.mp3'))}
js=''.join(open(S+'src/'+f).read()+'\n' for f in ['a_core.js','b_art.js','c_data.js','d_logic.js','e_render.js','f_editor.js'])
assets='const ASSET_SRC='+json.dumps(src)+';\nconst SAMPLE_SRC='+json.dumps(SAMPLES)+';\nconst ATLAS='+json.dumps(atlas)+';\nconst ANIM='+json.dumps(ANIM)+';\n'
html='''<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Thai Vacation – Beta + Sound (Hua Hin)</title>
<style>html,body{margin:0;height:100%;background:#0b0d12;overflow:hidden}body{display:flex;align-items:center;justify-content:center}
canvas{width:min(100vw,177.78vh);height:auto;aspect-ratio:16/9;background:#000}
#edp{display:none;width:300px;height:100vh;overflow:auto;flex:none}body.ed canvas{width:min(calc(100vw - 300px),177.78vh)}</style></head>
<body><canvas id="c" width="960" height="540"></canvas><div id="edp"></div>
<script>
'''+assets+js+'''
</script></body></html>'''
os.makedirs(S+'dist',exist_ok=True)
out=S+'dist/thai-vacation.html'
open(out,'w').write(html)
open(S+'dist/game_check.js','w').write(assets.split('const ATLAS')[1] and ('const ASSET_SRC={};const SAMPLE_SRC={};const ATLAS='+json.dumps(atlas)+';\nconst ANIM='+json.dumps(ANIM)+';\n'+js))
print(os.path.getsize(out)//1024,'KB')
