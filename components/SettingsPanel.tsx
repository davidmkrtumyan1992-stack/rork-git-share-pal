import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMutation } from '@tanstack/react-query';
import {
  Globe,
  Bell,
  LogOut,
  ChevronRight,
  User,
  Clock,
  Eye,
  EyeOff,
  Check,
  BookOpen,
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { getTranslation } from '@/data/translations';
import { darkTheme } from '@/constants/theme';
import { Language } from '@/types/database';
import { useUnlockedVows } from '@/hooks/useUnlockedVows';

interface SettingsPanelProps {
  onSelectVow?: () => void;
}

const LANGUAGES = [
  { label: 'Русский', value: 'ru' as const },
  { label: 'English', value: 'en' as const },
  { label: 'Italiano', value: 'it' as const },
  { label: 'Français', value: 'fr' as const },
  { label: 'Deutsch', value: 'de' as const },
  { label: 'Español', value: 'es' as const },
  { label: '中文', value: 'zh' as const },
  { label: 'Հայերեն', value: 'hy' as const },
];

const TIMEZONES = [
  { label: 'UTC-12:00 — Бейкер, Хауленд', value: 'Pacific/Kwajalein' },
  { label: 'UTC-11:00 — Мидуэй, Самоа', value: 'Pacific/Midway' },
  { label: 'UTC-10:00 — Гонолулу, Гавайи', value: 'Pacific/Honolulu' },
  { label: 'UTC-09:00 — Анкоридж, Аляска', value: 'America/Anchorage' },
  { label: 'UTC-08:00 — Лос-Анджелес, Сиэтл', value: 'America/Los_Angeles' },
  { label: 'UTC-07:00 — Денвер, Финикс', value: 'America/Denver' },
  { label: 'UTC-06:00 — Чикаго, Мехико', value: 'America/Chicago' },
  { label: 'UTC-05:00 — Нью-Йорк, Торонто', value: 'America/New_York' },
  { label: 'UTC-04:00 — Каракас, Сантьяго', value: 'America/Caracas' },
  { label: 'UTC-03:00 — Сан-Паулу, Буэнос-Айрес', value: 'America/Sao_Paulo' },
  { label: 'UTC-02:00 — Южная Георгия', value: 'Atlantic/South_Georgia' },
  { label: 'UTC-01:00 — Азорские острова', value: 'Atlantic/Azores' },
  { label: 'UTC+00:00 — Лондон, Лиссабон', value: 'Europe/London' },
  { label: 'UTC+01:00 — Париж, Берлин', value: 'Europe/Paris' },
  { label: 'UTC+02:00 — Афины, Киев', value: 'Europe/Athens' },
  { label: 'UTC+03:00 — Москва, Санкт-Петербург', value: 'Europe/Moscow' },
  { label: 'UTC+04:00 — Дубай, Баку', value: 'Asia/Dubai' },
  { label: 'UTC+05:00 — Карачи, Ташкент', value: 'Asia/Karachi' },
  { label: 'UTC+06:00 — Дакка, Алматы', value: 'Asia/Dhaka' },
  { label: 'UTC+07:00 — Бангкок, Джакарта', value: 'Asia/Bangkok' },
  { label: 'UTC+08:00 — Сингапур, Пекин', value: 'Asia/Singapore' },
  { label: 'UTC+09:00 — Токио, Сеул', value: 'Asia/Tokyo' },
  { label: 'UTC+10:00 — Сидней, Владивосток', value: 'Australia/Sydney' },
  { label: 'UTC+11:00 — Магадан, Нумеа', value: 'Pacific/Noumea' },
  { label: 'UTC+12:00 — Окленд, Камчатка', value: 'Pacific/Auckland' },
];

const VOW_TYPES = [
  { key: 'tenPrinciples', labelKey: 'tenPrinciples', descKey: 'tenPrinciplesDesc', defaultLocked: false },
  { key: 'freedom', labelKey: 'freedom', descKey: 'freedomDesc', defaultLocked: false },
  { key: 'bodhisattva', labelKey: 'bodhisattva', descKey: 'bodhisattvaDesc', defaultLocked: false },
  { key: 'pratimoksha', labelKey: 'pratimoksha', descKey: 'pratimokshaDesc', defaultLocked: true },
  { key: 'tantric', labelKey: 'tantric', descKey: 'tantricDesc', defaultLocked: true },
  { key: 'nuns', labelKey: 'nuns', descKey: 'nunsDesc', defaultLocked: true },
  { key: 'monks', labelKey: 'monks', descKey: 'monksDesc', defaultLocked: true },
];

export function SettingsPanel({ onSelectVow }: SettingsPanelProps) {
  const { profile, language, signOut, setLanguage, updateProfile } = useAuth();
  const t = getTranslation(language);
  const { isVowLocked, isLoading: isLoadingUnlockedVows } = useUnlockedVows();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTimezoneList, setShowTimezoneList] = useState(false);
  const [showLanguageList, setShowLanguageList] = useState(false);
  const [notificationInterval, setNotificationInterval] = useState(2);

  const selectedVowTypes = (() => {
    try {
      return Array.isArray(profile?.selected_vow_types) 
        ? profile.selected_vow_types 
        : [];
    } catch (e) {
      console.log('Error accessing selected_vow_types:', e);
      return [];
    }
  })();

  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      console.log('Sign out successful');
    },
  });

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setShowLanguageList(false);
  };

  const handleNotificationsToggle = (value: boolean) => {
    updateProfile({ notifications_enabled: value });
  };

  const updatePasswordMutation = useMutation({
    mutationFn: async () => {
      if (newPassword !== confirmPassword) {
        throw new Error(t.settings.passwordMismatch);
      }
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
    },
    onSuccess: () => {
      Alert.alert(t.common.success, t.settings.passwordUpdated);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
    onError: (error: Error) => {
      Alert.alert(t.common.error, error.message);
    },
  });

  const handleUpdatePassword = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert(t.common.error, t.auth.fillAllFields);
      return;
    }
    updatePasswordMutation.mutate();
  };

  const handleTimezoneChange = (timezone: string) => {
    updateProfile({ notification_timezone: timezone });
    setShowTimezoneList(false);
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

  const toggleVowType = async (vowKey: string) => {
    console.log('[SettingsPanel] toggleVowType called');
    console.log('[SettingsPanel] Vow key:', vowKey);
    console.log('[SettingsPanel] Current selectedVowTypes:', selectedVowTypes);
    
    const vowType = VOW_TYPES.find(v => v.key === vowKey);
    const isLocked = vowType?.defaultLocked && isVowLocked(vowKey);
    console.log('[SettingsPanel] Is locked:', isLocked);
    
    if (isLocked) {
      console.log('[SettingsPanel] Showing locked alert');
      Alert.alert(
        t.vows.lockedTitle,
        `${t.vows.lockedDesc}\nsupport@keepmyvow.com`
      );
      return;
    }

    const newSelection = selectedVowTypes.includes(vowKey)
      ? selectedVowTypes.filter(k => k !== vowKey)
      : [...selectedVowTypes, vowKey];
    
    console.log('[SettingsPanel] New selection:', newSelection);
    console.log('[SettingsPanel] Calling updateProfile');
    
    try {
      const result = await updateProfile({ selected_vow_types: newSelection });
      console.log('[SettingsPanel] updateProfile successful');
      console.log('[SettingsPanel] Result:', result);
    } catch (error) {
      console.error('[SettingsPanel] Error updating selected_vow_types:', error);
      console.error('[SettingsPanel] Error details:', JSON.stringify(error, null, 2));
      
      let errorMessage = t.common.error;
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as any).message;
      }
      
      Alert.alert(
        t.common.error,
        `${errorMessage}\n\nPlease run the SQL migration from APPLY_THIS_MIGRATION.sql`,
        [{ text: t.common.cancel }]
      );
    }
  };

  const getInitials = () => {
    const name = profile?.username || profile?.full_name || 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <User size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.cardTitle}>{t.settings.personalData}</Text>
        </View>
        
        <View style={styles.profileInfoCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitials}>{getInitials()}</Text>
              </View>
            </View>
            <View style={styles.profileTextContainer}>
              <Text style={styles.userName} numberOfLines={1}>
                {profile?.username || 'User'}
              </Text>
              {profile?.full_name && (
                <Text style={styles.userFullName} numberOfLines={1}>{profile.full_name}</Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.passwordSection}>
          <Text style={styles.subsectionTitle}>{t.settings.changePassword}</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t.settings.oldPassword}</Text>
            <View style={styles.passwordInput}>
              <TextInput
                style={styles.input}
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry={!showOldPassword}
                placeholder={t.settings.oldPassword}
                placeholderTextColor={darkTheme.colors.textMuted}
              />
              <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)}>
                {showOldPassword ? (
                  <EyeOff size={20} color={darkTheme.colors.textMuted} />
                ) : (
                  <Eye size={20} color={darkTheme.colors.textMuted} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t.settings.newPassword}</Text>
            <View style={styles.passwordInput}>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                placeholder={t.settings.newPassword}
                placeholderTextColor={darkTheme.colors.textMuted}
              />
              <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                {showNewPassword ? (
                  <EyeOff size={20} color={darkTheme.colors.textMuted} />
                ) : (
                  <Eye size={20} color={darkTheme.colors.textMuted} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t.settings.confirmPassword}</Text>
            <View style={styles.passwordInput}>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                placeholder={t.settings.confirmPassword}
                placeholderTextColor={darkTheme.colors.textMuted}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? (
                  <EyeOff size={20} color={darkTheme.colors.textMuted} />
                ) : (
                  <Eye size={20} color={darkTheme.colors.textMuted} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdatePassword}
            disabled={updatePasswordMutation.isPending}
          >
            <LinearGradient
              colors={[darkTheme.colors.primary, darkTheme.colors.primaryDark]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.updateButtonText}>{t.settings.updatePassword}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: darkTheme.colors.accent }]}>
            <BookOpen size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.cardTitle}>{t.settings.selectVowTypes}</Text>
        </View>

        <View style={styles.vowTypesDescription}>
          <Text style={styles.vowTypesDescText}>{t.settings.vowTypesDesc}</Text>
        </View>

        {VOW_TYPES.map((vowType) => {
          const isSelected = selectedVowTypes.includes(vowType.key);
          const isLocked = vowType.defaultLocked && isVowLocked(vowType.key);
          const vowLabel = t.vows[vowType.labelKey as keyof typeof t.vows] || vowType.labelKey;
          const vowDesc = t.vows[vowType.descKey as keyof typeof t.vows] || vowType.descKey;
          
          return (
            <TouchableOpacity
              key={vowType.key}
              style={[
                styles.vowTypeItem,
                isSelected && styles.vowTypeItemSelected,
                isLocked && styles.vowTypeItemLocked,
              ]}
              onPress={() => {
                console.log('[SettingsPanel] TouchableOpacity pressed:', vowType.key);
                toggleVowType(vowType.key);
              }}
              activeOpacity={0.7}
              disabled={isLoadingUnlockedVows}
              testID={`settings-vow-${vowType.key}`}
            >
              <View style={styles.vowTypeContent}>
                <Text style={[
                  styles.vowTypeLabel,
                  isSelected && styles.vowTypeLabelSelected,
                  isLocked && styles.vowTypeLabelLocked,
                ]}>
                  {vowLabel}
                </Text>
                <Text style={[
                  styles.vowTypeDesc,
                  isLocked && styles.vowTypeDescLocked,
                ]} numberOfLines={2}>
                  {vowDesc}
                </Text>
              </View>
              <View style={[
                styles.vowTypeCheckbox,
                isSelected && styles.vowTypeCheckboxSelected,
                isLocked && styles.vowTypeCheckboxLocked,
              ]}>
                {isSelected && !isLocked && <Check size={16} color="#FFFFFF" />}
                {isLocked && (
                  <Text style={styles.lockIcon}>🔒</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: darkTheme.colors.primaryLight }]}>
            <Globe size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.cardTitle}>{t.settings.localization}</Text>
        </View>

        <TouchableOpacity 
          style={styles.settingRowVertical} 
          onPress={() => setShowLanguageList(!showLanguageList)}
        >
          <View style={styles.settingRowHeader}>
            <View style={styles.settingLeft}>
              <Globe size={18} color={darkTheme.colors.primary} />
              <Text style={styles.settingLabel}>{t.common.language}</Text>
            </View>
            <ChevronRight size={16} color={darkTheme.colors.textMuted} />
          </View>
          <Text style={styles.settingValueTimezone} numberOfLines={1}>
            {LANGUAGES.find(l => l.value === language)?.label || 'Русский'}
          </Text>
        </TouchableOpacity>

        {showLanguageList && (
          <View style={styles.languageList}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.value}
                style={styles.languageItem}
                onPress={() => handleLanguageChange(lang.value)}
              >
                <Text style={[
                  styles.languageText,
                  lang.value === language && styles.languageTextActive
                ]}>
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity 
          style={styles.settingRowVertical} 
          onPress={() => setShowTimezoneList(!showTimezoneList)}
        >
          <View style={styles.settingRowHeader}>
            <View style={styles.settingLeft}>
              <Clock size={18} color={darkTheme.colors.primary} />
              <Text style={styles.settingLabel}>{t.settings.timezone}</Text>
            </View>
            <ChevronRight size={16} color={darkTheme.colors.textMuted} />
          </View>
          <Text style={styles.settingValueTimezone} numberOfLines={1}>
            {TIMEZONES.find(tz => tz.value === profile?.notification_timezone)?.label || 'UTC+03:00 — Москва, Санкт-Петербург'}
          </Text>
        </TouchableOpacity>

        {showTimezoneList && (
          <ScrollView style={styles.timezoneList} nestedScrollEnabled>
            {TIMEZONES.map((tz) => (
              <TouchableOpacity
                key={tz.value}
                style={styles.timezoneItem}
                onPress={() => handleTimezoneChange(tz.value)}
              >
                <Text style={[
                  styles.timezoneText,
                  tz.value === profile?.notification_timezone && styles.timezoneTextActive
                ]}>
                  {tz.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: darkTheme.colors.warning }]}>
            <Bell size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.cardTitle}>{t.settings.notificationSettings}</Text>
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabelFlex}>{t.common.notifications}</Text>
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

        {profile?.notifications_enabled && (
          <View style={styles.intervalSection}>
            <Text style={styles.subsectionTitle}>{t.settings.notificationInterval}</Text>
            <View style={styles.intervalButtons}>
              <TouchableOpacity
                style={[
                  styles.intervalButton,
                  notificationInterval === 2 && styles.intervalButtonActive
                ]}
                onPress={() => setNotificationInterval(2)}
              >
                <Text style={[
                  styles.intervalButtonText,
                  notificationInterval === 2 && styles.intervalButtonTextActive
                ]}>
                  2 {t.settings.hours}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.intervalButton,
                  notificationInterval === 3 && styles.intervalButtonActive
                ]}
                onPress={() => setNotificationInterval(3)}
              >
                <Text style={[
                  styles.intervalButtonText,
                  notificationInterval === 3 && styles.intervalButtonTextActive
                ]}>
                  3 {t.settings.hours}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleSignOut}
      >
        <LogOut size={20} color={darkTheme.colors.error} />
        <Text style={styles.logoutButtonText}>
          {t.auth.logout}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: darkTheme.spacing.md,
    paddingVertical: darkTheme.spacing.md,
    paddingHorizontal: darkTheme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.colors.border,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: darkTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: darkTheme.fontSize.md,
    fontWeight: darkTheme.fontWeight.semibold,
    color: darkTheme.colors.text,
    flex: 1,
  },
  profileInfoCard: {
    paddingHorizontal: darkTheme.spacing.lg,
    paddingVertical: darkTheme.spacing.md,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: darkTheme.spacing.md,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: darkTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 24,
    fontWeight: darkTheme.fontWeight.bold,
    color: '#FFFFFF',
  },
  profileTextContainer: {
    flex: 1,
  },
  userName: {
    fontSize: darkTheme.fontSize.lg,
    fontWeight: darkTheme.fontWeight.semibold,
    color: darkTheme.colors.text,
  },
  userFullName: {
    fontSize: darkTheme.fontSize.sm,
    color: darkTheme.colors.textSecondary,
    marginTop: 2,
  },
  passwordSection: {
    paddingVertical: darkTheme.spacing.md,
    paddingHorizontal: darkTheme.spacing.lg,
  },
  subsectionTitle: {
    fontSize: darkTheme.fontSize.sm,
    fontWeight: darkTheme.fontWeight.semibold,
    color: darkTheme.colors.textMuted,
    marginBottom: darkTheme.spacing.md,
  },
  inputGroup: {
    marginBottom: darkTheme.spacing.md,
  },
  inputLabel: {
    fontSize: darkTheme.fontSize.sm,
    color: darkTheme.colors.textSecondary,
    marginBottom: darkTheme.spacing.xs,
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkTheme.colors.surface,
    borderRadius: darkTheme.borderRadius.md,
    paddingHorizontal: darkTheme.spacing.md,
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
  },
  input: {
    flex: 1,
    paddingVertical: darkTheme.spacing.md,
    color: darkTheme.colors.text,
    fontSize: darkTheme.fontSize.md,
  },
  updateButton: {
    marginTop: darkTheme.spacing.md,
    borderRadius: darkTheme.borderRadius.md,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: darkTheme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: darkTheme.fontSize.md,
    fontWeight: darkTheme.fontWeight.semibold,
  },
  vowTypesDescription: {
    paddingHorizontal: darkTheme.spacing.lg,
    paddingVertical: darkTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.colors.border,
  },
  vowTypesDescText: {
    fontSize: darkTheme.fontSize.sm,
    color: darkTheme.colors.textSecondary,
  },
  vowTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: darkTheme.spacing.md,
    paddingHorizontal: darkTheme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.colors.border,
  },
  vowTypeItemSelected: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  vowTypeItemLocked: {
    opacity: 0.6,
  },
  vowTypeContent: {
    flex: 1,
    marginRight: darkTheme.spacing.md,
  },
  vowTypeLabel: {
    fontSize: darkTheme.fontSize.md,
    fontWeight: darkTheme.fontWeight.medium,
    color: darkTheme.colors.text,
    marginBottom: 2,
  },
  vowTypeLabelSelected: {
    color: darkTheme.colors.primary,
  },
  vowTypeLabelLocked: {
    color: darkTheme.colors.textMuted,
  },
  vowTypeDesc: {
    fontSize: darkTheme.fontSize.xs,
    color: darkTheme.colors.textSecondary,
    lineHeight: 16,
  },
  vowTypeDescLocked: {
    color: darkTheme.colors.textMuted,
  },
  vowTypeCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: darkTheme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  vowTypeCheckboxSelected: {
    backgroundColor: darkTheme.colors.primary,
    borderColor: darkTheme.colors.primary,
  },
  vowTypeCheckboxLocked: {
    borderColor: darkTheme.colors.textMuted,
  },
  lockIcon: {
    fontSize: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: darkTheme.spacing.md,
    paddingHorizontal: darkTheme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: darkTheme.colors.border,
    minHeight: 52,
  },
  settingRowVertical: {
    paddingVertical: darkTheme.spacing.md,
    paddingHorizontal: darkTheme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: darkTheme.colors.border,
  },
  settingRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: darkTheme.spacing.sm,
    flexShrink: 1,
  },
  settingLabel: {
    fontSize: darkTheme.fontSize.md,
    color: darkTheme.colors.text,
    flexShrink: 1,
  },
  settingLabelFlex: {
    fontSize: darkTheme.fontSize.md,
    color: darkTheme.colors.text,
    flex: 1,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: darkTheme.spacing.xs,
    flexShrink: 0,
    marginLeft: darkTheme.spacing.sm,
  },
  settingValue: {
    fontSize: darkTheme.fontSize.sm,
    color: darkTheme.colors.textSecondary,
  },
  settingValueTimezone: {
    fontSize: darkTheme.fontSize.sm,
    color: darkTheme.colors.textSecondary,
    marginTop: darkTheme.spacing.xs,
    paddingLeft: 26,
  },
  timezoneList: {
    maxHeight: 320,
    backgroundColor: darkTheme.colors.backgroundTertiary,
    borderTopWidth: 1,
    borderTopColor: darkTheme.colors.border,
  },
  timezoneItem: {
    paddingVertical: darkTheme.spacing.md,
    paddingHorizontal: darkTheme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.colors.border,
  },
  timezoneText: {
    fontSize: darkTheme.fontSize.sm,
    color: darkTheme.colors.text,
    lineHeight: 20,
  },
  timezoneTextActive: {
    color: darkTheme.colors.primary,
    fontWeight: darkTheme.fontWeight.semibold,
  },
  languageList: {
    backgroundColor: darkTheme.colors.backgroundTertiary,
    borderTopWidth: 1,
    borderTopColor: darkTheme.colors.border,
  },
  languageItem: {
    paddingVertical: darkTheme.spacing.md,
    paddingHorizontal: darkTheme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.colors.border,
  },
  languageText: {
    fontSize: darkTheme.fontSize.md,
    color: darkTheme.colors.text,
    lineHeight: 20,
  },
  languageTextActive: {
    color: darkTheme.colors.primary,
    fontWeight: darkTheme.fontWeight.semibold,
  },
  intervalSection: {
    paddingVertical: darkTheme.spacing.md,
    paddingHorizontal: darkTheme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: darkTheme.colors.border,
  },
  intervalButtons: {
    flexDirection: 'row',
    gap: darkTheme.spacing.md,
  },
  intervalButton: {
    flex: 1,
    paddingVertical: darkTheme.spacing.sm,
    borderRadius: darkTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
    alignItems: 'center',
    backgroundColor: darkTheme.colors.surface,
  },
  intervalButtonActive: {
    backgroundColor: darkTheme.colors.primary,
    borderColor: darkTheme.colors.primary,
  },
  intervalButtonText: {
    fontSize: darkTheme.fontSize.sm,
    color: darkTheme.colors.text,
  },
  intervalButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: darkTheme.fontWeight.semibold,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: darkTheme.spacing.sm,
    padding: darkTheme.spacing.md,
    borderRadius: darkTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: darkTheme.colors.error,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  logoutButtonText: {
    fontSize: darkTheme.fontSize.md,
    color: darkTheme.colors.error,
    fontWeight: darkTheme.fontWeight.medium,
  },
});
