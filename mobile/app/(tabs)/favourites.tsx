import { useEffect, useMemo, useState } from 'react';
import { FlatList, View, StyleSheet, RefreshControl, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { ProviderGridCard } from '@/features/providers/components/ProviderGridCard';
import { AuthPrompt } from '@/features/auth/components/AuthPrompt';
import { EmptyFavourites } from '@/features/favourites/components/EmptyFavourites';
import { useAuthStore } from '@/store/authStore';
import { useFavouritesStore } from '@/store/favouritesStore';
import { MOCK_PROVIDERS } from '@/app/services/mockData/providers';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

const GRID_GAP = theme.spacing.md;

/**
 * FavouritesScreen
 *
 * Visitor: AuthPrompt (sign up / log in to save favourites).
 * Authenticated, no favourites: EmptyFavourites prompt.
 * Authenticated, with favourites: 2-column grid of saved providers,
 * same visual pattern as the Listings screen (ProviderGridCard reused).
 */
export default function FavouritesScreen() {
  const colors = useThemeColors();
  const { width } = useWindowDimensions();
  const isAuthenticated = useAuthStore((s) => !!s.user);

  const favouriteIds = useFavouritesStore((s) => s.favouriteIds);
  const fetchFavourites = useFavouritesStore((s) => s.fetchFavourites);
  const isLoading = useFavouritesStore((s) => s.isLoading);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavourites();
    }
  }, [isAuthenticated]);

  const favouriteProviders = useMemo(
    () => favouriteIds
      .map((id) => MOCK_PROVIDERS.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined),
    [favouriteIds]
  );

  async function handleRefresh() {
    setRefreshing(true);
    await fetchFavourites();
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

        {!isLoading && favouriteProviders.length === 0 ? (
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
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
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
  gridContent: { paddingBottom: theme.spacing.xxxl },
});