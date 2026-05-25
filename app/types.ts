export type ProgressMode =
  | "determinate"
  | "indeterminate"
  | "buffer"
  | "steps"
  | "timer";
export type ProgressOrientation = "horizontal" | "vertical";
export type ProgressShape = "square" | "round" | "pill";
export type ProgressEffect =
  | "none"
  | "stripes"
  | "glow"
  | "liquid"
  | "glitch"
  | "retro"
  | "pulse"
  | "neon"
  | "glass";
export type ProgressSurfaceStyle =
  | "solid"
  | "soft"
  | "glass"
  | "chrome"
  | "paper"
  | "neon";

// NEW TYPES
export type ProgressStatus =
  | "normal"
  | "active"
  | "success"
  | "error"
  | "warning";
export type ProgressSize = "xs" | "sm" | "md" | "lg" | "xl" | "custom";
export type ProgressLinecap = "round" | "butt" | "square";
export type ProgressDirection = "ltr" | "rtl";
export type ProgressLabelType = "text" | "icon" | "animated";
export type ProgressAnimatedIndicator =
  | "none"
  | "walking-person"
  | "running-dog"
  | "flying-bird"
  | "swimming-fish"
  | "crawling-snail"
  | "bouncing-ball"
  | "spinning-star"
  | "rocket"
  | "car"
  | "bicycle";

// Label position options (9-point grid + inside)
export type ProgressLabelPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "inside";
export type ProgressStatusLabelPosition = "above" | "inline" | "below";

// Multi-label configuration
export type ProgressLabelConfig = {
  id: string;
  position: ProgressLabelPosition;
  type: ProgressLabelType;
  // Text options
  format?: "percent" | "fraction" | "value" | "custom";
  customText?: string;
  // Icon options
  iconSource?: "library" | "custom";
  iconName?: string;
  customSvg?: string;
  // Animated options
  animatedIndicator?: ProgressAnimatedIndicator;
  // Common
  size?: number;
};

export type ProgressState = {
  // Basics
  value: number;
  min: number;
  max: number;
  bufferValue: number;
  mode: ProgressMode;
  orientation: ProgressOrientation;
  stepCount: number; // For 'steps' mode
  timerDuration: number; // For 'timer' mode
  direction: ProgressDirection; // RTL support

  // Styling
  width: number; // Length in px (or height if vertical)
  thickness: number; // Breadth in px
  radius: number; // Specific radius in px (if not shape=pill)
  shape: ProgressShape;
  sizePreset: ProgressSize; // Size presets (xs, sm, md, lg, xl, custom)
  strokeLinecap: ProgressLinecap; // End cap style

  // Colors
  colorMode: "solid" | "gradient" | "duotone";
  color1: string;
  color2: string; // End color for gradient
  color3: string; // Middle color for duotone
  trackColor: string;
  trackOpacity: number;

  // Status
  status: ProgressStatus;
  showStatusIcon: boolean; // Show checkmark/X/warning icon

  // Effects
  effect: ProgressEffect;
  surfaceStyle: ProgressSurfaceStyle;
  stripeColor: string;
  stripeSpeed: number;
  stripesAnimated: boolean; // Toggle stripe animation
  glowBlur: number;
  glitchIntensity: number;
  liquidViscosity: number;
  hasParticles: boolean;
  particleType: "confetti" | "sparks" | "fire";

  // 3D Options
  enable3D: boolean;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  depth: number; // Z-depth/thickness

  // Animation
  animationDuration: number; // Speed of animations in seconds
  disableAnimation: boolean; // Accessibility - disable all motion
  // Content (Multi-Label Support)
  labels: ProgressLabelConfig[];
  statusLabel: string;
  showStatusLabel: boolean;
  statusLabelPosition: ProgressStatusLabelPosition;

  // Success Marker
  successPercent: number; // Secondary success fill (0 = disabled)

  // Accessibility
  ariaLabel: string;
  ariaDescribedBy: string;
  ariaValueText: string;

  // Meta
  downloadName?: string;
};

export type ProgressUpdater = <K extends keyof ProgressState>(
  key: K,
  value: ProgressState[K],
) => void;

export type ProgressLabelsUpdater = (labels: ProgressLabelConfig[]) => void;

// Size preset thickness mappings
export const SIZE_PRESET_MAP: Record<ProgressSize, number> = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  custom: 24, // Default for custom, uses thickness slider
};

// Status color mappings
export const STATUS_COLOR_MAP: Record<ProgressStatus, string> = {
  normal: "#3b82f6", // Blue
  active: "#3b82f6", // Blue (same, but with pulse)
  success: "#22c55e", // Green
  error: "#ef4444", // Red
  warning: "#f59e0b", // Amber
};

export const SURFACE_STYLE_OPTIONS: {
  value: ProgressSurfaceStyle;
  label: string;
}[] = [
  { value: "solid", label: "Solid" },
  { value: "soft", label: "Soft" },
  { value: "glass", label: "Glass" },
  { value: "chrome", label: "Chrome" },
  { value: "paper", label: "Paper" },
  { value: "neon", label: "Neon" },
];

export const STATUS_LABEL_POSITION_OPTIONS: {
  value: ProgressStatusLabelPosition;
  label: string;
}[] = [
  { value: "above", label: "Above" },
  { value: "inline", label: "Inline" },
  { value: "below", label: "Below" },
];

export const INITIAL_PROGRESS_STATE: ProgressState = {
  value: 45,
  min: 0,
  max: 100,
  bufferValue: 70,
  mode: "determinate",
  orientation: "horizontal",
  stepCount: 5,
  timerDuration: 10,
  direction: "ltr",

  width: 300,
  thickness: 24,
  radius: 12,
  shape: "pill",
  sizePreset: "lg",
  strokeLinecap: "round",

  colorMode: "solid",
  color1: "#3b82f6",
  color2: "#8b5cf6",
  color3: "#93c5fd",
  trackColor: "#e2e8f0",
  trackOpacity: 0.2,

  status: "normal",
  showStatusIcon: false,

  effect: "none",
  surfaceStyle: "solid",
  stripeColor: "rgba(255,255,255,0.2)",
  stripeSpeed: 2,
  stripesAnimated: true,
  glowBlur: 10,
  glitchIntensity: 50,
  liquidViscosity: 10,
  hasParticles: false,
  particleType: "sparks",

  enable3D: false,
  rotateX: 15,
  rotateY: 30,
  rotateZ: 0,
  depth: 20,

  animationDuration: 0.3,
  disableAnimation: false,

  labels: [
    {
      id: "label-1",
      position: "top-center",
      type: "text",
      format: "percent",
      size: 14,
    },
  ],
  statusLabel: "On track",
  showStatusLabel: false,
  statusLabelPosition: "above",

  successPercent: 0,

  ariaLabel: "Progress",
  ariaDescribedBy: "",
  ariaValueText: "",
  downloadName: "progress-bar",
};
