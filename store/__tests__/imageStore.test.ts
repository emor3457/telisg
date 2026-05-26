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

  it('should reorder photos', () => {
    const p1 = { id: '1', uri: 'file://1.jpg', status: 'pending' as const };
    const p2 = { id: '2', uri: 'file://2.jpg', status: 'pending' as const };
    const p3 = { id: '3', uri: 'file://3.jpg', status: 'pending' as const };
    
    useImageStore.getState().addPhoto(p1);
    useImageStore.getState().addPhoto(p2);
    useImageStore.getState().addPhoto(p3);
    
    // Move p3 to index 0
    useImageStore.getState().reorderPhotos(2, 0);
    
    const photos = useImageStore.getState().photos;
    expect(photos[0].id).toBe('3');
    expect(photos[1].id).toBe('1');
    expect(photos[2].id).toBe('2');
  });
});
