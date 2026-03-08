'use client'

import { useAccount, useConnect, useDisconnect, useSignMessage, useChainId } from 'wagmi'
import { useSession, signIn, signOut } from 'next-auth/react'
import { SiweMessage } from 'siwe'
import { useState, useCallback } from 'react'

export type WalletState = 'disconnected' | 'connecting' | 'signing' | 'verifying' | 'authenticated' | 'error'

export function useWallet() {
  const { address, isConnected } = useAccount()
  const { connectAsync, connectors } = useConnect()
  const { disconnect }               = useDisconnect()
  const { signMessageAsync }         = useSignMessage()
  const { data: session }            = useSession()
  const chainId                      = useChainId()
  const [state, setState]            = useState<WalletState>('disconnected')
  const [error, setError]            = useState<string | null>(null)

  const signInWithEthereum = useCallback(async () => {
    if (!address) return
    setState('signing')
    setError(null)

    try {
      const { nonce } = await fetch('/api/auth/nonce').then(r => r.json())

      const message = new SiweMessage({
        domain:    window.location.host,
        address,
        statement: 'Sign in to TURBOMINDZ.',
        uri:       window.location.origin,
        version:   '1',
        chainId,
        nonce,
      })

      const signature = await signMessageAsync({ message: message.prepareMessage() })
      setState('verifying')

      const result = await signIn('siwe', {
        message:   JSON.stringify(message),
        signature,
        redirect:  false,
      })

      if (result?.error) {
        setState('error')
        setError('Verification failed.')
      } else {
        setState('authenticated')
      }
    } catch (e: any) {
      setState('error')
      setError(e?.code === 4001 ? 'Signature rejected.' : 'Sign-in failed.')
    }
  }, [address, chainId, signMessageAsync])

  const handleDisconnect = useCallback(() => {
    disconnect()
    signOut({ redirect: false })
    setState('disconnected')
  }, [disconnect])

  return {
    address,
    isConnected,
    isAuthenticated: !!session,
    session,
    state,
    error,
    walletAddress: session?.user?.walletAddress || address,
    signInWithEthereum,
    disconnect: handleDisconnect,
  }
}
