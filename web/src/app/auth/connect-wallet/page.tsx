'use client'

import { useState, useEffect } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { SiweMessage } from 'siwe'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Zap, Shield, CheckCircle2, Loader2 } from 'lucide-react'

type Step = 'CONNECT' | 'SIGN' | 'VERIFYING' | 'DONE' | 'ERROR'

export default function ConnectWalletPage() {
  const { address, isConnected } = useAccount()
  const { signMessageAsync }     = useSignMessage()
  const { data: session }        = useSession()
  const router                   = useRouter()
  const searchParams             = useSearchParams()
  const callbackUrl              = searchParams.get('callbackUrl') || '/dashboard/vault'

  const [step, setStep]   = useState<Step>('CONNECT')
  const [error, setError] = useState('')

  // Auto-advance when wallet connects
  useEffect(() => {
    if (isConnected && step === 'CONNECT') setStep('SIGN')
  }, [isConnected])

  // Redirect when authenticated
  useEffect(() => {
    if (session) router.push(callbackUrl)
  }, [session])

  const handleSign = async () => {
    if (!address) return
    setStep('SIGN')
    setError('')

    try {
      const nonceRes = await fetch('/api/auth/nonce')
      const { nonce } = await nonceRes.json()

      const message = new SiweMessage({
        domain:    window.location.host,
        address,
        statement: 'Sign in to TURBOMINDZ — Own The Philosophy.',
        uri:       window.location.origin,
        version:   '1',
        chainId:   1,
        nonce,
      })

      const signature = await signMessageAsync({ message: message.prepareMessage() })
      setStep('VERIFYING')

      const result = await signIn('siwe', {
        message:   JSON.stringify(message),
        signature,
        redirect:  false,
      })

      if (result?.error) {
        setError('Verification failed. Please try again.')
        setStep('SIGN')
      } else {
        setStep('DONE')
      }
    } catch (e: any) {
      if (e.code === 4001) {
        setError('Signature rejected.')
      } else {
        setError('Something went wrong. Please try again.')
      }
      setStep('SIGN')
    }
  }

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        {/* Card */}
        <div className="p-8 rounded-2xl bg-midnight border border-border">

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="p-4 rounded-2xl bg-electric/10 border border-electric/20">
              <Zap size={32} className="text-electric" />
            </div>
          </div>

          <h1 className="font-display text-h3 font-light text-center mb-2">
            Enter TURBOMINDZ
          </h1>
          <p className="text-muted text-sm text-center font-body mb-8">
            Connect your wallet to verify NFT ownership and access your vault.
          </p>

          {/* Steps Indicator */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {(['CONNECT', 'SIGN', 'DONE'] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === s || (step === 'VERIFYING' && s === 'SIGN') || step === 'DONE' && s !== 'CONNECT' && s !== 'SIGN'
                    ? 'bg-electric text-obsidian'
                    : 'bg-void border border-border text-muted'
                }`}>
                  {step === 'DONE' && s === 'DONE' ? <CheckCircle2 size={14} /> : i + 1}
                </div>
                {i < 2 && <div className="w-8 h-px bg-border" />}
              </div>
            ))}
          </div>

          {/* Action Area */}
          <div className="space-y-4">
            {!isConnected ? (
              <div className="flex justify-center">
                <ConnectButton label="Connect Wallet" />
              </div>
            ) : step === 'SIGN' ? (
              <button
                onClick={handleSign}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-electric text-obsidian font-semibold text-sm hover:bg-electric/90 transition-colors"
              >
                <Shield size={16} />
                Sign Message to Verify
              </button>
            ) : step === 'VERIFYING' ? (
              <div className="flex items-center justify-center gap-3 py-4 text-muted">
                <Loader2 size={18} className="animate-spin text-electric" />
                <span className="text-sm font-body">Verifying ownership...</span>
              </div>
            ) : step === 'DONE' ? (
              <div className="flex items-center justify-center gap-3 py-4 text-green-400">
                <CheckCircle2 size={18} />
                <span className="text-sm font-body">Verified. Redirecting...</span>
              </div>
            ) : null}

            {error && (
              <p className="text-center text-sm text-error font-body">{error}</p>
            )}
          </div>

          <p className="mt-6 text-xs text-muted text-center font-body leading-relaxed">
            By signing, you agree to our{' '}
            <a href="/legal/terms" className="text-electric hover:underline">Terms</a>{' '}
            and{' '}
            <a href="/legal/privacy" className="text-electric hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
