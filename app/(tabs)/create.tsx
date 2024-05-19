import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image, Alert } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../src/providers/AuthProvider';
import Loading from '@/src/components/Loading';
import { defaultStyles } from '@/src/constants/Styles';
import { supabase } from '@/src/utils/supabase';
import MapView, { LatLng, LongPressEvent, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useInsertRoom } from '@/src/api/rooms';
import { useLocation } from '@/src/hooks/useLocation';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator'
import { randomUUID } from 'expo-crypto'
import { decode } from 'base64-arraybuffer';
import Colors from '@/src/constants/Colors';
const fallback = require('../../assets/images/fallback.png');

const Page = () => {
    const { session } = useAuth();

    const router = useRouter();

    const mapViewRef = useRef<MapView>(null);

    const [name, setName] = useState("")
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false)
    const [createLoading, setCreateLoading] = useState(false);

    const [marker, setMarker] = useState<LatLng>()

    const { mutate: insertRoom } = useInsertRoom();

    useEffect(() => {
        useLocation(mapViewRef)
    }, [])

    const resetFields = () => {
        setName("");
        setDescription("");
        setImage(null);

        setMarker(undefined);
    }

    const checkFields = () => {
        if (name === '') {
            Alert.alert('Error', 'Please add a name before creating')
            return false;
        } else if (description === '') {
            Alert.alert('Error', 'Please add a description before creating')
        }
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

        const base64 = await ImageManipulator.manipulateAsync(
            image,
            [{ resize: { width: 300, height: 300 } }],
            { base64: true, format: ImageManipulator.SaveFormat.PNG }
        )

        const filePath = `${randomUUID()}.png`;
        const contentType = 'image/png';

        if (!base64.base64) return;

        const { data, error } = await supabase.storage
            .from('rooms')
            .upload(filePath, decode(base64.base64), { contentType });

        if (data) {
            return data.path;
        }
    };

    const onCreatePress = async () => {
        if (!checkFields()) return;

        setCreateLoading(true);

        const imagePath = await uploadImage();

        insertRoom({ name, description, longitude: marker?.longitude, latitude: marker?.latitude, image: imagePath }, {
            onSuccess: () => {
                resetFields();
                router.replace({ pathname: '/(tabs)/', params: { refetch: 't' } });
            },
            onSettled: () => {
                setCreateLoading(false);
            }
        })
    }

    return (
        <ScrollView
            style={styles.container}
            automaticallyAdjustKeyboardInsets={true}
        >
            {!session ?
                <>
                    <Text style={defaultStyles.h2}>In Order to create, you need to Log in</Text>
                    <TouchableOpacity style={defaultStyles.btn} onPress={() => router.navigate('/(auth)/login')}>
                        <Text style={defaultStyles.btnText}>Log in</Text>
                    </TouchableOpacity>
                </>
                :
                <>
                    <Text style={[defaultStyles.h2, { marginBottom: 20 }]}>Press the map or image to add to the room</Text>

                    <View style={styles.bubblesContainer}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'mon-sb' }}>Location</Text>
                            <View style={styles.bubbles}>
                                <MapView
                                    ref={mapViewRef}
                                    style={styles.mapView}
                                    showsUserLocation={true}
                                    showsMyLocationButton={true}
                                    onPress={() => router.push('(modals)/createMap')}
                                >
                                    {marker && <Marker coordinate={marker} />}
                                </MapView>
                            </View>
                        </View>

                        <View style={{ alignItems: 'center', }}>
                            <Text style={{ fontFamily: 'mon-sb' }}>Photo</Text>
                            <TouchableOpacity style={styles.bubbles} onPress={pickImage}>
                                <Image style={{ flex: 1, aspectRatio: 1 }} source={image ? { uri: image } : fallback} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={[defaultStyles.h2, { marginBottom: 0 }]}>Name</Text>

                    <TextInput
                        placeholder=""
                        value={name}
                        onChangeText={setName}
                        style={[defaultStyles.inputField, { marginBottom: 30 }]}
                    />

                    <Text style={[defaultStyles.h2, { marginBottom: 0 }]}>Description</Text>

                    <TextInput
                        placeholder=""
                        value={description}
                        onChangeText={setDescription}
                        style={[defaultStyles.inputField, { marginBottom: 30 }]}
                    />

                    <TouchableOpacity
                        style={[defaultStyles.btn, { marginTop: 10 }]}
                        onPress={onCreatePress}
                        disabled={createLoading || loading}
                    >
                        <Text style={defaultStyles.btnText}>{createLoading ? "Creating..." : "Create"}</Text>
                    </TouchableOpacity>

                    <View style={{ height: 300 }} />
                </>
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 26,
    },
    mapView: {
        width: 200,
        height: 200,
    },
    bubbles: {
        width: 150,
        aspectRatio: 1,
        borderRadius: 15,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center'
    },
    bubblesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    }
})

export default Page;