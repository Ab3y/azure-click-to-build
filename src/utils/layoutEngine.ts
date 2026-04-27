import dagre from '@dagrejs/dagre';
import type { Node, Edge } from '@xyflow/react';

export function autoLayout(nodes: Node[], edges: Edge[]): Node[] {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', nodesep: 60, ranksep: 80 });

  const rgNodes: Node[] = [];

  for (const node of nodes) {
    if (node.type === 'resourceGroupNode') {
      rgNodes.push(node);
      continue;
    }
    g.setNode(node.id, { width: 200, height: 80 });
  }

  for (const edge of edges) {
    if (g.hasNode(edge.source) && g.hasNode(edge.target)) {
      g.setEdge(edge.source, edge.target);
    }
  }

  dagre.layout(g);

  const positioned = nodes.map((node) => {
    if (node.type === 'resourceGroupNode') return node;

    const pos = g.node(node.id);
    if (!pos) return node;

    return {
      ...node,
      position: { x: pos.x - 100, y: pos.y - 40 },
    };
  });

  return positioned;
}
