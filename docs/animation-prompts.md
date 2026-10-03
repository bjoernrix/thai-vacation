# Thai Vacation – Gemini-Automatik: alle Animations-Prompts

Vorgehen: Pro Figur ein eigener Gemini-Chat. Ganz oben steht der MASTER-PROMPT, darunter der FIGUREN-BLOCK der jeweiligen Figur. Beides in die erste Nachricht einfügen und die Anhänge der Figur hochladen. Gemini arbeitet danach Sheet für Sheet ab und wartet jeweils auf dein "weiter".

Wichtig: Diese Fassung ersetzt den früher im Chat gegebenen Oma-Prompt. Der alte hatte falsche Frame-Zahlen (Hurt 4 statt 3, KO 7 statt 8) und weißen Hintergrund. Weiß ist bei der Massage-Oma (weiße Hose) problematisch, deshalb jetzt einheitlich flaches Violett.

Dateinamen: `<figur><Animation>.png` in camelCase, z. B. omaWalk, omaHurt, omaKO. Ich ordne sie beim Einbau automatisch zu.

---

## 1. MASTER-PROMPT (immer zuerst einfügen)

```
You are an animation artist producing 2D game sprite sheets with Gemini image generation.
Work through the STEPS below strictly one sheet at a time. After each sheet:
1. Check it against the CHECKLIST. If any point fails, regenerate it silently until it passes.
2. Save it as PNG in my Downloads folder with the exact filename given in the step. If you cannot save files yourself, give me the sheet and tell me the exact filename to use.
3. Reply only with: filename, frame count, "checklist ok". Then wait for my message "weiter".
Do not start the next step before I write "weiter".

GLOBAL SPEC – applies to every sheet
Style: high-detail 2D pixel-art game sprite, thick dark outline, saturated colours, matching the attached style reference exactly (same face style, proportions, outline weight, shading).
One animation per image. All frames in ONE horizontal row, left to right, in playback order.
Strict grid: every frame sits in its own square cell of 512 x 512 px. Sheet width = number of frames x 512 px, height = 512 px.
Scale: the character stands exactly 400 px tall (sole to top of head) in a neutral standing pose. Use the SAME scale in every frame and in every animation of this character, as if filmed by one fixed camera. Crouching, leaning or lying frames keep that scale and simply occupy less height. Never zoom in or out between frames.
Baseline: the soles of the feet touch y = 456 in every frame (lying frames: the lowest body point on y = 456). Horizontal anchor: the pelvis / body centre on x = 256 of the cell.
Nothing may cross a cell border. No part of the body, weapon, prop or effect may be drawn outside its own cell or overlap the neighbouring cell.
No detached parts: hands, gloves, weapons, hats and props stay visually connected to the body in every frame. Motion lines, dust and sparks are allowed only if they are inside the same cell and clearly separate from the figure.
Character faces RIGHT in every frame.
Background: one flat solid colour #1E1B24 (dark violet), no gradient, no floor line, no ground shadow, no text, no frame numbers, no grid lines.
Do not redesign the character: same outfit, colours, hair, accessories as the reference in every frame.

CHECKLIST
- Frame count exactly as stated; sheet = frames x 512 px wide, 512 px high.
- Same scale in all frames, feet on y = 456, body centre on x = 256.
- Nothing crosses a cell border; no detached hands, weapons, hats or props.
- Character faces right in all frames.
- Face, proportions, outline weight and colours match the reference.
- Flat #1E1B24 background only, no shadows, lines or text.
- Loops (walk, idle): last frame flows into the first without a jump.
```

---

## 2. FIGUREN-BLÖCKE

Reihenfolge der Anhänge: immer zuerst der Stilanker, danach die Zusatzbilder. Bei unsauberen Ergebnissen reichen Stilanker plus ein Zusatzbild.

### 2.1 Wütende Oma

Anhänge: `omaIdle.jpeg` (Stilanker), `omaAttack.jpeg`, `grandmaWALK.png` (nur Design, nicht der Zeichenstil)

```
CHARACTER: Angry elderly grandmother. Grey hair in a tight bun, round glasses, furious open-mouthed expression. Pale green floral knee-length dress, green bead necklace, black low-heel shoes, large floral handbag held in her right hand. Short, stocky, a little hunched. Fights by swinging the handbag and shaking her fist.

STEP 1 – file omaWalk.png, 8 frames
Looping furious stomping walk to the right. Frame 1 right foot contact, 2 down, 3 passing, 4 up, 5 left foot contact, 6 down, 7 passing, 8 up. Handbag swings slightly, shoulders rock, fist clenched. Same body height in all 8 frames.

STEP 2 – file omaHurt.png, 3 frames
1 head snaps back, eyes squeezed shut, handbag lifts. 2 maximum recoil, body leaning back about 15 degrees, mouth wide open in a shriek, one foot slightly off the ground. 3 recovery, back to a bent-forward angry stance.

STEP 3 – file omaKO.png, 8 frames, played once
1 hit, head back. 2 staggering backwards, arms flailing, handbag flying up but still held by the strap. 3 feet leave the ground. 4 falling backwards, glasses crooked. 5 hitting the ground, bun bouncing. 6 bouncing slightly on the ground. 7 settling, handbag next to her hand. 8 final pose lying on her back, eyes closed, dazed look drawn inside the cell.
```

