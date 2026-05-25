"use client";
import React from "react";
import {
  type ProgressState,
  type ProgressLabelConfig,
  type ProgressLabelPosition,
  type ProgressLabelType,
  type ProgressAnimatedIndicator,
  type ProgressLabelsUpdater,
} from "../types";
import { SectionCard as Section } from "@/components/shared/layout/SectionCard";
import { LabeledField as ControlGroup } from "@/components/shared/layout/LabeledField";
import SelectControl from "@/components/shared/input/Select";
import InputControl from "@/components/shared/input/Input";
import SliderControl from "@/components/shared/input/Slider";
import IconPickerControl, {
  type IconSource,
} from "@/components/shared/layout/IconPickerControl";
import { Plus, Trash2 } from "lucide-react";

type Props = {
  state: ProgressState;
  updateLabels: ProgressLabelsUpdater;
};

// Position options - 9 point grid plus inside (follows progress)
const POSITION_OPTIONS: { label: string; value: ProgressLabelPosition }[] = [
  { label: "↖ Top Left", value: "top-left" },
  { label: "↑ Top Center", value: "top-center" },
  { label: "↗ Top Right", value: "top-right" },
  { label: "← Center Left", value: "center-left" },
  { label: "● Center", value: "center" },
  { label: "→ Center Right", value: "center-right" },
  { label: "↙ Bottom Left", value: "bottom-left" },
  { label: "↓ Bottom Center", value: "bottom-center" },
  { label: "↘ Bottom Right", value: "bottom-right" },
  { label: "◐ Inside (Follows Progress)", value: "inside" },
];

const TYPE_OPTIONS: { label: string; value: ProgressLabelType }[] = [
  { label: "Text (Percent/Value)", value: "text" },
  { label: "Icon (Library/Custom SVG)", value: "icon" },
  { label: "Animated Indicator", value: "animated" },
];

const FORMAT_OPTIONS = [
  { label: "Percent (%)", value: "percent" },
  { label: "Fraction (Val/Max)", value: "fraction" },
  { label: "Raw Value", value: "value" },
  { label: "Custom Text", value: "custom" },
];

const ANIMATED_INDICATOR_OPTIONS: {
  label: string;
  value: ProgressAnimatedIndicator;
}[] = [
  { label: "None", value: "none" },
  { label: "🚶 Walking Person", value: "walking-person" },
  { label: "🐕 Running Dog", value: "running-dog" },
  { label: "🐦 Flying Bird", value: "flying-bird" },
  { label: "🐟 Swimming Fish", value: "swimming-fish" },
  { label: "🐌 Crawling Snail", value: "crawling-snail" },
  { label: "⚽ Bouncing Ball", value: "bouncing-ball" },
  { label: "⭐ Spinning Star", value: "spinning-star" },
  { label: "🚀 Rocket", value: "rocket" },
  { label: "🚗 Car", value: "car" },
  { label: "🚲 Bicycle", value: "bicycle" },
];

