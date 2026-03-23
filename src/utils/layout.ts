import { LayoutNode, TreeNode } from "../types";

const NODE_WIDTH = 250;
const NODE_HEIGHT = 120; // Increased to prevent rendering overlap
const HORIZONTAL_SPACING = 300; // X space between depths
const NODE_GAP_Y = 24; // Y space between sibling nodes

/**
 * 1. Bottom-Up Pass: Calculate the vertical bounding box height of each sub-tree.
 */
function calculateBBoxSizes(node: LayoutNode) {
  if (!node.children || node.children.length === 0) {
    node.bboxHeight = NODE_HEIGHT;
    return;
  }

  let totalChildrenHeight = 0;
  for (const child of node.children) {
    calculateBBoxSizes(child);
    totalChildrenHeight += child.bboxHeight!;
  }

  // Add vertical paddings between children
  totalChildrenHeight += (node.children.length - 1) * NODE_GAP_Y;

  // This sub-tree's bounding box height is whichever is larger:
  // The height of itself or the total heights of its nested branches
  node.bboxHeight = Math.max(NODE_HEIGHT, totalChildrenHeight);
}

/**
 * 2. Top-Down Pass: Assign Coordinates (x, y) starting from root limits
 */
function assignCoordinates(node: LayoutNode, depthX: number, boundingBoxStartY: number) {
  // Setup X coordinate rigidly based on depth
  node.x = depthX * (NODE_WIDTH + HORIZONTAL_SPACING);

  // If node is a leaf, just place it in the center of its bounding box block
  if (!node.children || node.children.length === 0) {
    node.y = boundingBoxStartY + (node.bboxHeight! / 2) - (NODE_HEIGHT / 2);
    return;
  }

  // Iterate over children, pushing the startY down the Y axis block by block
  let currentY = boundingBoxStartY;

  // If parent's bboxHeight is larger than children stack, shift children block vertically center
  const totalChildrenHeight = node.children.reduce((acc, c) => acc + c.bboxHeight!, 0) + (node.children.length - 1) * NODE_GAP_Y;
  const centeredChildOffsetY = boundingBoxStartY + (node.bboxHeight! - totalChildrenHeight) / 2;

  currentY = centeredChildOffsetY;

  for (const child of node.children) {
    assignCoordinates(child, depthX + 1, currentY);
    // Push the next sibling further down the canvas
    currentY += child.bboxHeight! + NODE_GAP_Y;
  }

  // Bracket Centering calculation for the Parent 
  // Get the exact center of top-most child and bottom-most child
  const firstChild = node.children[0];
  const lastChild = node.children[node.children.length - 1];

  const firstChildCenter = firstChild.y! + (NODE_HEIGHT / 2);
  const lastChildCenter = lastChild.y! + (NODE_HEIGHT / 2);
  const childrenMidpoint = (firstChildCenter + lastChildCenter) / 2;

  // Anchor the Parent exactly halfway between that bracket
  node.y = childrenMidpoint - (NODE_HEIGHT / 2);
}

/**
 * 3. Primary Export: Converts your nested structure into a flat React Flow Array
 */
export function generateCanvasLayout(rootTree: TreeNode) {
  const root = rootTree as LayoutNode;

  // Run Layout Engine
  calculateBBoxSizes(root);
  assignCoordinates(root, 0, 0);

  // Flatten processed nested tree back to the format ReactFlow needs
  const flatNodes: any[] = [];
  const flatEdges: any[] = [];

  function flatten(node: LayoutNode) {
    flatNodes.push({
      id: node.id,
      position: { x: node.x, y: node.y },
      data: node.data,
      type: node.data.isRoot ? 'input' : 'default', // Using standard React Flow Types
    });

    if (node.children) {
      for (const child of node.children) {
        flatEdges.push({
          id: `e-${node.id}-${child.id}`,
          source: node.id,
          target: child.id,
          type: 'smoothstep', // Looks awesome for hierarchical structures
        });
        flatten(child);
      }
    }
  }

  flatten(root);
  return { nodes: flatNodes, edges: flatEdges };
}
