"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionCard, LabeledField, Segmented } from "@/components/shared/layout/ui";
import Select from "@/components/shared/input/Select";
import type { ProgressPreset } from "../_data/progressPresets";
import type { ProgressState } from "../types";

const PAGE_SIZE = 12;

function pickRandomPreset<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function Badge({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full border px-2 py-1 text-[11px] font-medium"
      style={{
        borderColor: "color-mix(in oklab, var(--border) 85%, transparent)",
        background: "color-mix(in oklab, var(--surface) 78%, transparent)",
        color: "var(--muted)",
      }}
    >
      {label}
    </span>
  );
}

function PreviewBar({ preset }: { preset: ProgressPreset }) {
  const state = preset.state;
  const min = state.min ?? 0;
  const max = state.max ?? 100;
  const value = state.value ?? 0;
  const percent =
    max <= min ? 0 : Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const isVertical = state.orientation === "vertical";
  const trackColor = state.trackColor || "#e2e8f0";
  const trackOpacity = state.trackOpacity ?? 0.2;
  const fillColor =
    state.status && state.status !== "normal"
      ? state.status === "success"
        ? "#22c55e"
        : state.status === "error"
          ? "#ef4444"
          : state.status === "warning"
            ? "#f59e0b"
            : "#3b82f6"
      : state.color1 || "#3b82f6";
  const fillStyle = isVertical
    ? { height: `${percent}%`, width: "100%" }
    : { width: `${percent}%`, height: "100%" };

  return (
    <div
      className="mt-3 rounded-2xl border p-3"
      style={{
        borderColor: "var(--border)",
        background: "color-mix(in oklab, var(--bg) 64%, transparent)",
      }}
    >
      <div className="flex items-center justify-between gap-3 text-xs">
        <span style={{ color: "var(--muted)" }}>{preset.family}</span>
        <span style={{ color: "var(--muted)" }}>
          {preset.mode} · {preset.effect}
        </span>
      </div>
      <div
        className="relative mt-3 overflow-hidden rounded-full"
        style={{
          width: isVertical ? 22 : "100%",
          height: isVertical ? 88 : 16,
          background: trackColor,
          opacity: trackOpacity,
        }}
      >
        <div
          className="absolute rounded-full"
          style={{
            [isVertical ? "bottom" : "left"]: 0,
            [isVertical ? "width" : "height"]: "100%",
            ...fillStyle,
            background: fillColor,
            boxShadow:
              state.effect === "glow" || state.effect === "neon"
                ? `0 0 12px ${fillColor}`
                : "none",
          }}
        />
        {state.effect === "stripes" ? (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(255,255,255,0.22) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.22) 75%, transparent 75%, transparent)",
              backgroundSize: "18px 18px",
              opacity: 0.18,
              pointerEvents: "none",
            }}
          />
        ) : null}
      </div>
      {state.labels?.[0] ? (
        <div className="mt-2 text-[11px] font-medium" style={{ color: "var(--text)" }}>
          {state.labels[0].format === "fraction"
            ? `${Math.round(value)}/${Math.round(max)}`
            : state.labels[0].format === "value"
              ? `${Math.round(value)}`
              : `${Math.round(percent)}%`}
        </div>
      ) : null}
    </div>
  );
}

