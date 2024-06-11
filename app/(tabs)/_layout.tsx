import React from 'react'
import { Tabs } from 'expo-router';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSettings } from '@/src/providers/SettingsProvider';

const Layout = () => {
  const { theme } = useSettings();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarLabelStyle: {
          fontFamily: 'mon-sb'
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: 'Find A Room',
          headerTitleStyle: { fontFamily: 'mon-sb' },
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          )
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          headerTitle: 'Create New Room',
          headerTitleStyle: { fontFamily: 'mon-sb' },
          tabBarLabel: 'Create',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="plussquareo" color={color} size={size} />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: 'Profile',
          headerTitleStyle: { fontFamily: 'mon-sb' },
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" color={color} size={size} />
          )
        }}
      />
    </Tabs>
  );
}

export default Layout;