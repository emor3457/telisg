import { Stack } from 'expo-router';
import { View } from 'react-native';
import { AuthProvider } from '../context/AuthContext';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { registerBackgroundSync } from '../services/syncService';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Poppins-Bold': 'https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Bold.ttf',
    'Poppins-SemiBold': 'https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-SemiBold.ttf',
    'Lora-Regular': 'https://github.com/google/fonts/raw/main/ofl/lora/Lora-Regular.ttf',
    'Lora-Medium': 'https://github.com/google/fonts/raw/main/ofl/lora/Lora-Medium.ttf',
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    registerBackgroundSync();
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
      </AuthProvider>
    </View>
  );
}
