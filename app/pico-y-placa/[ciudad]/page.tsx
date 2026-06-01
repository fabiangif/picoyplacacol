import { notFound } from 'next/navigation'
import { getMunicipios, getMunicipio } from '@/lib/municipios'
import { getDigitosDelDia, tieneCalendarioAutomatizable } from '@/lib/digitos'
import { generarBreadcrumbSchema, generarFAQSchema, generarPlaceSchema } from '@/lib/schema'
import { metadataCiudad, generarFAQsCiudad } from '@/lib/seo'
import { clasificarEstado } from '@/types/municipio'
import { getCityVisual, getMapSearchUrl } from '@/lib/visuals'
import CityHero from '@/components/CityHero'
import CityMap from '@/components/CityMap'
import ResumenHoy, {
  ResumenNoMunicipio,
  ResumenRegional,
  ResumenSinCalendario,
  ResumenSinEvidencia,
  ResumenSoloTaxis,
  ResumenTemporal,
} from '@/components/ResumenHoy'
import FuenteOficial from '@/components/FuenteOficial'
import TablaDigitos from '@/components/TablaDigitos'
import FAQ from '@/components/FAQ'
import UltimaVerificacion from '@/components/UltimaVerificacion'
import Link from 'next/link'

export const revalidate = 3600

type Props = { params: Promise<{ ciudad: string }> }

