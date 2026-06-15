import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { theme } from '@/constants/theme';

export default function Index() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText variant="h1">Component Test</ThemedText>

      <ThemedView variant="surface" style={styles.surfaceBox}>
        <ThemedText>This is a "surface" ThemedView</ThemedText>
      </ThemedView>

      <Button label="Primary Button" onPress={() => console.log('Primary pressed')} fullWidth />
      <Button label="Secondary Button" variant="secondary" onPress={() => console.log('Secondary pressed')} fullWidth />
      <Button label="Outline Button" variant="outline" onPress={() => console.log('Outline pressed')} fullWidth />

      <Button label="Small" size="sm" onPress={() => {}} />
      <Button label="Loading..." loading onPress={() => {}} />
      <Button label="Disabled" disabled onPress={() => {}} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  surfaceBox: {
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
  },
});