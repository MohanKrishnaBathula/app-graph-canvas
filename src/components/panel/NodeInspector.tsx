import { useState, useEffect } from 'react';
import { Settings, Activity } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
import type { ServiceNode, NodeStatus, InspectorTab } from '@/types';

interface NodeInspectorProps {
  node: ServiceNode;
  onUpdate?: (nodeId: string, data: Partial<ServiceNode['data']>) => void;
}

const statusConfig: Record<NodeStatus, { label: string; className: string }> = {
  healthy: {
    label: 'Healthy',
    className: 'bg-status-healthy/20 text-status-healthy border-status-healthy/30',
  },
  degraded: {
    label: 'Degraded',
    className: 'bg-status-degraded/20 text-status-degraded border-status-degraded/30',
  },
  down: {
    label: 'Down',
    className: 'bg-status-down/20 text-status-down border-status-down/30',
  },
};

export function NodeInspector({ node, onUpdate }: NodeInspectorProps) {
  const activeTab = useAppStore((state) => state.activeInspectorTab);
  const setActiveTab = useAppStore((state) => state.setActiveInspectorTab);

  // Local state for form fields
  const [label, setLabel] = useState(node.data.label);
  const [description, setDescription] = useState(node.data.description || '');
  const [configValue, setConfigValue] = useState(node.data.configValue);

  // Sync local state with node data when node changes
  useEffect(() => {
    setLabel(node.data.label);
    setDescription(node.data.description || '');
    setConfigValue(node.data.configValue);
  }, [node.id, node.data.label, node.data.description, node.data.configValue]);

  const handleLabelChange = (value: string) => {
    setLabel(value);
    onUpdate?.(node.id, { label: value });
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    onUpdate?.(node.id, { description: value });
  };

  const handleConfigValueChange = (value: number) => {
    setConfigValue(value);
    onUpdate?.(node.id, { configValue: value });
  };

  const status = statusConfig[node.data.status];

  return (
    <div className="p-3">
      {/* Header with status */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Service Node</h3>
          <p className="text-xs text-muted-foreground capitalize">{node.data.type}</p>
        </div>
        <Badge variant="outline" className={cn('text-xs', status.className)}>
          {status.label}
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as InspectorTab)}
        className="w-full"
      >
        <TabsList className="w-full grid grid-cols-2 mb-4">
          <TabsTrigger value="config" className="text-xs">
            <Settings className="w-3.5 h-3.5 mr-1.5" />
            Config
          </TabsTrigger>
          <TabsTrigger value="runtime" className="text-xs">
            <Activity className="w-3.5 h-3.5 mr-1.5" />
            Runtime
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4 mt-0">
          {/* Name field */}
          <div className="space-y-2">
            <Label htmlFor="node-name" className="text-xs">Name</Label>
            <Input
              id="node-name"
              value={label}
              onChange={(e) => handleLabelChange(e.target.value)}
              className="h-9 text-sm"
              placeholder="Node name"
            />
          </div>

          {/* Description field */}
          <div className="space-y-2">
            <Label htmlFor="node-description" className="text-xs">Description</Label>
            <Textarea
              id="node-description"
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              className="min-h-[80px] text-sm resize-none"
              placeholder="Describe this node..."
            />
          </div>

          {/* Config Value - Synced Slider + Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Resource Allocation</Label>
              <span className="text-xs text-muted-foreground">{configValue}%</span>
            </div>
            <div className="flex items-center gap-3">
              <Slider
                value={[configValue]}
                onValueChange={([value]) => handleConfigValueChange(value)}
                max={100}
                min={0}
                step={1}
                className="flex-1"
              />
              <Input
                type="number"
                value={configValue}
                onChange={(e) => {
                  const value = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                  handleConfigValueChange(value);
                }}
                className="w-16 h-8 text-sm text-center"
                min={0}
                max={100}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="runtime" className="space-y-4 mt-0">
          {/* Runtime metrics */}
          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="CPU Usage" value="42%" trend="stable" />
            <MetricCard label="Memory" value="1.2 GB" trend="up" />
            <MetricCard label="Requests/s" value="847" trend="up" />
            <MetricCard label="Latency" value="23ms" trend="down" />
          </div>

          {/* Recent events */}
          <div className="space-y-2">
            <Label className="text-xs">Recent Events</Label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              <EventItem time="2m ago" message="Health check passed" type="success" />
              <EventItem time="5m ago" message="Config updated" type="info" />
              <EventItem time="12m ago" message="High latency detected" type="warning" />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
}

function MetricCard({ label, value, trend }: MetricCardProps) {
  return (
    <div className="p-2.5 bg-muted/50 rounded-lg">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-semibold">{value}</span>
        <span className={cn(
          'text-xs',
          trend === 'up' && 'text-status-healthy',
          trend === 'down' && 'text-status-degraded',
          trend === 'stable' && 'text-muted-foreground'
        )}>
          {trend === 'up' && '↑'}
          {trend === 'down' && '↓'}
          {trend === 'stable' && '→'}
        </span>
      </div>
    </div>
  );
}

interface EventItemProps {
  time: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
}

function EventItem({ time, message, type }: EventItemProps) {
  return (
    <div className="flex items-start gap-2 p-2 bg-muted/30 rounded-md">
      <div className={cn(
        'w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0',
        type === 'success' && 'bg-status-healthy',
        type === 'warning' && 'bg-status-degraded',
        type === 'error' && 'bg-status-down',
        type === 'info' && 'bg-primary'
      )} />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-foreground/90">{message}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}
