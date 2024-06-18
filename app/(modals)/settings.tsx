import { Modal, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { useSettings } from '@/src/providers/SettingsProvider';
import { AntDesign, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { useQuerySettings, useUpdateSettings } from '@/src/api/settings';
import { useAuth } from '@/src/providers/AuthProvider';
import { useDefaultStyles } from '@/src/constants/Styles';
import { supabase } from '@/src/utils/supabase';

const Settings = () => {
    const { profile, session, signOut } = useAuth();
    const { filter: initialFilter, theme: initialTheme, setFilter: setGlobalFilter, setTheme: setGlobalTheme } = useSettings();
    const { refetch } = useQuerySettings();

    const { mutateAsync: updateSettings } = useUpdateSettings();

    const [filter, setFilter] = useState(initialFilter);
    const [theme, setTheme] = useState(initialTheme.isDark);
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false)

    const defaultStyles = useDefaultStyles(theme);
    const styles: any = useMemo(() => createStyles(initialTheme), [initialTheme]);

    const onSave = async () => {
        if (filter === initialFilter && theme === initialTheme) {
            router.back();
            return;
        }
        setLoading(true)

        await updateSettings({ filter, dark_mode: theme });
        await refetch();
        setGlobalFilter(filter);
        setGlobalTheme(theme);

        router.back();

        setLoading(false);
    }

    const onDelete = async () => {
        setDeleteLoading(true);

        const data = await supabase.rpc('delete_user')

        console.log(data);

        signOut();

        setModalVisible(false)
        
        router.back();


        setDeleteLoading(false);
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerRight: () =>
                        <TouchableOpacity onPress={onSave}>
                            <Text style={{ color: 'blue' }}>{loading ? 'Saving...' : 'Save'}</Text>
                        </TouchableOpacity>,
                }}
            />
            <View style={styles.row}>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <AntDesign name='filter' size={24} color='blue' style={{ marginRight: 10 }} />
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'mon-sb', color: initialTheme.secondary }}>Filter</Text>
                        <Text style={{ fontFamily: 'mon', color: initialTheme.secondary }}>
                            This allows you to block any explicit content on the application.
                        </Text>
                    </View>
                </View>
                <Switch
                    value={filter}
                    onValueChange={setFilter}
                />
            </View>
            <View style={styles.row}>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <Feather name='moon' size={24} color='blue' style={{ marginRight: 10 }} />
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'mon-sb', color: initialTheme.secondary }}>Dark Mode</Text>
                        <Text style={{ fontFamily: 'mon', color: initialTheme.secondary }}>
                            Allows you to change the theme of the app.
                        </Text>
                    </View>
                </View>
                <Switch
                    value={theme}
                    onValueChange={setTheme}
                />
            </View>

            {session && profile &&
                <TouchableOpacity style={[defaultStyles.btnOutline, { marginTop: 30, borderColor: 'red' }]} onPress={() => setModalVisible(true)}>
                    <Text style={[defaultStyles.btnOutlineText, { color: 'red' }]}>Delete Profile</Text>
                </TouchableOpacity>
            }

            <Modal
                transparent
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer} >
                        <TouchableOpacity style={styles.exitBtn} onPress={() => setModalVisible(false)}>
                            <Ionicons name="close-outline" size={28} color={theme.secondary} />
                        </TouchableOpacity>

                        <Text style={styles.header}>Are you sure you want to delete your profile?</Text>

                        <TouchableOpacity
                            style={{ flexDirection: 'row', gap: 7, alignItems: 'center' }}
                            onPress={onDelete}
                            disabled={deleteLoading}
                        >
                            <Text style={styles.modalText}>{deleteLoading ? 'Delete...' : 'Delete'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalContainer: {
        width: '80%',
        padding: 20,
        backgroundColor: theme.tint,
        borderRadius: 10,
        alignItems: 'center',
    },
    header: {
        color: theme.secondary,
        fontFamily: 'mon',
        fontSize: 18,
        marginBottom: 60,
        width: 180,
        textAlign: 'center',
    },
    modalText: {
        color: 'red',
        fontFamily: 'mon-sb',
        fontSize: 18,
        marginBottom: 20,
    },
    exitBtn: { 
        position: 'absolute',
        top: 10, 
        left: 10,

        width: 35, 
        aspectRatio: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    }
})
