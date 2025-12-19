import { useState, useCallback } from 'react';
import { GitBranch, Plus, ArrowLeft, Zap, Play, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FlowCanvas } from '@/components/flows/FlowCanvas';
import { toast } from 'sonner';
import type { Flow } from '@/types';
import type { Node, Edge } from '@xyflow/react';

const initialFlows: Flow[] = [
  {
    id: '1',
    name: 'User Onboarding',
    status: 'active',
    nodes: [
      { id: 'trigger-1', type: 'trigger', position: { x: 250, y: 0 }, data: { label: 'New User Signup', event: 'user.created' } },
      { id: 'action-1', type: 'action', position: { x: 250, y: 120 }, data: { label: 'Send Welcome Email', action: 'email.send' } },
      { id: 'condition-1', type: 'condition', position: { x: 250, y: 240 }, data: { label: 'Email Verified?', condition: 'user.verified === true' } },
      { id: 'action-2', type: 'action', position: { x: 100, y: 380 }, data: { label: 'Grant Access', action: 'access.grant' } },
      { id: 'action-3', type: 'action', position: { x: 400, y: 380 }, data: { label: 'Send Reminder', action: 'email.reminder' } },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'action-1', animated: true },
      { id: 'e2', source: 'action-1', target: 'condition-1', animated: true },
      { id: 'e3', source: 'condition-1', target: 'action-2', sourceHandle: 'yes', animated: true },
      { id: 'e4', source: 'condition-1', target: 'action-3', sourceHandle: 'no', animated: true },
    ],
  },
  {
    id: '2',
    name: 'Payment Processing',
    status: 'active',
    nodes: [
      { id: 'trigger-1', type: 'trigger', position: { x: 250, y: 0 }, data: { label: 'Payment Received', event: 'payment.success' } },
      { id: 'action-1', type: 'action', position: { x: 250, y: 120 }, data: { label: 'Update Order', action: 'order.update' } },
      { id: 'action-2', type: 'action', position: { x: 250, y: 240 }, data: { label: 'Send Receipt', action: 'email.receipt' } },
      { id: 'action-3', type: 'action', position: { x: 250, y: 360 }, data: { label: 'Notify Warehouse', action: 'webhook.notify' } },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'action-1', animated: true },
      { id: 'e2', source: 'action-1', target: 'action-2', animated: true },
      { id: 'e3', source: 'action-2', target: 'action-3', animated: true },
    ],
  },
  {
    id: '3',
    name: 'Order Fulfillment',
    status: 'draft',
    nodes: [
      { id: 'trigger-1', type: 'trigger', position: { x: 250, y: 0 }, data: { label: 'Order Created', event: 'order.created' } },
      { id: 'condition-1', type: 'condition', position: { x: 250, y: 120 }, data: { label: 'In Stock?', condition: 'product.stock > 0' } },
      { id: 'action-1', type: 'action', position: { x: 100, y: 260 }, data: { label: 'Reserve Stock', action: 'inventory.reserve' } },
      { id: 'action-2', type: 'action', position: { x: 400, y: 260 }, data: { label: 'Notify Customer', action: 'email.outofstock' } },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'condition-1', animated: true },
      { id: 'e2', source: 'condition-1', target: 'action-1', sourceHandle: 'yes', animated: true },
      { id: 'e3', source: 'condition-1', target: 'action-2', sourceHandle: 'no', animated: true },
    ],
  },
];

export function FlowsView() {
  const [flows, setFlows] = useState<Flow[]>(initialFlows);
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);

  const handleAddNode = (type: 'trigger' | 'action' | 'condition') => {
    if (!selectedFlow) return;
    
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 250, y: (selectedFlow.nodes.length) * 120 },
      data: { 
        label: type === 'trigger' ? 'New Trigger' : type === 'action' ? 'New Action' : 'New Condition',
      },
    };
    
    setSelectedFlow({
      ...selectedFlow,
      nodes: [...selectedFlow.nodes, newNode],
    });
    toast.success(`Added ${type} node`);
  };

  const handleSaveFlow = () => {
    if (!selectedFlow) return;
    
    setFlows(flows.map(f => f.id === selectedFlow.id ? selectedFlow : f));
    toast.success('Flow saved!');
  };

  const handleCreateFlow = () => {
    const newFlow: Flow = {
      id: `flow-${Date.now()}`,
      name: 'New Flow',
      status: 'draft',
      nodes: [
        { id: 'trigger-1', type: 'trigger', position: { x: 250, y: 0 }, data: { label: 'Start', event: 'manual' } },
      ],
      edges: [],
    };
    setFlows([...flows, newFlow]);
    setSelectedFlow(newFlow);
    toast.success('New flow created');
  };

  const handleNodesChange = useCallback((nodes: Node[]) => {
    if (selectedFlow) {
      setSelectedFlow({ ...selectedFlow, nodes });
    }
  }, [selectedFlow]);

  const handleEdgesChange = useCallback((edges: Edge[]) => {
    if (selectedFlow) {
      setSelectedFlow({ ...selectedFlow, edges });
    }
  }, [selectedFlow]);

  // Flow editor view
  if (selectedFlow) {
    return (
      <div className="h-full flex flex-col">
        {/* Toolbar */}
        <div className="p-3 border-b border-border flex items-center justify-between shrink-0 bg-card/50">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedFlow(null)}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div className="h-6 w-px bg-border" />
            <span className="font-semibold">{selectedFlow.name}</span>
            <Badge variant={selectedFlow.status === 'active' ? 'default' : 'secondary'}>
              {selectedFlow.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleAddNode('trigger')}>
              <Zap className="w-4 h-4 mr-1 text-amber-400" />
              Trigger
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleAddNode('action')}>
              <Play className="w-4 h-4 mr-1 text-blue-400" />
              Action
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleAddNode('condition')}>
              <GitBranch className="w-4 h-4 mr-1 text-purple-400" />
              Condition
            </Button>
            <div className="h-6 w-px bg-border mx-1" />
            <Button size="sm" onClick={handleSaveFlow}>
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
        
        {/* Canvas */}
        <div className="flex-1">
          <FlowCanvas 
            flow={selectedFlow} 
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
          />
        </div>
      </div>
    );
  }

  // Flow list view
  return (
    <div className="h-full p-6 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Flows</h1>
          <p className="text-muted-foreground">Manage your automation workflows</p>
        </div>
        <Button className="gap-2" onClick={handleCreateFlow}>
          <Plus className="w-4 h-4" />
          New Flow
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {flows.map((flow) => (
          <Card 
            key={flow.id} 
            className="hover:border-primary/50 transition-colors cursor-pointer group"
            onClick={() => setSelectedFlow(flow)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <GitBranch className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{flow.name}</CardTitle>
                  <CardDescription>{flow.nodes.length} nodes • {flow.edges.length} connections</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant={
                  flow.status === 'active' ? 'default' :
                  flow.status === 'draft' ? 'secondary' : 'outline'
                }>
                  {flow.status}
                </Badge>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  Edit →
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
