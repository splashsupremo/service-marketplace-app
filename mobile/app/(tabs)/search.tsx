import { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  Pressable,
  Modal,
  TextInput,
  FlatList as FlatListType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { SearchBar } from '@/components/ui/SearchBar';
import { ProviderGridCard } from '@/features/providers/components/ProviderGridCard';
import { supabase } from '@/services/supabase/client';
import { mapDbProviderToProvider, DbProvider } from '@/services/supabase/providerMappers';
import { CATEGORIES } from '@/app/services/mockData/categories';
import { NIGERIAN_STATES } from '@/app/services/mockData/nigerianStates';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';
import { Provider } from '@/types/provider';

const PAGE_SIZE = 12;
const GRID_GAP = theme.spacing.md;
const SEARCH_DEBOUNCE_MS = 400;

const SORT_OPTIONS = [
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Newest', value: 'newest' },
  { label: 'Most Reviews', value: 'reviews' },
];

const RATING_OPTIONS = [
  { label: 'Any Rating', value: null },
  { label: '4.5+ Stars', value: 4.5 },
  { label: '4.0+ Stars', value: 4.0 },
  { label: '3.5+ Stars', value: 3.5 },
];

type SortValue = 'rating' | 'newest' | 'reviews';

/**
 * SearchScreen
 *
 * Full-featured search tab: keyword input (debounced), category/state/
 * rating/sort filters, 2-column grid of real Supabase results with
 * server-side pagination.
 */
export default function SearchScreen() {
  const colors = useThemeColors();
  const { width } = useWindowDimensions();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortValue>('rating');

  const [providers, setProviders] = useState<Provider[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Picker modal state
  const [activePicker, setActivePicker] = useState<'category' | 'state' | 'rating' | 'sort' | null>(null);
  const [pickerSearch, setPickerSearch] = useState('');

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cardWidth = (width - theme.spacing.lg * 2 - GRID_GAP) / 2;

  // ── Debounce search query ──
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [searchQuery]);

  // ── Build and run the Supabase query ──
  function buildQuery() {
    let query = supabase.from('providers').select('*', { count: 'exact' });

    if (debouncedQuery.length > 0) {
      query = query.or(`business_name.ilike.%${debouncedQuery}%,category.ilike.%${debouncedQuery}%`);
    }
    if (selectedCategory) query = query.eq('category', selectedCategory);
    if (selectedState) query = query.eq('state', selectedState);
    if (selectedRating) query = query.gte('rating', selectedRating);

    if (sortBy === 'rating') query = query.order('rating', { ascending: false });
    else if (sortBy === 'newest') query = query.order('created_at', { ascending: false });
    else if (sortBy === 'reviews') query = query.order('review_count', { ascending: false });

    return query;
  }

  const fetchFirstPage = useCallback(async () => {
    setIsLoading(true);
    setHasSearched(true);
    const { data, count, error } = await buildQuery().range(0, PAGE_SIZE - 1);

    if (error) {
      console.error('Search error:', error.message);
      setIsLoading(false);
      return;
    }

    setProviders((data ?? []).map((r) => mapDbProviderToProvider(r as DbProvider)));
    setTotalCount(count ?? 0);
    setPage(0);
    setIsLoading(false);
  }, [debouncedQuery, selectedCategory, selectedState, selectedRating, sortBy]);

  useEffect(() => {
    fetchFirstPage();
  }, [fetchFirstPage]);

  async function handleLoadMore() {
    if (providers.length >= totalCount || isLoadingMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    const from = nextPage * PAGE_SIZE;
    const { data, error } = await buildQuery().range(from, from + PAGE_SIZE - 1);

    if (!error && data) {
      setProviders((prev) => [...prev, ...data.map((r) => mapDbProviderToProvider(r as DbProvider))]);
      setPage(nextPage);
    }
    setIsLoadingMore(false);
  }

  function clearAllFilters() {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedState(null);
    setSelectedRating(null);
    setSortBy('rating');
  }

  const hasActiveFilters = !!(selectedCategory || selectedState || selectedRating || sortBy !== 'rating');

  // ── Filter chip button ──
  function FilterChipButton({
    label,
    isActive,
    onPress,
  }: { label: string; isActive: boolean; onPress: () => void }) {
    return (
      <Pressable
        onPress={onPress}
        style={[
          chipStyles.chip,
          {
            backgroundColor: isActive ? colors.primary : colors.surfaceAlt,
            borderColor: isActive ? colors.primary : colors.border,
          },
        ]}
      >
        <ThemedText
          variant="caption"
          style={{ color: isActive ? colors.textInverse : colors.text }}
          numberOfLines={1}
        >
          {label}
        </ThemedText>
        <Ionicons
          name="chevron-down"
          size={12}
          color={isActive ? colors.textInverse : colors.textMuted}
          style={{ marginLeft: 2 }}
        />
      </Pressable>
    );
  }

  // ── Picker modal ──
  function renderPickerModal() {
    if (!activePicker) return null;

    let title = '';
    let options: { label: string; value: any }[] = [];
    let currentValue: any = null;
    let onSelect: (val: any) => void = () => {};

    if (activePicker === 'category') {
      title = 'Category';
      options = [{ label: 'All Categories', value: null }, ...CATEGORIES.map((c) => ({ label: c.name, value: c.name }))];
      currentValue = selectedCategory;
      onSelect = (val) => { setSelectedCategory(val); setActivePicker(null); setPickerSearch(''); };
    } else if (activePicker === 'state') {
      title = 'State';
      options = NIGERIAN_STATES.map((s) => ({ label: s, value: s === 'All States' ? null : s }));
      currentValue = selectedState;
      onSelect = (val) => { setSelectedState(val); setActivePicker(null); setPickerSearch(''); };
    } else if (activePicker === 'rating') {
      title = 'Minimum Rating';
      options = RATING_OPTIONS;
      currentValue = selectedRating;
      onSelect = (val) => { setSelectedRating(val); setActivePicker(null); };
    } else if (activePicker === 'sort') {
      title = 'Sort By';
      options = SORT_OPTIONS;
      currentValue = sortBy;
      onSelect = (val) => { setSortBy(val); setActivePicker(null); };
    }

    const filteredOptions = pickerSearch
      ? options.filter((o) => o.label.toLowerCase().includes(pickerSearch.toLowerCase()))
      : options;

    const showSearch = activePicker === 'category' || activePicker === 'state';

    return (
      <Modal
        visible
        transparent
        animationType="slide"
        onRequestClose={() => { setActivePicker(null); setPickerSearch(''); }}
      >
        <View style={modalStyles.root}>
          <View style={[modalStyles.overlay, { backgroundColor: colors.overlay }]} />
          <View style={[modalStyles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[modalStyles.header, { borderBottomColor: colors.border }]}>
              <ThemedText variant="h3">{title}</ThemedText>
              <Pressable onPress={() => { setActivePicker(null); setPickerSearch(''); }} hitSlop={8}>
                <Ionicons name="close-outline" size={24} color={colors.textSecondary} />
              </Pressable>
            </View>

            {showSearch && (
              <View style={[modalStyles.search, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
                <Ionicons name="search-outline" size={16} color={colors.textMuted} style={{ marginRight: theme.spacing.sm }} />
                <TextInput
                  value={pickerSearch}
                  onChangeText={setPickerSearch}
                  placeholder={`Search ${title.toLowerCase()}...`}
                  placeholderTextColor={colors.textMuted}
                  style={{ flex: 1, fontSize: 14, color: colors.text }}
                  autoCorrect={false}
                  autoCapitalize="none"
                />
              </View>
            )}

            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => String(item.value ?? 'null')}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const isActive = item.value === currentValue;
                return (
                  <Pressable
                    onPress={() => onSelect(item.value)}
                    style={[
                      modalStyles.option,
                      {
                        backgroundColor: isActive ? colors.primaryLight : 'transparent',
                        borderBottomColor: colors.divider,
                      },
                    ]}
                  >
                    <ThemedText
                      variant="body"
                      style={{ color: isActive ? colors.primary : colors.text, fontWeight: isActive ? '600' : '400', flex: 1 }}
                    >
                      {item.label}
                    </ThemedText>
                    {isActive && <Ionicons name="checkmark" size={16} color={colors.primary} />}
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ThemedView style={styles.container}>

        {/* ── Header ── */}
        <View style={styles.pageHeader}>
          <ThemedText variant="h1">Search</ThemedText>
        </View>

        {/* ── Search Bar ── */}
        <View style={styles.searchBarContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search by name or service..."
          />
        </View>

        {/* ── Filter Chips Row ── */}
        <View style={[styles.filtersRow, { borderBottomColor: colors.border }]}>
          <FilterChipButton
            label={selectedCategory ?? 'Category'}
            isActive={!!selectedCategory}
            onPress={() => { setActivePicker('category'); setPickerSearch(''); }}
          />
          <FilterChipButton
            label={selectedState ?? 'State'}
            isActive={!!selectedState}
            onPress={() => { setActivePicker('state'); setPickerSearch(''); }}
          />
          <FilterChipButton
            label={selectedRating ? `${selectedRating}+ ★` : 'Rating'}
            isActive={!!selectedRating}
            onPress={() => setActivePicker('rating')}
          />
          <FilterChipButton
            label={SORT_OPTIONS.find((s) => s.value === sortBy)?.label ?? 'Sort'}
            isActive={sortBy !== 'rating'}
            onPress={() => setActivePicker('sort')}
          />
        </View>

        {/* ── Result Count + Clear ── */}
        {hasSearched && (
          <View style={styles.resultRow}>
            <ThemedText variant="caption" color="textSecondary">
              {isLoading ? 'Searching...' : `${totalCount} provider${totalCount !== 1 ? 's' : ''} found`}
            </ThemedText>
            {hasActiveFilters && (
              <Pressable onPress={clearAllFilters}>
                <ThemedText variant="captionSemibold" style={{ color: colors.primary }}>
                  Clear all
                </ThemedText>
              </Pressable>
            )}
          </View>
        )}

        {/* ── Results Grid ── */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : !hasSearched ? (
          <View style={styles.promptContainer}>
            <Ionicons name="search-outline" size={48} color={colors.textMuted} />
            <ThemedText color="textMuted" style={{ marginTop: theme.spacing.md, textAlign: 'center' }}>
              Search for providers by name, category, or service
            </ThemedText>
          </View>
        ) : providers.length === 0 ? (
          <View style={styles.promptContainer}>
            <Ionicons name="sad-outline" size={48} color={colors.textMuted} />
            <ThemedText color="textMuted" style={{ marginTop: theme.spacing.md, textAlign: 'center' }}>
              No providers match your search.{'\n'}Try different keywords or filters.
            </ThemedText>
            {hasActiveFilters && (
              <Pressable onPress={clearAllFilters} style={{ marginTop: theme.spacing.md }}>
                <ThemedText variant="bodySemibold" style={{ color: colors.primary }}>
                  Clear all filters
                </ThemedText>
              </Pressable>
            )}
          </View>
        ) : (
          <FlatList
            data={providers}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ gap: GRID_GAP }}
            contentContainerStyle={[styles.gridContent, { paddingHorizontal: theme.spacing.lg }]}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.4}
            onEndReached={handleLoadMore}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <ProviderGridCard
                provider={item}
                width={cardWidth}
                onPress={() => router.push({ pathname: '/providers/[id]', params: { id: item.id } })}
                style={{ marginBottom: GRID_GAP }}
              />
            )}
            ListFooterComponent={
              isLoadingMore ? (
                <View style={styles.footerLoader}>
                  <ActivityIndicator color={colors.primary} />
                </View>
              ) : providers.length > 0 && providers.length >= totalCount ? (
                <View style={styles.footerLoader}>
                  <ThemedText variant="caption" color="textMuted">
                    You've reached the end
                  </ThemedText>
                </View>
              ) : null
            }
          />
        )}

        {renderPickerModal()}
      </ThemedView>
    </SafeAreaView>
  );
}

const chipStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    maxWidth: 110,
  },
});

const modalStyles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  sheet: {
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    height: '70%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
  },
});

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  pageHeader: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md, paddingBottom: theme.spacing.sm },
  searchBarContainer: { paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.sm },
  filtersRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    flexWrap: 'nowrap',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  promptContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  gridContent: { paddingTop: theme.spacing.sm, paddingBottom: theme.spacing.xxxl },
  footerLoader: { paddingVertical: theme.spacing.lg, alignItems: 'center' },
});