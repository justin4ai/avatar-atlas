import type { Capability, InputModality, Representation } from '../types';

export const REP_COLOR: Record<Representation, string> = {
  nerf: '#67e8f9',
  '3dgs': '#7dd3fc',
  mesh: '#fbbf24',
  sdf: '#a78bfa',
  points: '#f472b6',
  hybrid: '#a3e635',
};

export const INPUT_COLOR: Record<InputModality, string> = {
  monocular: '#f97316',
  multiview: '#22d3ee',
  single_image: '#e879f9',
  studio: '#f43f5e',
  text: '#a3e635',
  rgbd: '#60a5fa',
};

export const CAP_COLOR: Record<Capability, string> = {
  animatable: '#22d3ee',
  relightable: '#fbbf24',
  static: '#94a3b8',
};

export const REP_GLOW: Record<Representation, string> = {
  nerf: 'rgba(103,232,249,0.45)',
  '3dgs': 'rgba(125,211,252,0.45)',
  mesh: 'rgba(251,191,36,0.45)',
  sdf: 'rgba(167,139,250,0.45)',
  points: 'rgba(244,114,182,0.45)',
  hybrid: 'rgba(163,230,53,0.45)',
};

export function rgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
