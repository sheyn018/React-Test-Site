import { LibraryStyle } from "@/types/style";
import tinycolor from "tinycolor2";

export function pickTextColorBasedOnBgColorSimple(bgColor, lightColor, darkColor) {
  const color = bgColor.charAt(0) === "#" ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16); // hexToR
  const g = parseInt(color.substring(2, 4), 16); // hexToG
  const b = parseInt(color.substring(4, 6), 16); // hexToB
  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? darkColor : lightColor;
}

export const dynamicTitleColor = (bgColor) =>
  pickTextColorBasedOnBgColorSimple(bgColor, "white", "black");
export const dynamicMutedColor = (bgColor) =>
  pickTextColorBasedOnBgColorSimple(bgColor, "whiteAlpha.200", "blackAlpha.700");
export const dynamicSubtitleColor = (bgColor) =>
  pickTextColorBasedOnBgColorSimple(bgColor, "whiteAlpha.700", "blackAlpha.600");

export const dynamicHoverFilter = (bgColor) =>
  bgColor !== "white" && bgColor !== "#FFFFFF"
    ? pickTextColorBasedOnBgColorSimple(bgColor, "brightness(1.1)", "brightness(0.9)")
    : undefined;

// create a fixed colorscheme based on the organization name
export function getAvatarColor(name: string) {
  // pastel colors
  const colors = ["#4d4c4b", "#daa636", "#9a645b", "#4d4c4b"];
  const colorIndex =
    name
      .split("")
      .map((char) => char.charCodeAt(0))
      .reduce((acc, curr) => acc + curr, 0) % colors.length;

  return colors[colorIndex];
}

// return colorscheme type

export function getColorSchemeFromLibrary(libraryStyles: LibraryStyle) {
  if (!libraryStyles) {
    return {};
  }
  const { backgroundColor: rawBg } = libraryStyles;
  const bg = libraryStyles.backgroundColor ? `${rawBg} !important` : "white";
  const primary = libraryStyles.color ?? "blue.600";
  const isPrimaryLight = tinycolor(primary).isLight();
  const brightnessThreshold = 248; // Adjust this value based on your needs
  const primaryBrightness = tinycolor(primary).getBrightness();
  const isWhite = primaryBrightness > brightnessThreshold;

  let primarySubtle;
  if (isPrimaryLight) {
    if (isWhite) {
      primarySubtle = tinycolor(primary).darken(10).toString();
    } else {
      if (primaryBrightness < 240) {
        primarySubtle = tinycolor(primary).lighten(40).toString();
      } else {
        primarySubtle = primary;
      }
    }
  } else {
    const lightenedColor = tinycolor(primary).lighten(80);
    if (lightenedColor.getBrightness() > 300) {
      // Adjust this value based on your needs
      primarySubtle = tinycolor(primary).lighten(30).toString();
    } else if (lightenedColor.getBrightness() > 150) {
      primarySubtle = tinycolor(primary).lighten(65).toString();
    } else {
      primarySubtle = tinycolor(primary).lighten(70).toString();
    }
  }
  const primaryInverted = dynamicTitleColor(primary);
  const subtle = libraryStyles.backgroundColor ? dynamicSubtitleColor(rawBg) : "subtle";
  const inverted = libraryStyles.backgroundColor ? dynamicTitleColor(rawBg) : "default";
  const filter = rawBg !== "white" && rawBg !== "#FFFFFF" ? "brightness(0.9)" : undefined;
  const muted = libraryStyles.backgroundColor ? dynamicMutedColor(rawBg) : "muted";

  return {
    rawBg,
    primary,
    primarySubtle,
    primaryInverted,
    bg,
    inverted,
    subtle,
    filter,
    muted,
  };
}
