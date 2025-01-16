import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import {
  LogLevel,
  NotificationClickEvent,
  OneSignal,
} from 'react-native-onesignal';

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';

import { Routes } from './src/routes';

import { THEME } from './src/theme';
import { Loading } from './src/components/Loading';

import { CartContextProvider } from './src/contexts/CartContext';
import { tagUserInfoCreate } from './src/notifications/notificationTags';

OneSignal.Debug.setLogLevel(LogLevel.Verbose);
OneSignal.initialize(process.env.ONESIGNAL_APP_ID ?? '');
OneSignal.Notifications.requestPermission(true);

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  tagUserInfoCreate();

  const handleNotificationClick = (event: NotificationClickEvent) => {
    const { actionId } = event.result;

    switch (actionId) {
      case '1':
        console.log('Ver todos');
        break;
      case '2':
        console.log('Ver pedido');
        break;
      default:
        console.log('Nenhum botão de ação selecionado');
        break;
    }
  };

  useEffect(() => {
    OneSignal.Notifications.addEventListener('click', handleNotificationClick);

    return () =>
      OneSignal.Notifications.removeEventListener(
        'click',
        handleNotificationClick
      );
  }, []);

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle='light-content'
        backgroundColor='transparent'
        translucent
      />
      <CartContextProvider>
        {fontsLoaded ? <Routes /> : <Loading />}
      </CartContextProvider>
    </NativeBaseProvider>
  );
}
