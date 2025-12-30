export const darkTheme = {
  colors: {
    background: '#0A0A0F',
    backgroundSecondary: '#12121A',
    backgroundTertiary: '#1A1A25',
    surface: '#1E1E2A',
    surfaceHover: '#252535',
    border: '#2A2A3A',
    borderLight: '#3A3A4A',
    
    text: '#FFFFFF',
    textSecondary: '#A0A0B0',
    textMuted: '#6A6A7A',
    
    primary: '#7C3AED',
    primaryLight: '#8B5CF6',
    primaryDark: '#6D28D9',
    
    success: '#10B981',
    successLight: '#34D399',
    successDark: '#059669',
    
    warning: '#F59E0B',
    warningLight: '#FBBF24',
    warningDark: '#D97706',
    
    error: '#EF4444',
    errorLight: '#F87171',
    errorDark: '#DC2626',
    
    info: '#3B82F6',
    infoLight: '#60A5FA',
    infoDark: '#2563EB',
    
    accent: '#06B6D4',
    accentLight: '#22D3EE',
    accentDark: '#0891B2',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export type Theme = typeof darkTheme;
