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
import { darkTheme } from '@/constants/theme';

type Screen = 'dashboard' | 'vowSelection' | 'settings' | 'admin';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user, profile, isLoading, updateProfile } = useAuth();
  
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [selectedVows, setSelectedVows] = useState<string[]>([]);
  const [activeVow, setActiveVow] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile?.selected_vow) {
      const vows = profile.selected_vow.split(',').filter(Boolean);
      setSelectedVows(vows);
      if (vows.length > 0 && !activeVow) {
        setActiveVow(vows[0]);
      }
    }
  }, [profile?.selected_vow, activeVow]);

  const handleToggleVow = (vowType: string) => {
    setSelectedVows(prev => {
      if (prev.includes(vowType)) {
        return prev.filter(v => v !== vowType);
      }
      return [...prev, vowType];
    });
  };

  const handleRemoveVow = async (vowType: string) => {
    const newVows = selectedVows.filter(v => v !== vowType);
    setSelectedVows(newVows);
    if (activeVow === vowType) {
      setActiveVow(newVows.length > 0 ? newVows[0] : null);
    }
    try {
      await updateProfile({ selected_vow: newVows.join(',') });
    } catch (error) {
      console.log('Error removing vow:', error);
    }
  };

  const handleConfirmVows = async () => {
    console.log('Confirming vows:', selectedVows);
    setIsSaving(true);
    try {
      await updateProfile({ selected_vow: selectedVows.join(',') });
      if (selectedVows.length > 0 && !selectedVows.includes(activeVow || '')) {
        setActiveVow(selectedVows[0]);
      }
      setCurrentScreen('dashboard');
    } catch (error) {
      console.log('Error saving vows:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseVowSelection = () => {
    if (profile?.selected_vow) {
      const vows = profile.selected_vow.split(',').filter(Boolean);
      setSelectedVows(vows);
    }
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
            selectedVows={selectedVows}
            activeVow={activeVow}
            onSetActiveVow={setActiveVow}
            onSelectVow={() => setCurrentScreen('vowSelection')}
            onOpenAdmin={() => setCurrentScreen('admin')}
            onRemoveVow={handleRemoveVow}
          />
        </View>
      )}

      <Modal
        visible={currentScreen === 'vowSelection'}
        animationType="slide"
        onRequestClose={handleCloseVowSelection}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <VowSelection
            selectedVows={selectedVows}
            onToggleVow={handleToggleVow}
            onConfirm={handleConfirmVows}
            onClose={handleCloseVowSelection}
            isLoading={isSaving}
          />
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
  },
  modalContainer: {
    flex: 1,
    backgroundColor: darkTheme.colors.background,
    paddingHorizontal: darkTheme.spacing.md,
  },
});
