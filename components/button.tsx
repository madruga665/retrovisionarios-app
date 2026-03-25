import { Colors } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, PressableProps, StyleSheet, Text } from 'react-native';

type MaterialIconName = keyof typeof MaterialIcons.glyphMap;

type ButtonProps = PressableProps & {
  iconName?: MaterialIconName;
  label?: string;
};

export function Button({ iconName, label, ...props }: ButtonProps) {
  return (
    <Pressable
      onPress={props.onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <MaterialIcons name={iconName} size={18} color="white" />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },

  pressed: {
    opacity: 0.8,
  },

  label: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
});
