import { useUser } from '@clerk/expo'
import { eq } from 'drizzle-orm'
import * as Crypto from 'expo-crypto'
import { useState } from 'react'

import { db } from '../db'
import { notifications } from '../db/schema'

export function useNotifications() {
  const { user } = useUser()
  const [notificationList, setNotificationList] = useState<typeof notifications.$inferSelect[]>([])

  const fetchNotifications = async () => {
    const result = await db
      .select()
      .from(notifications)
      .where(eq(notifications.clerkId, user!.id))
    // Sort newest first
    setNotificationList(result.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ))
  }

  const addNotification = async (params: {
    type: 'due' | 'paid' | 'overdue' | 'reminder' | 'new'
    title: string
    message: string
  }) => {
    await db.insert(notifications).values({
      id: Crypto.randomUUID(),
      clerkId: user!.id,
      type: params.type,
      title: params.title,
      message: params.message,
      read: 'false',
      createdAt: new Date().toISOString(),
    })
    await fetchNotifications()
  }

  const markRead = async (id: string) => {
    await db
      .update(notifications)
      .set({ read: 'true' })
      .where(eq(notifications.id, id))
    await fetchNotifications()
  }

  const markAllRead = async () => {
    const unread = notificationList.filter(n => n.read === 'false')
    for (const n of unread) {
      await db.update(notifications).set({ read: 'true' }).where(eq(notifications.id, n.id))
    }
    await fetchNotifications()
  }

  return {
    notificationList,
    fetchNotifications,
    addNotification,
    markRead,
    markAllRead,
  }
}