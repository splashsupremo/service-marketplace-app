import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

export interface StickyActionBarProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
}

export function StickyActionBar({ label, onPress, loading = false }: StickyActionBarProps) {
  const colors = useThemeColors();

  return (
    <SafeAreaView edges={['bottom']} style={{ backgroundColor: colors.surface }}>
      <View style={[styles.container, { borderTopColor: colors.border }]}>
        <Button label={label} onPress={onPress} fullWidth size="lg" loading={loading} />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
  },
});