# NOVA X – Briefing für das KI-Material (realistischer Urban-Spot)

**Spot:** 30 Sekunden · 16:9 · Look: urban/street, Morgengrauen in der Stadt
**Schuh:** fiktiver Name „NOVA X“. Optik wie das Referenzfoto: weißes Mesh, silbergraue Overlays, geschwungene schwarze Akzentstreifen, weiße Zwischensohle, silbernes Gel-Fenster an der Ferse, schwarze Außensohle.
**Humor:** nur über eingeblendete Texte. Kein Maskottchen.

Du erzeugst die Clips und Bilder, ich schneide sie, color-grade sie und lege Texte, Logo, Übergänge und Callouts darüber.

---

## Wichtig, damit der Schuh in allen Clips gleich aussieht

1. **Erzeuge zuerst Bild H1 (Hero-Produktfoto)**, siehe unten. Das wird deine Referenz.
2. Nutze H1 bei jedem Video-Clip als **Referenz- bzw. Startbild** (Image-to-Video oder „Reference Image“ in Runway, Kling, Veo oder Sora).
3. **Keine Logos und kein Text im Bild.** Alle Prompts enthalten schon `no logos, no text`. Echte Markenzeichen (z. B. die ASICS-Streifen) dürfen nicht erkennbar sein.
4. **Technik:** 16:9, mindestens 1920×1080, 24 oder 30 fps, Clips je **5–8 Sekunden**. Ich kürze sie selbst.
5. Lieber **2–3 Varianten pro Shot** erzeugen und mir alle schicken, ich nehme die beste.

**Dateinamen** (damit ich alles sofort zuordnen kann): `A_snooze.mp4`, `B_door.mp4`, `C_laces.mp4`, `D_asphalt.mp4`, `F_bridge.mp4`, `G_end.mp4`, `H1_hero.png`, `H2_cutout.png`. Bei Varianten einfach `_v2`, `_v3` anhängen.

---

## Storyboard

| Zeit | Shot | Bild | Texteinblendung (mache ich) |
|---|---|---|---|
| 0–3 s | **A** | Hand schlägt im Halbdunkel auf den Wecker, 5:30 Uhr | „5:30 Uhr. Dein Kopf sagt: Snooze.“ |
| 3–6 s | **B** | Die Schuhe stehen an der Wohnungstür im ersten Morgenlicht | „Deine Schuhe sagen: Raus.“ |
| 6–10 s | **C** | Nahaufnahme: Hände binden die Schnürsenkel | „Ausreden übrig: 0“ |
| 10–15 s | **D** | Zeitlupe, ganz tief: Schuhe treffen nassen Asphalt, Wasser spritzt | „Leicht. Gedämpft. Gnadenlos.“ |
| 15–21 s | **E** | Hero-Produktshot aus H1/H2, von mir animiert: Kamerafahrt, Lichtkante, Callouts | „198 g“ · „Gel-Dämpfung“ · „Reflektoren für die Nacht“ |
| 21–26 s | **F** | Läufer auf leerer Brücke im Sonnenaufgang, überholt einen anfahrenden Stadtbus | „Schneller als der Bus.“ → „(Okay. Fast.)“ |
| 26–30 s | **G** | Schuh steht auf einer Betonstufe, Sonnenaufgang im Hintergrund, Platz für Logo | Logo NOVA X · „Run the City.“ · „Snooze war gestern.“ |

---

## Prompts (Englisch, so funktionieren die meisten Tools am besten)

Der Baustein **[SHOE]** steht in jedem Prompt. Er beschreibt den Schuh immer gleich:

> **[SHOE]** = `a retro-style running sneaker with white breathable mesh upper, silver-grey synthetic overlays, curved black accent stripes along the side, white chunky midsole with a small silver gel window at the heel, black rubber outsole`

### H1 – Hero-Produktfoto (Bild, ZUERST erzeugen)
```
Professional product photography of [SHOE], side profile view, toe pointing right, standing on raw grey concrete, soft early-morning sunlight from the left, subtle long shadow, shallow depth of field, blurred urban background with warm city lights, ultra realistic, 8k, commercial sneaker campaign, no logos, no text, no brand marks
```

### H2 – Freigestellter Schuh (Bild)
```
Studio product photo of [SHOE], exact side profile view, toe pointing right, isolated on pure white background, even softbox lighting, ultra sharp, high resolution, no logos, no text, no shadow
```
*(Freistellen kann ich hier nicht automatisch. Lass den Hintergrund bitte im Tool entfernen, z. B. mit „Remove background“, und schick ein PNG mit transparentem Hintergrund.)*

### A – Snooze (Video)
```
Cinematic close-up in a dark bedroom at dawn, a sleepy hand slowly reaches out from under a duvet and slaps a digital alarm clock showing 5:30, cool blue morning light through curtains, realistic, shallow depth of field, 35mm film look, handheld subtle motion, no text, no logos
```

### B – Schuhe an der Tür (Video)
```
Cinematic shot of [SHOE] pair standing on a wooden floor next to an apartment front door, first warm sunlight beam slowly moving across the shoes, dust particles in the light, slow push-in camera move, realistic, 35mm film look, no people, no text, no logos
```

### C – Schnürsenkel (Video)
```
Extreme close-up of hands tying the laces of [SHOE] on a city doorstep at sunrise, quick confident movements, warm backlight, shallow depth of field, realistic skin and fabric texture, cinematic commercial look, no text, no logos
```

### D – Asphalt-Zeitlupe (Video)
```
Ultra low angle tracking shot at ground level, a runner's feet wearing [SHOE] striking wet asphalt on an empty city street at sunrise, slow motion water splash, golden backlight, reflections in puddles, cinematic sports commercial, realistic, 120fps slow motion look, no text, no logos
```

### F – Brücke & Bus (Video)
```
Wide cinematic shot of a single runner in dark athletic clothing and [SHOE] running across an empty city bridge at sunrise, a city bus slowly pulling away beside him, the runner overtakes the bus, golden hour light, long shadows, slight lens flare, realistic, sports commercial, no text, no logos, no readable signs
```

### G – Endcard-Hintergrund (Video oder Bild)
```
Cinematic shot of [SHOE] standing alone on a concrete stair step in an urban setting, sunrise behind, soft haze, very slow camera dolly, large empty space in the upper half of the frame for a logo, realistic, premium sneaker campaign, no text, no logos
```

---

## Optional: Musik
Ein treibender Track mit 30 Sekunden oder mehr, z. B. von Suno, Udio oder aus einer lizenzfreien Bibliothek (Prompt-Idee: `energetic urban electronic beat, 120 bpm, building intro, punchy drop at 10 seconds, sports commercial`). Ich schneide die Bilder auf den Beat.

## So schickst du mir das Material
- **Bilder** einfach hier in den Chat ziehen.
- **Videos** am besten in einen **Google-Drive-Ordner** legen und mir den Ordnernamen nennen. Darauf habe ich Zugriff und lade die Dateien direkt herunter.
