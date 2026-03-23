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
import { MapDocument, DocumentTypology, THEMES, NodeData, TreeNode } from './types';
import { generateCanvasLayout } from './utils/layout';

interface MapState {
  document: MapDocument;
  history: MapDocument[];
  historyIndex: number;
  
  // Actions
  initDocument: (typology: DocumentTypology) => void;
  setNodes: (nodes: Node<NodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  updateNodeData: (nodeId: string, data: Partial<NodeData>) => void;
  addChildNode: (parentId: string) => void;
  deleteNode: (nodeId: string) => void;
  setTheme: (themeId: string) => void;
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
  resetMap: () => void;
}

const initialTreeRoot: TreeNode = {
  id: 'root',
  data: { label: 'Central Topic', isRoot: true },
  children: [],
};

const initialDoc: MapDocument = {
  id: 'default-doc',
  name: 'Untitled Map',
  typology: DocumentTypology.MIND_MAP,
  rootNode: initialTreeRoot,
  nodes: generateCanvasLayout(initialTreeRoot).nodes,
  edges: generateCanvasLayout(initialTreeRoot).edges,
  theme: THEMES[0],
  boundaries: [],
};

// Helper: Recursively find and update a node
function updateTreeData(node: TreeNode, nodeId: string, data: Partial<NodeData>): boolean {
  if (node.id === nodeId) {
    node.data = { ...node.data, ...data };
    return true;
  }
  for (const child of node.children) {
    if (updateTreeData(child, nodeId, data)) return true;
  }
  return false;
}

// Helper: Recursively add a child
function addTreeChild(node: TreeNode, parentId: string, child: TreeNode): boolean {
  if (node.id === parentId) {
    node.children.push(child);
    return true;
  }
  for (const c of node.children) {
    if (addTreeChild(c, parentId, child)) return true;
  }
  return false;
}

// Helper: Recursively delete a node
function deleteTreeNode(node: TreeNode, nodeId: string): boolean {
  const index = node.children.findIndex(c => c.id === nodeId);
  if (index !== -1) {
    node.children.splice(index, 1);
    return true;
  }
  for (const child of node.children) {
    if (deleteTreeNode(child, nodeId)) return true;
  }
  return false;
}

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

      initDocument: (typology) => {
        set({
          document: {
             ...initialDoc,
             typology,
             nodes: typology === DocumentTypology.MIND_MAP ? generateCanvasLayout(initialTreeRoot).nodes : initialDoc.nodes,
             edges: typology === DocumentTypology.MIND_MAP ? generateCanvasLayout(initialTreeRoot).edges : initialDoc.edges,
          },
          history: [initialDoc],
          historyIndex: 0
        });
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
        // Disabled free-form connections since we enforce strict hierarchical tree layout
      },

      addChildNode: (parentId) => {
        const { document } = get();
        // Ignore Add Child for Flowcharts 
        if (document.typology !== DocumentTypology.MIND_MAP) return;

        const newRoot = JSON.parse(JSON.stringify(document.rootNode)); // Deep copy
        
        const newNode: TreeNode = {
          id: `node-${Date.now()}`,
          data: { label: 'New Topic' },
          children: []
        };

        if (addTreeChild(newRoot, parentId, newNode)) {
          const { nodes, edges } = generateCanvasLayout(newRoot);
          set({ document: { ...document, rootNode: newRoot, nodes, edges } });
          get().saveToHistory();
        }
      },

      deleteNode: (nodeId) => {
        if (nodeId === 'root') return; // Cannot delete root
        const { document } = get();
        
        // For Flowchart, we just remove it from flat array
        if (document.typology !== DocumentTypology.MIND_MAP) {
          set({ document: { ...document, nodes: document.nodes.filter(n => n.id !== nodeId) } });
          get().saveToHistory();
          return;
        }

        // For MindMap we use tree
        const newRoot = JSON.parse(JSON.stringify(document.rootNode));
        if (deleteTreeNode(newRoot, nodeId)) {
          const { nodes, edges } = generateCanvasLayout(newRoot);
          set({ document: { ...document, rootNode: newRoot, nodes, edges } });
          get().saveToHistory();
        }
      },

      updateNodeData: (nodeId, data) => {
        const { document } = get();
        const newRoot = JSON.parse(JSON.stringify(document.rootNode));
        
        if (updateTreeData(newRoot, nodeId, data)) {
          const { nodes, edges } = generateCanvasLayout(newRoot);
          set({ document: { ...document, rootNode: newRoot, nodes, edges } });
          get().saveToHistory();
        }
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

      resetMap: () => {
        const { document } = get();
        if (document.typology !== DocumentTypology.MIND_MAP) return;

        // Clone the root node and clear all its children
        const newRoot = JSON.parse(JSON.stringify(document.rootNode));
        newRoot.children = [];

        // Regenerate layout constraints based on just the root node
        const { nodes, edges } = generateCanvasLayout(newRoot);
        set({ document: { ...document, rootNode: newRoot, nodes, edges } });
        get().saveToHistory();
      },
    }),
    {
      name: 'typology-map-storage',
      partialize: (state) => ({ document: state.document }),
    }
  )
);
