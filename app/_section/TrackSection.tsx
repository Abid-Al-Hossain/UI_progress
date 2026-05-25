import React from "react";
import { type ProgressState, type ProgressUpdater } from "../types";
import { SectionCard as Section } from "@/components/shared/layout/SectionCard";
import { LabeledField as ControlGroup } from "@/components/shared/layout/LabeledField";
import SelectControl from "@/components/shared/input/Select";
import SliderControl from "@/components/shared/input/Slider";
import ColorControl from "@/components/shared/color/ColorControl";

type Props = {
  state: ProgressState;
  update: ProgressUpdater;
};

export default function TrackSection({ state, update }: Props) {
  return (
    <div className="space-y-6">
      <Section title="Track" subtitle="Background rail and line ending treatment">
        <ControlGroup label="Track Color">
          <ColorControl
            label="Track"
            value={state.trackColor}
            onChange={(value) => update("trackColor", value)}
          />
        </ControlGroup>

        <ControlGroup label="Track Opacity">
          <SliderControl
            value={state.trackOpacity}
            min={0}
            max={1}
            step={0.05}
            onChange={(value) => update("trackOpacity", Number(value))}
          />
        </ControlGroup>

        <ControlGroup label="Stroke Linecap">
          <SelectControl
            value={state.strokeLinecap}
            options={[
              { label: "Round", value: "round" },
              { label: "Butt (Flat)", value: "butt" },
              { label: "Square", value: "square" },
            ]}
            onChange={(value) =>
              update("strokeLinecap", value as ProgressState["strokeLinecap"])
            }
          />
        </ControlGroup>
      </Section>
    </div>
  );
}
