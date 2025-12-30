import { VowEntry, VowType } from '../App';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckCircle2, XCircle, Clock, CheckSquare, Check, X, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { t } from '../data/translations';
import { safeDisplay } from '../utils/sanitize';
import { getVowData } from '../data/vows';
import { StatusBadge } from './ui/status-badge';
import { Language } from '../data/translations';

interface HistoryProps {
  entries: VowEntry[];
  selectedVows: VowType[];
  language: Language;
  onCompleteAntidote: (entryDate: string, vowIndex: number) => void;
  onPostponeAntidote: (entryDate: string, vowIndex: number) => void;
}

export function History({ entries, selectedVows, language, onCompleteAntidote, onPostponeAntidote }: HistoryProps) {
  // Group entries by date
  const entriesByDate = entries.reduce((acc, entry) => {
    if (!acc[entry.date]) {
      acc[entry.date] = [];
    }
    acc[entry.date].push(entry);
    return acc;
  }, {} as Record<string, VowEntry[]>);

  const dates = Object.keys(entriesByDate).sort().reverse();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return t('today', language);
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t('yesterday', language);
    } else {
      return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  };

  if (entries.length === 0) {
    return (
      <Card className="card-base">
        <CardContent className="py-16 text-center">
          <div className="icon-container-lg mx-auto mb-6 bg-gradient-to-br from-vow-primary to-vow-primary-dark">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl text-vow-text-primary mb-2">{t('historyEmpty', language)}</h3>
          <p className="text-sm text-vow-text-secondary">{t('startTracking', language)}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {dates.map((date) => {
        const dayEntries = entriesByDate[date];
        const keptCount = dayEntries.filter(e => e.status === 'kept').length;
        const brokenCount = dayEntries.filter(e => e.status === 'broken').length;

        return (
          <Card key={date} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-vow-primary/5 to-transparent">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <CardTitle className="text-xl text-vow-text-primary">{formatDate(date)}</CardTitle>
                <div className="flex gap-3">
                  <StatusBadge status="kept" count={keptCount} />
                  <StatusBadge status="broken" count={brokenCount} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {dayEntries.map((entry, index) => {
                  const vowData = getVowData(entry.vow_type, language);
                  const vow = vowData.vows[entry.vowIndex];
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-2xl border-0 shadow-md transition-all duration-300 hover:shadow-lg ${
                        entry.status === 'kept'
                          ? 'bg-gradient-to-br from-vow-kept/10 to-white'
                          : 'bg-gradient-to-br from-vow-broken/10 to-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                          entry.status === 'kept'
                            ? 'bg-gradient-to-br from-vow-kept to-vow-kept-dark'
                            : 'bg-gradient-to-br from-vow-broken to-vow-broken-dark'
                        }`}>
                          {entry.status === 'kept' ? (
                            <Check className="w-5 h-5 text-white" />
                          ) : (
                            <X className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs px-2 py-1 rounded-lg bg-vow-primary/20 text-vow-text-primary font-medium">
                              {t(entry.vow_type, language)}
                            </span>
                          </div>
                          <p className="text-vow-text-primary mb-1.5 leading-relaxed text-sm">
                            {safeDisplay(vow)}
                          </p>
                          <p className="text-xs text-vow-text-secondary">{entry.time}</p>
                          {entry.note && entry.status === 'kept' && (
                            <div className="mt-3 p-4 bg-gradient-to-r from-vow-kept/20 to-vow-kept/10 rounded-xl border border-vow-kept/30">
                              <p className="text-sm text-vow-text-primary">{safeDisplay(entry.note)}</p>
                            </div>
                          )}
                          {entry.antidote && (
                            <div className="mt-3 space-y-3">
                              <div className={`p-4 rounded-xl border ${
                                entry.antidoteCompleted
                                  ? 'bg-gradient-to-r from-vow-kept/20 to-vow-kept/10 border-vow-kept/30'
                                  : 'bg-gradient-to-r from-vow-antidote/20 to-vow-antidote/10 border-vow-antidote/30'
                              }`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <Sparkles className={`w-4 h-4 ${entry.antidoteCompleted ? 'text-vow-kept' : 'text-vow-antidote'}`} />
                                  <p className="text-xs text-vow-text-secondary">
                                    {entry.antidoteCompleted
                                      ? t('antidoteCompleted', language)
                                      : entry.antidotePostponed
                                        ? t('antidotePending', language)
                                        : t('antidote', language)}
                                    :
                                  </p>
                                </div>
                                <p className="text-sm text-vow-text-primary">{safeDisplay(entry.antidote)}</p>
                              </div>
                              {entry.status === 'broken' && !entry.antidoteCompleted && !entry.antidotePostponed && (
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <Button
                                    onClick={() => onCompleteAntidote?.(entry.date, entry.vowIndex)}
                                    className="btn-kept flex-1 h-10 text-xs sm:text-sm rounded-xl"
                                  >
                                    <Check className="w-4 h-4 sm:mr-1.5" />
                                    <span className="ml-1 sm:ml-0">{t('antidoteCompleted', language)}</span>
                                  </Button>
                                  <Button
                                    onClick={() => onPostponeAntidote?.(entry.date, entry.vowIndex)}
                                    variant="outline"
                                    className="flex-1 sm:flex-initial h-10 px-3 sm:px-4 text-xs sm:text-sm rounded-xl border-vow-antidote/40 text-vow-text-primary hover:bg-vow-antidote/10 hover:border-vow-antidote/60"
                                  >
                                    <ArrowRight className="w-4 h-4 sm:mr-1.5" />
                                    <span className="ml-1 sm:ml-0">{t('postponeAntidote', language)}</span>
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
