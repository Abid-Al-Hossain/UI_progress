import React from "react";
import { type ProgressState, type ProgressUpdater } from "../types";
import { SectionCard as Section } from "@/components/shared/layout/SectionCard";
import { LabeledField as ControlGroup } from "@/components/shared/layout/LabeledField";
import SliderControl from "@/components/shared/input/Slider";
import SelectControl from "@/components/shared/input/Select";

type Props = {
  state: ProgressState;
  update: ProgressUpdater;
};

export default function BasicsSection({ state, update }: Props) {
  return (
    <div className="space-y-6">
      <Section title="Values" subtitle="Core progress values">
        <ControlGroup label="Progress Value">
          <SliderControl
            value={state.value}
            min={state.min}
            max={state.max}
            step={1}
            onChange={(v) => update("value", Number(v))}
          />
        </ControlGroup>

        {state.mode === "buffer" && (
          <ControlGroup label="Buffer Value">
            <SliderControl
              value={state.bufferValue}
              min={state.min}
              max={state.max}
              step={1}
              onChange={(v) => update("bufferValue", Number(v))}
            />
          </ControlGroup>
        )}

        {state.mode === "determinate" && (
          <ControlGroup label="Success Percent (0 = off)">
            <SliderControl
              value={state.successPercent}
              min={0}
              max={state.value}
              step={1}
              onChange={(v) => update("successPercent", Number(v))}
            />
          </ControlGroup>
        )}
      </Section>

      <Section title="Mode" subtitle="Behavior and progress model">
        <ControlGroup label="Mode">
          <SelectControl
            value={state.mode}
            options={[
              { label: "Determinate", value: "determinate" },
              { label: "Indeterminate (Loading)", value: "indeterminate" },
              { label: "Buffer (Streaming)", value: "buffer" },
              { label: "Steps (Segmented)", value: "steps" },
              { label: "Timer (Countdown)", value: "timer" },
            ]}
            onChange={(v) => update("mode", v as ProgressState["mode"])}
          />
        </ControlGroup>

        {state.mode === "steps" && (
          <ControlGroup label="Step Count">
            <SliderControl
              value={state.stepCount}
              min={2}
              max={20}
              step={1}
              onChange={(v) => update("stepCount", Number(v))}
            />
          </ControlGroup>
        )}

        {state.mode === "timer" && (
          <ControlGroup label="Timer Duration (sec)">
            <SliderControl
              value={state.timerDuration}
              min={1}
              max={60}
              step={1}
              onChange={(v) => update("timerDuration", Number(v))}
            />
          </ControlGroup>
        )}
      </Section>
    </div>
  );
}
