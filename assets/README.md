# assets/

Die Spielbilder und Sounds liegen **nicht** im Repository (zu groß, teils noch Platzhalter).
`tools/build.py` erwartet hier:

- Hintergründe: `bgA.jpg` … `bgH.jpg` (1920 x 540)
- Porträts: `rix.png`, `hgm.png`
- Boss: `saenchai.png` + `saenchai.json`
- Atlanten: `anim.png`/`anim.json` (alte Gegner), `heroes.png`/`heroes.json` (Rix, HGM), `anim2.png`/`anim2.json` (Level 1 Deutschland)
- Sounds: `sfx/<id>_1.mp3`

Rohsheets der KI-Bildgenerierung kommen nach `assets/raw_l1/<name>.jpg`, die Schnitt- und Pack-Skripte stehen in `pipeline/`.
Größere Dateien bei Bedarf mit Git LFS ablegen.
