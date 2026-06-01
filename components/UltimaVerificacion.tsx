export default function UltimaVerificacion({ fecha, fuente }: { fecha: string; fuente: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 mb-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
            Última verificación
          </p>
          <p className="text-sm text-slate-700">
            {fecha}. La información puede cambiar. Confirma siempre en la fuente registrada antes de circular.
          </p>
        </div>
        {fuente && (
          <a
            href={fuente}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-[#0C1B33] border border-slate-300 rounded px-3 py-1.5 hover:bg-white transition-colors shrink-0"
          >
            Ver fuente registrada ↗
          </a>
        )}
      </div>
    </div>
  )
}
