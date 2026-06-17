import { create } from 'zustand';
import { supabase } from '@/services/supabase/client';
import { Profile, UserRole } from '@/types/auth';
import type { User } from '@supabase/supabase-js';
import { useFavouritesStore } from '@/store/favouritesStore';
import { useProviderStore } from '@/store/providerStore';
interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;

  initialize: () => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role: UserRole
  ) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (fullName: string) => Promise<{ error: string | null }>;
}

/**
 * fetchProfile
 *
 * Looks up the profiles row for a given user id. Returns null (rather
 * than throwing) if not found or on error, since the caller decides how
 * to handle a missing profile (it shouldn't normally happen, thanks to
 * our database trigger, but defensive code here avoids crashing the app
 * if it ever does).
 */
async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error.message);
    return null;
  }

  return data as Profile;
}

/**
 * useAuthStore
 *
 * Global auth state, backed by Supabase Auth. Any component can import
 * this directly (no <Provider> needed):
 *
 *   const { isAuthenticated, profile, signOut } = useAuthStore();
 *
 * Or select just one slice to avoid unnecessary re-renders:
 *
 *   const isAuthenticated = useAuthStore((s) => !!s.user);
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  isInitialized: false,

  /**
   * initialize
   *
   * Called once on app startup (from app/_layout.tsx). Checks for an
   * existing Supabase session (so returning users aren't logged out
   * every time they reopen the app), fetches their profile if found,
   * and subscribes to future auth state changes so the store stays in
   * sync automatically (e.g. if the session is refreshed or expires).
   */
  initialize: async () => {
    const { data } = await supabase.auth.getSession();
    const sessionUser = data.session?.user ?? null;

    let profile: Profile | null = null;
    if (sessionUser) {
      profile = await fetchProfile(sessionUser.id);
    }

    set({ user: sessionUser, profile, isLoading: false, isInitialized: true });

    // Keep the store in sync with any future auth changes
    // (token refresh, session expiry, sign-out from another tab/device, etc.)
    supabase.auth.onAuthStateChange(async (_event, session) => {
      const newUser = session?.user ?? null;
      if (newUser) {
        const newProfile = await fetchProfile(newUser.id);
        set({ user: newUser, profile: newProfile });
      } else {
        set({ user: null, profile: null });
      }
    });
  },

  /**
   * signUp
   *
   * Creates a new Supabase auth user, passing full_name and role as
   * metadata — our database trigger (handle_new_user) reads this
   * metadata to create the matching profiles row automatically.
   */
  signUp: async (email, password, fullName, role) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user) {
      // Small delay to give the database trigger a moment to finish
      // creating the profile row before we try to read it back.
      await new Promise((resolve) => setTimeout(resolve, 500));
      const profile = await fetchProfile(data.user.id);
      set({ user: data.user, profile });
    }

    return { error: null };
  },

  /**
   * signIn
   */
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user) {
      const profile = await fetchProfile(data.user.id);
      set({ user: data.user, profile });
    }

    return { error: null };
  },

  /**
   * signOut
   */
signOut: async () => {
  await supabase.auth.signOut();
  set({ user: null, profile: null });
  useFavouritesStore.getState().clearFavourites();
  useProviderStore.getState().reset();
},

  /**
   * updateProfile
   *
   * Updates the current user's full_name in the profiles table, then
   * syncs the local store so the change reflects immediately across
   * the app without needing a full re-fetch.
   */
  updateProfile: async (fullName: string) => {
    const currentUser = get().user;
    if (!currentUser) {
      return { error: 'You must be logged in to update your profile.' };
    }

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', currentUser.id);

    if (error) {
      return { error: error.message };
    }

    set((state) => ({
      profile: state.profile ? { ...state.profile, full_name: fullName } : state.profile,
    }));

    return { error: null };
  },
}));
