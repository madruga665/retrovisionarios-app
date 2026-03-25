import { Colors } from '@/constants/theme';
import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function Header({ children }: PropsWithChildren) {
  const insets = useSafeAreaInsets();
  return <View style={{ ...style.container, paddingTop: insets.top }}>{children}</View>;
}

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    marginTop: 40,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primaryAlpha02,
    paddingBottom: 16,
  },
});
