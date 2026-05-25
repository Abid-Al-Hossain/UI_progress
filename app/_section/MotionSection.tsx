import React from "react";
import { type ProgressState, type ProgressUpdater } from "../types";
import { SectionCard as Section } from "@/components/shared/layout/SectionCard";
import { LabeledField as ControlGroup } from "@/components/shared/layout/LabeledField";
import SliderControl from "@/components/shared/input/Slider";
import SwitchControl from "@/components/shared/input/Switch";

type Props = {
  state: ProgressState;
  update: ProgressUpdater;
};

export default function MotionSection({ state, update }: Props) {
  return (
    <div className="space-y-6">
      <Section title="Motion" subtitle="Animation timing and reduced-motion behavior">
        <ControlGroup label="Disable All Animation">
          <SwitchControl
            checked={state.disableAnimation}
            onChange={(v) => update("disableAnimation", v)}
          />
        </ControlGroup>

        {!state.disableAnimation ? (
          <ControlGroup label="Animation Duration (sec)">
            <SliderControl
              value={state.animationDuration}
              min={0.1}
              max={2}
              step={0.1}
              onChange={(v) => update("animationDuration", Number(v))}
            />
          </ControlGroup>
        ) : null}
      </Section>
    </div>
  );
}
