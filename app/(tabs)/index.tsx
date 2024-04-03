import { View, Text, ScrollView } from 'react-native'
import React, { useMemo, useState } from 'react'
import { Link, Stack } from 'expo-router';
import ExploreHeader from '@/components/ExploreHeader';
import Rooms from '@/components/Rooms';
import listingsData from '@/assets/data/airbnb-listings.json'

const Page = () => {
    const [ category, setCategory ] = useState('Restaurant');
    const items = useMemo(() => listingsData as any, [])

    const onDataChanged = (category: string) => {
        setCategory(category);
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'grey'}}>
            <Stack.Screen
                options={{
                    header: () => <ExploreHeader onCategoryChanged={onDataChanged} />,
                }}
            />
            <Rooms rooms={items} category={category} />
        </View>
    )
}

export default Page;