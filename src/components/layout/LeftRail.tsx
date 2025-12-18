import { 
  LayoutGrid, 
  GitBranch, 
  Settings, 
  Database,
  Activity,
  HelpCircle
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { icon: LayoutGrid, label: 'Apps', active: true },
  { icon: GitBranch, label: 'Flows' },
  { icon: Database, label: 'Data' },
  { icon: Activity, label: 'Monitoring' },
];

const bottomNavItems: NavItem[] = [
  { icon: Settings, label: 'Settings' },
  { icon: HelpCircle, label: 'Help' },
];

export function LeftRail() {
  return (
    <aside className="w-14 bg-rail-bg border-r border-rail-border flex flex-col items-center py-3 hidden md:flex">
      {/* Main navigation */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        {navItems.map((item) => (
          <Tooltip key={item.label} delayDuration={100}>
            <TooltipTrigger asChild>
              <button
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
                  item.active 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-rail-icon hover:text-foreground hover:bg-muted'
                )}
              >
                <item.icon className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-popover border-border">
              {item.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </nav>

      {/* Bottom navigation */}
      <nav className="flex flex-col items-center gap-1">
        {bottomNavItems.map((item) => (
          <Tooltip key={item.label} delayDuration={100}>
            <TooltipTrigger asChild>
              <button
                className="w-10 h-10 rounded-lg flex items-center justify-center text-rail-icon hover:text-foreground hover:bg-muted transition-colors"
              >
                <item.icon className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-popover border-border">
              {item.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </nav>
    </aside>
  );
}
