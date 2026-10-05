import { AbsoluteFill, Sequence } from "remotion";
import { Flash, Vignette } from "./common";
import { EndCard } from "./scenes/EndCard";
import { Hero } from "./scenes/Hero";
import { Intro } from "./scenes/Intro";
import { MeetBernd } from "./scenes/MeetBernd";
import { Run } from "./scenes/Run";
import { Whoosh } from "./scenes/Whoosh";
import { C } from "./theme";

// 30 s spot @ 30 fps for the (fictional) NOVA X running shoe.
const SCENES = [
  { from: 0, len: 100, Comp: Intro },
  { from: 100, len: 180, Comp: MeetBernd },
  { from: 280, len: 100, Comp: Whoosh },
  { from: 380, len: 240, Comp: Hero },
  { from: 620, len: 160, Comp: Run },
  { from: 780, len: 120, Comp: EndCard },
];

export const ShoeAd: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    {SCENES.map(({ from, len, Comp }) => (
      <Sequence key={from} from={from} durationInFrames={len}>
        <Comp />
      </Sequence>
    ))}
    <Vignette />
    <Flash at={380} color={C.cyan} />
    <Flash at={620} />
    <Flash at={780} color={C.cyan} />
  </AbsoluteFill>
);
