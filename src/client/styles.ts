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
  width: min(448px, calc(100vw - 24px));
  overflow: hidden;
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
  background-image: linear-gradient(rgba(20, 20, 20, .018) 1px, transparent 1px);
  background-size: 100% 4px;
}

.dle-toolbar {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 13px 16px 11px;
  border-bottom: 1px solid rgba(20, 23, 28, .09);
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
.dle-close { display: grid; place-items: center; width: 26px; height: 26px; padding: 0; border: 0; border-radius: 50%; color: #777d85; background: transparent; cursor: pointer; }
.dle-close:hover { color: #171717; background: rgba(17, 17, 17, .06); }

.dle-instrument {
  position: relative;
  display: grid;
  grid-template-columns: 136px 1fr;
  min-height: 184px;
}

.dle-portrait-shell {
  position: relative;
  margin: 17px 0 17px 17px;
  overflow: hidden;
  border-radius: 14px;
  background: #101316;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .12);
}
.dle-portrait-shell::before, .dle-portrait-shell::after { content: ""; position: absolute; z-index: 2; pointer-events: none; }
.dle-portrait-shell::before { inset: 7px; border: 1px solid rgba(255,255,255,.18); border-left-color: transparent; border-bottom-color: transparent; }
.dle-portrait-shell::after { inset: 0; opacity: .42; background: linear-gradient(110deg, transparent 28%, rgba(255,255,255,.12) 45%, transparent 58%); transform: translateX(-130%); }
.dle-portrait-shell.is-seeking::after { animation: dle-scan 400ms ease-out; }
.dle-video { display: block; width: 100%; height: 100%; object-fit: cover; filter: saturate(.76) contrast(1.06); transform: scale(1.025); transition: filter 320ms ease, transform 420ms cubic-bezier(.2,.8,.2,1), opacity 160ms ease; }
.dle-portrait-shell.is-seeking .dle-video { filter: saturate(.92) contrast(1.1) brightness(1.05); transform: scale(1.065); }
.dle-portrait-shell[data-level="2"] { box-shadow: inset 0 0 0 1px rgba(255,255,255,.16), 0 0 28px rgba(59,156,255,.18); }
.dle-video-loading { position: absolute; inset: 0; display: grid; place-items: center; color: rgba(255,255,255,.54); font: 600 9px/1 ui-monospace, monospace; letter-spacing: .12em; }

.dle-console { position: relative; min-width: 0; padding: 22px 22px 17px 21px; }
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

.dle-message { padding: 12px 16px; border-top: 1px solid rgba(20,23,28,.08); color: #747a82; font-size: 11px; }
.dle-message.is-error { color: #b83d46; background: rgba(184,61,70,.05); }

@keyframes dle-panel-in { from { opacity: 0; transform: translateY(6px) scale(.985); } to { opacity: 1; transform: none; } }
@keyframes dle-scan { from { transform: translateX(-130%); } to { transform: translateX(130%); } }
@keyframes dle-stage-breathe { 0% { opacity: .55; transform: translateY(5px); } 45% { opacity: 1; transform: translateY(0); } 100% { opacity: 1; transform: translateY(0); } }

@media (max-width: 520px) {
  .dle-panel { position: fixed; right: 12px; bottom: 72px; }
  .dle-instrument { grid-template-columns: 108px 1fr; min-height: 166px; }
  .dle-portrait-shell { margin: 14px 0 14px 14px; }
  .dle-console { padding: 20px 16px 14px; }
  .dle-stage { font-size: 24px; }
}

@media (prefers-color-scheme: dark) {
  .dle-panel { --dle-ink: #f1f3f5; --dle-muted: #9097a0; color: var(--dle-ink); background: rgba(27, 29, 32, .96); border-color: rgba(255,255,255,.13); box-shadow: 0 24px 80px rgba(0,0,0,.48); }
  .dle-toolbar { border-bottom-color: rgba(255,255,255,.08); }
  .dle-model-select { color: #f1f3f5; background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.12); }
  .dle-ghost { color: rgba(255,255,255,.035); }
  .dle-range::-webkit-slider-runnable-track, .dle-range::-moz-range-track { background: rgba(255,255,255,.14); }
  .dle-tick { border-color: #27292d; background: #626870; }
  .dle-message { border-top-color: rgba(255,255,255,.08); }
}

@media (prefers-reduced-motion: reduce) {
  .dle-panel, .dle-portrait-shell.is-seeking::after { animation: none; }
  .dle-root * { transition-duration: .01ms !important; }
}
`
