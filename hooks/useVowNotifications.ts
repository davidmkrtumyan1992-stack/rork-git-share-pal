import { useEffect, useCallback, useState } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useAuth } from '@/contexts/AuthContext';
import { getNextVowForNotification, useCyclePositions } from '@/hooks/useVowCycle';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface UseVowNotificationsProps {
  selectedVowTypes: string[];
  notificationsEnabled: boolean;
  notificationInterval: 2 | 3;
}

export const useVowNotifications = ({
  selectedVowTypes,
  notificationsEnabled,
  notificationInterval,
}: UseVowNotificationsProps) => {
  const { language } = useAuth();
  const { data: cyclePositions = [] } = useCyclePositions();
  const [permissionGranted, setPermissionGranted] = useState(false);
  // key: `${vowType}_${vowIndex}`, value: ISO timestamp when notification arrived
  const [notificationTimes, setNotificationTimes] = useState<Record<string, string>>({});

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'web') return false;
    try {
      const { status: existing } = await Notifications.getPermissionsAsync();
      if (existing === 'granted') {
        setPermissionGranted(true);
        return true;
      }
      const { status } = await Notifications.requestPermissionsAsync();
      const granted = status === 'granted';
      setPermissionGranted(granted);
      return granted;
    } catch (e) {
      console.log('[notifications] permission error:', e);
      return false;
    }
  }, []);

  const scheduleNotifications = useCallback(async () => {
    if (Platform.OS === 'web') return;
    if (!permissionGranted) return;

    await Notifications.cancelAllScheduledNotificationsAsync();

    if (!notificationsEnabled || selectedVowTypes.length === 0) {
      console.log('[notifications] disabled or no vows — cancelled');
      return;
    }

    const intervalSeconds = notificationInterval * 60 * 60;
    const count = 16;

    for (let i = 0; i < count; i++) {
      const vow = getNextVowForNotification(selectedVowTypes, cyclePositions, i);
      const isRu = language === 'ru';

      const title = isRu ? '🙏 Напоминание об обете' : '🙏 Vow Reminder';
      let body: string;

      if (vow) {
        body = isRu ? vow.vowItem.textRu : vow.vowItem.textEn;
        if (body.length > 100) body = body.slice(0, 97) + '…';
      } else {
        body = isRu
          ? 'Время проверить, как вы соблюдаете обеты'
          : "Time to check how you're keeping your vows";
      }

      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            sound: true,
            data: vow
              ? { vowType: vow.vowType, vowIndex: vow.vowIndex }
              : { type: 'reminder' },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: intervalSeconds * (i + 1),
            repeats: false,
          },
        });
      } catch (e) {
        console.log('[notifications] schedule error:', e);
      }
    }

    console.log(`[notifications] scheduled ${count} × ${notificationInterval}h`);
  }, [
    permissionGranted,
    notificationsEnabled,
    notificationInterval,
    selectedVowTypes,
    cyclePositions,
    language,
  ]);

  // Track when notifications arrive (foreground) or are tapped (background/closed)
  useEffect(() => {
    if (Platform.OS === 'web') return;

    const receivedSub = Notifications.addNotificationReceivedListener(
      (notification: Notifications.Notification) => {
        const data = notification.request.content.data as Record<string, unknown>;
        if (data?.vowType != null && data?.vowIndex != null) {
          const key = `${data.vowType}_${data.vowIndex}`;
          setNotificationTimes((prev: Record<string, string>) => ({ ...prev, [key]: new Date().toISOString() }));
        }
      }
    );

    const responseSub = Notifications.addNotificationResponseReceivedListener(
      (response: Notifications.NotificationResponse) => {
        const data = response.notification.request.content.data as Record<string, unknown>;
        if (data?.vowType != null && data?.vowIndex != null) {
          const key = `${data.vowType}_${data.vowIndex}`;
          setNotificationTimes((prev: Record<string, string>) => ({ ...prev, [key]: new Date().toISOString() }));
        }
      }
    );

    return () => {
      receivedSub.remove();
      responseSub.remove();
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      requestPermissions();
    }
  }, [requestPermissions]);

  useEffect(() => {
    if (permissionGranted) {
      scheduleNotifications();
    }
  }, [scheduleNotifications, permissionGranted]);

  return { permissionGranted, requestPermissions, scheduleNotifications, notificationTimes };
};

export const cancelAllNotifications = async () => {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('[notifications] all cancelled');
  } catch (e) {
    console.log('[notifications] cancel error:', e);
  }
};
