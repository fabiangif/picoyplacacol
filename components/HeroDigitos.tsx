import type { Municipio } from '@/types/municipio'
import type { DigitosDelDia } from '@/lib/digitos'
import Link from 'next/link'

interface Props {
  municipio: Municipio
  digitosHoy: DigitosDelDia
}

export default function HeroDigitos({ municipio, digitosHoy }: Props) {
  const { tieneRestriccion, digitos, horario, fecha, esFindeSemana } = digitosHoy

  if (esFindeSemana && !tieneRestriccion) {
    return (
      <div className="rounded-2xl bg-green-50 border border-green-200 p-6 mb-6">
        <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">{fecha}</p>
        <p className="text-2xl font-bold text-green-800">Sin restricción hoy</p>
        <p className="text-green-700 text-sm mt-1">El pico y placa no aplica los fines de semana en {municipio.ubicacion}.</p>
        <p className="text-green-600 text-xs mt-2">Horario habitual: {horario}</p>
      </div>
    )
  }

  if (!tieneRestriccion || !digitos) {
    return (
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 mb-6">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{fecha}</p>
        <p className="text-lg font-semibold text-slate-700">Consulta la fuente registrada para conocer la restricción de hoy</p>
        <a href={municipio.fuente} target="_blank" rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-sm mt-2 inline-block">
          Ver fuente registrada →
        </a>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-red-50 border border-red-200 p-6 mb-6">
      <p className="text-xs font-medium text-red-500 uppercase tracking-wide mb-1">{fecha}</p>
      <p className="text-lg font-semibold text-red-800 mb-3">
        Hoy no pueden circular las placas que terminen en:
      </p>
      <div className="flex gap-3 mb-3">
        {digitos.map((d) => (
          <span key={d}
            className="w-12 h-12 rounded-xl bg-red-600 text-white text-2xl font-bold flex items-center justify-center shadow">
            {d}
          </span>
        ))}
      </div>
      <p className="text-red-700 text-sm">Horario: {horario}</p>
      <div className="flex gap-3 mt-4">
        <Link href={`/pico-y-placa/${municipio.slug}/hoy/`}
          className="text-sm text-red-700 underline hover:text-red-900">
          Ver detalle de hoy
        </Link>
        <Link href={`/pico-y-placa/${municipio.slug}/manana/`}
          className="text-sm text-slate-600 underline hover:text-slate-900">
          Ver mañana
        </Link>
      </div>
    </div>
  )
}
