import {
  INITIAL_PROGRESS_STATE,
  type ProgressLabelConfig,
  type ProgressSurfaceStyle,
  type ProgressStatusLabelPosition,
  type ProgressState,
} from "../types";

export type ProgressPreset = {
  id: string;
  name: string;
  summary: string;
  family: string;
  mode: ProgressState["mode"];
  effect: ProgressState["effect"];
  sizePreset: ProgressState["sizePreset"];
  orientation: ProgressState["orientation"];
  tags: string[];
  state: Partial<ProgressState>;
};

type Theme = {
  id: string;
  name: string;
  color1: string;
  color2: string;
  color3: string;
  trackColor: string;
  trackOpacity: number;
};

type Archetype = {
  id: string;
  name: string;
  summary: string;
  tags: string[];
  mode: ProgressState["mode"];
  effect: ProgressState["effect"];
  sizePreset: ProgressState["sizePreset"];
  orientation: ProgressState["orientation"];
  status: ProgressState["status"];
  showStatusIcon: boolean;
  surfaceStyle?: ProgressSurfaceStyle;
  showStatusLabel?: boolean;
  statusLabel?: string;
  statusLabelPosition?: ProgressStatusLabelPosition;
  value: number;
  width: number;
  thickness: number;
  stepCount?: number;
  timerDuration?: number;
  bufferValue?: number;
  successPercent?: number;
  enable3D?: boolean;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  depth?: number;
  hasParticles?: boolean;
  particleType?: ProgressState["particleType"];
  stripesAnimated?: boolean;
  stripeSpeed?: number;
  stripeColor?: string;
  glitchIntensity?: number;
  liquidViscosity?: number;
  labels: () => ProgressLabelConfig[];
};

function labelConfig(
  position: ProgressLabelConfig["position"],
  format: NonNullable<ProgressLabelConfig["format"]>,
  size = 14,
): ProgressLabelConfig {
  return {
    id: `${position}-${format}-${size}`,
    position,
    type: "text",
    format,
    size,
  };
}

function animatedLabelConfig(
  position: ProgressLabelConfig["position"],
  animatedIndicator: NonNullable<ProgressLabelConfig["animatedIndicator"]>,
  size = 14,
): ProgressLabelConfig {
  return {
    id: `${position}-${animatedIndicator}-${size}`,
    position,
    type: "animated",
    animatedIndicator,
    size,
  };
}

const THEMES: Theme[] = [
  {
    id: "slate",
    name: "Slate",
    color1: "#334155",
    color2: "#64748b",
    color3: "#cbd5e1",
    trackColor: "#e2e8f0",
    trackOpacity: 0.22,
  },
  {
    id: "cobalt",
    name: "Cobalt",
    color1: "#2563eb",
    color2: "#60a5fa",
    color3: "#93c5fd",
    trackColor: "#dbeafe",
    trackOpacity: 0.24,
  },
  {
    id: "emerald",
    name: "Emerald",
    color1: "#059669",
    color2: "#34d399",
    color3: "#a7f3d0",
    trackColor: "#d1fae5",
    trackOpacity: 0.22,
  },
  {
    id: "sunset",
    name: "Sunset",
    color1: "#ea580c",
    color2: "#fb923c",
    color3: "#fdba74",
    trackColor: "#ffedd5",
    trackOpacity: 0.24,
  },
  {
    id: "rose",
    name: "Rose",
    color1: "#e11d48",
    color2: "#fb7185",
    color3: "#fda4af",
    trackColor: "#ffe4e6",
    trackOpacity: 0.24,
  },
  {
    id: "violet",
    name: "Violet",
    color1: "#7c3aed",
    color2: "#a78bfa",
    color3: "#c4b5fd",
    trackColor: "#ede9fe",
    trackOpacity: 0.22,
  },
  {
    id: "amber",
    name: "Amber",
    color1: "#d97706",
    color2: "#f59e0b",
    color3: "#fcd34d",
    trackColor: "#fef3c7",
    trackOpacity: 0.24,
  },
  {
    id: "mint",
    name: "Mint",
    color1: "#0f766e",
    color2: "#14b8a6",
    color3: "#5eead4",
    trackColor: "#ccfbf1",
    trackOpacity: 0.22,
  },
  {
    id: "arctic",
    name: "Arctic",
    color1: "#0369a1",
    color2: "#38bdf8",
    color3: "#7dd3fc",
    trackColor: "#e0f2fe",
    trackOpacity: 0.24,
  },
  {
    id: "cherry",
    name: "Cherry",
    color1: "#881337",
    color2: "#e11d48",
    color3: "#fb7185",
    trackColor: "#ffe4e6",
    trackOpacity: 0.24,
  },
  {
    id: "obsidian",
    name: "Obsidian",
    color1: "#0f172a",
    color2: "#1e293b",
    color3: "#334155",
    trackColor: "#1e293b",
    trackOpacity: 0.36,
  },
  {
    id: "indigo",
    name: "Indigo",
    color1: "#4338ca",
    color2: "#6366f1",
    color3: "#a5b4fc",
    trackColor: "#e0e7ff",
    trackOpacity: 0.24,
  },
];

