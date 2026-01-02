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
import { ChevronRight } from 'lucide-react-native';
import { Language } from '@/types/database';
import { onboardingContent } from '@/data/translations';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingCarouselProps {
  language: Language;
  onComplete: () => void;
}

export function OnboardingCarousel({ language, onComplete }: OnboardingCarouselProps) {
  const insets = useSafeAreaInsets();
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const slide1Opacity = useRef(new Animated.Value(0)).current;
  const slide1Scale = useRef(new Animated.Value(0.95)).current;
  const arrowTranslateX = useRef(new Animated.Value(0)).current;

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

    Animated.loop(
      Animated.sequence([
        Animated.timing(arrowTranslateX, {
          toValue: 10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(arrowTranslateX, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [slide1Opacity, slide1Scale, arrowTranslateX]);

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
          const inputRange = [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH,
          ];

          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [50, 0, 50],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

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
                      <View style={styles.slide1TitleContainer}>
                        <Animated.View style={[
                          styles.arrowContainer,
                          { transform: [{ translateX: arrowTranslateX }] }
                        ]}>
                          <ChevronRight size={Platform.OS === 'web' ? 48 : 40} color="#2C3E3A" strokeWidth={1.5} />
                        </Animated.View>
                        <Text style={styles.slide1Title}>{slide.title}</Text>
                      </View>
                    </Animated.View>
                  </LinearGradient>
                </ImageBackground>
              </View>
            );
          }

          return (
            <Animated.View
              key={index}
              style={[
                styles.slide,
                {
                  transform: [{ translateY }],
                  opacity,
                },
              ]}
            >
              <View style={styles.slideContent}>
                <Text style={styles.slideTitle}>{slide.title}</Text>
                <Text style={styles.slideText}>{slide.text}</Text>
              </View>
            </Animated.View>
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
    fontSize: Platform.OS === 'web' ? 32 : 28,
    fontWeight: '700' as const,
    color: '#2C3E3A',
    textAlign: 'center',
    marginBottom: 24,
  },
  slideText: {
    fontSize: 18,
    fontWeight: '400' as const,
    color: '#5A6A66',
    textAlign: 'center',
    lineHeight: 28,
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
    bottom: '30%',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  slide1TitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  arrowContainer: {
    shadowColor: '#2C3E3A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  slide1Title: {
    fontSize: Platform.OS === 'web' ? 48 : 40,
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
    paddingVertical: 32,
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
});
