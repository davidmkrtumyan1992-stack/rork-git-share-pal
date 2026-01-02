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
        if (value === 'undefined' || value === 'null' || value === '[object Object]' || value === 'object') {
          console.warn(`Corrupted AsyncStorage value for key ${key}, clearing...`);
          await AsyncStorage.removeItem(key);
          return null;
        }
        
        if (typeof value === 'string' && value.trim().length === 0) {
          console.warn(`Empty string in AsyncStorage for key ${key}, clearing...`);
          await AsyncStorage.removeItem(key);
          return null;
        }
        
        try {
          JSON.parse(value);
          return value;
        } catch {
          console.warn(`Invalid JSON in AsyncStorage for key ${key}, clearing...`);
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
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        try {
          const response = await fetch(url, {
            ...options,
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          return response;
        } catch (error) {
          clearTimeout(timeoutId);
          if (error instanceof Error && error.name === 'AbortError') {
            console.error('Request timeout:', url);
            throw new Error('Превышено время ожидания. Проверьте подключение к интернету.');
          }
          throw error;
        }
      },
    },
  });
};

export const supabase = createSupabaseClient();
