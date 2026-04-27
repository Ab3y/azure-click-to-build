import { useMemo, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Copy, Download, Code2, PackageOpen } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../store/useAppStore';
import { useResourceStore } from '../../store/useResourceStore';
import { useCanvasStore } from '../../store/useCanvasStore';
import { generateBicep } from '../../generators/bicepGenerator';
import { generateTerraform } from '../../generators/terraformGenerator';
import type { CanvasResource, ProjectState } from '../../types';

export function CodePanel() {
  const { theme, codeLanguage } = useAppStore();
  const { resourceGroups, selectedResources } = useResourceStore();
  const { nodes, edges } = useCanvasStore();

  const canvasResources: CanvasResource[] = useMemo(() => {
    return Array.from(selectedResources.values());
  }, [selectedResources]);

  const edgeList = useMemo(
    () => edges.map((e) => ({ source: e.source, target: e.target })),
    [edges],
  );

  const code = useMemo(() => {
    if (canvasResources.length === 0 && resourceGroups.length <= 1) {
      return codeLanguage === 'bicep'
        ? '// Select resources from the sidebar to generate Bicep code'
        : '# Select resources from the sidebar to generate Terraform code';
    }

    try {
      if (codeLanguage === 'bicep') {
        return generateBicep(canvasResources, resourceGroups, edgeList, nodes);
      }
      return generateTerraform(canvasResources, resourceGroups, edgeList, nodes);
    } catch {
      return `// Error generating ${codeLanguage} code`;
    }
  }, [canvasResources, resourceGroups, edgeList, codeLanguage, nodes]);

  const monacoLanguage = codeLanguage === 'bicep' ? 'plaintext' : 'hcl';
  const fileExtension = codeLanguage === 'bicep' ? '.bicep' : '.tf';

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success('Code copied to clipboard');
    });
  }, [code]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `main${fileExtension}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded main${fileExtension}`);
  }, [code, fileExtension]);

  const handleExportProject = useCallback(() => {
    const { nodes, edges: canvasEdges } = useCanvasStore.getState();
    const state: ProjectState = {
      resources: canvasResources,
      resourceGroups,
      nodes,
      edges: canvasEdges,
      codeLanguage,
    };
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'azure-architecture.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported azure-architecture.json');
  }, [canvasResources, resourceGroups, codeLanguage]);

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="flex h-9 items-center justify-between border-b border-zinc-200 px-3 dark:border-zinc-700">
        <div className="flex items-center gap-1.5">
          <Code2 size={14} className="text-zinc-400" />
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
            {codeLanguage === 'bicep' ? 'Bicep' : 'Terraform'}
          </span>
          <span className="text-[10px] text-zinc-400">
            main{fileExtension}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300 transition-colors"
            title="Copy to clipboard"
          >
            <Copy size={13} />
          </button>
          <button
            onClick={handleDownload}
            className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300 transition-colors"
            title="Download file"
          >
            <Download size={13} />
          </button>
          <button
            onClick={handleExportProject}
            className="flex h-6 items-center gap-1 rounded px-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300 transition-colors"
            title="Export Project JSON"
          >
            <PackageOpen size={13} />
            <span className="text-[10px]">Export</span>
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          language={monacoLanguage}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          value={code}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 12,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            padding: { top: 8, bottom: 8 },
            renderLineHighlight: 'none',
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
          }}
        />
      </div>
    </div>
  );
}
