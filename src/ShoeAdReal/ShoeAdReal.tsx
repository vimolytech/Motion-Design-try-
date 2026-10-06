import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { pop } from "../ShoeAd/common";
import { body, display } from "../ShoeAd/theme";
import {
  Callout,
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

// Realistic 30 s urban spot for the (fictional) NOVA X, built from stills.
// All photos are 1024×559 except the street plate (512×279).
const IW = 1024;
const IH = 559;

const Street: React.FC = () => {
  const f = useCurrentFrame();
  const cam = { s: ease(f, [0, 96], [1.25, 1.06]), x: 0, y: ease(f, [0, 96], [24, 0]) };
  return (
    <FadeIn len={20} color="#000">
      <Photo src="real/street.jpg" cam={cam} filter="brightness(0.85) contrast(1.12) saturate(0.9)" />
      <Vignette strength={0.7} />
      <Caption label="05:30 UHR" lines={["Die Stadt schläft noch."]} delay={14} y={720} size={68} />
    </FadeIn>
  );
};

const Snooze: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Caption lines={["Dein Wecker sagt: Snooze."]} delay={2} y={430} size={64} align="center" color="#8A8F99" />
    <Caption lines={["Deine Schuhe sagen: Nö."]} delay={38} y={530} size={64} align="center" />
  </AbsoluteFill>
);

const Side: React.FC = () => {
  const f = useCurrentFrame();
  const cam = {
    s: ease(f, [0, 120], [1.3, 1.0]),
    x: ease(f, [0, 120], [70, 0]),
    y: 30,
    blur: ease(f, [0, 22], [14, 0]),
  };
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      <Photo src="real/side-b.jpg" cam={cam} />
      <LightSweep start={40} len={45} opacity={0.5} />
      <Caption label="NOVA X" lines={["Leichter als jede Ausrede."]} delay={16} y={130} size={56} color="#111" accent="#888" />
    </AbsoluteFill>
  );
};

const Heel: React.FC = () => {
  const f = useCurrentFrame();
  const cam = { s: ease(f, [0, 150], [1.05, 1.25]), x: ease(f, [0, 150], [0, -60]), y: 0 };
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Photo src="real/heel.jpg" cam={cam} filter="contrast(1.08)" />
      <LightSweep start={55} len={50} opacity={0.3} />
      <Vignette strength={0.5} />
      <Caption label="GEL-DÄMPFUNG" lines={["Weich wie dein Bett.", "Nur schneller."]} delay={10} y={150} size={64} width={800} />
    </AbsoluteFill>
  );
};

const ThreeQuarter: React.FC = () => {
  const f = useCurrentFrame();
  const cam = { s: ease(f, [0, 150], [1.0, 1.1]), x: ease(f, [0, 150], [0, -30]), y: 20 };
  return (
    <FadeIn len={8} color="#fff">
      <Photo src="real/three-quarter.jpg" cam={cam} />
      <Callout at={toScreen(640, 330, IW, IH, cam)} label="Atmungsaktives Mesh" dx={180} dy={-150} delay={22} />
      <Callout at={toScreen(430, 300, IW, IH, cam)} label="Reflektierende Overlays" dx={-200} dy={-170} delay={44} />
      <Callout at={toScreen(251, 342, IW, IH, cam)} label="Gel-Ferse" dx={-120} dy={170} delay={66} />
      <Caption lines={["Atmet. Federt. Läuft."]} delay={6} y={130} size={52} color="#111" />
    </FadeIn>
  );
};

const BlackEdition: React.FC = () => {
  const f = useCurrentFrame();
  const cam = { s: ease(f, [0, 150], [1.15, 1.0]), x: ease(f, [0, 150], [-50, 30]), y: 0 };
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Photo src="real/hero-black.jpg" cam={cam} filter="contrast(1.08) saturate(1.05)" />
      <AbsoluteFill style={{ background: "linear-gradient(rgba(0,0,0,0.55), transparent 35%)" }} />
      <LightSweep start={70} len={45} opacity={0.25} />
      <Vignette strength={0.6} />
      <Caption label="NEU" lines={["Black Edition."]} delay={10} y={128} size={64} />
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = { s: ease(f, [0, 144], [1.12, 1.0]), x: 0, y: 0, blur: 5 };
  const logo = pop(f, fps, 8, 20);
  const tag = pop(f, fps, 30, 20);
  const joke = pop(f, fps, 70, 20);
  return (
    <FadeIn len={14} color="#000">
      <Photo src="real/street.jpg" cam={cam} filter="brightness(0.55) contrast(1.1)" />
      <Vignette strength={0.8} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", color: "#fff" }}>
        <div
          style={{
            fontFamily: display,
            fontWeight: 900,
            fontSize: 170,
            letterSpacing: `${0.02 + (1 - logo) * 0.2}em`,
            opacity: logo,
          }}
        >
          NOVA X
        </div>
        <div style={{ fontFamily: body, fontWeight: 700, fontSize: 46, opacity: tag, marginTop: 6 }}>
          Run the City.
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 150,
          textAlign: "center",
          fontFamily: body,
          fontWeight: 500,
          fontSize: 30,
          color: "rgba(255,255,255,0.75)",
          opacity: joke,
        }}
      >
        Snooze war gestern.
      </div>
    </FadeIn>
  );
};

const SCENES: { from: number; len: number; Comp: React.FC }[] = [
  { from: 0, len: 96, Comp: Street },
  { from: 96, len: 90, Comp: Snooze },
  { from: 186, len: 120, Comp: Side },
  { from: 306, len: 150, Comp: Heel },
  { from: 456, len: 150, Comp: ThreeQuarter },
  { from: 606, len: 150, Comp: BlackEdition },
  { from: 756, len: 144, Comp: EndCard },
];

export const ShoeAdReal: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {SCENES.map(({ from, len, Comp }) => (
      <Sequence key={from} from={from} durationInFrames={len}>
        <Comp />
      </Sequence>
    ))}
    <Grain />
    <Letterbox />
  </AbsoluteFill>
);
