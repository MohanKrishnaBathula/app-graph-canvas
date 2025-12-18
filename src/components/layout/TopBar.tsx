import { Layers, Maximize2, ZoomIn, ZoomOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';

interface TopBarProps {
  onFitView?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

export function TopBar({ onFitView, onZoomIn, onZoomOut }: TopBarProps) {
  const toggleMobilePanel = useAppStore((state) => state.toggleMobilePanel);

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

      {/* Right: Placeholder actions (desktop) */}
      <div className="hidden md:flex items-center gap-2">
        <Button variant="outline" size="sm" className="text-xs h-8">
          Export
        </Button>
        <Button variant="default" size="sm" className="text-xs h-8">
          Deploy
        </Button>
      </div>
    </header>
  );
}
