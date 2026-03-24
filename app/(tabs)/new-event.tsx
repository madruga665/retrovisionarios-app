import { fetchAdapter } from '@/adapters/fetchAdapter';
import { Input } from '@/components/input';
import { Event } from '@/types/events';
import { MaterialIcons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import * as yup from 'yup';
import '../../global.css';

export default function NewEvent() {
  const router = useRouter();
  const [refreshing] = useState(false);
  const schema = yup.object().shape({
    name: yup.string().required('O nome do evento é obrigatório'),
    date: yup.string().required('A data é obrigatória (AAAA-MM-DD)'),
    flyer: yup.string().url(),
    location: yup.string().required('O local é obrigatório'),
  });

  type FormValues = yup.InferType<typeof schema>;

  const onRefresh = useCallback(() => {
    reset();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function onSubmit(data: FormValues) {
    const requesOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        flyer: data.flyer || null,
      }),
    };

    try {
      await fetchAdapter<Event>({ url: '/events', options: requesOptions });

      Alert.alert('Sucesso!', 'Evento criado na rede dos Retrovisionários.');
      reset();
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    }
  }

  return (
    <KeyboardAvoidingView behavior="height" className="flex-1 animate-slideInRight">
      <ScrollView
        className="flex-1 px-6 pt-8"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Progress Decoration */}
        <View className="mb-8">
          <View className="w-20 h-1 bg-primary rounded-full mb-4" />
          <Text className="text-slate-400 text-sm">
            Preencha os detalhes para a próxima apresentação dos Retrovisionários.
          </Text>
        </View>

        <View className="gap-y-6 pb-32">
          {/* Nome do Evento */}
          <View>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Nome do Evento"
                  iconName="electric-bolt"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Ex: Noite de Sintetizadores 1985"
                />
              )}
            />

            {errors.name && (
              <Text className="text-red-500 text-xs mt-1 ml-1">{errors.name.message}</Text>
            )}
          </View>

          {/* Data */}
          <View>
            <Controller
              control={control}
              name="date"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Data do Show (AAAA-MM-DD HH:mm)"
                  iconName="calendar-today"
                  placeholder="2024-10-25 14:00"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />

            {errors.date && (
              <Text className="text-red-500 text-xs mt-1 ml-1">{errors.date.message}</Text>
            )}
          </View>

          {/* Flyer Link */}
          <View>
            <Controller
              control={control}
              name="flyer"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Link do Flyer (Imagem)"
                  iconName="image"
                  placeholder="https://exemplo.com/poster.jpg"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            <Text className="text-slate-500 text-[10px] italic mt-2 ml-1">
              Insira o link da arte promocional do show.
            </Text>
          </View>

          {/* Local */}
          <View>
            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Local (Endereço)"
                  iconName="location-on"
                  placeholder="Rua Cyberpunk, 2077 - Centro"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.location && (
              <Text className="text-red-500 text-xs mt-1 ml-1">{errors.location.message}</Text>
            )}
          </View>

          {/* Preview Placeholder */}
          <View className="mt-4 p-5 rounded-2xl border border-dashed border-primary/30 bg-primary/5 flex-row items-center gap-4">
            <View className="w-14 h-14 rounded-xl bg-primary/20 items-center justify-center">
              <MaterialIcons name="art-track" size={28} color="#ff8c00" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold text-sm">Visualização do Card</Text>
              <Text className="text-slate-500 text-xs">
                O flyer aparecerá automaticamente no feed da banda.
              </Text>
            </View>
          </View>

          {/* Submit Button */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className={`w-full flex-row items-center justify-center gap-2 bg-primary py-4 rounded-xl shadow-lg shadow-primary/20 active:scale-95 ${isSubmitting ? 'opacity-50' : ''}`}
          >
            <MaterialIcons name="add-circle" size={20} color="white" />
            <Text className="text-white font-bold text-base">
              {isSubmitting ? 'Criando...' : 'Criar Evento'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
