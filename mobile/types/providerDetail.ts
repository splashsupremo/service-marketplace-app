import { Provider } from './provider';

/**
 * Service
 *
 * A single service offered by a provider, with a name and price in Naira.
 */
export interface Service {
  id: string;
  name: string;
  /** Price in Naira (whole number, no decimals — standard for this market) */
  price: number;
}

/**
 * Review
 *
 * A single customer review left on a provider's profile.
 */
export interface Review {
  id: string;
  reviewerName: string;
  /** 1-5 */
  rating: number;
  comment: string;
  /** ISO 8601 date string */
  createdAt: string;
}

/**
 * ProviderDetail
 *
 * Extends the base Provider (used in cards/lists) with the richer data
 * needed for the full Profile screen: a description, services list,
 * and reviews. Kept separate from Provider so list/card components stay
 * lightweight — only the Profile screen needs to load this much data.
 */
export interface ProviderDetail extends Provider {
  description: string;
  services: Service[];
  reviews: Review[];
}