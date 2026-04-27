import { useMemo } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useResourceStore } from '../../store/useResourceStore';
import { useCanvasStore } from '../../store/useCanvasStore';
import { validateArchitecture, type ValidationIssue } from '../../data/validationRules';

const severityIcon: Record<ValidationIssue['severity'], typeof AlertCircle> = {
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const severityColor: Record<ValidationIssue['severity'], string> = {
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

interface ValidationPanelProps {
  open: boolean;
  onToggle: () => void;
}

export function ValidationPanel({ open, onToggle }: ValidationPanelProps) {
  const selectedResources = useResourceStore((s) => s.selectedResources);
  const resourceGroups = useResourceStore((s) => s.resourceGroups);
  const edges = useCanvasStore((s) => s.edges);

  const issues = useMemo(() => {
    const resources = Array.from(selectedResources.values());
    const edgePairs = edges.map((e) => ({ source: e.source, target: e.target }));
    return validateArchitecture(resources, resourceGroups, edgePairs);
  }, [selectedResources, resourceGroups, edges]);

  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;
  const infoCount = issues.filter((i) => i.severity === 'info').length;

  return (
    <div className="border-t border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      {/* Header — always visible */}
      <button
        onClick={onToggle}
        className="flex h-8 w-full items-center justify-between px-4 text-xs font-medium text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span>Problems</span>
          {issues.length > 0 && (
            <span className="rounded-full bg-zinc-200 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
              {issues.length}
            </span>
          )}
          {errorCount > 0 && (
            <span className="flex items-center gap-0.5 text-red-500">
              <AlertCircle size={12} /> {errorCount}
            </span>
          )}
          {warningCount > 0 && (
            <span className="flex items-center gap-0.5 text-yellow-500">
              <AlertTriangle size={12} /> {warningCount}
            </span>
          )}
          {infoCount > 0 && (
            <span className="flex items-center gap-0.5 text-blue-500">
              <Info size={12} /> {infoCount}
            </span>
          )}
        </div>
        {open ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>

      {/* Issue list */}
      {open && (
        <div className="max-h-48 overflow-y-auto border-t border-zinc-100 dark:border-zinc-800">
          {issues.length === 0 ? (
            <p className="px-4 py-3 text-xs text-zinc-400 dark:text-zinc-500">
              No problems detected.
            </p>
          ) : (
            <ul>
              {issues.map((issue) => {
                const Icon = severityIcon[issue.severity];
                return (
                  <li
                    key={issue.id}
                    className="flex items-start gap-2 px-4 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    <Icon size={14} className={`mt-0.5 flex-shrink-0 ${severityColor[issue.severity]}`} />
                    <span className="leading-relaxed">{issue.message}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
