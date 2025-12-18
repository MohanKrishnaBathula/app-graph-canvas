import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Server, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NodeStatus, NodeType } from '@/types';

interface ServiceNodeProps {
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

function ServiceNodeComponent({ data, selected }: ServiceNodeProps) {
  const isDatabase = data.type === 'database';
  const Icon = isDatabase ? Database : Server;

  return (
    <div
      className={cn(
        'min-w-[160px] bg-canvas-node-bg border-2 rounded-xl shadow-lg transition-all duration-200',
        selected 
          ? 'border-canvas-node-selected shadow-primary/20' 
          : 'border-canvas-node-border hover:border-muted-foreground/50'
      )}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-primary !border-2 !border-canvas-node-bg hover:!bg-primary/80 transition-colors"
      />

      {/* Node Content */}
      <div className="p-3">
        <div className="flex items-start gap-2.5">
          <div className={cn(
            'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
            isDatabase ? 'bg-purple-500/20' : 'bg-primary/20'
          )}>
            <Icon className={cn(
              'w-5 h-5',
              isDatabase ? 'text-purple-400' : 'text-primary'
            )} />
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
            {data.description && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {data.description}
              </p>
            )}
          </div>
        </div>

        {/* Resource bar */}
        <div className="mt-3 pt-2 border-t border-border/50">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">Resources</span>
            <span className="text-foreground font-medium">{data.configValue}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                'h-full rounded-full transition-all duration-300',
                data.configValue > 80 ? 'bg-status-degraded' :
                data.configValue > 50 ? 'bg-status-healthy' :
                'bg-primary'
              )}
              style={{ width: `${data.configValue}%` }}
            />
          </div>
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-primary !border-2 !border-canvas-node-bg hover:!bg-primary/80 transition-colors"
      />
    </div>
  );
}

export const ServiceNode = memo(ServiceNodeComponent);
