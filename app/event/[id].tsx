import { fetchAdapter } from '@/adapters/fetchAdapter';
import { Header } from '@/components/header';
import { Input } from '@/components/input';
import { SwitchStyled } from '@/components/switch';
import { Colors } from '@/constants/theme';
import { Event } from '@/types/events';
import { MaterialIcons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as yup from 'yup';

export default function UpdateEventScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);

  const schema = yup.object().shape({
    name: yup.string(),
    date: yup.string(),
    flyer: yup.string().url('Insira uma URL válida para o flyer').nullable(),
    location: yup.string(),
    deleted: yup.boolean().required(),
  });

  type FormValues = yup.InferType<typeof schema>;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function getEvent() {
    const requestOptions = { method: 'GET' };

    try {
      setRefreshing(true);
      const response = await fetchAdapter<Event>({
        url: `/events/${id}`,
        options: requestOptions,
      });

      const event = response.data;
      const flyerIsNull = event?.flyer === null;

      reset({
        date: event?.date,
        flyer: flyerIsNull ? '' : event?.flyer,
        location: event?.location,
        name: event?.name,
        deleted: event?.deleted,
      });
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    } finally {
      setRefreshing(false);
    }
  }

  async function onSubmit(data: FormValues) {
    const requesOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        flyer: data.flyer === '' ? null : data.flyer,
      }),
    };

    try {
      await fetchAdapter<Event>({ url: `/events/${id}`, options: requesOptions });

      Alert.alert('Atualizado!', 'Evento Atualizado com sucesso!');
      reset();
      getEvent();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    }
  }

  const onRefresh = useCallback(() => {
    getEvent();
    reset();
  }, [reset]);

  useEffect(() => {
    getEvent();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Stack.Screen
        options={{
          header: (props) => (
            <Header {...props}>
              <Pressable
                onPress={() => router.back()}
                style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
              >
                <MaterialIcons name="arrow-back" size={24} color={Colors.primary} />
              </Pressable>
              <Text style={styles.headerTitleWhite}>{`Editar Evento Id: ${id}`}</Text>
            </Header>
          ),
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Progress Decoration */}
        <View style={styles.headerDecoration}>
          <View style={styles.progressBar} />
          <Text style={styles.headerSubtitle}>
            Preencha os detalhes para a próxima apresentação dos Retrovisionários.
          </Text>
        </View>

        <View style={styles.formContainer}>
          {/* Nome do Evento */}
          <View style={styles.inputGroup}>
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
            {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
          </View>

          {/* Data */}
          <View style={styles.inputGroup}>
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
            {errors.date && <Text style={styles.errorText}>{errors.date.message}</Text>}
          </View>

          {/* Flyer Link */}
          <View style={styles.inputGroup}>
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
                  value={value === null ? '' : value}
                />
              )}
            />
            <Text style={styles.helperText}>Insira o link da arte promocional do show.</Text>
            {errors.flyer && <Text style={styles.errorText}>{errors.flyer.message}</Text>}
          </View>

          {/* Local */}
          <View style={styles.inputGroup}>
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
            {errors.location && <Text style={styles.errorText}>{errors.location.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Controller
              control={control}
              name="deleted"
              render={({ field: { onChange, value } }) => (
                <SwitchStyled
                  disabledLabel="Não Deletado"
                  enabledLabel="Deletado"
                  value={value}
                  onValueChange={onChange}
                />
              )}
            />
          </View>

          {/* Submit Button */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            style={({ pressed }) => [
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
              !isSubmitting && pressed && styles.submitButtonPressed,
            ]}
          >
            <MaterialIcons name="update" size={20} color="white" />
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Atualizando...' : 'Atualizar'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
  },
  headerDecoration: {
    marginBottom: 32,
  },
  progressBar: {
    width: 80,
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginBottom: 16,
  },
  headerSubtitle: {
    color: '#94a3b8', // slate-400
    fontSize: 14,
  },
  formContainer: {
    gap: 24,
    paddingBottom: 32,
  },
  inputGroup: {
    gap: 4,
  },
  errorText: {
    color: '#ef4444', // red-500
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  helperText: {
    color: '#64748b', // slate-500
    fontSize: 10,
    fontStyle: 'italic',
    marginTop: 8,
    marginLeft: 4,
  },
  previewContainer: {
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 140, 0, 0.3)', // primary/30
    backgroundColor: 'rgba(255, 140, 0, 0.05)', // primary/5
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  previewIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: Colors.primaryAlpha02, // primary/20
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewTextContainer: {
    flex: 1,
  },
  previewTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  previewSubtitle: {
    color: '#64748b', // slate-500
    fontSize: 12,
  },
  submitButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    // shadow-lg shadow-primary/20
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    width: 40, // size-10
    height: 40,
    borderRadius: 20, // rounded-full
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWhite: {
    color: '#ffffff',
    fontSize: 20, // text-xl
    fontWeight: 'bold',
    letterSpacing: -0.5, // tracking-tight
  },
  backButtonPressed: {
    backgroundColor: 'rgba(255, 140, 0, 0.1)', // active:bg-primary/10
  },
});
