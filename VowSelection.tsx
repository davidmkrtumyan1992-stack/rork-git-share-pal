import { VowType, User } from '../App';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card';
import { BookOpen, Bird, Gem, Lock, LogOut, Shield, Users, Mail } from 'lucide-react';
import { Language, t } from '../data/translations';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { useState } from 'react';
import { useSelectedVows } from '../hooks/useSelectedVows';
import { toast } from 'sonner';

interface VowSelectionProps {
  user: User;
  onContinue: () => void;
  onLogout: () => void;
  onOpenAdmin: () => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
}

const vowTypes = [
  {
    type: '10-principles' as VowType,
    icon: BookOpen,
    gradient: 'from-[#6B8E7F] to-[#5A7A6D]',
    bgColor: 'bg-gradient-to-br from-[#6B8E7F]/10 to-[#5A7A6D]/10',
  },
  {
    type: 'freedom' as VowType,
    icon: Bird,
    gradient: 'from-[#8FA89E] to-[#7FA88F]',
    bgColor: 'bg-gradient-to-br from-[#8FA89E]/10 to-[#7FA88F]/10',
  },
  {
    type: 'bodhisattva' as VowType,
    icon: Gem,
    gradient: 'from-[#A67C5C] to-[#8B6A4E]',
    bgColor: 'bg-gradient-to-br from-[#A67C5C]/10 to-[#8B6A4E]/10',
  },
  {
    type: 'secret' as VowType,
    icon: Lock,
    gradient: 'from-[#4A6B5E] to-[#3A5B4E]',
    bgColor: 'bg-gradient-to-br from-[#4A6B5E]/10 to-[#3A5B4E]/10',
  },
  {
    type: 'nuns' as VowType,
    icon: Users,
    gradient: 'from-[#C5A572] to-[#B09562]',
    bgColor: 'bg-gradient-to-br from-[#C5A572]/10 to-[#B09562]/10',
  },
  {
    type: 'monks' as VowType,
    icon: Shield,
    gradient: 'from-[#8B7355] to-[#7B6345]',
    bgColor: 'bg-gradient-to-br from-[#8B7355]/10 to-[#7B6345]/10',
  },
];

