import { View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, Stack, router, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';

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

    const param = useLocalSearchParams();

    useEffect(() => {
        if (param.refetch && param.refetch.length > 0) {
            refetch();
            router.setParams({refetch: ''})
        }
    }, [param])

    const {
        data: rooms,
        error,
        isLoading,
        refetch,
    } = useRooms();

    const refetchRooms = () => {
        refetch();
    }
    
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
            <RoomsMap rooms={rooms || undefined} />

            <RoomsBottomSheet 
                rooms={rooms || []} 
                category={category} 
                refetch={refetchRooms}
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