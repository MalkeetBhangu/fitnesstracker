import { QueryClientProvider } from '@src/config/QueryClientProvider';
import Navigation from '@src/navigation';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  return (
    <QueryClientProvider>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <Navigation />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

export default App;
