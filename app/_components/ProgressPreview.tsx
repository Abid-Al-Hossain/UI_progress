import React, { useMemo } from "react";
import {
  type ProgressLabelConfig,
  type ProgressState,
  STATUS_COLOR_MAP,
} from "../types";
import { motion } from "framer-motion";
import { AnimatedIndicator } from "./AnimatedIndicator";
import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  LoaderCircle,
  XCircle,
} from "lucide-react";

type ParticleModel = {
  className: string;
  style: ParticleStyle;
};

type ParticleStyle = React.CSSProperties & {
  [customProperty: `--${string}`]: string | number | undefined;
};

function createSeededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash >>> 0;
}

function getParticleCount(type: string) {
  switch (type) {
    case "fire":
      return 24;
    case "confetti":
      return 24;
    case "sparks":
    default:
      return 24;
  }
}

function withParticleVars(
  style: React.CSSProperties,
  vars: Record<`--${string}`, string | number>,
): ParticleStyle {
  return {
    ...style,
    ...vars,
  };
}

function getSurfaceFrameStyle(state: ProgressState, statusColor: string) {
  switch (state.surfaceStyle) {
    case "glass":
      return {
        background: "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        boxShadow:
          state.effect === "glow"
            ? `0 0 ${state.glowBlur}px ${statusColor}`
            : "none",
      };
    case "chrome":
      return {
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.24), rgba(255,255,255,0.06))",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.18), 0 0 ${Math.max(8, state.glowBlur)}px rgba(255,255,255,0.18)`,
      };
    case "paper":
      return {
        background: "rgba(248, 250, 252, 0.92)",
        border: "1px solid rgba(148, 163, 184, 0.22)",
        boxShadow: "0 8px 30px rgba(15, 23, 42, 0.08)",
      };
    case "neon":
      return {
        background: "rgba(2, 6, 23, 0.66)",
        border: "1px solid rgba(56, 189, 248, 0.34)",
        boxShadow: `0 0 ${Math.max(12, state.glowBlur)}px ${statusColor}, inset 0 0 0 1px rgba(255,255,255,0.04)`,
      };
    case "soft":
      return {
        background: "rgba(15, 23, 42, 0.08)",
        border: "1px solid rgba(148, 163, 184, 0.18)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
      };
    case "solid":
    default:
      return {
        background: "transparent",
        border: "none",
        boxShadow: state.effect === "glow" ? `0 0 ${state.glowBlur}px ${statusColor}` : "none",
      };
  }
}

function getStatusLabelStyle(position: ProgressState["statusLabelPosition"]) {
  switch (position) {
    case "inline":
      return {
        position: "absolute" as const,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 15,
      };
    case "below":
      return {
        marginTop: 10,
      };
    case "above":
    default:
      return {
        marginBottom: 10,
      };
  }
}

