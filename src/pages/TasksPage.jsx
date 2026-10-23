import { useState } from 'react'
import { useTasks, useSubmitTask } from '../hooks/useContract'
import { useWeb3 } from '../context/Web3Context'
import { GlassCard, NeonButton, Badge, EmptyState, Spinner } from '../components/ui'
import { DIFFICULTY_LABELS, skillGradient, timeAgo, shortAddress, txUrl } from '../utils/helpers'

const SKILL_FILTERS = ['All', 'Solidity', 'React', 'Python', 'Security', 'DevOps', 'TypeScript', 'Rust']

export default function TasksPage() {
  const { tasks, loading, refetch } = useTasks()
  const { submit, submitting, txHash } = useSubmitTask()
  const { isConnected, connect, chainId } = useWeb3()

  const [selectedSkill, setSelectedSkill] = useState('All')
  const [selectedTask,  setSelectedTask]  = useState(null)
  const [proofURI,      setProofURI]      = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError,   setSubmitError]   = useState('')

  const filtered = tasks.filter(t =>
    selectedSkill === 'All' || t.skillTag === selectedSkill
  )

  const handleSubmit = async () => {
    if (!proofURI.trim()) { setSubmitError('Proof URI is required'); return }
    setSubmitError('')
    setSubmitSuccess(false)
    try {
      await submit(selectedTask.id, proofURI.trim())
      setSubmitSuccess(true)
      setProofURI('')
      refetch()
    } catch (e) {
      setSubmitError(e.message)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-white mb-2">Task Board</h1>
        <p className="text-gray-400">Complete tasks, earn XP, and prove your skills on-chain</p>
      </div>

      {/* Skill filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {SKILL_FILTERS.map(skill => (
          <button
            key={skill}
            onClick={() => setSelectedSkill(skill)}
            className={[
              'px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-200',
              selectedSkill === skill
                ? 'bg-gradient-neon text-white shadow-neon-blue'
                : 'border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:border-white/20',
            ].join(' ')}
          >
            {skill}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="No tasks found"
          description="No tasks match this filter yet. Check back soon or create one!"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(task => {
            const diff = DIFFICULTY_LABELS[task.difficulty]
            return (
              <GlassCard
                key={task.id}
                className="p-5 flex flex-col gap-3"
                onClick={() => { setSelectedTask(task); setSubmitSuccess(false); setSubmitError('') }}
                hover
              >
                {/* Skill tag gradient bar */}
                <div className={`h-0.5 rounded-full bg-gradient-to-r ${skillGradient(task.skillTag)}`} />

                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-semibold text-white text-sm leading-snug">{task.title}</h3>
                  <Badge color="blue">{task.skillTag}</Badge>
                </div>

                <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{task.description}</p>

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/6">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${diff.color} ${diff.bg}`}>
                    {diff.label}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="text-emerald-400 font-semibold">{task.reward} ETH</span>
                    <span>{timeAgo(task.createdAt)}</span>
                  </div>
                </div>

                <div className="text-[10px] text-gray-600">
                  By {shortAddress(task.creator)}
                </div>
              </GlassCard>
            )
          })}
        </div>
      )}

      {/* Task Detail / Submit Modal */}
      {selectedTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedTask(null) }}
        >
          <GlassCard className="w-full max-w-lg p-6 animate-slide-up">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge color="blue" className="mb-2">{selectedTask.skillTag}</Badge>
                <h2 className="font-display font-bold text-white text-xl">{selectedTask.title}</h2>
              </div>
              <button onClick={() => setSelectedTask(null)} className="text-gray-500 hover:text-white transition-colors text-xl leading-none">×</button>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-5">{selectedTask.description}</p>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="text-center p-3 rounded-xl bg-white/5">
                <div className="text-lg font-bold text-white">{selectedTask.reward}</div>
                <div className="text-xs text-gray-500">ETH Reward</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/5">
                <div className={`text-sm font-semibold ${DIFFICULTY_LABELS[selectedTask.difficulty].color}`}>
                  {DIFFICULTY_LABELS[selectedTask.difficulty].label}
                </div>
                <div className="text-xs text-gray-500">Difficulty</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/5">
                <div className="text-lg font-bold text-white">{selectedTask.difficulty * 100}</div>
                <div className="text-xs text-gray-500">XP Reward</div>
              </div>
            </div>

            {!isConnected ? (
              <NeonButton className="w-full" onClick={connect}>Connect Wallet to Submit</NeonButton>
            ) : submitSuccess ? (
              <div className="text-center py-4">
                <div className="text-3xl mb-2">🎉</div>
                <p className="text-emerald-400 font-medium">Submission sent to DAO for review!</p>
                {txHash && chainId && (
                  <a href={txUrl(txHash, chainId)} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-xs text-blue-400 hover:text-blue-300">
                    🔗 View on chain →
                  </a>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Proof URI (IPFS / GitHub link)</label>
                  <input
                    type="text"
                    value={proofURI}
                    onChange={e => setProofURI(e.target.value)}
                    placeholder="ipfs://Qm... or https://github.com/..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                {submitError && <p className="text-red-400 text-xs">{submitError}</p>}
                <NeonButton className="w-full" onClick={handleSubmit} loading={submitting}>
                  Submit to DAO
                </NeonButton>
                <p className="text-xs text-gray-600 text-center">Your work will be reviewed by DAO voters</p>
              </div>
            )}
          </GlassCard>
        </div>
      )}
    </div>
  )
}
