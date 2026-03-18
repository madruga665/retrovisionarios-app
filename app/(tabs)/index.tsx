import { fetchAdapter } from '@/adapters/fetchAdapter';
import { EventCard } from '@/components/event-card';
import { Event, EventResponse } from '@/types/events';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import '../../global.css';

export default function HomeScreen() {
  const [data, setData] = useState<Event[] | null>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const date = new Date();

  async function getAllEvents() {
    const requestOptions = { method: 'GET' };

    try {
      const response = await fetchAdapter<EventResponse>({
        url: '/events',
        options: requestOptions,
      });
      setData(response.data?.result ?? []);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  }

  async function handleDeleteEvent(id: number) {
    Alert.alert('Deletar Evento', 'Tem certeza que deseja deletar este evento?', [
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

            getAllEvents();
          } catch (error) {
            console.error('Erro ao deletar evento:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao tentar deletar o evento.');
          }
        },
      },
    ]);
  }

  const filteredEvents = data?.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  function formatDate(date: string) {
    try {
      return format(date, 'dd MMM, yyyy', { locale: ptBR });
    } catch (e) {
      return date;
    }
  }

  useEffect(() => {
    getAllEvents();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <FlatList
        data={filteredEvents}
        contentContainerStyle={styles.listContainer}
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
              <View className="absolute left-3 top-[14px] z-10">
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
          </View>
        }
        renderItem={({ item }) => (
          <View className="px-5">
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
              onPress={() => console.log('Novo evento')}
            >
              <MaterialIcons name="add-circle" size={48} color="#ff8c00" />
              <Text className="text-primary font-bold text-xs uppercase tracking-[3px] mt-3">
                Novo Evento
              </Text>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
    gap: 20,
  },
});
