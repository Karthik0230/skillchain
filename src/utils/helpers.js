// ─── Address Formatting ──────────────────────────────────────────────────────

export const shortAddress = (addr) =>
  addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : ''

// ─── XP / Level Helpers ──────────────────────────────────────────────────────

export const XP_LEVELS = [
  { level: 1, name: 'Novice',     minXP: 0,    color: '#6B7280' },
  { level: 2, name: 'Apprentice', minXP: 200,  color: '#10B981' },
  { level: 3, name: 'Journeyman', minXP: 500,  color: '#3B82F6' },
  { level: 4, name: 'Expert',     minXP: 1000, color: '#8B5CF6' },
  { level: 5, name: 'Master',     minXP: 2000, color: '#F59E0B' },
  { level: 6, name: 'Legend',     minXP: 4000, color: '#EC4899' },
]

export function xpToLevel(xp) {
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= XP_LEVELS[i].minXP) return XP_LEVELS[i]
  }
  return XP_LEVELS[0]
}

export function xpToNextLevel(xp) {
  const current = xpToLevel(xp)
  const next    = XP_LEVELS.find(l => l.level === current.level + 1)
  if (!next) return { next: null, progress: 100 }
  const progress = ((xp - current.minXP) / (next.minXP - current.minXP)) * 100
  return { next, progress: Math.min(100, progress) }
}

// ─── Difficulty ───────────────────────────────────────────────────────────────

export const DIFFICULTY_LABELS = {
  1: { label: 'Beginner',     color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  2: { label: 'Easy',         color: 'text-blue-400',    bg: 'bg-blue-400/10' },
  3: { label: 'Intermediate', color: 'text-purple-400',  bg: 'bg-purple-400/10' },
  4: { label: 'Hard',         color: 'text-orange-400',  bg: 'bg-orange-400/10' },
  5: { label: 'Expert',       color: 'text-red-400',     bg: 'bg-red-400/10' },
}

// ─── Skill Colors ─────────────────────────────────────────────────────────────

const SKILL_COLORS = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-red-500',
  'from-yellow-500 to-orange-500',
  'from-pink-500 to-rose-500',
]

export function skillGradient(skillTag) {
  const idx = skillTag.charCodeAt(0) % SKILL_COLORS.length
  return SKILL_COLORS[idx]
}

// ─── Blockchain Explorer ──────────────────────────────────────────────────────

export function txUrl(txHash, chainId) {
  if (chainId === 11155111) return `https://sepolia.etherscan.io/tx/${txHash}`
  if (chainId === 1)        return `https://etherscan.io/tx/${txHash}`
  return `http://localhost:8545` // local — no explorer
}

// ─── Date Helpers ─────────────────────────────────────────────────────────────

export function timeAgo(date) {
  const diff = Date.now() - date.getTime()
  const mins  = Math.floor(diff / 60000)
  if (mins < 60)  return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)   return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

// ─── Class Merging ────────────────────────────────────────────────────────────

export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
