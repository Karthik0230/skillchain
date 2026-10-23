import { Link, useLocation } from 'react-router-dom'
import { useWeb3 } from '../../context/Web3Context'
import { NeonButton, Badge } from '../ui'
import { shortAddress } from '../../utils/helpers'

const NAV_LINKS = [
  { to: '/',         label: 'Home'     },
  { to: '/tasks',    label: 'Tasks'    },
  { to: '/dao',      label: 'DAO'      },
  { to: '/profile',  label: 'Profile'  },
  { to: '/leaderboard', label: 'Leaderboard' },
]

export default function Navbar() {
  const { account, profile, connect, disconnect, isConnected, isConnecting } = useWeb3()
  const { pathname } = useLocation()

  return (
    <nav className="sticky top-0 z-50 border-b border-white/6 bg-bg-primary/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-neon flex items-center justify-center shadow-neon-blue">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-display font-bold text-white text-lg tracking-tight">
              Skill<span className="bg-gradient-neon bg-clip-text text-transparent">Chain</span>
            </span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={[
                  'px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === to
                    ? 'bg-white/8 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5',
                ].join(' ')}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Wallet */}
          <div className="flex items-center gap-3">
            {isConnected ? (
              <div className="flex items-center gap-2">
                {profile?.isDAO && (
                  <Badge color="purple">DAO Member</Badge>
                )}
                {profile?.streak > 0 && (
                  <Badge color="yellow">🔥 {profile.streak}</Badge>
                )}
                <button
                  onClick={disconnect}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-sm text-gray-300 hover:text-white"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {shortAddress(account)}
                </button>
              </div>
            ) : (
              <NeonButton onClick={connect} loading={isConnecting}>
                Connect Wallet
              </NeonButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
