import React from "react";
import { SectionCard as Section } from "@/components/shared/layout/SectionCard";

export default function AccessibilitySection() {
  return (
    <div className="space-y-6">
      <Section title="Accessibility" subtitle="Best practices for progress semantics">
        <div className="text-xs text-slate-400 space-y-2">
          <p>
            - <strong>aria-label</strong>: Describes what the progress bar
            represents.
          </p>
          <p>
            - <strong>aria-describedby</strong>: ID of an element that provides
            additional context.
          </p>
          <p>
            - <strong>aria-valuetext</strong>: Optional human-readable progress
            value for assistive tech.
          </p>
          <p>
            - For indeterminate progress, use descriptive labels like &quot;Loading
            content&quot;.
          </p>
          <p>
            - Value, min, and max are automatically added to the progress element.
          </p>
        </div>
      </Section>
    </div>
  );
}
