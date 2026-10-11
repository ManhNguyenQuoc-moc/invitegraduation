import type { ThemeConfig } from 'antd';

export const antdThemeConfig: ThemeConfig = {
  token: {
    // Brand Palette Tokens
    colorPrimary: '#D4AF37', // Classic Gold
    colorInfo: '#E0A96D',    // Rose Gold Accent
    colorSuccess: '#10B981',
    colorWarning: '#F59E0B',
    colorError: '#EF4444',
    colorBgBase: '#FAFAFC',
    colorTextBase: '#1A1A24',
    
    // Typography - Sans Serif Theme
    fontFamily: `'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
    fontSize: 14,
    borderRadius: 8,
    borderRadiusLG: 14,
    borderRadiusSM: 6,

    // Controls Height
    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,

    // Elevation & Shadows
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
    boxShadowSecondary: '0 10px 25px -5px rgba(224, 169, 109, 0.2)',
  },
  components: {
    Button: {
      colorPrimary: '#D4AF37',
      colorPrimaryHover: '#B59226',
      colorPrimaryActive: '#94761C',
      fontWeight: 600,
      borderRadius: 9999,
      paddingInline: 20,
    },
    Input: {
      activeBorderColor: '#E0A96D',
      hoverBorderColor: '#E0A96D',
      paddingBlock: 8,
      paddingInline: 14,
    },
    Select: {
      activeBorderColor: '#E0A96D',
      hoverBorderColor: '#E0A96D',
    },
    Table: {
      headerBg: '#F8F9FA',
      headerColor: '#1A1A24',
      rowHoverBg: '#FFFDF9',
      borderRadius: 12,
    },
    Card: {
      borderRadiusLG: 16,
      boxShadowTertiary: '0 4px 20px rgba(0, 0, 0, 0.05)',
    },
    Modal: {
      borderRadiusLG: 20,
      contentBg: '#FFFFFF',
    },
    Tag: {
      borderRadiusSM: 6,
    },
  },
};
