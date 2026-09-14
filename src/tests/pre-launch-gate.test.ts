import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  runPreLaunchValidation,
  validateSiteOrigin,
  validateContactPhone,
  validateKakaoUrl,
  validateBusinessInfo,
  validateHeroAsset,
  validateFinalCtaAsset,
  validateFaviconAsset,
  validateOgImageAsset,
} from '@/engine/pre-launch-validator';
import { SiteConfig } from '@/config/site';

describe('STEP 4-C Preview Safety Lock & Pre-Launch Validation Gates', () => {
  describe('1. SITE_ORIGIN Production Gate', () => {
    it('localhost, 127.0.0.1, example.com, placeholder 등은 Production에서 거부되어야 한다 (FAIL)', () => {
      assert.strictEqual(validateSiteOrigin('http://localhost:3000').status, 'FAIL');
      assert.strictEqual(validateSiteOrigin('http://127.0.0.1:3000').status, 'FAIL');
      assert.strictEqual(validateSiteOrigin('https://example.com').status, 'FAIL');
      assert.strictEqual(validateSiteOrigin('https://placeholder-domain.com').status, 'FAIL');
      assert.strictEqual(validateSiteOrigin('').status, 'FAIL');
    });

    it('http:// 프로토콜은 Production에서 거부되어야 한다 (FAIL)', () => {
      assert.strictEqual(validateSiteOrigin('http://allcare-clean.co.kr').status, 'FAIL');
    });

    it('실제 정식 https:// 도메인은 통과되어야 한다 (READY)', () => {
      assert.strictEqual(validateSiteOrigin('https://allcare-clean.co.kr').status, 'READY');
      assert.strictEqual(validateSiteOrigin('https://allcare-suwon.kr').status, 'READY');
    });
  });

  describe('2. Contact Phone & Kakao Production Safety Gate', () => {
    it('phoneVerified가 false이면 Production 상태는 PENDING이어야 한다', () => {
      const res = validateContactPhone('031-200-0001', false);
      assert.strictEqual(res.status, 'PENDING');
    });

    it('phoneVerified가 true라도 더미 번호면 FAIL이어야 한다', () => {
      const res = validateContactPhone('1666-0000', true);
      assert.strictEqual(res.status, 'FAIL');
    });

    it('phoneVerified가 true이고 유효 번호면 READY여야 한다', () => {
      const res = validateContactPhone('031-234-5678', true);
      assert.strictEqual(res.status, 'READY');
    });

    it('kakaoVerified가 false이면 Production 상태는 PENDING이어야 한다', () => {
      const res = validateKakaoUrl('https://open.kakao.com/o/sampleAllcare', false);
      assert.strictEqual(res.status, 'PENDING');
    });

    it('kakaoVerified가 true라도 더미/example URL이면 FAIL이어야 한다', () => {
      const res = validateKakaoUrl('https://example.com/kakao', true);
      assert.strictEqual(res.status, 'FAIL');
    });

    it('kakaoVerified가 true이고 정식 카카오 URL이면 READY여야 한다', () => {
      const res = validateKakaoUrl('https://open.kakao.com/o/sRealKakao123', true);
      assert.strictEqual(res.status, 'READY');
    });
  });

  describe('3. Business Info Production Gate', () => {
    it('businessVerified가 false이면 Production 상태는 PENDING이어야 한다', () => {
      const business = {
        businessName: '올케어환경',
        representative: '홍길동',
        businessNumber: '123-45-67890',
        address: '경기도 수원시 팔달구 효원로 1',
      };
      const res = validateBusinessInfo(business, false);
      assert.strictEqual(res.status, 'PENDING');
    });

    it('businessVerified가 true라도 테스트 더미 정보(홍길동/123-45-67890)면 FAIL이어야 한다', () => {
      const business = {
        businessName: '올케어환경',
        representative: '홍길동',
        businessNumber: '123-45-67890',
        address: '경기도 수원시 팔달구 효원로 1',
      };
      const res = validateBusinessInfo(business, true);
      assert.strictEqual(res.status, 'FAIL');
    });

    it('businessVerified가 true이고 실제 정보면 READY여야 한다', () => {
      const business = {
        businessName: '올케어환경',
        representative: '김철수',
        businessNumber: '214-12-34567',
        address: '경기도 수원시 권선구 권선로 100',
      };
      const res = validateBusinessInfo(business, true);
      assert.strictEqual(res.status, 'READY');
    });
  });

  describe('4. Operator Assets Gate (Hero, Final CTA, Favicon, OG Image)', () => {
    it('미등록된 운영자 실제 에셋은 PENDING 상태로 안전하게 보고되어야 한다', () => {
      assert.strictEqual(validateHeroAsset().status, 'PENDING');
      assert.strictEqual(validateFinalCtaAsset().status, 'PENDING');
      assert.strictEqual(validateFaviconAsset().status, 'PENDING');
      assert.strictEqual(validateOgImageAsset().status, 'PENDING');
    });
  });

  describe('5. Comprehensive Pre-Launch Validation Result', () => {
    it('현재 Preview 환경 기본 상태에서는 PREVIEW READY=true, PRODUCTION READY=false 여야 한다', () => {
      const report = runPreLaunchValidation();
      assert.strictEqual(report.previewReady, true, 'Preview는 개발/검수 목적으로 READY여야 함');
      assert.strictEqual(report.productionReady, false, '임시 정보와 에셋 미등록 상태에서는 Production Ready가 NO여야 함');
      assert.ok(report.summary.includes('PRODUCTION READY = NO'));
    });

    it('모든 항목이 검증된 완전한 상태일 때만 PRODUCTION READY=true가 반환되어야 한다', () => {
      const mockProdConfig: SiteConfig = {
        brandName: '올케어환경',
        siteOrigin: 'https://allcare-clean.co.kr',
        appEnv: 'production',
        business: {
          businessName: '올케어환경',
          representative: '김철수',
          businessNumber: '214-12-34567',
          address: '경기도 수원시 권선구 권선로 100',
        },
        contact: {
          phone: '031-234-5678',
          kakaoUrl: 'https://open.kakao.com/o/sRealKakao123',
        },
        verification: {
          businessVerified: true,
          phoneVerified: true,
          kakaoVerified: true,
        },
        get contactPhone() {
          return '031-234-5678';
        },
        get contactSmsPhone() {
          return '';
        },
      };

      // 에셋이 아직 물리 파일로 등록되지 않은 상태에서는 mockConfig라도 에셋 항목 때문에 false
      const report = runPreLaunchValidation(mockProdConfig);
      assert.strictEqual(report.items.siteOrigin.status, 'READY');
      assert.strictEqual(report.items.contactPhone.status, 'READY');
      assert.strictEqual(report.items.kakaoChannel.status, 'READY');
      assert.strictEqual(report.items.businessInfo.status, 'READY');
      assert.strictEqual(report.items.heroImage.status, 'PENDING'); // 실제 에셋 파일 대기
      assert.strictEqual(report.productionReady, false);
    });
  });
});
