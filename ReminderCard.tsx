import { useState } from 'react';
import { VowEntry, VowType } from '../App';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Check, X, AlertCircle, Sparkles } from 'lucide-react';
import { Badge } from './ui/badge';
import { Language, t } from '../data/translations';
import { sanitizeUserInput, safeDisplay } from '../utils/sanitize';

interface ReminderCardProps {
  vow: string;
  vowIndex: number;
  vowType: VowType;
  reminderNumber: number;
  entry?: VowEntry;
  onUpdate: (vowIndex: number, status: 'kept' | 'broken', antidote?: string, note?: string) => void;
  language: Language;
}

export function ReminderCard({ vow, vowIndex, vowType, reminderNumber, entry, onUpdate, language }: ReminderCardProps) {
  const [showAntidote, setShowAntidote] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [antidote, setAntidote] = useState(entry?.antidote || '');
  const [note, setNote] = useState(entry?.note || '');

  const handleKeep = () => {
    setShowNote(true);
  };

  const handleBreak = () => {
    setShowAntidote(true);
  };

  const handleSaveNote = () => {
    const sanitizedNote = sanitizeUserInput(note, 1000);
    onUpdate(vowIndex, 'kept', undefined, sanitizedNote);
    setShowNote(false);
  };

  const handleSaveAntidote = () => {
    const sanitizedAntidote = sanitizeUserInput(antidote, 1000);
    onUpdate(vowIndex, 'broken', sanitizedAntidote);
    setShowAntidote(false);
  };

  const isKept = entry?.status === 'kept';
  const isBroken = entry?.status === 'broken';

  return (
    <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden ${
      isKept
        ? 'bg-gradient-to-br from-vow-kept/15 to-white/80'
        : isBroken
        ? 'bg-gradient-to-br from-vow-broken/15 to-white/80'
        : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md ${
              isKept
                ? 'bg-gradient-to-br from-vow-kept to-vow-kept-dark'
                : isBroken
                ? 'bg-gradient-to-br from-vow-broken to-vow-broken-dark'
                : 'bg-gradient-to-br from-vow-primary to-vow-primary-dark'
            }`}>
              <span className="text-white font-medium">{reminderNumber}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-1 rounded-lg bg-vow-primary/20 text-vow-text-primary font-medium">
                  {t(vowType, language)}
                </span>
              </div>
              <CardTitle className="text-base text-vow-text-primary leading-relaxed">
                {vow}
              </CardTitle>
            </div>
          </div>
          {entry && (
            <Badge
              variant="outline"
              className="text-xs text-vow-text-secondary border-vow-primary-darker/20 bg-white/60 rounded-lg px-3 py-1"
            >
              {entry.time}
            </Badge>
          )}
        </div>
      </CardHeader>

      {!entry && !showAntidote && !showNote && (
        <CardFooter className="flex gap-3 pt-2">
          <Button
            onClick={handleKeep}
            className="btn-kept flex-1"
          >
            <Check className="w-5 h-5 mr-2" />
            {t('keptVow', language)}
          </Button>
          <Button
            onClick={handleBreak}
            className="btn-broken flex-1"
          >
            <X className="w-5 h-5 mr-2" />
            {t('brokenVow', language)}
          </Button>
        </CardFooter>
      )}

      {showAntidote && (
        <CardContent className="pt-2 space-y-3">
          <div className="info-box-antidote">
            <AlertCircle className="w-6 h-6 text-vow-antidote flex-shrink-0 mt-0.5" />
            <p className="text-sm text-vow-text-primary">
              {t('antidoteQuestion', language)}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`antidote-${vowIndex}`} className="text-vow-text-primary text-sm">
              {t('antidote', language)}
            </Label>
            <div className="flex flex-wrap gap-2 mb-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setAntidote(t('antidote1', language))}
                className="h-8 text-xs rounded-xl bg-gradient-to-r from-vow-antidote/20 to-vow-antidote/10 border border-vow-antidote/30 text-vow-text-primary hover:from-vow-antidote/30 hover:to-vow-antidote/20 hover:border-vow-antidote/50 hover:shadow-md transition-all duration-200 hover:text-vow-text-primary"
              >
                {t('antidote1', language)}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setAntidote(t('antidote2', language))}
                className="h-8 text-xs rounded-xl bg-gradient-to-r from-vow-antidote/20 to-vow-antidote/10 border border-vow-antidote/30 text-vow-text-primary hover:from-vow-antidote/30 hover:to-vow-antidote/20 hover:border-vow-antidote/50 hover:shadow-md transition-all duration-200 hover:text-vow-text-primary"
              >
                {t('antidote2', language)}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setAntidote(t('antidote3', language))}
                className="h-8 text-xs rounded-xl bg-gradient-to-r from-vow-antidote/20 to-vow-antidote/10 border border-vow-antidote/30 text-vow-text-primary hover:from-vow-antidote/30 hover:to-vow-antidote/20 hover:border-vow-antidote/50 hover:shadow-md transition-all duration-200 hover:text-vow-text-primary"
              >
                {t('antidote3', language)}
              </Button>
            </div>
            <Textarea
              id={`antidote-${vowIndex}`}
              placeholder={t('antidotePlaceholder', language)}
              value={antidote}
              onChange={(e) => setAntidote(e.target.value)}
              rows={3}
              className="bg-white/80 border-vow-primary-darker/20 focus:border-vow-primary focus:ring-vow-primary rounded-2xl resize-none"
            />
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleSaveAntidote}
              className="btn-primary flex-1"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {t('save', language)}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAntidote(false)}
              className="h-12 rounded-2xl border-vow-primary-darker/30 hover:bg-vow-primary-darker/10"
            >
              {t('cancel', language)}
            </Button>
          </div>
        </CardContent>
      )}

      {showNote && (
        <CardContent className="pt-2 space-y-3">
          <div className="info-box-kept">
            <Check className="w-6 h-6 text-vow-kept flex-shrink-0 mt-0.5" />
            <p className="text-sm text-vow-text-primary">
              {t('noteQuestion', language)}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`note-${vowIndex}`} className="text-vow-text-primary text-sm">
              {t('note', language)}
            </Label>
            <Textarea
              id={`note-${vowIndex}`}
              placeholder={t('notePlaceholder', language)}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="bg-white/80 border-vow-primary-darker/20 focus:border-vow-primary focus:ring-vow-primary rounded-2xl resize-none"
            />
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleSaveNote}
              className="btn-kept flex-1"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {t('save', language)}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowNote(false)}
              className="h-12 rounded-2xl border-vow-primary-darker/30 hover:bg-vow-primary-darker/10"
            >
              {t('cancel', language)}
            </Button>
          </div>
        </CardContent>
      )}

      {entry && isKept && (
        <CardContent className="pt-2 space-y-3">
          <div className="info-box-kept">
            <div className="icon-container bg-gradient-to-br from-vow-kept to-vow-kept-dark">
              <Check className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-vow-text-primary">
              {t('vowKept', language)}
            </p>
          </div>
          {entry.note && (
            <div className="bg-gradient-to-r from-vow-kept/20 to-vow-kept/10 p-4 rounded-2xl border border-vow-kept/30">
              <p className="text-sm text-vow-text-primary">{safeDisplay(entry.note)}</p>
            </div>
          )}
        </CardContent>
      )}

      {entry && isBroken && entry.antidote && (
        <CardContent className="pt-2 space-y-3">
          <div className="info-box-broken">
            <div className="icon-container bg-gradient-to-br from-vow-broken to-vow-broken-dark">
              <X className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-vow-text-primary">
              {t('vowBroken', language)}
            </p>
          </div>
          <div className="bg-gradient-to-r from-vow-antidote/20 to-vow-antidote/10 p-4 rounded-2xl border border-vow-antidote/30">
            <p className="text-xs text-vow-text-secondary mb-2">{t('antidote', language)}:</p>
            <p className="text-sm text-vow-text-primary">{safeDisplay(entry.antidote)}</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
