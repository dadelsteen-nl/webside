/** Keyframes and range-input styling used only by the home sections. */
const css = `
@keyframes home-scroll-cue {
  0% { transform: translateY(-100%); }
  60%, 100% { transform: translateY(200%); }
}
@keyframes home-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes home-pulse {
  0% { transform: scale(0.6); opacity: 0.9; }
  70%, 100% { transform: scale(1.9); opacity: 0; }
}
.home-range {
  -webkit-appearance: none;
  appearance: none;
  height: 1.5rem;
  background: transparent;
  cursor: pointer;
}
.home-range::-webkit-slider-runnable-track {
  height: 2px;
  background: linear-gradient(to right, var(--bronze) var(--pct, 50%), rgba(26,26,26,0.15) var(--pct, 50%));
}
.home-range::-moz-range-track {
  height: 2px;
  background: rgba(26,26,26,0.15);
}
.home-range::-moz-range-progress {
  height: 2px;
  background: var(--bronze);
}
.home-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  margin-top: -9px;
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  background: var(--cream);
  border: 1px solid var(--bronze);
  box-shadow: 0 4px 14px -4px rgba(26,26,26,0.35);
  transition: transform 0.4s var(--ease-luxe);
}
.home-range::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  background: var(--cream);
  border: 1px solid var(--bronze);
  box-shadow: 0 4px 14px -4px rgba(26,26,26,0.35);
}
.home-range:hover::-webkit-slider-thumb,
.home-range:focus-visible::-webkit-slider-thumb { transform: scale(1.15); }
.home-range:focus-visible { outline: none; }
.home-range:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 4px rgba(176,141,87,0.35); }
.home-range:focus-visible::-moz-range-thumb { box-shadow: 0 0 0 4px rgba(176,141,87,0.35); }
`

export function HomeStyles() {
  return (
    <style href="dadelsteen-home" precedence="default">
      {css}
    </style>
  )
}
