import { fetchAdapter } from '@/adapters/fetchAdapter';
import { Input } from '@/components/input';
import { Colors } from '@/constants/theme';
import { Event } from '@/types/events';
import { MaterialIcons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
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

export default function NewEvent() {
  const router = useRouter();
  const [refreshing] = useState(false);

  const schema = yup.object().shape({
    name: yup.string().required('O nome do evento é obrigatório'),
    date: yup.string().required('A data é obrigatória (AAAA-MM-DD)'),
    flyer: yup.string().url('Insira uma URL válida para o flyer'),
    location: yup.string().required('O local é obrigatório'),
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

  const onRefresh = useCallback(() => {
    reset();
  }, [reset]);

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
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
                  value={value}
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

          {/* Preview Placeholder */}
          <View style={styles.previewContainer}>
            <View style={styles.previewIconContainer}>
              <MaterialIcons name="art-track" size={28} color={Colors.primary} />
            </View>
            <View style={styles.previewTextContainer}>
              <Text style={styles.previewTitle}>Visualização do Card</Text>
              <Text style={styles.previewSubtitle}>
                O flyer aparecerá automaticamente no feed da banda.
              </Text>
            </View>
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
            <MaterialIcons name="add-circle" size={20} color="white" />
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Criando...' : 'Criar Evento'}
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
    backgroundColor: 'rgba(255, 140, 0, 0.2)', // primary/20
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
});
