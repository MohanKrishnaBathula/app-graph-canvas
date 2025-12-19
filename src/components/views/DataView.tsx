import { Database, Table, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const tables = [
  { id: '1', name: 'users', rows: 1250, size: '2.3 MB' },
  { id: '2', name: 'orders', rows: 8420, size: '12.1 MB' },
  { id: '3', name: 'products', rows: 340, size: '850 KB' },
  { id: '4', name: 'sessions', rows: 15000, size: '5.2 MB' },
  { id: '5', name: 'analytics', rows: 50000, size: '25.4 MB' },
];

export function DataView() {
  return (
    <div className="h-full p-6 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Data</h1>
          <p className="text-muted-foreground">Browse and manage your database tables</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Table
        </Button>
      </div>

      <div className="space-y-3">
        {tables.map((table) => (
          <Card key={table.id} className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Table className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-mono">{table.name}</CardTitle>
                    <CardDescription>{table.rows.toLocaleString()} rows • {table.size}</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Browse</Button>
                  <Button variant="ghost" size="sm">Schema</Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
