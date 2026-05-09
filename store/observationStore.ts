import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
export interface ObservationItem {
  id: string;
  displayId: string;
  hazard: string;
  riskLevel: string;
  controls: string[];
  imageUri: string | null;
  date: string;
}

interface ObservationStore {
  observations: ObservationItem[];
  addObservation: (obs: ObservationItem) => void;
  removeObservation: (id: string) => void;
}

export const useObservationStore = create<ObservationStore>()(
  persist(
    (set) => ({
      observations: [],
      addObservation: (obs) =>
        set((state) => ({
          observations: [obs, ...state.observations],
        })),
      removeObservation: (id) =>
        set((state) => ({
          observations: state.observations.filter((obs) => obs.id !== id),
        })),
    }),
    {
      name: 'observation-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
