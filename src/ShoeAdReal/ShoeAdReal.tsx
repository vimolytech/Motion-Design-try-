import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { pop, shake } from "../ShoeAd/common";
import { body, display } from "../ShoeAd/theme";
import {
  Caption,
  ease,
  FadeIn,
  Grain,
  Letterbox,
  LightSweep,
  Photo,
  toScreen,
  Vignette,
} from "./film";

// Realistic 30 s urban spot for the (fictional) NOVA X.
// Music: 120 BPM → one beat = 15 frames. Drop at frame 180, end-card hit at 750.
const BEAT = 15;
const DROP = 180;
const END = 750;
const IW = 1024;
const IH = 559;

// ---------- audio ----------
const VO: [string, number, number][] = [
  // file, start frame, length in frames
  ["01", 12, 30],
  ["02", 50, 38],
  ["03", 92, 44],
  ["04", 134, 44],
  ["05", 192, 33],
  ["06", 236, 48],
  ["07", 312, 45],
  ["08", 370, 57],
  ["09", 470, 67],
  ["10", 612, 59],
  ["11", 680, 57],
  ["12", 770, 53],
  ["13", 840, 32],
];

const musicVolume = (f: number) => {
  let duck = 0;
  for (const [, s, l] of VO) {
    duck = Math.max(
      duck,
      interpolate(f, [s - 6, s, s + l, s + l + 8], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    );
  }
  return 0.6 - duck * 0.32;
};

const SFX: [string, number, number][] = [
  ["alarm", 0, 0.35],
  ["thud", 168, 0.9],
  ["whoosh", 170, 0.6],
  ["whoosh", 296, 0.5],
  ["whoosh", 446, 0.5],
  ["whoosh", 596, 0.55],
  ["thud", 690, 0.4],
  ["thud", 705, 0.4],
  ["thud", 720, 0.4],
  ["thud", 735, 0.5],
];

const Sound: React.FC = () => (
  <>
    <Audio src={staticFile("audio/music.wav")} volume={musicVolume} />
    {VO.map(([id, s]) => (
      <Sequence key={id} from={s}>
        <Audio src={staticFile(`audio/vo/${id}.wav`)} volume={1} />
      </Sequence>
    ))}
    {SFX.map(([n, s, v], i) => (
      <Sequence key={i} from={s}>
        <Audio src={staticFile(`audio/sfx/${n}.wav`)} volume={v} />
      </Sequence>
    ))}
  </>
);

// ---------- helpers ----------
const beatPunch = (absFrame: number, from: number, to: number, amt = 0.035) => {
  if (absFrame < from || absFrame >= to) return 1;
  const t = (absFrame - from) % BEAT;
  return 1 + amt * Math.exp(-t / 3);
};

const Cutout: React.FC<{
  name: "side-b" | "three-quarter";
  width: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ name, width, style, children }) => {
  const [w, h] = name === "side-b" ? [652, 328] : [537, 349];
  return (
    <div style={{ position: "absolute", width, height: (width * h) / w, ...style }}>
      <Img
        src={staticFile(`real/cut/${name}.png`)}
        style={{ width: "100%", height: "100%", filter: "drop-shadow(0 26px 30px rgba(0,0,0,0.35))" }}
      />
      {children}
    </div>
  );
};

const Studio: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <AbsoluteFill
    style={{
      background: dark
        ? "radial-gradient(ellipse at 50% 45%, #3a3f48 0%, #15171c 55%, #07080a 100%)"
        : "radial-gradient(ellipse at 50% 40%, #ffffff 0%, #e6e8ec 50%, #b9bdc6 100%)",
    }}
  />
);

const Marquee: React.FC<{ text: string; y: number; speed: number; color: string; size?: number }> = ({
  text,
  y,
  speed,
  color,
  size = 330,
}) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: -((f * speed) % 2400),
        whiteSpace: "nowrap",
        fontFamily: display,
        fontWeight: 900,
        fontSize: size,
        color: "transparent",
        WebkitTextStroke: `3px ${color}`,
        letterSpacing: "-0.02em",
      }}
    >
      {`${text} `.repeat(6)}
    </div>
  );
};

