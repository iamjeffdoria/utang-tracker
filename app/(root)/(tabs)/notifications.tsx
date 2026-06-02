import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNotifications } from '../../../hooks/useNotifications'

type Notification = {
  id: string
  type: string
  title: string
  message: string
  time: string
  read: boolean
}

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

const iconMap: Record<string, { name: string; color: string; bg: string }> = {
  overdue: { name: 'alert-circle', color: '#EF4444', bg: 'bg-red-50 border-red-200' },
  paid: { name: 'checkmark-circle', color: '#22C55E', bg: 'bg-green-50 border-green-200' },
  due: { name: 'time', color: '#F59E0B', bg: 'bg-amber-50 border-amber-200' },
  reminder: { name: 'notifications', color: '#F97316', bg: 'bg-orange-50 border-orange-200' },
  new: { name: 'add-circle', color: '#3B82F6', bg: 'bg-blue-50 border-blue-200' },
}

export default function Notifications() {
  const { notificationList, fetchNotifications, markRead: markReadDB, markAllRead: markAllReadDB } = useNotifications()
  useFocusEffect(
      useCallback(() => {
        fetchNotifications()
      }, [])
    )

    const [refreshing, setRefreshing] = useState(false)

    const onRefresh = useCallback(async () => {
      setRefreshing(true)
      await fetchNotifications()
      setRefreshing(false)
    }, [])
  const notifications: Notification[] = notificationList.map(n => ({
    ...n,
    read: n.read === 'true',
    time: formatRelativeTime(n.createdAt),
  }))

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => markAllReadDB()
  const markRead = (id: string) => markReadDB(id)

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-4 border-b border-slate-200">
        <View className="flex-row items-center gap-x-2">
          <Text className="text-slate-800 text-xl font-extrabold tracking-tight">
            Notifications
          </Text>
          {unreadCount > 0 && (
            <View className="bg-green-500 rounded-full px-2 py-0.5">
              <Text className="text-white text-xs font-extrabold">
                {unreadCount}
              </Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead} activeOpacity={0.7}>
            <Text className="text-green-500 text-sm font-semibold">
              Mark all read
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingVertical: 12 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#22c55e']} tintColor="#22c55e" />
        }
      >
        {notifications.length === 0 ? (
          <View className="flex-1 items-center justify-center py-24">
            <Ionicons name="notifications-off-outline" size={48} color="#CBD5E1" />
            <Text className="text-slate-400 text-sm mt-3">No notifications yet</Text>
          </View>
        ) : (
          notifications.map(n => {
            const icon = iconMap[n.type] ?? iconMap['new']
            return (
              <TouchableOpacity
                key={n.id}
                onPress={() => markRead(n.id)}
                activeOpacity={0.75}
                className={`flex-row items-start mx-4 mb-2 p-4 rounded-2xl border ${
                  n.read ? 'bg-slate-100 border-slate-200' : 'bg-white border-slate-200'
                }`}
              >
                {/* Icon */}
                <View className={`w-10 h-10 rounded-full items-center justify-center border mr-3 mt-0.5 ${icon.bg}`}>
                  <Ionicons name={icon.name as any} size={20} color={icon.color} />
                </View>

                {/* Content */}
                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-0.5">
                    <Text className={`text-sm font-bold ${n.read ? 'text-slate-400' : 'text-slate-800'}`}>
                      {n.title}
                    </Text>
                    <Text className="text-slate-400 text-xs ml-2">{n.time}</Text>
                  </View>
                  <Text className={`text-xs leading-5 ${n.read ? 'text-slate-400' : 'text-slate-500'}`}>
                    {n.message}
                  </Text>
                </View>

                {/* Unread dot */}
                {!n.read && (
                  <View className="w-2 h-2 rounded-full bg-green-500 ml-2 mt-1.5" />
                )}
              </TouchableOpacity>
            )
          })
        )}
      </ScrollView>
    </SafeAreaView>
  )
}