import { useState } from 'react';
import { Database, Table, Plus, Trash2, Edit2, Eye, X, Key, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useTables, useTableData, useCreateRow, useUpdateRow, useDeleteRow } from '@/hooks/useApi';
import type { TableSchema, TableRow } from '@/types';
import { toast } from 'sonner';

export function DataView() {
  const [selectedTable, setSelectedTable] = useState<TableSchema | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<TableRow | null>(null);
  const [newRowData, setNewRowData] = useState<Record<string, string>>({});

  const { data: tables, isLoading: tablesLoading, error: tablesError } = useTables();
  const { data: tableData, isLoading: dataLoading } = useTableData(selectedTable?.id || null);
  
  const createMutation = useCreateRow(selectedTable?.id || '');
  const updateMutation = useUpdateRow(selectedTable?.id || '');
  const deleteMutation = useDeleteRow(selectedTable?.id || '');

  const handleCreateRow = () => {
    if (!selectedTable) return;
    createMutation.mutate(newRowData, {
      onSuccess: () => {
        toast.success('Row created successfully');
        setIsAddDialogOpen(false);
        setNewRowData({});
      },
      onError: () => toast.error('Failed to create row'),
    });
  };

  const handleUpdateRow = () => {
    if (!editingRow || !selectedTable) return;
    updateMutation.mutate(
      { rowId: editingRow.id as string, updates: newRowData },
      {
        onSuccess: () => {
          toast.success('Row updated successfully');
          setEditingRow(null);
          setNewRowData({});
        },
        onError: () => toast.error('Failed to update row'),
      }
    );
  };

  const handleDeleteRow = (rowId: string) => {
    deleteMutation.mutate(rowId, {
      onSuccess: () => toast.success('Row deleted'),
      onError: () => toast.error('Failed to delete row'),
    });
  };

  const openEditDialog = (row: TableRow) => {
    setEditingRow(row);
    const rowData: Record<string, string> = {};
    Object.entries(row).forEach(([key, value]) => {
      rowData[key] = String(value);
    });
    setNewRowData(rowData);
  };

  if (tablesLoading) {
    return (
      <div className="h-full p-6 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (tablesError) {
    return (
      <div className="h-full p-6 flex items-center justify-center text-destructive">
        Failed to load tables
      </div>
    );
  }

  // Table list view
  if (!selectedTable) {
    return (
      <div className="h-full p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Data</h1>
            <p className="text-muted-foreground">Browse and manage your database tables</p>
          </div>
          <Button className="gap-2" onClick={() => toast.info('Create table coming soon')}>
            <Plus className="w-4 h-4" />
            New Table
          </Button>
        </div>

        <div className="space-y-3">
          {tables?.map((table) => (
            <Card 
              key={table.id} 
              className="hover:border-primary/50 transition-colors cursor-pointer group"
              onClick={() => setSelectedTable(table)}
            >
              <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Table className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-mono">{table.name}</CardTitle>
                      <CardDescription>{table.rowCount.toLocaleString()} rows • {table.size}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {table.columns.length} columns
                    </Badge>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Table detail view
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setSelectedTable(null)}>
            <X className="w-4 h-4 mr-1" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            <span className="font-mono font-semibold">{selectedTable.name}</span>
          </div>
        </div>
        <Button size="sm" className="gap-1" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Row
        </Button>
      </div>

      {/* Schema Info */}
      <div className="p-4 border-b border-border bg-muted/30 shrink-0">
        <h3 className="text-sm font-medium mb-2 text-muted-foreground">Schema</h3>
        <div className="flex flex-wrap gap-2">
          {selectedTable.columns.map((col) => (
            <Badge key={col.name} variant="secondary" className="font-mono text-xs gap-1">
              {col.primaryKey && <Key className="w-3 h-3" />}
              {col.name}
              <span className="text-muted-foreground">({col.type})</span>
              {col.nullable && <span className="text-yellow-500">?</span>}
            </Badge>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-auto p-4">
        {dataLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : !tableData?.length ? (
          <div className="text-center py-8 text-muted-foreground">
            No data in this table
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {selectedTable.columns.map((col) => (
                    <th key={col.name} className="px-3 py-2 text-left font-mono font-medium text-muted-foreground">
                      {col.name}
                    </th>
                  ))}
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, idx) => (
                  <tr key={row.id as string || idx} className="border-t border-border hover:bg-muted/30">
                    {selectedTable.columns.map((col) => (
                      <td key={col.name} className="px-3 py-2 font-mono text-xs truncate max-w-[200px]">
                        {String(row[col.name] ?? '-')}
                      </td>
                    ))}
                    <td className="px-3 py-2 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(row)}>
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteRow(row.id as string)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Row Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Row</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {selectedTable.columns.filter(c => !c.primaryKey).map((col) => (
              <div key={col.name}>
                <label className="text-sm font-medium mb-1 block">{col.name}</label>
                <Input
                  placeholder={col.type}
                  value={newRowData[col.name] || ''}
                  onChange={(e) => setNewRowData({ ...newRowData, [col.name]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateRow} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Row Dialog */}
      <Dialog open={!!editingRow} onOpenChange={() => setEditingRow(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Row</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {selectedTable.columns.filter(c => !c.primaryKey).map((col) => (
              <div key={col.name}>
                <label className="text-sm font-medium mb-1 block">{col.name}</label>
                <Input
                  placeholder={col.type}
                  value={newRowData[col.name] || ''}
                  onChange={(e) => setNewRowData({ ...newRowData, [col.name]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRow(null)}>Cancel</Button>
            <Button onClick={handleUpdateRow} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
