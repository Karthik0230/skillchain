import { useState, useCallback, useEffect } from 'react'
import { ethers } from 'ethers'
import { useWeb3 } from '../context/Web3Context'

// ─── useTasks ────────────────────────────────────────────────────────────────

export function useTasks() {
  const { contract } = useWeb3()
  const [tasks, setTasks]   = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)

  const fetchTasks = useCallback(async () => {
    if (!contract) return
    setLoading(true)
    try {
      const raw = await contract.getActiveTasks()
      const parsed = raw.map(t => ({
        id:          Number(t.id),
        title:       t.title,
        description: t.description,
        skillTag:    t.skillTag,
        difficulty:  Number(t.difficulty),
        reward:      ethers.formatEther(t.reward),
        creator:     t.creator,
        isActive:    t.isActive,
        createdAt:   new Date(Number(t.createdAt) * 1000),
      }))
      setTasks(parsed)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [contract])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  return { tasks, loading, error, refetch: fetchTasks }
}

// ─── useSubmitTask ────────────────────────────────────────────────────────────

export function useSubmitTask() {
  const { contract, refreshProfile } = useWeb3()
  const [submitting, setSubmitting] = useState(false)
  const [txHash, setTxHash]         = useState(null)
  const [error, setError]           = useState(null)

  const submit = useCallback(async (taskId, proofURI) => {
    if (!contract) throw new Error('Not connected')
    setSubmitting(true)
    setError(null)
    try {
      const tx = await contract.submitTask(taskId, proofURI)
      setTxHash(tx.hash)
      await tx.wait()
      await refreshProfile()
      return tx
    } catch (err) {
      setError(err.reason || err.message)
      throw err
    } finally {
      setSubmitting(false)
    }
  }, [contract, refreshProfile])

  return { submit, submitting, txHash, error }
}

// ─── useVote ─────────────────────────────────────────────────────────────────

export function useVote() {
  const { contract } = useWeb3()
  const [voting, setVoting] = useState(false)
  const [error, setError]   = useState(null)

  const vote = useCallback(async (submissionId, approve) => {
    if (!contract) throw new Error('Not connected')
    setVoting(true)
    setError(null)
    try {
      const tx = await contract.vote(submissionId, approve)
      await tx.wait()
      return tx
    } catch (err) {
      setError(err.reason || err.message)
      throw err
    } finally {
      setVoting(false)
    }
  }, [contract])

  return { vote, voting, error }
}

// ─── useSubmissions ──────────────────────────────────────────────────────────

export function useSubmissions() {
  const { contract } = useWeb3()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading]         = useState(false)

  const fetchSubmissions = useCallback(async () => {
    if (!contract) return
    setLoading(true)
    try {
      const raw = await contract.getPendingSubmissions()
      const parsed = raw.map(s => ({
        id:          Number(s.id),
        taskId:      Number(s.taskId),
        submitter:   s.submitter,
        proofURI:    s.proofURI,
        voteYes:     Number(s.voteYes),
        voteNo:      Number(s.voteNo),
        judged:      s.judged,
        approved:    s.approved,
        submittedAt: new Date(Number(s.submittedAt) * 1000),
      }))
      setSubmissions(parsed)
    } finally {
      setLoading(false)
    }
  }, [contract])

  useEffect(() => { fetchSubmissions() }, [fetchSubmissions])

  return { submissions, loading, refetch: fetchSubmissions }
}

// ─── useCreateTask ────────────────────────────────────────────────────────────

export function useCreateTask() {
  const { contract } = useWeb3()
  const [creating, setCreating] = useState(false)
  const [error, setError]       = useState(null)

  const createTask = useCallback(async ({ title, description, skillTag, difficulty, rewardEth }) => {
    if (!contract) throw new Error('Not connected')
    setCreating(true)
    setError(null)
    try {
      const value = ethers.parseEther(rewardEth?.toString() || '0')
      const tx = await contract.createTask(title, description, skillTag, difficulty, { value })
      await tx.wait()
      return tx
    } catch (err) {
      setError(err.reason || err.message)
      throw err
    } finally {
      setCreating(false)
    }
  }, [contract])

  return { createTask, creating, error }
}
