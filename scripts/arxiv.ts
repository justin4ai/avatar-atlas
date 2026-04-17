import { XMLParser } from 'fast-xml-parser';
import type { ArxivCandidate } from './schema';

const API = 'http://export.arxiv.org/api/query';

export const QUERY_FAMILIES: string[] = [
  // -- core avatar / human terms --
  'ti:avatar AND cat:cs.CV',
  'abs:"digital human" AND cat:cs.CV',
  'abs:"head avatar" AND cat:cs.CV',
  'abs:"body avatar" AND cat:cs.CV',
  'abs:"full-body avatar" AND cat:cs.CV',
  'abs:"hand avatar" AND cat:cs.CV',
  'abs:"portrait" AND (abs:"gaussian" OR abs:"nerf" OR abs:"3d")',
  'abs:"codec avatar" AND cat:cs.CV',

  // -- 3D Gaussian / 4D Gaussian --
  'abs:"gaussian splatting" AND abs:avatar',
  'abs:"gaussian splatting" AND abs:human',
  'abs:"gaussian avatar"',
  'abs:"gaussian head"',
  'abs:"4D gaussian" AND (abs:human OR abs:avatar OR abs:face)',
  'abs:"animatable gaussian"',
  'abs:"drivable gaussian" AND cat:cs.CV',
  'abs:"relightable gaussian"',

  // -- NeRF / neural fields --
  'abs:"neural radiance" AND abs:human AND cat:cs.CV',
  'abs:"neural radiance" AND abs:face AND cat:cs.CV',
  'abs:"animatable nerf"',
  'abs:"neural head" AND cat:cs.CV',

  // -- parametric priors / rigging --
  'abs:FLAME AND (abs:gaussian OR abs:nerf OR abs:diffusion) AND cat:cs.CV',
  'abs:SMPL AND (abs:gaussian OR abs:nerf) AND cat:cs.CV',
  'abs:SMPLX AND cat:cs.CV',
  'abs:MANO AND abs:hand AND cat:cs.CV',
  'abs:"linear blend skinning" AND (abs:gaussian OR abs:nerf)',

  // -- capabilities --
  'abs:"relightable" AND (abs:avatar OR abs:human OR abs:face)',
  'abs:"animatable" AND (abs:gaussian OR abs:nerf OR abs:diffusion) AND cat:cs.CV',
  'abs:"reenactment" AND (abs:gaussian OR abs:nerf) AND cat:cs.CV',
  'abs:"expression" AND abs:avatar AND cat:cs.CV',

  // -- diffusion / generative avatars --
  'abs:"diffusion" AND abs:avatar AND cat:cs.CV',
  'abs:"diffusion" AND abs:"3d human" AND cat:cs.CV',
  'abs:"text-to-avatar"',
  'abs:"image-to-avatar"',
  'abs:"one-shot" AND abs:avatar AND cat:cs.CV',
  'abs:"single image" AND abs:avatar AND cat:cs.CV',

  // -- feed-forward / large reconstruction models --
  'abs:"feed-forward" AND (abs:avatar OR abs:human) AND cat:cs.CV',
  'abs:"large reconstruction" AND abs:human',
  'abs:"generalizable" AND abs:avatar AND cat:cs.CV',

  // -- reconstruction pipelines --
  'abs:"human reconstruction" AND (abs:gaussian OR abs:nerf)',
  'abs:"3D human" AND abs:gaussian',
  'abs:"clothed human" AND cat:cs.CV',
  'abs:"garment" AND abs:avatar',
  'abs:"hair" AND (abs:gaussian OR abs:avatar)',

  // -- talking head / video --
  'abs:"talking head" AND (abs:gaussian OR abs:nerf OR abs:diffusion) AND cat:cs.CV',
  'abs:"talking face" AND cat:cs.CV',
  'abs:"video avatar" AND cat:cs.CV',
  'abs:"video portrait" AND cat:cs.CV',
  'abs:"lip sync" AND (abs:gaussian OR abs:nerf OR abs:3d)',
];

export interface FetchOptions {
  fromDate: string; // YYYYMMDD
  toDate?: string; // YYYYMMDD
  maxPerQuery?: number;
}

