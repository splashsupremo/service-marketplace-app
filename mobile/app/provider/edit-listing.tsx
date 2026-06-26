import { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { SelectField } from '@/features/provider-dashboard/components/SelectField';
import { useProviderStore } from '@/store/providerStore';
import { CATEGORIES } from '@/app/services/mockData/categories';
import { NIGERIAN_STATES } from '@/app/services/mockData/nigerianStates';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);
const STATE_NAMES = NIGERIAN_STATES.filter((s) => s !== 'All States');

/**
 * EditListingScreen
 *
 * Create or edit the logged-in provider's own listing. If myProvider
 * already exists (from providerStore), the form pre-fills and submits
 * via updateProvider(); otherwise it starts blank and submits via
 * createProvider().
 *
 * Logo: tap the circle to pick a photo (expo-image-picker), shown
 * immediately while uploading in the background to Supabase Storage.
 * The resulting public URL is what gets saved as image_url on submit.
 */
export default function EditListingScreen() {
  const colors = useThemeColors();
  const myProvider = useProviderStore((s) => s.myProvider);
  const createProvider = useProviderStore((s) => s.createProvider);
  const updateProvider = useProviderStore((s) => s.updateProvider);
  const uploadLogo = useProviderStore((s) => s.uploadLogo);

  const isEditing = !!myProvider;

  const [businessName, setBusinessName] = useState(myProvider?.business_name ?? '');
  const [phoneNumber, setPhoneNumber] = useState<string>(myProvider?.phone_number ?? '');
  const [category, setCategory] = useState<string | null>(myProvider?.category ?? null);
  const [state, setState] = useState<string | null>(myProvider?.state ?? null);
  const [city, setCity] = useState(myProvider?.city ?? '');
  const [description, setDescription] = useState(myProvider?.description ?? '');
  const [imageUrl, setImageUrl] = useState<string | null>(myProvider?.image_url ?? null);

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handlePickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setFormError('Permission to access photos is required to upload a logo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      aspect: [1, 1],
      allowsEditing: true,
    });

    if (result.canceled || !result.assets?.[0]) return;

    const localUri = result.assets[0].uri;
    setImageUrl(localUri); // instant visual feedback
    setIsUploadingImage(true);

    const { url, error } = await uploadLogo(localUri);
    setIsUploadingImage(false);

    if (error) {
      setFormError(`Image upload failed: ${error}`);
      return;
    }

    setImageUrl(url);
  }

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (businessName.trim().length === 0) errors.businessName = 'Please enter your business name';
    if (!category) errors.category = 'Please select a category';
    if (!state) errors.state = 'Please select a state';
    if (city.trim().length === 0) errors.city = 'Please enter your city';
    if (description.trim().length < 20) errors.description = 'Please write at least 20 characters';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit() {
  setFormError(null);
  if (!validate()) return;

  setIsSubmitting(true);

  const input = {
  business_name: businessName.trim(),
  category: category as string,
  state: state as string,
  city: city.trim(),
  description: description.trim(),
  image_url: imageUrl,
  phone_number: phoneNumber.trim() || null,
};

  const { error } = isEditing ? await updateProvider(input) : await createProvider(input);

  setIsSubmitting(false);

  if (error) {
    setFormError(error);
    return;
  }

  router.back();
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
              {isEditing ? 'Edit Listing' : 'Create Your Listing'}
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

              {/* ── Logo Picker ── */}
              <Pressable
                onPress={handlePickImage}
                style={[styles.logoPicker, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
              >
                {imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={styles.logoImage} resizeMode="cover" />
                ) : (
                  <Ionicons name="camera-outline" size={28} color={colors.textMuted} />
                )}
                {isUploadingImage && (
                  <View style={[styles.uploadOverlay, { backgroundColor: colors.overlay }]}>
                    <ActivityIndicator color="#FFFFFF" />
                  </View>
                )}
              </Pressable>
              <ThemedText variant="caption" color="textSecondary" style={{ textAlign: 'center', marginBottom: theme.spacing.md }}>
                Tap to {imageUrl ? 'change' : 'add'} your logo or photo
              </ThemedText>

              {/* Business Name */}
              <ThemedText variant="label" color="textSecondary" style={styles.fieldLabel}>
                Business Name
              </ThemedText>
              <TextInput
                value={businessName}
                onChangeText={setBusinessName}
                placeholder="e.g. Ade's Plumbing Services"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text }]}
              />
              {fieldErrors.businessName && (
                <ThemedText variant="caption" style={{ color: colors.error, marginTop: 4 }}>
                  {fieldErrors.businessName}
                </ThemedText>
              )}

              {/* Category */}
              <SelectField
                label="Category"
                value={category}
                placeholder="Select a category"
                options={CATEGORY_NAMES}
                onChange={setCategory}
              />
              {fieldErrors.category && (
                <ThemedText variant="caption" style={{ color: colors.error, marginTop: 4 }}>
                  {fieldErrors.category}
                </ThemedText>
              )}

              {/* State */}
              <SelectField
                label="State"
                value={state}
                placeholder="Select a state"
                options={STATE_NAMES}
                onChange={setState}
                searchable
              />
              {fieldErrors.state && (
                <ThemedText variant="caption" style={{ color: colors.error, marginTop: 4 }}>
                  {fieldErrors.state}
                </ThemedText>
              )}

              {/* City */}
              <ThemedText variant="label" color="textSecondary" style={styles.fieldLabel}>
                City
              </ThemedText>
              <TextInput
                value={city}
                onChangeText={setCity}
                placeholder="e.g. Ikeja"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text }]}
              />
              {fieldErrors.city && (
                <ThemedText variant="caption" style={{ color: colors.error, marginTop: 4 }}>
                  {fieldErrors.city}
                </ThemedText>
              )}
{/* Phone Number */}
<ThemedText variant="label" color="textSecondary" style={styles.fieldLabel}>
  Phone Number (optional)
</ThemedText>
<TextInput
  value={phoneNumber}
  onChangeText={setPhoneNumber}
  placeholder="e.g. +234 801 234 5678"
  placeholderTextColor={colors.textMuted}
  keyboardType="phone-pad"
  style={[styles.input, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text }]}
/>
<ThemedText variant="caption" color="textMuted" style={{ marginTop: 4 }}>
  Customers can use this to call you directly from the chat screen.
</ThemedText>
              {/* Description */}
              <ThemedText variant="label" color="textSecondary" style={styles.fieldLabel}>
                Description
              </ThemedText>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Describe your services, experience, and what makes you stand out..."
                placeholderTextColor={colors.textMuted}
                style={[
                  styles.input,
                  styles.textArea,
                  { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text },
                ]}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
              {fieldErrors.description && (
                <ThemedText variant="caption" style={{ color: colors.error, marginTop: 4 }}>
                  {fieldErrors.description}
                </ThemedText>
              )}

              <Button
                label={isEditing ? 'Save Changes' : 'Create Listing'}
                onPress={handleSubmit}
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
  formContent: { paddingBottom: theme.spacing.xxxl, alignItems: 'center' },
  formInner: { width: '100%', maxWidth: 480, paddingHorizontal: theme.spacing.lg },
  banner: { borderRadius: theme.radius.md, padding: theme.spacing.md, marginBottom: theme.spacing.md },
  logoPicker: {
    width: 90,
    height: 90,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
  },
  logoImage: { width: '100%', height: '100%' },
  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldLabel: { marginTop: theme.spacing.lg, marginBottom: theme.spacing.xs },
  input: {
    borderWidth: 1,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 4,
    fontSize: 15,
  },
  textArea: { minHeight: 110, paddingTop: theme.spacing.sm + 4 },
});