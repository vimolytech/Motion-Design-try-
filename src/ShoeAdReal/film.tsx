import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { pop } from "../ShoeAd/common";
import { body } from "../ShoeAd/theme";

export const W = 1920;
export const H = 1080;
export const BAR = 110; // cinematic letterbox height

export const ease = (
  frame: number,
  [a, b]: [number, number],
  [from, to]: [number, number],
  easing = Easing.inOut(Easing.cubic),
) =>
  interpolate(frame, [a, b], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

export type Cam = { s: number; x: number; y: number; blur?: number };

// Maps a pixel of the source photo to screen space, given the camera.
export const toScreen = (
  px: number,
  py: number,
  iw: number,
  ih: number,
  cam: Cam,
) => {
  const base = Math.max(W / iw, H / ih);
  const sx = (W - iw * base) / 2 + px * base;
  const sy = (H - ih * base) / 2 + py * base;
  return {
    x: W / 2 + (sx - W / 2) * cam.s + cam.x,
    y: H / 2 + (sy - H / 2) * cam.s + cam.y,
  };
};

export const Photo: React.FC<{
  src: string;
  cam: Cam;
  filter?: string;
}> = ({ src, cam, filter = "" }) => (
  <AbsoluteFill
    style={{
      transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.s})`,
      filter: `${cam.blur ? `blur(${cam.blur}px)` : ""} ${filter}`,
    }}
  >
    <Img
      src={staticFile(src)}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </AbsoluteFill>
);

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.09 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width={W} height={H}>
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={0.9}
            numOctaves={2}
            seed={frame % 12}
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={W} height={H} filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Letterbox: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: BAR, background: "#000" }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: BAR, background: "#000" }} />
  </>
);

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.55 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,${strength}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

// Diagonal light band sweeping across the frame.
export const LightSweep: React.FC<{ start: number; len?: number; opacity?: number }> = ({
  start,
  len = 40,
  opacity = 0.35,
}) => {
  const frame = useCurrentFrame();
  const t = ease(frame, [start, start + len], [-0.4, 1.4], Easing.inOut(Easing.quad));
  if (frame < start || frame > start + len) return null;
  return (
    <AbsoluteFill
      style={{
        mixBlendMode: "screen",
        opacity,
        background: `linear-gradient(105deg, transparent ${t * 100 - 12}%, rgba(255,255,255,0.9) ${t * 100}%, transparent ${t * 100 + 12}%)`,
        pointerEvents: "none",
      }}
    />
  );
};

export const FadeIn: React.FC<{ len?: number; children: React.ReactNode; color?: string }> = ({
  len = 10,
  children,
  color,
}) => {
  const frame = useCurrentFrame();
  const o = ease(frame, [0, len], [0, 1]);
  return (
    <AbsoluteFill style={{ opacity: color ? 1 : o, background: color }}>
      {color ? <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill> : children}
    </AbsoluteFill>
  );
};

// Minimal caption: small tracked label + headline, masked reveal.
export const Caption: React.FC<{
  label?: string;
  lines: string[];
  delay?: number;
  color?: string;
  accent?: string;
  size?: number;
  align?: "left" | "center" | "right";
  x?: number;
  y: number;
  width?: number;
}> = ({ label, lines, delay = 0, color = "#fff", accent = "rgba(255,255,255,0.7)", size = 72, align = "left", x = 140, y, width = 1640 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lp = pop(frame, fps, delay, 20);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        textAlign: align,
        fontFamily: body,
        color,
      }}
    >
      {label ? (
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.32em",
            color: accent,
            opacity: lp,
            transform: `translateY(${(1 - lp) * 12}px)`,
            marginBottom: 14,
          }}
        >
          {label}
        </div>
      ) : null}
      {lines.map((l, i) => {
        const p = pop(frame, fps, delay + 6 + i * 10, 20);
        return (
          <div key={i} style={{ overflow: "hidden", paddingBottom: size * 0.1 }}>
            <div
              style={{
                fontSize: size,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                transform: `translateY(${(1 - p) * 110}%)`,
              }}
            >
              {l}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const Callout: React.FC<{
  at: { x: number; y: number };
  label: string;
  dx: number;
  dy: number;
  delay: number;
  color?: string;
}> = ({ at, label, dx, dy, delay, color = "#111" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = ease(frame, [delay, delay + 14], [0, 1], Easing.out(Easing.cubic));
  const lp = pop(frame, fps, delay + 10, 20);
  if (frame < delay) return null;
  const ex = at.x + dx;
  const ey = at.y + dy;
  return (
    <>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <circle cx={at.x} cy={at.y} r={7 * d} fill={color} />
        <circle cx={at.x} cy={at.y} r={18 * d} fill="none" stroke={color} strokeWidth={1.5} opacity={0.6} />
        <line
          x1={at.x}
          y1={at.y}
          x2={at.x + dx * d}
          y2={at.y + dy * d}
          stroke={color}
          strokeWidth={1.5}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: dx >= 0 ? ex + 14 : undefined,
          right: dx < 0 ? W - ex + 14 : undefined,
          top: ey - 18,
          fontFamily: body,
          fontWeight: 700,
          fontSize: 28,
          color,
          opacity: lp,
          whiteSpace: "nowrap",
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </div>
    </>
  );
};
