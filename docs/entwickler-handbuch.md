# Thai Vacation – Entwickler-Handbuch

Oct 2, 2026 · @tic4l

## Überblick

Thai Vacation ist eine einzige HTML-Datei, die ein Build-Skript aus fünf JavaScript-Quelldateien und den Bildern zusammensetzt. Das Spiel läuft auf einem Canvas mit 960 x 540 Pixeln (`W`, `H`), mit festem Zeitschritt von 1/60 Sekunde.

| Datei | Inhalt |
| --- | --- |
| `a_core.js` | Konstanten (`W`, `H`, `GRAV`, `GROUND`, `WORLD`), Eingabe (`KEYMAP`, `readInput`), Spielstand (`SAVE`), Audio (`SFX`, `TRACKS`, `playMusic`) |
| `b_art.js` | Bild-Laden (`IMG`, `loadAssets`), Pixel-Helfer, prozedurale Gegner-Sprites (`SPR`), Plattform-Props (`propCanvas`), Weltaufbau (`buildWorld`, `buildArena`) |
| `c_data.js` | Spielinhalte als Daten: `CH` (Helden), `ATK` (Angriffe), `ET` (Gegner), `STAGES` (Level) |
| `d_logic.js` | Spielzustand, Physik, Kampf, Gegner-KI, Boss, Stage-Ablauf, `step` |
| `e_render.js` | Zeichnen aller Objekte, Animationsfunktionen, HUD, Titelbild, Hauptschleife |
| `build.py` | Setzt aus den Dateien und den Bildern die fertige HTML-Datei zusammen |

Die Dateien teilen sich einen gemeinsamen Namensraum und werden in der Reihenfolge a, b, c, d, e hintereinander eingefügt. Spätere Dateien dürfen Dinge aus früheren benutzen, nicht umgekehrt.

Der Spielablauf wird über die Variable `scene` gesteuert. Mögliche Werte sind `title`, `stage`, `boss`, `clear` und `over`. Die Funktion `step(dt)` verarbeitet jede Szene, `render()` zeichnet sie.

## Build und Test

Ein Aufruf von `python3 build.py` erzeugt die spielbare Datei `thai-vacation-alpha.html` und eine Hilfsdatei `game_check.js` zur Syntaxprüfung. Alle Bilder werden dabei als Base64 in die HTML-Datei eingebettet, das Spiel braucht deshalb keine weiteren Dateien.

1. **Bilder ablegen:** Alle Spielbilder liegen im Ordner `assets/`. Aktuell sind das `bgA.jpg`, `bgB.jpg`, `bgC.jpg`, `bgD.jpg` (Hintergründe), `rix.png`, `hgm.png` (Porträts), `saenchai.png` samt `saenchai.json` (Boss-Atlas), `anim.png` samt `anim.json` (Gegner-Frames) und `heroes.png` samt `heroes.json` (Frames von Rix und HGM).
2. **Bauen:** `build.py` liest diese Dateien, fügt `a_core.js` bis `e_render.js` zusammen und schreibt die HTML-Datei. Die Schlüssel im Block `src` von `build.py` werden im Spiel zu `IMG['bgA']`, `IMG['heroes']` und so weiter.
3. **Prüfen:** `node --check game_check.js` findet Syntaxfehler, ohne das Spiel zu starten.
4. **Spielen oder testen:** Die HTML-Datei öffnet sich im Browser. Für automatische Tests nutzen wir Playwright (Chromium). Nach `page.goto(...)` wartet der Test auf `__game.loaded`, danach lassen sich alle Spiel-Variablen per `page.evaluate` lesen und setzen, zum Beispiel `players`, `enemies`, `waveIdx`, `paused`.

Tasten im Titelbild und im Spiel:

