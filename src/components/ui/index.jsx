import { cn } from '../../utils/helpers'

// ─── GlassCard ────────────────────────────────────────────────────────────────

export function GlassCard({ children, className = '', hover = true, onClick }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl border border-white/8 bg-white/4 backdrop-blur-md',
        'shadow-card',
        hover && 'transition-all duration-300 hover:border-white/15 hover:shadow-card-hover hover:-translate-y-0.5',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

// ─── NeonButton ───────────────────────────────────────────────────────────────

export function NeonButton({ children, onClick, disabled, loading, variant = 'primary', size = 'md', className = '' }) {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  }
  const variants = {
    primary: 'bg-gradient-neon hover:bg-gradient-neon-hover shadow-neon-blue text-white',
    secondary: 'border border-white/15 bg-white/5 hover:bg-white/10 text-white',
    danger:  'bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-400',
    success: 'bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/30 text-emerald-400',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'rounded-xl font-medium font-display transition-all duration-200',
        'active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
        sizes[size],
        variants[variant],
        className
      )}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          {children}
        </span>
      ) : children}
    </button>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────

export function Badge({ children, color = 'blue', className = '' }) {
  const colors = {
    blue:   'bg-blue-500/15 text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    green:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    yellow: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    red:    'bg-red-500/15 text-red-400 border-red-500/20',
    pink:   'bg-pink-500/15 text-pink-400 border-pink-500/20',
    gray:   'bg-gray-500/15 text-gray-400 border-gray-500/20',
  }
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border',
      colors[color] || colors.blue,
      className
    )}>
      {children}
    </span>
  )
}

// ─── XPBar ────────────────────────────────────────────────────────────────────

export function XPBar({ progress, color = 'blue', className = '' }) {
  return (
    <div className={cn('h-2 w-full rounded-full bg-white/8 overflow-hidden', className)}>
      <div
        className={cn(
          'h-full rounded-full transition-all duration-700',
          color === 'blue'   && 'bg-gradient-to-r from-blue-500 to-cyan-400',
          color === 'purple' && 'bg-gradient-to-r from-purple-500 to-pink-400',
          color === 'green'  && 'bg-gradient-to-r from-emerald-500 to-teal-400',
        )}
        style={{ width: `${Math.min(100, progress)}%` }}
      />
    </div>
  )
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

export function StatCard({ label, value, icon, gradient, className = '' }) {
  return (
    <GlassCard className={cn('p-5', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">{label}</p>
          <p className="text-2xl font-bold font-display text-white">{value}</p>
        </div>
        <div className={cn('p-2.5 rounded-xl bg-gradient-to-br', gradient)}>
          {icon}
        </div>
      </div>
    </GlassCard>
  )
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-white font-display mb-2">{title}</h3>
      <p className="text-gray-500 text-sm max-w-xs">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

export function Spinner({ size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }
  return (
    <div className={cn(
      'border-2 border-white/10 border-t-blue-500 rounded-full animate-spin',
      sizes[size]
    )} />
  )
}
