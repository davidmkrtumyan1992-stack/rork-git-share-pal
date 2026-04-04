import { useEffect, useCallback, useRef, useState } from 'react';
import { Platform, AppState, AppStateStatus } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useAuth } from '@/contexts/AuthContext';
import { useCyclePositions, getNextVowForNotification, DailyVowItem } from '@/hooks/useVowCycle';
import { useUncompletedAntidotes } from '@/hooks/useVows';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const NOTIFICATION_INTERVALS = {
  2: 2 * 60 * 60 * 1000,
  3: 3 * 60 * 60 * 1000,
};

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
  const { user, language } = useAuth();
  const { data: cyclePositions = [] } = useCyclePositions();
  const { data: uncompletedAntidotes = [] } = useUncompletedAntidotes();
  
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const initialDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const requestPermissions = useCallback(async () => {
    if (Platform.OS === 'web') {
      console.log('Notifications not supported on web');
      return false;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      
      if (existingStatus === 'granted') {
        setPermissionGranted(true);
        return true;
      }

      const { status } = await Notifications.requestPermissionsAsync();
      const granted = status === 'granted';
      setPermissionGranted(granted);
      console.log('Notification permission:', status);
      return granted;
    } catch (error) {
      console.log('Error requesting notification permissions:', error);
      return false;
    }
  }, []);

  const sendVowNotification = useCallback(async (vowItem: DailyVowItem) => {
    if (Platform.OS === 'web' || !permissionGranted) return;

    try {
      const title = language === 'ru' ? 'Напоминание об обете' : 'Vow Reminder';
      const body = language === 'ru' ? vowItem.vowItem.textRu : vowItem.vowItem.textEn;

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { vowType: vowItem.vowType, vowIndex: vowItem.vowIndex },
          sound: true,
        },
        trigger: null,
      });

      console.log('Vow notification sent:', vowItem.vowType, vowItem.vowIndex);
    } catch (error) {
      console.log('Error sending vow notification:', error);
    }
  }, [language, permissionGranted]);

  const sendAntidoteReminder = useCallback(async () => {
    if (Platform.OS === 'web' || !permissionGranted) return;
    if (uncompletedAntidotes.length === 0) return;

    try {
      const title = language === 'ru' 
        ? 'Незавершённый антидот' 
        : 'Uncompleted Antidote';
      const body = language === 'ru'
        ? 'У вас есть незавершённый антидот. Пожалуйста, выполните практику, чтобы восстановить обет.'
        : 'You have an uncompleted antidote. Please complete the practice to restore your vow.';

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { type: 'antidote_reminder' },
          sound: true,
        },
        trigger: null,
      });

      console.log('Antidote reminder sent');
    } catch (error) {
      console.log('Error sending antidote reminder:', error);
    }
  }, [language, permissionGranted, uncompletedAntidotes.length]);

  const triggerNextNotification = useCallback(() => {
    if (!user || selectedVowTypes.length === 0 || cyclePositions.length === 0) {
      console.log('Cannot trigger notification: missing data');
      return;
    }

    if (uncompletedAntidotes.length > 0) {
      sendAntidoteReminder();
      return;
    }

    const nextVow = getNextVowForNotification(
      selectedVowTypes,
      cyclePositions,
      currentNotificationIndex
    );

    if (nextVow) {
      sendVowNotification(nextVow);
      setCurrentNotificationIndex(prev => prev + 1);
    }
  }, [
    user,
    selectedVowTypes,
    cyclePositions,
    currentNotificationIndex,
    uncompletedAntidotes.length,
    sendVowNotification,
    sendAntidoteReminder,
  ]);

  const startNotificationInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (!notificationsEnabled || !permissionGranted) {
      console.log('Notifications disabled or permission not granted');
      return;
    }

    const intervalMs = NOTIFICATION_INTERVALS[notificationInterval];
    console.log('Starting notification interval:', notificationInterval, 'hours');

    intervalRef.current = setInterval(() => {
      console.log('Interval triggered, sending notification');
      triggerNextNotification();
    }, intervalMs);
  }, [notificationsEnabled, permissionGranted, notificationInterval, triggerNextNotification]);

  const stopNotificationInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log('Notification interval stopped');
    }
    if (initialDelayRef.current) {
      clearTimeout(initialDelayRef.current);
      initialDelayRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (notificationsEnabled && Platform.OS !== 'web') {
      requestPermissions();
    }
  }, [notificationsEnabled, requestPermissions]);

  useEffect(() => {
    if (!notificationsEnabled || !permissionGranted || !user) {
      stopNotificationInterval();
      return;
    }

    if (initialDelayRef.current) {
      clearTimeout(initialDelayRef.current);
    }

    console.log('Scheduling initial notification after 5 seconds');
    initialDelayRef.current = setTimeout(() => {
      triggerNextNotification();
      startNotificationInterval();
    }, 5000);

    return () => {
      stopNotificationInterval();
    };
  }, [
    notificationsEnabled,
    permissionGranted,
    user,
    triggerNextNotification,
    startNotificationInterval,
    stopNotificationInterval,
  ]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App came to foreground');
        if (notificationsEnabled && permissionGranted) {
          startNotificationInterval();
        }
      } else if (nextAppState.match(/inactive|background/)) {
        console.log('App went to background');
      }
      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [notificationsEnabled, permissionGranted, startNotificationInterval]);

  const selectedVowTypesKey = selectedVowTypes.join(',');
  
  useEffect(() => {
    setCurrentNotificationIndex(0);
  }, [selectedVowTypesKey]);

  return {
    permissionGranted,
    requestPermissions,
    triggerNextNotification,
    currentNotificationIndex,
  };
};

export const cancelAllNotifications = async () => {
  if (Platform.OS === 'web') return;
  
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications cancelled');
  } catch (error) {
    console.log('Error cancelling notifications:', error);
  }
};