export async function fetchArxivForQuery(
  query: string,
  opts: FetchOptions,
): Promise<ArxivCandidate[]> {
  const to = opts.toDate ?? todayYmd();
  const ranged = `(${query}) AND submittedDate:[${opts.fromDate}0000 TO ${to}2359]`;
  const params = new URLSearchParams({
    search_query: ranged,
    start: '0',
    max_results: String(opts.maxPerQuery ?? 100),
    sortBy: 'submittedDate',
    sortOrder: 'descending',
  });
  const url = `${API}?${params.toString()}`;

  let lastErr: Error | null = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt > 0) await sleep(5000 * Math.pow(2, attempt - 1));
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'avatar-taxanomy/0.1 (research crawl)' },
      });
      if (res.status === 429 || res.status === 503) {
        lastErr = new Error(`HTTP ${res.status}`);
        continue;
      }
      if (!res.ok) throw new Error(`arxiv HTTP ${res.status}`);
      const xml = await res.text();
      return parseFeed(xml);
    } catch (err) {
      lastErr = err as Error;
    }
  }
  throw lastErr ?? new Error('arxiv: unknown failure');
}

export async function fetchAllFamilies(
  opts: FetchOptions,
): Promise<ArxivCandidate[]> {
  const map = new Map<string, ArxivCandidate>();
  for (let i = 0; i < QUERY_FAMILIES.length; i++) {
    const q = QUERY_FAMILIES[i];
    try {
      const rows = await fetchArxivForQuery(q, opts);
      let added = 0;
      for (const r of rows) {
        if (!map.has(r.id)) {
          map.set(r.id, r);
          added++;
        }
      }
      console.log(
        `[arxiv] (${i + 1}/${QUERY_FAMILIES.length}) ${rows.length} hits, ${added} new · ${q}`,
      );
    } catch (err) {
      console.error(`[arxiv] query "${q}" failed:`, (err as Error).message);
    }
    if (i < QUERY_FAMILIES.length - 1) await sleep(6000);
  }
  return [...map.values()].sort((a, b) =>
    b.published.localeCompare(a.published),
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function todayYmd(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`;
}
function pad(n: number) {
  return String(n).padStart(2, '0');
}

function parseFeed(xml: string): ArxivCandidate[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    isArray: (name) => name === 'entry' || name === 'author' || name === 'category' || name === 'link',
  });
  const feed = parser.parse(xml)?.feed;
  if (!feed || !feed.entry) return [];
  return feed.entry.map((e: unknown) => toCandidate(e as Record<string, unknown>));
}

function toCandidate(e: Record<string, unknown>): ArxivCandidate {
  const idUrl = (e.id as string) ?? '';
  // idUrl is like http://arxiv.org/abs/2502.20220v1
  const m = idUrl.match(/abs\/([^v]+)(v\d+)?$/);
  const id = m?.[1] ?? idUrl;
  const version = m?.[2] ?? 'v1';
  const authors = ((e.author as Array<{ name?: string }>) ?? [])
    .map((a) => (a?.name ?? '').trim())
    .filter(Boolean);
  const links = (e.link as Array<{ href?: string; title?: string; type?: string }>) ?? [];
  const pdf = links.find((l) => l.title === 'pdf' || l.type === 'application/pdf')?.href;
  const cats =
    ((e.category as Array<{ term?: string }>) ?? [])
      .map((c) => c.term)
      .filter((x): x is string => !!x) ?? [];
  const primaryTerm =
    ((e['arxiv:primary_category'] as { term?: string }) ?? {}).term ??
    cats[0] ??
    'cs.CV';
  return {
    id,
    version,
    url: idUrl.replace(/v\d+$/, ''),
    title: String(e.title ?? '').trim().replace(/\s+/g, ' '),
    authors,
    abstract: String(e.summary ?? '').trim().replace(/\s+/g, ' '),
    published: String(e.published ?? ''),
    updated: String(e.updated ?? ''),
    primaryCategory: primaryTerm,
    categories: cats,
    pdfUrl: pdf,
  };
}
