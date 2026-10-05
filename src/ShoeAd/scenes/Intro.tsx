import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Background, Words } from "../common";
import { C } from "../theme";

const PULSE =
  "M0,760 L700,760 L760,760 L800,670 L850,860 L900,600 L950,820 L990,760 L1920,760";

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [0, 40], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const exit = interpolate(frame, [82, 100], [1, 1.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const exitOpacity = interpolate(frame, [86, 100], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Background glow="rgba(30,107,255,0.18)" />
      <AbsoluteFill style={{ transform: `scale(${exit})`, opacity: exitOpacity }}>
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          <path
            d={PULSE}
            pathLength={1}
            stroke={C.blue}
            strokeWidth={6}
            fill="none"
            strokeDasharray={1}
            strokeDashoffset={1 - draw}
            strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 0 18px ${C.blue})` }}
          />
        </svg>
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center", paddingBottom: 300 }}
        >
          <Words text="Jeder Läufer" delay={18} size={120} />
          <Words text="hat einen Gegner." delay={30} size={120} color={C.blue} />
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
