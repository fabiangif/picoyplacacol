import { notFound } from 'next/navigation'
import { getMunicipiosActivos, getMunicipio } from '@/lib/municipios'
import { getDigitosDelDia, puedeCalcularDia, tieneCalendarioAutomatizable } from '@/lib/digitos'
import { generarBreadcrumbSchema, generarFAQSchema } from '@/lib/schema'
import { metadataManana } from '@/lib/seo'
import UltimaVerificacion from '@/components/UltimaVerificacion'
import FuenteOficial from '@/components/FuenteOficial'
import { ResumenConsultaDia, ResumenSinCalendario } from '@/components/ResumenHoy'
import { getCityVisual } from '@/lib/visuals'
import CityHero from '@/components/CityHero'
import CityMap from '@/components/CityMap'
import Link from 'next/link'

export const revalidate = 3600

type Props = { params: Promise<{ ciudad: string }> }

export async function generateStaticParams() {
  return getMunicipiosActivos().map((m) => ({ ciudad: m.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { ciudad } = await params
  const m = getMunicipio(ciudad)
  return m ? metadataManana(m) : {}
}

export default async function MananaPage({ params }: Props) {
  const { ciudad } = await params
  const m = getMunicipio(ciudad)
  if (!m) notFound()

  const puedeCalcular = puedeCalcularDia(m, 1)
  const tieneCalendario = tieneCalendarioAutomatizable(m)
  const hoy = getDigitosDelDia(m, 0)
  const manana = getDigitosDelDia(m, 1)
  const visual = getCityVisual(m)

  const breadcrumbs = [
    { nombre: 'Inicio', href: '/' },
    { nombre: 'Pico y Placa Colombia', href: '/pico-y-placa/' },
    { nombre: m.ubicacion, href: `/pico-y-placa/${ciudad}/` },
    { nombre: 'Mañana', href: `/pico-y-placa/${ciudad}/manana/` },
  ]

  const faqs = puedeCalcular
    ? [
        {
          pregunta: `¿Hay pico y placa en ${m.ubicacion} mañana?`,
          respuesta: manana.tieneRestriccion
            ? `Sí. Mañana ${manana.fecha} no pueden circular los vehículos con placa terminada en ${manana.digitos?.join(' ni ')}. Horario: ${manana.horario}.`
            : `No hay restricción de pico y placa en ${m.ubicacion} mañana ${manana.fecha}${manana.esFindeSemana ? ' (fin de semana)' : ''}.`,
        },
        {
          pregunta: `¿Qué dígitos no circulan mañana en ${m.ubicacion}?`,
          respuesta: manana.tieneRestriccion && manana.digitos
            ? `Mañana no pueden circular los vehículos cuya placa termina en ${manana.digitos.join(' o ')}.`
            : `Mañana no hay dígitos restringidos en ${m.ubicacion}.`,
        },
      ]
    : [
        {
          pregunta: `¿Hay pico y placa en ${m.ubicacion} mañana?`,
          respuesta: `El SEO Pack registra este estado: ${m.estado}. Funcionamiento reportado: ${m.funcionamiento}. Verifica los dígitos de mañana en la fuente registrada antes de circular.`,
        },
        {
          pregunta: `¿Qué dígitos no circulan mañana en ${m.ubicacion}?`,
          respuesta: `Esta página no automatiza los dígitos de mañana para ${m.ubicacion}; consulta la fuente registrada: ${m.fuente}.`,
        },
      ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([generarBreadcrumbSchema(breadcrumbs), generarFAQSchema(faqs)]),
        }}
      />

      <div className="h-1 bg-[#FFC200]" />

      <CityHero
        municipio={m}
        visual={visual}
        breadcrumbs={breadcrumbs}
        eyebrow="Consulta predictiva"
        title={`Pico y Placa ${m.ubicacion} para mañana`}
      />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Respuesta principal para mañana */}
        {!tieneCalendario ? (
          <ResumenSinCalendario municipio={m} />
        ) : manana.requiereFuente ? (
          <ResumenConsultaDia municipio={m} dia={manana} />
        ) : manana.tieneRestriccion && manana.digitos ? (
          <div className="traffic-sign-card">
            <div className="traffic-sign-top" />
            <div className="p-6 traffic-sign-panel">
              <p className="text-sm font-bold text-[#0C1B33] mb-4">
                Mañana no pueden circular los vehículos con placa terminada en:
              </p>
              <div className="flex justify-center gap-4 mb-4">
                {manana.digitos.map((d) => (
                  <div key={d} className="w-16 h-16 rounded-md bg-[#0C1B33] text-[#FFC200] text-3xl font-bold flex items-center justify-center shadow">
                    {d}
                  </div>
                ))}
              </div>
              <p className="text-sm text-[#0C1B33] text-center font-bold">
                Horario: {manana.horario}
              </p>
            </div>
          </div>
        ) : (
          <div className="traffic-sign-card">
            <div className="traffic-sign-top" />
            <div className="p-8 traffic-sign-panel text-center">
              <p className="text-3xl font-bold text-[#0C1B33] mb-2">Sin restricción mañana</p>
              <p className="text-[#0C1B33] text-sm">
                {manana.esFindeSemana
                  ? `El pico y placa en ${m.ubicacion} no aplica los fines de semana.`
                  : `No hay dígitos restringidos en ${m.ubicacion} mañana.`}
              </p>
            </div>
          </div>
        )}

        {/* Hoy (preview) */}
        {tieneCalendario && hoy && (
          <div className="rounded-lg border border-slate-200 p-4 bg-white mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Hoy</p>
            {hoy.requiereFuente ? (
              <p className="text-sm text-slate-600">Consulta la fuente registrada para hoy.</p>
            ) : hoy.tieneRestriccion && hoy.digitos ? (
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  {hoy.digitos.map((d) => (
                    <span key={d} className="w-8 h-8 rounded bg-[#B91C1C] text-white font-bold text-sm flex items-center justify-center">{d}</span>
                  ))}
                </div>
                <span className="text-sm text-slate-600">No circulan placas {hoy.digitos.join(' y ')}</span>
              </div>
            ) : (
              <p className="text-sm text-[#15803D] font-medium">Sin restricción hoy</p>
            )}
            <Link href={`/pico-y-placa/${ciudad}/hoy/`}
              className="text-xs text-slate-500 hover:underline mt-2 inline-block">
              ← Ver detalle de hoy
            </Link>
          </div>
        )}

        <FuenteOficial municipio={m} mostrarDecretoCompleto={false} />
        <CityMap municipio={m} />

        <div className="flex gap-3 mb-6">
          {tieneCalendario && (
            <Link href={`/pico-y-placa/${ciudad}/hoy/`}
              className="flex-1 text-center py-2.5 px-4 rounded border border-slate-300 text-sm text-slate-700 hover:border-[#FFC200] transition-colors">
              ← Ver hoy
            </Link>
          )}
          <Link href={`/pico-y-placa/${ciudad}/`}
            className="flex-1 text-center py-2.5 px-4 rounded border border-slate-300 text-sm text-slate-700 hover:border-[#FFC200] transition-colors">
            Ver semana completa
          </Link>
        </div>

        <UltimaVerificacion fecha="28 de mayo de 2026" fuente={m.fuente} />
      </main>
    </>
  )
}
