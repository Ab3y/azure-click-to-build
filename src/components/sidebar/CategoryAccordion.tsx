import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { getIcon } from '../../utils/iconMap';
import { ResourceCheckbox } from './ResourceCheckbox';
import { useResourceStore } from '../../store/useResourceStore';
import type { AzureCategory } from '../../types';

interface CategoryAccordionProps {
  category: AzureCategory;
  searchFilter: string;
}

export function CategoryAccordion({ category, searchFilter }: CategoryAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { resourceGroups, isResourceTypeSelected } = useResourceStore();
  const activeResourceGroupId = resourceGroups[0]?.id ?? '';

  const filteredResources = useMemo(() => {
    if (!searchFilter) return category.resources;
    const lower = searchFilter.toLowerCase();
    return category.resources.filter(
      (r) => r.name.toLowerCase().includes(lower) || r.description?.toLowerCase().includes(lower),
    );
  }, [category.resources, searchFilter]);

  const selectedCount = useMemo(() => {
    return category.resources.filter((r) => isResourceTypeSelected(r.id)).length;
  }, [category.resources, isResourceTypeSelected]);

  if (filteredResources.length === 0) return null;

  const Icon = getIcon(category.icon);

  return (
    <div className="border-b border-zinc-100 dark:border-zinc-800">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex h-9 w-full items-center gap-2 px-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
      >
        <motion.span
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.15 }}
          className="flex-shrink-0"
        >
          <ChevronRight size={14} className="text-zinc-400" />
        </motion.span>
        <Icon size={14} className="flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
        <span className="flex-1 text-xs font-medium text-zinc-700 dark:text-zinc-300">{category.name}</span>
        {selectedCount > 0 && (
          <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#0078d4] px-1 text-[10px] font-medium text-white">
            {selectedCount}
          </span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className={clsx('pb-1 pl-3')}>
              {filteredResources.map((resource) => (
                <ResourceCheckbox
                  key={resource.id}
                  resource={resource}
                  isChecked={isResourceTypeSelected(resource.id)}
                  onToggle={() => {}}
                  resourceGroups={resourceGroups}
                  activeResourceGroupId={activeResourceGroupId}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
