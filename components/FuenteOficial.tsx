import type { Municipio } from '@/types/municipio'

const CONFIANZA_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  Alta: { label: 'Alta', color: 'text-[#15803D]', dot: 'bg-[#15803D]' },
  'Media-alta': { label: 'Media-alta', color: 'text-[#0C1B33]', dot: 'bg-[#FFC200]' },
  Media: { label: 'Media', color: 'text-amber-700', dot: 'bg-amber-500' },
  'Media-baja': { label: 'Media-baja', color: 'text-slate-500', dot: 'bg-slate-400' },
  Baja: { label: 'Baja', color: 'text-slate-400', dot: 'bg-slate-300' },
}

function ConfianzaBadge({ confianza }: { confianza: string }) {
  const cfg = CONFIANZA_CONFIG[confianza] ?? CONFIANZA_CONFIG['Media']
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${cfg.color}`}>
      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
      Confianza {cfg.label}
    </span>
  )
}

interface Props {
  municipio: Municipio
  mostrarDecretoCompleto?: boolean
}

export default function FuenteOficial({ municipio, mostrarDecretoCompleto = true }: Props) {
  const dominio = municipio.fuente
    ? (() => {
        try {
          return new URL(municipio.fuente).hostname.replace('www.', '')
        } catch {
          return municipio.fuente
        }
      })()
    : null

  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden mb-6">
      <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4">
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
          Fuente verificada
        </span>
        <ConfianzaBadge confianza={municipio.confianza} />
      </div>

      <div className="px-5 py-4 bg-white">
        {mostrarDecretoCompleto && municipio.norma_local && (
          <p className="font-semibold text-slate-800 text-sm mb-1">{municipio.norma_local}</p>
        )}

        <p className="text-sm text-slate-600 mb-3">
          {municipio.fuente
            ? `Fuente registrada · ${municipio.departamento_area}`
            : `Sin fuente específica registrada · ${municipio.departamento_area}`}
        </p>

        {municipio.fuente && (
          <a
            href={municipio.fuente}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-[#0C1B33] font-medium hover:underline break-all"
          >
            ↗ {dominio}
          </a>
        )}

        <p className="text-xs text-slate-400 mt-3">
          Verificado el 28 de mayo de 2026 ·{' '}
          <a href="/metodologia/" className="hover:underline">
            Ver metodología
          </a>
        </p>
      </div>
    </div>
  )
}
