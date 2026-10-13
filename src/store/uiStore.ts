import { create } from 'zustand';

type AppPage =
  | 'overview'
  | 'ground'
  | 'cafeteria'
  | 'sensorData'
  | 'alerts'
  | 'insights'
  | 'map';

interface UiState {
  activePage: AppPage;
  setPage: (page: AppPage) => void;
}

export const useUiStore = create<UiState>((set) => ({
  activePage: 'overview',
  setPage: (activePage) => set({ activePage }),
}));
