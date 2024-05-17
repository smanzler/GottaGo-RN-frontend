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

const RoomMarker = ({ room, mapViewRef, selected, setSelected }: Props) => {

    const animatedStyle = useAnimatedStyle(() => ({
        width: withTiming(selected ? 100 : 50),
        height: withTiming(selected ? 100 : 30),
        marginBottom: withTiming(selected ? 50 : 0),
    }));

    const textAnimatedStyle = useAnimatedStyle(() => ({
        top: withTiming(selected ? 70 : 0),
        left: withTiming(selected ? 60 : 0),
    }))

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
                    <Animated.View style={[styles.text, textAnimatedStyle]}>
                        <Text style={{ fontFamily: 'mon-sb'}} >{`★ ${room.rating || 0}`}</Text>
                    </Animated.View>
                </TouchableOpacity>
            </Animated.View>
        </Marker>
    )
}

const styles = StyleSheet.create({
    marker: {
        backgroundColor: 'white',
        borderRadius: 20,
        elevation: 4,

        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 4,
        shadowOffset: {
            width: 2,
            height: 2,
        }
    },
    text: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        right: 0,
        bottom: 0,
    }
})

export default RoomMarker;