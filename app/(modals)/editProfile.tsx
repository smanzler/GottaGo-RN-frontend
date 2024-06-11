import { ActionSheetIOS, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/src/utils/supabase';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { decode } from 'base64-arraybuffer';
import { useDefaultStyles } from '@/src/constants/Styles';
import { TextInput } from 'react-native';
import { useAuth } from '@/src/providers/AuthProvider';
import { ScrollView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import RemoteImage from '@/src/components/RemoteImage';
import Alert from '@/src/components/Alert';
import { useImage } from '@/src/api/rooms';
import { useUpdateProfile } from '@/src/api/profiles';
import { useSettings } from '@/src/providers/SettingsProvider';

const Edit = () => {

    const { profile, fetchProfile } = useAuth();
    const { theme } = useSettings();
    const defaultStyles = useDefaultStyles(theme)

    const [image, setImage] = useState<string | null>(null);
    const [username, setUsername] = useState('');
    const [full_name, setFullname] = useState('');

    const [fullNameAlert, setFullNameAlert] = useState<string | null>(null);
    const [userNameAlert, setUserNameAlert] = useState<string | null>(null);

    const [loading, setLoading] = useState(false)

    const { refetch } = useImage(`${profile.id}.png`, profile);
    const { mutateAsync: updateProfile } = useUpdateProfile();

    const saveProfile = async () => {
        setLoading(true);
        if (await checkProfile()) {
            setLoading(false)
            return;
        }
        
        await uploadImage();
        await uploadProfile();

        await fetchProfile();

        await refetch();

        router.back();
        setLoading(false);
    }

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const showImagePickerOptions = () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Cancel', 'Choose image from library', 'Take a photo'],
                cancelButtonIndex: 0,
            },
            buttonIndex => {
                if (buttonIndex === 1) {
                    pickImage();
                } else if (buttonIndex === 2) {
                    takePhoto();
                }
            },
        );
    };

    const uploadImage = async () => {
        if (!image?.startsWith('file://')) {
            return;
        }

        console.log("uploading");

        const { base64 } = await ImageManipulator.manipulateAsync(
            image,
            [{ resize: { width: 300, height: 300 } }],
            { base64: true, format: ImageManipulator.SaveFormat.PNG }
        )

        const filePath = `${profile.id}.png`;
        const contentType = 'image/png';

        if (!base64) return;

        console.log("base is good")

        const { error } = await supabase.storage
            .from('avatars')
            .upload(filePath, decode(base64), { contentType, upsert: true });

        if (error) console.log(error);
    };

    const uploadProfile = async () => {
        if (!username && !full_name) return;

        await updateProfile({
            username: username ? username : profile.username,
            full_name: full_name ? full_name : profile.full_name,
        });
    }

    const checkProfile = async () => {
        return await checkUsername() || checkFullname()
    }

    const checkFullname = () => {
        if (!full_name) return false;

        if (full_name === profile.full_name) return false;

        if (!/^[a-zA-z\s]+$/.test(full_name)) {
            setFullNameAlert('Full name must only contain letters');
            return true;
        }

        return false;
    }

    const checkUsername = async () => {
        if (!username) {
            return false;
        }

        if (username === profile.username) return false;

        if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(username)) {
            setUserNameAlert('Username must begin with a letter and can only contain letters and numbers')
            return true;
        }

        if (username.length < 5) {
            setUserNameAlert('Username must be longer than 5 characters')
            return true;
        }

        const { data } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', username);

        if (data && data[0]) {
            setUserNameAlert('This username is already being used')
            return true;
        }

        return false;
    }

    return (
        <ScrollView style={{ flex: 1, paddingTop: 100, padding: 26, backgroundColor: '#fff' }} automaticallyAdjustKeyboardInsets>
            <TouchableOpacity style={[defaultStyles.bubbles, styles.image]} onPress={showImagePickerOptions}>
                {image ?
                    <Image
                        source={{ uri: image }}
                        style={{ width: '100%', aspectRatio: 1 }}
                    />
                    :
                    <RemoteImage
                        style={{ flex: 1, aspectRatio: 1 }}
                        path={`${profile.id}.png`}
                        profile
                    />}
            </TouchableOpacity>

            {userNameAlert && <Alert text={userNameAlert} />}

            <Text style={{ fontFamily: 'mon-sb' }}>Username</Text>

            <TextInput
                autoCapitalize="none"
                placeholder={profile.username || 'Username'}
                placeholderTextColor='grey'
                value={username}
                onChangeText={setUsername}
                style={[defaultStyles.inputField, { marginBottom: 10 }]}
            />

            {fullNameAlert && <Alert text={fullNameAlert} />}

            <Text style={{ fontFamily: 'mon-sb' }}>Full Name</Text>

            <TextInput
                autoCapitalize="none"
                placeholder={profile.full_name || 'Full Name'}
                placeholderTextColor='grey'
                value={full_name}
                onChangeText={setFullname}
                style={[defaultStyles.inputField, { marginBottom: 10 }]}
            />

            <TouchableOpacity 
                style={defaultStyles.btn} 
                onPress={saveProfile}
                disabled={loading}
            >
                <Text style={defaultStyles.btnText}>{loading ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    image: {
        backgroundColor: 'grey',
        alignSelf: 'center',
        marginBottom: 30,
    }
})

export default Edit