### 2.2 Massage-Oma

Anhänge: `massageGrandmaIdle.jpeg` (Stilanker), `massageGrandmaAttack.jpeg`, `massageGrandmaWALK.png` (nur Design)

```
CHARACTER: Small elderly Thai massage lady. Wild white hair, gentle but sly smile, a gold earring. Short-sleeved red mandarin-collar shirt with gold trim, loose white trousers with red trim at the hem, barefoot. Fights with quick finger-claw strikes and pressure-point jabs, hands held up and open.

STEP 1 – file massageGrandmaWalk.png, 8 frames
Looping quick light walk to the right with hands raised and open, fingers spread. Frames 1 to 8 are two full steps: contact, down, passing, up for each foot. Small bounce, hair sways.

STEP 2 – file massageGrandmaHurt.png, 3 frames
1 head jerks to the side, eyes wide. 2 maximum recoil, hands thrown up, body bent back about 15 degrees. 3 recovery into the claw-hands stance.

STEP 3 – file massageGrandmaKO.png, 8 frames, played once
1 hit. 2 stumbling backwards, hands up. 3 losing balance, one bare foot in the air. 4 falling, white hair flying. 5 landing on her back. 6 small bounce. 7 settling. 8 final pose lying on her back with arms spread, relaxed, slightly smiling.
```

### 2.3 Fliegenklatschen-Pirat

Anhänge: `pirateIdle.jpeg` (Stilanker), `pirateWindUp.jpeg`, `pirateAttack.jpeg`, `pirateWALK.png` (nur Design)

```
CHARACTER: Muscular tourist-pirate brawler. Black mohawk with long back hair, black eyepatch over the left eye, gold hoop earring, gold chain. Open purple floral shirt showing his chest, black shorts with purple trim, brown sandals. Weapon: a purple plastic fly swatter held in his right hand, always visible and always connected to his hand.

STEP 1 – file pirateWalk.png, 8 frames
Looping heavy confident walk to the right. Swatter held low and swinging slightly, shoulders rolling, chin up. Two full steps over 8 frames.

STEP 2 – file pirateHurt.png, 3 frames (this animation does not exist yet)
1 head snaps sideways, eye clenched. 2 maximum recoil, swatter held out to the side, chest forward, one foot lifted. 3 recovery, back into a menacing crouch.

STEP 3 – file pirateKO.png, 8 frames, played once (this animation does not exist yet)
1 hit. 2 stumbling back, swatter loosening. 3 swatter flies out of the hand but stays inside the cell. 4 falling backwards. 5 landing on his back. 6 small bounce. 7 settling. 8 final pose lying on his back, swatter on the ground next to his open hand, eyepatch crooked.
```

### 2.4 Sonnenbrand-Tourist

Anhänge: `touristIdle.jpeg` (Stilanker), `touristAttack.jpeg`, `drunkKO.png` (NUR Kleidung, ausdrücklich nicht der Stil)

```
CHARACTER: Middle-aged sunburnt tourist, red skin, tired grumpy face. Straw hat, cream-coloured tropical floral shirt with short sleeves, white shorts, brown sandals, wristwatch. Carries a rolled-up paper map that he swings like a club in his right hand; the map is always connected to his hand. Slightly overweight, medium build.
NOTE: The attachment drunkKO.png is photo-real and only shows the clothing. Do NOT copy its style. Everything must be drawn in the style of touristIdle.jpeg.

STEP 1 – file touristWalk.png, 8 frames
Looping sluggish walk to the right, map held low, belly and shoulders bobbing slightly. Two full steps: contact, down, passing, up for each foot.

STEP 2 – file touristHurt.png, 3 frames
1 head jerks back, hat tilting. 2 maximum recoil, body bent back about 15 degrees, map held out, mouth open. 3 recovery, back into the slouched stance, hat straightened.

STEP 3 – file touristKO.png, 8 frames, played once
1 hit, hat popping up. 2 stumbling backwards, arms out. 3 feet leave the ground, hat flying but staying inside the cell. 4 falling backwards. 5 landing on his back. 6 small bounce. 7 settling, map next to his hand. 8 final pose lying on his back, hat on his chest, dazed face.
```

