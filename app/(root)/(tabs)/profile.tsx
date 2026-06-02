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

                        {/* Analytics */}
              <View
                className="rounded-3xl p-5 mb-6"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: '#E2E8F0',
                  shadowColor: '#8B5CF6',
                  shadowOpacity: 0.12,
                  shadowRadius: 12,
                  elevation: 6,
                }}
              >
                {/* Header */}
                <View className="flex-row items-center">
                  <Ionicons
                    name="stats-chart"
                    size={22}
                    color="#7C3AED"
                  />
                  <Text
                    className="text-lg font-bold ml-2"
                    style={{ color: '#7C3AED' }}
                  >
                    Analytics Dashboard
                  </Text>
                </View>

                <Text
                  className="text-xs mt-1 mb-5"
                  style={{ color: '#64748B' }}
                >
                  Real-time performance overview
                </Text>

                {/* Daily Traffic */}
                <View
                  style={{
                    backgroundColor: '#F5F3FF',
                    borderRadius: 20,
                    padding: 12,
                    marginBottom: 20,
                  }}
                >
                  <View className="flex-row items-center mb-3">
                    <Ionicons
                      name="trending-up"
                      size={20}
                      color="#6D28D9"
                    />
                    <Text
                      className="font-semibold ml-2"
                      style={{ color: '#6D28D9' }}
                    >
                      Daily Traffic
                    </Text>
                  </View>

                  <LineChart
                    data={{
                      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                      datasets: [
                        {
                          data: [120, 180, 150, 250, 300, 280],
                        },
                      ],
                    }}
                    width={screenWidth - 94}
                    height={220}
                    bezier
                    chartConfig={{
                      backgroundGradientFrom: '#F5F3FF',
                      backgroundGradientTo: '#EEF2FF',
                      decimalPlaces: 0,
                      color: (opacity = 1) =>
                        `rgba(139,92,246,${opacity})`,
                      labelColor: (opacity = 1) =>
                        `rgba(79,70,229,${opacity})`,
                      propsForDots: {
                        r: '6',
                        strokeWidth: '2',
                        stroke: '#A855F7',
                      },
                      propsForBackgroundLines: {
                        stroke: '#DDD6FE',
                      },
                    }}
                    style={{
                      borderRadius: 18,
                    }}
                  />
                </View>

                {/* Monthly Activity */}
                <View
                  style={{
                    backgroundColor: '#ECFDF5',
                    borderRadius: 20,
                    padding: 12,
                  }}
                >
                  <View className="flex-row items-center mb-3">
                    <Ionicons
                      name="bar-chart"
                      size={20}
                      color="#059669"
                    />
                    <Text
                      className="font-semibold ml-2"
                      style={{ color: '#059669' }}
                    >
                      Monthly Activity
                    </Text>
                  </View>

                  <BarChart
                    data={{
                      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                      datasets: [
                        {
                          data: [30, 45, 28, 80, 99],
                        },
                      ],
                    }}
                    width={screenWidth - 94}
                    height={220}
                    yAxisLabel=""
                    yAxisSuffix=""
                    fromZero
                    chartConfig={{
                      backgroundGradientFrom: '#ECFDF5',
                      backgroundGradientTo: '#D1FAE5',
                      decimalPlaces: 0,
                      color: (opacity = 1) =>
                        `rgba(16,185,129,${opacity})`,
                      labelColor: (opacity = 1) =>
                        `rgba(5,150,105,${opacity})`,
                      fillShadowGradient: '#10B981',
                      fillShadowGradientOpacity: 1,
                      propsForBackgroundLines: {
                        stroke: '#A7F3D0',
                      },
                    }}
                    style={{
                      borderRadius: 18,
                      marginTop: 4,
                    }}
                  />
                </View>
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