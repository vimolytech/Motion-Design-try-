import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Bubble, pop, shake, SpeedLines, Words } from "../common";
import { Shoe } from "../Shoe";
import { C, display } from "../theme";
import { LivingRoom } from "./LivingRoom";

const HIT = 26;

export const Whoosh: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shoeX = interpolate(frame, [14, 38], [-1300, 2400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });

  // Bernd gets launched when the shoe passes
  const fly = interpolate(frame, [HIT, HIT + 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const berndX = fly * 1500;
  const berndY = -Math.sin(fly * Math.PI * 0.85) * 520 + fly * 200;
  const berndRot = fly * 540;

  const s = shake(frame, HIT, 28, 18);
  const tooLate = pop(frame, fps, 66, 12);

  return (
    <AbsoluteFill style={{ transform: `translate(${s.x}px, ${s.y}px)` }}>
      <LivingRoom
        mood={frame < 8 ? "sleep" : "shock"}
        berndStyle={{
          transform: `translate(${berndX}px, ${berndY}px) rotate(${berndRot}deg)`,
          transformOrigin: "50% 50%",
        }}
        couchStyle={{
          transform: `rotate(${shake(frame, HIT, 3, 18).x}deg)`,
        }}
      >
        {frame < HIT ? <Bubble text="Hä?!" delay={8} x={1130} y={430} size={52} /> : null}
      </LivingRoom>

      {frame >= 12 && frame <= 44 ? <SpeedLines speed={90} opacity={0.8} count={24} /> : null}

      {/* shoe with ghost trail */}
      {[3, 2, 1, 0].map((g) => (
        <div
          key={g}
          style={{
            position: "absolute",
            left: shoeX - g * 160,
            top: 560,
            opacity: g === 0 ? 1 : 0.25 / g,
            transform: "skewX(-12deg)",
          }}
        >
          <Shoe width={760} />
        </div>
      ))}

      {frame >= HIT - 2 ? (
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 120 }}>
          <Words
            text="WUSCH!"
            delay={HIT - 2}
            size={210}
            stagger={0}
            style={{ fontStyle: "italic", transform: "skewX(-10deg)", color: C.white }}
          />
        </AbsoluteFill>
      ) : null}

      {frame >= 66 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 470,
            textAlign: "center",
            fontFamily: display,
            fontWeight: 700,
            fontSize: 64,
            color: C.pink,
            transform: `scale(${tooLate})`,
          }}
        >
          Tschüss, Bernd.
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
