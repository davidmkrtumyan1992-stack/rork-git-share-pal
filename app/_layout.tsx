import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

function setupPWA() {
  if (typeof document === 'undefined') return;

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }

  const setMeta = (name: string, content: string) => {
    if (document.querySelector(`meta[name="${name}"]`)) return;
    const el = document.createElement('meta');
    el.name = name;
    el.content = content;
    document.head.appendChild(el);
  };

  const setLink = (rel: string, href: string, extra?: Record<string, string>) => {
    if (document.querySelector(`link[rel="${rel}"]`)) return;
    const el = document.createElement('link');
    el.rel = rel;
    el.href = href;
    if (extra) Object.entries(extra).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  };

  setMeta('application-name', 'SharePal');
  setMeta('apple-mobile-web-app-capable', 'yes');
  setMeta('apple-mobile-web-app-status-bar-style', 'default');
  setMeta('apple-mobile-web-app-title', 'SharePal');
  setMeta('mobile-web-app-capable', 'yes');
  setMeta('theme-color', '#6B8E7F');
  setMeta('description', 'Трекер буддийских обетов и духовной практики');

  setLink('manifest', '/manifest.json');
  setLink('apple-touch-icon', '/assets/images/icon.png');
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal", headerShown: false }} />
      <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ headerShown: true, title: "Not Found" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    console.log("[RootLayout] Hiding splash screen, build v3");
    SplashScreen.hideAsync();
    if (Platform.OS === 'web') {
      setupPWA();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ErrorBoundary>
          <AuthProvider>
            <RootLayoutNav />
          </AuthProvider>
        </ErrorBoundary>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
