// Segment renderers — each segment type is a component that takes (segment, api)
// where api = { update, remove, accent }

const { useState, useEffect, useRef } = React;

// ─── Icons ────────────────────────────────────────────────────────────────
const Ico = {
  plus: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  x: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><path d="M6 6l12 12M6 18L18 6"/></svg>,
  drag: (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><circle cx="9" cy="6" r="1.3"/><circle cx="15" cy="6" r="1.3"/><circle cx="9" cy="12" r="1.3"/><circle cx="15" cy="12" r="1.3"/><circle cx="9" cy="18" r="1.3"/><circle cx="15" cy="18" r="1.3"/></svg>,
  ext: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M7 17L17 7M9 7h8v8"/></svg>,
  check: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12l4 4L19 6"/></svg>,
  trash: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}><path d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12"/></svg>,
  gear: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M1 12h4M19 12h4M4.2 19.8L7 17M17 7l2.8-2.8"/></svg>,
  sun: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>,
  moon: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg>,
  link: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><path d="M10 14a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 10a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/></svg>,
  note: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 4h11l4 4v12H5z"/><path d="M16 4v4h4M8 12h8M8 16h5"/></svg>,
  todo: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="4" y="5" width="6" height="6" rx="1"/><path d="M5.5 8l1.3 1.3 2.4-2.4"/><path d="M14 7h6M14 12h6M14 17h6M4 15h6"/></svg>,
  counter: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 7h16M4 12h16M4 17h10"/><circle cx="18" cy="17" r="2"/></svg>,
  embed: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M9 11l-2 2 2 2M15 11l2 2-2 2"/></svg>,
  star: (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2l2.9 6.5 7.1.8-5.3 4.8 1.5 7-6.2-3.6L5.8 21l1.5-7L2 9.3l7.1-.8z"/></svg>,
  clock: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  calendar: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><rect x="3" y="5" width="18" height="16" rx="1.5"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>,
  weather: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="7" cy="10" r="3"/><path d="M12 17a4 4 0 000-8 5 5 0 00-9.8 1.5A3.5 3.5 0 003 17h9z"/></svg>,
  pinned: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 17v5M8 3h8l-1 5 3 3-10 0 3-3z"/></svg>,
  feed: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><path d="M4 11a9 9 0 019 9M4 4a16 16 0 0116 16"/><circle cx="5" cy="19" r="1.5" fill="currentColor" stroke="none"/></svg>,
  habit: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 20l4-4 4 4 4-8 4 4"/><circle cx="8" cy="16" r="1" fill="currentColor"/><circle cx="12" cy="20" r="1" fill="currentColor"/><circle cx="16" cy="12" r="1" fill="currentColor"/></svg>,
};

// ─── Shared tile chrome ───────────────────────────────────────────────────
function TileChrome({ segment, api, children, noPadding, icon, toolbar }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(segment.title);
  useEffect(() => setTitle(segment.title), [segment.title]);

  const commit = () => {
    setEditing(false);
    if (title.trim() && title !== segment.title) api.update({ title: title.trim() });
    else setTitle(segment.title);
  };

  return (
    <div className="tile" data-type={segment.type}>
      <div className="tile-head">
        <div className="tile-head-l">
          <span className="drag-handle" title="Drag to reorder" data-drag><Ico.drag width="14" height="14"/></span>
          {icon && <span className="tile-icon">{icon}</span>}
          {editing ? (
            <input
              className="tile-title-edit"
              value={title}
              autoFocus
              onChange={e => setTitle(e.target.value)}
              onBlur={commit}
              onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setTitle(segment.title); setEditing(false); } }}
            />
          ) : (
            <h3 className="tile-title" onDoubleClick={() => setEditing(true)} title="Double-click to rename">{segment.title}</h3>
          )}
        </div>
        <div className="tile-tools">
          {toolbar}
          <button className="icon-btn" title="Delete" onClick={() => { if (confirm(`Delete "${segment.title}"?`)) api.remove(); }}>
            <Ico.trash width="14" height="14"/>
          </button>
        </div>
      </div>
      <div className={`tile-body ${noPadding ? 'no-pad' : ''}`}>{children}</div>
    </div>
  );
}

