import { RegionType } from '@/types/region';

export interface CollisionReferenceEntry {
  name: string;
  regionType: RegionType;
  occurrences: number;
}

/**
 * 전국 단위 공식 행정구역 명칭 충돌 레퍼런스
 * 전국에 동일 명칭(동/구/군)이 2개 이상 존재하는지 여부를 판별하는 레퍼런스
 */
export const NATIONWIDE_COLLISION_NAMES: ReadonlySet<string> = new Set([
  // STEP 3-B2 수원 전수 검사 확정 충돌 동명
  '정자동', // 수원시 장안구 vs 성남시 분당구
  '금곡동', // 수원시 권선구 vs 남양주시 vs 부산 북구 vs 성남시 분당구
  '조원동', // 수원시 장안구 vs 서울특별시 관악구
  '장지동', // 수원시 권선구 vs 서울특별시 송파구 vs 경기도 광주시
  '평동',   // 수원시 권선구 vs 서울특별시 종로구 vs 광주광역시 광산구
  '평리동', // 수원시 권선구 vs 대구광역시 서구
  '탑동',   // 수원시 권선구 vs 충청북도 청주시 상당구 vs 제주시
  '남창동', // 수원시 팔달구 vs 서울특별시 중구
  '신풍동', // 수원시 팔달구 vs 전라남도 여수시 vs 경상북도 김천시
  '영동',   // 수원시 팔달구 vs 충청북도 영동군
  '장안동', // 수원시 팔달구 vs 서울특별시 동대문구
  '중동',   // 수원시 팔달구 vs 부천시 원미구 vs 부산 해운대구 vs 대전 동구 등
  '교동',   // 수원시 팔달구 vs 강릉시 vs 대구 중구 vs 공주시 등
  '고등동', // 수원시 팔달구 vs 성남시 수정구
  '신동',   // 수원시 영통구 vs 익산시 vs 안동시 vs 천안시 동남구
  '하동',   // 수원시 영통구 vs 경상남도 하동군 vs 광주광역시 광산구

  // 기타 전국 주요 충돌 명칭 레퍼런스
  '중앙동',
  '신흥동',
  '신사동',
  '사성동',
  '남산동',
  '대흥동',
  '문화동',
  '성산동',
  '송정동',
  '수송동',
  '용산동',
  '원동',
  '인현동',
  '태평동',
  '평화동',
  '화운동',
  '서구',
  '중구',
  '동구',
  '남구',
  '북구',
  '강서구',
]);

/**
 * 해당 명칭이 전국 단위 충돌(동일 명칭 2개 이상)인지 판별
 */
export function checkNationwideCollision(name: string): boolean {
  return NATIONWIDE_COLLISION_NAMES.has(name.trim());
}
