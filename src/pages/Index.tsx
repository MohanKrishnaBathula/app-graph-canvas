import { useCallback, useRef, useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { LeftRail } from '@/components/layout/LeftRail';
import { RightPanel } from '@/components/layout/RightPanel';
import { GraphCanvas } from '@/components/canvas/GraphCanvas';
import type { ServiceNode, ServiceNodeData } from '@/types';

const Index = () => {
  const [selectedNode, setSelectedNode] = useState<ServiceNode | undefined>();
  
  // Refs for canvas control functions
  const fitViewRef = useRef<(() => void) | null>(null);
  const zoomInRef = useRef<(() => void) | null>(null);
  const zoomOutRef = useRef<(() => void) | null>(null);
  const nodeUpdateRef = useRef<((nodeId: string, data: Partial<ServiceNodeData>) => void) | null>(null);

  const handleFitView = useCallback(() => {
    fitViewRef.current?.();
  }, []);

  const handleZoomIn = useCallback(() => {
    zoomInRef.current?.();
  }, []);

  const handleZoomOut = useCallback(() => {
    zoomOutRef.current?.();
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

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Bar */}
      <TopBar 
        onFitView={handleFitView}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Rail */}
        <LeftRail />
        
        {/* Center Canvas */}
        <main className="flex-1 overflow-hidden">
          <GraphCanvas
            onFitViewRef={(fn) => { fitViewRef.current = fn; }}
            onZoomInRef={(fn) => { zoomInRef.current = fn; }}
            onZoomOutRef={(fn) => { zoomOutRef.current = fn; }}
            onSelectedNodeChange={handleSelectedNodeChange}
            nodeUpdateRef={nodeUpdateRef}
          />
        </main>
        
        {/* Right Panel */}
        <RightPanel 
          selectedNode={selectedNode}
          onNodeUpdate={handleNodeUpdate}
        />
      </div>
    </div>
  );
};

export default Index;
