import React from "react";
import {
  type ProgressSize,
  type ProgressState,
  type ProgressUpdater,
  SIZE_PRESET_MAP,
} from "../types";
import { SectionCard as Section } from "@/components/shared/layout/SectionCard";
import { LabeledField as ControlGroup } from "@/components/shared/layout/LabeledField";
import SliderControl from "@/components/shared/input/Slider";
import SelectControl from "@/components/shared/input/Select";

type Props = {
  state: ProgressState;
  update: ProgressUpdater;
};

export default function SizingSection({ state, update }: Props) {
  const handleSizePresetChange = (preset: ProgressSize) => {
    update("sizePreset", preset);
    if (preset !== "custom") {
      update("thickness", SIZE_PRESET_MAP[preset]);
    }
  };

  return (
    <div className="space-y-6">
      <Section title="Sizing" subtitle="Dimensions, shape, and layout direction">
        <ControlGroup label="Size Preset">
          <SelectControl
            value={state.sizePreset}
            options={[
              { label: "Extra Small (4px)", value: "xs" },
              { label: "Small (8px)", value: "sm" },
              { label: "Medium (16px)", value: "md" },
              { label: "Large (24px)", value: "lg" },
              { label: "Extra Large (32px)", value: "xl" },
              { label: "Custom", value: "custom" },
            ]}
            onChange={(v) => handleSizePresetChange(v as ProgressSize)}
          />
        </ControlGroup>

        <ControlGroup label="Thickness (px)">
          <SliderControl
            value={state.thickness}
            min={4}
            max={100}
            step={2}
            onChange={(v) => update("thickness", Number(v))}
          />
        </ControlGroup>

        <ControlGroup label="Width (px)">
          <SliderControl
            value={state.width}
            min={50}
            max={800}
            step={10}
            onChange={(v) => update("width", Number(v))}
          />
        </ControlGroup>

        <ControlGroup label="Shape">
          <SelectControl
            value={state.shape}
            options={[
              { label: "Pill (Fully Rounded)", value: "pill" },
              { label: "Rounded Configurable", value: "round" },
              { label: "Square", value: "square" },
            ]}
            onChange={(v) => update("shape", v as ProgressState["shape"])}
          />
        </ControlGroup>

        <ControlGroup label="Corner Radius">
          <SliderControl
            value={state.radius}
            min={0}
            max={50}
            step={1}
            disabled={state.shape === "pill"}
            onChange={(v) => update("radius", Number(v))}
          />
        </ControlGroup>

        <ControlGroup label="Orientation">
          <SelectControl
            value={state.orientation}
            options={[
              { label: "Horizontal", value: "horizontal" },
              { label: "Vertical", value: "vertical" },
            ]}
            onChange={(v) =>
              update("orientation", v as ProgressState["orientation"])
            }
          />
        </ControlGroup>

        <ControlGroup label="Direction">
          <SelectControl
            value={state.direction}
            options={[
              { label: "Left to Right", value: "ltr" },
              { label: "Right to Left (RTL)", value: "rtl" },
            ]}
            onChange={(v) => update("direction", v as ProgressState["direction"])}
          />
        </ControlGroup>
      </Section>
    </div>
  );
}
