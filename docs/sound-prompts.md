# Thai Vacation – Prompts für KI-Sound-Generatoren

Funktioniert mit Sound-Effekt-Generatoren (z. B. ElevenLabs Sound Effects, Stable Audio, AudioGen) und für die Musik mit Musik-KIs (z. B. Suno, Udio, Stable Audio). Die Prompts sind auf Englisch, weil die Tools damit am besten arbeiten.

## So gehst du vor
1. **Stil-Block** (unten) vor jeden SFX-Prompt kopieren.
2. Pro Sound **3–4 Varianten** erzeugen (gegen Wiederholung im Spiel) und als `<id>_1.wav`, `<id>_2.wav` … speichern.
3. Länge wie angegeben, **Mono, 44,1 kHz, WAV** (später ggf. OGG), Anfang sauber auf Null geschnitten, Lautstärke normalisieren auf ca. −3 dB.
4. Dateinamen = IDs aus der Tabelle (passen zu den Namen im Code, z. B. `hit_shin`).
5. Stimmen **nicht** nach realen Personen klingen lassen. Keine Marken-Jingles oder bekannten Songs.

## Stil-Block (vor jeden SFX-Prompt)
> Retro arcade beat-'em-up sound effect, punchy and slightly cartoonish, tropical Thailand street-fight comedy, dry with no reverb, no background noise, no music, no speech unless stated, clean start and clean tail, single isolated sound.

## Master-Prompt (wenn dein Tool eine Beschreibung für das ganze Set akzeptiert)
> Create a consistent sound effect set for a 2D comedic Muay Thai beat-'em-up set in Thailand. Style: punchy arcade game audio, slightly exaggerated and funny, 16-bit era feel but modern clean recording, short and snappy (most under 1 second), dry, mono, no music. Characters: RIX (deep gruff voice), HGM (higher, cheeky voice). Enemies: angry grandma, massage lady, pirate with a fly swatter, sunburned tourist, drunk tourist, moped rowdy, street dog, bouncer, coconut-throwing monkey, and the boss Saenchai (calm, dangerous Muay Thai fighter). Deliver each effect as a separate file.

---

## 1) Kampf & Treffer
| ID | Länge | Prompt (nach dem Stil-Block) |
|---|---|---|
| `hit_fist` | 0.3 s | Quick punch impact, boxing glove hitting a body, dry slap with a light thud |
| `hit_shin` | 0.5 s | Heavy shin kick impact, deep meaty thud with a sharp slap on top, Muay Thai pad strike |
| `hit_knee` | 0.4 s | Dull knee strike to the stomach, low heavy thump, short air burst |
| `hit_elbow` | 0.4 s | Sharp elbow strike, cracking snap with a bone-like knock, aggressive and short |
| `hit_big` | 0.7 s | Big launcher uppercut impact, heavy bass punch with a rising whoosh behind it |
| `swing` | 0.3 s | Fast limb swing through air, soft whoosh, no impact |
| `block` | 0.3 s | Gloves blocking a strike, dull padded slap with a small metallic tick |
| `guardbreak` | 0.6 s | Guard broken, hard crack then a short glass-like crunch, dramatic |
| `throw_partner` | 0.8 s | Comic tag-team throw, rising whoosh and a grunt-less cartoon swoosh ending in a soft thump |
| `coconut_throw` | 0.4 s | Coconut thrown, hollow whoosh |
| `coconut_hit` | 0.4 s | Coconut hitting a person, hollow wooden "bonk" with a cartoon feel |

