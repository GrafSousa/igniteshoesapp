import { useEffect, useState } from 'react';
import { useTheme } from 'native-base';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';

import { AppRoutes } from './app.routes';
import { Notification } from '../components/Notification';

import {
  OneSignal,
  OSNotification,
  NotificationWillDisplayEvent,
} from 'react-native-onesignal';

export function Routes() {
  const { colors } = useTheme();
  const [notification, setNotification] = useState<OSNotification>();

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];

  const handleNotification = (event: NotificationWillDisplayEvent): void => {
    event.preventDefault();

    const response = event.getNotification();

    setNotification(response);
  };

  useEffect(() => {
    OneSignal.Notifications.addEventListener(
      'foregroundWillDisplay',
      handleNotification
    );

    return () =>
      OneSignal.Notifications.removeEventListener(
        'foregroundWillDisplay',
        handleNotification
      );
  }, []);

  return (
    <NavigationContainer theme={theme}>
      <AppRoutes />

      {notification?.title && (
        <Notification
          data={notification}
          onClose={() => setNotification(undefined)}
        />
      )}
    </NavigationContainer>
  );
}
