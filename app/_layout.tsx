import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold, useFonts } from '@expo-google-fonts/poppins';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { runMigrations } from '../db/migrate';

import "../global.css";

SplashScreen.preventAutoHideAsync()

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}
export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false)
  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  })

  useEffect(() => {
      runMigrations().then(() => setDbReady(true))
    }, [])

    useEffect(() => {
      if (loaded) SplashScreen.hideAsync()
    }, [loaded])

    if (!loaded || !dbReady) return null

   return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Slot />
      <Toast />
    </ClerkProvider>
  )
}