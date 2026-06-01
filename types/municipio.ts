export interface Municipio {
  ubicacion: string
  departamento_area: string
  kw_unicas: number
  volumen_mensual_aprox: number
  top_keywords: string
  estado: string
  vehiculos: string
  funcionamiento: string
  norma_local: string
  fuente: string
  confianza: string
  notas: string
  page_type: string
  seo_priority: string
  slug: string
}

export type EstadoTipo =
  | 'activo'
  | 'activo-amva'
  | 'activo-amb'
  | 'regional'
  | 'temporal'
  | 'solo-taxis'
  | 'sin-evidencia'
  | 'no-municipio'

export function clasificarEstado(estado: string): EstadoTipo {
  const e = estado.toLowerCase()
  if (e.includes('amva')) return 'activo-amva'
  if (e.includes('amb')) return 'activo-amb'
  if (e.includes('regional') || e.includes('no diario')) return 'regional'
  if (e.includes('solo taxis') || e.includes('no particulares')) return 'solo-taxis'
  if (e.includes('sin evidencia')) return 'sin-evidencia'
  if (e.includes('no es municipio')) return 'no-municipio'
  if (e.includes('temporal') || e.includes('ambiental') || e.includes('manual')) return 'temporal'
  if (e.includes('activo')) return 'activo'
  return 'sin-evidencia'
}
