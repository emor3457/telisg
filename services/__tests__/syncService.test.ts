import { uploadFileWithSignedUrl } from '../syncService';
import { supabase } from '../supabase';
import { useImageStore } from '../../store/imageStore';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('../supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
    storage: {
      from: jest.fn().mockReturnValue({
        createSignedUploadUrl: jest.fn(),
        uploadToSignedUrl: jest.fn(),
      }),
    },
  },
}));

jest.mock('../../store/imageStore', () => ({
  useImageStore: {
    getState: jest.fn(),
    setState: jest.fn(),
  },
}));

jest.mock('expo-task-manager', () => ({
  defineTask: jest.fn(),
  isTaskRegisteredAsync: jest.fn(),
}));

jest.mock('expo-background-fetch', () => ({
  registerTaskAsync: jest.fn(),
  BackgroundFetchResult: {
    NewData: 1,
    NoData: 2,
    Failed: 3,
  },
}));

describe('syncService - uploadFileWithSignedUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    global.fetch = jest.fn().mockResolvedValue({
      blob: jest.fn().mockResolvedValue(new Blob(['test'], { type: 'image/jpeg' })),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('should upload file successfully using signed URL', async () => {
    const mockSession = { user: { id: 'user-123' } };
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: mockSession } });

    const mockCreateSignedUrl = jest.fn().mockResolvedValue({
      data: { signedUrl: 'https://signed-url.com', token: 'token123' },
      error: null,
    });
    const mockUploadToSignedUrl = jest.fn().mockResolvedValue({ error: null });

    (supabase.storage.from as jest.Mock).mockReturnValue({
      createSignedUploadUrl: mockCreateSignedUrl,
      uploadToSignedUrl: mockUploadToSignedUrl,
    });

    const mockPhoto = { id: 'photo-1', uri: 'file://test.jpg', status: 'pending' };
    (useImageStore.getState as unknown as jest.Mock).mockReturnValue({
        updatePhotoStatus: jest.fn(),
    });

    const promise = uploadFileWithSignedUrl('photo-1', 'file://test.jpg', 'observations/photo-1.jpg');
    jest.runAllTimers();
    await promise;

    expect(mockCreateSignedUrl).toHaveBeenCalledWith('observations/photo-1.jpg');
    expect(mockUploadToSignedUrl).toHaveBeenCalledWith('https://signed-url.com', expect.any(Object));
  });

  it('should handle upload failure with retries', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: { user: { id: '1' } } } });

    const mockCreateSignedUrl = jest.fn().mockResolvedValue({
      data: null,
      error: { message: 'Failed to create signed URL' },
    });

    (supabase.storage.from as jest.Mock).mockReturnValue({
      createSignedUploadUrl: mockCreateSignedUrl,
    });

    const promise = uploadFileWithSignedUrl('photo-1', 'file://test.jpg', 'observations/photo-1.jpg');

    // Fast-forward through retries
    for(let i=0; i<4; i++) {
        jest.runAllTimers();
        await Promise.resolve(); // allow promises to resolve
    }

    await expect(promise).rejects.toThrow('Failed to create signed URL');
    expect(mockCreateSignedUrl).toHaveBeenCalledTimes(4); // initial + 3 retries
  }, 10000);
});
