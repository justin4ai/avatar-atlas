import type { FilterState, Paper } from '../types';

function matchesAxis<T extends string>(
  selected: Set<T>,
  values: T[],
  mode: 'any' | 'all',
): boolean {
  if (selected.size === 0) return true;
  const valueSet = new Set(values);
  if (mode === 'all') {
    for (const v of selected) if (!valueSet.has(v)) return false;
    return true;
  }
  for (const v of values) if (selected.has(v)) return true;
  return false;
}

export function matchesFilter(paper: Paper, f: FilterState): boolean {
  if (paper.year < f.yearRange[0] || paper.year > f.yearRange[1]) return false;
  if (!matchesAxis(f.representation, paper.representation, f.mode)) return false;
  if (!matchesAxis(f.input, paper.input, f.mode)) return false;
  if (!matchesAxis(f.pipeline, paper.pipeline, f.mode)) return false;
  if (!matchesAxis(f.capability, paper.capability, f.mode)) return false;
  if (!matchesAxis(f.target, paper.target, f.mode)) return false;
  if (f.query.trim()) {
    const q = f.query.toLowerCase();
    const hay =
      paper.title.toLowerCase() +
      ' ' +
      paper.authors.join(' ').toLowerCase() +
      ' ' +
      paper.contribution.toLowerCase() +
      ' ' +
      paper.venue.toLowerCase() +
      ' ' +
      String(paper.year);
    if (!hay.includes(q)) return false;
  }
  return true;
}

export function hasAnyFilter(f: FilterState): boolean {
  return (
    f.representation.size +
      f.input.size +
      f.pipeline.size +
      f.capability.size +
      f.target.size >
      0 ||
    f.query.trim().length > 0
  );
}
