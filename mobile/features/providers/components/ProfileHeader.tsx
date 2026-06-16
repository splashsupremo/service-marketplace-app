import { View, Image, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useThemeColors';
import { theme } from '@/constants/theme';

export interface ProfileHeaderProps {
  imageUrl: string;
  isFavourited: boolean;
  onBackPress: () => void;
  onFavouritePress: () => void;
}

/**
 * ProfileHeader
 *
 * Full-width cover image with floating back and favourite (heart) buttons
 * overlaid on top, positioned within the safe area so they clear the
 * status bar/notch on every device.
 *
 * Usage:
 *   <ProfileHeader
 *     imageUrl={provider.imageUrl}
 *     isFavourited={isFavourited}
 *     onBackPress={() => router.back()}
 *     onFavouritePress={handleToggleFavourite}
 *   />
 */
export function ProfileHeader({
  imageUrl,
  isFavourited,
  onBackPress,
  onFavouritePress,
}: ProfileHeaderProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUrl }}
        style={[styles.image, { backgroundColor: colors.surfaceAlt }]}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.overlayRow} edges={['top']}>
        <View style={styles.buttonRow}>
          <Pressable
            onPress={onBackPress}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={[styles.iconButton, { backgroundColor: colors.overlay }]}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>

          <Pressable
            onPress={onFavouritePress}
            accessibilityRole="button"
            accessibilityLabel={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
            style={[styles.iconButton, { backgroundColor: colors.overlay }]}
          >
            <Ionicons
              name={isFavourited ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavourited ? colors.error : '#FFFFFF'}
            />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative' },
  image: { width: '100%', height: 260 },
  overlayRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});