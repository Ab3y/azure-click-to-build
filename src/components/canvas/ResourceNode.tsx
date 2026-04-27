import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import clsx from 'clsx';
import { getIcon } from '../../utils/iconMap';
import type { ResourceNodeData } from '../../types';

const categoryColors: Record<string, string> = {
  compute: '#0078d4',
  networking: '#00a36c',
  storage: '#e97400',
  databases: '#8661c5',
  security: '#d13438',
  monitoring: '#107c10',
  containers: '#0063b1',
  messaging: '#c239b3',
  ai: '#ffb900',
};

function ResourceNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as ResourceNodeData;
  const Icon = getIcon(nodeData.icon);
  const barColor = categoryColors[nodeData.category] ?? '#0078d4';

  return (
    <div
      className={clsx(
        'w-48 rounded-lg border bg-white shadow-sm transition-shadow dark:bg-zinc-800',
        selected
          ? 'border-[#0078d4] shadow-[0_0_0_2px_rgba(0,120,212,0.3)]'
          : 'border-zinc-200 dark:border-zinc-700',
      )}
    >
      {/* Category color bar */}
      <div className="h-0.5 rounded-t-lg" style={{ backgroundColor: barColor }} />

      <div className="flex items-start gap-2.5 p-2.5">
        <div
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md"
          style={{ backgroundColor: `${barColor}15` }}
        >
          <Icon size={16} style={{ color: barColor }} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-zinc-800 dark:text-zinc-100">{nodeData.label}</p>
          <p className="truncate text-[10px] text-zinc-400 dark:text-zinc-500">{nodeData.bicepType}</p>
        </div>
      </div>

      {/* RG badge */}
      {nodeData.resourceGroupId && (
        <div className="border-t border-zinc-100 px-2.5 py-1 dark:border-zinc-700">
          <span className="inline-flex items-center rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
            RG: {nodeData.resourceGroupId.replace('rg-', '').slice(0, 12)}
          </span>
        </div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !border-2 !border-white !bg-zinc-400 dark:!border-zinc-800"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !border-2 !border-white !bg-zinc-400 dark:!border-zinc-800"
      />
    </div>
  );
}

export const ResourceNode = memo(ResourceNodeComponent);
