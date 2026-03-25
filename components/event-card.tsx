import { Colors } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';

type EventCardProps = {
  name: string;
  date: string;
  flyer: string | null;
  deleted: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function EventCard({ name, date, flyer, deleted, onEdit, onDelete }: EventCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const imageUrl =
    flyer ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDJorlCvEvMoW8MTCYrsp_iyd6CHoOdmAClM6PeoU_k0EHdw1bYZ6UlKoJgqnXacPhSTBhzdnTLxOmJ33_m9P63w0PYwESWFkOkd5S_WtTNmn4Cpbd3qtx9NkKOGTGPvrtWnp2uW7aa4Bjp7IhfcHBsr2cXJ9FRsJWT6MewaFXgoRUnKa5kYuJKXfhIzyvLp1oLUIxZ6aK53meZHRs7JbQalU9YQns1kLh4unkatvggb-2OOJYscKdKDTu86g6idU01rUoC6HgclCE';

  return (
    <View
      style={[styles.container, { borderColor: isDark ? 'rgba(255, 140, 0, 0.2)' : '#1e293b' }]}
    >
      {/* Imagem de Fundo com Gradiente Overlay */}
      <ImageBackground source={{ uri: imageUrl }} style={styles.imageBackground} resizeMode="cover">
        <LinearGradient colors={['transparent', 'rgba(18, 18, 18, 0.95)']} style={styles.gradient}>
          <Text style={styles.eventName}>{name}</Text>
        </LinearGradient>
      </ImageBackground>

      {/* Conteúdo Inferior */}
      <View style={styles.content}>
        {/* Info de Data/Hora */}
        <View style={styles.infoContainer}>
          <MaterialIcons name="calendar-month" size={14} color="#ff8c00" />
          <Text style={styles.dateText}>{date}</Text>
        </View>

        {/* Botões de Ação */}
        <View style={styles.buttonsContainer}>
          <Pressable
            onPress={onEdit}
            style={({ pressed }) => [
              styles.buttonBase,
              styles.editButton,
              { marginRight: 6 },
              pressed && styles.buttonPressed,
            ]}
          >
            <MaterialIcons name="edit" size={18} color="white" />
            <Text style={styles.editButtonText}>Editar</Text>
          </Pressable>

          <Pressable
            disabled={deleted}
            onPress={onDelete}
            style={({ pressed }) => [
              styles.buttonBase,
              styles.deleteButton,
              { marginLeft: 6 },
              deleted ? styles.deleteButtonDisabled : styles.deleteButtonEnabled,
              !deleted && pressed && styles.deleteButtonPressed,
            ]}
          >
            <MaterialIcons name="delete" size={18} color={deleted ? '#64748b' : '#94a3b8'} />
            <Text style={[styles.deleteButtonText, { color: deleted ? '#64748b' : '#cbd5e1' }]}>
              {deleted ? 'Deletado' : 'Deletar'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(24, 24, 27, 0.8)', // Um pouco mais opaco para contraste
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
    // Sombra (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Sombra (Android)
    elevation: 5,
  },
  imageBackground: {
    height: 176,
    width: '100%',
  },
  gradient: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  eventName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  content: {
    padding: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    color: '#94a3b8',
    fontSize: 14,
    marginLeft: 6,
  },
  buttonsContainer: {
    flexDirection: 'row', // Para os botões ficarem lado a lado
    alignItems: 'center',
  },
  buttonBase: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16, // Adicione padding horizontal para o botão ter corpo
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: Colors.primary, // Certifique-se de que a cor está aqui!
    // Sombras
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8, // Substitui o gap-2 para dar espaço entre ícone e texto
  },
  deleteButton: {
    borderWidth: 0,
  },
  deleteButtonEnabled: {
    backgroundColor: '#27272a', // zinc-800
  },
  deleteButtonDisabled: {
    backgroundColor: 'rgba(63, 63, 70, 0.5)', // zinc-700/50
  },
  deleteButtonPressed: {
    backgroundColor: 'rgba(127, 29, 29, 0.4)', // Fundo avermelhado ao pressionar
  },
  deleteButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
});
