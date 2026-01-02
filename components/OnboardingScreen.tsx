import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';
import { Language } from '@/types/database';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const GREETINGS = [
  { text: 'Привет', lang: 'ru' },
  { text: 'Hello', lang: 'en' },
  { text: 'Hola', lang: 'es' },
  { text: '你好', lang: 'zh' },
  { text: 'Guten Tag', lang: 'de' },
  { text: 'Bonjour', lang: 'fr' },
  { text: 'Barev', lang: 'hy' },
  { text: 'Ciao', lang: 'it' },
];

const LANGUAGES: { code: Language; name: string; nativeName: string }[] = [
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
];

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

interface OnboardingScreenProps {
  onComplete: (language: Language) => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const insets = useSafeAreaInsets();
  const [currentGreetingIndex, setCurrentGreetingIndex] = useState(0);
  const [selectedLanguageIndex, setSelectedLanguageIndex] = useState(0);
  
  const greetingOpacity = useRef(new Animated.Value(1)).current;
  const greetingScale = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  
  const circle1Anim = useRef(new Animated.Value(0)).current;
  const circle2Anim = useRef(new Animated.Value(0)).current;
  const circle3Anim = useRef(new Animated.Value(0)).current;
  const gradientShift = useRef(new Animated.Value(0)).current;
  
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(circle1Anim, {
          toValue: 1,
          duration: 6000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(circle1Anim, {
          toValue: 0,
          duration: 6000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(circle2Anim, {
          toValue: 1,
          duration: 8000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(circle2Anim, {
          toValue: 0,
          duration: 8000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(circle3Anim, {
          toValue: 1,
          duration: 5000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(circle3Anim, {
          toValue: 0,
          duration: 5000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(gradientShift, {
          toValue: 1,
          duration: 10000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(gradientShift, {
          toValue: 0,
          duration: 10000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [circle1Anim, circle2Anim, circle3Anim, gradientShift]);

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.parallel([
        Animated.timing(greetingOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(greetingScale, {
          toValue: 0.8,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentGreetingIndex((prev) => (prev + 1) % GREETINGS.length);
        
        greetingScale.setValue(1.2);
        
        Animated.parallel([
          Animated.timing(greetingOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(greetingScale, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [greetingOpacity, greetingScale]);

  const handleScroll = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, LANGUAGES.length - 1));
    setSelectedLanguageIndex(clampedIndex);
  }, []);

  const handleMomentumScrollEnd = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, LANGUAGES.length - 1));
    
    scrollViewRef.current?.scrollTo({
      y: clampedIndex * ITEM_HEIGHT,
      animated: true,
    });
    setSelectedLanguageIndex(clampedIndex);
  }, []);

  const handlePressIn = useCallback(() => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [buttonScale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [buttonScale]);

  const handleContinue = useCallback(() => {
    const selectedLanguage = LANGUAGES[selectedLanguageIndex].code;
    console.log('Onboarding complete, selected language:', selectedLanguage);
    onComplete(selectedLanguage);
  }, [selectedLanguageIndex, onComplete]);

  const getButtonText = useCallback(() => {
    const lang = LANGUAGES[selectedLanguageIndex].code;
    switch (lang) {
      case 'ru': return 'Продолжить';
      case 'es': return 'Continuar';
      case 'zh': return '继续';
      case 'de': return 'Weiter';
      case 'fr': return 'Continuer';
      case 'hy': return 'Շարունակել';
      case 'it': return 'Continua';
      default: return 'Continue';
    }
  }, [selectedLanguageIndex]);

  const getSubtitleText = useCallback(() => {
    const lang = LANGUAGES[selectedLanguageIndex].code;
    switch (lang) {
      case 'ru': return 'Выберите язык';
      case 'es': return 'Elige un idioma';
      case 'zh': return '选择语言';
      case 'de': return 'Sprache wählen';
      case 'fr': return 'Choisir la langue';
      case 'hy': return 'Ընտրեք լեզու';
      case 'it': return 'Scegli la lingua';
      default: return 'Choose language';
    }
  }, [selectedLanguageIndex]);

  const renderPickerItem = useCallback((item: typeof LANGUAGES[0], index: number) => {
    const isSelected = index === selectedLanguageIndex;
    const distance = Math.abs(index - selectedLanguageIndex);
    const opacity = distance === 0 ? 1 : distance === 1 ? 0.5 : 0.25;
    const scale = distance === 0 ? 1 : distance === 1 ? 0.9 : 0.8;

    return (
      <View 
        key={item.code} 
        style={[
          styles.pickerItem,
          { opacity, transform: [{ scale }] }
        ]}
      >
        <Text style={[
          styles.pickerItemText,
          isSelected && styles.pickerItemTextSelected
        ]}>
          {item.nativeName}
        </Text>
      </View>
    );
  }, [selectedLanguageIndex]);

  const circle1Transform = {
    transform: [
      { translateX: circle1Anim.interpolate({ inputRange: [0, 1], outputRange: [0, 30] }) },
      { translateY: circle1Anim.interpolate({ inputRange: [0, 1], outputRange: [0, 20] }) },
      { scale: circle1Anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.1, 1] }) },
    ],
    opacity: circle1Anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.15, 0.2, 0.15] }),
  };

  const circle2Transform = {
    transform: [
      { translateX: circle2Anim.interpolate({ inputRange: [0, 1], outputRange: [0, -25] }) },
      { translateY: circle2Anim.interpolate({ inputRange: [0, 1], outputRange: [0, -30] }) },
      { scale: circle2Anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.15, 1] }) },
    ],
    opacity: circle2Anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.1, 0.15, 0.1] }),
  };

  const circle3Transform = {
    transform: [
      { translateX: circle3Anim.interpolate({ inputRange: [0, 1], outputRange: [0, 15] }) },
      { translateY: circle3Anim.interpolate({ inputRange: [0, 1], outputRange: [0, -20] }) },
      { scale: circle3Anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.08, 1] }) },
    ],
    opacity: circle3Anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.2, 0.28, 0.2] }),
  };

  const gradientOverlayStyle = {
    opacity: gradientShift.interpolate({ inputRange: [0, 1], outputRange: [0, 0.3] }),
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F5F2ED', '#F8F3EB', '#E8DCC8', '#D9C4A5']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <Animated.View style={[styles.gradientOverlay, gradientOverlayStyle]}>
        <LinearGradient
          colors={['#E8DCC8', '#F5F2ED', '#D9C4A5', '#F8F3EB']}
          style={StyleSheet.absoluteFill}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
        />
      </Animated.View>
      
      <Animated.View style={[styles.decorativeCircle1, circle1Transform]} />
      <Animated.View style={[styles.decorativeCircle2, circle2Transform]} />
      <Animated.View style={[styles.decorativeCircle3, circle3Transform]} />
      <Animated.View style={[styles.decorativeCircle4, {
        transform: [
          { translateX: circle2Anim.interpolate({ inputRange: [0, 1], outputRange: [0, 20] }) },
          { translateY: circle1Anim.interpolate({ inputRange: [0, 1], outputRange: [0, 15] }) },
        ],
        opacity: circle1Anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.08, 0.12, 0.08] }),
      }]} />

      <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
        <View style={styles.greetingContainer}>
          <Animated.Text
            style={[
              styles.greetingText,
              {
                opacity: greetingOpacity,
                transform: [{ scale: greetingScale }],
              },
            ]}
          >
            {GREETINGS[currentGreetingIndex].text}
          </Animated.Text>
        </View>

        <Text style={styles.subtitleText}>{getSubtitleText()}</Text>

        <View style={styles.pickerContainer}>
          <View style={styles.pickerHighlight}>
            <View style={styles.pickerHighlightLine} />
            <View style={styles.pickerHighlightLine} />
          </View>
          
          <ScrollView
            ref={scrollViewRef}
            style={styles.picker}
            contentContainerStyle={[
              styles.pickerContent,
              { paddingVertical: (PICKER_HEIGHT - ITEM_HEIGHT) / 2 }
            ]}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            onScroll={handleScroll}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            scrollEventThrottle={16}
          >
            {LANGUAGES.map((lang, index) => renderPickerItem(lang, index))}
          </ScrollView>

          <LinearGradient
            colors={['rgba(245, 242, 237, 1)', 'rgba(245, 242, 237, 0)']}
            style={styles.pickerFadeTop}
            pointerEvents="none"
          />
          <LinearGradient
            colors={['rgba(245, 242, 237, 0)', 'rgba(245, 242, 237, 1)']}
            style={styles.pickerFadeBottom}
            pointerEvents="none"
          />
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) + 16 }]}>
        <TouchableOpacity
          onPress={handleContinue}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <LinearGradient
              colors={['#6B8E7F', '#5A7A6D']}
              style={styles.continueButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.continueButtonText}>{getButtonText()}</Text>
              <ChevronRight size={20} color="#FFFFFF" />
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F2ED',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -100,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#C5A572',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: 150,
    left: -120,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#6B8E7F',
  },
  decorativeCircle3: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.35,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#D9C4A5',
  },
  decorativeCircle4: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.25,
    right: SCREEN_WIDTH * 0.3,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#B8A07A',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  greetingContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  greetingText: {
    fontSize: Platform.OS === 'web' ? 64 : 56,
    fontWeight: '700' as const,
    color: '#2C3E3A',
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 20,
    fontWeight: '500' as const,
    color: '#5A6A66',
    marginBottom: 40,
    textAlign: 'center',
  },
  pickerContainer: {
    height: PICKER_HEIGHT,
    width: SCREEN_WIDTH - 80,
    maxWidth: 320,
    position: 'relative',
    overflow: 'hidden',
  },
  pickerHighlight: {
    position: 'absolute',
    top: (PICKER_HEIGHT - ITEM_HEIGHT) / 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    justifyContent: 'space-between',
  },
  pickerHighlightLine: {
    height: 1,
    backgroundColor: 'rgba(44, 62, 58, 0.3)',
  },
  picker: {
    flex: 1,
  },
  pickerContent: {
    alignItems: 'center',
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerItemText: {
    fontSize: 22,
    fontWeight: '500' as const,
    color: '#5A6A66',
  },
  pickerItemTextSelected: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: '#2C3E3A',
  },
  pickerFadeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  pickerFadeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  footer: {
    paddingHorizontal: 24,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#6B8E7F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
});
