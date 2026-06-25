import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';
import { ChatMessage } from '@/store/chatStore';

export interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  /**
   * The other participant's last_read_at timestamp.
   * If this message's created_at is before that timestamp,
   * the other person has read it → show ✓✓ colored.
   */
  otherLastReadAt: string | null;
}

function formatTime(isoDate: string): string {
  return new Date(isoDate).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

/**
 * MessageBubble
 *
 * Sent messages show a read receipt below the timestamp:
 * - ✓  (gray)  = sent but not yet read by the other person
 * - ✓✓ (blue)  = read (other person opened the chat after this message)
 *
 * Received messages show no receipt (only sent messages have receipts).
 */
export function MessageBubble({ message, isOwnMessage, otherLastReadAt }: MessageBubbleProps) {
  const colors = useThemeColors();

  const isRead = otherLastReadAt != null && message.created_at <= otherLastReadAt;

  return (
    <View style={[styles.row, { justifyContent: isOwnMessage ? 'flex-end' : 'flex-start' }]}>
      <View
        style={[
          styles.bubble,
          isOwnMessage
            ? { backgroundColor: colors.primary, borderBottomRightRadius: 4 }
            : {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                borderBottomLeftRadius: 4,
              },
        ]}
      >
        <ThemedText
          variant="body"
          style={{ color: isOwnMessage ? colors.textInverse : colors.text }}
        >
          {message.content}
        </ThemedText>

        <View style={styles.metaRow}>
          <ThemedText
            variant="caption"
            style={{
              color: isOwnMessage ? colors.primaryLight : colors.textMuted,
              marginRight: isOwnMessage ? 4 : 0,
            }}
          >
            {formatTime(message.created_at)}
          </ThemedText>

          {isOwnMessage && (
            <View style={styles.receiptRow}>
              {isRead ? (
                // ✓✓ read — two overlapping checkmarks in accent color
                <View style={styles.doubleCheck}>
                  <Ionicons name="checkmark" size={11} color={colors.accent} />
                  <Ionicons name="checkmark" size={11} color={colors.accent} style={{ marginLeft: -5 }} />
                </View>
              ) : (
                // ✓ sent — single checkmark in muted color
                <Ionicons name="checkmark" size={11} color={colors.primaryLight} />
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.lg,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 2,
  },
  receiptRow: { flexDirection: 'row', alignItems: 'center' },
  doubleCheck: { flexDirection: 'row', alignItems: 'center' },
});