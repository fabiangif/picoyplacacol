import Link from 'next/link'
import type { BreadcrumbItem } from '@/lib/schema'

export default function Breadcrumb({
  items,
  variant = 'default',
}: {
  items: BreadcrumbItem[]
  variant?: 'default' | 'light'
}) {
  const baseClass = variant === 'light' ? 'text-slate-300' : 'text-slate-500'
  const currentClass = variant === 'light' ? 'text-white font-medium' : 'text-slate-700 font-medium'
  const linkClass = variant === 'light' ? 'hover:text-white transition-colors' : 'hover:text-slate-900 transition-colors'

  return (
    <nav aria-label="Breadcrumb">
      <ol className={`flex flex-wrap items-center gap-1 text-sm ${baseClass}`}>
        {items.map((item, i) => (
          <li key={item.href} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden>/</span>}
            {i === items.length - 1 ? (
              <span className={currentClass}>{item.nombre}</span>
            ) : (
              <Link href={item.href} className={linkClass}>
                {item.nombre}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
