import { useState, useMemo } from 'react';
import { ScrollView, View, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { SearchBar } from '@/components/ui/SearchBar';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { HomeHeader } from '@/features/home/components/HomeHeader';
import { StateSelector } from '@/features/home/components/StateSelector';
import { CategoryChip } from '@/features/home/components/CategoryChip';
import { ProviderCard } from '@/features/providers/components/ProviderCard';
import { AutoScrollCarousel } from '@/features/providers/components/AutoScrollCarousel';
import { CATEGORIES } from '@/app/services/mockData/categories';
import { MOCK_PROVIDERS } from '@/app/services/mockData/providers';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';
import { Provider } from '@/types/provider';

// Width of a single ProviderCard (200px) + its right margin (theme.spacing.md = 12px)
// Used by AutoScrollCarousel to calculate scroll offsets accurately.
const PROVIDER_CARD_STEP = 200 + theme.spacing.md;

/**
 * HomeScreen
 *
 * FIX (bug report): search bar is now directly editable (typing filters
 * providers inline by business name or category), instead of navigating
 * away on tap. The dedicated advanced-filter Search screen (Phase 5) will
 * remain a separate, deeper experience reached via its own tab.
 *
 * FEATURE: Featured Providers now auto-slides when the user isn't
 * touching it, via AutoScrollCarousel. Recently Added / Popular remain
 * manual-scroll only — auto-sliding every section would feel chaotic.
 */
export default function HomeScreen() {
  const colors = useThemeColors();

  const [selectedState, setSelectedState] = useState<string>('All States');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const filteredProviders = useMemo<Provider[]>(() => {
    const query = searchQuery.trim().toLowerCase();
    return MOCK_PROVIDERS.filter((p) => {
      const stateMatch = selectedState === 'All States' || p.state === selectedState;
      const categoryMatch = selectedCategory === null || p.category === selectedCategory;
      const searchMatch =
        query === '' ||
        p.businessName.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query);
      return stateMatch && categoryMatch && searchMatch;
    });
  }, [selectedState, selectedCategory, searchQuery]);

  const featuredProviders = useMemo(
    () => filteredProviders.filter((p) => p.isFeatured),
    [filteredProviders]
  );

  const recentProviders = useMemo(
    () =>
      [...filteredProviders]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 6),
    [filteredProviders]
  );

  const popularProviders = useMemo(
    () => [...filteredProviders].sort((a, b) => b.rating - a.rating).slice(0, 6),
    [filteredProviders]
  );

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }

  function renderEmptySection(message: string) {
    return (
      <View style={styles.emptySection}>
        <ThemedView variant="surface" style={[styles.emptySectionInner, { borderColor: colors.border }]}>
          <ThemedText color="textMuted">{message}</ThemedText>
        </ThemedView>
      </View>
    );
  }

  const emptyMessage =
    selectedState === 'All States' ? 'No providers found' : `No providers found in ${selectedState}`;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ThemedView style={styles.container}>
        <HomeHeader onNotificationPress={() => console.log('Notifications pressed')} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
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
              value={searchQuery}
              onChangeText={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Search by name or category..."
              style={styles.searchBar}
            />
            <StateSelector selectedState={selectedState} onStateChange={setSelectedState} />
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
                    setSelectedCategory(selectedCategory === cat.name ? null : cat.name)
                  }
                />
              ))}
            </ScrollView>
          </View>

          {/* ── Featured Providers (auto-sliding) ── */}
          <View style={styles.section}>
            <SectionHeader title="Featured Providers" onActionPress={() => console.log('See all featured')} />
            {featuredProviders.length === 0 ? (
              renderEmptySection(emptyMessage)
            ) : (
              <AutoScrollCarousel
                itemWidth={PROVIDER_CARD_STEP}
                itemCount={featuredProviders.length}
                contentContainerStyle={styles.horizontalList}
              >
                {featuredProviders.map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    onPress={() => console.log('Navigate to provider:', provider.businessName)}
                  />
                ))}
              </AutoScrollCarousel>
            )}
          </View>

          {/* ── Recently Added (manual scroll) ── */}
          <View style={styles.section}>
            <SectionHeader title="Recently Added" onActionPress={() => console.log('See all recent')} />
            {recentProviders.length === 0 ? (
              renderEmptySection(emptyMessage)
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              >
                {recentProviders.map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    onPress={() => console.log('Navigate to provider:', provider.businessName)}
                  />
                ))}
              </ScrollView>
            )}
          </View>

          {/* ── Popular Providers (manual scroll) ── */}
          <View style={styles.section}>
            <SectionHeader title="Popular Providers" onActionPress={() => console.log('See all popular')} />
            {popularProviders.length === 0 ? (
              renderEmptySection(emptyMessage)
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              >
                {popularProviders.map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    onPress={() => console.log('Navigate to provider:', provider.businessName)}
                  />
                ))}
              </ScrollView>
            )}
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { paddingBottom: theme.spacing.xxxl },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  searchBar: { flex: 1 },
  section: { marginBottom: theme.spacing.lg },
  horizontalList: { paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.xs },
  emptySection: { paddingHorizontal: theme.spacing.lg },
  emptySectionInner: {
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
});