import React from "react";
import { C } from "./theme";

// Side view of the NOVA X running shoe, toe pointing right.
export const Shoe: React.FC<{
  width: number;
  glow?: number;
  style?: React.CSSProperties;
}> = ({ width, glow = 1, style }) => {
  const laces = [0, 1, 2, 3, 4];
  return (
    <svg
      viewBox="0 0 600 300"
      width={width}
      height={width / 2}
      style={{ overflow: "visible", ...style }}
    >
      <defs>
        <linearGradient id="nx-mid" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={C.blue} />
          <stop offset="1" stopColor={C.cyan} />
        </linearGradient>
        <linearGradient id="nx-upper" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#2A2E3A" />
          <stop offset="1" stopColor="#0A0B10" />
        </linearGradient>
        <filter id="nx-blur" x="-50%" y="-200%" width="200%" height="500%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      {/* glow under the sole */}
      <ellipse
        cx={310}
        cy={276}
        rx={270}
        ry={16}
        fill={C.blue}
        opacity={0.7 * glow}
        filter="url(#nx-blur)"
      />

      {/* outsole */}
      <path
        d="M38,232 C40,258 70,268 110,268 L480,268 C540,268 582,252 586,226 L38,226 Z"
        fill="#0A1A3A"
      />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <rect
          key={i}
          x={90 + i * 50}
          y={262}
          width={26}
          height={6}
          rx={3}
          fill="#16306A"
        />
      ))}

      {/* Blue Boost midsole */}
      <path
        d="M34,196 C30,232 58,252 108,252 L478,252 C540,252 584,238 588,214 C589,204 582,198 570,197 L60,192 Z"
        fill="url(#nx-mid)"
      />
      <path
        d="M70,232 C150,214 230,240 320,226 S480,214 562,222"
        stroke={C.white}
        strokeOpacity={0.45}
        strokeWidth={4}
        fill="none"
      />

      {/* upper */}
      <path
        d="M40,205 C35,160 38,110 60,80 C70,66 95,62 112,70 C130,80 140,100 165,104 C200,108 225,98 245,105 L270,112 C330,140 420,160 500,170 C555,177 585,190 582,205 Z"
        fill="url(#nx-upper)"
      />
      {/* toe cap */}
      <path
        d="M440,165 C500,172 565,182 582,200 L583,205 L452,203 C446,190 442,178 440,165 Z"
        fill="#1C202A"
      />
      {/* heel counter */}
      <path
        d="M40,205 C35,160 38,110 60,80 C66,72 74,68 84,66 C78,100 82,160 100,203 Z"
        fill="#161922"
      />
      {/* reflective heel strip */}
      <path
        d="M54,104 C49,138 51,170 60,196"
        stroke={C.cyan}
        strokeWidth={7}
        strokeLinecap="round"
        fill="none"
      />
      {/* pull tab */}
      <path
        d="M66,76 L58,44 C57,38 64,34 70,37 L86,66 Z"
        fill={C.blue}
      />
      {/* collar lining */}
      <path
        d="M112,70 C130,80 140,100 165,104"
        stroke={C.blue}
        strokeWidth={6}
        strokeLinecap="round"
        fill="none"
      />
      {/* bolt logo */}
      <path
        d="M175,132 L268,132 L236,156 L318,156 L196,200 L226,172 L150,172 Z"
        fill={C.blue}
      />
      <path
        d="M175,132 L268,132 L236,156 L318,156 L196,200 L226,172 L150,172 Z"
        fill="none"
        stroke={C.cyan}
        strokeWidth={2}
        strokeOpacity={0.8}
      />
      {/* laces */}
      {laces.map((i) => {
        const x = 182 + i * 24;
        const y = 104 + i * 4;
        return (
          <line
            key={i}
            x1={x - 6}
            y1={y + 14}
            x2={x + 14}
            y2={y - 4}
            stroke={C.white}
            strokeWidth={6}
            strokeLinecap="round"
          />
        );
      })}
      {/* stitch line */}
      <path
        d="M110,200 C200,190 330,186 470,195"
        stroke={C.white}
        strokeOpacity={0.18}
        strokeWidth={2}
        strokeDasharray="8 8"
        fill="none"
      />
    </svg>
  );
};
