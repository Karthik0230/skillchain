import { Link } from 'react-router-dom'
import { useWeb3 } from '../context/Web3Context'
import { NeonButton, GlassCard } from '../components/ui'

const FEATURES = [
  {
    icon: '⛓️',
    title: 'On-Chain Proof',
    description: 'Every completed task is recorded permanently on-chain. Your skills are verifiable by anyone, forever.',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    icon: '🗳️',
    title: 'DAO Judging',
    description: 'Submissions are reviewed by a peer DAO — no central authority, no bias. Earn trust from real practitioners.',
    gradient: 'from-purple-500/20 to-pink-500/20',
  },
  {
    icon: '🎮',
    title: 'Skill Leveling',
    description: 'Gain XP, level up your skills, and unlock DAO voting rights. Turn your learning into a game.',
    gradient: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    icon: '💰',
    title: 'Earn Rewards',
    description: 'Task creators stake ETH as rewards. Complete and get approved — earn real cryptocurrency for real work.',
    gradient: 'from-yellow-500/20 to-orange-500/20',
  },
  {
    icon: '🔥',
    title: 'Daily Streaks',
    description: 'Keep your learning momentum with daily streaks. Show employers you\'re consistent, not just capable.',
    gradient: 'from-orange-500/20 to-red-500/20',
  },
  {
    icon: '👛',
    title: 'Wallet = Resume',
    description: 'No PDF needed. Your wallet address IS your resume. Connect and your entire verified skill history loads instantly.',
    gradient: 'from-pink-500/20 to-rose-500/20',
  },
]

const STATS = [
  { value: '∞',    label: 'Verifiable Skills' },
  { value: '0',    label: 'Central Authority' },
  { value: '100%', label: 'On-Chain' },
  { value: '🔓',   label: 'Permissionless' },
]

export default function HomePage() {
  const { connect, isConnected, isConnecting } = useWeb3()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-4">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-blue-600/20 via-purple-600/10 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Decentralised Skill Verification
          </div>

          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-tight mb-6">
            Your wallet is<br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              your resume
            </span>
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Prove real skills by completing on-chain micro-tasks. Get judged by a peer DAO.
            No certificates. No gatekeepers. Just pure, verifiable proof of work.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {isConnected ? (
              <Link to="/tasks">
                <NeonButton size="lg">Browse Tasks →</NeonButton>
              </Link>
            ) : (
              <NeonButton size="lg" onClick={connect} loading={isConnecting}>
                Connect Wallet to Start
              </NeonButton>
            )}
            <Link to="/leaderboard">
              <NeonButton variant="secondary" size="lg">View Leaderboard</NeonButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/6 bg-white/2 py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <div className="font-display font-bold text-3xl text-white mb-1">{value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-white text-center mb-3">How it works</h2>
          <p className="text-gray-500 text-center mb-12">Three simple steps to verified skills</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Pick a task', desc: 'Browse skill-tagged micro-tasks with attached ETH rewards. Filter by skill, difficulty, or reward size.', icon: '🎯' },
              { step: '02', title: 'Submit proof', desc: 'Complete the task and submit your proof URI (IPFS link). Your submission goes to the DAO queue.', icon: '📤' },
              { step: '03', title: 'Get verified', desc: 'DAO members vote on your work. Pass and earn XP, rewards, and an on-chain credential badge.', icon: '✅' },
            ].map(({ step, title, desc, icon }) => (
              <GlassCard key={step} className="p-6 text-center" hover>
                <div className="text-3xl mb-3">{icon}</div>
                <div className="text-xs font-mono text-blue-400 mb-2">{step}</div>
                <h3 className="font-display font-semibold text-white mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 border-t border-white/6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-white text-center mb-3">Why SkillChain?</h2>
          <p className="text-gray-500 text-center mb-12">A truly decentralised credential system</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon, title, description, gradient }) => (
              <GlassCard key={title} className="p-6" hover>
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} mb-4`}>
                  <span className="text-2xl">{icon}</span>
                </div>
                <h3 className="font-display font-semibold text-white mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <GlassCard className="p-10">
            <h2 className="font-display font-bold text-3xl text-white mb-4">
              Ready to build your on-chain reputation?
            </h2>
            <p className="text-gray-400 mb-8">Connect your wallet and start proving your skills today. No signup required.</p>
            {isConnected ? (
              <Link to="/tasks">
                <NeonButton size="lg">Start Earning XP →</NeonButton>
              </Link>
            ) : (
              <NeonButton size="lg" onClick={connect} loading={isConnecting}>
                Connect MetaMask
              </NeonButton>
            )}
          </GlassCard>
        </div>
      </section>
    </div>
  )
}
