import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';
import { useResourceStore } from '../../store/useResourceStore';
import { useCanvasStore } from '../../store/useCanvasStore';

const AZURE_REGIONS = [
  'eastus',
  'eastus2',
  'westus',
  'westus2',
  'westus3',
  'centralus',
  'northcentralus',
  'southcentralus',
  'westeurope',
  'northeurope',
  'uksouth',
  'ukwest',
  'francecentral',
  'germanywestcentral',
  'swedencentral',
  'australiaeast',
  'southeastasia',
  'eastasia',
  'japaneast',
  'koreacentral',
  'canadacentral',
  'brazilsouth',
  'southafricanorth',
  'uaenorth',
];

const PRESET_COLORS = [
  '#0078d4',
  '#107c10',
  '#e97400',
  '#d13438',
  '#8661c5',
  '#c239b3',
  '#00a36c',
  '#ffb900',
  '#0063b1',
  '#767676',
];

interface AddResourceGroupDialogProps {
  onClose: () => void;
}

export function AddResourceGroupDialog({ onClose }: AddResourceGroupDialogProps) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('eastus');
  const [color, setColor] = useState('#0078d4');
  const [error, setError] = useState('');

  const addResourceGroup = useResourceStore((s) => s.addResourceGroup);
  const addResourceGroupNode = useCanvasStore((s) => s.addResourceGroupNode);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Name is required');
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      setError('Name must contain only alphanumeric characters, hyphens, or underscores');
      return;
    }

    const rgId = addResourceGroup(trimmed, location);
    addResourceGroupNode(rgId, trimmed, color);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Dialog */}
      <div className="relative z-10 w-[420px] rounded-xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Add Resource Group</h2>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="rg-my-project"
              className={clsx(
                'h-9 w-full rounded-lg border px-3 text-sm outline-none transition-colors',
                error
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-zinc-200 focus:border-[#0078d4] dark:border-zinc-600 dark:focus:border-[#0078d4]',
                'bg-white text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200',
              )}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none focus:border-[#0078d4] dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:focus:border-[#0078d4]"
            >
              {AZURE_REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">Color</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={clsx(
                    'h-7 w-7 rounded-full border-2 transition-transform',
                    color === c ? 'scale-110 border-zinc-800 dark:border-white' : 'border-transparent hover:scale-105',
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="h-8 rounded-lg px-4 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="h-8 rounded-lg bg-[#0078d4] px-4 text-xs font-medium text-white hover:bg-[#006cbe] transition-colors"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