| Taste | Wirkung |
| --- | --- |
| `1` / `2` | Solo (nur Rix) oder Koop wählen |
| `S` | Stage auswählen |
| `B` | Direkt zum Bosskämpf |
| `Enter` | Starten |
| `N` | Musik an oder aus |
| `Esc` / `P` | Pause und Menü |
| `1` im Spiel | Hitboxen anzeigen (Debug) |
| `O` im Spiel | Friendly Fire an oder aus |

Steuerung: Spieler 1 nutzt `A` `D` `W` `S` und `F` `G` `H` `T`, Spieler 2 die Pfeiltasten und `,` `.` `/` `;`. Auch ein Gamepad wird erkannt (`readInput`).

## Datenstrukturen

Alle Spielinhalte stehen in `c_data.js` als Daten. Wer eine Zahl ändert oder einen Eintrag hinzufügt, braucht die Spiellogik nicht anzufassen.

### CH – Helden (Liste, Index 0 = Rix, 1 = HGM)

| Feld | Bedeutung |
| --- | --- |
| `name` | Anzeigename im Spiel und HUD |
| `img` | Schlüssel des Porträtbilds in `IMG` (`rix`, `hgm`) |
| `anim` | Name des Frame-Sets in `ANIM` (`rix`, `hgm`) |
| `sc` | Skalierung des Porträtbilds, Fallback ohne Frames |
| `col`, `skin`, `glove`, `shoe` | Farben für HUD und Effekte |
| `speed` | Lauftempo in Pixel pro Sekunde |
| `jump` | Absprungkraft (Start-Geschwindigkeit nach oben) |
| `hp` | Lebenspunkte |
| `dmg` | Schadensfaktor, wird mit dem Angriffsschaden multipliziert |
| `atk` | Angriffstempo. Höher = schneller, die Zeiten aus `ATK` werden dadurch geteilt |
| `w`, `h` | Größe der Körper-Hitbox in Pixel |
| `lunge` | Faktor für den Vorwärtsschub bei Angriffen |

### ATK – Angriffe (Index 0 = Faust, 1 = Schienbein, 2 = Knie, 3 = Ellbogen)

Der Index entspricht der Taste (`a0` bis `a3`) und dem Animationsnamen (`punch`, `shin`, `knee`, `elbow`).

| Feld | Bedeutung |
| --- | --- |
| `st` | Dauer des Anlaufs in Sekunden (vor dem Treffer) |
| `ac` | Dauer der Trefferphase in Sekunden |
| `rc` | Dauer der Erholung in Sekunden |
| `dmg` | Schaden |
| `reach` | Reichweite der Hitbox in Pixel |
| `hh` | Höhe der Hitbox |
| `oy` | Höhe der Hitbox-Mitte relativ zum Boden (negativ = darüber) |
| `kb` | Rückstoss |
| `stun` | Betäubungszeit des Gegners |
| `hs` | Hitstop, kurzes Einfrieren beim Treffer, in Sekunden |
| `sh` | Stärke des Screenshakes |
| `lunge` | Vorwärtsschub des Angreifers |
| `airBonus` | Zusatzfaktor in der Luft (nur Knie) |
| `guardBreak` | `true` durchbricht den Guard des Gegners (Ellbogen) |

### ET – Gegner (Objekt, Schlüssel = Typname)

| Feld | Bedeutung |
| --- | --- |
| `name` | Anzeigename |
| `anim` | Frame-Set in `ANIM`. Hat Vorrang vor `spr` |
| `spr` | Prozedurales Platzhalter-Sprite in `SPR`, wenn es keine Frames gibt |
| `w`, `h` | Hitbox in Pixel |
| `hp` | Lebenspunkte |
| `spd` | Lauftempo |
| `dmg` | Schaden an Spielern |
| `kb` | Rückstoss, den der Gegner auslöst |
| `guard` | Wahrscheinlichkeit von 0 bis 1, einen Treffer zu blocken |
| `range` | Reichweite des Angriffs |
| `cool` | Abklingzeit zwischen Angriffen in Sekunden |
| `wind` | Dauer der Vorbereitung (Ausrufezeichen "!") |
| `spawn`, `hurt` | Listen mit Sprüchen beim Auftauchen und beim Treffer |
| `sway` | `true`: schwankt beim Laufen (Besoffener) |
| `charge` | `true`: stürmt aus der Distanz an (Rowdy) |
| `ranged` | `true`: hält Abstand und wirft Kokosnüsse (Affe) |

