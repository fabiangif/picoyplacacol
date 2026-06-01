import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import { getCityVisualBySlug } from '@/lib/visuals'

export const metadata: Metadata = {
  title: 'Metodología y fuentes para verificar el pico y placa en Colombia',
  description:
    'Conoce cómo recopilamos, verificamos y publicamos la información sobre el pico y placa en Colombia. Fuentes oficiales, política editorial y niveles de confianza.',
  alternates: { canonical: '/metodologia/' },
}

const BREADCRUMBS = [
  { nombre: 'Inicio', href: '/' },
  { nombre: 'Metodología', href: '/metodologia/' },
]

const FUENTES = [
  { ciudad: 'Bogotá', tipo: 'Secretaría Distrital de Movilidad', confianza: 'Alta', url: 'https://www.movilidadbogota.gov.co/pico-y-placa' },
  { ciudad: 'Bogotá ABC', tipo: 'Secretaría Distrital de Movilidad', confianza: 'Alta', url: 'https://www.movilidadbogota.gov.co/web/abece_del_pico_y_placa' },
  { ciudad: 'Bogotá regional', tipo: 'Secretaría Distrital de Movilidad', confianza: 'Alta', url: 'https://www.movilidadbogota.gov.co/web/pico-y-placa-regional' },
  { ciudad: 'Medellín / AMVA', tipo: 'Alcaldía de Medellín', confianza: 'Alta', url: 'https://www.medellin.gov.co/es/sala-de-prensa/noticias/medellin-y-su-area-metropolitana-tendran-pico-y-placa-para-el-primer-semestre-de-2026/' },
  { ciudad: 'Cali', tipo: 'Secretaría de Movilidad de Cali', confianza: 'Alta', url: 'https://www.cali.gov.co/movilidad/publicaciones/187083/inicia-la-rotacion-del-pico-y-placa-en-cali-para-vehiculos-particulares/' },
  { ciudad: 'Cartagena', tipo: 'Alcaldía de Cartagena', confianza: 'Alta', url: 'https://www.cartagena.gov.co/noticias/continua-pico-placa-cartagena-decreto-003-2026-establece-rotaciones-primer-semestre' },
  { ciudad: 'Santa Marta', tipo: 'Alcaldía de Santa Marta', confianza: 'Media', url: 'https://www.santamarta.gov.co/sala-prensa/noticias/conozca-el-nuevo-decreto-de-pico-y-placa-que-regira-en-santa-marta' },
  { ciudad: 'Villavicencio', tipo: 'Alcaldía de Villavicencio', confianza: 'Alta', url: 'https://villavicencio.gov.co/villavicencio-adopta-pico-y-placa-para-vehiculos-particulares-en-2026/' },
  { ciudad: 'Pereira', tipo: 'Alcaldía de Pereira', confianza: 'Alta', url: 'https://www.pereira.gov.co/publicaciones/9785/pico-y-placa-para-particulares-y-motocicletas-se-mantiene-sin-modificaciones/' },
  { ciudad: 'Pasto', tipo: 'Alcaldía de Pasto', confianza: 'Media', url: 'https://www.pasto.gov.co/index.php/alcaldia-al-dia/16368-secretaria-de-transito-y-transporte-extendio-por-tres-meses-mas-la-medida-de-pico-y-placa-para-vehiculos-automotores-en-pasto' },
  { ciudad: 'Armenia', tipo: 'Alcaldía de Armenia', confianza: 'Alta', url: 'https://www.armenia.gov.co/atencion-al-ciudadano/noticias/alcaldia-de-armenia-amplia-zona-de-pico-y-placa-a-todo-el-casco-urbano' },
  { ciudad: 'Ibagué', tipo: 'Caracol Radio', confianza: 'Media', url: 'https://caracol.com.co/2026/01/02/asi-sera-el-pico-y-placa-para-el-primer-semestre-del-2026-en-ibague/' },
  { ciudad: 'Cúcuta', tipo: 'Alcaldía de Cúcuta', confianza: 'Alta', url: 'https://cucuta.gov.co/pico-y-placa-de-cucuta-cambia-horarios-e-implementa-la-placa-dia-para-mejorar-la-movilidad/' },
  { ciudad: 'Tunja', tipo: 'Secretaría de Tránsito', confianza: 'Media-alta', url: 'https://www.picoyplacatunja.com/' },
  { ciudad: 'Popayán', tipo: 'Alcaldía de Popayán (PDF oficial)', confianza: 'Alta', url: 'https://www.popayan.gov.co/NuestraAlcaldia/Normatividad/Decreto_20261000000355_del_09_de_enero_2026.pdf' },
  { ciudad: 'Buenaventura', tipo: 'Alcaldía de Buenaventura', confianza: 'Alta', url: 'https://www.buenaventura.gov.co/articulos/secretaria-de-transito-y-transporte-socializa-los-nuevos-horarios-del-pico-y-placa' },
  { ciudad: 'Bucaramanga / AMB', tipo: 'Vanguardia / DTB', confianza: 'Media-alta', url: 'https://www.vanguardia.com/area-metropolitana/bucaramanga/2025/12/30/asi-rotara-el-pico-y-placa-en-2026-en-bucaramanga-y-el-area/' },
  { ciudad: 'Barranquilla Carnaval', tipo: 'Alcaldía de Barranquilla', confianza: 'Alta', url: 'https://www.barranquilla.gov.co/transito/por-carnaval-habra-pico-y-placa-para-vehiculos-particulares' },
  { ciudad: 'Barranquilla taxis', tipo: 'Alcaldía de Barranquilla', confianza: 'Alta', url: 'https://www.barranquilla.gov.co/transito/suspension-pico-placa-taxis' },
  { ciudad: 'Manizales', tipo: 'Secretaría de Movilidad', confianza: 'Alta', url: 'https://centrodeinformacion.manizales.gov.co/no-hay-pico-y-placa-para-particulares-en-manizales-secretaria-de-movilidad-asegura-que-taxis-si-tendran-restriccion/' },
  { ciudad: 'Murillo / Los Nevados', tipo: 'El Diario', confianza: 'Media', url: 'https://www.eldiario.com.co/noticias/manizales/2026/pico-y-placa-en-los-nevados-conozca-los-digitos-restringidos/' },
  { ciudad: 'Nacional', tipo: 'Función Pública', confianza: 'Alta', url: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=5557' },
]

const CONFIANZA_COLOR: Record<string, string> = {
  Alta: 'bg-green-100 text-green-800 border-green-200',
  'Media-alta': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Media: 'bg-amber-100 text-amber-800 border-amber-200',
  'Media-baja': 'bg-slate-100 text-slate-600 border-slate-200',
}

export default function MetodologiaPage() {
  const visual = getCityVisualBySlug('cali')

  return (
    <>
      <section className="relative overflow-hidden bg-[#07111F] text-white">
        <Image
          src={visual.src}
          alt={visual.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-[#07111F]/75" />
        <div className="relative max-w-3xl mx-auto px-4 py-12">
          <Breadcrumb items={BREADCRUMBS} variant="light" />
          <p className="text-[#FFC200] text-xs font-semibold uppercase tracking-widest mt-8 mb-3">
            Política editorial
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            Metodología y fuentes
          </h1>
          <p className="text-slate-200 text-base mt-4 max-w-2xl">
            Cómo recopilamos, verificamos y presentamos la información sobre el pico y placa en Colombia.
          </p>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-4 py-10">

        {/* Política editorial */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-[#0C1B33] mb-3">Política editorial</h2>
          <div className="rounded-lg border border-[#FFC200] bg-[#FFF8DC] p-5 space-y-3 text-sm text-slate-700 leading-relaxed">
            <p>
              <strong>Solo publicamos datos verificables.</strong> Si no encontramos una fuente oficial
              reciente (decreto, resolución o publicación de la secretaría de movilidad/tránsito), la
              página del municipio lo indica explícitamente: «Sin medida vigente confirmada al corte de esta
              investigación».
            </p>
            <p>
              <strong>No inventamos calendarios.</strong> No construimos tablas de dígitos a partir de
              inferencias, versiones anteriores de decretos o información no oficial. Esto puede hacer que
              algunas páginas sean menos completas, pero protege al usuario de información incorrecta.
            </p>
            <p>
              <strong>Fecha de corte visible.</strong> Toda la información publicada tiene una fecha de corte
              explícita. Las reglas de pico y placa cambian por semestre o por decreto; siempre recomendamos
              verificar con la fuente registrada o autoridad local antes de circular.
            </p>
          </div>
        </section>

        {/* Cómo verificamos */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-[#0C1B33] mb-3">Proceso de verificación</h2>
          <ol className="space-y-4">
            {[
              {
                n: '1',
                title: 'Identificación de la fuente primaria',
                text: 'Para cada municipio buscamos el decreto o resolución municipal vigente publicado por la alcaldía o secretaría de movilidad. Solo en casos donde la fuente oficial no es accesible directamente usamos medios de comunicación locales como fuente secundaria.',
              },
              {
                n: '2',
                title: 'Contraste con el keyword research',
                text: 'El volumen de búsqueda de cada ciudad (datos de investigación de palabras clave) nos permite priorizar qué municipios requieren páginas más detalladas y actualizadas. Un municipio con 50.000 búsquedas mensuales recibe mayor atención editorial que uno con 50.',
              },
              {
                n: '3',
                title: 'Asignación de nivel de confianza',
                text: 'Cada registro tiene un nivel de confianza: Alta (fuente oficial directa, decreto descargable), Media-alta (fuente oficial pero sin PDF directo), Media (fuente secundaria con referencia oficial), Media-baja/Baja (poca o ninguna evidencia reciente).',
              },
              {
                n: '4',
                title: 'Fecha de corte y revisión',
                text: 'El corte de esta investigación es el 28 de mayo de 2026. Las medidas con vigencia conocida (por ejemplo, «primer semestre 2026») se marcan para revisión al vencer ese período.',
              },
            ].map((paso) => (
              <li key={paso.n} className="flex gap-4">
                <div className="w-7 h-7 rounded bg-[#0C1B33] text-[#FFC200] font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                  {paso.n}
                </div>
                <div>
                  <p className="font-medium text-slate-800 text-sm mb-1">{paso.title}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{paso.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Niveles de confianza */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-[#0C1B33] mb-3">Niveles de confianza</h2>
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#0C1B33] text-white text-xs">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Nivel</th>
                  <th className="px-4 py-3 text-left font-medium">Qué significa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ['Alta', 'Fuente oficial directa (decreto PDF, página oficial de alcaldía). Datos confirmados.'],
                  ['Media-alta', 'Fuente oficial referenciada pero sin acceso directo al documento. Datos probablemente correctos.'],
                  ['Media', 'Fuente secundaria confiable (medio de comunicación local) con referencia al acto administrativo.'],
                  ['Media-baja', 'Información parcial o desactualizada. Verificar antes de confiar.'],
                  ['Baja', 'Sin evidencia reciente. La página aclara la situación pero no muestra calendario.'],
                ].map(([nivel, desc]) => (
                  <tr key={nivel} className="bg-white hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded border ${CONFIANZA_COLOR[nivel] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {nivel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs leading-relaxed">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Marco legal */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-[#0C1B33] mb-3">Marco legal nacional</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            {[
              ['Ley 769 de 2002', 'Código Nacional de Tránsito Terrestre. Base legal de las restricciones vehiculares y multas.'],
              ['Ley 1383 de 2010', 'Reforma al C.N.T. Modifica algunas disposiciones sobre infracciones.'],
              ['Decreto 1079 de 2015', 'Decreto único reglamentario del sector transporte.'],
              ['Ley 1964 de 2019', 'Promueve el uso de vehículos eléctricos. Establece excepciones al pico y placa para estos vehículos.'],
            ].map(([norma, desc]) => (
              <li key={norma} className="flex gap-3">
                <span className="font-medium text-slate-800 shrink-0 w-40">{norma}</span>
                <span>{desc}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Tabla de fuentes */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-[#0C1B33] mb-3">Fuentes por ciudad</h2>
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-[#0C1B33] text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Ciudad</th>
                  <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">Fuente</th>
                  <th className="px-4 py-3 text-left font-medium">Confianza</th>
                  <th className="px-4 py-3 text-left font-medium">Enlace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {FUENTES.map((f) => (
                  <tr key={f.ciudad} className="bg-white hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{f.ciudad}</td>
                    <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{f.tipo}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded border font-medium ${CONFIANZA_COLOR[f.confianza] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {f.confianza}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <a href={f.url} target="_blank" rel="noopener noreferrer"
                        className="text-[#0C1B33] hover:underline font-medium">
                        Ver ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Aviso */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500 leading-relaxed">
          <p>
            Este sitio <strong className="text-slate-700">no es un portal oficial del Gobierno colombiano</strong>.
            Es un directorio independiente que compila y presenta información de fuentes públicas verificadas.
            La información puede cambiar sin previo aviso. Siempre verifique en la secretaría de movilidad o
            tránsito de su ciudad antes de tomar decisiones de circulación.
          </p>
        </div>

        <nav className="mt-8 pt-6 border-t border-slate-200">
          <Link href="/" className="text-sm text-[#0C1B33] hover:underline">← Volver al inicio</Link>
        </nav>
      </main>
    </>
  )
}
