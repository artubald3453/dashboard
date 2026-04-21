// In-design Tweaks panel
const { useState: useStateTP, useEffect: useEffectTP } = React;

const ACCENT_PRESETS = [
  { name: 'Terracotta', value: 'oklch(62% 0.14 38)' },
  { name: 'Clay',       value: 'oklch(58% 0.11 55)' },
  { name: 'Olive',      value: 'oklch(58% 0.10 120)' },
  { name: 'Sage',       value: 'oklch(62% 0.08 155)' },
  { name: 'Denim',      value: 'oklch(55% 0.11 240)' },
  { name: 'Plum',       value: 'oklch(52% 0.12 330)' },
  { name: 'Ink',        value: 'oklch(32% 0.02 60)' },
];

const FONT_PAIRS = [
  { name: 'Fraunces + Inter',          heading: 'Fraunces',       body: 'Inter' },
  { name: 'Instrument Serif + Inter',  heading: 'Instrument Serif', body: 'Inter' },
  { name: 'DM Serif + DM Sans',        heading: 'DM Serif Display', body: 'DM Sans' },
  { name: 'Newsreader + IBM Plex',     heading: 'Newsreader',     body: 'IBM Plex Sans' },
  { name: 'All Inter',                  heading: 'Inter',          body: 'Inter' },
];

const BG_STYLES = [
  { name: 'Paper', value: 'paper' },
  { name: 'Linen', value: 'linen' },
  { name: 'Plain', value: 'plain' },
  { name: 'Grid',  value: 'grid'  },
];

const DENSITIES = [
  { name: 'Airy',    value: 'airy'    },
  { name: 'Regular', value: 'regular' },
  { name: 'Dense',   value: 'dense'   },
];

function TweaksPanel({ active, settings, setSettings }) {
  const [open, setOpen] = useStateTP(true);
  if (!active) return null;

  const upd = (patch) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    // Also persist through the host if present
    try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*'); } catch {}
  };

  return (
    <div className={`tweaks-panel ${open ? 'open' : 'closed'}`}>
      <div className="tweaks-head">
        <div className="tweaks-title">Tweaks</div>
        <button className="icon-btn" onClick={() => setOpen(!open)}>
          {open ? <Ico.x width="14" height="14"/> : <Ico.gear width="14" height="14"/>}
        </button>
      </div>

      {open && (
        <div className="tweaks-body">
          <div className="tweak-sec">
            <div className="tweak-label">Accent</div>
            <div className="swatch-row">
              {ACCENT_PRESETS.map(a => (
                <button key={a.name} className={`swatch ${settings.accent === a.value ? 'on' : ''}`}
                  style={{background: a.value}} onClick={() => upd({ accent: a.value })} title={a.name}/>
              ))}
            </div>
          </div>

          <div className="tweak-sec">
            <div className="tweak-label">Font pairing</div>
            <div className="stack">
              {FONT_PAIRS.map(f => (
                <button key={f.name} className={`tweak-option ${settings.fontPair === f.name ? 'on' : ''}`}
                  onClick={() => upd({ fontPair: f.name })}>
                  <span className="fp-name" style={{fontFamily: `"${f.heading}", serif`}}>{f.heading}</span>
                  <span className="fp-sep">+</span>
                  <span className="fp-body" style={{fontFamily: `"${f.body}", sans-serif`}}>{f.body}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="tweak-sec">
            <div className="tweak-label">Density</div>
            <div className="seg-row">
              {DENSITIES.map(d => (
                <button key={d.value} className={`seg-btn ${settings.density === d.value ? 'on' : ''}`}
                  onClick={() => upd({ density: d.value })}>{d.name}</button>
              ))}
            </div>
          </div>

          <div className="tweak-sec">
            <div className="tweak-label">Background</div>
            <div className="seg-row">
              {BG_STYLES.map(b => (
                <button key={b.value} className={`seg-btn ${settings.bg === b.value ? 'on' : ''}`}
                  onClick={() => upd({ bg: b.value })}>{b.name}</button>
              ))}
            </div>
          </div>

          <div className="tweak-sec">
            <div className="tweak-label">Greeting</div>
            <div className="seg-row">
              <button className={`seg-btn ${settings.greeting ? 'on':''}`} onClick={() => upd({ greeting: true })}>On</button>
              <button className={`seg-btn ${!settings.greeting ? 'on':''}`} onClick={() => upd({ greeting: false })}>Off</button>
            </div>
          </div>

          <div className="tweak-sec">
            <div className="tweak-label">Your name</div>
            <input className="tweak-input" value={settings.name || ''}
              onChange={e => upd({ name: e.target.value })} placeholder="What should we call you?"/>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { TweaksPanel, ACCENT_PRESETS, FONT_PAIRS, BG_STYLES, DENSITIES });