Im Spiel wird die Stärke jedes Gegners mit der Schwierigkeit der Stage (`diff`) skaliert: Lebenspunkte mal `1 + 0.14 * diff`, Schaden mal `1 + 0.09 * diff` (siehe `mkEnemy`).

Der Boss steht ebenfalls in `ET` (Schlüssel `boss`), seine Angriffe in `MOVES` in `d_logic.js` (`teep`, `low`, `knee`, `counter`) mit Feldern `wind`, `dmg`, `kb`, `stun`, `reach`, `y0`, `hh`, `label`.

### STAGES – Level (Liste)

| Feld | Bedeutung |
| --- | --- |
| `id`, `name` | Anzeige, zum Beispiel `1-1` und `STRANDSTRASSE` |
| `tiles` | Zwei Hintergrundbilder `[[Schlüssel, gespiegelt], [Schlüssel, gespiegelt]]`. Sie werden zur Welt verbunden (Breite = `WORLD`) |
| `ground` | Y-Koordinate der Bodenlinie, auf der die Figuren stehen |
| `grade` | Farbstimmung: `null`, `night` oder `dusk` |
| `music` | Musikstück aus `TRACKS`: `day`, `night`, `coast`, `bars`, `boss` |
| `diff` | Schwierigkeitsstufe (0 bis 3) für die Gegner-Skalierung |
| `waves` | Liste von `{cx, list}`. Bei Kamera-Position `cx` wird der Bildschirm gesperrt und die Gegner aus `list` erscheinen von beiden Seiten |
| `plats` | Plattformen als `[Typ, x, Breite, Höhe]`. Typen: `crate`, `moped`, `stall`, `balcony`, `rock`, `bench`, `branch` |
| `items` | Bier-Flaschen als `[x, Höhe über dem Boden]` |

Im Solo-Modus entfällt aus Wellen mit vier oder mehr Gegnern der letzte Eintrag.

## Animationssystem und Assets

Figuren werden aus Frame-Animationen gezeichnet. Alle Frames liegen in großen Atlas-PNGs, die Positionen stehen in JSON-Dateien. `build.py` bäckt beides als Base64 in die HTML-Datei.

### Atlanten

| Atlas | Inhalt | JSON |
| --- | --- | --- |
| `anim.png` | alle Gegner (Standard-Atlas, `img` fehlt in `ANIM`) | `anim.json` |
| `heroes.png` | Rix und HGM (`img:'heroes'`) | `heroes.json` |
| `saenchai.png` | Boss Saenchai | `saenchai.json` |

`build.py` lädt `anim.json` und ergänzt es mit `heroes.json`. Das Ergebnis ist die globale Variable `ANIM`.

### Format eines Eintrags in ANIM

```
ANIM['rix'] = {
  k: 1.0,            // Skalierung beim Zeichnen
  nf: 1,             // Blickrichtung im Original: 1 = rechts, -1 = links
  img: 'heroes',     // Atlas, Standard 'anim'
  a: {               // Animationen: Name -> Liste von Frames
    walk: [[x,y,w,h,ax], [x,y,w,h,ax], ...],
    punch: [...]
  },
  p: { punch: 2 }    // Treffer-Frame (Peak) pro Angriff
}
```

Ein Frame ist `[x, y, w, h, ax]`: Rechteck im Atlas und optional `ax`, der horizontale Ankerpunkt (Standard: Mitte). Alle Frames werden unten bündig gezeichnet, damit die Füße auf der Bodenlinie stehen.

