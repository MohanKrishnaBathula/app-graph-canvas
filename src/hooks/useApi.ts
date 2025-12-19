import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { App, GraphData, TableSchema, TableRow } from '@/types';
import { fetchApps, fetchAppGraph, fetchTables, fetchTableData, createTableRow, updateTableRow, deleteTableRow } from '@/mocks/api';

// Fetch all apps
export function useApps() {
  return useQuery<App[]>({
    queryKey: ['apps'],
    queryFn: fetchApps,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Fetch graph data for a specific app
export function useAppGraph(appId: string | null) {
  return useQuery<GraphData>({
    queryKey: ['app-graph', appId],
    queryFn: () => {
      if (!appId) throw new Error('No app selected');
      return fetchAppGraph(appId);
    },
    enabled: !!appId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Fetch all database tables
export function useTables() {
  return useQuery<TableSchema[]>({
    queryKey: ['tables'],
    queryFn: fetchTables,
    staleTime: 5 * 60 * 1000,
  });
}

// Fetch data for a specific table
export function useTableData(tableId: string | null) {
  return useQuery<TableRow[]>({
    queryKey: ['table-data', tableId],
    queryFn: () => {
      if (!tableId) throw new Error('No table selected');
      return fetchTableData(tableId);
    },
    enabled: !!tableId,
    staleTime: 1 * 60 * 1000,
  });
}

// Create row mutation
export function useCreateRow(tableId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (row: TableRow) => createTableRow(tableId, row),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['table-data', tableId] });
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
}

// Update row mutation
export function useUpdateRow(tableId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ rowId, updates }: { rowId: string; updates: Partial<TableRow> }) => 
      updateTableRow(tableId, rowId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['table-data', tableId] });
    },
  });
}

// Delete row mutation
export function useDeleteRow(tableId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (rowId: string) => deleteTableRow(tableId, rowId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['table-data', tableId] });
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
}
