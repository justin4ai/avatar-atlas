import type { Axis, AxisId } from '../../types';
import { Chip } from '../ui/Chip';

interface Props {
  axis: Axis;
  selected: Set<string>;
  onToggle: (valueId: string) => void;
}

export function AxisGroup({ axis, selected, onToggle }: Props) {
  return (
    <div className="pb-4">
      <div className="flex items-center gap-2 mb-2">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: axis.color, boxShadow: `0 0 8px ${axis.color}` }}
        />
        <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/55">
          {axis.label}
        </div>
        {selected.size > 0 && (
          <span className="font-mono text-[10px] text-white/40">
            · {selected.size}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {axis.values.map((v) => (
          <Chip
            key={v.id}
            label={v.short ?? v.label}
            active={selected.has(v.id)}
            color={axis.color}
            onClick={() => onToggle(v.id)}
            title={v.description}
          />
        ))}
      </div>
    </div>
  );
}

export function axisIdKey(id: AxisId) {
  return id;
}
