import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

export interface ProfileInfoBlockProps {
  businessName: string;
  category: string;
  state: string;
  city: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
}

/**
 * ProfileInfoBlock
 *
 * The identity section directly below the cover image: business name +
 * verification badge, category/location line, and star rating summary.
 */
export function ProfileInfoBlock({
  businessName,
  category,
  state,
  city,
  rating,
  reviewCount,
  isVerified,
}: ProfileInfoBlockProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={styles.nameRow}>
        <ThemedText variant="h2" style={styles.nameText} numberOfLines={2}>
          {businessName}
        </ThemedText>
        {isVerified && (
          <View style={[styles.verifiedPill, { backgroundColor: colors.verifiedBackground }]}>
            <Ionicons name="checkmark-circle" size={14} color={colors.verified} />
            <ThemedText variant="caption" style={{ color: colors.verified, marginLeft: 4 }}>
              Verified
            </ThemedText>
          </View>
        )}
      </View>

      <ThemedText variant="body" color="textSecondary" style={styles.metaText}>
        {category} • {city}, {state}
      </ThemedText>

      <View style={styles.ratingRow}>
        <Ionicons name="star" size={16} color={colors.rating} />
        <ThemedText variant="bodySemibold" style={{ marginLeft: 4 }}>
          {rating.toFixed(1)}
        </ThemedText>
        <ThemedText variant="body" color="textMuted" style={{ marginLeft: 4 }}>
          ({reviewCount} reviews)
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  nameText: { flex: 1 },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  metaText: { marginTop: theme.spacing.xs },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
});