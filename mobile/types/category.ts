/**
 * Category
 *
 * Represents a service category (e.g. "Plumbing", "IT & Tech Support").
 * `icon` must be a valid Ionicons icon name (from @expo/vector-icons),
 * since CategoryChip renders it directly via <Ionicons name={icon} />.
 */
export interface Category {
  id: string;
  name: string;
  icon: string;
}