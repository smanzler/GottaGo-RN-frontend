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

const Page = () => {
    const [ category, setCategory ] = useState('Restaurant');
    const items = useMemo(() => roomsData as any, [])

    const { 
        data: rooms, 
        error, 
        isLoading 
    } = useQuery({
        queryKey: ['rooms'],
        queryFn: async () => {
            const { data, error } = await supabase.from('rooms').select('*');
            if (error) throw new Error(error.message);

            return data;
        }
    });

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
            <RoomsMap rooms={rooms} />

            {/* <Rooms rooms={items} category={category} /> */}
        </View>
    )
};

const styles = StyleSheet.create({
    indicator: {
        position: 'absolute',
        justifyContent: 'center',
    }
})

export default Page;