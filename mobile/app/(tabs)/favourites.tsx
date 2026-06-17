import { useEffect, useState, useCallback } from 'react';
import { FlatList, View, StyleSheet, RefreshControl, useWindowDimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { ProviderGridCard } from '@/features/providers/components/ProviderGridCard';
import { AuthPrompt } from '@/features/auth/components/AuthPrompt';
import { EmptyFavourites } from '@/features/favourites/components/EmptyFavourites';
import { useAuthStore } from '@/store/authStore';
import { useFavouritesStore } from '@/store/favouritesStore';
import { supabase } from '@/services/supabase/client';
import { mapDbProviderToProvider, DbProvider } from '@/services/supabase/providerMappers';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';
import { Provider } from '@/types/provider';

const GRID_GAP = theme.spacing.md;

/**
 * FavouritesScreen
 *
 * Phase 12 fix: favourite provider DISPLAY data now comes from a real
 * Supabase query (fetching all favourited provider rows by id in one
 * batch request), instead of looking them up in MOCK_PROVIDERS — which
 * no longer matches, since favouriteIds now holds real provider UUIDs.
 */
export default function FavouritesScreen() {
  const colors = useThemeColors();
  const { width } = useWindowDimensions();
  const isAuthenticated = useAuthStore((s) => !!s.user);

  const favouriteIds = useFavouritesStore((s) => s.favouriteIds);
  const fetchFavourites = useFavouritesStore((s) => s.fetchFavourites);

  const [favouriteProviders, setFavouriteProviders] = useState<Provider[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavourites();
    }
  }, [isAuthenticated]);

  const loadFavouriteProviders = useCallback(async () => {
    if (favouriteIds.length === 0) {
      setFavouriteProviders([]);
      setIsLoadingProviders(false);
      return;
    }

    setIsLoadingProviders(true);
    const { data, error } = await supabase
      .from('providers')
      .select('*')
      .in('id', favouriteIds);

    if (error) {
      console.error('Error fetching favourite providers:', error.message);
      setIsLoadingProviders(false);
      return;
    }

    setFavouriteProviders((data ?? []).map((row) => mapDbProviderToProvider(row as DbProvider)));
    setIsLoadingProviders(false);
  }, [favouriteIds]);

  useEffect(() => {
    loadFavouriteProviders();
  }, [loadFavouriteProviders]);

  async function handleRefresh() {
    setRefreshing(true);
    await fetchFavourites();
    await loadFavouriteProviders();
    setRefreshing(false);
  }

  const horizontalPadding = theme.spacing.lg;
  const cardWidth = (width - horizontalPadding * 2 - GRID_GAP) / 2;

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
        <AuthPrompt
          icon="heart-outline"
          title="Save your favourites"
          message="Sign up to save providers you like and find them easily later."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText variant="h1">Favourites</ThemedText>
        </View>

        {isLoadingProviders ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : favouriteProviders.length === 0 ? (
          <EmptyFavourites />
        ) : (
          <FlatList
            data={favouriteProviders}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ gap: GRID_GAP }}
            contentContainerStyle={[styles.gridContent, { paddingHorizontal: horizontalPadding }]}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} colors={[colors.primary]} />
            }
            renderItem={({ item }) => (
              <ProviderGridCard
                provider={item}
                width={cardWidth}
                onPress={() => router.push({ pathname: '/providers/[id]', params: { id: item.id } })}
                style={{ marginBottom: GRID_GAP }}
              />
            )}
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md, paddingBottom: theme.spacing.sm },
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  gridContent: { paddingBottom: theme.spacing.xxxl },
});