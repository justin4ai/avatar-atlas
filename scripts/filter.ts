import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ArxivCandidate } from './schema';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const STRONG_TITLE = /\b(avatar|avatars|talking\s*head|talking\s*face|portrait|digital\s*human|codec\s*avatar|head\s*model|face\s*model)\b/i;
const AVATAR_KW = /\b(avatar|avatars|digital\s*human|talking\s*head|talking\s*face|codec\s*avatar|head\s*model|portrait|3d\s*head|3d\s*face|3d\s*body|full[\s-]*body\s*human|clothed\s*human|neural\s*head|gaussian\s*head|gaussian\s*avatar|drivable|animatable\s*human|relightable\s*human)\b/i;
const HUMAN_KW = /\b(human|face|head|body|hand|hair|garment|clothing|expression|gesture|motion|subject)\b/i;
const TECH_KW = /\b(gaussian\s*splatting|3dgs|4dgs|nerf|neural\s*radiance|neural\s*field|sdf|mesh|point\s*cloud|diffusion|lbs|smpl|smplx|smpl-x|mano|flame|linear\s*blend\s*skinning|feed[\s-]*forward|reenactment|relightable|animatable|drivable)\b/i;

const NEGATIVE = /\b(robot|robotic|autonomous\s*driving|self-driving|lidar\s*point|molecul|protein|medical\s*imaging|ct\s*scan|mri|x-ray|tumor|cancer|disease|satellite|remote\s*sensing|agricultur|crop|urban\s*scene|road\s*scene|driving\s*scene|surveillance|anomaly\s*detection|traffic|vehicle|pedestrian\s*detection|crowd\s*counting|action\s*recognition|activity\s*recognition|gait\s*recognition|pose\s*estimation\s*from|sign\s*language|object\s*detection|semantic\s*segmentation\s*of|scene\s*flow|depth\s*estimation\s*of|optical\s*flow|image\s*classification|video\s*classification|text\s*generation|language\s*model(?!ing\s+(of|for)\s+(avatar|face|head|body))|nlp|speech\s*recognition\s+(for|from)\s+audio|acoustic)\b/i;

interface Scored extends ArxivCandidate {
  score: number;
  reasons: string[];
}

function scorePaper(p: ArxivCandidate): Scored {
  let score = 0;
  const reasons: string[] = [];
  const title = p.title || '';
  const abs = p.abstract || '';
  const blob = `${title}\n${abs}`;

  if (STRONG_TITLE.test(title)) {
    score += 5;
    reasons.push('strong-title');
  }
  if (AVATAR_KW.test(blob)) {
    score += 4;
    reasons.push('avatar-kw');
  }
  if (HUMAN_KW.test(blob) && TECH_KW.test(blob)) {
    score += 3;
    reasons.push('human+tech');
  }
  if (/\bgaussian\s*splatting\b/i.test(blob) && /\b(human|avatar|face|head|body|hand|portrait)\b/i.test(blob)) {
    score += 2;
    reasons.push('3dgs+human');
  }
  if (/\b(nerf|neural\s*radiance)\b/i.test(blob) && /\b(human|avatar|face|head|body|portrait)\b/i.test(blob)) {
    score += 2;
    reasons.push('nerf+human');
  }
  if (/\bdiffusion\b/i.test(blob) && /\b(avatar|portrait|head|face|human)\b/i.test(blob) && /\b3d\b/i.test(blob)) {
    score += 2;
    reasons.push('3d-diffusion-human');
  }
  if (NEGATIVE.test(blob) && !/\b(avatar|digital\s*human|codec\s*avatar)\b/i.test(title)) {
    score -= 4;
    reasons.push('negative-domain');
  }
  // primary category penalty
  if (p.primaryCategory && !/^(cs\.CV|cs\.GR|cs\.AI|cs\.LG|cs\.MM)$/.test(p.primaryCategory)) {
    score -= 2;
    reasons.push(`off-topic-cat:${p.primaryCategory}`);
  }
  return { ...p, score, reasons };
}

function main() {
  const minScore = parseInt(
    process.argv.find((a) => a.startsWith('--min='))?.split('=')[1] ?? '5',
    10,
  );
  const maxOut = parseInt(
    process.argv.find((a) => a.startsWith('--max='))?.split('=')[1] ?? '300',
    10,
  );
  const inputPath = path.join(ROOT, 'scripts', '.crawl-raw.json');
  const raw = JSON.parse(fs.readFileSync(inputPath, 'utf8')) as ArxivCandidate[];
  const scored = raw
    .map(scorePaper)
    .filter((s) => s.score >= minScore)
    .sort((a, b) => b.score - a.score || b.published.localeCompare(a.published))
    .slice(0, maxOut);

  const outPath = path.join(ROOT, 'scripts', '.crawl-filtered.json');
  fs.writeFileSync(outPath, JSON.stringify(scored, null, 2));
  console.log(`[filter] raw=${raw.length}  kept=${scored.length}  min=${minScore}  maxOut=${maxOut}`);
  console.log(`[filter] wrote ${outPath}`);

  // print compact summary
  const preview = scored.slice(0, 40).map((p) => ({
    score: p.score,
    id: p.id,
    pub: p.published.slice(0, 10),
    title: p.title.slice(0, 90),
  }));
  console.table(preview);
}

main();
