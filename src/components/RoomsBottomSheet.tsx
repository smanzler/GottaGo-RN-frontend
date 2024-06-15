import { View, Text, StyleSheet } from 'react-native'
import React, { useMemo, useRef } from 'react'
import BottomSheet from '@gorhom/bottom-sheet';
import Rooms from './Rooms';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useSettings } from '../providers/SettingsProvider';

interface Props {
    rooms: any[];
    category: string;
    refetch: any;
}

const RoomsBottomSheet = ({ rooms, category, refetch }: Props) => {
    const { theme } = useSettings();
    const styles = useMemo(() => createStyles(theme), [theme])

    const snapPoints = useMemo(() => ['7%', '100%'], []);

    return (
        <BottomSheet
            snapPoints={snapPoints}
            index={1}
            backgroundStyle={{backgroundColor: theme.primary}}
            handleIndicatorStyle={{backgroundColor: theme.secondary}}
            style={styles.sheetContainer}
        >
            <View style={{ flex: 1, paddingTop: 20, backgroundColor: theme.primary }}>
                <Rooms rooms={rooms} category={category} refetch={refetch} />
            </View>
        </BottomSheet>
    )
}

const createStyles = (theme: any) => StyleSheet.create({
    sheetContainer: {
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