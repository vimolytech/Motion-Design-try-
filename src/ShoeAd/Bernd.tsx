import React from "react";
import { C } from "./theme";

export type Mood = "sleep" | "shock" | "tired" | "happy";

// Bernd, the "innerer Schweinehund": half pig, half dog, fully lazy.
export const Bernd: React.FC<{
  width: number;
  mood: Mood;
  headband?: boolean;
  shoes?: boolean;
  style?: React.CSSProperties;
}> = ({ width, mood, headband, shoes, style }) => {
  return (
    <svg
      viewBox="0 0 340 230"
      width={width}
      height={(width * 230) / 340}
      style={{ overflow: "visible", ...style }}
    >
      {/* curly tail */}
      <path
        d="M48,128 C22,118 18,146 36,148 C52,150 50,128 34,132"
        stroke={C.pinkDark}
        strokeWidth={7}
        strokeLinecap="round"
        fill="none"
      />
      {/* legs */}
      {[92, 132, 188, 224].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={206} rx={16} ry={16} fill={C.pinkDark} />
          {shoes ? (
            <g>
              <rect x={x - 22} y={206} width={48} height={20} rx={10} fill="#111" />
              <rect x={x - 22} y={220} width={48} height={8} rx={4} fill={C.cyan} />
            </g>
          ) : null}
        </g>
      ))}
      {/* body */}
      <ellipse cx={152} cy={140} rx={110} ry={58} fill={C.pink} />
      <ellipse cx={118} cy={118} rx={34} ry={22} fill="#C98A6B" />
      <ellipse cx={170} cy={168} rx={60} ry={18} fill="#FFC2D3" opacity={0.6} />

      {/* head */}
      <circle cx={250} cy={104} r={58} fill={C.pink} />
      {/* back ear */}
      <path d="M268,52 L292,30 L292,70 Z" fill={C.pinkDark} />
      {/* floppy dog ear */}
      <path
        d="M222,56 C196,50 182,86 192,118 C206,106 220,86 232,60 Z"
        fill="#A0674E"
      />
      {headband ? (
        <path
          d="M200,74 C230,58 270,52 304,66"
          stroke={C.blue}
          strokeWidth={14}
          strokeLinecap="round"
          fill="none"
        />
      ) : null}

      {/* cheek */}
      <circle cx={240} cy={130} r={11} fill={C.pinkDark} opacity={0.45} />

      {/* eyes */}
      {mood === "sleep" ? (
        <g stroke="#3A1F2A" strokeWidth={5} strokeLinecap="round" fill="none">
          <path d="M232,98 Q242,106 252,98" />
          <path d="M262,96 Q272,104 282,96" />
        </g>
      ) : null}
      {mood === "shock" ? (
        <g>
          <circle cx={240} cy={94} r={15} fill="#fff" />
          <circle cx={274} cy={92} r={15} fill="#fff" />
          <circle cx={242} cy={95} r={6} fill="#1A0E14" />
          <circle cx={276} cy={93} r={6} fill="#1A0E14" />
        </g>
      ) : null}
      {mood === "tired" ? (
        <g stroke="#3A1F2A" strokeWidth={5} strokeLinecap="round" fill="none">
          <path d="M230,100 L254,96" />
          <path d="M262,94 L284,92" />
        </g>
      ) : null}
      {mood === "happy" ? (
        <g stroke="#3A1F2A" strokeWidth={5} strokeLinecap="round" fill="none">
          <path d="M232,102 Q242,90 252,102" />
          <path d="M262,100 Q272,88 282,100" />
        </g>
      ) : null}

      {/* snout */}
      <ellipse cx={296} cy={118} rx={26} ry={19} fill={C.pinkDark} />
      <ellipse cx={288} cy={118} rx={4} ry={7} fill="#7A2F45" />
      <ellipse cx={304} cy={118} rx={4} ry={7} fill="#7A2F45" />

      {/* mouth */}
      {mood === "shock" ? (
        <ellipse cx={270} cy={146} rx={10} ry={13} fill="#3A1F2A" />
      ) : null}
      {mood === "tired" ? (
        <g>
          <path d="M256,142 Q272,150 288,142" stroke="#3A1F2A" strokeWidth={4} fill="none" />
          <path d="M268,146 C266,170 284,172 284,148 Z" fill="#FF5E7E" />
        </g>
      ) : null}
      {mood === "happy" ? (
        <path
          d="M252,140 Q270,160 290,140"
          stroke="#3A1F2A"
          strokeWidth={5}
          strokeLinecap="round"
          fill="none"
        />
      ) : null}
      {mood === "sleep" ? (
        <path d="M262,144 Q270,148 278,144" stroke="#3A1F2A" strokeWidth={4} fill="none" />
      ) : null}
    </svg>
  );
};

export const Couch: React.FC<{ width: number; style?: React.CSSProperties }> = ({
  width,
  style,
}) => (
  <svg viewBox="0 0 600 260" width={width} height={(width * 260) / 600} style={style}>
    <rect x={40} y={40} width={520} height={130} rx={40} fill="#26314F" />
    <rect x={0} y={110} width={110} height={130} rx={36} fill="#2F3B5E" />
    <rect x={490} y={110} width={110} height={130} rx={36} fill="#2F3B5E" />
    <rect x={80} y={140} width={440} height={80} rx={24} fill="#3A4870" />
    <rect x={60} y={230} width={24} height={30} rx={6} fill="#1A2238" />
    <rect x={516} y={230} width={24} height={30} rx={6} fill="#1A2238" />
  </svg>
);
