import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, Platform, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  onRetry: () => void;
}

export default function NoInternetScreen({ onRetry }: Props) {
  const openWifiSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('App-Prefs:WIFI');
    } else {
      Linking.sendIntent('android.settings.WIFI_SETTINGS');
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-8">
      <Ionicons name="wifi-outline" size={80} color="#94a3b8" />

      <Text className="text-2xl font-bold text-gray-800 mt-6 text-center"
        style={{ fontFamily: 'Poppins_700Bold' }}>
        No Internet Connection
      </Text>

      <Text className="text-base text-gray-500 mt-3 text-center"
        style={{ fontFamily: 'Poppins_400Regular' }}>
        Please connect to WiFi or enable mobile data to continue using Owvio.
      </Text>

      <TouchableOpacity
              onPress={openWifiSettings}
              className="mt-8 bg-green-500 rounded-2xl px-8 py-4 w-full items-center"
            >
              <Text className="text-white text-base"
                style={{ fontFamily: 'Poppins_600SemiBold' }}>
                Open WiFi Settings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onRetry}
              className="mt-3 border border-green-500 rounded-2xl px-8 py-4 w-full items-center"
            >
              <Text className="text-green-500 text-base"
                style={{ fontFamily: 'Poppins_600SemiBold' }}>
                Retry
              </Text>
            </TouchableOpacity>
    </View>
  );
}