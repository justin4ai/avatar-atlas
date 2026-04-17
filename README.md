# avatar-taxonomy

Interactive map of 3D-avatar research (2015–present). Curated papers across NeRF, 3DGS, mesh, feed-forward, relightable, diffusion. Filter, see the field re-cluster.

## Run

```
npm install
npm run dev
npm run build
```

## Data

`src/data/papers.ts` — one typed object per paper. Schema in `src/types.ts`.

## Crawler

Weekly pipeline in `scripts/`:
- `arxiv.ts` — fetch candidates
- `tag.ts` — Claude Haiku tagger
- `run.ts` — orchestrate, write `src/data/candidates.ts`

```
npm run crawl:dry             # arxiv only
ANTHROPIC_API_KEY=... npm run crawl -- --from=20240101 --max=100
```

GH Action in `.github/workflows/crawl.yml` runs every Monday 03:00 UTC and opens a PR if there are new candidates. See `DEPLOY.md`.
