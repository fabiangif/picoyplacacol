import type { MetadataRoute } from 'next'
import { getMunicipios, getMunicipiosActivos } from '@/lib/municipios'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://picoyplacacol.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const todos = getMunicipios()
  const activos = getMunicipiosActivos()
  const hoy = new Date().toISOString()

  const estaticas: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: hoy, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/pico-y-placa/`, lastModified: hoy, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/pico-y-placa-regional/`, lastModified: hoy, changeFrequency: 'monthly', priority: 0.8 },
  ]

  const ciudades: MetadataRoute.Sitemap = todos.map((m) => ({
    url: `${BASE_URL}/pico-y-placa/${m.slug}/`,
    lastModified: hoy,
    changeFrequency: 'weekly',
    priority: m.seo_priority === 'P0' ? 0.9 : m.seo_priority === 'P1' ? 0.8 : 0.6,
  }))

  const modulos: MetadataRoute.Sitemap = activos.flatMap((m) => [
    { url: `${BASE_URL}/pico-y-placa/${m.slug}/hoy/`, lastModified: hoy, changeFrequency: 'daily', priority: 0.85 },
    { url: `${BASE_URL}/pico-y-placa/${m.slug}/manana/`, lastModified: hoy, changeFrequency: 'daily', priority: 0.75 },
  ])

  return [...estaticas, ...ciudades, ...modulos]
}
