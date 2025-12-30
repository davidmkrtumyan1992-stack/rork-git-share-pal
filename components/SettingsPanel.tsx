import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useMutation } from '@tanstack/react-query';
import {
  ArrowLeft,
  Globe,
  Bell,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { getTranslation } from '@/data/translations';
import { darkTheme } from '@/constants/theme';
import { Language } from '@/types/database';

interface SettingsPanelProps {
  onClose: () => void;
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { profile, language, signOut, setLanguage, updateProfile } = useAuth();
  const t = getTranslation(language);

  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      console.log('Sign out successful');
    },
  });

  const handleLanguageChange = async () => {
    const newLang: Language = language === 'ru' ? 'en' : 'ru';
    await setLanguage(newLang);
  };

  const handleNotificationsToggle = async (value: boolean) => {
    await updateProfile({ notifications_enabled: value });
  };

  const handleSignOut = () => {
    Alert.alert(
      t.auth.logout,
      '',
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.auth.logout,
          style: 'destructive',
          onPress: () => signOutMutation.mutate(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <ArrowLeft size={24} color={darkTheme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{t.common.settings}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile?.username?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {profile?.username || 'User'}
            </Text>
            {profile?.full_name && (
              <Text style={styles.profileFullName}>{profile.full_name}</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.common.profile}</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleLanguageChange}>
            <View style={styles.settingLeft}>
              <Globe size={20} color={darkTheme.colors.primary} />
              <Text style={styles.settingLabel}>{t.common.language}</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>
                {language === 'ru' ? 'Русский' : 'English'}
              </Text>
              <ChevronRight size={20} color={darkTheme.colors.textMuted} />
            </View>
          </TouchableOpacity>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={20} color={darkTheme.colors.warning} />
              <Text style={styles.settingLabel}>{t.common.notifications}</Text>
            </View>
            <Switch
              value={profile?.notifications_enabled || false}
              onValueChange={handleNotificationsToggle}
              trackColor={{
                false: darkTheme.colors.backgroundTertiary,
                true: darkTheme.colors.primary + '80',
              }}
              thumbColor={
                profile?.notifications_enabled
                  ? darkTheme.colors.primary
                  : darkTheme.colors.textMuted
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.settingItem, styles.logoutItem]}
            onPress={handleSignOut}
          >
            <View style={styles.settingLeft}>
              <LogOut size={20} color={darkTheme.colors.error} />
              <Text style={[styles.settingLabel, styles.logoutLabel]}>
                {t.auth.logout}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: darkTheme.spacing.md,
    paddingVertical: darkTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: darkTheme.fontSize.xl,
    fontWeight: darkTheme.fontWeight.bold,
    color: darkTheme.colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: darkTheme.spacing.md,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkTheme.colors.surface,
    borderRadius: darkTheme.borderRadius.lg,
    padding: darkTheme.spacing.lg,
    marginBottom: darkTheme.spacing.lg,
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: darkTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: darkTheme.spacing.md,
  },
  avatarText: {
    fontSize: darkTheme.fontSize.xxl,
    fontWeight: darkTheme.fontWeight.bold,
    color: darkTheme.colors.text,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: darkTheme.fontSize.lg,
    fontWeight: darkTheme.fontWeight.semibold,
    color: darkTheme.colors.text,
  },
  profileFullName: {
    fontSize: darkTheme.fontSize.sm,
    color: darkTheme.colors.textSecondary,
    marginTop: 2,
  },
  section: {
    backgroundColor: darkTheme.colors.surface,
    borderRadius: darkTheme.borderRadius.lg,
    marginBottom: darkTheme.spacing.lg,
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: darkTheme.fontSize.sm,
    fontWeight: darkTheme.fontWeight.semibold,
    color: darkTheme.colors.textMuted,
    textTransform: 'uppercase',
    paddingHorizontal: darkTheme.spacing.md,
    paddingTop: darkTheme.spacing.md,
    paddingBottom: darkTheme.spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: darkTheme.spacing.md,
    paddingHorizontal: darkTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: darkTheme.colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: darkTheme.spacing.md,
  },
  settingLabel: {
    fontSize: darkTheme.fontSize.md,
    color: darkTheme.colors.text,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: darkTheme.spacing.xs,
  },
  settingValue: {
    fontSize: darkTheme.fontSize.sm,
    color: darkTheme.colors.textSecondary,
  },
  logoutItem: {
    borderTopWidth: 0,
  },
  logoutLabel: {
    color: darkTheme.colors.error,
  },
});
