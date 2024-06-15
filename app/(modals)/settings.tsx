import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { useSettings } from '@/src/providers/SettingsProvider';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { useUpdateSettings } from '@/src/api/settings';

const Settings = () => {
    const { filter: initialFilter, theme: initialTheme, refetch, loading } = useSettings();
    const { mutateAsync: updateSettings } = useUpdateSettings();

    const [filter, setFilter] = useState(initialFilter);
    const [theme, setTheme] = useState(initialTheme);
    const styles: any = useMemo(() => createStyles(theme), [theme]);

    const onSave = async () => {
        if (filter === initialFilter && theme === initialTheme) {
            router.back();
            return;
        }

        await updateSettings({ filter, dark_mode: theme })

        await refetch();

        router.back();
    }
    
    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerRight: () => 
                        <TouchableOpacity onPress={onSave}>
                            <Text style={{color: 'blue'}}>Save</Text>
                        </TouchableOpacity>,
                }}
            />
            <View style={styles.row}>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <AntDesign name='filter' size={24} color='blue' style={{ marginRight: 10 }} />
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'mon-sb', color: theme.secondary }}>Filter</Text>
                        <Text style={{ fontFamily: 'mon', color: theme.secondary }}>
                            This allows you to block any explicit content on the application.
                        </Text>
                    </View>
                </View>
                <Switch
                    value={filter}
                    onValueChange={() => setFilter(prev => !prev)}
                />
            </View>
            <View style={styles.row}>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <Feather name='moon' size={24} color='blue' style={{ marginRight: 10 }} />
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'mon-sb', color: theme.secondary }}>Dark Mode</Text>
                        <Text style={{ fontFamily: 'mon', color: theme.secondary }}>
                            Allows you to change the theme of the app. 
                        </Text>
                    </View>
                </View>
                <Switch
                    value={theme}
                    onValueChange={() => setTheme((prev: any) => !prev)}
                />
            </View>
        </View>
    )
}

export default Settings

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.primary,
        padding: 24,
    },
    row: {
        flexDirection: 'row',
        padding: 5,
    }
})
