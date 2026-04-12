import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Platform,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, Plus } from 'lucide-react-native';
import { Language } from '@/types/database';
import { onboardingContent } from '@/data/translations';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallScreen = SCREEN_HEIGHT < 700;

interface OnboardingCarouselProps {
  language: Language;
  onComplete: () => void;
}

export function OnboardingCarousel({ language, onComplete }: OnboardingCarouselProps) {
  const insets = useSafeAreaInsets();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [counter, setCounter] = useState(1);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Slide 1 animations
  const slide1Opacity = useRef(new Animated.Value(0)).current;
  const slide1Scale = useRef(new Animated.Value(0.95)).current;

  // Slide 2 animations
  const arrowAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim2 = useRef(new Animated.Value(0)).current;
  const labelOpacity2 = useRef(new Animated.Value(0)).current;

  // Slide 3 animations
  const arrowAnim3A = useRef(new Animated.Value(0)).current;
  const arrowAnim3B = useRef(new Animated.Value(0)).current;
  const pulseAnim3A = useRef(new Animated.Value(0)).current;
  const pulseAnim3B = useRef(new Animated.Value(0)).current;
  const labelOpacity3 = useRef(new Animated.Value(0)).current;

  const content = onboardingContent[language] || onboardingContent.en;
  const slides = [content.slide1, content.slide2, content.slide3];

  // Slide 1: entrance + counter
  useEffect(() => {
    Animated.parallel([
      Animated.timing(slide1Opacity, { toValue: 1, duration: 800, delay: 300, useNativeDriver: true }),
      Animated.timing(slide1Scale, { toValue: 1, duration: 800, delay: 300, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      let current = 1;
      const interval = setInterval(() => {
        current += 1;
        setCounter(current);
        if (current === 6) clearInterval(interval);
      }, 300);
      return () => clearInterval(interval);
    }, 500);

    return () => clearTimeout(timer);
  }, [slide1Opacity, slide1Scale]);

  // Slide 2: animations
  useEffect(() => {
    if (currentSlide !== 1) {
      labelOpacity2.setValue(0);
      return;
    }

    const labelAnim = Animated.timing(labelOpacity2, {
      toValue: 1, duration: 400, delay: 200, useNativeDriver: true,
    });

    const arrowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(arrowAnim2, { toValue: 10, duration: 600, useNativeDriver: true }),
        Animated.timing(arrowAnim2, { toValue: 0, duration: 600, useNativeDriver: true }),
      ])
    );

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim2, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim2, { toValue: 0, duration: 600, useNativeDriver: true }),
      ])
    );

    labelAnim.start();
    arrowLoop.start();
    pulseLoop.start();

    return () => {
      arrowLoop.stop();
      pulseLoop.stop();
    };
  }, [currentSlide, arrowAnim2, pulseAnim2, labelOpacity2]);

  // Slide 3: animations
  useEffect(() => {
    if (currentSlide !== 2) {
      labelOpacity3.setValue(0);
      return;
    }

    const labelAnim = Animated.timing(labelOpacity3, {
      toValue: 1, duration: 400, delay: 200, useNativeDriver: true,
    });

    const arrowLoopA = Animated.loop(
      Animated.sequence([
        Animated.timing(arrowAnim3A, { toValue: 8, duration: 700, useNativeDriver: true }),
        Animated.timing(arrowAnim3A, { toValue: 0, duration: 700, useNativeDriver: true }),
      ])
    );

    const arrowLoopB = Animated.loop(
      Animated.sequence([
        Animated.timing(arrowAnim3B, { toValue: 8, duration: 700, delay: 350, useNativeDriver: true }),
        Animated.timing(arrowAnim3B, { toValue: 0, duration: 700, useNativeDriver: true }),
      ])
    );

    const pulseLoopA = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim3A, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim3A, { toValue: 0, duration: 600, useNativeDriver: true }),
      ])
    );

    const pulseLoopB = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim3B, { toValue: 1, duration: 900, delay: 450, useNativeDriver: true }),
        Animated.timing(pulseAnim3B, { toValue: 0, duration: 600, useNativeDriver: true }),
      ])
    );

    labelAnim.start();
    arrowLoopA.start();
    arrowLoopB.start();
    pulseLoopA.start();
    pulseLoopB.start();

    return () => {
      arrowLoopA.stop();
      arrowLoopB.stop();
      pulseLoopA.stop();
      pulseLoopB.stop();
    };
  }, [currentSlide, arrowAnim3A, arrowAnim3B, pulseAnim3A, pulseAnim3B, labelOpacity3]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
        setCurrentSlide(index);
      },
    }
  );

  const goToSlide = useCallback((index: number) => {
    scrollViewRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
    setCurrentSlide(index);
  }, []);

  const handleNext = useCallback(() => {
    if (currentSlide < 2) goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const handleSkip = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const handleStart = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const handlePressIn = useCallback(() => {
    Animated.spring(buttonScale, { toValue: 0.96, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  }, [buttonScale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  }, [buttonScale]);

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {slides.map((_, index) => {
        const inputRange = [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH];
        const dotWidth = scrollX.interpolate({ inputRange, outputRange: [8, 24, 8], extrapolate: 'clamp' });
        const opacity = scrollX.interpolate({ inputRange, outputRange: [0.3, 1, 0.3], extrapolate: 'clamp' });
        return <Animated.View key={index} style={[styles.dot, { width: dotWidth, opacity }]} />;
      })}
    </View>
  );

  const renderPulseRing = (pulseAnim: Animated.Value, size: number) => {
    const scale = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] });
    const ringOpacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 0] });
    return (
      <Animated.View style={[
        styles.pulseRing,
        { width: size, height: size, borderRadius: size / 2, opacity: ringOpacity, transform: [{ scale }] }
      ]} />
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F5F2ED', '#F8F3EB', '#E8DCC8', '#D9C4A5']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
        decelerationRate="fast"
      >
        {/* Slide 1 — 6-разовый дневник */}
        <View style={styles.slide}>
          <ImageBackground
            source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/blpj92h4o94al4jdb0g2u' }}
            style={styles.imageBackground}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(245,242,237,0.3)', 'rgba(232,220,200,0.6)', 'rgba(217,196,165,0.88)']}
              style={styles.imageOverlay}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <Animated.View style={[styles.slide1Content, { opacity: slide1Opacity, transform: [{ scale: slide1Scale }] }]}>
                <Text style={styles.slide1Title}>
                  {slides[0].title.replace('6', counter.toString())}
                </Text>
              </Animated.View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Slide 2 — Выбрать обет */}
        <View style={styles.slide}>
          <View style={[styles.spotlightContainer, { paddingTop: insets.top + (isSmallScreen ? 48 : 60) }]}>
            <View style={styles.screenshotWrapper}>
              <ImageBackground
                source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/z395lhjq19ba2xibneocb' }}
                style={styles.dashboardImage}
                resizeMode="contain"
                imageStyle={styles.dashboardImageStyle}
              >
                <View style={styles.darkOverlay} />

                {/* Pulsing + button highlight */}
                <View style={[styles.spotlightArea, {
                  top: isSmallScreen ? 10 : 16,
                  right: isSmallScreen ? 14 : 20,
                }]}>
                  {renderPulseRing(pulseAnim2, isSmallScreen ? 66 : 78)}
                  <View style={[styles.plusBtn, isSmallScreen && styles.plusBtnSmall]}>
                    <Plus size={isSmallScreen ? 20 : 24} color="#6B8E7F" strokeWidth={2.5} />
                  </View>
                </View>

                {/* Arrow + label pill */}
                <Animated.View style={[styles.annotationRow, {
                  top: isSmallScreen ? 44 : 56,
                  right: isSmallScreen ? 82 : 104,
                  opacity: labelOpacity2,
                }]}>
                  <Animated.Text style={[styles.arrowText, { transform: [{ translateX: arrowAnim2 }] }]}>
                    →
                  </Animated.Text>
                  <View style={styles.pillLight}>
                    <Text style={styles.pillLightText}>{slides[1].hint}</Text>
                  </View>
                </Animated.View>
              </ImageBackground>
            </View>
          </View>
        </View>

        {/* Slide 3 — Антидоты и История */}
        <View style={styles.slide}>
          <View style={[styles.spotlightContainer, { paddingTop: insets.top + (isSmallScreen ? 48 : 60) }]}>
            <View style={styles.screenshotWrapper}>
              <ImageBackground
                source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/il56ewosd6ziblhil3n1d' }}
                style={styles.dashboardImage}
                resizeMode="contain"
                imageStyle={styles.dashboardImageStyle}
              >
                <View style={styles.darkOverlay} />

                {/* Antidotes annotation — top left */}
                <Animated.View style={[styles.annotationCol, {
                  top: isSmallScreen ? 6 : 10,
                  left: isSmallScreen ? 16 : 24,
                  opacity: labelOpacity3,
                }]}>
                  <View style={styles.pillDark}>
                    <Text style={styles.pillDarkText}>{slides[2].hintAntidote}</Text>
                  </View>
                  <Animated.Text style={[styles.arrowText, { transform: [{ translateY: arrowAnim3A }] }]}>
                    ↓
                  </Animated.Text>
                </Animated.View>

                {/* History annotation — bottom center */}
                <Animated.View style={[styles.annotationColBottom, {
                  bottom: isSmallScreen ? 50 : 62,
                  opacity: labelOpacity3,
                }]}>
                  <Animated.Text style={[styles.arrowText, { transform: [{ translateY: arrowAnim3B }] }]}>
                    ↓
                  </Animated.Text>
                  <View style={styles.pillDark}>
                    <Text style={styles.pillDarkText}>{slides[2].hintHistory}</Text>
                  </View>
                </Animated.View>
              </ImageBackground>
            </View>
          </View>
        </View>
      </ScrollView>

      {renderDots()}

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) + 16 }]}>
        {currentSlide < 2 ? (
          <TouchableOpacity onPress={handleNext} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={1}>
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <LinearGradient colors={['#6B8E7F', '#5A7A6D']} style={styles.button} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.buttonText}>{content.buttons.next}</Text>
                <ChevronRight size={20} color="#FFFFFF" />
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleStart} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={1}>
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <LinearGradient colors={['#6B8E7F', '#5A7A6D']} style={styles.button} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.buttonText}>{content.buttons.start}</Text>
                <ChevronRight size={20} color="#FFFFFF" />
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
        )}
      </View>

      {/* Skip button — рендерится ПОСЛЕДНИМ, чтобы быть поверх ScrollView */}
      {currentSlide < 2 && (
        <TouchableOpacity
          style={[styles.skipButton, { top: insets.top + 14 }]}
          onPress={handleSkip}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          activeOpacity={0.7}
        >
          <View style={styles.skipPill}>
            <Text style={styles.skipText}>{content.buttons.skip}</Text>
          </View>
        </TouchableOpacity>
      )}
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
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  imageBackground: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
  imageOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: isSmallScreen ? 70 : 90,
  },
  slide1Content: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  slide1Title: {
    fontSize: Platform.OS === 'web' ? 48 : (isSmallScreen ? 34 : 42),
    fontWeight: '700' as const,
    color: '#2C3E3A',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6B8E7F',
  },
  footer: {
    paddingHorizontal: 24,
  },
  button: {
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
  buttonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  // Skip button — поверх всего
  skipButton: {
    position: 'absolute',
    right: 20,
    zIndex: 999,
  },
  skipPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(107, 142, 127, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#5A6A66',
  },
  // Spotlight slides
  spotlightContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
    alignItems: 'center',
    paddingBottom: 8,
  },
  screenshotWrapper: {
    width: SCREEN_WIDTH * (isSmallScreen ? 0.88 : 0.85),
    flex: 1,
    borderRadius: isSmallScreen ? 18 : 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 16,
  },
  dashboardImage: {
    flex: 1,
    width: '100%',
  },
  dashboardImageStyle: {
    borderRadius: isSmallScreen ? 18 : 24,
    resizeMode: 'contain',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
    borderRadius: 24,
  },
  // Pulse ring
  pulseRing: {
    position: 'absolute',
    borderWidth: 2.5,
    borderColor: '#6B8E7F',
  },
  // + button spotlight
  spotlightArea: {
    position: 'absolute',
    width: isSmallScreen ? 68 : 82,
    height: isSmallScreen ? 68 : 82,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusBtn: {
    width: isSmallScreen ? 48 : 56,
    height: isSmallScreen ? 48 : 56,
    borderRadius: isSmallScreen ? 24 : 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#6B8E7F',
    shadowColor: '#6B8E7F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  plusBtnSmall: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  // Annotation row (horizontal: arrow + label)
  annotationRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  // Annotation column (vertical: label above arrow)
  annotationCol: {
    position: 'absolute',
    alignItems: 'center',
    gap: 4,
  },
  annotationColBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 4,
  },
  arrowText: {
    fontSize: isSmallScreen ? 22 : 26,
    color: '#FFFFFF',
    fontWeight: '700' as const,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  // Light pill (for slide 2)
  pillLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(107, 142, 127, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  pillLightText: {
    fontSize: isSmallScreen ? 13 : 15,
    fontWeight: '700' as const,
    color: '#2C3E3A',
    letterSpacing: 0.2,
  },
  // Dark pill (for slide 3)
  pillDark: {
    backgroundColor: 'rgba(30, 45, 40, 0.88)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(107, 142, 127, 0.55)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  pillDarkText: {
    fontSize: isSmallScreen ? 13 : 15,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
