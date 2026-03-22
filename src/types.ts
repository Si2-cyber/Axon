import { type Node, type Edge } from 'reactflow';

export enum DocumentTypology {
  MIND_MAP = 'MIND_MAP',
  FLOWCHART = 'FLOWCHART',
  ORG_CHART = 'ORG_CHART',
}

export enum EdgeType {
  STRAIGHT = 'straight',
  SMOOTHSTEP = 'smoothstep',
  STEP = 'step',
  BEZIER = 'default',
}

export interface NodeData {
  label: string;
  notes?: string;
  tasks?: { id: string; text: string; completed: boolean }[];
  media?: { url: string; type: 'image' | 'icon' };
  links?: string[];
  isRoot?: boolean;
}

export interface Theme {
  id: string;
  name: string;
  backgroundColor: string;
  nodeColor: string;
  textColor: string;
  edgeColor: string;
}

export interface VisualBoundary {
  id: string;
  nodeIds: string[];
  label: string;
  color: string;
}

export interface MapDocument {
  id: string;
  name: string;
  typology: DocumentTypology;
  nodes: Node<NodeData>[];
  edges: Edge[];
  theme: Theme;
  boundaries: VisualBoundary[];
}

export const THEMES: Theme[] = [
  {
    id: 'light',
    name: 'Light Modern',
    backgroundColor: '#f8fafc',
    nodeColor: '#ffffff',
    textColor: '#1e293b',
    edgeColor: '#94a3b8',
  },
  {
    id: 'dark',
    name: 'Dark Professional',
    backgroundColor: '#0f172a',
    nodeColor: '#1e293b',
    textColor: '#f1f5f9',
    edgeColor: '#475569',
  },
  {
    id: 'high-contrast',
    name: 'High Contrast',
    backgroundColor: '#000000',
    nodeColor: '#ffffff',
    textColor: '#000000',
    edgeColor: '#ffffff',
  },
];
