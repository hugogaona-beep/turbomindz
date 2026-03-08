'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export type ListingStep = 'TYPE' | 'DETAILS' | 'PRICING' | 'PREVIEW' | 'SUBMITTING' | 'SUCCESS' | 'ERROR'

const listingSchema = z.object({
  listingType:  z.enum(['NFT_SALE', 'SERVICE', 'BUSINESS_OFFER', 'COLLABORATION']),
  title:        z.string().min(3, 'Title must be at least 3 characters').max(120),
  description:  z.string().min(10, 'Description must be at least 10 characters').max(2000),
  priceUsd:     z.number().positive().optional(),
  priceEth:     z.number().positive().optional(),
  contactEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  externalUrl:  z.string().url('Invalid URL').optional().or(z.literal('')),
  nftTokenId:   z.number().optional(),
  tags:         z.array(z.string()).default([]),
})

export type ListingFormData = z.infer<typeof listingSchema>

const STEP_ORDER: ListingStep[] = ['TYPE', 'DETAILS', 'PRICING', 'PREVIEW']

export function useListingForm() {
  const [step, setStep] = useState<ListingStep>('TYPE')
  const router          = useRouter()

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      listingType: 'SERVICE',
      title:       '',
      description: '',
      tags:        [],
    },
  })

  const currentStepIndex = STEP_ORDER.indexOf(step as any)
  const canGoBack  = currentStepIndex > 0
  const canGoNext  = currentStepIndex < STEP_ORDER.length - 1

  const goNext = useCallback(() => {
    if (canGoNext) setStep(STEP_ORDER[currentStepIndex + 1])
  }, [currentStepIndex, canGoNext])

  const goBack = useCallback(() => {
    if (canGoBack) setStep(STEP_ORDER[currentStepIndex - 1])
  }, [currentStepIndex, canGoBack])

  const submit = useCallback(async (data: ListingFormData) => {
    setStep('SUBMITTING')
    try {
      const res = await fetch('/api/listings', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create listing')
      setStep('SUCCESS')
      toast.success('Listing created!')
      setTimeout(() => router.push('/marketplace/listings'), 1500)
    } catch (e) {
      setStep('ERROR')
      toast.error('Failed to create listing. Try again.')
    }
  }, [router])

  return { form, step, setStep, goNext, goBack, canGoBack, canGoNext, submit, currentStepIndex }
}
