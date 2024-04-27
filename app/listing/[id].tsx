import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { defaultStyles } from '@/src/constants/Styles';
import { useRoom } from '@/src/api/rooms';

const IMG_HEIGHT = 300;
const { width } = Dimensions.get('window');

const Page = () => {
    const { id: idString } = useLocalSearchParams<{id: string}>();
    const id = parseFloat(idString);

    console.log(id);

    const {
        data: room,
        error, 
        isLoading,
    } = useRoom(id);

    return (
        <View style={styles.container}>
            <Animated.ScrollView>
                <Animated.Image style={styles.image} />
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
        backgroundColor: 'grey'
    }

})

export default Page;