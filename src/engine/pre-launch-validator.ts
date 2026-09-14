import fs from 'node:fs';
import path from 'node:path';
import { SiteConfig, SITE_CONFIG, hasValidContactPhone, hasValidKakaoUrl } from '@/config/site';

export type GateStatus = 'READY' | 'PENDING' | 'FAIL';

export interface GateItemResult {
  name: string;
  status: GateStatus;
  message: string;
  isBlockerForProduction: boolean;
}

export interface PreLaunchValidationReport {
  mode: 'preview' | 'production';
  items: Record<string, GateItemResult>;
  previewReady: boolean;
  productionReady: boolean;
  summary: string;
}

/**
 * SITE_ORIGIN의 Production 적격성 검증
 */
export function validateSiteOrigin(origin: string): { status: GateStatus; message: string } {
  if (!origin || origin.trim() === '') {
    return { status: 'FAIL', message: 'SITE_ORIGIN이 설정되지 않았습니다.' };
  }
  const clean = origin.trim().toLowerCase();
  if (
    clean.includes('localhost') ||
    clean.includes('127.0.0.1') ||
    clean.includes('0.0.0.0') ||
    clean.includes('example.com') ||
    clean.includes('placeholder')
  ) {
    return {
      status: 'FAIL',
      message: `임시/로컬 도메인이 감지되었습니다 (${origin}). 실제 서비스 HTTPS 도메인이 필요합니다.`,
    };
  }
  if (!clean.startsWith('https://')) {
    return {
      status: 'FAIL',
      message: `보안되지 않은 프로토콜입니다 (${origin}). Production은 https:// 여야 합니다.`,
    };
  }
  return { status: 'READY', message: `유효한 Production 도메인: ${origin}` };
}

/**
 * 대표 전화번호 검증
 */
export function validateContactPhone(phone: string, isVerified: boolean): { status: GateStatus; message: string } {
  if (!isVerified) {
    return {
      status: 'PENDING',
      message: `전화번호 미검증 상태 (PHONE_VERIFIED=false, 현재값: "${phone || '미설정'}").`,
    };
  }
  if (!hasValidContactPhone(phone)) {
    return {
      status: 'FAIL',
      message: `유효하지 않거나 더미 전화번호 형식입니다 ("${phone}").`,
    };
  }
  return { status: 'READY', message: `검증된 대표 전화번호: ${phone}` };
}

/**
 * 카카오톡 채널 URL 검증
 */
export function validateKakaoUrl(url: string, isVerified: boolean): { status: GateStatus; message: string } {
  if (!isVerified) {
    return {
      status: 'PENDING',
      message: `카카오톡 채널 미검증 상태 (KAKAO_VERIFIED=false, 현재값: "${url || '미설정'}").`,
    };
  }
  if (!hasValidKakaoUrl(url)) {
    return {
      status: 'FAIL',
      message: `유효하지 않거나 더미 카카오톡 URL입니다 ("${url}").`,
    };
  }
  return { status: 'READY', message: `검증된 카카오톡 채널: ${url}` };
}

/**
 * 사업자 등록 정보 검증
 */
export function validateBusinessInfo(
  business: SiteConfig['business'],
  isVerified: boolean
): { status: GateStatus; message: string } {
  if (!isVerified) {
    return {
      status: 'PENDING',
      message: `사업자등록정보 미검증 상태 (BUSINESS_VERIFIED=false, 현재 상호: "${business.businessName || '미설정'}").`,
    };
  }
  if (!business.businessName || !business.representative || !business.businessNumber || !business.address) {
    return {
      status: 'FAIL',
      message: '필수 사업자 정보(상호, 대표자, 등록번호, 주소) 중 일부가 누락되었습니다.',
    };
  }
  // 더미 패턴 검출
  if (
    business.businessNumber === '123-45-67890' ||
    business.representative === '홍길동' ||
    business.businessNumber.includes('000-00')
  ) {
    return {
      status: 'FAIL',
      message: `임시 테스트용 사업자 정보가 감지되었습니다 (${business.representative} / ${business.businessNumber}).`,
    };
  }
  return { status: 'READY', message: `검증된 사업자 정보 (${business.businessName}, ${business.representative})` };
}

/**
 * 운영자 실제 파일 에셋 존재 여부 확인 헬퍼
 */
function checkPublicAssetExists(relativePath: string): boolean {
  try {
    const fullPath = path.join(process.cwd(), 'public', relativePath);
    return fs.existsSync(fullPath);
  } catch {
    return false;
  }
}

/**
 * Hero 대표 이미지 에셋 검증
 */
export function validateHeroAsset(customPath?: string): { status: GateStatus; message: string } {
  const assetPath = customPath || 'images/hero-representative.jpg';
  const exists = checkPublicAssetExists(assetPath);
  if (!exists) {
    return {
      status: 'PENDING',
      message: `운영자 제공 Hero 대표 이미지 미등록 (대기 경로: public/${assetPath}). 현재 UI는 ImagePlaceholder로 보호됩니다.`,
    };
  }
  return { status: 'READY', message: `운영자 Hero 이미지 확인 완료 (public/${assetPath})` };
}

