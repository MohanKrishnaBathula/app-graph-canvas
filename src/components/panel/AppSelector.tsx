import { ChevronDown, Box, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useApps } from '@/hooks/useApi';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';

export function AppSelector() {
  const { data: apps, isLoading, isError, refetch } = useApps();
  const selectedAppId = useAppStore((state) => state.selectedAppId);
  const setSelectedAppId = useAppStore((state) => state.setSelectedAppId);

  const selectedApp = apps?.find((app) => app.id === selectedAppId);

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Applications
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className={cn('w-3 h-3', isLoading && 'animate-spin')} />
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <AlertCircle className="w-8 h-8 text-destructive mb-2" />
          <p className="text-sm text-muted-foreground mb-2">Failed to load apps</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      )}

      {!isLoading && !isError && apps && (
        <div className="space-y-1">
          {apps.map((app) => (
            <button
              key={app.id}
              onClick={() => setSelectedAppId(app.id)}
              className={cn(
                'w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors',
                selectedAppId === app.id
                  ? 'bg-primary/10 border border-primary/30'
                  : 'hover:bg-muted border border-transparent'
              )}
            >
              <div className={cn(
                'w-8 h-8 rounded-md flex items-center justify-center',
                selectedAppId === app.id ? 'bg-primary/20' : 'bg-muted'
              )}>
                <Box className={cn(
                  'w-4 h-4',
                  selectedAppId === app.id ? 'text-primary' : 'text-muted-foreground'
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-sm font-medium truncate',
                  selectedAppId === app.id ? 'text-foreground' : 'text-foreground/80'
                )}>
                  {app.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {app.nodeCount} nodes
                </p>
              </div>
              <ChevronDown className={cn(
                'w-4 h-4 text-muted-foreground transition-transform',
                selectedAppId === app.id && 'rotate-180'
              )} />
            </button>
          ))}
        </div>
      )}

      {/* Selected app details */}
      {selectedApp && (
        <div className="mt-3 p-2 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">{selectedApp.description}</p>
        </div>
      )}
    </div>
  );
}
