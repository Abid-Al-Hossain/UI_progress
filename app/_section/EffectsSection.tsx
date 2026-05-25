import React from "react";
import { type ProgressState, type ProgressUpdater } from "../types";
import { SectionCard as Section } from "@/components/shared/layout/SectionCard";
import { LabeledField as ControlGroup } from "@/components/shared/layout/LabeledField";
import SliderControl from "@/components/shared/input/Slider";
import SelectControl from "@/components/shared/input/Select";
import SwitchControl from "@/components/shared/input/Switch";
import ColorControl from "@/components/shared/color/ColorControl";

type Props = {
  state: ProgressState;
  update: ProgressUpdater;
};

export default function EffectsSection({ state, update }: Props) {
  return (
    <div className="space-y-6">
      <Section title="Main Effect" subtitle="Visual overlay effects">
        <ControlGroup label="Effect Type">
          <SelectControl
            value={state.effect}
            options={[
              { label: "None", value: "none" },
              { label: "Stripes (Animated)", value: "stripes" },
              { label: "Soft Glow", value: "glow" },
              { label: "Liquid (Gooey)", value: "liquid" },
              { label: "Glitch (Cyber)", value: "glitch" },
              { label: "Retro (Pixel)", value: "retro" },
              { label: "Pulse", value: "pulse" },
              { label: "Neon Glow", value: "neon" },
              { label: "Frosted Glass", value: "glass" },
            ]}
            onChange={(v) => update("effect", v as ProgressState["effect"])}
          />
        </ControlGroup>

        {state.effect === "stripes" && (
          <>
            <ControlGroup label="Stripe Color">
              <ColorControl
                label="Stripe"
                value={state.stripeColor}
                onChange={(v) => update("stripeColor", v)}
              />
            </ControlGroup>
            <ControlGroup label="Speed">
              <SliderControl
                value={state.stripeSpeed}
                min={0}
                max={10}
                step={0.1}
                onChange={(v) => update("stripeSpeed", Number(v))}
              />
            </ControlGroup>
            <ControlGroup label="Animate Stripes">
              <SwitchControl
                checked={state.stripesAnimated}
                onChange={(v) => update("stripesAnimated", v)}
              />
            </ControlGroup>
          </>
        )}

        {(state.effect === "glow" || state.effect === "neon") && (
          <ControlGroup label="Blur Radius">
            <SliderControl
              value={state.glowBlur}
              min={0}
              max={50}
              step={1}
              onChange={(v) => update("glowBlur", Number(v))}
            />
          </ControlGroup>
        )}

        {state.effect === "glitch" && (
          <ControlGroup label="Intensity">
            <SliderControl
              value={state.glitchIntensity}
              min={0}
              max={100}
              step={1}
              onChange={(v) => update("glitchIntensity", Number(v))}
            />
          </ControlGroup>
        )}

        {state.effect === "liquid" && (
          <ControlGroup label="Viscosity">
            <SliderControl
              value={state.liquidViscosity}
              min={1}
              max={20}
              step={1}
              onChange={(v) => update("liquidViscosity", Number(v))}
            />
          </ControlGroup>
        )}
      </Section>

      <Section title="Particles" subtitle="Confetti and sparks">
        <ControlGroup label="Enable Particles">
          <SwitchControl
            checked={state.hasParticles}
            onChange={(v) => update("hasParticles", v)}
          />
        </ControlGroup>

        {state.hasParticles && (
          <ControlGroup label="Particle Type">
            <SelectControl
              value={state.particleType}
              options={[
                { label: "Sparks", value: "sparks" },
                { label: "Confetti", value: "confetti" },
                { label: "Fire", value: "fire" },
              ]}
              onChange={(v) =>
                update("particleType", v as ProgressState["particleType"])
              }
            />
          </ControlGroup>
        )}
      </Section>

    </div>
  );
}
