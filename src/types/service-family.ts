/**
 * 올케어환경 서비스 계열 (Vertical) 정의
 * - WASTE: 폐기물 수거/처리 서비스
 * - DEMOLITION: 철거 서비스 (미래 확장용, 현재 비활성)
 */
export type ServiceFamily = 'WASTE' | 'DEMOLITION';

export interface ServiceFamilyConfig {
  readonly id: ServiceFamily;
  readonly label: string;
  readonly hubKey: string;
  readonly enabled: boolean;
}
