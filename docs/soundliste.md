# Thai Vacation – Soundliste (Stand Beta, Phase 4)

Alle Sounds sind aktuell **Synth-Platzhalter** (Web Audio, im Code erzeugt, keine Sample-Dateien). Spalte „Datei“ zeigt, wo der Ersatz durch echte Samples ansetzen würde.

## A) Bereits im Spiel

### Kampf & Treffer
| Sound | Auslöser | Charakter |
|---|---|---|
| Schlag – Faust (`hit 0`) | Faust trifft | kurzer, trockener Klatsch |
| Schlag – Schienbein (`hit 1`) | Schienbein trifft | tiefer, schwerer Schlag + Zisch |
| Schlag – Knie (`hit 2`) | Knie trifft | dumpfer Thump |
| Schlag – Ellbogen (`hit 3`) | Ellbogen trifft | scharfer Knack, Guard Break |
| Thump (groß) | Launcher / dritter Faustschlag | tiefer Bass-Schlag |
| Schwung (`whoosh`) | jeder Angriff beim Ausholen | Luftzug |
| Block (`block`) | Treffer wird geblockt | metallisch-kurzes Klacken |
| Wurf (`throwme`) | Tag-Team-Wurf | aufsteigender Sägezahn |
| Kokosnuss (`coconut`) | Affe wirft / Nuss trifft | hohler Plopp |
| Ding (`ding`) | Boss-Intro, Wellenende, Phasenwechsel | helles Glöckchen |
| Gong (`gong`) | Wellenstart, Boss-Phasenwechsel | tiefer Gong |

### Spieler
| Sound | Auslöser |
|---|---|
| „Ohwee!“ Rix (tiefe Stimme) / HGM (hohe Stimme), normal + groß | Treffer bekommen, K.O. |
| Schritte (`step`) | Laufen am Boden |
| Sprung (`jump`) / Landung (`land`) | Springen / harte Landung |
| Schluck (`glug`) | Bier trinken |
| Rülpser (`burp`) / Furz (`fart`) | nach dem Trinken, bei Überdosis, Gegner-K.O. (zufällig) |

### Gegner
| Sound | Auslöser |
|---|---|
| Grunzer je Typ (`grunt`): Hund, Affe, Oma, Massage-Oma, Tourist, Betrunkener, Rowdy, Türsteher, Pirat | Treffer (45 %) und K.O. – nur Tonhöhe/Klangfarbe unterschiedlich, noch keine echten Stimmen |

### Spielfluss
| Sound | Auslöser |
|---|---|
| Fanfare (`clear`) | Stage geschafft, Boss besiegt |
| Game-Over-Sting (`over`) | alle Spieler K.O. |

### Musik (Synth-Sequencer, 5 Tracks)
| Track | Wo | BPM | Klang |
|---|---|---|---|
| `day` | 1-1 Strandstraße | 118 | Ranat-Xylophon, pentatonisch, locker |
| `night` | 1-2 Nachtmarkt | 98 | Ranat, dunklere Tonleiter |
| `coast` | 1-3 Küstenpfad | 88 | Ranat, entspannt, spärlich |
| `bars` | 1-4 Soi-Bar-Straße | 126 | Pi-Java-artiges Rohrblatt, treibend |
| `boss` | Saenchai | 148 | Pi-Java, harmonisch-moll, +4 % Tempo je Boss-Phase |

Dynamik: ruhige Variante zwischen den Wellen, volle Band im Kampf; Pad-Akkord je Takt; Variation im zweiten Durchlauf.

---

## B) Vorschläge zum Ergänzen

Priorität: **H** hoher Gewinn fürs Spielgefühl · **M** schönes Extra · **N** nice to have

### Menü & Oberfläche
| Sound | Prio |
|---|---|
| Menü bewegen / bestätigen / zurück | H |
| Pause an/aus (Musik gedämpft) | M |
| Stage-Auswahl, Held wählen (Charakter-Spruch) | M |
| „3-2-1“ / „FIGHT!“-Ansage vor dem Boss | M |
| Ergebnisbildschirm: Zählen der Zeit/Combos (Ticker) | N |