### Animationsnamen

| Set | Verwendete Animationen |
| --- | --- |
| Helden | `walk`, `run`, `hurt`, `idle`, `jump`, `guard`, `punch`, `shin`, `knee`, `elbow`, `ko`, `getup`. Nur HGM zusätzlich `fall` und `drink` |
| Gegner | derzeit nur `walk`, `hurt`, `ko`. `idle` und `attack` sind noch nicht eingebunden |

### Funktionen

| Funktion | Datei | Aufgabe |
| --- | --- | --- |
| `loadAssets()` | `b_art.js` | lädt alle Bilder, setzt `__game.loaded` |
| `AF(set, anim, i)` | `e_render.js` | liefert Frame `i` (zyklisch) als Objekt mit `im, sx, sy, sw, sh, w, h, ax, nf, n, key` |
| `drawFr(fr, x, y, flash)` | `e_render.js` | zeichnet den Frame bodenbündig am Anker. `flash` zeichnet die weiße Treffer-Silhouette |
| `whiteOf(img)` | `b_art.js` | erzeugt die weiße Silhouette für den Treffer-Blitz |
| `heroFrame(p)` | `e_render.js` | wählt aus dem Zustand des Spielers die passende Animation und den Frame |
| `drawHero`, `drawEnemy`, `drawBoss` | `e_render.js` | zeichnen die jeweilige Figur, spiegeln nach Blickrichtung (`face * fr.nf`) |

### Zuordnung Zustand zu Animation (Helden)

| Zustand | Animation |
| --- | --- |
| am Boden, tot | `ko`, bei Aufstehen (Betäubung unter 0,38 s) `getup` |
| geworfen | `fall` bzw. `jump` |
| getroffen | `hurt` |
| Angriff | `punch`, `shin`, `knee`, `elbow` gemäß `ATKN`. Der Frame folgt dem Fortschritt des Angriffs und springt zum Peak-Frame aus `p` beim Treffer |
| Trinken | `drink` |
| in der Luft | `jump` (aufwärts), `fall` (abwärts) |
| Guard | `guard` |
| Bewegung | `run` ab 205 px/s, sonst `walk` |
| sonst | `idle` |

Fehlt eine Animation, fällt das Spiel auf die Walk-Frames bzw. das alte prozedurale Sprite zurück. So bleibt es auch mit Lücken im Atlas spielbar.

### Atlas-Pipeline

Die Roh-Bilder (Spritesheets aus der Bildgenerierung) werden mit den Skripten im Ordner `imp/` verarbeitet: Hintergrund freistellen (Flood-Fill auf Dunkel oder Weiß), Streifen in Einzelframes teilen (nach erwarteter Frame-Zahl), Skalierung pro Sheet auf die Guard-Frame-Höhe normalisieren (Rix 118 von 128 px, HGM 114 von 124 px), Ankerpunkt als Median der Pixel-X im Bereich 40 bis 70 Prozent der Höhe setzen und alles in `heroes.png`/`anim.png` packen. Die geplante Vereinheitlichung (ein Ordner pro Figur, Dateien wie `rix_punch.png`) steht in der Aufgabenliste am Ende.

## Wichtige Funktionen und Variablen

### Globale Variablen

| Name | Bedeutung |
| --- | --- |
| `W`, `H` | Bildgröße 960 mal 540 |
| `GRAV` | Schwerkraft |
| `GROUND`, `WORLD` | Bodenlinie und Weltbreite der aktuellen Stage |
| `scene` | `title`, `stage`, `boss`, `clear` oder `over` |
| `cam` | Kamera-Position in der Welt |
| `numPlayers` | 1 (Solo, nur Rix) oder 2 (Koop) |
| `keys`, `press` | gedrückte Tasten und Tasten-Impulse dieses Frames |
| `KEYMAP` | Tastenbelegung pro Spieler |
| `SAVE` | Spielstand (Freischaltungen, Bestzeiten), gespeichert mit `saveGame()` |
| `IMG` | alle geladenen Bilder nach Schlüssel |
| `ANIM` | Frame-Daten aller Animations-Sets |
| `SPR` | prozedurale Platzhalter-Sprites |
| `THROW_D` | Wurfweite des Team-Würfe |

