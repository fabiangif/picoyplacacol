import Link from 'next/link'
import Image from 'next/image'
import type { Municipio } from '@/types/municipio'
import EstadoBadge from './EstadoBadge'
import { getCityVisual } from '@/lib/visuals'

export default function CiudadCard({ municipio }: { municipio: Municipio }) {
  const vol = municipio.volumen_mensual_aprox
  const volLabel = vol >= 1000 ? `${(vol / 1000).toFixed(0)}K búsquedas/mes` : vol > 0 ? `${vol} búsquedas/mes` : null
  const esActivo = municipio.estado.toLowerCase().includes('activo')
  const visual = getCityVisual(municipio)

  return (
    <Link
      href={`/pico-y-placa/${municipio.slug}/`}
      className="group flex flex-col rounded-lg border border-slate-200 bg-white hover:border-[#FFC200] hover:shadow-md transition-all overflow-hidden"
    >
      <div className="relative h-28 overflow-hidden bg-slate-200">
        <Image
          src={visual.src}
          alt={visual.alt}
          fill
          sizes="(min-width: 768px) 25vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07111F]/70 via-transparent to-transparent" />
        <div className={`absolute top-0 left-0 right-0 h-1 ${esActivo ? 'bg-[#FFC200]' : 'bg-slate-300'}`} />
      </div>

      <div className="p-4 flex flex-col gap-1 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span className="font-semibold text-slate-900 group-hover:text-[#0C1B33] text-sm leading-snug">
            {municipio.ubicacion}
          </span>
          <EstadoBadge estado={municipio.estado} size="xs" />
        </div>
        <p className="text-xs text-slate-400">{municipio.departamento_area}</p>
        {volLabel && <p className="text-[11px] text-slate-300 mt-auto pt-2">{volLabel}</p>}
      </div>
    </Link>
  )
}
