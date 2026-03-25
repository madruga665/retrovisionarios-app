import { HapticTab } from '@/components/haptic-tab';
import { Header } from '@/components/header';
import { IconSymbol } from '@/components/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

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
              <Text style={styles.headerTitlePrimary}>
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
                style={({ pressed }) => [
                  styles.backButton,
                  pressed && styles.backButtonPressed
                ]}
              >
                <MaterialIcons name="arrow-back" size={24} color={Colors.primary} />
              </Pressable>
              <Text style={styles.headerTitleWhite}>Criar Novo Evento</Text>
            </Header>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerTitlePrimary: {
    color: Colors.primary,
    fontSize: 20, // text-xl
    fontWeight: 'bold',
    letterSpacing: -0.5, // tracking-tight
  },
  headerTitleWhite: {
    color: '#ffffff',
    fontSize: 20, // text-xl
    fontWeight: 'bold',
    letterSpacing: -0.5, // tracking-tight
  },
  backButton: {
    width: 40, // size-10
    height: 40,
    borderRadius: 20, // rounded-full
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    backgroundColor: 'rgba(255, 140, 0, 0.1)', // active:bg-primary/10
  },
});
