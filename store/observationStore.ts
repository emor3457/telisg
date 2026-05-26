import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PhotoAsset } from './imageStore';


export interface ObservationItem {
  id: string;
  displayId: string;
  hazard: string;
  riskLevel: string;
  controls: string[];
  photos: PhotoAsset[];
  location?: {
    latitude: number;
    longitude: number;
    altitude: number | null;
  };
  timestamp: number;
  date: string;
  // Yeni alanlar (v1.2.2)
  location_name?: string;    // Ana lokasyon (renamed from location to avoid conflict)
  subLocation?: string;     // Alt lokasyon
  department?: string;      // Sorumlu departman
  activity?: string;        // Faaliyet türü
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
      addObservation: (obs) => {
        set((state) => ({
          observations: [obs, ...state.observations],
        }));
        // Arka planda senkronize et
        if (process.env.NODE_ENV !== 'test') {
          setTimeout(() => {
            import('../services/syncService').then((m) => m.syncData());
          }, 500);
        }
      },
      removeObservation: (id) => {
        set((state) => ({
          observations: state.observations.filter((obs) => obs.id !== id),
        }));
        // İlgili aksiyonları da sil (cascade delete)
        if (process.env.NODE_ENV !== 'test') {
          setTimeout(() => {
            import('../store/actionStore').then((m) => {
              m.useActionStore.getState().removeByParentObservationId(id);
            });
          }, 100);
          // Silme işlemini sunucuya bildir
          setTimeout(() => deleteRemoteObservation(id), 500);
        }
      },
    }),
    {
      name: 'observation-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

async function deleteRemoteObservation(id: string) {
  try {
    const { supabase } = await import('../services/supabase');
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await supabase
      .from('observations')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);
  } catch (error) {
    console.error('Remote delete error:', error);
  }
}
