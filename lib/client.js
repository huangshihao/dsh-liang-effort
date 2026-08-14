window.__ModuleLoader__.load({
  id: 'dsh-liang-effort',
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.tsx
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);
var import_react = require("react");

// src/client/model.ts
var LIANG_EFFORTS = [
  { id: "off", label: "\u7262\u6881", level: 6 },
  { id: "high", label: "\u6881\u5B50", level: 12 },
  { id: "max", label: "\u6881\u5723", level: 18 }
];
var LIANG_STAGES = ["\u5C0F\u96BE\u6881", "\u7262\u6881", "\u6881\u5B50", "\u6881\u5723", "\u6881\u795E", "\u6881\u7956"];
var SEMANTIC_STAGE = /* @__PURE__ */ new Map([
  ["off", 0],
  ["none", 0],
  ["disabled", 0],
  ["minimal", 1],
  ["min", 1],
  ["low", 2],
  ["medium", 3],
  ["med", 3],
  ["high", 4],
  ["max", 5],
  ["maximum", 5],
  ["xhigh", 5],
  ["ultra", 5]
]);
function automaticStage(effort, index, count) {
  const id = effort.id.trim().toLowerCase().replaceAll(/[_\s-]+/g, "");
  const name = effort.name.trim().toLowerCase().replaceAll(/[_\s-]+/g, "");
  const semantic = SEMANTIC_STAGE.get(id) ?? SEMANTIC_STAGE.get(name);
  if (semantic !== void 0) return semantic;
  if (count <= 1) return 2;
  return Math.round(index / (count - 1) * (LIANG_STAGES.length - 1));
}
function sliderEfforts(efforts) {
  if (efforts.length === 3) {
    return efforts.map((effort, index) => ({
      id: effort.id,
      label: LIANG_EFFORTS[index]?.label ?? effort.name,
      level: LIANG_EFFORTS[index]?.level ?? 15
    }));
  }
  return efforts.map((effort, index) => ({
    id: effort.id,
    label: LIANG_STAGES[automaticStage(effort, index, efforts.length)] ?? effort.name,
    level: automaticStage(effort, index, efforts.length) * 6
  }));
}
function effortIndexOf(efforts, effort) {
  const index = efforts.findIndex((choice) => choice.id === effort);
  return index === -1 ? 0 : index;
}

// src/client/styles.ts
var styles = String.raw`
.dle-root {
  position: relative;
  font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.dle-trigger {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  height: 28px;
  padding: 0 9px;
  border: 0;
  border-radius: 8px;
  color: var(--dle-trigger-fg, rgba(23, 23, 23, .72));
  background: transparent;
  font: inherit;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 160ms ease, color 160ms ease;
}

.dle-trigger:hover, .dle-trigger[aria-expanded="true"] {
  color: var(--dle-trigger-active-fg, #171717);
  background: var(--dle-trigger-hover, rgba(17, 17, 17, .06));
}

.dle-trigger:focus-visible, .dle-close:focus-visible, .dle-model-select:focus-visible,
.dle-range:focus-visible, .dle-generic-effort:focus-visible {
  outline: 2px solid #3b9cff;
  outline-offset: 2px;
}

.dle-trigger:disabled { opacity: .45; cursor: default; }
.dle-trigger-model { max-width: 126px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dle-trigger-effort { color: #2f8de8; font-weight: 650; white-space: nowrap; }
.dle-chevron { width: 12px; height: 12px; flex: none; transition: transform 180ms ease; }
.dle-trigger[aria-expanded="true"] .dle-chevron { transform: rotate(180deg); }

.dle-panel {
  --dle-accent: #3b9cff;
  --dle-ink: #16181b;
  --dle-muted: #8c929b;
  position: absolute;
  right: 0;
  bottom: calc(100% + 10px);
  z-index: 60;
  width: min(500px, calc(100vw - 24px));
  overflow: visible;
  color: var(--dle-ink);
  background: rgba(252, 252, 251, .96);
  border: 1px solid rgba(20, 23, 28, .16);
  border-radius: 22px;
  box-shadow: 0 22px 70px rgba(14, 18, 24, .18), 0 2px 8px rgba(14, 18, 24, .08);
  backdrop-filter: blur(18px);
  animation: dle-panel-in 180ms cubic-bezier(.2, .8, .2, 1);
}

.dle-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: .32;
  border-radius: inherit;
  background-image: linear-gradient(rgba(20, 20, 20, .018) 1px, transparent 1px);
  background-size: 100% 4px;
}

.dle-modelbar {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  min-height: 48px;
  padding: 9px 16px;
  border-top: 1px solid rgba(20, 23, 28, .1);
  border-radius: 0 0 21px 21px;
  background: rgba(20, 23, 28, .025);
}

.dle-kicker { color: var(--dle-muted); font: 650 9px/1.1 ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .16em; }
.dle-model-select {
  width: 100%;
  min-width: 0;
  padding: 5px 24px 5px 8px;
  border: 1px solid rgba(20, 23, 28, .12);
  border-radius: 8px;
  color: var(--dle-ink);
  background: rgba(255, 255, 255, .68);
  font: 600 11px/1.3 inherit;
}
.dle-modelbar .dle-chevron { color: var(--dle-muted); pointer-events: none; }
.dle-close { position: absolute; z-index: 8; top: 11px; right: 11px; display: grid; place-items: center; width: 28px; height: 28px; padding: 0; border: 0; border-radius: 50%; color: #777d85; background: rgba(252,252,251,.72); cursor: pointer; }
.dle-close:hover { color: #171717; background: rgba(17, 17, 17, .06); }

.dle-instrument {
  position: relative;
  min-height: 206px;
  padding-left: 204px;
}

.dle-portrait-shell {
  position: absolute;
  z-index: 4;
  left: 22px;
  top: -68px;
  width: 164px;
  height: 260px;
  overflow: hidden;
  border-radius: 48% 48% 18px 18px / 25% 25% 18px 18px;
  background: #101316;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .14), 0 18px 30px rgba(14,18,24,.16);
  filter: drop-shadow(0 -3px 10px rgba(14,18,24,.08));
}
.dle-portrait-shell::before, .dle-portrait-shell::after { content: ""; position: absolute; z-index: 2; pointer-events: none; }
.dle-portrait-shell::before { inset: 8px; border: 1px solid rgba(255,255,255,.2); border-left-color: transparent; border-bottom-color: transparent; border-radius: inherit; }
.dle-portrait-shell::after { inset: 0; opacity: .42; background: linear-gradient(110deg, transparent 28%, rgba(255,255,255,.12) 45%, transparent 58%); transform: translateX(-130%); }
.dle-portrait-shell.is-seeking::after { animation: dle-scan 400ms ease-out; }
.dle-video { display: block; width: 100%; height: 100%; object-fit: cover; filter: saturate(.76) contrast(1.06); transform: scale(1.025); transition: filter 320ms ease, transform 420ms cubic-bezier(.2,.8,.2,1), opacity 160ms ease; }
.dle-portrait-shell.is-seeking .dle-video { filter: saturate(.92) contrast(1.1) brightness(1.05); transform: scale(1.065); }
.dle-portrait-shell[data-level="2"] { box-shadow: inset 0 0 0 1px rgba(255,255,255,.16), 0 0 28px rgba(59,156,255,.18); }
.dle-video-loading { position: absolute; inset: 0; display: grid; place-items: center; color: rgba(255,255,255,.54); font: 600 9px/1 ui-monospace, monospace; letter-spacing: .12em; }

.dle-console { position: relative; min-width: 0; padding: 27px 40px 18px 0; }
.dle-ghost { position: absolute; top: 9px; right: 15px; color: rgba(20, 23, 28, .035); font-size: 64px; font-weight: 800; line-height: 1; pointer-events: none; transform: translateY(-8px); }
.dle-readout { position: relative; display: flex; justify-content: space-between; align-items: flex-start; gap: 14px; }
.dle-caption { color: var(--dle-muted); font: 650 9px/1 ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .15em; text-transform: uppercase; }
.dle-stage { margin: 8px 0 0; font-size: 28px; font-weight: 680; line-height: 1; letter-spacing: -.04em; transition: color 260ms ease, transform 260ms cubic-bezier(.2,.8,.2,1); }
.dle-stage.is-seeking { color: var(--dle-accent); animation: dle-stage-breathe 760ms cubic-bezier(.2,.8,.2,1) both; }
.dle-index { padding-top: 2px; color: var(--dle-muted); font: 650 10px/1 ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .08em; white-space: nowrap; }

.dle-rail { position: relative; margin-top: 28px; padding-top: 2px; }
.dle-track-fill { position: absolute; left: 0; top: 9px; height: 4px; border-radius: 999px; width: var(--dle-progress); background: var(--dle-accent); box-shadow: 0 0 14px rgba(59,156,255,.22); transition: width 260ms cubic-bezier(.2,.8,.2,1); pointer-events: none; }
.dle-range { position: relative; z-index: 2; width: 100%; height: 18px; margin: 0; appearance: none; -webkit-appearance: none; background: transparent; cursor: pointer; }
.dle-range:disabled { cursor: wait; opacity: .6; }
.dle-range::-webkit-slider-runnable-track { height: 4px; border-radius: 999px; background: rgba(22,24,27,.12); }
.dle-range::-webkit-slider-thumb { width: 20px; height: 20px; margin-top: -8px; border: 4px solid #fff; border-radius: 50%; appearance: none; -webkit-appearance: none; background: var(--dle-accent); box-shadow: 0 2px 8px rgba(0,0,0,.22), 0 0 0 1px rgba(28,31,36,.08); transition: transform 160ms ease; }
.dle-range:active::-webkit-slider-thumb { transform: scale(1.13); }
.dle-range::-moz-range-track { height: 4px; border-radius: 999px; background: rgba(22,24,27,.12); }
.dle-range::-moz-range-thumb { width: 12px; height: 12px; border: 4px solid #fff; border-radius: 50%; background: var(--dle-accent); box-shadow: 0 2px 8px rgba(0,0,0,.22); }
.dle-ticks { position: absolute; z-index: 3; top: 8px; left: 8px; right: 8px; display: flex; justify-content: space-between; pointer-events: none; }
.dle-tick { width: 6px; height: 6px; border: 1px solid rgba(255,255,255,.85); border-radius: 50%; background: #bac0c7; transition: background-color 180ms ease, transform 180ms ease; }
.dle-tick.is-active { background: var(--dle-accent); transform: scale(1.25); }
.dle-labels { display: grid; margin-top: 8px; color: var(--dle-muted); font-size: 9px; font-weight: 650; }
.dle-labels span { min-width: 0; overflow: hidden; text-align: center; text-overflow: ellipsis; white-space: nowrap; }
.dle-labels span:first-child { text-align: left; }
.dle-labels span:last-child { text-align: right; }
.dle-labels span.is-active { color: var(--dle-ink); }
.dle-protocol { margin-top: 12px; color: #a2a7ae; font: 500 8px/1.3 ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .07em; }

.dle-message { position: relative; padding: 12px 16px; border-top: 1px solid rgba(20,23,28,.08); color: #747a82; font-size: 11px; }
.dle-message.is-error { color: #b83d46; background: rgba(184,61,70,.05); }

@keyframes dle-panel-in { from { opacity: 0; transform: translateY(6px) scale(.985); } to { opacity: 1; transform: none; } }
@keyframes dle-scan { from { transform: translateX(-130%); } to { transform: translateX(130%); } }
@keyframes dle-stage-breathe { 0% { opacity: .55; transform: translateY(5px); } 45% { opacity: 1; transform: translateY(0); } 100% { opacity: 1; transform: translateY(0); } }

@media (max-width: 520px) {
  .dle-panel { position: fixed; right: 12px; bottom: 72px; }
  .dle-instrument { min-height: 172px; padding-left: 140px; }
  .dle-portrait-shell { left: 15px; top: -48px; width: 112px; height: 210px; }
  .dle-console { padding: 22px 38px 14px 0; }
  .dle-stage { font-size: 24px; }
  .dle-caption { font-size: 8px; letter-spacing: .09em; }
  .dle-rail { margin-top: 24px; }
  .dle-modelbar { gap: 9px; padding-inline: 13px; }
}

@media (prefers-color-scheme: dark) {
  .dle-panel { --dle-ink: #f1f3f5; --dle-muted: #9097a0; color: var(--dle-ink); background: rgba(27, 29, 32, .96); border-color: rgba(255,255,255,.13); box-shadow: 0 24px 80px rgba(0,0,0,.48); }
  .dle-modelbar { border-top-color: rgba(255,255,255,.08); background: rgba(255,255,255,.025); }
  .dle-model-select { color: #f1f3f5; background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.12); }
  .dle-close { color: #a4aab2; background: rgba(27,29,32,.68); }
  .dle-ghost { color: rgba(255,255,255,.035); }
  .dle-range::-webkit-slider-runnable-track, .dle-range::-moz-range-track { background: rgba(255,255,255,.14); }
  .dle-tick { border-color: #27292d; background: #626870; }
  .dle-message { border-top-color: rgba(255,255,255,.08); }
}

@media (prefers-reduced-motion: reduce) {
  .dle-panel, .dle-portrait-shell.is-seeking::after { animation: none; }
  .dle-root * { transition-duration: .01ms !important; }
}
`;

// src/client/index.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var VIDEO_URL = "/plugins/dsh-liang-effort/liang-evolution.mp4?v=4b40259a3ff4";
var STYLE_ID = "dsh-liang-effort-styles";
function EvolutionPortrait({ level, label, visualIndex }) {
  const videoRef = (0, import_react.useRef)(null);
  const animationRef = (0, import_react.useRef)(null);
  const initializedRef = (0, import_react.useRef)(false);
  const [ready, setReady] = (0, import_react.useState)(false);
  const [seeking, setSeeking] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
    const video = videoRef.current;
    if (video === null || !ready || !Number.isFinite(video.duration)) return;
    const target = Math.min(video.duration - 1 / 30, level / 30 * video.duration);
    if (!initializedRef.current) {
      initializedRef.current = true;
      video.currentTime = target;
      return;
    }
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    video.pause();
    const start = video.currentTime;
    const delta = target - start;
    if (Math.abs(delta) < 0.02) return;
    const motionDuration = Math.min(1050, Math.max(620, Math.abs(delta) * 470));
    setSeeking(true);
    if (delta > 0) {
      video.playbackRate = Math.min(4, Math.max(0.5, delta / (motionDuration / 1e3)));
      void video.play();
      const stopAtTarget = () => {
        if (video.currentTime + 1 / 60 < target) {
          animationRef.current = requestAnimationFrame(stopAtTarget);
          return;
        }
        video.pause();
        video.currentTime = target;
        animationRef.current = null;
        setSeeking(false);
      };
      animationRef.current = requestAnimationFrame(stopAtTarget);
    } else {
      const startedAt = performance.now();
      let lastSampleAt = 0;
      const reverseSample = (now) => {
        const progress = Math.min(1, (now - startedAt) / motionDuration);
        const eased = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        if (now - lastSampleAt >= 1e3 / 30 || progress === 1) {
          video.currentTime = start + delta * eased;
          lastSampleAt = now;
        }
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(reverseSample);
          return;
        }
        video.currentTime = target;
        animationRef.current = null;
        setSeeking(false);
      };
      animationRef.current = requestAnimationFrame(reverseSample);
    }
    return () => {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
      video.pause();
    };
  }, [level, ready]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: `dle-portrait-shell${seeking ? " is-seeking" : ""}`, "data-level": visualIndex, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "video",
      {
        ref: videoRef,
        className: "dle-video",
        src: VIDEO_URL,
        preload: "auto",
        muted: true,
        playsInline: true,
        "aria-label": `\u5F53\u524D\u5F62\u6001\uFF1A${label}`,
        onLoadedMetadata: () => setReady(true),
        onError: () => setReady(false)
      }
    ),
    !ready && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dle-video-loading", children: "LOADING" })
  ] });
}
function Chevron() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { className: "dle-chevron", viewBox: "0 0 12 12", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m3.2 4.4 2.8 2.8 2.8-2.8", fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.4" }) });
}
function LiangSelect({ available, directory, load, locked, select }) {
  const state = (0, import_react.useSyncExternalStore)(directory.subscribe.bind(directory), directory.getSnapshot.bind(directory));
  const [open, setOpen] = (0, import_react.useState)(false);
  const [preview, setPreview] = (0, import_react.useState)(0);
  const [selectionError, setSelectionError] = (0, import_react.useState)(null);
  const rootRef = (0, import_react.useRef)(null);
  const panelId = (0, import_react.useId)();
  const choices = (0, import_react.useMemo)(() => state.groups.flatMap((group) => group.models.map((model) => ({ group, model }))), [state.groups]);
  const currentChoice = choices.find((choice) => choice.group.id === state.current?.provider && choice.model.id === state.current.model);
  const reasoning = currentChoice?.model.reasoning;
  const effectiveEffort = state.current?.reasoningEffort ?? reasoning?.defaultEffort ?? reasoning?.efforts[0]?.id;
  const effortChoices = (0, import_react.useMemo)(() => sliderEfforts(reasoning?.efforts ?? []), [reasoning]);
  const committedIndex = effortIndexOf(effortChoices, effectiveEffort);
  const activeEffort = effortChoices[preview] ?? effortChoices[0];
  const busy = state.status === "selecting";
  const modelLabel = currentChoice?.model.name ?? "\u9009\u62E9\u6A21\u578B";
  const effortLabel = effortChoices[committedIndex]?.label;
  (0, import_react.useEffect)(() => setPreview(committedIndex), [committedIndex]);
  (0, import_react.useEffect)(() => {
    if (!available) return;
    load();
  }, [available, load]);
  (0, import_react.useEffect)(() => {
    if (!open) return;
    const closeOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOutside);
    return () => document.removeEventListener("mousedown", closeOutside);
  }, [open]);
  if (!available) return null;
  const chooseEffort = async (effort, nextPreview) => {
    if (state.current === null) return;
    if (nextPreview !== void 0) setPreview(nextPreview);
    setSelectionError(null);
    const accepted = await select({ provider: state.current.provider, model: state.current.model, reasoningEffort: effort });
    if (!accepted) {
      setPreview(committedIndex);
      setSelectionError(directory.getSnapshot().error ?? "DSH \u672A\u63A5\u53D7\u8FD9\u6B21\u63A8\u7406\u5F3A\u5EA6\u5207\u6362");
    }
  };
  const chooseModel = async (event) => {
    const [provider = "", modelId = ""] = event.target.value.split("\0");
    const choice = choices.find((item) => item.group.id === provider && item.model.id === modelId);
    if (choice === void 0) return;
    const selection = { provider, model: modelId };
    const initialEffort = choice.model.reasoning?.defaultEffort ?? choice.model.reasoning?.efforts[0]?.id;
    if (initialEffort !== void 0) selection.reasoningEffort = initialEffort;
    const accepted = await select(selection);
    if (!accepted) setSelectionError(directory.getSnapshot().error ?? "DSH \u672A\u63A5\u53D7\u8FD9\u6B21\u6A21\u578B\u5207\u6362");
  };
  const onKeyDown = (event) => {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { ref: rootRef, className: "dle-root", onKeyDown, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "button",
      {
        type: "button",
        className: "dle-trigger",
        "aria-expanded": open,
        "aria-controls": open ? panelId : void 0,
        "aria-haspopup": "dialog",
        disabled: locked,
        title: `${modelLabel}${effortLabel === void 0 ? "" : ` \xB7 ${effortLabel}`}`,
        onClick: () => {
          setOpen((value) => !value);
          if (!open) load();
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dle-trigger-model", children: modelLabel }),
          effortLabel !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dle-trigger-effort", children: effortLabel }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chevron, {})
        ]
      }
    ),
    open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { id: panelId, className: "dle-panel", role: "dialog", "aria-label": "\u6A21\u578B\u4E0E\u6881\u6C0F\u63A8\u7406\u5F3A\u5EA6", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dle-close", "aria-label": "\u5173\u95ED", onClick: () => setOpen(false), children: "\xD7" }),
      activeEffort !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dle-instrument", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvolutionPortrait, { level: activeEffort.level, label: activeEffort.label, visualIndex: preview }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dle-console", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dle-ghost", "aria-hidden": "true", children: activeEffort.label }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dle-readout", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dle-caption", children: "Liang evolution \xB7 \u6881\u9636\u72B6\u6001" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: `dle-stage${busy ? " is-seeking" : ""}`, "aria-live": "polite", children: activeEffort.label })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dle-index", children: [
              String(preview + 1).padStart(2, "0"),
              " / ",
              String(effortChoices.length).padStart(2, "0")
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dle-rail", style: { "--dle-progress": `${effortChoices.length <= 1 ? 100 : preview / (effortChoices.length - 1) * 100}%` }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dle-track-fill", "aria-hidden": "true" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "input",
              {
                className: "dle-range",
                type: "range",
                min: "0",
                max: Math.max(0, effortChoices.length - 1),
                step: "1",
                value: preview,
                disabled: busy,
                "aria-label": "DeepSeek \u63A8\u7406\u5F3A\u5EA6",
                "aria-valuetext": `${activeEffort.label}\uFF0C\u7B2C ${preview + 1} \u6863\uFF0C\u5171 ${effortChoices.length} \u6863`,
                onChange: (event) => {
                  const next = Number(event.target.value);
                  const choice = effortChoices[next];
                  if (choice !== void 0) void chooseEffort(choice.id, next);
                }
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dle-ticks", "aria-hidden": "true", children: effortChoices.map((choice, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `dle-tick${index <= preview ? " is-active" : ""}` }, choice.id)) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dle-labels", style: { gridTemplateColumns: `repeat(${effortChoices.length}, minmax(0, 1fr))` }, "aria-hidden": "true", children: effortChoices.map((choice, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: index === preview ? "is-active" : "", title: choice.label, children: choice.label }, choice.id)) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dle-protocol", children: [
            "PROTOCOL VALUE \xB7 ",
            activeEffort.id.toUpperCase()
          ] })
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dle-message", children: "\u5F53\u524D\u6A21\u578B\u6CA1\u6709\u53EF\u8C03\u63A8\u7406\u5F3A\u5EA6\uFF1B\u4E0A\u65B9\u6A21\u578B\u9009\u62E9\u4ECD\u7136\u53EF\u7528\u3002" }),
      (selectionError ?? (state.status === "error" ? state.error : null)) !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dle-message is-error", role: "alert", children: selectionError ?? state.error }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", { className: "dle-modelbar", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dle-kicker", children: "MODEL" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "select",
          {
            className: "dle-model-select",
            "aria-label": "\u9009\u62E9\u6A21\u578B",
            value: state.current === null ? "" : `${state.current.provider}\0${state.current.model}`,
            disabled: busy || choices.length === 0,
            onChange: chooseModel,
            children: [
              state.current === null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "\u6B63\u5728\u8BFB\u53D6\u6A21\u578B\u2026" }),
              state.groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", { label: group.name, children: group.models.map((model) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: `${group.id}\0${model.id}`, children: model.name }, model.id)) }, group.id))
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chevron, {})
      ] })
    ] })
  ] });
}
var inject = ["slots", "modelDirectories", "sessions"];
function apply(ctx) {
  ctx.effect(() => {
    const existing = document.getElementById(STYLE_ID);
    if (existing !== null) return;
    const element = document.createElement("style");
    element.id = STYLE_ID;
    element.textContent = styles;
    document.head.append(element);
    return () => element.remove();
  }, "dsh-liang-effort: styles");
  ctx.inject(["slots", "modelDirectories", "sessions"], (scope) => {
    scope.slots.inject("conversation.input.model", () => scope.slots.register({
      name: "conversation.input.model",
      priority: -100,
      registrant: "dsh-liang-effort",
      inject: (sessionId) => {
        const directory = scope.modelDirectories.directoryFor(sessionId);
        const available = scope.sessions.subagentAddress(sessionId) === void 0;
        return {
          available,
          directory: directory.store,
          load: () => {
            if (available) void directory.load().catch(() => void 0);
          },
          select: (selection) => available ? directory.select(selection).then(() => true, () => false) : Promise.resolve(false)
        };
      }
    }, LiangSelect));
  });
}
    return module.exports;
  },
});
//# sourceMappingURL=client.js.map
