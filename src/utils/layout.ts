import { type Node, type Edge } from 'reactflow';
import { tree, hierarchy } from 'd3-hierarchy';
import { DocumentTypology, NodeData } from '../types';

export const treeLayout = (nodes: Node<NodeData>[], edges: Edge[], typology: DocumentTypology) => {
  if (nodes.length === 0) return { nodes, edges };

  // Find root
  const rootNode = nodes.find(n => n.data.isRoot) || nodes[0];
  
  // Build hierarchy
  const getChildren = (id: string) => {
    return edges
      .filter(e => e.source === id)
      .map(e => nodes.find(n => n.id === e.target))
      .filter((n): n is Node<NodeData> => !!n);
  };

  const buildHierarchy = (node: Node<NodeData>): any => {
    const children = getChildren(node.id);
    return {
      ...node,
      children: children.map(buildHierarchy)
    };
  };

  const data = buildHierarchy(rootNode);
  const root = hierarchy(data);

  // Configure layout
  const nodeWidth = 200;
  const nodeHeight = 80;

  const layout = tree<any>();
  
  if (typology === DocumentTypology.ORG_CHART) {
    layout.nodeSize([nodeWidth + 40, nodeHeight + 100]);
  } else {
    // Mind map usually radial or horizontal
    layout.nodeSize([nodeHeight + 40, nodeWidth + 100]);
  }

  const layoutedRoot = layout(root);

  const newNodes = layoutedRoot.descendants().map(d => {
    const node = d.data as Node<NodeData>;
    return {
      ...node,
      position: typology === DocumentTypology.ORG_CHART 
        ? { x: d.x, y: d.y } 
        : { x: d.y, y: d.x } // Horizontal for mind map
    };
  });

  return { nodes: newNodes, edges };
};
