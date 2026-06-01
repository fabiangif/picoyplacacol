import type { Municipio } from '@/types/municipio'
import { clasificarEstado } from '@/types/municipio'
import { getMunicipio } from '@/lib/municipios'

// Day index matching Date.getDay(): 0=Sun,1=Mon,2=Tue,3=Wed,4=Thu,5=Fri,6=Sat
const LETRA_A_DIA: Record<string, number> = { L: 1, M: 2, X: 3, J: 4, V: 5, S: 6 }
const TIME_ZONE = 'America/Bogota'
const DIA_NOMBRE: Record<number, string> = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
}

export interface ReglaDigitos {
  digitos: Map<number, number[]>
  diasOperacion: Set<number>
  horario: string
  descripcion?: string
}

interface FechaLocal {
  year: number
  month: number
  day: number
}

interface VigenciaRegla {
  desde?: FechaLocal
  hasta?: FechaLocal
  etiqueta: string
}

// Parses patterns like "L 1-2, M 3-4, X 5-6, J 7-8, V 9-0"
// The dash separates two individual digits (not a range).
export function parsearRegla(funcionamiento: string): ReglaDigitos | null {
  const re = /\b([LMXJVS])\s+(\d)-(\d)/g
  const digitos = new Map<number, number[]>()
  let m: RegExpExecArray | null

  while ((m = re.exec(funcionamiento)) !== null) {
    const dia = LETRA_A_DIA[m[1]]
    if (dia === undefined) continue
    digitos.set(dia, [Number(m[2]), Number(m[3])])
  }

  if (digitos.size === 0) return null

  const rangos = Array.from(funcionamiento.matchAll(/(\d{2}:\d{2})\s*[-–]\s*(\d{2}:\d{2})/g))
    .map((match) => `${match[1]} – ${match[2]}`)
  const horario = rangos.length > 0
    ? rangos.join(' y ')
    : 'Consultar fuente registrada'

  return { digitos, diasOperacion: parsearDiasOperacion(funcionamiento, digitos), horario }
}

function parsearDiasOperacion(funcionamiento: string, digitos: Map<number, number[]>): Set<number> {
  const texto = funcionamiento.toUpperCase()

  if (/\bL\s*[-–]\s*S\b/.test(texto)) {
    return new Set([1, 2, 3, 4, 5, 6])
  }

  if (/\bL\s*[-–]\s*V\b/.test(texto)) {
    return new Set([1, 2, 3, 4, 5])
  }

  return new Set(digitos.keys())
}

function getReglaCompartida(municipio: Municipio): ReglaDigitos | null {
  const tipo = clasificarEstado(municipio.estado)
  const funcionamiento = municipio.funcionamiento.toLowerCase()

  if (tipo === 'activo-amva' && funcionamiento.includes('misma medida')) {
    const medellin = getMunicipio('medellin')
    return medellin ? parsearRegla(medellin.funcionamiento) : null
  }

  if (tipo === 'activo-amb' && funcionamiento.includes('misma medida')) {
    const bucaramanga = getMunicipio('bucaramanga')
    return bucaramanga ? parsearRegla(bucaramanga.funcionamiento) : null
  }

  return null
}

function getMunicipioBaseRegla(municipio: Municipio): Municipio {
  const tipo = clasificarEstado(municipio.estado)
  const funcionamiento = municipio.funcionamiento.toLowerCase()

  if (tipo === 'activo-amva' && funcionamiento.includes('misma medida')) {
    return getMunicipio('medellin') ?? municipio
  }

  if (tipo === 'activo-amb' && funcionamiento.includes('misma medida')) {
    return getMunicipio('bucaramanga') ?? municipio
  }

  return municipio
}

export function getReglaMunicipio(municipio: Municipio): ReglaDigitos | null {
  const reglaDirecta = parsearRegla(municipio.funcionamiento)
  if (reglaDirecta) return reglaDirecta
  return getReglaCompartida(municipio)
}

export function usaReglaBogota(municipio: Municipio): boolean {
  return municipio.slug === 'bogota' && municipio.funcionamiento.toLowerCase().includes('pares restringen')
}

