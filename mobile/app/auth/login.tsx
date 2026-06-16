import { useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * LoginScreen
 *
 * Simple email + password login, wired to useAuthStore().signIn().
 *
 * TODO: "Forgot Password?" is a stub for now (shows an alert) — a real
 * password reset flow (via supabase.auth.resetPasswordForEmail) is a
 * good candidate for a future phase, not part of our core Phase 7 scope.
 *
 * Responsive handling:
 * - SafeAreaView wraps the screen so content clears the status bar/notch
 *   and home indicator on every device.
 * - KeyboardAvoidingView uses "padding" behavior on both platforms.
 * - Form content is capped at maxWidth 480 and centered, so it doesn't
 *   stretch awkwardly on tablets/large screens.
 */
export default function LoginScreen() {
  const colors = useThemeColors();
  const signIn = useAuthStore((s) => s.signIn);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!EMAIL_REGEX.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    if (password.length === 0) {
      errors.password = 'Please enter your password';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit() {
    setFormError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    const { error } = await signIn(email.trim(), password);
    setIsSubmitting(false);

    if (error) {
      setFormError(error);
      return;
    }

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  }

  function handleForgotPassword() {
    setFormError(null);
    alert('Password reset is coming soon. Please contact support for help.');
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} hitSlop={8} accessibilityLabel="Go back">
              <Ionicons name="arrow-back" size={22} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.formContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formInner}>
              <ThemedText variant="h1">Welcome back</ThemedText>
              <ThemedText color="textSecondary" style={{ marginTop: theme.spacing.xs, marginBottom: theme.spacing.lg }}>
                Log in to contact providers, save favourites, and more
              </ThemedText>

              {formError && (
                <View style={[styles.errorBanner, { backgroundColor: colors.errorLight }]}>
                  <ThemedText variant="caption" style={{ color: colors.error }}>
                    {formError}
                  </ThemedText>
                </View>
              )}

              {/* Email */}
              <ThemedText variant="label" color="textSecondary" style={styles.fieldLabel}>
                Email
              </ThemedText>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text }]}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
              {fieldErrors.email && (
                <ThemedText variant="caption" style={{ color: colors.error, marginTop: 4 }}>
                  {fieldErrors.email}
                </ThemedText>
              )}

              {/* Password */}
              <ThemedText variant="label" color="textSecondary" style={styles.fieldLabel}>
                Password
              </ThemedText>
              <View style={styles.passwordRow}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Your password"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                  style={[styles.input, styles.passwordInput, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text }]}
                  autoCapitalize="none"
                />
                <Pressable onPress={() => setShowPassword((v) => !v)} style={styles.eyeButton} hitSlop={8}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
                </Pressable>
              </View>
              {fieldErrors.password && (
                <ThemedText variant="caption" style={{ color: colors.error, marginTop: 4 }}>
                  {fieldErrors.password}
                </ThemedText>
              )}

              <Pressable onPress={handleForgotPassword} style={{ marginTop: theme.spacing.sm, alignSelf: 'flex-end' }}>
                <ThemedText variant="caption" style={{ color: colors.primary }}>
                  Forgot Password?
                </ThemedText>
              </Pressable>

              <Button
                label="Log In"
                onPress={handleSubmit}
                loading={isSubmitting}
                fullWidth
                style={{ marginTop: theme.spacing.lg }}
              />

              <Pressable onPress={() => router.replace('/auth/register')} style={styles.registerLink}>
                <ThemedText variant="caption" color="textSecondary">
                  Don't have an account? <ThemedText variant="captionSemibold" style={{ color: colors.primary }}>Sign up</ThemedText>
                </ThemedText>
              </Pressable>
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
  header: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.sm },
  formContent: {
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxxl,
    alignItems: 'center',
  },
  formInner: {
    width: '100%',
    maxWidth: 480,
    paddingHorizontal: theme.spacing.lg,
  },
  fieldLabel: { marginTop: theme.spacing.lg, marginBottom: theme.spacing.xs },
  input: {
    borderWidth: 1,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 4,
    fontSize: 15,
  },
  passwordRow: { position: 'relative' },
  passwordInput: { paddingRight: 44 },
  eyeButton: { position: 'absolute', right: theme.spacing.md, top: 0, bottom: 0, justifyContent: 'center' },
  errorBanner: {
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  registerLink: { marginTop: theme.spacing.lg, alignItems: 'center' },
});