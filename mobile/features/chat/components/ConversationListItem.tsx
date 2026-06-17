import { View, Pressable, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';
import { ConversationSummary } from '@/store/chatStore';

export interface ConversationListItemProps {
  conversation: ConversationSummary;
  onPress: () => void;
}

function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

/**
 * ConversationListItem
 *
 * One row in the Messages tab. Shows the other participant's name
 * (provider business name if viewer is the customer, customer's full
 * name if viewer is the provider) and a relative last-activity time.
 */
export function ConversationListItem({ conversation, onPress }: ConversationListItemProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { borderBottomColor: colors.divider, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={[styles.avatar, { backgroundColor: colors.surfaceAlt }]}>
        {conversation.otherPersonImage ? (
          <Image source={{ uri: conversation.otherPersonImage }} style={styles.avatarImage} resizeMode="cover" />
        ) : (
          <Ionicons
            name={conversation.isCustomerView ? 'storefront-outline' : 'person-outline'}
            size={22}
            color={colors.textMuted}
          />
        )}
      </View>

      <View style={{ flex: 1 }}>
        <ThemedText variant="bodySemibold" numberOfLines={1}>
          {conversation.otherPersonName}
        </ThemedText>
        <ThemedText variant="caption" color="textSecondary" numberOfLines={1}>
          {conversation.isCustomerView ? 'Tap to view conversation' : 'Tap to view conversation'}
        </ThemedText>
      </View>

      <ThemedText variant="caption" color="textMuted">
        {formatRelativeDate(conversation.last_message_at)}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    gap: theme.spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
});