## 2) Spieler
| ID | Länge | Prompt |
|---|---|---|
| `rix_hurt` | 0.6 s | Deep gruff male voice, short pained grunt "Ohwee", cartoon exaggerated, tough guy |
| `rix_hurt_big` | 1.0 s | Deep gruff male voice, long exaggerated pained yell "Ohweeee", comedic |
| `hgm_hurt` | 0.6 s | Higher cheeky male voice, short pained "Ohwee", cartoonish |
| `hgm_hurt_big` | 1.0 s | Higher cheeky male voice, long dramatic yell "Ohweeee", comedic |
| `rix_attack` | 0.3 s | Deep male effort grunt "Hah", short fighting shout |
| `hgm_attack` | 0.3 s | Higher male effort shout "Hyah", short fighting shout |
| `step` | 0.15 s | Single soft sneaker footstep on pavement |
| `jump` | 0.3 s | Light jump launch, short upward whoosh with a tiny shoe scuff |
| `land` | 0.3 s | Landing from a jump, shoes hitting stone with a little dust puff |
| `getup` | 0.5 s | Fighter getting up after a knockdown, cloth rustle and a short exhale |
| `guard_up` | 0.25 s | Boxing gloves raised and pressed together, leather creak with a soft slap |
| `heartbeat` | 1.0 s loop | Low heartbeat thump pair, slow and tense, subtle |
| `glug` | 1.0 s | Cartoon bottle drinking, three loud gulps |
| `burp` | 0.8 s | Comic long burp, deep, no speech |
| `fart` | 0.6 s | Comic cartoon fart, short, silly (family-friendly cartoon style) |
| `bottle_pickup` | 0.4 s | Glass bottle picked up, small clink |
| `hiccup` | 0.3 s | Single drunken hiccup |

## 3) Gegner
| ID | Länge | Prompt |
|---|---|---|
| `oma_hit` | 0.5 s | Angry old woman hit by a punch, short indignant "Ay!" squeal, comedic |
| `oma_attack` | 0.4 s | Handbag swung and slapped, heavy leather bag whack |
| `oma_scold` | 1.2 s | Old woman muttering a scolding in a gibberish language, grumpy |
| `massage_attack` | 0.4 s | Fast knuckle crack and a squeezing pinch sound |
| `massage_hit` | 0.5 s | Middle-aged woman short surprised "Ooh!", comedic |
| `pirate_attack` | 0.4 s | Plastic fly swatter swish and slap |
| `pirate_voice` | 0.7 s | Gruff pirate voice growling "Arrr", comedic |
| `tourist_hit` | 0.5 s | Sunburned man hit, short pained "Ow!" with a sizzle like hot skin |
| `tourist_flipflop` | 0.2 s | Single flip-flop slap on pavement |
| `drunk_hit` | 0.6 s | Drunken man hit, slurred short "Oof…" with a wobble |
| `drunk_stumble` | 0.5 s | Drunk stumble, shuffling feet and a glass bottle clink |
| `rowdy_start` | 1.2 s | Small scooter engine starting and revving up, two-stroke, short |
| `rowdy_charge` | 0.8 s | Scooter accelerating fast, buzzy engine rising, whoosh pass |
| `rowdy_horn` | 0.4 s | Cartoon scooter horn, two short beeps |
| `dog_bark` | 0.4 s | Street dog single sharp bark |
| `dog_growl` | 0.8 s | Low snarling dog growl |
| `dog_whimper` | 0.7 s | Dog whimper after being hit, short yelp |
| `bouncer_step` | 0.4 s | Very heavy footstep from a huge man, deep thud with cloth movement |
| `bouncer_voice` | 0.8 s | Very deep gruff male grunt, bouncer, comedic |
| `monkey_screech` | 0.7 s | Monkey screech, shrill chattering, cartoonish |
| `monkey_throw` | 0.4 s | Monkey effort grunt while throwing, short chirp |
| `enemy_ko` | 0.8 s | Cartoon knockout, character thrown to the ground with a comic "poof" and a thud |

## 4) Boss Saenchai
| ID | Länge | Prompt |
|---|---|---|
| `boss_telegraph` | 0.5 s | Warning cue before a strike, short rising tension tone with a breath intake |
| `boss_teep` | 0.5 s | Strong push-kick impact, deep boom with a sharp slap |
| `boss_lowkick` | 0.5 s | Low kick to the leg, hard slap with a dull whack |
| `boss_knee` | 0.6 s | Flying knee, whoosh then heavy impact |
| `boss_counter` | 0.4 s | Fast counter-attack, sharp whip crack, danger sting |
| `boss_stagger` | 1.0 s | Boss staggered, dramatic hit sting with a breathy grunt |
| `boss_phase` | 1.5 s | Deep gong with a short crowd gasp, dramatic |
| `boss_bell` | 1.5 s | Boxing ring bell, three strikes |
| `boss_ko` | 2.5 s | Final knockout, big impact, then a gong and a short respectful silence tail |
| `crowd_cheer` | 2.0 s | Small enthusiastic crowd cheering, Thailand fight night, no recognisable words |

