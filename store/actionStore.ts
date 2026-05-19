import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';


export interface ActionItem {
  id: string;
  displayId: string;
  parentObservationId?: string; // Bağlı olduğu gözlemin raw id'si
  parentDisplayId?: string;
  title: string;
  status: string;
  targetDate?: string;
  riskLevel?: string;
  department?: string;
  location?: string;
  equipment?: string;
}

interface ActionStore {
  actions: ActionItem[];
  addAction: (action: ActionItem) => void;
  updateActionStatus: (id: string, newStatus: string) => void;
  deleteAction: (id: string) => void;
  removeByParentObservationId: (observationId: string) => void;
}

export const useActionStore = create<ActionStore>()(
  persist(
    (set) => ({
      actions: [],
      addAction: (action) => {
        set((state) => ({
          actions: [...state.actions, action],
        }));
        setTimeout(() => {
          import('../services/syncService').then((m) => m.syncData());
        }, 500);
      },
      updateActionStatus: (id, newStatus) => {
        set((state) => ({
          actions: state.actions.map(action =>
            action.id === id ? { ...action, status: newStatus } : action
          )
        }));
        setTimeout(() => {
          import('../services/syncService').then((m) => m.syncData());
        }, 500);
      },
      deleteAction: (id) => {
        set((state) => ({
          actions: state.actions.filter((action) => action.id !== id),
        }));
        // Sunucudan da sil
        setTimeout(() => deleteRemoteAction(id), 500);
      },
      // Bir gözlem silindiğinde bağlı tüm aksiyonları sil (cascade)
      removeByParentObservationId: (observationId) => {
        set((state) => {
          const toDelete = state.actions.filter(
            (a) => a.parentObservationId === observationId
          );
          // Sunucudan da sil
          toDelete.forEach((a) => {
            setTimeout(() => deleteRemoteAction(a.id), 500);
          });
          return {
            actions: state.actions.filter(
              (a) => a.parentObservationId !== observationId
            ),
          };
        });
      },
    }),
    {
      name: 'action-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

async function deleteRemoteAction(id: string) {
  try {
    const { supabase } = await import('../services/supabase');
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await supabase
      .from('actions')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);
  } catch (error) {
    console.error('Remote action delete error:', error);
  }
}
