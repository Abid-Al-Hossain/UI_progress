import React from "react";
import { type ProgressState, type ProgressUpdater } from "../types";
import { SectionCard as Section } from "@/components/shared/layout/SectionCard";
import { LabeledField as ControlGroup } from "@/components/shared/layout/LabeledField";
import SelectControl from "@/components/shared/input/Select";
import ColorControl from "@/components/shared/color/ColorControl";

type Props = {
  state: ProgressState;
  update: ProgressUpdater;
};

export default function ColorsSection({ state, update }: Props) {
  return (
    <div className="space-y-6">
      <Section title="Colors" subtitle="Fill, gradient, and track styling">
        <ControlGroup label="Color Mode">
          <SelectControl
            value={state.colorMode}
            options={[
              { label: "Solid", value: "solid" },
              { label: "Gradient", value: "gradient" },
              { label: "Duotone", value: "duotone" },
            ]}
            onChange={(v) => update("colorMode", v as ProgressState["colorMode"])}
          />
        </ControlGroup>

        {state.colorMode === "solid" && (
          <ControlGroup label="Primary Color">
            <ColorControl
              label="Primary"
              value={state.color1}
              onChange={(v) => update("color1", v)}
            />
          </ControlGroup>
        )}

        {state.colorMode === "gradient" && (
          <>
            <ControlGroup label="Start Color">
              <ColorControl
                label="Start"
                value={state.color1}
                onChange={(v) => update("color1", v)}
              />
            </ControlGroup>
            <ControlGroup label="End Color">
              <ColorControl
                label="End"
                value={state.color2}
                onChange={(v) => update("color2", v)}
              />
            </ControlGroup>
          </>
        )}

        {state.colorMode === "duotone" && (
          <>
            <ControlGroup label="Start Color">
              <ColorControl
                label="Start"
                value={state.color1}
                onChange={(v) => update("color1", v)}
              />
            </ControlGroup>
            <ControlGroup label="Middle Color">
              <ColorControl
                label="Middle"
                value={state.color3}
                onChange={(v) => update("color3", v)}
              />
            </ControlGroup>
            <ControlGroup label="End Color">
              <ColorControl
                label="End"
                value={state.color2}
                onChange={(v) => update("color2", v)}
              />
            </ControlGroup>
          </>
        )}

      </Section>
    </div>
  );
}
