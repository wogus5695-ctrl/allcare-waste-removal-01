import Image from 'next/image';
import {
  WASTE_ESTIMATE_CONFIG,
  DEMOLITION_ESTIMATE_CONFIG,
  EstimateCriteriaConfig,
} from '@/config/estimate-criteria';

interface EstimateCriteriaSectionProps {
  serviceFamily: 'WASTE' | 'DEMOLITION';
  id?: string;
  variant?: 'slate' | 'white';
  h2?: string;
  supportingCopy?: string;
}

export function EstimateCriteriaSection({
  serviceFamily,
  id = 'estimate',
  variant = 'slate',
  h2,
  supportingCopy,
}: EstimateCriteriaSectionProps) {
  const config: EstimateCriteriaConfig =
    serviceFamily === 'DEMOLITION'
      ? DEMOLITION_ESTIMATE_CONFIG
      : WASTE_ESTIMATE_CONFIG;

  const h2Text = h2 || config.h2;
  const supportingCopyText = supportingCopy || config.supportingCopy;

  return (
    <section
      id={id}
      aria-labelledby="estimate-criteria-heading"
      className={
        variant === 'white'
          ? 'bg-white py-14 md:py-20'
          : 'border-y border-slate-200/70 bg-slate-50/80 py-14 md:py-20'
      }
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading Area */}
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            {config.eyebrow}
          </span>
          <h2
            id="estimate-criteria-heading"
            className="mt-2 text-2xl font-black tracking-tight text-slate-900 break-keep sm:text-3xl"
          >
            {h2Text}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 break-keep sm:text-base">
            {supportingCopyText}
          </p>
        </div>

        {/* Integrated Visual Panel (Desktop: Left Field Image + Right 4-Item List, Mobile: Top Image + Bottom List) */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs md:flex">
          {/* Left Panel: Field Image Slot (~45-46% on Desktop, ~220-260px on Mobile) */}
          <div className="relative min-h-[220px] sm:min-h-[260px] md:min-h-[420px] w-full md:w-[45%] lg:w-[46%] shrink-0 overflow-hidden bg-slate-900">
            {config.imageSrc ? (
              <Image
                src={config.imageSrc}
                alt={config.imageAlt || `${h2Text} 현장`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`object-cover ${
                  config.serviceFamily === 'DEMOLITION'
                    ? 'object-[38%_50%] md:object-[42%_50%]'
                    : 'object-[50%_50%] md:object-[50%_52%]'
                }`}
              />
            ) : (
              /* Fallback neutral field surface when operator field image is not yet registered */
              <div
                className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 flex items-center justify-center p-6 text-center"
                aria-hidden="true"
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(234,88,12,0.12),transparent_70%)]" />
                  <div className="space-y-2 opacity-60">
                    <div className="mx-auto h-12 w-12 rounded-xl bg-slate-700/50 border border-slate-600/40 flex items-center justify-center text-slate-400 font-mono text-sm font-bold">
                      01-04
                    </div>
                    <p className="text-xs text-slate-400 font-medium tracking-wide">
                      {config.serviceFamily === 'DEMOLITION'
                        ? 'ALLCARE DEMOLITION'
                        : 'ALLCARE ENVIRONMENT'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop: Soft diagonal (~10°) gradient transition from left visual to right white panel */}
            <div
              className="pointer-events-none absolute inset-0 hidden md:block"
              style={{
                background:
                  'linear-gradient(100deg, transparent 68%, rgba(255, 255, 255, 0.4) 82%, rgba(255, 255, 255, 0.95) 95%, #ffffff 100%)',
              }}
              aria-hidden="true"
            />

            {/* Mobile: Soft vertical gradient transition into bottom white list */}
            <div
              className="pointer-events-none absolute inset-0 block md:hidden"
              style={{
                background:
                  'linear-gradient(to bottom, transparent 65%, rgba(255, 255, 255, 0.6) 85%, #ffffff 100%)',
              }}
              aria-hidden="true"
            />
          </div>

          {/* Right Panel: 4-Item Vertical Information List (~54-55% width) */}
          <div className="relative flex flex-1 flex-col justify-center bg-white p-6 sm:p-8 lg:p-10">
            <ol className="divide-y divide-slate-100">
              {config.items.map((item) => (
                <li
                  key={item.num}
                  className="flex items-start gap-4 sm:gap-5 py-4 sm:py-5 first:pt-0 last:pb-0"
                >
                  <span
                    className="font-mono text-lg sm:text-xl font-black text-orange-600 shrink-0 w-8 sm:w-9 pt-0.5"
                    aria-hidden="true"
                  >
                    {item.num}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight break-keep">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-600 break-keep">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
