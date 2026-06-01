export interface BreadcrumbItem {
  nombre: string
  href: string
}

export interface FAQItem {
  pregunta: string
  respuesta: string
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://picoyplacacol.com'

export function generarBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.nombre,
      item: `${BASE_URL}${item.href}`,
    })),
  }
}

export function generarFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.pregunta,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.respuesta,
      },
    })),
  }
}

export function generarWebPageSchema(title: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${BASE_URL}${url}`,
    inLanguage: 'es-CO',
    dateModified: new Date().toISOString().split('T')[0],
  }
}

export function generarPlaceSchema({
  name,
  region,
  url,
  image,
  map,
}: {
  name: string
  region: string
  url: string
  image?: string
  map?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name,
    url: `${BASE_URL}${url}`,
    image,
    hasMap: map,
    address: {
      '@type': 'PostalAddress',
      addressLocality: name,
      addressRegion: region,
      addressCountry: 'CO',
    },
  }
}
