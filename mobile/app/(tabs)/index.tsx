import { ScrollView, View, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SearchBar } from '@/components/ui/SearchBar';
import { CategoryChip } from '@/features/home/components/CategoryChip';
import { ProviderCard } from '@/features/providers/components/ProviderCard';
import { CATEGORIES } from '@/app/services/mockData/categories';
import { MOCK_PROVIDERS } from '@/app/services/mockData/providers';
import { theme } from '@/constants/theme';
import { useState } from 'react';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar */}
        <View style={styles.searchRow}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery('')}
            style={{ flex: 1 }}
          />
        </View>

        {/* Categories */}
        <SectionHeader title="Categories" actionLabel={null} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.id}
              label={cat.name}
              icon={cat.icon}
              isSelected={selectedCategory === cat.name}
              onPress={() =>
                setSelectedCategory(
                  selectedCategory === cat.name ? null : cat.name
                )
              }
            />
          ))}
        </ScrollView>

        {/* Featured Providers */}
        <SectionHeader
          title="Featured Providers"
          onActionPress={() => console.log('See all featured')}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {MOCK_PROVIDERS.filter((p) => p.isFeatured).map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onPress={() => console.log('Provider pressed:', provider.businessName)}
            />
          ))}
        </ScrollView>

        {/* All Providers (preview) */}
        <SectionHeader
          title="Recently Added"
          onActionPress={() => console.log('See all recent')}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {MOCK_PROVIDERS.slice(0, 6).map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onPress={() => console.log('Provider pressed:', provider.businessName)}
            />
          ))}
        </ScrollView>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
    gap: theme.spacing.md,
  },
  searchRow: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  horizontalList: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
});