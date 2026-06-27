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
import { supabase } from '@/services/supabase/client';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen() {
  const colors = useThemeColors();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSend() {
    setError('');
    if (!EMAIL_REGEX.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: 'exp://127.0.0.1:8081/--/auth/reset-password',
        }
      );
      if (err) throw err;
      setSent(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Failed to send reset email.'
      );
    } finally {
      setLoading(false);
    }
  }

  const styles = makeStyles(colors);

  // ── Success state ──────────────────────────────────────────
  if (sent) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
        edges={['top', 'bottom']}
      >
        <ThemedView style={styles.centeredContainer}>
          <ThemedText style={styles.emoji}>📬</ThemedText>
          <ThemedText variant="h1" style={styles.centeredTitle}>
            Check your email
          </ThemedText>
          <ThemedText color="textSecondary" style={styles.centeredSubtitle}>
            We sent a password reset link to{' '}
            <ThemedText variant="bodySemibold">{email}</ThemedText>. Tap the link
            in the email to set a new password.
          </ThemedText>
          <Button
            label="Back to Login"
            onPress={() => router.replace('/auth/login')}
            fullWidth
          />
        </ThemedView>
      </SafeAreaView>
    );
  }

  // ── Email entry ────────────────────────────────────────────
  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <Pressable
              onPress={() => router.back()}
              hitSlop={8}
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={22} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.formContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formInner}>
              <ThemedText variant="h1" style={{ marginBottom: theme.spacing.xs }}>
                Forgot Password
              </ThemedText>
              <ThemedText
                color="textSecondary"
                style={{ marginBottom: theme.spacing.xl }}
              >
                Enter your account email and we'll send you a reset link.
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

              <ThemedText
                variant="label"
                color="textSecondary"
                style={styles.fieldLabel}
              >
                Email address
              </ThemedText>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={colors.textMuted}
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surfaceAlt,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                autoComplete="email"
              />

              <Button
                label="Send Reset Link"
                onPress={handleSend}
                loading={loading}
                fullWidth
                style={{ marginTop: theme.spacing.xl }}
              />

              <Pressable
                onPress={() => router.replace('/auth/login')}
                style={styles.cancelLink}
              >
                <ThemedText variant="caption" color="textSecondary">
                  Back to Login
                </ThemedText>
              </Pressable>
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
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.sm,
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
    errorBanner: {
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    cancelLink: {
      alignItems: 'center',
      marginTop: theme.spacing.lg,
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