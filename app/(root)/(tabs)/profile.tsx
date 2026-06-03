import { useAuth, useUser } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;

export default function Profile() {
  const { signOut } = useAuth();
  const { user } = useUser();

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-6 pb-8">

          {/* Header */}
          <View className="flex-row items-center justify-between mb-5">
            <View>
              <Text className="text-slate-800 text-2xl font-extrabold tracking-tight">
                Profile
              </Text>
              <Text className="text-slate-400 text-xs mt-0.5">
                Manage your account
              </Text>
            </View>

            {user?.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <View className="w-10 h-10 rounded-full bg-green-50 border border-green-200 items-center justify-center">
                <Ionicons
                  name="person"
                  size={18}
                  color="#22c55e"
                />
              </View>
            )}
          </View>

          {/* Profile Card */}
          <View className="bg-white rounded-3xl border border-slate-200 mb-6 overflow-hidden">

            {/* Avatar */}
            <View className="items-center pt-8 pb-6 px-6">
              {user?.imageUrl ? (
                <Image
                  source={{ uri: user.imageUrl }}
                  className="w-20 h-20 rounded-full mb-3"
                />
              ) : (
                <View className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 items-center justify-center mb-3">
                  <Ionicons
                    name="person"
                    size={34}
                    color="#22c55e"
                  />
                </View>
              )}

              <Text className="text-slate-800 text-lg font-extrabold">
                {user?.fullName ?? 'User'}
              </Text>

              <Text className="text-slate-400 text-xs mt-0.5">
                {user?.primaryEmailAddress?.emailAddress ?? ''}
              </Text>

              <View className="flex-row items-center gap-1 bg-green-50 border border-green-100 rounded-full px-3 py-1 mt-3">
                <Ionicons
                  name="shield-checkmark-outline"
                  size={11}
                  color="#22c55e"
                />
                <Text className="text-green-600 text-xs font-semibold">
                  Verified Member
                </Text>
              </View>
            </View>

            <View className="border-t border-slate-100 mx-5" />

            <View className="flex-row items-center px-5 py-4">
              <View className="w-8 h-8 rounded-xl bg-slate-100 items-center justify-center mr-3">
                <Ionicons
                  name="person-outline"
                  size={14}
                  color="#94a3b8"
                />
              </View>

              <View className="flex-1">
                <Text className="text-slate-400 text-xs mb-0.5">
                  Full Name
                </Text>

                <Text className="text-slate-800 text-sm font-semibold">
                  {user?.fullName ?? '—'}
                </Text>
              </View>
            </View>

            <View className="border-t border-slate-100 mx-5" />

            <View className="flex-row items-center px-5 py-4">
              <View className="w-8 h-8 rounded-xl bg-slate-100 items-center justify-center mr-3">
                <Ionicons
                  name="mail-outline"
                  size={14}
                  color="#94a3b8"
                />
              </View>

              <View className="flex-1">
                <Text className="text-slate-400 text-xs mb-0.5">
                  Email
                </Text>

                <Text className="text-slate-800 text-sm font-semibold">
                  {user?.primaryEmailAddress?.emailAddress ?? '—'}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 20,
              marginBottom: 24,
              borderWidth: 0.5,
              borderColor: '#E2E8F0',
            }}
          >
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
              <Ionicons name="stats-chart" size={18} color="#111827" />
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginLeft: 8 }}>
                Analytics
              </Text>
            </View>
            <Text style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 20 }}>
              Real-time performance overview
            </Text>

            {/* Daily Traffic */}
            <Text style={{ fontSize: 12, fontWeight: '500', color: '#6B7280', marginBottom: 10, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              Daily Traffic
            </Text>
            <LineChart
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                datasets: [{ data: [120, 180, 150, 250, 300, 280] }],
              }}
              width={screenWidth - 64}
              height={180}
              bezier
              withInnerLines={false}
              withOuterLines={false}
              chartConfig={{
                backgroundGradientFrom: '#FFFFFF',
                backgroundGradientTo: '#FFFFFF',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(17, 24, 39, ${opacity})`,
                labelColor: () => '#9CA3AF',
                propsForDots: {
                  r: '4',
                  strokeWidth: '0',
                  fill: '#111827',
                },
              }}
              style={{ borderRadius: 0, marginLeft: -16 }}
            />

            {/* Divider */}
            <View style={{ height: 0.5, backgroundColor: '#F3F4F6', marginVertical: 20 }} />

            {/* Monthly Activity */}
            <Text style={{ fontSize: 12, fontWeight: '500', color: '#6B7280', marginBottom: 10, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              Monthly Activity
            </Text>
            <BarChart
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                datasets: [{ data: [30, 45, 28, 80, 99] }],
              }}
              width={screenWidth - 64}
              height={180}
              yAxisLabel=""
              yAxisSuffix=""
              fromZero
              withInnerLines={false}
              showBarTops={false}
              chartConfig={{
                backgroundGradientFrom: '#FFFFFF',
                backgroundGradientTo: '#FFFFFF',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(17, 24, 39, ${opacity})`,
                labelColor: () => '#9CA3AF',
                fillShadowGradient: '#111827',
                fillShadowGradientOpacity: 1,
                propsForBackgroundLines: { stroke: 'transparent' },
              }}
              style={{ borderRadius: 0, marginLeft: -16 }}
            />
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity
            className="flex-row items-center justify-between bg-white border border-slate-200 rounded-3xl px-5 py-4"
            activeOpacity={0.8}
            onPress={() =>
              Alert.alert(
                'Sign Out',
                'Are you sure you want to sign out?',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: () => signOut(),
                  },
                ]
              )
            }
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-2xl bg-red-50 border border-red-100 items-center justify-center mr-3">
                <Ionicons
                  name="log-out-outline"
                  size={18}
                  color="#ef4444"
                />
              </View>

              <View>
                <Text className="text-slate-800 font-bold text-sm">
                  Sign Out
                </Text>

                <Text className="text-slate-400 text-xs mt-0.5">
                  Logout from your account
                </Text>
              </View>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color="#cbd5e1"
            />
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}