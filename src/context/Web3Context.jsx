import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { ethers } from 'ethers'
import SkillChainABI from '../abi/SkillChain.json'

const Web3Context = createContext(null)

export function Web3Provider({ children }) {
  const [provider, setProvider]     = useState(null)
  const [signer, setSigner]         = useState(null)
  const [contract, setContract]     = useState(null)
  const [account, setAccount]       = useState(null)
  const [chainId, setChainId]       = useState(null)
  const [profile, setProfile]       = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError]           = useState(null)

  const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || SkillChainABI.address

  const initContract = useCallback((signerOrProvider) => {
    if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
      console.warn('Contract not yet deployed. Run: npm run deploy:local')
      return null
    }
    return new ethers.Contract(CONTRACT_ADDRESS, SkillChainABI.abi, signerOrProvider)
  }, [CONTRACT_ADDRESS])

  const fetchProfile = useCallback(async (contractInstance, address) => {
    try {
      const [username, totalXP, streak, tasksCompleted, isDAO] =
        await contractInstance.getProfileBasic(address)
      setProfile({ username, totalXP: Number(totalXP), streak: Number(streak), tasksCompleted: Number(tasksCompleted), isDAO })
    } catch {
      setProfile(null)
    }
  }, [])

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError('MetaMask not found. Please install it from metamask.io')
      return
    }
    setIsConnecting(true)
    setError(null)
    try {
      const web3Provider = new ethers.BrowserProvider(window.ethereum)
      const accounts     = await web3Provider.send('eth_requestAccounts', [])
      const web3Signer   = await web3Provider.getSigner()
      const network      = await web3Provider.getNetwork()

      setProvider(web3Provider)
      setSigner(web3Signer)
      setAccount(accounts[0])
      setChainId(Number(network.chainId))

      const contractInstance = initContract(web3Signer)
      setContract(contractInstance)

      if (contractInstance) {
        await fetchProfile(contractInstance, accounts[0])
      }
    } catch (err) {
      setError(err.message || 'Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }, [initContract, fetchProfile])

  const disconnect = useCallback(() => {
    setProvider(null)
    setSigner(null)
    setContract(null)
    setAccount(null)
    setChainId(null)
    setProfile(null)
  }, [])

  const registerProfile = useCallback(async (username) => {
    if (!contract) throw new Error('Not connected')
    const tx = await contract.registerProfile(username)
    await tx.wait()
    await fetchProfile(contract, account)
    return tx
  }, [contract, account, fetchProfile])

  const refreshProfile = useCallback(async () => {
    if (contract && account) await fetchProfile(contract, account)
  }, [contract, account, fetchProfile])

  // Listen for account / chain changes
  useEffect(() => {
    if (!window.ethereum) return
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) disconnect()
      else setAccount(accounts[0])
    }
    const handleChainChanged = () => window.location.reload()

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }, [disconnect])

  return (
    <Web3Context.Provider value={{
      provider, signer, contract, account, chainId,
      profile, isConnecting, error,
      connect, disconnect, registerProfile, refreshProfile,
      isConnected: !!account,
    }}>
      {children}
    </Web3Context.Provider>
  )
}

export const useWeb3 = () => {
  const ctx = useContext(Web3Context)
  if (!ctx) throw new Error('useWeb3 must be used inside Web3Provider')
  return ctx
}
