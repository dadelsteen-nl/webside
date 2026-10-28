import {
  Activity,
  Brain,
  Dumbbell,
  Gauge,
  Heart,
  LayoutGrid,
  type LucideIcon,
  Monitor,
  Ruler,
  Scale,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Timer,
  Wifi,
  Zap,
} from 'lucide-react'

const icons: Record<string, LucideIcon> = {
  activity: Activity,
  brain: Brain,
  dumbbell: Dumbbell,
  gauge: Gauge,
  heart: Heart,
  'layout-grid': LayoutGrid,
  monitor: Monitor,
  ruler: Ruler,
  scale: Scale,
  'shield-check': ShieldCheck,
  smartphone: Smartphone,
  sparkles: Sparkles,
  timer: Timer,
  wifi: Wifi,
  zap: Zap,
}

/** Renders a curated lucide icon by its kebab-case name (CMS field), falling back to Sparkles. */
export function FeatureIcon({ name, className }: { name?: string | null; className?: string }) {
  const Icon = (name && icons[name]) || Sparkles
  return <Icon aria-hidden="true" className={className} strokeWidth={1.1} />
}
