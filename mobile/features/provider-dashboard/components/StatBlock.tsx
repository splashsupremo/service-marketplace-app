import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

export interface StatBlockProps {
  value: string;
  label: string;
}

/**
 * StatBlock
 *
 * A single stat tile (value + label) used in a row on the Provider
 * Dashboard (Rating, Reviews, Services). Reusable for any future
 * "number + label" stat display.
 */
export function StatBlock({ value, label }: StatBlockProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <ThemedText variant="h2" style={{ color: colors.primary }}>
        {value}
      </ThemedText>
      <ThemedText variant="caption" color="textSecondary">
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
});