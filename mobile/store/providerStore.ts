import { create } from 'zustand';
import { supabase } from '@/services/supabase/client';

export interface OwnedProvider {
  id: string;
  user_id: string;
  business_name: string;
  category: string;
  state: string;
  city: string;
  description: string;
  image_url: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface OwnedService {
  id: string;
  provider_id: string;
  name: string;
  price: number;
  created_at: string;
}

export interface ProviderFormInput {
  business_name: string;
  category: string;
  state: string;
  city: string;
  description: string;
  image_url?: string | null;
}

interface ProviderState {
  myProvider: OwnedProvider | null;
  myServices: OwnedService[];
  isLoading: boolean;
  hasFetched: boolean;

  fetchMyProvider: () => Promise<void>;
  createProvider: (input: ProviderFormInput) => Promise<{ error: string | null }>;
  updateProvider: (input: ProviderFormInput) => Promise<{ error: string | null }>;
  uploadLogo: (localUri: string) => Promise<{ url: string | null; error: string | null }>;

  addService: (name: string, price: number) => Promise<{ error: string | null }>;
  updateService: (serviceId: string, name: string, price: number) => Promise<{ error: string | null }>;
  deleteService: (serviceId: string) => Promise<{ error: string | null }>;

  reset: () => void;
}

/**
 * useProviderStore
 *
 * Manages the logged-in user's OWN provider listing and services —
 * distinct from MOCK_PROVIDERS (used for the public customer-facing
 * Home/Listings screens until Phase 12). This store talks to the real
 * `providers` and `services` Supabase tables and the `provider-logos`
 * Storage bucket.
 */
export const useProviderStore = create<ProviderState>((set, get) => ({
  myProvider: null,
  myServices: [],
  isLoading: false,
  hasFetched: false,

  /**
   * fetchMyProvider
   *
   * Loads the current user's provider row (if any) and its services.
   * If the user has no provider row yet, myProvider stays null — the
   * dashboard screen uses this to show the "Create Your Listing" prompt.
   */
  fetchMyProvider: async () => {
    set({ isLoading: true });

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;

    if (!userId) {
      set({ myProvider: null, myServices: [], isLoading: false, hasFetched: true });
      return;
    }

    const { data: providerData, error: providerError } = await supabase
      .from('providers')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle(); // returns null instead of erroring if no row exists

    if (providerError) {
      console.error('Error fetching provider:', providerError.message);
      set({ isLoading: false, hasFetched: true });
      return;
    }

    if (!providerData) {
      set({ myProvider: null, myServices: [], isLoading: false, hasFetched: true });
      return;
    }

    const { data: servicesData, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .eq('provider_id', providerData.id)
      .order('created_at', { ascending: true });

    if (servicesError) {
      console.error('Error fetching services:', servicesError.message);
    }

    set({
      myProvider: providerData as OwnedProvider,
      myServices: (servicesData ?? []) as OwnedService[],
      isLoading: false,
      hasFetched: true,
    });
  },

  /**
   * createProvider
   *
   * Inserts a new provider row for the current user. Fails gracefully
   * if they already have one (the unique constraint on user_id would
   * reject a second row at the database level).
   */
  createProvider: async (input) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;

    if (!userId) {
      return { error: 'You must be logged in to create a listing.' };
    }

    const { data, error } = await supabase
      .from('providers')
      .insert({ ...input, user_id: userId })
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    set({ myProvider: data as OwnedProvider });
    return { error: null };
  },

  /**
   * updateProvider
   */
  updateProvider: async (input) => {
    const current = get().myProvider;
    if (!current) {
      return { error: 'No listing found to update.' };
    }

    const { data, error } = await supabase
      .from('providers')
      .update(input)
      .eq('id', current.id)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    set({ myProvider: data as OwnedProvider });
    return { error: null };
  },

  /**
 /**
 * uploadLogo
 *
 * Uploads a local image file (picked via expo-image-picker) to the
 * provider-logos Storage bucket. Uses expo-file-system's new File class
 * (SDK 54+) to read the file's bytes directly, avoiding fetch()-to-blob
 * conversion which can fail on Android for content:// URIs.
 */
uploadLogo: async (localUri: string) => {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;

  if (!userId) {
    return { url: null, error: 'You must be logged in to upload a photo.' };
  }

  try {
    const { File } = await import('expo-file-system');

    const file = new File(localUri);
    const bytes = await file.bytes();

    const filePath = `${userId}/logo.jpg`;

    const { error: uploadError } = await supabase.storage
      .from('provider-logos')
      .upload(filePath, bytes, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from('provider-logos')
      .getPublicUrl(filePath);

    const cacheBustedUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;

    return { url: cacheBustedUrl, error: null };
  } catch (err) {
    console.error('Upload error details:', err);
    return { url: null, error: 'Failed to upload image. Please try again.' };
  }
},

  /**
   * addService
   */
  addService: async (name, price) => {
    const provider = get().myProvider;
    if (!provider) {
      return { error: 'You must create a listing before adding services.' };
    }

    const { data, error } = await supabase
      .from('services')
      .insert({ provider_id: provider.id, name, price })
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    set((state) => ({ myServices: [...state.myServices, data as OwnedService] }));
    return { error: null };
  },

  /**
   * updateService
   */
  updateService: async (serviceId, name, price) => {
    const { data, error } = await supabase
      .from('services')
      .update({ name, price })
      .eq('id', serviceId)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    set((state) => ({
      myServices: state.myServices.map((s) => (s.id === serviceId ? (data as OwnedService) : s)),
    }));
    return { error: null };
  },

  /**
   * deleteService
   */
  deleteService: async (serviceId) => {
    const { error } = await supabase.from('services').delete().eq('id', serviceId);

    if (error) {
      return { error: error.message };
    }

    set((state) => ({
      myServices: state.myServices.filter((s) => s.id !== serviceId),
    }));
    return { error: null };
  },

  /**
   * reset
   *
   * Clears the store — called on logout so a different provider
   * logging in on the same device doesn't briefly see stale data.
   */
  reset: () => {
    set({ myProvider: null, myServices: [], isLoading: false, hasFetched: false });
  },
}));