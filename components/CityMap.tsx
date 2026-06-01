import type { Municipio } from '@/types/municipio'
import { getMapEmbedUrl, getMapQuery, getMapSearchUrl } from '@/lib/visuals'

export default function CityMap({ municipio }: { municipio: Municipio }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white overflow-hidden mb-8">
      <div className="p-4 border-b border-slate-200">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
          Ubicación
        </p>
        <h2 className="text-base font-bold text-[#0C1B33]">
          Mapa de {municipio.ubicacion}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Referencia geográfica para búsquedas locales y contexto de movilidad.
        </p>
      </div>
      <iframe
        title={`Mapa de ${municipio.ubicacion}`}
        src={getMapEmbedUrl(municipio)}
        className="h-64 w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500">{getMapQuery(municipio)}</p>
        <a
          href={getMapSearchUrl(municipio)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-[#0C1B33] underline underline-offset-4"
        >
          Abrir mapa
        </a>
      </div>
    </section>
  )
}
