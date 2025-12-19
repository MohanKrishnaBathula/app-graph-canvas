import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Zap } from 'lucide-react';

interface TriggerNodeData {
  label: string;
  event?: string;
  [key: string]: unknown;
}

export const TriggerNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as TriggerNodeData;
  
  return (
    <div className={`
      px-4 py-3 rounded-lg border-2 min-w-[160px]
      bg-gradient-to-br from-amber-500/20 to-orange-500/20
      ${selected ? 'border-amber-400 shadow-lg shadow-amber-500/20' : 'border-amber-500/50'}
      transition-all duration-200
    `}>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-amber-400 !border-2 !border-background hover:!bg-amber-300"
      />
      
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded bg-amber-500/30">
          <Zap className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <div className="text-xs text-amber-400/70 font-medium">Trigger</div>
          <div className="text-sm font-semibold text-foreground">{nodeData.label}</div>
        </div>
      </div>
      
      {nodeData.event && (
        <div className="mt-2 text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded">
          {nodeData.event}
        </div>
      )}
    </div>
  );
});

TriggerNode.displayName = 'TriggerNode';
