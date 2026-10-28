export default function Loading() {
  return (
    <div aria-busy="true" className="container py-16 md:py-24">
      <div className="mb-12 h-3 w-32 animate-pulse bg-stone" />
      <div className="mb-16 h-14 w-2/3 max-w-xl animate-pulse bg-stone" />
      <div className="mb-16 aspect-[16/9] w-full animate-pulse bg-stone/70" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div className="aspect-[4/5] animate-pulse bg-stone/70" key={i} />
        ))}
      </div>
    </div>
  )
}