### Hilfsfunktionen (`a_core.js`)

| Funktion | Aufgabe |
| --- | --- |
| `rand(a,b)`, `clamp(v,lo,hi)`, `sgn(v)`, `pick(list)` | Zufall, Begrenzen, Vorzeichen, Zufallselement |
| `overlap(a,b)`, `prect(p)` | Rechteck-Überschneidung und Hitbox eines Spielers |
| `readInput(i)` | liefert Eingaben von Spieler `i` (Tasten und Pfeile) |

### Audio (`a_core.js`)

| Funktion | Aufgabe |
| --- | --- |
| `initAudio()` | startet WebAudio nach der ersten Eingabe |
| `noiseAt`, `toneAt`, `tone`, `rumble` | Bausteine zum Synthetisieren von Geräuschen |
| `SFX.whoosh/thump/block/ding/glug/burp/fart/coconut/throwme/ohwee` | fertige Effekte. `SFX.ohwee()` ist der Treffer-Ruf |
| `TRACKS` | Musikstücke `day`, `night`, `coast`, `bars`, `boss` |
| `playMusic(name)`, `stopMusic()`, `toggleMusic()` | Musiksteuerung |

### Grafik und Welt (`b_art.js`)

| Funktion | Aufgabe |
| --- | --- |
| `buildSprites()`, `mkSprite(...)` | bauen die prozeduralen Pixel-Sprites |
| `propCanvas(typ,w,h)` | zeichnet Plattform-Requisiten (`crate`, `moped`, `stall`, `balcony`, `rock`, `bench`, `branch`) |
| `buildWorld(stage)` | setzt die Welt aus den zwei Hintergründen zusammen, `SEAM = 110` Pixel Überblendung |
| `buildArena()` | baut die Boss-Arena |
| `gradeWorld`, `lanternSpots`, `glowAt` | Farbstimmung `night`/`dusk`, Laternen, Leuchten |

### Spiellogik (`d_logic.js`)

| Funktion | Aufgabe |
| --- | --- |
| `step(dt)` | ein Logik-Schritt (feste 1/60 s), ruft alles Folgende auf |
| `startStage(i)`, `startBoss()`, `resetCommon()` | Stage bzw. Bosskampf initialisieren |
| `finishStage()`, `clearPress()` | Stage beenden, Tasten-Impulse löschen |
| `stageLogic()` | löst Wellen aus, sperrt die Kamera bei `Math.min(cx, WORLD-W)` |
| `mkPlayer(i)`, `mkEnemy(type,x,diff)` | erzeugen Spieler bzw. Gegner mit skalierten Werten |
| `physics(o)` | Schwerkraft, Boden, Plattformen, Weltgrenzen |
| `nearestPlayer(e)` | nächster lebender Spieler zu einem Gegner |
| `updatePlayer(p)` | Eingaben, Bewegung, Angriffe, Guard, Springen |
| `startAttack(p,i)`, `hitbox(p)`, `resolveHits()` | Angriff starten, Trefferzone berechnen, Treffer auswerten |
| `spamming(p)` | erkennt Tastenhacken und verlängert dann die Erholung |
| `hurtPlayer(p,dmg,kb,stun)`, `hurtEnemy(e,...)`, `killEnemy(e)` | Schaden und Tod |
| `drink(p)` | Bier trinken (Heilung, `p.drinkT = .9`), `throwPartner(p)` Team-Wurf |
| `updateEnemy(e)` | Gegner-KI mit Zuständen `chase`, `wind`, `atk`, `rec`, `hurt`, `down`, `dead` |
| `enemyStrike(e)`, `throwCoconut(e)` | Angriff des Gegners bzw. Kokosnuss-Wurf |
| `updateBoss()`, `bossMove(name)` | Boss-KI und Angriffsmuster aus `MOVES` |
| `updateProjs()` | Projektile (Kokosnüsse, Boss-Wellen) |
| `addText(x,y,text)`, `spark(x,y)`, `impact(x,y,...)` | Textblasen, Funken, Treffer-Effekte inklusive Hitstop und Shake |

