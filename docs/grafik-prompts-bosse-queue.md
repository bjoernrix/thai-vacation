# Thai Vacation – Muay-Thai-Bosse: alle Gemini-Queue-Prompts

Pro Figur ein eigener Chat (Modell Flash). In den ersten Beitrag zwei Bilder anhängen, in dieser Reihenfolge:
1. das Sheet der jeweiligen Figur (Figur-Referenz)
2. `Gemini_Generated_Image_ (24).jpeg` aus dem Downloads-Ordner (Stil und Format, für alle drei gleich)

Nach dem Prompt antwortet Gemini „ready“. Dann jedes Mal „next“ schreiben. Bei einem falschen Bild: „redo“ oder „redo with exactly N frames, no text“. Der Zusatz-Prompt (4 Bilder) wird im selben Chat geschrieben, nachdem die ersten 10 fertig sind.

Reihenfolge: 1 Lotus (10) → 2 Lotus-Zusatz (4) → 3 Naga (10) → 4 Naga-Zusatz (4) → 5 Viper (10) → 6 Viper-Zusatz (4). Zusammen 42 Bilder.

---

## 1. Pink-Lotus – 10 Bilder (Sheet: Kämpferin in Pink mit weißem Stirnband)

```
You are a sprite artist for a 2D side-scrolling beat-'em-up boss fight. I attach two images.
IMAGE 1 is the CHARACTER reference: use it only for face, hair, skin tone, body proportions and outfit colours. IGNORE every text, logo, brand name and caption on it.
IMAGE 2 is the STYLE and FORMAT reference: copy its pixel-art rendering, outline thickness, shading, flat dark purple background, one-row layout, frame spacing and large figure size exactly. Do NOT copy the character from image 2.

CHARACTER "Pink-Lotus": a fast, lean young female Muay Thai fighter, brown skin, dark hair in a high bun with a white braided headband, determined confident expression. Hot-pink satin Muay Thai shorts with a gold waistband and ONE simple white lotus-flower symbol on the left hip, matching hot-pink sports top with the same small lotus symbol, black open-finger fight gloves with pink wrist tape, pink ankle wraps, bare feet.
Movement style: quick, light and bouncy, always on her toes.

RULES for every sprite sheet:
- Exactly the number of frames named, in ONE horizontal row, left to right, evenly spaced, clear gaps, frames never touch, nothing crosses a frame boundary.
- Flat solid dark purple background #1E1B24, no gradient, no floor, no shadow, no frame lines, no labels, no numbers, no arrows.
- The fighter fills about two thirds of the image height, the same scale in every sheet, feet on the same baseline in every frame (except lying poses).
- Faces right, three-quarter side view.
- Never draw any text, letters, logos or brand names. Only the one simple lotus symbol.

HOW THIS WORKS: Below is a numbered list of 10 sprite sheets. Reply now only with the word "ready". After that, every time I write "next", generate exactly the next sheet of the list as ONE image, with no commentary except its number and name. If I write "redo", generate the same sheet again. Never skip or combine sheets.

1. WALK, exactly 6 frames: stalks forward in fight stance, guard hands up, clear stepping poses with both legs visible.
2. IDLE, exactly 4 frames: fight stance, guard up, bouncing lightly on her toes, shoulders rolling.
3. INTRO, exactly 5 frames: Wai Kru ritual: frame 1 bows with palms together, frame 2 kneels, frame 3 and 4 an elegant ram-muay dance with arms spread, frame 5 snaps into fight stance and stares at the viewer.
4. ATTACK COMBO, exactly 6 frames: frame 1 and 2 quick jab with a small pink motion streak (wind-up), frame 3 and 4 powerful cross punch with a white impact spark, frame 5 and 6 fast high roundhouse kick with a big pink motion arc.
5. ATTACK TEEP (push kick), exactly 5 frames: frame 1 and 2 lift the knee (wind-up), frame 3 straight front push-kick at stomach height with a white impact streak, frame 4 and 5 return to stance.
6. ATTACK LOW KICK, exactly 5 frames: frame 1 and 2 hip turn and wind-up, frame 3 roundhouse kick at shin height with a pink motion arc, frame 4 and 5 recovery.
7. ATTACK FLYING KNEE, exactly 5 frames: frame 1 and 2 crouch and push off (wind-up), frame 3 and 4 leap forward with the knee driven out and a white impact spark, frame 5 landing.
8. COUNTER, exactly 4 frames: frame 1 slips sideways, frame 2 ducks under an invisible strike, frame 3 fires a fast spinning elbow with a pink arc, frame 4 recovery. The opponent is not drawn.
9. GUARD, exactly 2 frames: both gloves tight at her face, elbows in, knees bent, head ducked. Frame 2 slightly tighter with a small white block spark.
10. HURT, exactly 3 frames: frame 1 head snaps back with a small white impact star, frame 2 stumbles backwards with little stars around her head, frame 3 pulls back into guard, angry face.
```

