import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Database, HardDrive } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NodeStatus, NodeType } from '@/types';

interface DatabaseNodeProps {
  data: {
    label: string;
    description?: string;
    status: NodeStatus;
    type: NodeType;
    configValue: number;
  };
  selected?: boolean;
}

const statusColors: Record<NodeStatus, string> = {
  healthy: 'bg-status-healthy',
  degraded: 'bg-status-degraded',
  down: 'bg-status-down',
};

function DatabaseNodeComponent({ data, selected }: DatabaseNodeProps) {
  return (
    <div
      className={cn(
        'min-w-[140px] bg-canvas-node-bg border-2 rounded-xl shadow-lg transition-all duration-200',
        selected 
          ? 'border-purple-500 shadow-purple-500/20' 
          : 'border-canvas-node-border hover:border-purple-500/50'
      )}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-canvas-node-bg hover:!bg-purple-400 transition-colors"
      />

      {/* Node Content */}
      <div className="p-3">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Database className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground truncate">
                {data.label}
              </span>
              <div className={cn(
                'w-2 h-2 rounded-full flex-shrink-0',
                statusColors[data.status]
              )} />
            </div>
          </div>
        </div>

        {data.description && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            {data.description}
          </p>
        )}

        {/* Storage indicator */}
        <div className="mt-2 pt-2 border-t border-border/50 flex items-center gap-1.5">
          <HardDrive className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{data.configValue}% used</span>
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-canvas-node-bg hover:!bg-purple-400 transition-colors"
      />
    </div>
  );
}

export const DatabaseNode = memo(DatabaseNodeComponent);
