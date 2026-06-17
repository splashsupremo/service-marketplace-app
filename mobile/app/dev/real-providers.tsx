import { useEffect, useState } from 'react';
import { View, FlatList, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/services/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

interface RealProvider {
  id: string;
  user_id: string;
  business_name: string;
  category: string;
  state: string;
  city: string;
}

/**
 * RealProvidersScreen (TEMPORARY — DEV ONLY)
 *
 * Bridges the mock-vs-real provider gap so chat can be built and
 * tested now (Phase 10), before Phase 12 unifies all provider data
 * onto the real `providers` table. Lists real providers created via
 * the Provider Dashboard (Phase 9) and lets any logged-in customer
 * start a real conversation with one.
 *
 * TODO: Phase 12 — delete this entire screen once MOCK_PROVIDERS is
 * replaced by real data and "Contact Provider" on the normal Provider
 * Profile screen works directly against real providers.
 */
export default function RealProvidersScreen() {
  const colors = useThemeColors();
  const userId = useAuthStore((s) => s.user?.id);
  const startConversation = useChatStore((s) => s.startConversation);

  const [providers, setProviders] = useState<RealProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contactingId, setContactingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRealProviders();
  }, []);

  async function fetchRealProviders() {
    setIsLoading(true);
    const { data, error: fetchError } = await supabase
      .from('providers')
      .select('id, user_id, business_name, category, state, city')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setProviders((data ?? []) as RealProvider[]);
    }
    setIsLoading(false);
  }

  async function handleContact(provider: RealProvider) {
    if (provider.user_id === userId) {
      setError("You can't message your own provider listing.");
      return;
    }

    setContactingId(provider.id);
    const { conversationId, error: startError } = await startConversation(provider.id);
    setContactingId(null);

    if (startError || !conversationId) {
      setError(startError ?? 'Failed to start conversation.');
      return;
    }

    router.push({ pathname: '/chat/[conversationId]', params: { conversationId, name: provider.business_name } });
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ThemedView style={styles.container}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.back()} hitSlop={8} accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <ThemedText variant="h3" style={{ marginLeft: theme.spacing.md }}>
            Real Providers (Dev)
          </ThemedText>
        </View>

        <View style={[styles.devBanner, { backgroundColor: colors.warningLight }]}>
          <Ionicons name="construct-outline" size={16} color={colors.warning} />
          <ThemedText variant="caption" style={{ color: colors.warning, marginLeft: theme.spacing.xs, flex: 1 }}>
            Temporary testing screen — will be removed in Phase 12 once provider data is unified.
          </ThemedText>
        </View>

        {error && (
          <View style={[styles.errorBanner, { backgroundColor: colors.errorLight }]}>
            <ThemedText variant="caption" style={{ color: colors.error }}>
              {error}
            </ThemedText>
          </View>
        )}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : providers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText color="textSecondary" style={{ textAlign: 'center' }}>
              No real providers exist yet. Create one via the Provider Dashboard (Phase 9) first.
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={providers}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <Card style={styles.providerCard}>
                <View style={{ flex: 1 }}>
                  <ThemedText variant="bodySemibold">{item.business_name}</ThemedText>
                  <ThemedText variant="caption" color="textSecondary">
                    {item.category} • {item.city}, {item.state}
                  </ThemedText>
                </View>
                <Button
                  label="Contact"
                  size="sm"
                  loading={contactingId === item.id}
                  onPress={() => handleContact(item)}
                />
              </Card>
            )}
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
  },
  devBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    margin: theme.spacing.lg,
    borderRadius: theme.radius.md,
  },
  errorBanner: {
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xl },
  listContent: { paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.xxxl },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
});