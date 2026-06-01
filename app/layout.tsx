import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: {
    default: 'Pico y Placa Colombia 2026 para consultar tu ciudad',
    template: '%s | Pico y Placa Col',
  },
  description:
    'Consulta el pico y placa en todas las ciudades de Colombia: Bogotá, Medellín, Cali, Bucaramanga y más. Horarios, dígitos restringidos y excepciones actualizados 2026.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://picoyplacacol.com'),
  openGraph: {
    locale: 'es_CO',
    type: 'website',
    siteName: 'Pico y Placa Col',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white text-slate-900 antialiased font-sans">
        <NavBar />
        <div className="flex-1">{children}</div>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
