import { Alert, View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { ProfileMenuItem } from '@/features/profile/components/ProfileMenuItem';
import { useAuthStore } from '@/store/authStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

// TODO: Replace with real social media URLs
const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/servenaija',
  facebook: 'https://facebook.com/servenaija',
  twitter: 'https://twitter.com/servenaija',
  telegram: 'https://t.me/servenaija',
};

/**
 * ProfileScreen
 *
 * Completely different layouts for customers vs providers:
 *
 * CUSTOMER: Avatar → Edit Profile → Contact Support → FAQs → Social Links → Log Out
 * PROVIDER: Avatar → Provider Dashboard (big button) → Edit Profile →
 *           Contact Support → FAQs → Social Links → Log Out
 *
 * Visitor: Welcome screen with Sign Up / Log In buttons.
 */
export default function ProfileScreen() {
  const colors = useThemeColors();
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const signOut = useAuthStore((s) => s.signOut);
  const isAuthenticated = !!user;
  const isProvider = profile?.role === 'provider';

  function handleSignOut() {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => signOut() },
    ]);
  }

  function handleSocialPress(url: string) {
    const { Linking } = require('react-native');
    Linking.openURL(url).catch(() =>
      Alert.alert('Could not open link', 'Please check your internet connection.')
    );
  }

  // ── Visitor State ──
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
        <ScrollView contentContainerStyle={styles.visitorContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.avatarCircle, { backgroundColor: colors.primary }]}>
            <Ionicons name="person-outline" size={32} color={colors.textInverse} />
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

          {/* Social links visible even to visitors */}
          <View style={styles.socialSection}>
            <ThemedText variant="label" color="textSecondary" style={styles.sectionLabel}>
              FOLLOW US
            </ThemedText>
            {renderSocialRow(colors, handleSocialPress)}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Authenticated (Customer or Provider) ──
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ThemedView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* ── Avatar + Identity ── */}
          <View style={styles.profileHeader}>
            <View style={[styles.avatarCircle, { backgroundColor: colors.primary }]}>
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
                name={isProvider ? 'briefcase-outline' : 'person-outline'}
                size={14}
                color={colors.primary}
              />
              <ThemedText variant="captionSemibold" style={{ color: colors.primary, marginLeft: 4 }}>
                {isProvider ? 'Service Provider' : 'Customer'}
              </ThemedText>
            </View>
          </View>

          {/* ── Provider Dashboard Button (providers only) ── */}
          {isProvider && (
            <View style={styles.dashboardButtonContainer}>
              <Button
                label="Provider Dashboard"
                onPress={() => router.push('/provider/dashboard')}
                fullWidth
              />
            </View>
          )}

          {/* ── ACCOUNT Section ── */}
          <View style={styles.menuSection}>
            <ThemedText variant="label" color="textSecondary" style={styles.sectionLabel}>
              ACCOUNT
            </ThemedText>
            <View style={[styles.menuCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <ProfileMenuItem
                icon="create-outline"
                label="Edit Profile"
                onPress={() => router.push('/profile/edit')}
              />
            </View>
          </View>

          {/* ── SUPPORT Section ── */}
          <View style={styles.menuSection}>
            <ThemedText variant="label" color="textSecondary" style={styles.sectionLabel}>
              SUPPORT
            </ThemedText>
            <View style={[styles.menuCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <ProfileMenuItem
                icon="headset-outline"
                label="Contact Support"
                onPress={() => router.push('/support')}
              />
              <ProfileMenuItem
                icon="help-circle-outline"
                label="FAQs"
                onPress={() => router.push('/faqs')}
              />
            </View>
          </View>

          {/* ── FOLLOW US Section ── */}
          <View style={styles.menuSection}>
            <ThemedText variant="label" color="textSecondary" style={styles.sectionLabel}>
              FOLLOW US
            </ThemedText>
            <View style={[styles.socialCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {renderSocialRow(colors, handleSocialPress)}
            </View>
          </View>

          {/* ── Log Out ── */}
          <View style={styles.logoutSection}>
            <Button
              label="Log Out"
              variant="outline"
              onPress={handleSignOut}
              fullWidth
              style={{ borderColor: colors.error }}
            />
          </View>

        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

function renderSocialRow(colors: any, onPress: (url: string) => void) {
  const SOCIAL_LINKS = {
    instagram: 'https://instagram.com/servenaija',
    facebook: 'https://facebook.com/servenaija',
    twitter: 'https://twitter.com/servenaija',
    telegram: 'https://t.me/servenaija',
  };

  const socials = [
    { key: 'instagram', icon: 'logo-instagram', color: '#E1306C', url: SOCIAL_LINKS.instagram },
    { key: 'facebook', icon: 'logo-facebook', color: '#1877F2', url: SOCIAL_LINKS.facebook },
    { key: 'twitter', icon: 'logo-twitter', color: '#1DA1F2', url: SOCIAL_LINKS.twitter },
    { key: 'telegram', icon: 'paper-plane-outline', color: '#0088CC', url: SOCIAL_LINKS.telegram },
  ];

  return (
    <View style={socialStyles.row}>
      {socials.map((s) => (
        <Pressable
          key={s.key}
          onPress={() => onPress(s.url)}
          style={({ pressed }) => [
            socialStyles.iconButton,
            { backgroundColor: s.color + '18', opacity: pressed ? 0.7 : 1 },
          ]}
          accessibilityLabel={`Follow us on ${s.key}`}
        >
          <Ionicons name={s.icon as any} size={26} color={s.color} />
        </Pressable>
      ))}
    </View>
  );
}

const socialStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', gap: theme.spacing.lg, paddingVertical: theme.spacing.md },
  iconButton: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  visitorContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  scrollContent: { paddingBottom: theme.spacing.xxxl },
  profileHeader: { alignItems: 'center', paddingTop: theme.spacing.xl, paddingBottom: theme.spacing.lg },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    marginTop: theme.spacing.sm,
  },
  dashboardButtonContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  menuSection: { paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.md },
  sectionLabel: { marginBottom: theme.spacing.xs, marginLeft: 2 },
  menuCard: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
  },
  socialCard: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
  },
  logoutSection: { paddingHorizontal: theme.spacing.lg, marginTop: theme.spacing.sm },
  actionButton: { maxWidth: 320, width: '100%' },
  socialSection: { marginTop: theme.spacing.xl, width: '100%' },
});