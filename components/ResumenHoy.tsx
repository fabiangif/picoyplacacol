import type { Municipio } from '@/types/municipio'
import type { DigitosDelDia } from '@/lib/digitos'
import Link from 'next/link'

interface Props {
  municipio: Municipio
  hoy: DigitosDelDia
  mañana?: DigitosDelDia
}

function DigitoBadge({ digito }: { digito: number }) {
  return (
    <div className="w-14 h-14 rounded-md bg-[#0C1B33] text-[#FFC200] text-3xl font-bold flex items-center justify-center shadow-sm select-none">
      {digito}
    </div>
  )
}

function formatDigitos(digitos: number[]) {
  return new Intl.ListFormat('es-CO', { style: 'long', type: 'conjunction' })
    .format(digitos.map(String))
}

export default function ResumenHoy({ municipio, hoy, mañana }: Props) {
  const { tieneRestriccion, digitos, horario, fecha, diaNombre, esFindeSemana } = hoy

  if (hoy.requiereFuente) {
    return <ResumenConsultaDia municipio={municipio} dia={hoy} />
  }

  /* ── Sin restricción ── */
  if (!tieneRestriccion) {
    return (
      <div className="traffic-sign-card">
        <div className="traffic-sign-top" />
        <div className="p-6 traffic-sign-panel">
          <p className="text-xs font-semibold text-[#0C1B33] uppercase tracking-widest mb-3">
            {diaNombre} · {fecha}
          </p>
          <p className="text-2xl font-bold text-[#0C1B33] mb-1">
            Sin restricción hoy
          </p>
          <p className="text-[#0C1B33] text-sm">
            {esFindeSemana
              ? `El pico y placa en ${municipio.ubicacion} no aplica los fines de semana.`
              : `Hoy no hay dígitos restringidos en ${municipio.ubicacion}.`}
          </p>
          {horario !== 'Consultar fuente registrada' && (
            <p className="text-[#0C1B33] text-xs mt-2">Horario habitual: {horario}</p>
          )}
          {mañana?.tieneRestriccion && mañana.digitos && (
            <div className="mt-4 pt-4 border-t traffic-sign-divider">
              <p className="text-xs text-[#0C1B33] mb-1">Mañana sí hay restricción</p>
              <div className="flex items-center gap-2">
                {mañana.digitos.map((d) => (
                  <span key={d} className="w-8 h-8 rounded bg-[#0C1B33] text-[#FFC200] font-bold text-sm flex items-center justify-center">
                    {d}
                  </span>
                ))}
                <Link href={`/pico-y-placa/${municipio.slug}/manana/`}
                  className="text-xs font-semibold text-[#0C1B33] underline ml-1">
                  Ver mañana →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  /* ── Restricción activa ── */
  return (
    <div className="traffic-sign-card">
      <div className="traffic-sign-top" />
      <div className="p-6 traffic-sign-panel">
        <p className="text-xs font-semibold text-[#0C1B33] uppercase tracking-widest mb-3">
          {diaNombre} · {fecha}
        </p>

        <p className="text-sm font-bold text-[#0C1B33] mb-3">
          Hoy no pueden circular los vehículos con placa terminada en:
        </p>

        <div className="flex items-center gap-3 mb-4">
          {digitos?.map((d) => <DigitoBadge key={d} digito={d} />)}
        </div>

        <p className="text-sm text-[#0C1B33]">
          <span className="font-medium">Horario de restricción:</span>{' '}
          {horario}
        </p>

        {/* Links de navegación */}
        <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t traffic-sign-divider">
          <Link href={`/pico-y-placa/${municipio.slug}/hoy/`}
            className="text-sm font-semibold text-[#0C1B33] hover:underline">
            Detalle de hoy →
          </Link>
          {mañana && (
            <Link href={`/pico-y-placa/${municipio.slug}/manana/`}
              className="text-sm text-[#0C1B33] hover:underline">
              {mañana.requiereFuente
                ? 'Mañana: consultar fuente →'
                : mañana.tieneRestriccion && mañana.digitos
                ? `Mañana: placas ${formatDigitos(mañana.digitos)} →`
                : 'Mañana: sin restricción →'}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export function ResumenConsultaDia({
  municipio,
  dia,
}: {
  municipio: Municipio
  dia: DigitosDelDia
}) {
  return (
    <div className="traffic-sign-card">
      <div className="traffic-sign-top" />
      <div className="p-6 traffic-sign-panel">
        <p className="text-xs font-semibold text-[#0C1B33] uppercase tracking-widest mb-3">
          {dia.diaNombre} · {dia.fecha}
        </p>
        <p className="text-xl font-bold text-[#0C1B33] mb-2">
          Consulta la fuente registrada
        </p>
        <p className="text-sm text-[#0C1B33] leading-relaxed mb-3">
          {dia.motivoConsulta ||
            `El SEO Pack no trae dígitos automáticos para ${municipio.ubicacion} en esta fecha.`}
        </p>
        <p className="text-sm text-[#0C1B33] mb-4">
          <span className="font-semibold">Funcionamiento registrado:</span>{' '}
          {municipio.funcionamiento}
        </p>
        {municipio.fuente && (
          <a href={municipio.fuente} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-bold text-[#0C1B33] hover:underline">
            Ver fuente registrada ↗
          </a>
        )}
      </div>
    </div>
  )
}

/* Caja para ciudades sin datos automatizados pero con medida activa */
export function ResumenSinCalendario({ municipio }: { municipio: Municipio }) {
  const requiereProrroga = municipio.estado.toLowerCase().includes('hasta')

  return (
    <div className="traffic-sign-card">
      <div className="traffic-sign-top" />
      <div className="p-6 traffic-sign-panel">
        <p className="text-sm font-bold text-[#0C1B33] mb-2">
          Consulta directamente la fuente registrada
        </p>
        <p className="text-sm text-[#0C1B33] leading-relaxed mb-3">
          {requiereProrroga
            ? `El SEO Pack marca esta medida como "${municipio.estado}". No mostramos números automáticos sin una prórroga confirmada.`
            : `El SEO Pack registra una medida vigente o en revisión para ${municipio.ubicacion}, pero el calendario no está automatizado aquí.`}
          {' '}Funcionamiento reportado: {municipio.funcionamiento}.
        </p>
        <a href={municipio.fuente} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-bold text-[#0C1B33] hover:underline">
          Ver fuente registrada ↗
        </a>
      </div>
    </div>
  )
}

export function ResumenRegional({ municipio }: { municipio: Municipio }) {
  return (
    <div className="rounded-lg border border-blue-200 overflow-hidden mb-6">
      <div className="h-1 bg-blue-500 rounded-t" />
      <div className="p-6 bg-blue-50">
        <p className="text-sm font-semibold text-blue-900 mb-2">
          Medida regional, no restricción diaria local
        </p>
        <p className="text-sm text-blue-800 leading-relaxed mb-3">
          {municipio.funcionamiento}. Aplica a: {municipio.vehiculos}. El pack recomienda
          tratar esta página como aclaración regional para evitar publicar un calendario urbano
          diario que no está confirmado.
        </p>
        {municipio.fuente && (
          <a href={municipio.fuente} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-900 hover:underline">
            Ver fuente regional ↗
          </a>
        )}
      </div>
    </div>
  )
}

export function ResumenTemporal({ municipio }: { municipio: Municipio }) {
  return (
    <div className="rounded-lg border border-amber-200 overflow-hidden mb-6">
      <div className="h-1 bg-amber-500 rounded-t" />
      <div className="p-6 bg-amber-50">
        <p className="text-sm font-semibold text-amber-900 mb-2">
          Medida temporal o especial
        </p>
        <p className="text-sm text-amber-800 leading-relaxed mb-3">
          {municipio.funcionamiento}. Aplica a: {municipio.vehiculos}. No debe presentarse
          como calendario diario permanente si la fuente no confirma recurrencia.
        </p>
        {municipio.notas && (
          <p className="text-xs text-amber-700 mb-3">Nota editorial: {municipio.notas}</p>
        )}
        {municipio.fuente && (
          <a href={municipio.fuente} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-amber-900 hover:underline">
            Ver fuente ↗
          </a>
        )}
      </div>
    </div>
  )
}

export function ResumenSoloTaxis({ municipio }: { municipio: Municipio }) {
  return (
    <div className="rounded-lg border border-purple-200 overflow-hidden mb-6">
      <div className="h-1 bg-purple-500 rounded-t" />
      <div className="p-6 bg-purple-50">
        <p className="text-sm font-semibold text-purple-900 mb-2">
          No hay pico y placa urbano para particulares
        </p>
        <p className="text-sm text-purple-800 leading-relaxed mb-3">
          El pack separa la intención de búsqueda: {municipio.funcionamiento}. Vehículos:
          {' '}{municipio.vehiculos}.
        </p>
        {municipio.fuente && (
          <a href={municipio.fuente} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-purple-900 hover:underline">
            Ver fuente registrada ↗
          </a>
        )}
      </div>
    </div>
  )
}

export function ResumenNoMunicipio({ municipio }: { municipio: Municipio }) {
  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden mb-6">
      <div className="h-1 bg-slate-500 rounded-t" />
      <div className="p-6 bg-slate-50">
        <p className="text-sm font-semibold text-slate-700 mb-2">
          No es una medida municipal única
        </p>
        <p className="text-sm text-slate-500 leading-relaxed mb-3">
          {municipio.funcionamiento}. El pack recomienda usar esta página como apoyo de
          directorio, no como calendario departamental.
        </p>
        {municipio.notas && (
          <p className="text-xs text-slate-400">Nota editorial: {municipio.notas}</p>
        )}
      </div>
    </div>
  )
}

/* Caja para ciudades sin evidencia de medida activa */
export function ResumenSinEvidencia({ municipio }: { municipio: Municipio }) {
  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden mb-6">
      <div className="h-1 bg-slate-400 rounded-t" />
      <div className="p-6 bg-slate-50">
        <p className="text-sm font-semibold text-slate-700 mb-2">
          Sin medida vigente confirmada al 28 de mayo de 2026
        </p>
        <p className="text-sm text-slate-500 leading-relaxed mb-3">
          No encontramos evidencia de una restricción de pico y placa recurrente en{' '}
          {municipio.ubicacion}. Esto no significa que no exista, porque puede que la medida haya
          cambiado después del corte de esta investigación.
        </p>
        {municipio.funcionamiento && (
          <p className="text-xs text-slate-500 mb-3">
            Resultado del SEO Pack: {municipio.funcionamiento}.
          </p>
        )}
        {municipio.fuente && (
          <a href={municipio.fuente} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 hover:underline">
            Verificar en fuente registrada ↗
          </a>
        )}
      </div>
    </div>
  )
}
