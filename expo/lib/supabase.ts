import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:');
  console.error('EXPO_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'set' : 'MISSING');
  console.error('EXPO_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'set' : 'MISSING');
}

const createSafeStorage = () => {
  return {
    getItem: async (key: string): Promise<string | null> => {
      try {
        const value = await AsyncStorage.getItem(key);
        if (value === null || value === undefined) {
          return null;
        }
        
        if (typeof value !== 'string') {
          console.warn(`Non-string value in AsyncStorage for key ${key}, clearing...`);
          await AsyncStorage.removeItem(key);
          return null;
        }
        
        if (value.trim().length === 0) {
          console.warn(`Empty string in AsyncStorage for key ${key}, clearing...`);
          await AsyncStorage.removeItem(key);
          return null;
        }
        
        const trimmedValue = value.trim();
        if (
          trimmedValue === 'undefined' || 
          trimmedValue === 'null' || 
          trimmedValue === 'object' ||
          trimmedValue.startsWith('[object') ||
          (!trimmedValue.startsWith('{') && !trimmedValue.startsWith('[') && !trimmedValue.startsWith('"'))
        ) {
          console.warn(`Corrupted AsyncStorage value for key ${key}: "${trimmedValue.substring(0, 50)}", clearing...`);
          await AsyncStorage.removeItem(key);
          return null;
        }
        
        try {
          JSON.parse(value);
          return value;
        } catch {
          console.warn(`Invalid JSON in AsyncStorage for key ${key}: "${value.substring(0, 50)}...", clearing...`);
          await AsyncStorage.removeItem(key);
          return null;
        }
      } catch (error) {
        console.error(`Error reading from AsyncStorage for key ${key}:`, error);
        return null;
      }
    },
    setItem: async (key: string, value: string): Promise<void> => {
      try {
        if (value === null || value === undefined || value === 'undefined' || value === 'null') {
          console.warn(`Attempting to store invalid value for key ${key}, skipping...`);
          return;
        }
        await AsyncStorage.setItem(key, value);
      } catch (error) {
        console.error(`Error writing to AsyncStorage for key ${key}:`, error);
      }
    },
    removeItem: async (key: string): Promise<void> => {
      try {
        await AsyncStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing from AsyncStorage for key ${key}:`, error);
      }
    },
  };
};

const createSupabaseClient = (): SupabaseClient => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase client created with missing credentials - requests will fail');
  }
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: createSafeStorage(),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    global: {
      fetch: async (url, options = {}) => {
        const MAX_RETRIES = 2;
        let lastError: unknown;

        const callerSignal = options.signal;

        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000);

          try {
            if (callerSignal?.aborted) {
              clearTimeout(timeoutId);
              throw new DOMException('Aborted', 'AbortError');
            }

            const response = await fetch(url, {
              ...options,
              signal: controller.signal,
            });
            clearTimeout(timeoutId);
            return response;
          } catch (error) {
            clearTimeout(timeoutId);
            lastError = error;

            if (error instanceof Error && error.name === 'AbortError') {
              if (callerSignal?.aborted) {
                throw error;
              }
              if (attempt < MAX_RETRIES) {
                console.warn(`[Supabase] Request timeout (attempt ${attempt + 1}), retrying...`);
                await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
                continue;
              }
              console.error('[Supabase] Request timeout after retries:', typeof url === 'string' ? url.substring(0, 80) : url);
              throw new Error('Request timeout. Check your internet connection.');
            }

            if (attempt < MAX_RETRIES) {
              console.warn(`[Supabase] Fetch failed (attempt ${attempt + 1}):`, (error as Error)?.message);
              await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
              continue;
            }

            console.error('[Supabase] Fetch failed after retries:', (error as Error)?.message);
            throw error;
          }
        }

        throw lastError;
      },
    },
  });
};

export const supabase = createSupabaseClient();
