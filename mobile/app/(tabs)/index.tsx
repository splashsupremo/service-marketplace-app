import { useState, useMemo } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { SearchBar } from '@/components/ui/SearchBar';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { HomeHeader } from '@/features/home/components/HomeHeader';
import { StateSelector } from '@/features/home/components/StateSelector';
import { CategoryChip } from '@/features/home/components/CategoryChip';
import { ProviderCard } from '@/features/providers/components/ProviderCard';
import { CATEGORIES } from '@/app/services/mockData/categories';
import { MOCK_PROVIDERS } from '@/app/services/mockData/providers';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';
import { Provider } from '@/types/provider';
import { ThemedText } from '@/components/ui/ThemedText';

/**
 * HomeScreen
 *
 * The main browse screen — visible to all users (no auth required).
 *
 * Sections:
 * 1. HomeHeader (app name + notification bell)
 * 2. SearchBar (pressable — navigates to /search in Phase 5)
 * 3. StateSelector (filters all provider sections by state)
 * 4. Categories (horizontal scroll of CategoryChips)
 * 5. Featured Providers (horizontal carousel)
 * 6. Recently Added (horizontal carousel)
 * 7. Popular Providers (horizontal carousel)
 *
 * TODO: Phase 5 — wire "See all" buttons to the Provider Listings screen.
 * TODO: Phase 12 — replace MOCK_PROVIDERS with real Supabase queries.
 */
export default function HomeScreen() {
  const colors = useThemeColors();

  // ── Filter State ──
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // ── Derived / Filtered Data ──
  // Apply state + category filters to the base provider list.
  // `useMemo` means this only re-calculates when the filters change,
  // not on every re-render — good practice for list filtering logic.
  const filteredProviders = useMemo<Provider[]>(() => {
    return MOCK_PROVIDERS.filter((p) => {
      const stateMatch =
        selectedState === 'All States' || p.state === selectedState;
      const categoryMatch =
        selectedCategory === null || p.category === selectedCategory;
      return stateMatch && categoryMatch;
    });
  }, [selectedState, selectedCategory]);

  // Featured: marked as isFeatured
  const featuredProviders = useMemo(
    () => filteredProviders.filter((p) => p.isFeatured),
    [filteredProviders]
  );

  // Recently Added: sorted by createdAt descending, top 6
  const recentProviders = useMemo(
    () =>
      [...filteredProviders]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 6),
    [filteredProviders]
  );

  // Popular: sorted by rating descending, top 6
  const popularProviders = useMemo(
    () =>
      [...filteredProviders]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6),
    [filteredProviders]
  );

  // ── Pull-to-Refresh ──
  // Simulates a refresh (no real API call yet — Phase 12).
  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }

  // ── Empty State for a Section ──
  function renderEmptySection(message: string) {
    return (
      <View style={styles.emptySection}>
        <ThemedView
          variant="surface"
          style={[styles.emptySectionInner, { borderColor: colors.border }]}
        >
          <ThemedText color="textMuted">{message}</ThemedText>
        </ThemedView>
      </View>
    );
  }

  // ── Provider Carousel ──
  function renderProviderCarousel(providers: Provider[]) {
    if (providers.length === 0) {
      return renderEmptySection(
        selectedState === 'All States'
          ? 'No providers found'
          : `No providers found in ${selectedState}`
      );
    }
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      >
        {providers.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            onPress={() => {
              // TODO: Phase 6 — navigate to provider profile
              // router.push(`/providers/${provider.id}`);
              console.log('Navigate to provider:', provider.businessName);
            }}
          />
        ))}
      </ScrollView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ThemedView style={styles.container}>

        {/* ── Header ── */}
        <HomeHeader
          onNotificationPress={() => console.log('Notifications pressed')}
        />

        {/* ── Main Scrollable Content ── */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >

          {/* ── Search + State Row ── */}
          <View style={styles.searchRow}>
            <SearchBar
              value=""
              onChangeText={() => {}}
              pressable
              onPress={() => {
                // TODO: Phase 5 — navigate to search screen
                router.push('/search');
              }}
              style={styles.searchBar}
            />
            <StateSelector
              selectedState={selectedState}
              onStateChange={setSelectedState}
            />
          </View>

          {/* ── Categories ── */}
          <View style={styles.section}>
            <SectionHeader title="Categories" actionLabel={null} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {CATEGORIES.map((cat) => (
                <CategoryChip
                  key={cat.id}
                  label={cat.name}
                  icon={cat.icon}
                  isSelected={selectedCategory === cat.name}
                  onPress={() =>
                    setSelectedCategory(
                      selectedCategory === cat.name ? null : cat.name
                    )
                  }
                />
              ))}
            </ScrollView>
          </View>

          {/* ── Featured Providers ── */}
          <View style={styles.section}>
            <SectionHeader
              title="Featured Providers"
              onActionPress={() => {
                // TODO: Phase 5 — router.push('/providers?filter=featured')
                console.log('See all featured');
              }}
            />
            {renderProviderCarousel(featuredProviders)}
          </View>

          {/* ── Recently Added ── */}
          <View style={styles.section}>
            <SectionHeader
              title="Recently Added"
              onActionPress={() => {
                // TODO: Phase 5
                console.log('See all recent');
              }}
            />
            {renderProviderCarousel(recentProviders)}
          </View>

          {/* ── Popular Providers ── */}
          <View style={styles.section}>
            <SectionHeader
              title="Popular Providers"
              onActionPress={() => {
                // TODO: Phase 5
                console.log('See all popular');
              }}
            />
            {renderProviderCarousel(popularProviders)}
          </View>

        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxxl,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  searchBar: {
    flex: 1,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  horizontalList: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xs,
  },
  emptySection: {
    paddingHorizontal: theme.spacing.lg,
  },
  emptySectionInner: {
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
});