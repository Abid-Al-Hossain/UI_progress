import React from "react";
import { type ProgressState, type ProgressUpdater } from "../types";
import { SectionCard as Section } from "@/components/shared/layout/SectionCard";
import { LabeledField as ControlGroup } from "@/components/shared/layout/LabeledField";
import ColorControl from "@/components/shared/color/ColorControl";
import { SegmentedControl } from "@/components/shared/input/SegmentedControl";

type Props = {
  state: ProgressState;
  update: ProgressUpdater;
};

export default function StatesSection({ state, update }: Props) {
  return (
    <div className="space-y-6">
      <Section title="Focus Ring" subtitle="Keyboard focus indicator (e.g. for an upload-cancel control).">
        <ControlGroup label="Enabled">
          <SegmentedControl
            value={state.focusRingEnabled ? "true" : "false"}
            onChange={(v) => update("focusRingEnabled", v === "true")}
            items={[{ value: "false", label: "No" }, { value: "true", label: "Yes" }]}
          />
        </ControlGroup>
        <ControlGroup label="Ring Color">
          <ColorControl label="Ring Color" value={state.focusRingColor} onChange={(v) => update("focusRingColor", v)} />
        </ControlGroup>
      </Section>

      <Section title="Transitions" subtitle="Timing for value/opacity changes (steps and disabled fade use this too).">
        <ControlGroup label="Easing">
          <SegmentedControl
            value={state.transitionEasing}
            onChange={(v) => update("transitionEasing", v as ProgressState["transitionEasing"])}
            items={[
              { value: "ease", label: "Ease" },
              { value: "ease-in", label: "In" },
              { value: "ease-out", label: "Out" },
              { value: "ease-in-out", label: "In-Out" },
              { value: "linear", label: "Linear" },
            ]}
          />
        </ControlGroup>
      </Section>

      <Section title="Disabled State" subtitle="Greyed-out, non-interactive progress (e.g. cancelled action).">
        <ControlGroup label="Disabled">
          <SegmentedControl
            value={state.disabled ? "true" : "false"}
            onChange={(v) => update("disabled", v === "true")}
            items={[{ value: "false", label: "No" }, { value: "true", label: "Yes" }]}
          />
        </ControlGroup>
      </Section>

      <Section title="Step Colors" subtitle="Explicit colors for steps mode (completed / active / inactive).">
        <ControlGroup label="Completed">
          <ColorControl label="Completed" value={state.stepsCompletedColor} onChange={(v) => update("stepsCompletedColor", v)} />
        </ControlGroup>
        <ControlGroup label="Active">
          <ColorControl label="Active" value={state.stepsActiveColor} onChange={(v) => update("stepsActiveColor", v)} />
        </ControlGroup>
        <ControlGroup label="Inactive">
          <ColorControl label="Inactive" value={state.stepsInactiveColor} onChange={(v) => update("stepsInactiveColor", v)} />
        </ControlGroup>
      </Section>
    </div>
  );
}
