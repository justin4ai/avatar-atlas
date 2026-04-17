import { PAPERS as CURATED } from './papers';
import { CANDIDATES } from './candidates';
import type { Paper } from '../types';

const seen = new Set<string>(CURATED.map((p) => p.id));
const extras = CANDIDATES.filter((p) => !seen.has(p.id));

export const ALL_PAPERS: Paper[] = [...CURATED, ...extras];
export const CURATED_PAPERS = CURATED;
