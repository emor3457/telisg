import { create } from 'zustand';

export interface PhotoAsset {
  id: string;
  uri: string;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
}

interface ImageStore {
  photos: PhotoAsset[];
  addPhoto: (photo: PhotoAsset) => void;
  removePhoto: (id: string) => void;
  updatePhotoStatus: (id: string, status: PhotoAsset['status']) => void;
  clearPhotos: () => void;
}

export const useImageStore = create<ImageStore>((set) => ({
  photos: [],
  addPhoto: (photo) => set((state) => ({ photos: [...state.photos, photo] })),
  removePhoto: (id) => set((state) => ({ photos: state.photos.filter((p) => p.id !== id) })),
  updatePhotoStatus: (id, status) =>
    set((state) => ({
      photos: state.photos.map((p) => (p.id === id ? { ...p, status } : p)),
    })),
  clearPhotos: () => set({ photos: [] }),
}));
