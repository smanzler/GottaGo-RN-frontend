import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/src/utils/supabase';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { randomUUID } from 'expo-crypto';
import { decode } from 'base64-arraybuffer';
import { defaultStyles } from '@/src/constants/Styles';
import { TextInput } from 'react-native';
import { useAuth } from '@/src/providers/AuthProvider';
import { ScrollView } from 'react-native-gesture-handler';

const Edit = () => {

    const { profile } = useAuth();

    const [image, setImage] = useState<string | null>(null);
    const [username, setUsername] = useState('');

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
        <ScrollView style={{flex: 1, marginTop: 100, padding: 26}}>
            <TouchableOpacity style={[defaultStyles.bubbles, styles.image]} onPress={pickImage}>
                {image && <Image source={{ uri: image }} style={{width: '100%', aspectRatio: 1}}/>}
            </TouchableOpacity>

            <TextInput
                    autoCapitalize="none"
                    placeholder={profile.username || 'Username'}
                    placeholderTextColor='grey'
                    value={username}
                    onChangeText={setUsername}
                    style={[defaultStyles.inputField, { marginBottom: 10 }]}
                />


            <TouchableOpacity style={defaultStyles.btn} >
                <Text style={defaultStyles.btnText}>Save</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default Edit

const styles = StyleSheet.create({
    image: {
        backgroundColor: 'grey', 
        alignSelf: 'center', 
        marginBottom: 30,
    }
})