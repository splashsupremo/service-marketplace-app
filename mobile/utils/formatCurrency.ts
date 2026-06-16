/**
 * formatNaira
 *
 * Formats a number as a Naira currency string, e.g. 15000 -> "₦15,000".
 * Centralized here so every screen displaying prices formats consistently.
 *
 * Usage:
 *   formatNaira(15000) // "₦15,000"
 */
export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}