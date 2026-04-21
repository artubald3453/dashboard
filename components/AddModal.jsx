// Add Segment modal — pick a type, fill a form, create.
const { useState: useStateAM, useEffect: useEffectAM } = React;

const SEGMENT_TYPES = [
  { type: 'linkgroup', name: 'Link group', desc: 'A titled list of links', icon: 'link', size: { w: 1, h: 2 } },
  { type: 'biglink',   name: 'Big link',   desc: 'One prominent shortcut',  icon: 'star', size: { w: 1, h: 1 } },
  { type: 'note',      name: 'Note',       desc: 'Freeform scratchpad',     icon: 'note', size: { w: 2, h: 2 } },
  { type: 'todo',      name: 'To-do list', desc: 'Tasks with checkboxes',   icon: 'todo', size: { w: 1, h: 2 } },
  { type: 'counter',   name: 'Counter',    desc: 'Tally or goal tracker',   icon: 'counter', size: { w: 1, h: 1 } },
  { type: 'embed',     name: 'Embed',      desc: 'iframe a page inline',    icon: 'embed', size: { w: 2, h: 2 } },
  { type: 'clock',     name: 'Clock',      desc: 'Time for any timezone',   icon: 'clock', size: { w: 1, h: 1 } },
  { type: 'weather',   name: 'Weather',    desc: 'Weather glance (manual)', icon: 'weather', size: { w: 1, h: 2 } },
  { type: 'habit',     name: 'Habit',      desc: '28-day tracker grid',     icon: 'habit', size: { w: 2, h: 1 } },
  { type: 'feed',      name: 'Feed',       desc: 'Log of items with time',  icon: 'feed', size: { w: 1, h: 2 } },
  { type: 'pinned',    name: 'Pinned',     desc: 'Pinned files or projects',icon: 'pinned', size: { w: 1, h: 2 } },
  { type: 'agenda',    name: 'Agenda',     desc: 'Upcoming events',         icon: 'calendar', size: { w: 1, h: 2 } },
];

