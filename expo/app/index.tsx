import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/LoginForm';
import { Dashboard } from '@/components/Dashboard';
import { AdminPanel } from '@/components/AdminPanel';
import { OnboardingScreen } from '@/components/OnboardingScreen';
import { darkTheme } from '@/constants/theme';
import { Language } from '@/types/database';

type Screen = 'dashboard' | 'admin';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user, profile, isLoading, updateProfile, setLanguage } = useAuth();
  
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [activeVow, setActiveVow] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const hasShownOnboarding = useRef(false);

  const serverSelectedVows = useMemo(() => {
    try {
      return Array.isArray(profile?.selected_vow_types) 
        ? profile.selected_vow_types 
        : [];
    } catch (e) {
      console.log('Error accessing selected_vow_types:', e);
      return [];
    }
  }, [profile?.selected_vow_types]);

  const [localSelectedVows, setLocalSelectedVows] = useState<string[]>([]);
  const isInitializedRef = useRef(false);
  const isSavingRef = useRef(false);

  useEffect(() => {
    if (!isSavingRef.current && (serverSelectedVows.length > 0 || (profile && !isInitializedRef.current))) {
      setLocalSelectedVows(serverSelectedVows);
      isInitializedRef.current = true;
    }
  }, [serverSelectedVows, profile]);

  const selectedVows = localSelectedVows;

  useEffect(() => {
    if (selectedVows.length > 0 && !activeVow) {
      setActiveVow(selectedVows[0]);
    }
  }, [selectedVows, activeVow]);

  useEffect(() => {
    if (user && profile && !hasShownOnboarding.current) {
      if (selectedVows.length === 0) {
        console.log('No vows selected, showing onboarding');
        setShowOnboarding(true);
        hasShownOnboarding.current = true;
      }
    }
  }, [user, profile, selectedVows]);

  const handleOnboardingComplete = async (language: Language) => {
    console.log('Onboarding complete, setting language:', language);
    try {
      await setLanguage(language);
      setShowOnboarding(false);
      console.log('Onboarding completed successfully');
    } catch (error) {
      console.log('Error completing onboarding:', error);
      setShowOnboarding(false);
    }
  };

  const saveVowsToServer = useCallback(async (vows: string[]) => {
    isSavingRef.current = true;
    try {
      await updateProfile({ selected_vow_types: vows });
      console.log('[HomeScreen] Successfully saved vows to server');
    } catch (error) {
      console.error('[HomeScreen] Error saving vows:', error);
      setLocalSelectedVows(serverSelectedVows);
      Alert.alert('Error', 'Failed to save vow selection. Please try again.');
    } finally {
      isSavingRef.current = false;
    }
  }, [updateProfile, serverSelectedVows]);

  const handleToggleVow = useCallback((vowType: string) => {
    console.log('[HomeScreen] handleToggleVow called for:', vowType);
    
    setLocalSelectedVows(prev => {
      const newVows = prev.includes(vowType)
        ? prev.filter(v => v !== vowType)
        : [...prev, vowType];
      
      console.log('[HomeScreen] New vows (optimistic):', newVows);
      saveVowsToServer(newVows);
      
      return newVows;
    });
  }, [saveVowsToServer]);

  const handleRemoveVow = useCallback((vowType: string) => {
    console.log('Removing vow:', vowType);
    
    setLocalSelectedVows(prev => {
      const newVows = prev.filter(v => v !== vowType);
      
      if (activeVow === vowType) {
        setActiveVow(newVows.length > 0 ? newVows[0] : null);
      }
      
      saveVowsToServer(newVows);
      
      return newVows;
    });
  }, [activeVow, saveVowsToServer]);

  const handleConfirmVows = async () => {
    console.log('Vows already saved via toggleVow');
    setIsSaving(false);
    if (selectedVows.length > 0 && !selectedVows.includes(activeVow || '')) {
      setActiveVow(selectedVows[0]);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={darkTheme.colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <>
        <StatusBar style="light" />
        <LoginForm />
      </>
    );
  }

  if (showOnboarding) {
    return (
      <>
        <StatusBar style="dark" />
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      
      <View style={styles.screenContainer}>
        <Dashboard
          selectedVows={selectedVows}
          activeVow={activeVow}
          onSetActiveVow={setActiveVow}
          onSelectVow={() => {}}
          onOpenAdmin={() => setCurrentScreen('admin')}
          onRemoveVow={handleRemoveVow}
          onToggleVow={handleToggleVow}
          onConfirmVows={handleConfirmVows}
          isVowSaving={isSaving}
        />
      </View>

      <Modal
        visible={currentScreen === 'admin'}
        animationType="slide"
        onRequestClose={() => setCurrentScreen('dashboard')}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <AdminPanel onClose={() => setCurrentScreen('dashboard')} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: darkTheme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: darkTheme.colors.background,
  },
  screenContainer: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: darkTheme.colors.background,
    paddingHorizontal: darkTheme.spacing.md,
  },
});