## 2. Pink-Lotus – Zusatz 4 Bilder (im selben Chat)

```
New list of 4 more items for the same character Pink-Lotus, same rules, same image references. Reply only "ready", then generate exactly one image each time I write "next", with no commentary except number and name.

1. STAGGER (stunned and defenceless), exactly 4 frames: hunched over, knees buckling, arms hanging low, dizzy swirl eyes, stars circling her head, slow sway from left to right across the frames.
2. KO, exactly 6 frames, laid out in one row with wide gaps: frame 1 hit with head back, frame 2 falling backwards, frame 3 airborne, frame 4 landing on her back, frame 5 and 6 lying flat on the ground, headband loosened, stars above her head. Same scale as the standing sheets.
3. VICTORY, exactly 4 frames: raises both fists with a wide grin, a short happy hop, points at the viewer, hands on hips laughing.
4. PORTRAIT, a single image 512 x 512 pixels, flat dark purple background #1E1B24: head and shoulders, fierce confident smile, same pixel-art style. No text.
```

---

## 3. Golden Naga – 10 Bilder (Sheet: muskulöser Kämpfer in Schwarz-Gold)

```
You are a sprite artist for a 2D side-scrolling beat-'em-up boss fight. I attach two images.
IMAGE 1 is the CHARACTER reference: use it only for face, hair, skin tone, body proportions and outfit colours. IGNORE every text, logo, brand name and caption on it.
IMAGE 2 is the STYLE and FORMAT reference: copy its pixel-art rendering, outline thickness, shading, flat dark purple background, one-row layout, frame spacing and large figure size exactly. Do NOT copy the character from image 2.

CHARACTER "Golden Naga": a heavily muscular male Muay Thai master, short dark cropped hair, stern intense expression, dark brown skin, broad shoulders, a thin gold arm-band amulet on each upper arm. Black satin Muay Thai shorts with a gold waistband and ONE simple gold coiled-snake symbol on the left hip, no top, white hand tape with black-and-gold gloves, white ankle wraps, bare feet.
Movement style: slow, heavy and grounded, every step planted, menacing calm.

RULES for every sprite sheet:
- Exactly the number of frames named, in ONE horizontal row, left to right, evenly spaced, clear gaps, frames never touch, nothing crosses a frame boundary.
- Flat solid dark purple background #1E1B24, no gradient, no floor, no shadow, no frame lines, no labels, no numbers, no arrows.
- The fighter fills about two thirds of the image height, the same scale in every sheet, feet on the same baseline in every frame (except lying poses).
- Faces right, three-quarter side view.
- Never draw any text, letters, logos or brand names. Only the one simple snake symbol.

HOW THIS WORKS: Below is a numbered list of 10 sprite sheets. Reply now only with the word "ready". After that, every time I write "next", generate exactly the next sheet of the list as ONE image, with no commentary except its number and name. If I write "redo", generate the same sheet again. Never skip or combine sheets.

1. WALK, exactly 6 frames: slow heavy stalking walk in fight stance, guard hands up, each step planted firmly, clear stepping poses with both legs visible.
2. IDLE, exactly 4 frames: heavy fight stance, guard up, slow deep breathing so the chest rises and falls, grounded and menacing.
3. INTRO, exactly 5 frames: Wai Kru ritual: frame 1 bows with palms together, frame 2 kneels and touches the ground, frame 3 slow powerful ram-muay with arms spread, frame 4 flexes the arm-band arms, frame 5 snaps into fight stance and glares at the viewer.
4. ATTACK ELBOW SMASH, exactly 5 frames: frame 1 and 2 raise the right elbow high over the head in a deep crouch (wind-up), frame 3 slam the elbow diagonally downward with a heavy gold-white impact flash and ground-crack lines, frame 4 and 5 recovery.
5. ATTACK TEEP (push kick), exactly 5 frames: frame 1 and 2 lift the knee (wind-up), frame 3 powerful front push-kick at stomach height with a white impact streak, frame 4 and 5 plant the foot and return to stance.
6. ATTACK LOW KICK, exactly 5 frames: frame 1 and 2 big hip turn and wind-up, frame 3 devastating roundhouse kick at shin height with a gold-white motion arc, frame 4 and 5 recovery.
7. ATTACK FLYING KNEE, exactly 5 frames: frame 1 and 2 crouch and coil (wind-up), frame 3 and 4 launch forward with the knee driven out and a white impact spark, frame 5 lands heavily with a dust puff.
8. COUNTER, exactly 4 frames: frame 1 catches an invisible kick with his forearm, frame 2 pulls it in, frame 3 fires a short hard cross punch with a gold-white flash, frame 4 recovery. The opponent is not drawn.
9. GUARD, exactly 2 frames: both forearms up in a tight cross-block in front of face and chest, elbows in, head lowered. Frame 2 with a small white block spark.
10. HURT, exactly 3 frames: frame 1 head snaps back with a small white impact star, frame 2 stumbles one step back, grimacing, frame 3 straightens up, growling.
```

