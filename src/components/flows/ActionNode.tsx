import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Play } from 'lucide-react';

interface ActionNodeData {
  label: string;
  action?: string;
  [key: string]: unknown;
}

export const ActionNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as ActionNodeData;
  
  return (
    <div className={`
      px-4 py-3 rounded-lg border-2 min-w-[160px]
      bg-gradient-to-br from-blue-500/20 to-cyan-500/20
      ${selected ? 'border-blue-400 shadow-lg shadow-blue-500/20' : 'border-blue-500/50'}
      transition-all duration-200
    `}>
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-blue-400 !border-2 !border-background hover:!bg-blue-300"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-blue-400 !border-2 !border-background hover:!bg-blue-300"
      />
      
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded bg-blue-500/30">
          <Play className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <div className="text-xs text-blue-400/70 font-medium">Action</div>
          <div className="text-sm font-semibold text-foreground">{nodeData.label}</div>
        </div>
      </div>
      
      {nodeData.action && (
        <div className="mt-2 text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded">
          {nodeData.action}
        </div>
      )}
    </div>
  );
});

ActionNode.displayName = 'ActionNode';
