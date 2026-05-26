import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  altitude: number | null;
}

/**
 * Gets the current location of the device with high accuracy.
 * Requests permissions if not already granted.
 */
export async function getCurrentLocation(): Promise<LocationData> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  
  if (status !== 'granted') {
    throw new Error('Location permission denied');
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    altitude: location.coords.altitude,
  };
}
