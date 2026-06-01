import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getMunicipios } from '@/lib/municipios'
import CiudadCard from '@/components/CiudadCard'
import { generarWebPageSchema } from '@/lib/schema'
import { getCityVisualBySlug } from '@/lib/visuals'

export const metadata: Metadata = {
  title: 'Pico y Placa Colombia 2026 para consultar horario y dígitos por ciudad',
  description:
    'Consulta el pico y placa en Colombia: Bogotá, Medellín, Cali, Bucaramanga, Pasto y más de 60 ubicaciones. Horarios, dígitos y excepciones con fuentes verificadas 2026.',
  alternates: { canonical: '/' },
  openGraph: {
    images: [{ url: getCityVisualBySlug('bogota').src, alt: getCityVisualBySlug('bogota').alt }],
  },
}

const P0_SLUGS = ['bogota', 'medellin', 'bucaramanga', 'cali']
const P1_SLUGS = [
  'pasto',
  'pereira',
  'cartagena',
  'armenia',
  'villavicencio',
  'tunja',
  'santa-marta',
  'popayan',
  'cucuta',
  'ibague',
]

export default function HomePage() {
  const todos = getMunicipios()
  const p0 = P0_SLUGS.map((s) => todos.find((m) => m.slug === s)).filter(Boolean)
  const p1 = P1_SLUGS.map((s) => todos.find((m) => m.slug === s)).filter(Boolean)
  const heroVisual = getCityVisualBySlug('bogota')

  const schema = generarWebPageSchema(
    'Pico y Placa Colombia 2026',
    'Directorio de pico y placa en Colombia con información verificada.',
    '/'
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main>

        {/* Hero */}
        <section className="relative overflow-hidden bg-[#07111F] text-white">
          <Image
            src={heroVisual.src}
            alt={heroVisual.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-[#07111F]/72" />
          <div className="relative max-w-5xl mx-auto px-4 py-20 min-h-[520px] flex flex-col justify-center">
            <p className="text-[#FFC200] text-xs font-semibold uppercase tracking-widest mb-4">
              Información verificada con enfoque local
            </p>
            <h1 className="text-5xl sm:text-6xl font-bold mb-5 leading-tight max-w-3xl">
              Pico y Placa en Colombia con horarios y dígitos por ciudad
            </h1>
            <p className="text-slate-200 text-lg mb-8 max-w-2xl leading-relaxed">
              Consulta la restricción vehicular con respuesta diaria, fuente registrada,
              mapa local e imagen de referencia para más de 60 ciudades, municipios y corredores.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/pico-y-placa/"
                className="inline-block bg-[#FFC200] text-[#0C1B33] font-bold px-6 py-3 rounded hover:bg-[#E6AE00] transition-colors text-sm">
                Ver todas las ciudades →
              </Link>
              <Link href="/pico-y-placa/bogota/hoy/"
                className="inline-block border border-white/40 text-white font-semibold px-6 py-3 rounded hover:bg-white/10 transition-colors text-sm">
                Consultar Bogotá hoy
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3 max-w-xl mt-10">
              {[
                ['70', 'ubicaciones'],
                ['29', 'medidas activas'],
                ['22', 'fuentes'],
              ].map(([value, label]) => (
                <div key={label} className="border border-white/15 bg-white/10 rounded-lg px-4 py-3">
                  <p className="text-2xl font-bold text-[#FFC200]">{value}</p>
                  <p className="text-xs text-slate-300">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Barra de confianza */}
        <section className="bg-[#1A2F52] text-white">
          <div className="max-w-5xl mx-auto px-4 py-3">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-300">
              <span>
                <span className="text-[#FFC200] font-bold">29</span> ubicaciones con medida activa o especial
              </span>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <span>
                <span className="text-[#FFC200] font-bold">22</span> fuentes verificadas
              </span>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <span>Corte de información: 28 de mayo de 2026</span>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <Link href="/metodologia/" className="text-slate-400 hover:text-white underline">
                Ver metodología
              </Link>
            </div>
          </div>
        </section>

        {/* Accesos rápidos hoy */}
        <section className="max-w-5xl mx-auto px-4 py-8 border-b border-slate-100">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
            Acceso rápido para pico y placa hoy
          </h2>
          <div className="flex flex-wrap gap-2">
            {P0_SLUGS.map((slug) => {
              const m = todos.find((x) => x.slug === slug)
              if (!m) return null
              return (
                <Link key={slug} href={`/pico-y-placa/${slug}/hoy/`}
                  className="px-3 py-2 rounded border border-slate-200 text-sm text-slate-700 hover:border-[#FFC200] hover:bg-[#FFF8DC] transition-colors bg-white">
                  {m.ubicacion} hoy
                </Link>
              )
            })}
            <Link href="/pico-y-placa-regional/"
              className="px-3 py-2 rounded border border-slate-200 text-sm text-slate-700 hover:border-[#FFC200] hover:bg-[#FFF8DC] transition-colors bg-white">
              Regional (retornos festivos)
            </Link>
          </div>
        </section>

        {/* P0 Ciudades principales */}
        <section className="max-w-5xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold text-[#0C1B33] mb-1">Ciudades con mayor volumen</h2>
          <p className="text-sm text-slate-500 mb-5">Medidas activas, fuentes de alta confianza e imagen local</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {p0.map((m) => m && <CiudadCard key={m.slug} municipio={m} />)}
          </div>
        </section>

        {/* P1 Ciudades */}
        <section className="max-w-5xl mx-auto px-4 pb-8">
          <h2 className="text-lg font-bold text-[#0C1B33] mb-1">Otras ciudades principales</h2>
          <p className="text-xs text-slate-500 mb-4">Pasto, Pereira, Cartagena, Tunja y más</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {p1.map((m) => m && <CiudadCard key={m.slug} municipio={m} />)}
          </div>
          <div className="mt-4">
            <Link href="/pico-y-placa/"
              className="text-sm font-medium text-[#0C1B33] border border-slate-300 rounded px-4 py-2 hover:border-[#FFC200] transition-colors inline-block">
              Ver todas las ciudades y municipios →
            </Link>
          </div>
        </section>

        {/* ── Áreas metropolitanas ── */}
        <section className="bg-slate-50 border-t border-b border-slate-200 py-8">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-lg font-bold text-[#0C1B33] mb-4">Áreas metropolitanas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-800 text-sm mb-1">
                  Valle de Aburrá (AMVA)
                </p>
                <p className="text-xs text-slate-500 mb-2">
                  Medellín, Bello, Envigado, Itagüí, Sabaneta, Copacabana, La Estrella, Caldas, Girardota, Barbosa
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Todos los municipios del Valle de Aburrá comparten la misma medida. Fuente: Área Metropolitana del Valle de Aburrá (AMVA).
                </p>
                <Link href="/pico-y-placa/medellin/"
                  className="text-xs font-medium text-[#0C1B33] hover:underline mt-2 inline-block">
                  Ver pico y placa AMVA →
                </Link>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-800 text-sm mb-1">
                  Área Metropolitana de Bucaramanga (AMB)
                </p>
                <p className="text-xs text-slate-500 mb-2">
                  Bucaramanga, Floridablanca, Girón, Piedecuesta
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Los cuatro municipios del AMB aplican el mismo calendario de restricción. Fuente: Decreto de Tránsito de Bucaramanga / AMB.
                </p>
                <Link href="/pico-y-placa/bucaramanga/"
                  className="text-xs font-medium text-[#0C1B33] hover:underline mt-2 inline-block">
                  Ver pico y placa AMB →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Qué es / marco legal ── */}
        <section className="max-w-3xl mx-auto px-4 py-10">
          <h2 className="text-xl font-bold text-[#0C1B33] mb-4">
            ¿Qué es el pico y placa en Colombia?
          </h2>
          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <p>
              El pico y placa es una medida de restricción vehicular que limita la circulación de
              automóviles particulares según el <strong>último dígito de la placa</strong> en
              determinados días, horarios y zonas urbanas. Su objetivo es reducir la congestión en
              horas pico.
            </p>
            <p>
              El marco legal nacional es el <strong>Código Nacional de Tránsito (Ley 769 de 2002)</strong>,
              complementado por la Ley 1383 de 2010 y el Decreto 1079 de 2015. Sin embargo, cada
              municipio debe expedir su propio <strong>decreto local</strong> para implementar la medida.
            </p>
            <p>
              Los vehículos eléctricos e híbridos tienen excepciones según la{' '}
              <strong>Ley 1964 de 2019</strong>. La multa por violar el pico y placa es de{' '}
              <strong>15 SMLMV</strong> según el artículo 131, literal C.14 del C.N.T.
            </p>
          </div>
          <Link href="/metodologia/"
            className="inline-block mt-4 text-sm font-medium text-[#0C1B33] border border-slate-300 rounded px-4 py-2 hover:border-[#FFC200] transition-colors">
            Ver metodología de verificación →
          </Link>
        </section>

      </main>
    </>
  )
}
