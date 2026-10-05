import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Background, pop, Words } from "../common";
import { Shoe } from "../Shoe";
import { body, C, display } from "../theme";

// Shoe placement: width 1100 → svg scale 1100/600
const SX = 410;
const SY = 190;
const K = 1100 / 600;
const pt = (x: number, y: number) => ({ x: SX + x * K, y: SY + y * K });

const CALLOUTS = [
  { title: "Ultraleicht", value: "198 g", at: pt(230, 108), card: { x: 470, y: 120 }, anchor: { x: 700, y: 222 }, delay: 40 },
  { title: "Blue-Boost", value: "Dämpfung", at: pt(330, 240), card: { x: 1180, y: 790 }, anchor: { x: 1300, y: 790 }, delay: 75 },
  { title: "360° Reflektor", value: "für Nachtläufe", at: pt(52, 150), card: { x: 90, y: 690 }, anchor: { x: 330, y: 690 }, delay: 110 },
];

export const Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = pop(frame, fps, 0, 15);
  const bob = Math.sin(frame / 14) * 10;
  const tilt = Math.sin(frame / 22) * 1.5;
  const bgX = interpolate(frame, [0, 240], [80, -220]);
  const stamp = pop(frame, fps, 160, 9);

  return (
    <AbsoluteFill>
      <Background glow="rgba(30,107,255,0.45)" gy={48} gridShift={frame * 2} />
      {/* giant outlined brand name */}
      <div
        style={{
          position: "absolute",
          top: 300,
          left: bgX,
          fontFamily: display,
          fontWeight: 900,
          fontSize: 440,
          whiteSpace: "nowrap",
          color: "transparent",
          WebkitTextStroke: "3px rgba(61,217,255,0.16)",
          letterSpacing: "-0.03em",
        }}
      >
        NOVA X NOVA X
      </div>

      <div
        style={{
          position: "absolute",
          left: SX + (1 - enter) * 1400,
          top: SY + bob,
          transform: `rotate(${tilt - (1 - enter) * 15}deg)`,
        }}
      >
        <Shoe width={1100} glow={0.8 + Math.sin(frame / 10) * 0.2} />
      </div>

      {/* callout lines */}
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {CALLOUTS.map((c) => {
          const d = interpolate(frame, [c.delay, c.delay + 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });
          if (d <= 0) return null;
          const tx = c.at.x;
          const ty = c.at.y + bob;
          const pulse = 1 + ((frame - c.delay) % 30) / 30;
          return (
            <g key={c.title}>
              <line
                x1={c.anchor.x}
                y1={c.anchor.y}
                x2={c.anchor.x + (tx - c.anchor.x) * d}
                y2={c.anchor.y + (ty - c.anchor.y) * d}
                stroke={C.cyan}
                strokeWidth={3}
              />
              <circle cx={tx} cy={ty} r={10 * d} fill={C.cyan} />
              <circle
                cx={tx}
                cy={ty}
                r={10 * pulse * 1.8}
                fill="none"
                stroke={C.cyan}
                strokeWidth={2}
                opacity={2 - pulse}
              />
            </g>
          );
        })}
      </svg>

      {CALLOUTS.map((c) => {
        const p = pop(frame, fps, c.delay + 8, 14);
        return (
          <div
            key={c.title}
            style={{
              position: "absolute",
              left: c.card.x,
              top: c.card.y,
              opacity: p,
              transform: `translateY(${(1 - p) * 30}px)`,
              background: "rgba(10,18,40,0.75)",
              border: `1.5px solid ${C.cyan}55`,
              borderRadius: 20,
              padding: "16px 28px",
              fontFamily: body,
              color: C.white,
              backdropFilter: "blur(10px)",
            }}
          >
            <div style={{ fontSize: 24, color: C.cyan, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {c.title}
            </div>
            <div style={{ fontSize: 44, fontWeight: 800 }}>{c.value}</div>
          </div>
        );
      })}

      {/* funny stamp */}
      {frame >= 160 ? (
        <div
          style={{
            position: "absolute",
            left: 1390,
            top: 150,
            transform: `rotate(-12deg) scale(${2.4 - stamp * 1.4})`,
            opacity: Math.min(1, stamp * 1.5),
            border: `6px solid ${C.pink}`,
            color: C.pink,
            borderRadius: 18,
            padding: "14px 26px",
            fontFamily: display,
            fontWeight: 900,
            fontSize: 34,
            textAlign: "center",
            lineHeight: 1.15,
          }}
        >
          SCHWEINEHUND-
          <br />
          GETESTET ✓
        </div>
      ) : null}

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 40 }}>
        <Words
          text="Black. Blue. Born to run."
          delay={140}
          size={64}
          colors={{ 1: C.blue }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
