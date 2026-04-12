import { useEffect, useCallback, useState } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useAuth } from '@/contexts/AuthContext';
import { getNextVowForNotification, useCyclePositions } from '@/hooks/useVowCycle';
import { supabase } from '@/lib/supabase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const VOW_CATEGORY_ID = 'vow_reminder';

// Compute scheduled notification times for today, starting at 9:00 AM local time
export function computeScheduledTimes(count: number, intervalHours: 2 | 3): string[] {
  const now = new Date();
  const dayStart = new Date(now);
  dayStart.setHours(9, 0, 0, 0);
  const intervalMs = intervalHours * 60 * 60 * 1000;
  const times: string[] = [];
  for (let i = 0; i < count; i++) {
    times.push(new Date(dayStart.getTime() + i * intervalMs).toISOString());
  }
  return times;
}

// Set up notification category with action buttons (called once on startup)
async function setupNotificationCategory() {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.setNotificationCategoryAsync(VOW_CATEGORY_ID, [
      {
        identifier: 'kept',
        buttonTitle: '✅ Соблюдал',
        options: { opensAppToForeground: false },
      },
      {
        identifier: 'broken',
        buttonTitle: '❌ Нарушил',
        options: { opensAppToForeground: false },
      },
      {
        identifier: 'note',
        buttonTitle: '💬 Заметка',
        textInput: {
          submitButtonTitle: 'Сохранить',
          placeholder: 'Что произошло?',
        },
        options: { opensAppToForeground: false },
      },
    ]);
  } catch (e) {
    console.log('[notifications] category setup error:', e);
  }
}

// Save vow entry to Supabase directly (works in background, no React hooks needed)
async function saveVowEntryFromNotification(
  vowType: string,
  status: 'kept' | 'broken' | null,
  noteText?: string
) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) return;
    const userId = session.user.id;
    const today = new Date().toISOString().split('T')[0];

    const { data: existing } = await supabase
      .from('vow_entries')
      .select('id, status')
      .eq('user_id', userId)
      .eq('vow_type', vowType)
      .eq('entry_date', today)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('vow_entries')
        .update({
          ...(status && { status }),
          ...(noteText !== undefined && { note_text: noteText }),
        })
        .eq('id', existing.id);
    } else if (status) {
      await supabase.from('vow_entries').insert({
        user_id: userId,
        vow_type: vowType,
        entry_date: today,
        status,
        note_text: noteText || null,
        antidote_text: null,
        antidote_completed: false,
        postponed_count: 0,
      });
    }
    console.log(`[notifications] saved vow entry: ${vowType} → ${status ?? 'note'}`);
  } catch (e) {
    console.log('[notifications] save error:', e);
  }
}

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

  // Set up category once on mount
  useEffect(() => {
    setupNotificationCategory();
  }, []);

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
            categoryIdentifier: VOW_CATEGORY_ID,
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

    console.log(`[notifications] scheduled ${count} × ${notificationInterval}h with action buttons`);
  }, [
    permissionGranted,
    notificationsEnabled,
    notificationInterval,
    selectedVowTypes,
    cyclePositions,
    language,
  ]);

  // Handle notification actions (kept / broken / note)
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

        // Track notification time on card
        if (data?.vowType != null && data?.vowIndex != null) {
          const key = `${data.vowType}_${data.vowIndex}`;
          setNotificationTimes((prev: Record<string, string>) => ({ ...prev, [key]: new Date().toISOString() }));
        }

        // Handle action buttons
        const actionId = response.actionIdentifier;
        const vowType = data?.vowType ? String(data.vowType) : null;
        const userText = (response as any).userText as string | undefined;

        if (!vowType) return;
        if (actionId === Notifications.DEFAULT_ACTION_IDENTIFIER) return; // plain tap = open app

        if (actionId === 'kept') {
          saveVowEntryFromNotification(vowType, 'kept');
        } else if (actionId === 'broken') {
          saveVowEntryFromNotification(vowType, 'broken');
        } else if (actionId === 'note' && userText) {
          saveVowEntryFromNotification(vowType, null, userText);
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
