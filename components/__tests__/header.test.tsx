import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { Header } from '../header';

// Mock useSafeAreaInsets
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 40, left: 0, right: 0, bottom: 0 }),
}));

describe('Header component', () => {
  it('renders correctly with children', () => {
    const { getByText } = render(
      <Header>
        <Text>Test Content</Text>
      </Header>
    );
    expect(getByText('Test Content')).toBeTruthy();
  });
});