const WhipIn: React.FC<{ children: React.ReactNode; dir?: 1 | -1 }> = ({ children, dir = 1 }) => {
  const f = useCurrentFrame();
  const x = ease(f, [0, 9], [dir * 700, 0], Easing.out(Easing.cubic));
  const blur = ease(f, [0, 9], [26, 0]);
  return (
    <AbsoluteFill style={{ transform: `translateX(${x}px)`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};

// ---------- scenes ----------
const Street: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = { s: ease(f, [0, 92], [1.3, 1.08]), x: 0, y: ease(f, [0, 92], [30, 0]) };
  const sun = toScreen(248, 108, 512, 279, cam);
  const flick = 0.85 + Math.sin(f / 3) * 0.05 + Math.sin(f / 7.3) * 0.05;
  const clock = pop(f, fps, 4, 14);
  const tick = f >= 12;
  const blink = f >= 12 && f < 40 && Math.floor(f / 4) % 2 === 0;
  return (
    <FadeIn len={16} color="#000">
      <Photo src="real/street.jpg" cam={cam} filter="brightness(0.8) contrast(1.15) saturate(0.9)" />
      <AbsoluteFill
        style={{
          mixBlendMode: "screen",
          opacity: flick,
          background: `radial-gradient(circle at ${sun.x}px ${sun.y}px, rgba(255,190,120,0.55) 0%, rgba(255,140,60,0.15) 18%, transparent 40%)`,
        }}
      />
      <Vignette strength={0.75} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 300,
          textAlign: "center",
          fontFamily: display,
          fontWeight: 700,
          fontSize: 190,
          color: tick ? "#ff4d3d" : "#fff",
          opacity: clock * (blink ? 0.35 : 1) * ease(f, [70, 90], [1, 0]),
          transform: `scale(${0.8 + clock * 0.2})`,
          textShadow: tick ? "0 0 40px rgba(255,77,61,0.8)" : "none",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "0.04em",
        }}
      >
        {tick ? "05:30" : "05:29"}
      </div>
      <Caption lines={["Die Stadt schläft noch."]} delay={48} y={720} size={64} align="center" />
    </FadeIn>
  );
};

