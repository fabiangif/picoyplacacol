import fs from 'fs'
import path from 'path'
import type { Municipio } from '@/types/municipio'
import { clasificarEstado } from '@/types/municipio'

let _cache: Municipio[] | null = null

export function getMunicipios(): Municipio[] {
  if (_cache) return _cache
  const filePath = path.join(process.cwd(), 'data', 'municipios.jsonl')
  const content = fs.readFileSync(filePath, 'utf-8')
  _cache = content
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line) as Municipio)
  return _cache
}

export function getMunicipio(slug: string): Municipio | undefined {
  return getMunicipios().find((m) => m.slug === slug)
}

export function getMunicipiosPorPrioridad(prioridad: string): Municipio[] {
  return getMunicipios().filter((m) => m.seo_priority === prioridad)
}

export function getMunicipiosActivos(): Municipio[] {
  return getMunicipios().filter((m) => {
    const tipo = clasificarEstado(m.estado)
    return ['activo', 'activo-amva', 'activo-amb'].includes(tipo)
  })
}
