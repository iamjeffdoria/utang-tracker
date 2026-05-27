import { useOAuth } from '@clerk/expo'
import * as Linking from 'expo-linking'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { useCallback, useState } from 'react'
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native'

WebBrowser.maybeCompleteAuthSession()

export default function SignUp() {
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSignUpWithGoogle = useCallback(async () => {
    try {
      setLoading(true)
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/', { scheme: 'utangtracker' }),
      })
        if (createdSessionId) {
        await setActive!({ session: createdSessionId }) 
        }
    } catch (err) {
      console.error('OAuth error:', err)
    } finally {
      setLoading(false)
    }
  }, [startOAuthFlow])

  return (
    <View className="flex-1 bg-slate-50 items-center justify-center px-6">

      {/* Decorative blobs */}
      <View className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-green-500/10" />
      <View className="absolute -bottom-24 -left-14 w-52 h-52 rounded-full bg-blue-500/10" />

      {/* Header */}
      <View className="items-center mb-9">
       <View className="rounded-2xl bg-green-50 border border-green-200 items-center justify-center mb-4 p-4">
          <Image
            source={require('../../assets/images/owvio.png')}
            className="w-14 h-14"
            resizeMode="contain"
          />
        </View>
        <Text className="text-slate-800 text-3xl font-extrabold tracking-tight">
          Owvio
        </Text>
        <Text className="text-slate-400 text-sm mt-1.5">
          Keep tabs on who owes who.
        </Text>
      </View>

      {/* Card */}
      <View className="w-full bg-white rounded-3xl p-7 border border-slate-200">
        <Text className="text-slate-800 text-xl font-bold mb-1.5">
          Get Started
        </Text>
        <Text className="text-slate-400 text-sm leading-5 mb-7">
          Sign up for free and start tracking debts with ease.
        </Text>

        {/* Google Button */}
       <TouchableOpacity
            className={`flex-row items-center justify-center bg-green-500 rounded-2xl py-3.5 px-5 ${
              loading ? 'opacity-70' : 'opacity-100'
            }`}
            onPress={onSignUpWithGoogle}
            activeOpacity={0.85}
            disabled={loading}
          >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <>
              <Image
                source={require('../../assets/images/google.png')}
                className="w-5 h-5 mr-2.5"
                resizeMode="contain"
              />
              <Text className="text-white text-base font-semibold">
                Continue with Google
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center my-5">
          <View className="flex-1 h-px bg-slate-200" />
          <Text className="text-slate-400 text-xs mx-3">or</Text>
          <View className="flex-1 h-px bg-slate-200" />
        </View>

        {/* Sign in link */}
        <TouchableOpacity
          className="items-center"
          onPress={() => router.push('/sign-in')}
          activeOpacity={0.7}
        >
          <Text className="text-slate-400 text-sm">
            Already have an account?{' '}
            <Text className="text-green-500 font-semibold">Sign in</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text className="mt-7 text-slate-400 text-xs text-center leading-5 px-4">
        By continuing, you agree to our{' '}
        <Text className="text-slate-500 underline">Terms</Text> &amp;{' '}
        <Text className="text-slate-500 underline">Privacy Policy</Text>.
      </Text>
    </View>
  )
}