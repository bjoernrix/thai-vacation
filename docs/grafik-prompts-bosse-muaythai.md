# Thai Vacation – Gemini-Prompts: drei Muay-Thai-Bosse (Version 2)

## Was du anhängst

Pro Figur ein eigener Gemini-Chat (Modell Flash). Im ersten Beitrag hängst du **zwei Bilder** an:

1. **Bild 1 – Figur-Referenz:** dein Sheet der jeweiligen Kämpferin bzw. des Kämpfers (Pink-Lotus, Golden Naga, Jade Viper).
2. **Bild 2 – Stil- und Format-Referenz (für alle drei Chats dasselbe):** das Walk-Sheet des Marktaufsehers Pröpke aus dem Flohmarkt, Datei `Gemini_Generated_Image_ (24).jpeg` im Downloads-Ordner. Es zeigt genau, was wir brauchen: eine Reihe, große Figur, dunkelvioletter Hintergrund, saubere Abstände. Mit diesem Stil kamen alle Flohmarkt-Figuren gut ins Spiel.

Danach: Master-Prompt der Figur (Teil B, C oder D) in den ersten Beitrag zu den Bildern, abschicken, dann die Steps nacheinander. Nach jedem Step das Bild abwarten.

Namen und Marken sind erfunden und vorläufig. Auf der Kleidung steht kein Text, nur das jeweilige Symbol.

---

## A. Gemeinsame Steps (in jedem der drei Chats, in dieser Reihenfolge)

Die Steps sprechen von „the character“, die Figur steht ja schon im Master-Prompt. Frame-Zahlen sind verbindlich, weil der Zuschnitt danach zählt.

### A1 – `<name>Idle` (4)
```
Sprite sheet: IDLE, exactly 4 frames. The character in fight stance, guard up, subtle breathing and weight shift between frames. Follow the movement style from the first message.
```
### A2 – `<name>Walk` (6)
```
Sprite sheet: WALK cycle, exactly 6 frames. The character stalks forward in fight stance, guard hands up, clear stepping poses with both legs visible. Follow the movement style from the first message.
```
### A3 – `<name>Intro` (5)
```
Sprite sheet: INTRO, exactly 5 frames. Muay Thai Wai Kru ritual: frame 1 bows with palms together, frame 2 kneels, frame 3 and 4 the ram-muay dance in the movement style of the character, frame 5 snaps into fight stance and stares at the viewer.
```
### A4 – `<name>Teep` (5)
```
Sprite sheet: ATTACK teep (push kick), exactly 5 frames. Frame 1 and 2 lift the knee (wind-up), frame 3 straight front push-kick at stomach height with a white impact streak, frame 4 and 5 return to stance.
```
### A5 – `<name>Lowkick` (5)
```
Sprite sheet: ATTACK low kick, exactly 5 frames. Frame 1 and 2 hip turn and wind-up, frame 3 roundhouse kick at shin height with a coloured motion arc matching the outfit, frame 4 and 5 recovery.
```
### A6 – `<name>Knee` (5)
```
Sprite sheet: ATTACK flying knee, exactly 5 frames. Frame 1 and 2 crouch and push off (wind-up), frame 3 and 4 leap forward with the knee driven out and a white impact spark, frame 5 landing.
```
### A7 – `<name>Counter` (4)
```
Sprite sheet: COUNTER, exactly 4 frames. Frame 1 slips sideways, frame 2 ducks under an invisible strike, frame 3 fires a fast counter strike (elbow or cross) with a motion arc, frame 4 recovery. The opponent is not drawn.
```
### A8 – `<name>Guard` (2)
```
Sprite sheet: GUARD, exactly 2 frames. Both gloves tight at the face, elbows in, knees bent, head ducked. Frame 2 slightly tighter with a small white block spark.
```
### A9 – `<name>Hurt` (3)
```
Sprite sheet: HURT, exactly 3 frames. Frame 1 head snaps back with a small white impact star, frame 2 stumbles backwards with little stars around the head, frame 3 pulls back into guard, angry face.
```
### A10 – `<name>Stagger` (4)
```
Sprite sheet: STAGGER (stunned and defenceless), exactly 4 frames. Hunched over, knees wobbling, arms hanging low, dizzy swirl eyes, stars circling the head. Slow sway from left to right across the frames.
```
### A11 – `<name>KO` (6)
```
Sprite sheet: KO, exactly 6 frames, laid out in one row with wide gaps between the frames. Frame 1 hit with head back, frame 2 falling backwards, frame 3 airborne, frame 4 landing on the back, frame 5 and 6 lying flat on the ground with stars above the head. Keep the same scale as the standing sheets.
```
### A12 – `<name>Portrait` (1 Bild)
```
Single portrait image, 512 x 512 pixels, flat dark purple background #1E1B24. The character, head and shoulders, in the expression named in the first message, same pixel-art style. No text.
```

