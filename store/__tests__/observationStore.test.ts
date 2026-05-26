import { useObservationStore } from '../observationStore';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe('observationStore', () => {
  it('should add an observation with multiple photos and location', () => {
    const obs: any = {
      id: '1',
      displayId: 'OBS-001',
      hazard: 'Test Hazard',
      riskLevel: 'HIGH',
      controls: ['Control 1'],
      photos: [{ id: 'p1', uri: 'file://p1.jpg', status: 'pending' as const }],
      location: { latitude: 10, longitude: 20, altitude: 30 },
      timestamp: Date.now(),
      date: new Date().toISOString(),
    };
    useObservationStore.getState().addObservation(obs);
    expect(useObservationStore.getState().observations).toContainEqual(obs);
  });
});
