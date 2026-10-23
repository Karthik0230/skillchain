import { useState } from 'react'
import { useCreateTask } from '../hooks/useContract'
import { useWeb3 } from '../context/Web3Context'
import { GlassCard, NeonButton } from '../components/ui'
import { DIFFICULTY_LABELS, txUrl } from '../utils/helpers'

const SKILL_OPTIONS = ['Solidity', 'React', 'Python', 'TypeScript', 'Rust', 'Security', 'DevOps', 'GraphQL', 'Go', 'Other']

export default function CreateTaskPage() {
  const { isConnected, connect, chainId } = useWeb3()
  const { createTask, creating, error: contractError } = useCreateTask()

  const [form, setForm] = useState({
    title: '', description: '', skillTag: 'Solidity', difficulty: 3, rewardEth: '0.01'
  })
  const [success, setSuccess] = useState(false)
  const [txHash,  setTxHash]  = useState(null)
  const [error,   setError]   = useState('')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleCreate = async () => {
    if (!form.title.trim())       { setError('Title is required'); return }
    if (!form.description.trim()) { setError('Description is required'); return }
    setError('')
    try {
      const tx = await createTask(form)
      setTxHash(tx.hash)
      setSuccess(true)
      setForm({ title: '', description: '', skillTag: 'Solidity', difficulty: 3, rewardEth: '0.01' })
    } catch (e) {
      setError(contractError || e.message)
    }
  }

  if (!isConnected) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">📝</div>
        <h1 className="font-display font-bold text-2xl text-white mb-3">Create a Task</h1>
        <p className="text-gray-400 text-sm mb-8">Connect your wallet to create skill tasks and stake ETH rewards.</p>
        <NeonButton size="lg" onClick={connect}>Connect Wallet</NeonButton>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-white mb-2">Create a Task</h1>
        <p className="text-gray-400">Define a skill challenge and stake ETH as a reward for completers</p>
      </div>

      {success ? (
        <GlassCard className="p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="font-display font-bold text-white text-xl mb-2">Task Created!</h2>
          <p className="text-gray-400 text-sm mb-5">Your task is now live on-chain and visible in the task board.</p>
          {txHash && chainId && (
            <a href={txUrl(txHash, chainId)} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm mb-5 block">
              🔗 View transaction on-chain →
            </a>
          )}
          <NeonButton onClick={() => setSuccess(false)}>Create Another Task</NeonButton>
        </GlassCard>
      ) : (
        <GlassCard className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block font-medium">Task Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={set('title')}
              placeholder="e.g. Build a Solidity ERC-20 Token"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block font-medium">Description *</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={set('description')}
              placeholder="Describe what needs to be done, acceptance criteria, and any helpful links..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
            />
          </div>

          {/* Skill Tag */}
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block font-medium">Skill Tag</label>
            <select
              value={form.skillTag}
              onChange={set('skillTag')}
              className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
            >
              {SKILL_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block font-medium">Difficulty</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(d => (
                <button
                  key={d}
                  onClick={() => setForm(f => ({ ...f, difficulty: d }))}
                  className={[
                    'flex-1 py-2 rounded-xl text-sm font-medium transition-all border',
                    form.difficulty === d
                      ? `${DIFFICULTY_LABELS[d].bg} ${DIFFICULTY_LABELS[d].color} border-current`
                      : 'border-white/10 text-gray-500 hover:border-white/20',
                  ].join(' ')}
                >
                  {d}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-1.5">
              {DIFFICULTY_LABELS[form.difficulty].label} · {form.difficulty * 100} XP reward
            </p>
          </div>

          {/* ETH Reward */}
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block font-medium">ETH Reward (staked)</label>
            <div className="relative">
              <input
                type="number"
                step="0.001"
                min="0"
                value={form.rewardEth}
                onChange={set('rewardEth')}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors pr-14"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">ETH</span>
            </div>
            <p className="text-xs text-gray-600 mt-1.5">This ETH will be locked and paid to the approved submitter</p>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <NeonButton className="w-full" onClick={handleCreate} loading={creating} size="lg">
            Create Task & Stake Reward
          </NeonButton>
        </GlassCard>
      )}
    </div>
  )
}
