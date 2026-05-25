import React from "react";
import { type ProgressState, type ProgressUpdater } from "../types";
import { SectionCard as Section } from "@/components/shared/layout/SectionCard";
import { LabeledField as ControlGroup } from "@/components/shared/layout/LabeledField";
import InputControl from "@/components/shared/input/Input";

type Props = {
  state: ProgressState;
  update: ProgressUpdater;
};

export default function MetadataSection({ state, update }: Props) {
  return (
    <div className="space-y-6">
      <Section title="Metadata" subtitle="ARIA naming and descriptive metadata.">
        <ControlGroup label="Aria Label">
          <InputControl
            value={state.ariaLabel}
            onChange={(e) => update("ariaLabel", e.target.value)}
            placeholder="e.g. File upload progress"
          />
        </ControlGroup>

        <ControlGroup label="Aria Described By (ID)">
          <InputControl
            value={state.ariaDescribedBy}
            onChange={(e) => update("ariaDescribedBy", e.target.value)}
            placeholder="e.g. progress-description"
          />
        </ControlGroup>

        <ControlGroup label="Aria Value Text">
          <InputControl
            value={state.ariaValueText}
            onChange={(e) => update("ariaValueText", e.target.value)}
            placeholder="e.g. 72 percent uploaded"
          />
        </ControlGroup>
      </Section>
    </div>
  );
}
