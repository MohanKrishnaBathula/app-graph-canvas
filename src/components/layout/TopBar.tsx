import { Layers, Maximize2, ZoomIn, ZoomOut, Menu, Download, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { useToast } from '@/hooks/use-toast';
import type { Node, Edge } from '@xyflow/react';

interface TopBarProps {
  onFitView?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onExport?: () => { nodes: Node[]; edges: Edge[] } | undefined;
}

export function TopBar({ onFitView, onZoomIn, onZoomOut, onExport }: TopBarProps) {
  const toggleMobilePanel = useAppStore((state) => state.toggleMobilePanel);
  const selectedAppId = useAppStore((state) => state.selectedAppId);
  const { toast } = useToast();

  const handleExport = () => {
    const graphData = onExport?.();
    if (!graphData || graphData.nodes.length === 0) {
      toast({
        title: 'Nothing to export',
        description: 'Select an app and add some nodes first.',
        variant: 'destructive',
      });
      return;
    }

    const exportData = {
      appId: selectedAppId,
      exportedAt: new Date().toISOString(),
      nodes: graphData.nodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: n.position,
        data: n.data,
      })),
      edges: graphData.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `graph-${selectedAppId || 'untitled'}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Graph exported',
      description: 'Your graph has been downloaded as JSON.',
    });
  };

  const handleDeploy = () => {
    if (!selectedAppId) {
      toast({
        title: 'No app selected',
        description: 'Please select an app to deploy.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Deploying...',
      description: `Starting deployment for app "${selectedAppId}"`,
    });

    // Simulate deployment
    setTimeout(() => {
      toast({
        title: 'Deployment successful',
        description: 'Your app graph has been deployed successfully.',
      });
    }, 2000);
  };

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
      {/* Left: Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
          <Layers className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-foreground">App Graph Builder</h1>
          <p className="text-xs text-muted-foreground">Visual architecture editor</p>
        </div>
      </div>

      {/* Center: Canvas controls */}
      <div className="hidden md:flex items-center gap-1 bg-secondary rounded-lg p-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomOut}
          className="h-7 w-7 p-0 hover:bg-muted"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          className="h-7 w-7 p-0 hover:bg-muted"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={onFitView}
          className="h-7 px-2 hover:bg-muted text-xs"
        >
          <Maximize2 className="w-4 h-4 mr-1" />
          Fit
        </Button>
      </div>

      {/* Right: Mobile menu toggle */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden"
        onClick={toggleMobilePanel}
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Right: Actions (desktop) */}
      <div className="hidden md:flex items-center gap-2">
        <Button variant="outline" size="sm" className="text-xs h-8" onClick={handleExport}>
          <Download className="w-3 h-3 mr-1" />
          Export
        </Button>
        <Button variant="default" size="sm" className="text-xs h-8" onClick={handleDeploy}>
          <Rocket className="w-3 h-3 mr-1" />
          Deploy
        </Button>
      </div>
    </header>
  );
}
