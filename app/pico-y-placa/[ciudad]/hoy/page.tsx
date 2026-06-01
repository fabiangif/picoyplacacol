import { notFound } from 'next/navigation'
import { getMunicipiosActivos, getMunicipio } from '@/lib/municipios'
import { getDigitosDelDia, puedeCalcularDia, tieneCalendarioAutomatizable } from '@/lib/digitos'
import { generarBreadcrumbSchema, generarFAQSchema } from '@/lib/schema'
import { metadataHoy } from '@/lib/seo'
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
  return m ? metadataHoy(m) : {}
}

export default async function HoyPage({ params }: Props) {
  const { ciudad } = await params
  const m = getMunicipio(ciudad)
  if (!m) notFound()

  const puedeCalcular = puedeCalcularDia(m, 0)
  const tieneCalendario = tieneCalendarioAutomatizable(m)
  const hoy = getDigitosDelDia(m, 0)
  const manana = getDigitosDelDia(m, 1)
  const visual = getCityVisual(m)

  const breadcrumbs = [
    { nombre: 'Inicio', href: '/' },
    { nombre: 'Pico y Placa Colombia', href: '/pico-y-placa/' },
    { nombre: m.ubicacion, href: `/pico-y-placa/${ciudad}/` },
    { nombre: 'Hoy', href: `/pico-y-placa/${ciudad}/hoy/` },
  ]

  const faqs = puedeCalcular
    ? [
        {
          pregunta: `¿Hay pico y placa en ${m.ubicacion} hoy?`,
          respuesta: hoy.tieneRestriccion
            ? `Sí. Hoy ${hoy.fecha} no pueden circular los vehículos con placa terminada en ${hoy.digitos?.join(' ni ')}. Horario: ${hoy.horario}.`
            : `No hay restricción de pico y placa en ${m.ubicacion} hoy ${hoy.fecha}${hoy.esFindeSemana ? ' (fin de semana)' : ''}.`,
        },
        {
          pregunta: `¿Qué dígitos no circulan hoy en ${m.ubicacion}?`,
          respuesta: hoy.tieneRestriccion && hoy.digitos
            ? `Hoy no pueden circular los vehículos cuya placa termina en ${hoy.digitos.join(' o ')}.`
            : `Hoy no hay dígitos restringidos en ${m.ubicacion}.`,
        },
      ]
    : [
        {
          pregunta: `¿Hay pico y placa en ${m.ubicacion} hoy?`,
          respuesta: `El SEO Pack registra este estado: ${m.estado}. Funcionamiento reportado: ${m.funcionamiento}. Verifica los dígitos de hoy en la fuente registrada antes de circular.`,
        },
        {
          pregunta: `¿Qué dígitos no circulan hoy en ${m.ubicacion}?`,
          respuesta: `Esta página no automatiza los dígitos de hoy para ${m.ubicacion}; consulta la fuente registrada: ${m.fuente}.`,
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
        eyebrow="Consulta diaria"
        title={`Pico y Placa ${m.ubicacion} para hoy`}
      />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Respuesta principal */}
        {!tieneCalendario ? (
          <ResumenSinCalendario municipio={m} />
        ) : hoy.requiereFuente ? (
          <ResumenConsultaDia municipio={m} dia={hoy} />
        ) : hoy.tieneRestriccion && hoy.digitos ? (
          <div className="traffic-sign-card">
            <div className="traffic-sign-top" />
            <div className="p-6 traffic-sign-panel">
              <p className="text-sm font-bold text-[#0C1B33] mb-4">
                Hoy no pueden circular los vehículos con placa terminada en:
              </p>
              <div className="flex justify-center gap-4 mb-4">
                {hoy.digitos.map((d) => (
                  <div key={d} className="w-16 h-16 rounded-md bg-[#0C1B33] text-[#FFC200] text-3xl font-bold flex items-center justify-center shadow">
                    {d}
                  </div>
                ))}
              </div>
              <p className="text-sm text-[#0C1B33] text-center font-bold">
                Horario: {hoy.horario}
              </p>
            </div>
          </div>
        ) : (
          <div className="traffic-sign-card">
            <div className="traffic-sign-top" />
            <div className="p-8 traffic-sign-panel text-center">
              <p className="text-3xl font-bold text-[#0C1B33] mb-2">Sin restricción hoy</p>
              <p className="text-[#0C1B33] text-sm">
                {hoy.esFindeSemana
                  ? `El pico y placa en ${m.ubicacion} no aplica los fines de semana.`
                  : `No hay dígitos restringidos en ${m.ubicacion} hoy.`}
              </p>
            </div>
          </div>
        )}

        {/* Mañana (preview) */}
        {tieneCalendario && manana && (
          <div className="rounded-lg border border-slate-200 p-4 bg-white mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Mañana</p>
            {manana.requiereFuente ? (
              <p className="text-sm text-slate-600">Consulta la fuente registrada para mañana.</p>
            ) : manana.tieneRestriccion && manana.digitos ? (
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  {manana.digitos.map((d) => (
                    <span key={d} className="w-8 h-8 rounded bg-[#B91C1C] text-white font-bold text-sm flex items-center justify-center">{d}</span>
                  ))}
                </div>
                <span className="text-sm text-slate-600">No circulan placas {manana.digitos.join(' y ')}</span>
              </div>
            ) : (
              <p className="text-sm text-[#15803D] font-medium">Sin restricción mañana</p>
            )}
            <Link href={`/pico-y-placa/${ciudad}/manana/`}
              className="text-xs text-slate-500 hover:underline mt-2 inline-block">
              Ver detalle de mañana →
            </Link>
          </div>
        )}

        <FuenteOficial municipio={m} mostrarDecretoCompleto={false} />
        <CityMap municipio={m} />

        <div className="flex gap-3 mb-6">
          <Link href={`/pico-y-placa/${ciudad}/`}
            className="flex-1 text-center py-2.5 px-4 rounded border border-slate-300 text-sm text-slate-700 hover:border-[#FFC200] transition-colors">
            Ver semana completa
          </Link>
          {tieneCalendario && (
            <Link href={`/pico-y-placa/${ciudad}/manana/`}
              className="flex-1 text-center py-2.5 px-4 rounded border border-slate-300 text-sm text-slate-700 hover:border-[#FFC200] transition-colors">
              Ver mañana →
            </Link>
          )}
        </div>

        <UltimaVerificacion fecha="28 de mayo de 2026" fuente={m.fuente} />
      </main>
    </>
  )
}
