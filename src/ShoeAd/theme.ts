import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Variable fonts (latin subset) from Google Fonts, bundled locally so
// rendering works without network access.
export const display = "Unbounded";
export const body = "Inter";

loadFont({
  family: display,
  url: staticFile("fonts/Unbounded.woff2"),
  weight: "200 900",
});
loadFont({
  family: body,
  url: staticFile("fonts/Inter.woff2"),
  weight: "100 900",
});

export const C = {
  bg: "#05070D",
  bg2: "#0B1224",
  blue: "#1E6BFF",
  cyan: "#3DD9FF",
  white: "#F5F8FF",
  muted: "#8A96B5",
  pink: "#FFA6BF",
  pinkDark: "#F27C9C",
};

export const FPS = 30;
export const DURATION = 30 * FPS;
