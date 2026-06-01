import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0C1B33] text-slate-400 mt-auto">
      <div className="h-1 bg-[#FFC200]" />

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Columna 1: Marca */}
          <div>
            <p className="text-white font-semibold mb-2">
              Pico y Placa <span className="text-[#FFC200]">Col</span>
            </p>
            <p className="text-xs leading-relaxed">
              Directorio de información sobre la restricción vehicular por número de placa en
              ciudades y municipios de Colombia. Corte de información: 28 de mayo de 2026.
            </p>
          </div>

          {/* Columna 2: Ciudades */}
          <div>
            <p className="text-white text-sm font-medium mb-3">Ciudades principales</p>
            <ul className="space-y-1.5 text-xs">
              {[
                ['Pico y placa Bogotá', '/pico-y-placa/bogota/'],
                ['Pico y placa Medellín', '/pico-y-placa/medellin/'],
                ['Pico y placa Cali', '/pico-y-placa/cali/'],
                ['Pico y placa Bucaramanga', '/pico-y-placa/bucaramanga/'],
                ['Pico y placa Pasto', '/pico-y-placa/pasto/'],
                ['Pico y placa regional', '/pico-y-placa-regional/'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Sitio */}
          <div>
            <p className="text-white text-sm font-medium mb-3">Acerca del sitio</p>
            <ul className="space-y-1.5 text-xs">
              {[
                ['Todas las ciudades', '/pico-y-placa/'],
                ['Metodología y fuentes', '/metodologia/'],
                ['Pico y placa regional', '/pico-y-placa-regional/'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Aviso legal */}
        <div className="border-t border-slate-700 pt-6 text-xs leading-relaxed space-y-2">
          <p>
            <strong className="text-slate-300">Aviso editorial:</strong> Este sitio compila y presenta
            información de fuentes registradas, principalmente oficiales colombianas (decretos,
            secretarías de movilidad, boletines de alcaldías) y fuentes secundarias cuando el pack
            así lo marca. No es un portal del Gobierno colombiano. La información puede
            cambiar sin previo aviso; siempre verifique en la secretaría de tránsito o movilidad de
            su ciudad antes de circular.
          </p>
          <p>
            <strong className="text-slate-300">Marco legal:</strong> Ley 769 de 2002 (Código Nacional
            de Tránsito), Ley 1383 de 2010, Decreto 1079 de 2015, Ley 1964 de 2019.
            Multa por incumplimiento: artículo 131 literal C.14 del C.N.T.
          </p>
        </div>
      </div>
    </footer>
  )
}
