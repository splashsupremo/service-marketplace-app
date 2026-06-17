import { Provider } from '@/types/provider';

/**
 * DbProvider
 *
 * Shape of a row as it comes back from Supabase's `providers` table —
 * snake_case, matching the actual Postgres column names.
 */
export interface DbProvider {
  id: string;
  user_id: string;
  business_name: string;
  category: string;
  state: string;
  city: string;
  description: string;
  image_url: string | null;
  is_verified: boolean;
  is_featured: boolean;
  rating: number;
  review_count: number;
  created_at: string;
}

/**
 * mapDbProviderToProvider
 *
 * Converts a raw Supabase providers row (snake_case) into our app's
 * existing Provider shape (camelCase), so every component built since
 * Phase 4 — ProviderCard, ProviderGridCard, Home/Listings filtering —
 * continues to work completely unchanged. Only the data-fetching layer
 * needs to know about this mapping; rendering logic never does.
 *
 * Note: Provider.imageUrl falls back to a placeholder if the provider
 * hasn't uploaded a logo yet, since our card components always expect
 * a renderable image URL.
 */
export function mapDbProviderToProvider(row: DbProvider): Provider {
  return {
    id: row.id,
    businessName: row.business_name,
    category: row.category,
    state: row.state,
    city: row.city,
    rating: row.rating,
    reviewCount: row.review_count,
    isVerified: row.is_verified,
    imageUrl: row.image_url ?? `https://picsum.photos/seed/${row.id}/400/300`,
    isFeatured: row.is_featured,
    createdAt: row.created_at,
  };
}