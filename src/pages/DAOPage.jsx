import { useState } from 'react'
import { useSubmissions, useVote } from '../hooks/useContract'
import { useWeb3 } from '../context/Web3Context'
import { GlassCard, NeonButton, EmptyState, Spinner, Badge } from '../components/ui'
import { shortAddress, timeAgo, txUrl } from '../utils/helpers'

export default function DAOPage() {
  const { submissions, loading, refetch } = useSubmissions()
  const { vote, voting } = useVote()
  const { isConnected, connect, profile, chainId } = useWeb3()

  const [voting_id, setVotingId] = useState(null)
  const [lastTx, setLastTx]     = useState(null)
  const [error,  setError]      = useState('')

  const handleVote = async (submissionId, approve) => {
    setVotingId(submissionId)
    setError('')
    try {
      const tx = await vote(submissionId, approve)
      setLastTx(tx.hash)
      refetch()
    } catch (e) {
      setError(e.message)
    } finally {
      setVotingId(null)
    }
  }

  const isDAO = profile?.isDAO

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="font-display font-bold text-3xl text-white">DAO Voting</h1>
          {isDAO && <Badge color="purple">Member</Badge>}
        </div>
        <p className="text-gray-400">Review peer submissions and vote to approve or reject skill proofs</p>
      </div>

      {/* DAO Explanation */}
      {!isDAO && (
        <GlassCard className="p-5 mb-6 border-yellow-500/20 bg-yellow-500/5">
          <div className="flex gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-yellow-300 font-medium text-sm mb-1">DAO Membership Required</p>
              <p className="text-gray-400 text-sm">
                Complete at least <strong className="text-white">5 approved tasks</strong> to earn DAO voting rights.
                You currently have <strong className="text-white">{profile?.tasksCompleted ?? 0} / 5</strong> completed tasks.
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* How voting works */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: '📋', label: 'Review Proof', desc: 'Check the submitted work URI' },
          { icon: '🗳️', label: 'Cast Vote', desc: 'Approve or reject the submission' },
          { icon: '⚖️', label: '3 Votes Needed', desc: 'Majority decides the outcome' },
        ].map(({ icon, label, desc }) => (
          <GlassCard key={label} className="p-4 text-center">
            <div className="text-xl mb-1.5">{icon}</div>
            <div className="text-white text-xs font-semibold mb-1">{label}</div>
            <div className="text-gray-500 text-xs">{desc}</div>
          </GlassCard>
        ))}
      </div>

      {lastTx && (
        <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 flex items-center justify-between">
          <span>✅ Vote recorded on-chain</span>
          {chainId && (
            <a href={txUrl(lastTx, chainId)} target="_blank" rel="noreferrer"
              className="text-xs underline hover:text-emerald-300">
              🔗 View tx →
            </a>
          )}
        </div>
      )}

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      {!isConnected ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔒</div>
          <p className="text-gray-400 mb-5">Connect your wallet to access the DAO</p>
          <NeonButton onClick={connect}>Connect Wallet</NeonButton>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : submissions.length === 0 ? (
        <EmptyState
          icon="🗳️"
          title="No pending submissions"
          description="All submissions have been judged. Come back when new tasks are submitted!"
        />
      ) : (
        <div className="space-y-4">
          {submissions.map(sub => {
            const total      = sub.voteYes + sub.voteNo
            const yesPercent = total > 0 ? (sub.voteYes / total) * 100 : 0
            const isLoading  = voting_id === sub.id

            return (
              <GlassCard key={sub.id} className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      Submission #{sub.id} · Task #{sub.taskId}
                    </div>
                    <div className="text-white font-medium text-sm">
                      By <span className="text-blue-400">{shortAddress(sub.submitter)}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{timeAgo(sub.submittedAt)}</span>
                </div>

                {/* Proof link */}
                <a
                  href={sub.proofURI.startsWith('ipfs://')
                    ? `https://ipfs.io/ipfs/${sub.proofURI.replace('ipfs://', '')}`
                    : sub.proofURI}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 mb-4 break-all"
                >
                  🔗 {sub.proofURI}
                </a>

                {/* Vote tally */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span className="text-emerald-400">✓ {sub.voteYes} approve</span>
                    <span>{total}/3 votes</span>
                    <span className="text-red-400">✗ {sub.voteNo} reject</span>
                  </div>
                  <div className="h-2 w-full bg-white/8 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${yesPercent}%` }}
                    />
                  </div>
                </div>

                {/* Vote buttons */}
                {isDAO ? (
                  <div className="flex gap-3">
                    <NeonButton
                      variant="success"
                      className="flex-1"
                      onClick={() => handleVote(sub.id, true)}
                      loading={isLoading}
                    >
                      ✓ Approve
                    </NeonButton>
                    <NeonButton
                      variant="danger"
                      className="flex-1"
                      onClick={() => handleVote(sub.id, false)}
                      loading={isLoading}
                    >
                      ✗ Reject
                    </NeonButton>
                  </div>
                ) : (
                  <p className="text-xs text-gray-600 text-center">Complete 5 tasks to unlock voting</p>
                )}
              </GlassCard>
            )
          })}
        </div>
      )}
    </div>
  )
}
