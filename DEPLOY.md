# deploy

## static site (vercel)

1. push the repo to github
2. `vercel.com/new` → import the repo → deploy
   (vite is auto-detected; leave build command / output dir alone)

alternatives work the same: netlify, cloudflare pages, github pages (for gh pages, add `base: '/<repo>/'` to `vite.config.ts`).

## weekly crawl

1. get an anthropic api key at `console.anthropic.com`. ~$5 of credit covers the year.
2. repo → settings → secrets and variables → actions → new secret
   - name: `ANTHROPIC_API_KEY`
   - value: `sk-ant-...`
3. actions tab → `weekly avatar-paper crawl` → run workflow (first run)

after that it runs every monday 03:00 UTC. each run opens a PR titled `Avatar candidates: N new from arXiv`.

## review flow

- open `src/data/candidates.ts` in the PR
- move keepers into `src/data/papers.ts`, fix tags / `builds_on` as needed
- merge (or close without merging — next week regenerates)
- vercel auto-redeploys on push to `main`

## knobs

- query list: `QUERY_FAMILIES` in `scripts/arxiv.ts`
- tagger system prompt: `SYSTEM` in `scripts/tag.ts`
- cadence: `schedule.cron` in `.github/workflows/crawl.yml`
- model: `CLAUDE_MODEL` env var (default `claude-haiku-4-5-20251001`)
