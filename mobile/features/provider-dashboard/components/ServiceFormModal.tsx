import { useState, useEffect } from 'react';
import { View, Modal, TextInput, Pressable, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

export interface ServiceFormValues {
  name: string;
  price: string;
}

export interface ServiceFormModalProps {
  visible: boolean;
  onClose: () => void;
  /** If provided, the form pre-fills for editing; otherwise it's blank (adding new) */
  initialValues?: ServiceFormValues;
  onSubmit: (name: string, price: number) => Promise<{ error: string | null }>;
}

/**
 * ServiceFormModal
 *
 * Small bottom-sheet form for adding or editing a single service
 * (name + price). Used by the Manage Services screen for both the
 * "Add Service" button and tapping "Edit" on an existing row.
 */
export function ServiceFormModal({ visible, onClose, initialValues, onSubmit }: ServiceFormModalProps) {
  const colors = useThemeColors();
  const isEditing = !!initialValues;

  const [name, setName] = useState(initialValues?.name ?? '');
  const [price, setPrice] = useState(initialValues?.price ?? '');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Re-sync fields whenever the modal opens with new initialValues
  useEffect(() => {
    if (visible) {
      setName(initialValues?.name ?? '');
      setPrice(initialValues?.price ?? '');
      setError(null);
    }
  }, [visible, initialValues]);

  async function handleSubmit() {
    setError(null);

    if (name.trim().length === 0) {
      setError('Please enter a service name');
      return;
    }
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      setError('Please enter a valid price');
      return;
    }

    setIsSubmitting(true);
    const result = await onSubmit(name.trim(), numericPrice);
    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.modalRoot} behavior="padding">
        <View style={[styles.overlay, { backgroundColor: colors.overlay }]} />
        <View style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <ThemedText variant="h3">{isEditing ? 'Edit Service' : 'Add Service'}</ThemedText>
            <Pressable onPress={onClose} hitSlop={8} accessibilityLabel="Close">
              <Ionicons name="close-outline" size={24} color={colors.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.body}>
            {error && (
              <View style={[styles.banner, { backgroundColor: colors.errorLight }]}>
                <ThemedText variant="caption" style={{ color: colors.error }}>
                  {error}
                </ThemedText>
              </View>
            )}

            <ThemedText variant="label" color="textSecondary" style={styles.fieldLabel}>
              Service Name
            </ThemedText>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Pipe Installation"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text }]}
            />

            <ThemedText variant="label" color="textSecondary" style={styles.fieldLabel}>
              Price (₦)
            </ThemedText>
            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder="e.g. 15000"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              style={[styles.input, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text }]}
            />

            <Button
              label={isEditing ? 'Save Changes' : 'Add Service'}
              onPress={handleSubmit}
              loading={isSubmitting}
              fullWidth
              style={{ marginTop: theme.spacing.xl }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
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
    paddingBottom: theme.spacing.xl,
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
  banner: { borderRadius: theme.radius.md, padding: theme.spacing.md, marginBottom: theme.spacing.md },
  fieldLabel: { marginBottom: theme.spacing.xs },
  input: {
    borderWidth: 1,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 4,
    fontSize: 15,
    marginBottom: theme.spacing.md,
  },
});