import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMutation } from '@tanstack/react-query';
import { Sparkles, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { getTranslation } from '@/data/translations';
import { darkTheme } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { Language } from '@/types/database';

const BREAKPOINTS = {
  sm: 320,
  md: 768,
  lg: 1024,
};

interface LoginFormProps {
  onSuccess?: () => void;
}

type AuthMode = 'login' | 'register' | 'reset';

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { signIn, signUp, language, setLanguage } = useAuth();
  const t = getTranslation(language);
  const { width: screenWidth } = useWindowDimensions();
  
  const isSmallScreen = screenWidth < BREAKPOINTS.md;
  const isLargeScreen = screenWidth >= BREAKPOINTS.lg;
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const signInMutation = useMutation({
    mutationFn: async () => {
      if (!email.trim() || !password.trim()) {
        throw new Error(t.auth.fillAllFields);
      }
      if (!validateEmail(email.trim())) {
        throw new Error(t.auth.invalidEmail);
      }
      const sanitizedEmail = sanitizeEmail(email);
      return signIn(sanitizedEmail, password);
    },
    onSuccess: () => {
      console.log('Login successful');
      onSuccess?.();
    },
    onError: (err: Error) => {
      console.log('Login error:', err.message);
      setError(err.message || t.auth.errorInvalidCredentials);
    },
  });

  const signUpMutation = useMutation({
    mutationFn: async () => {
      if (!email.trim() || !password.trim()) {
        throw new Error(t.auth.fillAllFields);
      }
      if (!validateEmail(email.trim())) {
        throw new Error(t.auth.invalidEmail);
      }
      const sanitizedEmail = sanitizeEmail(email);
      const generatedUsername = sanitizedEmail.split('@')[0];
      return signUp(sanitizedEmail, password, generatedUsername);
    },
    onSuccess: (data) => {
      console.log('Registration successful');
      if (!data.session) {
        setSuccess(language === 'ru' 
          ? 'Регистрация успешна! Проверьте email для подтверждения.' 
          : 'Registration successful! Check your email for confirmation.');
        setMode('login');
      } else {
        onSuccess?.();
      }
    },
    onError: (err: Error) => {
      console.log('Registration error:', err.message);
      setError(err.message.includes('already') ? t.auth.errorEmailExists : err.message);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async () => {
      if (!email.trim()) {
        throw new Error(t.auth.fillAllFields);
      }
      if (!validateEmail(email.trim())) {
        throw new Error(t.auth.invalidEmail);
      }
      const sanitizedEmail = sanitizeEmail(email);
      const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
        redirectTo: 'rork-app://auth/callback',
      });
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      console.log('Reset password email sent');
      setSuccess(t.auth.resetLinkSent);
      setTimeout(() => setMode('login'), 3000);
    },
    onError: (err: Error) => {
      console.log('Reset password error:', err.message);
      setError(err.message || t.auth.invalidEmail);
    },
  });

  const handleSubmit = () => {
    setError(null);
    setSuccess(null);
    
    if (mode === 'reset') {
      resetPasswordMutation.mutate();
    } else if (mode === 'register') {
      signUpMutation.mutate();
    } else {
      signInMutation.mutate();
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setSuccess(null);
    if (newMode !== mode) {
      setEmail('');
      setPassword('');
    }
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const isLoading = signInMutation.isPending || signUpMutation.isPending || resetPasswordMutation.isPending;
  
  const isValid = mode === 'reset' 
    ? email.length > 0 
    : email.length > 0 && password.length >= 6;

  const responsiveStyles = {
    scrollContent: {
      padding: isSmallScreen ? 16 : isLargeScreen ? 40 : 24,
    },
    card: {
      maxWidth: isLargeScreen ? 480 : isSmallScreen ? '100%' : 420,
      padding: isSmallScreen ? 20 : 32,
    },
    title: {
      fontSize: isSmallScreen ? 26 : isLargeScreen ? 36 : 32,
    },
    logoSize: isSmallScreen ? 70 : 80,
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[darkTheme.colors.primary, darkTheme.colors.primaryDark, darkTheme.colors.primaryDarker]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <View style={[styles.decorativeCircle1, isSmallScreen && styles.decorativeCircle1Small]} />
      <View style={[styles.decorativeCircle2, isSmallScreen && styles.decorativeCircle2Small]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { padding: responsiveStyles.scrollContent.padding }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.languageSwitcher, isLargeScreen && styles.languageSwitcherLarge]}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                language === 'ru' && styles.languageButtonActive,
              ]}
              onPress={() => handleLanguageChange('ru')}
            >
              <Text style={[
                styles.languageButtonText,
                language === 'ru' && styles.languageButtonTextActive,
              ]}>
                РУ
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.languageButton,
                language === 'en' && styles.languageButtonActive,
              ]}
              onPress={() => handleLanguageChange('en')}
            >
              <Text style={[
                styles.languageButtonText,
                language === 'en' && styles.languageButtonTextActive,
              ]}>
                EN
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[
            styles.card, 
            { 
              maxWidth: typeof responsiveStyles.card.maxWidth === 'number' ? responsiveStyles.card.maxWidth : undefined,
              width: typeof responsiveStyles.card.maxWidth === 'string' ? '100%' : undefined,
              padding: responsiveStyles.card.padding,
            },
            isLargeScreen && styles.cardLarge
          ]}>
            <View style={styles.header}>
              <View style={[styles.logoContainer, { width: responsiveStyles.logoSize, height: responsiveStyles.logoSize }]}>
                <Image
                  source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/uqmnsi22xt6lebmzz3lbk' }}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <Text style={[styles.title, { fontSize: responsiveStyles.title.fontSize }]}>
                {mode === 'reset' ? t.auth.resetPasswordTitle : t.app.title}
              </Text>
              <Text style={[styles.subtitle, isSmallScreen && styles.subtitleSmall]}>
                {mode === 'reset' ? t.auth.resetPasswordDesc : t.app.subtitle}
              </Text>
            </View>

            <View style={styles.form}>
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {success && (
                <View style={styles.successContainer}>
                  <Text style={styles.successText}>{success}</Text>
                </View>
              )}

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>{t.auth.email}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.auth.enterEmail}
                  placeholderTextColor={darkTheme.colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  testID="email-input"
                />
              </View>

              {mode !== 'reset' && (
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>{t.auth.password}</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder={t.auth.enterPassword}
                      placeholderTextColor={darkTheme.colors.textMuted}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      testID="password-input"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                    >
                      {showPassword ? (
                        <EyeOff size={20} color={darkTheme.colors.textMuted} />
                      ) : (
                        <Eye size={20} color={darkTheme.colors.textMuted} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <TouchableOpacity
                style={[styles.submitButton, (!isValid || isLoading) && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={!isValid || isLoading}
                testID="submit-button"
              >
                {isLoading ? (
                  <ActivityIndicator color={darkTheme.colors.surface} />
                ) : (
                  <View style={styles.submitButtonContent}>
                    <Sparkles size={20} color={darkTheme.colors.surface} />
                    <Text style={styles.submitButtonText}>
                      {mode === 'reset' 
                        ? t.auth.sendResetLink 
                        : mode === 'register' 
                          ? t.auth.createAccount 
                          : t.auth.startPractice}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {mode === 'reset' ? (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => switchMode('login')}
                >
                  <ArrowLeft size={16} color={darkTheme.colors.textSecondary} />
                  <Text style={styles.backButtonText}>{t.auth.backToLogin}</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.footer}>
                  <TouchableOpacity
                    style={styles.switchButton}
                    onPress={() => switchMode(mode === 'register' ? 'login' : 'register')}
                  >
                    <Text style={styles.switchText}>
                      {mode === 'register' ? t.auth.hasAccount : t.auth.noAccount}
                    </Text>
                    <Text style={styles.switchTextBold}>
                      {mode === 'register' ? t.auth.login : t.auth.register}
                    </Text>
                  </TouchableOpacity>
                  
                  {mode === 'login' && (
                    <TouchableOpacity
                      style={styles.forgotButton}
                      onPress={() => switchMode('reset')}
                    >
                      <Text style={styles.forgotButtonText}>{t.auth.forgotPassword}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.colors.primary,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -150,
    right: -150,
    width: 384,
    height: 384,
    borderRadius: 192,
    backgroundColor: darkTheme.colors.antidote,
    opacity: 0.2,
  },
  decorativeCircle1Small: {
    width: 280,
    height: 280,
    borderRadius: 140,
    top: -100,
    right: -100,
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -150,
    left: -150,
    width: 384,
    height: 384,
    borderRadius: 192,
    backgroundColor: darkTheme.colors.background,
    opacity: 0.2,
  },
  decorativeCircle2Small: {
    width: 280,
    height: 280,
    borderRadius: 140,
    bottom: -100,
    left: -100,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: darkTheme.spacing.lg,
  },
  languageSwitcher: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: darkTheme.spacing.md,
    gap: darkTheme.spacing.sm,
  },
  languageSwitcherLarge: {
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },
  languageButton: {
    paddingHorizontal: darkTheme.spacing.md,
    paddingVertical: darkTheme.spacing.sm,
    borderRadius: darkTheme.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  languageButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  languageButtonText: {
    fontSize: darkTheme.fontSize.sm,
    fontWeight: darkTheme.fontWeight.medium,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  languageButtonTextActive: {
    color: darkTheme.colors.text,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: darkTheme.spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 12,
    width: '100%',
  },
  cardLarge: {
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: darkTheme.spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    marginBottom: darkTheme.spacing.md,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: darkTheme.fontWeight.bold,
    color: darkTheme.colors.text,
    marginBottom: darkTheme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: darkTheme.fontSize.md,
    color: darkTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  subtitleSmall: {
    fontSize: 14,
  },
  form: {
    gap: darkTheme.spacing.md,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: darkTheme.borderRadius.lg,
    padding: darkTheme.spacing.md,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    color: '#991B1B',
    fontSize: darkTheme.fontSize.sm,
    textAlign: 'center',
  },
  successContainer: {
    backgroundColor: '#F0FDF4',
    borderRadius: darkTheme.borderRadius.lg,
    padding: darkTheme.spacing.md,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  successText: {
    color: '#166534',
    fontSize: darkTheme.fontSize.sm,
    textAlign: 'center',
  },
  inputWrapper: {
    gap: darkTheme.spacing.xs,
  },
  inputLabel: {
    fontSize: darkTheme.fontSize.sm,
    fontWeight: darkTheme.fontWeight.medium,
    color: darkTheme.colors.text,
  },
  input: {
    backgroundColor: darkTheme.colors.backgroundSecondary,
    borderRadius: darkTheme.borderRadius.lg,
    paddingVertical: darkTheme.spacing.md,
    paddingHorizontal: darkTheme.spacing.md,
    fontSize: darkTheme.fontSize.md,
    color: darkTheme.colors.text,
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
    height: 48,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkTheme.colors.backgroundSecondary,
    borderRadius: darkTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
    height: 48,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: darkTheme.spacing.md,
    paddingHorizontal: darkTheme.spacing.md,
    fontSize: darkTheme.fontSize.md,
    color: darkTheme.colors.text,
  },
  eyeButton: {
    padding: darkTheme.spacing.md,
  },
  submitButton: {
    backgroundColor: darkTheme.colors.primary,
    borderRadius: darkTheme.borderRadius.lg,
    paddingVertical: darkTheme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    marginTop: darkTheme.spacing.sm,
    shadowColor: darkTheme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: darkTheme.spacing.sm,
  },
  submitButtonText: {
    color: darkTheme.colors.surface,
    fontSize: darkTheme.fontSize.lg,
    fontWeight: darkTheme.fontWeight.bold,
  },
  footer: {
    alignItems: 'center',
    gap: darkTheme.spacing.sm,
    marginTop: darkTheme.spacing.md,
  },
  switchButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: darkTheme.spacing.xs,
  },
  switchText: {
    color: darkTheme.colors.textSecondary,
    fontSize: darkTheme.fontSize.sm,
  },
  switchTextBold: {
    color: darkTheme.colors.primary,
    fontSize: darkTheme.fontSize.sm,
    fontWeight: darkTheme.fontWeight.bold,
  },
  forgotButton: {
    marginTop: darkTheme.spacing.xs,
  },
  forgotButtonText: {
    color: darkTheme.colors.primary,
    fontSize: darkTheme.fontSize.sm,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: darkTheme.spacing.xs,
    marginTop: darkTheme.spacing.md,
  },
  backButtonText: {
    color: darkTheme.colors.textSecondary,
    fontSize: darkTheme.fontSize.sm,
  },
});