function generateLabelId() {
  return `label-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default function LabelsSection({ state, updateLabels }: Props) {
  const labels = state.labels || [];

  const addLabel = () => {
    const newLabel: ProgressLabelConfig = {
      id: generateLabelId(),
      position: "center",
      type: "text",
      format: "percent",
      size: 14,
    };
    updateLabels([...labels, newLabel]);
  };

  const removeLabel = (id: string) => {
    updateLabels(labels.filter((l) => l.id !== id));
  };

  const updateLabel = (
    id: string,
    key: keyof ProgressLabelConfig,
    value: ProgressLabelConfig[keyof ProgressLabelConfig],
  ) => {
    updateLabels(labels.map((l) => (l.id === id ? { ...l, [key]: value } : l)));
  };

  return (
    <div className="space-y-6">
      <Section
        title="Labels"
        subtitle="Add multiple labels, icons, or animations at different positions"
      >
        {/* Add Label Button */}
        <button
          onClick={addLabel}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border-2 border-dashed border-gray-600 hover:border-blue-500 hover:bg-blue-500/10 transition-colors text-gray-400 hover:text-blue-400"
        >
          <Plus size={18} />
          <span>Add Label</span>
        </button>

        {/* Labels List */}
        {labels.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No labels added. Click above to add one.
          </p>
        )}

        {labels.map((label, index) => (
          <div
            key={label.id}
            className="mt-4 p-4 rounded-lg bg-gray-800/50 border border-gray-700 space-y-4"
          >
            {/* Header with Delete */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">
                Label #{index + 1}
              </span>
              <button
                onClick={() => removeLabel(label.id)}
                className="p-1.5 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                title="Remove label"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Position */}
            <ControlGroup label="Position">
              <SelectControl
                value={label.position}
                options={POSITION_OPTIONS}
                onChange={(v) =>
                  updateLabel(
                    label.id,
                    "position",
                    v as ProgressLabelConfig["position"],
                  )
                }
              />
            </ControlGroup>

            {/* Type */}
            <ControlGroup label="Type">
              <SelectControl
                value={label.type}
                options={TYPE_OPTIONS}
                onChange={(v) =>
                  updateLabel(label.id, "type", v as ProgressLabelConfig["type"])
                }
              />
            </ControlGroup>

            {/* Text Options */}
            {label.type === "text" && (
              <>
                <ControlGroup label="Format">
                  <SelectControl
                    value={label.format || "percent"}
                    options={FORMAT_OPTIONS}
                    onChange={(v) =>
                      updateLabel(
                        label.id,
                        "format",
                        v as NonNullable<ProgressLabelConfig["format"]>,
                      )
                    }
                  />
                </ControlGroup>

                {label.format === "custom" && (
                  <ControlGroup label="Custom Text">
                    <InputControl
                      value={label.customText || ""}
                      onChange={(e) =>
                        updateLabel(label.id, "customText", e.target.value)
                      }
                      placeholder="e.g. Loading..."
                    />
                  </ControlGroup>
                )}

                <ControlGroup label="Font Size (px)">
                  <SliderControl
                    value={label.size || 14}
                    min={10}
                    max={32}
                    step={1}
                    onChange={(v) => updateLabel(label.id, "size", Number(v))}
                  />
                </ControlGroup>
              </>
            )}

            {/* Icon Options */}
            {label.type === "icon" && (
              <>
                <IconPickerControl
                  label="Icon"
                  source={(label.iconSource as IconSource) || "library"}
                  setSource={(v) => updateLabel(label.id, "iconSource", v)}
                  name={label.iconName || ""}
                  setName={(v) => updateLabel(label.id, "iconName", v)}
                  customSvg={label.customSvg || ""}
                  setCustomSvg={(v) => updateLabel(label.id, "customSvg", v)}
                  allowNone={false}
                />

                <ControlGroup label="Icon Size (px)">
                  <SliderControl
                    value={label.size || 24}
                    min={16}
                    max={64}
                    step={4}
                    onChange={(v) => updateLabel(label.id, "size", Number(v))}
                  />
                </ControlGroup>
              </>
            )}

            {/* Animated Indicator Options */}
            {label.type === "animated" && (
              <>
                <ControlGroup label="Animated Indicator">
                  <SelectControl
                    value={label.animatedIndicator || "none"}
                    options={ANIMATED_INDICATOR_OPTIONS}
                    onChange={(v) =>
                      updateLabel(
                        label.id,
                        "animatedIndicator",
                        v as ProgressLabelConfig["animatedIndicator"],
                      )
                    }
                  />
                </ControlGroup>

                <ControlGroup label="Indicator Size (px)">
                  <SliderControl
                    value={label.size || 24}
                    min={16}
                    max={64}
                    step={4}
                    onChange={(v) => updateLabel(label.id, "size", Number(v))}
                  />
                </ControlGroup>
              </>
            )}
          </div>
        ))}
      </Section>
    </div>
  );
}
