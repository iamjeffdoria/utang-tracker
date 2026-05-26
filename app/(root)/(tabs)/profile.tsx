import { useAuth, useUser } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
  const { signOut } = useAuth();
  const { user } = useUser();

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 px-6 pt-6">

        {/* Header */}
        <View className="items-center mb-6">
          <View className="flex-row items-center gap-2">
            <Ionicons name="person-circle-outline" size={22} color="#1e293b" />
            <Text className="text-slate-800 text-2xl font-extrabold tracking-tight">
              Profile
            </Text>
          </View>
          <Text className="text-slate-400 text-xs mt-1">
            Manage your account
          </Text>
        </View>

        {/* Profile Card */}
        <View className="bg-white rounded-3xl p-6 border border-slate-200 items-center mb-6">

          {/* Avatar */}
          {user?.imageUrl ? (
            <Image
              source={{ uri: user.imageUrl }}
              className="w-24 h-24 rounded-full mb-4"
            />
          ) : (
            <View className="w-24 h-24 rounded-full bg-green-50 border-2 border-green-200 items-center justify-center mb-4">
              <Ionicons name="person" size={40} color="#22c55e" />
            </View>
          )}

          {/* Name & Email */}
          <Text className="text-slate-800 text-xl font-extrabold">
            {user?.fullName ?? 'User'}
          </Text>
          <Text className="text-slate-400 text-sm mt-1">
            {user?.primaryEmailAddress?.emailAddress ?? ''}
          </Text>

          {/* Member Badge */}
          <View className="flex-row items-center gap-1 bg-green-50 border border-green-200 rounded-full px-3 py-1 mt-3">
            <Ionicons name="shield-checkmark-outline" size={12} color="#22c55e" />
            <Text className="text-green-600 text-xs font-semibold">Verified Member</Text>
          </View>

        </View>

        {/* Info Section */}
        <View className="bg-white rounded-3xl border border-slate-200 mb-6 overflow-hidden">

          {/* Label */}
          <View className="px-5 pt-4 pb-2">
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest">
              Account Info
            </Text>
          </View>

          {/* Full Name Row */}
          <View className="flex-row items-center px-5 py-4 border-t border-slate-100">
            <View className="w-9 h-9 rounded-2xl bg-green-50 border border-green-100 items-center justify-center mr-3">
              <Ionicons name="person-outline" size={16} color="#22c55e" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-400 text-xs mb-0.5">Full Name</Text>
              <Text className="text-slate-800 text-sm font-semibold">
                {user?.fullName ?? '—'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
          </View>

          {/* Email Row */}
          <View className="flex-row items-center px-5 py-4 border-t border-slate-100">
            <View className="w-9 h-9 rounded-2xl bg-green-50 border border-green-100 items-center justify-center mr-3">
              <Ionicons name="mail-outline" size={16} color="#22c55e" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-400 text-xs mb-0.5">Email</Text>
              <Text className="text-slate-800 text-sm font-semibold">
                {user?.primaryEmailAddress?.emailAddress ?? '—'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
          </View>

        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          className="flex-row items-center justify-center bg-red-500 rounded-2xl py-4 gap-2"
          onPress={() => signOut()}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color="white" />
          <Text className="text-white font-extrabold text-base">Sign Out</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}