export function VowSelection({ user, onContinue, onLogout, onOpenAdmin, language, onLanguageChange }: VowSelectionProps) {
  const [showLockedDialog, setShowLockedDialog] = useState(false);
  const [selectedLockedVow, setSelectedLockedVow] = useState<string>('');
  const { selectedVows, toggleVow, hasVow } = useSelectedVows(user.userId);

  // All vows with their access status
  const userAllowedVows = user.allowedVows || ['10-principles', 'freedom', 'bodhisattva'];

  const handleVowClick = async (vow: VowType) => {
    if (userAllowedVows.includes(vow)) {
      await toggleVow(vow);
    } else {
      setSelectedLockedVow(t(vow, language));
      setShowLockedDialog(true);
    }
  };

  const handleContinue = () => {
    if (selectedVows.length === 0) {
      toast.error(t('selectAtLeastOne', language));
      return;
    }
    onContinue();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F2ED] via-[#E8E1D5] to-[#D4C5B0] p-6 relative">
      <div className="max-w-5xl mx-auto">
        {/* Language Switcher - moved above everything */}
        <div className="flex justify-end mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => onLanguageChange('ru')}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                language === 'ru'
                  ? 'bg-white text-[#2C3E3A] shadow-lg'
                  : 'bg-white/40 text-[#5A6A66] hover:bg-white/60'
              }`}
            >
              РУ
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                language === 'en'
                  ? 'bg-white text-[#2C3E3A] shadow-lg'
                  : 'bg-white/40 text-[#5A6A66] hover:bg-white/60'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl text-[#2C3E3A] mb-2">{t('selectVow', language)}</h1>
            <p className="text-sm md:text-base text-[#5A6A66]">{t('selectVowSubtitle', language)}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {(user.role === 'admin' || user.role === 'owner') && (
              <Button
                variant="outline"
                onClick={onOpenAdmin}
                className="rounded-2xl border-[#C5A572]/30 hover:bg-[#C5A572]/10 h-10 text-sm"
              >
                <Shield className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">{t('adminPanel', language)}</span>
              </Button>
            )}
            <Button
              variant="outline"
              onClick={onLogout}
              className="rounded-2xl border-[#4A6B5E]/30 hover:bg-[#4A6B5E]/10 h-10 text-sm"
            >
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">{t('logout', language)}</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vowTypes.map((vow) => {
            const Icon = vow.icon;
            const isLocked = !userAllowedVows.includes(vow.type);
            const isSelected = hasVow(vow.type);

            return (
              <Card
                key={vow.type}
                className={`cursor-pointer transition-all duration-300 border-2 ${vow.bgColor} backdrop-blur-sm rounded-3xl overflow-hidden group ${
                  isLocked
                    ? 'opacity-60 hover:opacity-80 border-transparent'
                    : isSelected
                    ? 'border-[#6B8E7F] shadow-2xl'
                    : 'border-transparent hover:shadow-2xl hover:-translate-y-1'
                }`}
                onClick={() => handleVowClick(vow.type)}
              >
                <CardHeader className="p-8">
                  <div className="flex items-start gap-5">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${vow.gradient} flex items-center justify-center shadow-lg ${
                      !isLocked && 'group-hover:scale-110'
                    } transition-transform duration-300 relative`}>
                      {isLocked && (
                        <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                          <Lock className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl text-[#2C3E3A] mb-2 flex items-center gap-2">
                        {t(vow.type, language)}
                        {isLocked && (
                          <Lock className="w-4 h-4 text-[#5A6A66]" />
                        )}
                        {isSelected && !isLocked && (
                          <span className="text-xs text-[#6B8E7F] font-normal">
                            • {t('selected', language)}
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription className="text-[#5A6A66] leading-relaxed">
                        {isLocked
                          ? t('vowLockedMessage', language)
                          : t(`${vow.type}-desc`, language)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <div className={`h-1 bg-gradient-to-r ${vow.gradient} ${
                  isLocked ? 'opacity-30' : isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                } transition-opacity duration-300`}></div>
              </Card>
            );
          })}
        </div>

        {/* Continue Button */}
        {selectedVows.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleContinue}
              className="rounded-2xl bg-gradient-to-r from-[#6B8E7F] to-[#5A7A6D] hover:from-[#5A7A6D] hover:to-[#4A6B5E] text-white px-8 py-6 text-lg shadow-xl"
            >
              {t('continueButton', language)} ({selectedVows.length})
            </Button>
          </div>
        )}

        {/* Locked Vow Dialog */}
        <AlertDialog open={showLockedDialog} onOpenChange={setShowLockedDialog}>
          <AlertDialogContent className="rounded-3xl max-w-lg">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-xl">
                <Lock className="w-5 h-5 text-[#A67C5C]" />
                {t('vowLocked', language)}: {selectedLockedVow}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base leading-relaxed pt-4 space-y-4">
                <div>
                  <p className="text-[#2C3E3A] mb-2">{t('vowLockedDetailedMessage', language)}</p>
                  <a 
                    href={`mailto:${t('contactEmail', language)}`}
                    className="flex items-center gap-2 text-[#6B8E7F] hover:text-[#5A7A6D] transition-colors font-medium"
                  >
                    <Mail className="w-4 h-4" />
                    {t('contactEmail', language)}
                  </a>
                </div>
                
                <div className="bg-[#F5F2ED]/50 rounded-2xl p-4 space-y-2">
                  <p className="text-[#2C3E3A] font-medium mb-3">{t('vowLockedRequirements', language)}</p>
                  <div className="space-y-2 text-[#5A6A66]">
                    <div className="flex items-start gap-2">
                      <span className="text-[#6B8E7F] mt-1">•</span>
                      <span>{t('vowLockedReq1', language)}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#6B8E7F] mt-1">•</span>
                      <span>{t('vowLockedReq2', language)}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#6B8E7F] mt-1">•</span>
                      <span>{t('vowLockedReq3', language)}</span>
                    </div>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                className="rounded-2xl bg-gradient-to-r from-[#6B8E7F] to-[#5A7A6D] hover:from-[#5A7A6D] hover:to-[#4A6B5E]"
                onClick={() => setShowLockedDialog(false)}
              >
                {t('contactAdmin', language)}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {vowTypes.filter(vow => userAllowedVows.includes(vow.type)).length === 0 && (
          <Card className="rounded-3xl border-0 bg-white/80 backdrop-blur-sm shadow-lg p-8 text-center">
            <p className="text-[#5A6A66] mb-2">{t('noVowsAvailable', language)}</p>
            <p className="text-sm text-[#5A6A66]">{t('contactAdmin', language)}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
