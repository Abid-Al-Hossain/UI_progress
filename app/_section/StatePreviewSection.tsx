"use client";

import React from "react";
import { type ProgressState, type ProgressUpdater } from "../types";
import { SectionCard as Section } from "@/components/shared/layout/SectionCard";
import { LabeledField as ControlGroup } from "@/components/shared/layout/LabeledField";
import SliderControl from "@/components/shared/input/Slider";
import SelectControl from "@/components/shared/input/Select";
import SwitchControl from "@/components/shared/input/Switch";

type Props = {
  state: ProgressState;
  update: ProgressUpdater;
};

export default function StatePreviewSection({ state, update }: Props) {
  return (
    <div className="space-y-6">
      <Section
        title="State Preview"
        subtitle="Force realistic progress states without leaving the main preview shell."
      >
        <div className="space-y-4">
          <ControlGroup label="Mode">
            <SelectControl
              value={state.mode}
              options={[
                { label: "Determinate", value: "determinate" },
                { label: "Indeterminate", value: "indeterminate" },
                { label: "Buffer", value: "buffer" },
                { label: "Steps", value: "steps" },
                { label: "Timer", value: "timer" },
              ]}
              onChange={(v) => update("mode", v as ProgressState["mode"])}
            />
          </ControlGroup>

          <ControlGroup label="Status">
            <SelectControl
              value={state.status}
              options={[
                { label: "Normal", value: "normal" },
                { label: "Active", value: "active" },
                { label: "Success", value: "success" },
                { label: "Error", value: "error" },
                { label: "Warning", value: "warning" },
              ]}
              onChange={(v) => update("status", v as ProgressState["status"])}
            />
          </ControlGroup>

          <ControlGroup label="Value">
            <SliderControl
              value={state.value}
              min={state.min}
              max={state.max}
              step={1}
              onChange={(v) => update("value", Number(v))}
            />
          </ControlGroup>

          {state.mode === "buffer" ? (
            <ControlGroup label="Buffer Value">
              <SliderControl
                value={state.bufferValue}
                min={state.min}
                max={state.max}
                step={1}
                onChange={(v) => update("bufferValue", Number(v))}
              />
            </ControlGroup>
          ) : null}

          {state.mode === "determinate" ? (
            <ControlGroup label="Success Overlay">
              <SliderControl
                value={state.successPercent}
                min={0}
                max={state.value}
                step={1}
                onChange={(v) => update("successPercent", Number(v))}
              />
            </ControlGroup>
          ) : null}

          <ControlGroup label="Show Status Icon">
            <SwitchControl
              checked={state.showStatusIcon}
              onChange={(v) => update("showStatusIcon", v)}
            />
          </ControlGroup>

          <ControlGroup label="Show Status Label">
            <SwitchControl
              checked={state.showStatusLabel}
              onChange={(v) => update("showStatusLabel", v)}
            />
          </ControlGroup>
        </div>
      </Section>
    </div>
  );
}
