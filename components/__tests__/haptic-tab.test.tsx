import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { HapticTab } from '../haptic-tab';
import * as Haptics from 'expo-haptics';

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
  },
}));

// Mock @react-navigation/elements
jest.mock('@react-navigation/elements', () => {
  const { Pressable } = require('react-native');
  return {
    PlatformPressable: (props: any) => <Pressable {...props} />,
  };
});

describe('HapticTab component', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <HapticTab>
        <Text>Tab Item</Text>
      </HapticTab>
    );
    expect(getByText('Tab Item')).toBeTruthy();
  });

  it('triggers haptics on iOS when pressed', () => {
    const originalOS = process.env.EXPO_OS;
    process.env.EXPO_OS = 'ios';
    
    const { getByText } = render(
      <HapticTab>
        <Text>Tab Item</Text>
      </HapticTab>
    );
    
    fireEvent(getByText('Tab Item'), 'onPressIn');
    
    expect(Haptics.impactAsync).toHaveBeenCalled();
    
    process.env.EXPO_OS = originalOS;
  });
});
