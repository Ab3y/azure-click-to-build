import { useState, useCallback } from 'react';
import { FolderOpen } from 'lucide-react';
import { SearchFilter } from './SearchFilter';
import { CategoryAccordion } from './CategoryAccordion';
import { useResourceStore } from '../../store/useResourceStore';
import { azureCategories } from '../../data/azureResources';

export function ResourceSidebar() {
  const [searchFilter, setSearchFilter] = useState('');
  const [activeRgId, setActiveRgId] = useState('rg-default');
  const { resourceGroups } = useResourceStore();

  const handleFilterChange = useCallback((filter: string) => {
    setSearchFilter(filter);
  }, []);

  const activeRg = resourceGroups.find((rg) => rg.id === activeRgId) ?? resourceGroups[0];

  return (
    <div className="flex h-full flex-col">
      {/* Search */}
      <SearchFilter onFilterChange={handleFilterChange} />

      {/* Resource group selector */}
      <div className="border-b border-zinc-100 px-3 pb-2 dark:border-zinc-800">
        <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Target Resource Group
        </label>
        <select
          value={activeRgId}
          onChange={(e) => setActiveRgId(e.target.value)}
          className="h-7 w-full rounded border border-zinc-200 bg-zinc-50 px-2 text-xs text-zinc-700 outline-none focus:border-[#0078d4] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
        >
          {resourceGroups.map((rg) => (
            <option key={rg.id} value={rg.id}>
              {rg.name} ({rg.location})
            </option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto">
        {azureCategories.map((category) => (
          <CategoryAccordion key={category.id} category={category} searchFilter={searchFilter} />
        ))}
      </div>

      {/* Active RG indicator */}
      {activeRg && (
        <div className="flex items-center gap-2 border-t border-zinc-100 px-3 py-2 dark:border-zinc-800">
          <FolderOpen size={12} className="text-zinc-400" />
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Active RG:{' '}
            <span className="font-medium" style={{ color: activeRg.color }}>
              {activeRg.name}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
