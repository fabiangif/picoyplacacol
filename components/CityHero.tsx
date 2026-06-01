import type { ReactNode } from 'react'
import Image from 'next/image'
import type { Municipio } from '@/types/municipio'
import type { BreadcrumbItem } from '@/lib/schema'
import type { CityVisual } from '@/lib/visuals'
import Breadcrumb from '@/components/Breadcrumb'
import EstadoBadge from '@/components/EstadoBadge'

interface Props {
  municipio: Municipio
  visual: CityVisual
  breadcrumbs: BreadcrumbItem[]
  eyebrow?: string
  title?: string
  children?: ReactNode
}

export default function CityHero({
  municipio,
  visual,
  breadcrumbs,
  eyebrow = 'Consulta local verificada',
  title,
  children,
}: Props) {
  return (
    <section className="relative overflow-hidden bg-[#07111F] text-white">
      <Image
        src={visual.src}
        alt={visual.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-[#07111F]/70" />
      <div className="relative max-w-5xl mx-auto px-4 py-8 lg:py-12">
        <Breadcrumb items={breadcrumbs} variant="light" />

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_390px] gap-8 items-end mt-8">
          <div className="min-w-0 max-w-2xl">
            <p className="text-[#FFC200] text-xs font-semibold uppercase tracking-widest mb-3">
              {eyebrow}
            </p>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <h1 className="min-w-0 max-w-full break-words text-3xl sm:text-5xl font-bold leading-tight">
                {title ?? `Pico y Placa ${municipio.ubicacion} ${new Date().getFullYear()}`}
              </h1>
              <EstadoBadge estado={municipio.estado} />
            </div>
            <p className="text-slate-200 text-base leading-relaxed max-w-xl">
              {municipio.departamento_area}. Información por fecha, horario, fuente registrada,
              excepciones y contexto local para tomar decisiones antes de circular.
            </p>

            <div className="flex flex-wrap gap-2 mt-5 text-xs">
              <span className="rounded border border-white/20 bg-white/10 px-3 py-1.5">
                {municipio.vehiculos}
              </span>
              <span className="rounded border border-white/20 bg-white/10 px-3 py-1.5">
                Confianza {municipio.confianza}
              </span>
              <span className="rounded border border-white/20 bg-white/10 px-3 py-1.5">
                Corte 28 de mayo de 2026
              </span>
            </div>

            {visual.page && (
              <a
                href={visual.page}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-5 text-xs text-slate-300 underline decoration-white/30 underline-offset-4 hover:text-white"
              >
                Imagen de referencia: {visual.title}
              </a>
            )}
          </div>

          {children && <div className="lg:pt-8">{children}</div>}
        </div>
      </div>
    </section>
  )
}
