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
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition duration-200 hover:border-slate-300 hover:shadow-md md:hover:-translate-y-0.5"
            >
              {/* Field Photo Image Slot (16:9 Aspect Ratio) */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200/80">
                {card.imageSrc ? (
                  <Image
                    src={card.imageSrc}
                    alt={card.imageAlt || card.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <div
                    className="h-full w-full bg-gradient-to-tr from-slate-100 via-slate-50/70 to-slate-200/60"
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Text Area (Real HTML Text for SSR & SEO) */}
              <div className="flex flex-1 flex-col justify-start p-5 sm:p-6">
                <h3 className="text-base font-bold text-slate-900 break-keep sm:text-lg">
                  {card.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 break-keep sm:text-sm">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Scope Note (Preserves Service Coverage Meaning without Keyword Stuffing) */}
        {config.scopeNote && (
          <p className="mt-6 text-xs text-slate-500 break-keep sm:text-sm">
            ※ {config.scopeNote}
          </p>
        )}
      </div>
    </section>
  );
}
