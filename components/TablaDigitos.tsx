import type { Municipio } from '@/types/municipio'
import { getReglaMunicipio, getTablaDigitos, usaReglaBogota } from '@/lib/digitos'

export default function TablaDigitos({ municipio }: { municipio: Municipio }) {
  const filas = getTablaDigitos(municipio)
  const regla = getReglaMunicipio(municipio)
  const hoyDow = new Date().getDay()

  if (usaReglaBogota(municipio)) {
    return (
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#0C1B33] mb-1">
          Dígitos restringidos en Bogotá
        </h2>
        <p className="text-xs text-slate-500 mb-3">Horario: 06:00 – 21:00 · Lunes a viernes hábiles</p>

        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0C1B33] text-white text-xs uppercase tracking-wide">
                <th className="px-4 py-3 text-left font-medium">Fecha</th>
                <th className="px-4 py-3 text-left font-medium">Últimos dígitos restringidos</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-100 bg-white">
                <td className="px-4 py-3 font-medium text-slate-800">Días pares</td>
                <td className="px-4 py-3 text-slate-600">1, 2, 3, 4 y 5</td>
              </tr>
              <tr className="border-t border-slate-100 bg-slate-50/50">
                <td className="px-4 py-3 font-medium text-slate-800">Días impares</td>
                <td className="px-4 py-3 text-slate-600">6, 7, 8, 9 y 0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    )
  }

  if (!filas || !regla) {
    return (
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#0C1B33] mb-3">
          Horario y funcionamiento
        </h2>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-700 leading-relaxed">{municipio.funcionamiento}</p>
          <p className="text-xs text-slate-400 mt-2">
            Consulte el decreto oficial para el detalle completo.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-[#0C1B33] mb-1">
        Dígitos restringidos por día de la semana
      </h2>
      <p className="text-xs text-slate-500 mb-3">Horario: {regla.horario} · Lunes a viernes hábiles</p>

      <div className="rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#0C1B33] text-white text-xs uppercase tracking-wide">
              <th className="px-4 py-3 text-left font-medium">Día</th>
              <th className="px-4 py-3 text-left font-medium">Últimos dígitos restringidos</th>
              <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">Horario</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((fila) => {
              const esHoy = fila.diaDow === hoyDow
              return (
                <tr
                  key={fila.dia}
                  className={`border-t border-slate-100 ${esHoy ? 'bg-[#FFF8DC]' : 'bg-white hover:bg-slate-50'}`}
                >
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {fila.dia}
                    {esHoy && (
                      <span className="ml-2 text-[10px] font-bold bg-[#FFC200] text-[#0C1B33] px-1.5 py-0.5 rounded">
                        HOY
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {fila.digitos.map((d) => (
                        <span
                          key={d}
                          className={`w-7 h-7 rounded text-sm font-bold flex items-center justify-center ${
                            esHoy
                              ? 'bg-[#B91C1C] text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs hidden sm:table-cell">
                    {regla.horario}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
