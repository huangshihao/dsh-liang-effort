export const styles = String.raw`
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
.dle-trigger-effort small { margin-left: 2px; font: 600 9px/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; opacity: .72; }
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
  min-height: 132px;
  padding-left: 184px;
}

.dle-portrait-shell {
  position: absolute;
  z-index: 4;
  left: 30px;
  top: -94px;
  width: 138px;
  height: 220px;
  overflow: visible;
  background: transparent;
  filter: drop-shadow(0 16px 18px rgba(14,18,24,.18));
  transition: filter 360ms ease;
}
.dle-video { display: block; width: 100%; height: 100%; object-fit: cover; filter: saturate(.82) contrast(1.04); transform: scale(1); transition: filter 320ms ease, transform 420ms cubic-bezier(.2,.8,.2,1), opacity 160ms ease; }
.dle-portrait-shell.is-seeking .dle-video { filter: saturate(.96) contrast(1.08) brightness(1.04); transform: scale(1.045); }
.dle-portrait-shell[data-level="2"], .dle-portrait-shell[data-level="3"], .dle-portrait-shell[data-level="4"], .dle-portrait-shell[data-level="5"] { filter: drop-shadow(0 16px 18px rgba(14,18,24,.18)) drop-shadow(0 0 16px rgba(59,156,255,.16)); }
.dle-video-loading { position: absolute; inset: 0; display: grid; place-items: center; color: rgba(255,255,255,.54); font: 600 9px/1 ui-monospace, monospace; letter-spacing: .12em; }

.dle-console { position: relative; min-width: 0; padding: 49px 38px 12px 0; }
.dle-ghost { position: absolute; top: 10px; right: 38px; color: rgba(20, 23, 28, .055); font-size: 42px; font-weight: 800; line-height: 1; pointer-events: none; }
.dle-visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }

.dle-rail { position: relative; padding-top: 2px; }
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
.dle-tick.is-current { opacity: 0; }
.dle-labels { display: grid; margin-top: 8px; color: var(--dle-muted); font-size: 9px; font-weight: 650; }
.dle-labels span { display: flex; min-width: 0; flex-direction: column; align-items: center; gap: 2px; text-align: center; white-space: nowrap; }
.dle-labels span:first-child { justify-self: start; transform: translateX(calc(-50% + 8px)); }
.dle-labels span:last-child { justify-self: end; transform: translateX(calc(50% - 8px)); }
.dle-labels b { font: inherit; }
.dle-labels small { max-width: 100%; overflow: hidden; color: color-mix(in srgb, var(--dle-muted) 86%, transparent); font: 600 8px/1.05 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; letter-spacing: -.035em; text-overflow: ellipsis; }
.dle-labels span.is-active { color: var(--dle-ink); }
.dle-labels span.is-active small { color: color-mix(in srgb, var(--dle-ink) 82%, transparent); }
.dle-message { position: relative; padding: 12px 16px; border-top: 1px solid rgba(20,23,28,.08); color: #747a82; font-size: 11px; }
.dle-message.is-error { color: #b83d46; background: rgba(184,61,70,.05); }

@keyframes dle-panel-in { from { opacity: 0; transform: translateY(6px) scale(.985); } to { opacity: 1; transform: none; } }

@media (max-width: 520px) {
  .dle-panel { position: fixed; right: 12px; bottom: 72px; }
  .dle-instrument { min-height: 118px; padding-left: 126px; }
  .dle-portrait-shell { left: 19px; top: -68px; width: 96px; height: 170px; }
  .dle-console { padding: 45px 38px 10px 0; }
  .dle-ghost { top: 9px; right: 38px; font-size: 36px; }
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
  .dle-panel { animation: none; }
  .dle-root * { transition-duration: .01ms !important; }
}
`
