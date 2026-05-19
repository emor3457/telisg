import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  userName: string;
  userTitle: string;
  expertName: string;
  companyName: string;
  companyLogo: string | null;
  setUserName: (name: string) => void;
  setUserTitle: (title: string) => void;
  setExpertName: (name: string) => void;
  setCompanyName: (name: string) => void;
  setCompanyLogo: (logo: string | null) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      userName: '',
      userTitle: 'Saha Sorumlusu',
      expertName: 'İSG Uzmanı',
      companyName: 'TELISGPRO',
      companyLogo: null,
      setUserName: (userName) => set({ userName }),
      setUserTitle: (userTitle) => set({ userTitle }),
      setExpertName: (expertName) => set({ expertName }),
      setCompanyName: (companyName) => set({ companyName }),
      setCompanyLogo: (companyLogo) => set({ companyLogo }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
