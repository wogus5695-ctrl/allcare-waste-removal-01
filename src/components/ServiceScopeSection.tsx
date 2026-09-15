import Image from 'next/image';
import {
  WASTE_SCOPE_CONFIG,
  DEMOLITION_SCOPE_CONFIG,
} from '@/config/service-scope-cards';

interface ServiceScopeSectionProps {
  serviceFamily: 'WASTE' | 'DEMOLITION';
  id?: string;
}

export function ServiceScopeSection({
  serviceFamily,
  id = 'services',
}: ServiceScopeSectionProps) {
  const config =
    serviceFamily === 'DEMOLITION'
      ? DEMOLITION_SCOPE_CONFIG
      : WASTE_SCOPE_CONFIG;

  return (
    <section
      id={id}
      aria-labelledby="service-scope-heading"
      className="border-y border-slate-200/70 bg-slate-50/80 py-14 md:py-20"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading Area */}
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            {config.eyebrow}
          </span>
          <h2
            id="service-scope-heading"
            className="mt-2 text-2xl font-black tracking-tight text-slate-900 break-keep sm:text-3xl"
          >
            {config.h2}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 break-keep sm:text-base">
            {config.supportingCopy}
          </p>
        </div>

        {/* Responsive Grid: 2x2 on Desktop/Tablet (md:grid-cols-2), 1-Column on Mobile */}
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          {config.cards.map((card) => (
            <article
              key={card.id}
              className="group relative flex aspect-[16/11] min-h-[220px] w-full flex-col justify-end overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-900 shadow-sm transition duration-200 hover:border-slate-300 hover:shadow-md sm:aspect-[16/10] sm:min-h-[260px] md:hover:-translate-y-0.5"
            >
              {/* Background Image / Field Surface Layer */}
              {card.imageSrc ? (
                <Image
                  src={card.imageSrc}
                  alt={card.imageAlt || card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                  style={card.objectPosition ? { objectPosition: card.objectPosition } : undefined}
                />
              ) : (
                <div
                  className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900"
                  aria-hidden="true"
                />
              )}

              {/* Bottom Gradient Overlay (Deep Navy Tint -> Transparent) */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-transparent"
                aria-hidden="true"
              />

              {/* Text Layer (Bottom-Left Anchored, Real HTML Text for SSR & SEO) */}
              <div className="relative z-10 flex flex-col justify-end p-5 sm:p-6">
                <h3 className="text-base font-bold text-white break-keep sm:text-lg">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-200 break-keep sm:text-sm">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Scope Note (Preserves Service Coverage Meaning without Keyword Stuffing) */}
        {config.scopeNote && (
          <p className="mt-6 text-xs text-slate-500 break-keep">
            ※ {config.scopeNote}
          </p>
        )}
      </div>
    </section>
  );
}
