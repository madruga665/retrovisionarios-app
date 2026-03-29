import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Button } from '../button';

describe('Button component', () => {
  it('renders correctly with label', () => {
    const { getByText } = render(<Button label="Test Button" />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button label="Press Me" onPress={onPressMock} />);

    fireEvent.press(getByText('Press Me'));
    expect(onPressMock).toHaveBeenCalled();
  });
});