export function tieneCalendarioAutomatizable(municipio: Municipio, fechaBase = new Date()): boolean {
  if (usaReglaBogota(municipio)) return true
  const municipioBase = getMunicipioBaseRegla(municipio)
  if (!estaDentroDeVigencia(municipioBase, fechaBase)) return false
  return !!getReglaMunicipio(municipio)
}

export function puedeCalcularDia(municipio: Municipio, offsetDays = 0, fechaBase = new Date()): boolean {
  return !getDigitosDelDia(municipio, offsetDays, fechaBase).requiereFuente
}

export interface DigitosDelDia {
  fecha: string
  diaNombre: string
  digitos: number[] | null
  horario: string
  tieneRestriccion: boolean
  esFindeSemana: boolean
  requiereFuente: boolean
  motivoConsulta?: string
}

function getFechaReferencia(offsetDays: number, fechaBase: Date): Date {
  return new Date(fechaBase.getTime() + offsetDays * 24 * 60 * 60 * 1000)
}

function getDiaSemanaColombia(fecha: Date): number {
  const dia = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    timeZone: TIME_ZONE,
  }).format(fecha)
  const dias: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  return dias[dia] ?? fecha.getDay()
}

function getDiaMesColombia(fecha: Date): number {
  const dia = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    timeZone: TIME_ZONE,
  }).format(fecha)
  return Number(dia)
}

function getFechaLocalColombia(fecha: Date): FechaLocal {
  const parts = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timeZone: TIME_ZONE,
  }).formatToParts(fecha)

  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value)
  return { year: get('year'), month: get('month'), day: get('day') }
}

function fechaKey(fecha: FechaLocal): number {
  return fecha.year * 10000 + fecha.month * 100 + fecha.day
}

