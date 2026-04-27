import { Cloud, Plus, Upload, Download, Wand2, PanelLeftClose, PanelRightClose, LayoutGrid, LayoutTemplate, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import { useAppStore } from '../../store/useAppStore';
import { ThemeToggle } from './ThemeToggle';
import type { CodeLanguage } from '../../types';

interface ToolbarProps {
  onAddResourceGroup?: () => void;
  onImport?: () => void;
  onExport?: () => void;
  onOptimize?: () => void;
  onAutoLayout?: () => void;
  onTemplates?: () => void;
  onToggleProblems?: () => void;
}

export function Toolbar({ onAddResourceGroup, onImport, onExport, onOptimize, onAutoLayout, onTemplates, onToggleProblems }: ToolbarProps) {
  const { codeLanguage, setCodeLanguage, toggleSidebar, toggleCodePanel, sidebarOpen, codePanelOpen } = useAppStore();

  const languages: { value: CodeLanguage; label: string }[] = [
    { value: 'bicep', label: 'Bicep' },
    { value: 'terraform', label: 'Terraform' },
  ];

  return (
    <div className="flex h-12 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-700 dark:bg-zinc-900">
      {/* Left: App title */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          className="mr-1 flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
          title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          <PanelLeftClose size={18} />
        </button>
        <Cloud size={20} className="text-[#0078d4]" />
        <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Azure Click to Build</span>
        <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">BETA</span>
      </div>

      {/* Center: Language toggle */}
      <div className="flex items-center rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-800">
        {languages.map((lang) => (
          <button
            key={lang.value}
            onClick={() => setCodeLanguage(lang.value)}
            className={clsx(
              'rounded-md px-3 py-1 text-xs font-medium transition-all',
              codeLanguage === lang.value
                ? 'bg-[#0078d4] text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200',
            )}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Right: Action buttons */}
      <div className="flex items-center gap-1">
        <ToolbarButton icon={LayoutTemplate} label="Templates" onClick={onTemplates} />
        <ToolbarButton icon={Plus} label="Add Resource Group" onClick={onAddResourceGroup} />
        <ToolbarButton icon={Upload} label="Import" onClick={onImport} />
        <ToolbarButton icon={Download} label="Export" onClick={onExport} />
        <ToolbarButton icon={Wand2} label="Optimize" onClick={onOptimize} />
        <ToolbarButton icon={AlertTriangle} label="Problems" onClick={onToggleProblems} />
        <ToolbarButton icon={LayoutGrid} label="Auto Layout" onClick={onAutoLayout} />
        <div className="mx-1 h-5 w-px bg-zinc-200 dark:bg-zinc-700" />
        <ThemeToggle />
        <button
          onClick={toggleCodePanel}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
          title={codePanelOpen ? 'Hide code panel' : 'Show code panel'}
        >
          <PanelRightClose size={18} />
        </button>
      </div>
    </div>
  );
}

function ToolbarButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
      title={label}
    >
      <Icon size={16} />
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}
