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
} from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { getTranslation } from '@/data/translations';
import { darkTheme } from '@/constants/theme';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { signIn, signUp, language } = useAuth();
  const t = getTranslation(language);
  
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const signInMutation = useMutation({
    mutationFn: () => signIn(email, password),
    onSuccess: () => {
      console.log('Login successful');
      onSuccess?.();
    },
    onError: (err: Error) => {
      console.log('Login error:', err.message);
      setError(t.auth.errorInvalidCredentials);
    },
  });

  const signUpMutation = useMutation({
    mutationFn: () => signUp(email, password, username, fullName),
    onSuccess: (data) => {
      console.log('Registration successful');
      if (!data.session) {
        setSuccessMessage('Регистрация успешна! Проверьте email для подтверждения.');
        setIsRegister(false);
      } else {
        onSuccess?.();
      }
    },
    onError: (err: Error) => {
      console.log('Registration error:', err.message);
      setError(err.message.includes('already') ? t.auth.errorEmailExists : err.message);
    },
  });

  const handleSubmit = () => {
    setError(null);
    setSuccessMessage(null);
    if (isRegister) {
      signUpMutation.mutate();
    } else {
      signInMutation.mutate();
    }
  };

  const isLoading = signInMutation.isPending || signUpMutation.isPending;
  const isValid = email.length > 0 && password.length >= 6 && (!isRegister || username.length > 0);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://rork.app/pa/ywfta2lsth7893gaf5mzw/logo.png' }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>{t.app.title}</Text>
          <Text style={styles.subtitle}>{t.app.subtitle}</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>
            {isRegister ? t.auth.register : t.auth.login}
          </Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {successMessage && (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          )}

          {isRegister && (
            <>
              <View style={styles.inputContainer}>
                <User size={20} color={darkTheme.colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t.auth.username}
                  placeholderTextColor={darkTheme.colors.textMuted}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  testID="username-input"
                />
              </View>

              <View style={styles.inputContainer}>
                <User size={20} color={darkTheme.colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t.auth.fullName}
                  placeholderTextColor={darkTheme.colors.textMuted}
                  value={fullName}
                  onChangeText={setFullName}
                  testID="fullname-input"
                />
              </View>
            </>
          )}

          <View style={styles.inputContainer}>
            <Mail size={20} color={darkTheme.colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t.auth.email}
              placeholderTextColor={darkTheme.colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              testID="email-input"
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color={darkTheme.colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t.auth.password}
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

          <TouchableOpacity
            style={[styles.submitButton, !isValid && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!isValid || isLoading}
            testID="submit-button"
          >
            {isLoading ? (
              <ActivityIndicator color={darkTheme.colors.text} />
            ) : (
              <Text style={styles.submitButtonText}>
                {isRegister ? t.auth.register : t.auth.login}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => {
              setIsRegister(!isRegister);
              setError(null);
              setSuccessMessage(null);
            }}
          >
            <Text style={styles.switchText}>
              {isRegister ? t.auth.hasAccount : t.auth.noAccount}
            </Text>
            <Text style={styles.switchTextBold}>
              {isRegister ? t.auth.login : t.auth.register}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: darkTheme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: darkTheme.spacing.xxl,
  },
  logoContainer: {
    width: 120,
    height: 120,
    marginBottom: darkTheme.spacing.lg,
    backgroundColor: darkTheme.colors.surface,
    borderRadius: darkTheme.borderRadius.xl,
    padding: darkTheme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: darkTheme.fontSize.xxxl,
    fontWeight: darkTheme.fontWeight.bold,
    color: darkTheme.colors.terracotta,
    marginBottom: darkTheme.spacing.sm,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: darkTheme.fontSize.md,
    color: darkTheme.colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    backgroundColor: darkTheme.colors.surface,
    borderRadius: darkTheme.borderRadius.xl,
    padding: darkTheme.spacing.xl,
    borderWidth: 2,
    borderColor: darkTheme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  formTitle: {
    fontSize: darkTheme.fontSize.xxl,
    fontWeight: darkTheme.fontWeight.bold,
    color: darkTheme.colors.terracotta,
    marginBottom: darkTheme.spacing.xl,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: darkTheme.colors.error + '15',
    borderRadius: darkTheme.borderRadius.md,
    padding: darkTheme.spacing.md,
    marginBottom: darkTheme.spacing.md,
    borderWidth: 1,
    borderColor: darkTheme.colors.error + '40',
  },
  errorText: {
    color: darkTheme.colors.errorDark,
    fontSize: darkTheme.fontSize.sm,
    textAlign: 'center',
    fontWeight: darkTheme.fontWeight.medium,
  },
  successContainer: {
    backgroundColor: darkTheme.colors.success + '15',
    borderRadius: darkTheme.borderRadius.md,
    padding: darkTheme.spacing.md,
    marginBottom: darkTheme.spacing.md,
    borderWidth: 1,
    borderColor: darkTheme.colors.success + '40',
  },
  successText: {
    color: darkTheme.colors.successDark,
    fontSize: darkTheme.fontSize.sm,
    textAlign: 'center',
    fontWeight: darkTheme.fontWeight.medium,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkTheme.colors.backgroundSecondary,
    borderRadius: darkTheme.borderRadius.lg,
    marginBottom: darkTheme.spacing.md,
    borderWidth: 2,
    borderColor: darkTheme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginLeft: darkTheme.spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: darkTheme.spacing.md + 2,
    paddingHorizontal: darkTheme.spacing.md,
    color: darkTheme.colors.text,
    fontSize: darkTheme.fontSize.md,
  },
  eyeButton: {
    padding: darkTheme.spacing.md,
  },
  submitButton: {
    backgroundColor: darkTheme.colors.terracotta,
    borderRadius: darkTheme.borderRadius.lg,
    paddingVertical: darkTheme.spacing.md + 4,
    alignItems: 'center',
    marginTop: darkTheme.spacing.md,
    shadowColor: darkTheme.colors.terracotta,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: darkTheme.colors.surface,
    fontSize: darkTheme.fontSize.lg,
    fontWeight: darkTheme.fontWeight.bold,
    letterSpacing: 0.5,
  },
  switchButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: darkTheme.spacing.xl,
    gap: darkTheme.spacing.xs,
  },
  switchText: {
    color: darkTheme.colors.textSecondary,
    fontSize: darkTheme.fontSize.md,
  },
  switchTextBold: {
    color: darkTheme.colors.terracotta,
    fontSize: darkTheme.fontSize.md,
    fontWeight: darkTheme.fontWeight.bold,
  },
});
