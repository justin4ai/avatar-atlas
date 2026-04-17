import type { Paper, Representation } from '../types';

export interface GraphNode {
  id: string;
  paper: Paper;
  visible: boolean;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  kind: 'builds_on' | 'shared';
  weight: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export function buildGraph(papers: Paper[], visibleIds: Set<string>): GraphData {
  const nodes: GraphNode[] = papers.map((p) => ({
    id: p.id,
    paper: p,
    visible: visibleIds.has(p.id),
  }));

  const idSet = new Set(papers.map((p) => p.id));
  const links: GraphLink[] = [];

  for (const p of papers) {
    for (const parent of p.builds_on ?? []) {
      if (idSet.has(parent)) {
        links.push({ source: parent, target: p.id, kind: 'builds_on', weight: 1 });
      }
    }
  }

  const byRep = new Map<Representation, Paper[]>();
  for (const p of papers) {
    if (!visibleIds.has(p.id)) continue;
    const rep = p.representation[0];
    if (!rep) continue;
    const arr = byRep.get(rep) ?? [];
    arr.push(p);
    byRep.set(rep, arr);
  }

  for (const group of byRep.values()) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < Math.min(group.length, i + 3); j++) {
        links.push({
          source: group[i].id,
          target: group[j].id,
          kind: 'shared',
          weight: 0.25,
        });
      }
    }
  }

  return { nodes, links };
}
