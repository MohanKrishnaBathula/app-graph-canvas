import { GitBranch, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const flows = [
  { id: '1', name: 'User Onboarding', steps: 5, status: 'active' },
  { id: '2', name: 'Payment Processing', steps: 8, status: 'active' },
  { id: '3', name: 'Order Fulfillment', steps: 12, status: 'draft' },
  { id: '4', name: 'Customer Support', steps: 6, status: 'paused' },
];

export function FlowsView() {
  return (
    <div className="h-full p-6 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Flows</h1>
          <p className="text-muted-foreground">Manage your automation workflows</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Flow
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {flows.map((flow) => (
          <Card key={flow.id} className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <GitBranch className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{flow.name}</CardTitle>
                  <CardDescription>{flow.steps} steps</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  flow.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  flow.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {flow.status}
                </span>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
