import { create } from 'zustand';
import type { InspectorTab } from '@/types';

interface AppState {
  // Selected entities
  selectedAppId: string | null;
  selectedNodeId: string | null;
  
  // UI state
  isMobilePanelOpen: boolean;
  activeInspectorTab: InspectorTab;
  
  // Actions
  setSelectedAppId: (id: string | null) => void;
  setSelectedNodeId: (id: string | null) => void;
  setMobilePanelOpen: (open: boolean) => void;
  setActiveInspectorTab: (tab: InspectorTab) => void;
  toggleMobilePanel: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  selectedAppId: null,
  selectedNodeId: null,
  isMobilePanelOpen: false,
  activeInspectorTab: 'config',
  
  // Actions
  setSelectedAppId: (id) => set({ selectedAppId: id, selectedNodeId: null }),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setMobilePanelOpen: (open) => set({ isMobilePanelOpen: open }),
  setActiveInspectorTab: (tab) => set({ activeInspectorTab: tab }),
  toggleMobilePanel: () => set((state) => ({ isMobilePanelOpen: !state.isMobilePanelOpen })),
}));

// Selectors for derived state
export const useSelectedAppId = () => useAppStore((state) => state.selectedAppId);
export const useSelectedNodeId = () => useAppStore((state) => state.selectedNodeId);
export const useIsMobilePanelOpen = () => useAppStore((state) => state.isMobilePanelOpen);
export const useActiveInspectorTab = () => useAppStore((state) => state.activeInspectorTab);
