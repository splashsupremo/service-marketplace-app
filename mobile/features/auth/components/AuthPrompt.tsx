import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

export interface AuthPromptProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
}

/**
 * AuthPrompt
 *
 * Reusable "you need an account for this" prompt, shown on Favourites
 * and Messages tabs (and anywhere else that needs the same treatment)
 * when the user is a visitor. Provides direct buttons to both Sign Up
 * and Log In, since either path is equally valid for a returning vs.
 * new user landing here.
 *
 * Usage:
 *   <AuthPrompt
 *     icon="heart-outline"
 *     title="Save your favourites"
 *     message="Sign up to save providers you like and find them easily later."
 *   />
 */
export function AuthPrompt({ icon, title, message }: AuthPromptProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
        <Ionicons name={icon} size={32} color={colors.primary} />
      </View>

      <ThemedText variant="h3" style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText color="textSecondary" style={styles.message}>
        {message}
      </ThemedText>

      <Button
        label="Sign Up"
        onPress={() => router.push('/auth/register')}
        fullWidth
        style={styles.signUpButton}
      />
      <Button
        label="Log In"
        variant="outline"
        onPress={() => router.push('/auth/login')}
        fullWidth
        style={styles.loginButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: { textAlign: 'center' },
  message: {
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xl,
  },
  signUpButton: { maxWidth: 320 },
  loginButton: { maxWidth: 320, marginTop: theme.spacing.sm },
});