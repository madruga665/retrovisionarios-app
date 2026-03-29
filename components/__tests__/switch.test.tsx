import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SwitchStyled } from '../switch';

describe('SwitchStyled component', () => {
  it('renders correctly with labels', () => {
    const { getByText } = render(
      <SwitchStyled 
        value={true} 
        enabledLabel="Ativo" 
        disabledLabel="Inativo" 
      />
    );
    expect(getByText('Ativo')).toBeTruthy();
  });

  it('renders disabled label when value is false', () => {
    const { getByText } = render(
      <SwitchStyled 
        value={false} 
        enabledLabel="Ativo" 
        disabledLabel="Inativo" 
      />
    );
    expect(getByText('Inativo')).toBeTruthy();
  });

  it('calls onValueChange when toggled', () => {
    const onValueChangeMock = jest.fn();
    const { getByRole } = render(
      <SwitchStyled 
        value={false} 
        enabledLabel="On" 
        disabledLabel="Off" 
        onValueChange={onValueChangeMock}
      />
    );
    
    // In React Native Testing Library, Switch has role 'switch'
    const switchComponent = getByRole('switch');
    fireEvent(switchComponent, 'valueChange', true);
    expect(onValueChangeMock).toHaveBeenCalledWith(true);
  });
});