### Spieler-Objekt (`mkPlayer`)

| Feld | Bedeutung |
| --- | --- |
| `x`, `y`, `vx`, `vy` | Position (`y` = Füße) und Geschwindigkeit |
| `face` | Blickrichtung, 1 oder -1 |
| `hp`, `maxhp` | Lebenspunkte |
| `stun` | Betäubungszeit. Größer 0 = handlungsunfähig |
| `state` | `idle`, `walk`, `atk`, `guard`, `hurt`, `down`, `dead`, `thrown` |
| `drinkT` | Restzeit des Trink-Zustands |
| `koS` | Timer der KO-Animation |

### Rendering (`e_render.js`)

| Funktion | Aufgabe |
| --- | --- |
| `render()` | zeichnet pro Frame alles in fester Reihenfolge |
| `loop(t)` | `requestAnimationFrame`-Schleife mit festem Zeitschritt |
| `drawHUD`, `bar`, `portrait` | Lebensbalken, Porträts, Anzeigen |
| `drawTitle`, `drawOverlay`, `fmtT` | Titelbild, Pause- und Ergebnis-Einblendungen, Zeitformat |
| `drawPlatforms2`, `drawProjs`, `drawArenaRopes` | Plattformen, Projektile, Seile der Arena |
| `drawDebug` | Hitbox-Anzeige (Taste 1 im Spiel) |
| `txt`, `shadow`, `drawBottle`, `atkExt` | kleine Hilfen für Text, Schatten, Flasche, Angriffslänge |

Hinweis: Die Feldnamen des Spieler-Objekts oben sind die zentralen. Weitere interne Felder (Timer, Combo-Zähler) sind im Code von `mkPlayer` in `d_logic.js` direkt vor der Verwendung dokumentiert.

## Anleitungen: Neues einpflegen

Nach jeder Änderung: `python3 build.py`, danach `node --check game_check.js` und ein kurzer Playwright-Lauf (siehe Build und Test).

### Neuen Gegner hinzufügen

1. Frames als Streifen erzeugen (`walk`, `hurt`, `ko`, optional `idle`, `attack`) und mit den Skripten in `imp/` in `anim.png` und `anim.json` packen. Der Set-Name ist der Typname, zum Beispiel `kellner`.
2. In `c_data.js` einen Eintrag `ET.kellner = { name, anim:'kellner', w, h, hp, spd, dmg, kb, guard, range, cool, wind, spawn:[...], hurt:[...] }` anlegen. Ohne Frames zunächst `spr:` mit einem vorhandenen Platzhalter nutzen.
3. In einer Welle verwenden: in `STAGES[i].waves` den Typnamen in `list` eintragen.
4. Besonderes Verhalten braucht ein Flag (`sway`, `charge`, `ranged`). Ein völlig neues Verhalten wird in `updateEnemy` (`d_logic.js`) als weiterer Zweig ab dem Zustand `chase` ergänzt.

### Neue Stage hinzufügen

