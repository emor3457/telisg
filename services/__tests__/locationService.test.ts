import * as Location from 'expo-location';
import { getCurrentLocation } from '../locationService';

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  Accuracy: {
    High: 4,
  },
}));

describe('locationService', () => {
  it('should return location when permissions are granted', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: {
        latitude: 10,
        longitude: 20,
        altitude: 30,
      },
    });

    const location = await getCurrentLocation();
    expect(location).toEqual({ latitude: 10, longitude: 20, altitude: 30 });
  });

  it('should throw error when permissions are denied', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });

    await expect(getCurrentLocation()).rejects.toThrow('Location permission denied');
  });
});
