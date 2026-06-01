import type { Municipio } from '@/types/municipio'
import { clasificarEstado } from '@/types/municipio'
import type { Metadata } from 'next'
import { puedeCalcularDia } from '@/lib/digitos'
import { getCityVisual } from '@/lib/visuals'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://picoyplacacol.com'
const AÑO = 2026

// Extrae volumen del keyword principal desde top_keywords
// Ejemplo: "pico y placa bogota (230000); pico y placa bogota hoy (54000)"
export function parsearVolumenes(topKeywords: string): Record<string, number> {
  const re = /([^(;]+)\((\d+)\)/g
  const result: Record<string, number> = {}
  let m: RegExpExecArray | null
  while ((m = re.exec(topKeywords)) !== null) {
    result[m[1].trim().toLowerCase()] = Number(m[2])
  }
  return result
}

export function metadataCiudad(m: Municipio): Metadata {
  const tipo = clasificarEstado(m.estado)
  const esActivo = ['activo', 'activo-amva', 'activo-amb'].includes(tipo)
  const ciudad = m.ubicacion
  const visual = getCityVisual(m)

  const title =
    esActivo
      ? `Pico y Placa ${ciudad} ${AÑO} con Horario, Dígitos y Excepciones`
      : tipo === 'regional'
        ? `Pico y Placa ${ciudad} ${AÑO} con Medida Regional`
        : tipo === 'solo-taxis'
          ? `Pico y Placa ${ciudad} ${AÑO} para Particulares y Taxis`
          : tipo === 'no-municipio'
            ? `Pico y Placa ${ciudad} ${AÑO} como Guía Departamental`
            : `Pico y Placa ${ciudad} ${AÑO}: ¿Hay restricción vehicular?`

  const desc =
    esActivo
      ? `Pico y placa en ${ciudad} ${AÑO}: ${m.funcionamiento}. Aplica a ${m.vehiculos}. Consulta dígitos y horario verificados.`
      : tipo === 'regional'
        ? `${ciudad}: ${m.funcionamiento}. Aclaración regional verificada al 28 de mayo de ${AÑO}; no es calendario urbano diario.`
        : tipo === 'solo-taxis'
          ? `${ciudad}: ${m.funcionamiento}. Aclaramos particulares vs taxis con fuente verificada al 28 de mayo de ${AÑO}.`
          : `${ciudad}: ${m.funcionamiento}. Estado de la restricción vehicular verificado al 28 de mayo de ${AÑO}.`

  return {
    title,
    description: desc.slice(0, 155),
    alternates: { canonical: `${SITE_URL}/pico-y-placa/${m.slug}/` },
    openGraph: {
      title,
      description: desc.slice(0, 155),
      locale: 'es_CO',
      type: 'website',
      url: `${SITE_URL}/pico-y-placa/${m.slug}/`,
      images: [{ url: visual.src, alt: visual.alt }],
    },
  }
}

export function metadataHoy(m: Municipio): Metadata {
  const ciudad = m.ubicacion
  const visual = getCityVisual(m)
  const hoyStr = new Date().toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Bogota',
  })
  const calculable = puedeCalcularDia(m, 0)

  const title = `Pico y Placa ${ciudad} Hoy para ${hoyStr.charAt(0).toUpperCase() + hoyStr.slice(1)}`
  const desc = calculable
    ? `¿Cuál es el pico y placa en ${ciudad} hoy ${hoyStr}? Dígitos restringidos, horario y excepciones. Información verificada ${AÑO}.`
    : `${ciudad} hoy: ${m.funcionamiento}. Consulta la fuente verificada antes de circular; calendario no automatizado.`

  return {
    title,
    description: desc.slice(0, 155),
    alternates: { canonical: `${SITE_URL}/pico-y-placa/${m.slug}/hoy/` },
    openGraph: {
      title,
      description: desc.slice(0, 155),
      locale: 'es_CO',
      type: 'website',
      images: [{ url: visual.src, alt: visual.alt }],
    },
  }
}

