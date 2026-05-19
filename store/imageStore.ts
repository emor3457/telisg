import { create } from 'zustand';

interface ImageStore {
  currentImageUri: string | null;
  currentImageBase64: string | null;
  setCurrentImage: (uri: string, base64: string) => void;
  clearCurrentImage: () => void;
}

export const useImageStore = create<ImageStore>((set) => ({
  currentImageUri: null,
  currentImageBase64: null,
  setCurrentImage: (uri, base64) => set({ currentImageUri: uri, currentImageBase64: base64 }),
  clearCurrentImage: () => set({ currentImageUri: null, currentImageBase64: null }),
}));
