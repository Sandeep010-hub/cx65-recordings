import { create } from 'zustand';

export interface Recording {
  id: string;
  ani: string;
  dnis: string;
  startTime: string; // ISO string or formatted date
  callFlow: string;
  duration: number; // in seconds
  direction: 'Inbound' | 'Outbound' | 'Internal';
  agent: string;
  queue: string;
}

export interface FilterState {
  interval: string;
  startDate: string | null;
  endDate: string | null;
  matchAll: boolean;
  ani: string;
  dnis: string;
  callFlow: string;
  mediaType: string;
  direction: string;
  timezone: string;
}

interface AppState {
  activeRecording: Recording | null;
  isPlaying: boolean;
  activeFilters: FilterState;
  isFilterDrawerOpen: boolean;
  selectedRows: string[];
  
  setActiveRecording: (recording: Recording | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  setIsFilterDrawerOpen: (isOpen: boolean) => void;
  setSelectedRows: (ids: string[]) => void;
}

export const useStore = create<AppState>((set) => ({
  activeRecording: null,
  isPlaying: false,
  activeFilters: {
    interval: 'Today',
    startDate: null,
    endDate: null,
    matchAll: true,
    ani: '',
    dnis: '',
    callFlow: '',
    mediaType: '',
    direction: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  isFilterDrawerOpen: false,
  selectedRows: [],
  
  setActiveRecording: (recording) => set({ activeRecording: recording }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setFilters: (filters) => set((state) => ({ 
    activeFilters: { ...state.activeFilters, ...filters } 
  })),
  setIsFilterDrawerOpen: (isOpen) => set({ isFilterDrawerOpen: isOpen }),
  setSelectedRows: (ids) => set({ selectedRows: ids }),
}));
