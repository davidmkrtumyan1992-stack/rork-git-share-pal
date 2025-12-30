import { useEffect, useState } from 'react';
import { Login } from './components/Login';
import { VowSelection } from './components/VowSelection';
import { Dashboard } from './components/Dashboard';
import { AdminPanel } from './components/AdminPanel';
import { Language } from './data/translations';
import { requestNotificationPermission, startNotifications, stopNotifications } from './utils/notifications';
import { toast } from 'sonner';
import { t } from './data/translations';
import { useAuth } from './hooks/useAuth';
import { useVowEntries } from './hooks/useVowEntries';
import { useSelectedVows } from './hooks/useSelectedVows';

export type VowType = '10-principles' | 'freedom' | 'bodhisattva' | 'secret' | 'nuns' | 'monks';
export type UserRole = 'user' | 'admin' | 'owner';

// Keep these interfaces for backward compatibility
export interface UserAccount {
  username: string;
  password: string;
  email: string;
  role: UserRole;
  allowedVows: VowType[];
}

export interface User {
  username: string;
  email: string;
  userId: string;
  selectedVow: VowType | null;
  role: UserRole;
  allowedVows: VowType[];
}

export interface AppSettings {
  language: Language;
  timezone: string;
  notificationsEnabled: boolean;
  notificationInterval: 2 | 3;
}

export interface VowEntry {
  id?: string;
  date: string;
  time: string;
  vowIndex: number;
  vow_type?: VowType;
  entry_date?: string;
  antidote_text?: string | null;
  note_text?: string | null;
  status: 'kept' | 'broken' | null;
  antidote?: string;
  antidoteCompleted?: boolean;
  antidotePostponed?: boolean;
  note?: string;
}

