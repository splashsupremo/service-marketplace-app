import { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { MessageBubble } from '@/features/chat/components/MessageBubble';
import { ChatInput } from '@/features/chat/components/ChatInput';
import { ReviewFormModal } from '@/features/reviews/components/ReviewFormModal';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

export default function ChatScreen() {
  const colors = useThemeColors();
  const { conversationId, name, providerId, isCustomerView } =
    useLocalSearchParams<{
      conversationId: string;
      name?: string;
      providerId?: string;
      isCustomerView?: string;
    }>();

  const userId = useAuthStore((s) => s.user?.id);

  const messages = useChatStore((s) => s.messages);
  const isLoadingMessages = useChatStore((s) => s.isLoadingMessages);
  const activeConversation = useChatStore((s) => s.activeConversation);
  const fetchMessages = useChatStore((s) => s.fetchMessages);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const subscribeToMessages = useChatStore((s) => s.subscribeToMessages);
  const unsubscribe = useChatStore((s) => s.unsubscribe);
  const markAsRead = useChatStore((s) => s.markAsRead);

  const [isSending, setIsSending] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);

  useEffect(() => {
    if (!conversationId) return;

    fetchMessages(conversationId);
    subscribeToMessages(conversationId);
    markAsRead(conversationId); // Mark as read when chat opens

    return () => {
      unsubscribe();
    };
  }, [conversationId]);

  async function handleSend(text: string) {
    if (!conversationId) return;
    setIsSending(true);
    const { error } = await sendMessage(conversationId, text);
    setIsSending(false);
    if (error) console.error('Failed to send message:', error);
  }

  const invertedMessages = [...messages].reverse();
  const otherLastReadAt = activeConversation?.otherLastReadAt ?? null;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ThemedView style={styles.container}>
          {/* ── Header ── */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Pressable onPress={() => router.back()} hitSlop={8} accessibilityLabel="Go back">
              <Ionicons name="arrow-back" size={22} color={colors.text} />
            </Pressable>
            <ThemedText variant="h3" numberOfLines={1} style={{ marginLeft: theme.spacing.md, flex: 1 }}>
              {name ?? 'Chat'}
            </ThemedText>
            {isCustomerView === 'true' && providerId && (
              <Pressable
                onPress={() => setReviewModalVisible(true)}
                hitSlop={8}
                accessibilityLabel="Leave a review"
              >
                <Ionicons name="star-outline" size={22} color={colors.primary} />
              </Pressable>
            )}
          </View>

          {/* ── Messages ── */}
          {isLoadingMessages && messages.length === 0 ? (
            <View style={styles.centreContainer}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : messages.length === 0 ? (
            <View style={styles.centreContainer}>
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
                <MessageBubble
                  message={item}
                  isOwnMessage={item.sender_id === userId}
                  otherLastReadAt={otherLastReadAt}
                />
              )}
            />
          )}

          <ChatInput onSend={handleSend} isSending={isSending} />
        </ThemedView>

        {providerId && (
          <ReviewFormModal
            visible={reviewModalVisible}
            onClose={() => setReviewModalVisible(false)}
            providerId={providerId}
            providerName={name ?? 'this provider'}
          />
        )}
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
  centreContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xl },
  listContent: { paddingTop: theme.spacing.lg, paddingBottom: theme.spacing.sm },
});