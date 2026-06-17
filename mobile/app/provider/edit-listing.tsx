import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

// TODO: replace with the real create/edit listing form (next step)
export default function EditListingScreen() {
  const colors = useThemeColors();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ThemedView style={styles.container}>
        <ThemedText variant="h2">Edit Listing</ThemedText>
        <ThemedText color="textSecondary" style={{ marginTop: theme.spacing.sm }}>
          Coming soon
        </ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.lg },
});