// ─── LINK GROUP ──────────────────────────────────────────────────────────
function LinkGroupSeg({ segment, api }) {
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');

  const add = () => {
    if (!label.trim() || !url.trim()) return;
    api.update({ links: [...(segment.links || []), { id: crypto.randomUUID(), label: label.trim(), url: normalizeUrl(url.trim()) }] });
    setLabel(''); setUrl(''); setAdding(false);
  };
  const remove = (id) => api.update({ links: segment.links.filter(l => l.id !== id) });

  return (
    <TileChrome segment={segment} api={api} icon={<Ico.link width="16" height="16"/>}>
      <ul className="link-list">
        {(segment.links || []).map(l => (
          <li key={l.id} className="link-item">
            <a href={l.url} target="_blank" rel="noreferrer">
              <span className="favicon" style={{background: hashColor(l.url)}}>{initial(l.label)}</span>
              <span className="link-label">{l.label}</span>
              <Ico.ext width="12" height="12" className="ext-ico"/>
            </a>
            <button className="link-x" onClick={() => remove(l.id)} title="Remove"><Ico.x width="11" height="11"/></button>
          </li>
        ))}
        {(segment.links || []).length === 0 && !adding && (
          <li className="empty-hint">No links yet</li>
        )}
      </ul>
      {adding ? (
        <div className="inline-form">
          <input placeholder="Label" value={label} autoFocus onChange={e => setLabel(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()}/>
          <input placeholder="https://..." value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()}/>
          <div className="inline-form-row">
            <button className="btn-ghost" onClick={() => { setAdding(false); setLabel(''); setUrl(''); }}>Cancel</button>
            <button className="btn-primary" onClick={add}>Add link</button>
          </div>
        </div>
      ) : (
        <button className="add-link-btn" onClick={() => setAdding(true)}>
          <Ico.plus width="12" height="12"/> Add link
        </button>
      )}
    </TileChrome>
  );
}

// ─── BIG LINK ────────────────────────────────────────────────────────────
function BigLinkSeg({ segment, api }) {
  const url = normalizeUrl(segment.url || '#');
  return (
    <TileChrome segment={segment} api={api} icon={<Ico.star width="14" height="14"/>}>
      <a className="big-link" href={url} target="_blank" rel="noreferrer" style={{'--bl-bg': hashColor(url)}}>
        <div className="big-link-initial">{initial(segment.title)}</div>
        <div className="big-link-meta">
          <div className="big-link-sub">{segment.subtitle || prettyHost(url)}</div>
          <div className="big-link-cta">Open <Ico.ext width="12" height="12"/></div>
        </div>
      </a>
    </TileChrome>
  );
}

// ─── NOTE ────────────────────────────────────────────────────────────────
function NoteSeg({ segment, api }) {
  const [text, setText] = useState(segment.text || '');
  useEffect(() => setText(segment.text || ''), [segment.text]);
  const save = () => { if (text !== segment.text) api.update({ text }); };
  return (
    <TileChrome segment={segment} api={api} icon={<Ico.note width="14" height="14"/>}>
      <textarea
        className="note-area"
        value={text}
        placeholder="Write anything…"
        onChange={e => setText(e.target.value)}
        onBlur={save}
      />
    </TileChrome>
  );
}

