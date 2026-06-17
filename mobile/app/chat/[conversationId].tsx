import { useEffect, useState } from 'react';
import { View, FlatList, Pressable, ActivityIndicator, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { MessageBubble } from '@/features/chat/components/MessageBubble';
import { ChatInput } from '@/features/chat/components/ChatInput';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

/**
 * ChatScreen
 *
 * Loads message history for the given conversationId, subscribes to
 * Realtime for live updates, and renders the conversation as an
 * inverted FlatList (newest message at the bottom, scroll position 0).
 *
 * `name` comes from the navigation params as a quick way to show "who
 * you're chatting with" in the header without an extra fetch — this is
 * acceptable for the temporary dev-bridge flow (Phase 10); the real
 * Messages tab (next step) will pass this consistently too.
 */
export default function ChatScreen() {
  const colors = useThemeColors();
  const { conversationId, name } = useLocalSearchParams<{ conversationId: string; name?: string }>();
  const userId = useAuthStore((s) => s.user?.id);

  const messages = useChatStore((s) => s.messages);
  const isLoadingMessages = useChatStore((s) => s.isLoadingMessages);
  const fetchMessages = useChatStore((s) => s.fetchMessages);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const subscribeToMessages = useChatStore((s) => s.subscribeToMessages);
  const unsubscribe = useChatStore((s) => s.unsubscribe);

  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!conversationId) return;

    fetchMessages(conversationId);
    subscribeToMessages(conversationId);

    return () => {
      unsubscribe();
    };
  }, [conversationId]);

  async function handleSend(text: string) {
    if (!conversationId) return;
    setIsSending(true);
    const { error } = await sendMessage(conversationId, text);
    setIsSending(false);
    if (error) {
      console.error('Failed to send message:', error);
    }
  }

  // Reverse for inverted FlatList: newest first, since inverted lists
  // render their data array bottom-to-top.
  const invertedMessages = [...messages].reverse();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ThemedView style={styles.container}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Pressable onPress={() => router.back()} hitSlop={8} accessibilityLabel="Go back">
              <Ionicons name="arrow-back" size={22} color={colors.text} />
            </Pressable>
            <ThemedText variant="h3" numberOfLines={1} style={{ marginLeft: theme.spacing.md, flex: 1 }}>
              {name ?? 'Chat'}
            </ThemedText>
          </View>

          {isLoadingMessages && messages.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ThemedText color="textSecondary" style={{ textAlign: 'center' }}>
                No messages yet. Say hello!
              </ThemedText>
            </View>
          ) : (
            <FlatList
              data={invertedMessages}
              keyExtractor={(item) => item.id}
              inverted
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <MessageBubble message={item} isOwnMessage={item.sender_id === userId} />
              )}
            />
          )}

          <ChatInput onSend={handleSend} isSending={isSending} />
        </ThemedView>
      </KeyboardAvoidingView>
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
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xl },
  listContent: { paddingTop: theme.spacing.lg, paddingBottom: theme.spacing.sm },
});