import { useAuth } from '@clerk/expo'
import { eq } from 'drizzle-orm'
import * as Crypto from 'expo-crypto'
import { useEffect, useState } from 'react'
import { db } from '../db'
import { onboarding } from '../db/schema'

export function useOnboarding() {
  const { userId } = useAuth()
  const [isCompleted, setIsCompleted] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setIsLoading(false); return }

    async function check() {
      try {
        const rows = await db.select().from(onboarding).where(eq(onboarding.clerkId, userId!))
        if (rows.length === 0) {
          await db.insert(onboarding).values({
            id: Crypto.randomUUID(),
            clerkId: userId!,
            completed: 'false',
            currentStep: '0',
            createdAt: new Date().toISOString(),
          })
          setIsCompleted(false)
        } else {
          setIsCompleted(rows[0].completed === 'true')
        }
      } finally {
        setIsLoading(false)
      }
    }
    check()
  }, [userId])

  async function completeOnboarding() {
    if (!userId) return
    await db.update(onboarding).set({ completed: 'true', completedAt: new Date().toISOString() }).where(eq(onboarding.clerkId, userId))
    setIsCompleted(true)
  }

  async function saveStep(step: number) {
    if (!userId) return
    await db.update(onboarding).set({ currentStep: String(step) }).where(eq(onboarding.clerkId, userId))
  }

  return { isCompleted, isLoading, completeOnboarding, saveStep }
}