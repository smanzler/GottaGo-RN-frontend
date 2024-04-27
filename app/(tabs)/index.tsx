import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React, { useMemo, useState } from 'react'
import { Link, Stack } from 'expo-router';

import ExploreHeader from '@/src/components/ExploreHeader';
import Rooms from '@/src/components/Rooms';
import roomsData from '@/assets/data/airbnb-listings.json';
import roomsGeoData from '@/assets/data/airbnb-listings.geo.json';
import RoomsMap from '@/src/components/RoomsMap';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/src/utils/supabase';
import { useRooms } from '@/src/api/rooms';

const Page = () => {
    const [ category, setCategory ] = useState('Gas Station');
    const items = useMemo(() => roomsData as any, [])

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
            {/* <RoomsMap rooms={rooms} /> */}

            <Rooms category={category} />
        </View>
    )
};

const styles = StyleSheet.create({
    indicatorCont: {
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0,
        zIndex: 1,
    },
})

export default Page;