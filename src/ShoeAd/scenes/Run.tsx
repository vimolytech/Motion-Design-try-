import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Background, Bubble, pop, SpeedLines, Words } from "../common";
import { Bernd } from "../Bernd";
import { Shoe } from "../Shoe";
import { body, C, display } from "../theme";

const GROUND = 840;
const SKYLINE = new Array(16).fill(0).map((_, i) => ({
  w: 120 + ((i * 53) % 120),
  h: 140 + ((i * 97) % 260),
}));

export const Run: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phase = frame * 0.34;
  const up = Math.abs(Math.sin(phase)) * 90;
  const rot = Math.sin(phase * 2) * 7;

  const km = interpolate(frame, [0, 120], [0, 42.2], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const done = pop(frame, fps, 122, 10);

  const berndX = 180 - interpolate(frame, [25, 120], [0, 800], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const berndBounce = Math.abs(Math.sin(frame * 0.25)) * 26;

  return (
    <AbsoluteFill>
      <Background glow="rgba(30,107,255,0.30)" gy={80} grid={false} />
      {/* skyline */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: GROUND, overflow: "hidden" }}>
        {SKYLINE.concat(SKYLINE).map((b, i) => {
          const total = SKYLINE.reduce((a, s) => a + s.w + 30, 0);
          const offset = SKYLINE.slice(0, i % SKYLINE.length).reduce((a, s) => a + s.w + 30, 0) +
            (i >= SKYLINE.length ? total : 0);
          const x = offset - ((frame * 5) % total);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                bottom: 0,
                width: b.w,
                height: b.h,
                background: "linear-gradient(#13204A, #0B1430)",
                borderRadius: "6px 6px 0 0",
              }}
            />
          );
        })}
      </div>
      {/* ground */}
      <div style={{ position: "absolute", left: 0, right: 0, top: GROUND, bottom: 0, background: "#070B18" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: GROUND, height: 4, background: C.blue, boxShadow: `0 0 30px ${C.blue}` }} />
      {new Array(16).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: GROUND + 70,
            left: i * 160 - ((frame * 42) % 160),
            width: 80,
            height: 6,
            borderRadius: 3,
            background: "rgba(255,255,255,0.25)",
          }}
        />
      ))}

      <SpeedLines speed={50} opacity={0.35} count={14} />

      {/* Bernd falling behind */}
      <div style={{ position: "absolute", left: berndX, top: GROUND - 262 - berndBounce }}>
        <Bernd width={380} mood="tired" headband />
      </div>
      {frame >= 40 && frame < 115 ? (
        <Bubble text="Warte… auf… mich…" delay={40} x={berndX + 230} y={GROUND - 400} size={36} />
      ) : null}

      {/* the shoe running */}
      <div
        style={{
          position: "absolute",
          left: 820,
          top: GROUND - 300 - up,
          transform: `rotate(${rot}deg)`,
        }}
      >
        <Shoe width={620} glow={1 - up / 120} />
      </div>

      <div style={{ position: "absolute", left: 110, top: 100 }}>
        <Words text="Schneller als" delay={8} size={88} />
        <Words text="jede Ausrede." delay={18} size={88} color={C.cyan} />
      </div>

      {/* km counter */}
      <div style={{ position: "absolute", right: 110, top: 100, textAlign: "right" }}>
        <div style={{ fontFamily: body, fontWeight: 700, fontSize: 28, color: C.muted, letterSpacing: "0.2em" }}>
          DISTANZ
        </div>
        <div
          style={{
            fontFamily: display,
            fontWeight: 900,
            fontSize: 130,
            color: C.white,
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
          }}
        >
          {km.toFixed(1).replace(".", ",")}
          <span style={{ fontSize: 50, color: C.blue }}> KM</span>
        </div>
        {frame >= 122 ? (
          <div
            style={{
              display: "inline-block",
              marginTop: 18,
              transform: `scale(${done})`,
              background: C.blue,
              color: C.white,
              fontFamily: body,
              fontWeight: 800,
              fontSize: 34,
              padding: "10px 24px",
              borderRadius: 40,
            }}
          >
            Marathon? Läuft.
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
