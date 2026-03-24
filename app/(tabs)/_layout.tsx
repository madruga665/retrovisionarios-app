import { HapticTab } from '@/components/haptic-tab';
import { Header } from '@/components/header';
import { IconSymbol } from '@/components/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        animation: 'shift',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Eventos',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          header: (props) => (
            <Header {...props}>
              <Text className="text-primary text-xl font-bold tracking-tight">
                RETROVISIONÁRIOS
              </Text>
            </Header>
          ),
        }}
      />
      <Tabs.Screen
        name="new-event"
        options={{
          title: 'Novo Evento',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          header: (props) => (
            <Header {...props}>
              <Pressable
                onPress={() => router.back()}
                className="size-10 rounded-full items-center justify-center active:bg-primary/10"
              >
                <MaterialIcons name="arrow-back" size={24} color="#ff8c00" />
              </Pressable>
              <Text className="text-white text-xl font-bold tracking-tight">Criar Novo Evento</Text>
            </Header>
          ),
        }}
      />
    </Tabs>
  );
}
