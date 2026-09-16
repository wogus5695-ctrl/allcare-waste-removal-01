export type ServiceFamilyType = 'WASTE' | 'DEMOLITION';

export interface HeroThemeConfig {
  serviceFamily: ServiceFamilyType;
  /**
   * 실제 운영자 현장 사진 경로 (예: '/images/hero/waste-hero.webp')
   * 현재 미제공 상태이므로 빈 문자열('')로 유지하여 깨진 이미지 발생 방지 및 Fallback Gradient 가동
   */
  bgImage?: string;
  /** 데스크톱 배경 focal-point position (기본: 'right center') */
  desktopPosition?: string;
  /** 모바일 배경 focal-point position (기본: 'center top') */
  mobilePosition?: string;
  /** 데스크톱 배경 transform (scale, translateX 등 정밀 이동용) */
  desktopTransform?: string;
  /** 모바일 배경 transform */
  mobileTransform?: string;
}

/**
 * 서비스 버티컬별 HERO 배경 이미지 및 테마 설정
 * - 운영자 실제 현장 사진 수령 시 bgImage 경로 1개만 지정하면 즉시 안전하게 적용됩니다.
 * - 이미지가 없을 경우 Deep Navy + Brand Orange Accent의 정제된 폴백 그라디언트가 가동됩니다.
 */
export const HERO_THEMES: Record<ServiceFamilyType, HeroThemeConfig> = {
  WASTE: {
    serviceFamily: 'WASTE',
    bgImage: '/images/hero/waste-hero.webp',
    desktopPosition: '60% center',
    mobilePosition: '62% center',
    desktopTransform: 'none',
    mobileTransform: 'none',
  },
  DEMOLITION: {
    serviceFamily: 'DEMOLITION',
    bgImage: '/images/hero/demolition-hero.webp',
    desktopPosition: '64% center',
    mobilePosition: '52% center',
    desktopTransform: 'scale(1.05) translateX(5%)',
    mobileTransform: 'none',
  },
};

export function getHeroTheme(family: ServiceFamilyType): HeroThemeConfig {
  return HERO_THEMES[family] || HERO_THEMES.WASTE;
}

export interface ServiceSocialImageConfig {
  path: string;
  width: number;
  height: number;
  alt: string;
}

/**
 * 소셜 공유 및 검색 크롤러 호환용 대표 JPG 이미지 설정
 * (Hero UI는 WebP를 유지하고, 메타데이터는 범용 호환성을 위해 동일 원본의 JPG를 사용)
 */
export const SERVICE_SOCIAL_IMAGES: Record<ServiceFamilyType, ServiceSocialImageConfig> = {
  WASTE: {
    path: '/images/hero/waste-hero.jpg',
    width: 1024,
    height: 935,
    alt: '올케어환경 폐기물 수거 및 처리 서비스',
  },
  DEMOLITION: {
    path: '/images/hero/demolition-hero.jpg',
    width: 1024,
    height: 768,
    alt: '올케어환경 철거 서비스',
  },
};

export function getServiceSocialImage(family: ServiceFamilyType): ServiceSocialImageConfig {
  return SERVICE_SOCIAL_IMAGES[family] || SERVICE_SOCIAL_IMAGES.WASTE;
}
