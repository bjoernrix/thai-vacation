# Thai Vacation – Gemini-Prompts Level 1 Deutschland

Vorgehen wie bei den Animations-Prompts: pro Gemini-Chat zuerst den passenden MASTER-PROMPT einfügen, dann den jeweiligen STEP. Als Stil-Referenz bei Hintergründen `bgA.jpg` (Strandstraße Hua Hin) anhängen, bei Figuren das Rix- oder Oma-Sheet. Fertige Dateien in den Downloads-Ordner, ich übernehme Zuschnitt, Freistellen und Einbau.

Reihenfolge: Paket 1 (Hof) komplett, dann testen wir den Stil im Spiel, bevor Paket 2 (Flohmarkt) startet.

---

## A. MASTER-PROMPT Hintergründe (immer zuerst einfügen)

```
You are a background artist for a 2D side-scrolling beat-'em-up game. Match the attached reference image exactly in style: high-detail 2D pixel-art look, thick dark outlines on foreground objects, saturated colours, clean readable shapes, slightly cartoonish proportions, same level of detail and same lighting treatment as the reference.

GLOBAL SPEC – applies to every background tile
Format: exactly 1620 x 540 px, landscape, 3:1. Treat it as a stage set seen from the side at street level, like the reference.
Ground: the walkable ground is a flat horizontal strip whose top edge lies at y = 450 (± 20 px) across the whole width. Below it only ground texture, no objects.
Depth: three visible layers – a far layer (sky, distant buildings or landscape), a middle layer (the main buildings, fences, props along the back), a near layer (small objects standing on the ground line, nothing taller than about 180 px so characters stay visible).
Edges: the leftmost and rightmost 120 px must be calm and continuous (plain wall, sky, hedge or ground) so two tiles can be blended side by side without a visible seam. No important object touches the left or right edge.
Content rules: no people, no animals, no vehicles in motion, no text or readable signs unless the step asks for it, no UI, no frame or border. Daylight unless the step says otherwise.
Output: one PNG, no watermark. Reply with the filename only.
```

### STEP H1 – file `bgE.png` (Hof Dummmeier, Außenbereich)
```
Create tile 1 of the farm stage "Hof Dummmeier" in northern Germany on a grey drizzly morning.
Far layer: flat overcast sky in pale grey, a line of bare poplar trees and a distant wind turbine, soft rain streaks.
Middle layer, left to right: a red-brick farmhouse with white window frames and a wet slate roof; a long wooden fence with chicken wire; a small chicken coop on legs with a ramp; a big manure heap with a pitchfork stuck in it and steam rising; stacked old tyres.
Near layer: puddles reflecting the sky, a tipped-over feed bucket, scattered straw, a rusty milk can, two rat holes in the ground edge (dark round openings, 40 px wide) with crumbs around them.
Ground: wet cobblestones and mud, top edge at y = 450.
Palette: muted greens, browns and greys, the only warm accent is the yellow light in one farmhouse window.
```

### STEP H2 – file `bgF.png` (Scheune innen)
```
Create tile 2 of the farm stage: the inside of a large old wooden barn, same style, same rainy morning seen through gaps in the planks.
Far layer: the back wall of dark vertical planks with thin daylight shafts and dust in the air, a high hayloft door open to grey sky at the top centre.
Middle layer: a wooden gallery with ladder at mid height, hay bales stacked in three levels like staircase platforms (each bale about 120 x 70 px, clearly separated from each other so they can be cut out later as platforms), a tractor silhouette under a tarp on the right, hanging tools, a grain silo tube on the far right.
Near layer: loose straw, a wheelbarrow, sacks of grain with one torn open and grain spilling, three rat holes gnawed into the base of the wall.
Ground: packed earth with straw, top edge at y = 450.
Lighting: cool daylight shafts from the left, warm single bulb hanging on the right.
```

---

## B. MASTER-PROMPT Figuren (immer zuerst einfügen)

