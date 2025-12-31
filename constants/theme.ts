export const balinese = {
  colors: {
    background: '#F5F2ED',
    backgroundSecondary: '#E8E1D5',
    backgroundTertiary: '#F8F3EB',
    surface: '#FFFFFF',
    surfaceHover: '#FFF9F4',
    border: '#E8DCC8',
    borderLight: '#F0E6D6',
    
    text: '#2C3E3A',
    textSecondary: '#6B8E7F',
    textMuted: '#8D9B95',
    
    primary: '#6B8E7F',
    primaryLight: '#7FA88F',
    primaryDark: '#5A7A6D',
    primaryDarker: '#4A6B5E',
    
    success: '#7FA88F',
    successLight: '#9CCC65',
    successDark: '#689F38',
    
    warning: '#FFA726',
    warningLight: '#FFB74D',
    warningDark: '#FB8C00',
    
    error: '#B85C4F',
    errorLight: '#C77568',
    errorDark: '#A04A3E',
    
    info: '#5C6BC0',
    infoLight: '#7E57C2',
    infoDark: '#3F51B5',
    
    accent: '#C5A572',
    accentLight: '#D9B57A',
    accentDark: '#B8935C',
    
    gold: '#C5A572',
    antidote: '#C5A572',
    kept: '#7FA88F',
    broken: '#B85C4F',
    terracotta: '#B85C4F',
    cream: '#F5F2ED',
    brown: '#2C3E3A',
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
