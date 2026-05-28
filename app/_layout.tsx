import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold, useFonts } from '@expo-google-fonts/poppins';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import NoInternetScreen from '../components/NoInternetScreen';
import { runMigrations } from '../db/migrate';
import "../global.css";

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file');
}

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

useEffect(() => {
  const timeout = setTimeout(() => {
    setIsConnected(prev => prev === null ? false : prev);
  }, 3000);

  NetInfo.fetch().then((state: NetInfoState) => {
    clearTimeout(timeout);
    setIsConnected(state.isConnected);
  });

  const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
    setIsConnected(state.isConnected);
  });

  return () => {
    clearTimeout(timeout);
    unsubscribe();
  };
}, []);
  useEffect(() => {
    runMigrations().then(() => setDbReady(true)); 
  }, []);

useEffect(() => {
  if (loaded && isConnected !== null) SplashScreen.hideAsync();
}, [loaded, isConnected]);

  if (!loaded || !dbReady || isConnected === null) return null;

  // Show no internet screen while disconnected
  if (isConnected === false) {
    return (
      <NoInternetScreen onRetry={() => NetInfo.fetch().then(s => setIsConnected(s.isConnected))} />
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" translucent={false} />
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Slot />
      <Toast />
    </ClerkProvider>
    </SafeAreaProvider>
  );
}