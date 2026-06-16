import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/**
 * Root Layout
 *
 * Wraps the entire app. The <Stack> here controls top-level navigation
 * (the (tabs) group, plus future modal/auth routes in Phase 7).
 *
 * headerShown: false is set on EVERY screen here so that no route segment
 * name (like "(tabs)") ever renders as a default header title. Individual
 * screens (like HomeHeader) render their own custom headers instead.
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}