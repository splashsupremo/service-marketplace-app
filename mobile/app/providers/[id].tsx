import { useState, useMemo } from 'react';
import { ScrollView, View, Alert, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { ProfileHeader } from '@/features/providers/components/ProfileHeader';
import { ProfileInfoBlock } from '@/features/providers/components/ProfileInfoBlock';
import { ServiceListItem } from '@/features/providers/components/ServiceListItem';
import { ReviewCard } from '@/features/providers/components/ReviewCard';
import { StickyActionBar } from '@/features/providers/components/StickyActionBar';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MOCK_PROVIDERS } from '@/app/services/mockData/providers';
import { MOCK_PROVIDER_DETAILS } from '@/services/mockData/providerDetails';
import { useAuthStore } from '@/store/authStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

/**
 * ProviderProfileScreen
 *
 * Public-facing provider detail screen, reached from Home/Listings via
 * /providers/[id]. Looks up the provider by id from mock data, combining
 * the lightweight Provider record with its richer ProviderDetail fields.
 *
 * Auth state is now read from the real Zustand auth store (Phase 7) —
 * isAuthenticated is true whenever a Supabase session/user exists.
 *
 * TODO: Phase 8 — wire up real favourite persistence (Supabase table)
 * instead of local-only isFavourited state.
 * TODO: Phase 10 — wire up real chat navigation instead of console.log.
 * TODO: Phase 12 — replace mock lookups with a Supabase query by id.
 */
export default function ProviderProfileScreen() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isFavourited, setIsFavourited] = useState(false);

  const isAuthenticated = useAuthStore((s) => !!s.user);

  const provider = useMemo(() => MOCK_PROVIDERS.find((p) => p.id === id), [id]);
  const detail = id ? MOCK_PROVIDER_DETAILS[id] : undefined;

  // ── Not Found State ──
  if (!provider || !detail) {
    return (
      <ThemedView style={styles.notFoundContainer}>
        <ThemedText variant="h3">Provider not found</ThemedText>
        <ThemedText color="textSecondary" style={{ marginTop: theme.spacing.sm }}>
          This provider may have been removed.
        </ThemedText>
      </ThemedView>
    );
  }

  function handleFavouritePress() {
    if (!isAuthenticated) {
      Alert.alert(
        'Sign Up Required',
        'Create an account to save your favourite providers.',
        [{ text: 'OK' }]
      );
      return;
    }
    setIsFavourited((prev) => !prev);
  }

  function handleContactPress() {
    if (!isAuthenticated) {
      Alert.alert(
        'Sign Up Required',
        'Create an account or log in to contact this provider.',
        [{ text: 'OK' }]
      );
      return;
    }
    // TODO: Phase 10 — navigate to chat screen with this provider
    console.log('Navigate to chat with:', provider?.businessName ?? 'provider');
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ProfileHeader
          imageUrl={provider.imageUrl}
          isFavourited={isFavourited}
          onBackPress={() => router.back()}
          onFavouritePress={handleFavouritePress}
        />

        <ProfileInfoBlock
          businessName={provider.businessName}
          category={provider.category}
          state={provider.state}
          city={provider.city}
          rating={provider.rating}
          reviewCount={provider.reviewCount}
          isVerified={provider.isVerified}
        />

        {/* ── About ── */}
        <View style={styles.section}>
          <SectionHeader title="About" actionLabel={null} />
          <ThemedText variant="body" color="textSecondary" style={styles.aboutText}>
            {detail.description}
          </ThemedText>
        </View>

        {/* ── Services ── */}
        <View style={styles.section}>
          <SectionHeader title="Services" actionLabel={null} />
          <View style={styles.servicesList}>
            {detail.services.map((service, index) => (
              <ServiceListItem
                key={service.id}
                service={service}
                showDivider={index < detail.services.length - 1}
              />
            ))}
          </View>
        </View>

        {/* ── Reviews ── */}
        <View style={styles.section}>
          <SectionHeader
            title={`Reviews (${provider.reviewCount})`}
            onActionPress={() => console.log('See all reviews — Phase 11')}
          />
          <View style={styles.reviewsList}>
            {detail.reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </View>
        </View>
      </ScrollView>

      <StickyActionBar
        label={isAuthenticated ? 'Contact Provider' : 'Sign Up to Contact'}
        onPress={handleContactPress}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: theme.spacing.xl },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  section: {
    paddingHorizontal: 0,
    marginTop: theme.spacing.md,
  },
  aboutText: {
    paddingHorizontal: theme.spacing.lg,
    lineHeight: 22,
  },
  servicesList: { paddingHorizontal: theme.spacing.lg },
  reviewsList: { paddingHorizontal: theme.spacing.lg },
});