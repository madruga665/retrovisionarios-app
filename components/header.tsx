import { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function Header({ children }: PropsWithChildren) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row items-center gap-4 px-6 pb-6 mt-10 border-b-2 border-primary/20"
      style={{ paddingTop: insets.top }}
    >
      {children}
    </View>
  );
}
