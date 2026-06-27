import { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/services/supabase/client';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

export default function ResetPasswordScreen() {
  const colors = useThemeColors();
  const params = useLocalSearchParams();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    // Supabase deep link passes access_token and refresh_token as params
    const accessToken = params.access_token as string;
    const refreshToken = params.refresh_token as string;

    if (accessToken && refreshToken) {
      supabase.auth
        .setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(({ error: err }) => {
          if (err) {
            setError('Reset link is invalid or has expired. Please try again.');
          } else {
            setSessionReady(true);
          }
        });
    } else {
      setError('Reset link is invalid or has expired. Please try again.');
    }
  }, []);

  async function handleReset() {
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) throw err;
      setDone(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Failed to update password.'
      );
    } finally {
      setLoading(false);
    }
  }

  const styles = makeStyles(colors);

  // ── Done ───────────────────────────────────────────────────
  if (done) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
        edges={['top', 'bottom']}
      >
        <ThemedView style={styles.centeredContainer}>
          <ThemedText style={styles.emoji}>✅</ThemedText>
          <ThemedText variant="h1" style={styles.centeredTitle}>
            Password Updated
          </ThemedText>
          <ThemedText color="textSecondary" style={styles.centeredSubtitle}>
            Your password has been changed. You can now log in with your new
            password.
          </ThemedText>
          <Button
            label="Go to Login"
            onPress={() => router.replace('/auth/login')}
            fullWidth
          />
        </ThemedView>
      </SafeAreaView>
    );
  }

  // ── Invalid link ───────────────────────────────────────────
  if (error && !sessionReady) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
        edges={['top', 'bottom']}
      >
        <ThemedView style={styles.centeredContainer}>
          <ThemedText style={styles.emoji}>⚠️</ThemedText>
          <ThemedText variant="h1" style={styles.centeredTitle}>
            Link Expired
          </ThemedText>
          <ThemedText color="textSecondary" style={styles.centeredSubtitle}>
            {error}
          </ThemedText>
          <Button
            label="Request New Link"
            onPress={() => router.replace('/auth/forgot-password')}
            fullWidth
          />
        </ThemedView>
      </SafeAreaView>
    );
  }

  // ── New password form ──────────────────────────────────────
  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ThemedView style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.formContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formInner}>
              <ThemedText variant="h1" style={{ marginBottom: theme.spacing.xs }}>
                Set New Password
              </ThemedText>
              <ThemedText
                color="textSecondary"
                style={{ marginBottom: theme.spacing.xl }}
              >
                Choose a strong new password for your account.
              </ThemedText>

              {error ? (
                <View
                  style={[
                    styles.errorBanner,
                    { backgroundColor: colors.errorLight },
                  ]}
                >
                  <ThemedText variant="caption" style={{ color: colors.error }}>
                    {error}
                  </ThemedText>
                </View>
              ) : null}

              {/* New password */}
              <ThemedText
                variant="label"
                color="textSecondary"
                style={styles.fieldLabel}
              >
                New password
              </ThemedText>
              <View style={styles.passwordRow}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="At least 6 characters"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                  style={[
                    styles.input,
                    styles.passwordInput,
                    {
                      backgroundColor: colors.surfaceAlt,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  autoCapitalize="none"
                  editable={sessionReady}
                />
                <Pressable
                  onPress={() => setShowPassword((v) => !v)}
                  style={styles.eyeButton}
                  hitSlop={8}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textMuted}
                  />
                </Pressable>
              </View>

              {/* Confirm password */}
              <ThemedText
                variant="label"
                color="textSecondary"
                style={styles.fieldLabel}
              >
                Confirm new password
              </ThemedText>
              <View style={styles.passwordRow}>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Repeat your password"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showConfirm}
                  style={[
                    styles.input,
                    styles.passwordInput,
                    {
                      backgroundColor: colors.surfaceAlt,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  autoCapitalize="none"
                  editable={sessionReady}
                />
                <Pressable
                  onPress={() => setShowConfirm((v) => !v)}
                  style={styles.eyeButton}
                  hitSlop={8}
                >
                  <Ionicons
                    name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textMuted}
                  />
                </Pressable>
              </View>

              <Button
                label={sessionReady ? 'Update Password' : 'Verifying link…'}
                onPress={handleReset}
                loading={loading || !sessionReady}
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

function makeStyles(colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1 },
    formContent: {
      paddingTop: 80,
      paddingBottom: theme.spacing.xxxl,
      alignItems: 'center',
    },
    formInner: {
      width: '100%',
      maxWidth: 480,
      paddingHorizontal: theme.spacing.lg,
    },
    fieldLabel: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.xs,
    },
    input: {
      borderWidth: 1,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm + 4,
      fontSize: 15,
    },
    passwordRow: { position: 'relative' },
    passwordInput: { paddingRight: 44 },
    eyeButton: {
      position: 'absolute',
      right: theme.spacing.md,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
    },
    errorBanner: {
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    centeredContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    emoji: {
      fontSize: 56,
      marginBottom: theme.spacing.lg,
    },
    centeredTitle: {
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    centeredSubtitle: {
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: theme.spacing.xl,
    },
  });
}