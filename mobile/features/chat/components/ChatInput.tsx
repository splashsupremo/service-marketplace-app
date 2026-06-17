import { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

export interface ChatInputProps {
  onSend: (text: string) => void;
  isSending?: boolean;
}

/**
 * ChatInput
 *
 * Sticky bottom text input + send button. Clears itself after sending
 * and disables the send button while empty or mid-send.
 */
export function ChatInput({ onSend, isSending = false }: ChatInputProps) {
  const colors = useThemeColors();
  const [text, setText] = useState('');

  function handleSend() {
    const trimmed = text.trim();
    if (trimmed.length === 0 || isSending) return;
    onSend(trimmed);
    setText('');
  }

  const canSend = text.trim().length > 0 && !isSending;

  return (
    <SafeAreaView edges={['bottom']} style={{ backgroundColor: colors.surface }}>
      <View style={[styles.container, { borderTopColor: colors.border }]}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text }]}
          multiline
        />
        <Pressable
          onPress={handleSend}
          disabled={!canSend}
          style={[styles.sendButton, { backgroundColor: canSend ? colors.primary : colors.surfaceAlt }]}
          accessibilityRole="button"
          accessibilityLabel="Send message"
        >
          <Ionicons name="send" size={18} color={canSend ? colors.textInverse : colors.textMuted} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    borderTopWidth: 1,
    gap: theme.spacing.sm,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});