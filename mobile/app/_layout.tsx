import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from '@/store/authStore';
import LoadingScreen from '@/components/ui/LoadingScreen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const initialize = useAuthStore((s) => s.initialize);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await initialize();
      setAppReady(true);
      await SplashScreen.hideAsync();
    }
    prepare();
  }, []);

  if (!appReady) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}