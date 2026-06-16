import { type ProgressState, STATUS_COLOR_MAP } from "../types";

type ProgressExportParams = ProgressState & {
  downloadName?: string;
};

type NormalizedParams = ProgressState & {
  downloadName: string;
};

function clampPercent(value: number, min: number, max: number) {
  if (max <= min) return 0;
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

function normalizeParams(params: ProgressExportParams): NormalizedParams {
  return {
    ...params,
    downloadName: params.downloadName || "progress-bar",
  };
}

function getFillBackground(params: NormalizedParams, primaryColor: string, isVertical: boolean, isRtl: boolean) {
  const direction = isVertical ? "to top" : isRtl ? "to left" : "to right";
  if (params.colorMode === "gradient") {
    return `linear-gradient(${direction}, ${primaryColor}, ${params.color2})`;
  }
  if (params.colorMode === "duotone") {
    return `linear-gradient(${direction}, ${primaryColor}, ${params.color3}, ${params.color2})`;
  }
  return primaryColor;
}

function getContainerShadow(params: NormalizedParams, primaryColor: string) {
  if (params.effect === "glow") return `0 0 ${params.glowBlur}px ${primaryColor}`;
  if (params.effect === "neon") {
    return `0 0 5px ${primaryColor}, 0 0 10px ${primaryColor}, 0 0 20px ${primaryColor}`;
  }
  return "none";
}

function generateReactCode(params: NormalizedParams, percent: number, primaryColor: string, isVertical: boolean, isRtl: boolean) {
  const configJson = JSON.stringify(params, null, 2);
  const fillBackground = getFillBackground(params, primaryColor, isVertical, isRtl);
  const containerShadow = getContainerShadow(params, primaryColor);
  const sizeWidth = isVertical ? params.thickness : params.width;
  const sizeHeight = isVertical ? params.width : params.thickness;
  const borderRadius =
    params.shape === "pill" ? 9999 : params.shape === "square" ? 0 : params.radius;
  const labels = params.labels || [];

  const needsMotion = !params.disableAnimation && (params.mode !== "steps" || params.effect === "pulse");
  const motionImport = needsMotion ? "import { motion } from 'framer-motion';\n" : "";
  const fillElement = needsMotion ? "motion.div" : "div";
  const animateProps = needsMotion
    ? `\n        initial={false}\n        animate={{ ${isVertical ? "height" : "width"}: mode === "indeterminate" ? "35%" : \`\${progressPercent}%\` }}\n        transition={{ duration: CONFIG.animationDuration, ease: "easeOut" }}`
    : "";

  const labelsJson = JSON.stringify(labels, null, 2);
  const content = `import React from 'react';
import { AlertTriangle, CheckCircle2, LoaderCircle, XCircle } from 'lucide-react';
${motionImport}
const CONFIG = ${configJson};
const LABELS = ${labelsJson};

function clampPercent(value, min, max) {
  if (max <= min) return 0;
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

function getLabelText(label, value, max, percent) {
  if (label.type !== "text") {
    if (label.type === "icon") return label.iconName || "Icon";
    if (label.type === "animated") return label.animatedIndicator || "Animated";
    return "";
  }
  if (label.format === "fraction") return \`\${Math.round(value)}/\${Math.round(max)}\`;
  if (label.format === "value") return \`\${Math.round(value)}\`;
  if (label.format === "custom") return label.customText || "";
  return \`\${Math.round(percent)}%\`;
}

function getLabelPosition(position, percent) {
  if (position === "inside") {
    return { left: \`\${percent}%\`, top: "50%", transform: "translate(-50%, -50%)" };
  }

  const style = {};
  if (position.includes("top")) style.top = "-24px";
  if (position.includes("bottom")) style.bottom = "-24px";
  if (position.includes("left")) style.left = "0";
  if (position.includes("right")) style.right = "0";
  if (position.includes("center")) {
    style.left = "50%";
    style.transform = "translateX(-50%)";
  }
  if (position === "center") {
    style.left = "50%";
    style.top = "50%";
    style.transform = "translate(-50%, -50%)";
  }
  return style;
}

export default function ProgressBar({
  value = CONFIG.value,
  min = CONFIG.min,
  max = CONFIG.max,
}) {
  const progressPercent = clampPercent(value, min, max);
  const mode = CONFIG.mode;
  const isSteps = mode === "steps";
  const successPercentValue = CONFIG.successPercent > 0
    ? clampPercent(CONFIG.successPercent, min, max)
    : 0;
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: CONFIG.disabled ? CONFIG.disabledOpacity : 1,
        pointerEvents: CONFIG.disabled ? "none" : undefined,
        cursor: CONFIG.disabled ? CONFIG.disabledCursor : undefined,
        transition: CONFIG.transitionDuration > 0 ? \`opacity \${CONFIG.transitionDuration}ms \${CONFIG.transitionEasing}\` : undefined,
        outline: isFocused && CONFIG.focusRingEnabled ? \`\${CONFIG.focusRingWidth}px solid \${CONFIG.focusRingColor}\` : undefined,
        outlineOffset: isFocused && CONFIG.focusRingEnabled ? CONFIG.focusRingOffset : undefined,
      }}
      tabIndex={CONFIG.focusRingEnabled && !CONFIG.disabled ? 0 : undefined}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <div
        role="progressbar"
        aria-valuenow={mode === "indeterminate" ? undefined : Math.round(value)}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuetext={CONFIG.ariaValueText || undefined}
        aria-label={CONFIG.ariaLabel || undefined}
        aria-describedby={CONFIG.ariaDescribedBy || undefined}
        style={{
          width: "${sizeWidth}px",
          height: "${sizeHeight}px",
          position: "relative",
          overflow: "hidden",
          borderRadius: "${borderRadius}px",
          direction: "${isRtl ? "rtl" : "ltr"}",
          transform: CONFIG.enable3D
            ? \`perspective(900px) rotateX(\${CONFIG.rotateX}deg) rotateY(\${CONFIG.rotateY}deg) rotateZ(\${CONFIG.rotateZ}deg)\`
            : "none",
          boxShadow: "${containerShadow}",
          background:
            CONFIG.surfaceStyle === "glass" || CONFIG.effect === "glass"
              ? "rgba(255,255,255,0.12)"
              : CONFIG.surfaceStyle === "paper"
                ? "#f8fafc"
                : CONFIG.surfaceStyle === "chrome"
                  ? "linear-gradient(180deg, rgba(255,255,255,0.34), rgba(15,23,42,0.16))"
                  : "transparent",
          backdropFilter: CONFIG.surfaceStyle === "glass" || CONFIG.effect === "glass" ? "blur(10px)" : "none",
          border:
            CONFIG.surfaceStyle === "glass" || CONFIG.effect === "glass"
              ? "1px solid rgba(255,255,255,0.24)"
              : CONFIG.surfaceStyle === "paper"
                ? "1px solid rgba(15,23,42,0.12)"
                : "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: CONFIG.trackColor,
            opacity: CONFIG.trackOpacity,
            borderRadius: "${borderRadius}px",
          }}
        />

        {mode === "buffer" ? (
          <div
            style={{
              position: "absolute",
              ${isVertical ? "bottom" : isRtl ? "right" : "left"}: 0,
              ${isVertical ? "width" : "height"}: "100%",
              ${isVertical ? "height" : "width"}: \`\${clampPercent(CONFIG.bufferValue, min, max)}%\`,
              background: "${primaryColor}",
              opacity: 0.28,
              borderRadius: "${borderRadius}px",
            }}
          />
        ) : null}

        {isSteps ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "${isVertical ? "column-reverse" : isRtl ? "row-reverse" : "row"}",
              gap: "4px",
              padding: "2px",
            }}
          >
            {Array.from({ length: CONFIG.stepCount }).map((_, i) => {
              const stepPercent = ((i + 1) / CONFIG.stepCount) * 100;
              const prevStepPercent = (i / CONFIG.stepCount) * 100;
              const isFilled = progressPercent >= stepPercent;
              const isCurrentStep = !isFilled && progressPercent > prevStepPercent;
              const stepBackground = isFilled ? CONFIG.stepsCompletedColor : isCurrentStep ? CONFIG.stepsActiveColor : "transparent";
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    borderRadius: "${Math.max(2, Math.floor(borderRadius / 2))}px",
                    background: stepBackground,
                    transition: CONFIG.transitionDuration > 0 ? \`background \${CONFIG.transitionDuration}ms \${CONFIG.transitionEasing}\` : "background 0.2s ease",
                    border: \`1px solid \${isFilled || isCurrentStep ? "transparent" : CONFIG.stepsInactiveColor}\`,
                  }}
                />
              );
            })}
          </div>
        ) : (
          <${fillElement}${animateProps}
            className={mode === "indeterminate" ? "uif-indeterminate" : ""}
            style={{
              position: "absolute",
              ${isVertical ? "bottom" : isRtl ? "right" : "left"}: 0,
              ${isVertical ? "width" : "height"}: "100%",
              ${needsMotion ? "" : `${isVertical ? "height" : "width"}: \`\${progressPercent}%\`,`}
              borderRadius: "${borderRadius}px",
              background: "${fillBackground}",
              zIndex: 2,
            }}
          >
            {CONFIG.effect === "stripes" ? (
              <span
                aria-hidden="true"
                className={CONFIG.stripesAnimated && !CONFIG.disableAnimation ? "uif-stripes uif-stripes-animated" : "uif-stripes"}
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: \`linear-gradient(45deg, \${CONFIG.stripeColor} 25%, transparent 25%, transparent 50%, \${CONFIG.stripeColor} 50%, \${CONFIG.stripeColor} 75%, transparent 75%, transparent)\`,
                  backgroundSize: "18px 18px",
                  opacity: 0.7,
                }}
              />
            ) : null}
          </${fillElement}>
        )}

        {successPercentValue > 0 ? (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              ${isVertical ? "bottom" : isRtl ? "right" : "left"}: 0,
              ${isVertical ? "width" : "height"}: "100%",
              ${isVertical ? "height" : "width"}: \`\${successPercentValue}%\`,
              borderRadius: "${borderRadius}px",
              background: "#22c55e",
              opacity: 0.28,
              zIndex: 3,
              pointerEvents: "none",
            }}
          />
        ) : null}

        {CONFIG.showStatusIcon && CONFIG.status !== "normal" ? (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-12px",
              right: "-12px",
              width: "28px",
              height: "28px",
              borderRadius: "9999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                CONFIG.status === "success"
                  ? "#22c55e"
                  : CONFIG.status === "error"
                    ? "#ef4444"
                    : CONFIG.status === "warning"
                      ? "#f59e0b"
                      : "#3b82f6",
              color: "#fff",
              boxShadow: "0 8px 20px rgba(15, 23, 42, 0.22)",
              zIndex: 30,
              pointerEvents: "none",
            }}
          >
            {CONFIG.status === "success" ? (
              <CheckCircle2 size={20} />
            ) : CONFIG.status === "error" ? (
              <XCircle size={20} />
            ) : CONFIG.status === "warning" ? (
              <AlertTriangle size={20} />
            ) : (
              <LoaderCircle size={20} />
            )}
          </div>
        ) : null}
      </div>

      {LABELS.map((label, idx) => (
        <div
          key={label.id || idx}
          style={{
            position: "absolute",
            zIndex: 5,
            fontSize: \`\${label.size || 14}px\`,
            fontWeight: 500,
            color: "currentColor",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            ...getLabelPosition(label.position, progressPercent),
          }}
        >
          {getLabelText(label, value, max, progressPercent)}
        </div>
      ))}

      {CONFIG.showStatusLabel ? (
        <div
          style={{
            position: "absolute",
            left: CONFIG.statusLabelPosition === "inline" ? "calc(100% + 12px)" : "50%",
            top: CONFIG.statusLabelPosition === "below" ? "calc(100% + 10px)" : CONFIG.statusLabelPosition === "inline" ? "50%" : "-28px",
            transform: CONFIG.statusLabelPosition === "inline" ? "translateY(-50%)" : "translateX(-50%)",
            fontSize: "13px",
            fontWeight: 700,
            color:
              CONFIG.status === "success"
                ? "#22c55e"
                : CONFIG.status === "error"
                  ? "#ef4444"
                  : CONFIG.status === "warning"
                    ? "#f59e0b"
                    : "currentColor",
            whiteSpace: "nowrap",
          }}
        >
          {CONFIG.statusLabel || CONFIG.status}
        </div>
      ) : null}

      <style>{\`
        @keyframes uif-indeterminate {
          0% { transform: translateX(-120%); }
          50% { transform: translateX(20%); }
          100% { transform: translateX(-120%); }
        }
        .uif-indeterminate {
          width: 35%;
          animation: uif-indeterminate 1.4s ease-in-out infinite;
        }
        @keyframes uif-stripes {
          from { background-position: 0 0; }
          to { background-position: 18px 18px; }
        }
        .uif-stripes {
          pointer-events: none;
        }
        .uif-stripes-animated {
          animation: uif-stripes \${2 / (CONFIG.stripeSpeed || 1)}s linear infinite;
        }
      \`}</style>
    </div>
  );
}
`;

  return { content, filename: `${params.downloadName}.tsx` };
}

export function buildProgressExport(params: ProgressExportParams) {
  const normalized = normalizeParams(params);
  const percent = clampPercent(normalized.value, normalized.min, normalized.max);
  const isVertical = normalized.orientation === "vertical";
  const isRtl = normalized.direction === "rtl";
  const primaryColor =
    normalized.status !== "normal"
      ? STATUS_COLOR_MAP[normalized.status]
      : normalized.color1;

  return generateReactCode(normalized, percent, primaryColor, isVertical, isRtl);
}
