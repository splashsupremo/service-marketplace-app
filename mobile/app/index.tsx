import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

export default function Index() {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedText variant="h1">Heading 1</ThemedText>
      <ThemedText variant="h2">Heading 2</ThemedText>
      <ThemedText variant="h3">Heading 3</ThemedText>
      <ThemedText variant="bodyLarge">Body large text</ThemedText>
      <ThemedText variant="body">Regular body text</ThemedText>
      <ThemedText variant="caption" color="textMuted">
        Caption / muted text
      </ThemedText>
      <ThemedText color="error">Error message example</ThemedText>
      <ThemedText color="primary">Primary colored text</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
});