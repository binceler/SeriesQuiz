import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import SplashScreen from '../components/SplashScreen';
export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashComplete = () => {
    setShowSplash(false);
  };
  if (showSplash) {
    return (
      <>
        <SplashScreen onAnimationComplete={handleSplashComplete} />
        <StatusBar style="light" />
      </>
    );
  }
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="quiz" />
        <Stack.Screen name="results" />
        <Stack.Screen name="history" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}