export default function PresetsSection({
  state,
  presets,
  onApplyPreset,
}: {
  state: ProgressState;
  presets: ProgressPreset[];
  onApplyPreset: (preset: ProgressPreset) => void;
}) {
  const [query, setQuery] = useState("");
  const [familyFilter, setFamilyFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");
  const [effectFilter, setEffectFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [orientationFilter, setOrientationFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [pageDirection, setPageDirection] = useState(0);

  const families = useMemo(
    () => Array.from(new Set(presets.map((preset) => preset.family))),
    [presets],
  );
  const modes = useMemo(
    () => Array.from(new Set(presets.map((preset) => preset.mode))),
    [presets],
  );
  const effects = useMemo(
    () => Array.from(new Set(presets.map((preset) => preset.effect))),
    [presets],
  );
  const sizes = useMemo(
    () => Array.from(new Set(presets.map((preset) => preset.sizePreset))),
    [presets],
  );
  const orientations = useMemo(
    () => Array.from(new Set(presets.map((preset) => preset.orientation))),
    [presets],
  );
  const search = query.trim().toLowerCase();

  const filtered = presets.filter((preset) => {
    if (familyFilter !== "all" && preset.family !== familyFilter) return false;
    if (modeFilter !== "all" && preset.mode !== modeFilter) return false;
    if (effectFilter !== "all" && preset.effect !== effectFilter) return false;
    if (sizeFilter !== "all" && preset.sizePreset !== sizeFilter) return false;
    if (
      orientationFilter !== "all" &&
      preset.orientation !== orientationFilter
    ) {
      return false;
    }
    if (!search) return true;

    const haystack = [
      preset.name,
      preset.summary,
      preset.family,
      preset.mode,
      preset.effect,
      preset.sizePreset,
      ...preset.tags,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(search);
  });

  const resultLabel = `${filtered.length} ${filtered.length === 1 ? "match" : "matches"}`;
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const visible = filtered.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE,
  );
  const pageKey = [
    safePage,
    query.trim().toLowerCase(),
    familyFilter,
    modeFilter,
    effectFilter,
    sizeFilter,
    orientationFilter,
  ].join(":");

  const resetFilters = () => {
    setPageDirection(0);
    setQuery("");
    setFamilyFilter("all");
    setModeFilter("all");
    setEffectFilter("all");
    setSizeFilter("all");
    setOrientationFilter("all");
    setPage(0);
  };

  const applyRandomPreset = () => {
    if (!filtered.length) return;
    onApplyPreset(pickRandomPreset(filtered));
  };

  const goToPage = (targetPage: number) => {
    if (targetPage === safePage) return;
    setPageDirection(targetPage > safePage ? 1 : -1);
    setPage(targetPage);
  };

  const activeName = state.downloadName || "";

  return (
    <SectionCard
      title="Presets"
      subtitle={`${presets.length} editable starting points built from the current progress system.`}
    >
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <LabeledField label="Search presets" hint={resultLabel}>
            <input
              value={query}
              onChange={(event) => {
                setPageDirection(0);
                setQuery(event.target.value);
                setPage(0);
              }}
              placeholder="Search by name, family, mode, or tag"
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
              style={{
                borderColor: "var(--border)",
                background:
                  "color-mix(in oklab, var(--surface) 70%, transparent)",
                color: "var(--text)",
              }}
            />
          </LabeledField>

          <LabeledField label="Mode">
            <Segmented
              value={modeFilter}
              onChange={(value: string) => {
                setPageDirection(0);
                setModeFilter(value);
                setPage(0);
              }}
              items={[
                { value: "all", label: "All" },
                ...modes.map((mode) => ({ value: mode, label: mode })),
              ]}
            />
          </LabeledField>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <LabeledField label="Family">
            <Select
              value={familyFilter}
              onChange={(value: string) => {
                setPageDirection(0);
                setFamilyFilter(value);
                setPage(0);
              }}
              options={[
                { value: "all", label: "All families" },
                ...families.map((family) => ({ value: family, label: family })),
              ]}
            />
          </LabeledField>

          <LabeledField label="Effect">
            <Select
              value={effectFilter}
              onChange={(value: string) => {
                setPageDirection(0);
                setEffectFilter(value);
                setPage(0);
              }}
              options={[
                { value: "all", label: "All effects" },
                ...effects.map((effect) => ({ value: effect, label: effect })),
              ]}
            />
          </LabeledField>

          <LabeledField label="Size">
            <Select
              value={sizeFilter}
              onChange={(value: string) => {
                setPageDirection(0);
                setSizeFilter(value);
                setPage(0);
              }}
              options={[
                { value: "all", label: "All sizes" },
                ...sizes.map((size) => ({ value: size, label: size })),
              ]}
            />
          </LabeledField>

          <LabeledField label="Orientation">
            <Select
              value={orientationFilter}
              onChange={(value: string) => {
                setPageDirection(0);
                setOrientationFilter(value);
                setPage(0);
              }}
              options={[
                { value: "all", label: "All orientations" },
                ...orientations.map((orientation) => ({
                  value: orientation,
                  label: orientation,
                })),
              ]}
            />
          </LabeledField>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-xl border px-3 py-2 text-sm font-semibold uf-clickable"
            style={{
              borderColor: "var(--border)",
              background:
                "color-mix(in oklab, var(--surface) 70%, transparent)",
              color: "var(--text)",
            }}
          >
            Reset filters
          </button>

          <button
            type="button"
            onClick={applyRandomPreset}
            disabled={!filtered.length}
            className="rounded-xl border px-3 py-2 text-sm font-semibold uf-clickable"
            style={{
              borderColor: "color-mix(in oklab, var(--primary) 55%, var(--border))",
              background: "color-mix(in oklab, var(--primary) 18%, transparent)",
              color: "var(--text)",
            }}
          >
            Surprise me
          </button>

          <div className="text-xs" style={{ color: "var(--muted)" }}>
            Presets apply a full editable progress snapshot. Keep tweaking from any section after applying one.
          </div>
        </div>

        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" initial={false} custom={pageDirection}>
            <motion.div
              key={pageKey}
              custom={pageDirection}
              initial={{ opacity: 0, x: pageDirection > 0 ? 24 : pageDirection < 0 ? -24 : 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: pageDirection > 0 ? -24 : pageDirection < 0 ? 24 : 0 }}
              transition={{
                x: { type: "spring", stiffness: 320, damping: 34, mass: 0.9 },
                opacity: { duration: 0.16, ease: "linear" },
              }}
              className="grid gap-3 lg:grid-cols-2"
              style={{ willChange: "transform, opacity" }}
            >
              {visible.length === 0 ? (
                <div
                  className="rounded-2xl border p-6 text-sm lg:col-span-2"
                  style={{
                    borderColor: "var(--border)",
                    background:
                      "color-mix(in oklab, var(--card) 68%, transparent)",
                    color: "var(--muted)",
                  }}
                >
                  No presets match the current filters. Adjust or reset the filters to continue.
                </div>
              ) : (
                visible.map((preset, index) => {
                  const active = activeName === preset.state.downloadName;

                  return (
                    <motion.div
                      key={preset.id}
                      initial={{
                        opacity: 0,
                        x: pageDirection > 0 ? 24 : pageDirection < 0 ? -24 : 0,
                        y: 0,
                      }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={{
                        x: {
                          type: "spring",
                          stiffness: 340,
                          damping: 32,
                          mass: 0.9,
                        },
                        opacity: {
                          duration: 0.18,
                          delay: Math.min(index, 7) * 0.015,
                          ease: "linear",
                        },
                      }}
                      className="rounded-2xl border p-3"
                      data-audit="preset-card"
                      data-preset-id={preset.id}
                      style={{
                        borderColor: active
                          ? "color-mix(in oklab, var(--primary) 70%, var(--border))"
                          : "var(--border)",
                        background: active
                          ? "color-mix(in oklab, var(--primary) 10%, var(--card))"
                          : "color-mix(in oklab, var(--card) 72%, transparent)",
                        boxShadow: active
                          ? "0 0 0 1px color-mix(in oklab, var(--primary) 40%, transparent)"
                          : "none",
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                            {preset.name}
                          </div>
                          <div className="text-xs leading-5" style={{ color: "var(--muted)" }}>
                            {preset.summary}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onApplyPreset(preset)}
                          className="rounded-xl px-3 py-2 text-xs font-semibold uf-clickable"
                          style={{
                            background: active ? "var(--primary)" : "var(--surface)",
                            color: active ? "#ffffff" : "var(--text)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          {active ? "Applied" : "Apply"}
                        </button>
                      </div>

                      <PreviewBar preset={preset} />

                      <div className="mt-3 flex flex-wrap gap-2">
                        {preset.tags.slice(0, 5).map((tag) => (
                          <Badge key={tag} label={tag} />
                        ))}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {pageCount > 1 ? (
          <div className="flex items-center justify-between gap-3 rounded-2xl border p-3"
            style={{
              borderColor: "var(--border)",
              background: "color-mix(in oklab, var(--surface) 65%, transparent)",
            }}
          >
            <div className="text-xs" style={{ color: "var(--muted)" }}>
              Page {safePage + 1} of {pageCount}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goToPage(Math.max(0, safePage - 1))}
                disabled={safePage <= 0}
                className="rounded-xl border px-3 py-2 text-xs font-semibold uf-clickable disabled:opacity-60"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--surface)",
                  color: "var(--text)",
                }}
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => goToPage(Math.min(pageCount - 1, safePage + 1))}
                disabled={safePage >= pageCount - 1}
                className="rounded-xl border px-3 py-2 text-xs font-semibold uf-clickable disabled:opacity-60"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--surface)",
                  color: "var(--text)",
                }}
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </SectionCard>
  );
}
