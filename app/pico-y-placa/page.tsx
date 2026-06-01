import type { Metadata } from 'next'
import Image from 'next/image'
import { getMunicipios } from '@/lib/municipios'
import CiudadCard from '@/components/CiudadCard'
import Breadcrumb from '@/components/Breadcrumb'
import { getCityVisualBySlug } from '@/lib/visuals'

export const metadata: Metadata = {
  title: 'Pico y Placa en todas las ciudades de Colombia 2026',
  description:
    'Directorio completo del pico y placa en Colombia: Bogotá, Medellín, Cali, Bucaramanga, Pasto y más de 60 municipios. Consulta el estado y horarios actualizados.',
  alternates: { canonical: '/pico-y-placa/' },
}

const BREADCRUMBS = [
  { nombre: 'Inicio', href: '/' },
  { nombre: 'Pico y Placa Colombia', href: '/pico-y-placa/' },
]

const GRUPOS = [
  { label: 'Prioridad alta (P0)', prioridades: ['P0'] },
  { label: 'Ciudades principales (P1)', prioridades: ['P1'] },
  { label: 'Otras ciudades (P2)', prioridades: ['P2', 'P2 aclaratoria'] },
  { label: 'Municipios y departamentos (P3)', prioridades: ['P3'] },
]

export default function DirectorioPage() {
  const todos = getMunicipios()
  const visual = getCityVisualBySlug('medellin')

  return (
    <>
      <section className="relative overflow-hidden bg-[#07111F] text-white">
        <Image
          src={visual.src}
          alt={visual.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-[#07111F]/75" />
        <div className="relative max-w-5xl mx-auto px-4 py-12">
          <Breadcrumb items={BREADCRUMBS} variant="light" />
          <p className="text-[#FFC200] text-xs font-semibold uppercase tracking-widest mt-8 mb-3">
            Directorio nacional
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight max-w-3xl">
            Pico y Placa en Colombia
          </h1>
          <p className="text-slate-200 text-base mt-4 max-w-2xl leading-relaxed">
            {todos.length} ubicaciones registradas con estado editorial, fuente, prioridad SEO,
            imagen local y acceso a la consulta diaria cuando existe calendario automatizable.
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {GRUPOS.map((grupo) => {
          const ciudades = todos.filter((m) => grupo.prioridades.includes(m.seo_priority))
          if (ciudades.length === 0) return null
          return (
            <section key={grupo.label} className="mb-12">
              <div className="flex items-end justify-between gap-4 mb-4 pb-2 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-bold text-[#0C1B33]">
                    {grupo.label}
                  </h2>
                  <p className="text-xs text-slate-500">{ciudades.length} ubicaciones</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {ciudades.map((m) => (
                  <CiudadCard key={m.slug} municipio={m} />
                ))}
              </div>
            </section>
          )
        })}
      </main>
    </>
  )
}
