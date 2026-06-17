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
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

/**
 * ProviderDashboardScreen
 *
 * Three states:
 * 1. Loading — spinner while fetchMyProvider() runs
 * 2. No listing yet — "Create Your Listing" prompt
 * 3. Has a listing — stats row + menu links (Edit Profile, Manage
 *    Services, My Reviews)
 *
 * Rating/Reviews stats show 0 for now since real reviews don't exist
 * until Phase 11 — this is accurate, not a placeholder.
 */
export default function ProviderDashboardScreen() {
  const colors = useThemeColors();
  const myProvider = useProviderStore((s) => s.myProvider);
  const myServices = useProviderStore((s) => s.myServices);
  const isLoading = useProviderStore((s) => s.isLoading);
  const hasFetched = useProviderStore((s) => s.hasFetched);
  const fetchMyProvider = useProviderStore((s) => s.fetchMyProvider);

  useEffect(() => {
    fetchMyProvider();
  }, []);

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

  // ── Loading State ──
  if (isLoading && !hasFetched) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
        <ThemedView style={styles.container}>
          <Header title="Provider Dashboard" />
          <View style={styles.loadingContainer}>
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
          <View style={styles.emptyContainer}>
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

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* ── Listing Summary ── */}
          <View style={styles.listingSummary}>
            <View style={[styles.logoContainer, { backgroundColor: colors.surfaceAlt }]}>
              {myProvider.image_url ? (
                <Image source={{ uri: myProvider.image_url }} style={styles.logo} resizeMode="cover" />
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
                  <Ionicons name="checkmark-circle" size={18} color={colors.verified} />
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
  <StatBlock value={String(myProvider.review_count)} label="Reviews" />
  <StatBlock value={String(myServices.length)} label="Services" />
</View>

          {/* ── Menu ── */}
          <View style={styles.menuSection}>
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
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xl },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  scrollContent: { padding: theme.spacing.lg, paddingBottom: theme.spacing.xxxl },
  listingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: { width: '100%', height: '100%' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
  statsRow: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: theme.spacing.lg,
  },
  menuSection: { marginTop: theme.spacing.sm },
});