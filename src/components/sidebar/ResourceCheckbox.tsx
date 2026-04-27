import { useState, useRef } from 'react';
import clsx from 'clsx';
import { ExternalLink } from 'lucide-react';
import { getIcon } from '../../utils/iconMap';
import type { AzureResourceDefinition, ResourceGroup } from '../../types';
import { useResourceStore } from '../../store/useResourceStore';
import { useCanvasStore } from '../../store/useCanvasStore';

interface ResourceCheckboxProps {
  resource: AzureResourceDefinition;
  isChecked: boolean;
  onToggle: (resource: AzureResourceDefinition) => void;
  resourceGroups: ResourceGroup[];
  activeResourceGroupId: string;
}

export function ResourceCheckbox({
  resource,
  isChecked,
  resourceGroups,
  activeResourceGroupId,
}: ResourceCheckboxProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const Icon = getIcon(resource.icon);

  const { addResource, removeResource, selectedResources } = useResourceStore();
  const { addResourceNode, removeResourceNode } = useCanvasStore();

  const activeRg = resourceGroups.find((rg) => rg.id === activeResourceGroupId);

  const handleToggle = () => {
    if (isChecked) {
      const instance = Array.from(selectedResources.values()).find(
        (r) => r.resourceId === resource.id,
      );
      if (instance) {
        removeResource(instance.instanceId);
        removeResourceNode(instance.instanceId);
      }
    } else {
      const instanceId = addResource(resource.id, activeResourceGroupId);
      addResourceNode(instanceId, resource.id, activeResourceGroupId);
    }
  };

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setShowTooltip(true), 400);
  };
  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    setShowTooltip(false);
  };

  const docsUrl = `https://learn.microsoft.com/azure/${resource.category}`;

  return (
    <div
      className="group relative flex h-9 items-center gap-2 rounded-md px-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleToggle}
        className="h-3.5 w-3.5 rounded border-zinc-300 text-[#0078d4] accent-[#0078d4] dark:border-zinc-600"
      />
      <Icon size={14} className="flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
      <span className="flex-1 truncate text-xs text-zinc-700 dark:text-zinc-300">{resource.name}</span>

      {isChecked && activeRg && (
        <span
          className="rounded px-1 py-0.5 text-[10px] font-medium text-white"
          style={{ backgroundColor: activeRg.color }}
        >
          {activeRg.name.slice(0, 8)}
        </span>
      )}

      <a
        href={docsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        title="View docs"
      >
        <ExternalLink size={12} className="text-zinc-400 hover:text-[#0078d4]" />
      </a>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-4 z-50 mb-2 w-56 rounded-lg border border-zinc-200 bg-white p-3 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
          <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">{resource.name}</p>
          <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">{resource.description}</p>
          <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500">Type: {resource.bicepType}</p>
          <a
            href={docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
              'mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-[#0078d4] hover:underline',
            )}
          >
            View docs →
          </a>
        </div>
      )}
    </div>
  );
}
