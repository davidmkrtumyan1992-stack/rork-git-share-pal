import React from 'react';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, Alert } from 'react-native';
import { VowSelection } from '@/components/VowSelection';
import { useAuth } from '@/contexts/AuthContext';

export default function ModalScreen() {
  const { profile, updateProfile } = useAuth();

  const selectedVows = Array.isArray(profile?.selected_vow_types) 
    ? profile.selected_vow_types 
    : [];

  const handleToggleVow = async (vowType: string) => {
    console.log('[ModalScreen] handleToggleVow called for:', vowType);
    console.log('[ModalScreen] Current selectedVows:', selectedVows);
    
    const newVows = selectedVows.includes(vowType)
      ? selectedVows.filter(v => v !== vowType)
      : [...selectedVows, vowType];
    
    console.log('[ModalScreen] New vows to save:', newVows);
    
    try {
      await updateProfile({ selected_vow_types: newVows });
      console.log('[ModalScreen] Successfully toggled vow:', vowType);
    } catch (error) {
      console.error('[ModalScreen] Error toggling vow:', error);
      Alert.alert(
        'Error',
        'Failed to update vow selection. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleConfirm = async () => {
    console.log('[ModalScreen] Confirming selection with vows:', selectedVows);
    if (selectedVows.length === 0) {
      Alert.alert(
        'No vows selected',
        'Please select at least one vow to continue.',
        [{ text: 'OK' }]
      );
      return;
    }
    router.back();
  };

  return (
    <>
      <VowSelection
        selectedVows={selectedVows}
        onToggleVow={handleToggleVow}
        onConfirm={handleConfirm}
        onClose={() => router.back()}
        isLoading={false}
      />
      <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'auto'} />
    </>
  );
}
