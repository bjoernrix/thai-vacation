# Thai Vacation

2D-Muay-Thai-Beat-'em-up als einzelne HTML-Datei (Canvas 960 x 540). Zwei Helden, Rix und HasGirlfriendMan (HGM), prügeln sich durch Thailand und Deutschland. Solo oder lokaler Koop.

## Bauen und spielen

```
python3 tools/build.py        # erzeugt dist/thai-vacation.html
```

Voraussetzung: der Ordner `assets/` mit den Bildern (siehe `assets/README.md`).
Danach die HTML-Datei im Browser öffnen.

## Aufbau

| Ordner | Inhalt |
| --- | --- |
| `src/` | Spielcode: `a_core.js` (Eingabe, Audio), `b_art.js` (Sprites, Welten), `c_data.js` (Helden, Gegner, Stages), `d_logic.js` (Kampf, KI, Boss), `e_render.js` (Zeichnen, HUD), `f_editor.js` (Level-Editor, F2) |
| `tools/` | `build.py` (setzt die HTML zusammen), `qabot.py` (automatische Spieltests mit Playwright) |
| `pipeline/` | Bildpipeline: Sheets schneiden (`cut_l1.py`), Atlas packen (`pack_l1.py`), Logos entfernen (`nologos.py`) u. a. |
| `docs/` | Entwickler-Handbuch, GDD je Phase, Levelplan, Sound- und Grafik-Prompts |
| `assets/` | Bilder und Sounds (nicht im Repo) |

## Steuerung

Spieler 1: `A` `D` `W` `S`, Angriffe `F` `G` `H` `T`. Spieler 2: Pfeiltasten, `,` `.` `/` `;`. Gamepad wird unterstützt. Titelbild: `F2` Level-Editor, `B` Boss, `N` Musik.

## Status

Beta (Phase 4). Hua Hin mit 4 Stages und Boss, Level 1 Deutschland (Hof, Flohmarkt) in Arbeit, drei Muay-Thai-Bosse (Pink-Lotus, Golden Naga, Jade Viper) in Grafikproduktion.

Details zur Architektur: `docs/entwickler-handbuch.md`.

## Rechtliches

Namen und Marken der Muay-Thai-Bosse sind erfunden. Das Abbild des realen Kämpfers Saenchai muss vor einer Veröffentlichung rechtlich geklärt werden. Sounds und Musik sind Synth-Platzhalter.