Identisch zum Master-Prompt aus `claude/animation-prompts.md` (512 px Zellen, Figur 400 px hoch, Füße auf y = 456, Blick nach rechts, flaches Violett #1E1B24, keine Zellgrenze überschreiten). Für kleine Tiere gilt abweichend: Körperhöhe 160 px statt 400 px, Füße ebenfalls auf y = 456, damit sie im Spiel tief bleiben und nur mit dem Schienbein zu treffen sind.

Jede Figur bekommt die Standard-Sheets: `idle` 4 Frames, `walk` 6, `attack` 5, `hurt` 3, `ko` 6. Zusätze stehen im Step.

### STEP F1 – Ratte (`ratIdle`, `ratWalk`, `ratAttack`, `ratHurt`, `ratKO`)
```
Character: a fat grey-brown farm rat with pink tail, yellow buck teeth, one torn ear and a mean little grin. Small (160 px body height), long, low to the ground. Attack = lunging bite forward with teeth bared. KO = flips on its back, paws up, tongue out, little stars. Comic villain energy, never scary.
```

### STEP F2 – Maus (`mouseIdle`, `mouseWalk`, `mouseHurt`, `mouseKO`)
```
Character: a tiny round white-grey mouse with big ears and big worried eyes, 110 px body height. No attack sheet. It scurries in a panicked zig-zag. KO = puffs into a little cloud with a squeak, 4 frames only.
```

### STEP F3 – Marder (`martenIdle`, `martenWalk`, `martenAttack`, `martenHurt`, `martenKO`, plus `martenJump` 4 frames)
```
Character: a sleek dark-brown stone marten with cream throat patch, bushy tail and glinting eyes, 220 px body height, elongated body. Attack = pounce from above, claws out. Jump sheet = crouch, launch upward, airborne stretched, landing crouch. Sly, fast, cable-chewing troublemaker.
```

### STEP F4 – Hahn (`roosterIdle`, `roosterWalk`, `roosterAttack`, `roosterHurt`, `roosterKO`, plus `roosterGuard` 2 frames)
```
Character: a proud angry rooster with glossy green-black tail feathers, red comb, puffed chest, 260 px tall. Walks with exaggerated chest-first strut. Attack = flying kick with spurs, wings spread. Guard = wings folded forward like a shield, head down. KO = lies on its side, comb drooping, one feather floating.
```

### STEP F5 – Bauer Dummmeier (`farmerIdle`, `farmerWalk`, `farmerAttack`, `farmerHurt`, `farmerKO`)
```
Character: a stocky 60-year-old German farmer, 400 px tall, flat cap, grey stubble, red cheeks, green rubber boots, blue dungarees over a checked shirt, holding a pitchfork. Attack = two-handed overhead pitchfork swing, 5 frames. Hurt = cap flies up and lands back. KO = sits down heavily on the ground, cap over his eyes, boots pointing up.
```

### STEP F6 – Rattenkönigin (`ratqueenIdle`, `ratqueenWalk`, `ratqueenAttack`, `ratqueenHurt`, `ratqueenKO`, plus `ratqueenSplit` 6 frames)
```
Character: a mini-boss – a rolling ball of eight rats tangled together by their tails, about 300 px in diameter, many eyes and teeth pointing outward, one rat on top wearing a tiny bent tin crown. Walk = rolls like a ball. Attack = the ball stretches and snaps forward like a many-headed bite. Split sheet = the ball bursts apart into separate rats flying outward (frames 1–3), then they scramble back together and reform (frames 4–6). KO = the crown drops, rats slump in a pile.
```

### STEP F7 – Dackel (Begleiter Spieler 2) (`dachshundIdle`, `dachshundWalk`, `dachshundAttack`, `dachshundHurt`)
```
Character: a brave long-haired dachshund with a red collar, 180 px tall, very long body, ears flapping. Attack = bite with small comic growl lines. Hurt = yelps, ears straight up. No KO sheet (the companion cannot die).
```

---

## C. Requisiten und Items Stage 1-1 (ein Bild, mehrere Objekte)

### STEP P1 – file `props_farm.png`
```
Sprite sheet of game props in the same pixel-art style, each object in its own 256 x 256 px cell in one row, flat background #1E1B24, no shadows, no text, left to right:
1 bait box (small green plastic box with rat silhouette icon and a skull sticker), 2 rat hole open (dark round hole in ground with crumbs), 3 rat hole closed (same hole with a wooden plank nailed over it), 4 hay bale (rectangular, yellow, tied with two strings), 5 beer crate (red plastic crate with brown bottles, "Thai Vacation" style like the existing beer item), 6 spray pump (metal pest-control sprayer with hose), 7 feed bucket tipped, 8 wheelbarrow.
```

---

## Checkliste vor dem Hochladen
- Hintergründe 1620 x 540, Bodenkante bei etwa y = 450, ruhige Ränder links und rechts.
- Sheets: eine Reihe, gleiche Zellgröße, violetter Hintergrund, nichts über die Zellgrenze.
- Dateinamen wie angegeben; ich ordne beim Einbau automatisch zu.
