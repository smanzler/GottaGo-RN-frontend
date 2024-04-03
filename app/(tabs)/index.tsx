import { View, Text } from 'react-native'
import React from 'react'
import { Link, Stack } from 'expo-router';
import ExploreHeader from '@/components/ExploreHeader';
import Rooms from '@/components/Rooms'

const Page = () => {
    return (
        <View style={{ flex: 1, backgroundColor: 'grey'}}>
            <Stack.Screen
                options={{
                    header: () => <ExploreHeader />,
                }}
            />
            <Rooms />
        </View>
    )
}

export default Page;