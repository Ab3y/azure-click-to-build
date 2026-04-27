import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Upload, FileText, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';
import { useCanvasStore } from '../../store/useCanvasStore';
import { useResourceStore } from '../../store/useResourceStore';
import { useAppStore } from '../../store/useAppStore';
import type { ProjectState } from '../../types';

interface ImportDialogProps {
  onClose: () => void;
}

export function ImportDialog({ onClose }: ImportDialogProps) {
  const [pastedCode, setPastedCode] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState<'json' | 'bicep' | 'tf' | null>(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { replaceAll: replaceCanvas } = useCanvasStore();
  const { replaceAll: replaceResources } = useResourceStore();
  const { setCodeLanguage } = useAppStore();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const processFile = useCallback((file: File) => {
    setFileName(file.name);
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'json') {
      setFileType('json');
    } else if (ext === 'bicep') {
      setFileType('bicep');
    } else if (ext === 'tf') {
      setFileType('tf');
    } else {
      setError('Unsupported file type. Please use .json, .bicep, or .tf files.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPastedCode(e.target?.result as string ?? '');
      setError('');
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleImport = useCallback(() => {
    if (!pastedCode.trim()) {
      setError('Please provide code or drop a file');
      return;
    }

    // Detect type from content if not from file
    const effectiveType = fileType ?? (pastedCode.trim().startsWith('{') ? 'json' : null);

    if (effectiveType === 'bicep' || effectiveType === 'tf') {
      toast.info('Script import coming soon! JSON project state import is available now.');
      return;
    }

    try {
      const state = JSON.parse(pastedCode) as ProjectState;

      if (state.resources && state.resourceGroups) {
        replaceResources(state.resources, state.resourceGroups);
      }
      if (state.nodes || state.edges) {
        replaceCanvas(state.nodes ?? [], state.edges ?? []);
      }
      if (state.codeLanguage) {
        setCodeLanguage(state.codeLanguage);
      }

      toast.success('Project imported successfully');
      onClose();
    } catch {
      setError('Invalid JSON. Please check the format and try again.');
      toast.error('Failed to import project');
    }
  }, [pastedCode, fileType, replaceCanvas, replaceResources, setCodeLanguage, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-10 w-[520px] rounded-xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Import Project</h2>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
          >
            <X size={16} />
          </button>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={clsx(
            'mt-4 flex h-28 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors',
            isDragging
              ? 'border-[#0078d4] bg-[#0078d4]/5'
              : 'border-zinc-300 hover:border-zinc-400 dark:border-zinc-600 dark:hover:border-zinc-500',
          )}
        >
          {fileName ? (
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-[#0078d4]" />
              <span className="text-xs text-zinc-600 dark:text-zinc-300">{fileName}</span>
            </div>
          ) : (
            <>
              <Upload size={20} className="text-zinc-400" />
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Drop a file here or click to browse
              </p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500">.json, .bicep, .tf</p>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.bicep,.tf"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Divider */}
        <div className="my-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
          <span className="text-[10px] text-zinc-400">or paste code</span>
          <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
        </div>

        {/* Textarea */}
        <textarea
          value={pastedCode}
          onChange={(e) => {
            setPastedCode(e.target.value);
            setError('');
            setFileType(null);
            setFileName('');
          }}
          placeholder="Paste JSON project state..."
          className="h-32 w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs text-zinc-700 outline-none focus:border-[#0078d4] dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300 dark:focus:border-[#0078d4]"
        />

        {/* Error */}
        {error && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-red-500">
            <AlertCircle size={12} />
            {error}
          </div>
        )}

        {/* Note about bicep/tf */}
        {(fileType === 'bicep' || fileType === 'tf') && (
          <div className="mt-2 flex items-center gap-1.5 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
            <AlertCircle size={12} />
            Script import coming soon. Only JSON project state is currently supported.
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="h-8 rounded-lg px-4 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            className="h-8 rounded-lg bg-[#0078d4] px-4 text-xs font-medium text-white hover:bg-[#006cbe] transition-colors"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}