// ─── TO-DO ───────────────────────────────────────────────────────────────
function TodoSeg({ segment, api }) {
  const [text, setText] = useState('');
  const items = segment.items || [];
  const add = () => {
    if (!text.trim()) return;
    api.update({ items: [...items, { id: crypto.randomUUID(), text: text.trim(), done: false }] });
    setText('');
  };
  const toggle = (id) => api.update({ items: items.map(i => i.id === id ? {...i, done: !i.done} : i) });
  const remove = (id) => api.update({ items: items.filter(i => i.id !== id) });

  const doneCount = items.filter(i => i.done).length;

  return (
    <TileChrome segment={segment} api={api} icon={<Ico.todo width="14" height="14"/>}
      toolbar={items.length ? <span className="pill">{doneCount}/{items.length}</span> : null}>
      <ul className="todo-list">
        {items.map(it => (
          <li key={it.id} className={`todo-item ${it.done ? 'done' : ''}`}>
            <button className="todo-check" onClick={() => toggle(it.id)}>
              {it.done && <Ico.check width="12" height="12"/>}
            </button>
            <span className="todo-text" onClick={() => toggle(it.id)}>{it.text}</span>
            <button className="link-x" onClick={() => remove(it.id)}><Ico.x width="11" height="11"/></button>
          </li>
        ))}
      </ul>
      <div className="todo-add">
        <input
          value={text}
          placeholder="New task…"
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
        />
        <button className="btn-primary small" onClick={add}><Ico.plus width="12" height="12"/></button>
      </div>
    </TileChrome>
  );
}

// ─── COUNTER ─────────────────────────────────────────────────────────────
function CounterSeg({ segment, api }) {
  const value = segment.value ?? 0;
  const step = segment.step || 1;
  return (
    <TileChrome segment={segment} api={api} icon={<Ico.counter width="14" height="14"/>}>
      <div className="counter-body">
        <button className="counter-btn" onClick={() => api.update({ value: value - step })}>−</button>
        <div className="counter-value">
          <div className="counter-num">{value}</div>
          {segment.unit && <div className="counter-unit">{segment.unit}</div>}
        </div>
        <button className="counter-btn" onClick={() => api.update({ value: value + step })}>+</button>
      </div>
      {segment.goal ? (
        <div className="counter-goal">
          <div className="counter-bar"><div className="counter-fill" style={{width: `${Math.min(100, (value/segment.goal)*100)}%`}}/></div>
          <div className="counter-goal-label">Goal: {segment.goal}{segment.unit ? ' ' + segment.unit : ''}</div>
        </div>
      ) : null}
    </TileChrome>
  );
}

// ─── EMBED ───────────────────────────────────────────────────────────────
function EmbedSeg({ segment, api }) {
  return (
    <TileChrome segment={segment} api={api} icon={<Ico.embed width="14" height="14"/>} noPadding>
      {segment.url ? (
        <iframe src={segment.url} className="embed-frame" sandbox="allow-scripts allow-same-origin allow-popups allow-forms" title={segment.title}/>
      ) : (
        <div className="empty-hint pad">No embed URL set</div>
      )}
    </TileChrome>
  );
}

// ─── CLOCK ───────────────────────────────────────────────────────────────
function ClockSeg({ segment, api }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const hh = now.getHours();
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const tz = segment.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
    <TileChrome segment={segment} api={api} icon={<Ico.clock width="14" height="14"/>}>
      <div className="clock-body">
        <div className="clock-time">
          <span>{String(hh).padStart(2,'0')}</span>
          <span className="clock-colon">:</span>
          <span>{mm}</span>
          <span className="clock-sec">:{ss}</span>
        </div>
        <div className="clock-sub">{now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        <div className="clock-tz">{tz.replace(/_/g, ' ')}</div>
      </div>
    </TileChrome>
  );
}

// ─── WEATHER (static-ish, user-configurable) ─────────────────────────────
function WeatherSeg({ segment, api }) {
  const temp = segment.temp ?? 68;
  const cond = segment.cond || 'Partly cloudy';
  const city = segment.city || 'Here';
  return (
    <TileChrome segment={segment} api={api} icon={<Ico.weather width="14" height="14"/>}>
      <div className="weather-body">
        <div className="weather-big">{temp}°</div>
        <div className="weather-cond">{cond}</div>
        <div className="weather-city">{city}</div>
        <div className="weather-mini">
          {['Mon','Tue','Wed','Thu','Fri'].map((d, i) => (
            <div key={d} className="weather-day">
              <div className="wd-l">{d}</div>
              <div className="wd-t">{temp - i + Math.floor(Math.random()*3)}°</div>
            </div>
          ))}
        </div>
      </div>
    </TileChrome>
  );
}

