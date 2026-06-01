import Link from 'next/link'
import Image from 'next/image'

const navItems = [
  { href: '/pico-y-placa/', label: 'Ciudades' },
  { href: '/pico-y-placa-regional/', label: 'Regional' },
  { href: '/metodologia/', label: 'Metodología' },
]

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#07111F]/10 bg-white/95 shadow-[0_14px_40px_rgba(7,17,31,0.14)] backdrop-blur-xl">
      <div aria-hidden className="grid h-1.5 grid-cols-3">
        <span className="bg-[#FFC200]" />
        <span className="bg-[#08469A]" />
        <span className="bg-[#CE1126]" />
      </div>

      <div className="bg-[#07111F] text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between md:py-2">
            <div className="flex min-w-0 items-center justify-between gap-3">
              <Link href="/" className="group flex min-w-0 items-center gap-3">
                <span className="relative flex h-[58px] w-[116px] shrink-0 overflow-hidden rounded-lg border border-white/20 bg-white shadow-[0_10px_26px_rgba(0,0,0,0.28)] transition-transform duration-200 group-hover:-translate-y-0.5 sm:h-[66px] sm:w-[132px]">
                  <Image
                    src="/logo-picoyplacacol.png"
                    alt="Pico y Placa Colombia"
                    fill
                    priority
                    sizes="(min-width: 640px) 132px, 116px"
                    className="object-cover"
                  />
                </span>

                <span className="hidden min-w-0 lg:block">
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FFC200]">
                    Consulta nacional
                  </span>
                  <span className="block text-xl font-bold leading-tight tracking-tight text-white">
                    Pico y Placa Colombia
                  </span>
                  <span className="block text-xs text-slate-300">
                    Horarios, dígitos y fuentes por ciudad
                  </span>
                </span>
              </Link>

              <Link
                href="/pico-y-placa/bogota/hoy/"
                className="inline-flex shrink-0 items-center justify-center rounded-lg border border-[#FFD94D] bg-[#FFC200] px-3 py-2 text-xs font-bold text-[#07111F] shadow-[0_6px_0_rgba(255,194,0,0.16)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#FFD94D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:hidden"
              >
                Consultar hoy
              </Link>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:flex-1 md:justify-end">
              <nav
                aria-label="Navegación principal"
                className="flex max-w-full items-center gap-1 overflow-x-auto rounded-lg border border-white/10 bg-white/[0.06] p-1 text-sm text-slate-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="shrink-0 rounded-md px-3 py-2 font-medium transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC200]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <Link
                href="/pico-y-placa/bogota/hoy/"
                className="hidden items-center justify-center rounded-lg border border-[#FFD94D] bg-[#FFC200] px-4 py-2 text-sm font-bold text-[#07111F] shadow-[0_8px_0_rgba(255,194,0,0.18)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#FFD94D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:inline-flex"
              >
                Consultar hoy
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden bg-[#FFC200] text-[#07111F] sm:block">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] sm:flex-row sm:items-center sm:justify-between">
          <span>Actualizado con corte al 28 de mayo de 2026</span>
          <span className="text-[#07111F]/70">Fuentes oficiales y reglas por fecha</span>
        </div>
      </div>
    </header>
  )
}
