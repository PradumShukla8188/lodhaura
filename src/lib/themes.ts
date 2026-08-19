export type ColorThemeId =
  | "village"
  | "ocean"
  | "royal"
  | "sunset"
  | "forest"
  | "rose";

export interface ThemePreset {
  id: ColorThemeId;
  name: string;
  description: string;
  swatch: string;
  cssVars: {
    "--primary": string;
    "--primary-foreground": string;
    "--secondary": string;
    "--secondary-foreground": string;
    "--accent": string;
    "--accent-foreground": string;
    "--gradient-from": string;
    "--gradient-via": string;
    "--gradient-to": string;
    "--ring": string;
  };
}

export const themePresets: Record<ColorThemeId, ThemePreset> = {
  village: {
    id: "village",
    name: "Village",
    description: "Teal & saffron — Lodhaura default",
    swatch: "#0F766E",
    cssVars: {
      "--primary": "#0F766E",
      "--primary-foreground": "#FFFFFF",
      "--secondary": "#16A34A",
      "--secondary-foreground": "#FFFFFF",
      "--accent": "#F59E0B",
      "--accent-foreground": "#1C1917",
      "--gradient-from": "#0F766E",
      "--gradient-via": "#16A34A",
      "--gradient-to": "#F59E0B",
      "--ring": "#0F766E",
    },
  },
  ocean: {
    id: "ocean",
    name: "Ocean",
    description: "Deep blue & aqua waves",
    swatch: "#0369A1",
    cssVars: {
      "--primary": "#0369A1",
      "--primary-foreground": "#FFFFFF",
      "--secondary": "#0891B2",
      "--secondary-foreground": "#FFFFFF",
      "--accent": "#38BDF8",
      "--accent-foreground": "#0C4A6E",
      "--gradient-from": "#0369A1",
      "--gradient-via": "#0891B2",
      "--gradient-to": "#38BDF8",
      "--ring": "#0369A1",
    },
  },
  royal: {
    id: "royal",
    name: "Royal",
    description: "Regal purple & gold",
    swatch: "#6D28D9",
    cssVars: {
      "--primary": "#6D28D9",
      "--primary-foreground": "#FFFFFF",
      "--secondary": "#7C3AED",
      "--secondary-foreground": "#FFFFFF",
      "--accent": "#FBBF24",
      "--accent-foreground": "#422006",
      "--gradient-from": "#6D28D9",
      "--gradient-via": "#7C3AED",
      "--gradient-to": "#FBBF24",
      "--ring": "#6D28D9",
    },
  },
  sunset: {
    id: "sunset",
    name: "Sunset",
    description: "Warm orange & coral glow",
    swatch: "#EA580C",
    cssVars: {
      "--primary": "#EA580C",
      "--primary-foreground": "#FFFFFF",
      "--secondary": "#F97316",
      "--secondary-foreground": "#FFFFFF",
      "--accent": "#FBBF24",
      "--accent-foreground": "#431407",
      "--gradient-from": "#EA580C",
      "--gradient-via": "#F97316",
      "--gradient-to": "#FBBF24",
      "--ring": "#EA580C",
    },
  },
  forest: {
    id: "forest",
    name: "Forest",
    description: "Earthy greens & moss",
    swatch: "#166534",
    cssVars: {
      "--primary": "#166534",
      "--primary-foreground": "#FFFFFF",
      "--secondary": "#15803D",
      "--secondary-foreground": "#FFFFFF",
      "--accent": "#84CC16",
      "--accent-foreground": "#14532D",
      "--gradient-from": "#166534",
      "--gradient-via": "#15803D",
      "--gradient-to": "#84CC16",
      "--ring": "#166534",
    },
  },
  rose: {
    id: "rose",
    name: "Rose",
    description: "Soft pink & rose gold",
    swatch: "#E11D48",
    cssVars: {
      "--primary": "#E11D48",
      "--primary-foreground": "#FFFFFF",
      "--secondary": "#F43F5E",
      "--secondary-foreground": "#FFFFFF",
      "--accent": "#FDA4AF",
      "--accent-foreground": "#881337",
      "--gradient-from": "#E11D48",
      "--gradient-via": "#F43F5E",
      "--gradient-to": "#FDA4AF",
      "--ring": "#E11D48",
    },
  },
};

export const defaultColorTheme: ColorThemeId = "village";

export const colorThemeIds = Object.keys(themePresets) as ColorThemeId[];

export function applyColorTheme(themeId: ColorThemeId) {
  if (typeof document === "undefined") return;

  const preset = themePresets[themeId];
  const root = document.documentElement;

  root.setAttribute("data-color-theme", themeId);

  Object.entries(preset.cssVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}
