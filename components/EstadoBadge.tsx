import { clasificarEstado } from '@/types/municipio'

const CONFIG: Record<string, { label: string; classes: string }> = {
  activo:          { label: 'Activo',       classes: 'bg-green-100 text-green-800 border-green-200' },
  'activo-amva':   { label: 'AMVA',         classes: 'bg-green-100 text-green-800 border-green-200' },
  'activo-amb':    { label: 'AMB',          classes: 'bg-green-100 text-green-800 border-green-200' },
  regional:        { label: 'Regional',     classes: 'bg-blue-100 text-blue-800 border-blue-200' },
  temporal:        { label: 'Temporal',     classes: 'bg-amber-100 text-amber-800 border-amber-200' },
  'solo-taxis':    { label: 'Solo taxis',   classes: 'bg-purple-100 text-purple-800 border-purple-200' },
  'sin-evidencia': { label: 'Sin confirmar',classes: 'bg-slate-100 text-slate-600 border-slate-200' },
  'no-municipio':  { label: 'Departamento', classes: 'bg-slate-100 text-slate-500 border-slate-200' },
}

export default function EstadoBadge({ estado, size = 'sm' }: { estado: string; size?: 'sm' | 'xs' }) {
  const tipo = clasificarEstado(estado)
  const { label, classes } = CONFIG[tipo] ?? CONFIG['sin-evidencia']
  const sizeClass = size === 'xs' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-0.5'

  return (
    <span className={`inline-flex items-center rounded border font-medium ${classes} ${sizeClass}`}>
      {label}
    </span>
  )
}
