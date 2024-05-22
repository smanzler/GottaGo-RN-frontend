import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import Colors from '../constants/Colors'
import { defaultStyles } from '../constants/Styles'

const ExitButtom = (props: TouchableOpacityProps) => {
    const {style, ...restProps} = props;

    return (
        <TouchableOpacity
            style={[defaultStyles.circleBtn, style]}
            {...restProps}
        >
            <Ionicons name="close-outline" size={30} />
        </TouchableOpacity>
    )
}

export default ExitButtom