1. Zwei Hintergrundbilder im Format 1920 mal 540 liefern und in `assets/` ablegen. `build.py` um die beiden Dateien erweitern (Muster `bgA.jpg`).
2. Neuen Eintrag am Ende von `STAGES` anhängen: `id`, `name`, `tiles:[['bgE',0],['bgF',1]]`, `ground`, `grade`, `music`, `diff`.
3. `waves` festlegen: `cx` aufsteigend, jede Welle mit `list`. Die letzte Welle sollte vor `WORLD - W` liegen.
4. `plats` und `items` ergänzen. Plattform-Typen stehen in `propCanvas`.
5. Die Stage-Reihenfolge ergibt sich aus der Liste. Boss-Stage ist immer die letzte, sie wird über `startBoss()` gestartet.

### Neuen Hintergrund einsetzen

Datei in `assets/` ersetzen (gleicher Name, 1920 mal 540, JPG) und `build.py` ausführen. Die Überblendung in der Mitte (`SEAM = 110` Pixel) ist automatisch. Bei neuer Bodenlinie `ground` der Stage anpassen: sie ist die Y-Koordinate, auf der die Füße stehen.

### Neue Animation für eine vorhandene Figur

1. Streifen einheitlich freistellen und in den Atlas packen (Pipeline wie oben).
2. In `ANIM[set].a` eine neue Liste anlegen, bei Angriffen den Peak-Frame in `p` setzen.
3. In `heroFrame` (Helden) bzw. `drawEnemy` (Gegner) eine Bedingung ergänzen, die die Animation auswählt, zum Beispiel `if (st==='drink') return AF(set,'drink',...)`.

### Neue Spielfigur

1. Frames mit allen Helden-Animationen liefern und in `heroes.png` packen. Porträtbild als `hgm.png`-ähnliche Datei in `assets/` ablegen.
2. Neuen Eintrag in `CH` mit Werten für `speed`, `jump`, `hp`, `dmg`, `atk`, `w`, `h`, `lunge` und `anim:'name'`.
3. Tastenbelegung für einen dritten Spieler wäre eine Erweiterung von `KEYMAP` und `numPlayers`. Das ist derzeit nicht vorgesehen.

### Neuer Sound

In `SFX` eine neue Funktion nach dem Muster der vorhandenen anlegen (`noiseAt`, `toneAt`, `tone`) und an der gewünschten Stelle in `d_logic.js` aufrufen, zum Beispiel `SFX.ding()` im Treffer-Code. Eigene Audiodateien wären eine Erweiterung von `build.py` (Base64 einbetten, mit `Audio` oder `AudioBuffer` abspielen). Neue Musik: Eintrag in `TRACKS` und in einer Stage als `music` verwenden.

### Neuer Angriff oder neue Boss-Attacke

Angriff: Eintrag in `ATK` anhängen, Taste in `KEYMAP` und `ATKN` ergänzen, Animation und Peak-Frame anlegen. Boss: Eintrag in `MOVES` mit `wind`, `dmg`, `kb`, `stun`, `reach`, `y0`, `hh`, `label` und im Auswahlcode von `updateBoss` aufnehmen.

## Grafik-Spezifikation und Namensschema

### Anforderungen an Sprite-Sheets

| Punkt | Vorgabe |
| --- | --- |
| Anordnung | ein Streifen pro Animation, Frames nebeneinander, gleiche Größe, Blickrichtung einheitlich (bevorzugt nach rechts) |
| Hintergrund | einfarbig und klar abgesetzt (dunkles Violett oder Weiß), ohne Verlauf und ohne Schlagschatten, damit das Freistellen sauber klappt |
| Frame-Zahl | im Prompt festlegen, weil die Teilung nach erwarteter Anzahl erfolgt: walk 6, run 6, idle 4, hurt 2, ko 4 bis 6, getup 4, Angriffe 4 bis 5, guard 1 bis 2, jump 3, fall 2 |
| Abstand | Frames dürfen sich nicht berühren. Keine Beschriftungen, keine Pfeile, keine Hilfslinien |
| Größe | Figur mindestens etwa 150 Pixel hoch im Rohbild, Rix idle mit etwa 100 Pixel ist die Untergrenze |
| Maßstab | in allen Sheets derselben Figur gleich groß gezeichnet. Der Rest wird über die Guard-Frame-Höhe nachnormalisiert |
| Füße | stehen in allen Frames auf derselben Grundlinie |

