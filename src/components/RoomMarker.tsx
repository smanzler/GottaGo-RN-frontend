import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Marker } from 'react-native-maps';
import Animated from 'react-native-reanimated';

interface Props {
    room: any;
    selected: boolean; 
    mapViewRef: any;
}

const RoomMarker = ({room, selected, mapViewRef}: Props) => {

    const onMarkerPress = (longitude: any, latitude: any, id: number) => {

        mapViewRef.current?.animateToRegion({
            longitude,
            latitude,
            longitudeDelta: 0.003,
            latitudeDelta: 0.003,
        }, 300);
    }

    return (
        <Marker
            onPress={() => onMarkerPress(room.long, room.lat, room.id)}
            coordinate={{
                latitude: room.lat,
                longitude: room.long
            }}
        >
            <Animated.View
                style={selected !== room.id  ? styles.marker : [styles.markerSelected, {width: length}]}
            >
                <TouchableOpacity
                    style={{ flex: 1 }}
                    >
                    <Text>{room.rating ? `★${room.rating}` : "★0"}</Text>
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
        width: 45
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