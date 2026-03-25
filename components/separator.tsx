import { Event } from '@/types/events';
import { format, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type SepratorProps = {
  data: Event[] | null;
  index: number;
};

export function Separator({ data, index }: SepratorProps) {
  const previusData = data?.[index - 1];
  const currentData = data?.[index];
  const hasPreviousAndCurrentData = currentData && previusData;

  if (!data || !data[index]) {
    return null;
  }

  const formatedDate = format(new Date(data[index].date), 'MMMM - yyyy ', { locale: ptBR });

  const showSeparator =
    !previusData ||
    (hasPreviousAndCurrentData &&
      !isSameMonth(new Date(previusData.date), new Date(currentData.date)));

  if (!showSeparator) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{formatedDate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16, // my-4 (4 * 4)
  },
  text: {
    color: '#ffffff',
    fontSize: 25.6, // 1.6rem (1.6 * 16)
    textTransform: 'capitalize',
  },
});