function App() {
  // Local language state for unauthenticated users
  const [localLanguage, setLocalLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ru';
  });

  const {
    user: authUser,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword: updateAuthPassword,
    updateProfile
  } = useAuth();

  const { selectedVows } = useSelectedVows(authUser?.id);

  const { 
    entries: vowEntries, 
    addEntry, 
    updateEntry, 
    deleteEntry 
  } = useVowEntries(
    authUser?.id,
    selectedVows
  );

  // Get settings from profile or use defaults (local language for unauthenticated users)
  const settings: AppSettings = {
    language: profile ? (profile.language as Language) || 'ru' : localLanguage,
    timezone: profile?.notification_timezone || 'Europe/Moscow',
    notificationsEnabled: profile?.notifications_enabled || false,
    notificationInterval: (profile?.notification_interval as 2 | 3) || 3
  };

  const formatEntryTime = (createdAt: string | null | undefined, language: Language): string => {
    if (!createdAt) return '';
    const date = new Date(createdAt);
    if (isNaN(date.getTime())) return '';

    if (language === 'ru') {
      return date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }

    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Convert database entries to app format
  const entries: VowEntry[] = vowEntries.map((entry) => ({
    id: entry.id,
    date: entry.entry_date,
    time: formatEntryTime(entry.created_at, settings.language),
    vowIndex: entry.vow_index || 0,
    vow_type: entry.vow_type,
    entry_date: entry.entry_date,
    status: entry.status === 'postponed' ? 'broken' : entry.status,
    antidote: entry.antidote_text || undefined,
    antidote_text: entry.antidote_text,
    antidoteCompleted: entry.antidote_completed || false,
    antidotePostponed: entry.status === 'postponed',
    note: entry.note_text || undefined,
    note_text: entry.note_text
  }));

  // Handle language change
  const handleLanguageChange = async (language: Language) => {
    // Always save to localStorage
    localStorage.setItem('language', language);
    setLocalLanguage(language);
    
    // Also save to profile if authenticated
    if (profile) {
      await updateProfile({ language });
    }
  };

  // Handle sign up
  const handleSignUp = async (email: string, password: string, username: string) => {
    const result = await signUp(email, password, username);
    // Sync local language to profile after signup
    if (!result.error && localLanguage) {
      setTimeout(() => updateProfile({ language: localLanguage }), 500);
    }
    return result;
  };

  // Handle sign in - accept email instead of username
  const handleSignIn = async (email: string, password: string) => {
    return await signIn(email, password);
  };

  // Handle password reset
  const handleResetPassword = async (email: string) => {
    return await resetPassword(email);
  };

  // Handle vow selection
  const handleVowSelection = async (vow: VowType | null) => {
    if (profile) {
      await updateProfile({ selected_vow: vow });
    }
  };

  // Handle logout
  const handleLogout = async () => {
    // Stop notifications before logout
    if (authUser?.id) {
      stopNotifications(authUser.id);
    }
    
    // signOut now handles everything including preventing re-auth
    await signOut();
  };

  // Save entries using Supabase
  const saveEntry = async (entry: VowEntry) => {
    if (!authUser?.id || !entry.vow_type) return;

    const today = new Date().toISOString().split('T')[0];
    
    // Create new entry with vowIndex
    await addEntry({
      vow_type: entry.vow_type,
      vow_index: entry.vowIndex,
      entry_date: today,
      status: entry.status || 'kept',
      antidote_text: entry.antidote || null,
      note_text: entry.note || null,
      postponed_count: 0
    });
  };

  // Update settings
  const updateSettings = async (newSettings: AppSettings) => {
    // If notifications are being enabled
    if (newSettings.notificationsEnabled && !settings.notificationsEnabled) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        toast.error(t('notificationPermissionRequired', newSettings.language));
        newSettings.notificationsEnabled = false;
      }
    }
    
    if (profile) {
      await updateProfile({
        language: newSettings.language,
        notification_timezone: newSettings.timezone,
        notifications_enabled: newSettings.notificationsEnabled,
        notification_interval: newSettings.notificationInterval
      });
    }
  };

  // Manage notifications based on settings and user vow
  useEffect(() => {
    if (settings.notificationsEnabled && profile?.selected_vow && authUser?.id) {
      startNotifications(
        profile.selected_vow as VowType, 
        settings.language,
        authUser.id,
        settings.notificationInterval
      );
    } else if (authUser?.id) {
      stopNotifications(authUser.id);
    }

    // Cleanup on unmount
    return () => {
      if (authUser?.id) {
        stopNotifications(authUser.id);
      }
    };
  }, [settings.notificationsEnabled, profile?.selected_vow, settings.language, settings.notificationInterval, authUser?.id]);

  // Update password
  const updatePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    // First verify old password by attempting to sign in
    if (!authUser?.email) return false;

    const { error: signInError } = await signIn(authUser.email, oldPassword);
    if (signInError) return false;

    const { error } = await updateAuthPassword(newPassword);
    return !error;
  };

  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showVowSelection, setShowVowSelection] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Mark initial load as complete after first render
  useEffect(() => {
    if (selectedVows.length > 0 && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [selectedVows, isInitialLoad]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#6B8E7F] via-[#5A7A6D] to-[#4A6B5E]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Show login if no user
  if (!authUser || !profile) {
    return (
      <Login
        onSignUp={handleSignUp}
        onSignIn={handleSignIn}
        onResetPassword={handleResetPassword}
        language={settings.language}
        onLanguageChange={handleLanguageChange}
      />
    );
  }

  // Convert profile to User format for components
  const user: User = {
    username: profile.username,
    email: authUser.email || '',
    userId: authUser.id,
    selectedVow: profile.selected_vow as VowType | null,
    role: (profile.roles?.[0] || 'user') as UserRole,
    allowedVows: ['10-principles', 'freedom', 'bodhisattva'] as VowType[] // TODO: Get from roles
  };

  // Show admin panel if requested
  if (showAdminPanel) {
    return (
      <AdminPanel
        currentUser={user}
        currentUserId={authUser.id}
        language={settings.language}
        onBack={() => setShowAdminPanel(false)}
      />
    );
  }

  // Show vow selection if no selected vows on initial load or if user wants to change vows
  if ((selectedVows.length === 0 && isInitialLoad) || showVowSelection) {
    return (
      <VowSelection
        user={user}
        onContinue={() => {
          setShowVowSelection(false);
          setIsInitialLoad(false);
        }}
        onLogout={handleLogout}
        onOpenAdmin={() => setShowAdminPanel(true)}
        language={settings.language}
        onLanguageChange={handleLanguageChange}
      />
    );
  }

  return (
    <Dashboard
      user={user}
      entries={entries}
      settings={settings}
      onSaveEntry={saveEntry}
      onUpdateEntry={updateEntry}
      onDeleteEntry={deleteEntry}
      onLogout={handleLogout}
      onChangeVow={() => setShowVowSelection(true)}
      onUpdateSettings={updateSettings}
      onUpdatePassword={updatePassword}
      onOpenAdmin={() => setShowAdminPanel(true)}
    />
  );
}

export default App;