const ARCHETYPES: Archetype[] = [
  {
    id: "calm-determinate",
    name: "Calm Determinate",
    summary: "Quiet product progress with a measured fill and soft status chip.",
    tags: ["determinate", "calm", "status", "clean"],
    mode: "determinate",
    effect: "glow",
    sizePreset: "lg",
    orientation: "horizontal",
    status: "active",
    showStatusIcon: true,
    surfaceStyle: "glass",
    showStatusLabel: true,
    statusLabel: "In flight",
    statusLabelPosition: "above",
    value: 72,
    width: 320,
    thickness: 22,
    labels: () => [labelConfig("top-center", "percent", 14)],
  },
  {
    id: "buffer-stream",
    name: "Buffer Stream",
    summary: "Streaming buffer with stripes and a secondary fill edge.",
    tags: ["buffer", "stripes", "streaming", "surface"],
    mode: "buffer",
    effect: "stripes",
    sizePreset: "md",
    orientation: "horizontal",
    status: "normal",
    showStatusIcon: true,
    surfaceStyle: "chrome",
    value: 54,
    width: 360,
    thickness: 20,
    bufferValue: 84,
    stripesAnimated: true,
    stripeSpeed: 4,
    stripeColor: "rgba(255,255,255,0.28)",
    hasParticles: true,
    particleType: "sparks",
    labels: () => [labelConfig("bottom-right", "fraction", 12)],
  },
  {
    id: "retro-steps",
    name: "Retro Steps",
    summary: "Segmented step tracker for milestone style progress.",
    tags: ["steps", "retro", "segments", "milestone"],
    mode: "steps",
    effect: "retro",
    sizePreset: "xl",
    orientation: "horizontal",
    status: "normal",
    showStatusIcon: false,
    surfaceStyle: "paper",
    showStatusLabel: true,
    statusLabel: "Milestone map",
    statusLabelPosition: "below",
    value: 5,
    width: 420,
    thickness: 24,
    stepCount: 8,
    labels: () => [labelConfig("center", "percent", 16)],
  },
  {
    id: "timer-neon",
    name: "Timer Neon",
    summary: "Vertical timer bar with neon glow and 3D depth.",
    tags: ["timer", "vertical", "neon", "3d"],
    mode: "timer",
    effect: "neon",
    sizePreset: "custom",
    orientation: "vertical",
    status: "warning",
    showStatusIcon: true,
    value: 64,
    width: 180,
    thickness: 18,
    timerDuration: 30,
    enable3D: true,
    rotateX: 18,
    rotateY: 24,
    rotateZ: 0,
    depth: 24,
    labels: () => [labelConfig("inside", "value", 13)],
  },
  {
    id: "glass-success",
    name: "Glass Success",
    summary: "Translucent success treatment with clear scorekeeping.",
    tags: ["glass", "success", "translucent", "label"],
    mode: "determinate",
    effect: "glass",
    sizePreset: "lg",
    orientation: "horizontal",
    status: "success",
    showStatusIcon: true,
    value: 88,
    width: 360,
    thickness: 18,
    successPercent: 94,
    labels: () => [labelConfig("top-left", "fraction", 12)],
  },
  {
    id: "glitch-error",
    name: "Glitch Error",
    summary: "Cyber error state with motion, particles, and emphasis.",
    tags: ["glitch", "error", "cyber", "particles"],
    mode: "determinate",
    effect: "glitch",
    sizePreset: "lg",
    orientation: "horizontal",
    status: "error",
    showStatusIcon: true,
    value: 31,
    width: 340,
    thickness: 22,
    hasParticles: true,
    particleType: "fire",
    glitchIntensity: 76,
    labels: () => [labelConfig("center-right", "percent", 14)],
  },
  {
    id: "liquid-pulse",
    name: "Liquid Pulse",
    summary: "Smooth liquid motion for softer active loading states.",
    tags: ["liquid", "pulse", "active", "organic"],
    mode: "indeterminate",
    effect: "liquid",
    sizePreset: "md",
    orientation: "horizontal",
    status: "active",
    showStatusIcon: true,
    value: 62,
    width: 300,
    thickness: 18,
    liquidViscosity: 14,
    labels: () => [animatedLabelConfig("top-center", "rocket", 14)],
  },
  {
    id: "amber-warning",
    name: "Amber Warning",
    summary: "Alerting fill with strong visibility and a readable warning badge.",
    tags: ["warning", "alert", "high-contrast", "badge"],
    mode: "determinate",
    effect: "pulse",
    sizePreset: "sm",
    orientation: "horizontal",
    status: "warning",
    showStatusIcon: true,
    surfaceStyle: "soft",
    showStatusLabel: true,
    statusLabel: "At risk",
    statusLabelPosition: "inline",
    value: 47,
    width: 280,
    thickness: 16,
    labels: () => [labelConfig("bottom-center", "value", 12)],
  },
  {
    id: "indigo-offscreen",
    name: "Indigo Offscreen",
    summary: "Vertical offscreen-safe rail with compact labels and motion.",
    tags: ["vertical", "rail", "compact", "editorial"],
    mode: "determinate",
    effect: "glow",
    sizePreset: "custom",
    orientation: "vertical",
    status: "normal",
    showStatusIcon: false,
    surfaceStyle: "solid",
    value: 58,
    width: 220,
    thickness: 14,
    labels: () => [labelConfig("center-left", "percent", 12)],
  },
];

