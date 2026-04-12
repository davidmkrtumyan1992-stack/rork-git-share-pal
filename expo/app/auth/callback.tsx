import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { darkTheme } from '@/constants/theme';

export default function AuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      console.log('[AuthCallback] Processing auth callback params');
      
      try {
        if (params.access_token && params.refresh_token) {
          console.log('[AuthCallback] Setting session from URL params...');
          const { data, error } = await supabase.auth.setSession({
            access_token: params.access_token as string,
            refresh_token: params.refresh_token as string,
          });

          if (error) {
            console.error('[AuthCallback] Error setting session:', error);
            throw error;
          }

          console.log('[AuthCallback] Session set successfully:', data.user?.email);
          
          setTimeout(() => {
            router.replace('/');
          }, 1000);
        } else {
          console.log('[AuthCallback] No tokens in URL, redirecting to home...');
          router.replace('/');
        }
      } catch (error) {
        console.error('[AuthCallback] Callback error:', error);
        router.replace('/');
      }
    };

    handleCallback();
  }, [params, router]);

  return (
    <View style={styles.container} testID="auth-callback-screen">
      <ActivityIndicator size="large" color={darkTheme.colors.primary} />
      <Text style={styles.text}>Подтверждение email...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: darkTheme.spacing.lg,
  },
  text: {
    color: darkTheme.colors.text,
    fontSize: darkTheme.fontSize.md,
  },
});
