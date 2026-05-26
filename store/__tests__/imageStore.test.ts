import { useImageStore } from '../imageStore';

describe('imageStore', () => {
  beforeEach(() => {
    useImageStore.getState().clearPhotos();
  });

  it('should add a photo asset', () => {
    const asset = { id: '1', uri: 'file://test.jpg', status: 'pending' as const };
    useImageStore.getState().addPhoto(asset);
    expect(useImageStore.getState().photos).toContainEqual(asset);
  });

  it('should clear all photos', () => {
    useImageStore.getState().addPhoto({ id: '1', uri: 'file://test.jpg', status: 'pending' as const });
    useImageStore.getState().clearPhotos();
    expect(useImageStore.getState().photos).toHaveLength(0);
  });
});
