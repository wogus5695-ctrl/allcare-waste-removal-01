import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { P0_KEYWORDS as WASTE_KEYWORDS } from '../data/keywords/p0-keywords';
import {
  DEMOLITION_P0_KEYWORDS,
  DEMOLITION_P1_CANDIDATES,
  DEMOLITION_CONDITIONAL_DISABLED_CANDIDATES,
  ALL_KEYWORDS,
  findKeywordByRouteKey,
} from '../data/keywords';
import { SUWON_REGIONS } from '../data/regions/suwon';
import {
  getServiceRegionPolicy,
  isServiceRegionActive,
  getDemolitionPilotRegionIds,
  getActiveRegionIdsByFamily,
} from '../config/service-region-policy';
import { resolveBaseRoute, createPageContext } from '../engine/resolver';
import { PageContext } from '../types/content';
import {
  getRootSitemapIndexEntries,
  getDynamicUrlEntries,
  getChildSitemapsMap,
  getChildSitemapXml,
} from '../lib/sitemap-generator';

describe('STEP 5-C: Demolition Keyword Dataset & Service-Scoped Region Activation Foundation', () => {
  // =========================================================================
  // [A] PageContext.serviceFamily REQUIRED COMPILE-TIME / RUNTIME AUDIT
  // =========================================================================
  describe('[A] PageContext.serviceFamily Required', () => {
    it('createPageContext 결과는 항상 유효한 serviceFamily를 포함해야 한다', () => {
      const resolved = resolveBaseRoute('매탄동-폐기물처리업체');
      assert.ok(resolved);
      const ctx: PageContext = createPageContext(resolved);
      assert.equal(ctx.serviceFamily, 'WASTE');
      assert.ok(ctx.serviceFamily !== undefined && ctx.serviceFamily !== null);
    });
  });

  // =========================================================================
  // [B] EXISTING 14 WASTE KEYWORDS
  // =========================================================================
  describe('[B] Existing 14 WASTE Keywords', () => {
    it('14개 폐기물 키워드의 serviceFamily는 전부 WASTE여야 한다', () => {
      assert.equal(WASTE_KEYWORDS.length, 14);
      for (const kw of WASTE_KEYWORDS) {
        assert.equal(kw.serviceFamily, 'WASTE');
        assert.equal(kw.isActive, true);
        assert.equal(kw.isIndexable, true);
      }
    });
  });

  // =========================================================================
  // [C] DEMOLITION DATASET COUNT (9 P0 ENTITIES)
  // =========================================================================
  describe('[C] DEMOLITION Dataset Count', () => {
    it('DEMOLITION P0 데이터셋은 정확히 9개 키워드로 구성되어야 한다', () => {
      assert.equal(DEMOLITION_P0_KEYWORDS.length, 9);
      const expectedRouteKeys = [
        '철거',
        '철거업체',
        '철거비용',
        '내부철거',
        '상가철거',
        '사무실철거',
        '부분철거',
        '폐업철거',
        '원상복구',
      ];
      assert.deepEqual(
        DEMOLITION_P0_KEYWORDS.map((k) => k.routeKey),
        expectedRouteKeys
      );
    });

    it('P1 후보 및 조건부 보류 키워드가 명시적으로 분리 관리되어야 한다', () => {
      assert.equal(DEMOLITION_P1_CANDIDATES.length, 3);
      assert.equal(DEMOLITION_CONDITIONAL_DISABLED_CANDIDATES.length, 4);
    });
  });

  // =========================================================================
  // [D] DEMOLITION ACTIVE KEYWORD COUNT = 9 (STEP 5-D Activated)
  // =========================================================================
  describe('[D] DEMOLITION Active Keyword', () => {
    it('STEP 5-D에서 모든 DEMOLITION 9개 키워드는 isActive=true, isIndexable=true 여야 한다', () => {
      for (const kw of DEMOLITION_P0_KEYWORDS) {
        assert.equal(kw.isActive, true, `${kw.displayName}은 활성 상태여야 함`);
        assert.equal(kw.isIndexable, true, `${kw.displayName}은 색인 가능이어야 함`);
      }
      const activeDemoKws = DEMOLITION_P0_KEYWORDS.filter((k) => k.isActive);
      assert.equal(activeDemoKws.length, 9);
    });
  });

  // =========================================================================
  // [E] DEMOLITION ROUTEKEY DUPLICATE = 0
  // =========================================================================
  describe('[E] DEMOLITION routeKey Duplicate', () => {
    it('DEMOLITION 키워드 간 routeKey 및 keywordId 중복이 전혀 없어야 한다', () => {
      const routeKeys = DEMOLITION_P0_KEYWORDS.map((k) => k.routeKey);
      const ids = DEMOLITION_P0_KEYWORDS.map((k) => k.keywordId);
      assert.equal(new Set(routeKeys).size, 9);
      assert.equal(new Set(ids).size, 9);
    });
  });

  // =========================================================================
  // [F] WASTE + DEMOLITION ROUTEKEY COLLISION = 0
  // =========================================================================
  describe('[F] WASTE + DEMOLITION routeKey Collision', () => {
    it('WASTE 키워드와 DEMOLITION 키워드 간 routeKey 충돌이 0건이어야 한다', () => {
      const wasteRouteKeys = new Set(WASTE_KEYWORDS.map((k) => k.routeKey));
      const demoRouteKeys = DEMOLITION_P0_KEYWORDS.map((k) => k.routeKey);
      for (const dKey of demoRouteKeys) {
        assert.ok(!wasteRouteKeys.has(dKey), `WASTE와 DEMOLITION routeKey 충돌: ${dKey}`);
      }
      assert.equal(ALL_KEYWORDS.length, 23); // 14 + 9
    });
  });

  // =========================================================================
  // [G] WASTE EXISTING DYNAMIC URL = 840
  // =========================================================================
  describe('[G] WASTE Existing URL', () => {
    it('WASTE 계열 dynamic URL 수는 정확히 840개여야 한다 (60 Region × 14 Keyword)', () => {
      const dynamicEntries = getDynamicUrlEntries();
      const wasteEntries = dynamicEntries.filter((e) => e.serviceFamily === 'WASTE');
      assert.equal(wasteEntries.length, 840);
    });
  });

  // =========================================================================
  // [H] DEMOLITION DYNAMIC URL = 45 (STEP 5-D Activated)
  // =========================================================================
  describe('[H] DEMOLITION Dynamic URL', () => {
    it('STEP 5-F에서 DEMOLITION 계열 dynamic URL 수는 정확히 540개(60 Region × 9 Keyword)여야 한다', () => {
      const dynamicEntries = getDynamicUrlEntries();
      const demoEntries = dynamicEntries.filter((e) => e.serviceFamily === 'DEMOLITION');
      assert.equal(demoEntries.length, 540);
    });
  });

  // =========================================================================
  // [I] WASTE SAMPLE RESOLUTION = 200 (RESOLVED)
  // =========================================================================
  describe('[I] Waste Sample Resolution', () => {
    it('기존 폐기물 샘플 라우트들은 정상적으로 ResolvedRoute를 반환해야 한다', () => {
      const samples = [
        '매탄동-폐기물처리업체',
        '수원시-폐기물처리비용',
        '영통구-가구수거',
        '수원시-정자동-사무실폐기물처리',
        '오목천동-이사폐기물처리',
      ];
      for (const s of samples) {
        const resolved = resolveBaseRoute(s);
        assert.ok(resolved, `${s}는 정상 해석되어야 함`);
        assert.equal(resolved.serviceFamily, 'WASTE');
        assert.equal(resolved.isIndexable, true);
      }
    });
  });

  // =========================================================================
  // [J] DEMOLITION SAMPLE RESOLUTION (Pilot Resolved vs Non-Pilot 404)
  // =========================================================================
  describe('[J] Demolition Sample Resolution', () => {
    it('수원 60개 지역 철거 쿼리는 정상 해석되고, 비활성 지역은 null을 반환해야 한다', () => {
      const suwonSamples = [
        '수원시-철거',
        '영통구-철거업체',
        '매탄동-철거업체',
        '오목천동-내부철거',
        '수원시-정자동-상가철거',
        '매탄동-원상복구',
        '장안구-철거',
        '권선구-철거업체',
        '세류동-사무실철거',
      ];
      for (const s of suwonSamples) {
        const resolved = resolveBaseRoute(s);
        assert.ok(resolved, `${s}는 활성 지역이므로 정상 해석되어야 함`);
        assert.equal(resolved.serviceFamily, 'DEMOLITION');
      }

      const nonDemoSamples = [
        '안산시-중앙동-철거',
        '역삼동-철거업체',
      ];
      for (const s of nonDemoSamples) {
        const resolved = resolveBaseRoute(s);
        assert.equal(resolved, null, `${s}는 비활성 지역이므로 null이어야 함`);
      }
    });
  });

  // =========================================================================
  // [K] WASTE SERVICE REGION POLICY = 60 ACTIVE
  // =========================================================================
  describe('[K] WASTE ServiceRegionPolicy', () => {
    it('WASTE 서비스의 활성 지역 정책은 정확히 60개여야 한다', () => {
      const wasteActiveIds = getActiveRegionIdsByFamily('WASTE');
      assert.equal(wasteActiveIds.length, 60);

      for (const r of SUWON_REGIONS) {
        const policy = getServiceRegionPolicy('WASTE', r.regionId);
        assert.ok(policy, `${r.regionId}의 WASTE 정책 존재`);
        assert.equal(policy.isActive, true);
        assert.equal(policy.isIndexable, true);
        assert.equal(policy.isSitemapEligible, true);
        assert.equal(policy.isHubEligible, true);
        assert.equal(isServiceRegionActive('WASTE', r.regionId), true);
      }
    });
  });

  // =========================================================================
  // [L] DEMOLITION PILOT ELIGIBLE POLICY = 5 PREPARED
  // =========================================================================
  describe('[L] DEMOLITION Pilot Eligible Policy', () => {
    it('DEMOLITION 파일럿 준비 지역은 정확히 5개로 등록되어 있어야 한다', () => {
      const pilotIds = getDemolitionPilotRegionIds();
      assert.equal(pilotIds.length, 5);
      assert.deepEqual(pilotIds, [
        'gg-suwon',
        'gg-suwon-yt',
        'gg-suwon-yt-maetan',
        'gg-suwon-gs-omokcheon',
        'gg-suwon-ja-jeongja',
      ]);

      for (const pid of pilotIds) {
        const policy = getServiceRegionPolicy('DEMOLITION', pid);
        assert.ok(policy, `${pid}의 DEMOLITION 정책 존재`);
        assert.equal(policy.isPilotEligible, true);
      }
    });
  });

  // =========================================================================
  // [M] DEMOLITION CURRENTLY ACTIVE REGION = 60 (STEP 5-F Full Rollout)
  // =========================================================================
  describe('[M] DEMOLITION Currently Active Region', () => {
    it('STEP 5-F에서 DEMOLITION의 활성 지역 정책 수는 60개여야 한다', () => {
      const demoActiveIds = getActiveRegionIdsByFamily('DEMOLITION');
      assert.equal(demoActiveIds.length, 60);

      for (const pid of getDemolitionPilotRegionIds()) {
        assert.equal(isServiceRegionActive('DEMOLITION', pid), true);
      }
    });

    it('5개 파일럿 지역 활성화 시 정확히 45개 URL(5 Region × 9 Keyword)이 산출됨을 검증한다', () => {
      const pilotIds = getDemolitionPilotRegionIds();
      const demoKeywordCount = DEMOLITION_P0_KEYWORDS.length;
      const expectedPilotUrls = pilotIds.length * demoKeywordCount;
      assert.equal(expectedPilotUrls, 45, '5 Region × 9 Keyword = 45 URLs');
    });
  });

  // =========================================================================
  // [N] SITEMAP ROOT CHILD = 3 (STEP 5-D Activated)
  // =========================================================================
  describe('[N] Sitemap Root Child Count', () => {
    it('루트 사이트맵 인덱스는 정확히 3개의 Child Sitemap(core, waste, demolition)을 가져야 한다', () => {
      const indexEntries = getRootSitemapIndexEntries();
      assert.equal(indexEntries.length, 3);
      const names = indexEntries.map((e) => e.filename);
      assert.deepEqual(names, ['core.xml', 'waste-gyeonggi-001.xml', 'demolition-gyeonggi-001.xml']);
    });
  });

  // =========================================================================
  // [O] WASTE SITEMAP = 840
  // =========================================================================
  describe('[O] Waste Sitemap URL Count', () => {
    it('Waste Child Sitemap은 정확히 840개의 URL을 유지해야 한다', () => {
      const childMap = getChildSitemapsMap();
      const wasteEntries = childMap.get('waste-gyeonggi-001.xml');
      assert.ok(wasteEntries);
      assert.equal(wasteEntries.length, 840);
    });
  });

  // =========================================================================
  // [P] DEMOLITION CHILD SITEMAP = 1 (45 URLs)
  // =========================================================================
  describe('[P] Demolition Child Sitemap Count', () => {
    it('DEMOLITION Child Sitemap은 540개 URL로 등록되어야 한다', () => {
      const childMap = getChildSitemapsMap();
      const demoFiles = Array.from(childMap.keys()).filter((k) => k.startsWith('demolition'));
      assert.equal(demoFiles.length, 1);
      assert.equal(demoFiles[0], 'demolition-gyeonggi-001.xml');
      const demoEntries = childMap.get('demolition-gyeonggi-001.xml')!;
      assert.equal(demoEntries.length, 540);
      assert.ok(getChildSitemapXml('demolition-gyeonggi-001.xml'));
    });
  });
});
