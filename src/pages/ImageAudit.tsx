import { useMemo, useState } from 'react';
import { categories, products } from '../data/products';

type Status = 'loading' | 'ok' | 'broken';

/** Unlinked QA page: loads every catalog image in the visitor's browser and lists the broken ones. */
export function ImageAudit() {
  const entries = useMemo(() => {
    const list: { key: string; label: string; src: string }[] = [];
    for (const c of categories) list.push({ key: `cat-${c.id}`, label: `Category: ${c.name}`, src: c.image });
    for (const p of products) p.images.forEach((src, i) => list.push({ key: `${p.id}-${i}`, label: `${p.name} (image ${i + 1}, ${p.id})`, src }));
    return list;
  }, []);
  const [status, setStatus] = useState<Record<string, Status>>({});
  const set = (key: string, s: Status) => setStatus((cur) => ({ ...cur, [key]: s }));

  const broken = entries.filter((e) => status[e.key] === 'broken');
  const done = entries.filter((e) => status[e.key] === 'ok' || status[e.key] === 'broken').length;

  return (
    <div className="page py-10">
      <h1 className="text-4xl">Image audit</h1>
      <p className="mt-2 text-mute" aria-live="polite">
        Checked {done} of {entries.length}. Broken: <strong className={broken.length ? 'text-magenta' : ''}>{broken.length}</strong>
      </p>

      {broken.length > 0 && (
        <section className="mt-6 rounded-2xl border border-magenta/40 bg-white p-4" aria-label="Broken images">
          <h2 className="font-sans text-lg font-bold tracking-normal">Broken images</h2>
          <ul className="mt-2 space-y-2 text-sm">
            {broken.map((b) => (
              <li key={b.key}><span className="font-semibold">{b.label}</span><br /><span className="break-all text-mute">{b.src}</span></li>
            ))}
          </ul>
        </section>
      )}

      <ul className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-8">
        {entries.map((e) => (
          <li key={e.key} className="text-xs">
            <div className={`aspect-[4/5] overflow-hidden rounded-lg border-2 ${status[e.key] === 'broken' ? 'border-magenta' : 'border-transparent'}`}>
              <img
                src={e.src}
                alt=""
                className="h-full w-full object-cover"
                onLoad={() => set(e.key, 'ok')}
                onError={() => set(e.key, 'broken')}
              />
            </div>
            <p className={`mt-1 ${status[e.key] === 'broken' ? 'font-bold text-magenta' : 'text-mute'}`}>
              {status[e.key] === 'broken' ? 'BROKEN' : status[e.key] === 'ok' ? 'ok' : '…'} · {e.label.slice(0, 28)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
