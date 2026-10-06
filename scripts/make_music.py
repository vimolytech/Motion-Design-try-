"""Procedurally generates the 30 s soundtrack + SFX for the NOVA X spot.

120 BPM, A minor (Am - F - C - G). Drop at 6.0 s, end-card impact at 25.0 s.
Writes public/audio/music.wav and public/audio/sfx/*.wav.
Run: python3 scripts/make_music.py
"""

from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 44100
DUR = 30.0
BPM = 120
BEAT = 60 / BPM
DROP = 6.0
END = 25.0
N = int(SR * DUR)
rng = np.random.default_rng(7)
OUT = Path(__file__).resolve().parent.parent / "public" / "audio"


def t_(sec):
    return np.arange(int(SR * sec)) / SR


def lp(x, hz, order=2):
    return sosfilt(butter(order, hz, "low", fs=SR, output="sos"), x)


def hp(x, hz, order=2):
    return sosfilt(butter(order, hz, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi):
    return sosfilt(butter(2, [lo, hi], "band", fs=SR, output="sos"), x)


def place(buf, sig, at, gain=1.0):
    i = int(at * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i] * gain


def saw(f, t, voices=3, detune=0.006):
    out = np.zeros_like(t)
    for v in range(voices):
        ff = f * (1 + detune * (v - (voices - 1) / 2))
        ph = (t * ff + rng.random()) % 1.0
        out += 2 * ph - 1
    return out / voices


# ---------- one-shots ----------
def kick():
    t = t_(0.45)
    f = 45 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 7)
    click = hp(rng.standard_normal(len(t)), 3000) * np.exp(-t * 300) * 0.3
    return np.tanh((body + click) * 1.6)


def clap():
    t = t_(0.3)
    n = bp(rng.standard_normal(len(t)), 900, 5000)
    env = np.exp(-t * 18)
    for d in (0.0, 0.012, 0.024):
        env += np.exp(-np.clip(t - d, 0, None) * 120) * (t >= d) * 0.6
    return n * env * 0.5


def hat(open_=False):
    t = t_(0.25 if open_ else 0.06)
    return hp(rng.standard_normal(len(t)), 7000) * np.exp(-t * (14 if open_ else 70)) * 0.35


def impact():
    t = t_(2.5)
    f = 30 + 80 * np.exp(-t * 6)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2)
    crash = hp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 2.5) * 0.35
    return np.tanh((boom * 1.4 + crash))


def riser(sec):
    t = t_(sec)
    n = rng.standard_normal(len(t))
    out = np.zeros_like(t)
    seg = int(SR * 0.05)
    for i in range(0, len(t), seg):
        c = 400 + 7000 * (i / len(t)) ** 2
        out[i : i + seg] = bp(n[i : i + seg + 0], c * 0.7, min(c * 1.4, SR / 2 - 100))
    sweep = np.sin(2 * np.pi * np.cumsum(200 + 1200 * (t / sec) ** 2) / SR) * 0.15
    return (out * 0.6 + sweep) * (t / sec) ** 2


def whoosh():
    t = t_(0.7)
    n = rng.standard_normal(len(t))
    env = np.sin(np.pi * np.clip(t / 0.7, 0, 1)) ** 2
    out = np.zeros_like(t)
    seg = int(SR * 0.02)
    for i in range(0, len(t), seg):
        c = 600 + 5000 * np.sin(np.pi * i / len(t))
        out[i : i + seg] = bp(n[i : i + seg], c * 0.6, min(c * 1.6, SR / 2 - 100))
    return out * env * 0.9


def thud():
    t = t_(0.5)
    f = 60 + 90 * np.exp(-t * 30)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 10)
    s += lp(rng.standard_normal(len(t)), 800) * np.exp(-t * 25) * 0.4
    return np.tanh(s * 1.5)


def alarm():
    out = np.zeros(int(SR * 2.6))
    t = t_(0.09)
    beep = np.sign(np.sin(2 * np.pi * 2000 * t)) * 0.25 * np.minimum(1, (0.09 - t) * 200)
    for k in range(4):
        for b in range(3):
            place(out, beep, 0.15 + k * 0.6 + b * 0.13)
    return lp(out, 6000)


# ---------- music ----------
CHORDS = [  # Am F C G, root in Hz (octave 2) + triad offsets
    (110.0, [0, 3, 7]),
    (87.31, [0, 4, 7]),
    (130.81, [0, 4, 7]),
    (98.0, [0, 4, 7]),
]


