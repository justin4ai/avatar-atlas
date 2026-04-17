import type { Paper } from '../types';

export function paperMonth(paper: Paper): number {
  if (paper.arxiv) {
    const m = paper.arxiv.match(/abs\/(\d{2})(\d{2})\./);
    if (m) {
      const month = parseInt(m[2], 10);
      if (month >= 1 && month <= 12) return month;
    }
  }
  return venueMonth(paper.venue);
}

function venueMonth(venue: string): number {
  const v = venue.toLowerCase();
  if (v.includes('siggraph asia')) return 12;
  if (v.includes('siggraph')) return 8;
  if (v.includes('cvpr')) return 6;
  if (v.includes('iccv')) return 10;
  if (v.includes('eccv')) return 9;
  if (v.includes('neurips')) return 12;
  if (v.includes('3dv')) return 3;
  if (v.includes('iclr')) return 5;
  if (v.includes('icml')) return 7;
  if (v.includes('tog') || v.includes('tpami')) return 6;
  return 6;
}

export function paperDate(paper: Paper): number {
  return paper.year + (paperMonth(paper) - 1) / 12;
}
