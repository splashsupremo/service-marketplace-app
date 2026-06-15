import { Category } from '@/types/category';

/**
 * Service Categories
 *
 * 15 categories covering both globally common services and categories
 * especially prominent in the Nigerian market (IT/tech, fashion &
 * tailoring, generator & power solutions, etc.)
 *
 * `icon` values are Ionicons names — see https://icons.expo.fyi for the
 * full searchable list.
 */
export const CATEGORIES: Category[] = [
  { id: 'cat-01', name: 'Plumbing', icon: 'water-outline' },
  { id: 'cat-02', name: 'Electrical', icon: 'flash-outline' },
  { id: 'cat-03', name: 'Cleaning', icon: 'sparkles-outline' },
  { id: 'cat-04', name: 'Tutoring', icon: 'school-outline' },
  { id: 'cat-05', name: 'Photography', icon: 'camera-outline' },
  { id: 'cat-06', name: 'Catering', icon: 'restaurant-outline' },
  { id: 'cat-07', name: 'Hair & Beauty', icon: 'cut-outline' },
  { id: 'cat-08', name: 'Auto Repair', icon: 'car-outline' },
  { id: 'cat-09', name: 'IT & Tech Support', icon: 'desktop-outline' },
  { id: 'cat-10', name: 'Web & Software Development', icon: 'code-slash-outline' },
  { id: 'cat-11', name: 'Fashion & Tailoring', icon: 'shirt-outline' },
  { id: 'cat-12', name: 'Event Planning', icon: 'calendar-outline' },
  { id: 'cat-13', name: 'Generator & Power Solutions', icon: 'battery-charging-outline' },
  { id: 'cat-14', name: 'Carpentry & Furniture', icon: 'hammer-outline' },
  { id: 'cat-15', name: 'Moving & Logistics', icon: 'cube-outline' },
];