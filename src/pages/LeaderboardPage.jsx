import { GlassCard, Badge } from '../components/ui'
import { xpToLevel, shortAddress } from '../utils/helpers'

// Demo leaderboard data — will be replaced with on-chain reads
const DEMO_LEADERS = [
  { address: '0xdEaD...BeEf', username: 'CryptoWizard',  xp: 4200, tasks: 18, streak: 14, skills: ['Solidity', 'Security'] },
  { address: '0x1337...F00D', username: 'ReactNinja',    xp: 2800, tasks: 12, streak: 7,  skills: ['React', 'TypeScript'] },
  { address: '0xC0FF...EE42', username: 'ChainBuilder',  xp: 1900, tasks: 9,  streak: 21, skills: ['Rust', 'DevOps'] },
  { address: '0xBEEF...CAFE', username: 'PythonWitch',   xp: 1400, tasks: 7,  streak: 5,  skills: ['Python', 'Security'] },
  { address: '0xFACE...B00C', username: 'SolidityPro',   xp: 1100, tasks: 5,  streak: 3,  skills: ['Solidity'] },
  { address: '0xDEAD...C0DE', username: 'Web3Explorer',  xp: 800,  tasks: 4,  streak: 2,  skills: ['React', 'Solidity'] },
  { address: '0xFEED...FACE', username: 'BlockDevGuru',  xp: 500,  tasks: 3,  streak: 1,  skills: ['TypeScript'] },
  { address: '0xABCD...EF01', username: 'SmartContract', xp: 300,  tasks: 2,  streak: 0,  skills: ['Solidity'] },
]

const MEDALS = ['🥇', '🥈', '🥉']

export default function LeaderboardPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-white mb-2">Leaderboard</h1>
        <p className="text-gray-400">Top skill-earners ranked by on-chain XP</p>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {DEMO_LEADERS.slice(0, 3).map((user, i) => {
          const level = xpToLevel(user.xp)
          return (
            <GlassCard key={user.address} className={`p-4 text-center ${i === 0 ? 'ring-1 ring-yellow-500/40' : ''}`}>
              <div className="text-3xl mb-2">{MEDALS[i]}</div>
              <div className="font-display font-bold text-white text-sm mb-1">{user.username}</div>
              <div className="text-xs text-gray-500 mb-2">{shortAddress(user.address)}</div>
              <Badge color={i === 0 ? 'yellow' : i === 1 ? 'gray' : 'blue'}>{level.name}</Badge>
              <div className="mt-2 text-emerald-400 font-bold text-sm">{user.xp.toLocaleString()} XP</div>
            </GlassCard>
          )
        })}
      </div>

      {/* Full list */}
      <GlassCard className="overflow-hidden">
        <div className="p-4 border-b border-white/6">
          <div className="grid grid-cols-12 text-xs text-gray-500 uppercase tracking-wider font-medium">
            <div className="col-span-1">#</div>
            <div className="col-span-4">User</div>
            <div className="col-span-2 text-right">XP</div>
            <div className="col-span-2 text-right">Tasks</div>
            <div className="col-span-3 text-right">Streak</div>
          </div>
        </div>
        <div>
          {DEMO_LEADERS.map((user, i) => {
            const level = xpToLevel(user.xp)
            return (
              <div
                key={user.address}
                className="grid grid-cols-12 items-center p-4 border-b border-white/4 last:border-0 hover:bg-white/3 transition-colors"
              >
                <div className="col-span-1 text-gray-500 text-sm font-mono">
                  {i < 3 ? MEDALS[i] : i + 1}
                </div>
                <div className="col-span-4">
                  <div className="font-medium text-white text-sm">{user.username}</div>
                  <div className="text-[10px] text-gray-600 font-mono">{user.address}</div>
                </div>
                <div className="col-span-2 text-right">
                  <div className="text-sm font-semibold text-white">{user.xp.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-500">{level.name}</div>
                </div>
                <div className="col-span-2 text-right text-sm text-gray-400">{user.tasks}</div>
                <div className="col-span-3 text-right text-sm">
                  {user.streak > 0
                    ? <span className="text-yellow-400">🔥 {user.streak}</span>
                    : <span className="text-gray-600">–</span>}
                </div>
              </div>
            )
          })}
        </div>
      </GlassCard>

      <p className="text-xs text-gray-600 text-center mt-4">
        * Demo data shown. Live leaderboard reads from contract after deployment.
      </p>
    </div>
  )
}
