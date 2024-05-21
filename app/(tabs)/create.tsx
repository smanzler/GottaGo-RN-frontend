import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image, Alert, Modal } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../src/providers/AuthProvider';
import Loading from '@/src/components/Loading';
import { defaultStyles } from '@/src/constants/Styles';
import { supabase } from '@/src/utils/supabase';
import MapView, { Camera, LatLng, LongPressEvent, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useInsertRoom } from '@/src/api/rooms';
import { useLocation } from '@/src/hooks/useLocation';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator'
import { randomUUID } from 'expo-crypto'
import { decode } from 'base64-arraybuffer';
import Colors from '@/src/constants/Colors';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import ExitButtom from '@/src/components/ExitButtom';
const fallback = require('../../assets/images/fallback.png');

const Page = () => {
    const { session } = useAuth();

    const router = useRouter();

    const mapViewRef = useRef<MapView>(null);
    const modalMapViewRef = useRef<MapView>(null);

    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const [name, setName] = useState("")
    const [description, setDescription] = useState("");
    const [rating, setRating] = useState(0);
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false)
    const [createLoading, setCreateLoading] = useState(false);

    const [initialCamera, setInitialCamera] = useState<Camera>();

    const [marker, setMarker] = useState<LatLng>()

    const { mutate: insertRoom } = useInsertRoom();

    useEffect(() => {
        useLocation(mapViewRef);
    }, [])

    useEffect(() => {
        if (marker) {
            mapViewRef.current?.animateToRegion({
                latitude: marker.latitude,
                longitude: marker.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        }
    }, [marker])

    const resetFields = () => {
        setName("");
        setDescription("");
        setImage(null);
        setRating(0);

        setMarker(undefined);
    }

    const checkFields = () => {
        if (name === '') {
            Alert.alert('Error', 'Please add a name before creating')
            return false;
        } else if (!marker) {
            Alert.alert('Error', 'Please add a marker before creating')
            return false;
        } else {
            return true;
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

        insertRoom({ name, description, rating, longitude: marker?.longitude, latitude: marker?.latitude, image: imagePath }, {
            onSuccess: () => {
                resetFields();
                router.replace({ pathname: '/(tabs)/', params: { refetch: 't' } });
            },
            onSettled: () => {
                setCreateLoading(false);
            }
        })
    }

    const onLongMapPress = (event: LongPressEvent) => {
        setMarker(event.nativeEvent.coordinate)
    }

    const openModal = async () => {
        const camera = await mapViewRef.current?.getCamera();
        setInitialCamera(camera);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

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
                            <TouchableOpacity style={defaultStyles.bubbles} onPress={openModal}>
                                <MapView
                                    ref={mapViewRef}
                                    style={styles.mapView}
                                    pointerEvents='none'
                                    showsUserLocation={true}
                                    showsMyLocationButton={true}
                                >
                                    {marker && <Marker coordinate={marker} />}
                                </MapView>
                            </TouchableOpacity>
                        </View>

                        <View style={{ alignItems: 'center', }}>
                            <Text style={{ fontFamily: 'mon-sb' }}>Photo</Text>
                            <TouchableOpacity style={defaultStyles.bubbles} onPress={pickImage}>
                                <Image style={{ flex: 1, aspectRatio: 1 }} source={image ? { uri: image } : fallback} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={[defaultStyles.h2, { marginBottom: 0, fontFamily: 'mon-sb' }]}>Name</Text>

                    <TextInput
                        placeholder="Don't add 'bathroom' to the name"
                        placeholderTextColor='grey'
                        value={name}
                        onChangeText={setName}
                        style={[defaultStyles.inputField, { marginBottom: 30 }]}
                    />

                    <Text style={[defaultStyles.h2, { marginBottom: 0, fontFamily: 'mon-sb' }]}>Additional Information</Text>

                    <TextInput
                        placeholder="e.g. 'Smells'"
                        placeholderTextColor='grey'
                        value={description}
                        onChangeText={setDescription}
                        style={[defaultStyles.inputField, { marginBottom: 30 }]}
                    />

                    <Text style={[defaultStyles.h2, { marginBottom: 0, fontFamily: 'mon-sb', textAlign: 'center' }]}>Rating</Text>

                    <View style={styles.starContainer}>
                        {Array.from({length: 5}, (_, index) => (
                            <TouchableOpacity key={index} onPress={() => setRating(index + 1)}>
                                <Ionicons
                                    name={index < rating ? 'star' : 'star-outline'}
                                    size={40}
                                    color={index < rating ? 'gold' : 'black'}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[defaultStyles.btn, { marginTop: 10 }]}
                        onPress={onCreatePress}
                        disabled={createLoading || loading}
                    >
                        <Text style={defaultStyles.btnText}>{createLoading ? "Creating..." : "Create"}</Text>
                    </TouchableOpacity>

                    <View style={{ height: 300 }} />

                    <Modal
                        visible={modalVisible}
                        animationType='fade'
                    >
                        <ExitButtom onPress={closeModal} style={{ position: 'absolute', top: 30, left: 20 }} />
                        <TouchableOpacity style={styles.locationBtn} onPress={() => useLocation(modalMapViewRef, true)}>
                            <FontAwesome6 name='location-arrow' size={24}></FontAwesome6>
                        </TouchableOpacity>
                        <MapView
                            ref={modalMapViewRef}
                            style={styles.modalMapView}
                            showsUserLocation={true}
                            showsMyLocationButton={true}
                            onLongPress={onLongMapPress}
                            initialCamera={initialCamera}
                        >
                            {marker && <Marker draggable coordinate={marker} />}
                        </MapView>
                    </Modal>
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
    modalMapView: {
        width: '100%',
        height: '100%',
    },
    starContainer: {
        flexDirection: 'row',
        marginBottom: 30,
        justifyContent: 'center',
    },
    bubblesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    locationBtn: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        backgroundColor: '#fff',
        width: 50,
        aspectRatio: 1,
        zIndex: 1,
        padding: 13,
        borderWidth: 1,
        borderColor: Colors.grey,
        borderRadius: 24,

        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 4,
        shadowOffset: {
            width: 2,
            height: 2,
        }
    }
})

export default Page;