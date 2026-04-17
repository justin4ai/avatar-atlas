import { AXES } from '../../data/taxonomy';
import { useFilterStore } from '../../store/useFilterStore';
import { AxisGroup } from './AxisGroup';
import { YearRange } from './YearRange';
import { hasAnyFilter } from '../../lib/filter';
import { X } from 'lucide-react';
import clsx from 'clsx';
import type { FilterMode } from '../../types';

export function FilterSidebar() {
  const store = useFilterStore();

  function axisSelected(id: (typeof AXES)[number]['id']): Set<string> {
    switch (id) {
      case 'representation':
        return store.representation as Set<string>;
      case 'input':
        return store.input as Set<string>;
      case 'pipeline':
        return store.pipeline as Set<string>;
      case 'capability':
        return store.capability as Set<string>;
      case 'target':
        return store.target as Set<string>;
    }
  }

  function axisToggle(id: (typeof AXES)[number]['id'], v: string) {
    (store.toggle as any)[id](v);
  }

  const dirty = hasAnyFilter(store);

  return (
    <aside className="panel m-4 p-5 w-[300px] flex-none flex flex-col gap-1 overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/80">
          Filters
        </div>
        {dirty && (
          <button
            onClick={() => store.clearAll()}
            className="ml-auto flex items-center gap-1 text-[10.5px] font-mono text-white/50 hover:text-white transition"
            title="Clear all filters"
          >
            <X size={11} /> clear
          </button>
        )}
      </div>
      <ModeSwitch mode={store.mode} onChange={store.setMode} />
      {AXES.map((axis) => (
        <AxisGroup
          key={axis.id}
          axis={axis}
          selected={axisSelected(axis.id)}
          onToggle={(v) => axisToggle(axis.id, v)}
        />
      ))}
      <YearRange />
      <div className="mt-auto pt-4 border-t border-white/5 text-[11px] text-white/35 leading-snug">
        <span className="font-mono text-white/60">
          {store.mode === 'any' ? 'ANY' : 'ALL'}
        </span>{' '}
        mode: within one axis, matches must satisfy{' '}
        {store.mode === 'any' ? 'at least one' : 'every'} selected tag.
        Different axes always combine with <span className="font-mono text-white/60">AND</span>.
      </div>
    </aside>
  );
}

function ModeSwitch({
  mode,
  onChange,
}: {
  mode: FilterMode;
  onChange: (m: FilterMode) => void;
}) {
  const items: {
    id: FilterMode;
    label: string;
    desc: string;
  }[] = [
    { id: 'any', label: 'ANY', desc: 'Union (OR) within each axis' },
    { id: 'all', label: 'ALL', desc: 'Intersection (AND) within each axis' },
  ];
  return (
    <div className="mb-4">
      <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/40 mb-1.5">
        Filter mode
      </div>
      <div className="flex items-center gap-0.5 p-0.5 bg-white/[0.03] border border-white/10 rounded-md">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => onChange(it.id)}
            title={it.desc}
            className={clsx(
              'flex-1 text-[10.5px] font-mono tracking-[0.12em] py-1 rounded transition',
              mode === it.id
                ? 'bg-white/12 text-white'
                : 'text-white/45 hover:text-white/90 hover:bg-white/5',
            )}
          >
            {it.label}
          </button>
        ))}
      </div>
    </div>
  );
}
