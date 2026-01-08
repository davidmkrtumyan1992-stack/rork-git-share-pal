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
import { ChevronRight, ArrowRight, Plus, ArrowDown } from 'lucide-react-native';
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
  const slide1Opacity = useRef(new Animated.Value(0)).current;
  const slide1Scale = useRef(new Animated.Value(0.95)).current;
  const arrowTranslateX = useRef(new Animated.Value(0)).current;
  const arrowTranslateY = useRef(new Animated.Value(0)).current;

  const content = onboardingContent[language] || onboardingContent.en;
  const slides = [content.slide1, content.slide2, content.slide3];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slide1Opacity, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slide1Scale, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const animateCounter = () => {
      let current = 1;
      const interval = setInterval(() => {
        current += 1;
        setCounter(current);
        if (current === 6) {
          clearInterval(interval);
        }
      }, 300);

      return () => clearInterval(interval);
    };

    const timer = setTimeout(() => {
      animateCounter();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [slide1Opacity, slide1Scale]);

  useEffect(() => {
    if (currentSlide === 1) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(arrowTranslateX, {
            toValue: 8,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(arrowTranslateX, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
    if (currentSlide === 2) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(arrowTranslateY, {
            toValue: 6,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(arrowTranslateY, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [currentSlide, arrowTranslateX, arrowTranslateY]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / SCREEN_WIDTH);
        setCurrentSlide(index);
      },
    }
  );

  const goToSlide = useCallback((index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * SCREEN_WIDTH,
      animated: true,
    });
    setCurrentSlide(index);
  }, []);

  const handleNext = useCallback(() => {
    if (currentSlide < 2) {
      goToSlide(currentSlide + 1);
    }
  }, [currentSlide, goToSlide]);

  const handleSkip = useCallback(() => {
    console.log('Onboarding carousel skipped');
    onComplete();
  }, [onComplete]);

  const handleStart = useCallback(() => {
    console.log('Onboarding carousel completed');
    onComplete();
  }, [onComplete]);

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

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => {
          const inputRange = [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                },
              ]}
            />
          );
        })}
      </View>
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

      {currentSlide < 2 && (
        <TouchableOpacity
          style={[styles.skipButton, { top: insets.top + 16 }]}
          onPress={handleSkip}
        >
          <Text style={styles.skipButtonText}>{content.buttons.skip}</Text>
        </TouchableOpacity>
      )}

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
        {slides.map((slide, index) => {
          if (index === 0) {
            return (
              <View key={index} style={styles.slide}>
                <ImageBackground
                  source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/blpj92h4o94al4jdb0g2u' }}
                  style={styles.imageBackground}
                  resizeMode="cover"
                >
                  <LinearGradient
                    colors={['rgba(245, 242, 237, 0.7)', 'rgba(248, 243, 235, 0.7)', 'rgba(232, 220, 200, 0.75)', 'rgba(217, 196, 165, 0.8)']}
                    style={styles.imageOverlay}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Animated.View
                      style={[
                        styles.slide1Content,
                        {
                          opacity: slide1Opacity,
                          transform: [{ scale: slide1Scale }],
                        },
                      ]}
                    >
                      <Text style={styles.slide1Title}>{slide.title.replace('6', counter.toString())}</Text>
                    </Animated.View>
                  </LinearGradient>
                </ImageBackground>
              </View>
            );
          }

          if (index === 1) {
            return (
              <View key={index} style={styles.slide}>
                <View style={[styles.spotlightContainer, { paddingTop: insets.top + (isSmallScreen ? 50 : 60) }]}>
                  <View style={styles.screenshotWrapper}>
                    <ImageBackground
                      source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/z395lhjq19ba2xibneocb' }}
                      style={styles.dashboardImage}
                      resizeMode="contain"
                      imageStyle={styles.dashboardImageStyle}
                    >
                      <View style={styles.darkOverlay} />

                      <View style={[styles.spotlightCircle, { top: isSmallScreen ? 12 : 20, right: isSmallScreen ? 20 : 30 }]}>
                        <View style={[styles.plusButton, isSmallScreen && styles.plusButtonSmall]}>
                          <Plus size={isSmallScreen ? 22 : 28} color="#6B8E7F" strokeWidth={2.5} />
                        </View>
                      </View>

                      <View style={[styles.hintContainer, { top: isSmallScreen ? 45 : 60, right: isSmallScreen ? 90 : 120 }]}>
                        <Animated.View style={{ transform: [{ translateX: arrowTranslateX }] }}>
                          <ArrowRight size={isSmallScreen ? 18 : 22} color="#F5F2ED" strokeWidth={2} />
                        </Animated.View>
                        <Text style={[styles.hintText, isSmallScreen && styles.hintTextSmall]}>{slide.hint}</Text>
                      </View>
                    </ImageBackground>
                  </View>
                </View>
              </View>
            );
          }

          return (
              <View key={index} style={styles.slide}>
                <View style={[styles.spotlightContainer, { paddingTop: insets.top + (isSmallScreen ? 50 : 60) }]}>
                  <View style={styles.screenshotWrapper}>
                    <ImageBackground
                      source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/il56ewosd6ziblhil3n1d' }}
                      style={styles.dashboardImage}
                      resizeMode="contain"
                      imageStyle={styles.dashboardImageStyle}
                    >
                      <View style={styles.darkOverlay} />

                      <View style={[styles.slide3HintLeft, { top: isSmallScreen ? 8 : 12 }]}>
                        <Animated.View style={{ transform: [{ translateY: arrowTranslateY }] }}>
                          <ArrowDown size={isSmallScreen ? 18 : 22} color="#FFFFFF" strokeWidth={2.5} />
                        </Animated.View>
                        <Text style={[styles.hintTextBright, isSmallScreen && styles.hintTextSmall]}>{slide.hintAntidote || 'антидоты'}</Text>
                      </View>

                      <View style={[styles.slide3HintBottom, { bottom: isSmallScreen ? 55 : 65 }]}>
                        <Text style={[styles.hintTextBright, isSmallScreen && styles.hintTextSmall]}>{slide.hintHistory || 'история'}</Text>
                        <Animated.View style={{ transform: [{ translateY: arrowTranslateY }] }}>
                          <ArrowDown size={isSmallScreen ? 18 : 22} color="#FFFFFF" strokeWidth={2.5} />
                        </Animated.View>
                      </View>
                    </ImageBackground>
                  </View>
                </View>
              </View>
            );
        })}
      </ScrollView>

      {renderDots()}

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) + 16 }]}>
        {currentSlide < 2 ? (
          <TouchableOpacity
            onPress={handleNext}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
          >
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <LinearGradient
                colors={['#6B8E7F', '#5A7A6D']}
                style={styles.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>{content.buttons.next}</Text>
                <ChevronRight size={20} color="#FFFFFF" />
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleStart}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
          >
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <LinearGradient
                colors={['#6B8E7F', '#5A7A6D']}
                style={styles.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>{content.buttons.start}</Text>
                <ChevronRight size={20} color="#FFFFFF" />
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
        )}
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
  skipButton: {
    position: 'absolute',
    right: 24,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#5A6A66',
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  slideContent: {
    alignItems: 'center',
    maxWidth: 400,
  },
  slideTitle: {
    fontSize: Platform.OS === 'web' ? 32 : (isSmallScreen ? 24 : 28),
    fontWeight: '700' as const,
    color: '#2C3E3A',
    textAlign: 'center',
    marginBottom: isSmallScreen ? 16 : 24,
  },
  slideText: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '400' as const,
    color: '#5A6A66',
    textAlign: 'center',
    lineHeight: isSmallScreen ? 24 : 28,
  },
  imageBackground: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
  imageOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide1Content: {
    position: 'absolute' as const,
    top: '75%',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  slide1Title: {
    fontSize: Platform.OS === 'web' ? 48 : (isSmallScreen ? 32 : 40),
    fontWeight: '700' as const,
    color: '#2C3E3A',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      web: 'Georgia, "Times New Roman", serif',
    }),
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
  spotlightContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 8,
  },
  screenshotWrapper: {
    width: SCREEN_WIDTH * (isSmallScreen ? 0.88 : 0.85),
    flex: 1,
    borderRadius: isSmallScreen ? 18 : 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  dashboardImage: {
    flex: 1,
    width: '100%',
  },
  dashboardImageStyle: {
    borderRadius: isSmallScreen ? 18 : 24,
    resizeMode: 'contain',
    top: 0,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 24,
  },
  spotlightCircle: {
    position: 'absolute' as const,
    width: isSmallScreen ? 60 : 80,
    height: isSmallScreen ? 60 : 80,
    borderRadius: isSmallScreen ? 30 : 40,
    backgroundColor: 'rgba(245, 242, 237, 0)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 25,
    elevation: 10,
  },
  plusButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6B8E7F',
    shadowColor: '#6B8E7F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  plusButtonSmall: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  hintContainer: {
    position: 'absolute' as const,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hintText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#F5F2ED',
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      web: 'Georgia, "Times New Roman", serif',
    }),
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  hintTextSmall: {
    fontSize: 14,
  },
  slide3HintLeft: {
    position: 'absolute' as const,
    left: isSmallScreen ? 30 : 45,
    alignItems: 'center',
    gap: 4,
  },
  slide3HintRight: {
    position: 'absolute' as const,
    right: isSmallScreen ? 30 : 45,
    alignItems: 'center',
    gap: 4,
  },
  slide3HintBottom: {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  hintTextBright: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      web: 'Georgia, "Times New Roman", serif',
    }),
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
});