export function ProgressPreview({ state }: { state: ProgressState }) {
  const {
    value,
    max,
    min,
    bufferValue,
    width,
    thickness,
    radius,
    shape,
    colorMode,
    color1,
    color2,
    trackColor,
    trackOpacity,
    surfaceStyle,
    effect,
    stripeColor,
    stripeSpeed,
    glowBlur,
    liquidViscosity,
    orientation,
    hasParticles,
    particleType,
    mode,
    stepCount,
    timerDuration,
    direction,
    status,
    showStatusIcon,
    showStatusLabel,
    statusLabel,
    statusLabelPosition,
    successPercent,
    ariaLabel,
    ariaDescribedBy,
    ariaValueText,
    enable3D,
    focusRingEnabled,
    focusRingWidth,
    focusRingOffset,
    focusRingColor,
    transitionDuration,
    transitionEasing,
    disabled,
    disabledOpacity,
    disabledCursor,
    stepsCompletedColor,
    stepsActiveColor,
    stepsInactiveColor,
  } = state;
  const [isFocused, setIsFocused] = React.useState(false);
  const wrapperStyle: React.CSSProperties = {
    opacity: disabled ? disabledOpacity : 1,
    pointerEvents: disabled ? "none" : undefined,
    cursor: disabled ? disabledCursor : undefined,
    transition: transitionDuration > 0 ? `opacity ${transitionDuration}ms ${transitionEasing}` : undefined,
    outline: isFocused && focusRingEnabled ? `${focusRingWidth}px solid ${focusRingColor}` : undefined,
    outlineOffset: isFocused && focusRingEnabled ? focusRingOffset : undefined,
  };
  const wrapperProps = {
    tabIndex: focusRingEnabled && !disabled ? 0 : undefined,
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  };

  const percent = Math.min(
    100,
    Math.max(0, ((value - min) / (max - min)) * 100),
  );

  const isVertical = orientation === "vertical";
  const isRtl = direction === "rtl";
  const barRadius = shape === "pill" ? 9999 : shape === "square" ? 0 : radius;
  const statusColor = status !== "normal" ? STATUS_COLOR_MAP[status] : color1;
  const visibleStatusLabel = (statusLabel || status).trim();
  const successPercentValue =
    successPercent > 0
      ? Math.min(100, Math.max(0, ((successPercent - min) / (max - min)) * 100))
      : 0;
  const particleSeed = useMemo(() => {
    return hashString(
      [
        particleType,
        String(value),
        String(max),
        String(min),
        String(percent.toFixed(2)),
        String(width),
        String(thickness),
      ].join("|"),
    );
  }, [particleType, value, max, min, percent, width, thickness]);

  const particles = useMemo<ParticleModel[]>(() => {
    if (!hasParticles) return [];

    const rand = createSeededRandom(particleSeed);
    const count = getParticleCount(particleType);

    return Array.from({ length: count }, (_, i) => {
      const baseDelay = (i % 5) * 0.1;
      const randomX = (i % 2 === 0 ? 1 : -1) * (rand() * 50 + 10);
      const randomY = -(rand() * 80 + 20);
      const duration = 0.8 + rand() * 0.6;
      const delay = rand() * 0.5;
      const rotation = rand() * 360;

      const getParticleProps = (): ParticleModel => {
        switch (particleType) {
          case "fire":
            return {
              className: "particle-fire",
              style: {
                position: "absolute",
                top: 0,
                left: 0,
                background: [
                  "#ff9f43",
                  "#ff6b6b",
                  "#feca57",
                  "#ff9ff3",
                ][i % 4],
                width: 4 + rand() * 4,
                height: 4 + rand() * 4,
                borderRadius: "50%",
                boxShadow: "0 0 4px rgba(255, 100, 0, 0.6)",
              },
            };
          case "confetti":
            return {
              className: "particle-confetti",
              style: {
                position: "absolute",
                top: 0,
                left: 0,
                background: [
                  "#a8e6cf",
                  "#dcedc1",
                  "#ffd3b6",
                  "#ffaaa5",
                  "#ff8b94",
                ][i % 5],
                width: 6,
                height: 10,
                borderRadius: i % 2 === 0 ? "0%" : "50%",
              },
            };
          case "sparks":
          default:
            return {
              className: "particle-sparks",
              style: {
                position: "absolute",
                top: 0,
                left: 0,
                background: "#fff",
                width: 3,
                height: 3,
                borderRadius: "50%",
                boxShadow: "0 0 6px #fff, 0 0 12px #ffff00",
              },
            };
        }
      };

      const { className, style } = getParticleProps();

      return {
        className,
        style: withParticleVars(style, {
          "--tx": `${randomX}px`,
          "--ty": `${randomY}px`,
          "--r": `${rotation}deg`,
          "--dur": `${duration}s`,
          "--del": `${delay + baseDelay}s`,
        }),
      };
    });
  }, [hasParticles, particleSeed, particleType]);

  // --- 3D RENDERER ---
  if (enable3D) {
    return (
      <div className="relative flex flex-col items-center justify-center" style={wrapperStyle} {...wrapperProps}>
        {showStatusLabel && statusLabelPosition === "above" ? (
          <div
            className="mb-3 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide"
            style={{
              color: statusColor,
              background: "color-mix(in oklab, var(--bg) 78%, transparent)",
              border: `1px solid color-mix(in oklab, ${statusColor} 25%, transparent)`,
            }}
          >
            {visibleStatusLabel}
          </div>
        ) : null}
        <ThreeDProgressBar
          state={state}
          percent={percent}
          isVertical={isVertical}
          isRtl={isRtl}
        />
        {successPercentValue > 0 ? (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              [isVertical ? "bottom" : isRtl ? "right" : "left"]: 0,
              [isVertical ? "width" : "height"]: "100%",
              [isVertical ? "height" : "width"]: `${successPercentValue}%`,
              borderRadius: barRadius,
              background: STATUS_COLOR_MAP.success,
              opacity: 0.28,
              pointerEvents: "none",
              zIndex: 3,
            }}
          />
        ) : null}
        {showStatusIcon && status !== "normal" ? renderStatusBadge(statusColor) : null}
        {showStatusLabel && statusLabelPosition === "below" ? (
          <div
            className="mt-3 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide"
            style={{
              color: statusColor,
              background: "color-mix(in oklab, var(--bg) 78%, transparent)",
              border: `1px solid color-mix(in oklab, ${statusColor} 25%, transparent)`,
            }}
          >
            {visibleStatusLabel}
          </div>
        ) : null}
      </div>
    );
  }

  // --- 2D RENDERER (Original + New Effects) ---
  const bufferPercent = Math.min(
    100,
    Math.max(0, ((bufferValue - min) / (max - min)) * 100),
  );

  const fillBackground =
    colorMode === "gradient"
      ? `linear-gradient(${isVertical ? "to top" : isRtl ? "to left" : "to right"}, ${statusColor}, ${color2})`
      : colorMode === "duotone"
        ? `linear-gradient(${isVertical ? "to top" : isRtl ? "to left" : "to right"}, ${statusColor}, ${state.color3 || color2}, ${color2})`
        : statusColor;

  // Effects Logic
  const isLiquid = effect === "liquid";
  const isGlitch = effect === "glitch";
  const isStripes = effect === "stripes";
  const isGlow = effect === "glow";
  const isNeon = effect === "neon";
  const isRetro = effect === "retro";
  const isPulse = effect === "pulse";

  // Dynamic Styles
  const sizeStyle = isVertical
    ? { width: thickness, height: width }
    : { width: width, height: thickness };

  // Neon & Glow Shadows
  const getGlowStyle = () => {
    if (isGlow) return `0 0 ${glowBlur}px ${statusColor}`;
    if (isNeon) {
      return `
        0 0 5px ${statusColor},
        0 0 10px ${statusColor},
        0 0 20px ${statusColor},
        0 0 40px ${statusColor}
      `;
    }
    return "none";
  };

  // Mode Logic - for 2D
  const isIndeterminate = mode === "indeterminate";
  const isSteps = mode === "steps";
  const isBuffer = mode === "buffer";
  const isTimer = mode === "timer";

  const surfaceFrameStyle = getSurfaceFrameStyle(state, statusColor);
  const { boxShadow: surfaceBoxShadow, ...surfaceFrameStyleRest } =
    surfaceFrameStyle;
  const resolvedFrameShadow = [surfaceBoxShadow, getGlowStyle()]
    .filter((value) => value && value !== "none")
    .join(", ");

  return (
    <div className="relative flex flex-col items-center justify-center" style={wrapperStyle} {...wrapperProps}>
      {showStatusLabel && statusLabelPosition === "above" ? (
        <div
          className="mb-3 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide"
          style={{
            color: statusColor,
            background: "color-mix(in oklab, var(--bg) 78%, transparent)",
            border: `1px solid color-mix(in oklab, ${statusColor} 25%, transparent)`,
          }}
        >
          {visibleStatusLabel}
        </div>
      ) : null}
      {/* SVG Filters for Liquid Effect */}
      {isLiquid && (
        <svg style={{ position: "absolute", width: 0, height: 0 }}>
          <defs>
            <filter id="goo">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation={liquidViscosity}
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                result="goo"
              />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>
      )}

      {/* Main Container */}
        <div
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy || undefined}
          aria-valuetext={ariaValueText || undefined}
          style={{
            ...sizeStyle,
            borderRadius: barRadius,
            overflow: isLiquid || hasParticles ? "visible" : "hidden",
            filter: isLiquid ? "url(#goo)" : "none",
            boxShadow: resolvedFrameShadow || "none",
            position: "relative",
            direction: isRtl ? "rtl" : "ltr",
            ...surfaceFrameStyleRest,
          }}
      >
        {surfaceStyle === "chrome" ? (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: barRadius,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.28), rgba(255,255,255,0.04) 42%, rgba(255,255,255,0.12))",
              mixBlendMode: "screen",
              opacity: 0.4,
              pointerEvents: "none",
            }}
          />
        ) : null}

        {surfaceStyle === "paper" ? (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: barRadius,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.34), rgba(255,255,255,0))",
              pointerEvents: "none",
            }}
          />
        ) : null}

        {showStatusLabel && statusLabelPosition === "inline" ? (
          <div
            style={{
              ...getStatusLabelStyle("inline"),
              color: statusColor,
              background: "color-mix(in oklab, var(--bg) 84%, transparent)",
              border: `1px solid color-mix(in oklab, ${statusColor} 28%, transparent)`,
              borderRadius: 9999,
              padding: "4px 10px",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              pointerEvents: "none",
            }}
          >
            {visibleStatusLabel}
          </div>
        ) : null}

        {/* Track Layer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: trackColor,
            opacity: trackOpacity,
            borderRadius: barRadius,
          }}
        />

        {/* Buffer Bar */}
        {isBuffer && (
          <div
            style={{
              position: "absolute",
              [isVertical ? "bottom" : isRtl ? "right" : "left"]: 0,
              [isVertical ? "width" : "height"]: "100%",
              [isVertical ? "height" : "width"]: `${bufferPercent}%`,
              background: color1,
              opacity: 0.3,
              transition: "all 0.3s ease",
              borderRadius: barRadius,
            }}
          />
        )}

        {/* Steps Mode */}
        {isSteps && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: isVertical
                ? "column-reverse"
                : isRtl
                  ? "row-reverse"
                  : "row",
              gap: "4px",
              padding: "2px",
            }}
          >
            {[...Array(stepCount)].map((_, i) => {
              const stepPercent = ((i + 1) / stepCount) * 100;
              const prevStepPercent = (i / stepCount) * 100;
              const isFilled = percent >= stepPercent;
              const isCurrentStep = !isFilled && percent > prevStepPercent;
              const stepBackground = isFilled
                ? stepsCompletedColor
                : isCurrentStep
                  ? stepsActiveColor
                  : "transparent";
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: stepBackground,
                    borderRadius: barRadius / 2,
                    transition: transitionDuration > 0 ? `background ${transitionDuration}ms ${transitionEasing}` : "background 0.2s ease",
                    border: `1px solid ${isFilled || isCurrentStep ? "transparent" : stepsInactiveColor}`,
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Glitch Layers (Underlay) */}
        {isGlitch && (
          <>
            <GlitchLayer
              state={state}
              percent={percent}
              color="red"
              offset={-2}
              opacity={0.7}
            />
            <GlitchLayer
              state={state}
              percent={percent}
              color="blue"
              offset={2}
              opacity={0.7}
            />
          </>
        )}

        {/* Primary Fill */}
        {!isSteps && (
          <motion.div
            initial={false}
            animate={{
              [isVertical ? "height" : "width"]: isIndeterminate
                ? "30%"
                : isTimer
                  ? "100%"
                  : `${percent}%`,
            }}
            transition={{
              type: isGlitch || isRetro ? false : "spring",
              stiffness: 100,
              damping: 20,
            }}
            className={`${isIndeterminate ? "animate-indeterminate" : ""} ${isPulse ? "animate-pulse-effect" : ""} ${isTimer ? "animate-timer" : ""}`}
            style={{
              position: "absolute",
              [isVertical ? "bottom" : isRtl ? "right" : "left"]: 0,
              [isVertical ? "width" : "height"]: "100%",
              background: fillBackground,
              borderRadius: barRadius,
              zIndex: 10,
              ...(isRetro && {
                border: `3px solid ${color1}`,
                boxShadow: `inset -4px -4px 0 rgba(0,0,0,0.3), inset 4px 4px 0 rgba(255,255,255,0.3)`,
                imageRendering: "pixelated",
              }),
            }}
          >
            {isStripes && (
              <div
                className="animate-stripes"
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `linear-gradient(45deg, ${stripeColor} 25%, transparent 25%, transparent 50%, ${stripeColor} 50%, ${stripeColor} 75%, transparent 75%, transparent)`,
                  backgroundSize: "30px 30px",
                  borderRadius: barRadius,
                }}
              />
            )}

            {/* Liquid Droplet Leading Edge */}
            {isLiquid && (
              <div
                style={{
                  position: "absolute",
                  [isVertical ? "top" : isRtl ? "left" : "right"]: 0,
                  [isVertical ? "left" : "top"]: "50%",
                  width: thickness * 0.8,
                  height: thickness * 0.8,
                  background: fillBackground,
                  borderRadius: "50%",
                  transform: `translate(${isVertical ? "-50%, -50%" : isRtl ? "-50%, -50%" : "50%, -50%"})`,
                  boxShadow: `0 0 10px ${color1}`,
                }}
              />
            )}
          </motion.div>
        )}

        {successPercentValue > 0 ? (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              [isVertical ? "bottom" : isRtl ? "right" : "left"]: 0,
              [isVertical ? "width" : "height"]: "100%",
              [isVertical ? "height" : "width"]: `${successPercentValue}%`,
              borderRadius: barRadius,
              background: STATUS_COLOR_MAP.success,
              opacity: 0.28,
              pointerEvents: "none",
              zIndex: 3,
            }}
          />
        ) : null}

        {showStatusIcon && status !== "normal" ? renderStatusBadge(statusColor) : null}

        {/* Particles */}
        {hasParticles && (
          <div
            style={{
              position: "absolute",
              [isVertical ? "bottom" : isRtl ? "right" : "left"]: `${percent}%`,
              width: 0,
              height: 0,
              // Removed flex to prevent 0-size crushing
              pointerEvents: "none",
              zIndex: 50,
            }}
          >
            {particles.map((particle, i) => (
              <div key={i} className={particle.className} style={particle.style} />
            ))}
          </div>
        )}
      </div>

      {/* 2D Animations Styles */}
      <style jsx>{`
        @keyframes stripes {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 60px 0;
          }
        }
        .animate-stripes {
          animation: stripes ${2 / (stripeSpeed || 1)}s linear infinite;
        }
        @keyframes pulse-effect {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
        .animate-pulse-effect {
          animation: pulse-effect 1s ease-in-out infinite;
        }
        @keyframes indeterminate {
          0% {
            left: -30%;
          }
          50% {
            left: 100%;
          }
          100% {
            left: -30%;
          }
        }
        .animate-indeterminate {
          animation: indeterminate 1.5s ease-in-out infinite;
        }
        @keyframes timer {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        .animate-timer {
          animation: timer ${timerDuration}s linear forwards;
        }
      `}</style>

      {/* Global styles for dynamic particles to avoid styled-jsx purging */}
      <style jsx global>{`
        /* Particle Animation Classes */
        .particle-fire {
          animation: particle-fire var(--dur) ease-out infinite;
          animation-delay: var(--del);
          opacity: 0; /* Start invisible, keyframes fade it in */
        }
        .particle-confetti {
          animation: particle-confetti calc(var(--dur) * 1.5) ease-out infinite;
          animation-delay: var(--del);
          opacity: 0;
        }
        .particle-sparks {
          animation: particle-sparks calc(var(--dur) * 0.6) ease-out infinite;
          animation-delay: var(--del);
          opacity: 0;
        }

        /* Improved Fire: floats up and fades, some wiggle */
        @keyframes particle-fire {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) scale(0);
          }
        }

        /* Improved Confetti: spins and falls/pops */
        @keyframes particle-confetti {
          0% {
            opacity: 1;
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) rotate(var(--r))
              scale(0.5);
          }
        }

        /* Improved Sparks: quick burst outward */
        @keyframes particle-sparks {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) scale(0);
          }
        }
      `}</style>

      {/* Multi-Label Rendering */}
      {state.labels &&
        state.labels.map((label, index) => (
          <div
            key={label.id || index}
            style={{
              position: "absolute",
              zIndex: 20,
              whiteSpace: "nowrap",
              fontSize: `${label.size || 14}px`,
              fontWeight: 500,
              color:
                label.position === "center" || label.position === "inside"
                  ? lightTextCheck(color1)
                    ? "#000"
                    : "#fff"
                  : "var(--text)",
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              ...getLabelPositionStyles(
                label.position,
                isVertical,
                isRtl,
                percent,
              ),
            }}
          >
            {label.type === "icon" && (
              <span style={{ display: "flex", alignItems: "center" }}>
                {label.iconSource === "custom" && label.customSvg ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: label.customSvg }}
                    style={{
                      width: label.size || 24,
                      height: label.size || 24,
                      display: "flex",
                    }}
                  />
                ) : (
                  <Circle size={label.size || 24} />
                )}
              </span>
            )}

            {label.type === "animated" &&
              label.animatedIndicator !== "none" && (
                <AnimatedIndicator
                  indicator={label.animatedIndicator || "none"}
                  size={label.size || 24}
                  color={
                    label.position === "center" || label.position === "inside"
                      ? lightTextCheck(color1)
                        ? "#000"
                        : "#fff"
                      : "var(--text)"
                  }
                />
              )}

            {label.type === "text" && getLabelText(state, percent, label)}
          </div>
        ))}
      {showStatusLabel && statusLabelPosition === "below" ? (
        <div
          className="mt-3 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide"
          style={{
            color: statusColor,
            background: "color-mix(in oklab, var(--bg) 78%, transparent)",
            border: `1px solid color-mix(in oklab, ${statusColor} 25%, transparent)`,
          }}
        >
          {visibleStatusLabel}
        </div>
      ) : null}
    </div>
  );
}

