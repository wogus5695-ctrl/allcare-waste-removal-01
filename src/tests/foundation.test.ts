import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { P0_KEYWORDS, validateKeywordDataset, findKeywordByRouteKey } from '../data/keywords/p0-keywords';
import { INITIAL_REGION_FIXTURES, findRegionByRouteKey } from '../data/regions/initial-fixture';
import { resolveBaseRoute } from '../engine/resolver';
import { resolveSiteOrigin } from '../config/site';

describe('STEP 2-A Core Foundation Tests (Corrected)', () => {
  // A. Keyword Dataset Tests
  describe('A. Keyword Dataset', () => {
    it('총 14개의 P0 키워드가 등록되어 있어야 한다', () => {
      assert.equal(P0_KEYWORDS.length, 14);
    });

    it('keywordId 중복이 없어야 한다 (중복 = 0)', () => {
      const validation = validateKeywordDataset(P0_KEYWORDS);
      assert.deepEqual(validation.duplicateIds, []);
    });

    it('routeKey 중복이 없어야 한다 (중복 = 0)', () => {
      const validation = validateKeywordDataset(P0_KEYWORDS);
      assert.deepEqual(validation.duplicateRouteKeys, []);
    });

    it('모든 키워드의 priority는 P0이고 isActive, isIndexable이 true여야 한다', () => {
      for (const kw of P0_KEYWORDS) {
        assert.equal(kw.priority, 'P0');
        assert.equal(kw.isActive, true);
        assert.equal(kw.isIndexable, true);
      }
    });
  });

  // B. Price Route Tests
  describe('B. Price Route', () => {
    it('폐기물처리 비용 키워드는 displayName과 routeKey가 분리되어 관리되어야 한다', () => {
      const priceKw = findKeywordByRouteKey('폐기물처리비용');
      assert.ok(priceKw, '폐기물처리비용 routeKey로 조회가 가능해야 함');
      assert.equal(priceKw.displayName, '폐기물처리 비용');
      assert.equal(priceKw.routeKey, '폐기물처리비용');
      assert.equal(priceKw.intentGroup, 'PRICE_ESTIMATE');
    });
  });

  // C. Region Hierarchy Tests
  describe('C. Region Hierarchy', () => {
    it('수원시(SI) -> 영통구(GU) -> 매탄동(DONG)의 parent 관계가 정상 연결되어야 한다', () => {
      const si = findRegionByRouteKey('수원시');
      const gu = findRegionByRouteKey('영통구');
      const dong = findRegionByRouteKey('매탄동');

      assert.ok(si && gu && dong, '시, 구, 동 엔티티가 모두 조회되어야 함');
      assert.equal(si.regionType, 'SI');
      assert.equal(gu.regionType, 'GU');
      assert.equal(dong.regionType, 'DONG');

      assert.equal(gu.parentRegionId, si.regionId, '구의 parentRegionId는 시의 regionId여야 함');
      assert.equal(dong.parentRegionId, gu.regionId, '동의 parentRegionId는 구의 regionId여야 함');
    });
  });

  // D. Alias Safety Tests (Corrected)
  describe('D. Alias Safety', () => {
    it('RegionEntity 하나당 SEO Canonical routeKey는 오직 1개만 존재해야 한다', () => {
      const jungang = INITIAL_REGION_FIXTURES.find((r) => r.officialName === '중앙동');
      assert.ok(jungang);
      assert.ok(jungang.aliases.includes('안산 중앙동'), '안산 중앙동이 alias에 포함되어야 함');
      assert.equal(jungang.routeKey, '안산시-중앙동', 'Canonical routeKey는 단 1개여야 함');
    });

    it('aliases를 단독 쿼리로 전달 시 canonical URL로 자동 매칭되지 않아야 한다', () => {
      // alias인 '안산 중앙동' 또는 '역삼' 단독으로는 등록된 canonical routeKey가 아니므로 매칭 실패(null)여야 함
      const route1 = resolveBaseRoute('안산 중앙동-가구수거');
      assert.equal(route1, null, 'alias 단독 쿼리는 canonical route로 승인되지 않아야 함');

      const route2 = resolveBaseRoute('역삼-가구수거');
      assert.equal(route2, null, 'alias 단독 쿼리는 canonical route로 승인되지 않아야 함');
    });
  });

  // E. Resolver Tests
  describe('E. Resolver', () => {
    it('유효한 지역 및 작업명에 대해 성공적으로 ResolvedRoute를 반환해야 한다', () => {
      const r1 = resolveBaseRoute('역삼동-폐기물처리업체');
      assert.ok(r1);
      assert.equal(r1.region.seoDisplayName, '역삼동');
      assert.equal(r1.work.displayName, '폐기물처리업체');
      assert.equal(r1.canonicalQuery, '역삼동-폐기물처리업체');
      assert.equal(r1.isIndexable, true);

      const r2 = resolveBaseRoute('역삼동-폐기물처리비용');
      assert.ok(r2);
      assert.equal(r2.work.displayName, '폐기물처리 비용');
      assert.equal(r2.work.routeKey, '폐기물처리비용');
      assert.equal(r2.canonicalQuery, '역삼동-폐기물처리비용');

      const r3 = resolveBaseRoute('안산시-중앙동-가구수거');
      assert.ok(r3);
      assert.equal(r3.region.seoDisplayName, '안산시 중앙동');
      assert.equal(r3.work.displayName, '가구수거');
      assert.equal(r3.canonicalQuery, '안산시-중앙동-가구수거');
    });

    it('존재하지 않는 작업명이나 지역명은 null을 반환해야 한다 (Invalid route)', () => {
      assert.equal(resolveBaseRoute('abcdef'), null);
      assert.equal(resolveBaseRoute('역삼동-없는작업'), null);
      assert.equal(resolveBaseRoute('없는지역-폐기물처리업체'), null);
      assert.equal(resolveBaseRoute(''), null);
      assert.equal(resolveBaseRoute(null), null);
    });

    it('비활성화(isActive=false)된 지역이나 작업명은 null을 반환해야 한다', () => {
      const inactiveRegionFinder = () => ({
        regionId: 'inactive-dong',
        officialName: '비활성동',
        routeKey: '비활성동',
        seoDisplayName: '비활성동',
        regionType: 'DONG' as const,
        upperRegionId: 'seoul',
        aliases: [],
        hasNationwideCollision: false,
        priority: 'P2' as const,
        isActive: false, // 비활성화
        isIndexable: false,
        isSitemapEligible: false,
        isHubEligible: false,
      });

      const result = resolveBaseRoute('비활성동-폐기물처리', inactiveRegionFinder);
      assert.equal(result, null, '비활성 지역은 null을 반환해야 함');
    });
  });

  // F. URL Stability Tests
  describe('F. URL Stability', () => {
    it('이미 활성화된 Region의 canonical routeKey와 seoDisplayName은 불변이어야 한다', () => {
      const sample = INITIAL_REGION_FIXTURES.find((r) => r.regionId === 'gg-ansan-jungang');
      assert.ok(sample);
      // routeKey와 seoDisplayName이 코드 레벨에서 선언적 불변으로 고정되어 있음을 확인
      assert.equal(sample.routeKey, '안산시-중앙동');
      assert.equal(sample.seoDisplayName, '안산시 중앙동');
      assert.equal(sample.hasNationwideCollision, true);
    });
  });

  // G. Production Env Safety Tests
  describe('G. Production Env Safety', () => {
    it('development 환경에서는 localhost fallback을 허용해야 한다', () => {
      const origin = resolveSiteOrigin({ NODE_ENV: 'development' });
      assert.equal(origin, 'http://localhost:3000');
    });

    it('production 환경에서 SITE_ORIGIN 누락 시 치명적 에러를 발생시켜 localhost 누출을 차단해야 한다', () => {
      assert.throws(
        () => {
          resolveSiteOrigin({ NODE_ENV: 'production' });
        },
        /CRITICAL CONFIG ERROR/
      );
    });

    it('production 환경에서 SITE_ORIGIN이 제공되면 정상적으로 반환되어야 한다', () => {
      const origin = resolveSiteOrigin({
        NODE_ENV: 'production',
        SITE_ORIGIN: 'https://allcareclean.example.com/',
      });
      assert.equal(origin, 'https://allcareclean.example.com');
    });
  });
});
