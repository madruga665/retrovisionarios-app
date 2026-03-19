import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ImageBackground, Pressable, Text, View } from 'react-native';

interface EventCardProps {
  name: string;
  date: string;
  flyer: string | null;
  deleted: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function EventCard({ name, date, flyer, deleted, onEdit, onDelete }: EventCardProps) {
  const imageUrl =
    flyer ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDJorlCvEvMoW8MTCYrsp_iyd6CHoOdmAClM6PeoU_k0EHdw1bYZ6UlKoJgqnXacPhSTBhzdnTLxOmJ33_m9P63w0PYwESWFkOkd5S_WtTNmn4Cpbd3qtx9NkKOGTGPvrtWnp2uW7aa4Bjp7IhfcHBsr2cXJ9FRsJWT6MewaFXgoRUnKa5kYuJKXfhIzyvLp1oLUIxZ6aK53meZHRs7JbQalU9YQns1kLh4unkatvggb-2OOJYscKdKDTu86g6idU01rUoC6HgclCE';
  return (
    <View className="bg-zinc-900/50 border border-slate-800 dark:border-primary/20 rounded-xl overflow-hidden neon-border">
      {/* Imagem de Fundo com Gradiente Overlay */}
      <ImageBackground source={{ uri: imageUrl }} className="h-44 w-full" resizeMode="cover">
        <LinearGradient
          colors={['transparent', 'rgba(18, 18, 18, 0.95)']}
          className="h-full w-full justify-end p-4"
        >
          <Text className="text-white text-xl font-bold leading-tight">{name}</Text>
        </LinearGradient>
      </ImageBackground>

      {/* Conteúdo Inferior */}
      <View className="p-4 gap-y-4">
        {/* Info de Data/Hora */}
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center gap-1.5">
            <MaterialIcons name="calendar-month" size={14} color="#ff8c00" />
            <Text className="text-slate-400 text-sm">{date}</Text>
          </View>
        </View>

        {/* Botões de Ação */}
        <View className="flex-row gap-x-3">
          <Pressable
            onPress={onEdit}
            className="flex-1 flex-row items-center justify-center gap-2 bg-primary py-3 rounded-lg shadow-lg shadow-primary/20 active:opacity-80"
          >
            <MaterialIcons name="edit" size={18} color="white" />
            <Text className="text-white font-bold text-sm">Editar</Text>
          </Pressable>

          <Pressable
            disabled={deleted}
            onPress={onDelete}
            className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-lg ${
              deleted ? 'bg-zinc-700/50' : 'bg-zinc-800 active:bg-red-900/20'
            }`}
          >
            <MaterialIcons name="delete" size={18} color={deleted ? '#64748b' : '#94a3b8'} />
            <Text className={`${deleted ? 'text-slate-500' : 'text-slate-300'} font-bold text-sm`}>
              {deleted ? 'Deletado' : 'Deletar'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