const Snooze: React.FC = () => {
  const f = useCurrentFrame(); // 0 = frame 90
  const { fps } = useVideoConfig();
  const slam = pop(f, fps, 6, 11);
  const s = shake(f, 8, 16, 10);
  const strike = ease(f, [42, 50], [0, 1], Easing.out(Easing.cubic));
  const fall = Math.max(0, f - 52);
  const fallY = fall * fall * 1.6;
  const fallR = fall * 2.2;
  const shoeY = interpolate(pop(f, fps, 72, 9), [0, 1], [-700, 0]);
  const no = pop(f, fps, 78, 8);
  const s2 = shake(f, 78, 18, 12);
  return (
    <AbsoluteFill style={{ background: "#050505", transform: `translate(${s.x + s2.x}px, ${s.y + s2.y}px)` }}>
      <Caption lines={["Dein Wecker sagt:"]} delay={0} y={190} size={44} align="center" color="#8A8F99" />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 300,
          textAlign: "center",
          transform: `translateY(${fallY}px) rotate(${fallR}deg) scale(${2.2 - slam * 1.2})`,
          opacity: Math.min(1, slam * 2),
        }}
      >
        <span
          style={{
            position: "relative",
            display: "inline-block",
            fontFamily: display,
            fontWeight: 900,
            fontSize: 200,
            color: "#fff",
            letterSpacing: "-0.03em",
          }}
        >
          SNOOZE
          <span
            style={{
              position: "absolute",
              left: -20,
              top: "52%",
              height: 22,
              width: `calc(${strike * 100}% + ${strike * 40}px)`,
              background: "#ff3b30",
              transform: "rotate(-4deg)",
              borderRadius: 11,
            }}
          />
        </span>
      </div>
      {f >= 44 ? <Caption lines={["Deine Schuhe sagen:"]} delay={44} y={560} size={44} align="center" color="#8A8F99" /> : null}
      {f >= 72 ? (
        <>
          <Cutout name="side-b" width={560} style={{ left: 520, top: 640 + shoeY }} />
          <div
            style={{
              position: "absolute",
              left: 1130,
              top: 650,
              fontFamily: display,
              fontWeight: 900,
              fontSize: 200,
              color: "#fff",
              transform: `scale(${no}) rotate(${(1 - no) * -20}deg)`,
            }}
          >
            NÖ.
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

const Reveal: React.FC = () => {
  const f = useCurrentFrame(); // 0 = DROP
  const { fps } = useVideoConfig();
  const fly = pop(f, fps, 0, 12);
  const x = interpolate(fly, [0, 1], [1500, 0]);
  const blur = Math.max(0, (1 - fly) * 30);
  const float = Math.sin(f / 12) * 14;
  const punch = beatPunch(f + DROP, DROP, END);
  const grams = Math.round(ease(f, [60, 95], [0, 198], Easing.out(Easing.cubic)));
  const badge = pop(f, fps, 58, 12);
  return (
    <AbsoluteFill>
      <Studio />
      <Marquee text="NOVA X" y={300} speed={9} color="rgba(0,0,0,0.08)" />
      {/* contact shadow */}
      <div
        style={{
          position: "absolute",
          left: 960 - 420 + x,
          top: 840,
          width: 840,
          height: 60,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(0,0,0,0.35), transparent 70%)",
          transform: `scale(${1 - float / 120})`,
          opacity: fly,
        }}
      />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${punch})` }}>
        <Cutout
          name="side-b"
          width={1100}
          style={{
            left: 410 + x,
            top: 270 + float,
            transform: `rotate(${(1 - fly) * 8 + Math.sin(f / 18) * 1.5}deg) skewX(${(1 - fly) * -18}deg)`,
            filter: blur > 0.5 ? `blur(${blur}px)` : undefined,
          }}
        />
      </div>
      <LightSweep start={30} len={36} opacity={0.45} />
      <Caption label="DAS IST DER NOVA X" lines={["Leichter als jede Ausrede."]} delay={14} y={140} size={60} color="#111" accent="#6b7280" />
      <div
        style={{
          position: "absolute",
          right: 140,
          top: 760,
          transform: `scale(${badge})`,
          background: "#111",
          color: "#fff",
          borderRadius: 999,
          padding: "14px 34px",
          fontFamily: body,
          fontWeight: 800,
          fontSize: 44,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {grams} g
      </div>
    </AbsoluteFill>
  );
};

const Heel: React.FC = () => {
  const f = useCurrentFrame(); // 0 = 300
  const cam = { s: ease(f, [0, 150], [1.08, 1.3]), x: ease(f, [0, 150], [0, -70]), y: 0 };
  const gel = toScreen(390, 335, IW, IH, cam);
  return (
    <WhipIn>
      <AbsoluteFill style={{ background: "#000" }}>
        <Photo src="real/heel.jpg" cam={cam} filter="contrast(1.1)" />
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => {
            const t = f - 20 - k * BEAT;
            if (t < 0 || t > 30) return null;
            const p = t / 30;
            return (
              <ellipse
                key={k}
                cx={gel.x}
                cy={gel.y}
                rx={40 + p * 260}
                ry={(40 + p * 260) * 0.45}
                fill="none"
                stroke="#fff"
                strokeWidth={3}
                opacity={(1 - p) * 0.7}
              />
            );
          })}
        </svg>
        <LightSweep start={50} len={45} opacity={0.3} />
        <AbsoluteFill style={{ background: "linear-gradient(100deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 35%, transparent 60%)" }} />
        <Vignette strength={0.55} />
        <Caption label="GEL-DÄMPFUNG AN DER FERSE" lines={["Weich wie dein Bett.", "Nur schneller."]} delay={12} y={150} size={70} width={900} />
      </AbsoluteFill>
    </WhipIn>
  );
};

const POINTS = [
  { x: 391, y: 223, label: "Atmungsaktives Mesh", dx: 30, d: 30 },
  { x: 181, y: 193, label: "Reflektierende Overlays", dx: 10, d: 50 },
  { x: 26, y: 238, label: "Gel-Ferse", dx: -110, d: 70 },
];

const Words3: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "absolute", left: 120, top: 170, fontFamily: display, fontWeight: 900, lineHeight: 0.95 }}>
      {["ATMET.", "FEDERT.", "LÄUFT."].map((w, i) => {
        const p = pop(f, fps, 20 + i * 22, 10);
        return (
          <div
            key={w}
            style={{
              fontSize: 165,
              color: i === 2 ? "#fff" : "rgba(255,255,255,0.18)",
              transform: `translateX(${(1 - p) * -200}px) scale(${1.4 - p * 0.4})`,
              transformOrigin: "0% 50%",
              opacity: p,
            }}
          >
            {w}
          </div>
        );
      })}
    </div>
  );
};

const ThreeQuarter: React.FC = () => {
  const f = useCurrentFrame(); // 0 = 450
  const { fps } = useVideoConfig();
  const rot = ease(f, [0, 150], [-14, 10]);
  const float = Math.sin(f / 13) * 12;
  const enter = pop(f, fps, 2, 13);
  const W = 860;
  const LABEL_Y = 585; // local y of the label row, below the sole
  const k = W / 537;
  return (
    <WhipIn dir={-1}>
      <Studio dark />
      <Words3 />
      <div style={{ position: "absolute", inset: 0, perspective: 1600, transform: `scale(${beatPunch(f + 450, 450, 600, 0.02)})` }}>
        <Cutout
          name="three-quarter"
          width={W}
          style={{
            left: 960,
            top: 300 + float + (1 - enter) * 300,
            opacity: enter,
            transform: `rotateY(${rot}deg) rotateZ(${Math.sin(f / 20) * 2}deg)`,
          }}
        >
          <svg width={W} height={349 * k} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {POINTS.map((p) => {
              const d = ease(f, [p.d, p.d + 12], [0, 1], Easing.out(Easing.cubic));
              if (d <= 0) return null;
              const x = p.x * k;
              const y = p.y * k;
              const dy = LABEL_Y - y - float;
              return (
                <g key={p.label}>
                  <circle cx={x} cy={y} r={8 * d} fill="#3DD9FF" />
                  <circle cx={x} cy={y} r={8 + ((f - p.d) % 30)} fill="none" stroke="#3DD9FF" strokeWidth={2} opacity={1 - ((f - p.d) % 30) / 30} />
                  <line x1={x} y1={y} x2={x + p.dx * d} y2={y + dy * d} stroke="#3DD9FF" strokeWidth={2} />
                  <text
                    x={x + p.dx}
                    y={y + dy + 36}
                    textAnchor="middle"
                    fill="#fff"
                    opacity={d}
                    style={{ fontFamily: body, fontWeight: 700, fontSize: 30 }}
                  >
                    {p.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </Cutout>
      </div>
      <LightSweep start={90} len={40} opacity={0.2} />
    </WhipIn>
  );
};

const BlackEdition: React.FC = () => {
  const f = useCurrentFrame(); // 0 = 600
  const cam = { s: ease(f, [0, 90], [1.25, 1.02]), x: ease(f, [0, 90], [-60, 20]), y: 0 };
  const glitch = f < 10 ? (10 - f) * 3 : 0;
  // beat montage in the last 60 frames
  const montageIdx = f >= 90 ? Math.floor((f - 90) / 7.5) : -1;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {montageIdx < 0 || montageIdx % 2 === 1 ? (
        <>
          {glitch > 0 ? (
            <>
              <AbsoluteFill style={{ transform: `translateX(${glitch}px)`, mixBlendMode: "screen", opacity: 0.8 }}>
                <Photo src="real/hero-black.jpg" cam={cam} filter="sepia(1) saturate(6) hue-rotate(-50deg)" />
              </AbsoluteFill>
              <AbsoluteFill style={{ transform: `translateX(${-glitch}px)`, mixBlendMode: "screen", opacity: 0.8 }}>
                <Photo src="real/hero-black.jpg" cam={cam} filter="sepia(1) saturate(6) hue-rotate(140deg)" />
              </AbsoluteFill>
            </>
          ) : (
            <Photo
              src="real/hero-black.jpg"
              cam={montageIdx >= 0 ? { s: 1.1 + montageIdx * 0.08, x: 0, y: 0 } : cam}
              filter="contrast(1.1) saturate(1.05)"
            />
          )}
        </>
      ) : (
        <AbsoluteFill style={{ background: "#0b0b0d" }}>
          <Cutout
            name="side-b"
            width={900 + montageIdx * 60}
            style={{ left: 960 - (900 + montageIdx * 60) / 2, top: 330 - montageIdx * 15, transform: `rotate(${montageIdx % 4 === 0 ? -6 : 6}deg)` }}
          />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: "linear-gradient(rgba(0,0,0,0.6), transparent 35%)" }} />
      <Vignette strength={0.6} />
      {f < 90 ? (
        <>
          <Caption label="UND JETZT NEU" lines={["Black Edition."]} delay={10} y={128} size={72} />
          <Caption lines={["Für Straßen, die noch schlafen."]} delay={72} y={830} size={44} align="right" />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const f = useCurrentFrame(); // 0 = END
  const { fps } = useVideoConfig();
  const cam = { s: ease(f, [0, 150], [1.15, 1.0]), x: 0, y: 0, blur: 6 };
  const s = shake(f, 0, 24, 16);
  const tag = pop(f, fps, 34, 16);
  const joke = pop(f, fps, 90, 14);
  const shoe = pop(f, fps, 50, 14);
  const out = ease(f, [135, 150], [1, 0]);
  return (
    <AbsoluteFill style={{ transform: `translate(${s.x}px, ${s.y}px)`, opacity: out }}>
      <Photo src="real/street.jpg" cam={cam} filter="brightness(0.45) contrast(1.1)" />
      <Vignette strength={0.85} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 200 }}>
        <div style={{ display: "flex", fontFamily: display, fontWeight: 900, fontSize: 180, color: "#fff" }}>
          {"NOVA X".split("").map((ch, i) => {
            const p = pop(f, fps, 4 + i * 3, 12);
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  minWidth: ch === " " ? 60 : undefined,
                  transform: `translateY(${(1 - p) * -120}px)`,
                  opacity: p,
                  filter: p < 0.9 ? `blur(${(1 - p) * 12}px)` : undefined,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
        <div style={{ fontFamily: body, fontWeight: 700, fontSize: 46, color: "#fff", opacity: tag, letterSpacing: `${0.3 - tag * 0.28}em` }}>
          Run the City.
        </div>
      </AbsoluteFill>
      <Cutout
        name="side-b"
        width={460}
        style={{ left: 730, top: 645 + (1 - shoe) * 200 + Math.sin(f / 12) * 8, opacity: shoe }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 135,
          textAlign: "center",
          fontFamily: body,
          fontWeight: 600,
          fontSize: 32,
          color: "rgba(255,255,255,0.85)",
          opacity: joke,
          transform: `translateY(${(1 - joke) * 20}px)`,
        }}
      >
        Snooze war gestern.
      </div>
    </AbsoluteFill>
  );
};

const Flash: React.FC<{ at: number; len?: number; color?: string }> = ({ at, len = 8, color = "#fff" }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 1, at + len], [0, 0.95, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return o > 0 ? <AbsoluteFill style={{ background: color, opacity: o }} /> : null;
};

const SCENES: { from: number; len: number; Comp: React.FC }[] = [
  { from: 0, len: 90, Comp: Street },
  { from: 90, len: 90, Comp: Snooze },
  { from: DROP, len: 120, Comp: Reveal },
  { from: 300, len: 150, Comp: Heel },
  { from: 450, len: 150, Comp: ThreeQuarter },
  { from: 600, len: 150, Comp: BlackEdition },
  { from: END, len: 150, Comp: EndCard },
];

export const ShoeAdReal: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {SCENES.map(({ from, len, Comp }) => (
      <Sequence key={from} from={from} durationInFrames={len}>
        <Comp />
      </Sequence>
    ))}
    <Flash at={DROP} />
    <Flash at={END} len={12} />
    <Grain />
    <Letterbox />
    <Sound />
  </AbsoluteFill>
);
