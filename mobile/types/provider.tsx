/**
 * Provider
 *
 * Represents a service provider listed on the marketplace.
 * This shape mirrors the eventual Supabase `providers` table (Phase 12) —
 * defining it now ensures our UI components are built against the
 * correct data shape from day one.
 */
export interface Provider {
  /** Unique identifier (UUID once backed by Supabase) */
  id: string;

  /** Display name of the business, e.g. "Ade's Plumbing Services" */
  businessName: string;

  /** Category name — must match a Category.name from categories.ts */
  category: string;

  /** Nigerian state, e.g. "Lagos" */
  state: string;

  /** City within the state, e.g. "Ikeja" */
  city: string;

  /** Average rating, 0-5 (e.g. 4.8) */
  rating: number;

  /** Total number of reviews contributing to the rating */
  reviewCount: number;

  /** Whether the provider has been verified by an admin */
  isVerified: boolean;

  /** URL to the provider's main/profile image */
  imageUrl: string;

  /** Whether this provider should appear in the "Featured" section */
  isFeatured: boolean;

  /** Provider phone number, if available */
  phoneNumber: string | null;

  /** ISO 8601 date string — used to sort "Recently Added" */
  createdAt: string;
}