import { useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  type OnSelectionChangeFunc,
  BackgroundVariant,
  SelectionMode,
  ReactFlowProvider,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ServiceNode } from './ServiceNode';
import { DatabaseNode } from './DatabaseNode';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppGraph } from '@/hooks/useApi';
import { useAppStore } from '@/store/appStore';
import type { ServiceNode as ServiceNodeType, ServiceNodeData } from '@/types';

const nodeTypes: NodeTypes = {
  serviceNode: ServiceNode,
  databaseNode: DatabaseNode,
};

interface GraphCanvasProps {
  onFitViewRef?: (fn: () => void) => void;
  onZoomInRef?: (fn: () => void) => void;
  onZoomOutRef?: (fn: () => void) => void;
  onSelectedNodeChange?: (node: ServiceNodeType | undefined) => void;
  nodeUpdateRef?: React.MutableRefObject<((nodeId: string, data: Partial<ServiceNodeData>) => void) | null>;
  onExportRef?: (fn: () => { nodes: Node[]; edges: Edge[] }) => void;
}

function GraphCanvasInner({ 
  onFitViewRef, 
  onZoomInRef, 
  onZoomOutRef,
  onSelectedNodeChange,
  nodeUpdateRef,
  onExportRef,
}: GraphCanvasProps) {
  const selectedAppId = useAppStore((state) => state.selectedAppId);
  const selectedNodeId = useAppStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useAppStore((state) => state.setSelectedNodeId);

  const { data: graphData, isLoading, isError, refetch } = useAppGraph(selectedAppId);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  
  const { fitView, zoomIn, zoomOut } = useReactFlow();
  const initialFitDone = useRef(false);

  // Expose control functions to parent
  useEffect(() => {
    onFitViewRef?.(() => fitView({ padding: 0.2, duration: 300 }));
    onZoomInRef?.(() => zoomIn({ duration: 200 }));
    onZoomOutRef?.(() => zoomOut({ duration: 200 }));
  }, [fitView, zoomIn, zoomOut, onFitViewRef, onZoomInRef, onZoomOutRef]);

  // Expose export function to parent
  useEffect(() => {
    onExportRef?.(() => ({ nodes, edges }));
  }, [nodes, edges, onExportRef]);

  // Handle edge connections
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({
        ...connection,
        animated: true,
        style: { stroke: 'hsl(var(--primary))' },
      }, eds));
    },
    [setEdges]
  );

  // Update nodes when graph data changes
  useEffect(() => {
    if (graphData) {
      setNodes(graphData.nodes);
      setEdges(graphData.edges);
      initialFitDone.current = false;
    }
  }, [graphData, setNodes, setEdges]);

  // Fit view after initial load
  useEffect(() => {
    if (nodes.length > 0 && !initialFitDone.current) {
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 300 });
        initialFitDone.current = true;
      }, 100);
    }
  }, [nodes, fitView]);

  // Handle selection changes
  const onSelectionChange: OnSelectionChangeFunc = useCallback(({ nodes: selectedNodes }) => {
    const selectedNode = selectedNodes[0] as ServiceNodeType | undefined;
    setSelectedNodeId(selectedNode?.id ?? null);
    onSelectedNodeChange?.(selectedNode);
  }, [setSelectedNodeId, onSelectedNodeChange]);

  // Handle keyboard delete
  const onKeyDown = useCallback((event: React.KeyboardEvent) => {
    if ((event.key === 'Delete' || event.key === 'Backspace') && selectedNodeId) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
      setSelectedNodeId(null);
    }
  }, [selectedNodeId, setNodes, setEdges, setSelectedNodeId]);

  // Update node data function
  const updateNodeData = useCallback((nodeId: string, data: Partial<ServiceNodeData>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      )
    );
  }, [setNodes]);

  // Register update function with parent
  useEffect(() => {
    if (nodeUpdateRef) {
      nodeUpdateRef.current = updateNodeData;
    }
  }, [nodeUpdateRef, updateNodeData]);

  // Add new node
  const addNode = useCallback(() => {
    const newId = `node-${Date.now()}`;
    const newNode: Node = {
      id: newId,
      type: 'serviceNode',
      position: { x: Math.random() * 300 + 100, y: Math.random() * 200 + 100 },
      data: {
        label: 'New Service',
        description: 'Click to configure',
        status: 'healthy',
        type: 'service',
        configValue: 50,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  // No app selected
  if (!selectedAppId) {
    return (
      <div className="w-full h-full bg-canvas-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-dashed border-muted-foreground/30 rounded-lg" />
          </div>
          <p className="text-muted-foreground text-sm">Select an app to view its graph</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-full bg-canvas-bg flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <Skeleton className="w-24 h-16 rounded-xl" />
            <Skeleton className="w-24 h-16 rounded-xl" />
            <Skeleton className="w-24 h-16 rounded-xl" />
          </div>
          <p className="text-muted-foreground text-sm">Loading graph...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="w-full h-full bg-canvas-bg flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
          <p className="text-foreground font-medium mb-1">Failed to load graph</p>
          <p className="text-muted-foreground text-sm mb-4">There was an error fetching the graph data</p>
          <Button variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full relative" 
      tabIndex={0} 
      onKeyDown={onKeyDown}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        selectionMode={SelectionMode.Partial}
        selectNodesOnDrag={false}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        className="bg-canvas-bg"
        connectionLineStyle={{ stroke: 'hsl(var(--primary))' }}
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1.5}
          color="hsl(var(--canvas-dots))"
        />
        <Controls 
          showInteractive={false}
          className="!bg-card !border-border !rounded-lg !shadow-lg"
        />
        <MiniMap 
          nodeStrokeWidth={3}
          zoomable
          pannable
          className="!bg-card !border-border !rounded-lg"
        />
      </ReactFlow>

      {/* Add Node Button */}
      <Button
        size="sm"
        className="absolute top-4 right-4 z-10"
        onClick={addNode}
      >
        <Plus className="w-4 h-4 mr-1" />
        Add Node
      </Button>
    </div>
  );
}

// Wrapper component to provide ReactFlow context
export function GraphCanvas(props: GraphCanvasProps) {
  return (
    <ReactFlowProvider>
      <GraphCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
