import { useState, useEffect, useCallback } from 'react';
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
import { supabase } from '@/services/supabase/client';
import { mapDbProviderToProvider, DbProvider } from '@/services/supabase/providerMappers';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';
import { Provider } from '@/types/provider';

const PAGE_SIZE = 6;
const GRID_GAP = theme.spacing.md;

/**
 * ListingsScreen
 *
 * Phase 12: now queries the REAL providers table directly via Supabase,
 * using .range() for true server-side pagination and exact count for
 * the "X providers found" label — replacing Phase 5's simulated
 * in-memory pagination over MOCK_PROVIDERS.
 */
export default function ListingsScreen() {
  const colors = useThemeColors();
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{ category?: string; filter?: string; state?: string }>();

  const [filters, setFilters] = useState<ListingsFilters>({
    category: params.category ?? null,
    state: params.state ?? null,
    minRating: null,
  });
  const [specialFilter, setSpecialFilter] = useState<string | null>(params.filter ?? null);
  const [sortOption, setSortOption] = useState<SortOption>(
    params.filter === 'recent' ? 'newest' : 'rating'
  );
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const [providers, setProviders] = useState<Provider[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0); // 0-indexed for .range() math
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const horizontalPadding = theme.spacing.lg;
  const cardWidth = (width - horizontalPadding * 2 - GRID_GAP) / 2;

  /**
   * buildQuery
   *
   * Constructs the Supabase query with all active filters and sort
   * applied, but WITHOUT .range() — the caller adds that, since the
   * same filter/sort combination is reused for both the initial fetch
   * and "load more" pagination.
   */
  function buildQuery() {
    let query = supabase.from('providers').select('*', { count: 'exact' });

    if (filters.category) query = query.eq('category', filters.category);
    if (filters.state) query = query.eq('state', filters.state);
    if (filters.minRating) query = query.gte('rating', filters.minRating);
    if (specialFilter === 'featured') query = query.eq('is_featured', true);

    if (sortOption === 'rating') {
      query = query.order('rating', { ascending: false });
    } else if (sortOption === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (sortOption === 'reviews') {
      query = query.order('review_count', { ascending: false });
    }

    return query;
  }

  /**
   * fetchFirstPage
   *
   * Re-fetches from scratch (page 0) whenever filters/sort change.
   */
  const fetchFirstPage = useCallback(async () => {
    setIsLoading(true);
    const { data, count, error } = await buildQuery().range(0, PAGE_SIZE - 1);

    if (error) {
      console.error('Error fetching providers:', error.message);
      setIsLoading(false);
      return;
    }

    setProviders((data ?? []).map((row) => mapDbProviderToProvider(row as DbProvider)));
    setTotalCount(count ?? 0);
    setPage(0);
    setIsLoading(false);
  }, [filters, specialFilter, sortOption]);

  useEffect(() => {
    fetchFirstPage();
  }, [fetchFirstPage]);

  /**
   * handleLoadMore
   *
   * Fetches the next page and appends it, only if more rows remain.
   */
  async function handleLoadMore() {
    const hasMore = providers.length < totalCount;
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;
    const from = nextPage * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await buildQuery().range(from, to);

    if (error) {
      console.error('Error fetching more providers:', error.message);
      setIsLoadingMore(false);
      return;
    }

    setProviders((prev) => [...prev, ...(data ?? []).map((row) => mapDbProviderToProvider(row as DbProvider))]);
    setPage(nextPage);
    setIsLoadingMore(false);
  }

  function updateFilters(next: ListingsFilters) {
    setFilters(next);
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
  }

  const hasActiveFilters = !!(filters.category || filters.state || filters.minRating || specialFilter);
  const hasMore = providers.length < totalCount;

  const screenTitle =
    specialFilter === 'featured'
      ? 'Featured Providers'
      : filters.category
      ? filters.category
      : 'All Providers';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ThemedView style={styles.container}>

        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.back()} hitSlop={8} accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <ThemedText variant="h3" numberOfLines={1} style={styles.headerTitle}>
            {screenTitle}
          </ThemedText>
          <Pressable onPress={() => setFilterModalVisible(true)} hitSlop={8} accessibilityLabel="Open filters" style={styles.filterIconButton}>
            <Ionicons name="options-outline" size={22} color={colors.text} />
          </Pressable>
        </View>

        {hasActiveFilters && (
          <View style={styles.chipsRow}>
            {specialFilter && <FilterChip label="Featured" onRemove={clearSpecialFilter} />}
            {filters.category && <FilterChip label={filters.category} onRemove={clearCategory} />}
            {filters.state && <FilterChip label={filters.state} onRemove={clearState} />}
            {filters.minRating && <FilterChip label={`${filters.minRating.toFixed(1)}+ ★`} onRemove={clearRating} />}
          </View>
        )}

        <View style={styles.resultRow}>
          <ThemedText variant="caption" color="textSecondary">
            {totalCount} provider{totalCount !== 1 ? 's' : ''} found
          </ThemedText>
          <SortDropdown value={sortOption} onChange={setSortOption} />
        </View>

        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={providers}
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
                <ThemedText color="textMuted" style={{ marginTop: theme.spacing.sm, textAlign: 'center' }}>
                  No providers match your filters yet
                </ThemedText>
              </View>
            }
            ListFooterComponent={
              isLoadingMore ? (
                <View style={styles.footerLoading}>
                  <ActivityIndicator color={colors.primary} />
                </View>
              ) : !hasMore && providers.length > 0 ? (
                <View style={styles.footerLoading}>
                  <ThemedText variant="caption" color="textMuted">
                    You've reached the end
                  </ThemedText>
                </View>
              ) : null
            }
          />
        )}

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
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  gridContent: { paddingBottom: theme.spacing.xxxl },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: theme.spacing.xxxl, paddingHorizontal: theme.spacing.xl },
  footerLoading: { paddingVertical: theme.spacing.lg, alignItems: 'center' },
});