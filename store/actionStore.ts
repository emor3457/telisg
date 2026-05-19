import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncData } from '../services/syncService';

interface ActionItem {
  id: string;
  displayId: string;
  parentDisplayId?: string;
  title: string;
  status: string;
  targetDate?: string;
  riskLevel?: string;
}

interface ActionStore {
  actions: ActionItem[];
  addAction: (action: ActionItem) => void;
  updateActionStatus: (id: string, newStatus: string) => void;
  deleteAction: (id: string) => void;
}

export const useActionStore = create<ActionStore>()(
  persist(
    (set) => ({
      actions: [],
      addAction: (action) => {
        set((state) => ({
          actions: [...state.actions, action],
        }));
        setTimeout(() => syncData(), 500);
      },
      updateActionStatus: (id, newStatus) => {
        set((state) => ({
          actions: state.actions.map(action => 
            action.id === id ? { ...action, status: newStatus } : action
          )
        }));
        setTimeout(() => syncData(), 500);
      },
      deleteAction: (id) =>
        set((state) => ({
          actions: state.actions.filter((action) => action.id !== id),
        })),
    }),
    {
      name: 'action-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
