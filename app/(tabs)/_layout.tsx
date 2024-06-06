import React from 'react'
import { Tabs } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarLabelStyle: {
          fontFamily: 'mon-sb'
        }
      }}
    >
      <Tabs.Screen 
        name="index"
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="search" color={color} size={size}/>
          )
        }}
      />
      <Tabs.Screen 
        name="create"
        options={{
          headerTitle: 'Create New Room',
          headerTitleStyle: {fontFamily: 'mon-sb'},
          tabBarLabel: 'Create',
          tabBarIcon: ({color, size}) => (
            <AntDesign name="plussquareo" color={color} size={size}/>
          )
        }}
      />
      <Tabs.Screen 
        name="profile"
        options={{
          headerTitle: 'Profile',
          headerTitleStyle: {fontFamily: 'mon-sb'},
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="person-circle-outline" color={color} size={size}/>
          )
        }}
      />
    </Tabs>
  );
}

export default Layout;