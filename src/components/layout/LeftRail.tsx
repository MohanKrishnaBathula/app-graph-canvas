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
import { useAppStore, type NavItem as NavItemType } from '@/store/appStore';
import { toast } from 'sonner';

interface NavItemConfig {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  key: NavItemType;
}

const navItems: NavItemConfig[] = [
  { icon: LayoutGrid, label: 'Apps', key: 'apps' },
  { icon: GitBranch, label: 'Flows', key: 'flows' },
  { icon: Database, label: 'Data', key: 'data' },
  { icon: Activity, label: 'Monitoring', key: 'monitoring' },
];

const bottomNavItems = [
  { icon: Settings, label: 'Settings' },
  { icon: HelpCircle, label: 'Help' },
];

export function LeftRail() {
  const activeNavItem = useAppStore((state) => state.activeNavItem);
  const setActiveNavItem = useAppStore((state) => state.setActiveNavItem);

  const handleNavClick = (item: NavItemConfig) => {
    setActiveNavItem(item.key);
    toast.success(`Switched to ${item.label}`);
  };

  const handleBottomNavClick = (label: string) => {
    toast.info(`${label} - Coming soon!`);
  };

  return (
    <aside className="w-14 bg-rail-bg border-r border-rail-border flex flex-col items-center py-3 hidden md:flex">
      {/* Main navigation */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        {navItems.map((item) => (
          <Tooltip key={item.label} delayDuration={100}>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleNavClick(item)}
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
                  activeNavItem === item.key
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
                onClick={() => handleBottomNavClick(item.label)}
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
