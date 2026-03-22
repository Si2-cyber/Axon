import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  type Node, 
  type Edge, 
  type Connection, 
  addEdge, 
  applyNodeChanges, 
  applyEdgeChanges, 
  type NodeChange, 
  type EdgeChange 
} from 'reactflow';
import { MapDocument, DocumentTypology, THEMES, NodeData } from './types';
import { treeLayout } from './utils/layout';

interface MapState {
  document: MapDocument;
  history: MapDocument[];
  historyIndex: number;
  
  // Actions
  setTypology: (typology: DocumentTypology) => void;
  setNodes: (nodes: Node<NodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  updateNodeData: (nodeId: string, data: Partial<NodeData>) => void;
  setTheme: (themeId: string) => void;
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
}

const initialDoc: MapDocument = {
  id: 'default-doc',
  name: 'Untitled Map',
  typology: DocumentTypology.MIND_MAP,
  nodes: [
    {
      id: 'root',
      type: 'input',
      data: { label: 'Central Topic', isRoot: true },
      position: { x: 0, y: 0 },
    },
  ],
  edges: [],
  theme: THEMES[0],
  boundaries: [],
};

export const useMapStore = create<MapState>()(
  persist(
    (set, get) => ({
      document: initialDoc,
      history: [initialDoc],
      historyIndex: 0,

      saveToHistory: () => {
        const { document, history, historyIndex } = get();
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify(document)));
        
        // Limit history size
        if (newHistory.length > 50) newHistory.shift();
        
        set({ 
          history: newHistory, 
          historyIndex: newHistory.length - 1 
        });
      },

      setTypology: (typology) => {
        const { document } = get();
        let newNodes = [...document.nodes];
        let newEdges = [...document.edges];

        // Apply reflow logic based on typology
        if (typology === DocumentTypology.MIND_MAP || typology === DocumentTypology.ORG_CHART) {
          const layouted = treeLayout(newNodes, newEdges, typology);
          newNodes = layouted.nodes;
          newEdges = layouted.edges;
        }

        set({ document: { ...document, typology, nodes: newNodes, edges: newEdges } });
        get().saveToHistory();
      },

      setNodes: (nodes) => set((state) => ({ document: { ...state.document, nodes } })),
      setEdges: (edges) => set((state) => ({ document: { ...state.document, edges } })),

      onNodesChange: (changes) => {
        const { document } = get();
        const newNodes = applyNodeChanges(changes, document.nodes);
        set({ document: { ...document, nodes: newNodes } });
      },

      onEdgesChange: (changes) => {
        const { document } = get();
        const newEdges = applyEdgeChanges(changes, document.edges);
        set({ document: { ...document, edges: newEdges } });
      },

      onConnect: (connection) => {
        const { document } = get();
        const newEdges = addEdge(connection, document.edges);
        set({ document: { ...document, edges: newEdges } });
        get().saveToHistory();
      },

      updateNodeData: (nodeId, data) => {
        const { document } = get();
        const newNodes = document.nodes.map((node) => {
          if (node.id === nodeId) {
            return { ...node, data: { ...node.data, ...data } };
          }
          return node;
        });
        set({ document: { ...document, nodes: newNodes } });
        get().saveToHistory();
      },

      setTheme: (themeId) => {
        const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];
        set((state) => ({ document: { ...state.document, theme } }));
        get().saveToHistory();
      },

      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          set({ 
            document: JSON.parse(JSON.stringify(history[newIndex])), 
            historyIndex: newIndex 
          });
        }
      },

      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          set({ 
            document: JSON.parse(JSON.stringify(history[newIndex])), 
            historyIndex: newIndex 
          });
        }
      },
    }),
    {
      name: 'typology-map-storage',
      partialize: (state) => ({ document: state.document }),
    }
  )
);
