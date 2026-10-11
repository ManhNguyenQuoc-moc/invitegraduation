export interface IBlockThemeConfig {
  bgColor: string;
  textColor: string;
  accentColor: string;
  cardBgColor: string;
  borderColor: string;
}

export interface IBlockVariantConfig {
  id: string; // 'vip-banner', 'hero', 'memories', 'journey', 'guestbook', 'dedication'
  name: string;
  enabled: boolean;
  variant: 'style-1' | 'style-2' | 'style-3';
  theme: IBlockThemeConfig;
  elements: {
    avatarUrl?: string;
    bgImageUrl?: string;
    imageShape?: 'rounded' | 'square' | 'circle';
    titleCustom?: string;
    subtitleCustom?: string;
    qrUrl?: string;
  };
}

export const DEFAULT_BLOCKS_CONFIG: Record<string, IBlockVariantConfig> = {
  'hero': {
    id: 'hero',
    name: 'Hero Tân Cử Nhân & Đếm Ngược',
    enabled: true,
    variant: 'style-1',
    theme: {
      bgColor: '#ffffff',
      textColor: '#0f172a',
      accentColor: '#1d4ed8',
      cardBgColor: '#eff6ff',
      borderColor: '#bfdbfe',
    },
    elements: {
      avatarUrl: '/avatar-werewolf.png',
      imageShape: 'rounded',
      titleCustom: 'LỄ TRAO BẰNG CỬ NHÂN',
      subtitleCustom: 'Nguyễn Quốc Mạnh',
    }
  },
  'memories': {
    id: 'memories',
    name: 'Album Kỷ Niệm Thanh Xuân',
    enabled: true,
    variant: 'style-1',
    theme: {
      bgColor: '#ffffff',
      textColor: '#0f172a',
      accentColor: '#2563eb',
      cardBgColor: '#f8fafc',
      borderColor: '#e2e8f0',
    },
    elements: {
      titleCustom: 'ALBUM KỶ NIỆM',
    }
  },
  'journey': {
    id: 'journey',
    name: 'Hành Trình Học Tập (4 Năm Đại Học)',
    enabled: true,
    variant: 'style-1',
    theme: {
      bgColor: '#f8fafc',
      textColor: '#0f172a',
      accentColor: '#2563eb',
      cardBgColor: '#ffffff',
      borderColor: '#e2e8f0',
    },
    elements: {
      titleCustom: 'HÀNH TRÌNH HỌC TẬP',
    }
  },
  'guestbook': {
    id: 'guestbook',
    name: 'Sổ Lưu Bút Tốt Nghiệp',
    enabled: true,
    variant: 'style-1',
    theme: {
      bgColor: '#ffffff',
      textColor: '#0f172a',
      accentColor: '#2563eb',
      cardBgColor: '#f8fafc',
      borderColor: '#e2e8f0',
    },
    elements: {
      titleCustom: 'SỔ LƯU BÚT',
    }
  },
  'dedication': {
    id: 'dedication',
    name: 'Lời Tri Ân Cha Mẹ & Thầy Cô',
    enabled: true,
    variant: 'style-1',
    theme: {
      bgColor: '#ffffff',
      textColor: '#0f172a',
      accentColor: '#d97706',
      cardBgColor: '#fffbeb',
      borderColor: '#fde68a',
    },
    elements: {
      titleCustom: 'LỜI TRI ÂN SÂU SẮC',
    }
  }
};
