# Thai Vacation – Phase 4 (Beta): Balancing, Content, Level-Editor

Stand: Phase 3 freigegeben (Alpha), Phase 4 Teil 1 umgesetzt. Datei: `thai-vacation-beta.html`.

## Level-Editor (Stufe 1)
- Titelbild → **F2**. Datei `code/f_editor.js`, bearbeitet das `STAGES`-Objekt (`c_data.js`).
- Werkzeuge: Auswahl/Ziehen, +Plattform (7 Typen), +Flasche, +Welle; Gegnerlisten per Chips, Raster 1/10/20/50, Mausrad/A/D scrollen, Entf, Duplizieren.
- Wellen-Auswertung pro Welle: Gegneranzahl, Gesamt-HP (mit Diff-Skalierung), Druck (Summe Schaden/Angriffspause).
- ▶ Testen (P): startet die Stage, bei gewählter Welle ab dieser; Esc = zurück in den Editor.
- Export (Kopieren + JSON-Datei), Import (JSON einfügen), Zurücksetzen. Änderungen werden automatisch im Browser gespeichert (localStorage `thaiVacationLevelsV1`) und gelten auch im normalen Spiel (Titelbild zeigt „eigene Level aktiv“).
- Stufe 2 (Undo/Redo, Kamera-Vorschau etc.) bei Bedarf später.

## Balancing
- **Duo:** Gegner- und Boss-HP ×1,3 (`mkEnemy`).
- Oma HP 52, Massage-Oma 64, Affe 28, **Pirat** HP 132 / Schaden 14 / Guard .35 / Wind .62, **Türsteher** HP 215 / Schaden 15 / Wind .72.
- Ruhepunkte: zusätzliche Bier-Flaschen nach Welle 3 (1-1 bis 1-3: x≈1560–1580, 1-4: x 1560 + 2060). Boss-Arena: zweite Flasche (x 650) in Solo/Duo.
- **Boss Saenchai:** 3 Phasen bestehen schon (66 % / 33 %). Phasen-Tempo +22 % statt +30 %, Mindest-Telegraph .27 s (außer Konter), Low Kick Wind .36.
- **Fix:** Kokosnuss-Affen konnten aus dem Bild fliehen und waren dann unerreichbar → bleiben jetzt im Bild (Stage 1-3).

## Grafik
- Rix' Drink-Frames: Heineken-Label per Inpainting entfernt (`pipeline_unlabel.py`, Original `rixDrink_orig.jpeg`).
- **Offen:** Rix' Shorts zeigen „Fairtex“, die Schuhe ein Nike-Logo (beide auf dem Gemini-Sheet) → vor Release klären/entfernen.

## QA (Bot `code/qabot.py`, 4 Läufe je Modus/Level, simpler Bot ohne Dodge)
Siege/Läufe: Rix solo 1-1 4/4, 1-2 4/4, 1-3 4/4, 1-4 3/4, Boss 0/4 (Boss-HP-Rest 270–440 von 720);
HGM solo 4/4, 3/4, 3/4, 3/4, Boss 0/4; Duo 4/4 auf allen Stages, Boss 4/4.
Stage-Dauer ca. 65–155 s. Der Bot blockt kaum und weicht nie aus, ein Mensch sollte deutlich besser abschneiden. Boss solo bleibt der härteste Punkt – Feintuning nach Spieltest.

---
# Phase 4 – Teil 2 (Audio, Juice, Logos)

## Audio (`a_core.js`)
- Neue SFX: Schlag je Technik (`SFX.hit(k)`: Faust/Schienbein/Knie/Ellbogen), Schritte, Sprung, Landung, Gegner-Grunzer je Typ (`SFX.grunt`), Gong (Wellenstart / Boss-Phasenwechsel), Fanfare (`clear`), Game-Over-Sting.
- Musik: `music.intens` (0,5 = Laufphase ruhig: nur Kick auf 1/3, dünne Hats, dünnere Melodie; 1 = Kampf: volle Band) und `music.phase` (Boss-Phase: +4 % Tempo je Phase, extra Hats/Snare-Ghosts). Pad-Akkord je Takt, Melodie-Variation im 2. Durchlauf. Weiterhin Synth-Platzhalter, keine echten Samples.

## Juice (`d_logic.js`, `e_render.js`)
- Staub bei Landung/Sprung/Laufen (`dust`), Screen-Flash (Boss-KO weiß, Boss-Phasenwechsel orange), Hitstop+Shake beim letzten Gegner einer Welle, Boss-KO mit langem Hitstop, rote Low-HP-Vignette (<25 % HP).

## Logos (`code/pipeline_nologos.py`, läuft NACH `heroes3.py` auf `heroes.png` + `rix.png`)
- Fairtex-Schriftzug auf Shorts und Nike-Swoosh auf Schuhen aus allen Rix-Frames entfernt.
- **Rest:** In wenigen Walk-Frames steht noch winziger Schriftzug auf dem Handschuh. HGMs Shorts tragen ebenfalls kleinen Text (nicht geprüft/entfernt).
- Reihenfolge der Pipeline bei Neubau: `genframes.py` → `heroes3.py` → `nologos.py` → `build.py`. Und wenn die Gemini-Sheets neu geladen werden: Drink-Sheet erneut mit `pipeline_unlabel.py` bereinigen.
