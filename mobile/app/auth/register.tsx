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
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/services/supabase/client';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';
import { UserRole } from '@/types/auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * RegisterScreen
 *
 * Two-step signup flow:
 * 1. Role selection (Customer vs. Service Provider)
 * 2. Form (full name, email, password, confirm password)
 *
 * On success:
 * - If Supabase returns an active session immediately (email confirmation
 *   disabled), the user is logged in and we navigate back.
 * - If no session is returned (email confirmation required), we show a
 *   "check your email" message instead of assuming they're logged in.
 *
 * Responsive handling:
 * - SafeAreaView wraps every screen state so content clears the
 *   status bar/notch and home indicator on every device.
 * - KeyboardAvoidingView uses "padding" behavior on both platforms.
 * - Form content is capped at maxWidth 480 and centered, so it doesn't
 *   stretch awkwardly on tablets/large screens.
 */
export default function RegisterScreen() {
  const colors = useThemeColors();
  const signUp = useAuthStore((s) => s.signUp);

  const [role, setRole] = useState<UserRole | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);

  function validate(): boolean {
    const errors: Record<string, string> = {};

    if (fullName.trim().length === 0) {
      errors.fullName = 'Please enter your full name';
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit() {
    setFormError(null);

    if (!role) {
      setFormError('Please select whether you are a customer or provider');
      return;
    }
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    const { error } = await signUp(email.trim(), password, fullName.trim(), role);
    setIsSubmitting(false);

    if (error) {
      setFormError(error);
      return;
    }

    const { data } = await supabase.auth.getSession();

    if (data.session) {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)');
      }
    } else {
      setNeedsEmailConfirmation(true);
    }
  }

  // ── "Check your email" confirmation state ──
  if (needsEmailConfirmation) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
        <ThemedView style={styles.confirmationContainer}>
          <Ionicons name="mail-outline" size={56} color={colors.primary} />
          <ThemedText variant="h2" style={{ marginTop: theme.spacing.lg, textAlign: 'center' }}>
            Check your email
          </ThemedText>
          <ThemedText
            color="textSecondary"
            style={{ marginTop: theme.spacing.sm, textAlign: 'center' }}
          >
            We've sent a confirmation link to {email}. Please verify your email, then log in.
          </ThemedText>
          <Button
            label="Go to Login"
            onPress={() => router.replace('/auth/login')}
            style={{ marginTop: theme.spacing.xl, width: '100%', maxWidth: 320 }}
            fullWidth
          />
        </ThemedView>
      </SafeAreaView>
    );
  }

  // ── Step 1: Role Selection ──
  if (!role) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} hitSlop={8} accessibilityLabel="Go back">
              <Ionicons name="arrow-back" size={22} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.roleScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.roleStepContent}>
              <ThemedText variant="h1">Join ServeNaija</ThemedText>
              <ThemedText color="textSecondary" style={{ marginTop: theme.spacing.xs }}>
                Tell us how you'll be using the app
              </ThemedText>

              <Pressable onPress={() => setRole('customer')} style={{ marginTop: theme.spacing.xl }}>
                <Card>
                  <View style={styles.roleCardContent}>
                    <View style={[styles.roleIcon, { backgroundColor: colors.primaryLight }]}>
                      <Ionicons name="person-outline" size={26} color={colors.primary} />
                    </View>
                    <View style={styles.roleCardText}>
                      <ThemedText variant="h3">I'm a Customer</ThemedText>
                      <ThemedText color="textSecondary" variant="caption">
                        I want to find and hire service providers
                      </ThemedText>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                  </View>
                </Card>
              </Pressable>

              <Pressable onPress={() => setRole('provider')} style={{ marginTop: theme.spacing.md }}>
                <Card>
                  <View style={styles.roleCardContent}>
                    <View style={[styles.roleIcon, { backgroundColor: colors.accentLight }]}>
                      <Ionicons name="briefcase-outline" size={26} color={colors.accent} />
                    </View>
                    <View style={styles.roleCardText}>
                      <ThemedText variant="h3">I'm a Service Provider</ThemedText>
                      <ThemedText color="textSecondary" variant="caption">
                        I want to list my services and find customers
                      </ThemedText>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                  </View>
                </Card>
              </Pressable>
            </View>
          </ScrollView>
        </ThemedView>
      </SafeAreaView>
    );
  }

  // ── Step 2: Form ──
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <Pressable onPress={() => setRole(null)} hitSlop={8} accessibilityLabel="Back to role selection">
              <Ionicons name="arrow-back" size={22} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.formContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formInner}>
              <ThemedText variant="h1">Create your account</ThemedText>
              <ThemedText color="textSecondary" style={{ marginTop: theme.spacing.xs, marginBottom: theme.spacing.lg }}>
                Signing up as a {role === 'customer' ? 'Customer' : 'Service Provider'}
              </ThemedText>

              {formError && (
                <View style={[styles.errorBanner, { backgroundColor: colors.errorLight }]}>
                  <ThemedText variant="caption" style={{ color: colors.error }}>
                    {formError}
                  </ThemedText>
                </View>
              )}

              {/* Full Name */}
              <ThemedText variant="label" color="textSecondary" style={styles.fieldLabel}>
                Full Name
              </ThemedText>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="e.g. Ada Lovelace"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text }]}
                autoCapitalize="words"
              />
              {fieldErrors.fullName && (
                <ThemedText variant="caption" style={{ color: colors.error, marginTop: 4 }}>
                  {fieldErrors.fullName}
                </ThemedText>
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
                  placeholder="At least 6 characters"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                  style={[styles.input, styles.passwordInput, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text }]}
                  autoCapitalize="none"
                />
                <Pressable
                  onPress={() => setShowPassword((v) => !v)}
                  style={styles.eyeButton}
                  hitSlop={8}
                >
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
                </Pressable>
              </View>
              {fieldErrors.password && (
                <ThemedText variant="caption" style={{ color: colors.error, marginTop: 4 }}>
                  {fieldErrors.password}
                </ThemedText>
              )}

              {/* Confirm Password */}
              <ThemedText variant="label" color="textSecondary" style={styles.fieldLabel}>
                Confirm Password
              </ThemedText>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter your password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
                style={[styles.input, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text }]}
                autoCapitalize="none"
              />
              {fieldErrors.confirmPassword && (
                <ThemedText variant="caption" style={{ color: colors.error, marginTop: 4 }}>
                  {fieldErrors.confirmPassword}
                </ThemedText>
              )}

              <Button
                label="Create Account"
                onPress={handleSubmit}
                loading={isSubmitting}
                fullWidth
                style={{ marginTop: theme.spacing.xl }}
              />

              <Pressable onPress={() => router.replace('/auth/login')} style={styles.loginLink}>
                <ThemedText variant="caption" color="textSecondary">
                  Already have an account? <ThemedText variant="captionSemibold" style={{ color: colors.primary }}>Log in</ThemedText>
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
  roleScrollContent: { flexGrow: 1 },
  roleStepContent: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  roleCardContent: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  roleCardText: { flex: 1, flexShrink: 1 },
  roleIcon: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  loginLink: { marginTop: theme.spacing.lg, alignItems: 'center' },
  confirmationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
});