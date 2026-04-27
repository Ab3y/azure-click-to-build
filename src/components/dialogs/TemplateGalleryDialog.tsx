import { useEffect, useCallback } from 'react';
import {
  X,
  Layers,
  Network,
  Zap,
  Database,
  Brain,
  Shield,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { architectureTemplates, type ArchitectureTemplate } from '../../data/templates';
import { useResourceStore } from '../../store/useResourceStore';
import { useCanvasStore } from '../../store/useCanvasStore';
import { allResources } from '../../data/azureResources';
import type { CanvasResource, ResourceGroup } from '../../types';

const iconMap: Record<string, LucideIcon> = {
  Layers,
  Network,
  Zap,
  Database,
  Brain,
  Shield,
};

interface TemplateGalleryDialogProps {
  onClose: () => void;
}

export function TemplateGalleryDialog({ onClose }: TemplateGalleryDialogProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const replaceResources = useResourceStore((s) => s.replaceAll);
  const replaceCanvas = useCanvasStore((s) => s.replaceAll);
  const addResourceNode = useCanvasStore((s) => s.addResourceNode);
  const addResourceGroupNode = useCanvasStore((s) => s.addResourceGroupNode);
  const addEdge = useCanvasStore((s) => s.addEdge);

  const applyTemplate = useCallback(
    (template: ArchitectureTemplate) => {
      const RG_COLORS = [
        '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
        '#8b5cf6', '#ec4899', '#06b6d4', '#f97316',
      ];

      // Build resource groups
      const resourceGroups: ResourceGroup[] = template.resourceGroups.map((rg, i) => ({
        id: `rg-tpl-${i}`,
        name: rg.name,
        location: rg.location,
        color: RG_COLORS[i % RG_COLORS.length],
      }));

      // Build resource instances with stable IDs keyed by template name
      const instanceMap = new Map<string, string>();
      const canvasResources: CanvasResource[] = [];

      for (const tr of template.resources) {
        const definition = allResources.find((r) => r.id === tr.resourceId);
        if (!definition) continue;
        const instanceId = `tpl-${template.id}-${tr.name}`;
        instanceMap.set(tr.name, instanceId);

        canvasResources.push({
          resourceId: tr.resourceId,
          instanceId,
          resourceGroupId: resourceGroups[0].id,
          name: tr.name,
          properties: { ...definition.defaultProperties },
        });
      }

      // Clear canvas and resource store, then populate
      replaceResources(canvasResources, resourceGroups);
      replaceCanvas([], []);

      // Add RG nodes
      for (const rg of resourceGroups) {
        addResourceGroupNode(rg.id, rg.name, rg.color, { x: 30, y: 30 });
      }

      // Add resource nodes with positions relative to the RG parent
      const rgPos = { x: 30, y: 30 };
      for (const tr of template.resources) {
        const instanceId = instanceMap.get(tr.name);
        if (!instanceId) continue;
        // Convert template absolute position to relative-to-parent
        const relativePos = {
          x: tr.position.x - rgPos.x + 20,
          y: tr.position.y - rgPos.y + 40,
        };
        addResourceNode(instanceId, tr.resourceId, resourceGroups[0].id, relativePos);
      }

      // Add edges
      for (const conn of template.connections) {
        const sourceId = instanceMap.get(conn.source);
        const targetId = instanceMap.get(conn.target);
        if (sourceId && targetId) {
          addEdge(sourceId, targetId);
        }
      }

      onClose();
    },
    [replaceResources, replaceCanvas, addResourceNode, addResourceGroupNode, addEdge, onClose],
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Dialog */}
      <div className="relative z-10 w-[720px] max-h-[85vh] overflow-y-auto rounded-xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            Template Gallery
          </h2>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
          >
            <X size={16} />
          </button>
        </div>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Choose a pre-built architecture to get started quickly.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {architectureTemplates.map((template) => {
            const Icon = iconMap[template.icon] ?? Layers;
            return (
              <TemplateCard
                key={template.id}
                template={template}
                Icon={Icon}
                onSelect={() => applyTemplate(template)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  Icon,
  onSelect,
}: {
  template: ArchitectureTemplate;
  Icon: LucideIcon;
  onSelect: () => void;
}) {
  return (
    <div className="flex flex-col rounded-lg border border-zinc-200 bg-zinc-50 p-4 transition-colors hover:border-[#0078d4] hover:bg-blue-50/40 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-[#0078d4] dark:hover:bg-zinc-800">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-[#0078d4]/10 text-[#0078d4]">
        <Icon size={20} />
      </div>
      <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{template.name}</h3>
      <p className="mt-1 flex-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        {template.description}
      </p>
      <button
        onClick={onSelect}
        className="mt-3 h-7 w-full rounded-md bg-[#0078d4] text-xs font-medium text-white hover:bg-[#006cbe] transition-colors"
      >
        Use Template
      </button>
    </div>
  );
}