/**
 * Final CTA 대표 이미지 에셋 검증
 */
export function validateFinalCtaAsset(customPath?: string): { status: GateStatus; message: string } {
  const assetPath = customPath || 'images/final-cta.jpg';
  const exists = checkPublicAssetExists(assetPath);
  if (!exists) {
    return {
      status: 'PENDING',
      message: `운영자 제공 Final CTA 이미지 미등록 (대기 경로: public/${assetPath}). 현재 UI는 ImagePlaceholder로 보호됩니다.`,
    };
  }
  return { status: 'READY', message: `운영자 Final CTA 이미지 확인 완료 (public/${assetPath})` };
}

/**
 * Favicon 에셋 검증
 */
export function validateFaviconAsset(): { status: GateStatus; message: string } {
  const icoExists = checkPublicAssetExists('favicon.ico');
  const pngExists = checkPublicAssetExists('favicon.png');
  const svgExists = checkPublicAssetExists('favicon.svg');
  if (!icoExists && !pngExists && !svgExists) {
    return {
      status: 'PENDING',
      message: '운영자 제공 파비콘 미등록 (public/favicon.ico 또는 .png/.svg 대기).',
    };
  }
  return { status: 'READY', message: '운영자 파비콘 등록 완료' };
}

/**
 * OG / Naver 썸네일 이미지 검증
 */
export function validateOgImageAsset(customPath?: string): { status: GateStatus; message: string } {
  const assetPath = customPath || 'images/og-image.jpg';
  const exists = checkPublicAssetExists(assetPath);
  if (!exists) {
    return {
      status: 'PENDING',
      message: `네이버/카카오 공유 썸네일(og:image) 미등록 (대기 경로: public/${assetPath}).`,
    };
  }
  return { status: 'READY', message: `OG 대표 썸네일 확인 완료 (public/${assetPath})` };
}

/**
 * STEP 4-C 종합 Production Pre-Launch Validation 게이트
 */
export function runPreLaunchValidation(config: SiteConfig = SITE_CONFIG): PreLaunchValidationReport {
  const mode = config.appEnv;

  const siteOriginRes = validateSiteOrigin(config.siteOrigin);
  const phoneRes = validateContactPhone(config.contact.phone, config.verification.phoneVerified);
  const kakaoRes = validateKakaoUrl(config.contact.kakaoUrl, config.verification.kakaoVerified);
  const businessRes = validateBusinessInfo(config.business, config.verification.businessVerified);
  const heroAssetRes = validateHeroAsset();
  const finalCtaAssetRes = validateFinalCtaAsset();
  const faviconRes = validateFaviconAsset();
  const ogImageRes = validateOgImageAsset();

  const items: Record<string, GateItemResult> = {
    siteOrigin: {
      name: 'SITE_ORIGIN 검증',
      status: siteOriginRes.status,
      message: siteOriginRes.message,
      isBlockerForProduction: true,
    },
    businessInfo: {
      name: '사업자등록 정보 검증',
      status: businessRes.status,
      message: businessRes.message,
      isBlockerForProduction: true,
    },
    contactPhone: {
      name: '대표 전화번호 검증',
      status: phoneRes.status,
      message: phoneRes.message,
      isBlockerForProduction: true,
    },
    kakaoChannel: {
      name: '카카오톡 채널 URL 검증',
      status: kakaoRes.status,
      message: kakaoRes.message,
      isBlockerForProduction: true,
    },
    heroImage: {
      name: 'Hero 대표 이미지 에셋',
      status: heroAssetRes.status,
      message: heroAssetRes.message,
      isBlockerForProduction: true,
    },
    finalCtaImage: {
      name: 'Final CTA 이미지 에셋',
      status: finalCtaAssetRes.status,
      message: finalCtaAssetRes.message,
      isBlockerForProduction: true,
    },
    favicon: {
      name: '브라우저 파비콘 에셋',
      status: faviconRes.status,
      message: faviconRes.message,
      isBlockerForProduction: true,
    },
    ogImage: {
      name: '네이버/SNS 썸네일(OG Image)',
      status: ogImageRes.status,
      message: ogImageRes.message,
      isBlockerForProduction: true,
    },
  };

  // Preview 판정: 핵심 기능 및 라우팅/UI 작동 가능 여부 (임시값 허용)
  const previewReady = true;

  // Production 판정: 모든 필수 항목이 READY 여야 함 (단 하나라도 PENDING 또는 FAIL 시 NO)
  const allReady = Object.values(items).every((it) => it.status === 'READY');
  const productionReady = allReady;

  let summary = '';
  if (productionReady) {
    summary = '모든 실운영 정보와 실제 에셋이 검증되었습니다. 실배포(Production) 전환 가능.';
  } else {
    const pendingOrFailed = Object.values(items)
      .filter((it) => it.status !== 'READY')
      .map((it) => `${it.name}(${it.status})`);
    summary = `운영자 실정보 및 에셋 대기 중: ${pendingOrFailed.join(', ')}. (PRODUCTION READY = NO)`;
  }

  return {
    mode,
    items,
    previewReady,
    productionReady,
    summary,
  };
}
