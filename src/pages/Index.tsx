import { useCallback, useRef, useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { LeftRail } from '@/components/layout/LeftRail';
import { RightPanel } from '@/components/layout/RightPanel';
import { GraphCanvas } from '@/components/canvas/GraphCanvas';
import { FlowsView } from '@/components/views/FlowsView';
import { DataView } from '@/components/views/DataView';
import { MonitoringView } from '@/components/views/MonitoringView';
import { useAppStore } from '@/store/appStore';
import type { ServiceNode, ServiceNodeData } from '@/types';
import type { Node, Edge } from '@xyflow/react';

const Index = () => {
  const [selectedNode, setSelectedNode] = useState<ServiceNode | undefined>();
  const activeNavItem = useAppStore((state) => state.activeNavItem);
  
  // Refs for canvas control functions
  const fitViewRef = useRef<(() => void) | null>(null);
  const zoomInRef = useRef<(() => void) | null>(null);
  const zoomOutRef = useRef<(() => void) | null>(null);
  const nodeUpdateRef = useRef<((nodeId: string, data: Partial<ServiceNodeData>) => void) | null>(null);
  const exportRef = useRef<(() => { nodes: Node[]; edges: Edge[] }) | null>(null);

  const handleFitView = useCallback(() => {
    fitViewRef.current?.();
  }, []);

  const handleZoomIn = useCallback(() => {
    zoomInRef.current?.();
  }, []);

  const handleZoomOut = useCallback(() => {
    zoomOutRef.current?.();
  }, []);

  const handleExport = useCallback(() => {
    return exportRef.current?.();
  }, []);

  const handleNodeUpdate = useCallback((nodeId: string, data: Partial<ServiceNodeData>) => {
    nodeUpdateRef.current?.(nodeId, data);
    // Update local selected node state to reflect changes
    setSelectedNode((prev) => {
      if (prev && prev.id === nodeId) {
        return { ...prev, data: { ...prev.data, ...data } };
      }
      return prev;
    });
  }, []);

  const handleSelectedNodeChange = useCallback((node: ServiceNode | undefined) => {
    setSelectedNode(node);
  }, []);

  const renderMainContent = () => {
    switch (activeNavItem) {
      case 'flows':
        return <FlowsView />;
      case 'data':
        return <DataView />;
      case 'monitoring':
        return <MonitoringView />;
      case 'apps':
      default:
        return (
          <>
            <main className="flex-1 overflow-hidden">
              <GraphCanvas
                onFitViewRef={(fn) => { fitViewRef.current = fn; }}
                onZoomInRef={(fn) => { zoomInRef.current = fn; }}
                onZoomOutRef={(fn) => { zoomOutRef.current = fn; }}
                onSelectedNodeChange={handleSelectedNodeChange}
                nodeUpdateRef={nodeUpdateRef}
                onExportRef={(fn) => { exportRef.current = fn; }}
              />
            </main>
            <RightPanel 
              selectedNode={selectedNode}
              onNodeUpdate={handleNodeUpdate}
            />
          </>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Bar */}
      <TopBar 
        onFitView={handleFitView}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onExport={handleExport}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Rail */}
        <LeftRail />
        
        {/* Center Content */}
        {renderMainContent()}
      </div>
    </div>
  );
};

export default Index;
