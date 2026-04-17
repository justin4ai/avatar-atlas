import type { Paper } from '../src/types';

export interface ArxivCandidate {
  id: string; // arxiv id like "2502.20220"
  version: string; // "v1"
  url: string; // https://arxiv.org/abs/...
  title: string;
  authors: string[];
  abstract: string;
  published: string; // ISO
  updated: string; // ISO
  primaryCategory: string;
  categories: string[];
  pdfUrl?: string;
}

export type TaggedCandidate = Pick<
  Paper,
  | 'id'
  | 'title'
  | 'authors'
  | 'year'
  | 'venue'
  | 'tier'
  | 'importance'
  | 'arxiv'
  | 'summary'
  | 'contribution'
  | 'representation'
  | 'input'
  | 'pipeline'
  | 'capability'
  | 'target'
> & {
  is_avatar_paper: boolean;
  builds_on_hints: string[];
  reject_reason?: string;
};
