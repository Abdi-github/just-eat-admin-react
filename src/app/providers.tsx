import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return <Provider store={store}>{children}</Provider>;
}