def chord_at(sec):
    return CHORDS[int(sec // (BEAT * 4)) % 4]


music = np.zeros(N)
drums = np.zeros(N)
bass = np.zeros(N)
side = np.ones(N)  # sidechain gain from kick

K, CL, HC, HO = kick(), clap(), hat(), hat(True)
beats = np.arange(0, DUR, BEAT)
for b in beats:
    full = DROP <= b < END - 1.0 or END <= b < END + 0.01
    if full:
        place(drums, K, b, 0.9)
        i = int(b * SR)
        L = int(0.25 * SR)
        side[i : i + L] = np.minimum(side[i : i + L], 0.35 + 0.65 * np.linspace(0, 1, L) ** 0.6)
        if int(round(b / BEAT)) % 2 == 1:
            place(drums, CL, b, 0.7)
        place(drums, HO, b + BEAT / 2, 0.45)
    if 3.0 <= b < END - 1.0:
        place(drums, HC, b, 0.5)
        place(drums, HC, b + BEAT / 4, 0.25)
        place(drums, HC, b + 3 * BEAT / 4, 0.25)

# bass: 8th-note pulses
for k in np.arange(3.0, END - 0.5, BEAT / 2):
    root, _ = chord_at(k)
    f = root / 2
    t = t_(BEAT / 2 * 0.9)
    s = saw(f, t, 2) + 0.6 * np.sin(2 * np.pi * f * t)
    s *= np.minimum(1, t * 200) * np.exp(-t * 4)
    g = 0.55 if k >= DROP else 0.3
    place(bass, lp(s, 400 if k < DROP else 900), k, g)

# pad (whole song) with chords
pad = np.zeros(N)
for start in np.arange(0, DUR, BEAT * 4):
    root, iv = chord_at(start)
    t = t_(BEAT * 4)
    s = sum(saw(root * 2 * 2 ** (i / 12), t, 3, 0.01) for i in iv) / 3
    env = np.minimum(1, t / 0.4) * np.minimum(1, (BEAT * 4 - t) / 0.2)
    place(pad, s * env, start)
pad_lo = lp(pad, 700, 2)
pad_hi = lp(pad, 3500, 2)
tt = np.arange(N) / SR
mixamt = np.clip((tt - 4.5) / 1.5, 0, 1) * (tt < END) + (tt >= END) * 0.5
pad = pad_lo * (1 - mixamt) + pad_hi * mixamt

# arp pluck in the drop
arp = np.zeros(N)
for k in np.arange(DROP, END - 1.0, BEAT / 4):
    root, iv = chord_at(k)
    step = int(round((k - DROP) / (BEAT / 4)))
    note = [0, 2, 1, 2, 0, 1, 2, 1][step % 8]
    f = root * 4 * 2 ** (iv[note] / 12)
    t = t_(0.18)
    s = (np.sign(np.sin(2 * np.pi * f * t)) * 0.5 + np.sin(2 * np.pi * f * 2 * t) * 0.3) * np.exp(-t * 22)
    place(arp, lp(s, 3000), k, 0.22)

# filter-down breakdown before the end card
fx = np.zeros(N)
place(fx, riser(1.5), DROP - 1.5, 0.55)
place(fx, riser(1.5), END - 1.5, 0.6)
place(fx, impact(), DROP, 0.8)
place(fx, impact(), END, 1.0)

music = drums + (bass + pad * 0.35 + arp) * side + fx
# ending fade
fade = np.clip((DUR - tt) / 2.5, 0, 1)
music *= fade
music = np.tanh(music * 1.1)
music /= np.max(np.abs(music)) * 1.12


def write(path, mono, width=0.0):
    path.parent.mkdir(parents=True, exist_ok=True)
    if width:
        d = int(SR * 0.012)
        r = np.concatenate([np.zeros(d), mono[:-d]])
        st = np.stack([mono, mono * (1 - width) + r * width], 1)
    else:
        st = np.stack([mono, mono], 1)
    wavfile.write(path, SR, (np.clip(st, -1, 1) * 32767).astype(np.int16))


write(OUT / "music.wav", music, 0.25)
for name, sig in {
    "alarm": alarm(),
    "whoosh": whoosh(),
    "thud": thud(),
    "impact": impact() * 0.8,
}.items():
    write(OUT / "sfx" / f"{name}.wav", sig / max(1e-9, np.max(np.abs(sig))) * 0.9)
print("ok")
