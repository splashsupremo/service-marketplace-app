import { useState } from 'react';
import {
  View,
  Modal,
  Pressable,
  FlatList,
  StyleSheet,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';
import { NIGERIAN_STATES } from '@/app/services/mockData/nigerianStates';

export interface StateSelectorProps {
  selectedState: string;
  onStateChange: (state: string) => void;
}

/**
 * StateSelector
 *
 * A compact pressable button that shows the active state filter.
 * Tapping it opens a modal with a searchable list of all Nigerian states.
 *
 * FIX (bug report): previously the modal would open and then immediately
 * close. Root cause: the dark overlay <Pressable> and the sheet content
 * were siblings rendered directly inside <Modal>, and on some devices the
 * same touch event that opened the modal (the trigger button's onPress)
 * was bubbling/registering a second time against the overlay, closing it
 * instantly. Fix: the overlay no longer closes on a generic press; it now
 * only closes via the explicit "X" close button or by selecting a state.
 * We also removed the absolutely-positioned KeyboardAvoidingView wrapper
 * (a common source of layout/touch glitches on Android) in favor of a
 * simpler, explicitly-sized bottom sheet.
 */
export function StateSelector({ selectedState, onStateChange }: StateSelectorProps) {
  const colors = useThemeColors();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStates = NIGERIAN_STATES.filter((state) =>
    state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function openModal() {
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
    setSearchQuery('');
  }

  function handleSelectState(state: string) {
    onStateChange(state);
    closeModal();
  }

  return (
    <>
      {/* ── Trigger Button ── */}
      <Pressable
        onPress={openModal}
        accessibilityRole="button"
        accessibilityLabel={`Location filter: ${selectedState}. Tap to change.`}
        style={({ pressed }) => [
          styles.trigger,
          {
            backgroundColor: colors.surfaceAlt,
            borderColor: colors.border,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Ionicons name="location-outline" size={14} color={colors.primary} style={{ marginRight: 4 }} />
        <ThemedText variant="captionSemibold" style={{ color: colors.text, marginRight: 4 }} numberOfLines={1}>
          {selectedState}
        </ThemedText>
        <Ionicons name="chevron-down-outline" size={14} color={colors.textMuted} />
      </Pressable>

      {/* ── Modal Picker ── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
        statusBarTranslucent
      >
        <View style={styles.modalRoot}>
          {/* Dark overlay — explicit, separate close button only, no overlay-tap-to-close
              (overlay-tap-to-close was the likely source of the instant-close bug) */}
          <View style={[styles.overlay, { backgroundColor: colors.overlay }]} />

          {/* Bottom sheet */}
          <View
            style={[
              styles.sheet,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {/* Sheet Header */}
            <View style={[styles.sheetHeader, { borderBottomColor: colors.border }]}>
              <ThemedText variant="h3">Select State</ThemedText>
              <Pressable
                onPress={closeModal}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="Close state selector"
              >
                <Ionicons name="close-outline" size={24} color={colors.textSecondary} />
              </Pressable>
            </View>

            {/* Search input inside modal */}
            <View
              style={[
                styles.modalSearch,
                { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
              ]}
            >
              <Ionicons name="search-outline" size={16} color={colors.textMuted} style={{ marginRight: theme.spacing.sm }} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search states..."
                placeholderTextColor={colors.textMuted}
                style={[styles.modalSearchInput, { color: colors.text }]}
                autoCorrect={false}
                autoCapitalize="none"
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={16} color={colors.textMuted} />
                </Pressable>
              )}
            </View>

            {/* States List */}
            <FlatList
              data={filteredStates}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              style={styles.list}
              renderItem={({ item }) => {
                const isActive = item === selectedState;
                return (
                  <Pressable
                    onPress={() => handleSelectState(item)}
                    style={({ pressed }) => [
                      styles.stateItem,
                      {
                        backgroundColor: isActive
                          ? colors.primaryLight
                          : pressed
                          ? colors.surfaceAlt
                          : 'transparent',
                        borderBottomColor: colors.divider,
                      },
                    ]}
                  >
                    <Ionicons
                      name="location-outline"
                      size={16}
                      color={isActive ? colors.primary : colors.textMuted}
                      style={{ marginRight: theme.spacing.sm }}
                    />
                    <ThemedText
                      variant="body"
                      style={{ color: isActive ? colors.primary : colors.text, fontWeight: isActive ? '600' : '400' }}
                    >
                      {item}
                    </ThemedText>
                    {isActive && (
                      <Ionicons name="checkmark-outline" size={16} color={colors.primary} style={{ marginLeft: 'auto' }} />
                    )}
                  </Pressable>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <ThemedText color="textMuted">No states found</ThemedText>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    maxWidth: 160,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    height: '70%',
    paddingBottom: theme.spacing.xl,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
  },
  modalSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: Platform.OS === 'android' ? 0 : undefined,
  },
  list: {
    flex: 1,
  },
  stateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
  },
  emptyState: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
});