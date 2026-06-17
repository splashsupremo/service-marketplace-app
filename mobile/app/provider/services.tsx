import { useState } from 'react';
import { View, FlatList, Pressable, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { ManagedServiceRow } from '@/features/provider-dashboard/components/ManagedServiceRow';
import { ServiceFormModal } from '@/features/provider-dashboard/components/ServiceFormModal';
import { useProviderStore, OwnedService } from '@/store/providerStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

/**
 * ManageServicesScreen
 *
 * Lists the provider's own services with edit/delete actions, plus an
 * "Add Service" button. Add/Edit both use the same ServiceFormModal.
 */
export default function ManageServicesScreen() {
  const colors = useThemeColors();
  const myServices = useProviderStore((s) => s.myServices);
  const addService = useProviderStore((s) => s.addService);
  const updateService = useProviderStore((s) => s.updateService);
  const deleteService = useProviderStore((s) => s.deleteService);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<OwnedService | null>(null);

  function openAddModal() {
    setEditingService(null);
    setModalVisible(true);
  }

  function openEditModal(service: OwnedService) {
    setEditingService(service);
    setModalVisible(true);
  }

  function handleDelete(service: OwnedService) {
    Alert.alert(
      'Delete Service',
      `Remove "${service.name}" from your services?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } = await deleteService(service.id);
            if (error) {
              Alert.alert('Something went wrong', error);
            }
          },
        },
      ]
    );
  }

  async function handleFormSubmit(name: string, price: number) {
    if (editingService) {
      return updateService(editingService.id, name, price);
    }
    return addService(name, price);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ThemedView style={styles.container}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.back()} hitSlop={8} accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <ThemedText variant="h3" style={{ marginLeft: theme.spacing.md, flex: 1 }}>
            Manage Services
          </ThemedText>
          <Pressable onPress={openAddModal} hitSlop={8} accessibilityLabel="Add service">
            <Ionicons name="add-circle" size={28} color={colors.primary} />
          </Pressable>
        </View>

        {myServices.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="construct-outline" size={28} color={colors.primary} />
            </View>
            <ThemedText variant="h3" style={{ textAlign: 'center' }}>
              No services yet
            </ThemedText>
            <ThemedText
              color="textSecondary"
              style={{ textAlign: 'center', marginTop: theme.spacing.xs }}
            >
              Tap the + button above to add your first service.
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={myServices}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ManagedServiceRow
                service={item}
                onEdit={() => openEditModal(item)}
                onDelete={() => handleDelete(item)}
              />
            )}
          />
        )}

        <ServiceFormModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          initialValues={
            editingService
              ? { name: editingService.name, price: String(editingService.price) }
              : undefined
          }
          onSubmit={handleFormSubmit}
        />
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
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xl },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  listContent: { paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.xxxl },
});