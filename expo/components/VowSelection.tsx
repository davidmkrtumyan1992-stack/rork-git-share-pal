import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BookOpen,
  Bird,
  Gem,
  Lock,
  Users,
  Shield,
  X,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { getTranslation } from '@/data/translations';
import { useUnlockedVows } from '@/hooks/useUnlockedVows';

type VowType = {
  key: string;
  titleKey: keyof ReturnType<typeof getTranslation>['vows'];
  descKey: keyof ReturnType<typeof getTranslation>['vows'];
  icon: React.ComponentType<{ size: number; color: string }>;
  gradientColors: [string, string];
  defaultLocked: boolean;
};

const BREAKPOINTS = {
  sm: 320,
  md: 768,
  lg: 1024,
};

const vowTypes: VowType[] = [
  {
    key: 'tenPrinciples',
    titleKey: 'tenPrinciples',
    descKey: 'tenPrinciplesDesc',
    icon: BookOpen,
    gradientColors: ['#6B8E7F', '#5A7A6D'],
    defaultLocked: false,
  },
  {
    key: 'freedom',
    titleKey: 'freedom',
    descKey: 'freedomDesc',
    icon: Bird,
    gradientColors: ['#8FA89E', '#7FA88F'],
    defaultLocked: false,
  },
  {
    key: 'bodhisattva',
    titleKey: 'bodhisattva',
    descKey: 'bodhisattvaDesc',
    icon: Gem,
    gradientColors: ['#A67C5C', '#8B6A4E'],
    defaultLocked: false,
  },
  {
    key: 'tantric',
    titleKey: 'tantric',
    descKey: 'tantricDesc',
    icon: Lock,
    gradientColors: ['#4A6B5E', '#3A5B4E'],
    defaultLocked: true,
  },
  {
    key: 'nuns',
    titleKey: 'nuns',
    descKey: 'nunsDesc',
    icon: Users,
    gradientColors: ['#C5A572', '#B09562'],
    defaultLocked: true,
  },
  {
    key: 'monks',
    titleKey: 'monks',
    descKey: 'monksDesc',
    icon: Shield,
    gradientColors: ['#8B7355', '#7B6345'],
    defaultLocked: true,
  },
];

interface VowSelectionProps {
  selectedVows: string[];
  onToggleVow: (vowType: string) => void;
  onConfirm: () => void;
  onClose?: () => void;
  isLoading?: boolean;
  isInline?: boolean;
}

