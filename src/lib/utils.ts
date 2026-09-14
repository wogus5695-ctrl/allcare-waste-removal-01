/**
 * 올케어환경 공통 유틸리티
 */

/**
 * 텍스트 Unicode NFC 정규화 및 트림
 */
export function normalizeText(text: string): string {
  return text.normalize('NFC').trim();
}