export function metadataManana(m: Municipio): Metadata {
  const ciudad = m.ubicacion
  const visual = getCityVisual(m)
  const manana = new Date()
  manana.setDate(manana.getDate() + 1)
  const mananaStr = manana.toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Bogota',
  })
  const calculable = puedeCalcularDia(m, 1)

  const title = `Pico y Placa ${ciudad} Mañana para ${mananaStr.charAt(0).toUpperCase() + mananaStr.slice(1)}`
  const desc = calculable
    ? `¿Cuál es el pico y placa en ${ciudad} mañana ${mananaStr}? Dígitos restringidos y horario. Planifica tu viaje con información verificada.`
    : `${ciudad} mañana: ${m.funcionamiento}. Consulta la fuente verificada antes de circular; calendario no automatizado.`

  return {
    title,
    description: desc.slice(0, 155),
    alternates: { canonical: `${SITE_URL}/pico-y-placa/${m.slug}/manana/` },
    openGraph: {
      title,
      description: desc.slice(0, 155),
      locale: 'es_CO',
      type: 'website',
      images: [{ url: visual.src, alt: visual.alt }],
    },
  }
}

// FAQs optimizadas para query fan-out con datos reales
export function generarFAQsCiudad(m: Municipio) {
  const tipo = clasificarEstado(m.estado)
  const esActivo = ['activo', 'activo-amva', 'activo-amb'].includes(tipo)
  const ciudad = m.ubicacion

  if (tipo === 'regional') {
    return [
      {
        pregunta: `¿Hay pico y placa diario en ${ciudad}?`,
        respuesta: `No se presenta como restricción diaria urbana. El SEO Pack registra: ${m.funcionamiento}. Aplica a: ${m.vehiculos}.`,
      },
      {
        pregunta: `¿Cuándo aplica el pico y placa regional en ${ciudad}?`,
        respuesta: `La referencia del pack es: ${m.funcionamiento}. Verifica cada retorno festivo en la fuente registrada: ${m.fuente}.`,
      },
      {
        pregunta: `¿Qué vehículos aplica en ${ciudad}?`,
        respuesta: `Aplica a: ${m.vehiculos}. No debe confundirse con un calendario municipal recurrente.`,
      },
      {
        pregunta: `¿Cuál es la fuente para ${ciudad}?`,
        respuesta: `La fuente registrada es ${m.norma_local || 'la fuente regional indicada'}: ${m.fuente}.`,
      },
      {
        pregunta: `¿Por qué esta página es aclaratoria?`,
        respuesta: m.notas || `El pack la clasifica como ${m.page_type} para evitar publicar un calendario urbano no confirmado.`,
      },
    ]
  }

  if (tipo === 'solo-taxis') {
    return [
      {
        pregunta: `¿Hay pico y placa para particulares en ${ciudad}?`,
        respuesta: `No. El pack registra: ${m.funcionamiento}. Vehículos: ${m.vehiculos}.`,
      },
      {
        pregunta: `¿Hay pico y placa para taxis en ${ciudad}?`,
        respuesta: `Sí, la aclaración del pack indica taxis con calendario y particulares sin pico y placa urbano.`,
      },
      {
        pregunta: `¿Cuál es la norma de ${ciudad}?`,
        respuesta: `La norma registrada es ${m.norma_local}.`,
      },
      {
        pregunta: `¿Dónde verificar el calendario de taxis en ${ciudad}?`,
        respuesta: `Verifica directamente en la fuente registrada: ${m.fuente}.`,
      },
      {
        pregunta: `¿Por qué no mostramos una tabla para particulares?`,
        respuesta: `Porque el pack indica que la restricción urbana no aplica a particulares en ${ciudad}.`,
      },
    ]
  }

  if (tipo === 'no-municipio') {
    return [
      {
        pregunta: `¿Hay pico y placa departamental en ${ciudad}?`,
        respuesta: `No como medida única. El pack registra: ${m.funcionamiento}.`,
      },
      {
        pregunta: `¿Qué debo consultar para ${ciudad}?`,
        respuesta: `Consulta las páginas de los municipios o corredores relevantes; esta página funciona como apoyo de directorio.`,
      },
      {
        pregunta: `¿Aplica a vehículos particulares?`,
        respuesta: m.vehiculos,
      },
      {
        pregunta: `¿Por qué no hay calendario en esta página?`,
        respuesta: `Porque ${ciudad} no corresponde a una medida municipal única en el SEO Pack.`,
      },
      {
        pregunta: `¿Cuál es la nota editorial?`,
        respuesta: m.notas || 'Revisar los municipios relacionados antes de circular.',
      },
    ]
  }

  if (tipo === 'temporal') {
    return [
      {
        pregunta: `¿Hay pico y placa permanente en ${ciudad}?`,
        respuesta: `El pack no lo trata como calendario diario permanente. Estado registrado: ${m.estado}. Funcionamiento: ${m.funcionamiento}.`,
      },
      {
        pregunta: `¿A qué vehículos aplica en ${ciudad}?`,
        respuesta: `Aplica a: ${m.vehiculos}.`,
      },
      {
        pregunta: `¿Cuál es la fuente de ${ciudad}?`,
        respuesta: `Fuente registrada: ${m.fuente}. Confianza: ${m.confianza}.`,
      },
      {
        pregunta: `¿Debo verificar antes de circular?`,
        respuesta: `Sí. Al ser una medida temporal o especial, verifica la fuente antes de circular o planear un viaje.`,
      },
      {
        pregunta: `¿Cuál es la nota editorial?`,
        respuesta: m.notas || `El pack clasifica esta página como ${m.page_type}.`,
      },
    ]
  }

  return [
    {
      pregunta: `¿Hay pico y placa en ${ciudad} hoy?`,
      respuesta: esActivo
        ? `Sí. El pico y placa en ${ciudad} está vigente. Funciona ${m.funcionamiento}. Aplica a: ${m.vehiculos}.`
        : `No encontramos una medida de pico y placa recurrente vigente en ${ciudad} al corte del 28 de mayo de ${AÑO}. Consulta la autoridad local para información actualizada.`,
    },
    {
      pregunta: `¿Cuál es el horario del pico y placa en ${ciudad}?`,
      respuesta: `El horario del pico y placa en ${ciudad} es: ${m.funcionamiento}. Esta información proviene de ${m.norma_local}.`,
    },
    {
      pregunta: `¿Qué vehículos aplica el pico y placa en ${ciudad}?`,
      respuesta: `En ${ciudad} el pico y placa aplica a: ${m.vehiculos}. Verifica las excepciones directamente con la secretaría de movilidad local.`,
    },
    {
      pregunta: `¿Cuáles son las excepciones al pico y placa en ${ciudad}?`,
      respuesta: `Las excepciones al pico y placa en ${ciudad} deben verificarse en ${m.fuente ? `la fuente registrada (${m.fuente})` : 'la autoridad local correspondiente'}. Las excepciones más comunes según el Código Nacional de Tránsito incluyen: vehículos de emergencia (ambulancias, bomberos, policía), transporte escolar habilitado, vehículos de carga de alto tonelaje en corredores autorizados, y vehículos eléctricos según la Ley 1964 de 2019. Cada ciudad puede ampliar o restringir estas excepciones mediante decreto local.`,
    },
    {
      pregunta: `¿Cuánto es la multa por violar el pico y placa en ${ciudad}?`,
      respuesta: `La sanción por violar el pico y placa está tipificada en el artículo 131, literal C.14 del Código Nacional de Tránsito (Ley 769 de 2002), y corresponde a 15 SMLMV (salarios mínimos legales mensuales vigentes). Para 2026, verifique el valor equivalente actualizado con la Secretaría de Tránsito de ${ciudad}.`,
    },
    {
      pregunta: `¿Aplica el pico y placa en ${ciudad} los fines de semana?`,
      respuesta: esActivo
        ? `En ${ciudad} el pico y placa aplica de lunes a viernes en días hábiles. Los fines de semana y festivos generalmente no hay restricción, salvo disposición especial del ente territorial.`
        : `No se ha confirmado una medida de pico y placa en ${ciudad} que aplique en ningún día de la semana al corte de esta investigación.`,
    },
  ]
}
