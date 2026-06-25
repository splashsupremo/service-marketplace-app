import { useState } from 'react';
import { View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

// TODO: Replace with real FAQs from admin/CMS in a future phase
const FAQS = [
  {
    id: '1',
    question: 'How do I find a service provider?',
    answer: 'Browse the Home screen or use the Search tab to filter providers by category, state, and rating. Tap any provider card to view their full profile, services, and reviews.',
  },
  {
    id: '2',
    question: 'How do I contact a service provider?',
    answer: 'Open a provider\'s profile and tap "Contact Provider". You\'ll need to be signed in to start a chat. You can also call them directly using the phone icon in the chat screen.',
  },
  {
    id: '3',
    question: 'Is ServeNaija free to use?',
    answer: 'Yes — browsing providers and creating an account is completely free for customers. Service providers can list their services at no cost during our launch period.',
  },
  {
    id: '4',
    question: 'How do I sign up as a service provider?',
    answer: 'Tap the Profile tab, then "Sign Up", and choose "I\'m a Service Provider". After creating your account, go to your Provider Dashboard to set up your listing.',
  },
  {
    id: '5',
    question: 'How are providers verified?',
    answer: 'Providers can apply for verification through our admin team. Verified providers display a green checkmark badge on their profile, indicating they\'ve been reviewed and approved.',
  },
  {
    id: '6',
    question: 'How do I leave a review?',
    answer: 'After chatting with a provider, open the conversation and tap the star icon in the top right corner. You can leave one review per provider.',
  },
  {
    id: '7',
    question: 'Can I save providers for later?',
    answer: 'Yes — tap the heart icon on any provider\'s profile to save them to your Favourites tab. You need to be signed in to use this feature.',
  },
  {
    id: '8',
    question: 'How do I report a problem?',
    answer: 'Contact our support team via the "Contact Support" option in your profile. We take all reports seriously and aim to respond within 24 hours.',
  },
];

/**
 * FAQsScreen
 *
 * Expandable accordion-style FAQ list.
 */
export default function FAQsScreen() {
  const colors = useThemeColors();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggleFaq(id: string) {
    setExpandedId(expandedId === id ? null : id);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ThemedView style={styles.container}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.back()} hitSlop={8} accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <ThemedText variant="h3" style={{ marginLeft: theme.spacing.md }}>
            Frequently Asked Questions
          </ThemedText>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {FAQS.map((faq, index) => {
            const isExpanded = expandedId === faq.id;
            const isLast = index === FAQS.length - 1;
            return (
              <Pressable
                key={faq.id}
                onPress={() => toggleFaq(faq.id)}
                style={[
                  styles.faqItem,
                  {
                    borderBottomColor: colors.divider,
                    borderBottomWidth: isLast ? 0 : 1,
                    backgroundColor: isExpanded ? colors.surfaceAlt : 'transparent',
                  },
                ]}
              >
                <View style={styles.faqQuestion}>
                  <ThemedText variant="bodySemibold" style={{ flex: 1 }}>
                    {faq.question}
                  </ThemedText>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={colors.textMuted}
                    style={{ marginLeft: theme.spacing.sm }}
                  />
                </View>
                {isExpanded && (
                  <ThemedText color="textSecondary" style={styles.faqAnswer}>
                    {faq.answer}
                  </ThemedText>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
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
  scrollContent: { padding: theme.spacing.lg, paddingBottom: theme.spacing.xxxl },
  faqItem: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.md,
    marginBottom: 2,
  },
  faqQuestion: { flexDirection: 'row', alignItems: 'center' },
  faqAnswer: { marginTop: theme.spacing.sm, lineHeight: 22 },
});