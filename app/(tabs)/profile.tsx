import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, Switch, Settings } from 'react-native';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, router } from 'expo-router';
import { useAuth } from '../../src/providers/AuthProvider';
import { useDefaultStyles } from '@/src/constants/Styles';
import { supabase } from '@/src/utils/supabase';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RemoteImage from '@/src/components/RemoteImage';
import { useImage } from '@/src/api/rooms';
import FeedbackForm from '@/src/components/FeedbackForm';
import { useSettings } from '@/src/providers/SettingsProvider';

const ProfilePage = () => {
    const { session, profile, fetchProfile } = useAuth();
    const { theme } = useSettings();
    const defaultStyles = useDefaultStyles(theme)
    const styles: any = useMemo(() => createStyles(theme), [theme])

    const { refetch } = useImage(profile ? `${profile.id}.png` : null, profile);

    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const handleLogout = async () => {
        setLoading(true);

        await supabase.auth.signOut();

        setLoading(false);
    }

    const onRefresh = async () => {
        setRefreshing(true);

        await refetch();
        await fetchProfile();

        setRefreshing(false);
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />}
            automaticallyAdjustKeyboardInsets
        >
            {!session || !profile ?
                <>
                    <Text style={defaultStyles.h2}>In Order to see your profile, you need to Log in</Text>
                    <TouchableOpacity style={defaultStyles.btn} onPress={() => router.navigate('/(auth)/login')}>
                        <Text style={defaultStyles.btnText}>Log in</Text>
                    </TouchableOpacity>
                </>
                :
                <>
                    <View style={[defaultStyles.card]}>
                        <TouchableOpacity style={styles.editBtn} onPress={() => router.push('(modals)/editProfile')}>
                            <MaterialCommunityIcons name='circle-edit-outline' size={24} color={theme.secondary}/>
                        </TouchableOpacity>

                        <View style={styles.profilePicture}>
                            <RemoteImage
                                style={{ flex: 1, aspectRatio: 1 }}
                                path={profile ? `${profile.id}.png` : undefined}
                                profile
                            />
                        </View>
                        <Text style={styles.username}>{profile.username}</Text>
                        <Text style={styles.full_name}>{profile.full_name}</Text>
                    </View>

                    <TouchableOpacity style={defaultStyles.btn} onPress={handleLogout} disabled={loading} >
                        <Text style={defaultStyles.btnText}>{loading ? "Loggin you out..." : "Logout"}</Text>
                    </TouchableOpacity>

                </>
            }

            <TouchableOpacity style={[defaultStyles.btnOutline, {marginTop: 30}]} onPress={() => router.push('(modals)/settings')} disabled={loading} >
                <Text style={defaultStyles.btnOutlineText}>Settings</Text>
            </TouchableOpacity>

            <View
                style={{
                    flex: 1,
                    marginTop: 30,
                    borderBottomColor: 'black',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                }}
            />

            <FeedbackForm />

            <View style={{ height: 200 }} />
        </ScrollView>
    )
}

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 26,
        backgroundColor: theme.primary
    },
    profilePicture: {
        width: 150,
        aspectRatio: 1,
        borderRadius: 75,
        overflow: 'hidden',
        alignSelf: 'center',
        marginBottom: 30,
    },
    username: {
        color: theme.secondary,
        fontFamily: 'mon-sb',
        fontSize: 24,
        marginBottom: 15,
    },
    full_name: {
        color: theme.secondary,
        fontFamily: 'mon',
        fontSize: 17,
    },
    editBtn: {
        position: 'absolute',
        top: 15,
        right: 15,
        width: 35,
        aspectRatio: 1,

        alignItems: 'center',
        justifyContent: 'center',
    },
    settingsRow: {
        flex: 1,
        height: 30
    },
    settingsText: {
        fontFamily: 'mon-sb',
    }
})

export default ProfilePage;