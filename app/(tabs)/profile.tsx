import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Link, router } from 'expo-router';
import { useAuth } from '../../src/providers/AuthProvider';
import Loading from '@/src/components/Loading';
import { defaultStyles } from '@/src/constants/Styles';
import { supabase } from '@/src/utils/supabase';
import { Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { randomUUID } from 'expo-crypto';
import { decode } from 'base64-arraybuffer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RemoteImage from '@/src/components/RemoteImage';

const fallback = require('@/assets/images/fallback.png')

const Page = () => {
    const { session, profile } = useAuth();

    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);

        await supabase.auth.signOut();

        setLoading(false);
    }

    return (
        <View style={styles.container}>

            {!session ?
                <>
                    <Text style={defaultStyles.h2}>In Order to see your profile, you need to Log in</Text>
                    <TouchableOpacity style={defaultStyles.btn} onPress={() => router.navigate('/(auth)/login')}>
                        <Text style={defaultStyles.btnText}>Log in</Text>
                    </TouchableOpacity>
                </>
                :
                <>
                    <TouchableOpacity style={[defaultStyles.circleBtn, styles.editBtn]} onPress={() => router.push('(modals)/editProfile')}>
                        <MaterialCommunityIcons name='circle-edit-outline' size={24} />
                    </TouchableOpacity>

                    <View style={styles.profilePicture}>
                        <RemoteImage 
                            style={{ flex: 1, aspectRatio: 1 }} 
                            path={profile ? `${profile.id}.png` : undefined} 
                            profile
                        />
                    </View>

                    <TouchableOpacity style={defaultStyles.btn} onPress={handleLogout} disabled={loading} >
                        <Text style={defaultStyles.btnText}>{loading ? "Loggin you out..." : "Logout"}</Text>
                    </TouchableOpacity>
                </>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 26,
    },
    profilePicture: {
        width: 150,
        aspectRatio: 1,
        borderRadius: 75,
        overflow: 'hidden',
        alignSelf: 'center',
        marginBottom: 30,
    },
    editBtn: {
        position: 'absolute', 
        top: 20,
        right: 20,
    }
})

export default Page;