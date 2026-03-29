import React from 'react';
import { render } from '@testing-library/react-native';
import { IconSymbol } from '../icon-symbol';

describe('IconSymbol component', () => {
  it('renders correctly', () => {
    const { toJSON } = render(
      <IconSymbol name="house.fill" color="red" />
    );
    expect(toJSON()).not.toBeNull();
  });
});
