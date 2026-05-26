import { useUser } from '@clerk/expo'
import { eq } from 'drizzle-orm'
import * as Crypto from 'expo-crypto'
import { useState } from 'react'
import { db } from '../db'
import { contacts } from '../db/schema'

export function useContacts() {
  const { user } = useUser()
  const [contactList, setContactList] = useState<typeof contacts.$inferSelect[]>([])

  const addContact = async (fullName: string, lastName?: string) => {
    await db.insert(contacts).values({
      id: Crypto.randomUUID(),
      clerkId: user!.id,
      fullName,
      lastName: lastName ?? null,
      createdAt: new Date().toISOString(),
    })
    await fetchContacts()
  }

  const fetchContacts = async () => {
    const result = await db
      .select()
      .from(contacts)
      .where(eq(contacts.clerkId, user!.id))
    setContactList(result)
  }

  const deleteContact = async (id: string) => {
  await db
    .delete(contacts)
    .where(eq(contacts.id, id))

  await fetchContacts()
}

const updateContact = async (id: string, fullName: string, lastName?: string) => {
  await db
    .update(contacts)
    .set({
      fullName,
      lastName: lastName ?? null,
    })
    .where(eq(contacts.id, id))

  await fetchContacts()
}

  return {
  contactList,
  addContact,
  fetchContacts,
  deleteContact,
  updateContact,
}
}