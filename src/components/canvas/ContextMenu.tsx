import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { getIcon } from '../../utils/iconMap';

export interface ContextMenuItemDef {
  label: string;
  icon?: string;
  onClick: () => void;
  danger?: boolean;
  divider?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItemDef[];
  onClose: () => void;
}

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as HTMLElement)) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="context-menu-animate fixed z-50 min-w-[160px] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
      style={{ left: x, top: y }}
    >
      {items.map((item, i) => {
        if (item.divider) {
          return <div key={i} className="my-1 h-px bg-zinc-100 dark:bg-zinc-700" />;
        }

        const Icon = item.icon ? getIcon(item.icon) : null;

        return (
          <button
            key={i}
            onClick={() => {
              item.onClick();
              onClose();
            }}
            className={clsx(
              'flex w-full items-center gap-2 px-3 py-1.5 text-xs transition-colors',
              item.danger
                ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
                : 'text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-700/50',
            )}
          >
            {Icon && <Icon size={14} />}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
