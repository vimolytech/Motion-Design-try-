import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Bubble, pop, Words } from "../common";
import { Bernd } from "../Bernd";
import { body, C, display } from "../theme";

const Bolt: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="140 125 190 85" width={size} height={(size * 85) / 190}>
    <path d="M175,132 L268,132 L236,156 L318,156 L196,200 L226,172 L150,172 Z" fill={C.white} />
  </svg>
);

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = pop(frame, fps, 2, 12);
  const cta = pop(frame, fps, 34, 12);
  const bernd = pop(frame, fps, 48, 13);
  const note = pop(frame, fps, 80, 14);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 40% 40%, ${C.cyan} 0%, ${C.blue} 35%, #071A55 100%)`,
      }}
    >
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 140 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 30,
            transform: `scale(${0.6 + logo * 0.4})`,
            opacity: logo,
          }}
        >
          <Bolt size={210} />
          <div
            style={{
              fontFamily: display,
              fontWeight: 900,
              fontSize: 220,
              color: C.white,
              letterSpacing: "-0.04em",
            }}
          >
            NOVA X
          </div>
        </div>
        <Words
          text="Run Black. Run Blue."
          delay={16}
          size={60}
          font={body}
          weight={800}
          colors={{ 1: C.bg, 3: C.bg }}
          style={{ marginTop: 10 }}
        />
        <div
          style={{
            marginTop: 40,
            transform: `scale(${cta})`,
            background: C.bg,
            color: C.white,
            fontFamily: body,
            fontWeight: 800,
            fontSize: 40,
            padding: "20px 54px",
            borderRadius: 60,
          }}
        >
          Jetzt erhältlich →
        </div>
      </AbsoluteFill>

      {/* Bernd converts */}
      <div
        style={{
          position: "absolute",
          left: 1390,
          top: 760 + (1 - bernd) * 400,
        }}
      >
        <Bernd width={400} mood="happy" headband shoes />
      </div>
      {frame >= 62 ? (
        <Bubble text="Okay… ich lauf mit." delay={62} x={1250} y={680} size={36} tail="right" />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 50,
          opacity: note,
          fontFamily: body,
          fontWeight: 500,
          fontSize: 28,
          color: "rgba(255,255,255,0.85)",
        }}
      >
        *Jetzt auch in Schweinehund-Größe erhältlich.
      </div>
    </AbsoluteFill>
  );
};