export async function generateStaticParams() {
  return getMunicipios().map((m) => ({ ciudad: m.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { ciudad } = await params
  const m = getMunicipio(ciudad)
  return m ? metadataCiudad(m) : {}
}

export default async function CiudadPage({ params }: Props) {
  const { ciudad } = await params
  const m = getMunicipio(ciudad)
  if (!m) notFound()

  const tipo = clasificarEstado(m.estado)
  const esActivo = ['activo', 'activo-amva', 'activo-amb'].includes(tipo)
  const tieneCalendario = tieneCalendarioAutomatizable(m)

  const hoy = getDigitosDelDia(m, 0)
  const manana = getDigitosDelDia(m, 1)
  const visual = getCityVisual(m)

  const breadcrumbs = [
    { nombre: 'Inicio', href: '/' },
    { nombre: 'Pico y Placa Colombia', href: '/pico-y-placa/' },
    { nombre: m.ubicacion, href: `/pico-y-placa/${ciudad}/` },
  ]

  const faqs = generarFAQsCiudad(m)

  const jsonLd = [
    generarBreadcrumbSchema(breadcrumbs),
    generarFAQSchema(faqs),
    generarPlaceSchema({
      name: m.ubicacion,
      region: m.departamento_area,
      url: `/pico-y-placa/${ciudad}/`,
      image: visual.src,
      map: getMapSearchUrl(m),
    }),
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <CityHero municipio={m} visual={visual} breadcrumbs={breadcrumbs}>
        {esActivo && tieneCalendario && (
          <ResumenHoy municipio={m} hoy={hoy} mañana={manana} />
        )}
        {esActivo && !tieneCalendario && (
          <ResumenSinCalendario municipio={m} />
        )}
        {tipo === 'regional' && (
          <ResumenRegional municipio={m} />
        )}
        {tipo === 'temporal' && (
          <ResumenTemporal municipio={m} />
        )}
        {tipo === 'solo-taxis' && (
          <ResumenSoloTaxis municipio={m} />
        )}
        {tipo === 'no-municipio' && (
          <ResumenNoMunicipio municipio={m} />
        )}
        {tipo === 'sin-evidencia' && (
          <ResumenSinEvidencia municipio={m} />
        )}
      </CityHero>

      <main className="max-w-5xl mx-auto px-4 py-10">

        {/* Fuente y confianza */}
        <FuenteOficial municipio={m} />

        <CityMap municipio={m} />

        {/* Calendario semanal */}
        {esActivo && tieneCalendario && <TablaDigitos municipio={m} />}

        {/* Detalle operativo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="rounded-lg border border-slate-200 p-4 bg-white">
            <h2 className="text-sm font-semibold text-[#0C1B33] mb-2">Vehículos con restricción</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{m.vehiculos}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4 bg-white">
            <h2 className="text-sm font-semibold text-[#0C1B33] mb-2">Norma o referencia</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {m.norma_local || 'No aplica como norma local única'}
            </p>
            {m.fuente && (
              <a href={m.fuente} target="_blank" rel="noopener noreferrer"
                className="text-xs text-[#0C1B33] hover:underline mt-1 inline-block">
                Ver fuente →
              </a>
            )}
          </div>
        </div>

        {/* ━━━ BLOQUE 5: EXCEPCIONES ━━━ */}
        {(esActivo || tipo === 'regional' || tipo === 'temporal' || tipo === 'solo-taxis') && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-[#0C1B33] mb-3">
              Excepciones al pico y placa en {m.ubicacion}
            </h2>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-600 leading-relaxed mb-2">
                Las excepciones específicas deben verificarse en la norma o fuente vigente de{' '}
                {m.ubicacion}. Las más comunes según el marco nacional son:
              </p>
              <ul className="text-sm text-slate-600 space-y-1.5 ml-4 list-disc">
                <li>Vehículos de emergencia (ambulancias, bomberos, policía, ejército)</li>
                <li>Transporte escolar con permiso de operación vigente</li>
                <li>Vehículos eléctricos e híbridos (Ley 1964 de 2019)</li>
                <li>Vehículos con pasajeros en labor de parto o emergencia médica</li>
                <li>Transporte de carga en corredores autorizados</li>
              </ul>
              <p className="text-xs text-slate-400 mt-3">
                Cada municipio puede ampliar o modificar estas excepciones mediante decreto local.
                {m.fuente ? (
                  <>
                    {' '}Consulte la{' '}
                    <a href={m.fuente} target="_blank" rel="noopener noreferrer"
                      className="underline hover:text-slate-600">
                      fuente registrada
                    </a>{' '}
                    de {m.ubicacion}.
                  </>
                ) : (
                  ' Consulte la secretaría de movilidad o tránsito correspondiente.'
                )}
              </p>
            </div>
          </section>
        )}

        {/* ━━━ BLOQUE 6: MULTA ━━━ */}
        {(esActivo || tipo === 'regional' || tipo === 'temporal' || tipo === 'solo-taxis') && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-[#0C1B33] mb-3">
              Multa por violar el pico y placa
            </h2>
            <div className="rounded-lg border border-[#FFC200] bg-[#FFF8DC] p-4">
              <p className="text-sm text-slate-700 leading-relaxed">
                La sanción está tipificada en el{' '}
                <strong>artículo 131, literal C.14 del Código Nacional de Tránsito</strong>{' '}
                (Ley 769 de 2002): <strong>15 salarios mínimos legales mensuales vigentes (SMLMV)</strong>.
                Para el año 2026, consulte el valor equivalente actualizado en pesos con la Secretaría
                de Tránsito de {m.ubicacion}.
              </p>
              <a
                href="https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=5557"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-500 hover:underline mt-2 inline-block"
              >
                Ver Ley 769 de 2002, Código Nacional de Tránsito ↗
              </a>
            </div>
          </section>
        )}

        {/* ━━━ BLOQUE 7: FAQ (query fan-out) ━━━ */}
        <FAQ items={faqs} />

        {/* ━━━ BLOQUE 8: ÚLTIMA VERIFICACIÓN ━━━ */}
        <UltimaVerificacion fecha="28 de mayo de 2026" fuente={m.fuente} />

        {/* ━━━ BLOQUE 9: NAVEGACIÓN INTERNA ━━━ */}
        <nav className="pt-6 border-t border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Ver también
          </p>
          <div className="flex flex-wrap gap-2 text-sm">
            {esActivo && tieneCalendario && (
              <>
                <Link href={`/pico-y-placa/${ciudad}/hoy/`}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:border-[#FFC200] hover:bg-[#FFF8DC] transition-colors">
                  Hoy en {m.ubicacion}
                </Link>
                <Link href={`/pico-y-placa/${ciudad}/manana/`}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:border-[#FFC200] hover:bg-[#FFF8DC] transition-colors">
                  Mañana en {m.ubicacion}
                </Link>
              </>
            )}
            <Link href="/pico-y-placa/"
              className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:border-slate-400 transition-colors">
              Todas las ciudades
            </Link>
            <Link href="/pico-y-placa-regional/"
              className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:border-slate-400 transition-colors">
              Pico y placa regional
            </Link>
          </div>
        </nav>
      </main>
    </>
  )
}
