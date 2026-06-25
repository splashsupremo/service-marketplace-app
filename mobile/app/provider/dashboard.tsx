import { useEffect } from 'react';
import { View, ScrollView, Pressable, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { ProfileMenuItem } from '@/features/profile/components/ProfileMenuItem';
import { StatBlock } from '@/features/provider-dashboard/components/StatBlock';
import { useProviderStore } from '@/store/providerStore';
import { useAuthStore } from '@/store/authStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

/**
 * ProviderDashboardScreen
 *
 * Only accessible to users with role === 'provider'.
 * Customers who somehow navigate here see a clear "not authorised" message.
 *
 * Three states for providers:
 * 1. Loading — spinner while fetchMyProvider() runs
 * 2. No listing yet — "Create Your Listing" prompt
 * 3. Has a listing — real stats row + menu links
 */
export default function ProviderDashboardScreen() {
  const colors = useThemeColors();

  const profile = useAuthStore((s) => s.profile);

  const myProvider = useProviderStore((s) => s.myProvider);
  const myServices = useProviderStore((s) => s.myServices);
  const isLoading = useProviderStore((s) => s.isLoading);
  const hasFetched = useProviderStore((s) => s.hasFetched);
  const fetchMyProvider = useProviderStore((s) => s.fetchMyProvider);

  useEffect(() => {
    // Only fetch if the user is actually a provider — no point querying otherwise
    if (profile?.role === 'provider') {
      fetchMyProvider();
    }
  }, [profile?.role]);

  // ── Shared header component ──
  function Header({ title }: { title: string }) {
    return (
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={8} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <ThemedText variant="h3" style={{ marginLeft: theme.spacing.md }}>
          {title}
        </ThemedText>
      </View>
    );
  }

  // ── Role Guard — customers should never reach here ──
  if (profile && profile.role !== 'provider') {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
        <ThemedView style={styles.container}>
          <Header title="Provider Dashboard" />
          <View style={styles.centreContainer}>
            <View style={[styles.iconCircle, { backgroundColor: colors.errorLight }]}>
              <Ionicons name="lock-closed-outline" size={28} color={colors.error} />
            </View>
            <ThemedText variant="h3" style={{ textAlign: 'center' }}>
              Access Restricted
            </ThemedText>
            <ThemedText
              color="textSecondary"
              style={{ textAlign: 'center', marginTop: theme.spacing.xs }}
            >
              This area is only available to service providers. Sign up as a provider to list your services.
            </ThemedText>
          </View>
        </ThemedView>
      </SafeAreaView>
    );
  }

  // ── Loading State ──
  if (isLoading && !hasFetched) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
        <ThemedView style={styles.container}>
          <Header title="Provider Dashboard" />
          <View style={styles.centreContainer}>
            <ActivityIndicator color={colors.primary} />
          </View>
        </ThemedView>
      </SafeAreaView>
    );
  }

  // ── No Listing Yet ──
  if (!myProvider) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
        <ThemedView style={styles.container}>
          <Header title="Provider Dashboard" />
          <View style={styles.centreContainer}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="storefront-outline" size={32} color={colors.primary} />
            </View>
            <ThemedText variant="h3" style={{ textAlign: 'center' }}>
              Create Your Listing
            </ThemedText>
            <ThemedText
              color="textSecondary"
              style={{ textAlign: 'center', marginTop: theme.spacing.xs, marginBottom: theme.spacing.xl }}
            >
              Set up your provider profile so customers can find and contact you.
            </ThemedText>
            <Button
              label="Create Listing"
              onPress={() => router.push('/provider/edit-listing')}
              style={{ maxWidth: 280, width: '100%' }}
            />
          </View>
        </ThemedView>
      </SafeAreaView>
    );
  }

  // ── Has a Listing ──
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ThemedView style={styles.container}>
        <Header title="Provider Dashboard" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── Listing Summary ── */}
          <View style={styles.listingSummary}>
            <View
              style={[
                styles.logoContainer,
                { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
              ]}
            >
              {myProvider.image_url ? (
                <Image
                  source={{ uri: myProvider.image_url }}
                  style={styles.logo}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="storefront-outline" size={28} color={colors.textMuted} />
              )}
            </View>

            <View style={{ flex: 1 }}>
              <View style={styles.nameRow}>
                <ThemedText variant="h3" numberOfLines={1} style={{ flex: 1 }}>
                  {myProvider.business_name}
                </ThemedText>
                {myProvider.is_verified && (
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={colors.verified}
                    style={{ marginLeft: theme.spacing.xs }}
                  />
                )}
              </View>
              <ThemedText variant="caption" color="textSecondary" numberOfLines={1}>
                {myProvider.category} • {myProvider.city}, {myProvider.state}
              </ThemedText>
            </View>
          </View>

          {/* ── Stats Row ── */}
          <View style={[styles.statsRow, { borderColor: colors.border }]}>
            <StatBlock value={myProvider.rating.toFixed(1)} label="Rating" />
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <StatBlock value={String(myProvider.review_count)} label="Reviews" />
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <StatBlock value={String(myServices.length)} label="Services" />
          </View>

          {/* ── Manage Section ── */}
          <View style={styles.menuSection}>
            <ThemedText variant="label" color="textSecondary" style={styles.sectionLabel}>
              MANAGE
            </ThemedText>
            <View
              style={[
                styles.menuCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <ProfileMenuItem
                icon="create-outline"
                label="Edit Profile"
                onPress={() => router.push('/provider/edit-listing')}
              />
              <ProfileMenuItem
                icon="construct-outline"
                label="Manage Services"
                onPress={() => router.push('/provider/services')}
              />
              <ProfileMenuItem
                icon="star-outline"
                label="My Reviews"
                onPress={() => router.push('/provider/reviews')}
              />
            </View>
          </View>

          {/* ── Account Section ── */}
          <View style={styles.menuSection}>
            <ThemedText variant="label" color="textSecondary" style={styles.sectionLabel}>
              LISTING STATUS
            </ThemedText>
            <View
              style={[
                styles.statusCard,
                {
                  backgroundColor: myProvider.is_verified
                    ? colors.successLight
                    : colors.surfaceAlt,
                  borderColor: myProvider.is_verified ? colors.success : colors.border,
                },
              ]}
            >
              <Ionicons
                name={myProvider.is_verified ? 'checkmark-circle' : 'time-outline'}
                size={20}
                color={myProvider.is_verified ? colors.success : colors.textMuted}
              />
              <View style={{ flex: 1, marginLeft: theme.spacing.sm }}>
                <ThemedText
                  variant="bodySemibold"
                  style={{
                    color: myProvider.is_verified ? colors.success : colors.text,
                  }}
                >
                  {myProvider.is_verified ? 'Verified Provider' : 'Pending Verification'}
                </ThemedText>
                <ThemedText variant="caption" color="textSecondary">
                  {myProvider.is_verified
                    ? 'Your listing has been verified by our team'
                    : 'Our team will review and verify your listing soon'}
                </ThemedText>
              </View>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
  },
  centreContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
    gap: theme.spacing.lg,
  },
  listingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: { width: '100%', height: '100%' },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  statDivider: {
    width: 1,
    height: 32,
  },
  menuSection: { gap: theme.spacing.xs },
  sectionLabel: { marginLeft: 2 },
  menuCard: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
  },
});