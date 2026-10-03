# Thai Vacation – GDD-Fundament (Phase 1, freigegeben)

## Vision
Schneller, derber 2D-Koop-Beat-'em-up-Plattformer in Thailand. Zwei junge Muay-Thai-Kämpfer, viel Humor, echte Kampftiefe. Optik: hochdetailliertes Pixel-Art (Referenzbilder: Hua-Hin-Strandstraße, Soi-Bar-Straße, Küstenpfad).

## Creative Pillars
1. Schnell und hart – Hitstop, Screenshake, übertriebene Sounds
2. Acht Gliedmaßen – Faust, Schienbein, Knie, Ellbogen mit klaren Rollen
3. Derber Humor mit Herz – Gags auf Kosten der Helden, nicht der Thai-Kultur; der Boss ist ein respektierter, echter Kämpfer
4. Koop zuerst – Local-Koop für 2 Spieler, Tag-Team-Moves, optionales Friendly Fire

## Figuren
- **Rix** (Glatze, Tattoos, lila Handschuhe, schwarz/lila Shorts): Tank, langsam, hoher Schaden, Ellbogen/Low-Kick
- **HasGirlfriendMan (HGM)** (Man-Bun, blaues Camo-Shirt): schnell, wendig, hoher Sprung, Knie-Kombos, Luftangriffe

## Kampfsystem
- Faust: schnelle Kombos, niedriger Schaden (3. Schlag wirft weg)
- Schienbein: Reichweite, starker Rückstoß
- Knie: Nahkampf, Bonus in der Luft
- Ellbogen: langsam, hoher Schaden, bricht Guards
- Bierflasche: Heal-Item mit Betrunken-Effekt (mehr Schaden, wackelnde Steuerung/Bild); zu viel Bier = Kotzen
- Signatursound: das "Ohwee" bei jedem Treffer, pro Figur eigene Stimme

## Level 1: Hua Hin (4 Stages + Boss)
1. Strandstraße (Tutorial)
2. Nachtmarkt
3. Küstenpfad und Aussichtspunkt (Höhle, diebische Affen)
4. Soi-Bar-Straße (Dämmerung)
5. Boss: **Saenchai** (echter Muay-Thai-Kämpfer, respektvoll dargestellt, ernsthafte KI, Wai-Kru-Intro)

## Technik
Prototyp: HTML5/Canvas (Datei `thai-vacation-first-playable.html`). Ziel-Engine-Vorschlag: Godot 4, modulares Charakter-System, einheitliche Hit-/Hurtbox-Logik.

## Offene Aufgaben
- Pixelraster von Charakteren und Hintergründen vereinheitlichen
- Hintergründe in Parallax-Ebenen aufteilen
- Verzerrte Schilder-Schrift in den Hintergründen durch saubere Pixel-Schrift ersetzen
- Rechte-Klärung für das Abbild des realen Kämpfers (Saenchai), falls das Spiel veröffentlicht wird