## 5) Spielfluss & UI
| ID | Länge | Prompt |
|---|---|---|
| `wave_start` | 1.5 s | Deep wooden gong strike, dramatic |
| `wave_clear` | 0.8 s | Short bright bell chime, success |
| `stage_clear` | 2.5 s | Short victorious fanfare with xylophone and a bell, Thai-flavoured, cheerful |
| `game_over` | 2.5 s | Short comic defeat sting, descending notes, sad trombone feeling but with xylophone |
| `menu_move` | 0.1 s | Soft UI blip |
| `menu_confirm` | 0.3 s | Positive UI confirm, short two-note bell |
| `menu_back` | 0.2 s | UI cancel, soft low blip |
| `pause` | 0.3 s | Pause toggle, small muffled thud |
| `announcer_fight` | 1.0 s | Short energetic male voice shouting "Fight!" (no real person style) |
| `announcer_ko` | 1.0 s | Short energetic male voice shouting "K.O.!" |

## 6) Ambience (Loops, 20–40 s, nahtlos)
| ID | Prompt |
|---|---|
| `amb_beachstreet` | Seamless loop: distant ocean waves, seagulls, scooters passing, tuk-tuk horn in the distance, cicadas, warm tropical day |
| `amb_nightmarket` | Seamless loop: busy Thai night market, murmuring crowd, sizzling street food, vendors calling (unintelligible), crickets |
| `amb_coast` | Seamless loop: near waves on rocks, wind in palm trees, tropical birds, distant monkeys |
| `amb_bar` | Seamless loop: muffled bass music through a wall, people laughing and chatting, glasses clinking, street noise |
| `amb_arena` | Seamless loop: murmuring fight-night crowd, occasional cheer, rope creaks, tense |

## 7) Musik (je 90–120 s, nahtlos loopbar, ohne Gesang)
Stil-Zusatz für alle: *instrumental, no vocals, loopable, retro game soundtrack feel, Thai traditional instruments (ranat ek xylophone, pi java oboe, khong wong gongs, ching finger cymbals, taphon drums) mixed with a modern arcade beat; original composition, not a cover.*

| ID | BPM | Prompt |
|---|---|---|
| `music_day` | 118 | Cheerful upbeat Thai street theme, ranat ek xylophone lead playing a pentatonic melody, walking bass, light drums, sunny tropical beach town, playful and energetic |
| `music_night` | 98 | Night market groove, ranat ek melody in a darker minor pentatonic mode, warm bass, mellow drums, neon lights and street food atmosphere |
| `music_coast` | 88 | Relaxed coastal path theme, sparse ranat ek phrases, soft gongs, gentle percussion, ocean calm with a hint of mischief |
| `music_bars` | 126 | Driving Soi bar-street fight theme, pi java oboe lead, tight bass, punchy drums, gritty and dangerous but fun |
| `music_boss` | 148 | Intense Muay Thai boss fight theme, pi java oboe melody in a tense minor mode, taphon drums, ching, deep gong hits, rising urgency, epic |
| `music_boss_intro` | 100 | Wai Khru-inspired slow ritual intro, pi java oboe, soft drums, building tension for 20 seconds, no vocals |
| `music_title` | 110 | Title screen theme, catchy ranat ek hook, relaxed holiday feeling with a hint of fight energy |

**Tipp:** Wenn die Musik-KI Stems/Layer erlaubt, jeden Track als *ruhig* (nur Bass, Pad, leichte Percussion) und *Kampf* (volle Band) exportieren. Das Spiel schaltet schon zwischen beiden Zuständen um.

## Rechtliches
- Nutzungs- und Kommerzrechte der gewählten KI-Tools vorher prüfen (Free-Pläne erlauben oft keine kommerzielle Nutzung).
- Keine Prompts mit Künstler-, Marken- oder Songnamen.
- Stimmen nicht auf reale Personen oder Synchronsprecher anlegen.
