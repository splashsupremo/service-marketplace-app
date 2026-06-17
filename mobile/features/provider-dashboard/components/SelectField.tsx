import { useState } from 'react';
import { View, Modal, Pressable, FlatList, TextInput, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

export interface SelectFieldProps {
  label: string;
  value: string | null;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
  searchable?: boolean;
}

/**
 * SelectField
 *
 * A form field styled like a text input but that opens a bottom-sheet
 * list of options on tap, instead of a keyboard. Reuses the same
 * modal-list interaction pattern as StateSelector (Phase 4), now
 * generalized for any field needing single-choice selection from a
 * fixed list (category, state, etc.).
 */
export function SelectField({
  label,
  value,
  placeholder,
  options,
  onChange,
  searchable = false,
}: SelectFieldProps) {
  const colors = useThemeColors();
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');

  const filteredOptions = searchable
    ? options.filter((o) => o.toLowerCase().includes(search.toLowerCase()))
    : options;

  function handleSelect(option: string) {
    onChange(option);
    setModalVisible(false);
    setSearch('');
  }

  return (
    <>
      <ThemedText variant="label" color="textSecondary" style={styles.fieldLabel}>
        {label}
      </ThemedText>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={[styles.trigger, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
      >
        <ThemedText
          variant="body"
          style={{ color: value ? colors.text : colors.textMuted, flex: 1 }}
        >
          {value ?? placeholder}
        </ThemedText>
        <Ionicons name="chevron-down-outline" size={16} color={colors.textMuted} />
      </Pressable>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalRoot}>
          <View style={[styles.overlay, { backgroundColor: colors.overlay }]} />
          <View style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.sheetHeader, { borderBottomColor: colors.border }]}>
              <ThemedText variant="h3">{label}</ThemedText>
              <Pressable onPress={() => setModalVisible(false)} hitSlop={8} accessibilityLabel="Close">
                <Ionicons name="close-outline" size={24} color={colors.textSecondary} />
              </Pressable>
            </View>

            {searchable && (
              <View style={[styles.searchBox, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
                <Ionicons name="search-outline" size={16} color={colors.textMuted} style={{ marginRight: theme.spacing.sm }} />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder={`Search ${label.toLowerCase()}...`}
                  placeholderTextColor={colors.textMuted}
                  style={[styles.searchInput, { color: colors.text }]}
                  autoCorrect={false}
                  autoCapitalize="none"
                />
              </View>
            )}

            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              style={styles.list}
              renderItem={({ item }) => {
                const isActive = item === value;
                return (
                  <Pressable
                    onPress={() => handleSelect(item)}
                    style={[
                      styles.optionRow,
                      { backgroundColor: isActive ? colors.primaryLight : 'transparent', borderBottomColor: colors.divider },
                    ]}
                  >
                    <ThemedText
                      variant="body"
                      style={{ color: isActive ? colors.primary : colors.text, fontWeight: isActive ? '600' : '400' }}
                    >
                      {item}
                    </ThemedText>
                    {isActive && <Ionicons name="checkmark" size={16} color={colors.primary} />}
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fieldLabel: { marginTop: theme.spacing.lg, marginBottom: theme.spacing.xs },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 4,
  },
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  sheet: {
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    height: '70%',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: Platform.OS === 'android' ? 0 : undefined },
  list: { flex: 1 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
  },
});