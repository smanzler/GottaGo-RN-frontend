import { View, Text } from 'react-native'
import React, { useMemo, useRef } from 'react'
import BottomSheet from '@gorhom/bottom-sheet';
import Rooms from './Rooms';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

interface Props {
    rooms: any[];
    category: string;
    listRef: any;
    sheetRef: React.RefObject<BottomSheetMethods>
}

const RoomsBottomSheet = ({ rooms, category,listRef, sheetRef }: Props) => {
    const snapPoints = useMemo(() => ['10%', '100%'], [])

    return (
        <BottomSheet
            ref={sheetRef}
            snapPoints={snapPoints}
        >
            <View style={{ flex: 1, paddingTop: 20 }}>
                <Rooms rooms={rooms} category={category} listRef={listRef}/>
            </View>
        </BottomSheet>
    )
}

export default RoomsBottomSheet