import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '../input';

describe('Input component', () => {
  it('renders correctly with label and placeholder', () => {
    const { getByText, getByPlaceholderText } = render(
      <Input label="Name" placeholder="Enter name" />
    );
    expect(getByText('Name')).toBeTruthy();
    expect(getByPlaceholderText('Enter name')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeTextMock = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter name" onChangeText={onChangeTextMock} />
    );
    
    fireEvent.changeText(getByPlaceholderText('Enter name'), 'New Value');
    expect(onChangeTextMock).toHaveBeenCalledWith('New Value');
  });

  it('handles focus and blur', () => {
    const onFocusMock = jest.fn();
    const onBlurMock = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter name" onFocus={onFocusMock} onBlur={onBlurMock} />
    );
    
    const input = getByPlaceholderText('Enter name');
    fireEvent(input, 'focus');
    expect(onFocusMock).toHaveBeenCalled();
    
    fireEvent(input, 'blur');
    expect(onBlurMock).toHaveBeenCalled();
  });
});
