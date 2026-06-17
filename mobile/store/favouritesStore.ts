import { create } from 'zustand';
import { supabase } from '@/services/supabase/client';

interface FavouritesState {
  favouriteIds: string[];
  isLoading: boolean;

  fetchFavourites: () => Promise<void>;
  toggleFavourite: (providerId: string) => Promise<{ error: string | null }>;
  isFavourited: (providerId: string) => boolean;
  clearFavourites: () => void;
}

/**
 * useFavouritesStore
 *
 * Manages the current user's saved providers, backed by the Supabase
 * `favourites` table. Shared between the Favourites tab (which reads
 * the full list) and the heart icon on Provider Profile screens (which
 * reads/writes a single provider's status) — both stay in sync
 * automatically since they share this one store.
 *
 * Note: favouriteIds only stores provider id strings (still referencing
 * mock provider data until Phase 12) — the actual provider details
 * (name, image, rating, etc.) are looked up separately from
 * MOCK_PROVIDERS wherever the list is displayed.
 */
export const useFavouritesStore = create<FavouritesState>((set, get) => ({
  favouriteIds: [],
  isLoading: false,

  /**
   * fetchFavourites
   *
   * Loads the current user's favourite provider ids from Supabase.
   * Called when the Favourites tab mounts. If there's no logged-in
   * user, this resolves with an empty list rather than erroring,
   * since RLS would reject the query anyway with no session.
   */
  fetchFavourites: async () => {
    set({ isLoading: true });

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      set({ favouriteIds: [], isLoading: false });
      return;
    }

    const { data, error } = await supabase
      .from('favourites')
      .select('provider_id')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching favourites:', error.message);
      set({ isLoading: false });
      return;
    }

    set({
      favouriteIds: data.map((row) => row.provider_id),
      isLoading: false,
    });
  },

  /**
   * toggleFavourite
   *
   * Adds or removes a provider from favourites. Uses an optimistic
   * update: local state changes immediately for a responsive heart
   * icon, then the Supabase request runs in the background. On
   * failure, the local change is rolled back and an error is returned
   * for the caller to display.
   */
  toggleFavourite: async (providerId: string) => {
    const wasAlreadyFavourited = get().favouriteIds.includes(providerId);

    // Optimistic update
    set((state) => ({
      favouriteIds: wasAlreadyFavourited
        ? state.favouriteIds.filter((id) => id !== providerId)
        : [...state.favouriteIds, providerId],
    }));

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;

    if (!userId) {
      // Roll back — shouldn't normally happen since the UI guards this,
      // but defensive in case of an expired session.
      set((state) => ({
        favouriteIds: wasAlreadyFavourited
          ? [...state.favouriteIds, providerId]
          : state.favouriteIds.filter((id) => id !== providerId),
      }));
      return { error: 'You must be logged in to save favourites.' };
    }

    if (wasAlreadyFavourited) {
      const { error } = await supabase
        .from('favourites')
        .delete()
        .eq('user_id', userId)
        .eq('provider_id', providerId);

      if (error) {
        // Roll back
        set((state) => ({ favouriteIds: [...state.favouriteIds, providerId] }));
        return { error: error.message };
      }
    } else {
      const { error } = await supabase
        .from('favourites')
        .insert({ user_id: userId, provider_id: providerId });

      if (error) {
        // Roll back
        set((state) => ({
          favouriteIds: state.favouriteIds.filter((id) => id !== providerId),
        }));
        return { error: error.message };
      }
    }

    return { error: null };
  },

  /**
   * isFavourited
   *
   * Simple lookup helper so screens don't repeat
   * `favouriteIds.includes(id)` everywhere.
   */
  isFavourited: (providerId: string) => {
    return get().favouriteIds.includes(providerId);
  },

  /**
   * clearFavourites
   *
   * Called on logout so a different user logging in on the same
   * device doesn't briefly see the previous user's saved providers
   * before fetchFavourites() runs again.
   */
  clearFavourites: () => {
    set({ favouriteIds: [] });
  },
}));