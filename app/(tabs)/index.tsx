import { fetchAdapter } from '@/adapters/fetchAdapter';
import { EventCard } from '@/components/event-card';
import { Input } from '@/components/input';
import { Separator } from '@/components/separator';
import { Colors } from '@/constants/theme';
import { Event, EventResponse } from '@/types/events';
import { MaterialIcons } from '@expo/vector-icons';
import { compareAsc, compareDesc, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const [data, setData] = useState<Event[] | null>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [orderEvent, setOrderEvent] = useState(false);
  const router = useRouter();
  const date = new Date();

  async function getAllEvents() {
    const requestOptions = { method: 'GET' };

    try {
      setRefreshing(true);
      const response = await fetchAdapter<EventResponse>({
        url: '/events?deleted=true',
        options: requestOptions,
      });

      setData(response.data?.result ?? []);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    } finally {
      setRefreshing(false);
    }
  }

  function handleSortEvents() {
    setOrderEvent(!orderEvent);

    if (orderEvent) {
      const sortedEvents = data?.sort((a, b) => compareAsc(new Date(a.date), new Date(b.date)));

      setData(sortedEvents || []);
    } else {
      const sortedEvents = data?.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));
      setData(sortedEvents || []);
    }
  }

  const onRefresh = useCallback(async () => {
    setOrderEvent(false);
    await getAllEvents();
  }, [data]);

  async function handleDeleteEvent(id: number) {
    Alert.alert(
      'Deletar Evento',
      'Tem certeza que deseja deletar este evento?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetchAdapter({
                url: `/events/${id}`,
                options: { method: 'DELETE' },
              });

              if (response.error) {
                Alert.alert('Erro', 'Não foi possível deletar o evento.');
                return;
              }

              Alert.alert('Evento deletado com sucesso');

              getAllEvents();
            } catch (error) {
              console.error('Erro ao deletar evento:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao tentar deletar o evento.');
            }
          },
        },
      ],
      { userInterfaceStyle: 'dark' },
    );
  }

  const filteredEvents = data?.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  function formatDate(date: string) {
    return format(new Date(date), 'dd MMM - yyyy ', { locale: ptBR });
  }

  useEffect(() => {
    getAllEvents();
  }, []);

  return (
    <FlatList
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
      }
      data={filteredEvents}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              Próximos <Text style={[styles.titleHighlight, styles.neonGlow]}>Eventos</Text>
            </Text>
            <View style={styles.titleUnderline} />
            <Text style={styles.subtitle}>Gerencie a agenda da turnê {date.getFullYear()}</Text>
          </View>

          {/* Input de Busca */}
          <View style={styles.searchContainer}>
            <Input
              iconName="search"
              placeholder="Buscar shows ou locais..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </View>

          <View style={styles.actionsContainer}>
            <Pressable
              onPress={handleSortEvents}
              style={({ pressed }) => [styles.sortButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.sortButtonText}>Ordernar</Text>
              <MaterialIcons
                name={orderEvent ? 'arrow-upward' : 'arrow-downward'}
                size={18}
                color="white"
              />
            </Pressable>
          </View>
        </View>
      }
      renderItem={({ item, index }) => (
        <View style={styles.cardContainer}>
          <Separator index={index} data={data} />
          <EventCard
            name={item.name}
            date={formatDate(item.date)}
            flyer={item.flyer}
            deleted={item.deleted}
            onEdit={() => console.log('Editar', item.id)}
            onDelete={() => handleDeleteEvent(item.id)}
          />
        </View>
      )}
      ListFooterComponent={
        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.addEventButton,
              pressed && styles.addEventButtonPressed,
            ]}
            onPress={() => router.push('/(tabs)/new-event')}
          >
            <MaterialIcons name="add-circle" size={48} color={Colors.primary} />
            <Text style={styles.addEventText}>Novo Evento</Text>
          </Pressable>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
  },
  header: {
    paddingTop: 32,
    paddingBottom: 16,
    paddingHorizontal: 20,
    gap: 24,
  },
  title: {
    fontSize: 30, // text-3xl
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: -0.5, // tracking-tight
  },
  titleHighlight: {
    color: Colors.primary,
  },
  neonGlow: {
    textShadowColor: 'rgba(255, 140, 0, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  titleUnderline: {
    height: 4,
    width: 48,
    backgroundColor: Colors.primary,
    marginTop: 8,
    borderRadius: 2,
  },
  subtitle: {
    color: '#94a3b8', // slate-400
    fontSize: 14,
    marginTop: 8,
  },
  searchContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 10,
  },
  searchInput: {
    width: '100%',
    backgroundColor: '#18181b', // zinc-900
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingLeft: 44,
    paddingRight: 16,
    fontSize: 14,
    color: '#ffffff',
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  sortButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    // shadow-lg shadow-primary/20
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  sortButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardContainer: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 48,
  },
  addEventButton: {
    backgroundColor: 'rgba(255, 140, 0, 0.05)', // primary/5
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 140, 0, 0.3)', // primary/30
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addEventButtonPressed: {
    backgroundColor: 'rgba(255, 140, 0, 0.2)', // primary/20
  },
  addEventText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginTop: 12,
  },
});
