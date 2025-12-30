import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Label } from './ui/label';
import { Sparkles, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Language, t } from '../data/translations';
import { Alert, AlertDescription } from './ui/alert';
import logo from '@/assets/logo.png';
import { sanitizeEmail } from '../utils/sanitize';
import { validateEmail } from '../utils/validators';

interface LoginProps {
  onSignUp: (email: string, password: string, username: string) => Promise<{ error: any }>;
  onSignIn: (email: string, password: string) => Promise<{ error: any }>;
  onResetPassword: (email: string) => Promise<{ error: any }>;
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export function Login({ onSignUp, onSignIn, onResetPassword, language, onLanguageChange }: LoginProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'reset') {
        if (!email.trim()) {
          setError(t('fillAllFields', language));
          return;
        }

        try {
          const sanitizedEmail = sanitizeEmail(email);
          const { error } = await onResetPassword(sanitizedEmail);
          if (error) {
            setError(error.message || t('invalidEmail', language));
          } else {
            setSuccess(t('resetLinkSent', language));
            setTimeout(() => setMode('login'), 3000);
          }
        } catch (err: any) {
          setError(t('invalidEmail', language));
        }
      } else if (mode === 'register') {
        if (!password.trim() || !email.trim()) {
          setError(t('fillAllFields', language));
          return;
        }

        // Validate email format for registration
        if (!validateEmail(email.trim())) {
          setError(language === 'ru' 
            ? 'Пожалуйста, введите корректный email адрес' 
            : 'Please enter a valid email address');
          return;
        }

        try {
          const sanitizedEmail = sanitizeEmail(email);
          // Generate username from email (part before @)
          const generatedUsername = sanitizedEmail.split('@')[0];

          const { error } = await onSignUp(sanitizedEmail, password, generatedUsername);
          if (error) {
            setError(error.message || t('usernameExists', language));
          }
        } catch (err: any) {
          setError(err.message || t('invalidEmail', language));
        }
      } else {
        // Login mode - only need email and password
        if (!email.trim() || !password.trim()) {
          setError(t('fillAllFields', language));
          return;
        }

        // Validate email format
        if (!validateEmail(email.trim())) {
          setError(language === 'ru' 
            ? 'Пожалуйста, введите корректный email адрес' 
            : 'Please enter a valid email address');
          return;
        }

        try {
          const sanitizedEmail = sanitizeEmail(email);
          const { error } = await onSignIn(sanitizedEmail, password);
          if (error) {
            setError(error.message || t('invalidCredentials', language));
          }
        } catch (err: any) {
          setError(t('invalidEmail', language));
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-vow-primary via-vow-primary-dark to-vow-primary-darker p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-vow-antidote rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-vow-bg-accent rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

      <div className="w-full max-w-md relative">
        {/* Language Switcher - above card */}
        <div className="flex justify-end mb-3 px-2">
          <div className="flex gap-2">
            <button
              onClick={() => onLanguageChange('ru')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                language === 'ru'
                  ? 'bg-white/95 text-vow-text-primary shadow-lg'
                  : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
              }`}
            >
              РУ
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                language === 'en'
                  ? 'bg-white/95 text-vow-text-primary shadow-lg'
                  : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        <Card className="w-full shadow-2xl border-0 backdrop-blur-sm bg-white/95 rounded-3xl">
        <CardHeader className="text-center space-y-4 pb-6 pt-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 flex items-center justify-center">
              <img src={logo} alt="Logo" className="w-20 h-20 object-contain" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl md:text-4xl text-vow-text-primary">
              {mode === 'reset' ? t('resetPasswordTitle', language) : t('appTitle', language)}
            </CardTitle>
            <CardDescription className="text-base text-vow-text-secondary">
              {mode === 'reset' ? t('resetPasswordDesc', language) : t('appSubtitle', language)}
            </CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 px-6 md:px-8">
            {error && (
              <Alert className="bg-red-50 border-red-200 rounded-2xl">
                <AlertDescription className="text-red-800 text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 border-green-200 rounded-2xl">
                <AlertDescription className="text-green-800 text-sm">
                  {success}
                </AlertDescription>
              </Alert>
            )}


            {mode !== 'login' && (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-vow-text-primary">{t('email', language)}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('enterEmail', language)}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-base h-12"
                  required
                />
              </div>
            )}

            {mode === 'login' && (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-vow-text-primary">{t('email', language)}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('enterEmail', language)}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-base h-12"
                  required
                />
              </div>
            )}

            {mode !== 'reset' && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-vow-text-primary">{t('password', language)}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('enterPassword', language)}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-with-icon h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-vow-text-secondary hover:text-vow-text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 px-6 md:px-8 pb-8">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 btn-primary disabled:opacity-50"
            >
              {mode === 'reset' ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  {t('sendResetLink', language)}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  {mode === 'register' ? t('createAccount', language) : t('startPractice', language)}
                </>
              )}
            </Button>

            {mode === 'reset' ? (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                  setSuccess('');
                }}
                className="text-sm text-vow-text-secondary hover:text-vow-text-primary transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('backToLogin', language)}
              </button>
            ) : (
              <div className="flex flex-col gap-2 w-full items-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'register' ? 'login' : 'register');
                    setError('');
                    setSuccess('');
                    setEmail('');
                  }}
                  className="text-sm text-vow-text-secondary hover:text-vow-text-primary transition-colors"
                >
                  {mode === 'register' ? t('haveAccount', language) : t('noAccount', language)}
                  <span className="ml-1 text-vow-primary">
                    {mode === 'register' ? t('login', language) : t('register', language)}
                  </span>
                </button>
                
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('reset');
                      setError('');
                      setSuccess('');
                    }}
                    className="text-sm text-vow-primary hover:text-vow-text-primary transition-colors"
                  >
                    {t('forgotPassword', language)}
                  </button>
                )}
              </div>
            )}
          </CardFooter>
        </form>
      </Card>
      </div>
    </div>
  );
}