// ─── HABIT TRACKER ───────────────────────────────────────────────────────
function HabitSeg({ segment, api }) {
  const days = segment.days || Array(28).fill(0);
  const toggle = (i) => {
    const copy = [...days];
    copy[i] = copy[i] ? 0 : 1;
    api.update({ days: copy });
  };
  const streak = (() => {
    let s = 0;
    for (let i = days.length - 1; i >= 0; i--) { if (days[i]) s++; else break; }
    return s;
  })();
  return (
    <TileChrome segment={segment} api={api} icon={<Ico.habit width="14" height="14"/>}
      toolbar={<span className="pill">🔥 {streak}</span>}>
      <div className="habit-grid">
        {days.map((v, i) => (
          <button key={i} className={`habit-cell ${v ? 'on' : ''}`} onClick={() => toggle(i)} title={`Day ${i+1}`}/>
        ))}
      </div>
      <div className="habit-foot">{segment.description || 'Click to mark complete'}</div>
    </TileChrome>
  );
}

// ─── FEED (manual entries) ───────────────────────────────────────────────
function FeedSeg({ segment, api }) {
  const items = segment.items || [];
  const [adding, setAdding] = useState(false);
  const [t, setT] = useState(''); const [u, setU] = useState('');
  const add = () => {
    if (!t.trim()) return;
    api.update({ items: [{ id: crypto.randomUUID(), title: t.trim(), url: u.trim() ? normalizeUrl(u.trim()) : '', at: Date.now() }, ...items].slice(0, 20) });
    setT(''); setU(''); setAdding(false);
  };
  return (
    <TileChrome segment={segment} api={api} icon={<Ico.feed width="14" height="14"/>}>
      <ul className="feed-list">
        {items.map(it => (
          <li key={it.id} className="feed-item">
            {it.url ? <a href={it.url} target="_blank" rel="noreferrer">{it.title}</a> : <span>{it.title}</span>}
            <div className="feed-meta">{relTime(it.at)}</div>
          </li>
        ))}
        {items.length === 0 && <li className="empty-hint">No items yet</li>}
      </ul>
      {adding ? (
        <div className="inline-form">
          <input placeholder="Title" value={t} autoFocus onChange={e=>setT(e.target.value)}/>
          <input placeholder="URL (optional)" value={u} onChange={e=>setU(e.target.value)}/>
          <div className="inline-form-row">
            <button className="btn-ghost" onClick={()=>{setAdding(false);setT('');setU('');}}>Cancel</button>
            <button className="btn-primary" onClick={add}>Add</button>
          </div>
        </div>
      ) : <button className="add-link-btn" onClick={()=>setAdding(true)}><Ico.plus width="12" height="12"/> Add item</button>}
    </TileChrome>
  );
}

// ─── PINNED (recently opened style) ──────────────────────────────────────
function PinnedSeg({ segment, api }) {
  const items = segment.items || [];
  const [adding, setAdding] = useState(false);
  const [n, setN] = useState(''); const [k, setK] = useState(''); const [u, setU] = useState('');
  const add = () => {
    if (!n.trim()) return;
    api.update({ items: [...items, { id: crypto.randomUUID(), name: n.trim(), kind: k.trim() || 'File', url: u.trim() ? normalizeUrl(u.trim()) : '' }] });
    setN(''); setK(''); setU(''); setAdding(false);
  };
  const remove = (id) => api.update({ items: items.filter(i => i.id !== id) });
  return (
    <TileChrome segment={segment} api={api} icon={<Ico.pinned width="14" height="14"/>}>
      <ul className="pin-list">
        {items.map(it => (
          <li key={it.id} className="pin-item">
            <div className="pin-ico" style={{background: hashColor(it.name)}}>{initial(it.name)}</div>
            <div className="pin-meta">
              {it.url ? <a href={it.url} target="_blank" rel="noreferrer" className="pin-name">{it.name}</a> : <span className="pin-name">{it.name}</span>}
              <div className="pin-kind">{it.kind}</div>
            </div>
            <button className="link-x" onClick={() => remove(it.id)}><Ico.x width="11" height="11"/></button>
          </li>
        ))}
        {items.length === 0 && <li className="empty-hint">Nothing pinned</li>}
      </ul>
      {adding ? (
        <div className="inline-form">
          <input placeholder="Name" value={n} autoFocus onChange={e=>setN(e.target.value)}/>
          <input placeholder="Kind (Doc, Project, File…)" value={k} onChange={e=>setK(e.target.value)}/>
          <input placeholder="URL (optional)" value={u} onChange={e=>setU(e.target.value)}/>
          <div className="inline-form-row">
            <button className="btn-ghost" onClick={()=>{setAdding(false);}}>Cancel</button>
            <button className="btn-primary" onClick={add}>Pin</button>
          </div>
        </div>
      ) : <button className="add-link-btn" onClick={()=>setAdding(true)}><Ico.plus width="12" height="12"/> Pin item</button>}
    </TileChrome>
  );
}

