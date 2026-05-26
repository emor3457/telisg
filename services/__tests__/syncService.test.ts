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

describe('syncService - uploadFileWithSignedUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({
      blob: jest.fn().mockResolvedValue(new Blob(['test'], { type: 'image/jpeg' })),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
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

    await uploadFileWithSignedUrl('photo-1', 'file://test.jpg', 'observations/photo-1.jpg');

    expect(mockCreateSignedUrl).toHaveBeenCalledWith('observations/photo-1.jpg');
    expect(mockUploadToSignedUrl).toHaveBeenCalledWith('https://signed-url.com', expect.any(Object));
  });

  it('should handle upload failure', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: { user: { id: '1' } } } });
    
    const mockCreateSignedUrl = jest.fn().mockResolvedValue({
      data: null,
      error: { message: 'Failed to create signed URL' },
    });

    (supabase.storage.from as jest.Mock).mockReturnValue({
      createSignedUploadUrl: mockCreateSignedUrl,
    });

    await expect(uploadFileWithSignedUrl('photo-1', 'file://test.jpg', 'observations/photo-1.jpg'))
      .rejects.toThrow('Failed to create signed URL');
  });
});
