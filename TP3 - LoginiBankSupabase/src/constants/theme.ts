export const Colors = {
  // Primarios oficiales iBank (Figma frame node-id=2-20347)
  primary: '#3629B7',          // Primary / 1
  primaryDark: '#281E91',
  primarySecondary: '#5655B9', // Primary / 2
  primaryLight: '#E5E2FF',     // Lavender accent circle
  primaryDisabled: '#F2F1F9',  // Primary / 4 (usado para backgrounds y botón disabled)
  primaryBorder: '#D8D4FF',

  // Neutros oficiales
  text: '#343434',             // Neutral / 1
  textSecondary: '#64748B',    // Subtítulos
  textMuted: '#CACACA',        // Neutral / 4 (placeholders, iconos pasivos)
  textInverse: '#FFFFFF',      // Neutral / 6

  // Fondos y bordes
  background: '#3629B7',       // Header superior
  sheetBg: '#FFFFFF',          // Rectangle 33
  screenBg: '#F8FAFC',         // Fondo general claro para dashboard
  card: '#FFFFFF',
  cardBorder: '#F0F0F5',
  inputBg: '#FFFFFF',
  inputBorder: '#CBCBCB',      // Border field default
  inputFocusBorder: '#3629B7',
  inputDisabledBg: '#F2F1F9',

  // Semánticos oficiales del kit
  error: '#FF4267',            // Semantic / 1
  errorLight: '#FFF0F3',
  errorBorder: '#FFCCD5',

  info: '#0890FE',             // Semantic / 2
  infoLight: '#EBF6FF',
  infoBorder: '#BAE0FF',

  warning: '#FFAF2A',          // Semantic / 3
  warningLight: '#FFF8EB',
  warningBorder: '#FFE2B0',

  success: '#52D5BA',          // Semantic / 4
  successLight: '#EDFAF7',
  successBorder: '#B2EFE2',

  // Colores bancarios complementarios
  navyDark: '#1E1B4B',
  navyLight: '#312E81',
}

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
}

export const Radius = {
  sm: 6,
  md: 10,
  button: 15, // Figma button border-radius: 15px
  input: 15,  // Figma text field border-radius: 15px
  sheet: 30,  // Figma Rectangle 33 border-radius: 30px 30px 0px 0px
  lg: 15,
  xl: 20,
  xxl: 30,
  full: 9999,
}

export const Typography = {
  fontFamily: {
    regular: 'Poppins_400Regular',
    medium: 'Poppins_500Medium',
    semiBold: 'Poppins_600SemiBold',
    bold: 'Poppins_700Bold',
  },
  sizes: {
    caption: 12,   // Caption / 2: 12px
    input: 14,     // Body / 3: 14px
    body: 14,
    button: 16,    // Body / 1: 16px
    navTitle: 20,  // Title / 2: 20px
    title: 24,     // Title / 1: 24px
  },
}
