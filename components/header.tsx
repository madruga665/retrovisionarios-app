import { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Header({ children }: PropsWithChildren) {
  return (
    <SafeAreaView>
      <View className="flex-row items-center gap-4 px-6 py-4 border-b border-primary/20">
        {children}
      </View>
    </SafeAreaView>
  );
}
