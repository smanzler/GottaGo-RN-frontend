import { View, Text } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import MapView, { Camera, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet } from 'react-native';
import * as Location from 'expo-location'
import { useLocation } from '../hooks/useLocation';
import { TouchableOpacity } from 'react-native';

interface Props {
    name: string,
    description: string,
    rating: number,
    latitude: number,
    longitude: number,
};

const RoomsMap = ({ rooms = [] }: { rooms: any[] | undefined }) => {

    const mapViewRef = useRef<MapView>(null);

    useEffect(() => {
        useLocation(mapViewRef)
    }, []);

    const onMarkerPress = (longitude: any, latitude: any) => {
        const camera = {
            center: {
                latitude,
                longitude,
            },
            zoom: 20,
        } as Camera;
    
        mapViewRef.current?.animateCamera(camera);
    }

    return (
        <View style={styles.container}>
            <MapView
                ref={mapViewRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                followsUserLocation={true}
                showsMyLocationButton={true}
            >
                {rooms.map((room) => (
                    <Marker
                        key={room.id} 
                        onPress={() => onMarkerPress(room.longitude, room.latitude)}
                        coordinate={{
                            latitude: room.latitude,
                            longitude: room.longitude
                        }}
                    >
                        <TouchableOpacity
                            style={styles.marker}
                        >
                            <Text>{room.rating ? `${room.rating} ★`: "0 ★"}</Text>
                        </TouchableOpacity>
                    </Marker>
                ))}

            </MapView>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    marker: {
        backgroundColor: 'white',
        padding: 5,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 20,
    }
});

export default RoomsMap;