import NextImage from 'next/image'
import type { ReactNode } from 'react'

import { SectionLabel } from '@/components/home/primitives'
import { Reveal, SplitLines } from '@/components/ui/motion'
import { brand } from '@/lib/brandMedia'
import { cn } from '@/utilities/cn'

export { ArrowIcon, buttonStyles, emphasis, SectionLabel } from '@/components/home/primitives'

/** Editorial page hero: tiny label, very large light serif title, offset intro. */
export function PageHero({
  actions,
  aside,
  eyebrow,
  image,
  intro,
  title,
}: {
  eyebrow: string
  title: ReactNode
  intro: string
  actions?: ReactNode
  aside?: ReactNode
  /** Wide photo closing the hero */
  image?: { url: string; alt: string }
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-ink/10 pt-20 pb-20 md:pt-32 md:pb-28">
      <div className="container">
        <Reveal trigger="mount">
          <SectionLabel>{eyebrow}</SectionLabel>
        </Reveal>
        <h1 className="mt-10 max-w-[14ch] font-display text-[clamp(3rem,8.5vw,8rem)] font-light leading-[0.95] tracking-[-0.035em] text-ink">
          <SplitLines delay={0.1} lines={[title]} trigger="mount" />
        </h1>
        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-6 md:col-start-6 lg:col-span-5 lg:col-start-7" delay={0.3} trigger="mount">
            <p className="text-base leading-relaxed text-olive-grey md:text-lg">{intro}</p>
            {actions ? <div className="mt-10 flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
          </Reveal>
          {aside ? (
            <Reveal className="md:col-span-5 md:col-start-1 md:row-start-1" delay={0.45} trigger="mount">
              {aside}
            </Reveal>
          ) : null}
        </div>
        {image ? (
          <Reveal className="relative mt-16 aspect-[4/3] overflow-hidden bg-ink sm:aspect-[16/9] md:mt-24 lg:aspect-[21/9]" delay={0.5} trigger="mount">
            <NextImage alt={image.alt} className="object-cover" fill priority sizes="100vw" src={image.url} />
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}

/** Section heading pair: label + display h2. */
export function SectionHeader({
  className,
  id,
  intro,
  label,
  title,
}: {
  label: string
  title: ReactNode
  id: string
  intro?: string
  className?: string
}) {
  return (
    <div className={cn('max-w-3xl', className)}>
      <Reveal>
        <SectionLabel>{label}</SectionLabel>
      </Reveal>
      <h2
        className="mt-8 font-display text-[clamp(2.25rem,5vw,4.25rem)] font-light leading-[1.02] tracking-[-0.03em] text-ink"
        id={id}
      >
        <SplitLines lines={[title]} />
      </h2>
      {intro ? (
        <Reveal delay={0.15}>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-olive-grey md:text-lg">{intro}</p>
        </Reveal>
      ) : null}
    </div>
  )
}

/** Captioned photo, or a muted looping film when `video` is given. */
export function MediaFigure({
  caption,
  className,
  image,
  sizes = '(min-width: 768px) 45vw, 100vw',
  video,
}: {
  caption: string
  image: { url: string; alt: string }
  className?: string
  sizes?: string
  video?: { url: string; mimeType?: string }
}) {
  return (
    <figure className={cn('relative overflow-hidden bg-ink', className)}>
      {video ? (
        <video
          aria-label={caption}
          autoPlay
          className="absolute inset-0 h-full w-full object-cover"
          loop
          muted
          playsInline
          poster={image.url}
          preload="metadata"
        >
          <source src={video.url} type={video.mimeType ?? 'video/mp4'} />
        </video>
      ) : (
        <NextImage alt={image.alt} className="object-cover" fill sizes={sizes} src={image.url} />
      )}
      <figcaption className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-ink/70 to-transparent px-5 pb-4 pt-12 font-sans text-[0.6875rem] uppercase tracking-[0.22em] text-cream/85">
        {caption}
      </figcaption>
    </figure>
  )
}

/** Static, accessible FAQ list (native disclosure, no JS needed). */
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="border-t border-ink/15">
      {items.map((item, i) => (
        <Reveal delay={i * 0.08} key={item.q}>
          <details className="group border-b border-ink/15">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-7 font-display text-xl font-light text-ink transition-colors hover:text-bronze-deep md:text-2xl [&::-webkit-details-marker]:hidden">
              {item.q}
              <span
                aria-hidden="true"
                className="relative h-3.5 w-3.5 shrink-0 before:absolute before:top-1/2 before:left-0 before:h-px before:w-full before:bg-current after:absolute after:top-0 after:left-1/2 after:h-full after:w-px after:bg-current after:transition-transform after:duration-500 group-open:after:scale-y-0"
              />
            </summary>
            <p className="max-w-2xl pb-8 leading-relaxed text-olive-grey">{item.a}</p>
          </details>
        </Reveal>
      ))}
    </div>
  )
}

/** Dark closing band with a title and actions. */
export function CtaBand({
  actions,
  id,
  image = brand.modernLounge,
  text,
  title,
}: {
  id: string
  title: ReactNode
  text: string
  actions: ReactNode
  image?: { url: string; alt: string }
}) {
  return (
    <section aria-labelledby={id} className="relative isolate overflow-hidden bg-ink py-24 text-cream md:py-36">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <NextImage alt="" className="object-cover" fill sizes="100vw" src={image.url} />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/75 to-ink/40" />
      </div>
      <div className="container grid gap-12 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <h2
            className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-light leading-[0.98] tracking-[-0.03em]"
            id={id}
          >
            <SplitLines lines={[title]} />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-8 max-w-md leading-relaxed text-cream/70 md:text-lg">{text}</p>
          </Reveal>
        </div>
        <Reveal className="flex flex-col gap-3 sm:flex-row md:col-span-5 md:justify-end" delay={0.25}>
          {actions}
        </Reveal>
      </div>
    </section>
  )
}

/** Numbered index used in editorial lists ("01", "02" ...). */
export const indexLabel = (i: number) => String(i + 1).padStart(2, '0')