function ultimoDiaMes(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

function parsearFechaLocal(year: string, month: string, day: string): FechaLocal {
  return { year: Number(year), month: Number(month), day: Number(day) }
}

function getAñoRegla(texto: string): number {
  const match = texto.match(/\b(20\d{2})\b/)
  return match ? Number(match[1]) : 2026
}

function getVigenciaRegla(municipio: Municipio): VigenciaRegla | null {
  const texto = `${municipio.estado} ${municipio.funcionamiento} ${municipio.norma_local} ${municipio.notas}`

  const hasta = texto.match(/\bhasta\s+(20\d{2})-(\d{2})-(\d{2})\b/i)
  if (hasta) {
    return {
      hasta: parsearFechaLocal(hasta[1], hasta[2], hasta[3]),
      etiqueta: `vigente hasta ${hasta[1]}-${hasta[2]}-${hasta[3]} salvo prórroga`,
    }
  }

  const semestre = texto.match(/\b(20\d{2})-([12])\b/)
  if (semestre) {
    const year = Number(semestre[1])
    const esPrimerSemestre = semestre[2] === '1'
    return {
      desde: { year, month: esPrimerSemestre ? 1 : 7, day: 1 },
      hasta: { year, month: esPrimerSemestre ? 6 : 12, day: esPrimerSemestre ? 30 : 31 },
      etiqueta: esPrimerSemestre ? `primer semestre de ${year}` : `segundo semestre de ${year}`,
    }
  }

  const trimestre = texto.match(/\bQ([1-4])\s+(20\d{2})\b/i)
  if (trimestre) {
    const quarter = Number(trimestre[1])
    const year = Number(trimestre[2])
    const month = (quarter - 1) * 3 + 1
    const endMonth = month + 2
    return {
      desde: { year, month, day: 1 },
      hasta: { year, month: endMonth, day: ultimoDiaMes(year, endMonth) },
      etiqueta: `Q${quarter} ${year}`,
    }
  }

  const rangoMeses = texto.match(/\b(Ene|Mar)\s*[-–]\s*Jun\b/i)
  if (rangoMeses) {
    const year = getAñoRegla(texto)
    const desdeMonth = rangoMeses[1].toLowerCase() === 'mar' ? 3 : 1
    return {
      desde: { year, month: desdeMonth, day: 1 },
      hasta: { year, month: 6, day: 30 },
      etiqueta: `${rangoMeses[1]}-Jun ${year}`,
    }
  }

  return null
}

function estaDentroDeVigencia(municipio: Municipio, fecha: Date): boolean {
  const vigencia = getVigenciaRegla(municipio)
  if (!vigencia) return true

  const fechaActual = fechaKey(getFechaLocalColombia(fecha))
  const desde = vigencia.desde ? fechaKey(vigencia.desde) : Number.NEGATIVE_INFINITY
  const hasta = vigencia.hasta ? fechaKey(vigencia.hasta) : Number.POSITIVE_INFINITY

  return fechaActual >= desde && fechaActual <= hasta
}

function motivoFueraDeVigencia(municipio: Municipio): string {
  const vigencia = getVigenciaRegla(municipio)
  return vigencia
    ? `La regla registrada en el SEO Pack corresponde a ${vigencia.etiqueta}; verifica la fuente antes de circular.`
    : 'El SEO Pack no trae una regla automatizable para esta fecha; verifica la fuente registrada antes de circular.'
}

function respuestaConsultarFuente(
  fecha: string,
  diaNombre: string,
  esFindeSemana: boolean,
  motivoConsulta: string,
  horario = 'Consultar fuente registrada'
): DigitosDelDia {
  return {
    fecha,
    diaNombre,
    digitos: null,
    horario,
    tieneRestriccion: false,
    esFindeSemana,
    requiereFuente: true,
    motivoConsulta,
  }
}

export function getDigitosDelDia(municipio: Municipio, offsetDays = 0, fechaBase = new Date()): DigitosDelDia {
  const fecha = getFechaReferencia(offsetDays, fechaBase)

  const dow = getDiaSemanaColombia(fecha)
  const diaNombre = DIA_NOMBRE[dow]
  const fechaStr = fecha.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: TIME_ZONE,
  })

  const esFindeSemana = dow === 0 || dow === 6

  if (usaReglaBogota(municipio)) {
    const horario = '06:00 – 21:00'
    if (esFindeSemana) {
      return { fecha: fechaStr, diaNombre, digitos: null, horario, tieneRestriccion: false, esFindeSemana, requiereFuente: false }
    }

    const diaMes = getDiaMesColombia(fecha)
    const digitos = diaMes % 2 === 0 ? [1, 2, 3, 4, 5] : [6, 7, 8, 9, 0]
    return { fecha: fechaStr, diaNombre, digitos, horario, tieneRestriccion: true, esFindeSemana, requiereFuente: false }
  }

  const municipioBase = getMunicipioBaseRegla(municipio)
  if (!estaDentroDeVigencia(municipioBase, fecha)) {
    return respuestaConsultarFuente(fechaStr, diaNombre, esFindeSemana, motivoFueraDeVigencia(municipioBase))
  }

  const regla = getReglaMunicipio(municipio)

  if (!regla) {
    return respuestaConsultarFuente(
      fechaStr,
      diaNombre,
      esFindeSemana,
      'El SEO Pack no trae dígitos fijos para automatizar esta ciudad; consulta la fuente registrada.'
    )
  }

  if (!regla.diasOperacion.has(dow)) {
    return { fecha: fechaStr, diaNombre, digitos: null, horario: regla.horario, tieneRestriccion: false, esFindeSemana, requiereFuente: false }
  }

  const digitos = regla.digitos.get(dow) ?? null
  if (!digitos) {
    return respuestaConsultarFuente(
      fechaStr,
      diaNombre,
      esFindeSemana,
      `El SEO Pack indica operación este día, pero no trae dígitos para ${diaNombre.toLowerCase()}; consulta la fuente registrada.`,
      regla.horario
    )
  }

  return { fecha: fechaStr, diaNombre, digitos, horario: regla.horario, tieneRestriccion: true, esFindeSemana, requiereFuente: false }
}

export interface FilaTabla {
  dia: string
  diaDow: number
  digitos: number[]
}

export function getTablaDigitos(municipio: Municipio, fechaBase = new Date()): FilaTabla[] | null {
  if (!estaDentroDeVigencia(getMunicipioBaseRegla(municipio), fechaBase)) return null

  const regla = getReglaMunicipio(municipio)
  if (!regla) return null

  return Array.from(regla.digitos.entries())
    .sort(([a], [b]) => a - b)
    .map(([dow, digitos]) => ({ dia: DIA_NOMBRE[dow] ?? `Día ${dow}`, diaDow: dow, digitos }))
}
