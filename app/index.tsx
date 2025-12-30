import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/LoginForm';
import { Dashboard } from '@/components/Dashboard';
import { VowSelection } from '@/components/VowSelection';
import { AdminPanel } from '@/components/AdminPanel';
import { SettingsPanel } from '@/components/SettingsPanel';
import { darkTheme } from '@/constants/theme';

type Screen = 'dashboard' | 'vowSelection' | 'settings' | 'admin';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user, profile, isLoading, updateProfile } = useAuth();
  
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [selectedVow, setSelectedVow] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.selected_vow) {
      setSelectedVow(profile.selected_vow);
    }
  }, [profile?.selected_vow]);

  const handleVowSelect = async (vowType: string) => {
    console.log('Vow selected:', vowType);
    setSelectedVow(vowType);
    await updateProfile({ selected_vow: vowType });
    setCurrentScreen('dashboard');
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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      
      {currentScreen === 'dashboard' && (
        <View style={styles.screenContainer}>
          <Dashboard
            selectedVow={selectedVow}
            onSelectVow={() => setCurrentScreen('vowSelection')}
            onOpenSettings={() => setCurrentScreen('settings')}
            onOpenAdmin={() => setCurrentScreen('admin')}
          />
        </View>
      )}

      <Modal
        visible={currentScreen === 'vowSelection'}
        animationType="slide"
        onRequestClose={() => setCurrentScreen('dashboard')}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <VowSelection
            selectedVow={selectedVow}
            onSelect={handleVowSelect}
          />
        </View>
      </Modal>

      <Modal
        visible={currentScreen === 'settings'}
        animationType="slide"
        onRequestClose={() => setCurrentScreen('dashboard')}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <SettingsPanel onClose={() => setCurrentScreen('dashboard')} />
        </View>
      </Modal>

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
    paddingHorizontal: darkTheme.spacing.md,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: darkTheme.colors.background,
    paddingHorizontal: darkTheme.spacing.md,
  },
});
