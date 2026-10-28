'use client'

export function PrintButton({ label, className }: { label: string; className?: string }) {
  return (
    <button className={className} onClick={() => window.print()} type="button">
      {label}
    </button>
  )
}
