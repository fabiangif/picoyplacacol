import type { Metadata } from 'next'
import Image from 'next/image'
import { generarBreadcrumbSchema, generarFAQSchema, generarWebPageSchema } from '@/lib/schema'
import Breadcrumb from '@/components/Breadcrumb'
import UltimaVerificacion from '@/components/UltimaVerificacion'
import { getCityVisualBySlug } from '@/lib/visuals'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pico y Placa Regional Colombia 2026 para retornos festivos a Bogotá',
  description:
    'Pico y placa regional en Colombia: restricción vehicular en el último día de puente festivo para ingreso a Bogotá. Horarios, corredores y calendario 2026.',
  alternates: { canonical: '/pico-y-placa-regional/' },
}

const BREADCRUMBS = [
  { nombre: 'Inicio', href: '/' },
  { nombre: 'Pico y Placa Colombia', href: '/pico-y-placa/' },
  { nombre: 'Pico y Placa Regional', href: '/pico-y-placa-regional/' },
]

const FAQS = [
  {
    pregunta: '¿Qué es el pico y placa regional?',
    respuesta:
      'El pico y placa regional es una medida de restricción vehicular que aplica en los corredores de acceso a Bogotá el último día de los puentes festivos. No es una restricción diaria urbana, sino que opera únicamente en retornos masivos.',
  },
  {
    pregunta: '¿Cuándo aplica el pico y placa regional?',
    respuesta:
      'Aplica el último día del puente festivo, en el horario de retorno hacia Bogotá: 12:00–16:00 para placas pares y 16:00–20:00 para placas impares (verificar decreto vigente).',
  },
  {
    pregunta: '¿En qué corredores aplica?',
    respuesta:
      'Los corredores principales son: Autopista Norte (desde Zipaquirá/Chía), Autopista Sur (desde Soacha/Girardot/Fusagasugá), Autopista al Llano (desde Villavicencio), vía La Calera y Autopista Medellín. Confirmar en Movilidad Bogotá antes de salir.',
  },
  {
    pregunta: '¿El pico y placa regional aplica en Soacha?',
    respuesta:
      'Sí. Soacha está en el corredor Autopista Sur y puede verse afectada por el pico y placa regional en retornos festivos. Sin embargo, Soacha no tiene pico y placa urbano diario propio.',
  },
  {
    pregunta: '¿Dónde verificar el pico y placa regional vigente?',
    respuesta:
      'La fuente oficial es la Secretaría de Movilidad de Bogotá: movilidadbogota.gov.co/web/pico-y-placa-regional. El decreto puede cambiar por puente; siempre verifica antes del viaje.',
  },
]

export default function RegionalPage() {
  const visual = getCityVisualBySlug('bogota-regional')
  const schemas = [
    generarWebPageSchema(
      'Pico y Placa Regional Colombia 2026',
      'Restricción vehicular en retornos festivos hacia Bogotá.',
      '/pico-y-placa-regional/'
    ),
    generarBreadcrumbSchema(BREADCRUMBS),
    generarFAQSchema(FAQS),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />

      <section className="relative overflow-hidden bg-[#07111F] text-white">
        <Image
          src={visual.src}
          alt={visual.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-[#07111F]/72" />
        <div className="relative max-w-5xl mx-auto px-4 py-12">
          <Breadcrumb items={BREADCRUMBS} variant="light" />
          <p className="text-[#FFC200] text-xs font-semibold uppercase tracking-widest mt-8 mb-3">
            Retornos festivos
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">Pico y Placa Regional</h1>
          <p className="text-slate-200 text-base mt-4 max-w-2xl">
            Restricción de ingreso a Bogotá en puentes festivos, con horarios por placas pares e impares.
          </p>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-slate-500 text-sm mb-6">Retornos festivos hacia Bogotá · ~29.000 búsquedas/mes</p>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
          <p className="font-semibold text-blue-800 mb-2">¿Qué es esto?</p>
          <p className="text-blue-700 text-sm leading-relaxed">
            El pico y placa regional <strong>no es una restricción diaria urbana</strong>. Aplica únicamente
            en los corredores viales de acceso a Bogotá durante el retorno del último día de puente festivo.
            No confundir con el pico y placa urbano de Bogotá.
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Funcionamiento general</h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Tramo horario</th>
                  <th className="px-4 py-3 font-medium">Placas restringidas</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-100 bg-white">
                  <td className="px-4 py-3">12:00 – 16:00</td>
                  <td className="px-4 py-3">Placas pares (terminan en 0,2,4,6,8)</td>
                </tr>
                <tr className="border-t border-slate-100 bg-slate-50/50">
                  <td className="px-4 py-3">16:00 – 20:00</td>
                  <td className="px-4 py-3">Placas impares (terminan en 1,3,5,7,9)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            * Horarios y condiciones pueden variar por puente. Verificar en{' '}
            <a href="https://www.movilidadbogota.gov.co/web/pico-y-placa-regional"
              target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              movilidadbogota.gov.co
            </a>
          </p>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white overflow-hidden mb-8">
          <div className="p-4 border-b border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Mapa</p>
            <h2 className="text-base font-bold text-[#0C1B33]">Corredores de ingreso a Bogotá</h2>
          </div>
          <iframe
            title="Mapa de Bogotá para pico y placa regional"
            src="https://www.google.com/maps?q=Bogot%C3%A1%2C%20Colombia&output=embed"
            className="h-64 w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Corredores afectados</h2>
          <ul className="space-y-2 text-sm text-slate-700">
            {[
              'Autopista Norte (Zipaquirá, Chía, Cajicá)',
              'Autopista Sur (Soacha, Girardot, Fusagasugá, Melgar)',
              'Autopista al Llano (Villavicencio, Meta)',
              'Vía La Calera (oriente)',
              'Autopista Medellín (Facatativá, Honda)',
            ].map((c) => (
              <li key={c} className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">→</span>
                {c}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Preguntas frecuentes</h2>
          <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
            {FAQS.map((faq) => (
              <details key={faq.pregunta} className="group bg-white">
                <summary className="flex justify-between items-center px-5 py-4 cursor-pointer list-none hover:bg-slate-50">
                  <span className="font-medium text-slate-800 text-sm pr-4">{faq.pregunta}</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform shrink-0">▾</span>
                </summary>
                <p className="px-5 pb-4 text-slate-600 text-sm leading-relaxed">{faq.respuesta}</p>
              </details>
            ))}
          </div>
        </section>

        <UltimaVerificacion
          fecha="28 de mayo de 2026"
          fuente="https://www.movilidadbogota.gov.co/web/pico-y-placa-regional"
        />

        <nav className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-500 mb-2">Ver también</p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/pico-y-placa/bogota/" className="text-blue-600 hover:underline">
              Pico y placa Bogotá
            </Link>
            <Link href="/pico-y-placa/soacha/" className="text-blue-600 hover:underline">
              Pico y placa Soacha
            </Link>
            <Link href="/pico-y-placa/" className="text-blue-600 hover:underline">
              Todas las ciudades
            </Link>
          </div>
        </nav>
      </main>
    </>
  )
}
