import { create } from 'zustand';
import {
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import type { ResourceNodeData, ResourceGroupNodeData } from '../types';
import { allResources } from '../data/azureResources';

interface CanvasState {
  nodes: Node[];
  edges: Edge[];

  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  addResourceNode: (
    instanceId: string,
    resourceId: string,
    resourceGroupId: string,
    position?: { x: number; y: number }
  ) => void;
  removeResourceNode: (instanceId: string) => void;

  addResourceGroupNode: (
    rgId: string,
    name: string,
    color: string,
    position?: { x: number; y: number }
  ) => void;
  removeResourceGroupNode: (rgId: string) => void;

  addEdge: (source: string, target: string) => void;
  removeEdge: (edgeId: string) => void;
  replaceAll: (nodes: Node[], edges: Edge[]) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  nodes: [],
  edges: [],

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) =>
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) })),

  onEdgesChange: (changes) =>
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),

  onConnect: (connection) =>
    set((state) => {
      if (!connection.source || !connection.target) return state;
      const id = `edge-${connection.source}-${connection.target}`;
      if (state.edges.some((e) => e.id === id)) return state;
      const newEdge: Edge = {
        id,
        source: connection.source,
        target: connection.target,
        type: 'smoothstep',
        animated: true,
      };
      return { edges: [...state.edges, newEdge] };
    }),

  addResourceNode: (instanceId, resourceId, resourceGroupId, position) => {
    const definition = allResources.find((r) => r.id === resourceId);
    if (!definition) return;

    // Position is relative to parent if parentId is set
    const rgNodeId = resourceGroupId ? `rg-node-${resourceGroupId}` : undefined;
    const pos = position ?? { x: 30 + Math.random() * 200, y: 50 + Math.random() * 200 };

    const data: ResourceNodeData = {
      label: definition.name,
      resourceId,
      instanceId,
      resourceGroupId,
      category: definition.category,
      bicepType: definition.bicepType,
      icon: definition.icon,
      docsUrl: definition.docsUrl,
      description: definition.description,
      properties: { ...definition.defaultProperties },
    };

    const node: Node = {
      id: instanceId,
      type: 'resourceNode',
      position: pos,
      data,
      parentId: rgNodeId,
      extent: 'parent' as const,
    };

    // Check if parent RG node exists
    set((state) => {
      const parentExists = rgNodeId ? state.nodes.some(n => n.id === rgNodeId) : true;
      const finalNode = parentExists ? node : { ...node, parentId: undefined, extent: undefined };
      return { nodes: [...state.nodes, finalNode] };
    });
  },

  removeResourceNode: (instanceId) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== instanceId),
      edges: state.edges.filter(
        (e) => e.source !== instanceId && e.target !== instanceId
      ),
    })),

  addResourceGroupNode: (rgId, name, color, position) => {
    const pos = position ?? { x: 50, y: 50 };
    const data: ResourceGroupNodeData = {
      label: name,
      rgId,
      color,
      location: 'eastus',
    };

    const node: Node = {
      id: `rg-node-${rgId}`,
      type: 'resourceGroupNode',
      position: pos,
      data,
      style: {
        width: 900,
        height: 600,
        padding: 40,
      },
    };

    // RG nodes must come before child nodes in the array
    set((state) => ({ nodes: [node, ...state.nodes] }));
  },

  removeResourceGroupNode: (rgId) => {
    const nodeId = `rg-node-${rgId}`;
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId
      ),
    }));
  },

  addEdge: (source, target) => {
    const id = `edge-${source}-${target}`;
    set((state) => {
      if (state.edges.some((e) => e.id === id)) return state;
      return {
        edges: [
          ...state.edges,
          { id, source, target, type: 'smoothstep', animated: true },
        ],
      };
    });
  },

  removeEdge: (edgeId) =>
    set((state) => ({
      edges: state.edges.filter((e) => e.id !== edgeId),
    })),

  replaceAll: (nodes, edges) => set({ nodes, edges }),
}));
