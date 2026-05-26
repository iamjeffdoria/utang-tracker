import { useUser } from '@clerk/expo'
import { eq } from 'drizzle-orm'
import * as Crypto from 'expo-crypto'
import { useState } from 'react'
import { db } from '../db'
import { debts } from '../db/schema'

export function useDebts() {
  const { user } = useUser()
  const [debtList, setDebtList] = useState<typeof debts.$inferSelect[]>([])

  const fetchDebts = async () => {
    const result = await db
      .select()
      .from(debts)
      .where(eq(debts.clerkId, user!.id))
    setDebtList(result)
  }

  const addDebt = async (params: {
    contactId: string
    amount: string
    type: 'lender' | 'borrower'
    notes?: string
    dueDate?: string
  }) => {
    await db.insert(debts).values({
      id: Crypto.randomUUID(),
      clerkId: user!.id,
      contactId: params.contactId,
      amount: params.amount,
      type: params.type,
      notes: params.notes ?? null,
      dueDate: params.dueDate ?? null,
      status: 'unpaid',
      createdAt: new Date().toISOString(),
    })
    await fetchDebts()
  }
 
  const deleteDebt = async (id: string) => {
    await db
      .delete(debts)
      .where(eq(debts.id, id))
    await fetchDebts()
  }

   const updateDebt = async (id: string, params: {
    contactId: string
    amount: string
    type: 'lender' | 'borrower'
    notes?: string
    dueDate?: string
  }) => {
    await db
      .update(debts)
      .set({
        contactId: params.contactId,
        amount: params.amount,
        type: params.type,
        notes: params.notes ?? null,
        dueDate: params.dueDate ?? null,
      })
      .where(eq(debts.id, id))
    await fetchDebts()
  }

  const markAsPaid = async (id: string) => {
  await db
    .update(debts)
    .set({ status: 'paid' })
    .where(eq(debts.id, id))
  await fetchDebts()
}

const markAsUnpaid = async (id: string) => {
  await db
    .update(debts)
    .set({ status: 'unpaid' })
    .where(eq(debts.id, id))
  await fetchDebts()
}



  return {
    debtList,
    fetchDebts,
    addDebt,
    deleteDebt,
    updateDebt,
    markAsPaid,
    markAsUnpaid,
  }
}