// --- 3D COMPONENT ---
type ThreeDProgressBarProps = {
  state: ProgressState;
  percent: number;
  isVertical: boolean;
  isRtl: boolean;
};

function ThreeDProgressBar({
  state,
  percent,
  isVertical,
  isRtl,
}: ThreeDProgressBarProps) {
  const {
    width,
    thickness,
    depth,
    rotateX,
    rotateY,
    rotateZ,
    color1,
    trackColor,
  } = state;
  const w = isVertical ? thickness : width;
  const h = isVertical ? width : thickness; // In vertical, height is the long dimension

  // We need to construct faces manually.
  // Instead of full CSS 3D chaos, let's use a simplified "Cuboid" approach
  // We'll rotate the entire container.

  const fillSize = (percent / 100) * (isVertical ? h : w);

  return (
    <div
      style={{
        width: w,
        height: h,
        perspective: "1000px",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
          transition: "transform 0.1s linear",
        }}
      >
        {/* TRACK (Static) */}
        <Cuboid
          width={w}
          height={h}
          depth={depth}
          color={trackColor}
          opacity={0.3}
        />

        {/* FILL (Dynamic) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            [isVertical ? "bottom" : isRtl ? "right" : "left"]: 0,
            width: isVertical ? w : `${percent}%`,
            height: isVertical ? `${percent}%` : h,
            transformStyle: "preserve-3d",
            transition: "width 0.3s, height 0.3s",
          }}
        >
          <Cuboid
            width={isVertical ? w : fillSize} // We need px for cuboid construction
            height={isVertical ? fillSize : h}
            depth={depth}
            color={color1}
            opacity={1}
          />
        </div>
      </div>
    </div>
  );
}

type CuboidProps = {
  width: number;
  height: number;
  depth: number;
  color: string;
  opacity: number;
};

function Cuboid({ width, height, depth, color, opacity }: CuboidProps) {
  // A cuboid has 6 faces.
  // We center it at 0,0
  const halfDepth = depth / 2;

  const faceStyle: React.CSSProperties = {
    position: "absolute",
    background: color,
    opacity: opacity,
    border: "1px solid rgba(255,255,255,0.1)",
    backfaceVisibility: "visible", // Show inside
  };

  return (
    <div
      style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}
    >
      {/* Front */}
      <div
        style={{
          ...faceStyle,
          width: "100%",
          height: "100%",
          transform: `translateZ(${halfDepth}px)`,
        }}
      />
      {/* Back */}
      <div
        style={{
          ...faceStyle,
          width: "100%",
          height: "100%",
          transform: `translateZ(-${halfDepth}px) rotateY(180deg)`,
        }}
      />
      {/* Top */}
      <div
        style={{
          ...faceStyle,
          width: "100%",
          height: depth,
          transform: `rotateX(90deg) translateZ(${halfDepth}px)`,
          top: -halfDepth,
        }}
      />
      {/* Bottom */}
      <div
        style={{
          ...faceStyle,
          width: "100%",
          height: depth,
          transform: `rotateX(-90deg) translateZ(${height - halfDepth}px)`,
          top: "auto",
          bottom: -halfDepth,
        }}
      />
      {/* Left */}
      <div
        style={{
          ...faceStyle,
          width: depth,
          height: "100%",
          transform: `rotateY(-90deg) translateZ(${halfDepth}px)`,
          left: -halfDepth,
        }}
      />
      {/* Right */}
      <div
        style={{
          ...faceStyle,
          width: depth,
          height: "100%",
          transform: `rotateY(90deg) translateZ(${width - halfDepth}px)`,
          left: "auto",
          right: -halfDepth,
        }}
      />
    </div>
  );
}

