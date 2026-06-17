import { useEffect, useState } from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { AuthPrompt } from '@/features/auth/components/AuthPrompt';
import { ConversationListItem } from '@/features/chat/components/ConversationListItem';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

/**
 * MessagesScreen
 *
 * Visitor: AuthPrompt.
 * Authenticated, no conversations: empty state.
 * Authenticated, with conversations: list, sorted by most recent
 * activity (handled server-side via the last_message_at trigger +
 * our query's ordering in chatStore).
 */
export default function MessagesScreen() {
  const colors = useThemeColors();
  const isAuthenticated = useAuthStore((s) => !!s.user);

  const conversations = useChatStore((s) => s.conversations);
  const isLoadingConversations = useChatStore((s) => s.isLoadingConversations);
  const fetchConversations = useChatStore((s) => s.fetchConversations);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
    }
  }, [isAuthenticated]);

  async function handleRefresh() {
    setRefreshing(true);
    await fetchConversations();
    setRefreshing(false);
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
        <AuthPrompt
          icon="chatbubble-outline"
          title="Chat with providers"
          message="Sign up to message providers directly and discuss your service needs."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText variant="h1">Messages</ThemedText>
        </View>

        {!isLoadingConversations && conversations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="chatbubble-outline" size={28} color={colors.primary} />
            </View>
            <ThemedText variant="h3" style={{ textAlign: 'center' }}>
              No conversations yet
            </ThemedText>
            <ThemedText
              color="textSecondary"
              style={{ textAlign: 'center', marginTop: theme.spacing.xs }}
            >
              Reach out to a provider to start chatting.
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={conversations}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
            renderItem={({ item }) => (
              <ConversationListItem
                conversation={item}
                onPress={() =>
  router.push({
    pathname: '/chat/[conversationId]',
    params: {
      conversationId: item.id,
      name: item.otherPersonName,
      providerId: item.provider_id,
      isCustomerView: String(item.isCustomerView),
    },
  })
}
              />
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
  header: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md, paddingBottom: theme.spacing.sm },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xl },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  listContent: { paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.xxxl },
});