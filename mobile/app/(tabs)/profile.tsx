import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';
import { ProfileMenuItem } from '@/features/profile/components/ProfileMenuItem';



/**
 * ProfileScreen
 *
 * Visitor: welcome message + Sign Up / Log In buttons.
 * Authenticated: name, email, role badge, and Log Out button.
 *
 * TODO: Phase 8 — authenticated Customer view expands into a full
 * profile/settings screen (edit name, change password, etc.).
 * TODO: Phase 9 — authenticated Provider view should link into the
 * Provider Dashboard instead of this simple summary.
 */
export default function ProfileScreen() {
  const colors = useThemeColors();
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const signOut = useAuthStore((s) => s.signOut);
  const isAuthenticated = !!user;

  function handleSignOut() {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => signOut() },
    ]);
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
        <ThemedView style={styles.visitorContainer}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="person-outline" size={32} color={colors.primary} />
          </View>
          <ThemedText variant="h2" style={{ textAlign: 'center' }}>
            Welcome
          </ThemedText>
          <ThemedText
            color="textSecondary"
            style={{ textAlign: 'center', marginTop: theme.spacing.xs, marginBottom: theme.spacing.xl }}
          >
            Sign up or log in to manage your profile, save favourites, and chat with providers.
          </ThemedText>
          <Button
            label="Sign Up"
            onPress={() => router.push('/auth/register')}
            fullWidth
            style={styles.actionButton}
          />
          <Button
            label="Log In"
            variant="outline"
            onPress={() => router.push('/auth/login')}
            fullWidth
            style={[styles.actionButton, { marginTop: theme.spacing.sm }]}
          />
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ThemedView style={styles.container}>
        <View style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <ThemedText variant="h2" style={{ color: colors.textInverse }}>
              {profile?.full_name?.charAt(0).toUpperCase() ?? '?'}
            </ThemedText>
          </View>
          <ThemedText variant="h2" style={{ marginTop: theme.spacing.md }}>
            {profile?.full_name ?? 'User'}
          </ThemedText>
          <ThemedText color="textSecondary">{user?.email}</ThemedText>

          <View style={[styles.roleBadge, { backgroundColor: colors.primaryLight }]}>
            <Ionicons
              name={profile?.role === 'provider' ? 'briefcase-outline' : 'person-outline'}
              size={14}
              color={colors.primary}
            />
            <ThemedText variant="captionSemibold" style={{ color: colors.primary, marginLeft: 4 }}>
              {profile?.role === 'provider' ? 'Service Provider' : 'Customer'}
            </ThemedText>
          </View>
        </View>
<Button label="Provider Dashboard " onPress={() => router.push('/provider/dashboard')} style={{ marginTop: 12 }} />
       
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: theme.spacing.lg },
  visitorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  actionButton: { maxWidth: 320 },
  profileHeader: { alignItems: 'center', paddingTop: theme.spacing.xl, paddingBottom: theme.spacing.xl },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    marginTop: theme.spacing.md,
  },
  menuSection: { marginTop: 'auto', paddingBottom: theme.spacing.lg },
  sectionLabel: { marginBottom: theme.spacing.sm },
});