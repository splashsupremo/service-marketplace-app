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
  if (isToday) return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: 'short' });
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function ConversationListItem({ conversation, onPress }: ConversationListItemProps) {
  const colors = useThemeColors();
  const hasUnread = conversation.unreadCount > 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { borderBottomColor: colors.divider, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: colors.surfaceAlt }]}>
        {conversation.otherPersonImage ? (
          <Image
            source={{ uri: conversation.otherPersonImage }}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        ) : (
          <Ionicons
            name={conversation.isCustomerView ? 'storefront-outline' : 'person-outline'}
            size={22}
            color={colors.textMuted}
          />
        )}
      </View>

      {/* Name + preview */}
      <View style={{ flex: 1 }}>
        <ThemedText
          variant={hasUnread ? 'bodySemibold' : 'body'}
          numberOfLines={1}
          style={{ color: hasUnread ? colors.text : colors.textSecondary }}
        >
          {conversation.otherPersonName}
        </ThemedText>
        <ThemedText variant="caption" color="textMuted" numberOfLines={1}>
          Tap to view conversation
        </ThemedText>
      </View>

      {/* Right side: timestamp + unread badge */}
      <View style={styles.rightCol}>
        <ThemedText variant="caption" color="textMuted">
          {formatRelativeDate(conversation.last_message_at)}
        </ThemedText>
        {hasUnread && (
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <ThemedText variant="caption" style={{ color: colors.textInverse, fontSize: 10 }}>
              {conversation.unreadCount > 99 ? '99+' : String(conversation.unreadCount)}
            </ThemedText>
          </View>
        )}
      </View>
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
  rightCol: { alignItems: 'flex-end', gap: 4 },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
});