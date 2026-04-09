import React, { memo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Animated,
  Pressable,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Plus,
  X,
  Check,
  Sparkles,
  AlertCircle,
  Clock,
} from 'lucide-react-native';
import { VowEntry } from '@/types/database';
import { DailyVowItem } from '@/hooks/useVowCycle';
import { darkTheme } from '@/constants/theme';
import { styles } from './DashboardStyles';

export interface VowCardState {
  vowKey: string;
  vowIndex: number;
  expanded: 'keep' | 'break' | null;
  noteText: string;
  antidoteText: string;
  selectedAntidotes: string[];
}

const antidoteTags: Record<string, string[]> = {
  ru: ['практиковать щедрость', 'попросить прощения', 'медитировать на сострадание', 'сделать подношение', 'прочитать мантру'],
  en: ['practice generosity', 'ask for forgiveness', 'meditate on compassion', 'make an offering', 'recite a mantra'],
  fr: ['pratiquer la générosité', 'demander pardon', 'méditer sur la compassion', 'faire une offrande', 'réciter un mantra'],
  de: ['Großzügigkeit üben', 'um Vergebung bitten', 'über Mitgefühl meditieren', 'ein Opfer darbringen', 'ein Mantra rezitieren'],
  es: ['practicar generosidad', 'pedir perdón', 'meditar sobre compasión', 'hacer una ofrenda', 'recitar un mantra'],
  zh: ['修习慷慨', '请求原谅', '慈悲冥想', '供养', '诵咒'],
  hy: ['առատաձեռнություն прακтикел', 'ներолруттюн хндрел', 'կарекцанк медитацнел', 'ынца матуцел', 'мантра кардал'],
  it: ['praticare la generosità', 'chiedere perdono', 'meditare sulla compassione', 'fare un\'offerta', 'recitare un mantra'],
};

const getLocalizedText = (lang: string): 'ru' | 'en' | 'it' | 'fr' | 'de' | 'es' | 'zh' | 'hy' => {
  const supportedLangs = ['ru', 'en', 'it', 'fr', 'de', 'es', 'zh', 'hy'];
  return supportedLangs.indexOf(lang) !== -1 ? lang as any : 'en';
};

function AntidoteTagButton({ tag, onPress }: { tag: string; onPress: () => void }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.antidoteTag, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.antidoteTagText}>{tag}</Text>
      </Animated.View>
    </Pressable>
  );
}

interface DiaryTabProps {
  selectedVows: string[];
  dailyVows: DailyVowItem[];
  cardStates: Record<string, VowCardState>;
  cycleLoading: boolean;
  language: string;
  t: any;
  isSmallScreen: boolean;
  isLargeScreen: boolean;
  createEntryPending: boolean;
  onGoToVowSelection: () => void;
  onRemoveVow?: (vow: string) => void;
  getVowCategoryName: (vow: string) => string;
  findTodayEntry: (vowType: string, index: number) => VowEntry | null;
  formatTime: (date: string) => string;
  handleExpandCard: (key: string, type: 'keep' | 'break') => void;
  handleCollapseCard: (key: string) => void;
  handleSaveKeep: (vowType: string, key: string, index: number) => void;
  handleSaveBreak: (vowType: string, key: string, index: number) => void;
  updateNoteText: (key: string, text: string) => void;
  updateAntidoteText: (key: string, text: string) => void;
  selectAntidoteTag: (key: string, tag: string) => void;
}

