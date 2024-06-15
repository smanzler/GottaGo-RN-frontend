import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useDefaultStyles } from '../constants/Styles'
import { useSettings } from '../providers/SettingsProvider'

const ExitButtom = (props: TouchableOpacityProps) => {
    const {style, ...restProps} = props;
    const { theme } = useSettings();
    const defaultStyles = useDefaultStyles(theme)

    return (
        <TouchableOpacity
            style={[defaultStyles.circleBtn, style]}
            {...restProps}
        >
            <Ionicons name="close-outline" size={30} color={theme.secondary}/>
        </TouchableOpacity>
    )
}

export default ExitButtom