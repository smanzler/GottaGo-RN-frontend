import { View, Text, StyleSheet } from 'react-native'
import React, { useMemo, useRef } from 'react'
import BottomSheet from '@gorhom/bottom-sheet';
import Rooms from './Rooms';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

interface Props {
    rooms: any[];
    category: string;
    refetch: any;
}

const RoomsBottomSheet = ({ rooms, category, refetch }: Props) => {
    const snapPoints = useMemo(() => ['7%', '100%'], [])

    return (
        <BottomSheet
            snapPoints={snapPoints}
            index={1}
            style={styles.sheetContainer}
        >
            <View style={{ flex: 1, paddingTop: 20 }}>
                <Rooms rooms={rooms} category={category} refetch={refetch} />
            </View>
        </BottomSheet>
    )
}

const styles = StyleSheet.create({
    sheetContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 4,
        shadowOffset: {
            width: 2,
            height: 2,
        }
    }
})

export default RoomsBottomSheet