---

## B. Boss 1 – Pink-Lotus (schnell, Kombinationen)

### Master-Prompt (erster Beitrag, mit Bild 1 und Bild 2)
```
You are a sprite artist for a 2D side-scrolling beat-'em-up boss fight. I attach two images.
IMAGE 1 is the CHARACTER reference: use it only for face, hair, skin tone, body proportions and outfit colours. IGNORE every text, logo, brand name and caption on it.
IMAGE 2 is the STYLE and FORMAT reference: copy its pixel-art rendering, outline thickness, shading, flat dark purple background, one-row layout, frame spacing and the large figure size exactly. Do NOT copy the character from image 2.

CHARACTER "Pink-Lotus": a fast, lean young female Muay Thai fighter, brown skin, dark hair in a high bun with a white braided headband, determined confident expression. Hot-pink satin Muay Thai shorts with a gold waistband and ONE simple white lotus-flower symbol on the left hip, matching hot-pink sports top with the same small lotus symbol, black open-finger fight gloves with pink wrist tape, pink ankle wraps, bare feet.
Movement style: quick, light and bouncy, always on her toes. Portrait expression: fierce confident smile.

RULES for every sprite sheet I request:
- Exactly the number of frames I name, in ONE horizontal row, left to right, evenly spaced, clear gaps, frames never touch, nothing crosses a frame boundary.
- Flat solid dark purple background #1E1B24, no gradient, no floor, no shadow, no frame lines, no labels, no numbers, no arrows.
- The fighter fills about two thirds of the image height, the same scale in every sheet, feet on the same baseline in every frame (except lying poses).
- Faces right, three-quarter side view.
- Never draw any text, letters, logos or brand names. Only the one simple symbol described above.
Reply "ready" and wait for the first sheet request.
```

### Boss-spezifische Steps (zusätzlich zu A1 bis A12)

**B1 – `lotusCombo` (6, Signatur: Jab-Cross-Highkick)**
```
Sprite sheet: ATTACK combo, exactly 6 frames. Frame 1 and 2 quick jab with a small pink motion streak (wind-up), frame 3 and 4 powerful cross punch with a white impact spark, frame 5 and 6 fast high roundhouse kick with a big pink motion arc.
```
**B2 – `lotusWin` (4)**
```
Sprite sheet: VICTORY, exactly 4 frames. Raises both fists with a wide grin, a short happy hop, points at the viewer, hands on hips laughing.
```

---

## C. Boss 2 – Golden Naga (kraftvoll, Ellbogen)

### Master-Prompt
```
You are a sprite artist for a 2D side-scrolling beat-'em-up boss fight. I attach two images.
IMAGE 1 is the CHARACTER reference: use it only for face, hair, skin tone, body proportions and outfit colours. IGNORE every text, logo, brand name and caption on it.
IMAGE 2 is the STYLE and FORMAT reference: copy its pixel-art rendering, outline thickness, shading, flat dark purple background, one-row layout, frame spacing and the large figure size exactly. Do NOT copy the character from image 2.

CHARACTER "Golden Naga": a heavily muscular male Muay Thai master, short dark cropped hair, stern intense expression, dark brown skin, broad shoulders, a thin gold arm-band amulet on each upper arm. Black satin Muay Thai shorts with a gold waistband and ONE simple gold coiled-snake symbol on the left hip, no top, white hand tape with black-and-gold gloves, white ankle wraps, bare feet.
Movement style: slow, heavy and grounded, every step planted, menacing calm. Portrait expression: stern glare.

RULES for every sprite sheet I request:
- Exactly the number of frames I name, in ONE horizontal row, left to right, evenly spaced, clear gaps, frames never touch, nothing crosses a frame boundary.
- Flat solid dark purple background #1E1B24, no gradient, no floor, no shadow, no frame lines, no labels, no numbers, no arrows.
- The fighter fills about two thirds of the image height, the same scale in every sheet, feet on the same baseline in every frame (except lying poses).
- Faces right, three-quarter side view.
- Never draw any text, letters, logos or brand names. Only the one simple symbol described above.
Reply "ready" and wait for the first sheet request.
```

