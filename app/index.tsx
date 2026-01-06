import React, { useState, useEffect, useRef, useMemo } from 'react';
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

  const selectedVows = useMemo(() => {
    try {
      return Array.isArray(profile?.selected_vow_types) 
        ? profile.selected_vow_types 
        : [];
    } catch (e) {
      console.log('Error accessing selected_vow_types:', e);
      return [];
    }
  }, [profile?.selected_vow_types]);

  useEffect(() => {
    if (selectedVows.length > 0 && !activeVow) {
      setActiveVow(selectedVows[0]);
    }
  }, [selectedVows, activeVow]);

  useEffect(() => {
    if (user && profile) {
      if (profile.is_first_login !== false && !hasShownOnboarding.current) {
        console.log('First login detected, showing onboarding');
        setShowOnboarding(true);
        hasShownOnboarding.current = true;
      } else if (profile.is_first_login === false && showOnboarding) {
        console.log('Onboarding already completed, hiding screen');
        setShowOnboarding(false);
      }
    }
  }, [user, profile, showOnboarding]);

  const handleOnboardingComplete = async (language: Language) => {
    console.log('Onboarding complete, setting language:', language);
    try {
      await setLanguage(language);
      await updateProfile({ is_first_login: false });
      console.log('Onboarding completed successfully, profile updated');
    } catch (error) {
      console.log('Error completing onboarding:', error);
      setShowOnboarding(false);
    }
  };

  const handleToggleVow = async (vowType: string) => {
    console.log('[HomeScreen] handleToggleVow called for:', vowType);
    console.log('[HomeScreen] Current selectedVows:', selectedVows);
    
    const newVows = selectedVows.includes(vowType)
      ? selectedVows.filter(v => v !== vowType)
      : [...selectedVows, vowType];
    
    console.log('[HomeScreen] New vows to save:', newVows);
    
    setIsSaving(true);
    
    try {
      const result = await updateProfile({ selected_vow_types: newVows });
      console.log('[HomeScreen] Successfully toggled vow:', vowType);
      console.log('[HomeScreen] Update result:', result);
    } catch (error) {
      console.error('[HomeScreen] Error toggling vow:', error);
      console.error('[HomeScreen] Error type:', typeof error);
      console.error('[HomeScreen] Error details:', JSON.stringify(error, null, 2));
      
      let errorMessage = 'Failed to update vow selection';
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as any).message;
        console.error('[HomeScreen] Error message:', errorMessage);
      }
      
      Alert.alert(
        'Error',
        `${errorMessage}\n\nPlease run the SQL migration from APPLY_THIS_MIGRATION.sql in your Supabase SQL Editor.`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveVow = async (vowType: string) => {
    const newVows = selectedVows.filter(v => v !== vowType);
    
    if (activeVow === vowType) {
      setActiveVow(newVows.length > 0 ? newVows[0] : null);
    }
    
    console.log('Removing vow:', vowType, 'New vows:', newVows);
    
    try {
      await updateProfile({ selected_vow_types: newVows });
      console.log('Successfully removed vow:', vowType);
    } catch (error) {
      console.error('Error removing vow:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      if (error && typeof error === 'object' && 'message' in error) {
        console.error('Error message:', (error as any).message);
      }
    }
  };

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
