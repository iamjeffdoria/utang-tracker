import { useAuth } from "@clerk/expo";
import { Redirect, Slot } from "expo-router";
import { useOnboarding } from "../../hooks/useOnboarding";

export default function RootLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const { isCompleted, isLoading } = useOnboarding();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/sign-up" />;
  if (isLoading) return null;
  if (isCompleted === false) return <Redirect href={"/onboarding" as any} />;

  return <Slot />;
}