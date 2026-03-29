import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { EventCard } from '../event-card';

describe('EventCard component', () => {
  const defaultProps = {
    name: 'Rock in Rio',
    date: '2026-09-13',
    flyer: 'https://example.com/flyer.jpg',
    deleted: false,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  it('renders correctly with name and date', () => {
    const { getByText } = render(<EventCard {...defaultProps} />);
    expect(getByText('Rock in Rio')).toBeTruthy();
    expect(getByText('2026-09-13')).toBeTruthy();
  });

  it('calls onEdit when edit button is pressed', () => {
    const { getByText } = render(<EventCard {...defaultProps} />);
    fireEvent.press(getByText('Editar'));
    expect(defaultProps.onEdit).toHaveBeenCalled();
  });

  it('calls onDelete when delete button is pressed and not deleted', () => {
    const { getByText } = render(<EventCard {...defaultProps} />);
    fireEvent.press(getByText('Deletar'));
    expect(defaultProps.onDelete).toHaveBeenCalled();
  });

  it('shows "Deletado" and is disabled when deleted is true', () => {
    const { getByText } = render(<EventCard {...defaultProps} deleted={true} />);
    expect(getByText('Deletado')).toBeTruthy();
    
    fireEvent.press(getByText('Deletado'));
    expect(defaultProps.onDelete).not.toHaveBeenCalledTimes(2); // Should still be 1 from previous test or 0 if only this one ran
  });
});
