import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Tip Tanımları ---
export interface SubLocation {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  name: string;
  subLocations: SubLocation[];
}

export interface Department {
  id: string;
  name: string;
}

export interface Activity {
  id: string;
  name: string;
}

// ID format token'ları: {LOC} {DEPT} {TYPE} {YEAR} {SEQ} {MONTH}
// Örnek: "{LOC}-{TYPE}{YEAR}-{SEQ}" => "IST-SG26-0001"
const DEFAULT_ID_FORMAT = '{LOC}-{TYPE}{YEAR}-{SEQ}';

interface SettingsState {
  // Mevcut alanlar
  userName: string;
  userTitle: string;
  expertName: string;
  companyName: string;
  companyLogo: string | null;

  // Yeni: Listeler
  locations: Location[];
  departments: Department[];
  activities: Activity[];

  // Yeni: ID Format
  idFormat: string;
  locationCode: string; // ID'de kullanılacak kısa konum kodu (örn. "IST")

  // Yeni: AI Ayarları
  customApiKey: string;
  aiModel: string;

  // --- Mevcut Setter'lar ---
  setUserName: (name: string) => void;
  setUserTitle: (title: string) => void;
  setExpertName: (name: string) => void;
  setCompanyName: (name: string) => void;
  setCompanyLogo: (logo: string | null) => void;

  // --- Lokasyon CRUD ---
  addLocation: (name: string) => void;
  updateLocation: (id: string, name: string) => void;
  removeLocation: (id: string) => void;
  addSubLocation: (locationId: string, name: string) => void;
  updateSubLocation: (locationId: string, subId: string, name: string) => void;
  removeSubLocation: (locationId: string, subId: string) => void;

  // --- Departman CRUD ---
  addDepartment: (name: string) => void;
  updateDepartment: (id: string, name: string) => void;
  removeDepartment: (id: string) => void;

  // --- Faaliyet CRUD ---
  addActivity: (name: string) => void;
  updateActivity: (id: string, name: string) => void;
  removeActivity: (id: string) => void;

  // --- ID Format ---
  setIdFormat: (format: string) => void;
  setLocationCode: (code: string) => void;

  // --- AI Ayarları ---
  setCustomApiKey: (key: string) => void;
  setAiModel: (model: string) => void;
}

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Varsayılan değerler
      userName: '',
      userTitle: 'Saha Sorumlusu',
      expertName: 'İSG Uzmanı',
      companyName: 'TELISGPRO',
      companyLogo: null,
      idFormat: DEFAULT_ID_FORMAT,
      locationCode: 'IST',
      customApiKey: '',
      aiModel: 'gemini-2.5-flash',

      // Varsayılan lokasyonlar
      locations: [
        {
          id: generateId(),
          name: 'C Hangar',
          subLocations: [
            { id: generateId(), name: 'Dinlenme Alanı' },
            { id: generateId(), name: 'Uçak Parkı' },
          ],
        },
        {
          id: generateId(),
          name: 'D Hangar',
          subLocations: [
            { id: generateId(), name: 'Envanter Deposu' },
            { id: generateId(), name: 'Bakım Platformu' },
          ],
        },
        {
          id: generateId(),
          name: 'LMH Binası',
          subLocations: [
            { id: generateId(), name: 'Tozlu Oda' },
            { id: generateId(), name: 'Ofis Katı' },
          ],
        },
      ],

      // Varsayılan departmanlar
      departments: [
        { id: generateId(), name: 'Teknik Temizlik' },
        { id: generateId(), name: 'Uçak Bakım' },
        { id: generateId(), name: 'Hat Bakım' },
        { id: generateId(), name: 'İSG Departmanı' },
        { id: generateId(), name: 'Kalite Güvence' },
      ],

      // Varsayılan faaliyetler
      activities: [
        { id: generateId(), name: 'Bakım ve Onarım' },
        { id: generateId(), name: 'Temizlik' },
        { id: generateId(), name: 'Denetim / İnspeksiyon' },
        { id: generateId(), name: 'Yükleme / Boşaltma' },
        { id: generateId(), name: 'Saha Dolaşımı' },
        { id: generateId(), name: 'Ekipman Kullanımı' },
      ],

      // --- Mevcut setter'lar ---
      setUserName: (userName) => set({ userName }),
      setUserTitle: (userTitle) => set({ userTitle }),
      setExpertName: (expertName) => set({ expertName }),
      setCompanyName: (companyName) => set({ companyName }),
      setCompanyLogo: (companyLogo) => set({ companyLogo }),

      // --- Lokasyon CRUD ---
      addLocation: (name) =>
        set((state) => ({
          locations: [...state.locations, { id: generateId(), name, subLocations: [] }],
        })),
      updateLocation: (id, name) =>
        set((state) => ({
          locations: state.locations.map((l) => (l.id === id ? { ...l, name } : l)),
        })),
      removeLocation: (id) =>
        set((state) => ({
          locations: state.locations.filter((l) => l.id !== id),
        })),
      addSubLocation: (locationId, name) =>
        set((state) => ({
          locations: state.locations.map((l) =>
            l.id === locationId
              ? { ...l, subLocations: [...l.subLocations, { id: generateId(), name }] }
              : l
          ),
        })),
      updateSubLocation: (locationId, subId, name) =>
        set((state) => ({
          locations: state.locations.map((l) =>
            l.id === locationId
              ? {
                  ...l,
                  subLocations: l.subLocations.map((s) => (s.id === subId ? { ...s, name } : s)),
                }
              : l
          ),
        })),
      removeSubLocation: (locationId, subId) =>
        set((state) => ({
          locations: state.locations.map((l) =>
            l.id === locationId
              ? { ...l, subLocations: l.subLocations.filter((s) => s.id !== subId) }
              : l
          ),
        })),

      // --- Departman CRUD ---
      addDepartment: (name) =>
        set((state) => ({
          departments: [...state.departments, { id: generateId(), name }],
        })),
      updateDepartment: (id, name) =>
        set((state) => ({
          departments: state.departments.map((d) => (d.id === id ? { ...d, name } : d)),
        })),
      removeDepartment: (id) =>
        set((state) => ({
          departments: state.departments.filter((d) => d.id !== id),
        })),

      // --- Faaliyet CRUD ---
      addActivity: (name) =>
        set((state) => ({
          activities: [...state.activities, { id: generateId(), name }],
        })),
      updateActivity: (id, name) =>
        set((state) => ({
          activities: state.activities.map((a) => (a.id === id ? { ...a, name } : a)),
        })),
      removeActivity: (id) =>
        set((state) => ({
          activities: state.activities.filter((a) => a.id !== id),
        })),

      // --- ID Format ---
      setIdFormat: (idFormat) => set({ idFormat }),
      setLocationCode: (locationCode) => set({ locationCode }),

      // --- AI Ayarları ---
      setCustomApiKey: (customApiKey) => set({ customApiKey }),
      setAiModel: (aiModel) => set({ aiModel }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
