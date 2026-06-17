import { useState } from 'react';
import { View, ScrollView, TextInput, Pressable, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

/**
 * EditProfileScreen
 *
 * Simple form to update the user's full name (Phase 8 scope — email
 * and password changes are deferred to a future phase, per plan).
 */
export default function EditProfileScreen() {
  const colors = useThemeColors();
  const profile = useAuthStore((s) => s.profile);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  async function handleSave() {
    setFormError(null);
    setSuccessVisible(false);

    if (fullName.trim().length === 0) {
      setFieldError('Please enter your full name');
      return;
    }
    setFieldError(null);

    setIsSubmitting(true);
    const { error } = await updateProfile(fullName.trim());
    setIsSubmitting(false);

    if (error) {
      setFormError(error);
      return;
    }

    setSuccessVisible(true);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} hitSlop={8} accessibilityLabel="Go back">
              <Ionicons name="arrow-back" size={22} color={colors.text} />
            </Pressable>
            <ThemedText variant="h3" style={{ marginLeft: theme.spacing.md }}>
              Edit Profile
            </ThemedText>
          </View>

          <ScrollView
            contentContainerStyle={styles.formContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formInner}>
              {formError && (
                <View style={[styles.banner, { backgroundColor: colors.errorLight }]}>
                  <ThemedText variant="caption" style={{ color: colors.error }}>
                    {formError}
                  </ThemedText>
                </View>
              )}
              {successVisible && (
                <View style={[styles.banner, { backgroundColor: colors.successLight }]}>
                  <ThemedText variant="caption" style={{ color: colors.success }}>
                    Profile updated successfully
                  </ThemedText>
                </View>
              )}

              <ThemedText variant="label" color="textSecondary" style={styles.fieldLabel}>
                Full Name
              </ThemedText>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Your full name"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text }]}
                autoCapitalize="words"
              />
              {fieldError && (
                <ThemedText variant="caption" style={{ color: colors.error, marginTop: 4 }}>
                  {fieldError}
                </ThemedText>
              )}

              <Button
                label="Save Changes"
                onPress={handleSave}
                loading={isSubmitting}
                fullWidth
                style={{ marginTop: theme.spacing.xl }}
              />
            </View>
          </ScrollView>
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  formContent: { paddingTop: theme.spacing.md, paddingBottom: theme.spacing.xxxl, alignItems: 'center' },
  formInner: { width: '100%', maxWidth: 480, paddingHorizontal: theme.spacing.lg },
  fieldLabel: { marginBottom: theme.spacing.xs },
  input: {
    borderWidth: 1,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 4,
    fontSize: 15,
  },
  banner: {
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
});