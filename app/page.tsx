"use client";

import React, { useState, useMemo } from "react";
import AppShell from "@/components/shared/layout/AppShell";
import { PlaygroundLayout } from "@/components/shared/layout/PlaygroundLayout";
import PreviewDownloadPanel from "@/components/shared/layout/SharedPreviewDownloadPanel";
import type { PreviewCanvasMode } from "@/components/shared/layout/PreviewPanel";
import useHydrated from "@/components/hooks/useHydrated";
import { useHistoryState } from "@/components/hooks/useHistoryState";
import {
  INITIAL_PROGRESS_STATE,
  type ProgressLabelsUpdater,
  type ProgressState,
  type ProgressUpdater,
} from "./types";
import { buildProgressExport } from "./_utils/exportUtils";
import { ProgressPreview } from "./_components/ProgressPreview";
import { PROGRESS_PRESETS } from "./_data/progressPresets";
import UndoRedoButtons from "@/components/shared/layout/UndoRedoButtons";
import SectionSelector from "@/components/shared/layout/SectionSelector";

import PresetsSection from "./_section/PresetsSection";
import BasicsSection from "./_section/BasicsSection";
import MetadataSection from "./_section/MetadataSection";
import SizingSection from "./_section/SizingSection";
import ColorsSection from "./_section/ColorsSection";
import TrackSection from "./_section/TrackSection";
import EffectsSection from "./_section/EffectsSection";
import MotionSection from "./_section/MotionSection";
import ContentSection from "./_section/ContentSection";
import SurfaceSection from "./_section/SurfaceSection";
import LabelsSection from "./_section/LabelsSection";
import AccessibilitySection from "./_section/AccessibilitySection";
import StatusSection from "./_section/StatusSection";
import ThreeDSection from "./_section/ThreeDSection";
import StatePreviewSection from "./_section/StatePreviewSection";
import StatesSection from "./_section/StatesSection";
export default function ProgressBarPlayground() {
  const mounted = useHydrated();
  const [previewResetKey, setPreviewResetKey] = useState(0);
  const [previewBgMode, setPreviewBgMode] = useState<PreviewCanvasMode>("custom");
  const [previewBgInput, setPreviewBgInput] = useState("#0b1220");
  const {
    state,
    set: updateState,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
  } = useHistoryState<ProgressState>(INITIAL_PROGRESS_STATE);
  const [activeSection, setActiveSection] = useState("presets");

  const handleUpdate: ProgressUpdater = (key, value) => {
    updateState((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdateLabels: ProgressLabelsUpdater = (labels) => {
    updateState((prev) => ({ ...prev, labels }));
  };

  const handleApplyPreset = (preset: (typeof PROGRESS_PRESETS)[number]) => {
    updateState((prev) => ({
      ...prev,
      ...preset.state,
      labels: preset.state.labels
        ? preset.state.labels.map((label) => ({ ...label }))
        : prev.labels,
    }));
    setPreviewResetKey((value) => value + 1);
  };

  const handleReset = () => {
    reset();
    setPreviewResetKey((value) => value + 1);
  };

  // --- Header Actions (Matching Avatar Template) ---
  const headerActions = (
    <UndoRedoButtons
      undo={undo}
      redo={redo}
      reset={handleReset}
      canUndo={canUndo}
      canRedo={canRedo}
    />
  );

  // --- Controls & Navigation ---
  const renderActiveSection = () => {
    switch (activeSection) {
      case "presets":
        return (
          <PresetsSection
            state={state}
            presets={PROGRESS_PRESETS}
            onApplyPreset={handleApplyPreset}
          />
        );
      case "basics":
        return <BasicsSection state={state} update={handleUpdate} />;
      case "metadata":
        return <MetadataSection state={state} update={handleUpdate} />;
      case "sizing":
        return <SizingSection state={state} update={handleUpdate} />;
      case "colors":
        return <ColorsSection state={state} update={handleUpdate} />;
      case "track":
        return <TrackSection state={state} update={handleUpdate} />;
      case "surface":
        return <SurfaceSection state={state} update={handleUpdate} />;
      case "status":
        return <StatusSection state={state} update={handleUpdate} />;
      case "state-preview":
        return <StatePreviewSection state={state} update={handleUpdate} />;
      case "effects":
        return <EffectsSection state={state} update={handleUpdate} />;
      case "depth":
        return <ThreeDSection state={state} update={handleUpdate} />;
      case "motion":
        return <MotionSection state={state} update={handleUpdate} />;
      case "content":
        return <ContentSection state={state} update={handleUpdate} />;
      case "labels":
        return (
          <LabelsSection state={state} updateLabels={handleUpdateLabels} />
        );
      case "accessibility":
        return <AccessibilitySection />;
      case "states":
        return <StatesSection state={state} update={handleUpdate} />;
      default:
        return null;
    }
  };

  const sections = [
    { id: "presets", label: "Presets" },
    { id: "basics", label: "Basics" },
    { id: "metadata", label: "Metadata" },
    { id: "sizing", label: "Sizing" },
    { id: "colors", label: "Colors" },
    { id: "track", label: "Track" },
    { id: "surface", label: "Surface" },
    { id: "status", label: "Status" },
    { id: "state-preview", label: "State Preview" },
    { id: "effects", label: "Effects" },
    { id: "depth", label: "Depth" },
    { id: "motion", label: "Motion" },
    { id: "labels", label: "Labels" },
    { id: "content", label: "Content" },
    { id: "accessibility", label: "Accessibility" },
    { id: "states", label: "States" },
  ];

  const controls = (
    <div className="p-6 space-y-8">
      <SectionSelector
        sections={sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      {renderActiveSection()}
    </div>
  );

  // --- Preview & Download ---
  // Refactored Export for Code View
  const exportPayload = useMemo(() => {
    return {
      ...state,
      downloadName: state.downloadName || "progress",
    };
  }, [state]);

  const exportCode = useMemo(() => buildProgressExport(exportPayload), [exportPayload]);

  const handleDownload = () => {
    const { content, filename } = buildProgressExport(exportPayload);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const preview = (
    <PreviewDownloadPanel
      mounted={mounted}
      iframeSrcDoc="" // We use inline React preview for progress bar
      iframeRef={{ current: null }}
      handleIframeLoad={() => {}}
      downloadFormat="react"
      downloadName={state.downloadName || "progress"}
      setDownloadFormat={() => {}}
      setDownloadName={(v) => handleUpdate("downloadName", v)}
      handleDownload={handleDownload}
      previewBgMode={previewBgMode}
      setPreviewBgMode={setPreviewBgMode}
      previewBgInput={previewBgInput}
      setPreviewBgInput={setPreviewBgInput}
      previewNode={<ProgressPreview key={previewResetKey} state={state} />}
      code={exportCode.content}
    />
  );

  return (
    <AppShell contentOverflow="hidden">
      <PlaygroundLayout
        title="Progress Playground"
        headerActions={headerActions}
        controls={controls}
        preview={preview}
      />
    </AppShell>
  );
}