function buildPreset(theme: Theme, archetype: Archetype): ProgressPreset {
  const accent = theme.color1;
  const secondary = theme.color2;
  const tertiary = theme.color3;
  const trackColor = theme.trackColor;

  return {
    id: `${theme.id}-${archetype.id}`,
    name: `${theme.name} ${archetype.name}`,
    summary: `${archetype.summary} ${theme.name.toLowerCase()} palette.`,
    family: theme.name,
    mode: archetype.mode,
    effect: archetype.effect,
    sizePreset: archetype.sizePreset,
    orientation: archetype.orientation,
    tags: [theme.id, archetype.mode, archetype.effect, archetype.sizePreset, ...archetype.tags],
    state: {
      ...INITIAL_PROGRESS_STATE,
      value: archetype.value,
      mode: archetype.mode,
      orientation: archetype.orientation,
      sizePreset: archetype.sizePreset,
      status: archetype.status,
      showStatusIcon: archetype.showStatusIcon,
      surfaceStyle: archetype.surfaceStyle ?? INITIAL_PROGRESS_STATE.surfaceStyle,
      effect: archetype.effect,
      colorMode:
        archetype.effect === "retro" || archetype.effect === "neon"
          ? "duotone"
          : archetype.effect === "glass" || archetype.effect === "glow"
            ? "gradient"
            : "solid",
      color1: accent,
      color2: secondary,
      color3: tertiary,
      trackColor,
      trackOpacity: theme.trackOpacity,
      width: archetype.width,
      thickness: archetype.thickness,
      stepCount: archetype.stepCount ?? INITIAL_PROGRESS_STATE.stepCount,
      timerDuration: archetype.timerDuration ?? INITIAL_PROGRESS_STATE.timerDuration,
      bufferValue: archetype.bufferValue ?? INITIAL_PROGRESS_STATE.bufferValue,
      successPercent: archetype.successPercent ?? INITIAL_PROGRESS_STATE.successPercent,
      enable3D: archetype.enable3D ?? false,
      rotateX: archetype.rotateX ?? INITIAL_PROGRESS_STATE.rotateX,
      rotateY: archetype.rotateY ?? INITIAL_PROGRESS_STATE.rotateY,
      rotateZ: archetype.rotateZ ?? INITIAL_PROGRESS_STATE.rotateZ,
      depth: archetype.depth ?? INITIAL_PROGRESS_STATE.depth,
      hasParticles: archetype.hasParticles ?? false,
      particleType: archetype.particleType ?? INITIAL_PROGRESS_STATE.particleType,
      stripesAnimated: archetype.stripesAnimated ?? INITIAL_PROGRESS_STATE.stripesAnimated,
      stripeSpeed: archetype.stripeSpeed ?? INITIAL_PROGRESS_STATE.stripeSpeed,
      stripeColor: archetype.stripeColor ?? INITIAL_PROGRESS_STATE.stripeColor,
      glitchIntensity: archetype.glitchIntensity ?? INITIAL_PROGRESS_STATE.glitchIntensity,
      liquidViscosity: archetype.liquidViscosity ?? INITIAL_PROGRESS_STATE.liquidViscosity,
      labels: archetype.labels(),
      showStatusLabel: archetype.showStatusLabel ?? INITIAL_PROGRESS_STATE.showStatusLabel,
      statusLabel: archetype.statusLabel ?? INITIAL_PROGRESS_STATE.statusLabel,
      statusLabelPosition:
        archetype.statusLabelPosition ?? INITIAL_PROGRESS_STATE.statusLabelPosition,
      downloadName: `${theme.id}-${archetype.id}`,
      ariaLabel: `${theme.name} ${archetype.name} progress`,
    },
  };
}

export const PROGRESS_PRESETS: ProgressPreset[] = THEMES.flatMap((theme) =>
  ARCHETYPES.map((archetype) => buildPreset(theme, archetype)),
);
