import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { body, C, display } from "./theme";

export const pop = (frame: number, fps: number, delay = 0, damping = 14) =>
  spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping, stiffness: 160, mass: 0.6 },
  });

export const shake = (frame: number, start: number, amp: number, len = 14) => {
  const t = frame - start;
  if (t < 0 || t > len) return { x: 0, y: 0 };
  const decay = 1 - t / len;
  return {
    x: Math.sin(t * 2.7) * amp * decay,
    y: Math.cos(t * 3.1) * amp * decay,
  };
};

// Word-by-word masked reveal.
export const Words: React.FC<{
  text: string;
  delay?: number;
  size: number;
  color?: string;
  font?: string;
  weight?: number;
  stagger?: number;
  colors?: Record<number, string>;
  style?: React.CSSProperties;
}> = ({
  text,
  delay = 0,
  size,
  color = C.white,
  font = display,
  weight = 900,
  stagger = 4,
  colors,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        columnGap: size * 0.28,
        fontFamily: font,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.1,
        letterSpacing: font === display ? "-0.02em" : 0,
        ...style,
      }}
    >
      {text.split(" ").map((w, i) => {
        const p = pop(frame, fps, delay + i * stagger, 16);
        return (
          <span
            key={i}
            style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.12 }}
          >
            <span
              style={{
                display: "inline-block",
                transform: `translateY(${(1 - p) * 110}%)`,
                color: colors?.[i] ?? color,
              }}
            >
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
};

export const Background: React.FC<{
  base?: string;
  glow?: string;
  gx?: number;
  gy?: number;
  grid?: boolean;
  gridShift?: number;
}> = ({ base = C.bg, glow = "rgba(30,107,255,0.35)", gx = 50, gy = 55, grid = true, gridShift = 0 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at ${gx}% ${gy}%, ${glow} 0%, transparent 60%), ${base}`,
    }}
  >
    {grid ? (
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          backgroundPosition: `${-gridShift}px 0px`,
          maskImage: "radial-gradient(circle at 50% 50%, black 30%, transparent 80%)",
        }}
      />
    ) : null}
  </AbsoluteFill>
);

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background: "radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)",
      pointerEvents: "none",
    }}
  />
);

export const SpeedLines: React.FC<{ speed?: number; opacity?: number; count?: number }> = ({
  speed = 60,
  opacity = 0.5,
  count = 18,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity }}>
      {new Array(count).fill(0).map((_, i) => {
        const y = (i * 997) % 1080;
        const len = 200 + ((i * 131) % 400);
        const x = 1920 + 600 - ((frame * speed + i * 377) % (1920 + 1200));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: len,
              height: i % 3 === 0 ? 4 : 2,
              borderRadius: 2,
              background: `linear-gradient(90deg, ${i % 2 ? C.cyan : C.white}, transparent)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Bubble: React.FC<{
  text: string;
  delay: number;
  x: number;
  y: number;
  size?: number;
  tail?: "left" | "right";
}> = ({ text, delay, x, y, size = 46, tail = "left" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, delay, 10);
  if (frame < delay) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${p})`,
        transformOrigin: tail === "left" ? "0% 100%" : "100% 100%",
        background: C.white,
        color: C.bg,
        fontFamily: body,
        fontWeight: 800,
        fontSize: size,
        padding: `${size * 0.35}px ${size * 0.6}px`,
        borderRadius: size * 0.7,
        whiteSpace: "nowrap",
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      }}
    >
      {text}
      <div
        style={{
          position: "absolute",
          bottom: -size * 0.3,
          [tail]: size * 0.6,
          width: size * 0.7,
          height: size * 0.7,
          background: C.white,
          transform: "rotate(45deg)",
          borderRadius: 4,
        }}
      />
    </div>
  );
};

export const Flash: React.FC<{ at: number; color?: string; len?: number }> = ({
  at,
  color = C.white,
  len = 8,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at - 2, at, at + len], [0, 0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (o <= 0) return null;
  return <AbsoluteFill style={{ background: color, opacity: o, pointerEvents: "none" }} />;
};
