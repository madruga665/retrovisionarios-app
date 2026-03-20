import { MaterialIcons } from '@expo/vector-icons';
import { Text, TextInput, TextInputProps, View } from 'react-native';

type MaterialIconName = keyof typeof MaterialIcons.glyphMap;

type InputProps = TextInputProps & {
  iconName?: MaterialIconName;
  label?: string;
};

export function Input({ iconName, label, ...props }: InputProps) {
  return (
    <View>
      <Text className="text-primary text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">
        {label}
      </Text>
      <View className="relative border justify-center">
        <View className="absolute left-4 z-10">
          <MaterialIcons name={iconName} size={20} color="#94a3b8" />
        </View>

        <TextInput
          className="bg-zinc-900 border border-primary/30 rounded-xl py-4 pl-12 pr-4 text-white text-sm focus:border-primary"
          placeholder={props.placeholder}
          placeholderTextColor="#475569"
          onBlur={props.onBlur}
          onChangeText={props.onChangeText}
          value={props.value}
        />
      </View>
    </View>
  );
}
