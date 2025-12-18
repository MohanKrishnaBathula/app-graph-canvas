import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { AppSelector } from '@/components/panel/AppSelector';
import { NodeInspector } from '@/components/panel/NodeInspector';
import { cn } from '@/lib/utils';
import type { ServiceNode } from '@/types';

interface RightPanelProps {
  selectedNode?: ServiceNode;
  onNodeUpdate?: (nodeId: string, data: Partial<ServiceNode['data']>) => void;
}

export function RightPanel({ selectedNode, onNodeUpdate }: RightPanelProps) {
  const selectedNodeId = useAppStore((state) => state.selectedNodeId);
  const isMobilePanelOpen = useAppStore((state) => state.isMobilePanelOpen);
  const setMobilePanelOpen = useAppStore((state) => state.setMobilePanelOpen);

  return (
    <>
      {/* Desktop Panel */}
      <aside className="hidden md:flex w-80 bg-panel-bg border-l border-panel-border flex-col">
        <PanelContent 
          selectedNode={selectedNode} 
          selectedNodeId={selectedNodeId}
          onNodeUpdate={onNodeUpdate}
        />
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobilePanelOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobilePanelOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside 
        className={cn(
          'fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-panel-bg border-l border-panel-border flex flex-col z-50 md:hidden transition-transform duration-300 ease-out',
          isMobilePanelOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-3 border-b border-border">
          <span className="text-sm font-medium">Panel</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setMobilePanelOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <PanelContent 
          selectedNode={selectedNode} 
          selectedNodeId={selectedNodeId}
          onNodeUpdate={onNodeUpdate}
        />
      </aside>
    </>
  );
}

interface PanelContentProps {
  selectedNode?: ServiceNode;
  selectedNodeId: string | null;
  onNodeUpdate?: (nodeId: string, data: Partial<ServiceNode['data']>) => void;
}

function PanelContent({ selectedNode, selectedNodeId, onNodeUpdate }: PanelContentProps) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* App Selector Section */}
      <div className="flex-shrink-0">
        <AppSelector />
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Node Inspector Section */}
      <div className="flex-1 overflow-y-auto">
        {selectedNodeId && selectedNode ? (
          <NodeInspector node={selectedNode} onUpdate={onNodeUpdate} />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm p-4 text-center">
            Select a node on the canvas to inspect its properties
          </div>
        )}
      </div>
    </div>
  );
}
