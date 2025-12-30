import { useMemo } from 'react';
import { User, VowEntry, AppSettings, VowType } from '../App';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { ReminderCard } from './ReminderCard';
import { History } from './History';
import { Settings } from './Settings';
import { getVowData } from '../data/vows';
import { Bell, History as HistoryIcon, LogOut, TrendingUp, Settings as SettingsIcon, Plus, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { t } from '../data/translations';
import { safeDisplay } from '../utils/sanitize';
import { useSelectedVows } from '../hooks/useSelectedVows';
import { useIsMobile } from '../hooks/use-mobile';
import { useVowCyclePosition } from '../hooks/useVowCyclePosition';

interface DashboardProps {
  user: User;
  entries: VowEntry[];
  settings: AppSettings;
  onSaveEntry: (entry: VowEntry) => void | Promise<void>;
  onUpdateEntry: (id: string, updates: Partial<any>) => Promise<any>;
  onDeleteEntry: (id: string) => Promise<any>;
  onLogout: () => void;
  onChangeVow: () => void;
  onUpdateSettings: (settings: AppSettings) => void;
  onUpdatePassword: (oldPassword: string, newPassword: string) => boolean | Promise<boolean>;
  onOpenAdmin: () => void;
}

export function Dashboard({
  user,
  entries,
  settings,
  onSaveEntry,
  onUpdateEntry,
  onDeleteEntry,
  onLogout,
  onChangeVow,
  onUpdateSettings,
  onUpdatePassword,
  onOpenAdmin
}: DashboardProps) {
  const { selectedVows, removeVow } = useSelectedVows(user.userId);
  const isMobile = useIsMobile();

  // Define vow hierarchy order (from lowest to highest)
  const vowOrder: VowType[] = ['10-principles', 'freedom', 'bodhisattva', 'monks', 'nuns', 'secret'];
  
  // Sort selected vows according to hierarchy using useMemo
  const sortedSelectedVows = useMemo(() => {
    return [...selectedVows].sort((a, b) => {
      return vowOrder.indexOf(a) - vowOrder.indexOf(b);
    });
  }, [selectedVows]);

  // Use the new cycle position hook for 6 reminders per day
  const { reminders: currentReminders } = useVowCyclePosition(user.userId, sortedSelectedVows, settings.language);

  const formatTime = (date: Date, language: string): string => {
    if (language === 'ru') {
      return date.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      });
    } else {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true
      });
    }
  };

  const handleVowUpdate = async (vowIndex: number, vowType: VowType, status: 'kept' | 'broken', antidote?: string, note?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const now = formatTime(new Date(), settings.language);

    const entry: VowEntry = {
      date: today,
      time: now,
      vowIndex,
      status,
      antidote,
      note,
      vow_type: vowType,
      entry_date: today,
      antidote_text: antidote,
      note_text: note
    };

    await onSaveEntry(entry);
  };

  const handleCompleteAntidote = async (entryDate: string, vowIndex: number) => {
    const entry = entries.find(
      e => e.date === entryDate && e.vowIndex === vowIndex && !e.antidotePostponed
    );

    if (entry && entry.id) {
      await onUpdateEntry(entry.id, { antidote_completed: true });
    }
  };

  const handlePostponeAntidote = async (entryDate: string, vowIndex: number) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    const entry = entries.find(
      e => e.date === entryDate
    );

    if (entry && entry.id) {
      // Mark current entry as postponed
      await onUpdateEntry(entry.id, { status: 'postponed' });
    }
  };

  const getTodayEntries = () => {
    const today = new Date().toISOString().split('T')[0];
    return entries.filter(e => e.date === today);
  };

  const todayEntries = getTodayEntries();
  const keptCount = todayEntries.filter(e => e.status === 'kept').length;
  const brokenCount = todayEntries.filter(e => e.status === 'broken').length;
  const pendingCount = currentReminders.length - todayEntries.length;

  // Progress card component for reuse
  const ProgressCard = () => (
    <Card className="card-base">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-vow-primary" />
          <CardTitle className="text-vow-text-primary">{t('todayProgress', settings.language)}</CardTitle>
        </div>
        <p className="text-sm text-vow-text-secondary">
          {t('progressDescription', settings.language, { count: currentReminders.length })}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-vow-kept to-vow-kept-dark rounded-2xl p-5 shadow-lg">
            <div className="text-3xl font-semibold text-white mb-1">{keptCount}</div>
            <div className="text-sm text-white/90">{t('kept', settings.language)}</div>
          </div>
          <div className="bg-gradient-to-br from-vow-broken to-vow-broken-dark rounded-2xl p-5 shadow-lg">
            <div className="text-3xl font-semibold text-white mb-1">{brokenCount}</div>
            <div className="text-sm text-white/90">{t('broken', settings.language)}</div>
          </div>
          <div className="bg-gradient-to-br from-vow-antidote to-vow-antidote-dark rounded-2xl p-5 shadow-lg">
            <div className="text-3xl font-semibold text-white mb-1">{pendingCount}</div>
            <div className="text-sm text-white/90">{t('pending', settings.language)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Logout button component for reuse
  const LogoutButton = () => (
    <Button
      variant="outline"
      onClick={onLogout}
      className="rounded-2xl border-vow-primary-darker/30 hover:bg-vow-primary-darker/10"
    >
      <LogOut className="w-4 h-4 mr-2" />
      {t('logout', settings.language)}
    </Button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-vow-bg-surface via-vow-bg-accent to-vow-bg-accent/80">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-4xl font-semibold text-vow-text-primary mb-1 md:mb-2">
              {isMobile 
                ? `${settings.language === 'ru' ? 'Привет' : 'Welcome'}, ${safeDisplay(user.username)}`
                : `${t('welcome', settings.language)}, ${safeDisplay(user.username)}`
              }
            </h1>
            {!isMobile && (
              <p className="text-vow-text-secondary text-lg">
                {sortedSelectedVows.length > 0 ? t('selectedVowsCount', settings.language, { count: sortedSelectedVows.length }) : ''}
              </p>
            )}
          </div>
          {/* Logout button - only show on desktop */}
          {!isMobile && (
            <div className="flex gap-3">
              <LogoutButton />
            </div>
          )}
        </div>

        <Tabs defaultValue="reminders" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3 bg-white/60 backdrop-blur-sm rounded-2xl p-1.5 border border-vow-primary-darker/10">
            <TabsTrigger
              value="reminders"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-vow-primary data-[state=active]:to-vow-primary-dark data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              <Bell className="w-4 h-4 mr-2" />
              {t('reminders', settings.language)}
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-vow-primary data-[state=active]:to-vow-primary-dark data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              <HistoryIcon className="w-4 h-4 mr-2" />
              {t('history', settings.language)}
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-vow-primary data-[state=active]:to-vow-primary-dark data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              <SettingsIcon className="w-4 h-4 mr-2" />
              {t('settings', settings.language)}
            </TabsTrigger>
          </TabsList>

          {/* List of Selected Vows */}
          <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-vow-primary-darker/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-vow-text-primary">
                {t('selectedVows', settings.language)}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onChangeVow}
                className="h-8 w-8 p-0 rounded-full hover:bg-vow-primary-darker/10"
              >
                <Plus className="w-4 h-4 text-vow-primary" />
              </Button>
            </div>
            <div className={`flex gap-2 ${isMobile ? 'overflow-x-auto pb-2 scrollbar-hide' : 'flex-wrap'}`}>
              {sortedSelectedVows.map((vowType) => (
                <div
                  key={vowType}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border bg-gradient-to-r from-vow-primary to-vow-primary-dark text-white border-transparent shadow-sm ${isMobile ? 'flex-shrink-0' : ''}`}
                >
                  <span className="text-sm font-medium whitespace-nowrap">
                    {t(vowType, settings.language)}
                  </span>
                  {sortedSelectedVows.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeVow(vowType);
                      }}
                      className="p-0.5 rounded-full transition-colors hover:bg-white/20"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <TabsContent value="reminders" className="mt-6 space-y-5">
            {/* Progress card - only show at top on desktop */}
            {!isMobile && <ProgressCard />}

            <div className="grid grid-cols-1 gap-4">
              {currentReminders.map((reminder, index) => {
                const vowData = getVowData(reminder.vowType, settings.language);
                return (
                  <ReminderCard
                    key={`${reminder.vowType}-${reminder.vowIndex}`}
                    vow={vowData.vows[reminder.vowIndex]}
                    vowIndex={reminder.vowIndex}
                    vowType={reminder.vowType}
                    reminderNumber={index + 1}
                    entry={todayEntries.find(e => e.vowIndex === reminder.vowIndex && e.vow_type === reminder.vowType)}
                    onUpdate={(vowIndex, status, antidote, note) => handleVowUpdate(vowIndex, reminder.vowType, status, antidote, note)}
                    language={settings.language}
                  />
                );
              })}
            </div>

          </TabsContent>

          <TabsContent value="history" className="mt-8">
            <History 
              entries={entries}
              selectedVows={sortedSelectedVows}
              language={settings.language}
              onCompleteAntidote={handleCompleteAntidote}
              onPostponeAntidote={handlePostponeAntidote}
            />
          </TabsContent>

          <TabsContent value="settings" className="mt-8">
            <Settings
              username={user.username}
              currentVow={sortedSelectedVows[0]}
              settings={settings}
              onUpdateSettings={onUpdateSettings}
              onUpdatePassword={onUpdatePassword}
              onChangeVow={onChangeVow}
              onOpenAdmin={onOpenAdmin}
              onLogout={onLogout}
              userRole={user.role}
              selectedVowsCount={sortedSelectedVows.length}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
