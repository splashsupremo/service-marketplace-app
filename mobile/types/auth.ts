/**
 * UserRole
 *
 * Matches the `role` check constraint on the `profiles` table in Supabase
 * ('customer' | 'provider'). Chosen once at signup (Phase 7 scope).
 */
export type UserRole = 'customer' | 'provider';

/**
 * Profile
 *
 * Mirrors a row in the `profiles` table. Combined with Supabase's auth
 * `User` object (which has id, email, etc.) to form the complete picture
 * of "who is logged in" used throughout the app.
 */
export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}