import { useState, useMemo, useCallback } from 'react';
import { View, FlatList, Pressable, StyleSheet, useWindowDimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { ProviderGridCard } from '@/features/providers/components/ProviderGridCard';
import { FilterChip } from '@/features/listings/components/FilterChip';
import { SortDropdown, SortOption } from '@/features/listings/components/SortDropdown';
import { FilterModal, ListingsFilters } from '@/features/listings/components/FilterModal';
import { MOCK_PROVIDERS } from '@/app/services/mockData/providers';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';
import { Provider } from '@/types/provider';

const PAGE_SIZE = 6;
const GRID_GAP = theme.spacing.md;

/**
 * ListingsScreen
 *
 * Full browsable provider listing with a 2-column grid, removable filter
 * chips, a sort dropdown, a full filter modal, and simulated infinite
 * scroll pagination over mock data.
 *
 * Reached via:
 *   /listings?category=Plumbing
 *   /listings?filter=featured | recent | popular
 *   /listings?state=Lagos
 * (params can combine)
 *
 * TODO: Phase 12 — replace MOCK_PROVIDERS + client-side pagination with
 * real Supabase queries using .range() for true server-side pagination.
 */
export default function ListingsScreen() {
  const colors = useThemeColors();
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{ category?: string; filter?: string; state?: string }>();

  // ── Initial filters derived from navigation params (read once on mount) ──
  const [filters, setFilters] = useState<ListingsFilters>({
    category: params.category ?? null,
    state: params.state ?? null,
    minRating: null,
  });
  const [specialFilter, setSpecialFilter] = useState<string | null>(params.filter ?? null);
  const [sortOption, setSortOption] = useState<SortOption>(
    params.filter === 'recent' ? 'newest' : params.filter === 'popular' ? 'rating' : 'rating'
  );
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [page, setPage] = useState(1);

  // ── Grid sizing: 2 columns with consistent gaps, responsive to screen width ──
  const horizontalPadding = theme.spacing.lg;
  const cardWidth = (width - horizontalPadding * 2 - GRID_GAP) / 2;

  // ── Apply all filters ──
  const filteredProviders = useMemo<Provider[]>(() => {
    let result = MOCK_PROVIDERS.filter((p) => {
      const categoryMatch = !filters.category || p.category === filters.category;
      const stateMatch = !filters.state || p.state === filters.state;
      const ratingMatch = !filters.minRating || p.rating >= filters.minRating;
      const specialMatch = specialFilter !== 'featured' || p.isFeatured;
      return categoryMatch && stateMatch && ratingMatch && specialMatch;
    });

    // ── Apply sort ──
    if (sortOption === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'newest') {
      result = [...result].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortOption === 'reviews') {
      result = [...result].sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [filters, specialFilter, sortOption]);

  // ── Simulated pagination: slice the filtered results to `page * PAGE_SIZE` items ──
  const visibleProviders = useMemo(
    () => filteredProviders.slice(0, page * PAGE_SIZE),
    [filteredProviders, page]
  );
  const hasMore = visibleProviders.length < filteredProviders.length;

  const handleLoadMore = useCallback(() => {
    if (hasMore) {
      setPage((p) => p + 1);
    }
  }, [hasMore]);

  // Reset pagination whenever filters/sort change, so the list starts fresh
  function updateFilters(next: ListingsFilters) {
    setFilters(next);
    setPage(1);
  }

  function clearCategory() {
    updateFilters({ ...filters, category: null });
  }
  function clearState() {
    updateFilters({ ...filters, state: null });
  }
  function clearRating() {
    updateFilters({ ...filters, minRating: null });
  }
  function clearSpecialFilter() {
    setSpecialFilter(null);
    setPage(1);
  }

  const hasActiveFilters = !!(filters.category || filters.state || filters.minRating || specialFilter);

  const screenTitle =
    specialFilter === 'featured'
      ? 'Featured Providers'
      : specialFilter === 'recent'
      ? 'Recently Added'
      : specialFilter === 'popular'
      ? 'Popular Providers'
      : filters.category
      ? filters.category
      : 'All Providers';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ThemedView style={styles.container}>

        {/* ── Header ── */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.back()} hitSlop={8} accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <ThemedText variant="h3" numberOfLines={1} style={styles.headerTitle}>
            {screenTitle}
          </ThemedText>
          <Pressable
            onPress={() => setFilterModalVisible(true)}
            hitSlop={8}
            accessibilityLabel="Open filters"
            style={styles.filterIconButton}
          >
            <Ionicons name="options-outline" size={22} color={colors.text} />
          </Pressable>
        </View>

        {/* ── Active Filter Chips ── */}
        {hasActiveFilters && (
          <View style={styles.chipsRow}>
            {specialFilter && (
              <FilterChip
                label={specialFilter === 'featured' ? 'Featured' : specialFilter === 'recent' ? 'Recently Added' : 'Popular'}
                onRemove={clearSpecialFilter}
              />
            )}
            {filters.category && <FilterChip label={filters.category} onRemove={clearCategory} />}
            {filters.state && <FilterChip label={filters.state} onRemove={clearState} />}
            {filters.minRating && <FilterChip label={`${filters.minRating.toFixed(1)}+ ★`} onRemove={clearRating} />}
          </View>
        )}

        {/* ── Result Count + Sort ── */}
        <View style={styles.resultRow}>
          <ThemedText variant="caption" color="textSecondary">
            {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} found
          </ThemedText>
          <SortDropdown value={sortOption} onChange={setSortOption} />
        </View>

        {/* ── Grid ── */}
        <FlatList
          data={visibleProviders}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: GRID_GAP }}
          contentContainerStyle={[styles.gridContent, { paddingHorizontal: horizontalPadding }]}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.4}
          onEndReached={handleLoadMore}
          renderItem={({ item }) => (
            <ProviderGridCard
              provider={item}
              width={cardWidth}
              onPress={() => router.push({ pathname: '/providers/[id]', params: { id: item.id } })}
              style={{ marginBottom: GRID_GAP }}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={40} color={colors.textMuted} />
              <ThemedText color="textMuted" style={{ marginTop: theme.spacing.sm }}>
                No providers match your filters
              </ThemedText>
            </View>
          }
          ListFooterComponent={
            hasMore ? (
              <View style={styles.footerLoading}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : visibleProviders.length > 0 ? (
              <View style={styles.footerLoading}>
                <ThemedText variant="caption" color="textMuted">
                  You've reached the end
                </ThemedText>
              </View>
            ) : null
          }
        />

        {/* ── Filter Modal ── */}
        <FilterModal
          visible={filterModalVisible}
          onClose={() => setFilterModalVisible(false)}
          filters={filters}
          onApply={updateFilters}
        />

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
  headerTitle: { flex: 1, marginHorizontal: theme.spacing.md },
  filterIconButton: { padding: 2 },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  gridContent: { paddingBottom: theme.spacing.xxxl },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: theme.spacing.xxxl },
  footerLoading: { paddingVertical: theme.spacing.lg, alignItems: 'center' },
});