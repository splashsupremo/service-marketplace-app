import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

export interface SearchBarProps {
  /** Current text value */
  value: string;

  /** Called when the text changes */
  onChangeText: (text: string) => void;

  /** Placeholder text shown when empty. Defaults to "Search providers..." */
  placeholder?: string;

  /**
   * If true, the input is non-editable and the whole bar fires onPress
   * when tapped — useful for a "tap to open search screen" pattern on
   * the Home screen, where we want tapping the bar to navigate to the
   * dedicated Search screen rather than inline editing.
   */
  pressable?: boolean;

  /** Called when the bar is pressed (only used when pressable=true) */
  onPress?: () => void;

  /**
   * Called when the clear (×) button is pressed.
   * The clear button appears automatically when value is non-empty.
   */
  onClear?: () => void;

  /** Optional style override for the outer container */
  style?: ViewStyle;
}

/**
 * SearchBar
 *
 * Reusable search input with a search icon on the left and an optional
 * clear button on the right.
 *
 * Two modes:
 * - Default: editable text input (used on the Search screen)
 * - Pressable (pressable=true): non-editable, fires onPress on tap
 *   (used on the Home screen to navigate to the Search screen)
 *
 * Usage:
 *   // Editable (Search screen)
 *   <SearchBar value={query} onChangeText={setQuery} onClear={() => setQuery('')} />
 *
 *   // Pressable (Home screen)
 *   <SearchBar
 *     value=""
 *     onChangeText={() => {}}
 *     pressable
 *     onPress={() => router.push('/search')}
 *   />
 */
export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search providers...',
  pressable = false,
  onPress,
  onClear,
  style,
}: SearchBarProps) {
  const colors = useThemeColors();

  const containerStyle: ViewStyle = {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    height: 48,
  };

  const content = (
    <>
      <Ionicons
        name="search-outline"
        size={20}
        color={colors.textMuted}
        style={{ marginRight: theme.spacing.sm }}
      />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        editable={!pressable}
        // Prevents the cursor from appearing when in pressable mode
        pointerEvents={pressable ? 'none' : 'auto'}
        style={[
          styles.input,
          {
            color: colors.text,
            flex: 1,
          },
        ]}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="never" // we handle our own clear button
      />

      {value.length > 0 && onClear && (
        <Pressable
          onPress={onClear}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close-circle" size={18} color={colors.textMuted} />
        </Pressable>
      )}
    </>
  );

  if (pressable && onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="search"
        style={({ pressed }) => [
          containerStyle,
          { opacity: pressed ? 0.8 : 1 },
          style,
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={[containerStyle, style]}>{content}</View>;
}

const styles = StyleSheet.create({
  input: {
    fontSize: 15,
    // Remove default padding on Android which can misalign the text
    paddingVertical: Platform.OS === 'android' ? 0 : undefined,
  },
});