import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../src/providers/AuthProvider';
import Loading from '@/src/components/Loading';
import { defaultStyles } from '@/src/constants/Styles';
import { supabase } from '@/src/utils/supabase';
import MapView, { LatLng, LongPressEvent, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useInsertRoom } from '@/src/api/rooms';
import { useLocation } from '@/src/hooks/useLocation';

const Page = () => {
    const { session } = useAuth();

    const router = useRouter();

    const mapViewRef = useRef<MapView>(null);

    const [name, setName] = useState("")
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false)
    const [createLoading, setCreateLoading] = useState(false);

    const [marker, setMarker] = useState<LatLng>()

    const { mutate: insertRoom } = useInsertRoom();

    useEffect(() => {
        useLocation(mapViewRef)
    }, [])

    const resetFields = () => {
        setName("")
        setDescription("")

        setMarker(undefined);
    }

    const onLongMapPress = (event: LongPressEvent) => {
        setMarker(event.nativeEvent.coordinate)
    }

    const onCreatePress = () => {
        setCreateLoading(true);

        insertRoom({name, description, longitude: marker?.longitude, latitude: marker?.latitude }, {
            onSuccess: () => {
                resetFields();
            },
            onSettled: () => {
                setCreateLoading(false);
                router.replace('/(tabs)/');
            }
        })
    }

    return (
        <ScrollView 
            style={styles.container}
            automaticallyAdjustKeyboardInsets={true}
        >
            
                {/* {!session ? 
                    <>
                        <Text style={defaultStyles.h2}>In Order to create, you need to Log in</Text>
                        <TouchableOpacity style={defaultStyles.btn} onPress={() => router.navigate('/(auth)/login')}>
                                <Text style={defaultStyles.btnText}>Log in</Text>
                        </TouchableOpacity>
                    </>
                    :
                    <>
                      
                    </>
                } */}

                <>
                    <Text style={[defaultStyles.h2, {marginBottom: 20}]}>Press and hold to place a marker</Text>

                    <View style={styles.mapContainer}>

                        <MapView
                            ref={mapViewRef}
                            style={styles.mapView}              
                            provider={PROVIDER_GOOGLE}
                            showsUserLocation={true}
                            followsUserLocation={true}
                            showsMyLocationButton={true}
                            onLongPress={onLongMapPress}
                        >
                            {marker && <Marker coordinate={marker}/>}
                        </MapView>
                    </View>

                    <Text style={[defaultStyles.h2, {marginBottom: 0}]}>Name</Text>

                    <TextInput
                        placeholder=""
                        value={name}
                        onChangeText={setName}
                        style={[defaultStyles.inputField, { marginBottom: 30 }]}
                    />

                    <Text style={[defaultStyles.h2, {marginBottom: 0}]}>Description</Text>

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
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 26,
    },
    mapView: {
        width: '100%',
        height: '100%',
    },
    mapContainer: {
        width: '100%',
        height: 400,
        borderRadius: 40,
        overflow: 'hidden',
        marginBottom: 50,
    }
})

export default Page;