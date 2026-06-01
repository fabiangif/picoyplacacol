import type { FAQItem } from '@/lib/schema'

interface Props {
  items: FAQItem[]
  title?: string
}

export default function FAQ({ items, title = 'Preguntas frecuentes' }: Props) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-[#0C1B33] mb-4">{title}</h2>
      <dl className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
        {items.map((item, i) => (
          <details key={i} className="group bg-white">
            <summary className="flex items-start justify-between gap-3 px-5 py-4 cursor-pointer list-none hover:bg-slate-50 transition-colors">
              <dt className="text-sm font-medium text-slate-800 leading-snug">
                {item.pregunta}
              </dt>
              <span className="text-slate-400 text-sm group-open:rotate-180 transition-transform mt-0.5 shrink-0">
                ▾
              </span>
            </summary>
            <dd className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
              {item.respuesta}
            </dd>
          </details>
        ))}
      </dl>
    </section>
  )
}
