import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import React, { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import Animated, { SlideInDown, interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated';
import { defaultStyles } from '@/src/constants/Styles';
import { useRoom } from '@/src/api/rooms';
import RemoteImage from '@/src/components/RemoteImage';

const IMG_HEIGHT = 300;
const { width } = Dimensions.get('window');

const RoomPage = () => {
    const room = useLocalSearchParams<{id: string, image: string, created_at: string}>();

    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useScrollViewOffset(scrollRef);

    const imageAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: interpolate(
                    scrollOffset.value,
                    [-IMG_HEIGHT, 0, IMG_HEIGHT],
                    [-IMG_HEIGHT/2, 0, IMG_HEIGHT*0.75]
                )
            },
            {
                scale: interpolate(
                    scrollOffset.value,
                    [-IMG_HEIGHT, 0, IMG_HEIGHT],
                    [2, 1, 1]
                )
            }
        ]
    }))


    return (
        <View style={styles.container}>
            <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
                <RemoteImage path={room.image ? room.image : undefined} style={[styles.image, imageAnimatedStyle]} />
                <View style={{height: 3000, backgroundColor: '#fff'}}>
                    <Text>Parallax</Text>
                </View>
            </Animated.ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#fff',
    },
    image: {
        height: IMG_HEIGHT,
        width,
        backgroundColor: 'grey'
    }

})

export default RoomPage;