// ─── CALENDAR / AGENDA ───────────────────────────────────────────────────
function AgendaSeg({ segment, api }) {
  const items = segment.items || [];
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState(''); const [when, setWhen] = useState('');
  const add = () => {
    if (!title.trim()) return;
    api.update({ items: [...items, { id: crypto.randomUUID(), title: title.trim(), when: when.trim() || 'Today' }] });
    setTitle(''); setWhen(''); setAdding(false);
  };
  const remove = (id) => api.update({ items: items.filter(i => i.id !== id) });
  return (
    <TileChrome segment={segment} api={api} icon={<Ico.calendar width="14" height="14"/>}>
      <ul className="agenda-list">
        {items.map(it => (
          <li key={it.id} className="agenda-item">
            <div className="agenda-when">{it.when}</div>
            <div className="agenda-title">{it.title}</div>
            <button className="link-x" onClick={() => remove(it.id)}><Ico.x width="11" height="11"/></button>
          </li>
        ))}
        {items.length === 0 && <li className="empty-hint">Nothing scheduled</li>}
      </ul>
      {adding ? (
        <div className="inline-form">
          <input placeholder="Event" value={title} autoFocus onChange={e=>setTitle(e.target.value)}/>
          <input placeholder="When (e.g. 'Tomorrow 3pm')" value={when} onChange={e=>setWhen(e.target.value)}/>
          <div className="inline-form-row">
            <button className="btn-ghost" onClick={()=>setAdding(false)}>Cancel</button>
            <button className="btn-primary" onClick={add}>Add</button>
          </div>
        </div>
      ) : <button className="add-link-btn" onClick={()=>setAdding(true)}><Ico.plus width="12" height="12"/> Add event</button>}
    </TileChrome>
  );
}

// ─── helpers ─────────────────────────────────────────────────────────────
function normalizeUrl(u) {
  if (!u) return u;
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith('/') || u.startsWith('#')) return u;
  return 'https://' + u;
}
function initial(s) { return (s || '?').trim()[0]?.toUpperCase() || '?'; }
function prettyHost(u) {
  try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return u; }
}
function hashColor(s) {
  let h = 0;
  for (let i = 0; i < (s||'').length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  const hue = Math.abs(h) % 360;
  return `oklch(78% 0.08 ${hue})`;
}
function relTime(ts) {
  const d = Math.floor((Date.now() - ts) / 1000);
  if (d < 60) return `${d}s ago`;
  if (d < 3600) return `${Math.floor(d/60)}m ago`;
  if (d < 86400) return `${Math.floor(d/3600)}h ago`;
  return `${Math.floor(d/86400)}d ago`;
}

Object.assign(window, {
  Ico, TileChrome,
  LinkGroupSeg, BigLinkSeg, NoteSeg, TodoSeg, CounterSeg, EmbedSeg,
  ClockSeg, WeatherSeg, HabitSeg, FeedSeg, PinnedSeg, AgendaSeg,
  normalizeUrl, initial, prettyHost, hashColor, relTime,
});
