import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TriggerNode } from './TriggerNode';
import { ActionNode } from './ActionNode';
import { ConditionNode } from './ConditionNode';
import type { Flow } from '@/types';

interface FlowCanvasProps {
  flow: Flow;
  onNodesChange: (nodes: Node[]) => void;
  onEdgesChange: (edges: Edge[]) => void;
}

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
};

export function FlowCanvas({ flow, onNodesChange, onEdgesChange }: FlowCanvasProps) {
  const [nodes, setNodes, onNodesChangeHandler] = useNodesState(flow.nodes);
  const [edges, setEdges, onEdgesChangeHandler] = useEdgesState(flow.edges);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ 
        ...params, 
        animated: true,
        style: { stroke: 'hsl(var(--primary))' }
      }, eds));
    },
    [setEdges]
  );

  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesChangeHandler(changes);
      // Sync back to parent after state update
      setTimeout(() => onNodesChange(nodes), 0);
    },
    [onNodesChangeHandler, onNodesChange, nodes]
  );

  const handleEdgesChange = useCallback(
    (changes: any) => {
      onEdgesChangeHandler(changes);
      setTimeout(() => onEdgesChange(edges), 0);
    },
    [onEdgesChangeHandler, onEdgesChange, edges]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        setNodes((nds) => nds.filter((node) => !node.selected));
        setEdges((eds) => eds.filter((edge) => !edge.selected));
      }
    },
    [setNodes, setEdges]
  );

  return (
    <div className="w-full h-full" onKeyDown={handleKeyDown} tabIndex={0}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        deleteKeyCode={['Delete', 'Backspace']}
        className="bg-background"
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1} 
          color="hsl(var(--muted-foreground) / 0.3)" 
        />
        <Controls className="!bg-card !border-border !rounded-lg" />
        <MiniMap 
          className="!bg-card !border-border !rounded-lg"
          nodeColor={(node) => {
            if (node.type === 'trigger') return '#f59e0b';
            if (node.type === 'condition') return '#a855f7';
            return '#3b82f6';
          }}
        />
      </ReactFlow>
    </div>
  );
}
