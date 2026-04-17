import clsx from 'clsx';
import { rgba } from '../../lib/colors';

export function Chip({
  label,
  active,
  color,
  onClick,
  title,
}: {
  label: string;
  active?: boolean;
  color?: string;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={clsx('chip', active && 'active')}
      style={
        active && color
          ? {
              background: rgba(color, 0.25),
              color: color,
              borderColor: rgba(color, 0.5),
              boxShadow: `0 0 12px ${rgba(color, 0.2)}`,
            }
          : undefined
      }
    >
      {label}
    </button>
  );
}
