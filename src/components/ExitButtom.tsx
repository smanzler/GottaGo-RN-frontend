import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import Colors from '../constants/Colors'

const ExitButtom = (props: TouchableOpacityProps) => {
    return (
        <TouchableOpacity
            style={[styles.btn, props.style]}
            {...props}
        >
            <Ionicons name="close-outline" size={30} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btn: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: '#fff',
        borderColor: Colors.grey,
        borderRadius: 30,
        width: 40,
        aspectRatio: 1,
        borderWidth: 1,
        top: 0,
        left: 0,

        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 4,
        shadowOffset: {
            width: 2,
            height: 2,
        },

        zIndex: 1,
    }
})

export default ExitButtom