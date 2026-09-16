import { ServiceFamily, ServiceFamilyConfig } from '@/types/service-family';

/**
 * 올케어환경 서비스 패밀리 레지스트리
 * - WASTE: 활성화 상태 (Pilot)
 * - DEMOLITION: 미래 확장용 비활성화 상태 (키워드/URL 없음)
 */
export const SERVICE_FAMILY_REGISTRY: Record<ServiceFamily, ServiceFamilyConfig> = {
  WASTE: {
    id: 'WASTE',
    label: '폐기물',
    hubKey: 'waste',
    enabled: true,
    searchExposureEnabled: true,
  },
  DEMOLITION: {
    id: 'DEMOLITION',
    label: '철거',
    hubKey: 'demolition',
    enabled: true,
    searchExposureEnabled: false, // STEP W-1B: 검색 노출 및 크롤러 수집 보류 (온홀드)
  },
} as const;

export function getServiceFamilyConfig(family: ServiceFamily): ServiceFamilyConfig {
  return SERVICE_FAMILY_REGISTRY[family];
}

export function getActiveServiceFamilies(): ServiceFamilyConfig[] {
  return Object.values(SERVICE_FAMILY_REGISTRY).filter((f) => f.enabled);
}

export function isServiceFamilySearchExposureEnabled(family: ServiceFamily): boolean {
  return SERVICE_FAMILY_REGISTRY[family]?.searchExposureEnabled ?? false;
}
