import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';
import { formatNaira } from '@/utils/formatCurrency';
import { OwnedService } from '@/store/providerStore';

export interface ManagedServiceRowProps {
  service: OwnedService;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * ManagedServiceRow
 *
 * One row in the Manage Services list: name + price on the left,
 * edit and delete icon buttons on the right. Distinct from the
 * read-only ServiceListItem (Phase 6) used on the public profile.
 */
export function ManagedServiceRow({ service, onEdit, onDelete }: ManagedServiceRowProps) {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { borderBottomColor: colors.divider }]}>
      <View style={{ flex: 1 }}>
        <ThemedText variant="bodySemibold">{service.name}</ThemedText>
        <ThemedText variant="caption" color="textSecondary">
          {formatNaira(service.price)}
        </ThemedText>
      </View>

      <Pressable onPress={onEdit} hitSlop={8} style={styles.iconButton} accessibilityLabel={`Edit ${service.name}`}>
        <Ionicons name="create-outline" size={20} color={colors.primary} />
      </Pressable>
      <Pressable onPress={onDelete} hitSlop={8} style={styles.iconButton} accessibilityLabel={`Delete ${service.name}`}>
        <Ionicons name="trash-outline" size={20} color={colors.error} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
  },
  iconButton: { marginLeft: theme.spacing.sm, padding: 4 },
});