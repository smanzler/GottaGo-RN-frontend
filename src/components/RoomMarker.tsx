import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { Marker } from 'react-native-maps';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

interface Props {
    room: any;
    mapViewRef: any;
    selected: boolean; 
    setSelected: Dispatch<SetStateAction<number | undefined>>;
}

const RoomMarker = ({room, mapViewRef, selected, setSelected}: Props) => {

    const width = useSharedValue(50);
    const height = useSharedValue(30);

    const animatedStyle = useAnimatedStyle(() => {
        return {
          width: selected ? withSpring(100) : withSpring(50),
          height: selected ? withSpring(100) : withTiming(30),
        };
      }, [selected]);

    const onMarkerPress = () => {
        setSelected(room.id)

        mapViewRef.current?.animateToRegion({
            longitude: room.long,
            latitude: room.lat,
            longitudeDelta: 0.003,
            latitudeDelta: 0.003,
        }, 300);
    }

    return (
        <Marker
            onPress={() => onMarkerPress()}
            coordinate={{
                latitude: room.lat,
                longitude: room.long
            }}
            style={{
                overflow: 'visible'
            }}
        >
            <Animated.View
                style={[styles.marker, animatedStyle]}
            >
                <TouchableOpacity
                    style={{ flex: 1 }}
                >
                    <Text>{`★ ${room.rating || 0}`}</Text>
                </TouchableOpacity>
            </Animated.View>
        </Marker>
    )
}

const styles = StyleSheet.create({
    marker: {
        backgroundColor: 'white',
        padding: 5,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 20,
    },
    markerSelected: {
        backgroundColor: '#fff',
        padding: 5,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 20,  
    },
})

export default RoomMarker;