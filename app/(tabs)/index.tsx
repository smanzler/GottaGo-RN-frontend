import { View, Text, ScrollView, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Stack } from 'expo-router';

import ExploreHeader from '@/src/components/ExploreHeader';
import Rooms from '@/src/components/Rooms';
import RoomsMap from '@/src/components/RoomsMap';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/src/utils/supabase';
import RoomsBottomSheet from '@/src/components/RoomsBottomSheet';
import { useRooms } from '@/src/api/rooms';
import BottomSheet from '@gorhom/bottom-sheet';

const Page = () => {
    const [ category, setCategory ] = useState('Gas Station');
    const listRef = useRef<FlatList>(null);
    const sheetRef = useRef<BottomSheet>(null);

    const {
        data: rooms,
        error,
        isLoading,
    } = useRooms();
    
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
            <RoomsMap rooms={rooms || []} />

            <RoomsBottomSheet 
                rooms={rooms || []} 
                category={category} 
                listRef={listRef} 
                sheetRef={sheetRef}
            />
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