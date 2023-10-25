import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ChakraProvider } from '@chakra-ui/react';
import { IonReactRouter } from '@ionic/react-router';
import {
  IonApp,
} from '@ionic/react';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!);

const queryClient = new QueryClient();


root.render(
  <QueryClientProvider client={queryClient}>
    <ChakraProvider>
      <IonApp>
        <IonReactRouter >
          <App />
        </IonReactRouter>
      </IonApp>
    </ChakraProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);