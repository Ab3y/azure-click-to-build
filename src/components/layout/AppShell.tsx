import { useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { toast } from 'sonner';
import { useAppStore } from '../../store/useAppStore';
import { useResourceStore } from '../../store/useResourceStore';
import { useCanvasStore } from '../../store/useCanvasStore';
import { Toolbar } from './Toolbar';
import { StatusBar } from './StatusBar';
import { ResourceSidebar } from '../sidebar/ResourceSidebar';
import { FlowCanvas } from '../canvas/FlowCanvas';
import { CodePanel } from '../code/CodePanel';
import { AddResourceGroupDialog } from '../dialogs/AddResourceGroupDialog';
import { ImportDialog } from '../dialogs/ImportDialog';
import { OptimizeDiffDialog } from '../dialogs/OptimizeDiffDialog';
import { TemplateGalleryDialog } from '../dialogs/TemplateGalleryDialog';
import { ValidationPanel } from '../panels/ValidationPanel';
import { optimizeArchitecture, type OptimizationChange } from '../../generators/optimizer';
import { autoLayout } from '../../utils/layoutEngine';

export function AppShell() {
  const { sidebarOpen: sidebarVisible, codePanelOpen: codePanelVisible } = useAppStore();
  const [showAddRgDialog, setShowAddRgDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [optimizeChanges, setOptimizeChanges] = useState<OptimizationChange[] | null>(null);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [showProblems, setShowProblems] = useState(false);

  // Listen for close-dialogs event from keyboard shortcuts
  useEffect(() => {
    const handler = () => {
      setShowAddRgDialog(false);
      setShowImportDialog(false);
      setOptimizeChanges(null);
      setShowTemplateGallery(false);
    };
    window.addEventListener('close-dialogs', handler);
    return () => window.removeEventListener('close-dialogs', handler);
  }, []);

  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [codePanelWidth, setCodePanelWidth] = useState(420);

  const handleSidebarResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const onMouseMove = (ev: MouseEvent) => {
      const delta = ev.clientX - startX;
      setSidebarWidth(Math.max(240, Math.min(500, startWidth + delta)));
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [sidebarWidth]);

  const handleCodePanelResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = codePanelWidth;

    const onMouseMove = (ev: MouseEvent) => {
      const delta = startX - ev.clientX;
      setCodePanelWidth(Math.max(300, Math.min(700, startWidth + delta)));
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [codePanelWidth]);

  const handleExport = useCallback(() => {
    // Export handled by CodePanel's download button
  }, []);

  const handleOptimize = useCallback(() => {
    const { selectedResources, resourceGroups } = useResourceStore.getState();
    const { edges } = useCanvasStore.getState();
    const resources = Array.from(selectedResources.values());
    const edgeList = edges.map((e) => ({ source: e.source, target: e.target }));
    const result = optimizeArchitecture(resources, resourceGroups, edgeList);
    setOptimizeChanges(result.changes);
    if (result.changes.length === 0) {
      toast.success('No optimizations needed!');
    }
  }, []);

  const handleAutoLayout = useCallback(() => {
    const { nodes, edges } = useCanvasStore.getState();
    if (nodes.length === 0) {
      toast.info('No nodes to layout');
      return;
    }
    const laid = autoLayout(nodes, edges);
    useCanvasStore.getState().setNodes(laid);
    toast.success('Layout applied');
  }, []);

  return (
    <div className="flex h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <Toolbar
        onAddResourceGroup={() => setShowAddRgDialog(true)}
        onImport={() => setShowImportDialog(true)}
        onExport={handleExport}
        onOptimize={handleOptimize}
        onAutoLayout={handleAutoLayout}
        onTemplates={() => setShowTemplateGallery(true)}
        onToggleProblems={() => setShowProblems((v) => !v)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        {sidebarVisible && (
          <>
            <div
              style={{ width: sidebarWidth }}
              className="flex-shrink-0 overflow-hidden border-r border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"
            >
              <ResourceSidebar />
            </div>
            <div
              onMouseDown={handleSidebarResize}
              className="w-1 flex-shrink-0 cursor-col-resize bg-zinc-200 hover:bg-[#0078d4] transition-colors dark:bg-zinc-700 dark:hover:bg-[#0078d4]"
            />
          </>
        )}

        {/* Center canvas */}
        <div className={clsx('flex-1 overflow-hidden', !sidebarVisible && !codePanelVisible && 'w-full')}>
          <FlowCanvas />
        </div>

        {/* Right code panel */}
        {codePanelVisible && (
          <>
            <div
              onMouseDown={handleCodePanelResize}
              className="w-1 flex-shrink-0 cursor-col-resize bg-zinc-200 hover:bg-[#0078d4] transition-colors dark:bg-zinc-700 dark:hover:bg-[#0078d4]"
            />
            <div
              style={{ width: codePanelWidth }}
              className="flex-shrink-0 overflow-hidden border-l border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"
            >
              <CodePanel />
            </div>
          </>
        )}
      </div>

      <ValidationPanel open={showProblems} onToggle={() => setShowProblems((v) => !v)} />

      {/* Dialogs */}
      {showAddRgDialog && <AddResourceGroupDialog onClose={() => setShowAddRgDialog(false)} />}
      {showImportDialog && <ImportDialog onClose={() => setShowImportDialog(false)} />}
      {optimizeChanges !== null && (
        <OptimizeDiffDialog changes={optimizeChanges} onClose={() => setOptimizeChanges(null)} />
      )}
      {showTemplateGallery && <TemplateGalleryDialog onClose={() => setShowTemplateGallery(false)} />}

      <StatusBar />
    </div>
  );
}
