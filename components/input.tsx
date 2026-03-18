import { TextInput } from 'react-native';

type InputProps = {
  placeholder: string;
  onBlur: () => void;
  onChange: () => void;
  value?: string;
};

export function Input({ onBlur, onChange, placeholder, value }: InputProps) {
  return (
    <TextInput
      className="bg-zinc-900 border border-primary/30 rounded-xl py-4 pl-12 pr-4 text-white text-sm focus:border-primary"
      placeholder={placeholder}
      placeholderTextColor="#475569"
      onBlur={onBlur}
      onChangeText={onChange}
      value={value}
    />
  );
}
