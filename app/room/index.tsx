import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import React, { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import Animated, { SlideInDown, interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated';
import { defaultStyles } from '@/src/constants/Styles';
import { useRoom } from '@/src/api/rooms';
import RemoteImage from '@/src/components/RemoteImage';
import { useComments } from '@/src/api/comments';

const IMG_HEIGHT = 200;
const { width } = Dimensions.get('window');

const RoomPage = () => {
    const room = useLocalSearchParams<{id: string, name: string, image: string, description: string, created_at: string, created_by: string}>();
    const idParse = parseFloat(room.id ? room.id : '')
    const data = useComments(idParse);

    useEffect(() => {
        console.log(data);
    }, [data])

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
                <View style={{height: 3000, backgroundColor: '#fff', padding: 20}}>
                    <Text style={styles.h1}>{room.name}</Text>
                    <Text style={styles.h2}>{room.description}</Text>
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
    },
    h1: {
        fontFamily: 'mon-b',
        fontSize: 40,
    },
    h2: {
        fontFamily: 'mon-sb',
        marginTop: 10,
    }

})

export default RoomPage;