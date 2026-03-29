import { Colors } from '@/constants/theme';
import { StyleSheet, Switch, SwitchProps, Text, View } from 'react-native';

type SwitchStyledProps = SwitchProps & {
  enabledLabel: string;
  disabledLabel: string;
};

export function SwitchStyled({ enabledLabel, disabledLabel, ...props }: SwitchStyledProps) {
  return (
    <View style={styles.switchContainer}>
      <Text style={styles.switchText}>{props.value ? enabledLabel : disabledLabel}</Text>
      <Switch
        trackColor={{ false: '#767577', true: Colors.primaryAlpha02 }}
        thumbColor={props.value ? Colors.primary : Colors.dark.icon}
        onValueChange={props.onValueChange}
        value={props.value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  switchText: {
    color: '#FFFFFF',
  },
});
