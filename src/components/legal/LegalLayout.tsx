import type { ReactNode } from 'react'

import { PrintButton } from './PrintButton'

export type LegalSection = {
  id: string
  title: string
  body?: string[]
  list?: string[]
}

type Props = {
  title: string
  intro?: string
  lastUpdated: string
  lastUpdatedLabel: string
  draftNote: string
  tocLabel: string
  printLabel: string
  sections: LegalSection[]
  /** Extra content rendered after the sections (e.g. cookie tables). */
  children?: ReactNode
  /** Extra TOC entries for sections rendered via `children`. */
  extraToc?: { id: string; title: string }[]
}

/*
 * DRAFT CONTENT NOTICE: the legal copy rendered through this layout (messages/{nl,en}/legal.json)
 * is a template and has NOT been reviewed by a lawyer. Have it checked before launch.
 */
export function LegalLayout({
  title,
  intro,
  lastUpdated,
  lastUpdatedLabel,
  draftNote,
  tocLabel,
  printLabel,
  sections,
  children,
  extraToc = [],
}: Props) {
  const toc = [...sections.map((s) => ({ id: s.id, title: s.title })), ...extraToc]

  return (
    <div className="bg-sand py-16 md:py-24 print:bg-white print:py-0">
      <div className="container">
        <header className="max-w-3xl">
          <p className="flex items-center gap-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-olive-grey print:hidden">
            <span aria-hidden="true" className="h-px w-8 bg-bronze" />
            {lastUpdatedLabel}{' '}
            <time dateTime={lastUpdated}>{lastUpdated}</time>
          </p>
          <h1 className="mt-8 text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.02] tracking-[-0.025em] text-ink">
            {title}
          </h1>
          {intro ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-olive-grey">{intro}</p>
          ) : null}
          <p
            className="mt-6 inline-block border border-bronze/50 px-3 py-1.5 font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-bronze-deep print:border-0 print:px-0"
            role="note"
          >
            {draftNote}
          </p>
        </header>

        <div className="mt-14 grid gap-12 border-t border-ink/10 pt-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-20 print:block print:border-0 print:pt-0">
          <aside className="print:hidden">
            <nav aria-label={tocLabel} className="lg:sticky lg:top-28">
              <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-olive-grey">
                {tocLabel}
              </p>
              <ol className="mt-5 space-y-3 border-l border-ink/10 pl-5 text-sm leading-snug">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      className="text-ink/75 transition-colors duration-500 hover:text-bronze-deep"
                      href={`#${item.id}`}
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ol>
              <PrintButton
                className="mt-8 border-b border-bronze pb-1 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink hover:text-bronze-deep"
                label={printLabel}
              />
            </nav>
          </aside>

          <article className="max-w-3xl">
            {sections.map((s) => (
              <section className="scroll-mt-28 pb-12" id={s.id} key={s.id}>
                <h2 className="text-2xl font-light leading-tight text-ink md:text-3xl">{s.title}</h2>
                <div className="mt-5 space-y-4 text-[0.9375rem] leading-[1.8] text-ink/80">
                  {s.body?.map((p, i) => <p key={i}>{p}</p>)}
                  {s.list?.length ? (
                    <ul className="list-disc space-y-2 pl-5 marker:text-bronze">
                      {s.list.map((li, i) => <li key={i}>{li}</li>)}
                    </ul>
                  ) : null}
                </div>
              </section>
            ))}
            {children}
          </article>
        </div>
      </div>
    </div>
  )
}
