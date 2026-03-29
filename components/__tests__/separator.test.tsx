import React from 'react';
import { render } from '@testing-library/react-native';
import { Separator } from '../separator';
import { Event } from '@/types/events';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

describe('Separator component', () => {
  const date1 = new Date(2026, 2, 1); // March 1st (0-indexed month)
  const date2 = new Date(2026, 2, 15); // March 15th
  const date3 = new Date(2026, 3, 1); // April 1st

  const mockData: Event[] = [
    { id: '1', name: 'Event 1', date: date1.toISOString(), flyer: null, deleted: false, description: '', location: '', price: 0, status: 'upcoming', type: 'concert', organizer: '' },
    { id: '2', name: 'Event 2', date: date2.toISOString(), flyer: null, deleted: false, description: '', location: '', price: 0, status: 'upcoming', type: 'concert', organizer: '' },
    { id: '3', name: 'Event 3', date: date3.toISOString(), flyer: null, deleted: false, description: '', location: '', price: 0, status: 'upcoming', type: 'concert', organizer: '' },
  ];

  const marchLabel = format(date1, 'MMMM - yyyy ', { locale: ptBR });
  const aprilLabel = format(date3, 'MMMM - yyyy ', { locale: ptBR });

  it('renders monthly separator for first item', () => {
    const { getByText } = render(<Separator data={mockData} index={0} />);
    expect(getByText(marchLabel)).toBeTruthy();
  });

  it('does NOT render separator for same month', () => {
    const { queryByText } = render(<Separator data={mockData} index={1} />);
    expect(queryByText(marchLabel)).toBeNull();
  });

  it('renders separator for different month', () => {
    const { getByText } = render(<Separator data={mockData} index={2} />);
    expect(getByText(aprilLabel)).toBeTruthy();
  });

  it('renders nothing if data is null or index is out of bounds', () => {
    const { toJSON } = render(<Separator data={null} index={0} />);
    expect(toJSON()).toBeNull();
  });
});
