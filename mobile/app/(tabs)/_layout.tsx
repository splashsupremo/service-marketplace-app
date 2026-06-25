import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { ThemedText } from '@/components/ui/ThemedText';

function TabBarIcon({
  name,
  color,
  size,
  badgeCount,
}: {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size: number;
  badgeCount?: number;
}) {
  if (!badgeCount || badgeCount === 0) {
    return <Ionicons name={name} size={size} color={color} />;
  }
  return (
    <View style={{ width: size + 10, height: size + 10 }}>
      <Ionicons name={name} size={size} color={color} />
      <View style={[badgeStyles.badge, { backgroundColor: 'red' }]}>
        <ThemedText style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>
          {badgeCount > 99 ? '99+' : String(badgeCount)}
        </ThemedText>
      </View>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
});

export default function TabLayout() {
  const colors = useThemeColors();
  const isAuthenticated = useAuthStore((s) => !!s.user);
  const totalUnreadCount = useChatStore((s) => (isAuthenticated ? s.totalUnreadCount : 0));

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: 'Favourites',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon
              name="chatbubble-outline"
              size={size}
              color={color}
              badgeCount={totalUnreadCount}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}