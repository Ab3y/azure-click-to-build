import { useEffect } from 'react';
import { X, AlertTriangle, Info } from 'lucide-react';
import type { OptimizationChange } from '../../generators/optimizer';

interface OptimizeDiffDialogProps {
  changes: OptimizationChange[];
  onClose: () => void;
}

export function OptimizeDiffDialog({ changes, onClose }: OptimizeDiffDialogProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-10 w-[520px] max-h-[80vh] flex flex-col rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
          <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            Optimization Results
          </h2>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {changes.length === 0 ? (
            <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 py-6">
              No optimization suggestions — your architecture looks good!
            </p>
          ) : (
            <ul className="space-y-2">
              {changes.map((change, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-lg border border-zinc-100 p-3 dark:border-zinc-700"
                >
                  {change.severity === 'warning' ? (
                    <AlertTriangle size={14} className="mt-0.5 flex-shrink-0 text-amber-500" />
                  ) : (
                    <Info size={14} className="mt-0.5 flex-shrink-0 text-blue-500" />
                  )}
                  <span className="text-xs text-zinc-700 dark:text-zinc-300">
                    {change.description}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-zinc-200 px-4 py-3 dark:border-zinc-700">
          <button
            onClick={onClose}
            className="h-8 rounded-lg bg-[#0078d4] px-4 text-xs font-medium text-white hover:bg-[#006cbe] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
