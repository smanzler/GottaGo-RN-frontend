import { View, Text } from 'react-native'
import React, { useMemo, useRef } from 'react'
import BottomSheet from '@gorhom/bottom-sheet';
import Rooms from './Rooms';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

interface Props {
    rooms: any[];
    category: string;
}

const RoomsBottomSheet = ({ rooms, category }: Props) => {
    const snapPoints = useMemo(() => ['10%', '100%'], [])

    return (
        <BottomSheet
            snapPoints={snapPoints}
        >
            <View style={{ flex: 1, paddingTop: 20 }}>
                <Rooms rooms={rooms} category={category}/>
            </View>
        </BottomSheet>
    )
}

export default RoomsBottomSheet