export function VowSelection({ 
  selectedVows, 
  onToggleVow, 
  onConfirm, 
  onClose,
  isLoading,
  isInline = false,
}: VowSelectionProps) {
  const { language } = useAuth();
  const t = getTranslation(language);
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const [showLockedDialog, setShowLockedDialog] = useState(false);
  const { isVowLocked } = useUnlockedVows();
  
  const isSmallScreen = screenWidth < BREAKPOINTS.md;
  const isLargeScreen = screenWidth >= BREAKPOINTS.lg;
  const isMediumScreen = screenWidth >= BREAKPOINTS.md && screenWidth < BREAKPOINTS.lg;

  const lastPressTime = useRef<Record<string, number>>({});

  const checkIsLocked = useCallback((vow: VowType): boolean => {
    if (!vow.defaultLocked) return false;
    return isVowLocked(vow.key);
  }, [isVowLocked]);

  const handleVowPress = useCallback((vow: VowType) => {
    if (checkIsLocked(vow)) {
      setShowLockedDialog(true);
      return;
    }
    
    const now = Date.now();
    const lastPress = lastPressTime.current[vow.key] || 0;
    if (now - lastPress < 500) {
      return;
    }
    lastPressTime.current[vow.key] = now;
    
    onToggleVow(vow.key);
  }, [onToggleVow, checkIsLocked]);

  const handleCloseDialog = useCallback(() => {
    setShowLockedDialog(false);
  }, []);

  const responsiveStyles = useMemo(() => ({
    content: {
      paddingHorizontal: isSmallScreen ? 16 : isLargeScreen ? 40 : 24,
      maxWidth: isLargeScreen ? 1200 : undefined,
    },
    title: {
      fontSize: isSmallScreen ? 26 : isLargeScreen ? 40 : 32,
    },
    subtitle: {
      fontSize: isSmallScreen ? 14 : 16,
    },
    cardPadding: isSmallScreen ? 16 : 24,
    iconSize: isSmallScreen ? 56 : 64,
  }), [isSmallScreen, isLargeScreen]);

  if (isInline) {
    return (
      <View style={styles.inlineContainer}>
        <View style={[styles.titleContainer, isLargeScreen && styles.titleContainerLarge]}>
          <Text style={[styles.title, { fontSize: responsiveStyles.title.fontSize }]}>
            {t.vows.title}
          </Text>
          <Text style={[styles.subtitle, { fontSize: responsiveStyles.subtitle.fontSize }]}>
            {t.vows.subtitle}
          </Text>
        </View>

        <View style={[
          styles.inlineScrollContent,
          (isMediumScreen || isLargeScreen) && styles.scrollContentGrid
        ]}>
          {vowTypes.map((vow) => {
            const IconComponent = vow.icon;
            const isSelected = selectedVows.includes(vow.key);
            const isLocked = checkIsLocked(vow);
            const title = t.vows[vow.titleKey] as string || vow.titleKey;
            const desc = t.vows[vow.descKey] as string || vow.descKey;

            return (
              <Pressable
                key={vow.key}
                style={[
                  styles.vowCard,
                  { padding: responsiveStyles.cardPadding },
                  isSelected && styles.vowCardSelected,
                  isLocked && styles.vowCardLocked,
                  (isMediumScreen || isLargeScreen) && styles.vowCardGrid,
                ]}
                onPress={() => handleVowPress(vow)}
                testID={`vow-inline-${vow.key}`}
              >
                <View style={styles.cardContent}>
                  <View style={styles.iconWrapper}>
                    <LinearGradient
                      colors={vow.gradientColors}
                      style={[styles.iconGradient, { width: responsiveStyles.iconSize, height: responsiveStyles.iconSize }]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <IconComponent size={isSmallScreen ? 28 : 32} color="#FFFFFF" />
                    </LinearGradient>
                    {isLocked && (
                      <View style={styles.lockOverlay}>
                        <Lock size={isSmallScreen ? 14 : 16} color="#FFFFFF" />
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.textContainer}>
                    <Text style={[styles.vowTitle, isLocked && styles.textLocked, isSmallScreen && styles.vowTitleSmall]}>
                      {title}
                    </Text>
                    <Text style={[styles.vowDesc, isLocked && styles.textLocked, isSmallScreen && styles.vowDescSmall]}>
                      {desc}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

        {selectedVows.length > 0 && (
          <View style={[styles.inlineFooter, isLargeScreen && styles.footerLarge]}>
            <TouchableOpacity
              style={[styles.confirmButton, isLargeScreen && styles.confirmButtonLarge]}
              onPress={onConfirm}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#6B8E7F', '#5A7A6D']}
                style={styles.confirmGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={[styles.confirmText, isSmallScreen && styles.confirmTextSmall]}>
                    {t.vows.continue} ({selectedVows.length})
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        <Modal
          visible={showLockedDialog}
          transparent
          animationType="fade"
          onRequestClose={() => setShowLockedDialog(false)}
        >
          <Pressable 
            style={styles.modalOverlay}
            onPress={() => setShowLockedDialog(false)}
          >
            <Pressable style={[
              styles.modalContent,
              isSmallScreen && styles.modalContentSmall,
              isLargeScreen && styles.modalContentLarge
            ]} onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalHeader}>
                <View style={styles.modalIconContainer}>
                  <Lock size={32} color="#B85C4F" />
                </View>
                <Text style={styles.modalTitle}>{t.vows.lockedTitle}</Text>
              </View>
              
              <Text style={styles.modalDesc}>{t.vows.lockedDesc}</Text>
              <Text style={styles.modalEmail}>access@example.com</Text>
              
              <View style={styles.requirementsContainer}>
                <Text style={styles.requirementsTitle}>{t.vows.lockedRequirements}:</Text>
                <View style={styles.requirementItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.requirementText}>{t.vows.lockedReq1}</Text>
                </View>
                <View style={styles.requirementItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.requirementText}>{t.vows.lockedReq2}</Text>
                </View>
                <View style={styles.requirementItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.requirementText}>{t.vows.lockedReq3}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowLockedDialog(false)}
              >
                <Text style={styles.modalCloseText}>{t.common.cancel}</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F5F2ED', '#E8E1D5', '#D4C5B0']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <View style={[
        styles.content, 
        { 
          paddingTop: insets.top + 16,
          paddingHorizontal: responsiveStyles.content.paddingHorizontal,
          maxWidth: responsiveStyles.content.maxWidth,
          alignSelf: isLargeScreen ? 'center' : undefined,
          width: isLargeScreen ? '100%' : undefined,
        }
      ]}>
        {onClose && (
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#2C3E3A" />
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.titleContainer, isLargeScreen && styles.titleContainerLarge]}>
          <Text style={[styles.title, { fontSize: responsiveStyles.title.fontSize }]}>
            {t.vows.title}
          </Text>
          <Text style={[styles.subtitle, { fontSize: responsiveStyles.subtitle.fontSize }]}>
            {t.vows.subtitle}
          </Text>
        </View>

        <ScrollView 
          style={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            (isMediumScreen || isLargeScreen) && styles.scrollContentGrid
          ]}
        >
          {vowTypes.map((vow) => {
            const IconComponent = vow.icon;
            const isSelected = selectedVows.includes(vow.key);
            const isLocked = checkIsLocked(vow);
            const title = t.vows[vow.titleKey] as string || vow.titleKey;
            const desc = t.vows[vow.descKey] as string || vow.descKey;

            return (
              <Pressable
                key={vow.key}
                style={[
                  styles.vowCard,
                  { padding: responsiveStyles.cardPadding },
                  isSelected && styles.vowCardSelected,
                  isLocked && styles.vowCardLocked,
                  (isMediumScreen || isLargeScreen) && styles.vowCardGrid,
                ]}
                onPress={() => handleVowPress(vow)}
                testID={`vow-modal-${vow.key}`}
              >
                <View style={styles.cardContent}>
                  <View style={styles.iconWrapper}>
                    <LinearGradient
                      colors={vow.gradientColors}
                      style={[styles.iconGradient, { width: responsiveStyles.iconSize, height: responsiveStyles.iconSize }]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <IconComponent size={isSmallScreen ? 28 : 32} color="#FFFFFF" />
                    </LinearGradient>
                    {isLocked && (
                      <View style={styles.lockOverlay}>
                        <Lock size={isSmallScreen ? 14 : 16} color="#FFFFFF" />
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.textContainer}>
                    <Text style={[styles.vowTitle, isLocked && styles.textLocked, isSmallScreen && styles.vowTitleSmall]}>
                      {title}
                    </Text>
                    <Text style={[styles.vowDesc, isLocked && styles.textLocked, isSmallScreen && styles.vowDescSmall]}>
                      {desc}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        {selectedVows.length > 0 && (
          <View style={[
            styles.footer, 
            { paddingBottom: insets.bottom + 16 },
            isLargeScreen && styles.footerLarge
          ]}>
            <TouchableOpacity
              style={[styles.confirmButton, isLargeScreen && styles.confirmButtonLarge]}
              onPress={onConfirm}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#6B8E7F', '#5A7A6D']}
                style={styles.confirmGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={[styles.confirmText, isSmallScreen && styles.confirmTextSmall]}>
                    {t.vows.continue} ({selectedVows.length})
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Modal
        visible={showLockedDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLockedDialog(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={handleCloseDialog}
        >
          <Pressable style={[
            styles.modalContent,
            isSmallScreen && styles.modalContentSmall,
            isLargeScreen && styles.modalContentLarge
          ]} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconContainer}>
                <Lock size={32} color="#B85C4F" />
              </View>
              <Text style={styles.modalTitle}>{t.vows.lockedTitle}</Text>
            </View>
            
            <Text style={styles.modalDesc}>{t.vows.lockedDesc}</Text>
            <Text style={styles.modalEmail}>access@example.com</Text>
            
            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>{t.vows.lockedRequirements}:</Text>
              <View style={styles.requirementItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.requirementText}>{t.vows.lockedReq1}</Text>
              </View>
              <View style={styles.requirementItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.requirementText}>{t.vows.lockedReq2}</Text>
              </View>
              <View style={styles.requirementItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.requirementText}>{t.vows.lockedReq3}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={handleCloseDialog}
            >
              <Text style={styles.modalCloseText}>{t.common.cancel}</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inlineContainer: {
    flex: 1,
  },
  inlineScrollContent: {
    gap: 16,
  },
  inlineFooter: {
    paddingTop: 20,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  languageSwitcher: {
    flexDirection: 'row',
    gap: 8,
  },
  langButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  langButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  langText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: 'rgba(44, 62, 58, 0.6)',
  },
  langTextActive: {
    color: '#2C3E3A',
  },
  titleContainer: {
    marginBottom: 24,
  },
  titleContainerLarge: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#2C3E3A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#5A6B66',
    lineHeight: 22,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    gap: 16,
    paddingBottom: 24,
  },
  scrollContentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  vowCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  vowCardGrid: {
    width: '48%',
    minWidth: 280,
    flexGrow: 1,
  },
  vowCardSelected: {
    borderColor: '#6B8E7F',
    borderWidth: 3,
    shadowColor: '#6B8E7F',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  vowCardLocked: {
    opacity: 0.6,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  iconGradient: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockOverlay: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#B85C4F',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  textContainer: {
    flex: 1,
  },
  vowTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#2C3E3A',
    marginBottom: 6,
  },
  vowTitleSmall: {
    fontSize: 18,
  },
  vowDesc: {
    fontSize: 14,
    color: '#5A6B66',
    lineHeight: 20,
  },
  vowDescSmall: {
    fontSize: 13,
    lineHeight: 18,
  },
  textLocked: {
    color: '#8A9A95',
  },

  footer: {
    paddingTop: 16,
  },
  footerLarge: {
    alignItems: 'center',
  },
  confirmButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#6B8E7F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  confirmButtonLarge: {
    maxWidth: 400,
    width: '100%',
  },
  confirmGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  confirmTextSmall: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalContentSmall: {
    padding: 24,
    marginHorizontal: 16,
  },
  modalContentLarge: {
    maxWidth: 480,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(184, 92, 79, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#2C3E3A',
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 16,
    color: '#5A6B66',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalEmail: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#6B8E7F',
    marginBottom: 24,
  },
  requirementsContainer: {
    width: '100%',
    backgroundColor: 'rgba(245, 242, 237, 0.5)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#2C3E3A',
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6B8E7F',
    marginRight: 12,
  },
  requirementText: {
    fontSize: 15,
    color: '#5A6B66',
  },
  modalCloseButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    backgroundColor: 'rgba(107, 142, 127, 0.1)',
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#6B8E7F',
  },
});
