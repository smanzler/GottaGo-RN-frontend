import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/src/utils/supabase';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { randomUUID } from 'expo-crypto';
import { decode } from 'base64-arraybuffer';
import { defaultStyles } from '@/src/constants/Styles';
import { TextInput } from 'react-native';
import { useAuth } from '@/src/providers/AuthProvider';
import { ScrollView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import RemoteImage from '@/src/components/RemoteImage';
import { useImage } from '@/src/api/rooms';

const Edit = () => {

    const { profile, fetchProfile } = useAuth();

    const [image, setImage] = useState<string | null>(null);
    const [username, setUsername] = useState('');

    const { refetch } = useImage(`${profile.id}.png`, profile)

    const saveProfile = async () => {
        await uploadImage();

        await fetchProfile();

        await refetch();

        router.back();
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
        Alert.alert(
          'Upload Image',
          'Choose an option',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Choose from Library',
              onPress: pickImage,
            },
            {
              text: 'Take a Photo',
              onPress: takePhoto,
            },
          ],
          { cancelable: true, }
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

        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(filePath, decode(base64), { contentType, upsert: true });

        if (error) console.log(error);

        console.log(data)
        
        if (data) {
            return data.path;
        }
    };

    return (
        <ScrollView style={{flex: 1, marginTop: 100, padding: 26}}>
            <TouchableOpacity style={[defaultStyles.bubbles, styles.image]} onPress={showImagePickerOptions}>
                {image ? 
                    <Image 
                        source={{ uri: image }} 
                        style={{width: '100%', aspectRatio: 1}}
                    /> 
                    : 
                    <RemoteImage 
                        style={{ flex: 1, aspectRatio: 1 }} 
                        path={`${profile.id}.png`} 
                        profile
                    />}
            </TouchableOpacity>

            <TextInput
                    autoCapitalize="none"
                    placeholder={profile.username || 'Username'}
                    placeholderTextColor='grey'
                    value={username}
                    onChangeText={setUsername}
                    style={[defaultStyles.inputField, { marginBottom: 10 }]}
                />


            <TouchableOpacity style={defaultStyles.btn} onPress={saveProfile}>
                <Text style={defaultStyles.btnText}>Save</Text>
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