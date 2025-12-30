import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { User as UserIcon, Globe, Clock, Lock, Bell, BookOpen, Check, Shield, LogOut } from 'lucide-react';
import { AppSettings, VowType } from '../App';
import { Language, t } from '../data/translations';
import { timezones, getTimezoneLabel } from '../data/timezones';
import { Alert, AlertDescription } from './ui/alert';
import { SettingsCard } from './ui/settings-card';
import { PasswordInput } from './ui/password-input';
import { useIsMobile } from '../hooks/use-mobile';
interface SettingsProps {
  username: string;
  currentVow: VowType;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onUpdatePassword: (oldPassword: string, newPassword: string) => boolean | Promise<boolean>;
  onChangeVow: () => void;
  onOpenAdmin: () => void;
  onLogout?: () => void;
  userRole?: 'user' | 'admin' | 'owner';
  selectedVowsCount?: number;
}

export function Settings({
  username,
  currentVow,
  settings,
  onUpdateSettings,
  onUpdatePassword,
  onChangeVow,
  onOpenAdmin,
  onLogout,
  userRole = 'user',
  selectedVowsCount = 1
}: SettingsProps) {
  const isMobile = useIsMobile();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: t('passwordMismatch', settings.language) });
      return;
    }

    const success = await onUpdatePassword(oldPassword, newPassword);
    if (success) {
      setPasswordMessage({ type: 'success', text: t('passwordChanged', settings.language) });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordMessage({ type: 'error', text: t('incorrectPassword', settings.language) });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SettingsCard
        icon={UserIcon}
        title={t('personalInfo', settings.language)}
        description={t('currentUser', settings.language)}
      >
        <div className="space-y-6">
          <div className="card-surface">
            <Label className="text-vow-text-secondary text-sm">{t('username', settings.language)}</Label>
            <p className="text-xl text-vow-text-primary mt-1">{username}</p>
          </div>

          <Separator className="bg-vow-primary-darker/10" />

          <form onSubmit={handlePasswordUpdate} className="space-y-5">
            <h3 className="text-lg text-vow-text-primary">{t('changePassword', settings.language)}</h3>

            {passwordMessage && (
              <Alert className={`rounded-2xl ${
                passwordMessage.type === 'success'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <Check className={`w-4 h-4 ${
                  passwordMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`} />
                <AlertDescription className={`${
                  passwordMessage.type === 'success' ? 'text-green-800' : 'text-red-800'
                } text-sm`}>
                  {passwordMessage.text}
                </AlertDescription>
              </Alert>
            )}

            <PasswordInput
              id="oldPassword"
              label={t('oldPassword', settings.language)}
              value={oldPassword}
              onChange={setOldPassword}
              required
            />

            <PasswordInput
              id="newPassword"
              label={t('newPassword', settings.language)}
              value={newPassword}
              onChange={setNewPassword}
              required
            />

            <PasswordInput
              id="confirmPassword"
              label={t('confirmPassword', settings.language)}
              value={confirmPassword}
              onChange={setConfirmPassword}
              required
            />

            <Button type="submit" className="btn-primary w-full">
              <Lock className="w-4 h-4 mr-2" />
              {t('updatePassword', settings.language)}
            </Button>
          </form>
        </div>
      </SettingsCard>

      <SettingsCard
        icon={Globe}
        iconVariant="secondary"
        title={t('languageSettings', settings.language)}
        description={t('selectLanguage', settings.language)}
      >
        <Select value={settings.language} onValueChange={(lang: Language) => onUpdateSettings({ ...settings, language: lang })}>
          <SelectTrigger className="select-trigger">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="select-content">
            <SelectItem value="ru" className="rounded-xl">
              🇷🇺 Русский
            </SelectItem>
            <SelectItem value="en" className="rounded-xl">
              🇬🇧 English
            </SelectItem>
          </SelectContent>
        </Select>
      </SettingsCard>

      <SettingsCard
        icon={Clock}
        iconVariant="kept"
        title={t('timezoneSettings', settings.language)}
        description={t('selectTimezone', settings.language)}
      >
        <Select value={settings.timezone} onValueChange={(tz) => onUpdateSettings({ ...settings, timezone: tz })}>
          <SelectTrigger className="select-trigger">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="select-content max-h-80">
            {timezones.map((tz) => (
              <SelectItem key={tz.value} value={tz.value} className="rounded-xl">
                {getTimezoneLabel(tz, settings.language)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SettingsCard>

      <SettingsCard
        icon={BookOpen}
        iconVariant="primary"
        title={t('vowSettings', settings.language)}
        description={t('currentVow', settings.language)}
      >
        <div className="space-y-4">
          <div className="card-surface">
            <p className="text-vow-text-primary text-lg">{t(currentVow, settings.language)}</p>
            <p className="text-sm text-vow-text-secondary mt-1">{t(`${currentVow}-desc`, settings.language)}</p>
          </div>
          <Button
            onClick={onChangeVow}
            variant="outline"
            className="w-full h-12 border-vow-primary-darker/30 hover:bg-vow-primary-darker/10 rounded-2xl"
          >
            {t('changeVowButton', settings.language)}
          </Button>
        </div>
      </SettingsCard>

      <SettingsCard
        icon={Bell}
        iconVariant="antidote"
        title={t('notifications', settings.language)}
        description={
          settings.notificationsEnabled 
            ? `${t('notificationTimes', settings.language)} - ${t(settings.notificationInterval === 2 ? 'every2Hours' : 'every3Hours', settings.language)}`
            : t('notificationTimes', settings.language)
        }
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-gradient-to-r from-vow-antidote/10 to-transparent p-5 rounded-2xl">
            <div>
              <Label htmlFor="notifications" className="text-vow-text-primary">
                {t('enableNotifications', settings.language)}
              </Label>
              <p className="text-sm text-vow-text-secondary mt-1">
                {t('notificationDescription', settings.language)}
              </p>
            </div>
            <Switch
              id="notifications"
              checked={settings.notificationsEnabled}
              onCheckedChange={(enabled) => onUpdateSettings({ ...settings, notificationsEnabled: enabled })}
              className="data-[state=checked]:bg-vow-primary"
            />
          </div>

          {settings.notificationsEnabled && (
            <div className="space-y-3">
              <Label className="text-vow-text-primary">{t('notificationInterval', settings.language)}</Label>
              <Select 
                value={String(settings.notificationInterval)} 
                onValueChange={(value) => onUpdateSettings({ ...settings, notificationInterval: parseInt(value) as 2 | 3 })}
              >
                <SelectTrigger className="select-trigger">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="select-content">
                  <SelectItem value="2" className="rounded-xl">
                    ⏰ {t('every2Hours', settings.language)}
                  </SelectItem>
                  <SelectItem value="3" className="rounded-xl">
                    ⏰ {t('every3Hours', settings.language)}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </SettingsCard>

      {(userRole === 'admin' || userRole === 'owner') && (
        <SettingsCard
          icon={Shield}
          iconVariant="admin"
          title={t('adminAccess', settings.language)}
          description={t('adminDescription', settings.language)}
        >
          <Button
            onClick={onOpenAdmin}
            variant="outline"
            className="w-full h-12 border-vow-primary-darker/30 hover:bg-vow-primary-darker/10 rounded-2xl"
          >
            {t('openAdminPanel', settings.language)}
          </Button>
        </SettingsCard>
      )}

      {/* Logout button - only show on mobile */}
      {isMobile && onLogout && (
        <div className="pt-4">
          <Button
            variant="outline"
            onClick={onLogout}
            className="w-full h-12 rounded-2xl border-vow-primary-darker/30 hover:bg-vow-primary-darker/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t('logout', settings.language)}
          </Button>
        </div>
      )}
    </div>
  );
}
