import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';
import { ChatMessage } from '@/store/chatStore';

export interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
}

function formatTime(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

/**
 * MessageBubble
 *
 * A single chat message. Right-aligned with primary background for
 * messages the logged-in user sent; left-aligned with surface
 * background for messages received from the other participant.
 */
export function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  const colors = useThemeColors();

  return (
    <View style={[styles.row, { justifyContent: isOwnMessage ? 'flex-end' : 'flex-start' }]}>
      <View
        style={[
          styles.bubble,
          isOwnMessage
            ? { backgroundColor: colors.primary, borderBottomRightRadius: 4 }
            : { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderBottomLeftRadius: 4 },
        ]}
      >
        <ThemedText
          variant="body"
          style={{ color: isOwnMessage ? colors.textInverse : colors.text }}
        >
          {message.content}
        </ThemedText>
        <ThemedText
          variant="caption"
          style={{
            color: isOwnMessage ? colors.primaryLight : colors.textMuted,
            marginTop: 2,
            alignSelf: 'flex-end',
          }}
        >
          {formatTime(message.created_at)}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginBottom: theme.spacing.sm, paddingHorizontal: theme.spacing.lg },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.lg,
  },
});