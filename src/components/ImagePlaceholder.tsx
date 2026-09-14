interface ImagePlaceholderProps {
  label?: string;
  sublabel?: string;
  aspectRatio?: 'video' | 'square' | 'portrait' | 'wide';
  className?: string;
}

/**
 * 중립적 이미지 플레이스홀더
 * - 실제 운영자 작업 현장 사진이 제공되기 전까지 레이아웃 무결성을 유지하는 컴포넌트
 * - 가짜 일러스트, AI 이미지, 무단 스톡 사진 배제
 */
export function ImagePlaceholder({
  label = '운영자 이미지 적용 영역',
  sublabel = '실제 수거 작업 현장 사진 반영 예정',
  aspectRatio = 'video',
  className = '',
}: ImagePlaceholderProps) {
  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'portrait'
      ? 'aspect-[3/4]'
      : aspectRatio === 'wide'
      ? 'aspect-[21/9]'
      : 'aspect-[16/10]';

  return (
    <div
      className={`relative flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-b from-slate-50 to-slate-100/70 p-6 text-center text-slate-400 shadow-xs transition ${aspectClass} ${className}`}
      aria-label={label}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-xs ring-1 ring-slate-200/60">
        <svg
          className="h-6 w-6 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <span className="mt-3 text-xs font-semibold tracking-tight text-slate-700 sm:text-sm">
        {label}
      </span>
      <span className="mt-1 max-w-[240px] text-[11px] leading-relaxed text-slate-400 sm:text-xs">
        {sublabel}
      </span>
    </div>
  );
}
