import { StyleSheet, Text, View, ViewProps } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons'
import Animated, { AnimatedProps } from 'react-native-reanimated';

type Props = AnimatedProps<ViewProps> & {
    text: string;
}

const Alert = ({ text, ...viewProps}: Props) => {
    return (
        <Animated.View style={styles.container} {...viewProps} >
            <Feather name='info' size={20} color='red' style={{marginRight: 10}} />
            <Text style={styles.text}>{text}</Text>
        </Animated.View>
    )
}

export default Alert

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    text: {
        fontFamily: 'mon-sb',
        color: 'red',
        flex: 1,
    }
})