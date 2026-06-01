import visuals from '@/data/visuales.json'
import type { Municipio } from '@/types/municipio'

export interface CityVisual {
  title: string
  src: string
  page?: string
  alt: string
}

const visualMap = visuals as Record<string, CityVisual>

export function getCityVisual(municipio: Pick<Municipio, 'slug' | 'ubicacion'>): CityVisual {
  return visualMap[municipio.slug] ?? getCityVisualBySlug('bogota')
}

export function getCityVisualBySlug(slug: string): CityVisual {
  return visualMap[slug] ?? {
    title: 'Colombia',
    src: visualMap.bogota.src,
    page: visualMap.bogota.page,
    alt: 'Imagen de una ciudad colombiana',
  }
}

export function getMapQuery(municipio: Pick<Municipio, 'ubicacion' | 'departamento_area' | 'slug'>) {
  if (municipio.slug === 'bogota-regional') return 'Bogotá, Colombia'
  return `${municipio.ubicacion}, ${municipio.departamento_area}, Colombia`
}

export function getMapEmbedUrl(municipio: Pick<Municipio, 'ubicacion' | 'departamento_area' | 'slug'>) {
  return `https://www.google.com/maps?q=${encodeURIComponent(getMapQuery(municipio))}&output=embed`
}

export function getMapSearchUrl(municipio: Pick<Municipio, 'ubicacion' | 'departamento_area' | 'slug'>) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(getMapQuery(municipio))}`
}
