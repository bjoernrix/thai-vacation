# Thai Vacation – Spielablauf & Asset-Plan (5 Level)

Stand 2026-10-02. Vollständiges Dokument (Living Doc): https://claude.ai/code/artifact/9440b500-e2d9-4dca-90a5-75a0554078a9

## Levelstruktur
1. Deutschland – 1-1 Hof Dummmeier (Rix solo, Ratten/Mäuse), 1-2 Flohmarkt (HGM solo), 1-3 Flughafen (erste gemeinsame Stage), 1-4 An Bord (Turbulenzen). Boss: Kapitän Ferdinand von Hochstetten (Pilot, will nach Indien; Routenanzeige BKK → DEL → HHQ).
2. Hua Hin – Bestand, Stage-IDs werden 2-1..2-4. Boss Saenchai.
3. Bangkok – Khao San, Skytrain, Chao-Phraya-Fähre, Rooftop. Boss Khun Somchai (Tuk-Tuk-König).
4. Phitsanulok – Hausboote, Wat Yai, Reisfelder, Muay-Thai-Camp. Boss Kru Daeng. Neue Mechanik Clinch.
5. Pattaya – Beach Road, Walking Street, Kabarett-Theater, Riesenrad/Pier. Boss The Promoter (3 Champions + er selbst). Tag-Team-Finisher.

Regel: pro Level genau eine neue Mechanik, ein Zustand, ein Item, 5–6 Gegner, ein Boss mit 3 Phasen. Reisepass ersetzt die Stage-Auswahl (Stempel pro Stage, Visum pro Boss).

## Asset-Bedarf (Überschlag für Level 1, 3, 4, 5)
- Grafik: ~20 Hintergrund-Sets, 4 Boss-Arenen, ~44 neue Gegnertypen (Deutschland 23), 4 Boss-Sheets, 3 neue Helden-Animationen (Clinch-Griff, Clinch-Knie, Finisher), 2 Begleiter, ~30 Items/Objekte, ~20 UI-Grafiken (Reisepass, Stempel, Visa, Porträts).
- Audio: ~230 neue Sounds: 24 Musikstücke (4 Stage + Boss + Intro je Level), 20 Ambiences, ~150 SFX/Stimmen, ~20 übergreifend. Kampf-Grundgeräusche aus Hua Hin werden wiederverwendet.

## Technik
Einzeldatei wird zu groß (>100 MB) → Vorschlag: HTML + Asset-Ordner pro Level mit Nachladen. Stage-Daten aus c_data.js in JSON pro Level, Editor erweitert. Boss-Framework generisch (Moves/Phasen aus Daten). Neue Systeme: Begleiter, Durchfahrt-Objekte, Auto-Scroll/bewegte Plattformen, Zivilisten/Karma, Clinch, Finisher, Zustände.

## Produktionsreihenfolge
Fundament (Loader, Reisepass, Boss-Framework) → Deutschland Greybox → Deutschland Assets → Bangkok → Phitsanulok → Pattaya → Gesamtdurchlauf.

## Offene Entscheidungen (Björn)
Solo-Stages mit Begleiter? Tutorial in Level 1? Promoter als Story? Clinch ok? Phitsanulok ruhig? Einzeldatei vs. Ordner? Pilot als Taxifahrer in Hua Hin?
