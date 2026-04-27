import { useState } from 'react';
import {
  getBezierPath,
  BaseEdge,
  EdgeLabelRenderer,
  type EdgeProps,
} from '@xyflow/react';
import { Plus } from 'lucide-react';

export function EdgeWithMenu({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      {/* Invisible wider path for hover detection */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: isHovered ? 2.5 : 1.5,
          stroke: isHovered ? '#0078d4' : undefined,
          transition: 'stroke-width 0.15s, stroke 0.15s',
        }}
        id={id}
      />
      {isHovered && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan pointer-events-auto absolute"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <button
              className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-500 shadow-sm hover:border-[#0078d4] hover:text-[#0078d4] dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-[#0078d4] dark:hover:text-[#0078d4] transition-colors"
              title="Add resource"
            >
              <Plus size={12} />
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
