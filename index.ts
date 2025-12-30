import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { checkRateLimit, getClientIp, createRateLimitResponse } from '../_shared/rateLimiter.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Profile {
  user_id: string;
  username: string;
  notifications_enabled: boolean;
  notification_interval: number;
  last_notification_sent: string | null;
  selected_vow: string | null;
  language: string;
}

interface PushSubscription {
  endpoint: string;
  p256dh: string;
  auth: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting: максимум 10 запросов в минуту с одного IP
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(clientIp, {
    maxRequests: 10,
    windowMs: 60 * 1000 // 1 минута
  });

  if (!rateLimit.allowed) {
    console.log(`Rate limit exceeded for IP: ${clientIp}`);
    return createRateLimitResponse(rateLimit.resetTime, corsHeaders);
  }

  try {
    console.log('Starting push notification check...');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const now = new Date();
    
    // Get all profiles with notifications enabled
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('user_id, username, notifications_enabled, notification_interval, last_notification_sent, selected_vow, language')
      .eq('notifications_enabled', true)
      .not('selected_vow', 'is', null) as { data: Profile[] | null, error: any };

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      throw profilesError;
    }

    if (!profiles || profiles.length === 0) {
      console.log('No users with notifications enabled');
      return new Response(
        JSON.stringify({ message: 'No users to notify', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    console.log(`Found ${profiles.length} users with notifications enabled`);

    let notificationsSent = 0;

    for (const profile of profiles) {
      try {
        // Check if enough time has passed since last notification
        const interval = profile.notification_interval || 3;
        const intervalMs = interval * 60 * 60 * 1000; // Convert hours to milliseconds

        if (profile.last_notification_sent) {
          const lastSent = new Date(profile.last_notification_sent);
          const timeSinceLastNotification = now.getTime() - lastSent.getTime();
          
          if (timeSinceLastNotification < intervalMs) {
            console.log(`Skipping ${profile.username} - not enough time passed (${Math.round(timeSinceLastNotification / 1000 / 60)} min < ${interval * 60} min)`);
            continue;
          }
        }

        // Get user's push subscriptions
        const { data: subscriptions, error: subsError } = await supabaseClient
          .from('push_subscriptions')
          .select('endpoint, p256dh, auth')
          .eq('user_id', profile.user_id) as { data: PushSubscription[] | null, error: any };

        if (subsError || !subscriptions || subscriptions.length === 0) {
          console.log(`No push subscriptions for ${profile.username}`);
          continue;
        }

        // Prepare notification message
        const vowTranslations: Record<string, Record<string, string>> = {
          '10-principles': { ru: '10 этических принципов', en: '10 Ethical Principles' },
          'freedom': { ru: 'Обеты освобождения', en: 'Vows of Freedom' },
          'bodhisattva': { ru: 'Обеты бодхисаттвы', en: 'Bodhisattva Vows' },
          'secret': { ru: 'Тантрические обеты', en: 'Tantric Vows' },
          'nuns': { ru: 'Обеты монахини', en: 'Nun Vows' },
          'monks': { ru: 'Обеты монаха', en: 'Monk Vows' }
        };

        const lang = profile.language || 'ru';
        const vowName = vowTranslations[profile.selected_vow || '']?.[lang] || profile.selected_vow;
        
        const notificationData = {
          title: lang === 'ru' ? 'Напоминание об обетах' : 'Vow Reminder',
          body: lang === 'ru' 
            ? `Пора проверить обет: ${vowName}`
            : `Time to check your vow: ${vowName}`,
          icon: '/logo.png',
          badge: '/logo.png',
          tag: 'vow-reminder',
          data: {
            url: '/',
            timestamp: now.toISOString()
          }
        };

        // Send web push notifications to all user's devices
        for (const subscription of subscriptions) {
          try {
            // Note: In a real implementation, you would use web-push library
            // For now, we'll just log the notification
            console.log(`Would send notification to ${profile.username}:`, {
              endpoint: subscription.endpoint.substring(0, 50) + '...',
              notification: notificationData
            });
            
            // TODO: Implement actual web push using web-push library
            // This requires VAPID keys to be set up properly
            
          } catch (pushError) {
            console.error(`Error sending push to device:`, pushError);
          }
        }

        // Update last notification sent time
        const { error: updateError } = await supabaseClient
          .from('profiles')
          .update({ last_notification_sent: now.toISOString() })
          .eq('user_id', profile.user_id);

        if (updateError) {
          console.error(`Error updating last_notification_sent for ${profile.username}:`, updateError);
        } else {
          notificationsSent++;
          console.log(`Notification sent to ${profile.username}`);
        }

      } catch (userError) {
        console.error(`Error processing user ${profile.username}:`, userError);
      }
    }

    console.log(`Push notification check complete. Sent ${notificationsSent} notifications.`);

    return new Response(
      JSON.stringify({ 
        message: 'Push notifications processed', 
        sent: notificationsSent,
        total: profiles.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error in send-push-notifications function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
