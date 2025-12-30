export const balinese = {
  colors: {
    background: '#F5EFE7',
    backgroundSecondary: '#FDFAF6',
    backgroundTertiary: '#F8F3EB',
    surface: '#FFFFFF',
    surfaceHover: '#FFF9F4',
    border: '#E8DCC8',
    borderLight: '#F0E6D6',
    
    text: '#3E2723',
    textSecondary: '#6D4C41',
    textMuted: '#8D6E63',
    
    primary: '#D4834C',
    primaryLight: '#E09A68',
    primaryDark: '#B86F3E',
    
    success: '#7CB342',
    successLight: '#9CCC65',
    successDark: '#689F38',
    
    warning: '#FFA726',
    warningLight: '#FFB74D',
    warningDark: '#FB8C00',
    
    error: '#E53935',
    errorLight: '#EF5350',
    errorDark: '#C62828',
    
    info: '#5C6BC0',
    infoLight: '#7E57C2',
    infoDark: '#3F51B5',
    
    accent: '#C9A96E',
    accentLight: '#D9B57A',
    accentDark: '#B8935C',
    
    gold: '#C9A96E',
    terracotta: '#D4834C',
    cream: '#F5EFE7',
    brown: '#3E2723',
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

export const darkTheme = balinese;

export type Theme = typeof balinese;
