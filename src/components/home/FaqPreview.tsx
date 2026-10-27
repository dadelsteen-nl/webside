import { getTranslations } from 'next-intl/server'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Reveal } from '@/components/ui/motion'
import { Link } from '@/i18n/navigation'

import type { HomeFaq } from './types'

import { ArrowIcon, SectionLabel } from './primitives'

export async function FaqPreview({ items }: { items?: HomeFaq[] | null }) {
  const t = await getTranslations('home.faq')
  const list = (items?.length ? items : (t.raw('items') as HomeFaq[])).slice(0, 5)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: list.map((f) => ({
      '@type': 'Question',
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
      name: f.question,
    })),
  }

  return (
    <section aria-labelledby="home-faq-title" className="bg-cream py-24 md:py-36">
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} type="application/ld+json" />
      <div className="container grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <SectionLabel>{t('label')}</SectionLabel>
          <h2
            className="mt-8 text-[clamp(2.25rem,4.2vw,3.75rem)] font-light leading-[1.02] tracking-[-0.025em] text-ink"
            id="home-faq-title"
          >
            {t('title')}
          </h2>
          <Link
            className="group mt-10 inline-flex items-center gap-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink"
            href="/faq"
          >
            <span className="border-b border-bronze pb-1">{t('cta')}</span>
            <ArrowIcon className="text-bronze" />
          </Link>
        </Reveal>

        <Reveal className="lg:col-span-7 lg:col-start-6" delay={0.1}>
          <Accordion className="border-t border-ink/15" collapsible type="single">
            {list.map((item, i) => (
              <AccordionItem className="border-b border-ink/15" key={item.question} value={`faq-${i}`}>
                <AccordionTrigger className="items-center gap-6 rounded-none py-7 font-display text-xl font-light leading-snug text-ink hover:no-underline md:text-2xl [&>svg]:size-5 [&>svg]:text-bronze [&>svg]:duration-500">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="max-w-2xl pb-8 pr-10 text-[0.9375rem] leading-relaxed text-olive-grey">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}
