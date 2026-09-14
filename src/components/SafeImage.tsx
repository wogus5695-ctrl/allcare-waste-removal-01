import React from 'react';
import { ImagePlaceholder } from '@/components/ImagePlaceholder';

interface SafeImageProps {
  src?: string;
  alt: string;
  aspectRatio?: 'video' | 'square' | 'portrait' | 'wide';
  placeholderLabel?: string;
  placeholderSublabel?: string;
  className?: string;
  priority?: boolean;
}

/**
 * 운영자 실제 이미지 안전 렌더러
 * - 실제 이미지(src)가 등록되어 있으면 반응형 <img> 태그로 렌더링 (object-cover, 원본 비율 유지, aspect ratio 보존으로 CLS 방지)
 * - 미등록 시 중립적인 ImagePlaceholder로 fallback
 * - AI 생성, 무단 스톡 이미지, Before/After 비교 금지 정책 준수
 */
export function SafeImage({
  src,
  alt,
  aspectRatio = 'video',
  placeholderLabel = '운영자 이미지 적용 영역',
  placeholderSublabel = '실제 수거 작업 현장 사진 반영 예정',
  className = '',
}: SafeImageProps) {
  if (!src) {
    return (
      <ImagePlaceholder
        label={placeholderLabel}
        sublabel={placeholderSublabel}
        aspectRatio={aspectRatio}
        className={className}
      />
    );
  }

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'portrait'
      ? 'aspect-[3/4]'
      : aspectRatio === 'wide'
      ? 'aspect-[21/9]'
      : 'aspect-[16/10]';

  return (
    <div className={`relative overflow-hidden rounded-2xl ${aspectClass} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover object-center"
      />
    </div>
  );
}