function AddModal({ open, onClose, onCreate }) {
  const [step, setStep] = useStateAM(1);
  const [picked, setPicked] = useStateAM(null);
  const [form, setForm] = useStateAM({});

  useEffectAM(() => {
    if (open) { setStep(1); setPicked(null); setForm({ title: '' }); }
  }, [open]);

  useEffectAM(() => {
    if (!open) return;
    const h = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open) return null;

  const pick = (t) => {
    setPicked(t);
    setForm({ title: t.name, size: t.size });
    setStep(2);
  };

  const create = () => {
    const base = {
      id: crypto.randomUUID(),
      type: picked.type,
      title: form.title?.trim() || picked.name,
      size: form.size || picked.size,
    };
    // type-specific defaults + extras
    const seg = { ...base, ...typeExtras(picked.type, form) };
    onCreate(seg);
    onClose();
  };

  return (
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card" role="dialog" aria-label="Add segment">
        <div className="modal-head">
          <div>
            <div className="modal-eyebrow">{step === 1 ? 'Step 1 of 2' : 'Step 2 of 2'}</div>
            <h2 className="modal-title">{step === 1 ? 'Add a segment' : `New ${picked.name}`}</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><Ico.x width="16" height="16"/></button>
        </div>

        {step === 1 && (
          <div className="type-grid">
            {SEGMENT_TYPES.map(t => {
              const Icon = Ico[t.icon];
              return (
                <button key={t.type} className="type-card" onClick={() => pick(t)}>
                  <div className="type-ico"><Icon width="20" height="20"/></div>
                  <div className="type-name">{t.name}</div>
                  <div className="type-desc">{t.desc}</div>
                </button>
              );
            })}
          </div>
        )}

        {step === 2 && picked && (
          <div className="form-body">
            <div className="form-row">
              <label>Title</label>
              <input autoFocus value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} placeholder={picked.name}/>
            </div>

            <TypeSpecificForm type={picked.type} form={form} setForm={setForm}/>

            <div className="form-row">
              <label>Tile size</label>
              <div className="size-picker">
                {[{w:1,h:1},{w:2,h:1},{w:1,h:2},{w:2,h:2},{w:3,h:2}].map(s => (
                  <button key={`${s.w}x${s.h}`}
                    className={`size-opt ${form.size?.w===s.w && form.size?.h===s.h ? 'on':''}`}
                    onClick={() => setForm({...form, size: s})}
                    style={{'--sw': s.w, '--sh': s.h}}>
                    <span className="size-shape"/>
                    <span className="size-label">{s.w}×{s.h}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-foot">
              <button className="btn-ghost" onClick={() => setStep(1)}>← Back</button>
              <button className="btn-primary" onClick={create}>Add to dashboard</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TypeSpecificForm({ type, form, setForm }) {
  const set = (patch) => setForm({ ...form, ...patch });
  switch (type) {
    case 'linkgroup':
      return (
        <div className="form-hint">You'll add links after creating — or paste a starter here:
          <textarea className="bulk-input" placeholder={'Label | https://url.com\nLabel | https://url.com'}
            value={form.bulkLinks || ''} onChange={e => set({ bulkLinks: e.target.value })}/>
        </div>
      );
    case 'biglink':
      return (
        <>
          <div className="form-row"><label>URL</label>
            <input placeholder="https://..." value={form.url || ''} onChange={e => set({ url: e.target.value })}/></div>
          <div className="form-row"><label>Subtitle <span className="opt">optional</span></label>
            <input placeholder="Shown under the title" value={form.subtitle || ''} onChange={e => set({ subtitle: e.target.value })}/></div>
        </>
      );
    case 'note':
      return (
        <div className="form-row"><label>Starting text <span className="opt">optional</span></label>
          <textarea value={form.text || ''} onChange={e => set({ text: e.target.value })} placeholder="What's on your mind?"/></div>
      );
    case 'counter':
      return (
        <>
          <div className="form-row two"><div>
            <label>Start value</label>
            <input type="number" value={form.value ?? 0} onChange={e => set({ value: Number(e.target.value) })}/>
          </div><div>
            <label>Step</label>
            <input type="number" value={form.step ?? 1} onChange={e => set({ step: Number(e.target.value) })}/>
          </div></div>
          <div className="form-row two"><div>
            <label>Unit <span className="opt">optional</span></label>
            <input placeholder="cups, reps, $" value={form.unit || ''} onChange={e => set({ unit: e.target.value })}/>
          </div><div>
            <label>Goal <span className="opt">optional</span></label>
            <input type="number" value={form.goal ?? ''} onChange={e => set({ goal: e.target.value ? Number(e.target.value) : null })}/>
          </div></div>
        </>
      );
    case 'embed':
      return (
        <div className="form-row"><label>Embed URL</label>
          <input placeholder="https://..." value={form.url || ''} onChange={e => set({ url: e.target.value })}/>
          <div className="form-hint small">Note: many sites block embedding.</div>
        </div>
      );
    case 'clock':
      return (
        <div className="form-row"><label>Timezone <span className="opt">optional</span></label>
          <input placeholder="America/New_York" value={form.timezone || ''} onChange={e => set({ timezone: e.target.value })}/>
        </div>
      );
    case 'weather':
      return (
        <>
          <div className="form-row"><label>City</label>
            <input placeholder="Brooklyn" value={form.city || ''} onChange={e => set({ city: e.target.value })}/></div>
          <div className="form-row two"><div>
            <label>Temp (°)</label>
            <input type="number" value={form.temp ?? 68} onChange={e => set({ temp: Number(e.target.value) })}/>
          </div><div>
            <label>Condition</label>
            <input placeholder="Partly cloudy" value={form.cond || ''} onChange={e => set({ cond: e.target.value })}/>
          </div></div>
        </>
      );
    case 'habit':
      return (
        <div className="form-row"><label>What are you tracking?</label>
          <input placeholder="Morning walk" value={form.description || ''} onChange={e => set({ description: e.target.value })}/>
        </div>
      );
    case 'agenda':
    case 'feed':
    case 'pinned':
    case 'todo':
      return <div className="form-hint">Add items after creating — it's faster.</div>;
    default:
      return null;
  }
}

function typeExtras(type, form) {
  switch (type) {
    case 'linkgroup': {
      const bulk = (form.bulkLinks || '').split('\n').map(l => l.trim()).filter(Boolean);
      const links = bulk.map(line => {
        const [label, url] = line.split('|').map(s => s.trim());
        if (!url) return null;
        return { id: crypto.randomUUID(), label, url: normalizeUrl(url) };
      }).filter(Boolean);
      return { links };
    }
    case 'biglink': return { url: form.url ? normalizeUrl(form.url) : '', subtitle: form.subtitle || '' };
    case 'note': return { text: form.text || '' };
    case 'todo': return { items: [] };
    case 'counter': return { value: form.value ?? 0, step: form.step ?? 1, unit: form.unit || '', goal: form.goal || null };
    case 'embed': return { url: form.url ? normalizeUrl(form.url) : '' };
    case 'clock': return { timezone: form.timezone || '' };
    case 'weather': return { city: form.city || 'Here', temp: form.temp ?? 68, cond: form.cond || 'Partly cloudy' };
    case 'habit': return { days: Array(28).fill(0), description: form.description || '' };
    case 'feed': return { items: [] };
    case 'pinned': return { items: [] };
    case 'agenda': return { items: [] };
    default: return {};
  }
}

Object.assign(window, { AddModal, SEGMENT_TYPES });
