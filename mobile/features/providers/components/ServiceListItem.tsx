import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';
import { Service } from '@/types/providerDetail';
import { formatNaira } from '@/utils/formatCurrency';

export interface ServiceListItemProps {
  service: Service;
  /** Whether to show a bottom divider — false for the last item in a list */
  showDivider?: boolean;
}

/**
 * ServiceListItem
 *
 * One row in the Services section: service name on the left, price
 * (formatted in Naira) on the right.
 */
export function ServiceListItem({ service, showDivider = true }: ServiceListItemProps) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        styles.container,
        showDivider && { borderBottomWidth: 1, borderBottomColor: colors.divider },
      ]}
    >
      <ThemedText variant="body" style={styles.name}>
        {service.name}
      </ThemedText>
      <ThemedText variant="bodySemibold" style={{ color: colors.primary }}>
        {formatNaira(service.price)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
  },
  name: { flex: 1, marginRight: theme.spacing.sm },
});