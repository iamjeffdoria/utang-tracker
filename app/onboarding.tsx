import { useRouter } from 'expo-router'
import { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useOnboarding } from '../hooks/useOnboarding'

const STEPS = [
  {
    title: 'Track What You Owe',
    description: 'Keep track of all your debts in one place. Never forget who you owe money to.',
    emoji: '💸',
  },
  {
    title: 'Manage Your Contacts',
    description: "Add contacts and link them to debts — whether you're the lender or the borrower.",
    emoji: '👥',
  },
  {
    title: 'Get Notified',
    description: 'Receive reminders when debts are due so you always stay on top of your finances.',
    emoji: '🔔',
  },
]

export default function OnboardingScreen() {
  const [step, setStep] = useState(0)
  const { completeOnboarding, saveStep } = useOnboarding()
  const router = useRouter()
  const isLast = step === STEPS.length - 1

  async function handleNext() {
    if (isLast) {
      await completeOnboarding()
      router.replace('/(root)/(tabs)' as any)
    } else {
      const next = step + 1
      setStep(next)
      await saveStep(next)
    }
  }

  async function handleSkip() {
    await completeOnboarding()
    router.replace('/(root)/(tabs)' as any)
  }

  const current = STEPS[step]

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skip} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.emoji}>{current.emoji}</Text>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.description}>{current.description}</Text>
      </View>

      <View style={styles.dots}>
        {STEPS.map((_, i) => (
          <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>{isLast ? 'Get Started' : 'Next'}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 48,
    alignItems: 'center',
  },
  skip: { alignSelf: 'flex-end' },
  skipText: { color: '#888', fontSize: 14 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  emoji: { fontSize: 80 },
  title: { fontSize: 26, fontWeight: '700', textAlign: 'center', color: '#111' },
  description: { fontSize: 15, textAlign: 'center', color: '#555', lineHeight: 22 },
  dots: { flexDirection: 'row', gap: 8, marginBottom: 32 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ddd' },
  dotActive: { backgroundColor: '#22c55e', width: 24 },
  button: {
    backgroundColor: '#22c55e',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
})