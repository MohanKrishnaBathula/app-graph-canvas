import { useQuery } from '@tanstack/react-query';
import type { App, GraphData } from '@/types';
import { fetchApps, fetchAppGraph } from '@/mocks/api';

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
