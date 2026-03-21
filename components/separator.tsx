import { Event } from '@/types/events';
import { format, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Text, View } from 'react-native';

type SepratorProps = {
  data: Event[] | null;
  index: number;
};

export function Separator({ data, index }: SepratorProps) {
  const previusData = data?.[index - 1];
  const currentData = data?.[index];
  const hasPreviousAndCurrentData = currentData && previusData;
  const formatedDate = format(data?.[index].date!, 'MMMM - yyyy  ', { locale: ptBR });

  if (!data) {
    return;
  }

  return (
    <View className="flex-row items-center justify-center my-4">
      {!previusData && <Text className="text-white text-[1.6rem]">{formatedDate}</Text>}
      {hasPreviousAndCurrentData &&
        !isSameMonth(new Date(data[index - 1].date), new Date(data[index].date)) && (
          <Text className="text-white text-[1.6rem]">{formatedDate}</Text>
        )}
    </View>
  );
}
