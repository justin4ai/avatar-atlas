export type Representation = 'nerf' | '3dgs' | 'mesh' | 'sdf' | 'points' | 'hybrid';
export type InputModality =
  | 'monocular'
  | 'multiview'
  | 'single_image'
  | 'studio'
  | 'text'
  | 'rgbd';
export type Pipeline = 'per_subject' | 'feed_forward' | 'diffusion_prior';
export type Capability = 'animatable' | 'relightable' | 'static';
export type Target = 'head' | 'body' | 'hand' | 'full';

export type AxisId =
  | 'representation'
  | 'input'
  | 'pipeline'
  | 'capability'
  | 'target';

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  tier: 1 | 2;
  importance: 1 | 2 | 3 | 4 | 5;
  arxiv?: string;
  project?: string;
  code?: string;
  summary: string;
  contribution: string;
  representation: Representation[];
  input: InputModality[];
  pipeline: Pipeline[];
  capability: Capability[];
  target: Target[];
  builds_on?: string[];
}

export type FilterMode = 'any' | 'all';

export interface FilterState {
  representation: Set<Representation>;
  input: Set<InputModality>;
  pipeline: Set<Pipeline>;
  capability: Set<Capability>;
  target: Set<Target>;
  yearRange: [number, number];
  query: string;
  mode: FilterMode;
}

export type LayoutMode = 'force' | 'tree';

export interface AxisValue<T extends string = string> {
  id: T;
  label: string;
  short?: string;
  description: string;
}

export interface Axis {
  id: AxisId;
  label: string;
  color: string;
  values: AxisValue[];
}
