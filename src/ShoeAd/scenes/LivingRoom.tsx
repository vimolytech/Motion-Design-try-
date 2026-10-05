import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Background } from "../common";
import { Bernd, Couch, Mood } from "../Bernd";
import { body, C, display } from "../theme";

// Shared set for the couch scenes: wall poster, couch, Bernd.
export const LivingRoom: React.FC<{
  mood: Mood;
  berndStyle?: React.CSSProperties;
  couchStyle?: React.CSSProperties;
  zzz?: boolean;
  children?: React.ReactNode;
}> = ({ mood, berndStyle, couchStyle, zzz, children }) => {
  const frame = useCurrentFrame();
  const breathe = 1 + Math.sin(frame / 9) * 0.02;
  return (
    <AbsoluteFill>
      <Background base={C.bg2} glow="rgba(255,166,191,0.10)" gx={50} gy={70} grid={false} />
      {/* floor */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 960,
          bottom: 0,
          background: "linear-gradient(#141C33, #0B1020)",
        }}
      />
      {/* wall poster */}
      <div
        style={{
          position: "absolute",
          left: 1460,
          top: 110,
          width: 330,
          height: 220,
          background: "#F2E8D5",
          border: "12px solid #1A2238",
          transform: "rotate(3deg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: display,
          fontWeight: 900,
          color: "#B23A48",
          fontSize: 40,
          lineHeight: 1.05,
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        }}
      >
        SPORT
        <br />
        IST MORD
        <div style={{ fontFamily: body, fontSize: 18, color: "#555", marginTop: 8 }}>
          – Bernd, 2026
        </div>
      </div>

      <Couch width={900} style={{ position: "absolute", left: 510, top: 690, ...couchStyle }} />
      <div
        style={{
          position: "absolute",
          left: 700,
          top: 560,
          transformOrigin: "50% 100%",
          ...berndStyle,
        }}
      >
        <div style={{ transform: `scaleY(${mood === "sleep" ? breathe : 1})`, transformOrigin: "50% 100%" }}>
          <Bernd width={520} mood={mood} />
        </div>
      </div>
      {zzz
        ? [0, 1, 2].map((i) => {
            const t = (frame + i * 20) % 60;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 1150 + t * 1.6,
                  top: 560 - t * 3,
                  fontFamily: display,
                  fontWeight: 900,
                  fontSize: 40 + t * 0.5,
                  color: C.white,
                  opacity: interpolate(t, [0, 10, 45, 60], [0, 0.9, 0.9, 0]),
                }}
              >
                Z
              </div>
            );
          })
        : null}
      {children}
    </AbsoluteFill>
  );
};
