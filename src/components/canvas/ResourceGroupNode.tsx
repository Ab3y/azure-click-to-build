import { memo, useCallback, type MouseEvent as ReactMouseEvent } from 'react';
import { type NodeProps, useReactFlow } from '@xyflow/react';
import type { ResourceGroupNodeData } from '../../types';

function ResourceGroupNodeComponent({ data, id }: NodeProps) {
  const nodeData = data as ResourceGroupNodeData;
  const color = nodeData.color ?? '#0078d4';
  const reactFlow = useReactFlow();

  const handleResize = useCallback(
    (e: ReactMouseEvent) => {
      e.stopPropagation();
      const startX = e.clientX;
      const startY = e.clientY;
      const node = reactFlow.getNode(id);
      const startW = (node?.style?.width as number) ?? 600;
      const startH = (node?.style?.height as number) ?? 450;

      const onMouseMove = (ev: globalThis.MouseEvent) => {
        const zoom = reactFlow.getZoom();
        const dw = (ev.clientX - startX) / zoom;
        const dh = (ev.clientY - startY) / zoom;
        const newW = Math.max(300, startW + dw);
        const newH = Math.max(200, startH + dh);
        reactFlow.setNodes((nodes) =>
          nodes.map((n) =>
            n.id === id
              ? { ...n, style: { ...n.style, width: newW, height: newH } }
              : n
          )
        );
      };
      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [id, reactFlow],
  );

  return (
    <div
      className="h-full w-full rounded-xl relative"
      style={{
        border: `2px dashed ${color}`,
        backgroundColor: `${color}08`,
      }}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-xs font-semibold" style={{ color }}>{nodeData.label}</span>
        <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{nodeData.location}</span>
      </div>

      {/* Resize handle bottom-right corner */}
      <div
        onMouseDown={handleResize}
        className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize"
        style={{
          background: `linear-gradient(135deg, transparent 50%, ${color}40 50%)`,
          borderRadius: '0 0 10px 0',
        }}
      />
    </div>
  );
}

export const ResourceGroupNode = memo(ResourceGroupNodeComponent);
