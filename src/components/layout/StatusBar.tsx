import { useAppStore } from '../../store/useAppStore';
import { useResourceStore } from '../../store/useResourceStore';

export function StatusBar() {
  const { codeLanguage } = useAppStore();
  const { selectedResources, resourceGroups } = useResourceStore();

  const resourceCount = selectedResources.size;
  const rgCount = resourceGroups.length;

  return (
    <div className="flex h-6 items-center justify-between border-t border-zinc-200 bg-white px-3 text-[11px] dark:border-zinc-700 dark:bg-zinc-900">
      {/* Left */}
      <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
        <span>{resourceCount} resource{resourceCount !== 1 ? 's' : ''}</span>
        <span>{rgCount} resource group{rgCount !== 1 ? 's' : ''}</span>
      </div>

      {/* Center */}
      <div>
        <span className="rounded bg-[#0078d4]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#0078d4]">
          {codeLanguage === 'bicep' ? 'Bicep' : 'Terraform'}
        </span>
      </div>

      {/* Right */}
      <span className="text-zinc-400 dark:text-zinc-500">Azure Click to Build v0.1-beta <span className="text-amber-500">(beta)</span></span>
    </div>
  );
}
