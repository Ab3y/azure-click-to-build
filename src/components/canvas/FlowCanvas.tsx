import { useCallback, useState, useMemo, type MouseEvent as ReactMouseEvent } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  ReactFlowProvider,
  Panel,
  useReactFlow,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toast } from 'sonner';

import { useCanvasStore } from '../../store/useCanvasStore';
import { useResourceStore } from '../../store/useResourceStore';
import { useAppStore } from '../../store/useAppStore';
import { ResourceNode } from './ResourceNode';
import { ResourceGroupNode } from './ResourceGroupNode';
import { EdgeWithMenu } from './EdgeWithMenu';
import { ContextMenu, type ContextMenuItemDef } from './ContextMenu';
import type { ResourceNodeData } from '../../types';

const nodeTypes = {
  resourceNode: ResourceNode,
  resourceGroupNode: ResourceGroupNode,
};

const edgeTypes = {
  custom: EdgeWithMenu,
};

const defaultEdgeOptions = {
  type: 'custom' as const,
};

interface ContextMenuState {
  x: number;
  y: number;
  items: ContextMenuItemDef[];
}

function FlowCanvasInner() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, removeResourceNode, removeEdge } = useCanvasStore();
  const { theme } = useAppStore();
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const reactFlowInstance = useReactFlow();

  const handleNodeDragStop = useCallback(
    (_event: ReactMouseEvent, node: Node) => {
      if (node.type !== 'resourceNode' || !node.parentId) return;

      // Get the parent RG node
      const parentNode = reactFlowInstance.getNode(node.parentId);
      if (!parentNode) return;

      const parentWidth = (parentNode.style?.width as number) ?? 600;
      const parentHeight = (parentNode.style?.height as number) ?? 450;

      // Check if node is outside parent bounds
      const nodeX = node.position.x;
      const nodeY = node.position.y;
      const isOutside = nodeX < -20 || nodeY < -20 || nodeX > parentWidth + 20 || nodeY > parentHeight + 20;

      if (isOutside) {
        // Remove parent assignment - make it a free-floating node
        const absPos = {
          x: parentNode.position.x + nodeX,
          y: parentNode.position.y + nodeY,
        };

        useCanvasStore.getState().setNodes(
          useCanvasStore.getState().nodes.map(n =>
            n.id === node.id
              ? { ...n, parentId: undefined, extent: undefined, position: absPos }
              : n
          )
        );

        // Update resource store to remove RG assignment
        const data = node.data as ResourceNodeData;
        if (data.instanceId) {
          useResourceStore.getState().updateResourceRG(data.instanceId, '');
        }

        toast.info(`${data.label} removed from resource group`);
      }
    },
    [reactFlowInstance],
  );

  const handlePaneContextMenu = useCallback(
    (event: ReactMouseEvent | MouseEvent) => {
      event.preventDefault();
      const e = event as MouseEvent;
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        items: [
          {
            label: 'Add Resource Group',
            icon: 'Folder',
            onClick: () => {
              // Trigger via toolbar dialog - dispatch custom event
              window.dispatchEvent(new CustomEvent('open-add-rg-dialog'));
            },
          },
        ],
      });
    },
    [],
  );

  const handleNodeContextMenu = useCallback(
    (event: ReactMouseEvent, node: Node) => {
      event.preventDefault();
      const e = event as unknown as MouseEvent;
      const data = node.data as ResourceNodeData;

      const items: ContextMenuItemDef[] = [];

      if (node.type === 'resourceNode') {
        items.push(
          {
            label: 'View Docs',
            icon: 'FileText',
            onClick: () => {
              window.open(`https://learn.microsoft.com/azure/${data.category}`, '_blank');
            },
          },
          { label: '', onClick: () => {}, divider: true },
          {
            label: 'Delete Resource',
            icon: 'Trash2',
            onClick: () => removeResourceNode(node.id),
            danger: true,
          },
        );
      } else if (node.type === 'resourceGroupNode') {
        items.push({
          label: 'Delete Resource Group',
          icon: 'Trash2',
          onClick: () => {
            const rgData = node.data as { rgId?: string };
            if (rgData.rgId) {
              useCanvasStore.getState().removeResourceGroupNode(rgData.rgId);
            }
          },
          danger: true,
        });
      }

      setContextMenu({ x: e.clientX, y: e.clientY, items });
    },
    [removeResourceNode],
  );

  const handleEdgeContextMenu = useCallback(
    (event: ReactMouseEvent, edge: Edge) => {
      event.preventDefault();
      const e = event as unknown as MouseEvent;
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        items: [
          {
            label: 'Delete Connection',
            icon: 'Trash2',
            onClick: () => removeEdge(edge.id),
            danger: true,
          },
        ],
      });
    },
    [removeEdge],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const selectedNodes = nodes.filter((n) => n.selected);
        for (const node of selectedNodes) {
          removeResourceNode(node.id);
        }
        const selectedEdges = edges.filter((e) => e.selected);
        for (const edge of selectedEdges) {
          removeEdge(edge.id);
        }
      }
    },
    [nodes, edges, removeResourceNode, removeEdge],
  );

  const minimapNodeColor = useMemo(() => {
    return (node: Node) => {
      if (node.type === 'resourceGroupNode') {
        return (node.data as { color?: string }).color ?? '#0078d4';
      }
      return theme === 'dark' ? '#52525b' : '#a1a1aa';
    };
  }, [theme]);

  return (
    <div className="h-full w-full" onKeyDown={handleKeyDown} tabIndex={0}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        onPaneContextMenu={handlePaneContextMenu}
        onNodeContextMenu={handleNodeContextMenu}
        onEdgeContextMenu={handleEdgeContextMenu}
        onNodeDragStop={handleNodeDragStop}
        fitView
        deleteKeyCode={null}
        className="bg-zinc-50 dark:bg-zinc-950"
      >
        <Controls
          position="bottom-left"
          className="!border-zinc-200 !bg-white !shadow-md dark:!border-zinc-700 dark:!bg-zinc-800 [&>button]:!border-zinc-200 [&>button]:!bg-white dark:[&>button]:!border-zinc-700 dark:[&>button]:!bg-zinc-800 dark:[&>button]:!fill-zinc-400"
        />
        <MiniMap
          position="bottom-right"
          nodeColor={minimapNodeColor}
          maskColor={theme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(240,240,240,0.7)'}
          className="!border-zinc-200 !bg-white dark:!border-zinc-700 dark:!bg-zinc-900"
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color={theme === 'dark' ? '#27272a' : '#e4e4e7'}
        />
        {nodes.length === 0 && (
          <Panel position="top-center" className="pointer-events-none mt-20">
            <div className="text-center">
              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                Select resources from the sidebar to get started
              </p>
              <p className="mt-1 text-xs text-zinc-300 dark:text-zinc-600">
                Right-click the canvas to add a resource group
              </p>
            </div>
          </Panel>
        )}
      </ReactFlow>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}

export function FlowCanvas() {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner />
    </ReactFlowProvider>
  );
}
