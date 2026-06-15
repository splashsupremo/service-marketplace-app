/**
 * Color tokens for the app.
 * 
 * We define two palettes: `light` and `dark`. Each palette has the SAME
 * keys (background, text, primary, etc.) but different values. This means
 * components can write `colors.background` once, and it will automatically
 * resolve to the correct value depending on the active theme.
 */

export const lightColors = {
  // Backgrounds
  background: '#FFFFFF',        // Main screen background
  surface: '#F8F9FB',           // Cards, inputs, elevated surfaces
  surfaceAlt: '#F1F3F6',        // Secondary surface (e.g., search bar background)

  // Text
  text: '#0F172A',              // Primary text (near-black, slate-900)
  textSecondary: '#64748B',     // Secondary text (slate-500)
  textMuted: '#94A3B8',         // Muted/placeholder text (slate-400)
  textInverse: '#FFFFFF',       // Text on dark/colored backgrounds

  // Borders & dividers
  border: '#E2E8F0',            // Default border color (slate-200)
  divider: '#EDF1F5',           // Divider lines

  // Brand / primary
  primary: '#1E40AF',           // Deep indigo-blue — primary actions, links, active states
  primaryLight: '#DBEAFE',      // Light tint of primary (badges, selected backgrounds)
  primaryDark: '#1E3A8A',       // Darker shade (pressed states)

  // Accent (CTAs, "Featured" highlights)
  accent: '#F59E0B',            // Warm amber — Featured badges, highlight CTAs
  accentLight: '#FEF3C7',       // Light tint of accent

  // Semantic colors
  success: '#16A34A',           // Verified badges, success states, online status
  successLight: '#DCFCE7',
  error: '#DC2626',             // Error messages, destructive actions
  errorLight: '#FEE2E2',
  warning: '#D97706',           // Warning states
  warningLight: '#FEF3C7',

  // Rating stars
  rating: '#FBBF24',            // Star rating color (gold/yellow)

  // Verification badge
  verified: '#16A34A',          // Same as success — verified provider checkmark
  verifiedBackground: '#DCFCE7',

  // Overlay (e.g., image overlays, modals)
  overlay: 'rgba(15, 23, 42, 0.5)',
} as const;

export const darkColors = {
  // Backgrounds
  background: '#0B1120',        // Main screen background (very dark navy)
  surface: '#161E2E',           // Cards, inputs, elevated surfaces
  surfaceAlt: '#1E293B',        // Secondary surface

  // Text
  text: '#F1F5F9',               // Primary text (near-white)
  textSecondary: '#94A3B8',      // Secondary text
  textMuted: '#64748B',          // Muted/placeholder text
  textInverse: '#0F172A',        // Text on light/colored backgrounds

  // Borders & dividers
  border: '#293548',
  divider: '#1E293B',

  // Brand / primary
  primary: '#3B82F6',            // Brighter blue for dark mode (better contrast)
  primaryLight: '#1E3A8A',
  primaryDark: '#60A5FA',

  // Accent
  accent: '#FBBF24',              // Brighter amber for dark mode
  accentLight: '#451A03',

  // Semantic colors
  success: '#22C55E',
  successLight: '#052E16',
  error: '#EF4444',
  errorLight: '#450A0A',
  warning: '#F59E0B',
  warningLight: '#451A03',

  // Rating stars
  rating: '#FBBF24',

  // Verification badge
  verified: '#22C55E',
  verifiedBackground: '#052E16',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.6)',
} as const;

// Type representing the shape of a color palette (used for type-checking)
export type ColorPalette = { [K in keyof typeof lightColors]: string };