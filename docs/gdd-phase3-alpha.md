# Thai Vacation – Phase 3 Ergebnis (Alpha, Level 1 Hua Hin)

Datei: `thai-vacation-alpha.html` (HTML5/Canvas, eine Datei, offline spielbar).

## Inhalt
- Stage 1-1 Strandstraße (Tag), 1-2 Nachtmarkt (Nachtgrading + Laternenglühen), 1-3 Küstenpfad, 1-4 Soi-Bar-Straße (Dämmerung) + Boss-Arena (Saenchai)
- Je Stage 5 Gegnerwellen, Plattform-Props, Bierflaschen (Heal + Betrunken-Effekt), Bestzeiten/Freischaltung per localStorage
- Solo (nur Rix, beide Tastaturbelegungen) und Local-Koop; Tag-Team-Wurf (Guard + Faust neben dem Partner); optionales Friendly Fire
- Gegner: Sonnenbrand-Tourist, Besoffener Tourist, Moped-Rowdy, Straßenköter, Fetter Türsteher, Kokosnuss-Affe (Fernkampf)
- Boss Saenchai: Wai-Kru-Intro, Teep, Low Kick, fliegendes Knie, Konter, Guard (Ellbogen bricht sie), Anti-Spam-Konter, 3 Phasen, Poise/Stagger
- Musik (Synth-Sequencer pro Stage + Boss) und Soundeffekte inkl. Ohwee: alles Synth-Platzhalter

## Grafik-Pipeline
- Hintergründe: die drei Referenzbilder auf Höhe 540 skaliert; 1-1/1-2/1-4 überblenden Strandstraße und Bar-Straße, 1-3 spiegelt den Küstenpfad. Farb-Grading (Nacht/Dämmerung) und Laternenglühen werden beim Stage-Start berechnet.
- Rix und HGM: die gelieferten Einzel-Sprites; Bewegung über Posen (Lehnen, Hüpfen, Nachbilder, Schwung-Effekte), da nur je eine Pose existiert.
- Saenchai: Sprite-Sheet in 23 Animationen / 61 Frames automatisch ausgeschnitten und als Atlas eingebunden.
- Gegner/Props: prozedural gezeichnete Pixel-Sprites (Platzhalter-Qualität).

## Offene Punkte für Phase 4
- Echte Animations-Sheets für Rix und HGM im selben Format wie das Saenchai-Sheet (Idle, Lauf, Sprung, Faust, Tritt, Knie, Ellbogen, Block, Treffer, K.O.)
- Eigene Sprite-Sheets für alle Gegner
- Mehr Hintergrundvarianten (Nachtmarkt-Stand, Höhle am Küstenpfad), Ebenen für Parallax
- Echte Samples für Ohwee, Treffer, Musik
- Balancing aller Stages und des Bosses, Affen-Klau-Gag
- Rechte-Klärung für das Saenchai-Abbild vor einer Veröffentlichung