### Hintergründe

JPG, 1920 mal 540 pro Kachel (zwei Kacheln pro Stage), Bodenlinie ungefähr bei 420 bis 470 Pixel von oben. Die rechte und linke Kante sollen sich zu den Überblendungs-Pixeln (`SEAM`) hin ruhig verhalten. Bewegte Dinge (Passanten, Autos) bleiben aus dem Bild, sie kommen als Effekt.

### Namensschema

| Art | Schema | Beispiel |
| --- | --- | --- |
| Hintergrund | `bg` plus Buchstabe | `bgA.jpg` |
| Porträt | Figurname | `rix.png`, `hgm.png` |
| Atlas | Gruppe | `anim.png`, `heroes.png`, `saenchai.png` |
| Frame-Set (geplant) | `<figur>_<animation>.png` | `rix_punch.png`, `drunk_walk.png` |
| Animationsnamen | englisch, klein | `walk`, `run`, `idle`, `hurt`, `ko`, `getup`, `guard`, `jump`, `fall`, `punch`, `shin`, `knee`, `elbow`, `drink` |
| Gegner-Typen | englisch oder Spielname, klein | `oma`, `masseuse`, `pirat`, `tourist`, `drunk`, `rowdy`, `dog`, `bouncer`, `monkey`, `boss` |

### Noch fehlende Grafiken (Stand Alpha)

Rix und HGM: Team-Wurf (Werfen und Geworfen werden), HGM-Sprung und -Fall mit mehr Frames, HGM-Hurt in passender Größe, Rix-Trinken als Ganzkörper. Gegner: Idle und Attack für alle, eigene Frames für `drunk`, `rowdy`, `dog`, `bouncer`. Dazu Plattform-Requisiten, Effekte, HUD und Titelbild, sowie Hintergründe für die weiteren Level (Kickbox-Studio).

## Bekannte Einschränkungen und Phase-4-Aufgaben

### Bekannte Einschränkungen (Alpha)

| Bereich | Stand |
| --- | --- |
| Helden-Frames | Rix-Idle niedrig aufgelöst, HGM-Sprung und -Fall mit wenigen Frames, HGM-Hurt weicht in der Größe ab |
| Team-Wurf | keine eigenen Frames, es wird `fall`/`jump` verwendet |
| Gegner | nur `walk`, `hurt`, `ko`. `drunk` nutzt das Tourist-Set. `rowdy`, `dog`, `bouncer` noch prozedural |
| Requisiten, Effekte, HUD, Audio | Platzhalter (prozedural bzw. WebAudio-Synth) |
| Quellcode | liegt nur im Arbeitsbereich der Session, noch nicht im Projekt gesichert |
| Saenchai | Bild- und Namensrechte vor einem Release klären |

### Aufgaben für Phase 4 (nach Freigabe)

1. Alle neu erstellten Bilder sortieren, schneiden, einbinden und gemeinsam testen.
2. Pipeline vereinheitlichen: ein Ordner pro Figur, Dateien `<figur>_<animation>.png`, eine Konfigurationsdatei für Gegner, Stages und Angriffe statt Daten im Code.
3. Gegner-KI und Balancing: Wellengrößen, Lebenspunkte, Schaden, Boss-Muster.
4. Game Feel und Juice: Hitstop, Shake, Effekte, Treffer-Feedback, „Ohwee“-Timing.
5. Audio: eigene Sounds und Musik statt Synth, falls gewünscht.
6. UI: HUD, Titel, Menüs, Barrierefreiheit.
7. QA: Kollisionen, Edge Cases, Koop-Tests, Speicherstand.
8. Das Entwickler-Handbuch am Ende der Phase auf den neuen Stand bringen.