### 2.5 Kokosnuss-Affe

Anhänge: `monkeyIdle.jpeg` (Stilanker), `monkeyWindUp.jpeg`, `monkeyThrow.jpeg`, `monkeyWALK.png` (nur Design)

```
CHARACTER: Cheeky macaque monkey, light grey-brown fur, pink face and hands, long curled tail. Moves upright on two legs like in the idle sheet, arms hanging forward, sometimes holding a brown coconut with both hands.

STEP 1 – file monkeyWalk.png, 8 frames
Looping upright scampering walk to the right, arms swinging, tail swaying behind. Two full steps over 8 frames. The tail stays attached to the body and inside the cell.

STEP 2 – file monkeyHurt.png, 3 frames
1 head jerks back, mouth open. 2 maximum recoil, hands on the head, body bent back about 15 degrees. 3 recovery into a wary crouch. Optional: a small yellow impact star inside the cell, clearly separate from the body.

STEP 3 – file monkeyKO.png, 8 frames, played once
1 hit. 2 tumbling backwards. 3 feet in the air. 4 falling. 5 landing on its back. 6 small bounce. 7 settling. 8 final pose lying on its back, tongue out, tail curled beside it, a coconut rolled next to it.
```

### 2.6 Rix

Anhänge: `rixidle.jpeg` (Stil und Proportion), `rixpunch.jpeg` (Handschuhe, Hose)

```
CHARACTER: Rix, bald muscular heavyweight Muay Thai fighter, tattoos on arms and chest, cigarette in the mouth, purple boxing gloves, black-and-purple Muay Thai shorts, white sneakers. Full-body, same scale as the reference. Follow the attached references for every detail.

STEP 1 – file rixIdle.png, 6 frames
Looping breathing idle in guard stance, gloves up, slight shoulder rise and fall. Higher resolution than the reference; keep proportions and outline identical.

STEP 2 – file rixDrink.png, 6 frames, played once
FULL BODY in every frame (the previous attempt only showed the upper body). 1 reaching behind the back with the right hand, 2 pulling out a green beer bottle, 3 raising it, 4 drinking with head tilted back, 5 lowering it, 6 satisfied burp pose with chest out.

STEP 3 – file rixTeamThrow.png, 6 frames, played once
Rix grabs his unseen partner and throws him to the right. 1 turning toward the right and reaching with both arms, 2 gripping and lifting, 3 swinging back, 4 swinging forward with a twist, 5 release with both arms extended to the right, 6 follow-through. The partner is NOT drawn in this sheet.

STEP 4 – file rixThrown.png, 4 frames, looping while in the air
Rix is thrown by a partner: curled body, arms covering the face, spinning, then feet-first landing pose. Same scale, no props, nothing outside the cell.
```

### 2.7 HGM (HasGirlfriendMan)

Anhänge: `hgmidle.jpeg` (Stil und Proportion), `hgmloco.jpeg` (Walk und Run), `hasGirlFriendMan.png` (Charakter)

```
CHARACTER: HGM, fast lean fighter, blond hair in a bun, blue patterned T-shirt, light grey shorts, dark sneakers. Follow the attached references for every detail. Full-body, same scale as the reference.

STEP 1 – file hgmJump.png, 4 frames, played once
1 crouch, 2 take-off with arms swinging up, 3 apex with knees tucked, 4 descending with legs extending. Same body height as the idle in the reference at the standing pose.

STEP 2 – file hgmFall.png, 3 frames, looping while falling
Arms slightly out, legs stretching downward, hair flowing up.

STEP 3 – file hgmHurt.png, 3 frames
1 head snaps back, 2 maximum recoil with body leaning back about 15 degrees, 3 recovery to guard. Same body height as the reference idle (the previous version was larger).

STEP 4 – file hgmTeamThrow.png, 6 frames, played once
Same sequence as Rix's team throw but lighter and faster: HGM grabs his unseen partner and throws him to the right. The partner is NOT drawn.

STEP 5 – file hgmThrown.png, 4 frames, looping while in the air
Curled body, arms covering the face, spinning, then feet-first landing pose.
```

---

## 3. Empfohlene Reihenfolge

1. Erst bei JEDER Figur nur Step 1 (Walk bzw. Idle/Jump) als Testsheet. Passen Stil und Raster, folgen die übrigen Steps. So fällt ein Fehler im Prompt nach einer Figur auf und nicht nach fünfzehn Sheets.
2. Priorität: Pirat (fehlende Hurt/KO), Tourist (Stilbruch), dann Oma, Massage-Oma, Affe, zuletzt die Helden.
3. Lade die fertigen PNGs hier hoch. Ich schneide, normalisiere die Größen, baue den Atlas neu, teste und liefere den Build.
