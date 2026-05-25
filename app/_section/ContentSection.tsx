import React from "react";
import { type ProgressState, type ProgressUpdater } from "../types";
import { SectionCard as Section } from "@/components/shared/layout/SectionCard";
import { LabeledField as ControlGroup } from "@/components/shared/layout/LabeledField";
import InputControl from "@/components/shared/input/Input";

type Props = {
  state: ProgressState;
  update: ProgressUpdater;
};

export default function ContentSection({ state, update }: Props) {
  return (
    <div className="space-y-6">
      <Section title="Values" subtitle="Progress bar values">
        <ControlGroup label="Current Value">
          <InputControl
            type="number"
            value={state.value}
            onChange={(v) => update("value", Number(v))}
            min={state.min}
            max={state.max}
          />
        </ControlGroup>

        <ControlGroup label="Min / Max">
          <div className="flex gap-2">
            <InputControl
              type="number"
              value={state.min}
              onChange={(v) => update("min", Number(v))}
              placeholder="Min"
            />
            <InputControl
              type="number"
              value={state.max}
              onChange={(v) => update("max", Number(v))}
              placeholder="Max"
            />
          </div>
        </ControlGroup>
      </Section>
    </div>
  );
}