// Helpers
// Helpers
function getLabelText(
  state: ProgressState,
  percent: number,
  label: ProgressLabelConfig,
) {
  switch (label.format) {
    case "fraction":
      return `${Math.round(state.value)}/${state.max}`;
    case "value":
      return `${Math.round(state.value)}`;
    case "custom":
      return label.customText || "";
    case "percent":
    default:
      return `${Math.round(percent)}%`;
  }
}

function getLabelPositionStyles(
  position: string,
  isVertical: boolean,
  isRtl: boolean,
  percent: number,
): React.CSSProperties {
  // 9-point grid + inside
  switch (position) {
    case "top-left":
      return { bottom: "100%", left: "0", marginBottom: "8px" };
    case "top-center":
      return {
        bottom: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        marginBottom: "8px",
      };
    case "top-right":
      return { bottom: "100%", right: "0", marginBottom: "8px" };
    case "center-left":
      return {
        right: "100%",
        top: "50%",
        transform: "translateY(-50%)",
        marginRight: "8px",
      };
    case "center":
      return {
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      };
    case "center-right":
      return {
        left: "100%",
        top: "50%",
        transform: "translateY(-50%)",
        marginLeft: "8px",
      };
    case "bottom-left":
      return { top: "100%", left: "0", marginTop: "8px" };
    case "bottom-center":
      return {
        top: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        marginTop: "8px",
      };
    case "bottom-right":
      return { top: "100%", right: "0", marginTop: "8px" };
    case "inside":
      if (isVertical) {
        return {
          bottom: `${percent}%`,
          left: "50%",
          transform: "translate(-50%, 50%)",
        };
      }
      return isRtl
        ? {
            right: `${percent}%`,
            top: "50%",
            transform: "translate(50%, -50%)",
          }
        : {
            left: `${percent}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
          };
    default:
      return {};
  }
}

function lightTextCheck(hex: string) {
  const normalized = hex.trim().replace("#", "");
  if (normalized.length !== 6) return false;

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  if ([r, g, b].some((value) => Number.isNaN(value))) return false;

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.68;
}

function renderStatusBadge(statusColor: string) {
  const iconSize = 20;
  const icon =
    statusColor === STATUS_COLOR_MAP.success ? (
      <CheckCircle2 size={iconSize} />
    ) : statusColor === STATUS_COLOR_MAP.error ? (
      <XCircle size={iconSize} />
    ) : statusColor === STATUS_COLOR_MAP.warning ? (
      <AlertTriangle size={iconSize} />
    ) : (
      <LoaderCircle size={iconSize} />
    );

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: -12,
        right: -12,
        width: 28,
        height: 28,
        borderRadius: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: statusColor,
        color: "#fff",
        boxShadow: "0 8px 20px rgba(15, 23, 42, 0.22)",
        zIndex: 30,
        pointerEvents: "none",
      }}
    >
      {icon}
    </div>
  );
}

type GlitchLayerProps = {
  state: ProgressState;
  percent: number;
  color: string;
  offset: number;
  opacity: number;
};

function GlitchLayer({ state, percent, color, offset, opacity }: GlitchLayerProps) {
  const { orientation, radius, shape, glitchIntensity } = state;
  const isVertical = orientation === "vertical";
  const barRadius = shape === "pill" ? 9999 : shape === "square" ? 0 : radius;

  // Scale offset by intensity (0-100 maps to 0-10px offset)
  const scaledOffset = offset * (glitchIntensity / 50);

  return (
    <div
      style={{
        position: "absolute",
        [isVertical ? "bottom" : "left"]: 0,
        [isVertical ? "width" : "height"]: "100%",
        [isVertical ? "height" : "width"]: `${percent}%`,
        background: color,
        opacity: opacity * (glitchIntensity / 100),
        borderRadius: barRadius,
        transform: `translate(${scaledOffset}px, ${scaledOffset}px)`,
        mixBlendMode: "screen",
        clipPath:
          "polygon(0 0, 100% 0, 100% 45%, 0 45%, 0 100%, 100% 100%, 100% 80%, 0 80%)",
        zIndex: 5,
      }}
    />
  );
}
