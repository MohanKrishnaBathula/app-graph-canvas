import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { GitBranch } from 'lucide-react';

interface ConditionNodeData {
  label: string;
  condition?: string;
  [key: string]: unknown;
}

export const ConditionNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as ConditionNodeData;
  
  return (
    <div className={`
      px-4 py-3 rounded-lg border-2 min-w-[160px]
      bg-gradient-to-br from-purple-500/20 to-pink-500/20
      ${selected ? 'border-purple-400 shadow-lg shadow-purple-500/20' : 'border-purple-500/50'}
      transition-all duration-200
    `}>
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-purple-400 !border-2 !border-background hover:!bg-purple-300"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="yes"
        style={{ left: '30%' }}
        className="!w-3 !h-3 !bg-green-400 !border-2 !border-background hover:!bg-green-300"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="no"
        style={{ left: '70%' }}
        className="!w-3 !h-3 !bg-red-400 !border-2 !border-background hover:!bg-red-300"
      />
      
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded bg-purple-500/30">
          <GitBranch className="w-4 h-4 text-purple-400" />
        </div>
        <div>
          <div className="text-xs text-purple-400/70 font-medium">Condition</div>
          <div className="text-sm font-semibold text-foreground">{nodeData.label}</div>
        </div>
      </div>
      
      {nodeData.condition && (
        <div className="mt-2 text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded">
          {nodeData.condition}
        </div>
      )}
      
      <div className="flex justify-between mt-2 text-xs">
        <span className="text-green-400">Yes</span>
        <span className="text-red-400">No</span>
      </div>
    </div>
  );
});

ConditionNode.displayName = 'ConditionNode';
