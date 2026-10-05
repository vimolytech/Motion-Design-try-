import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { pop, shake, Words } from "../common";
import { body, C, display } from "../theme";
import { LivingRoom } from "./LivingRoom";

const FACTS = [
  { label: "Lieblingssport", value: "Liegen" },
  { label: "Bestzeit", value: "14 h Netflix" },
  { label: "Motto", value: "Morgen vielleicht." },
];

export const MeetBernd: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = pop(frame, fps, 135, 12);
  const s = shake(frame, 138, 22);
  const overlay = interpolate(frame, [132, 140], [0, 0.72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ transform: `translate(${s.x}px, ${s.y}px)` }}>
      <LivingRoom mood="sleep" zzz>
        <div style={{ position: "absolute", left: 120, top: 110 }}>
          <Words text="Das ist Bernd." delay={4} size={96} />
          <Words
            text="Dein innerer Schweinehund."
            delay={26}
            size={54}
            font={body}
            weight={700}
            colors={{ 2: C.pink }}
            style={{ marginTop: 10 }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 120,
            top: 420,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {FACTS.map((f, i) => {
            const p = pop(frame, fps, 56 + i * 20, 13);
            return (
              <div
                key={f.label}
                style={{
                  transform: `translateX(${(1 - p) * -60}px) scale(${0.9 + p * 0.1})`,
                  opacity: p,
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 22,
                  padding: "16px 26px",
                  fontFamily: body,
                  fontSize: 34,
                  color: C.white,
                  width: 580,
                }}
              >
                <span style={{ color: C.muted, fontWeight: 500 }}>{f.label}: </span>
                <span style={{ fontWeight: 800 }}>{f.value}</span>
              </div>
            );
          })}
        </div>
      </LivingRoom>

      {/* "Heute nicht." slam */}
      <AbsoluteFill style={{ background: `rgba(5,7,13,${overlay})` }} />
      {frame >= 135 ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              fontFamily: display,
              fontWeight: 900,
              fontSize: 230,
              color: C.blue,
              letterSpacing: "-0.03em",
              transform: `scale(${2.2 - slam * 1.2}) rotate(-4deg)`,
              opacity: Math.min(1, slam * 2),
              textShadow: `0 0 60px ${C.blue}`,
            }}
          >
            Heute nicht.
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
