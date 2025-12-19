import type { App, GraphData, TableSchema, TableRow } from '@/types';
import { mockApps, mockGraphs, mockTables, mockTableData } from './data';

// Simulated network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Error simulation state
let shouldSimulateError = false;

export async function fetchApps(): Promise<App[]> {
  await delay(500);
  
  if (shouldSimulateError) {
    throw new Error('Failed to fetch apps');
  }
  
  return mockApps;
}

export async function fetchAppGraph(appId: string): Promise<GraphData> {
  await delay(700);
  
  if (shouldSimulateError) {
    throw new Error('Failed to fetch graph data');
  }
  
  const graph = mockGraphs[appId];
  
  if (!graph) {
    throw new Error('Graph not found');
  }
  
  return graph;
}

// Database table APIs
export async function fetchTables(): Promise<TableSchema[]> {
  await delay(400);
  
  if (shouldSimulateError) {
    throw new Error('Failed to fetch tables');
  }
  
  return mockTables;
}

export async function fetchTableData(tableId: string): Promise<TableRow[]> {
  await delay(300);
  
  if (shouldSimulateError) {
    throw new Error('Failed to fetch table data');
  }
  
  return mockTableData[tableId] || [];
}

export async function createTableRow(tableId: string, row: TableRow): Promise<TableRow> {
  await delay(200);
  
  if (!mockTableData[tableId]) {
    mockTableData[tableId] = [];
  }
  
  const newRow = { ...row, id: `new-${Date.now()}` };
  mockTableData[tableId].push(newRow);
  
  // Update row count
  const table = mockTables.find(t => t.id === tableId);
  if (table) table.rowCount++;
  
  return newRow;
}

export async function updateTableRow(tableId: string, rowId: string, updates: Partial<TableRow>): Promise<TableRow> {
  await delay(200);
  
  const rows = mockTableData[tableId];
  if (!rows) throw new Error('Table not found');
  
  const index = rows.findIndex(r => r.id === rowId);
  if (index === -1) throw new Error('Row not found');
  
  rows[index] = { ...rows[index], ...updates };
  return rows[index];
}

export async function deleteTableRow(tableId: string, rowId: string): Promise<void> {
  await delay(200);
  
  const rows = mockTableData[tableId];
  if (!rows) throw new Error('Table not found');
  
  const index = rows.findIndex(r => r.id === rowId);
  if (index === -1) throw new Error('Row not found');
  
  rows.splice(index, 1);
  
  // Update row count
  const table = mockTables.find(t => t.id === tableId);
  if (table) table.rowCount--;
}

export function toggleErrorSimulation(): boolean {
  shouldSimulateError = !shouldSimulateError;
  return shouldSimulateError;
}