**C1 – `nagaElbow` (5, Signatur: Ellbogen-Hammer)**
```
Sprite sheet: ATTACK elbow smash, exactly 5 frames. Frame 1 and 2 raise the right elbow high over the head in a deep crouch (wind-up), frame 3 slam the elbow diagonally downward with a heavy gold-white impact flash and ground-crack lines, frame 4 and 5 recovery.
```
**C2 – `nagaWin` (4)**
```
Sprite sheet: VICTORY, exactly 4 frames. Flexes both arms, roars, crosses his arms with a smug look, slow nod.
```

---

## D. Boss 3 – Jade Viper (Clinch und Beinarbeit)

### Master-Prompt
```
You are a sprite artist for a 2D side-scrolling beat-'em-up boss fight. I attach two images.
IMAGE 1 is the CHARACTER reference: use it only for face, hair, skin tone, body proportions and outfit colours. IGNORE every text, logo, brand name and caption on it.
IMAGE 2 is the STYLE and FORMAT reference: copy its pixel-art rendering, outline thickness, shading, flat dark purple background, one-row layout, frame spacing and the large figure size exactly. Do NOT copy the character from image 2.

CHARACTER "Jade Viper": a lean agile female Muay Thai fighter, black hair with thin green-dyed braids tied back in a ponytail, cheeky confident smile, medium brown skin, toned arms. Purple-and-magenta tiger-stripe pattern satin Muay Thai shorts with ONE small green snake symbol on the left hip, matching magenta sports top with the same small symbol, black fight gloves with red wrist tape, magenta ankle wraps, bare feet.
Movement style: smooth, gliding and snake-like, swaying hips, playful. Portrait expression: cheeky grin.

RULES for every sprite sheet I request:
- Exactly the number of frames I name, in ONE horizontal row, left to right, evenly spaced, clear gaps, frames never touch, nothing crosses a frame boundary.
- Flat solid dark purple background #1E1B24, no gradient, no floor, no shadow, no frame lines, no labels, no numbers, no arrows.
- The fighter fills about two thirds of the image height, the same scale in every sheet, feet on the same baseline in every frame (except lying poses).
- Faces right, three-quarter side view.
- Never draw any text, letters, logos or brand names. Only the one simple symbol described above.
Reply "ready" and wait for the first sheet request.
```

**D1 – `viperClinch` (5, Signatur: Clinch-Griff und Knie)**
```
Sprite sheet: ATTACK clinch grab, exactly 5 frames. Frame 1 and 2 step in fast with both arms reaching forward (wind-up), frame 3 both hands lock behind the neck of an invisible opponent in front of her, frame 4 drive a knee upward with a white impact flash, frame 5 release and step back. Do not draw the opponent.
```
**D2 – `viperWin` (4)**
```
Sprite sheet: VICTORY, exactly 4 frames. Raises both fists and laughs, blows a kiss, one hand on the hip in a pose, cheeky wink.
```

---

## Checkliste
- Pro Boss 14 Bilder (12 gemeinsame Steps, Signaturangriff, Win), zusammen 42.
- Wenn Gemini eine falsche Frame-Zahl liefert, im selben Chat: `Redo it with exactly N frames in one row, same scale.`
- Wenn Schrift auf der Kleidung auftaucht: `Redraw the same sheet with absolutely no text or letters, only the simple symbol.`
- Bei einem Fehler oder einer Absage: `Try again please: generate the image, <Sheet-Name>, same style as the attached image.`
- Dateien nach den Überschriften benennen (`lotusIdle`, `nagaKO`, `viperClinch` …), ich ordne beim Einbau zu.
