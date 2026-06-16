import { useState, useEffect } from 'react';
import { View, Modal, Pressable, FlatList, StyleSheet, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';
import { CATEGORIES } from '@/app/services/mockData/categories';
import { NIGERIAN_STATES } from '@/app/services/mockData/nigerianStates';

export interface ListingsFilters {
  category: string | null;
  state: string | null;
  minRating: number | null;
}

export interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: ListingsFilters;
  onApply: (filters: ListingsFilters) => void;
}

const RATING_OPTIONS = [4.5, 4.0, 3.5];

/**
 * FilterModal
 *
 * Full filter UI for the Listings screen: category, state, and minimum
 * rating. Changes are staged locally (via internal state) and only
 * committed to the parent screen when "Apply Filters" is pressed —
 * this lets the user freely experiment within the modal without
 * affecting the list until they're ready, and "Cancel"/closing without
 * applying leaves the previous filters untouched.
 *
 * Usage:
 *   <FilterModal
 *     visible={filterModalVisible}
 *     onClose={() => setFilterModalVisible(false)}
 *     filters={activeFilters}
 *     onApply={(newFilters) => setActiveFilters(newFilters)}
 *   />
 */
export function FilterModal({ visible, onClose, filters, onApply }: FilterModalProps) {
  const colors = useThemeColors();

  // Local "staged" filter state — synced from props each time the modal opens
  const [category, setCategory] = useState(filters.category);
  const [state, setState] = useState(filters.state);
  const [minRating, setMinRating] = useState(filters.minRating);
  const [stateSearch, setStateSearch] = useState('');

  // Re-sync staged state whenever the modal is (re)opened, so it reflects
  // the currently active filters rather than stale previous edits.
  useEffect(() => {
    if (visible) {
      setCategory(filters.category);
      setState(filters.state);
      setMinRating(filters.minRating);
      setStateSearch('');
    }
  }, [visible, filters]);

  const filteredStates = NIGERIAN_STATES.filter((s) =>
    s.toLowerCase().includes(stateSearch.toLowerCase())
  );

  function handleApply() {
    onApply({ category, state, minRating });
    onClose();
  }

  function handleReset() {
    setCategory(null);
    setState(null);
    setMinRating(null);
    setStateSearch('');
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <View style={[styles.overlay, { backgroundColor: colors.overlay }]} />

        <View style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <ThemedText variant="h3">Filters</ThemedText>
            <Pressable onPress={onClose} hitSlop={8} accessibilityLabel="Close filters">
              <Ionicons name="close-outline" size={24} color={colors.textSecondary} />
            </Pressable>
          </View>

          <FlatList
            data={[]} // we render everything via ListHeaderComponent; no row data needed
            renderItem={null}
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={
              <View style={styles.body}>
                {/* ── Category Section ── */}
                <ThemedText variant="label" color="textSecondary" style={styles.sectionLabel}>
                  CATEGORY
                </ThemedText>
                <View style={styles.chipWrap}>
                  {CATEGORIES.map((cat) => {
                    const isActive = category === cat.name;
                    return (
                      <Pressable
                        key={cat.id}
                        onPress={() => setCategory(isActive ? null : cat.name)}
                        style={[
                          styles.optionChip,
                          {
                            backgroundColor: isActive ? colors.primary : colors.surfaceAlt,
                            borderColor: isActive ? colors.primary : colors.border,
                          },
                        ]}
                      >
                        <ThemedText
                          variant="caption"
                          style={{ color: isActive ? colors.textInverse : colors.text }}
                        >
                          {cat.name}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </View>

                {/* ── State Section ── */}
                <ThemedText variant="label" color="textSecondary" style={styles.sectionLabel}>
                  STATE
                </ThemedText>
                <View
                  style={[
                    styles.stateSearch,
                    { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                  ]}
                >
                  <Ionicons name="search-outline" size={16} color={colors.textMuted} style={{ marginRight: theme.spacing.sm }} />
                  <TextInput
                    value={stateSearch}
                    onChangeText={setStateSearch}
                    placeholder="Search states..."
                    placeholderTextColor={colors.textMuted}
                    style={[styles.stateSearchInput, { color: colors.text }]}
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                </View>
                <View style={styles.chipWrap}>
                  {filteredStates.slice(0, 12).map((s) => {
                    const isActive = state === s || (s === 'All States' && state === null);
                    return (
                      <Pressable
                        key={s}
                        onPress={() => setState(s === 'All States' ? null : isActive ? null : s)}
                        style={[
                          styles.optionChip,
                          {
                            backgroundColor: isActive ? colors.primary : colors.surfaceAlt,
                            borderColor: isActive ? colors.primary : colors.border,
                          },
                        ]}
                      >
                        <ThemedText
                          variant="caption"
                          style={{ color: isActive ? colors.textInverse : colors.text }}
                        >
                          {s}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </View>

                {/* ── Minimum Rating Section ── */}
                <ThemedText variant="label" color="textSecondary" style={styles.sectionLabel}>
                  MINIMUM RATING
                </ThemedText>
                <View style={styles.chipWrap}>
                  {RATING_OPTIONS.map((r) => {
                    const isActive = minRating === r;
                    return (
                      <Pressable
                        key={r}
                        onPress={() => setMinRating(isActive ? null : r)}
                        style={[
                          styles.optionChip,
                          {
                            backgroundColor: isActive ? colors.primary : colors.surfaceAlt,
                            borderColor: isActive ? colors.primary : colors.border,
                          },
                        ]}
                      >
                        <Ionicons
                          name="star"
                          size={12}
                          color={isActive ? colors.textInverse : colors.rating}
                          style={{ marginRight: 4 }}
                        />
                        <ThemedText
                          variant="caption"
                          style={{ color: isActive ? colors.textInverse : colors.text }}
                        >
                          {r.toFixed(1)}+
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            }
          />

          {/* ── Footer Actions ── */}
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Pressable onPress={handleReset} style={styles.resetButton}>
              <ThemedText variant="bodySemibold" style={{ color: colors.textSecondary }}>
                Reset
              </ThemedText>
            </Pressable>
            <Button label="Apply Filters" onPress={handleApply} style={{ flex: 1, marginLeft: theme.spacing.md }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  sheet: {
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    height: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
  },
  body: { padding: theme.spacing.lg },
  sectionLabel: { marginBottom: theme.spacing.sm, marginTop: theme.spacing.md },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm - 1,
    borderRadius: theme.radius.full,
    borderWidth: 1,
  },
  stateSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    marginBottom: theme.spacing.sm,
  },
  stateSearchInput: { flex: 1, fontSize: 14, paddingVertical: Platform.OS === 'android' ? 0 : undefined },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderTopWidth: 1,
  },
  resetButton: { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.sm },
});