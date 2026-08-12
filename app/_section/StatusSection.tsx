"use client";

import React from "react";
import {
  type ProgressState,
  type ProgressUpdater,
  STATUS_LABEL_POSITION_OPTIONS,
} from "../types";
import { SectionCard as Section } from "@/components/shared/layout/SectionCard";
import { LabeledField as ControlGroup } from "@/components/shared/layout/LabeledField";
import InputControl from "@/components/shared/input/Input";
import SelectControl from "@/components/shared/input/Select";
import SwitchControl from "@/components/shared/input/Switch";

type Props = {
  state: ProgressState;
  update: ProgressUpdater;
};

export default function StatusSection({ state, update }: Props) {
  return (
    <div className="space-y-6">
      <Section title="Status" subtitle="Visual state and status copy">
        <div className="space-y-4">
          <ControlGroup label="Status">
            <SelectControl
              value={state.status}
              options={[
                { label: "Normal", value: "normal" },
                { label: "Active (Pulsing)", value: "active" },
                { label: "Success (Green)", value: "success" },
                { label: "Error (Red)", value: "error" },
                { label: "Warning (Amber)", value: "warning" },
              ]}
              onChange={(v) => update("status", v as ProgressState["status"])}
            />
          </ControlGroup>

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

          {state.showStatusLabel ? (
            <>
              <ControlGroup label="Status Label">
                <InputControl
                  value={state.statusLabel}
                  onChange={(value) => update("statusLabel", value)}
                  placeholder="e.g. Uploading, On track, At risk"
                />
              </ControlGroup>

              <ControlGroup label="Status Label Position">
                <SelectControl
                  value={state.statusLabelPosition}
                  options={STATUS_LABEL_POSITION_OPTIONS}
                  onChange={(v) =>
                    update(
                      "statusLabelPosition",
                      v as ProgressState["statusLabelPosition"],
                    )
                  }
                />
              </ControlGroup>
            </>
          ) : null}
        </div>
      </Section>
    </div>
  );
}
