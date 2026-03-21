import { fetchAdapter } from '@/adapters/fetchAdapter';
import { EventCard } from '@/components/event-card';
import { Separator } from '@/components/separator';
import { Event, EventResponse } from '@/types/events';
import { MaterialIcons } from '@expo/vector-icons';
import { compareAsc, compareDesc, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, Text, TextInput, View } from 'react-native';
import '../../global.css';

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
    const formatedDate = format(date, 'dd MMM - yyyy ', { locale: ptBR });

    return formatedDate;
  }

  useEffect(() => {
    getAllEvents();
  }, []);

  return (
    <FlatList
      className="pb-5 gap-5"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      data={filteredEvents}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={
        <View className="py-8 px-5 gap-y-6">
          <View>
            <Text className="text-3xl text-white font-bold tracking-tight">
              Próximos <Text className="text-primary neon-glow">Eventos</Text>
            </Text>
            <View className="h-1 w-12 bg-primary mt-2 rounded-full" />
            <Text className="text-slate-400 text-sm mt-2">
              Gerencie a agenda da turnê {date.getFullYear()}
            </Text>
          </View>

          {/* Input de Busca */}
          <View className="relative">
            <View className="absolute left-3 top-[10px] z-10">
              <MaterialIcons name="search" size={20} color={isFocused ? '#ff8c00' : '#94a3b8'} />
            </View>
            <TextInput
              className={`w-full bg-zinc-900 border ${
                isFocused ? 'border-primary/50' : 'border-primary/20'
              } rounded-xl py-3 pl-11 pr-4 text-sm text-white`}
              placeholder="Buscar shows ou locais..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </View>
          <View className="flex-row gap-x-3">
            <Pressable
              onPress={handleSortEvents}
              className="flex-1 flex-row items-center justify-center gap-2 bg-primary py-3 rounded-lg shadow-lg shadow-primary/20 active:opacity-80"
            >
              <Text className="text-white font-bold text-sm">Ordernar</Text>
              {orderEvent ? (
                <MaterialIcons name="arrow-upward" size={18} color="white" />
              ) : (
                <MaterialIcons name="arrow-downward" size={18} color="white" />
              )}
            </Pressable>
          </View>
        </View>
      }
      renderItem={({ item, index }) => (
        <View className="px-5 gap-2">
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
        <View className="px-5 pt-4 pb-12">
          <Pressable
            className="bg-primary/5 border-2 border-dashed border-primary/30 rounded-2xl p-10 items-center justify-center active:bg-primary/20 transition-all"
            onPress={() => router.push('/(tabs)/new-event')}
          >
            <MaterialIcons name="add-circle" size={48} color="#ff8c00" />
            <Text className="text-primary font-bold text-xs uppercase tracking-[3px] mt-3">
              Novo Evento
            </Text>
          </Pressable>
        </View>
      }
    />
  );
}