export const DiaryTab = memo(function DiaryTab({
  selectedVows,
  dailyVows,
  cardStates,
  cycleLoading,
  language,
  t,
  isSmallScreen,
  isLargeScreen,
  createEntryPending,
  onGoToVowSelection,
  onRemoveVow,
  getVowCategoryName,
  findTodayEntry,
  formatTime,
  handleExpandCard,
  handleCollapseCard,
  handleSaveKeep,
  handleSaveBreak,
  updateNoteText,
  updateAntidoteText,
  selectAntidoteTag,
}: DiaryTabProps) {

  const renderSelectedVowsChips = () => (
    <View style={[styles.chipsSection, isLargeScreen && styles.chipsSectionLarge]}>
      <View style={styles.chipsSectionHeader}>
        <Text style={[styles.chipsSectionTitle, isLargeScreen && styles.chipsSectionTitleLarge]}>
          {language === 'ru' ? 'Выбранные обеты' : language === 'zh' ? '已选择的誓言' : 'Selected Vows'}
        </Text>
        <TouchableOpacity style={styles.addButton} onPress={onGoToVowSelection}>
          <Plus size={isSmallScreen ? 18 : 20} color={darkTheme.colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.chipsScrollWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScrollView}
          contentContainerStyle={styles.chipsScrollContent}
          decelerationRate="fast"
        >
          {selectedVows.map((vow) => (
            <View key={vow} style={[styles.chip, isSmallScreen && styles.chipSmall]}>
              <Text style={[styles.chipText, isSmallScreen && styles.chipTextSmall]}>
                {getVowCategoryName(vow)}
              </Text>
              {onRemoveVow && (
                <TouchableOpacity style={styles.chipRemove} onPress={() => onRemoveVow(vow)}>
                  <X size={isSmallScreen ? 12 : 14} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>
          ))}
          <View style={styles.chipsSpacer} />
        </ScrollView>
        {Platform.OS !== 'web' && (
          <LinearGradient
            colors={['rgba(245, 242, 237, 0)', 'rgba(245, 242, 237, 0.95)']}
            style={styles.chipsFadeRight}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            pointerEvents="none"
          />
        )}
      </View>
    </View>
  );

  const renderVowCard = (vowKey: string, vowItem: Record<string, string>, index: number, categoryName: string, globalIdx: number) => {
    const cardKey = `${vowKey}-${index}`;
    const state = cardStates[cardKey];
    const isKeepExpanded = state?.expanded === 'keep';
    const isBrokenExpanded = state?.expanded === 'break';
    const todayEntry = findTodayEntry(vowKey, globalIdx);
    const isSubmitted = !!todayEntry;
    const isKept = todayEntry?.status === 'kept';
    const isBroken = todayEntry?.status === 'broken';

    return (
      <View key={cardKey} style={[styles.vowCard, isSubmitted && styles.vowCardSubmitted]}>
        <View style={styles.vowCardHeader}>
          <View style={styles.vowNumberContainer}>
            {isBroken ? (
              <LinearGradient colors={['#B85C4F', '#A04A3E']} style={styles.vowNumber}>
                <Text style={styles.vowNumberText}>{globalIdx + 1}</Text>
              </LinearGradient>
            ) : (
              <LinearGradient colors={['#6B8E7F', '#5A7A6D']} style={styles.vowNumber}>
                <Text style={styles.vowNumberText}>{globalIdx + 1}</Text>
              </LinearGradient>
            )}
          </View>
          <View style={styles.vowCategoryBadge}>
            <Text style={styles.vowCategoryText}>{categoryName}</Text>
          </View>
          {isSubmitted && todayEntry && (
            <View style={styles.timeBadge}>
              <Clock size={12} color={darkTheme.colors.textMuted} />
              <Text style={styles.timeBadgeText}>{formatTime(todayEntry.updated_at)}</Text>
            </View>
          )}
        </View>

        <Text style={styles.vowText}>{vowItem[getLocalizedText(language)]}</Text>

        {isSubmitted ? (
          <View style={styles.submittedView}>
            {isKept && (
              <View style={styles.infoBoxKept}>
                <Check size={20} color="#7FA88F" />
                <Text style={styles.infoBoxKeptText}>{t.dashboard.keptVow}</Text>
              </View>
            )}
            {isBroken && (
              <>
                <View style={styles.infoBoxBroken}>
                  <X size={20} color="#B85C4F" />
                  <Text style={styles.infoBoxBrokenText}>{t.dashboard.vowWasBroken}</Text>
                </View>
                {todayEntry.antidote_text && (
                  <View style={styles.infoBoxAntidote}>
                    <Text style={styles.antidoteLabelSmall}>{t.dashboard.antidoteLabel}</Text>
                    <Text style={styles.antidoteValueText}>{todayEntry.antidote_text}</Text>
                  </View>
                )}
              </>
            )}
            {todayEntry.note_text && isKept && (
              <View style={styles.noteDisplay}>
                <Text style={styles.noteDisplayText}>«{todayEntry.note_text}»</Text>
              </View>
            )}
          </View>
        ) : (
          <>
            {!isKeepExpanded && !isBrokenExpanded && (
              <View style={styles.vowActions}>
                <TouchableOpacity style={styles.keepButton} onPress={() => handleExpandCard(cardKey, 'keep')}>
                  <LinearGradient colors={['#7FA88F', '#6B9E7D']} style={styles.actionButtonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <Check size={18} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>{t.dashboard.kept}</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={styles.brokenButton} onPress={() => handleExpandCard(cardKey, 'break')}>
                  <LinearGradient colors={['#B85C4F', '#A04A3E']} style={styles.actionButtonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <X size={18} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>{t.dashboard.broken}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {isKeepExpanded && (
              <View style={styles.expandedForm}>
                <View style={styles.keepInfoBlock}>
                  <Check size={20} color="#7FA88F" />
                  <Text style={styles.keepInfoText}>{t.dashboard.tellWhatYouDid}</Text>
                </View>
                <TextInput
                  style={styles.noteInput}
                  placeholder={t.dashboard.notePlaceholder}
                  placeholderTextColor={darkTheme.colors.textMuted}
                  value={state?.noteText || ''}
                  onChangeText={(text) => updateNoteText(cardKey, text)}
                  multiline
                  numberOfLines={3}
                />
                <View style={styles.formActions}>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => handleCollapseCard(cardKey)}>
                    <Text style={styles.cancelButtonText}>{t.common.cancel}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveButton} onPress={() => handleSaveKeep(vowKey, cardKey, globalIdx)} disabled={createEntryPending}>
                    <LinearGradient colors={['#7FA88F', '#6B9E7D']} style={styles.saveButtonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                      {createEntryPending ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <>
                          <Sparkles size={18} color="#FFFFFF" />
                          <Text style={styles.saveButtonText}>{t.common.save}</Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {isBrokenExpanded && (
              <View style={styles.expandedForm}>
                <View style={styles.brokenInfoBlock}>
                  <AlertCircle size={20} color="#C5A572" />
                  <Text style={styles.brokenInfoText}>{t.dashboard.whatWillYouDo}</Text>
                </View>
                <Text style={styles.antidoteLabel}>{t.dashboard.antidote}</Text>
                <View style={styles.antidoteTagsWrapper}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.antidoteTagsScroll}
                    contentContainerStyle={styles.antidoteTagsContent}
                    decelerationRate="fast"
                    snapToAlignment="start"
                  >
                    {antidoteTags[getLocalizedText(language)].map((tag: string) => (
                      <AntidoteTagButton key={tag} tag={tag} onPress={() => selectAntidoteTag(cardKey, tag)} />
                    ))}
                    <View style={styles.antidoteTagsSpacer} />
                  </ScrollView>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)']}
                    style={styles.antidoteFadeRight}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    pointerEvents="none"
                  />
                </View>
                <TextInput
                  style={styles.noteInput}
                  placeholder={t.dashboard.antidotePlaceholder}
                  placeholderTextColor={darkTheme.colors.textMuted}
                  value={state?.antidoteText || ''}
                  onChangeText={(text) => updateAntidoteText(cardKey, text)}
                  multiline
                  numberOfLines={3}
                />
                <View style={styles.formActions}>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => handleCollapseCard(cardKey)}>
                    <Text style={styles.cancelButtonText}>{t.common.cancel}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveButton} onPress={() => handleSaveBreak(vowKey, cardKey, globalIdx)} disabled={createEntryPending}>
                    <LinearGradient colors={['#C5A572', '#B09562']} style={styles.saveButtonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                      {createEntryPending ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <>
                          <Sparkles size={18} color="#FFFFFF" />
                          <Text style={styles.saveButtonText}>{t.common.save}</Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}
      </View>
    );
  };

  const renderVowCards = () => {
    if (cycleLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={darkTheme.colors.primary} />
          <Text style={styles.loadingText}>{t.dashboard.loadingVows}</Text>
        </View>
      );
    }
    if (dailyVows.length === 0) return null;
    return dailyVows.map((dailyVow: DailyVowItem, index: number) => {
      const vowItem: Record<string, string> = {
        ru: dailyVow.vowItem.textRu,
        en: dailyVow.vowItem.textEn,
        fr: dailyVow.vowItem.textFr || dailyVow.vowItem.textEn,
        de: dailyVow.vowItem.textDe || dailyVow.vowItem.textEn,
        es: dailyVow.vowItem.textEs || dailyVow.vowItem.textEn,
        zh: dailyVow.vowItem.textZh || dailyVow.vowItem.textEn,
        hy: dailyVow.vowItem.textHy || dailyVow.vowItem.textEn,
        it: dailyVow.vowItem.textIt || dailyVow.vowItem.textEn,
      };
      const categoryName = getVowCategoryName(dailyVow.vowType);
      return renderVowCard(dailyVow.vowType, vowItem, dailyVow.vowIndex, categoryName, dailyVow.vowIndex);
    });
  };

  return (
    <>
      {selectedVows.length > 0 && renderSelectedVowsChips()}
      {selectedVows.length === 0 ? (
        <TouchableOpacity
          style={[styles.emptyState, isLargeScreen && styles.emptyStateLarge]}
          onPress={onGoToVowSelection}
        >
          <Plus size={isSmallScreen ? 40 : 48} color={darkTheme.colors.textMuted} />
          <Text style={[styles.emptyStateText, isSmallScreen && styles.emptyStateTextSmall]}>
            {language === 'ru'
              ? 'Нажмите, чтобы выбрать обеты'
              : language === 'zh'
              ? '点击选择誓言'
              : 'Tap to select vows'}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={[styles.vowCardsContainer, isLargeScreen && styles.vowCardsContainerLarge]}>
          {renderVowCards()}
        </View>
      )}
    </>
  );
});
