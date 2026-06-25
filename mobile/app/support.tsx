import { View, Pressable, Linking, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Card } from '@/components/ui/Card';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

// TODO: Replace with real support contact details
const SUPPORT_PHONE = '+234 800 000 0000';
const SUPPORT_EMAIL = 'support@servenaija.com';

/**
 * SupportScreen
 *
 * Shows contact support options (phone + email).
 * Tapping phone copies number and opens the dialler.
 * Tapping email opens the mail app.
 */
export default function SupportScreen() {
  const colors = useThemeColors();

  function handlePhonePress() {
    Linking.openURL(`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`);
  }

  function handleEmailPress() {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ThemedView style={styles.container}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.back()} hitSlop={8} accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <ThemedText variant="h3" style={{ marginLeft: theme.spacing.md }}>
            Contact Support
          </ThemedText>
        </View>

        <View style={styles.content}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="headset-outline" size={32} color={colors.primary} />
          </View>
          <ThemedText variant="h2" style={{ textAlign: 'center' }}>
            We're here to help
          </ThemedText>
          <ThemedText color="textSecondary" style={{ textAlign: 'center', marginTop: theme.spacing.xs }}>
            Reach out to us via phone or email and we'll get back to you as soon as possible.
          </ThemedText>

          <Card onPress={handlePhonePress} style={styles.contactCard}>
            <View style={styles.contactRow}>
              <View style={[styles.contactIcon, { backgroundColor: colors.successLight }]}>
                <Ionicons name="call-outline" size={22} color={colors.success} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText variant="captionSemibold" color="textSecondary">
                  Phone Support
                </ThemedText>
                <ThemedText variant="bodySemibold">{SUPPORT_PHONE}</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </View>
          </Card>

          <Card onPress={handleEmailPress} style={styles.contactCard}>
            <View style={styles.contactRow}>
              <View style={[styles.contactIcon, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="mail-outline" size={22} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText variant="captionSemibold" color="textSecondary">
                  Email Support
                </ThemedText>
                <ThemedText variant="bodySemibold">{SUPPORT_EMAIL}</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </View>
          </Card>
        </View>
      </ThemedView>
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
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
  },
  content: { flex: 1, alignItems: 'center', padding: theme.spacing.xl, gap: theme.spacing.lg },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactCard: { width: '100%' },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});