### Spieler (Rix & HGM)
| Sound | Prio |
|---|---|
| Guard hoch (Handschuhe zusammen) | H |
| Eigene Kampfrufe beim Schlagen (kurzes „Hah!“, Rix/HGM verschieden) | H |
| Combo-Finisher (dritter Schlag, Ellbogen) mit eigenem Klang | M |
| Durch Plattform fallen / Hochziehen | N |
| Aufstehen nach Knockdown | M |
| Team-Wurf: Zuruf des Partners + Aufprall | M |
| Bier-Flasche aufheben (Klirren) | M |
| Zigarette/Atmen von Rix im Idle (leise) | N |
| Herzschlag bei niedrigen HP (passend zur roten Vignette) | H |
| Betrunken: Pitch-Wackeln der Musik, Schluckauf | M |
| Sieges-Pose-Spruch am Stage-Ende | M |

### Gegner (Figur-spezifisch statt nur Grunzer)
| Gegner | Sounds | Prio |
|---|---|---|
| Wütende Oma | Handtaschen-Schlag, Schimpf-Gemurmel, Gehstock-Tapsen | H |
| Massage-Oma | Knack-/Knetgeräusch beim Angriff, „Oooh!“ | M |
| Fliegenklatschen-Pirat | Klatschen-Swish, „Arrr!“, Schritte schwerer | H |
| Sonnenbrand-Tourist | Zisch beim Treffer, Seufzer, Sandalen-Klatschen | M |
| Betrunkener Tourist | Schluckauf, Stolpern, Flaschenklirren | M |
| Moped-Rowdy | Moped-Motor anwerfen, Aufheulen beim Ansturm, Hupe | H |
| Straßenköter | Bellen, Knurren, Jaulen beim K.O. | H |
| Türsteher | schwere Schritte, tiefes Brummen, Armverschränken | M |
| Kokosnuss-Affe | Kreischen, Wurf-Ächzer, Kokos-Aufprall/Zerplatzen | H |

### Boss Saenchai
| Sound | Prio |
|---|---|
| Eigene Teep-/Low-Kick-/Knie-Sounds mit hörbarem Vorlauf (Telegraph) | H |
| Konter-Warnton (kurzes Aufblitzen) | H |
| Guard-Break / „Angeschlagen“-Sting | M |
| Phasenwechsel-Gong mit Crowd-Reaktion | M |
| Ring-Glocke (Rundenbeginn), Publikum, Gong beim K.O. | M |
| Wai-Khru-Intro (langsame Pi-Java-Einleitung, Trommeln) | M |
| Sieg: Respekt-Geste, Stille + Ding | N |

### Umgebung / Ambience (Loops, je Stage)
| Stage | Ambience | Prio |
|---|---|---|
| 1-1 Strandstraße | Brandung entfernt, Möwen, Tuk-Tuk-Hupen, Verkehr, Zikaden | H |
| 1-2 Nachtmarkt | Marktgemurmel, brutzelndes Street-Food, Grillen, Verkäuferrufe | H |
| 1-3 Küstenpfad | Wellen nah, Vögel, Affen im Hintergrund, Wind | H |
| 1-4 Soi-Bar | Bar-Bass durch die Wand, Leute lachen, Flaschenklirren | M |
| Boss-Arena | Publikum (Murmeln → Jubel), Ring-Seile knarren | M |

### Weltobjekte
| Sound | Prio |
|---|---|
| Kiste/Moped bei Treffer wackeln, Plattform-Landung (Holz/Metall) | N |
| Gegner fällt/rutscht über den Boden | M |
| Münz-/Bonus-Klang für Combo-Meilensteine | N |
| Wellenende: Stinger je Level (statt immer gleiches Ding) | M |

### Mix & Technik
| Punkt | Prio |
|---|---|
| Lautstärke-Regler (Musik / Effekte / Stimmen getrennt) | H |
| Musik duckt kurz bei großen Treffern | M |
| Stereo-Panning nach X-Position der Quelle | M |
| Zufällige Variationen (Pitch ±5 %, 3–4 Varianten je Treffer) gegen Wiederholung | H |
| Echte Samples statt Synth (WAV/OGG, Atlas-Loader) | H |

---

## Hinweise
- **Quellen für echte Samples:** eigene Aufnahmen, selbst vertonte Stimmen oder Libraries mit klarer Lizenz (z. B. CC0). Keine Marken-Jingles, keine bekannten Songs, keine echten Muay-Thai-Walkout-Stücke ohne Rechteklärung.
- **Wai-Khru/Sarama-Musik:** traditionelle Pi-Java-Klänge sind gut als Stil-Inspiration, aber fertige Aufnahmen müssen lizenziert sein.
- Die Hit-Sounds hängen an `ATK[k]` in `c_data.js`, die Gegner-Grunzer an `ET[type]`, d. h. neue Samples lassen sich pro Technik/Typ einhängen.
