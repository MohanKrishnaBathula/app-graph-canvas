import type { App, GraphData } from '@/types';
import { mockApps, mockGraphs } from './data';

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

export function toggleErrorSimulation(): boolean {
  shouldSimulateError = !shouldSimulateError;
  return shouldSimulateError;
}
