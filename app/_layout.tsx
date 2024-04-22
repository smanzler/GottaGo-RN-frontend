import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

import * as SecureStore from 'expo-secure-store';
import Colors from '@/constants/Colors';
import ModalHeaderText from '@/components/ModalHeaderText';
import { TouchableOpacity } from 'react-native';
import { checkToken } from './api/userApi';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    mon: require('../assets/fonts/Montserrat-Regular.ttf'),
    'mon-sb': require('../assets/fonts/Montserrat-SemiBold.ttf'),
    'mon-b': require('../assets/fonts/Montserrat-Bold.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const router = useRouter();

  const { session, loading } = useAuth();

  useEffect(() => {
    if (!session && !loading) {
      router.push('/(auth)/login')
    } else {
      console.log(session);
    }
  }, [loading])
   

  return (
    <Stack>
      <Stack.Screen
        name="(auth)/login"
        options={{
          presentation: 'modal',
          title: 'Log in or sign up',
          headerTitleStyle: {
            fontFamily: 'mon-sb',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close-outline" size={28} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="(auth)/register"
        options={{
          presentation: 'modal',
          title: 'Register',
          headerTitleStyle: {
            fontFamily: 'mon-sb',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close-outline" size={28} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="listing/[id]" options={{ headerBackTitleVisible: false, headerTitle: '', headerTransparent: true }} />
      <Stack.Screen
        name="(modals)/booking"
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerTransparent: true,
          headerTitle: (props) => <ModalHeaderText />,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: '#fff',
                borderColor: Colors.grey,
                borderRadius: 20,
                borderWidth: 1,
                padding: 4,
              }}>
              <Ionicons name="close-outline" size={22} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}