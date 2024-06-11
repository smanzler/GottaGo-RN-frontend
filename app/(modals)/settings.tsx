import { StyleSheet, Switch, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSettings } from '@/src/providers/SettingsProvider';
import { AntDesign } from '@expo/vector-icons';

const Settings = () => {
    const { filter: initialFilter } = useSettings();

    const [filter, setFilter] = useState(initialFilter)
    
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <AntDesign name='filter' size={24} color='blue' style={{ marginRight: 10 }} />
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'mon-sb' }}>Filter</Text>
                        <Text style={{ fontFamily: 'mon' }}>
                            This allows you to block any explicit content on the application.
                        </Text>
                    </View>
                </View>
                <Switch
                    value={filter}
                    onValueChange={() => setFilter(prev => !prev)}
                />
            </View>
        </View>
    )
}

export default Settings

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 24,
    },
    row: {
        flexDirection: 'row',
        padding: 5,
    }
})
