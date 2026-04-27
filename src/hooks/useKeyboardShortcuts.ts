import { useEffect } from 'react';
import { toast } from 'sonner';
import { useAppStore } from '../store/useAppStore';
import { useResourceStore } from '../store/useResourceStore';
import { useCanvasStore } from '../store/useCanvasStore';
import { generateBicep } from '../generators/bicepGenerator';
import { generateTerraform } from '../generators/terraformGenerator';

export function useKeyboardShortcuts() {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;

      // Ctrl+S / Cmd+S — export code file
      if (mod && e.key === 's') {
        e.preventDefault();
        const { codeLanguage } = useAppStore.getState();
        const { selectedResources, resourceGroups } = useResourceStore.getState();
        const { edges } = useCanvasStore.getState();
        const resources = Array.from(selectedResources.values());
        const edgeList = edges.map((edge) => ({ source: edge.source, target: edge.target }));

        const code =
          codeLanguage === 'bicep'
            ? generateBicep(resources, resourceGroups, edgeList)
            : generateTerraform(resources, resourceGroups, edgeList);

        const ext = codeLanguage === 'bicep' ? '.bicep' : '.tf';
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `main${ext}`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(`Downloaded main${ext}`);
        return;
      }

      // Ctrl+Z / Cmd+Z — undo placeholder
      if (mod && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        toast.info('Undo coming soon');
        return;
      }

      // Ctrl+Shift+Z / Cmd+Shift+Z — redo placeholder
      if (mod && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        toast.info('Redo coming soon');
        return;
      }

      // Ctrl+K / Cmd+K — command palette placeholder
      if (mod && e.key === 'k') {
        e.preventDefault();
        toast.info('Command palette coming soon');
        return;
      }

      // Escape — close dialogs by dispatching custom event
      if (e.key === 'Escape') {
        window.dispatchEvent(new CustomEvent('close-dialogs'));
        return;
      }
    }

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);
}
