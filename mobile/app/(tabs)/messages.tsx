import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { AuthPrompt } from '@/features/auth/components/AuthPrompt';
import { useAuthStore } from '@/store/authStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

/**
 * MessagesScreen
 *
 * Visitor: AuthPrompt (sign up / log in to chat with providers).
 * Authenticated: placeholder for now — real chat list comes in Phase 10.
 */
export default function MessagesScreen() {
  const colors = useThemeColors();
  const isAuthenticated = useAuthStore((s) => !!s.user);

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
        <AuthPrompt
          icon="chatbubble-outline"
          title="Chat with providers"
          message="Sign up to message providers directly and discuss your service needs."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ThemedView style={styles.container}>
        <ThemedText variant="h1">Messages</ThemedText>
        <ThemedText color="textSecondary" style={{ marginTop: theme.spacing.sm }}>
          Your conversations will appear here. (Coming in Phase 10)
        </ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: theme.spacing.lg },
});