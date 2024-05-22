import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useContext, useState } from 'react';
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

const fallback = require('@/assets/images/fallback.png')

const Page = () => {
    const { session } = useAuth();

    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<string | null>(null);

    const handleLogout = async () => {
        setLoading(true);

        await supabase.auth.signOut();

        setLoading(false);
    }

    const saveProfilePicture = async () => {
        await pickImage();

        await uploadImage();
    }

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0,
        })
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }

    const uploadImage = async () => {
        if (!image?.startsWith('file://')) {
            return;
        }

        const { base64 } = await ImageManipulator.manipulateAsync(
            image,
            [{ resize: { width: 300, height: 300 } }],
            { base64: true, format: ImageManipulator.SaveFormat.PNG }
        )

        const filePath = `${randomUUID()}.png`;
        const contentType = 'image/png';

        if (!base64) return;

        const { data } = await supabase.storage
            .from('rooms')
            .upload(filePath, decode(base64), { contentType, upsert: true });

        if (data) {
            return data.path;
        }
    };



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
                    <TouchableOpacity style={[defaultStyles.circleBtn, styles.editBtn]} onPress={() => router.push('(modals)/edit')}>
                        <MaterialCommunityIcons name='circle-edit-outline' size={24} />
                    </TouchableOpacity>

                    <View style={styles.profilePicture}>
                        <Image style={{ flex: 1, aspectRatio: 1 }} source={image ? { uri: image } : fallback} />
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