## 4. Golden Naga – Zusatz 4 Bilder (im selben Chat)

```
New list of 4 more items for the same character Golden Naga, same rules, same image references. Reply only "ready", then generate exactly one image each time I write "next", with no commentary except number and name.

1. STAGGER (stunned and defenceless), exactly 4 frames: hunched over, one knee buckling, arms hanging low, dizzy swirl eyes, stars circling his head, slow sway from left to right across the frames.
2. KO, exactly 6 frames, laid out in one row with wide gaps: frame 1 hit with head back, frame 2 falling backwards, frame 3 airborne, frame 4 landing on his back with a dust puff, frame 5 and 6 lying flat on the ground, arm-bands glinting, stars above his head. Same scale as the standing sheets.
3. VICTORY, exactly 4 frames: flexes both arms, roars, crosses his arms with a smug look, slow nod.
4. PORTRAIT, a single image 512 x 512 pixels, flat dark purple background #1E1B24: head and shoulders, stern glare, same pixel-art style. No text.
```

---

## 5. Jade Viper – 10 Bilder (Sheet: Kämpferin mit grünen Zöpfen)

```
You are a sprite artist for a 2D side-scrolling beat-'em-up boss fight. I attach two images.
IMAGE 1 is the CHARACTER reference: use it only for face, hair, skin tone, body proportions and outfit colours. IGNORE every text, logo, brand name and caption on it.
IMAGE 2 is the STYLE and FORMAT reference: copy its pixel-art rendering, outline thickness, shading, flat dark purple background, one-row layout, frame spacing and large figure size exactly. Do NOT copy the character from image 2.

CHARACTER "Jade Viper": a lean agile female Muay Thai fighter, black hair with thin green-dyed braids tied back in a ponytail, cheeky confident smile, medium brown skin, toned arms. Purple-and-magenta tiger-stripe pattern satin Muay Thai shorts with ONE small green snake symbol on the left hip, matching magenta sports top with the same small symbol, black fight gloves with red wrist tape, magenta ankle wraps, bare feet.
Movement style: smooth, gliding and snake-like, swaying hips, playful.

RULES for every sprite sheet:
- Exactly the number of frames named, in ONE horizontal row, left to right, evenly spaced, clear gaps, frames never touch, nothing crosses a frame boundary.
- Flat solid dark purple background #1E1B24, no gradient, no floor, no shadow, no frame lines, no labels, no numbers, no arrows.
- The fighter fills about two thirds of the image height, the same scale in every sheet, feet on the same baseline in every frame (except lying poses).
- Faces right, three-quarter side view.
- Never draw any text, letters, logos or brand names. Only the one small snake symbol.

HOW THIS WORKS: Below is a numbered list of 10 sprite sheets. Reply now only with the word "ready". After that, every time I write "next", generate exactly the next sheet of the list as ONE image, with no commentary except its number and name. If I write "redo", generate the same sheet again. Never skip or combine sheets.

1. WALK, exactly 6 frames: smooth gliding stalking walk with swaying hips in fight stance, guard hands up, clear stepping poses with both legs visible.
2. IDLE, exactly 4 frames: relaxed bouncy fight stance, lower guard, head weaving side to side playfully, grinning.
3. INTRO, exactly 5 frames: Wai Kru ritual: frame 1 bows with palms together, frame 2 kneels, frame 3 snake-like weaving ram-muay with the arms rippling, frame 4 sticks her tongue out and winks, frame 5 snaps into fight stance.
4. ATTACK CLINCH GRAB, exactly 5 frames: frame 1 and 2 step in fast with both arms reaching forward (wind-up), frame 3 both hands lock behind the neck of an invisible opponent in front of her, frame 4 drive a knee upward with a white impact flash, frame 5 release and step back. Do not draw the opponent.
5. ATTACK TEEP (push kick), exactly 5 frames: frame 1 and 2 lift the knee, frame 3 sharp front push-kick at stomach height with a white streak, frame 4 and 5 recovery.
6. ATTACK LOW KICK, exactly 5 frames: frame 1 and 2 hip turn wind-up, frame 3 whipping roundhouse kick at shin height with a magenta motion arc, frame 4 and 5 recovery.
7. ATTACK FLYING KNEE, exactly 5 frames: frame 1 and 2 crouch, frame 3 and 4 leap with the knee out and a white impact spark, frame 5 lands lightly on her toes.
8. COUNTER, exactly 4 frames: frame 1 leans back out of reach with a smirk, frame 2 catches an invisible kick under her arm, frame 3 sweeps the standing leg with a low sweeping kick, frame 4 recovery with a cheeky grin. The opponent is not drawn.
9. GUARD, exactly 2 frames: gloves tight at her face, elbows in, knees bent, head ducked. Frame 2 with a small white block spark.
10. HURT, exactly 3 frames: frame 1 head snaps back with a small white impact star, frame 2 stumbles back with the braids flying, frame 3 back into guard, annoyed face.
```

