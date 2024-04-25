import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import roomsData from '@/assets/data/airbnb-listings.json';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { defaultStyles } from '@/src/constants/Styles';

const IMG_HEIGHT = 300;
const { width } = Dimensions.get('window');

const Page = () => {
    const { id } = useLocalSearchParams<{id: string}>();
    const room = (roomsData as any[]).find((item) => item.id === id);

    return (
        <View style={styles.container}>
            <Animated.ScrollView>
                <Animated.Image source={{uri: room.xl_picture_url}} style={styles.image} />
            </Animated.ScrollView>

            <Animated.View style={defaultStyles.footer} entering={SlideInDown.delay(200)}>
                
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#fff',
    },
    image: {
        height: IMG_HEIGHT  ,
        width,
    }

})

export default Page;