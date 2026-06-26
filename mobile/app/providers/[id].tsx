import { useState, useEffect } from 'react';
import { ScrollView, View, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { ProfileHeader } from '@/features/providers/components/ProfileHeader';
import { ProfileInfoBlock } from '@/features/providers/components/ProfileInfoBlock';
import { ServiceListItem } from '@/features/providers/components/ServiceListItem';
import { ReviewCard } from '@/features/providers/components/ReviewCard';
import { StickyActionBar } from '@/features/providers/components/StickyActionBar';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { supabase } from '@/services/supabase/client';
import { mapDbProviderToProvider, DbProvider } from '@/services/supabase/providerMappers';
import { useAuthStore } from '@/store/authStore';
import { useFavouritesStore } from '@/store/favouritesStore';
import { useChatStore } from '@/store/chatStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';
import { Provider } from '@/types/provider';

interface ServiceRow {
  id: string;
  name: string;
  price: number;
}

interface ReviewRow {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  customerName: string;
}

/**
 * ProviderProfileScreen
 *
 * Phase 12: now fetches a REAL provider from Supabase by id, along
 * with its real services and reviews, replacing the Phase 6 mock data
 * lookups. "Contact Provider" creates/finds a real conversation and
 * navigates to the chat screen directly from here — no more dev bridge
 * needed for this flow.
 */
export default function ProviderProfileScreen() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();

  const isAuthenticated = useAuthStore((s) => !!s.user);
  const isFavourited = useFavouritesStore((s) => (id ? s.isFavourited(id) : false));
  const toggleFavourite = useFavouritesStore((s) => s.toggleFavourite);
  const startConversation = useChatStore((s) => s.startConversation);

  const [provider, setProvider] = useState<Provider | null>(null);
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isContacting, setIsContacting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProviderData(id);
    }
  }, [id]);

  async function fetchProviderData(providerId: string) {
    setIsLoading(true);

    const { data: providerRow, error: providerError } = await supabase
      .from('providers')
      .select('*')
      .eq('id', providerId)
      .maybeSingle();

    if (providerError || !providerRow) {
      setProvider(null);
      setIsLoading(false);
      return;
    }

    setProvider(mapDbProviderToProvider(providerRow as DbProvider));

    const { data: servicesData } = await supabase
      .from('services')
      .select('id, name, price')
      .eq('provider_id', providerId)
      .order('created_at', { ascending: true });

    setServices((servicesData ?? []) as ServiceRow[]);

    const { data: reviewsData } = await supabase
      .from('reviews')
      .select('id, customer_id, rating, comment, created_at')
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false });

    if (reviewsData && reviewsData.length > 0) {
      const customerIds = [...new Set(reviewsData.map((r) => r.customer_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', customerIds);
      const profilesById = new Map((profilesData ?? []).map((p) => [p.id, p]));

      setReviews(
        reviewsData.map((r) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          created_at: r.created_at,
          customerName: profilesById.get(r.customer_id)?.full_name ?? 'Customer',
        }))
      );
    } else {
      setReviews([]);
    }

    setIsLoading(false);
  }

  // ── Loading State ──
  if (isLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator color={colors.primary} />
      </ThemedView>
    );
  }

  // ── Not Found State ──
  if (!provider) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText variant="h3">Provider not found</ThemedText>
        <ThemedText color="textSecondary" style={{ marginTop: theme.spacing.sm }}>
          This provider may have been removed.
        </ThemedText>
      </ThemedView>
    );
  }

  async function handleFavouritePress() {
    if (!isAuthenticated) {
      Alert.alert('Sign Up Required', 'Create an account to save your favourite providers.', [{ text: 'OK' }]);
      return;
    }
    const { error } = await toggleFavourite(provider!.id);
    if (error) {
      Alert.alert('Something went wrong', error);
    }
  }

  async function handleContactPress() {
    if (!isAuthenticated) {
      Alert.alert('Sign Up Required', 'Create an account or log in to contact this provider.', [{ text: 'OK' }]);
      return;
    }

    setIsContacting(true);
    const { conversationId, error } = await startConversation(provider!.id);
    setIsContacting(false);

    if (error || !conversationId) {
      Alert.alert('Something went wrong', error ?? 'Failed to start conversation.');
      return;
    }

   router.push({
  pathname: '/chat/[conversationId]',
  params: {
    conversationId,
    name: provider!.businessName,
    providerId: provider!.id,
    isCustomerView: 'true',
    phoneNumber: provider!.phoneNumber ?? '',
  },
});
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

        {/* ── Services ── */}
        <View style={styles.section}>
          <SectionHeader title="Services" actionLabel={null} />
          {services.length === 0 ? (
            <ThemedText color="textSecondary" style={styles.emptyText}>
              This provider hasn't listed any services yet.
            </ThemedText>
          ) : (
            <View style={styles.servicesList}>
              {services.map((service, index) => (
                <ServiceListItem
                  key={service.id}
                  service={service}
                  showDivider={index < services.length - 1}
                />
              ))}
            </View>
          )}
        </View>

        {/* ── Reviews ── */}
        <View style={styles.section}>
          <SectionHeader title={`Reviews (${reviews.length})`} actionLabel={null} />
          {reviews.length === 0 ? (
            <ThemedText color="textSecondary" style={styles.emptyText}>
              No reviews yet.
            </ThemedText>
          ) : (
            <View style={styles.reviewsList}>
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={{
                    id: review.id,
                    reviewerName: review.customerName,
                    rating: review.rating,
                    comment: review.comment,
                    createdAt: review.created_at,
                  }}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <StickyActionBar
        label={isAuthenticated ? 'Contact Provider' : 'Sign Up to Contact'}
        onPress={handleContactPress}
        loading={isContacting}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: theme.spacing.xl },
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xl },
  section: { paddingHorizontal: 0, marginTop: theme.spacing.md },
  emptyText: { paddingHorizontal: theme.spacing.lg },
  servicesList: { paddingHorizontal: theme.spacing.lg },
  reviewsList: { paddingHorizontal: theme.spacing.lg },
});