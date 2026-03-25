import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Colors } from '../constants/theme';

type MaterialIconName = keyof typeof MaterialIcons.glyphMap;

type InputProps = TextInputProps & {
  iconName?: MaterialIconName;
  label?: string;
};

export function Input({ iconName, label, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.inputWrapper}>
        {iconName && (
          <View style={styles.iconContainer}>
            <MaterialIcons
              name={iconName}
              size={20}
              color={isFocused ? Colors.primary : '#94a3b8'}
            />
          </View>
        )}

        <TextInput
          style={[
            styles.input,
            {
              borderColor: isFocused ? Colors.primary : Colors.primaryAlpha02,
              paddingLeft: iconName ? 48 : 16,
            },
          ]}
          placeholder={props.placeholder}
          placeholderTextColor="#475569"
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          onChangeText={props.onChangeText}
          value={props.value}
          {...props}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5, // tracking-widest
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'absolute',
    left: 16, // pl-4
    zIndex: 10,
  },
  input: {
    backgroundColor: '#18181b', // zinc-900
    borderWidth: 1,
    borderRadius: 12, // rounded-xl
    paddingVertical: 16, // py-4
    paddingRight: 16, // pr-4
    color: '#ffffff',
    fontSize: 14, // text-sm
  },
});
