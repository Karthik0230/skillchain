import { useState } from 'react'
import { useWeb3 } from '../context/Web3Context'
import { GlassCard, NeonButton, Badge, XPBar, StatCard, Spinner } from '../components/ui'
import { xpToLevel, xpToNextLevel, XP_LEVELS, shortAddress } from '../utils/helpers'

const DEMO_SKILLS = [
  { skill: 'Solidity', xp: 850 },
  { skill: 'React',    xp: 500 },
  { skill: 'Python',   xp: 300 },
  { skill: 'Security', xp: 200 },
]

export default function ProfilePage() {
  const { isConnected, connect, account, profile, registerProfile, refreshProfile } = useWeb3()
  const [username,     setUsername]     = useState('')
  const [registering,  setRegistering]  = useState(false)
  const [regError,     setRegError]     = useState('')
  const [regSuccess,   setRegSuccess]   = useState(false)

  const handleRegister = async () => {
    if (!username.trim()) { setRegError('Username required'); return }
    setRegistering(true)
    setRegError('')
    try {
      await registerProfile(username.trim())
      setRegSuccess(true)
    } catch (e) {
      setRegError(e.reason || e.message)
    } finally {
      setRegistering(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-5">👛</div>
        <h1 className="font-display font-bold text-2xl text-white mb-3">Your Wallet is Your Resume</h1>
        <p className="text-gray-400 text-sm mb-8">Connect your MetaMask wallet to view your on-chain skill profile.</p>
        <NeonButton size="lg" onClick={connect}>Connect Wallet</NeonButton>
      </div>
    )
  }

  const xp    = profile?.totalXP ?? 0
  const level = xpToLevel(xp)
  const { next, progress } = xpToNextLevel(xp)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-white mb-2">My Profile</h1>
        <p className="text-gray-400">Your on-chain skill resume — verifiable by anyone</p>
      </div>

      {/* Identity Card */}
      <GlassCard className="p-6 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar — gradient derived from address */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white bg-gradient-neon shadow-neon-blue"
            >
              {profile?.username ? profile.username[0].toUpperCase() : '?'}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-display font-bold text-white text-xl">
                  {profile?.username || 'Unregistered'}
                </h2>
                {profile?.isDAO && <Badge color="purple">DAO Member</Badge>}
              </div>
              <p className="text-gray-500 text-sm font-mono">{account}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {profile?.streak > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <span>🔥</span>
                <span className="text-yellow-400 font-semibold text-sm">{profile.streak} day streak</span>
              </div>
            )}
          </div>
        </div>

        {/* Register form if not registered */}
        {!profile?.username && (
          <div className="mt-5 pt-5 border-t border-white/8">
            <p className="text-gray-400 text-sm mb-3">Register your on-chain username to get started</p>
            <div className="flex gap-3">
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Choose a username"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
              />
              <NeonButton onClick={handleRegister} loading={registering}>Register</NeonButton>
            </div>
            {regError && <p className="text-red-400 text-xs mt-2">{regError}</p>}
            {regSuccess && <p className="text-emerald-400 text-xs mt-2">✅ Profile registered on-chain!</p>}
          </div>
        )}
      </GlassCard>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total XP"
          value={xp.toLocaleString()}
          icon={<span className="text-lg">⚡</span>}
          gradient="from-blue-500/30 to-cyan-500/30"
        />
        <StatCard
          label="Level"
          value={level.name}
          icon={<span className="text-lg">🏆</span>}
          gradient="from-purple-500/30 to-pink-500/30"
        />
        <StatCard
          label="Tasks Done"
          value={profile?.tasksCompleted ?? 0}
          icon={<span className="text-lg">✅</span>}
          gradient="from-emerald-500/30 to-teal-500/30"
        />
        <StatCard
          label="Streak"
          value={`${profile?.streak ?? 0}🔥`}
          icon={<span className="text-lg">🌟</span>}
          gradient="from-yellow-500/30 to-orange-500/30"
        />
      </div>

      {/* XP Progress */}
      <GlassCard className="p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-display font-semibold text-white">{level.name}</span>
            <span className="text-gray-500 text-sm ml-2">Level {level.level}</span>
          </div>
          {next ? (
            <span className="text-xs text-gray-500">{xp} / {next.minXP} XP → {next.name}</span>
          ) : (
            <Badge color="pink">Max Level!</Badge>
          )}
        </div>
        <XPBar progress={next ? progress : 100} color="purple" />

        {/* Level roadmap */}
        <div className="flex justify-between mt-4 gap-1">
          {XP_LEVELS.map(l => (
            <div key={l.level} className={`flex-1 text-center ${xp >= l.minXP ? 'opacity-100' : 'opacity-30'}`}>
              <div className="text-xs text-gray-500">{l.name}</div>
              <div className="w-2 h-2 rounded-full mx-auto mt-1" style={{ background: l.color }} />
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Skills breakdown */}
      <GlassCard className="p-5">
        <h3 className="font-display font-semibold text-white mb-4">Skill Breakdown</h3>
        <p className="text-xs text-gray-500 mb-4">
          Note: Live data loads after deployment. Showing demo data below.
        </p>
        <div className="space-y-4">
          {DEMO_SKILLS.map(({ skill, xp: skillXP }) => {
            const skillLevel = xpToLevel(skillXP)
            const { progress: sp } = xpToNextLevel(skillXP)
            return (
              <div key={skill}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium">{skill}</span>
                    <Badge color="blue">{skillLevel.name}</Badge>
                  </div>
                  <span className="text-xs text-gray-500">{skillXP} XP</span>
                </div>
                <XPBar progress={sp} color="blue" />
              </div>
            )
          })}
        </div>
      </GlassCard>
    </div>
  )
}