## 6. Jade Viper – Zusatz 4 Bilder (im selben Chat)

```
New list of 4 more items for the same character Jade Viper, same rules, same image references. Reply only "ready", then generate exactly one image each time I write "next", with no commentary except number and name.

1. STAGGER (stunned and defenceless), exactly 4 frames: hunched over, knees wobbling, arms hanging low, dizzy swirl eyes, stars circling her head, slow sway from left to right across the frames.
2. KO, exactly 6 frames, laid out in one row with wide gaps: frame 1 hit with head back, frame 2 falling backwards, frame 3 airborne, frame 4 landing on her back, frame 5 and 6 lying flat on the ground, braids spread on the floor, stars above her head. Same scale as the standing sheets.
3. VICTORY, exactly 4 frames: raises both fists and laughs, blows a kiss, one hand on the hip in a pose, cheeky wink.
4. PORTRAIT, a single image 512 x 512 pixels, flat dark purple background #1E1B24: head and shoulders, cheeky confident grin, same pixel-art style. No text.
```

---

## Korrektur-Prompts
- Falsche Frame-Zahl: `redo with exactly N frames in one row, same scale`
- Schrift auf der Kleidung: `redo with absolutely no text or letters, only the simple symbol`
- Fehlermeldung oder Absage: `Try again please: generate the next sheet, same style as the attached image.`
- Dateinamen beim Speichern: `lotusWalk`, `lotusIdle`, `lotusIntro`, `lotusCombo`, `lotusTeep`, `lotusLowkick`, `lotusKnee`, `lotusCounter`, `lotusGuard`, `lotusHurt`, `lotusStagger`, `lotusKO`, `lotusWin`, `lotusPortrait` (genauso mit `naga…`, bei Naga heißt der Signaturangriff `nagaElbow`; `viper…`, bei Viper `viperClinch`).
