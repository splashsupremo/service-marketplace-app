import { useState, useEffect } from 'react';
import { View, Modal, TextInput, Pressable, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';
import { useReviewsStore } from '@/store/reviewsStore';

export interface ReviewFormModalProps {
  visible: boolean;
  onClose: () => void;
  providerId: string;
  providerName: string;
}

/**
 * ReviewFormModal
 *
 * Star rating (1-5, whole stars) + comment, opened from the Chat
 * screen header (customer side only). Checks hasReviewed() on open to
 * block a second submission with a friendly message rather than
 * letting the user fill out the form and get rejected at the end.
 */
export function ReviewFormModal({ visible, onClose, providerId, providerName }: ReviewFormModalProps) {
  const colors = useThemeColors();
  const submitReview = useReviewsStore((s) => s.submitReview);
  const hasReviewed = useReviewsStore((s) => s.hasReviewed);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState<boolean | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (visible) {
      setRating(0);
      setComment('');
      setError(null);
      setSuccess(false);
      setAlreadyReviewed(null);
      hasReviewed(providerId).then(setAlreadyReviewed);
    }
  }, [visible, providerId]);

  async function handleSubmit() {
    setError(null);
    if (rating === 0) {
      setError('Please select a star rating');
      return;
    }
    if (comment.trim().length === 0) {
      setError('Please write a short comment');
      return;
    }

    setIsSubmitting(true);
    const { error: submitError } = await submitReview(providerId, rating, comment.trim());
    setIsSubmitting(false);

    if (submitError) {
      setError(submitError);
      return;
    }

    setSuccess(true);
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.modalRoot} behavior="padding">
        <View style={[styles.overlay, { backgroundColor: colors.overlay }]} />
        <View style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <ThemedText variant="h3" numberOfLines={1} style={{ flex: 1 }}>
              Rate {providerName}
            </ThemedText>
            <Pressable onPress={onClose} hitSlop={8} accessibilityLabel="Close">
              <Ionicons name="close-outline" size={24} color={colors.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.body}>
            {alreadyReviewed ? (
              <View style={[styles.banner, { backgroundColor: colors.primaryLight }]}>
                <ThemedText variant="body" style={{ color: colors.primary }}>
                  You've already reviewed this provider.
                </ThemedText>
              </View>
            ) : success ? (
              <View style={[styles.banner, { backgroundColor: colors.successLight }]}>
                <ThemedText variant="body" style={{ color: colors.success }}>
                  Thanks for your review!
                </ThemedText>
              </View>
            ) : (
              <>
                {error && (
                  <View style={[styles.banner, { backgroundColor: colors.errorLight }]}>
                    <ThemedText variant="caption" style={{ color: colors.error }}>
                      {error}
                    </ThemedText>
                  </View>
                )}

                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Pressable key={i} onPress={() => setRating(i)} hitSlop={8}>
                      <Ionicons
                        name={i <= rating ? 'star' : 'star-outline'}
                        size={36}
                        color={colors.rating}
                        style={{ marginHorizontal: 4 }}
                      />
                    </Pressable>
                  ))}
                </View>

                <TextInput
                  value={comment}
                  onChangeText={setComment}
                  placeholder="Write about your experience..."
                  placeholderTextColor={colors.textMuted}
                  style={[
                    styles.input,
                    { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text },
                  ]}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                <Button
                  label="Submit Review"
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  fullWidth
                  style={{ marginTop: theme.spacing.lg }}
                />
              </>
            )}
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
  starsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: theme.spacing.lg },
  input: {
    borderWidth: 1,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 4,
    fontSize: 15,
    minHeight: 100,
  },
});