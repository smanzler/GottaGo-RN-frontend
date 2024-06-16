import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { Dispatch, SetStateAction, useEffect, useMemo } from 'react'
import { Marker } from 'react-native-maps';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import RemoteImage from './RemoteImage';
import { Platform } from 'react-native';
import MarqueeText from 'react-native-marquee'
import { router } from 'expo-router';
import { useSettings } from '../providers/SettingsProvider';

interface Props {
    room: any;
    mapViewRef: any;
    selected: boolean;
    setSelected: Dispatch<SetStateAction<number | undefined>>;
}

const RoomMarker = ({ room, mapViewRef, selected, setSelected }: Props) => {

    const { theme } = useSettings();
    const styles = useMemo(() => createStyles(theme), [theme])

    const markerAnimatedStyle = useAnimatedStyle(() => ({
        width: withTiming(selected ? 100 : 50),
        height: withTiming(selected ? 100 : 30),
        marginBottom: Platform.OS === 'android' ? 0 : withTiming(selected ? 50 : 0),
    }));

    const ratingAnimatedStyle = useAnimatedStyle(() => ({
        top: withTiming(selected ? 73 : 0),
        left: withTiming(selected ? 45 : 0),
    }))

    const imageAnimatedStyle = useAnimatedStyle(() => ({
        height: withTiming(selected ? 70 : 0),
        width: withTiming(selected ? 90 : 0),
    }))

    const nameContainerAnimatedStyle = useAnimatedStyle(() => ({
        width: withTiming(selected ? 45 : 0)
    }))

    const onMarkerPress = () => {
        if (selected) {
            router.navigate({ pathname: 'room/', params: room })
        }
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
                style={[styles.marker, markerAnimatedStyle]}
            >
                <TouchableOpacity
                    style={{ flex: 1 }}
                >
                    <Animated.View style={[styles.rating, ratingAnimatedStyle]}>
                        <Text style={{ fontFamily: 'mon-sb', color: theme.secondary}} >{`★ ${room.rating || 0}`}</Text>
                    </Animated.View>
                    
                    <Animated.View style={[styles.name, nameContainerAnimatedStyle]}>
                        <MarqueeText
                            marqueeOnStart
                            loop
                            consecutive
                            delay={1000}
                            style={{
                                fontFamily: 'mon-sb', 
                                color: theme.secondary
                            }}
                        >
                            {room.name}
                        </MarqueeText>
                    </Animated.View>

                    <View style={styles.image}>
                        <Animated.View style={[imageAnimatedStyle, {borderRadius: 15, overflow: 'hidden'}]}>
                            <RemoteImage path={room.image} style={{flex: 1, width: '100%'}} />
                        </Animated.View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </Marker>
    )
}

const createStyles = (theme: any) => StyleSheet.create({
    marker: {
        overflow: 'visible',
        backgroundColor: theme.tint,
        borderRadius: 20,
    },
    rating: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        right: 0,
        bottom: 0,
    },
    image: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        left: 0,
        right: 0,
        top: 5,
    },
    name: {
        position: 'absolute',
        bottom: 5,
        left: 7,
        height: 18,
        overflow: 'hidden'
    }

})

export default RoomMarker;