import { StyleSheet, View, Image } from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Card } from '@/components/ui/Card';
import { theme } from '@/constants/theme';

export default function Index() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText variant="h1">Card Test</ThemedText>

      {/* Non-interactive card */}
      <Card>
        <ThemedText variant="h3">Static Card</ThemedText>
        <ThemedText color="textSecondary">
          This card has no onPress — it's just a container.
        </ThemedText>
      </Card>

      {/* Tappable card with default padding */}
      <Card onPress={() => console.log('Tappable card pressed')}>
        <ThemedText variant="h3">Tappable Card</ThemedText>
        <ThemedText color="textSecondary">Tap me — check the terminal.</ThemedText>
      </Card>

      {/* Image-heavy card with zero padding, content padded separately */}
      <Card onPress={() => console.log('Provider-style card pressed')} padding={0}>
        <Image
          source={{ uri: 'https://picsum.photos/seed/provider1/400/200' }}
          style={styles.cardImage}
        />
        <View style={{ padding: theme.spacing.md }}>
          <ThemedText variant="h3">Sample Provider Name</ThemedText>
          <ThemedText color="textSecondary">Plumbing • Lagos</ThemedText>
        </View>
      </Card>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  cardImage: {
    width: '100%',
    height: 140,
    borderRadius: theme.radius.lg,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
});