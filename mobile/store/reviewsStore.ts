import { create } from 'zustand';
import { supabase } from '@/services/supabase/client';

export interface ProviderReview {
  id: string;
  provider_id: string;
  customer_id: string;
  rating: number;
  comment: string;
  created_at: string;
  customerName: string;
}

interface ReviewsState {
  myProviderReviews: ProviderReview[];
  isLoadingReviews: boolean;

  submitReview: (providerId: string, rating: number, comment: string) => Promise<{ error: string | null }>;
  hasReviewed: (providerId: string) => Promise<boolean>;
  fetchProviderReviews: (providerId: string) => Promise<void>;
}

export const useReviewsStore = create<ReviewsState>((set) => ({
  myProviderReviews: [],
  isLoadingReviews: false,

  /**
   * submitReview
   *
   * Inserts a new review. The RLS policy will reject this if the
   * customer has no conversation with the provider; the unique
   * constraint will reject it if they've already reviewed this
   * provider — both surface here as a Postgres error we turn into a
   * readable message.
   */
  submitReview: async (providerId, rating, comment) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    if (!userId) {
      return { error: 'You must be logged in to leave a review.' };
    }

    const { error } = await supabase
      .from('reviews')
      .insert({ provider_id: providerId, customer_id: userId, rating, comment });

    if (error) {
      // Postgres unique violation error code
      if (error.code === '23505') {
        return { error: "You've already reviewed this provider." };
      }
      return { error: error.message };
    }

    return { error: null };
  },

  /**
   * hasReviewed
   *
   * Checks if the logged-in customer already has a review for this
   * provider, so the UI can show "already reviewed" up front instead
   * of waiting for a rejected submission.
   */
  hasReviewed: async (providerId: string) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    if (!userId) return false;

    const { data } = await supabase
      .from('reviews')
      .select('id')
      .eq('provider_id', providerId)
      .eq('customer_id', userId)
      .maybeSingle();

    return !!data;
  },

  /**
   * fetchProviderReviews
   *
   * Loads all reviews for a given provider (used by the provider's
   * own "My Reviews" dashboard screen), joining in each reviewer's
   * display name from profiles.
   */
  fetchProviderReviews: async (providerId: string) => {
    set({ isLoadingReviews: true });

    const { data: reviewsData, error } = await supabase
      .from('reviews')
      .select('id, provider_id, customer_id, rating, comment, created_at')
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching provider reviews:', error.message);
      set({ isLoadingReviews: false });
      return;
    }

    if (!reviewsData || reviewsData.length === 0) {
      set({ myProviderReviews: [], isLoadingReviews: false });
      return;
    }

    const customerIds = [...new Set(reviewsData.map((r) => r.customer_id))];
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', customerIds);

    const profilesById = new Map((profilesData ?? []).map((p) => [p.id, p]));

    const enriched: ProviderReview[] = reviewsData.map((r) => ({
      ...r,
      customerName: profilesById.get(r.customer_id)?.full_name ?? 'Customer',
    }));

    set({ myProviderReviews: enriched, isLoadingReviews: false });
  },
}));