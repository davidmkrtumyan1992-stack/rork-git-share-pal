import { VowType } from '../App';
import { Language, t } from '../data/translations';
import { subscribeToPushNotifications, unsubscribeFromPushNotifications } from './pushNotifications';

let notificationInterval: number | null = null;

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function showVowReminder(vowType: VowType, language: Language) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  const title = t('notificationTitle', language);
  const body = t('notificationBody', language).replace('{vow}', t(vowType, language));

  new Notification(title, {
    body,
    icon: '/logo.png',
    badge: '/logo.png',
    tag: 'vow-reminder',
    requireInteraction: false,
  });
}

export async function startNotifications(
  vowType: VowType, 
  language: Language, 
  userId: string,
  intervalHours: 2 | 3 = 3
) {
  stopNotifications();

  // Subscribe to push notifications (for when app is closed)
  try {
    await subscribeToPushNotifications(userId);
    console.log('Subscribed to push notifications');
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
  }

  // Also start local notifications (for when app is open)
  const intervalMs = intervalHours * 60 * 60 * 1000;

  notificationInterval = window.setInterval(() => {
    showVowReminder(vowType, language);
  }, intervalMs);

  // Show first notification after a short delay
  setTimeout(() => {
    showVowReminder(vowType, language);
  }, 5000);
}

export async function stopNotifications(userId?: string) {
  if (notificationInterval !== null) {
    clearInterval(notificationInterval);
    notificationInterval = null;
  }

  // Unsubscribe from push notifications
  if (userId) {
    try {
      await unsubscribeFromPushNotifications(userId);
      console.log('Unsubscribed from push notifications');
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
    }
  }
}
