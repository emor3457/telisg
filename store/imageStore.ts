import { create } from 'zustand';

export interface PhotoAsset {
  id: string;
  uri: string;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  location?: {
    latitude: number;
    longitude: number;
    altitude: number | null;
  };
}

interface ImageStore {
  photos: PhotoAsset[];
  addPhoto: (photo: PhotoAsset) => void;
  removePhoto: (id: string) => void;
  reorderPhotos: (fromIndex: number, toIndex: number) => void;
  updatePhotoStatus: (id: string, status: PhotoAsset['status']) => void;
  clearPhotos: () => void;
}

export const useImageStore = create<ImageStore>((set) => ({
  photos: [],
  addPhoto: (photo) => set((state) => ({ photos: [...state.photos, photo] })),
  removePhoto: (id) => set((state) => ({ photos: state.photos.filter((p) => p.id !== id) })),
  reorderPhotos: (fromIndex, toIndex) =>
    set((state) => {
      const newPhotos = [...state.photos];
      const [removed] = newPhotos.splice(fromIndex, 1);
      newPhotos.splice(toIndex, 0, removed);
      return { photos: newPhotos };
    }),
  updatePhotoStatus: (id, status) =>
    set((state) => ({
      photos: state.photos.map((p) => (p.id === id ? { ...p, status } : p)),
    })),
  clearPhotos: () => set({ photos: [] }),
}));
