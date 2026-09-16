/**
 * 올케어환경 사이트 글로벌 설정
 */
export interface BusinessInfo {
  businessName?: string;
  representative?: string;
  businessNumber?: string;
  address?: string;
  /** 구 버전 호환용 alias */
  companyName?: string;
  registrationNumber?: string;
}

export interface ContactInfo {
  phone: string;
  kakaoUrl: string;
}

export interface VerificationInfo {
  businessVerified: boolean;
  phoneVerified: boolean;
  kakaoVerified: boolean;
}

export interface SiteConfig {
  brandName: string;
  siteOrigin: string;
  appEnv: 'preview' | 'production';
  business: BusinessInfo;
  contact: ContactInfo;
  verification: VerificationInfo;
  // 하위 호환용 헬퍼 게터
  readonly contactPhone: string;
  readonly contactSmsPhone: string;
}

/**
 * 환경별 SITE_ORIGIN 검증 및 획득 함수
 */
export function resolveSiteOrigin(env: NodeJS.ProcessEnv = process.env): string {
  const rawOrigin = env.SITE_ORIGIN || env.NEXT_PUBLIC_SITE_ORIGIN;
  const isProduction = env.NODE_ENV === 'production';

  // Vercel 기본/프리뷰 도메인(*.vercel.app)이 환경변수에 남아있는 경우 공식 프로덕션 도메인으로 엄격 보정
  if (rawOrigin && rawOrigin.includes('vercel.app')) {
    return 'https://www.allcarehg.co.kr';
  }

  if (!rawOrigin || rawOrigin.trim() === '') {
    if (isProduction) {
      throw new Error(
        'CRITICAL CONFIG ERROR: "SITE_ORIGIN" (or NEXT_PUBLIC_SITE_ORIGIN) environment variable is required in production mode. ' +
        'Localhost fallback is strictly forbidden in production to prevent leaking invalid Canonical / Sitemap URLs.'
      );
    }
    return 'http://localhost:3000';
  }

  return rawOrigin.trim().replace(/\/+$/, '');
}

/**
 * 연락처가 실제 유효하게 설정되었는지 검증 (미입력 또는 더미/가짜 번호 판별)
 */
export function hasValidContactPhone(phone?: string): boolean {
  if (!phone) return false;
  const clean = phone.trim().replace(/[-\s]/g, '');
  // 빈 문자열이거나 0만 연속되거나 더미 번호 패턴인 경우 유효하지 않음
  if (clean === '' || /^0+$/.test(clean)) return false;
  if (
    clean === '16660000' ||
    clean === '15880000' ||
    clean === '01000000000' ||
    clean === '0000000000' ||
    clean.endsWith('00000000') ||
    clean.endsWith('0000')
  ) {
    return false;
  }
  return clean.length >= 8 && /^[0-9]+$/.test(clean);
}

/**
 * 카카오톡 채널 URL 유효성 검증 (미입력 또는 더미 URL 판별)
 */
export function hasValidKakaoUrl(url?: string): boolean {
  if (!url) return false;
  const clean = url.trim();
  if (
    clean === '' ||
    clean === '#' ||
    clean.includes('example.com') ||
    clean.startsWith('javascript:')
  ) {
    return false;
  }
  return (
    clean.startsWith('https://open.kakao.com/') ||
    clean.startsWith('https://pf.kakao.com/') ||
    clean.startsWith('http://') ||
    clean.startsWith('https://')
  );
}

export function getSiteConfig(env: NodeJS.ProcessEnv = process.env): SiteConfig {
  const isBusinessVerified = env.BUSINESS_VERIFIED === 'true';
  const isPhoneVerified = env.PHONE_VERIFIED === 'true';
  const isKakaoVerified = env.KAKAO_VERIFIED === 'true';

  const appEnv: 'preview' | 'production' =
    env.APP_ENV === 'production' ? 'production' : 'preview';

  const phone = env.CONTACT_PHONE || env.NEXT_PUBLIC_CONTACT_PHONE || '';
  const kakaoUrl = env.CONTACT_KAKAO_URL || env.NEXT_PUBLIC_CONTACT_KAKAO_URL || '';

  const bName = env.BUSINESS_NAME || env.NEXT_PUBLIC_BUSINESS_NAME || '';
  const bRep = env.BUSINESS_REP || env.NEXT_PUBLIC_BUSINESS_REP || '';
  const bReg = env.BUSINESS_REG_NO || env.NEXT_PUBLIC_BUSINESS_REG_NO || '';
  const bAddr = env.BUSINESS_ADDRESS || env.NEXT_PUBLIC_BUSINESS_ADDRESS || '';

  return {
    brandName: '올케어환경',
    siteOrigin: resolveSiteOrigin(env),
    appEnv,
    business: {
      businessName: bName,
      representative: bRep,
      businessNumber: bReg,
      address: bAddr,
      companyName: bName,
      registrationNumber: bReg,
    },
    contact: {
      phone,
      kakaoUrl,
    },
    verification: {
      businessVerified: isBusinessVerified,
      phoneVerified: isPhoneVerified,
      kakaoVerified: isKakaoVerified,
    },
    get contactPhone() {
      return phone;
    },
    get contactSmsPhone() {
      return '';
    },
  };
}

export const SITE_CONFIG: SiteConfig = getSiteConfig(process.env);

/**
 * 절대 경로 URL 조합 헬퍼
 */
export function getAbsoluteUrl(path: string, env: NodeJS.ProcessEnv = process.env): string {
  const origin = resolveSiteOrigin(env);
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${cleanPath}`;
}
